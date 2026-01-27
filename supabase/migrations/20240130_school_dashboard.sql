-- School Dashboard Enhancement Migration
-- Tao cac bang moi cho Dashboard Nha truong

-- =============================================
-- BANG 1: TEACHER_ATTENDANCE (Cham cong GV)
-- =============================================

CREATE TABLE IF NOT EXISTS teacher_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  check_in_time TIME,
  check_out_time TIME,
  status VARCHAR(20) DEFAULT 'absent_unexcused' CHECK (status IN ('present', 'late', 'absent_excused', 'absent_unexcused')),
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(teacher_id, date)
);

CREATE INDEX IF NOT EXISTS idx_teacher_attendance_school ON teacher_attendance(school_id);
CREATE INDEX IF NOT EXISTS idx_teacher_attendance_date ON teacher_attendance(date);
CREATE INDEX IF NOT EXISTS idx_teacher_attendance_status ON teacher_attendance(status);

-- =============================================
-- BANG 2: STUDENT_ATTENDANCE (Diem danh HS)
-- =============================================

CREATE TABLE IF NOT EXISTS student_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  status VARCHAR(20) DEFAULT 'absent_unexcused' CHECK (status IN ('present', 'late', 'absent_excused', 'absent_unexcused')),
  note TEXT,
  recorded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(student_id, date)
);

CREATE INDEX IF NOT EXISTS idx_student_attendance_school ON student_attendance(school_id);
CREATE INDEX IF NOT EXISTS idx_student_attendance_class ON student_attendance(class_id);
CREATE INDEX IF NOT EXISTS idx_student_attendance_date ON student_attendance(date);
CREATE INDEX IF NOT EXISTS idx_student_attendance_status ON student_attendance(status);

-- =============================================
-- BANG 3: ACTIVITY_LOG (Nhat ky hoat dong)
-- =============================================

CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  user_type VARCHAR(20) CHECK (user_type IN ('teacher', 'student', 'parent', 'admin', 'school_admin')),
  action VARCHAR(50) NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_log_school ON activity_log(school_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_user ON activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_action ON activity_log(action);
CREATE INDEX IF NOT EXISTS idx_activity_log_created ON activity_log(created_at DESC);

-- =============================================
-- BANG 4: SCHOOL_EVENTS (Su kien truong)
-- =============================================

CREATE TABLE IF NOT EXISTS school_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  event_time TIME,
  end_date DATE,
  event_type VARCHAR(20) DEFAULT 'other' CHECK (event_type IN ('meeting', 'exam', 'holiday', 'deadline', 'activity', 'other')),
  is_all_day BOOLEAN DEFAULT false,
  location TEXT,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_school_events_school ON school_events(school_id);
CREATE INDEX IF NOT EXISTS idx_school_events_date ON school_events(event_date);
CREATE INDEX IF NOT EXISTS idx_school_events_type ON school_events(event_type);

-- =============================================
-- RLS POLICIES
-- =============================================

-- Enable RLS
ALTER TABLE teacher_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_events ENABLE ROW LEVEL SECURITY;

-- Teacher Attendance Policies
DROP POLICY IF EXISTS "School admins can manage teacher attendance" ON teacher_attendance;
CREATE POLICY "School admins can manage teacher attendance" ON teacher_attendance
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND school_id = teacher_attendance.school_id AND role IN ('school_admin', 'super_admin'))
  );

DROP POLICY IF EXISTS "Teachers can view own attendance" ON teacher_attendance;
CREATE POLICY "Teachers can view own attendance" ON teacher_attendance
  FOR SELECT USING (teacher_id = auth.uid());

-- Student Attendance Policies
DROP POLICY IF EXISTS "School staff can manage student attendance" ON student_attendance;
CREATE POLICY "School staff can manage student attendance" ON student_attendance
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND school_id = student_attendance.school_id AND role IN ('school_admin', 'teacher', 'super_admin'))
  );

DROP POLICY IF EXISTS "Students can view own attendance" ON student_attendance;
CREATE POLICY "Students can view own attendance" ON student_attendance
  FOR SELECT USING (student_id = auth.uid());

