// src/pages/PaymentPage.jsx
// Trang thanh toan qua chuyen khoan ngan hang

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { createPaymentOrder, checkPaymentStatus, formatMoney } from '../services/paymentService';
import { Copy, Check, Clock, AlertCircle, ArrowLeft, Loader2, CheckCircle2, QrCode, CreditCard, Building2 } from 'lucide-react';

const PaymentPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [plan, setPlan] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [countdown, setCountdown] = useState(30 * 60); // 30 phut
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [user, setUser] = useState(null);
  const [copied, setCopied] = useState({});
  const [error, setError] = useState(null);

  // Get query params
  const planId = searchParams.get('planId');
  const queryAmount = searchParams.get('amount');
  const billing = searchParams.get('billing') || 'monthly';
  const planName = searchParams.get('planName');

  // Load data khi mount
  useEffect(() => {
    loadData();
  }, [planId, queryAmount]);

  // Dem nguoc thoi gian
  useEffect(() => {
    if (!order || paymentSuccess) return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [order, paymentSuccess]);

  // Tu dong kiem tra thanh toan moi 10 giay
  useEffect(() => {
    if (!order || paymentSuccess) return;

    const checkInterval = setInterval(async () => {
      try {
        const result = await checkPaymentStatus(order.id);
        if (result.status === 'completed') {
          setPaymentSuccess(true);
          clearInterval(checkInterval);
        }
      } catch (err) {
        console.error('Check payment error:', err);
      }
    }, 10000);

    return () => clearInterval(checkInterval);
  }, [order, paymentSuccess]);

  const loadData = async () => {
    try {
      setError(null);

      // Validate required params
      if (!planId || !queryAmount) {
        setError('Thieu thong tin goi cuoc. Vui long quay lai trang gia.');
        return;
      }

      const amount = parseInt(queryAmount, 10);
      if (!amount || amount <= 0) {
        setError('So tien khong hop le');
        return;
      }

      // Lay user
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        navigate(`/login?returnUrl=${encodeURIComponent('/payment?' + searchParams.toString())}`);
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      setUser(profile);

      // Set plan info from query params
      const durationDays = billing === 'yearly' ? 365 : 30;
      const displayName = planName ? decodeURIComponent(planName) : (billing === 'yearly' ? 'Premium Nam' : 'Premium Thang');
      setPlan({
        id: planId,
        name: displayName,
        duration_days: durationDays
      });

      // Tao don hang
      const orderData = await createPaymentOrder(authUser.id, planId, amount, displayName);
      setOrder(orderData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err.message || 'Co loi xay ra');
    } finally {
      setLoading(false);
    }
  };

  const handleManualCheck = async () => {
    if (checking) return;
    setChecking(true);

    try {
      const result = await checkPaymentStatus(order.id);
      if (result.status === 'completed') {
        setPaymentSuccess(true);
      } else {
        alert('Chua nhan duoc thanh toan. Vui long kiem tra lai sau it phut.');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Co loi xay ra. Vui long thu lai.');
    } finally {
      setChecking(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied({ ...copied, [field]: true });
      setTimeout(() => setCopied({ ...copied, [field]: false }), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied({ ...copied, [field]: true });
      setTimeout(() => setCopied({ ...copied, [field]: false }), 2000);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Dang tao don hang...</p>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-50 to-white p-4">
        <div className="bg-white rounded-2xl p-8 shadow-xl text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Co loi xay ra</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/pricing')}
            className="px-6 py-3 bg-blue-500 text-white rounded-xl font-bold"
          >
            Quay lai bang gia
          </button>
        </div>
      </div>
    );
  }

  // Man hinh thanh toan thanh cong
  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 text-center shadow-2xl max-w-md w-full">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Thanh toan thanh cong!</h1>
          <p className="text-gray-600 mb-6">
            Tai khoan cua ban da duoc nang cap len goi <strong className="text-green-600">{plan?.name}</strong>
          </p>

          <div className="bg-green-50 rounded-xl p-4 mb-6 border border-green-200">
            <p className="text-green-700 flex items-center justify-center gap-2">
              <span className="text-2xl">🎉</span>
              Chuc mung! Ban co the su dung day du tinh nang ngay bay gio.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/learn')}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold hover:opacity-90 transition flex items-center justify-center gap-2"
            >
              <span className="text-xl">🎮</span>
              Bat dau hoc ngay
            </button>
            <button
              onClick={() => navigate('/learn/profile')}
              className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition"
            >
              Xem tai khoan
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Thanh toan</h1>
            <p className="text-sm text-gray-500">Chuyen khoan ngan hang</p>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto p-4 pb-8">
        {/* Thong tin goi */}
        <div className="bg-white rounded-2xl p-5 shadow-lg mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Thong tin don hang</h2>
              <p className="text-sm text-gray-500">Ma: {order?.order_code}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Goi dich vu</span>
              <span className="font-bold text-gray-800">{plan?.name}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Thoi han</span>
              <span className="font-bold text-gray-800">{plan?.duration_days || 30} ngay</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Tong tien</span>
              <span className="text-2xl font-bold text-blue-600">{formatMoney(order?.amount)}</span>
            </div>
          </div>
        </div>

        {/* QR Code */}
        <div className="bg-white rounded-2xl p-5 shadow-lg mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <QrCode className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Quet ma QR de thanh toan</h2>
              <p className="text-sm text-gray-500">Mo app ngan hang va quet</p>
            </div>
          </div>

          <div className="flex justify-center mb-4">
            <div className="relative">
              <img
                src={order?.qrCodeUrl}
                alt="QR Code thanh toan"
                className="w-56 h-56 sm:w-64 sm:h-64 border-4 border-blue-100 rounded-2xl shadow-lg"
              />
              {countdown === 0 && (
                <div className="absolute inset-0 bg-black/70 rounded-2xl flex items-center justify-center">
                  <div className="text-center text-white p-4">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                    <p className="font-bold">Da het han</p>
                    <button
                      onClick={loadData}
                      className="mt-2 px-4 py-2 bg-white text-gray-800 rounded-lg text-sm font-bold"
                    >
                      Tao ma moi
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="text-center">
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
              countdown < 300 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
            }`}>
              <Clock className="w-4 h-4" />
              Con {formatTime(countdown)}
            </span>
          </div>
        </div>

        {/* Thong tin chuyen khoan */}
        <div className="bg-white rounded-2xl p-5 shadow-lg mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Hoac chuyen khoan thu cong</h2>
              <p className="text-sm text-gray-500">Sao chep thong tin ben duoi</p>
            </div>
          </div>

          <div className="space-y-3">
            {/* Ngan hang */}
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <div>
                <p className="text-xs text-gray-500">Ngan hang</p>
                <p className="font-bold text-gray-800">{order?.bankInfo?.bankName}</p>
              </div>
            </div>

            {/* So tai khoan */}
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <div>
                <p className="text-xs text-gray-500">So tai khoan</p>
                <p className="font-bold text-gray-800 font-mono">{order?.bankInfo?.accountNo}</p>
              </div>
              <button
                onClick={() => copyToClipboard(order?.bankInfo?.accountNo, 'accountNo')}
                className="px-3 py-2 bg-blue-100 text-blue-600 rounded-lg text-sm font-bold flex items-center gap-1 hover:bg-blue-200 transition"
              >
                {copied.accountNo ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied.accountNo ? 'Da sao chep' : 'Sao chep'}
              </button>
            </div>

            {/* Chu tai khoan */}
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <div>
                <p className="text-xs text-gray-500">Chu tai khoan</p>
                <p className="font-bold text-gray-800">{order?.bankInfo?.accountName}</p>
              </div>
            </div>

            {/* So tien */}
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <div>
                <p className="text-xs text-gray-500">So tien</p>
                <p className="font-bold text-blue-600 text-lg">{formatMoney(order?.bankInfo?.amount)}</p>
              </div>
              <button
                onClick={() => copyToClipboard(order?.bankInfo?.amount?.toString(), 'amount')}
                className="px-3 py-2 bg-blue-100 text-blue-600 rounded-lg text-sm font-bold flex items-center gap-1 hover:bg-blue-200 transition"
              >
                {copied.amount ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied.amount ? 'Da sao chep' : 'Sao chep'}
              </button>
            </div>

            {/* Noi dung chuyen khoan - QUAN TRONG */}
            <div className="p-4 bg-yellow-50 rounded-xl border-2 border-yellow-300">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-yellow-700 font-medium">Noi dung chuyen khoan (Bat buoc)</p>
                  <p className="font-bold text-yellow-800 text-lg font-mono mt-1">{order?.bankInfo?.content}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(order?.bankInfo?.content, 'content')}
                  className="px-3 py-2 bg-yellow-200 text-yellow-700 rounded-lg text-sm font-bold flex items-center gap-1 hover:bg-yellow-300 transition"
                >
                  {copied.content ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied.content ? 'Da sao chep' : 'Sao chep'}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-200">
            <p className="text-red-600 text-sm flex items-start gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Quan trong:</strong> Vui long nhap dung noi dung chuyen khoan de he thong tu dong xac nhan. Neu khong, thanh toan co the bi cham.
              </span>
            </p>
          </div>
        </div>

        {/* Nut kiem tra */}
        <button
          onClick={handleManualCheck}
          disabled={checking || countdown === 0}
          className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-bold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {checking ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Dang kiem tra...
            </>
          ) : (
            <>
              <Check className="w-5 h-5" />
              Toi da chuyen khoan - Kiem tra
            </>
          )}
        </button>

        {/* Huong dan */}
        <div className="mt-6 bg-blue-50 rounded-xl p-5 border border-blue-200">
          <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
            <span className="text-lg">📝</span>
            Huong dan thanh toan
          </h3>
          <ol className="text-sm text-blue-700 space-y-2">
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
              <span>Mo ung dung ngan hang tren dien thoai</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
              <span>Quet ma QR hoac nhap thong tin chuyen khoan</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
              <span>Nhap dung so tien va noi dung chuyen khoan</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
              <span>Xac nhan chuyen khoan</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">5</span>
              <span>He thong se tu dong nang cap tai khoan trong 1-5 phut</span>
            </li>
          </ol>
        </div>

        {/* Lien he ho tro */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Can ho tro? Lien he <a href="tel:0123456789" className="text-blue-500 font-medium">0123 456 789</a> hoac{' '}
            <a href="mailto:support@schoolhub.vn" className="text-blue-500 font-medium">support@schoolhub.vn</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
