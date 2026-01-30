-- =============================================
-- SUPABASE MIGRATION: Teacher Improvements
-- Cai thien phan Giao vien SchoolHub
-- =============================================

-- =============================================
-- 1. THEM COT CHO BANG LESSONS
-- =============================================

ALTER TABLE lessons ADD COLUMN IF NOT EXISTS teacher_id UUID REFERENCES profiles(id) ON DELETE SET NULL;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id) ON DELETE CASCADE;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived'));
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS is_system BOOLEAN DEFAULT false;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS vocabulary JSONB DEFAULT '[]';
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS quiz_questions JSONB DEFAULT '[]';
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]';
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS estimated_duration INTEGER DEFAULT 30;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS difficulty_level TEXT DEFAULT 'medium' CHECK (difficulty_level IN ('easy', 'medium', 'hard'));

-- Index cho lessons
CREATE INDEX IF NOT EXISTS idx_lessons_teacher_id ON lessons(teacher_id);
CREATE INDEX IF NOT EXISTS idx_lessons_school_id ON lessons(school_id);
CREATE INDEX IF NOT EXISTS idx_lessons_status ON lessons(status);

-- =============================================
-- 2. THEM COT CHO BANG ASSIGNMENTS
-- =============================================

ALTER TABLE assignments ADD COLUMN IF NOT EXISTS assign_type TEXT DEFAULT 'class' CHECK (assign_type IN ('class', 'individual'));
ALTER TABLE assignments ADD COLUMN IF NOT EXISTS assigned_students JSONB DEFAULT '[]';
ALTER TABLE assignments ADD COLUMN IF NOT EXISTS max_attempts INTEGER DEFAULT 1;
ALTER TABLE assignments ADD COLUMN IF NOT EXISTS allow_late_submission BOOLEAN DEFAULT false;
ALTER TABLE assignments ADD COLUMN IF NOT EXISTS late_penalty_percent INTEGER DEFAULT 0;
ALTER TABLE assignments ADD COLUMN IF NOT EXISTS instructions TEXT;
ALTER TABLE assignments ADD COLUMN IF NOT EXISTS total_points INTEGER DEFAULT 100;

-- =============================================
-- 3. BANG STUDENT_ASSIGNMENTS (Chi tiet bai lam)
-- =============================================

CREATE TABLE IF NOT EXISTS student_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'submitted', 'graded', 'returned')),
  started_at TIMESTAMP WITH TIME ZONE,
  submitted_at TIMESTAMP WITH TIME ZONE,
  graded_at TIMESTAMP WITH TIME ZONE,
  graded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  attempt_count INTEGER DEFAULT 0,
  answers JSONB DEFAULT '[]',
  score NUMERIC(5,2),
  max_score NUMERIC(5,2),
  feedback TEXT,
  is_late BOOLEAN DEFAULT false,
  time_spent INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(assignment_id, student_id)
);

-- Index cho student_assignments
CREATE INDEX IF NOT EXISTS idx_student_assignments_assignment ON student_assignments(assignment_id);
CREATE INDEX IF NOT EXISTS idx_student_assignments_student ON student_assignments(student_id);
CREATE INDEX IF NOT EXISTS idx_student_assignments_status ON student_assignments(status);

-- RLS cho student_assignments
ALTER TABLE student_assignments ENABLE ROW LEVEL SECURITY;

-- Policy: Teacher co the xem bai cua hoc sinh trong lop minh
CREATE POLICY "student_assignments_select_teacher" ON student_assignments
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM assignments a
    JOIN classes c ON c.id = a.class_id
    WHERE a.id = student_assignments.assignment_id
    AND c.teacher_id = auth.uid()
  )
  OR student_id = auth.uid()
);

-- Policy: Hoc sinh co the tao/cap nhat bai lam cua minh
CREATE POLICY "student_assignments_insert_student" ON student_assignments
FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "student_assignments_update_student" ON student_assignments
FOR UPDATE USING (
  student_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM assignments a
    JOIN classes c ON c.id = a.class_id
    WHERE a.id = student_assignments.assignment_id
    AND c.teacher_id = auth.uid()
  )
);

