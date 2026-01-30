# Huong dan build app iOS va Android cho SchoolHub

## Yeu cau he thong

### Chung
- Node.js 18+
- npm 9+

### iOS
- macOS 12+ (Monterey tro len)
- Xcode 14+
- CocoaPods (`sudo gem install cocoapods`)
- Apple Developer Account ($99/nam de publish)

### Android
- Android Studio (Electric Eel tro len)
- Android SDK 33+
- JDK 17
- Gradle 8+

## Cai dat ban dau

### 1. Cai dat Capacitor dependencies

```bash
# Core
npm install @capacitor/core @capacitor/cli

# Platforms
npm install @capacitor/ios @capacitor/android

# Plugins
npm install @capacitor/splash-screen @capacitor/status-bar
npm install @capacitor/keyboard @capacitor/push-notifications
npm install @capacitor/local-notifications @capacitor/app
npm install @capacitor/haptics @capacitor/share
```

### 2. Khoi tao platforms

```bash
# Them iOS platform
npx cap add ios

# Them Android platform
npx cap add android
```

### 3. Cau hinh App Icons va Splash Screen

Sao chep icons vao:
- iOS: `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
- Android: `android/app/src/main/res/mipmap-*/`

Kich thuoc can thiet:
- iOS: 20, 29, 40, 60, 76, 83.5, 1024 (px, @1x, @2x, @3x)
- Android: mdpi(48), hdpi(72), xhdpi(96), xxhdpi(144), xxxhdpi(192)

## Build Process

### Build Web truoc

```bash
npm run build
```

### Sync code vao native projects

```bash
npx cap sync
```

Hoac chi copy (khong update plugins):
```bash
npx cap copy
```

## Build iOS

### 1. Mo project trong Xcode

```bash
npx cap open ios
```

### 2. Cau hinh trong Xcode

1. Chon project `App` trong Navigator
2. Tab `Signing & Capabilities`:
   - Chon Team (can Apple Developer account)
   - Bundle Identifier: `com.schoolhub.app`
3. Tab `General`:
   - Display Name: `SchoolHub`
   - Version: `1.0.0`
   - Build: `1`

### 3. Test tren Simulator

1. Chon target device (iPhone 14 Pro, etc.)
2. Nhan Run (Cmd + R)

### 4. Test tren device that

1. Ket noi iPhone qua USB
2. Trust may tinh tren iPhone
3. Chon device trong Xcode
4. Nhan Run

### 5. Build cho App Store

1. Chon `Any iOS Device` lam target
2. Product > Archive
3. Doi build xong
4. Window > Organizer
5. Chon archive > Distribute App
6. Chon `App Store Connect`
7. Lam theo huong dan

## Build Android

### 1. Mo project trong Android Studio

```bash
npx cap open android
```

### 2. Doi Gradle sync

- Android Studio se tu dong sync
- Neu loi, File > Sync Project with Gradle Files

### 3. Cau hinh

File `android/app/build.gradle`:
```groovy
android {
    defaultConfig {
        applicationId "com.schoolhub.app"
        versionCode 1
        versionName "1.0.0"
    }
}
```

### 4. Test tren Emulator

1. Tools > Device Manager
2. Tao virtual device (Pixel 6, API 33)
3. Nhan Run (Shift + F10)

### 5. Test tren device that

1. Bat Developer mode tren Android
2. Bat USB debugging
3. Ket noi USB
4. Chon device > Run

### 6. Build APK (testing)

1. Build > Build Bundle(s) / APK(s) > Build APK(s)
2. APK luu tai: `android/app/build/outputs/apk/debug/app-debug.apk`

### 7. Build AAB cho Play Store

1. Tao keystore (chi lan dau):
```bash
keytool -genkey -v -keystore schoolhub-release.keystore -alias schoolhub -keyalg RSA -keysize 2048 -validity 10000
```

2. Build > Generate Signed Bundle / APK
3. Chon Android App Bundle
4. Chon keystore file
5. Nhap password va alias
6. Chon release
7. AAB luu tai: `android/app/build/outputs/bundle/release/`

## Scripts NPM

Them vao `package.json`:

```json
{
  "scripts": {
    "cap:sync": "npx cap sync",
    "cap:copy": "npx cap copy",
    "cap:open:ios": "npx cap open ios",
    "cap:open:android": "npx cap open android",
    "build:ios": "npm run build && npx cap sync ios && npx cap open ios",
    "build:android": "npm run build && npx cap sync android && npx cap open android",
    "build:mobile": "npm run build && npx cap sync"
  }
}
```

## Push Notifications

### iOS (APNs)

1. Apple Developer Portal > Certificates, Identifiers & Profiles
2. Keys > Create new key
3. Chon Apple Push Notifications service (APNs)
4. Download key (.p8 file)
5. Luu Key ID va Team ID

### Android (FCM)

1. Firebase Console > Project Settings
2. Cloud Messaging tab
3. Lay Server key
4. Download google-services.json
5. Copy vao `android/app/google-services.json`

## Troubleshooting

### iOS

**Loi "No signing certificate"**
- Xcode > Preferences > Accounts > Manage Certificates
- Them Apple Development certificate

**Loi CocoaPods**
```bash
cd ios/App
pod install --repo-update
```

### Android

**Loi Gradle sync**
```bash
cd android
./gradlew clean
./gradlew build
```

**Loi SDK version**
- File > Project Structure > Modules > app
- Cap nhat Compile SDK Version

## Checklist truoc khi publish

### iOS
- [ ] App icon day du cac kich thuoc
- [ ] Splash screen
- [ ] Privacy policy URL
- [ ] Screenshots (6.7", 6.5", 5.5")
- [ ] App description
- [ ] Keywords
- [ ] Support URL
- [ ] Test tren device that

### Android
- [ ] App icon (adaptive icon)
- [ ] Feature graphic (1024x500)
- [ ] Screenshots (phone, tablet)
- [ ] App description (ngon ngu)
- [ ] Privacy policy URL
- [ ] Content rating questionnaire
- [ ] Target audience
- [ ] Test tren nhieu device

## Lien he ho tro

- Email: dev@schoolhub.vn
- Documentation: https://capacitorjs.com/docs

---
Build voi Capacitor 5+ va React 18+
