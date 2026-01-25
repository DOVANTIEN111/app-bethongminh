// src/pages/PricingPage.jsx
// Trang hiển thị các gói cước
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import {
  Check, X, Star, Crown, Zap, ArrowLeft, Clock,
  BookOpen, Award, MessageCircle, Sparkles
} from 'lucide-react';

const PLANS = [
  {
    id: 'free',
    name: 'Miễn phí',
    price: 0,
    period: 'mãi mãi',
    description: 'Bắt đầu học ngay',
    features: [
      { text: '3 bài học mỗi môn', included: true },
      { text: 'Bài tập cơ bản', included: true },
      { text: 'Hỗ trợ cơ bản', included: true },
      { text: 'Tất cả bài học', included: false },
      { text: 'Chứng chỉ hoàn thành', included: false },
      { text: 'Hỗ trợ ưu tiên', included: false },
    ],
    popular: false,
    icon: BookOpen,
    color: 'gray',
  },
  {
    id: 'student-premium-monthly',
    name: 'Premium Tháng',
    price: 49000,
    period: '/tháng',
    description: 'Phổ biến nhất',
    features: [
      { text: 'Tất cả bài học', included: true },
      { text: 'Học không giới hạn', included: true },
      { text: 'Bài tập nâng cao', included: true },
      { text: 'Chứng chỉ hoàn thành', included: true },
      { text: 'Hỗ trợ ưu tiên 24/7', included: true },
      { text: 'Báo cáo tiến độ chi tiết', included: true },
    ],
    popular: true,
    icon: Star,
    color: 'indigo',
  },
  {
    id: 'student-premium-yearly',
    name: 'Premium Năm',
    price: 490000,
    period: '/năm',
    originalPrice: 588000,
    discount: '17%',
    description: 'Tiết kiệm nhất',
    features: [
      { text: 'Tất cả bài học', included: true },
      { text: 'Học không giới hạn', included: true },
      { text: 'Bài tập nâng cao', included: true },
      { text: 'Chứng chỉ hoàn thành', included: true },
      { text: 'Hỗ trợ ưu tiên 24/7', included: true },
      { text: 'Báo cáo tiến độ chi tiết', included: true },
    ],
    popular: false,
    icon: Crown,
    color: 'amber',
  },
];

export default function PricingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, profile } = useAuth();
  const [currentPlan, setCurrentPlan] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && profile) {
      loadSubscription();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, profile]);

  const loadSubscription = async () => {
    try {
      const { data } = await supabase
        .from('subscriptions')
        .select(`
          *,
          plan:plans(*)
        `)
        .eq('user_id', profile.id)
        .eq('status', 'active')
        .single();

      if (data) {
        setSubscription(data);
        setCurrentPlan(data.plan?.slug);
      }
    } catch (err) {
      console.error('Load subscription error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (planId) => {
    if (!isAuthenticated) {
      navigate('/register');
      return;
    }

    if (planId === 'free') {
      return;
    }

    // TODO: Implement payment flow
    alert('Tính năng thanh toán sẽ được cập nhật sớm!');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Quay lại</span>
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-xl font-bold text-gray-800">Bảng giá</h1>
          </div>
          <div className="w-20" /> {/* Spacer */}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 rounded-full px-4 py-2 mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Dùng thử miễn phí 30 ngày</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Chọn gói phù hợp với bạn
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Mở khóa toàn bộ bài học và tính năng với các gói Premium.
            Hủy bất cứ lúc nào.
          </p>
        </div>

        {/* Current Plan Info */}
        {subscription && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <Award className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="font-medium text-indigo-900">
                  Gói hiện tại: {subscription.plan?.name}
                </p>
                <p className="text-sm text-indigo-600">
                  {subscription.is_trial && (
                    <>
                      Còn {Math.max(0, Math.ceil((new Date(subscription.end_date) - new Date()) / (1000 * 60 * 60 * 24)))} ngày dùng thử
                    </>
                  )}
                </p>
              </div>
            </div>
            {subscription.is_trial && (
              <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                Dùng thử
              </span>
            )}
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            const isCurrentPlan = currentPlan === plan.id;
            const isTrial = subscription?.is_trial && currentPlan === 'trial';

            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all hover:shadow-xl ${
                  plan.popular
                    ? 'border-indigo-500 scale-105'
                    : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                      Phổ biến nhất
                    </span>
                  </div>
                )}

                {/* Discount Badge */}
                {plan.discount && (
                  <div className="absolute -top-3 -right-3">
                    <span className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                      -{plan.discount}
                    </span>
                  </div>
                )}

                <div className="p-6">
                  {/* Plan Header */}
                  <div className="text-center mb-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 ${
                      plan.color === 'indigo' ? 'bg-indigo-100' :
                      plan.color === 'amber' ? 'bg-amber-100' : 'bg-gray-100'
                    }`}>
                      <Icon className={`w-7 h-7 ${
                        plan.color === 'indigo' ? 'text-indigo-600' :
                        plan.color === 'amber' ? 'text-amber-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                    <p className="text-sm text-gray-500">{plan.description}</p>
                  </div>

                  {/* Price */}
                  <div className="text-center mb-6">
                    {plan.originalPrice && (
                      <p className="text-gray-400 line-through text-sm">
                        {formatPrice(plan.originalPrice)}
                      </p>
                    )}
                    <div className="flex items-end justify-center gap-1">
                      <span className="text-4xl font-bold text-gray-900">
                        {plan.price === 0 ? 'Miễn phí' : formatPrice(plan.price)}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-gray-500 mb-1">{plan.period}</span>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        {feature.included ? (
                          <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                            <Check className="w-3 h-3 text-green-600" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <X className="w-3 h-3 text-gray-400" />
                          </div>
                        )}
                        <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={isCurrentPlan && !isTrial}
                    className={`w-full py-3 rounded-xl font-semibold transition-all ${
                      isCurrentPlan && !isTrial
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : plan.popular
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:opacity-90'
                        : plan.color === 'amber'
                        ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:opacity-90'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {isCurrentPlan && !isTrial ? 'Gói hiện tại' :
                     plan.id === 'free' ? 'Bắt đầu miễn phí' : 'Nâng cấp ngay'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Câu hỏi thường gặp
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Dùng thử có cần thẻ tín dụng không?
              </h4>
              <p className="text-gray-600 text-sm">
                Không. Bạn có thể đăng ký dùng thử miễn phí 30 ngày mà không cần nhập thông tin thanh toán.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Sau khi dùng thử hết hạn thì sao?
              </h4>
              <p className="text-gray-600 text-sm">
                Tài khoản sẽ tự động chuyển về gói Miễn phí. Bạn vẫn có thể học 3 bài đầu mỗi môn.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Tôi có thể hủy gói bất cứ lúc nào không?
              </h4>
              <p className="text-gray-600 text-sm">
                Có. Bạn có thể hủy gói bất cứ lúc nào và vẫn sử dụng được đến hết thời hạn đã thanh toán.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Thanh toán có an toàn không?
              </h4>
              <p className="text-gray-600 text-sm">
                Có. Chúng tôi sử dụng cổng thanh toán uy tín và không lưu trữ thông tin thẻ của bạn.
              </p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="text-center">
          <p className="text-gray-600 mb-3">
            Có câu hỏi? Liên hệ với chúng tôi
          </p>
          <a
            href="mailto:support@schoolhub.app"
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
          >
            <MessageCircle className="w-5 h-5" />
            support@schoolhub.app
          </a>
        </div>
      </main>
    </div>
  );
}
