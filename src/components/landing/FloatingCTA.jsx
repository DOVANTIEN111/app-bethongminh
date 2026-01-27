// src/components/landing/FloatingCTA.jsx
// Nút CTA nổi cố định góc phải màn hình
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, X, MessageCircle } from 'lucide-react';

export default function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    // Show after scrolling down 500px
    const handleScroll = () => {
      if (window.scrollY > 500 && !isDismissed) {
        setIsVisible(true);
      } else if (window.scrollY <= 500) {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat bubble */}
      {showChat && (
        <div className="bg-white rounded-2xl shadow-2xl p-4 max-w-xs animate-slide-up">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-lg">👋</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">SchoolHub</p>
                <p className="text-xs text-green-600">Online</p>
              </div>
            </div>
            <button
              onClick={() => setShowChat(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-gray-600 text-sm mb-3">
            Xin chào! Bạn có câu hỏi gì về SchoolHub không? Mình sẵn sàng hỗ trợ!
          </p>
          <a
            href="https://zalo.me/schoolhub"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-blue-600 text-white py-2 rounded-xl font-medium hover:bg-blue-700 transition-colors text-sm"
          >
            Chat qua Zalo
          </a>
        </div>
      )}

      {/* Main buttons */}
      <div className="flex items-center gap-3">
        {/* Chat button */}
        <button
          onClick={() => setShowChat(!showChat)}
          className="w-12 h-12 bg-green-500 rounded-full shadow-lg flex items-center justify-center hover:bg-green-600 transition-all hover:scale-110"
          aria-label="Chat hỗ trợ"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </button>

        {/* CTA button */}
        <div className="relative">
          {/* Dismiss button */}
          <button
            onClick={handleDismiss}
            className="absolute -top-2 -right-2 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors z-10"
            aria-label="Đóng"
          >
            <X className="w-3 h-3 text-gray-600" />
          </button>

          {/* Main CTA */}
          <Link
            to="/register"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 animate-pulse-subtle"
          >
            <Sparkles className="w-5 h-5" />
            <span>Đăng ký FREE</span>
          </Link>

          {/* Pulsing ring */}
          <div className="absolute inset-0 rounded-full bg-orange-500 animate-ping opacity-25" />
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        @keyframes pulse-subtle {
          0%, 100% {
            box-shadow: 0 10px 25px -5px rgba(249, 115, 22, 0.5);
          }
          50% {
            box-shadow: 0 10px 35px -5px rgba(249, 115, 22, 0.7);
          }
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
