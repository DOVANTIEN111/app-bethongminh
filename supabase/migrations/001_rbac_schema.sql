-- =====================================================
-- ROLE-BASED ACCESS CONTROL (RBAC) SCHEMA
-- Version: 1.0.0
-- =====================================================

-- 1. ENUM cho roles
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin', 'teacher', 'parent', 'student');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. Bảng USERS (mở rộng từ auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'student',
  name TEXT NOT NULL,
  avatar TEXT DEFAULT '👤',
  phone TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index cho tìm kiếm
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- 3. Bảng CLASSES (Lớp học)
CREATE TABLE IF NOT EXISTS public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  teacher_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  grade_level INTEGER DEFAULT 1, -- Lớp 1-5
  school_year TEXT, -- Năm học: 2024-2025
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_classes_teacher ON public.classes(teacher_id);

-- 4. Bảng CLASS_STUDENTS (Học sinh trong lớp)
CREATE TABLE IF NOT EXISTS public.class_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(class_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_class_students_class ON public.class_students(class_id);
CREATE INDEX IF NOT EXISTS idx_class_students_student ON public.class_students(student_id);

-- 5. Bảng PARENT_STUDENT (Quan hệ phụ huynh - học sinh)
CREATE TABLE IF NOT EXISTS public.parent_student (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  relationship TEXT DEFAULT 'parent', -- parent, guardian, grandparent
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(parent_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_parent_student_parent ON public.parent_student(parent_id);
CREATE INDEX IF NOT EXISTS idx_parent_student_student ON public.parent_student(student_id);

-- 6. Bảng ASSIGNMENTS (Bài tập được giao)
CREATE TABLE IF NOT EXISTS public.assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  subject TEXT, -- math, vietnamese, english, science, lifeskills
  lesson_ids TEXT[], -- Danh sách bài học cần làm
  deadline TIMESTAMPTZ,
  max_score INTEGER DEFAULT 100,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assignments_class ON public.assignments(class_id);
CREATE INDEX IF NOT EXISTS idx_assignments_teacher ON public.assignments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_assignments_deadline ON public.assignments(deadline);

-- 7. Bảng STUDENT_PROGRESS (Tiến độ học sinh)
CREATE TABLE IF NOT EXISTS public.student_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  score INTEGER DEFAULT 0,
  max_score INTEGER DEFAULT 100,
  attempts INTEGER DEFAULT 1,
  time_spent INTEGER DEFAULT 0, -- Thời gian làm bài (giây)
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  assignment_id UUID REFERENCES public.assignments(id) ON DELETE SET NULL,
  UNIQUE(student_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_student_progress_student ON public.student_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_subject ON public.student_progress(subject);
CREATE INDEX IF NOT EXISTS idx_student_progress_assignment ON public.student_progress(assignment_id);

-- 8. Bảng ASSIGNMENT_SUBMISSIONS (Bài nộp)
CREATE TABLE IF NOT EXISTS public.assignment_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  score INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending', -- pending, completed, late
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  graded_at TIMESTAMPTZ,
  feedback TEXT,
  UNIQUE(assignment_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_submissions_assignment ON public.assignment_submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student ON public.assignment_submissions(student_id);

-- 9. Bảng TIME_LIMITS (Giới hạn thời gian - cho phụ huynh)
CREATE TABLE IF NOT EXISTS public.time_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  daily_limit_minutes INTEGER DEFAULT 60, -- Giới hạn hàng ngày
  start_hour INTEGER DEFAULT 8, -- Giờ bắt đầu được học
  end_hour INTEGER DEFAULT 20, -- Giờ kết thúc
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(parent_id, student_id)
);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_student ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_limits ENABLE ROW LEVEL SECURITY;

-- Policy: Users có thể xem thông tin của mình
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Policy: Users có thể cập nhật thông tin của mình
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Policy: Admin có thể xem tất cả users
CREATE POLICY "Admin can view all users" ON public.users
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Policy: Admin có thể cập nhật tất cả users
CREATE POLICY "Admin can update all users" ON public.users
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Policy: Teacher có thể xem học sinh trong lớp của mình
CREATE POLICY "Teacher can view class students" ON public.users
  FOR SELECT USING (
    role = 'student' AND
    EXISTS (
      SELECT 1 FROM public.class_students cs
      JOIN public.classes c ON cs.class_id = c.id
      WHERE cs.student_id = users.id AND c.teacher_id = auth.uid()
    )
  );

-- Policy: Parent có thể xem con của mình
CREATE POLICY "Parent can view their children" ON public.users
  FOR SELECT USING (
    role = 'student' AND
    EXISTS (SELECT 1 FROM public.parent_student WHERE parent_id = auth.uid() AND student_id = users.id)
  );

-- Policy: Classes - Teacher có thể quản lý lớp của mình
CREATE POLICY "Teacher can manage own classes" ON public.classes
  FOR ALL USING (teacher_id = auth.uid());

-- Policy: Classes - Admin có thể xem tất cả
CREATE POLICY "Admin can view all classes" ON public.classes
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Policy: Student có thể xem lớp của mình
CREATE POLICY "Student can view own classes" ON public.classes
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.class_students WHERE class_id = id AND student_id = auth.uid())
  );

-- Policy: Assignments - Teacher có thể quản lý
CREATE POLICY "Teacher can manage assignments" ON public.assignments
  FOR ALL USING (teacher_id = auth.uid());

-- Policy: Student có thể xem bài tập của lớp mình
CREATE POLICY "Student can view class assignments" ON public.assignments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.class_students WHERE class_id = assignments.class_id AND student_id = auth.uid())
  );

