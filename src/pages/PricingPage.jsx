// src/pages/PricingPage.jsx
// Trang chọn gói dịch vụ
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRBAC, ROLES } from '../contexts/RBACContext';
import { usePayment } from '../contexts/PaymentContext';
import {
  Check, X, Zap, Crown, Star, ArrowRight,
  Users, GraduationCap, BookOpen, Shield,
  Loader2, ChevronLeft
} from 'lucide-react';

// Role tabs config
const ROLE_TABS = [
  { id: 'student', label: 'Học sinh', icon: BookOpen, color: 'amber' },
  { id: 'parent', label: 'Phụ huynh', icon: Users, color: 'green' },
  { id: 'teacher', label: 'Giáo viên', icon: GraduationCap, color: 'blue' },
];

// Plan tier icons
const TIER_ICONS = {
  free: Star,
  basic: Zap,
  premium: Crown,
};

export default function PricingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useRBAC();
  const { plans, getPlansByRole, currentSubscription, formatPrice, loading } = usePayment();

  const [selectedRole, setSelectedRole] = useState(role || 'student');
  const [billingCycle, setBillingCycle] = useState('monthly'); // monthly | yearly
  const [rolePlans, setRolePlans] = useState([]);

  useEffect(() => {
    const filteredPlans = getPlansByRole(selectedRole);
    setRolePlans(filteredPlans);
  }, [selectedRole, plans, getPlansByRole]);

  const handleSelectPlan = (plan) => {
    if (plan.price_monthly === 0) {
      // Gói miễn phí - đăng ký ngay
      if (!isAuthenticated) {
        navigate('/login');
      } else {
        navigate('/');
      }
    } else {
      // Gói trả phí - chuyển đến checkout
      navigate(`/checkout?plan=${plan.id}&cycle=${billingCycle}`);
    }
  };

  const getPrice = (plan) => {
    if (billingCycle === 'yearly') {
      return plan.price_yearly;
    }
    return plan.price_monthly;
  };

  const getMonthlyEquivalent = (plan) => {
    if (billingCycle === 'yearly' && plan.price_yearly > 0) {
      return Math.round(plan.price_yearly / 12);
    }
    return plan.price_monthly;
  };

  const getSavings = (plan) => {
    if (plan.price_yearly > 0) {
      const yearlyMonthly = plan.price_yearly;
      const monthlyTotal = plan.price_monthly * 12;
      return monthlyTotal - yearlyMonthly;
    }
    return 0;
  };

  const isCurrentPlan = (plan) => {
    return currentSubscription?.plan_id === plan.id;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-4 top-4 p-2 hover:bg-white/20 rounded-full"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Chọn gói phù hợp với bạn
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/80 text-lg max-w-2xl mx-auto"
          >
            Nâng cấp để mở khóa tất cả tính năng và học không giới hạn
          </motion.p>

          {/* Billing toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 inline-flex items-center gap-3 bg-white/10 rounded-full p-1"
          >
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white text-indigo-600'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Hàng tháng
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                billingCycle === 'yearly'
                  ? 'bg-white text-indigo-600'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Hàng năm
              <span className="ml-2 px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
                -20%
              </span>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Role tabs */}
      <div className="max-w-6xl mx-auto px-4 -mt-6">
        <div className="flex justify-center gap-2 bg-white rounded-2xl shadow-lg p-2">
          {ROLE_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedRole(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                selectedRole === tab.id
                  ? `bg-${tab.color}-100 text-${tab.color}-700`
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Plans */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          {rolePlans.map((plan, index) => {
            const TierIcon = TIER_ICONS[plan.slug.split('-')[1]] || Star;
            const isCurrent = isCurrentPlan(plan);
            const isPopular = plan.slug.includes('basic');
            const isPremium = plan.slug.includes('premium');

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-white rounded-3xl shadow-lg overflow-hidden ${
                  isPopular ? 'ring-2 ring-indigo-500 scale-105' : ''
                } ${isPremium ? 'bg-gradient-to-b from-amber-50 to-white' : ''}`}
              >
                {/* Popular badge */}
                {isPopular && (
                  <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-4 py-1 rounded-bl-xl">
                    PHỔ BIẾN
                  </div>
                )}

                {/* Current plan badge */}
                {isCurrent && (
                  <div className="absolute top-0 left-0 bg-green-500 text-white text-xs font-bold px-4 py-1 rounded-br-xl">
                    GÓI HIỆN TẠI
                  </div>
                )}

                <div className="p-6">
                  {/* Plan header */}
                  <div className="text-center mb-6">
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 ${
                      isPremium ? 'bg-amber-100' : isPopular ? 'bg-indigo-100' : 'bg-gray-100'
                    }`}>
                      <TierIcon className={`w-7 h-7 ${
                        isPremium ? 'text-amber-600' : isPopular ? 'text-indigo-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">{plan.name}</h3>

                    {/* Price */}
                    <div className="mt-4">
                      {plan.price_monthly === 0 ? (
                        <div className="text-3xl font-bold text-gray-800">Miễn phí</div>
                      ) : (
                        <>
                          <div className="text-3xl font-bold text-gray-800">
                            {formatPrice(getMonthlyEquivalent(plan))}
                            <span className="text-base font-normal text-gray-500">/tháng</span>
                          </div>
                          {billingCycle === 'yearly' && getSavings(plan) > 0 && (
                            <div className="text-sm text-green-600 mt-1">
                              Tiết kiệm {formatPrice(getSavings(plan))}/năm
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-6">
                    {plan.features?.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleSelectPlan(plan)}
                    disabled={isCurrent}
                    className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                      isCurrent
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : isPremium
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90'
                        : isPopular
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {isCurrent ? (
                      'Gói hiện tại'
                    ) : plan.price_monthly === 0 ? (
                      <>
                        Bắt đầu miễn phí
                        <ArrowRight className="w-5 h-5" />
                      </>
                    ) : (
                      <>
                        Mua ngay
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* FAQ or comparison */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">So sánh các gói</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-4 px-4 font-medium text-gray-600">Tính năng</th>
                  {rolePlans.map((plan) => (
                    <th key={plan.id} className="py-4 px-4 text-center font-medium text-gray-800">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { key: 'lessons_per_day', label: 'Bài học/ngày', format: (v) => v === -1 ? 'Không giới hạn' : v },
                  { key: 'games_per_day', label: 'Game/ngày', format: (v) => v === -1 ? 'Không giới hạn' : v },
                  { key: 'max_children', label: 'Số con theo dõi', format: (v) => v === -1 ? 'Không giới hạn' : v },
                  { key: 'max_classes', label: 'Số lớp quản lý', format: (v) => v === -1 ? 'Không giới hạn' : v },
                  { key: 'max_students', label: 'Số học sinh', format: (v) => v === -1 ? 'Không giới hạn' : v },
                ].map((row) => {
                  const hasLimit = rolePlans.some(p => p.limits?.[row.key] !== undefined);
                  if (!hasLimit) return null;

                  return (
                    <tr key={row.key} className="border-b">
                      <td className="py-4 px-4 text-gray-600">{row.label}</td>
                      {rolePlans.map((plan) => (
                        <td key={plan.id} className="py-4 px-4 text-center">
                          {plan.limits?.[row.key] !== undefined
                            ? row.format(plan.limits[row.key])
                            : '-'}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 mb-4">Thanh toán an toàn qua</p>
          <div className="flex justify-center gap-6 items-center opacity-60">
            <img src="/images/momo-logo.png" alt="MoMo" className="h-8" />
            <img src="/images/vnpay-logo.png" alt="VNPay" className="h-8" />
            <span className="text-gray-400">|</span>
            <span className="text-sm text-gray-500">Chuyển khoản ngân hàng</span>
          </div>
        </div>
      </div>
    </div>
  );
}
