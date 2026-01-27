// src/components/landing/SolutionsSection.jsx
// Section giải pháp của SchoolHub
import React from 'react';
import { ArrowRight } from 'lucide-react';

const SOLUTIONS = [
  {
    before: '📱',
    after: '📚',
    title: 'Biến thời gian xem điện thoại thành thời gian HỌC',
    desc: 'Con vẫn được dùng điện thoại, nhưng để học những điều bổ ích',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    before: '😰',
    after: '😊',
    title: 'Học qua TRÒ CHƠI - Con THÍCH học, đòi học mỗi ngày',
    desc: 'Biến bài học thành trò chơi hấp dẫn, con không còn sợ học',
    color: 'from-green-500 to-emerald-500',
  },
  {
    before: '🤯',
    after: '🧠',
    title: 'Phương pháp lặp lại thông minh - Nhớ lâu, hiểu sâu',
    desc: 'Thuật toán AI nhắc nhở ôn tập đúng lúc để kiến thức không bị quên',
    color: 'from-purple-500 to-pink-500',
  },
  {
    before: '⏰',
    after: '✅',
    title: 'Con TỰ HỌC - Bạn chỉ cần xem báo cáo tiến độ',
    desc: 'Giao diện thân thiện, con tự học được. Phụ huynh theo dõi từ xa',
    color: 'from-orange-500 to-red-500',
  },
];

export default function SolutionsSection() {
  return (
    <section id="solutions" className="py-16 sm:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-4xl mb-4">✨</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            SchoolHub giải quyết như thế nào?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Chúng tôi đã giúp hàng nghìn phụ huynh giải quyết những vấn đề này
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {SOLUTIONS.map((solution, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 hover:border-green-200"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-4">
                {/* Before/After Icons */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">{solution.before}</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors" />
                  <div className={`w-14 h-14 bg-gradient-to-br ${solution.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <span className="text-2xl">{solution.after}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                    {solution.title}
                  </h3>
                  <p className="text-sm text-gray-600">{solution.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Hãy để con bạn trải nghiệm ngay!
          </p>
          <button
            onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            🎮 Thử ngay bài học miễn phí
          </button>
        </div>
      </div>
    </section>
  );
}
