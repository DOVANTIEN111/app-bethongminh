-- Migration: Video Topics (Chu de) System for SchoolHub
-- Date: 2024-02-05

-- Bang chu de / chuong (video_topics)
CREATE TABLE IF NOT EXISTS video_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  subject TEXT NOT NULL, -- toan, tieng-viet, tieng-anh, khoa-hoc
  grade TEXT NOT NULL, -- lop-1, lop-2, lop-3...
  display_order INTEGER DEFAULT 0,
  video_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_free BOOLEAN DEFAULT false, -- Mien phi hay can Premium
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Them cot topic_id vao bang video_lessons
ALTER TABLE video_lessons ADD COLUMN IF NOT EXISTS topic_id UUID REFERENCES video_topics(id) ON DELETE SET NULL;

-- Tao index
CREATE INDEX IF NOT EXISTS idx_video_topics_subject ON video_topics(subject);
CREATE INDEX IF NOT EXISTS idx_video_topics_grade ON video_topics(grade);
CREATE INDEX IF NOT EXISTS idx_video_lessons_topic ON video_lessons(topic_id);

-- Tat RLS
ALTER TABLE video_topics DISABLE ROW LEVEL SECURITY;

-- Them du lieu mau cho cac chu de
INSERT INTO video_topics (title, description, subject, grade, display_order, is_free) VALUES
-- TOAN LOP 1
('Các số từ 0 đến 10', 'Học đếm và nhận biết các số từ 0 đến 10', 'toan', 'lop-1', 1, true),
('Phép cộng trong phạm vi 10', 'Học cộng các số từ 0 đến 10', 'toan', 'lop-1', 2, true),
('Phép trừ trong phạm vi 10', 'Học trừ các số từ 0 đến 10', 'toan', 'lop-1', 3, false),
('Các số từ 11 đến 20', 'Học đếm và nhận biết số từ 11 đến 20', 'toan', 'lop-1', 4, false),
('Hình học cơ bản', 'Nhận biết các hình vuông, tròn, tam giác', 'toan', 'lop-1', 5, false),

-- TOAN LOP 2
('Phép cộng có nhớ', 'Học phép cộng có nhớ trong phạm vi 100', 'toan', 'lop-2', 1, true),
('Phép trừ có nhớ', 'Học phép trừ có nhớ trong phạm vi 100', 'toan', 'lop-2', 2, false),
('Bảng nhân 2, 3, 4, 5', 'Học thuộc bảng nhân', 'toan', 'lop-2', 3, false),

-- TOAN LOP 3
('Phép nhân và chia', 'Ôn tập phép nhân, học phép chia', 'toan', 'lop-3', 1, true),
('Phân số', 'Giới thiệu về phân số', 'toan', 'lop-3', 2, false),

-- TIENG VIET LOP 1
('Học vần - Phần 1', 'Học các chữ cái A, B, C, D, Đ, E', 'tieng-viet', 'lop-1', 1, true),
('Học vần - Phần 2', 'Học các chữ cái G, H, I, K, L, M, N', 'tieng-viet', 'lop-1', 2, true),
('Học vần - Phần 3', 'Học các chữ cái O, Ô, Ơ, P, Q, R, S, T', 'tieng-viet', 'lop-1', 3, false),
('Học vần - Phần 4', 'Học các chữ cái U, Ư, V, X, Y', 'tieng-viet', 'lop-1', 4, false),
('Ghép vần đơn giản', 'Học ghép vần an, at, ac, am...', 'tieng-viet', 'lop-1', 5, false),
('Tập đọc', 'Đọc các bài văn ngắn', 'tieng-viet', 'lop-1', 6, false),

-- TIENG VIET LOP 2
('Chính tả', 'Luyện viết chính tả', 'tieng-viet', 'lop-2', 1, true),
('Tập làm văn', 'Viết đoạn văn ngắn', 'tieng-viet', 'lop-2', 2, false),

-- TIENG ANH LOP 1
('Alphabet', 'Học bảng chữ cái tiếng Anh', 'tieng-anh', 'lop-1', 1, true),
('Numbers 1-10', 'Học số đếm từ 1 đến 10', 'tieng-anh', 'lop-1', 2, true),
('Colors', 'Học các màu sắc', 'tieng-anh', 'lop-1', 3, false),
('Animals', 'Học tên các con vật', 'tieng-anh', 'lop-1', 4, false),
('Family', 'Học về gia đình', 'tieng-anh', 'lop-1', 5, false),

-- TIENG ANH LOP 2
('Fruits', 'Học tên các loại trái cây', 'tieng-anh', 'lop-2', 1, true),
('Body Parts', 'Học các bộ phận cơ thể', 'tieng-anh', 'lop-2', 2, false),

-- KHOA HOC LOP 1
('Cơ thể người', 'Tìm hiểu về cơ thể người', 'khoa-hoc', 'lop-1', 1, true),
('Động vật', 'Tìm hiểu về các loài động vật', 'khoa-hoc', 'lop-1', 2, false),
('Thực vật', 'Tìm hiểu về cây cối', 'khoa-hoc', 'lop-1', 3, false),

-- KHOA HOC LOP 2
('Thời tiết', 'Tìm hiểu về các hiện tượng thời tiết', 'khoa-hoc', 'lop-2', 1, true),
('Môi trường', 'Bảo vệ môi trường', 'khoa-hoc', 'lop-2', 2, false)

ON CONFLICT DO NOTHING;
