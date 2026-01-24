-- Parent Mode System
-- Migration: Hệ thống chế độ Phụ huynh cho tài khoản Học sinh
-- Mô hình mới: 1 tài khoản có 2 chế độ (Bé học + Phụ huynh)

-- =============================================
-- PHẦN 1: CẬP NHẬT BẢNG PROFILES
-- =============================================

-- Thêm các cột cho thông tin phụ huynh
DO $$
BEGIN
  -- parent_pin: Mã PIN 4-6 số để vào chế độ phụ huynh (mã hóa)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'parent_pin') THEN
    ALTER TABLE profiles ADD COLUMN parent_pin TEXT;
  END IF;

  -- parent_name: Tên phụ huynh
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'parent_name') THEN
    ALTER TABLE profiles ADD COLUMN parent_name TEXT;
  END IF;

  -- parent_phone: Số điện thoại phụ huynh
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'parent_phone') THEN
    ALTER TABLE profiles ADD COLUMN parent_phone TEXT;
  END IF;

  -- study_time_limit: Giới hạn thời gian học mỗi ngày (phút)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'study_time_limit') THEN
    ALTER TABLE profiles ADD COLUMN study_time_limit INTEGER DEFAULT 0;
  END IF;

  -- play_time_limit: Giới hạn thời gian chơi game mỗi ngày (phút)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'play_time_limit') THEN
    ALTER TABLE profiles ADD COLUMN play_time_limit INTEGER DEFAULT 0;
  END IF;

  -- parent_notifications: Bật/tắt thông báo cho phụ huynh
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'parent_notifications') THEN
    ALTER TABLE profiles ADD COLUMN parent_notifications BOOLEAN DEFAULT true;
  END IF;
END $$;

-- Index cho parent_phone (để tìm kiếm)
CREATE INDEX IF NOT EXISTS idx_profiles_parent_phone ON profiles(parent_phone);

-- =============================================
-- PHẦN 2: FUNCTION MÃ HÓA VÀ KIỂM TRA PIN
-- =============================================

-- Function: Hash PIN sử dụng pgcrypto
CREATE OR REPLACE FUNCTION hash_parent_pin(pin TEXT)
RETURNS TEXT AS $$
BEGIN
  -- Sử dụng SHA256 với salt cố định cho đơn giản
  -- Trong production nên dùng bcrypt hoặc thêm salt riêng
  RETURN encode(digest(pin || 'bethongminh_salt_2024', 'sha256'), 'hex');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function: Đặt PIN cho phụ huynh
