// src/components/Onboarding.jsx
// Màn hình giới thiệu app cho user mới
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';

const SLIDES = [
  {
    icon: '👋',
    title: 'Chào mừng bé!',
    subtitle: 'Gia Đình Thông Minh',
    description: 'Ứng dụng học tập vui nhộn dành cho bé từ 3-10 tuổi',
    bg: 'from-indigo-500 to-purple-600',
    features: ['Học mà chơi', 'Chơi mà học']
  },
  {
    icon: '📚',
    title: '4 Môn Học',
    subtitle: 'Kiến thức đa dạng',
    description: 'Toán, Tiếng Việt, Tiếng Anh, Khoa học với 400+ bài học thú vị',
    bg: 'from-blue-500 to-cyan-500',
    features: ['Toán học vui', 'Tiếng Việt hay', 'English Zone', 'Khoa học thú vị']
  },
  {
    icon: '🎮',
    title: '8 Trò Chơi',
    subtitle: 'Học qua game',
    description: 'Rèn luyện tư duy, trí nhớ, phản xạ qua các mini game hấp dẫn',
    bg: 'from-pink-500 to-rose-500',
    features: ['Lật hình nhớ', 'Đua xe toán', 'Đập chuột', 'Bắn bóng']
  },
  {
    icon: '🐾',
    title: 'Pet Đáng Yêu',
    subtitle: 'Bạn đồng hành',
    description: 'Nuôi pet ảo, học mỗi ngày để pet tiến hóa và vui vẻ!',
    bg: 'from-amber-500 to-orange-500',
    features: ['6 loại pet', '5 cấp tiến hóa', 'Chăm sóc mỗi ngày']
  },
  {
    icon: '👨‍👩‍👧',
    title: 'Phụ Huynh Yên Tâm',
    subtitle: 'Theo dõi tiến độ',
    description: 'Dashboard cho phụ huynh xem tiến độ, gửi động viên cho bé',
    bg: 'from-green-500 to-emerald-500',
    features: ['Báo cáo chi tiết', 'Quản lý thời gian', 'Gửi động viên']
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
      <div className="p-4 flex justify-end">
        <button
          onClick={skipOnboarding}
          className="text-white/70 text-sm font-medium hover:text-white transition"
        >
          Bỏ qua →
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="text-center"
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-32 h-32 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-7xl mb-6 shadow-2xl"
            >
              {slide.icon}
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold text-white mb-2"
            >
              {slide.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-white/80 text-lg font-medium mb-4"
            >
              {slide.subtitle}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-white/70 max-w-xs mx-auto mb-6"
            >
              {slide.description}
            </motion.p>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap justify-center gap-2"
            >
              {slide.features.map((feature, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-white/20 rounded-full text-white text-sm"
                >
                  {feature}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="p-6 pb-8">
        {/* Dots */}
        <div className="flex justify-center gap-2 mb-6">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > currentSlide ? 1 : -1);
                setCurrentSlide(i);
              }}
              className={`h-2 rounded-full transition-all ${
                i === currentSlide 
                  ? 'w-8 bg-white' 
                  : 'w-2 bg-white/40 hover:bg-white/60'
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
                Bắt đầu ngay!
              </>
            ) : (
              <>
                Tiếp theo
                <ChevronRight size={20} />
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
