-- =============================================
-- DU LIEU MAU CHO SCHOOLHUB - TEST FULL APP
-- Chay file nay trong Supabase SQL Editor
-- =============================================

-- 1. TAO 2 TRUONG HOC
INSERT INTO schools (id, name, email, phone, address, created_at) VALUES
('11111111-1111-1111-1111-111111111111', 'Trường Tiểu học Ngôi Sao', 'ngoisao@school.edu.vn', '0901111111', '123 Đường Nguyễn Huệ, Q.1, TP.HCM', NOW()),
('22222222-2222-2222-2222-222222222222', 'Trường Tiểu học Ánh Dương', 'anhduong@school.edu.vn', '0902222222', '456 Đường Lê Lợi, Q.3, TP.HCM', NOW())
ON CONFLICT (id) DO NOTHING;

-- 2. TAO BO PHAN CHO TRUONG 1
INSERT INTO departments (id, school_id, name, description, is_active, created_at) VALUES
('d1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Khối Lớp 1', 'Bộ phận quản lý lớp 1', true, NOW()),
('d2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Khối Lớp 2', 'Bộ phận quản lý lớp 2', true, NOW()),
('d3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Khối Lớp 3', 'Bộ phận quản lý lớp 3', true, NOW()),
('d4444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'Tổ Toán', 'Tổ bộ môn Toán', true, NOW()),
('d5555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'Tổ Tiếng Việt', 'Tổ bộ môn Tiếng Việt', true, NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. TAO HIEU TRUONG TRUONG 1
INSERT INTO profiles (id, email, full_name, phone, role, school_id, is_active, created_at) VALUES
('ht111111-1111-1111-1111-111111111111', 'hieutruong@ngoisao.edu.vn', 'Nguyễn Văn Hiệu', '0911111111', 'school_admin', '11111111-1111-1111-1111-111111111111', true, NOW())
ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, school_id = EXCLUDED.school_id;

-- 4. TAO 10 GIAO VIEN CHO TRUONG 1
INSERT INTO profiles (id, email, full_name, phone, role, school_id, department_id, is_active, created_at) VALUES
('gv111111-1111-1111-1111-111111111111', 'gv1.ngoisao@test.com', 'Trần Thị Mai', '0912111111', 'teacher', '11111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', true, NOW()),
('gv222222-2222-2222-2222-222222222222', 'gv2.ngoisao@test.com', 'Lê Văn Hùng', '0912222222', 'teacher', '11111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', true, NOW()),
('gv333333-3333-3333-3333-333333333333', 'gv3.ngoisao@test.com', 'Phạm Thị Lan', '0912333333', 'teacher', '11111111-1111-1111-1111-111111111111', 'd2222222-2222-2222-2222-222222222222', true, NOW()),
('gv444444-4444-4444-4444-444444444444', 'gv4.ngoisao@test.com', 'Hoàng Văn Nam', '0912444444', 'teacher', '11111111-1111-1111-1111-111111111111', 'd2222222-2222-2222-2222-222222222222', true, NOW()),
('gv555555-5555-5555-5555-555555555555', 'gv5.ngoisao@test.com', 'Ngô Thị Hoa', '0912555555', 'teacher', '11111111-1111-1111-1111-111111111111', 'd3333333-3333-3333-3333-333333333333', true, NOW()),
('gv666666-6666-6666-6666-666666666666', 'gv6.ngoisao@test.com', 'Đặng Văn Tuấn', '0912666666', 'teacher', '11111111-1111-1111-1111-111111111111', 'd3333333-3333-3333-3333-333333333333', true, NOW()),
('gv777777-7777-7777-7777-777777777777', 'gv7.ngoisao@test.com', 'Vũ Thị Ngọc', '0912777777', 'teacher', '11111111-1111-1111-1111-111111111111', 'd4444444-4444-4444-4444-444444444444', true, NOW()),
('gv888888-8888-8888-8888-888888888888', 'gv8.ngoisao@test.com', 'Bùi Văn Đức', '0912888888', 'teacher', '11111111-1111-1111-1111-111111111111', 'd4444444-4444-4444-4444-444444444444', true, NOW()),
('gv999999-9999-9999-9999-999999999999', 'gv9.ngoisao@test.com', 'Lý Thị Hằng', '0912999999', 'teacher', '11111111-1111-1111-1111-111111111111', 'd5555555-5555-5555-5555-555555555555', true, NOW()),
('gv101010-1010-1010-1010-101010101010', 'gv10.ngoisao@test.com', 'Trịnh Văn Phong', '0913000000', 'teacher', '11111111-1111-1111-1111-111111111111', 'd5555555-5555-5555-5555-555555555555', true, NOW())
ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, school_id = EXCLUDED.school_id, department_id = EXCLUDED.department_id;

-- 5. TAO 6 LOP HOC CHO TRUONG 1
INSERT INTO classes (id, name, school_id, department_id, teacher_id, grade, description, is_active, created_at) VALUES
('lop11111-1111-1111-1111-111111111111', 'Lớp 1A', '11111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'gv111111-1111-1111-1111-111111111111', '1', 'GVCN: Cô Mai', true, NOW()),
('lop22222-2222-2222-2222-222222222222', 'Lớp 1B', '11111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'gv222222-2222-2222-2222-222222222222', '1', 'GVCN: Thầy Hùng', true, NOW()),
('lop33333-3333-3333-3333-333333333333', 'Lớp 2A', '11111111-1111-1111-1111-111111111111', 'd2222222-2222-2222-2222-222222222222', 'gv333333-3333-3333-3333-333333333333', '2', 'GVCN: Cô Lan', true, NOW()),
('lop44444-4444-4444-4444-444444444444', 'Lớp 2B', '11111111-1111-1111-1111-111111111111', 'd2222222-2222-2222-2222-222222222222', 'gv444444-4444-4444-4444-444444444444', '2', 'GVCN: Thầy Nam', true, NOW()),
('lop55555-5555-5555-5555-555555555555', 'Lớp 3A', '11111111-1111-1111-1111-111111111111', 'd3333333-3333-3333-3333-333333333333', 'gv555555-5555-5555-5555-555555555555', '3', 'GVCN: Cô Hoa', true, NOW()),
('lop66666-6666-6666-6666-666666666666', 'Lớp 3B', '11111111-1111-1111-1111-111111111111', 'd3333333-3333-3333-3333-333333333333', 'gv666666-6666-6666-6666-666666666666', '3', 'GVCN: Thầy Tuấn', true, NOW())
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, teacher_id = EXCLUDED.teacher_id;

-- 6. TAO 30 HOC SINH (5 HS/lop)
-- Lop 1A
INSERT INTO profiles (id, email, full_name, role, school_id, class_id, parent_name, parent_phone, parent_pin, is_active, created_at) VALUES
('hs111111-0001-1111-1111-111111111111', 'hs1.1a@test.com', 'Nguyễn Minh Anh', 'student', '11111111-1111-1111-1111-111111111111', 'lop11111-1111-1111-1111-111111111111', 'Nguyễn Văn An', '0971111111', 'MTIzNA==', true, NOW()),
('hs111111-0002-1111-1111-111111111111', 'hs2.1a@test.com', 'Trần Bảo Châu', 'student', '11111111-1111-1111-1111-111111111111', 'lop11111-1111-1111-1111-111111111111', 'Trần Văn Bình', '0971111112', 'MjM0NQ==', true, NOW()),
('hs111111-0003-1111-1111-111111111111', 'hs3.1a@test.com', 'Lê Hoàng Dương', 'student', '11111111-1111-1111-1111-111111111111', 'lop11111-1111-1111-1111-111111111111', 'Lê Thị Cúc', '0971111113', 'MzQ1Ng==', true, NOW()),
('hs111111-0004-1111-1111-111111111111', 'hs4.1a@test.com', 'Phạm Khánh Linh', 'student', '11111111-1111-1111-1111-111111111111', 'lop11111-1111-1111-1111-111111111111', 'Phạm Văn Dũng', '0971111114', 'NDU2Nw==', true, NOW()),
('hs111111-0005-1111-1111-111111111111', 'hs5.1a@test.com', 'Hoàng Gia Huy', 'student', '11111111-1111-1111-1111-111111111111', 'lop11111-1111-1111-1111-111111111111', 'Hoàng Thị Em', '0971111115', 'NTY3OA==', true, NOW()),
-- Lop 1B
('hs222222-0001-2222-2222-222222222222', 'hs1.1b@test.com', 'Vũ Quỳnh Như', 'student', '11111111-1111-1111-1111-111111111111', 'lop22222-2222-2222-2222-222222222222', 'Vũ Văn Phúc', '0972111111', 'MTExMQ==', true, NOW()),
('hs222222-0002-2222-2222-222222222222', 'hs2.1b@test.com', 'Đặng Tuấn Kiệt', 'student', '11111111-1111-1111-1111-111111111111', 'lop22222-2222-2222-2222-222222222222', 'Đặng Thị Giang', '0972111112', 'MjIyMg==', true, NOW()),
('hs222222-0003-2222-2222-222222222222', 'hs3.1b@test.com', 'Bùi Thanh Tâm', 'student', '11111111-1111-1111-1111-111111111111', 'lop22222-2222-2222-2222-222222222222', 'Bùi Văn Hải', '0972111113', 'MzMzMw==', true, NOW()),
('hs222222-0004-2222-2222-222222222222', 'hs4.1b@test.com', 'Lý Phương Trinh', 'student', '11111111-1111-1111-1111-111111111111', 'lop22222-2222-2222-2222-222222222222', 'Lý Văn Ích', '0972111114', 'NDQ0NA==', true, NOW()),
('hs222222-0005-2222-2222-222222222222', 'hs5.1b@test.com', 'Ngô Đức Thịnh', 'student', '11111111-1111-1111-1111-111111111111', 'lop22222-2222-2222-2222-222222222222', 'Ngô Thị Kim', '0972111115', 'NTU1NQ==', true, NOW()),
-- Lop 2A
('hs333333-0001-3333-3333-333333333333', 'hs1.2a@test.com', 'Trịnh Hải Yến', 'student', '11111111-1111-1111-1111-111111111111', 'lop33333-3333-3333-3333-333333333333', 'Trịnh Văn Long', '0973111111', 'NjY2Ng==', true, NOW()),
('hs333333-0002-3333-3333-333333333333', 'hs2.2a@test.com', 'Đinh Công Minh', 'student', '11111111-1111-1111-1111-111111111111', 'lop33333-3333-3333-3333-333333333333', 'Đinh Thị Mai', '0973111112', 'Nzc3Nw==', true, NOW()),
('hs333333-0003-3333-3333-333333333333', 'hs3.2a@test.com', 'Dương Thu Hà', 'student', '11111111-1111-1111-1111-111111111111', 'lop33333-3333-3333-3333-333333333333', 'Dương Văn Năm', '0973111113', 'ODg4OA==', true, NOW()),
('hs333333-0004-3333-3333-333333333333', 'hs4.2a@test.com', 'Tô Quốc Bảo', 'student', '11111111-1111-1111-1111-111111111111', 'lop33333-3333-3333-3333-333333333333', 'Tô Thị Oanh', '0973111114', 'OTk5OQ==', true, NOW()),
('hs333333-0005-3333-3333-333333333333', 'hs5.2a@test.com', 'Cao Việt Anh', 'student', '11111111-1111-1111-1111-111111111111', 'lop33333-3333-3333-3333-333333333333', 'Cao Văn Phát', '0973111115', 'MTAxMA==', true, NOW()),
-- Lop 2B
('hs444444-0001-4444-4444-444444444444', 'hs1.2b@test.com', 'Phan Ngọc Ánh', 'student', '11111111-1111-1111-1111-111111111111', 'lop44444-4444-4444-4444-444444444444', 'Phan Văn Quang', '0974111111', 'MTIxMg==', true, NOW()),
('hs444444-0002-4444-4444-444444444444', 'hs2.2b@test.com', 'Hồ Thanh Sơn', 'student', '11111111-1111-1111-1111-111111111111', 'lop44444-4444-4444-4444-444444444444', 'Hồ Thị Rạng', '0974111112', 'MTMxMw==', true, NOW()),
('hs444444-0003-4444-4444-444444444444', 'hs3.2b@test.com', 'La Thị Tuyết', 'student', '11111111-1111-1111-1111-111111111111', 'lop44444-4444-4444-4444-444444444444', 'La Văn Sen', '0974111113', 'MTQxNA==', true, NOW()),
('hs444444-0004-4444-4444-444444444444', 'hs4.2b@test.com', 'Mạc Đình Khoa', 'student', '11111111-1111-1111-1111-111111111111', 'lop44444-4444-4444-4444-444444444444', 'Mạc Thị Tâm', '0974111114', 'MTUxNQ==', true, NOW()),
('hs444444-0005-4444-4444-444444444444', 'hs5.2b@test.com', 'Châu Uyên Nhi', 'student', '11111111-1111-1111-1111-111111111111', 'lop44444-4444-4444-4444-444444444444', 'Châu Văn Út', '0974111115', 'MTYxNg==', true, NOW()),
-- Lop 3A
('hs555555-0001-5555-5555-555555555555', 'hs1.3a@test.com', 'Kiều Anh Thư', 'student', '11111111-1111-1111-1111-111111111111', 'lop55555-5555-5555-5555-555555555555', 'Kiều Văn Vũ', '0975111111', 'MTcxNw==', true, NOW()),
('hs555555-0002-5555-5555-555555555555', 'hs2.3a@test.com', 'Tạ Minh Quân', 'student', '11111111-1111-1111-1111-111111111111', 'lop55555-5555-5555-5555-555555555555', 'Tạ Thị Xuân', '0975111112', 'MTgxOA==', true, NOW()),
('hs555555-0003-5555-5555-555555555555', 'hs3.3a@test.com', 'Giang Bích Ngọc', 'student', '11111111-1111-1111-1111-111111111111', 'lop55555-5555-5555-5555-555555555555', 'Giang Văn Yên', '0975111113', 'MTkxOQ==', true, NOW()),
('hs555555-0004-5555-5555-555555555555', 'hs4.3a@test.com', 'Quách Hữu Tài', 'student', '11111111-1111-1111-1111-111111111111', 'lop55555-5555-5555-5555-555555555555', 'Quách Thị Zin', '0975111114', 'MjAyMA==', true, NOW()),
('hs555555-0005-5555-5555-555555555555', 'hs5.3a@test.com', 'Sầm Diệu Linh', 'student', '11111111-1111-1111-1111-111111111111', 'lop55555-5555-5555-5555-555555555555', 'Sầm Văn Ái', '0975111115', 'MjEyMQ==', true, NOW()),
-- Lop 3B
('hs666666-0001-6666-6666-666666666666', 'hs1.3b@test.com', 'Thái Bảo Long', 'student', '11111111-1111-1111-1111-111111111111', 'lop66666-6666-6666-6666-666666666666', 'Thái Văn Bền', '0976111111', 'MjMyMw==', true, NOW()),
('hs666666-0002-6666-6666-666666666666', 'hs2.3b@test.com', 'Từ Như Quỳnh', 'student', '11111111-1111-1111-1111-111111111111', 'lop66666-6666-6666-6666-666666666666', 'Từ Thị Cẩm', '0976111112', 'MjQyNA==', true, NOW()),
('hs666666-0003-6666-6666-666666666666', 'hs3.3b@test.com', 'Ông Hoàng Phú', 'student', '11111111-1111-1111-1111-111111111111', 'lop66666-6666-6666-6666-666666666666', 'Ông Văn Đạt', '0976111113', 'MjUyNQ==', true, NOW()),
('hs666666-0004-6666-6666-666666666666', 'hs4.3b@test.com', 'Tiêu Thùy Dung', 'student', '11111111-1111-1111-1111-111111111111', 'lop66666-6666-6666-6666-666666666666', 'Tiêu Văn Ên', '0976111114', 'MjYyNg==', true, NOW()),
('hs666666-0005-6666-6666-666666666666', 'hs5.3b@test.com', 'Âu Chí Tâm', 'student', '11111111-1111-1111-1111-111111111111', 'lop66666-6666-6666-6666-666666666666', 'Âu Thị Phương', '0976111115', 'MjcyNw==', true, NOW())
ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, school_id = EXCLUDED.school_id, class_id = EXCLUDED.class_id;

-- 7. TAO SU KIEN TRUONG HOC
INSERT INTO school_events (id, school_id, title, description, event_date, event_type, location, created_at) VALUES
('ev111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Họp phụ huynh đầu năm', 'Họp phụ huynh toàn trường đầu năm học 2024-2025', CURRENT_DATE + INTERVAL '7 days', 'meeting', 'Hội trường lớn', NOW()),
('ev222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Kiểm tra giữa kỳ 1', 'Kiểm tra giữa học kỳ 1 cho tất cả các khối', CURRENT_DATE + INTERVAL '30 days', 'exam', 'Các phòng học', NOW()),
('ev333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Ngày hội thể thao', 'Ngày hội thể thao chào mừng 20/11', CURRENT_DATE + INTERVAL '45 days', 'activity', 'Sân trường', NOW())
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- KIEM TRA KET QUA
-- =============================================
SELECT 'Truong hoc' as loai, COUNT(*) as so_luong FROM schools
UNION ALL SELECT 'Bo phan', COUNT(*) FROM departments
UNION ALL SELECT 'Giao vien', COUNT(*) FROM profiles WHERE role = 'teacher'
UNION ALL SELECT 'Hoc sinh', COUNT(*) FROM profiles WHERE role = 'student'
UNION ALL SELECT 'Hieu truong', COUNT(*) FROM profiles WHERE role = 'school_admin'
UNION ALL SELECT 'Lop hoc', COUNT(*) FROM classes
UNION ALL SELECT 'Su kien', COUNT(*) FROM school_events;
