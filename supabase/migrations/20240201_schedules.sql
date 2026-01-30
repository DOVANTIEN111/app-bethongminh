-- =============================================
-- SUPABASE MIGRATION: Schedules (Thoi khoa bieu)
-- Tao bang quan ly thoi khoa bieu truong hoc
-- =============================================

-- =============================================
-- 1. BANG SCHEDULES (Thoi khoa bieu)
-- =============================================

CREATE TABLE IF NOT EXISTS schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE NOT NULL,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE NOT NULL,
  teacher_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  period INTEGER NOT NULL CHECK (period >= 1 AND period <= 12),
  start_time TIME,
  end_time TIME,
  room TEXT,
  semester TEXT,
  academic_year TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Unique constraint: mot lop chi co 1 tiet hoc tai 1 slot
  UNIQUE(class_id, day_of_week, period)
);

-- Comment cho bang
COMMENT ON TABLE schedules IS 'Thoi khoa bieu cac lop hoc';
COMMENT ON COLUMN schedules.day_of_week IS '0=Chu nhat, 1=Thu 2, ..., 6=Thu 7';
COMMENT ON COLUMN schedules.period IS 'Tiet hoc trong ngay (1-12)';

-- Index cho schedules
CREATE INDEX IF NOT EXISTS idx_schedules_school_id ON schedules(school_id);
CREATE INDEX IF NOT EXISTS idx_schedules_class_id ON schedules(class_id);
CREATE INDEX IF NOT EXISTS idx_schedules_teacher_id ON schedules(teacher_id);
CREATE INDEX IF NOT EXISTS idx_schedules_day_period ON schedules(day_of_week, period);

-- RLS cho schedules
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

-- Policy: Ai cung doc duoc schedules cua truong minh
CREATE POLICY "schedules_select_policy" ON schedules
FOR SELECT USING (
  school_id IN (SELECT school_id FROM profiles WHERE id = auth.uid())
);

-- Policy: School admin va teacher co the them/sua
CREATE POLICY "schedules_insert_policy" ON schedules
FOR INSERT WITH CHECK (
  school_id IN (SELECT school_id FROM profiles WHERE id = auth.uid() AND role IN ('school_admin', 'teacher'))
);

CREATE POLICY "schedules_update_policy" ON schedules
FOR UPDATE USING (
  school_id IN (SELECT school_id FROM profiles WHERE id = auth.uid() AND role IN ('school_admin', 'teacher'))
);

CREATE POLICY "schedules_delete_policy" ON schedules
FOR DELETE USING (
  school_id IN (SELECT school_id FROM profiles WHERE id = auth.uid() AND role = 'school_admin')
);


-- =============================================
-- 2. THEM COT marked_by VAO teacher_attendance
-- =============================================

ALTER TABLE teacher_attendance ADD COLUMN IF NOT EXISTS marked_by UUID REFERENCES profiles(id) ON DELETE SET NULL;


-- =============================================
-- 3. TRIGGER CAP NHAT updated_at
-- =============================================

CREATE OR REPLACE FUNCTION update_schedules_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS schedules_updated_at ON schedules;
CREATE TRIGGER schedules_updated_at
  BEFORE UPDATE ON schedules
  FOR EACH ROW EXECUTE FUNCTION update_schedules_updated_at();


-- =============================================
-- 4. VIEW: Lich hoc theo ngay
-- =============================================

CREATE OR REPLACE VIEW daily_schedule AS
SELECT
  s.id,
  s.school_id,
  s.class_id,
  c.name as class_name,
  s.subject,
  s.day_of_week,
  s.period,
  s.start_time,
  s.end_time,
  s.room,
  s.teacher_id,
  p.full_name as teacher_name
FROM schedules s
JOIN classes c ON c.id = s.class_id
LEFT JOIN profiles p ON p.id = s.teacher_id
WHERE s.is_active = true
ORDER BY s.day_of_week, s.period;


-- =============================================
-- HOAN THANH
-- =============================================
-- Da tao:
-- - Bang schedules: Thoi khoa bieu
-- - Them cot marked_by vao teacher_attendance
-- - Trigger cap nhat updated_at
-- - View daily_schedule
