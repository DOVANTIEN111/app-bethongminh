// src/components/landing/TestimonialsSection.jsx
// Testimonials Section for Landing Page - Parent-focused
import React, { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Chị Lan',
    role: 'Mẹ bé Bống (6 tuổi)',
    avatar: '👩',
    avatarBg: 'from-pink-400 to-rose-500',
    content: 'Con tôi từ sợ Toán, giờ đòi học mỗi ngày. Điểm tăng từ 6 lên 9 chỉ sau 2 tháng! Bé rất thích những bài học có hình ảnh và được thưởng sao.',
    rating: 5,
    highlight: 'Điểm tăng từ 6 lên 9 sau 2 tháng',
    beforeAfter: { before: 'Sợ học Toán', after: 'Đòi học mỗi ngày' },
  },
  {
    name: 'Anh Minh',
    role: 'Bố bé Bin (7 tuổi)',
    avatar: '👨',
    avatarBg: 'from-blue-400 to-indigo-500',
    content: 'App rất dễ dùng, con tự học được mà không cần bố mẹ kèm. Giờ con thích học hơn chơi game! Tôi có thể theo dõi con học từ văn phòng.',
    rating: 5,
    highlight: 'Con thích học hơn chơi game',
    beforeAfter: { before: 'Chỉ thích chơi game', after: 'Tự giác học mỗi ngày' },
  },
  {
    name: 'Chị Hoa',
    role: 'Mẹ bé Na (5 tuổi)',
    avatar: '👩',
    avatarBg: 'from-purple-400 to-pink-500',
    content: 'Bé nhà mình học chữ cái rất nhanh nhờ app này. Giao diện dễ thương, bé rất thích! Quan trọng là bé không còn đòi xem YouTube nữa.',
    rating: 5,
    highlight: 'Học chữ cái rất nhanh',
    beforeAfter: { before: 'Nghiện YouTube', after: 'Học chữ siêu nhanh' },
  },
  {
    name: 'Anh Tuấn',
    role: 'Bố bé Minh (8 tuổi)',
    avatar: '👨',
    avatarBg: 'from-green-400 to-emerald-500',
    content: 'Đầu tư rất xứng đáng! Con tiến bộ rõ rệt, phụ huynh theo dõi được tiến độ dễ dàng. Cô giáo còn khen con học ở nhà chăm chỉ.',
    rating: 5,
    highlight: 'Con tiến bộ rõ rệt',
    beforeAfter: { before: 'Học trước quên sau', after: 'Nhớ bài lâu hơn' },
  },
];

const STATS = [
  { value: '10,000+', label: 'Học sinh', icon: '👧' },
  { value: '500+', label: 'Giáo viên', icon: '👨‍🏫' },
  { value: '50+', label: 'Trường học', icon: '🏫' },
  { value: '100,000+', label: 'Bài học hoàn thành', icon: '📚' },
];

export default function TestimonialsSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-slide on mobile
  useEffect(() => {
    if (!isMobile) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isMobile]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % TESTIMONIALS.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-block text-4xl mb-4">💬</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Phụ huynh nói gì về <span className="text-blue-600">SchoolHub</span>?
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Hàng ngàn phụ huynh đã tin tưởng và thấy con tiến bộ rõ rệt
          </p>
        </div>

        {/* Desktop: Grid 4 columns */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {TESTIMONIALS.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Before/After badge */}
              <div className="flex items-center gap-2 mb-4 text-xs">
                <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full line-through">
                  {testimonial.beforeAfter.before}
                </span>
                <span className="text-gray-400">→</span>
                <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full font-medium">
                  {testimonial.beforeAfter.after}
                </span>
              </div>

              {/* Content */}
              <p className="text-gray-700 leading-relaxed mb-4 text-sm">
                "{testimonial.content}"
              </p>

              {/* Rating */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 bg-gradient-to-br ${testimonial.avatarBg} rounded-full flex items-center justify-center text-xl shadow-lg`}>
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{testimonial.name}</p>
                  <p className="text-xs text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: Carousel */}
        <div className="md:hidden relative mb-12">
          <div className="overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {TESTIMONIALS.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-2">
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    {/* Before/After badge */}
                    <div className="flex flex-wrap items-center gap-2 mb-4 text-xs">
                      <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full line-through">
                        {testimonial.beforeAfter.before}
                      </span>
                      <span className="text-gray-400">→</span>
                      <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full font-medium">
                        {testimonial.beforeAfter.after}
                      </span>
                    </div>

                    {/* Content */}
                    <p className="text-gray-700 leading-relaxed mb-4">
                      "{testimonial.content}"
                    </p>

                    {/* Rating */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>

                    {/* Author */}
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 bg-gradient-to-br ${testimonial.avatarBg} rounded-full flex items-center justify-center text-2xl shadow-lg`}>
                        {testimonial.avatar}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{testimonial.name}</p>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel controls */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={prevSlide}
              className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentSlide === index ? 'bg-blue-600 w-6' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={nextSlide}
              className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
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
