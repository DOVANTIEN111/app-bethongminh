// src/components/landing/HeroSection.jsx
// Hero Section đột phá - Focus vào chuyển đổi phụ huynh
import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Star, Sparkles } from 'lucide-react';

export default function HeroSection({ onWatchVideo, onTryDemo }) {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600" />

      {/* Animated shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm mb-6">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span>10,000+ phụ huynh tin dùng</span>
              <Sparkles className="w-4 h-4 text-yellow-400" />
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Biến <span className="text-yellow-400">MÀN HÌNH</span> thành{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                THẦY GIÁO RIÊNG
              </span>{' '}
              cho con bạn
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-xl mx-auto lg:mx-0">
              <span className="inline-flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                500+ bài học tương tác
              </span>
              <span className="mx-2">•</span>
              Toán, Tiếng Việt, Tiếng Anh, Khoa học
              <span className="mx-2">•</span>
              Phù hợp trẻ 3-10 tuổi
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={onTryDemo}
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-lg font-bold rounded-2xl shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all hover:scale-105 animate-pulse-slow"
              >
                <span className="text-2xl">🎮</span>
                Thử ngay bài học miễn phí
                <span className="absolute -top-2 -right-2 px-2 py-1 bg-orange-500 text-xs rounded-full animate-bounce">
                  FREE
                </span>
              </button>

              <button
                onClick={onWatchVideo}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white text-lg font-semibold rounded-2xl hover:bg-white/20 transition-all"
              >
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <Play className="w-5 h-5 text-purple-600 fill-purple-600 ml-0.5" />
                </div>
                Xem video giới thiệu
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mt-8 text-white/70 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                Không cần thẻ tín dụng
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                Hủy bất cứ lúc nào
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                30 ngày dùng thử
              </div>
            </div>
          </div>

          {/* Right content - Image */}
          <div className="relative hidden lg:block">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400/20 to-pink-400/20 rounded-3xl blur-2xl transform rotate-6" />
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl p-4 border border-white/20">
                <img
                  src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=500&fit=crop"
                  alt="Trẻ em vui vẻ học tập"
                  className="rounded-2xl w-full h-auto object-cover"
                  loading="eager"
                />

                {/* Floating cards */}
                <div className="absolute -left-8 top-1/4 bg-white rounded-2xl shadow-xl p-4 animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
                      🏆
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">+100 điểm</p>
                      <p className="text-sm text-gray-500">Hoàn thành bài!</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -right-8 bottom-1/4 bg-white rounded-2xl shadow-xl p-4 animate-float-delayed">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl">
                      ⭐
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Xuất sắc!</p>
                      <p className="text-sm text-gray-500">5/5 câu đúng</p>
                    </div>
                  </div>
                </div>

                <div className="absolute left-1/2 -translate-x-1/2 -bottom-6 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full px-6 py-3 shadow-lg">
                  <span className="font-bold">🔥 2,847 bé đang học</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile image */}
      <div className="lg:hidden absolute bottom-0 right-0 w-32 h-32 opacity-20">
        <div className="text-8xl">👨‍🎓</div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 3s ease-in-out infinite;
          animation-delay: 1.5s;
        }
        .animate-pulse-slow {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </section>
  );
}
