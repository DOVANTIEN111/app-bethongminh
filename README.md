# 🎓 Gia Đình Thông Minh v3.0

Ứng dụng học tập vui vẻ cho trẻ em Việt Nam 3-10 tuổi.

![Version](https://img.shields.io/badge/version-3.0.0-blue)
![React](https://img.shields.io/badge/React-18-61dafb)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Tính năng chính

| Tính năng | Mô tả |
|-----------|-------|
| 📚 **5 môn học** | Toán, Tiếng Việt, Tiếng Anh, Khoa học, Kỹ năng sống |
| 🌍 **English Zone** | 10 chủ đề, 126 từ vựng, 5 games |
| 🎤 **Speech Recognition** | Luyện phát âm tiếng Anh |
| 🎮 **13 trò chơi** | Games giáo dục thú vị |
| 🎯 **Daily Challenge** | 3 thử thách mỗi ngày |
| 🏆 **XP & Level** | 11 cấp độ, 9 huy hiệu |
| 👨‍👩‍👧‍👦 **Multi-member** | Nhiều thành viên gia đình |
| 📱 **PWA** | Cài đặt như app, offline |

---

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/gia-dinh-thong-minh.git
cd gia-dinh-thong-minh

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

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/gia-dinh-thong-minh)

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
gia-dinh-thong-minh/
├── public/
│   ├── manifest.json    # PWA config
│   ├── sw.js            # Service Worker
│   └── favicon.svg
├── src/
│   ├── components/      # UI components
│   ├── contexts/        # React contexts
│   │   ├── MemberContext.jsx
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
│   ├── pages/           # 12 pages
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

## 📱 Screenshots

### Trang chủ
- Daily Challenge
- Từ vựng hôm nay
- Quick access buttons

### English Zone
- 10 chủ đề từ vựng
- 5 games: Flashcard, Listen & Pick, Speak & Check, Spelling Bee, Word Rain

### Khu vui chơi
- 8 games: Memory, Math Race, Whack Mole, Color Match, Simon Says, Word Match, Quick Math, Balloon Pop

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

Made with ❤️ for Vietnamese kids

---

**[🌐 Live Demo](https://gia-dinh-thong-minh.vercel.app)** | **[🐛 Report Bug](https://github.com/YOUR_USERNAME/gia-dinh-thong-minh/issues)** | **[💡 Request Feature](https://github.com/YOUR_USERNAME/gia-dinh-thong-minh/issues)**
