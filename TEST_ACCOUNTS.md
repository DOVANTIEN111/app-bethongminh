# TÀI KHOẢN TEST SCHOOLHUB

## Hướng dẫn sử dụng
1. Chạy file `supabase/migrations/seed_test_data.sql` trong Supabase SQL Editor
2. Đăng nhập với các tài khoản bên dưới (mật khẩu mặc định)
3. Lưu ý: Các tài khoản test chỉ có profile, không có auth account. Cần tạo auth account nếu muốn đăng nhập thực sự.

---

## Trường Tiểu học Ngôi Sao
**ID:** `11111111-1111-1111-1111-111111111111`

### Hiệu trưởng
| Email | Họ tên | SĐT |
|-------|--------|-----|
| hieutruong@ngoisao.edu.vn | Nguyễn Văn Hiệu | 0911111111 |

**Mật khẩu:** `School@123`

---

### Giáo viên (10 người)
| Email | Họ tên | SĐT | Bộ phận |
|-------|--------|-----|---------|
| gv1.ngoisao@test.com | Trần Thị Mai | 0912111111 | Khối Lớp 1 |
| gv2.ngoisao@test.com | Lê Văn Hùng | 0912222222 | Khối Lớp 1 |
| gv3.ngoisao@test.com | Phạm Thị Lan | 0912333333 | Khối Lớp 2 |
| gv4.ngoisao@test.com | Hoàng Văn Nam | 0912444444 | Khối Lớp 2 |
| gv5.ngoisao@test.com | Ngô Thị Hoa | 0912555555 | Khối Lớp 3 |
| gv6.ngoisao@test.com | Đặng Văn Tuấn | 0912666666 | Khối Lớp 3 |
| gv7.ngoisao@test.com | Vũ Thị Ngọc | 0912777777 | Tổ Toán |
| gv8.ngoisao@test.com | Bùi Văn Đức | 0912888888 | Tổ Toán |
| gv9.ngoisao@test.com | Lý Thị Hằng | 0912999999 | Tổ Tiếng Việt |
| gv10.ngoisao@test.com | Trịnh Văn Phong | 0913000000 | Tổ Tiếng Việt |

**Mật khẩu chung:** `Teacher@123`

---

### Lớp học (6 lớp)
| Lớp | GVCN | Khối |
|-----|------|------|
| Lớp 1A | Trần Thị Mai | Khối Lớp 1 |
| Lớp 1B | Lê Văn Hùng | Khối Lớp 1 |
| Lớp 2A | Phạm Thị Lan | Khối Lớp 2 |
| Lớp 2B | Hoàng Văn Nam | Khối Lớp 2 |
| Lớp 3A | Ngô Thị Hoa | Khối Lớp 3 |
| Lớp 3B | Đặng Văn Tuấn | Khối Lớp 3 |

---

### Học sinh (30 học sinh - 5 HS/lớp)

#### Lớp 1A
| Email | Họ tên | Phụ huynh | SĐT PH | PIN |
|-------|--------|-----------|--------|-----|
| hs1.1a@test.com | Nguyễn Minh Anh | Nguyễn Văn An | 0971111111 | 1234 |
| hs2.1a@test.com | Trần Bảo Châu | Trần Văn Bình | 0971111112 | 2345 |
| hs3.1a@test.com | Lê Hoàng Dương | Lê Thị Cúc | 0971111113 | 3456 |
| hs4.1a@test.com | Phạm Khánh Linh | Phạm Văn Dũng | 0971111114 | 4567 |
| hs5.1a@test.com | Hoàng Gia Huy | Hoàng Thị Em | 0971111115 | 5678 |

#### Lớp 1B
| Email | Họ tên | Phụ huynh | SĐT PH | PIN |
|-------|--------|-----------|--------|-----|
| hs1.1b@test.com | Vũ Quỳnh Như | Vũ Văn Phúc | 0972111111 | 1111 |
| hs2.1b@test.com | Đặng Tuấn Kiệt | Đặng Thị Giang | 0972111112 | 2222 |
| hs3.1b@test.com | Bùi Thanh Tâm | Bùi Văn Hải | 0972111113 | 3333 |
| hs4.1b@test.com | Lý Phương Trinh | Lý Văn Ích | 0972111114 | 4444 |
| hs5.1b@test.com | Ngô Đức Thịnh | Ngô Thị Kim | 0972111115 | 5555 |

