// src/components/landing/PainPointsSection.jsx
// Section nỗi đau của phụ huynh với checkbox tương tác
import React, { useState } from 'react';
import { Check } from 'lucide-react';

const PAIN_POINTS = [
  {
    icon: '📱',
    title: 'Nghiện điện thoại, iPad',
    desc: 'Chỉ thích xem YouTube, chơi game suốt ngày',
    color: 'from-red-500 to-orange-500',
    bgColor: 'bg-red-50',
  },
  {
    icon: '😰',
    title: 'Sợ học, chán học',
    desc: 'Mỗi lần học là một cuộc chiến với con',
    color: 'from-amber-500 to-yellow-500',
    bgColor: 'bg-amber-50',
  },
  {
    icon: '🤯',
    title: 'Học mãi không nhớ',
    desc: 'Học trước quên sau, không hiểu bài',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50',
  },
  {
    icon: '⏰',
    title: 'Bạn không có thời gian',
    desc: 'Công việc bận rộn, không kèm con được',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50',
  },
];

export default function PainPointsSection({ onScrollToDemo }) {
  const [checked, setChecked] = useState([]);

  const toggleCheck = (index) => {
    setChecked((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-4xl mb-4">😫</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Con bạn có đang gặp vấn đề này?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hãy chọn những vấn đề mà con bạn đang gặp phải
          </p>
        </div>

        {/* Pain Points Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {PAIN_POINTS.map((point, index) => {
            const isChecked = checked.includes(index);
            return (
              <div
                key={index}
                onClick={() => toggleCheck(index)}
                className={`relative cursor-pointer rounded-2xl p-6 border-2 transition-all ${
                  isChecked
                    ? 'border-green-500 bg-green-50 shadow-lg scale-105'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
              >
                {/* Checkbox */}
                <div
                  className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isChecked ? 'bg-green-500 border-green-500' : 'border-gray-300'
                  }`}
                >
                  {isChecked && <Check className="w-4 h-4 text-white" />}
                </div>

                {/* Icon */}
                <div className={`w-16 h-16 ${point.bgColor} rounded-2xl flex items-center justify-center mb-4`}>
                  <span className="text-3xl">{point.icon}</span>
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-gray-900 mb-2">{point.title}</h3>
                <p className="text-sm text-gray-600">{point.desc}</p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        {checked.length > 0 && (
          <div className="text-center animate-fade-in">
            <div className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl shadow-lg">
              <p className="text-lg font-bold mb-2">
                ✨ Nếu con bạn gặp {checked.length > 1 ? 'ít nhất 1' : ''} vấn đề trên...
              </p>
              <p className="text-white/90">
                SchoolHub chính là <strong>giải pháp hoàn hảo</strong> cho gia đình bạn!
              </p>
            </div>
            <button
              onClick={onScrollToDemo}
              className="mt-6 inline-flex items-center gap-2 text-green-600 font-semibold hover:text-green-700"
            >
              <span>👇</span>
              Xem cách SchoolHub giải quyết
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
