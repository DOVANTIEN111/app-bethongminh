// src/components/SplashScreen.jsx
// Màn hình loading khi khởi động app
import React from 'react';
import { motion } from 'framer-motion';

export default function SplashScreen({ message = 'Đang tải...' }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center justify-center">
      {/* Decorative circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl"
        />
      </div>

      {/* Logo */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', duration: 0.8 }}
        className="relative"
      >
        <div className="w-28 h-28 bg-white rounded-3xl flex items-center justify-center text-6xl shadow-2xl">
          🎓
        </div>
        
        {/* Pulse ring */}
        <motion.div
          animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-0 bg-white/30 rounded-3xl"
        />
      </motion.div>

      {/* App name */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 text-2xl font-bold text-white"
      >
        SchoolHub
      </motion.h1>

      {/* Loading indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 flex flex-col items-center"
      >
        {/* Bouncing dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.1,
              }}
              className="w-3 h-3 bg-white rounded-full"
            />
          ))}
        </div>
        
        {/* Message */}
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-4 text-white/80 text-sm"
        >
          {message}
        </motion.p>
      </motion.div>

      {/* Fun facts while loading */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-0 right-0 text-center"
      >
        <LoadingTips />
      </motion.div>
    </div>
  );
}

// Component hiển thị tips ngẫu nhiên
function LoadingTips() {
  const tips = [
    { emoji: '💡', text: 'Học 15 phút mỗi ngày giúp bé nhớ lâu hơn!' },
    { emoji: '🎮', text: 'Chơi game giúp rèn luyện tư duy logic' },
    { emoji: '🐾', text: 'Đừng quên chăm sóc pet mỗi ngày nhé!' },
    { emoji: '🔥', text: 'Duy trì streak để nhận thưởng đặc biệt' },
    { emoji: '📚', text: 'Đọc truyện giúp bé phát triển ngôn ngữ' },
    { emoji: '⭐', text: 'Mỗi bài học hoàn thành = XP tăng lên!' },
  ];

  const [tipIndex, setTipIndex] = React.useState(
    Math.floor(Math.random() * tips.length)
  );

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tips.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const tip = tips[tipIndex];

  return (
    <motion.div
      key={tipIndex}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="px-6"
    >
      <p className="text-white/60 text-sm">
        <span className="mr-2">{tip.emoji}</span>
        {tip.text}
      </p>
    </motion.div>
  );
}

// Mini loading spinner for inline use
export function LoadingSpinner({ size = 'md', color = 'white' }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
    xl: 'w-12 h-12 border-4',
  };

  const colorClasses = {
    white: 'border-white/30 border-t-white',
    indigo: 'border-indigo-200 border-t-indigo-600',
    gray: 'border-gray-200 border-t-gray-600',
  };

  return (
    <div
      className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-spin`}
    />
  );
}

// Skeleton loader for content
export function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded-lg ${className}`}
    />
  );
}

// Content placeholder while loading
export function ContentLoader({ rows = 3 }) {
  return (
    <div className="space-y-3">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
