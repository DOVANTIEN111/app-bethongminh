# 🎓 SchoolHub v3.6

Nền tảng học tập thông minh cho trường học, giáo viên, học sinh và phụ huynh.

![Version](https://img.shields.io/badge/version-3.6.0-blue)
![React](https://img.shields.io/badge/React-18-61dafb)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Tính năng chính

| Tính năng | Mô tả |
|-----------|-------|
| 🏫 **Quản lý trường học** | Super Admin quản lý nhiều trường |
| 👨‍🏫 **Giáo viên** | Quản lý lớp, bài giảng, giao bài |
| 👨‍🎓 **Học sinh** | Học bài, làm bài tập, xem thành tích |
| 👪 **Phụ huynh** | Theo dõi tiến độ học tập của con |
| 📚 **5 môn học** | Toán, Tiếng Việt, Tiếng Anh, Khoa học, Kỹ năng sống |
| 🌍 **English Zone** | 10 chủ đề, 126 từ vựng, 5 games |
| 🎮 **13 trò chơi** | Games giáo dục thú vị |
| 📱 **PWA** | Cài đặt như app, offline |

---

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/schoolhub.git
cd schoolhub

# Cài dependencies
npm install

# Chạy development
npm run dev

# Mở http://localhost:5173
```

---

## 📖 Hướng dẫn Deploy đầy đủ

👉 Xem file **[DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md)** để biết cách:
- Deploy lên GitHub
- Setup Supabase database
- Deploy lên Vercel

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/schoolhub)

---

## 🔧 Cấu hình Supabase (Tùy chọn)

App hoạt động được mà không cần Supabase (dùng localStorage).
Nếu muốn sync data lên cloud:

```bash
# Copy file env mẫu
cp .env.example .env.local

# Điền thông tin Supabase
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

---

## 📁 Cấu trúc Project

```
schoolhub/
├── public/
│   ├── manifest.json    # PWA config
│   ├── sw.js            # Service Worker
│   └── favicon.svg
├── src/
│   ├── components/      # UI components
│   ├── contexts/        # React contexts
│   │   ├── AuthContext.jsx
│   │   ├── AudioContext.jsx
│   │   └── AppContext.jsx
│   ├── data/            # Static data
│   │   ├── subjects.js      # 5 môn học
│   │   ├── englishVocab.js  # 126 từ vựng
│   │   ├── games.js         # 8 games
│   │   ├── dailyChallenge.js
│   │   └── achievements.js
│   ├── lib/
│   │   └── supabase.js  # Supabase client
│   ├── pages/           # Pages theo role
│   │   ├── admin/       # Super Admin pages
│   │   ├── school/      # School Admin pages
│   │   ├── teacher/     # Teacher pages
│   │   ├── learn/       # Student pages
│   │   └── parent/      # Parent pages
│   └── main.jsx
├── .env.example
├── DEPLOY_GUIDE.md
└── package.json
```

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | React 18, Vite |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Icons | Lucide React |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Hosting | Vercel |
| PWA | Service Worker |

---

## 👥 Các vai trò trong hệ thống

### Super Admin
- Quản lý tất cả trường học
- Quản lý nội dung (môn học, bài học, từ vựng)
- Quản lý tài chính, gói cước
- Thống kê toàn hệ thống

### School Admin
- Quản lý giáo viên, học sinh
- Quản lý lớp học, bộ phận
- Cài đặt trường học

### Giáo viên
- Quản lý lớp được phân công
- Tạo bài giảng, giao bài tập
- Theo dõi tiến độ học sinh
- Liên lạc với phụ huynh

### Học sinh
- Học bài, làm bài tập
- Xem thành tích, điểm số
- Chế độ phụ huynh (với PIN)

---

## 🔄 Cập nhật App

```bash
# Sau khi sửa code
git add .
git commit -m "Update: mô tả thay đổi"
git push

# Vercel tự động deploy lại!
```

---

## 🤝 Contributing

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

---

## 📄 License

MIT License - xem file [LICENSE](./LICENSE)

---

## 👨‍💻 Author

Made with ❤️ for Vietnamese education

---

**[🌐 Live Demo](https://schoolhub.vercel.app)** | **[🐛 Report Bug](https://github.com/YOUR_USERNAME/schoolhub/issues)** | **[💡 Request Feature](https://github.com/YOUR_USERNAME/schoolhub/issues)**