-- Activity Log Policies
DROP POLICY IF EXISTS "School staff can view activity log" ON activity_log;
CREATE POLICY "School staff can view activity log" ON activity_log
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND school_id = activity_log.school_id AND role IN ('school_admin', 'teacher', 'super_admin'))
    OR user_id = auth.uid()
  );

DROP POLICY IF EXISTS "Users can create activity log" ON activity_log;
CREATE POLICY "Users can create activity log" ON activity_log
  FOR INSERT WITH CHECK (user_id = auth.uid() OR auth.uid() IS NOT NULL);

-- School Events Policies
DROP POLICY IF EXISTS "School staff can manage events" ON school_events;
CREATE POLICY "School staff can manage events" ON school_events
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND school_id = school_events.school_id AND role IN ('school_admin', 'teacher', 'super_admin'))
  );

DROP POLICY IF EXISTS "School members can view events" ON school_events;
CREATE POLICY "School members can view events" ON school_events
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND school_id = school_events.school_id)
  );

-- =============================================
-- FUNCTIONS
-- =============================================

-- Function: Lay thong ke Dashboard
CREATE OR REPLACE FUNCTION get_school_dashboard_stats(p_school_id UUID, p_date DATE DEFAULT CURRENT_DATE)
RETURNS JSON AS $$
DECLARE
  v_result JSON;
  v_total_teachers INT;
  v_present_teachers INT;
  v_total_students INT;
  v_present_students INT;
  v_total_classes INT;
  v_lessons_today INT;
BEGIN
  -- Dem tong giao vien
  SELECT COUNT(*) INTO v_total_teachers
  FROM profiles WHERE school_id = p_school_id AND role = 'teacher' AND is_active = true;

  -- Dem giao vien di lam
  SELECT COUNT(*) INTO v_present_teachers
  FROM teacher_attendance
  WHERE school_id = p_school_id AND date = p_date AND status IN ('present', 'late');

  -- Dem tong hoc sinh
  SELECT COUNT(*) INTO v_total_students
  FROM profiles WHERE school_id = p_school_id AND role = 'student' AND is_active = true;

  -- Dem hoc sinh di hoc
  SELECT COUNT(*) INTO v_present_students
  FROM student_attendance
  WHERE school_id = p_school_id AND date = p_date AND status IN ('present', 'late');

  -- Dem lop hoc
  SELECT COUNT(*) INTO v_total_classes
  FROM classes WHERE school_id = p_school_id AND is_active = true;

  -- Dem bai hoc hoan thanh hom nay (tu student_progress)
  SELECT COUNT(*) INTO v_lessons_today
  FROM student_progress sp
  JOIN profiles p ON sp.student_id = p.id
  WHERE p.school_id = p_school_id AND DATE(sp.completed_at) = p_date;

  SELECT json_build_object(
    'total_teachers', v_total_teachers,
    'present_teachers', v_present_teachers,
    'total_students', v_total_students,
    'present_students', v_present_students,
    'total_classes', v_total_classes,
    'lessons_today', v_lessons_today
  ) INTO v_result;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Lay danh sach canh bao
CREATE OR REPLACE FUNCTION get_school_alerts(p_school_id UUID, p_date DATE DEFAULT CURRENT_DATE)
RETURNS JSON AS $$
DECLARE
  v_alerts JSON[];
  v_item RECORD;
