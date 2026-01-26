// src/components/landing/FeaturesSection.jsx
// Features Section for Landing Page
import React from 'react';
import { BookOpen, Gamepad2, BarChart3, Users, School, MessageCircle } from 'lucide-react';

const FEATURES = [
  {
    icon: BookOpen,
    title: '500+ Bài học tương tác',
    description: 'Toán, Tiếng Việt, Tiếng Anh, Khoa học - Nội dung phong phú, cập nhật liên tục',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    icon: Gamepad2,
    title: 'Học qua trò chơi',
    description: 'Trẻ thích thú học tập, Phụ huynh yên tâm về nội dung giáo dục lành mạnh',
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50',
    iconColor: 'text-orange-600',
  },
  {
    icon: BarChart3,
    title: 'Theo dõi tiến độ real-time',
    description: 'Biết ngay con học đến đâu, mạnh yếu ở đâu để hỗ trợ kịp thời',
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
    iconColor: 'text-green-600',
  },
  {
    icon: Users,
    title: 'Công cụ quản lý lớp học',
    description: 'Giáo viên tạo bài giảng, giao bài tập, chấm điểm tự động dễ dàng',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  {
    icon: School,
    title: 'Quản lý trường học toàn diện',
    description: 'Hệ thống quản lý bộ phận, giáo viên, học sinh trên một nền tảng',
    color: 'from-indigo-500 to-indigo-600',
    bgColor: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
  },
  {
    icon: MessageCircle,
    title: 'Kết nối dễ dàng',
    description: 'Giáo viên - Phụ huynh trao đổi nhanh chóng qua hệ thống tin nhắn',
    color: 'from-pink-500 to-pink-600',
    bgColor: 'bg-pink-50',
    iconColor: 'text-pink-600',
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Tại sao chọn <span className="text-blue-600">SchoolHub</span>?
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Nền tảng học tập toàn diện với công nghệ hiện đại, giúp việc học trở nên thú vị và hiệu quả hơn
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {FEATURES.map((feature, index) => (
            <div
              key={index}
              className="group p-6 sm:p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300"
            >
              {/* Icon */}
              <div className={`w-14 h-14 ${feature.bgColor} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 sm:mt-16">
          <p className="text-gray-600 mb-4">Và còn nhiều tính năng hữu ích khác...</p>
          <button
            onClick={() => document.getElementById('target-users')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
          >
            Khám phá thêm
            <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
