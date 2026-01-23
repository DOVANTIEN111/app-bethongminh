// src/components/Onboarding.jsx
// Màn hình giới thiệu app cho user mới - Cập nhật v3.6
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Sparkles, Star, Zap, Heart } from 'lucide-react';

const SLIDES = [
  {
    icon: '👋',
    title: 'Chào mừng bé!',
    subtitle: 'Gia Đình Thông Minh',
    description: 'Ứng dụng học tập vui nhộn dành cho bé từ 3-10 tuổi',
    bg: 'from-indigo-500 to-purple-600',
    features: ['Học mà chơi', 'Chơi mà học', 'Tiến bộ mỗi ngày'],
    tip: '💡 Học 15-30 phút mỗi ngày là đủ!'
  },
  {
    icon: '📚',
    title: '5 Môn Học',
    subtitle: 'Kiến thức toàn diện',
    description: 'Toán, Tiếng Việt, Tiếng Anh, Khoa học & Kỹ năng sống với 500+ bài học',
    bg: 'from-blue-500 to-cyan-500',
    features: ['🔢 Toán học', '📖 Tiếng Việt', '🌍 Tiếng Anh', '🔬 Khoa học', '🌱 Kỹ năng sống'],
    tip: '💡 Bắt đầu với 3 bài đầu được mở khóa sẵn!'
  },
  {
    icon: '🌱',
    title: 'Kỹ Năng Sống',
    subtitle: 'Môn học mới!',
    description: 'Học về an toàn, lễ phép, cảm xúc và kỹ năng tự lập cho bé',
    bg: 'from-teal-500 to-cyan-500',
    features: ['🚦 An toàn giao thông', '🙏 Lễ phép', '😊 Cảm xúc', '🧹 Tự lập'],
    tip: '💡 Kỹ năng sống quan trọng như kiến thức!'
  },
  {
    icon: '🎮',
    title: '8 Trò Chơi',
    subtitle: 'Học qua game',
    description: 'Rèn luyện tư duy, trí nhớ, phản xạ qua các mini game hấp dẫn',
    bg: 'from-pink-500 to-rose-500',
    features: ['🃏 Lật hình nhớ', '🏎️ Đua xe toán', '🔨 Đập chuột', '🎯 Bắn bóng'],
    tip: '💡 Chơi game cũng nhận XP và streak!'
  },
  {
    icon: '🏆',
    title: 'Bảng Xếp Hạng',
    subtitle: 'Thi đua vui vẻ',
    description: 'Xem thứ hạng của bé so với các bạn khác, động lực học tập mỗi ngày',
    bg: 'from-amber-500 to-orange-500',
    features: ['🥇 Top hàng ngày', '🥈 Top tuần', '🥉 Top tháng', '📊 Thống kê'],
    tip: '💡 Học đều đặn để lên top bảng xếp hạng!'
  },
  {
    icon: '🐾',
    title: 'Pet Đáng Yêu',
    subtitle: 'Bạn đồng hành',
    description: 'Nuôi pet ảo, học mỗi ngày để pet tiến hóa và vui vẻ!',
    bg: 'from-purple-500 to-pink-500',
    features: ['🐱 6 loại pet', '⭐ 5 cấp tiến hóa', '❤️ Chăm sóc mỗi ngày'],
    tip: '💡 Pet buồn nếu bé nghỉ học quá 3 ngày!'
  },
  {
    icon: '👨‍👩‍👧',
    title: 'Phụ Huynh Yên Tâm',
    subtitle: 'Theo dõi tiến độ',
    description: 'Dashboard cho phụ huynh xem báo cáo chi tiết, gửi động viên cho bé',
    bg: 'from-green-500 to-emerald-500',
    features: ['📋 Báo cáo chi tiết', '📊 Điểm theo môn', '💌 Gửi động viên'],
    tip: '💡 Nhập mã PIN để vào khu vực phụ huynh!'
  }
];

export default function Onboarding({ onComplete }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);

  const nextSlide = () => {
    if (currentSlide === SLIDES.length - 1) {
      // Lưu đã xem onboarding
      localStorage.setItem('gdtm_onboarding_seen', 'true');
      onComplete();
    } else {
      setDirection(1);
      setCurrentSlide(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide(prev => prev - 1);
    }
  };

  const skipOnboarding = () => {
    localStorage.setItem('gdtm_onboarding_seen', 'true');
    onComplete();
  };

  const slide = SLIDES[currentSlide];
  const isLast = currentSlide === SLIDES.length - 1;

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0
    })
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${slide.bg} flex flex-col`}>
      {/* Skip button */}
      <div className="p-4 flex justify-between items-center">
        <div className="text-white/70 text-sm">
          {currentSlide + 1}/{SLIDES.length}
        </div>
        <button
          onClick={skipOnboarding}
          className="text-white/70 text-sm font-medium hover:text-white transition px-3 py-1 bg-white/10 rounded-full"
        >
          Bỏ qua →
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-4">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="text-center w-full max-w-md"
          >
            {/* Icon with floating animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, y: [0, -10, 0] }}
              transition={{
                scale: { delay: 0.2, type: 'spring' },
                y: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
              }}
              className="w-28 h-28 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-6xl mb-5 shadow-2xl"
            >
              {slide.icon}
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-white mb-1"
            >
              {slide.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-white/80 text-lg font-medium mb-3"
            >
              {slide.subtitle}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-white/70 max-w-xs mx-auto mb-4 text-sm"
            >
              {slide.description}
            </motion.p>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap justify-center gap-2 mb-4"
            >
              {slide.features.map((feature, i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                  className="px-3 py-1.5 bg-white/20 rounded-full text-white text-sm font-medium"
                >
                  {feature}
                </motion.span>
              ))}
            </motion.div>

            {/* Tip Box */}
            {slide.tip && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 mx-4"
              >
                <p className="text-white/90 text-sm">{slide.tip}</p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="p-6 pb-8">
        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-5">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > currentSlide ? 1 : -1);
                setCurrentSlide(i);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentSlide
                  ? 'w-8 bg-white'
                  : i < currentSlide
                  ? 'w-2 bg-white/70'
                  : 'w-2 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          {currentSlide > 0 && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={prevSlide}
              className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-white hover:bg-white/30 transition"
            >
              <ChevronLeft size={24} />
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={nextSlide}
            className={`flex-1 h-14 bg-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg ${
              isLast ? 'text-green-600' : 'text-indigo-600'
            }`}
          >
            {isLast ? (
              <>
                <Sparkles size={20} />
                Bắt đầu học ngay!
              </>
            ) : (
              <>
                Tiếp theo
                <ChevronRight size={20} />
              </>
            )}
          </motion.button>
        </div>

        {/* Quick start hint on last slide */}
        {isLast && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-white/60 text-sm mt-4"
          >
            Nhấn để vào trang chủ và bắt đầu học! 🚀
          </motion.p>
        )}
      </div>
    </div>
  );
}
