#!/bin/bash
# scripts/generate-icons.sh
# Script tạo app icons từ ảnh gốc 1024x1024

# Kiểm tra ImageMagick
if ! command -v convert &> /dev/null; then
    echo "❌ Cần cài ImageMagick: brew install imagemagick"
    exit 1
fi

# Kiểm tra file gốc
SOURCE="$1"
if [ -z "$SOURCE" ]; then
    echo "📝 Cách dùng: ./scripts/generate-icons.sh <path-to-1024x1024-icon.png>"
    echo "📝 Ví dụ: ./scripts/generate-icons.sh ~/Desktop/logo.png"
    exit 1
fi

if [ ! -f "$SOURCE" ]; then
    echo "❌ Không tìm thấy file: $SOURCE"
    exit 1
fi

echo "🎨 Đang tạo icons từ: $SOURCE"

# Tạo thư mục
mkdir -p public/icons
mkdir -p ios/App/App/Assets.xcassets/AppIcon.appiconset
mkdir -p android/app/src/main/res/mipmap-mdpi
mkdir -p android/app/src/main/res/mipmap-hdpi
mkdir -p android/app/src/main/res/mipmap-xhdpi
mkdir -p android/app/src/main/res/mipmap-xxhdpi
mkdir -p android/app/src/main/res/mipmap-xxxhdpi

# PWA Icons
echo "📱 Tạo PWA icons..."
convert "$SOURCE" -resize 72x72 public/icons/icon-72x72.png
convert "$SOURCE" -resize 96x96 public/icons/icon-96x96.png
convert "$SOURCE" -resize 128x128 public/icons/icon-128x128.png
convert "$SOURCE" -resize 144x144 public/icons/icon-144x144.png
convert "$SOURCE" -resize 152x152 public/icons/icon-152x152.png
convert "$SOURCE" -resize 192x192 public/icons/icon-192x192.png
convert "$SOURCE" -resize 384x384 public/icons/icon-384x384.png
convert "$SOURCE" -resize 512x512 public/icons/icon-512x512.png

# Favicon
echo "🌐 Tạo favicon..."
convert "$SOURCE" -resize 32x32 public/favicon-32x32.png
convert "$SOURCE" -resize 16x16 public/favicon-16x16.png
convert "$SOURCE" -resize 180x180 public/apple-touch-icon.png

# iOS Icons (for Capacitor)
echo "🍎 Tạo iOS icons..."
convert "$SOURCE" -resize 20x20 ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-20x20@1x.png
convert "$SOURCE" -resize 40x40 ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-20x20@2x.png
convert "$SOURCE" -resize 60x60 ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-20x20@3x.png
convert "$SOURCE" -resize 29x29 ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-29x29@1x.png
convert "$SOURCE" -resize 58x58 ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-29x29@2x.png
convert "$SOURCE" -resize 87x87 ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-29x29@3x.png
convert "$SOURCE" -resize 40x40 ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-40x40@1x.png
convert "$SOURCE" -resize 80x80 ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-40x40@2x.png
convert "$SOURCE" -resize 120x120 ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-40x40@3x.png
convert "$SOURCE" -resize 120x120 ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-60x60@2x.png
convert "$SOURCE" -resize 180x180 ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-60x60@3x.png
convert "$SOURCE" -resize 76x76 ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-76x76@1x.png
convert "$SOURCE" -resize 152x152 ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-76x76@2x.png
convert "$SOURCE" -resize 167x167 ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-83.5x83.5@2x.png
convert "$SOURCE" -resize 1024x1024 ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-1024x1024@1x.png

# Android Icons (for Capacitor)
echo "🤖 Tạo Android icons..."
convert "$SOURCE" -resize 48x48 android/app/src/main/res/mipmap-mdpi/ic_launcher.png
convert "$SOURCE" -resize 72x72 android/app/src/main/res/mipmap-hdpi/ic_launcher.png
convert "$SOURCE" -resize 96x96 android/app/src/main/res/mipmap-xhdpi/ic_launcher.png
convert "$SOURCE" -resize 144x144 android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png
convert "$SOURCE" -resize 192x192 android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png

# Round icons for Android
convert "$SOURCE" -resize 48x48 android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png
convert "$SOURCE" -resize 72x72 android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png
convert "$SOURCE" -resize 96x96 android/app/src/main/res/mipmap-xhdpi/ic_launcher_round.png
convert "$SOURCE" -resize 144x144 android/app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png
convert "$SOURCE" -resize 192x192 android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png

# Foreground icons for Android (Adaptive icons)
convert "$SOURCE" -resize 108x108 android/app/src/main/res/mipmap-mdpi/ic_launcher_foreground.png
convert "$SOURCE" -resize 162x162 android/app/src/main/res/mipmap-hdpi/ic_launcher_foreground.png
convert "$SOURCE" -resize 216x216 android/app/src/main/res/mipmap-xhdpi/ic_launcher_foreground.png
convert "$SOURCE" -resize 324x324 android/app/src/main/res/mipmap-xxhdpi/ic_launcher_foreground.png
convert "$SOURCE" -resize 432x432 android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_foreground.png

echo ""
echo "✅ Đã tạo xong tất cả icons!"
echo ""
echo "📁 Các thư mục đã tạo:"
echo "   - public/icons/ (PWA)"
echo "   - ios/App/App/Assets.xcassets/ (iOS)"
echo "   - android/app/src/main/res/ (Android)"
echo ""
echo "📝 Bước tiếp theo:"
echo "   1. Kiểm tra icons trong các thư mục"
echo "   2. Chạy: npm run build"
echo "   3. Chạy: npx cap sync"
