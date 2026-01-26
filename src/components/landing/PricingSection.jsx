// src/components/landing/PricingSection.jsx
// Pricing Section for Landing Page
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, X, Star, Zap, Building2, Phone, Loader2 } from 'lucide-react';
import { getActivePlans, formatPrice, calculateYearlySavings } from '../../services/plansService';

// Icon mapping for dynamic plans from database
const ICON_MAP = {
  star: Star,
  zap: Zap,
  'building-2': Building2,
  phone: Phone,
};

// Badge color mapping
const BADGE_COLOR_MAP = {
  blue: 'from-blue-600 to-purple-600',
  green: 'from-green-600 to-teal-600',
  orange: 'from-orange-600 to-red-600',
  purple: 'from-purple-600 to-pink-600',
  indigo: 'from-indigo-600 to-blue-600',
  gray: 'from-gray-600 to-gray-700',
};

// Icon background color mapping
const ICON_BG_MAP = {
  blue: 'bg-blue-100',
  green: 'bg-green-100',
  orange: 'bg-orange-100',
  purple: 'bg-purple-100',
  indigo: 'bg-indigo-100',
  gray: 'bg-gray-100',
};

// Icon text color mapping
const ICON_COLOR_MAP = {
  blue: 'text-blue-600',
  green: 'text-green-600',
  orange: 'text-orange-600',
  purple: 'text-purple-600',
  indigo: 'text-indigo-600',
  gray: 'text-gray-600',
};

// Fallback static plans (used when database is unavailable)
const FALLBACK_PLANS = [
  {
    name: 'Miễn phí',
    description: 'Cho học sinh mới bắt đầu',
    price: '0',
    period: '',
    features: [
      { text: '3 bài học/môn', included: true },
      { text: 'Trò chơi giáo dục cơ bản', included: true },
      { text: 'Theo dõi tiến độ', included: true },
      { text: 'Có quảng cáo', included: true, note: true },
      { text: 'Hỗ trợ email', included: true },
      { text: 'Tất cả bài học', included: false },
      { text: 'Không quảng cáo', included: false },
    ],
    buttonText: 'Bắt đầu miễn phí',
    buttonLink: '/register',
    buttonStyle: 'outline',
    icon: Star,
    iconBg: 'bg-gray-100',
    iconColor: 'text-gray-600',
  },
  {
    name: 'Học sinh Premium',
    description: 'Cho học sinh muốn học tập toàn diện',
    price: '49,000',
    period: '/tháng',
    yearlyPrice: '490,000đ/năm',
    yearlySave: 'Tiết kiệm 17%',
    features: [
      { text: 'Tất cả 500+ bài học', included: true },
      { text: 'Trò chơi giáo dục đầy đủ', included: true },
      { text: 'Theo dõi tiến độ chi tiết', included: true },
      { text: 'Không quảng cáo', included: true },
      { text: 'Hỗ trợ 24/7', included: true },
      { text: 'Phần thưởng độc quyền', included: true },
      { text: 'Chứng chỉ hoàn thành', included: true },
    ],
    buttonText: 'Dùng thử 30 ngày',
    buttonLink: '/register',
    buttonStyle: 'primary',
    highlight: true,
    badge: 'Phổ biến nhất',
    icon: Zap,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    name: 'Giáo viên Pro',
    description: 'Cho giáo viên quản lý lớp học',
    price: '199,000',
    period: '/tháng',
    features: [
      { text: 'Tạo bài giảng không giới hạn', included: true },
      { text: 'Quản lý đến 100 học sinh', included: true },
      { text: 'Tạo bài kiểm tra online', included: true },
      { text: 'Chấm điểm tự động', included: true },
      { text: 'Báo cáo chi tiết', included: true },
      { text: 'Chat với phụ huynh', included: true },
      { text: 'Hỗ trợ ưu tiên', included: true },
    ],
    buttonText: 'Đăng ký ngay',
    buttonLink: '/register/teacher',
    buttonStyle: 'secondary',
    icon: Building2,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    name: 'Trường học',
    description: 'Giải pháp toàn diện cho nhà trường',
    price: 'Liên hệ',
    period: '',
    features: [
      { text: 'Không giới hạn giáo viên', included: true },
      { text: 'Không giới hạn học sinh', included: true },
      { text: 'Quản lý bộ phận, lớp học', included: true },
      { text: 'Tích hợp hệ thống có sẵn', included: true },
      { text: 'Hỗ trợ triển khai riêng', included: true },
      { text: 'Tùy chỉnh theo yêu cầu', included: true },
      { text: 'Account Manager riêng', included: true },
    ],
    buttonText: 'Liên hệ tư vấn',
    buttonLink: '/register/school',
    buttonStyle: 'outline',
    icon: Phone,
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
  },
];