-- =============================================
-- 4. BANG MESSAGES (Tin nhan)
-- =============================================

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL NOT NULL,
  receiver_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  student_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
  message_type TEXT DEFAULT 'direct' CHECK (message_type IN ('direct', 'broadcast', 'announcement')),
  subject TEXT,
  content TEXT NOT NULL,
  attachments JSONB DEFAULT '[]',
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  is_important BOOLEAN DEFAULT false,
  parent_message_id UUID REFERENCES messages(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index cho messages
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_student ON messages(student_id);
CREATE INDEX IF NOT EXISTS idx_messages_class ON messages(class_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON messages(is_read) WHERE is_read = false;

-- RLS cho messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policy: Nguoi gui va nguoi nhan co the doc
CREATE POLICY "messages_select_policy" ON messages
FOR SELECT USING (
  sender_id = auth.uid()
  OR receiver_id = auth.uid()
  OR (message_type = 'broadcast' AND class_id IN (
    SELECT class_id FROM class_students WHERE student_id = auth.uid()
    UNION
    SELECT id FROM classes WHERE teacher_id = auth.uid()
  ))
);

-- Policy: Ai cung co the gui tin nhan
CREATE POLICY "messages_insert_policy" ON messages
FOR INSERT WITH CHECK (sender_id = auth.uid());

-- Policy: Chi nguoi nhan co the cap nhat (danh dau da doc)
CREATE POLICY "messages_update_policy" ON messages
FOR UPDATE USING (receiver_id = auth.uid() OR sender_id = auth.uid());

-- =============================================
-- 5. TRIGGER CAP NHAT updated_at
-- =============================================

CREATE OR REPLACE FUNCTION update_student_assignments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS student_assignments_updated_at ON student_assignments;
CREATE TRIGGER student_assignments_updated_at
  BEFORE UPDATE ON student_assignments
  FOR EACH ROW EXECUTE FUNCTION update_student_assignments_updated_at();

-- =============================================
-- 6. VIEW: BAI TAP CAN CHAM DIEM
-- =============================================

CREATE OR REPLACE VIEW pending_grading AS
SELECT
  sa.id,
  sa.assignment_id,
  sa.student_id,
  sa.submitted_at,
  sa.answers,
  a.title as assignment_title,
  a.class_id,
  c.name as class_name,
  c.teacher_id,
  p.full_name as student_name
FROM student_assignments sa
JOIN assignments a ON a.id = sa.assignment_id
JOIN classes c ON c.id = a.class_id
JOIN profiles p ON p.id = sa.student_id
WHERE sa.status = 'submitted'
ORDER BY sa.submitted_at ASC;

-- =============================================
-- 7. VIEW: THONG KE GIAO VIEN
-- =============================================

CREATE OR REPLACE VIEW teacher_stats AS
SELECT
  t.id as teacher_id,
  COUNT(DISTINCT c.id) as total_classes,
  COUNT(DISTINCT cs.student_id) as total_students,
  COUNT(DISTINCT a.id) as total_assignments,
  COUNT(DISTINCT CASE WHEN sa.status = 'submitted' THEN sa.id END) as pending_grading,
  COUNT(DISTINCT m.id) as unread_messages
FROM profiles t
LEFT JOIN classes c ON c.teacher_id = t.id AND c.is_active = true
LEFT JOIN class_students cs ON cs.class_id = c.id
LEFT JOIN assignments a ON a.class_id = c.id AND a.status = 'active'
LEFT JOIN student_assignments sa ON sa.assignment_id = a.id AND sa.status = 'submitted'
LEFT JOIN messages m ON m.receiver_id = t.id AND m.is_read = false
WHERE t.role = 'teacher'
GROUP BY t.id;

-- =============================================
-- HOAN THANH
-- =============================================
-- Da tao/cap nhat:
-- - Them cot cho bang lessons (teacher_id, school_id, status, vocabulary, quiz_questions, ...)
-- - Them cot cho bang assignments (assign_type, assigned_students, max_attempts, ...)
-- - Bang student_assignments: Chi tiet bai lam cua hoc sinh
-- - Bang messages: Tin nhan giua giao vien va phu huynh
-- - View pending_grading: Bai tap can cham diem
-- - View teacher_stats: Thong ke cho giao vien
