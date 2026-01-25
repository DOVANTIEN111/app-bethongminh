// src/services/subscriptionService.js
// Service quản lý subscription và dùng thử
import { supabase } from '../lib/supabase';

// Lấy thông tin subscription của user
export const getUserSubscription = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select(`
        *,
        plan:plans(*)
      `)
      .eq('user_id', userId)
      .in('status', ['active', 'expired'])
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Get subscription error:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Get subscription exception:', err);
    return null;
  }
};

// Kiểm tra subscription có hết hạn không
export const checkSubscriptionExpiry = (subscription) => {
  if (!subscription || !subscription.end_date) {
    return { isExpired: true, daysRemaining: 0 };
  }

  const endDate = new Date(subscription.end_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  const diffTime = endDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return {
    isExpired: diffDays <= 0,
    daysRemaining: Math.max(0, diffDays),
  };
};

// Cập nhật status subscription thành expired
export const expireSubscription = async (subscriptionId) => {
  try {
    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: 'expired',
        updated_at: new Date().toISOString(),
      })
      .eq('id', subscriptionId);

    if (error) {
      console.error('Expire subscription error:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Expire subscription exception:', err);
    return false;
  }
};

// Chuyển user về gói Free
export const downgradeToFree = async (userId) => {
  try {
    // Lấy gói free
    const { data: freePlan } = await supabase
      .from('plans')
      .select('id')
      .eq('slug', 'free')
      .single();

    if (!freePlan) {
      console.error('Free plan not found');
      return false;
    }

    // Tạo subscription mới với gói free
    const { error } = await supabase.from('subscriptions').insert({
      user_id: userId,
      plan_id: freePlan.id,
      status: 'active',
      start_date: new Date().toISOString().split('T')[0],
      end_date: null, // Free không có hết hạn
      is_trial: false,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error('Downgrade to free error:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Downgrade to free exception:', err);
    return false;
  }
};

// Kiểm tra user có quyền truy cập bài học không
export const canAccessLesson = (subscription, lessonIndex) => {
  // Nếu không có subscription hoặc đã hết hạn, chỉ xem được 3 bài đầu
  if (!subscription || subscription.status !== 'active') {
    return lessonIndex < 3;
  }

  // Nếu là gói free, chỉ xem được 3 bài đầu
  if (subscription.plan?.slug === 'free') {
    return lessonIndex < 3;
  }

  // Nếu là gói trial hoặc premium và còn hạn, xem được tất cả
  const { isExpired } = checkSubscriptionExpiry(subscription);
  if (isExpired) {
    return lessonIndex < 3;
  }

  return true;
};

// Lấy thông tin gói cước
export const getPlans = async () => {
  try {
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .eq('is_active', true)
      .order('price_monthly', { ascending: true });

    if (error) {
      console.error('Get plans error:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Get plans exception:', err);
    return [];
  }
};

// Tạo subscription dùng thử
export const createTrialSubscription = async (userId) => {
  try {
    // Lấy gói trial
    const { data: trialPlan } = await supabase
      .from('plans')
      .select('id')
      .eq('slug', 'trial')
      .single();

    if (!trialPlan) {
      console.error('Trial plan not found');
      return null;
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);

    const { data, error } = await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        plan_id: trialPlan.id,
        status: 'active',
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        is_trial: true,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Create trial subscription error:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Create trial subscription exception:', err);
    return null;
  }
};

export default {
  getUserSubscription,
  checkSubscriptionExpiry,
  expireSubscription,
  downgradeToFree,
  canAccessLesson,
  getPlans,
  createTrialSubscription,
};
