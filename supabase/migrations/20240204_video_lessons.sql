-- Migration: Video Lessons System for SchoolHub
-- Date: 2024-02-04

-- Bang video lessons (bai hoc video)
CREATE TABLE IF NOT EXISTS video_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  youtube_url TEXT NOT NULL,
  youtube_id TEXT NOT NULL,
  thumbnail_url TEXT,
  duration INTEGER, -- thoi luong tinh bang giay
  subject TEXT NOT NULL, -- toan, tieng-viet, tieng-anh, khoa-hoc, ky-nang
  grade TEXT, -- mam-non, lop-1, lop-2, lop-3, lop-4, lop-5
  category TEXT, -- bai-giang, luyen-tap, kien-thuc, giai-tri
  tags TEXT[], -- array cac tag
  teacher_name TEXT, -- ten giao vien trong video
  channel_name TEXT, -- ten kenh youtube
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bang playlist (danh sach phat)
CREATE TABLE IF NOT EXISTS video_playlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  subject TEXT,
  grade TEXT,
  video_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bang lien ket playlist va video
CREATE TABLE IF NOT EXISTS playlist_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id UUID REFERENCES video_playlists(id) ON DELETE CASCADE,
  video_id UUID REFERENCES video_lessons(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0,
  UNIQUE(playlist_id, video_id)
);

-- Bang lich su xem video cua hoc sinh
CREATE TABLE IF NOT EXISTS video_watch_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  video_id UUID REFERENCES video_lessons(id) ON DELETE CASCADE,
  watch_duration INTEGER DEFAULT 0, -- da xem bao nhieu giay
  completed BOOLEAN DEFAULT false,
  last_position INTEGER DEFAULT 0, -- vi tri dung lai
  watched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, video_id)
);

-- Bang video yeu thich
CREATE TABLE IF NOT EXISTS video_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  video_id UUID REFERENCES video_lessons(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, video_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_video_lessons_subject ON video_lessons(subject);
CREATE INDEX IF NOT EXISTS idx_video_lessons_grade ON video_lessons(grade);
CREATE INDEX IF NOT EXISTS idx_video_lessons_featured ON video_lessons(is_featured);
CREATE INDEX IF NOT EXISTS idx_video_lessons_active ON video_lessons(is_active);
CREATE INDEX IF NOT EXISTS idx_video_watch_history_user ON video_watch_history(user_id);
CREATE INDEX IF NOT EXISTS idx_video_favorites_user ON video_favorites(user_id);

-- Tat RLS de don gian
ALTER TABLE video_lessons DISABLE ROW LEVEL SECURITY;
ALTER TABLE video_playlists DISABLE ROW LEVEL SECURITY;
ALTER TABLE playlist_videos DISABLE ROW LEVEL SECURITY;
ALTER TABLE video_watch_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE video_favorites DISABLE ROW LEVEL SECURITY;
