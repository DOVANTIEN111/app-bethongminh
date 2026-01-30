// src/services/paymentService.js
// Service xu ly thanh toan cho SchoolHub

import { supabase } from '../lib/supabase';

// ==========================================
// CAU HINH NGAN HANG - CAN THAY DOI
// ==========================================
const BANK_CONFIG = {
  bankId: 'MB', // Ma ngan hang (MB, VCB, TCB, BIDV, VTB, ACB, etc.)
  accountNo: '0123456789', // SO TAI KHOAN NHAN TIEN - THAY DOI
  accountName: 'CONG TY SCHOOLHUB', // TEN TAI KHOAN - THAY DOI
  template: 'compact' // compact, compact2, qr_only, print
};

// ==========================================
// TAO MA DON HANG UNIQUE
// ==========================================
const generateOrderCode = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SH${timestamp}${random}`;
};

// ==========================================
// TAO QR CODE VIETQR
// ==========================================
export const generateVietQR = (amount, orderCode) => {
  const content = `SCHOOLHUB ${orderCode}`;
  const url = `https://img.vietqr.io/image/${BANK_CONFIG.bankId}-${BANK_CONFIG.accountNo}-${BANK_CONFIG.template}.png?amount=${amount}&addInfo=${encodeURIComponent(content)}&accountName=${encodeURIComponent(BANK_CONFIG.accountName)}`;
  return url;
};

// ==========================================
// TAO DON HANG THANH TOAN
// ==========================================
export const createPaymentOrder = async (userId, planId, amount, planName = null) => {
  const orderCode = generateOrderCode();
  const expiredAt = new Date(Date.now() + 30 * 60 * 1000); // Het han sau 30 phut

  // Check if planId is a valid UUID (for database plans) or a custom ID (for static plans)
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(planId);

  const orderData = {
    order_code: orderCode,
    user_id: userId,
    amount: amount,
    status: 'pending',
    payment_method: 'bank_transfer',
    expired_at: expiredAt.toISOString(),
    metadata: {
      plan_slug: planId,
      plan_name: planName
    }
  };

  // Only set plan_id if it's a valid UUID
  if (isUUID) {
    orderData.plan_id = planId;
  }

  const { data, error } = await supabase
    .from('payment_orders')
    .insert(orderData)
    .select()
    .single();

  if (error) {
    console.error('Error creating payment order:', error);
    throw error;
  }

  return {
    ...data,
    qrCodeUrl: generateVietQR(amount, orderCode),
    bankInfo: {
      bankName: getBankName(BANK_CONFIG.bankId),
      bankId: BANK_CONFIG.bankId,
      accountNo: BANK_CONFIG.accountNo,
      accountName: BANK_CONFIG.accountName,
      amount: amount,
      content: `SCHOOLHUB ${orderCode}`
    }
  };
};

// ==========================================
// LAY TEN NGAN HANG TU MA
// ==========================================
const getBankName = (bankId) => {
  const banks = {
    'MB': 'MB Bank',
    'VCB': 'Vietcombank',
    'TCB': 'Techcombank',
    'BIDV': 'BIDV',
    'VTB': 'VietinBank',
    'ACB': 'ACB',
    'TPB': 'TPBank',
    'VPB': 'VPBank',
    'MSB': 'MSB',
    'SHB': 'SHB',
    'STB': 'Sacombank'
  };
  return banks[bankId] || bankId;
};

// ==========================================
// KIEM TRA TRANG THAI DON HANG
// ==========================================
export const checkPaymentStatus = async (orderId) => {
  const { data, error } = await supabase
    .from('payment_orders')
    .select(`
      *,
      plan:plan_id (*)
    `)
    .eq('id', orderId)
    .single();

  if (error) throw error;
  return data;
};

// ==========================================
// KIEM TRA THEO ORDER CODE
// ==========================================
export const checkPaymentByCode = async (orderCode) => {
  const { data, error } = await supabase
    .from('payment_orders')
    .select(`
      *,
      plan:plan_id (*)
    `)
    .eq('order_code', orderCode)
    .single();

  if (error) throw error;
  return data;
};

