// src/components/landing/TestimonialsSection.jsx
// Testimonials Section for Landing Page
import React from 'react';
import { Star, Quote } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Thầy Nguyễn Văn Hùng',
    role: 'Hiệu trưởng Trường TH Nguyễn Trãi',
    avatar: '👨‍💼',
    content: 'SchoolHub giúp trường chúng tôi số hóa hoàn toàn quy trình quản lý. Giáo viên dễ dàng theo dõi học sinh, phụ huynh yên tâm hơn về việc học của con. Thật sự là một bước tiến lớn!',
    rating: 5,
    highlight: 'Số hóa hoàn toàn quy trình quản lý',
  },
  {
    name: 'Cô Trần Thị Mai',
    role: 'Giáo viên Tiếng Anh, Trường TH Lê Lợi',
    avatar: '👩‍🏫',
    content: 'Tôi tiết kiệm được rất nhiều thời gian soạn bài và chấm điểm. Hệ thống chấm điểm tự động rất chính xác, còn có thể tùy chỉnh theo ý muốn. Học sinh cũng hào hứng hơn khi học qua app.',
    rating: 5,
    highlight: 'Tiết kiệm thời gian soạn bài và chấm điểm',
  },
  {
    name: 'Chị Lê Thị Hương',
    role: 'Phụ huynh bé Minh, lớp 2',
    avatar: '👩',
    content: 'Con tôi rất thích học trên SchoolHub, mỗi ngày đều tự giác mở app ra học mà không cần nhắc. Tôi có thể theo dõi tiến độ học của con mọi lúc, rất yên tâm. Đáng giá từng đồng!',
    rating: 5,
    highlight: 'Con tự giác học mỗi ngày',
  },
];

const STATS = [
  { value: '10,000+', label: 'Học sinh', icon: '👧' },
  { value: '500+', label: 'Giáo viên', icon: '👨‍🏫' },
  { value: '50+', label: 'Trường học', icon: '🏫' },
  { value: '100,000+', label: 'Bài học hoàn thành', icon: '📚' },
];

export default function TestimonialsSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Khách hàng nói gì về <span className="text-blue-600">SchoolHub</span>?
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Hàng ngàn nhà trường, giáo viên và phụ huynh đã tin tưởng sử dụng
          </p>
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {TESTIMONIALS.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Quote icon */}
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <Quote className="w-5 h-5 text-blue-600" />
              </div>

              {/* Highlight */}
              <div className="inline-block bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1 rounded-full mb-4">
                "{testimonial.highlight}"
              </div>

              {/* Content */}
              <p className="text-gray-700 leading-relaxed mb-6">
                "{testimonial.content}"
              </p>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-2xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 shadow-lg">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-3">{stat.icon}</div>
                <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </p>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
