-- Teacher Lessons & Assignments System
-- Migration: Hệ thống Bài giảng và Giao bài cho Giáo viên

-- =============================================
-- PHẦN 1: CẬP NHẬT BẢNG LESSONS
-- =============================================

-- Thêm các cột mới cho bảng lessons (nếu chưa có)
DO $$
BEGIN
  -- teacher_id: ID giáo viên tạo bài (null = bài hệ thống từ Admin)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lessons' AND column_name = 'teacher_id') THEN
    ALTER TABLE lessons ADD COLUMN teacher_id UUID REFERENCES profiles(id) ON DELETE SET NULL;
  END IF;

  -- school_id: Trường của bài giảng (null = bài hệ thống dùng chung)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lessons' AND column_name = 'school_id') THEN
    ALTER TABLE lessons ADD COLUMN school_id UUID REFERENCES schools(id) ON DELETE CASCADE;
  END IF;

  -- status: Trạng thái bài giảng
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lessons' AND column_name = 'status') THEN
    ALTER TABLE lessons ADD COLUMN status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'published'));
  END IF;

  -- lesson_type: Loại bài giảng (system = hệ thống, teacher = GV tạo)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lessons' AND column_name = 'lesson_type') THEN
    ALTER TABLE lessons ADD COLUMN lesson_type VARCHAR(20) DEFAULT 'system' CHECK (lesson_type IN ('system', 'teacher'));
  END IF;

  -- video_url: Link video YouTube hoặc URL
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lessons' AND column_name = 'video_url') THEN
    ALTER TABLE lessons ADD COLUMN video_url TEXT;
  END IF;

  -- attachments: File đính kèm (JSON array)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lessons' AND column_name = 'attachments') THEN
    ALTER TABLE lessons ADD COLUMN attachments JSONB DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Index cho lessons
CREATE INDEX IF NOT EXISTS idx_lessons_teacher ON lessons(teacher_id);
CREATE INDEX IF NOT EXISTS idx_lessons_school ON lessons(school_id);
CREATE INDEX IF NOT EXISTS idx_lessons_type ON lessons(lesson_type);
CREATE INDEX IF NOT EXISTS idx_lessons_status ON lessons(status);

-- =============================================
-- PHẦN 2: BẢNG ASSIGNMENTS (GIAO BÀI)
-- =============================================

CREATE TABLE IF NOT EXISTS assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Liên kết bài giảng
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,

  -- Giáo viên giao bài
  teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Trường học
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,

  -- Lớp học (null nếu giao cho HS cụ thể)
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,

  -- Tiêu đề bài giao (có thể khác tên bài giảng)
  title VARCHAR(255) NOT NULL,

  -- Ghi chú cho học sinh
  note TEXT,

  -- Thời gian
  start_date TIMESTAMPTZ DEFAULT NOW(),
  deadline TIMESTAMPTZ NOT NULL,

  -- Trạng thái: active, completed, cancelled
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),

  -- Loại giao: class (cả lớp) hoặc individual (HS cụ thể)
  assignment_type VARCHAR(20) DEFAULT 'class' CHECK (assignment_type IN ('class', 'individual')),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index cho assignments
CREATE INDEX IF NOT EXISTS idx_assignments_lesson ON assignments(lesson_id);
CREATE INDEX IF NOT EXISTS idx_assignments_teacher ON assignments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_assignments_school ON assignments(school_id);
CREATE INDEX IF NOT EXISTS idx_assignments_class ON assignments(class_id);
CREATE INDEX IF NOT EXISTS idx_assignments_deadline ON assignments(deadline);
CREATE INDEX IF NOT EXISTS idx_assignments_status ON assignments(status);

-- =============================================
-- PHẦN 3: BẢNG STUDENT_ASSIGNMENTS (BÀI LÀM CỦA HS)
-- =============================================

CREATE TABLE IF NOT EXISTS student_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Liên kết assignment
  assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,

  -- Học sinh
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Trạng thái: not_started, in_progress, submitted, graded, overdue
  status VARCHAR(20) DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'submitted', 'graded', 'overdue')),

  -- Điểm số (0-100)
  score DECIMAL(5,2),

  -- Điểm tự động từ quiz
  auto_score DECIMAL(5,2),

  -- Điểm GV chấm
  manual_score DECIMAL(5,2),

  -- Nhận xét của GV
  feedback TEXT,

  -- Câu trả lời của HS (JSON)
  answers JSONB DEFAULT '{}'::jsonb,

  -- Thời gian
  started_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ,
  graded_at TIMESTAMPTZ,
  graded_by UUID REFERENCES profiles(id),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Unique constraint: mỗi HS chỉ có 1 bài làm cho mỗi assignment
  UNIQUE(assignment_id, student_id)
);

