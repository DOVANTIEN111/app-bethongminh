// src/contexts/PaymentContext.jsx
// Payment & Subscription Context
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useRBAC } from './RBACContext';

const PaymentContext = createContext(null);

// Cấu hình thanh toán
export const PAYMENT_CONFIG = {
  bankInfo: {
    bankName: 'Vietcombank',
    accountNumber: '1234567890',
    accountName: 'CONG TY TNHH GIA DINH THONG MINH',
    branch: 'Chi nhánh Hà Nội',
  },
  momo: {
    partnerCode: 'MOMOBKUN20180529',
    accessKey: process.env.VITE_MOMO_ACCESS_KEY || '',
    secretKey: process.env.VITE_MOMO_SECRET_KEY || '',
    endpoint: 'https://payment.momo.vn/v2/gateway/api/create',
  },
};

export function PaymentProvider({ children }) {
  const { user, role } = useRBAC();
  const [plans, setPlans] = useState([]);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load dữ liệu khi user đăng nhập
  useEffect(() => {
    if (user) {
      loadPaymentData();
    } else {
      setCurrentSubscription(null);
      setPaymentHistory([]);
    }
  }, [user]);

  const loadPaymentData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadPlans(),
        loadCurrentSubscription(),
        loadPaymentHistory(),
      ]);
    } catch (err) {
      console.error('Load payment data error:', err);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // PLANS
  // =====================================================

  const loadPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (error) throw error;
      setPlans(data || []);
      return data;
    } catch (err) {
      console.error('Load plans error:', err);
      return [];
    }
  };

  const getPlansByRole = useCallback((targetRole) => {
    return plans.filter(p => p.role === targetRole);
  }, [plans]);

  const getPlanById = useCallback((planId) => {
    return plans.find(p => p.id === planId);
  }, [plans]);

  // =====================================================
  // SUBSCRIPTIONS
  // =====================================================

  const loadCurrentSubscription = async () => {
    if (!user) return null;

    try {
      // Try RPC function first
      const { data: rpcData, error: rpcError } = await supabase
        .rpc('get_user_subscription', { p_user_id: user.id });

      if (!rpcError && rpcData) {
        setCurrentSubscription(rpcData);
        return rpcData;
      }

      // Fallback to direct query
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('account_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      const subscription = data ? {
        subscription_id: data.id,
        plan: data.plan,
        price: data.price,
        is_active: data.is_active,
        max_devices: data.max_devices,
        max_children: data.max_children,
        payment_method: data.payment_method,
        started_at: data.started_at,
        expires_at: data.expires_at,
        days_remaining: data.expires_at ? Math.ceil((new Date(data.expires_at) - new Date()) / (1000 * 60 * 60 * 24)) : null
      } : { plan: 'free', is_active: false };

      setCurrentSubscription(subscription);
      return subscription;
    } catch (err) {
      console.error('Load subscription error:', err);
      return null;
    }
  };

  const hasFeature = useCallback((feature) => {
    if (!currentSubscription?.features) return false;
    return currentSubscription.features.includes(feature);
  }, [currentSubscription]);

  const getLimit = useCallback((limitKey) => {
    if (!currentSubscription?.limits) return 0;
    return currentSubscription.limits[limitKey] || 0;
  }, [currentSubscription]);

  const isWithinLimit = useCallback((limitKey, currentValue) => {
    const limit = getLimit(limitKey);
    if (limit === -1) return true; // -1 = unlimited
    return currentValue < limit;
  }, [getLimit]);

  const isPremium = useCallback(() => {
    return currentSubscription?.plan?.includes('premium') || currentSubscription?.plan === 'premium';
  }, [currentSubscription]);

  const isBasic = useCallback(() => {
    return currentSubscription?.plan?.includes('basic') || currentSubscription?.plan === 'basic';
  }, [currentSubscription]);

  const isFree = useCallback(() => {
    return !currentSubscription?.plan || currentSubscription?.plan === 'free' || currentSubscription?.plan?.includes('free');
  }, [currentSubscription]);

  // =====================================================
  // PAYMENTS
  // =====================================================

  const loadPaymentHistory = async () => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          plan:plans(name, slug)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPaymentHistory(data || []);
      return data;
    } catch (err) {
      console.error('Load payment history error:', err);
      return [];
    }
  };

  // Tạo payment mới
  const createPayment = async (planId, method, months = 1, promoCode = null) => {
    if (!user) return { error: 'Chưa đăng nhập' };

    try {
      const plan = getPlanById(planId);
      if (!plan) return { error: 'Gói không tồn tại' };

      // Tính giá
      let amount = months >= 12 ? plan.price_yearly : plan.price_monthly * months;
      let originalAmount = amount;
      let discountAmount = 0;
      let promoId = null;

      // Áp dụng mã giảm giá
      if (promoCode) {
        const promoResult = await validatePromoCode(promoCode, amount);
        if (promoResult.valid) {
          discountAmount = promoResult.discount;
          amount = promoResult.final_amount;
          promoId = promoResult.promo_id;
        }
      }

      // Tạo mã giao dịch
      const transactionId = generateTransactionId();

      // Insert payment
      const { data: payment, error } = await supabase
        .from('payments')
        .insert({
          user_id: user.id,
          plan_id: planId,
          amount,
          original_amount: originalAmount,
          discount_amount: discountAmount,
          promo_code_id: promoId,
          method,
          status: 'pending',
          transaction_id: transactionId,
        })
        .select()
        .single();

      if (error) throw error;

      return { data: payment, transactionId, error: null };
    } catch (err) {
      console.error('Create payment error:', err);
      return { data: null, error: err.message };
    }
  };

  // Xác nhận thanh toán thành công
  const confirmPayment = async (paymentId, transactionData = {}) => {
    try {
      // Lấy thông tin payment
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .update({
          status: 'success',
          paid_at: new Date().toISOString(),
        })
        .eq('id', paymentId)
        .select('*, plan:plans(*)')
        .single();

      if (paymentError) throw paymentError;

      // Tính ngày hết hạn
      const months = payment.amount >= (payment.plan?.price_monthly || 0) * 10 ? 12 : 1;
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + months);

      // Hủy subscription cũ
      await supabase
        .from('subscriptions')
        .update({ is_active: false })
        .eq('account_id', user.id)
        .eq('is_active', true);

      // Tạo subscription mới
      const { data: subscription, error: subError } = await supabase
        .from('subscriptions')
        .insert({
          account_id: user.id,
          plan: payment.plan?.slug || 'basic',
          price: payment.amount,
          is_active: true,
          max_devices: payment.plan?.limits?.max_devices || 3,
          max_children: payment.plan?.limits?.max_children || 1,
          payment_method: payment.method,
          started_at: new Date().toISOString(),
          expires_at: expiresAt.toISOString(),
        })
        .select()
        .single();

      if (subError) throw subError;

      // Reload subscription
      await loadCurrentSubscription();
      await loadPaymentHistory();

      return { success: true, subscription };
    } catch (err) {
      console.error('Confirm payment error:', err);
      return { success: false, error: err.message };
    }
  };

  // Hủy subscription
  const cancelSubscription = async () => {
    if (!currentSubscription?.subscription_id) {
      return { error: 'Không có gói đang active' };
    }

    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({ is_active: false })
        .eq('id', currentSubscription.subscription_id);

      if (error) throw error;

      await loadCurrentSubscription();
      return { success: true };
    } catch (err) {
      return { error: err.message };
    }
  };

  // =====================================================
  // PROMO CODES
  // =====================================================

  const validatePromoCode = async (code, amount) => {
    try {
      const { data, error } = await supabase
        .rpc('validate_promo_code', {
          p_code: code.toUpperCase(),
          p_amount: amount,
        });

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Validate promo code error:', err);
      return { valid: false, error: err.message };
    }
  };

  // =====================================================
  // MOMO PAYMENT
  // =====================================================

  const createMomoPayment = async (paymentId, amount, orderInfo) => {
    // Trong môi trường thực, gọi API backend để tạo payment
    // Backend sẽ sign request với secret key
    const requestId = generateTransactionId();
    const orderId = `GDTM_${paymentId}`;

    // Mock response - trong thực tế sẽ gọi API MoMo
    return {
      payUrl: `https://payment.momo.vn/pay?orderId=${orderId}`,
      qrCodeUrl: `https://payment.momo.vn/qr?orderId=${orderId}`,
      orderId,
      requestId,
    };
  };

  // =====================================================
  // BANK TRANSFER
  // =====================================================

  const getBankTransferInfo = (transactionId, amount) => {
    return {
      ...PAYMENT_CONFIG.bankInfo,
      amount,
      content: `BETHONGMINH ${transactionId}`,
      transactionId,
    };
  };

  // =====================================================
  // UTILITIES
  // =====================================================

  const generateTransactionId = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `BTM${timestamp}${random}`;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  // =====================================================
  // ADMIN FUNCTIONS
  // =====================================================

  const getPaymentStats = async () => {
    try {
      const { data, error } = await supabase.rpc('get_payment_stats');
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Get payment stats error:', err);
      return null;
    }
  };

  const getPendingPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          plan:plans(name, slug)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch user info separately
      const userIds = [...new Set(data?.map(p => p.user_id) || [])];
      const { data: users } = await supabase
        .from('rbac_users')
        .select('id, name, email')
        .in('id', userIds);

      const userMap = {};
      users?.forEach(u => userMap[u.id] = u);

      return data?.map(p => ({
        ...p,
        user: userMap[p.user_id] || { name: 'Unknown', email: '' }
      })) || [];
    } catch (err) {
      console.error('Get pending payments error:', err);
      return [];
    }
  };

  const approvePayment = async (paymentId) => {
    return confirmPayment(paymentId, { approved_by: user?.id, approved_at: new Date().toISOString() });
  };

  const rejectPayment = async (paymentId, reason) => {
    try {
      const { error } = await supabase
        .from('payments')
        .update({
          status: 'failed',
          notes: reason,
        })
        .eq('id', paymentId);

      if (error) throw error;
      return { success: true };
    } catch (err) {
      return { error: err.message };
    }
  };

  // =====================================================
  // CONTEXT VALUE
  // =====================================================

  const value = {
    // State
    plans,
    currentSubscription,
    paymentHistory,
    loading,

    // Plan functions
    loadPlans,
    getPlansByRole,
    getPlanById,

    // Subscription functions
    loadCurrentSubscription,
    hasFeature,
    getLimit,
    isWithinLimit,
    isPremium,
    isBasic,
    isFree,
    cancelSubscription,

    // Payment functions
    createPayment,
    confirmPayment,
    loadPaymentHistory,

    // Promo code
    validatePromoCode,

    // Payment methods
    createMomoPayment,
    getBankTransferInfo,

    // Utilities
    formatPrice,

    // Admin functions
    getPaymentStats,
    getPendingPayments,
    approvePayment,
    rejectPayment,
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within PaymentProvider');
  }
  return context;
}

export default PaymentContext;
