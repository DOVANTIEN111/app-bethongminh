// src/components/landing/BeforeAfterSection.jsx
// Section so sánh trước/sau 30 ngày sử dụng
import React, { useState } from 'react';

const COMPARISONS = [
  { before: '😫 Sợ học', after: '😊 Thích học' },
  { before: '📱 Nghiện game', after: '📚 Nghiện học' },
  { before: '📉 Điểm 5-6', after: '📈 Điểm 8-10' },
  { before: '😰 PH lo lắng', after: '😌 PH yên tâm' },
];

export default function BeforeAfterSection() {
  const [sliderValue, setSliderValue] = useState(50);

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-4xl mb-4">📈</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Sự thay đổi sau 30 ngày sử dụng SchoolHub
          </h2>
          <p className="text-lg text-gray-600">
            Kéo thanh trượt để xem sự khác biệt
          </p>
        </div>

        {/* Slider Comparison */}
        <div className="relative max-w-2xl mx-auto mb-8">
          {/* Before/After labels */}
          <div className="flex justify-between mb-4">
            <span className="text-red-500 font-bold flex items-center gap-2">
              <span className="w-3 h-3 bg-red-500 rounded-full" />
              TRƯỚC
            </span>
            <span className="text-green-500 font-bold flex items-center gap-2">
              SAU
              <span className="w-3 h-3 bg-green-500 rounded-full" />
            </span>
          </div>

          {/* Comparison Cards */}
          <div className="relative bg-gray-100 rounded-3xl overflow-hidden h-64">
            {/* Before side */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-red-50 to-orange-50 p-6"
              style={{ clipPath: `inset(0 ${100 - sliderValue}% 0 0)` }}
            >
              <div className="h-full flex flex-col justify-center space-y-4">
                {COMPARISONS.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-3 shadow-sm"
                  >
                    <span className="text-lg">{item.before}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* After side */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 p-6"
              style={{ clipPath: `inset(0 0 0 ${sliderValue}%)` }}
            >
              <div className="h-full flex flex-col justify-center space-y-4">
                {COMPARISONS.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-3 shadow-sm"
                  >
                    <span className="text-lg">{item.after}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Slider line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10"
              style={{ left: `${sliderValue}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center cursor-grab">
                <span className="text-gray-400">↔️</span>
              </div>
            </div>
          </div>

          {/* Slider input */}
          <input
            type="range"
            min="10"
            max="90"
            value={sliderValue}
            onChange={(e) => setSliderValue(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-grab z-20"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="text-center p-4 bg-green-50 rounded-2xl">
            <p className="text-3xl font-bold text-green-600">87%</p>
            <p className="text-sm text-gray-600">Con thích học hơn</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-2xl">
            <p className="text-3xl font-bold text-blue-600">92%</p>
            <p className="text-sm text-gray-600">Điểm số cải thiện</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-2xl">
            <p className="text-3xl font-bold text-purple-600">2.5h</p>
            <p className="text-sm text-gray-600">Thời gian học/ngày</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-2xl">
            <p className="text-3xl font-bold text-orange-600">95%</p>
            <p className="text-sm text-gray-600">PH hài lòng</p>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-sm text-gray-500">
          * Kết quả khảo sát từ 1,000 phụ huynh sau 30 ngày sử dụng SchoolHub
        </p>
      </div>
    </section>
  );
}
