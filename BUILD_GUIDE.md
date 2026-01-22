# 📱 HƯỚNG DẪN BUILD & SUBMIT APP

## 📋 TỔNG QUAN

Dự án sử dụng **Capacitor** để build app native từ web app.

---

## 🔧 CHUẨN BỊ

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Tạo app icons

Cần file logo gốc 1024x1024 PNG, sau đó chạy:

```bash
# Cài ImageMagick (nếu chưa có)
brew install imagemagick

# Tạo icons
chmod +x scripts/generate-icons.sh
./scripts/generate-icons.sh ~/path/to/your/logo-1024x1024.png
```

### 3. Build web app

```bash
npm run build
```

---

## 🍎 iOS BUILD

### Yêu cầu
- macOS
- Xcode 15+
- Apple Developer Account ($99/năm)

### Các bước

```bash
# 1. Thêm iOS platform
npm run cap:add:ios

# 2. Sync code
npm run cap:sync

# 3. Mở Xcode
npm run cap:open:ios
```

### Trong Xcode

1. **Signing & Capabilities**
   - Chọn Team (Apple Developer Account)
   - Bundle Identifier: `com.gdtm.bethongminh`

2. **General**
   - Display Name: `Bé Thông Minh`
   - Version: `1.0.0`
   - Build: `1`

3. **Build Settings**
   - iOS Deployment Target: `14.0`

4. **Test trên Simulator**
   - Product → Run (⌘R)

5. **Test trên thiết bị thật**
   - Kết nối iPhone
   - Trust developer certificate trên iPhone
   - Product → Run

### Submit lên App Store

1. **Product → Archive**
2. **Distribute App → App Store Connect**
3. Đăng nhập App Store Connect
4. Điền thông tin app:
   - Tên: Bé Thông Minh
   - Subtitle: Ứng dụng học tập cho bé
   - Mô tả: ...
   - Keywords: giáo dục, trẻ em, học tập, game
   - Screenshots (cần tạo)
   - Chọn Category: Education / Kids
5. Submit for Review

---

## 🤖 ANDROID BUILD

### Yêu cầu
- Android Studio
- Java 17+
- Google Play Developer Account ($25 một lần)

### Các bước

```bash
# 1. Thêm Android platform
npm run cap:add:android

# 2. Sync code
npm run cap:sync

# 3. Mở Android Studio
npm run cap:open:android
```

### Trong Android Studio

1. **Build → Generate Signed Bundle / APK**
   - Chọn: Android App Bundle (cho Play Store)
   - Tạo hoặc chọn keystore file

2. **Tạo Keystore** (lần đầu)
   - Key store path: `android/app/release.keystore`
   - Password: (ghi nhớ!)
   - Alias: `bethongminh`
   - Validity: 25 years

3. **Build Release**
   - Build Variants: release
   - Build → Build Bundle(s) / APK(s)

### Submit lên Google Play

1. Vào [Google Play Console](https://play.google.com/console)
2. Create app
3. Điền thông tin:
   - App name: Bé Thông Minh
   - Default language: Vietnamese
   - App category: Education
   - Content rating: Everyone
4. Upload AAB file
5. Điền Store listing
6. Tạo screenshots
7. Submit for review

---

## 📸 SCREENSHOTS CẦN TẠO

### iOS
- iPhone 6.5" (1284 x 2778) - 3-5 ảnh
- iPhone 5.5" (1242 x 2208) - 3-5 ảnh
- iPad Pro 12.9" (2048 x 2732) - 3-5 ảnh (optional)

### Android
- Phone (1080 x 1920) - 4-8 ảnh
- Tablet 7" (1200 x 1920) - 4-8 ảnh (optional)
- Tablet 10" (1600 x 2560) - 4-8 ảnh (optional)

### Nội dung screenshots
1. Màn hình chào mừng / Onboarding
2. Trang chủ với các môn học
3. Màn hình bài học
4. Games
5. Pet
6. Hồ sơ / Thành tích

---

## 📝 THÔNG TIN APP STORE

### Mô tả ngắn (80 ký tự)
```
Ứng dụng học tập vui nhộn dành cho bé từ 3-10 tuổi
```

### Mô tả đầy đủ
```
🎓 BÉ THÔNG MINH - Học mà chơi, chơi mà học!

Ứng dụng giáo dục toàn diện giúp bé phát triển:

📚 4 MÔN HỌC
• Toán học: Số đếm, phép tính, hình học
• Tiếng Việt: Chữ cái, từ vựng, đọc hiểu
• Tiếng Anh: Vocabulary, phát âm
• Khoa học: Khám phá thế giới

🎮 8+ TRÒ CHƠI
• Lật hình nhớ - Rèn trí nhớ
• Đua xe toán - Tính nhanh
• Bắn bóng - Phản xạ
• Và nhiều game khác!

🐾 PET ĐỘC ĐÁO
• Nuôi pet ảo đáng yêu
• Pet tiến hóa khi bé học
• Chăm sóc pet mỗi ngày

👨‍👩‍👧 PHỤ HUYNH YÊN TÂM
• Theo dõi tiến độ học tập
• Báo cáo chi tiết
• Không quảng cáo
• An toàn cho trẻ

Tải ngay để bé bắt đầu hành trình học tập thú vị!
```

### Keywords
```
giáo dục, trẻ em, học tập, toán, tiếng việt, tiếng anh, game, kids, education, learning
```

---

## ⚠️ LƯU Ý QUAN TRỌNG

1. **Keystore Android**: Lưu giữ cẩn thận, mất = không update được app
2. **Apple Certificate**: Gia hạn hàng năm
3. **Privacy Policy**: Cần có URL privacy policy
4. **COPPA Compliance**: App cho trẻ em cần tuân thủ COPPA
5. **Review time**: 
   - iOS: 1-3 ngày
   - Android: vài giờ đến 3 ngày

---

## 🔗 LINKS HỮU ÍCH

- [Capacitor Docs](https://capacitorjs.com/docs)
- [App Store Connect](https://appstoreconnect.apple.com)
- [Google Play Console](https://play.google.com/console)
- [Apple Developer](https://developer.apple.com)
- [Android Studio](https://developer.android.com/studio)
