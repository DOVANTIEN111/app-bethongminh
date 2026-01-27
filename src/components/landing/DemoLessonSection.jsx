// src/components/landing/DemoLessonSection.jsx
// Section demo bài học - Điểm nhấn chính của landing page
import React from 'react';
import DemoLesson from './DemoLesson';

export default function DemoLessonSection() {
  return (
    <section id="demo" className="py-16 sm:py-20 bg-gradient-to-b from-purple-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block text-4xl mb-4">🎮</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Thử ngay! Xem con bạn sẽ học như thế nào
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Trải nghiệm 1 bài học Toán trong 30 giây -{' '}
            <span className="text-green-600 font-semibold">Không cần đăng ký</span>
          </p>
        </div>

        {/* Demo Component */}
        <DemoLesson />

        {/* Additional info */}
        <div className="mt-10 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Học qua trò chơi
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Phản hồi ngay lập tức
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Điểm thưởng hấp dẫn
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Con tự học được
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