CREATE OR REPLACE FUNCTION set_parent_pin(p_student_id UUID, p_pin TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Kiểm tra PIN hợp lệ (4-6 số)
  IF p_pin !~ '^\d{4,6}$' THEN
    RAISE EXCEPTION 'PIN phải là 4-6 chữ số';
  END IF;

  UPDATE profiles
  SET parent_pin = hash_parent_pin(p_pin),
      updated_at = NOW()
  WHERE id = p_student_id;

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Kiểm tra PIN phụ huynh
CREATE OR REPLACE FUNCTION verify_parent_pin(p_student_id UUID, p_pin TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_stored_hash TEXT;
BEGIN
  SELECT parent_pin INTO v_stored_hash
  FROM profiles
  WHERE id = p_student_id;

  IF v_stored_hash IS NULL THEN
    RETURN FALSE;
  END IF;

  RETURN v_stored_hash = hash_parent_pin(p_pin);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Tạo PIN ngẫu nhiên 4 số
CREATE OR REPLACE FUNCTION generate_random_pin()
RETURNS TEXT AS $$
BEGIN
  RETURN LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- PHẦN 3: BẢNG PARENT_MESSAGES (TIN NHẮN PHỤ HUYNH - GIÁO VIÊN)
-- =============================================

-- Sử dụng lại bảng messages hiện có, thêm loại conversation
-- hoặc tạo bảng riêng nếu cần

-- Đảm bảo bảng messages hỗ trợ chat PH-GV
DO $$
BEGIN
  -- Thêm cột conversation_type nếu chưa có
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'messages' AND column_name = 'conversation_type') THEN
    ALTER TABLE messages ADD COLUMN conversation_type VARCHAR(20) DEFAULT 'direct';
  END IF;

  -- Thêm cột student_id để liên kết tin nhắn PH với học sinh
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'messages' AND column_name = 'student_id') THEN
    ALTER TABLE messages ADD COLUMN student_id UUID REFERENCES profiles(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Index cho messages
CREATE INDEX IF NOT EXISTS idx_messages_student ON messages(student_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_type ON messages(conversation_type);

-- =============================================
-- PHẦN 4: BẢNG STUDY_SESSIONS (THEO DÕI THỜI GIAN HỌC)
-- =============================================

CREATE TABLE IF NOT EXISTS study_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Học sinh
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Loại hoạt động: study, play, other
  activity_type VARCHAR(20) NOT NULL DEFAULT 'study',

  -- Thời gian
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ,

  -- Tổng thời gian (phút)
  duration_minutes INTEGER,

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index cho study_sessions
CREATE INDEX IF NOT EXISTS idx_study_sessions_student ON study_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_date ON study_sessions(started_at);

-- Function: Tính tổng thời gian học/chơi trong ngày
CREATE OR REPLACE FUNCTION get_daily_activity_time(
  p_student_id UUID,
  p_activity_type VARCHAR DEFAULT 'study',
  p_date DATE DEFAULT CURRENT_DATE
)
RETURNS INTEGER AS $$
DECLARE
  v_total INTEGER;
BEGIN
  SELECT COALESCE(SUM(duration_minutes), 0) INTO v_total
  FROM study_sessions
  WHERE student_id = p_student_id
    AND activity_type = p_activity_type
    AND started_at::date = p_date;

  RETURN v_total;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- PHẦN 5: VIEW THỐNG KÊ HỌC TẬP CHO PHỤ HUYNH
-- =============================================

CREATE OR REPLACE VIEW parent_student_stats AS
SELECT
  p.id as student_id,
  p.full_name as student_name,
  p.avatar_url,
  p.parent_name,
  p.parent_phone,
  p.xp_points,
  p.level,
  p.streak_days,

  -- Số bài đã hoàn thành
  (SELECT COUNT(*) FROM user_progress up WHERE up.user_id = p.id AND up.is_completed = true) as completed_lessons,

  -- Điểm trung bình
  (SELECT ROUND(AVG(up.score)::numeric, 1) FROM user_progress up WHERE up.user_id = p.id AND up.score IS NOT NULL) as avg_score,

  -- Tổng thời gian học (phút)
  (SELECT COALESCE(SUM(ss.duration_minutes), 0) FROM study_sessions ss WHERE ss.student_id = p.id AND ss.activity_type = 'study') as total_study_minutes,

  -- Huy hiệu
  (SELECT COUNT(*) FROM user_achievements ua WHERE ua.user_id = p.id) as badge_count

FROM profiles p
WHERE p.role = 'student';

-- =============================================
-- PHẦN 6: RLS POLICIES
-- =============================================

-- Enable RLS cho study_sessions
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Học sinh xem session của mình
DROP POLICY IF EXISTS "Students view own sessions" ON study_sessions;
CREATE POLICY "Students view own sessions" ON study_sessions
  FOR SELECT USING (student_id = auth.uid());

-- Policy: Học sinh tạo session của mình
DROP POLICY IF EXISTS "Students create own sessions" ON study_sessions;
CREATE POLICY "Students create own sessions" ON study_sessions
  FOR INSERT WITH CHECK (student_id = auth.uid());

-- Policy: Giáo viên/Admin xem sessions
DROP POLICY IF EXISTS "Teachers view student sessions" ON study_sessions;
CREATE POLICY "Teachers view student sessions" ON study_sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('teacher', 'school_admin', 'super_admin')
    )
  );

-- =============================================
-- PHẦN 7: GRANT PERMISSIONS
-- =============================================

-- Grant execute cho functions
GRANT EXECUTE ON FUNCTION set_parent_pin(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION verify_parent_pin(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION generate_random_pin() TO authenticated;
GRANT EXECUTE ON FUNCTION get_daily_activity_time(UUID, VARCHAR, DATE) TO authenticated;

-- Grant select cho view
GRANT SELECT ON parent_student_stats TO authenticated;

