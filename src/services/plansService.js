// src/services/plansService.js
// Service for managing subscription plans
import supabase from '../lib/supabase';

// Default plans for fallback when database is not available
const DEFAULT_PLANS = [
  {
    id: 'free',
    name: 'Miễn phí',
    description: 'Cho học sinh mới bắt đầu',
    price_monthly: 0,
    price_yearly: 0,
    duration_days: 30,
    features: [
      { name: '3 bài học/môn', included: true },
      { name: 'Trò chơi giáo dục cơ bản', included: true },
      { name: 'Theo dõi tiến độ', included: true },
      { name: 'Có quảng cáo', included: true },
      { name: 'Tất cả bài học', included: false },
      { name: 'Không quảng cáo', included: false },
    ],
    is_active: true,
    display_order: 1,
    badge: null,
    badge_color: 'gray',
    target_user: 'student',
    button_text: 'Bắt đầu miễn phí',
    button_link: '/register',
    is_featured: false,
  },
  {
    id: 'premium',
    name: 'Học sinh Premium',
    description: 'Cho học sinh muốn học tập toàn diện',
    price_monthly: 49000,
    price_yearly: 490000,
    duration_days: 30,
    features: [
      { name: 'Tất cả 500+ bài học', included: true },
      { name: 'Trò chơi giáo dục đầy đủ', included: true },
      { name: 'Theo dõi tiến độ chi tiết', included: true },
      { name: 'Không quảng cáo', included: true },
      { name: 'Hỗ trợ 24/7', included: true },
      { name: 'Phần thưởng độc quyền', included: true },
    ],
    is_active: true,
    display_order: 2,
    badge: 'Phổ biến nhất',
    badge_color: 'blue',
    target_user: 'student',
    button_text: 'Dùng thử 30 ngày',
    button_link: '/register',
    is_featured: true,
  },
  {
    id: 'teacher',
    name: 'Giáo viên Pro',
    description: 'Cho giáo viên quản lý lớp học',
    price_monthly: 199000,
    price_yearly: 1990000,
    duration_days: 30,
    features: [
      { name: 'Tạo bài giảng không giới hạn', included: true },
      { name: 'Quản lý đến 100 học sinh', included: true },
      { name: 'Tạo bài kiểm tra online', included: true },
      { name: 'Chấm điểm tự động', included: true },
      { name: 'Báo cáo chi tiết', included: true },
      { name: 'Hỗ trợ ưu tiên', included: true },
    ],
    is_active: true,
    display_order: 3,
    badge: null,
    badge_color: 'purple',
    target_user: 'teacher',
    button_text: 'Đăng ký ngay',
    button_link: '/register/teacher',
    is_featured: false,
  },
  {
    id: 'school',
    name: 'Trường học',
    description: 'Giải pháp toàn diện cho nhà trường',
    price_monthly: 0,
    price_yearly: 0,
    duration_days: 365,
    features: [
      { name: 'Không giới hạn giáo viên', included: true },
      { name: 'Không giới hạn học sinh', included: true },
      { name: 'Quản lý bộ phận, lớp học', included: true },
      { name: 'Tích hợp hệ thống có sẵn', included: true },
      { name: 'Hỗ trợ triển khai riêng', included: true },
      { name: 'Account Manager riêng', included: true },
    ],
    is_active: true,
    display_order: 4,
    badge: 'Doanh nghiệp',
    badge_color: 'indigo',
    target_user: 'school',
    button_text: 'Liên hệ tư vấn',
    button_link: '/register/school',
    is_featured: false,
  },
];

/**
 * Get all active plans for public display (landing page)
 */
export async function getActivePlans() {
  try {
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.warn('Failed to load plans from DB, using defaults:', error.message);
      return DEFAULT_PLANS;
    }

    return data && data.length > 0 ? data : DEFAULT_PLANS;
  } catch (err) {
    console.error('Error fetching plans:', err);
    return DEFAULT_PLANS;
  }
}

/**
 * Get all plans (for admin)
 */
export async function getAllPlans() {
  try {
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.warn('Failed to load plans from DB:', error.message);
      return DEFAULT_PLANS;
    }

    return data || DEFAULT_PLANS;
  } catch (err) {
    console.error('Error fetching all plans:', err);
    return DEFAULT_PLANS;
  }
}

/**
 * Get a single plan by ID
 */
export async function getPlanById(id) {
  try {
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error fetching plan:', err);
    return null;
  }
}

/**
 * Create a new plan (admin only)
 */
export async function createPlan(planData) {
  try {
    const { data, error } = await supabase
      .from('plans')
      .insert({
        ...planData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('Error creating plan:', err);
    return { data: null, error: err.message };
  }
}

/**
 * Update a plan (admin only)
 */
export async function updatePlan(id, planData) {
  try {
    const { data, error } = await supabase
      .from('plans')
      .update({
        ...planData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('Error updating plan:', err);
    return { data: null, error: err.message };
  }
}

/**
 * Delete a plan (admin only)
 */
export async function deletePlan(id) {
  try {
    const { error } = await supabase
      .from('plans')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { error: null };
  } catch (err) {
    console.error('Error deleting plan:', err);
    return { error: err.message };
  }
}

/**
 * Toggle plan active status (admin only)
 */
export async function togglePlanStatus(id, isActive) {
  return updatePlan(id, { is_active: isActive });
}

/**
 * Format price for display
 */
export function formatPrice(price) {
  if (price === 0 || price === null || price === undefined) {
    return 'Liên hệ';
  }
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
}

/**
 * Calculate yearly savings percentage
 */
export function calculateYearlySavings(monthlyPrice, yearlyPrice) {
  if (!monthlyPrice || !yearlyPrice) return 0;
  const normalYearlyPrice = monthlyPrice * 12;
  const savings = ((normalYearlyPrice - yearlyPrice) / normalYearlyPrice) * 100;
  return Math.round(savings);
}

export default {
  getActivePlans,
  getAllPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan,
  togglePlanStatus,
  formatPrice,
  calculateYearlySavings,
  DEFAULT_PLANS,
};
