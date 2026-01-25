# 🚀 HƯỚNG DẪN DEPLOY SCHOOLHUB

## Mục lục
1. [Chuẩn bị](#1-chuẩn-bị)
2. [Deploy lên GitHub](#2-deploy-lên-github)
3. [Setup Supabase](#3-setup-supabase)
4. [Deploy lên Vercel](#4-deploy-lên-vercel)
5. [Cấu hình Domain](#5-cấu-hình-domain-tùy-chọn)
6. [Troubleshooting](#6-troubleshooting)

---

## 1. CHUẨN BỊ

### Tài khoản cần có (miễn phí):
- ✅ [GitHub](https://github.com) - Lưu trữ code
- ✅ [Supabase](https://supabase.com) - Database & Auth
- ✅ [Vercel](https://vercel.com) - Hosting

### Phần mềm cần cài:
```bash
# Node.js (v18+)
https://nodejs.org

# Git
https://git-scm.com

# Kiểm tra đã cài chưa
node --version  # v18.x.x
git --version   # git version 2.x.x
```

---

## 2. DEPLOY LÊN GITHUB

### Bước 2.1: Tạo Repository mới

1. Đăng nhập [github.com](https://github.com)
2. Click nút **"+"** góc trên phải → **"New repository"**
3. Điền thông tin:
   - Repository name: `schoolhub`
   - Description: `Nền tảng học tập thông minh`
   - Chọn **Public** (hoặc Private nếu muốn)
   - ❌ KHÔNG tick "Add a README file"
4. Click **"Create repository"**

### Bước 2.2: Upload code lên GitHub

```bash
# 1. Di chuyển vào thư mục project
cd schoolhub

# 2. Khởi tạo Git
git init

# 3. Thêm tất cả files
git add .

# 4. Commit đầu tiên
git commit -m "Initial commit - v3.0"

# 5. Kết nối với GitHub (thay YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/schoolhub.git

# 6. Đổi branch sang main
git branch -M main

# 7. Push lên GitHub
git push -u origin main
```

### Bước 2.3: Xác nhận

- Mở `https://github.com/YOUR_USERNAME/schoolhub`
- Kiểm tra thấy tất cả files đã được upload

---

## 3. SETUP SUPABASE

### Bước 3.1: Tạo Project

1. Đăng nhập [supabase.com](https://supabase.com)
2. Click **"New Project"**
3. Điền thông tin:
   - Name: `schoolhub`
   - Database Password: **Tạo mật khẩu mạnh** (lưu lại!)
   - Region: `Singapore` (gần Việt Nam nhất)
4. Click **"Create new project"**
5. Đợi 2-3 phút để setup xong

### Bước 3.2: Lấy API Keys

1. Vào **Project Settings** (icon bánh răng)
2. Click **"API"** ở sidebar
3. Copy và lưu lại:
   - `Project URL`: `https://xxxxx.supabase.co`
   - `anon public key`: `eyJhbGciOiJIUzI1NiIsInR5cCI6...`

### Bước 3.3: Tạo Database Tables

1. Vào **SQL Editor** ở sidebar
2. Click **"New query"**
3. Paste đoạn SQL sau và click **"Run"**:

```sql
-- Bảng lưu thông tin người dùng
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng lưu thành viên gia đình
CREATE TABLE family_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  avatar TEXT DEFAULT '👦',
  age INTEGER DEFAULT 6,
  role TEXT DEFAULT 'child',
  xp INTEGER DEFAULT 0,
  stats JSONB DEFAULT '{"streak": 0, "totalLessons": 0, "perfectScores": 0}',
  progress JSONB DEFAULT '{}',
  english_progress JSONB DEFAULT '{}',
  game_scores JSONB DEFAULT '{}',
  achievements TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng lưu daily challenges
CREATE TABLE daily_challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID REFERENCES family_members(id) ON DELETE CASCADE,
  date DATE DEFAULT CURRENT_DATE,
  challenges JSONB NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng lưu lịch sử học tập
CREATE TABLE learning_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID REFERENCES family_members(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL, -- 'lesson', 'game', 'english'
  activity_id TEXT NOT NULL,
  score INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  duration_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_history ENABLE ROW LEVEL SECURITY;

-- Policies cho profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Policies cho family_members
CREATE POLICY "Users can view own family members" ON family_members
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own family members" ON family_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own family members" ON family_members
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own family members" ON family_members
  FOR DELETE USING (auth.uid() = user_id);

-- Policies cho daily_challenges
CREATE POLICY "Users can manage own challenges" ON daily_challenges
  FOR ALL USING (
    member_id IN (SELECT id FROM family_members WHERE user_id = auth.uid())
  );

-- Policies cho learning_history
CREATE POLICY "Users can manage own history" ON learning_history
  FOR ALL USING (
    member_id IN (SELECT id FROM family_members WHERE user_id = auth.uid())
  );

-- Function tự động tạo profile khi user đăng ký
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Bước 3.4: Setup Authentication

1. Vào **Authentication** ở sidebar
2. Click **"Providers"**
3. Enable các providers:
   - ✅ **Email** (mặc định đã bật)
   - ✅ **Google** (optional):
     - Vào [Google Cloud Console](https://console.cloud.google.com)
     - Tạo OAuth 2.0 credentials
     - Copy Client ID và Client Secret vào Supabase

### Bước 3.5: Tạo file cấu hình Supabase

Tạo file `.env.local` trong thư mục project:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

⚠️ **QUAN TRỌNG**: Thêm `.env.local` vào `.gitignore`:
```bash
echo ".env.local" >> .gitignore
```

---

## 4. DEPLOY LÊN VERCEL

### Bước 4.1: Kết nối GitHub với Vercel

1. Đăng nhập [vercel.com](https://vercel.com)
2. Click **"Add New..."** → **"Project"**
3. Click **"Import"** bên cạnh repo `schoolhub`
4. Nếu không thấy repo, click **"Adjust GitHub App Permissions"**

### Bước 4.2: Cấu hình Project

1. **Framework Preset**: Chọn `Vite`
2. **Root Directory**: Để trống (hoặc `./`)
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Install Command**: `npm install`

### Bước 4.3: Thêm Environment Variables

1. Mở rộng phần **"Environment Variables"**
2. Thêm 2 biến:

| Key | Value |
|-----|-------|
| `VITE_SUPABASE_URL` | `https://xxxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6...` |

### Bước 4.4: Deploy

1. Click **"Deploy"**
2. Đợi 2-3 phút để build
3. Khi hoàn thành, bạn sẽ có URL:
   - `https://schoolhub.vercel.app`

### Bước 4.5: Cấu hình Supabase Redirect URLs

1. Quay lại Supabase → **Authentication** → **URL Configuration**
2. Thêm vào **Redirect URLs**:
   ```
   https://schoolhub.vercel.app/**
   ```

---

## 5. CẤU HÌNH DOMAIN (Tùy chọn)

### Nếu có domain riêng:

1. Vào Vercel → Project → **"Settings"** → **"Domains"**
2. Thêm domain: `schoolhub.vn`
3. Cấu hình DNS theo hướng dẫn:
   - **A Record**: `76.76.19.61`
   - **CNAME**: `cname.vercel-dns.com`

---

## 6. TROUBLESHOOTING

### Lỗi "npm install failed"
```bash
# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
npm install
```

### Lỗi "Build failed"
- Kiểm tra console log trong Vercel
- Thường do thiếu dependencies hoặc lỗi syntax

### Lỗi "Supabase connection failed"
- Kiểm tra lại VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY
- Đảm bảo đã thêm Environment Variables trong Vercel

### Lỗi "Page not found" khi refresh
Tạo file `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

### Lỗi CORS
1. Vào Supabase → **Settings** → **API**
2. Thêm domain vào **Additional Redirect URLs**

---

## 📋 CHECKLIST CUỐI CÙNG

- [ ] Code đã push lên GitHub
- [ ] Supabase project đã tạo
- [ ] Database tables đã tạo
- [ ] Environment variables đã thêm vào Vercel
- [ ] App đã deploy thành công
- [ ] Test các tính năng cơ bản
- [ ] Test đăng ký/đăng nhập (nếu có)

---

## 🎉 HOÀN THÀNH!

App của bạn đã online tại:
```
https://schoolhub.vercel.app
```

### Các bước tiếp theo:
1. Chia sẻ link cho người dùng test
2. Thu thập feedback
3. Cải thiện và cập nhật

### Cập nhật app:
```bash
# Sau khi sửa code
git add .
git commit -m "Update: mô tả thay đổi"
git push

# Vercel sẽ tự động deploy lại!
```

---

## 📞 HỖ TRỢ

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- GitHub Docs: https://docs.github.com

**Chúc bạn deploy thành công! 🚀**
