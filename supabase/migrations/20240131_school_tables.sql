-- =============================================
-- SUPABASE MIGRATION: School Management Tables
-- Tạo các bảng cần thiết cho quản lý trường học
-- =============================================

-- =============================================
-- 1. BẢNG DEPARTMENTS (Bộ phận)
-- =============================================

CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  head_teacher_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index cho departments
CREATE INDEX IF NOT EXISTS idx_departments_school_id ON departments(school_id);
CREATE INDEX IF NOT EXISTS idx_departments_head_teacher ON departments(head_teacher_id);

-- RLS cho departments
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;

-- Policy: Ai cũng đọc được departments của trường mình
CREATE POLICY "departments_select_policy" ON departments
FOR SELECT USING (
  school_id IN (SELECT school_id FROM profiles WHERE id = auth.uid())
);

-- Policy: School admin có thể CRUD
CREATE POLICY "departments_insert_policy" ON departments
FOR INSERT WITH CHECK (
  school_id IN (SELECT school_id FROM profiles WHERE id = auth.uid() AND role = 'school_admin')
);

CREATE POLICY "departments_update_policy" ON departments
FOR UPDATE USING (
  school_id IN (SELECT school_id FROM profiles WHERE id = auth.uid() AND role = 'school_admin')
);

CREATE POLICY "departments_delete_policy" ON departments
FOR DELETE USING (
  school_id IN (SELECT school_id FROM profiles WHERE id = auth.uid() AND role = 'school_admin')
);


-- =============================================
-- 2. THÊM CỘT VÀO BẢNG CLASSES
-- =============================================

-- Thêm cột nếu chưa có
ALTER TABLE classes ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id) ON DELETE CASCADE;
ALTER TABLE classes ADD COLUMN IF NOT EXISTS department_id UUID REFERENCES departments(id) ON DELETE SET NULL;
ALTER TABLE classes ADD COLUMN IF NOT EXISTS teacher_id UUID REFERENCES profiles(id) ON DELETE SET NULL;
ALTER TABLE classes ADD COLUMN IF NOT EXISTS grade TEXT DEFAULT '1';
ALTER TABLE classes ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE classes ADD COLUMN IF NOT EXISTS academic_year TEXT;
ALTER TABLE classes ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Index cho classes
CREATE INDEX IF NOT EXISTS idx_classes_school_id ON classes(school_id);
CREATE INDEX IF NOT EXISTS idx_classes_department_id ON classes(department_id);
CREATE INDEX IF NOT EXISTS idx_classes_teacher_id ON classes(teacher_id);


-- =============================================
-- 3. THÊM CỘT VÀO BẢNG PROFILES
-- =============================================

-- Thêm cột department_id, class_id, parent info
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS department_id UUID REFERENCES departments(id) ON DELETE SET NULL;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS class_id UUID REFERENCES classes(id) ON DELETE SET NULL;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS parent_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS parent_phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS parent_pin TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Index cho profiles
CREATE INDEX IF NOT EXISTS idx_profiles_department_id ON profiles(department_id);
CREATE INDEX IF NOT EXISTS idx_profiles_class_id ON profiles(class_id);
CREATE INDEX IF NOT EXISTS idx_profiles_school_id ON profiles(school_id);


-- =============================================
-- 4. BẢNG TEACHER_ATTENDANCE (Chấm công GV)
-- =============================================

CREATE TABLE IF NOT EXISTS teacher_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  check_in_time TIME,
  check_out_time TIME,
  status TEXT DEFAULT 'present' CHECK (status IN ('present', 'late', 'absent', 'leave')),
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(teacher_id, date)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_teacher_attendance_school_id ON teacher_attendance(school_id);
CREATE INDEX IF NOT EXISTS idx_teacher_attendance_date ON teacher_attendance(date);
CREATE INDEX IF NOT EXISTS idx_teacher_attendance_teacher_date ON teacher_attendance(teacher_id, date);

-- RLS
ALTER TABLE teacher_attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "teacher_attendance_select" ON teacher_attendance
FOR SELECT USING (
  school_id IN (SELECT school_id FROM profiles WHERE id = auth.uid())
);

CREATE POLICY "teacher_attendance_insert" ON teacher_attendance
FOR INSERT WITH CHECK (
  school_id IN (SELECT school_id FROM profiles WHERE id = auth.uid() AND role IN ('school_admin', 'teacher'))
);

CREATE POLICY "teacher_attendance_update" ON teacher_attendance
FOR UPDATE USING (
  school_id IN (SELECT school_id FROM profiles WHERE id = auth.uid() AND role = 'school_admin')
  OR teacher_id = auth.uid()
);


-- =============================================
-- 5. BẢNG STUDENT_ATTENDANCE (Điểm danh HS)
-- =============================================

CREATE TABLE IF NOT EXISTS student_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  status TEXT DEFAULT 'present' CHECK (status IN ('present', 'late', 'absent_excused', 'absent_unexcused')),
  note TEXT,
  recorded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, date)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_student_attendance_school_id ON student_attendance(school_id);
CREATE INDEX IF NOT EXISTS idx_student_attendance_class_id ON student_attendance(class_id);
CREATE INDEX IF NOT EXISTS idx_student_attendance_date ON student_attendance(date);
CREATE INDEX IF NOT EXISTS idx_student_attendance_student_date ON student_attendance(student_id, date);

-- RLS
ALTER TABLE student_attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "student_attendance_select" ON student_attendance
FOR SELECT USING (
  school_id IN (SELECT school_id FROM profiles WHERE id = auth.uid())
  OR student_id = auth.uid()
);

