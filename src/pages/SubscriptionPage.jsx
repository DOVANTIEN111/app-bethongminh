// src/pages/SubscriptionPage.jsx
// Trang quản lý gói đăng ký
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRBAC } from '../contexts/RBACContext';
import { usePayment } from '../contexts/PaymentContext';
import {
  ChevronLeft, Crown, Zap, Star, Clock, Calendar,
  CreditCard, AlertCircle, CheckCircle, XCircle,
  ArrowRight, RefreshCw, Loader2, ChevronRight,
  Download, FileText
} from 'lucide-react';

// Status badges
const STATUS_BADGES = {
  active: { label: 'Đang hoạt động', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  trial: { label: 'Dùng thử', color: 'bg-blue-100 text-blue-700', icon: Clock },
  expired: { label: 'Đã hết hạn', color: 'bg-red-100 text-red-700', icon: XCircle },
  cancelled: { label: 'Đã hủy', color: 'bg-gray-100 text-gray-700', icon: XCircle },
  pending: { label: 'Chờ xử lý', color: 'bg-amber-100 text-amber-700', icon: Clock },
  success: { label: 'Thành công', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  failed: { label: 'Thất bại', color: 'bg-red-100 text-red-700', icon: XCircle },
};

export default function SubscriptionPage() {
  const navigate = useNavigate();
  const { isAuthenticated, userProfile } = useRBAC();
  const {
    currentSubscription, paymentHistory, loading,
    cancelSubscription, formatPrice, loadPaymentHistory
  } = usePayment();

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleCancelSubscription = async () => {
    setCancelling(true);
    const result = await cancelSubscription();
    setCancelling(false);

    if (result.success) {
      setShowCancelModal(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getDaysRemaining = () => {
    if (!currentSubscription?.end_date) return null;
    const endDate = new Date(currentSubscription.end_date);
    const now = new Date();
    const diff = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const statusInfo = STATUS_BADGES[currentSubscription?.status] || STATUS_BADGES.expired;
  const StatusIcon = statusInfo.icon;
  const daysRemaining = getDaysRemaining();
  const isActive = currentSubscription?.status === 'active';
  const isPremiumPlan = currentSubscription?.plan_slug?.includes('premium');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">Quản lý gói</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Current subscription */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm overflow-hidden"
        >
          {/* Plan header */}
          <div className={`p-6 ${
            isPremiumPlan
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
              : isActive
              ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
              : 'bg-gray-100'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                  isPremiumPlan || isActive ? 'bg-white/20' : 'bg-gray-200'
                }`}>
                  {isPremiumPlan ? (
                    <Crown className="w-7 h-7" />
                  ) : isActive ? (
                    <Zap className="w-7 h-7" />
                  ) : (
                    <Star className="w-7 h-7 text-gray-500" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold">
                    {currentSubscription?.plan_name || 'Gói miễn phí'}
                  </h2>
                  <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                    isPremiumPlan || isActive ? 'bg-white/20' : statusInfo.color
                  }`}>
                    <StatusIcon className="w-3 h-3" />
                    {statusInfo.label}
                  </div>
                </div>
              </div>

              {isActive && (
                <button
                  onClick={() => navigate('/pricing')}
                  className={`px-4 py-2 rounded-xl font-medium text-sm ${
                    isPremiumPlan || isActive
                      ? 'bg-white/20 hover:bg-white/30'
                      : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                  }`}
                >
                  {isPremiumPlan ? 'Thay đổi gói' : 'Nâng cấp'}
                </button>
              )}
            </div>
          </div>

          {/* Plan details */}
          <div className="p-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Ngày bắt đầu</span>
                </div>
                <p className="font-semibold text-gray-800">
                  {formatDate(currentSubscription?.start_date)}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Ngày hết hạn</span>
                </div>
                <p className="font-semibold text-gray-800">
                  {formatDate(currentSubscription?.end_date) || 'Không giới hạn'}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <RefreshCw className="w-4 h-4" />
                  <span className="text-sm">Tự động gia hạn</span>
                </div>
                <p className="font-semibold text-gray-800">
                  {currentSubscription?.auto_renew ? 'Bật' : 'Tắt'}
                </p>
              </div>
            </div>

            {/* Days remaining warning */}
            {daysRemaining !== null && daysRemaining <= 7 && daysRemaining > 0 && (
              <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <div>
                  <p className="font-medium text-amber-800">
                    Còn {daysRemaining} ngày sử dụng
                  </p>
                  <p className="text-sm text-amber-600">
                    Gia hạn ngay để tiếp tục sử dụng tất cả tính năng
                  </p>
                </div>
                <button
                  onClick={() => navigate('/pricing')}
                  className="ml-auto px-4 py-2 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600"
                >
                  Gia hạn
                </button>
              </div>
            )}

            {/* Features list */}
            {currentSubscription?.features && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-800 mb-3">Tính năng gói của bạn</h3>
                <div className="grid md:grid-cols-2 gap-2">
                  {currentSubscription.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            {isActive && (
              <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end gap-3">
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="px-4 py-2 text-gray-500 hover:text-red-500 text-sm"
                >
                  Hủy gói
                </button>
              </div>
            )}

            {/* Not subscribed */}
            {!isActive && currentSubscription?.status !== 'trial' && (
              <div className="mt-6 text-center py-8">
                <p className="text-gray-500 mb-4">Bạn chưa có gói nào đang hoạt động</p>
                <button
                  onClick={() => navigate('/pricing')}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 inline-flex items-center gap-2"
                >
                  Xem các gói
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Payment history */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Lịch sử thanh toán</h2>
          </div>

          {paymentHistory.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {paymentHistory.map((payment) => {
                const paymentStatus = STATUS_BADGES[payment.status] || STATUS_BADGES.pending;
                const PaymentStatusIcon = paymentStatus.icon;

                return (
                  <div key={payment.id} className="p-4 hover:bg-gray-50 flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      payment.status === 'success' ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <CreditCard className={`w-5 h-5 ${
                        payment.status === 'success' ? 'text-green-600' : 'text-gray-500'
                      }`} />
                    </div>

                    <div className="flex-1">
                      <p className="font-medium text-gray-800">
                        {payment.plan?.name || 'Thanh toán'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(payment.created_at)} • {payment.method === 'bank_transfer' ? 'Chuyển khoản' : 'MoMo'}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-gray-800">{formatPrice(payment.amount)}</p>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${paymentStatus.color}`}>
                        <PaymentStatusIcon className="w-3 h-3" />
                        {paymentStatus.label}
                      </span>
                    </div>

                    <ChevronRight className="w-5 h-5 text-gray-300" />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Chưa có lịch sử thanh toán</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Cancel modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Hủy gói đăng ký?</h3>
              <p className="text-gray-500 mt-2">
                Bạn vẫn có thể sử dụng các tính năng cho đến khi hết hạn. Sau đó, tài khoản sẽ chuyển về gói miễn phí.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200"
              >
                Giữ lại
              </button>
              <button
                onClick={handleCancelSubscription}
                disabled={cancelling}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 disabled:opacity-50"
              >
                {cancelling ? 'Đang xử lý...' : 'Xác nhận hủy'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
