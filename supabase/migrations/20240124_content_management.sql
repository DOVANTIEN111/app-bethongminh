-- Content Management Tables for Admin
-- Run this in Supabase SQL Editor

-- 1. SUBJECTS TABLE (Môn học)
CREATE TABLE IF NOT EXISTS subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  name_en VARCHAR(100),
  description TEXT,
  icon VARCHAR(10) DEFAULT '📚',
  color VARCHAR(50) DEFAULT 'from-blue-400 to-blue-500',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. LESSONS TABLE (Bài học)
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  title_en VARCHAR(200),
  description TEXT,
  level INTEGER DEFAULT 1 CHECK (level >= 1 AND level <= 3),
  sort_order INTEGER DEFAULT 0,
  content JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. VOCABULARY TABLE (Từ vựng)
CREATE TABLE IF NOT EXISTS vocabulary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  word VARCHAR(200) NOT NULL,
  meaning VARCHAR(500) NOT NULL,
  pronunciation VARCHAR(200),
  example_sentence TEXT,
  image_url TEXT,
  audio_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. QUESTIONS TABLE (Câu hỏi Quiz)
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  type VARCHAR(50) DEFAULT 'multiple_choice' CHECK (type IN ('multiple_choice', 'fill_blank', 'listening', 'matching', 'speaking')),
  content TEXT NOT NULL,
  options JSONB DEFAULT '[]',
  correct_answer INTEGER DEFAULT 0,
  explanation TEXT,
  image_url TEXT,
  audio_url TEXT,
  difficulty INTEGER DEFAULT 1 CHECK (difficulty >= 1 AND difficulty <= 3),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. MEDIA TABLE (Thư viện Media)
CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  type VARCHAR(50) CHECK (type IN ('image', 'audio', 'video')),
  url TEXT NOT NULL,
  size INTEGER,
  mime_type VARCHAR(100),
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lessons_subject ON lessons(subject_id);
CREATE INDEX IF NOT EXISTS idx_vocabulary_lesson ON vocabulary(lesson_id);
CREATE INDEX IF NOT EXISTS idx_questions_lesson ON questions(lesson_id);
CREATE INDEX IF NOT EXISTS idx_media_type ON media(type);

-- Enable RLS
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subjects
CREATE POLICY "Public can view active subjects" ON subjects
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admin can manage subjects" ON subjects
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super_admin', 'school_admin')
    )
  );

-- RLS Policies for lessons
CREATE POLICY "Public can view active lessons" ON lessons
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admin can manage lessons" ON lessons
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super_admin', 'school_admin', 'teacher')
    )
  );

-- RLS Policies for vocabulary
CREATE POLICY "Public can view active vocabulary" ON vocabulary
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admin can manage vocabulary" ON vocabulary
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super_admin', 'school_admin', 'teacher')
    )
  );

-- RLS Policies for questions
CREATE POLICY "Public can view active questions" ON questions
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admin can manage questions" ON questions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super_admin', 'school_admin', 'teacher')
    )
  );

-- RLS Policies for media
CREATE POLICY "Public can view media" ON media
  FOR SELECT USING (true);

CREATE POLICY "Admin can manage media" ON media
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super_admin', 'school_admin', 'teacher')
    )
  );

-- Insert default subjects
INSERT INTO subjects (name, name_en, description, icon, color, sort_order) VALUES
  ('Tiếng Anh', 'English', 'Học từ vựng, nghe, nói tiếng Anh', '🇬🇧', 'from-blue-400 to-blue-500', 1),
  ('Toán', 'Math', 'Học đếm số, phép tính cơ bản', '🔢', 'from-green-400 to-green-500', 2),
  ('Tiếng Việt', 'Vietnamese', 'Học đọc, viết tiếng Việt', '📖', 'from-orange-400 to-orange-500', 3),
  ('Khoa học', 'Science', 'Khám phá thế giới xung quanh', '🔬', 'from-purple-400 to-purple-500', 4)
ON CONFLICT DO NOTHING;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_subjects_updated_at ON subjects;
CREATE TRIGGER update_subjects_updated_at
  BEFORE UPDATE ON subjects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_lessons_updated_at ON lessons;
CREATE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON lessons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_vocabulary_updated_at ON vocabulary;
CREATE TRIGGER update_vocabulary_updated_at
  BEFORE UPDATE ON vocabulary
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_questions_updated_at ON questions;
CREATE TRIGGER update_questions_updated_at
  BEFORE UPDATE ON questions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