BEGIN
  v_alerts := ARRAY[]::JSON[];

  -- GV chua cham cong
  FOR v_item IN
    SELECT p.id, p.full_name
    FROM profiles p
    WHERE p.school_id = p_school_id AND p.role = 'teacher' AND p.is_active = true
    AND NOT EXISTS (
      SELECT 1 FROM teacher_attendance ta
      WHERE ta.teacher_id = p.id AND ta.date = p_date AND ta.status IN ('present', 'late')
    )
    LIMIT 10
  LOOP
    v_alerts := array_append(v_alerts, json_build_object(
      'type', 'teacher_no_checkin',
      'severity', 'high',
      'message', 'Chưa chấm công: ' || v_item.full_name,
      'user_id', v_item.id
    ));
  END LOOP;

  -- HS nghi khong phep
  FOR v_item IN
    SELECT COUNT(*) as count
    FROM student_attendance
    WHERE school_id = p_school_id AND date = p_date AND status = 'absent_unexcused'
  LOOP
    IF v_item.count > 0 THEN
      v_alerts := array_append(v_alerts, json_build_object(
        'type', 'student_absent_unexcused',
        'severity', 'medium',
        'message', v_item.count || ' học sinh nghỉ không phép hôm nay',
        'count', v_item.count
      ));
    END IF;
  END LOOP;

  -- Bai tap qua han chua cham
  FOR v_item IN
    SELECT COUNT(*) as count
    FROM student_assignments sa
    JOIN assignments a ON sa.assignment_id = a.id
    WHERE a.school_id = p_school_id
    AND a.deadline < NOW()
    AND sa.status IN ('submitted')
    AND sa.graded_at IS NULL
  LOOP
    IF v_item.count > 0 THEN
      v_alerts := array_append(v_alerts, json_build_object(
        'type', 'ungraded_assignments',
        'severity', 'medium',
        'message', v_item.count || ' bài tập quá hạn chưa chấm điểm',
        'count', v_item.count
      ));
    END IF;
  END LOOP;

  -- Lop chua co GVCN
  FOR v_item IN
    SELECT COUNT(*) as count
    FROM classes c
    WHERE c.school_id = p_school_id AND c.is_active = true AND c.teacher_id IS NULL
  LOOP
    IF v_item.count > 0 THEN
      v_alerts := array_append(v_alerts, json_build_object(
        'type', 'class_no_teacher',
        'severity', 'low',
        'message', v_item.count || ' lớp chưa có giáo viên chủ nhiệm',
        'count', v_item.count
      ));
    END IF;
  END LOOP;

  RETURN to_json(v_alerts);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Lay diem TB theo lop