-- Policy: Student progress - Student có thể xem/cập nhật của mình
CREATE POLICY "Student can manage own progress" ON public.student_progress
  FOR ALL USING (student_id = auth.uid());

-- Policy: Teacher có thể xem progress của học sinh trong lớp
CREATE POLICY "Teacher can view student progress" ON public.student_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.class_students cs
      JOIN public.classes c ON cs.class_id = c.id
      WHERE cs.student_id = student_progress.student_id AND c.teacher_id = auth.uid()
    )
  );

-- Policy: Parent có thể xem progress của con
CREATE POLICY "Parent can view children progress" ON public.student_progress
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.parent_student WHERE parent_id = auth.uid() AND student_id = student_progress.student_id)
  );

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function: Tạo user profile khi đăng ký
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student'),
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Tự động tạo profile khi đăng ký
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function: Lấy role của user hiện tại
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
BEGIN
  RETURN (SELECT role FROM public.users WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Kiểm tra quyền admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Thống kê cho admin
CREATE OR REPLACE FUNCTION public.get_admin_stats()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_users', (SELECT COUNT(*) FROM public.users),
    'total_students', (SELECT COUNT(*) FROM public.users WHERE role = 'student'),
    'total_teachers', (SELECT COUNT(*) FROM public.users WHERE role = 'teacher'),
    'total_parents', (SELECT COUNT(*) FROM public.users WHERE role = 'parent'),
    'total_classes', (SELECT COUNT(*) FROM public.classes),
    'total_assignments', (SELECT COUNT(*) FROM public.assignments),
    'total_submissions', (SELECT COUNT(*) FROM public.assignment_submissions)
  ) INTO result;
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Thống kê cho giáo viên
CREATE OR REPLACE FUNCTION public.get_teacher_stats(p_teacher_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_classes', (SELECT COUNT(*) FROM public.classes WHERE teacher_id = p_teacher_id),
    'total_students', (
      SELECT COUNT(DISTINCT cs.student_id)
      FROM public.class_students cs
      JOIN public.classes c ON cs.class_id = c.id
      WHERE c.teacher_id = p_teacher_id
    ),
    'total_assignments', (SELECT COUNT(*) FROM public.assignments WHERE teacher_id = p_teacher_id),
    'pending_submissions', (
      SELECT COUNT(*)
      FROM public.assignment_submissions asub
      JOIN public.assignments a ON asub.assignment_id = a.id
      WHERE a.teacher_id = p_teacher_id AND asub.status = 'pending'
    )
  ) INTO result;
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Lấy tiến độ học sinh cho phụ huynh
CREATE OR REPLACE FUNCTION public.get_student_progress_for_parent(p_student_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_lessons', (SELECT COUNT(*) FROM public.student_progress WHERE student_id = p_student_id),
    'total_score', (SELECT COALESCE(SUM(score), 0) FROM public.student_progress WHERE student_id = p_student_id),
    'avg_score', (SELECT COALESCE(AVG(score), 0)::INTEGER FROM public.student_progress WHERE student_id = p_student_id),
    'total_time_minutes', (SELECT COALESCE(SUM(time_spent), 0) / 60 FROM public.student_progress WHERE student_id = p_student_id),
    'by_subject', (
      SELECT json_agg(json_build_object(
        'subject', subject,
        'completed', COUNT(*),
        'avg_score', COALESCE(AVG(score), 0)::INTEGER
      ))
      FROM public.student_progress
      WHERE student_id = p_student_id
      GROUP BY subject
    )
  ) INTO result;
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- SAMPLE DATA FOR TESTING (Optional)
-- =====================================================

-- Tạo admin user (chạy sau khi đăng ký admin qua UI)
-- UPDATE public.users SET role = 'admin' WHERE email = 'admin@gdtm.vn';