// ==========================================
// LAY LICH SU THANH TOAN
// ==========================================
export const getPaymentHistory = async (userId) => {
  const { data, error } = await supabase
    .from('payment_history')
    .select(`
      *,
      order:order_id (
        order_code,
        amount,
        status,
        plan:plan_id (name)
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

// ==========================================
// LAY SUBSCRIPTION HIEN TAI
// ==========================================
export const getCurrentSubscription = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      subscription_status,
      subscription_end_date
    `)
    .eq('id', userId)
    .single();

  if (error) throw error;

  return {
    status: data?.subscription_status || 'free',
    endDate: data?.subscription_end_date,
    isActive: data?.subscription_status === 'premium' &&
              (!data?.subscription_end_date || new Date(data.subscription_end_date) > new Date())
  };
};

// ==========================================
// XU LY KHI THANH TOAN THANH CONG
// (Goi tu webhook hoac admin)
// ==========================================
export const processSuccessfulPayment = async (orderCode, bankTransactionId = null) => {
  try {
    // 1. Tim don hang
    const { data: order, error: orderError } = await supabase
      .from('payment_orders')
      .select('*, plan:plan_id (*)')
      .eq('order_code', orderCode)
      .eq('status', 'pending')
      .single();

    if (orderError || !order) {
      console.error('Order not found:', orderCode);
      return { success: false, error: 'Order not found' };
    }

    // 2. Cap nhat don hang
    const { error: updateError } = await supabase
      .from('payment_orders')
      .update({
        status: 'completed',
        bank_transaction_id: bankTransactionId,
        paid_at: new Date().toISOString()
      })
      .eq('id', order.id);

    if (updateError) throw updateError;

    // 3. Tinh ngay het han
    const durationDays = order.plan?.duration_days || 30;
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + durationDays);

    // 4. Cap nhat profile
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        subscription_status: 'premium',
        subscription_end_date: endDate.toISOString()
      })
      .eq('id', order.user_id);

    if (profileError) throw profileError;

    // 5. Luu lich su
    await supabase
      .from('payment_history')
      .insert({
        user_id: order.user_id,
        order_id: order.id,
        amount: order.amount,
        type: 'payment',
        description: `Thanh toan goi ${order.plan?.name || 'Premium'}`
      });

    return { success: true, order };
  } catch (error) {
    console.error('Error processing payment:', error);
    return { success: false, error: error.message };
  }
};

// ==========================================
// HUY DON HANG
// ==========================================
export const cancelPaymentOrder = async (orderId) => {
  const { error } = await supabase
    .from('payment_orders')
    .update({ status: 'cancelled' })
    .eq('id', orderId)
    .eq('status', 'pending');

  if (error) throw error;
  return { success: true };
};

// ==========================================
// LAY TAT CA DON HANG CUA USER
// ==========================================
export const getUserPaymentOrders = async (userId) => {
  const { data, error } = await supabase
    .from('payment_orders')
    .select(`
      *,
      plan:plan_id (name, description)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

// ==========================================
// ADMIN: XAC NHAN THANH TOAN THU CONG
// ==========================================
export const adminConfirmPayment = async (orderId, adminId) => {
  // Lay don hang
  const { data: order } = await supabase
    .from('payment_orders')
    .select('order_code')
    .eq('id', orderId)
    .single();

  if (!order) throw new Error('Order not found');

  // Xu ly thanh toan
  const result = await processSuccessfulPayment(order.order_code, `ADMIN_${adminId}`);
  return result;
};

// ==========================================
// FORMAT TIEN TE
// ==========================================
export const formatMoney = (amount) => {
  if (!amount && amount !== 0) return 'Mien phi';
  return new Intl.NumberFormat('vi-VN').format(amount) + 'd';
};

export default {
  createPaymentOrder,
  checkPaymentStatus,
  checkPaymentByCode,
  getPaymentHistory,
  getCurrentSubscription,
  processSuccessfulPayment,
  cancelPaymentOrder,
  getUserPaymentOrders,
  adminConfirmPayment,
  formatMoney,
  generateVietQR
};
