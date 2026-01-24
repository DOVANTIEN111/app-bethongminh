-- Schools Enhancement Migration
-- Thêm các trường mới cho bảng schools

-- Thêm các cột mới nếu chưa có
DO $$
BEGIN
  -- Thêm cột logo_url
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'schools' AND column_name = 'logo_url') THEN
    ALTER TABLE schools ADD COLUMN logo_url TEXT;
  END IF;

  -- Thêm cột plan_id
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'schools' AND column_name = 'plan_id') THEN
    ALTER TABLE schools ADD COLUMN plan_id UUID REFERENCES plans(id) ON DELETE SET NULL;
  END IF;

  -- Thêm cột is_active
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'schools' AND column_name = 'is_active') THEN
    ALTER TABLE schools ADD COLUMN is_active BOOLEAN DEFAULT true;
  END IF;

  -- Thêm cột notes
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'schools' AND column_name = 'notes') THEN
    ALTER TABLE schools ADD COLUMN notes TEXT;
  END IF;

  -- Thêm cột updated_at nếu chưa có
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'schools' AND column_name = 'updated_at') THEN
    ALTER TABLE schools ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
END $$;

-- Tạo index cho các cột mới
CREATE INDEX IF NOT EXISTS idx_schools_plan ON schools(plan_id);
CREATE INDEX IF NOT EXISTS idx_schools_active ON schools(is_active);

-- Function lấy thống kê trường học
CREATE OR REPLACE FUNCTION get_school_stats(p_school_id UUID)
RETURNS JSON AS $$
DECLARE
  v_result JSON;
BEGIN
  SELECT json_build_object(
    'teachers_count', (SELECT COUNT(*) FROM profiles WHERE school_id = p_school_id AND role = 'teacher'),
    'students_count', (SELECT COUNT(*) FROM profiles WHERE school_id = p_school_id AND role = 'student'),
    'parents_count', (SELECT COUNT(*) FROM profiles WHERE school_id = p_school_id AND role = 'parent'),
    'departments_count', (SELECT COUNT(*) FROM departments WHERE school_id = p_school_id),
    'classes_count', (SELECT COUNT(*) FROM classes WHERE school_id = p_school_id)
  ) INTO v_result;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function lấy thống kê tất cả trường (cho danh sách)
CREATE OR REPLACE FUNCTION get_all_schools_stats()
RETURNS TABLE (
  school_id UUID,
  teachers_count BIGINT,
  students_count BIGINT,
  classes_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.id as school_id,
    (SELECT COUNT(*) FROM profiles p WHERE p.school_id = s.id AND p.role = 'teacher') as teachers_count,
    (SELECT COUNT(*) FROM profiles p WHERE p.school_id = s.id AND p.role = 'student') as students_count,
    (SELECT COUNT(*) FROM classes c WHERE c.school_id = s.id) as classes_count
  FROM schools s;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
