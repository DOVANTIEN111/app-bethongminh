// src/components/landing/TargetUsers.jsx
// Target Users Section for Landing Page
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';

const TARGET_USERS = [
  {
    icon: '🏫',
    title: 'Dành cho Nhà trường',
    description: 'Quản lý toàn bộ trường học, giáo viên, học sinh trên một nền tảng thống nhất',
    features: [
      'Quản lý bộ phận, khoa, phòng',
      'Phân công giáo viên linh hoạt',
      'Báo cáo thống kê chi tiết',
      'Quản lý tài chính, học phí',
    ],
    buttonText: 'Đăng ký Nhà trường',
    buttonLink: '/register/school',
    gradient: 'from-indigo-500 to-purple-600',
    bgGradient: 'from-indigo-50 to-purple-50',
  },
  {
    icon: '👨‍🏫',
    title: 'Dành cho Giáo viên',
    description: 'Tạo bài giảng, giao bài tập, theo dõi tiến độ học sinh một cách dễ dàng',
    features: [
      'Tạo bài giảng đa phương tiện',
      'Giao bài tập, kiểm tra online',
      'Chấm điểm tự động thông minh',
      'Liên lạc phụ huynh nhanh chóng',
    ],
    buttonText: 'Đăng ký Giáo viên',
    buttonLink: '/register/teacher',
    gradient: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-50 to-cyan-50',
  },
  {
    icon: '👨‍👩‍👧',
    title: 'Dành cho Phụ huynh',
    description: 'Đăng ký cho con học, theo dõi tiến độ, liên lạc với giáo viên mọi lúc',
    features: [
      'Xem tiến độ học tập của con',
      'Chat trực tiếp với giáo viên',
      'Nhận thông báo kịp thời',
      'Quản lý nhiều con cùng lúc',
    ],
    buttonText: 'Đăng ký cho con',
    buttonLink: '/register',
    gradient: 'from-green-500 to-emerald-500',
    bgGradient: 'from-green-50 to-emerald-50',
  },
  {
    icon: '👧',
    title: 'Dành cho Học sinh',
    description: 'Học vui, chơi hay - 30 ngày dùng thử hoàn toàn miễn phí!',
    features: [
      '500+ bài học tương tác',
      'Trò chơi giáo dục hấp dẫn',
      'Phần thưởng, huy hiệu động lực',
      'Học mọi lúc, mọi nơi',
    ],
    buttonText: 'Học thử miễn phí',
    buttonLink: '/register',
    gradient: 'from-orange-500 to-pink-500',
    bgGradient: 'from-orange-50 to-pink-50',
    highlight: true,
  },
];

export default function TargetUsers() {
  return (
    <section id="target-users" className="py-16 sm:py-20 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Giải pháp cho <span className="text-blue-600">mọi đối tượng</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Dù bạn là Nhà trường, Giáo viên, Phụ huynh hay Học sinh - SchoolHub đều có giải pháp phù hợp
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TARGET_USERS.map((user, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border-2 ${
                user.highlight ? 'border-orange-300' : 'border-transparent hover:border-blue-100'
              }`}
            >
              {/* Highlight badge */}
              {user.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                  Phổ biến nhất
                </div>
              )}

              {/* Icon */}
              <div className={`w-16 h-16 bg-gradient-to-br ${user.bgGradient} rounded-2xl flex items-center justify-center mb-5`}>
                <span className="text-4xl">{user.icon}</span>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {user.title}
              </h3>
              <p className="text-gray-600 text-sm mb-5">
                {user.description}
              </p>

              {/* Features */}
              <ul className="space-y-2 mb-6">
                {user.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Button */}
              <Link
                to={user.buttonLink}
                className={`block w-full text-center py-3 px-4 rounded-xl font-semibold transition-all active:scale-95 ${
                  user.highlight
                    ? `bg-gradient-to-r ${user.gradient} text-white shadow-lg hover:shadow-xl`
                    : 'bg-gray-100 text-gray-700 hover:bg-blue-600 hover:text-white'
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  {user.buttonText}
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
