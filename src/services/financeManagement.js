// src/services/financeManagement.js
// Service quản lý tài chính: Giao dịch, Khuyến mãi, Thống kê

import { supabase } from '../lib/supabase';

// ========================================
// TRANSACTIONS (Giao dịch)
// ========================================

export async function getTransactions(filters = {}) {
  let query = supabase
    .from('transactions')
    .select(`
      *,
      user:profiles(id, full_name, email, avatar_url),
      plan:plans(id, name, price),
      school:schools(id, name),
      promotion:promotions(id, code, name)
    `)
    .order('created_at', { ascending: false });

  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  if (filters.paymentMethod) {
    query = query.eq('payment_method', filters.paymentMethod);
  }

  if (filters.startDate) {
    query = query.gte('created_at', filters.startDate);
  }

  if (filters.endDate) {
    query = query.lte('created_at', filters.endDate);
  }

  if (filters.search) {
    query = query.or(`user.full_name.ilike.%${filters.search}%,user.email.ilike.%${filters.search}%`);
  }

  if (filters.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getTransactionById(id) {
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      *,
      user:profiles(id, full_name, email, avatar_url, phone),
      plan:plans(id, name, price, duration_days),
      school:schools(id, name),
      promotion:promotions(id, code, name, discount_type, discount_value)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function updateTransactionStatus(id, status, notes = '') {
  const { data, error } = await supabase
    .from('transactions')
    .update({ status, notes, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ========================================
// REVENUE STATISTICS (Thống kê doanh thu)
// ========================================

export async function getRevenueStats(period = 'month') {
  const now = new Date();
  let startDate;

  switch (period) {
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  const { data, error } = await supabase
    .from('transactions')
    .select('amount, created_at, status, payment_method')
    .eq('status', 'completed')
    .gte('created_at', startDate.toISOString());

  if (error) throw error;

  // Group by date
  const dailyRevenue = {};
  data?.forEach(t => {
    const date = new Date(t.created_at).toISOString().split('T')[0];
    if (!dailyRevenue[date]) {
      dailyRevenue[date] = { date, revenue: 0, count: 0 };
    }
    dailyRevenue[date].revenue += parseFloat(t.amount);
    dailyRevenue[date].count += 1;
  });

  return Object.values(dailyRevenue).sort((a, b) => a.date.localeCompare(b.date));
}

export async function getRevenueOverview() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const { data, error } = await supabase
    .from('transactions')
    .select('amount, created_at, status')
    .eq('status', 'completed');

  if (error) throw error;

  let totalRevenue = 0;
  let monthRevenue = 0;
  let yearRevenue = 0;
  let monthCount = 0;

  data?.forEach(t => {
    const amount = parseFloat(t.amount);
    const date = new Date(t.created_at);
    totalRevenue += amount;

    if (date >= startOfMonth) {
      monthRevenue += amount;
      monthCount += 1;
    }
    if (date >= startOfYear) {
      yearRevenue += amount;
    }
  });

  return {
    totalRevenue,
    monthRevenue,
    yearRevenue,
    monthCount,
    totalCount: data?.length || 0,
  };
}

export async function getRevenueByPlan() {
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      amount,
      plan:plans(id, name)
    `)
    .eq('status', 'completed');

  if (error) throw error;

  const byPlan = {};
  data?.forEach(t => {
    const planName = t.plan?.name || 'Không xác định';
    if (!byPlan[planName]) {
      byPlan[planName] = { name: planName, value: 0, count: 0 };
    }
    byPlan[planName].value += parseFloat(t.amount);
    byPlan[planName].count += 1;
  });

  return Object.values(byPlan);
}

export async function getRevenueBySchool(limit = 10) {
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      amount,
      school:schools(id, name)
    `)
    .eq('status', 'completed')
    .not('school_id', 'is', null);

  if (error) throw error;

  const bySchool = {};
  data?.forEach(t => {
    const schoolName = t.school?.name || 'Không xác định';
    const schoolId = t.school?.id;
    if (!bySchool[schoolId]) {
      bySchool[schoolId] = { id: schoolId, name: schoolName, revenue: 0, count: 0 };
    }
    bySchool[schoolId].revenue += parseFloat(t.amount);
    bySchool[schoolId].count += 1;
  });

  return Object.values(bySchool)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
}

// ========================================
// PROMOTIONS (Khuyến mãi)
// ========================================

export async function getPromotions(includeInactive = false) {
  let query = supabase
    .from('promotions')
    .select('*')
    .order('created_at', { ascending: false });

  if (!includeInactive) {
    query = query.eq('is_active', true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getPromotionById(id) {
  const { data, error } = await supabase
    .from('promotions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createPromotion(promotion) {
  const { data, error } = await supabase
    .from('promotions')
    .insert([promotion])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updatePromotion(id, updates) {
  const { data, error } = await supabase
    .from('promotions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deletePromotion(id) {
  const { error } = await supabase
    .from('promotions')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

export async function getPromotionUsage(promotionId) {
  const { data, error } = await supabase
    .from('promotion_usage')
    .select(`
      *,
      user:profiles(id, full_name, email),
      transaction:transactions(id, amount)
    `)
    .eq('promotion_id', promotionId)
    .order('used_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getPromotionStats() {
  const { data, error } = await supabase
    .from('promotions')
    .select('id, code, name, used_count, discount_type, discount_value');

  if (error) throw error;

  let totalUsage = 0;
  let totalDiscount = 0;

  data?.forEach(p => {
    totalUsage += p.used_count || 0;
  });

  return {
    totalPromotions: data?.length || 0,
    totalUsage,
    promotions: data,
  };
}

// ========================================
// PAYMENT METHODS
// ========================================

export const PAYMENT_METHODS = [
  { id: 'bank_transfer', name: 'Chuyển khoản ngân hàng', icon: '🏦' },
  { id: 'momo', name: 'Ví MoMo', icon: '📱' },
  { id: 'vnpay', name: 'VNPay', icon: '💳' },
  { id: 'zalopay', name: 'ZaloPay', icon: '💰' },
  { id: 'card', name: 'Thẻ tín dụng/ghi nợ', icon: '💳' },
  { id: 'cash', name: 'Tiền mặt', icon: '💵' },
];

export const TRANSACTION_STATUS = [
  { id: 'pending', name: 'Chờ xử lý', color: 'yellow' },
  { id: 'completed', name: 'Thành công', color: 'green' },
  { id: 'failed', name: 'Thất bại', color: 'red' },
  { id: 'refunded', name: 'Hoàn tiền', color: 'purple' },
  { id: 'cancelled', name: 'Đã hủy', color: 'gray' },
];

// ========================================
// HELPERS
// ========================================

export function formatCurrency(amount) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

export function formatNumber(num) {
  return new Intl.NumberFormat('vi-VN').format(num);
}
