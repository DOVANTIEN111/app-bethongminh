// src/components/landing/HeroSection.jsx
// Hero Section for Landing Page
import React from 'react';
import { Link } from 'react-router-dom';
import { Play, ArrowRight, Star, Users, BookOpen, Award } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 text-white overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Star className="w-4 h-4 text-yellow-300" />
              <span className="text-sm font-medium">Nền tảng học tập #1 Việt Nam</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-6">
              <span className="text-white">SchoolHub</span>
              <br />
              <span className="text-blue-100">Nền tảng học tập thông minh</span>
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-blue-100 mb-8 max-w-xl mx-auto lg:mx-0">
              Giải pháp giáo dục toàn diện cho Nhà trường, Giáo viên, Phụ huynh và Học sinh.
              Học vui, dạy hay, quản lý dễ dàng.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-blue-50 active:scale-95 transition-all"
              >
                Dùng thử miễn phí
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm text-white border-2 border-white/50 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/30 active:scale-95 transition-all"
              >
                <Play className="w-5 h-5" />
                Xem demo
              </button>
            </div>

            {/* Stats mini */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 mt-10">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-200" />
                <span className="text-blue-100"><strong className="text-white">10,000+</strong> Học sinh</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-200" />
                <span className="text-blue-100"><strong className="text-white">500+</strong> Bài học</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-200" />
                <span className="text-blue-100"><strong className="text-white">50+</strong> Trường học</span>
              </div>
            </div>
          </div>

          {/* Right illustration */}
          <div className="relative hidden lg:block">
            <div className="relative w-full max-w-lg mx-auto">
              {/* Main illustration card */}
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                {/* Illustration placeholder */}
                <div className="aspect-square bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-8xl mb-4">👩‍🎓</div>
                    <div className="flex justify-center gap-2">
                      <span className="text-4xl animate-bounce" style={{ animationDelay: '0ms' }}>📚</span>
                      <span className="text-4xl animate-bounce" style={{ animationDelay: '100ms' }}>🎯</span>
                      <span className="text-4xl animate-bounce" style={{ animationDelay: '200ms' }}>⭐</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating cards */}
              <div className="absolute -top-4 -left-8 bg-white rounded-xl p-4 shadow-xl animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-xl">✅</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">Bài học hoàn thành</p>
                    <p className="text-xs text-gray-500">+50 điểm</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-8 bg-white rounded-xl p-4 shadow-xl animate-float-delayed">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-xl">🏆</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">Thành tích mới!</p>
                    <p className="text-xs text-gray-500">Học sinh xuất sắc</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
          />
        </svg>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 3s ease-in-out infinite;
          animation-delay: 1.5s;
        }
      `}</style>
    </section>
  );
}