CREATE POLICY "student_attendance_insert" ON student_attendance
FOR INSERT WITH CHECK (
  school_id IN (SELECT school_id FROM profiles WHERE id = auth.uid() AND role IN ('school_admin', 'teacher'))
);

CREATE POLICY "student_attendance_update" ON student_attendance
FOR UPDATE USING (
  school_id IN (SELECT school_id FROM profiles WHERE id = auth.uid() AND role IN ('school_admin', 'teacher'))
);


-- =============================================
-- 6. BẢNG ACTIVITY_LOG (Nhật ký hoạt động)
-- =============================================

CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_activity_log_school_id ON activity_log(school_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON activity_log(created_at DESC);

-- RLS
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "activity_log_select" ON activity_log
FOR SELECT USING (
  school_id IN (SELECT school_id FROM profiles WHERE id = auth.uid())
);

CREATE POLICY "activity_log_insert" ON activity_log
FOR INSERT WITH CHECK (
  school_id IN (SELECT school_id FROM profiles WHERE id = auth.uid())
);


-- =============================================
-- 7. BẢNG SCHOOL_EVENTS (Sự kiện trường)
-- =============================================

CREATE TABLE IF NOT EXISTS school_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  event_time TIME,
  event_type TEXT DEFAULT 'other' CHECK (event_type IN ('meeting', 'exam', 'holiday', 'deadline', 'activity', 'other')),
  location TEXT,
  is_all_day BOOLEAN DEFAULT false,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_school_events_school_id ON school_events(school_id);
CREATE INDEX IF NOT EXISTS idx_school_events_date ON school_events(event_date);

-- RLS
ALTER TABLE school_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "school_events_select" ON school_events
FOR SELECT USING (
  school_id IN (SELECT school_id FROM profiles WHERE id = auth.uid())
);

CREATE POLICY "school_events_insert" ON school_events
FOR INSERT WITH CHECK (
  school_id IN (SELECT school_id FROM profiles WHERE id = auth.uid() AND role = 'school_admin')
);

CREATE POLICY "school_events_update" ON school_events
FOR UPDATE USING (
  school_id IN (SELECT school_id FROM profiles WHERE id = auth.uid() AND role = 'school_admin')
);

CREATE POLICY "school_events_delete" ON school_events
FOR DELETE USING (
  school_id IN (SELECT school_id FROM profiles WHERE id = auth.uid() AND role = 'school_admin')
);


-- =============================================
-- 8. TRIGGERS CHO ACTIVITY LOG
-- =============================================

-- Function ghi log hoạt động
CREATE OR REPLACE FUNCTION log_activity()
RETURNS TRIGGER AS $$
DECLARE
  v_school_id UUID;
  v_action TEXT;
BEGIN
  -- Lấy school_id
  IF TG_TABLE_NAME = 'profiles' THEN
    v_school_id := COALESCE(NEW.school_id, OLD.school_id);
  ELSIF TG_TABLE_NAME = 'classes' THEN
    v_school_id := COALESCE(NEW.school_id, OLD.school_id);
  ELSIF TG_TABLE_NAME = 'departments' THEN
    v_school_id := COALESCE(NEW.school_id, OLD.school_id);
  ELSE
    v_school_id := COALESCE(NEW.school_id, OLD.school_id);
  END IF;

  -- Skip nếu không có school_id
  IF v_school_id IS NULL THEN
    RETURN COALESCE(NEW, OLD);
  END IF;

  -- Xác định action
  v_action := TG_OP || '_' || TG_TABLE_NAME;

  -- Ghi log
  INSERT INTO activity_log (school_id, user_id, action, entity_type, entity_id, details)
  VALUES (
    v_school_id,
    auth.uid(),
    v_action,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE to_jsonb(NEW) END
  );

  RETURN COALESCE(NEW, OLD);
EXCEPTION
  WHEN OTHERS THEN
    -- Không block operation nếu log fail
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Tạo triggers (với IF NOT EXISTS không hoạt động cho triggers, dùng DO block)
DO $$
BEGIN
  -- Drop existing triggers first
  DROP TRIGGER IF EXISTS log_profile_changes ON profiles;
  DROP TRIGGER IF EXISTS log_class_changes ON classes;
  DROP TRIGGER IF EXISTS log_department_changes ON departments;

  -- Create new triggers
  CREATE TRIGGER log_profile_changes
    AFTER INSERT OR UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION log_activity();

  CREATE TRIGGER log_class_changes
    AFTER INSERT OR UPDATE OR DELETE ON classes
    FOR EACH ROW EXECUTE FUNCTION log_activity();

  CREATE TRIGGER log_department_changes
    AFTER INSERT OR UPDATE OR DELETE ON departments
    FOR EACH ROW EXECUTE FUNCTION log_activity();
EXCEPTION
  WHEN OTHERS THEN NULL;
END;
$$;


-- =============================================
-- 9. ENABLE REALTIME CHO ACTIVITY_LOG
-- =============================================

ALTER PUBLICATION supabase_realtime ADD TABLE activity_log;


-- =============================================
-- HOÀN THÀNH
-- =============================================
-- Các bảng đã được tạo:
-- 1. departments - Quản lý bộ phận
-- 2. teacher_attendance - Chấm công giáo viên
-- 3. student_attendance - Điểm danh học sinh
-- 4. activity_log - Nhật ký hoạt động
-- 5. school_events - Sự kiện trường
--
-- Các cột đã được thêm:
-- - profiles: department_id, class_id, parent_name, parent_phone, parent_pin, is_active
-- - classes: school_id, department_id, teacher_id, grade, is_active, academic_year