-- Index cho student_assignments
CREATE INDEX IF NOT EXISTS idx_student_assignments_assignment ON student_assignments(assignment_id);
CREATE INDEX IF NOT EXISTS idx_student_assignments_student ON student_assignments(student_id);
CREATE INDEX IF NOT EXISTS idx_student_assignments_status ON student_assignments(status);

-- =============================================
-- PHẦN 4: FUNCTIONS
-- =============================================

-- Function: Lấy thống kê assignment
CREATE OR REPLACE FUNCTION get_assignment_stats(p_assignment_id UUID)
RETURNS JSON AS $$
DECLARE
  v_result JSON;
BEGIN
  SELECT json_build_object(
    'total_students', COUNT(*),
    'not_started', COUNT(*) FILTER (WHERE status = 'not_started'),
    'in_progress', COUNT(*) FILTER (WHERE status = 'in_progress'),
    'submitted', COUNT(*) FILTER (WHERE status = 'submitted'),
    'graded', COUNT(*) FILTER (WHERE status = 'graded'),
    'overdue', COUNT(*) FILTER (WHERE status = 'overdue'),
    'avg_score', ROUND(AVG(score)::numeric, 2)
  ) INTO v_result
  FROM student_assignments
  WHERE assignment_id = p_assignment_id;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Tự động tạo student_assignments khi giao bài cho cả lớp
CREATE OR REPLACE FUNCTION create_class_student_assignments()
RETURNS TRIGGER AS $$
BEGIN
  -- Chỉ chạy khi giao cho cả lớp
  IF NEW.assignment_type = 'class' AND NEW.class_id IS NOT NULL THEN
    INSERT INTO student_assignments (assignment_id, student_id)
    SELECT NEW.id, p.id
    FROM profiles p
    WHERE p.class_id = NEW.class_id
      AND p.role = 'student'
      AND p.is_active = true
    ON CONFLICT (assignment_id, student_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Tự động tạo bài cho HS khi giao bài
DROP TRIGGER IF EXISTS trigger_create_student_assignments ON assignments;
CREATE TRIGGER trigger_create_student_assignments
AFTER INSERT ON assignments
FOR EACH ROW
EXECUTE FUNCTION create_class_student_assignments();

-- Function: Cập nhật trạng thái quá hạn
CREATE OR REPLACE FUNCTION update_overdue_assignments()
RETURNS void AS $$
BEGIN
  -- Cập nhật student_assignments quá hạn
  UPDATE student_assignments sa
  SET status = 'overdue', updated_at = NOW()
  FROM assignments a
  WHERE sa.assignment_id = a.id
    AND a.deadline < NOW()
    AND sa.status IN ('not_started', 'in_progress')
    AND sa.submitted_at IS NULL;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- PHẦN 5: RLS POLICIES
-- =============================================

-- Enable RLS
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_assignments ENABLE ROW LEVEL SECURITY;

-- Policies cho assignments
DROP POLICY IF EXISTS "Teachers can manage own assignments" ON assignments;
CREATE POLICY "Teachers can manage own assignments" ON assignments
  FOR ALL USING (
    auth.uid() = teacher_id
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'school_admin'))
  );

DROP POLICY IF EXISTS "Students can view their assignments" ON assignments;
CREATE POLICY "Students can view their assignments" ON assignments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM student_assignments sa
      WHERE sa.assignment_id = id AND sa.student_id = auth.uid()
    )
  );

-- Policies cho student_assignments
DROP POLICY IF EXISTS "Students can view own submissions" ON student_assignments;
CREATE POLICY "Students can view own submissions" ON student_assignments
  FOR SELECT USING (student_id = auth.uid());

DROP POLICY IF EXISTS "Students can update own submissions" ON student_assignments;
CREATE POLICY "Students can update own submissions" ON student_assignments
  FOR UPDATE USING (student_id = auth.uid());

DROP POLICY IF EXISTS "Teachers can manage student submissions" ON student_assignments;
CREATE POLICY "Teachers can manage student submissions" ON student_assignments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM assignments a
      WHERE a.id = assignment_id AND a.teacher_id = auth.uid()
    )
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'school_admin'))
  );
