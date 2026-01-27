// src/components/landing/ExitIntentPopup.jsx
// Popup hiện khi user có ý định rời trang
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Gift, Clock, ArrowRight, Star } from 'lucide-react';

export default function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Check if popup was already shown in this session
    const shown = sessionStorage.getItem('exitIntentShown');
    if (shown) {
      setHasShown(true);
      return;
    }

    // Desktop: detect mouse leaving viewport
    const handleMouseLeave = (e) => {
      if (e.clientY <= 0 && !hasShown) {
        setIsVisible(true);
        setHasShown(true);
        sessionStorage.setItem('exitIntentShown', 'true');
      }
    };

    // Mobile: detect back button or time on page
    let timeoutId;
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && !hasShown) {
        // Don't show immediately, user might be switching tabs
      }
    };

    // Also show after 60 seconds of inactivity
    const handleActivity = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (!hasShown) {
          setIsVisible(true);
          setHasShown(true);
          sessionStorage.setItem('exitIntentShown', 'true');
        }
      }, 60000);
    };

    document.addEventListener('mouseout', handleMouseLeave);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('mousemove', handleActivity);
    document.addEventListener('touchstart', handleActivity);

    // Initial activity detection
    handleActivity();

    return () => {
      document.removeEventListener('mouseout', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('mousemove', handleActivity);
      document.removeEventListener('touchstart', handleActivity);
      clearTimeout(timeoutId);
    };
  }, [hasShown]);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Popup */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-popup-in">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          aria-label="Đóng"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 p-8 text-center text-white">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4 animate-bounce">
            <Gift className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            Khoan đã! Đừng bỏ lỡ...
          </h2>
          <p className="text-white/90">
            Ưu đãi đặc biệt dành riêng cho bạn
          </p>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Special offer */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <span className="text-sm text-gray-600">4.9/5 từ 10,000+ đánh giá</span>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Tặng thêm 15 ngày Premium!
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Đăng ký ngay để nhận <strong>45 ngày dùng thử Premium</strong> (thay vì 30 ngày).
              Ưu đãi chỉ áp dụng trong 24 giờ tới!
            </p>

            {/* Countdown feel */}
            <div className="flex items-center gap-2 text-orange-600 font-medium text-sm">
              <Clock className="w-4 h-4" />
              <span>Ưu đãi kết thúc sau 23:59:59</span>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="space-y-3">
            <Link
              to="/register?promo=exit15"
              onClick={handleClose}
              className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
            >
              Nhận 45 ngày miễn phí
              <ArrowRight className="w-5 h-5" />
            </Link>

            <button
              onClick={handleClose}
              className="w-full text-center py-3 text-gray-500 hover:text-gray-700 text-sm"
            >
              Không, tôi muốn bỏ lỡ cơ hội này
            </button>
          </div>
        </div>

        <style>{`
          @keyframes popup-in {
            0% {
              opacity: 0;
              transform: scale(0.9) translateY(20px);
            }
            100% {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
          .animate-popup-in {
            animation: popup-in 0.3s ease-out;
          }
        `}</style>
      </div>
    </div>
  );
}