#### Lớp 2A
| Email | Họ tên | Phụ huynh | SĐT PH | PIN |
|-------|--------|-----------|--------|-----|
| hs1.2a@test.com | Trịnh Hải Yến | Trịnh Văn Long | 0973111111 | 6666 |
| hs2.2a@test.com | Đinh Công Minh | Đinh Thị Mai | 0973111112 | 7777 |
| hs3.2a@test.com | Dương Thu Hà | Dương Văn Năm | 0973111113 | 8888 |
| hs4.2a@test.com | Tô Quốc Bảo | Tô Thị Oanh | 0973111114 | 9999 |
| hs5.2a@test.com | Cao Việt Anh | Cao Văn Phát | 0973111115 | 1010 |

#### Lớp 2B
| Email | Họ tên | Phụ huynh | SĐT PH | PIN |
|-------|--------|-----------|--------|-----|
| hs1.2b@test.com | Phan Ngọc Ánh | Phan Văn Quang | 0974111111 | 1212 |
| hs2.2b@test.com | Hồ Thanh Sơn | Hồ Thị Rạng | 0974111112 | 1313 |
| hs3.2b@test.com | La Thị Tuyết | La Văn Sen | 0974111113 | 1414 |
| hs4.2b@test.com | Mạc Đình Khoa | Mạc Thị Tâm | 0974111114 | 1515 |
| hs5.2b@test.com | Châu Uyên Nhi | Châu Văn Út | 0974111115 | 1616 |

#### Lớp 3A
| Email | Họ tên | Phụ huynh | SĐT PH | PIN |
|-------|--------|-----------|--------|-----|
| hs1.3a@test.com | Kiều Anh Thư | Kiều Văn Vũ | 0975111111 | 1717 |
| hs2.3a@test.com | Tạ Minh Quân | Tạ Thị Xuân | 0975111112 | 1818 |
| hs3.3a@test.com | Giang Bích Ngọc | Giang Văn Yên | 0975111113 | 1919 |
| hs4.3a@test.com | Quách Hữu Tài | Quách Thị Zin | 0975111114 | 2020 |
| hs5.3a@test.com | Sầm Diệu Linh | Sầm Văn Ái | 0975111115 | 2121 |

#### Lớp 3B
| Email | Họ tên | Phụ huynh | SĐT PH | PIN |
|-------|--------|-----------|--------|-----|
| hs1.3b@test.com | Thái Bảo Long | Thái Văn Bền | 0976111111 | 2323 |
| hs2.3b@test.com | Từ Như Quỳnh | Từ Thị Cẩm | 0976111112 | 2424 |
| hs3.3b@test.com | Ông Hoàng Phú | Ông Văn Đạt | 0976111113 | 2525 |
| hs4.3b@test.com | Tiêu Thùy Dung | Tiêu Văn Ên | 0976111114 | 2626 |
| hs5.3b@test.com | Âu Chí Tâm | Âu Thị Phương | 0976111115 | 2727 |

**Mật khẩu chung học sinh:** `Student@123`

---

## Trường Tiểu học Ánh Dương
**ID:** `22222222-2222-2222-2222-222222222222`

*(Chưa có dữ liệu chi tiết - có thể thêm sau)*

---

## Tóm tắt dữ liệu test

| Loại | Số lượng |
|------|----------|
| Trường học | 2 |
| Bộ phận | 5 |
| Giáo viên | 10 |
| Học sinh | 30 |
| Hiệu trưởng | 1 |
| Lớp học | 6 |
| Sự kiện | 3 |

---

## Lưu ý quan trọng

1. **PIN phụ huynh:** Được mã hóa base64 trong database. PIN hiển thị ở bảng trên là PIN gốc để nhập.

2. **Để đăng nhập thực sự:** Cần tạo tài khoản trong Supabase Auth với email tương ứng, hoặc sử dụng tính năng "Thêm giáo viên/học sinh" trong app.

3. **Mật khẩu mặc định:**
   - Hiệu trưởng: `School@123`
   - Giáo viên: `Teacher@123`
   - Học sinh: `Student@123`