CREATE OR REPLACE FUNCTION get_class_average_scores(p_school_id UUID)
RETURNS TABLE (
  class_id UUID,
  class_name TEXT,
  student_count BIGINT,
  avg_score NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id as class_id,
    c.name as class_name,
    COUNT(DISTINCT p.id) as student_count,
    COALESCE(ROUND(AVG(sp.score)::numeric, 2), 0) as avg_score
  FROM classes c
  LEFT JOIN profiles p ON p.class_id = c.id AND p.role = 'student' AND p.is_active = true
  LEFT JOIN student_progress sp ON sp.student_id = p.id
  WHERE c.school_id = p_school_id AND c.is_active = true
  GROUP BY c.id, c.name
  ORDER BY c.name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Lay thong ke chuyen can
CREATE OR REPLACE FUNCTION get_attendance_stats(p_school_id UUID, p_start_date DATE, p_end_date DATE)
RETURNS JSON AS $$
DECLARE
  v_result JSON;
BEGIN
  SELECT json_build_object(
    'present', COUNT(*) FILTER (WHERE status = 'present'),
    'late', COUNT(*) FILTER (WHERE status = 'late'),
    'absent_excused', COUNT(*) FILTER (WHERE status = 'absent_excused'),
    'absent_unexcused', COUNT(*) FILTER (WHERE status = 'absent_unexcused'),
    'total', COUNT(*)
  ) INTO v_result
  FROM student_attendance
  WHERE school_id = p_school_id AND date BETWEEN p_start_date AND p_end_date;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Lay top hoc sinh
CREATE OR REPLACE FUNCTION get_top_students(p_school_id UUID, p_limit INT DEFAULT 10)
RETURNS TABLE (
  student_id UUID,
  full_name TEXT,
  class_name TEXT,
  avg_score NUMERIC,
  total_lessons BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id as student_id,
    p.full_name,
    c.name as class_name,
    ROUND(AVG(sp.score)::numeric, 2) as avg_score,
    COUNT(sp.id) as total_lessons
  FROM profiles p
  LEFT JOIN classes c ON p.class_id = c.id
  JOIN student_progress sp ON sp.student_id = p.id
  WHERE p.school_id = p_school_id AND p.role = 'student' AND p.is_active = true
  GROUP BY p.id, p.full_name, c.name
  HAVING COUNT(sp.id) >= 5
  ORDER BY avg_score DESC, total_lessons DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Lay top giao vien
CREATE OR REPLACE FUNCTION get_top_teachers(p_school_id UUID, p_limit INT DEFAULT 5)
RETURNS TABLE (
  teacher_id UUID,
  full_name TEXT,
  department_name TEXT,
  total_assignments BIGINT,
  total_students BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id as teacher_id,
    p.full_name,
    d.name as department_name,
    COUNT(DISTINCT a.id) as total_assignments,
    COUNT(DISTINCT sa.student_id) as total_students
  FROM profiles p
  LEFT JOIN departments d ON p.department_id = d.id
  LEFT JOIN assignments a ON a.teacher_id = p.id
  LEFT JOIN student_assignments sa ON sa.assignment_id = a.id
  WHERE p.school_id = p_school_id AND p.role = 'teacher' AND p.is_active = true
  GROUP BY p.id, p.full_name, d.name
  ORDER BY total_assignments DESC, total_students DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Log activity
CREATE OR REPLACE FUNCTION log_activity(
  p_school_id UUID,
  p_user_id UUID,
  p_user_type VARCHAR(20),
  p_action VARCHAR(50),
  p_description TEXT,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO activity_log (school_id, user_id, user_type, action, description, metadata)
  VALUES (p_school_id, p_user_id, p_user_type, p_action, p_description, p_metadata)
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- TRIGGERS
-- =============================================

-- Trigger: Log khi GV cham cong
CREATE OR REPLACE FUNCTION log_teacher_attendance()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IN ('present', 'late') AND (OLD IS NULL OR OLD.status NOT IN ('present', 'late')) THEN
    PERFORM log_activity(
      NEW.school_id,
      NEW.teacher_id,
      'teacher',
      'check_in',
      'Đã chấm công lúc ' || to_char(NEW.check_in_time, 'HH24:MI'),
      json_build_object('attendance_id', NEW.id, 'status', NEW.status)::jsonb
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_log_teacher_attendance ON teacher_attendance;
CREATE TRIGGER trigger_log_teacher_attendance
AFTER INSERT OR UPDATE ON teacher_attendance
FOR EACH ROW
EXECUTE FUNCTION log_teacher_attendance();

-- Trigger: Log khi HS hoan thanh bai hoc
CREATE OR REPLACE FUNCTION log_lesson_completion()
RETURNS TRIGGER AS $$
DECLARE
  v_school_id UUID;
  v_student_name TEXT;
  v_class_name TEXT;
BEGIN
  -- Lay thong tin HS
  SELECT p.school_id, p.full_name, c.name INTO v_school_id, v_student_name, v_class_name
  FROM profiles p
  LEFT JOIN classes c ON p.class_id = c.id
  WHERE p.id = NEW.student_id;

  IF v_school_id IS NOT NULL THEN
    PERFORM log_activity(
      v_school_id,
      NEW.student_id,
      'student',
      'complete_lesson',
      v_student_name || COALESCE(' (' || v_class_name || ')', '') || ' hoàn thành bài học - ' || NEW.score || ' điểm',
      json_build_object('lesson_id', NEW.lesson_id, 'score', NEW.score, 'subject', NEW.subject)::jsonb
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_log_lesson_completion ON student_progress;
CREATE TRIGGER trigger_log_lesson_completion
AFTER INSERT ON student_progress
FOR EACH ROW
EXECUTE FUNCTION log_lesson_completion();

-- Trigger: Log khi GV giao bai
CREATE OR REPLACE FUNCTION log_assignment_created()
RETURNS TRIGGER AS $$
DECLARE
  v_teacher_name TEXT;
  v_class_name TEXT;
BEGIN
  SELECT p.full_name INTO v_teacher_name FROM profiles p WHERE p.id = NEW.teacher_id;
  SELECT c.name INTO v_class_name FROM classes c WHERE c.id = NEW.class_id;

  PERFORM log_activity(
    NEW.school_id,
    NEW.teacher_id,
    'teacher',
    'assign_homework',
    'GV ' || v_teacher_name || ' giao bài "' || NEW.title || '" cho lớp ' || COALESCE(v_class_name, ''),
    json_build_object('assignment_id', NEW.id, 'class_id', NEW.class_id)::jsonb
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_log_assignment_created ON assignments;
CREATE TRIGGER trigger_log_assignment_created
AFTER INSERT ON assignments
FOR EACH ROW
EXECUTE FUNCTION log_assignment_created();
