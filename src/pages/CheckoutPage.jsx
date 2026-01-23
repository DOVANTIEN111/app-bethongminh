// src/pages/CheckoutPage.jsx
// Trang thanh toán
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRBAC } from '../contexts/RBACContext';
import { usePayment, PAYMENT_CONFIG } from '../contexts/PaymentContext';
import {
  ChevronLeft, CreditCard, Building2, Smartphone,
  Check, Copy, Loader2, AlertCircle, CheckCircle,
  Tag, X, Clock, Shield
} from 'lucide-react';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, user } = useRBAC();
  const {
    getPlanById, createPayment, validatePromoCode,
    getBankTransferInfo, createMomoPayment, formatPrice
  } = usePayment();

  const planId = searchParams.get('plan');
  const cycle = searchParams.get('cycle') || 'monthly';

  const [plan, setPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [promoCode, setPromoCode] = useState('');
  const [promoResult, setPromoResult] = useState(null);
  const [promoLoading, setPromoLoading] = useState(false);
  const [autoRenew, setAutoRenew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('checkout'); // checkout | processing | bank_transfer | success
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (planId) {
      const foundPlan = getPlanById(planId);
      if (foundPlan) {
        setPlan(foundPlan);
      } else {
        navigate('/pricing');
      }
    } else {
      navigate('/pricing');
    }
  }, [planId, isAuthenticated, getPlanById, navigate]);

  const getPrice = () => {
    if (!plan) return 0;
    return cycle === 'yearly' ? plan.price_yearly : plan.price_monthly;
  };

  const getFinalPrice = () => {
    const basePrice = getPrice();
    if (promoResult?.valid) {
      return promoResult.final_amount;
    }
    return basePrice;
  };

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;

    setPromoLoading(true);
    setPromoResult(null);

    const result = await validatePromoCode(promoCode, planId, getPrice());
    setPromoResult(result);
    setPromoLoading(false);
  };

  const handleRemovePromo = () => {
    setPromoCode('');
    setPromoResult(null);
  };

  const handlePayment = async () => {
    setLoading(true);
    setError('');

    try {
      const months = cycle === 'yearly' ? 12 : 1;
      const { data: payment, transactionId, error: paymentError } = await createPayment(
        planId,
        paymentMethod,
        months,
        promoResult?.valid ? promoCode : null
      );

      if (paymentError) {
        setError(paymentError);
        setLoading(false);
        return;
      }

      if (paymentMethod === 'bank_transfer') {
        const bankInfo = getBankTransferInfo(transactionId, getFinalPrice());
        setPaymentData({ payment, bankInfo });
        setStep('bank_transfer');
      } else if (paymentMethod === 'momo') {
        setStep('processing');
        const momoData = await createMomoPayment(payment.id, getFinalPrice(), `Thanh toán gói ${plan.name}`);
        // Redirect to MoMo payment page
        window.location.href = momoData.payUrl;
      }
    } catch (err) {
      setError('Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  // Bank transfer instructions screen
  if (step === 'bank_transfer' && paymentData) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-lg p-6"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Chuyển khoản ngân hàng</h2>
              <p className="text-gray-500 text-sm mt-2">
                Vui lòng chuyển khoản theo thông tin bên dưới
              </p>
            </div>

            <div className="space-y-4 bg-gray-50 rounded-2xl p-4">
              {[
                { label: 'Ngân hàng', value: paymentData.bankInfo.bankName },
                { label: 'Số tài khoản', value: paymentData.bankInfo.accountNumber, copy: true },
                { label: 'Chủ tài khoản', value: paymentData.bankInfo.accountName },
                { label: 'Số tiền', value: formatPrice(paymentData.bankInfo.amount), highlight: true },
                { label: 'Nội dung CK', value: paymentData.bankInfo.content, copy: true, important: true },
              ].map((item, index) => (
                <div key={index} className={`flex items-center justify-between p-3 rounded-xl ${
                  item.important ? 'bg-amber-50 border border-amber-200' : 'bg-white'
                }`}>
                  <div>
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className={`font-medium ${item.highlight ? 'text-indigo-600 text-lg' : 'text-gray-800'}`}>
                      {item.value}
                    </p>
                  </div>
                  {item.copy && (
                    <button
                      onClick={() => copyToClipboard(item.value)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <Copy className="w-5 h-5 text-gray-400" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-amber-800">Lưu ý quan trọng:</p>
                  <ul className="text-amber-700 mt-1 space-y-1">
                    <li>• Nhập <strong>đúng nội dung</strong> chuyển khoản</li>
                    <li>• Gói sẽ được kích hoạt trong vòng 24h sau khi nhận được thanh toán</li>
                    <li>• Liên hệ hỗ trợ nếu quá 24h chưa được kích hoạt</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => navigate('/')}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200"
              >
                Về trang chủ
              </button>
              <button
                onClick={() => navigate('/settings/subscription')}
                className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700"
              >
                Xem trạng thái
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Main checkout form
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
          <h1 className="text-lg font-semibold">Thanh toán</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left: Payment form */}
          <div className="md:col-span-2 space-y-6">
            {/* Payment method */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="font-semibold text-gray-800 mb-4">Phương thức thanh toán</h2>

              <div className="space-y-3">
                {[
                  {
                    id: 'bank_transfer',
                    name: 'Chuyển khoản ngân hàng',
                    icon: Building2,
                    desc: 'Chuyển khoản qua app ngân hàng',
                  },
                  {
                    id: 'momo',
                    name: 'Ví MoMo',
                    icon: Smartphone,
                    desc: 'Thanh toán qua ví điện tử MoMo',
                  },
                ].map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === method.id
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="sr-only"
                    />
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      paymentMethod === method.id ? 'bg-indigo-100' : 'bg-gray-100'
                    }`}>
                      <method.icon className={`w-6 h-6 ${
                        paymentMethod === method.id ? 'text-indigo-600' : 'text-gray-400'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{method.name}</p>
                      <p className="text-sm text-gray-500">{method.desc}</p>
                    </div>
                    {paymentMethod === method.id && (
                      <Check className="w-6 h-6 text-indigo-600" />
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Promo code */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="font-semibold text-gray-800 mb-4">Mã giảm giá</h2>

              {promoResult?.valid ? (
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex items-center gap-3">
                    <Tag className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">{promoCode.toUpperCase()}</p>
                      <p className="text-sm text-green-600">Giảm {formatPrice(promoResult.discount)}</p>
                    </div>
                  </div>
                  <button onClick={handleRemovePromo} className="p-2 hover:bg-green-100 rounded-lg">
                    <X className="w-5 h-5 text-green-600" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="Nhập mã giảm giá"
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={handleApplyPromo}
                    disabled={promoLoading || !promoCode.trim()}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 disabled:opacity-50"
                  >
                    {promoLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Áp dụng'}
                  </button>
                </div>
              )}

              {promoResult && !promoResult.valid && (
                <p className="text-red-500 text-sm mt-2">{promoResult.error}</p>
              )}
            </div>

            {/* Auto renew */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="font-medium text-gray-800">Tự động gia hạn</p>
                  <p className="text-sm text-gray-500">Tự động thanh toán khi hết hạn</p>
                </div>
                <input
                  type="checkbox"
                  checked={autoRenew}
                  onChange={(e) => setAutoRenew(e.target.checked)}
                  className="w-5 h-5 rounded text-indigo-600"
                />
              </label>
            </div>
          </div>

          {/* Right: Order summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <h2 className="font-semibold text-gray-800 mb-4">Đơn hàng</h2>

              <div className="p-4 bg-gray-50 rounded-xl mb-4">
                <p className="font-medium text-gray-800">{plan.name}</p>
                <p className="text-sm text-gray-500 capitalize">{plan.role}</p>
                <p className="text-sm text-gray-500">
                  {cycle === 'yearly' ? '12 tháng' : '1 tháng'}
                </p>
              </div>

              <div className="space-y-3 py-4 border-t border-b border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span>Giá gốc</span>
                  <span>{formatPrice(getPrice())}</span>
                </div>
                {promoResult?.valid && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá</span>
                    <span>-{formatPrice(promoResult.discount)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between py-4">
                <span className="font-semibold text-gray-800">Tổng cộng</span>
                <span className="text-xl font-bold text-indigo-600">
                  {formatPrice(getFinalPrice())}
                </span>
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  {error}
                </div>
              )}

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Thanh toán {formatPrice(getFinalPrice())}
                  </>
                )}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                <Shield className="w-4 h-4" />
                <span>Thanh toán an toàn & bảo mật</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