// Transform database plan to component format
function transformPlan(dbPlan) {
  const badgeColor = dbPlan.badge_color || 'blue';
  // Use badge_color to determine icon (no icon column in DB)
  const iconKey = dbPlan.target_user === 'teacher' ? 'building-2' :
                  dbPlan.target_user === 'school' ? 'phone' :
                  dbPlan.is_featured ? 'zap' : 'star';
  const IconComponent = ICON_MAP[iconKey] || Star;

  // Parse features - handle both old format (string[]) and new format ({name, included}[])
  let features = [];
  if (Array.isArray(dbPlan.features)) {
    features = dbPlan.features.map(f => {
      if (typeof f === 'string') {
        return { text: f, included: true };
      }
      return { text: f.name, included: f.included !== false };
    });
  }

  // Calculate yearly savings
  const yearlySavings = calculateYearlySavings(dbPlan.price_monthly, dbPlan.price_yearly);

  return {
    id: dbPlan.id,
    name: dbPlan.name,
    description: dbPlan.description,
    price: dbPlan.price_monthly === 0 ? 'Liên hệ' : new Intl.NumberFormat('vi-VN').format(dbPlan.price_monthly),
    priceRaw: dbPlan.price_monthly,
    period: dbPlan.price_monthly === 0 ? '' : '/tháng',
    yearlyPrice: dbPlan.price_yearly > 0 ? `${new Intl.NumberFormat('vi-VN').format(dbPlan.price_yearly)}đ/năm` : null,
    yearlySave: yearlySavings > 0 ? `Tiết kiệm ${yearlySavings}%` : null,
    features,
    buttonText: dbPlan.button_text || 'Đăng ký ngay',
    buttonLink: dbPlan.button_link || '/register',
    buttonStyle: dbPlan.is_featured ? 'primary' : (dbPlan.target_user === 'teacher' ? 'secondary' : 'outline'),
    highlight: dbPlan.is_featured,
    badge: dbPlan.badge,
    badgeColor: BADGE_COLOR_MAP[badgeColor] || BADGE_COLOR_MAP.blue,
    icon: IconComponent,
    iconBg: ICON_BG_MAP[badgeColor] || ICON_BG_MAP.gray,
    iconColor: ICON_COLOR_MAP[badgeColor] || ICON_COLOR_MAP.gray,
  };
}

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch plans from database on mount
  useEffect(() => {
    async function fetchPlans() {
      try {
        setLoading(true);
        const dbPlans = await getActivePlans();
        if (dbPlans && dbPlans.length > 0) {
          const transformedPlans = dbPlans.map(transformPlan);
          setPlans(transformedPlans);
        } else {
          // Use fallback static plans
          setPlans(FALLBACK_PLANS);
        }
      } catch (error) {
        console.error('Error fetching plans:', error);
        setPlans(FALLBACK_PLANS);
      } finally {
        setLoading(false);
      }
    }
    fetchPlans();
  }, []);

  return (
    <section id="pricing" className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Bảng giá <span className="text-blue-600">minh bạch</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Chọn gói phù hợp với nhu cầu của bạn. Dùng thử miễn phí 30 ngày, hủy bất cứ lúc nào.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-4 bg-gray-100 p-1.5 rounded-xl">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                !isYearly ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Theo tháng
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
                isYearly ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Theo năm
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">-17%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <div
              key={plan.id || index}
              className={`relative bg-white rounded-2xl p-6 transition-all duration-300 ${
                plan.highlight
                  ? 'border-2 border-blue-500 shadow-xl shadow-blue-100 scale-[1.02]'
                  : 'border border-gray-200 hover:border-blue-200 hover:shadow-lg'
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r ${plan.badgeColor || 'from-blue-600 to-purple-600'} text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap`}>
                  {plan.badge}
                </div>
              )}

              {/* Header */}
              <div className="mb-6">
                <div className={`w-12 h-12 ${plan.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                  <plan.icon className={`w-6 h-6 ${plan.iconColor}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-6">
                {plan.price === 'Liên hệ' ? (
                  <p className="text-3xl font-bold text-gray-900">{plan.price}</p>
                ) : (
                  <>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-gray-900">
                        {isYearly && plan.yearlyPrice ? plan.yearlyPrice.split('/')[0] : `${plan.price}đ`}
                      </span>
                      <span className="text-gray-500">
                        {isYearly && plan.yearlyPrice ? '/năm' : plan.period}
                      </span>
                    </div>
                    {isYearly && plan.yearlySave && (
                      <p className="text-sm text-green-600 font-medium mt-1">{plan.yearlySave}</p>
                    )}
                  </>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start gap-3">
                    {feature.included ? (
                      <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${feature.note ? 'text-orange-500' : 'text-green-500'}`} />
                    ) : (
                      <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={feature.included ? (feature.note ? 'text-gray-500' : 'text-gray-700') : 'text-gray-400 line-through'}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Button */}
              <Link
                to={plan.buttonLink}
                className={`block w-full text-center py-3 px-4 rounded-xl font-semibold transition-all active:scale-95 ${
                  plan.buttonStyle === 'primary'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl'
                    : plan.buttonStyle === 'secondary'
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-blue-600 hover:text-white'
                }`}
              >
                {plan.buttonText}
              </Link>
            </div>
          ))}
        </div>
        )}

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-8 mt-12 pt-12 border-t border-gray-100">
          <div className="flex items-center gap-2 text-gray-500">
            <Check className="w-5 h-5 text-green-500" />
            <span>Hủy bất cứ lúc nào</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <Check className="w-5 h-5 text-green-500" />
            <span>Bảo mật thanh toán</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <Check className="w-5 h-5 text-green-500" />
            <span>Hỗ trợ 24/7</span>
          </div>
        </div>
      </div>
    </section>
  );
}
