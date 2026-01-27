// src/components/landing/SimpleRegisterForm.jsx
// Form đăng ký đơn giản chỉ với SĐT hoặc Email
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Sparkles, Users, Lock } from 'lucide-react';

export default function SimpleRegisterForm() {
  const navigate = useNavigate();
  const [contact, setContact] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const validateInput = (value) => {
    // Check if it's a phone number (Vietnamese format)
    const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
    // Check if it's an email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return phoneRegex.test(value.replace(/\s/g, '')) || emailRegex.test(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!contact.trim()) {
      setError('Vui lòng nhập số điện thoại hoặc email');
      return;
    }

    if (!validateInput(contact)) {
      setError('Số điện thoại hoặc email không hợp lệ');
      return;
    }

    setIsSubmitting(true);

    // Redirect to full registration page with prefilled contact
    setTimeout(() => {
      navigate(`/register?contact=${encodeURIComponent(contact)}`);
    }, 500);
  };

  return (
    <section id="register" className="py-16 sm:py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Left side - Form */}
            <div className="p-8 sm:p-12">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                Dùng thử MIỄN PHÍ 30 ngày
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                Đăng ký ngay trong 30 giây
              </h2>
              <p className="text-gray-600 mb-8">
                Chỉ cần SĐT hoặc Email - Không cần thẻ tín dụng
              </p>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <input
                    type="text"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="Nhập số điện thoại hoặc email"
                    className={`w-full px-5 py-4 text-lg border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      error ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                  />
                  {error && (
                    <p className="mt-2 text-sm text-red-600">{error}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      Bắt đầu học MIỄN PHÍ
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              {/* Trust indicators */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  <span>Bảo mật 100%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Không spam</span>
                </div>
              </div>
            </div>

            {/* Right side - Benefits */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 sm:p-12 flex flex-col justify-center">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Bạn sẽ nhận được:
              </h3>

              <div className="space-y-4">
                {[
                  '30 ngày Premium miễn phí',
                  'Truy cập 500+ bài học',
                  'Theo dõi tiến độ chi tiết',
                  'Hỗ trợ 24/7',
                  'Không tự động gia hạn',
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* Social proof */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {['👧', '👦', '👩', '👨'].map((emoji, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center border-2 border-white"
                      >
                        <span className="text-sm">{emoji}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>
                      <strong className="text-gray-900">10,000+</strong> phụ huynh đã đăng ký
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
