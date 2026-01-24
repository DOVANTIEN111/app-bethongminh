// src/services/lessonPermissions.js
// Service kiểm tra quyền truy cập bài học theo role và gói cước

import { supabase } from '../lib/supabase';

// Số bài học miễn phí cho mỗi môn
const FREE_LESSONS_LIMIT = 3;

// Các role được mở khóa tất cả bài học
const UNLIMITED_ROLES = ['super_admin', 'school_admin', 'teacher', 'department_head'];

/**
 * Kiểm tra user có quyền xem tất cả bài học không
 * @param {Object} profile - User profile
 * @returns {Promise<Object>} { hasFullAccess, isPremium, subscription }
 */
export async function checkLessonAccess(profile) {
  if (!profile) {
    return { hasFullAccess: false, isPremium: false, subscription: null };
  }

  // Admin, school_admin, teacher -> mở khóa tất cả
  if (UNLIMITED_ROLES.includes(profile.role)) {
    return { hasFullAccess: true, isPremium: true, subscription: null, isAdmin: true };
  }

  // Student -> kiểm tra subscription
  if (profile.role === 'student') {
    try {
      const { data: subscription, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', profile.id)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking subscription:', error);
      }

      const isPremium = !!subscription;
      return { hasFullAccess: isPremium, isPremium, subscription };
    } catch (err) {
      console.error('Error checking subscription:', err);
      return { hasFullAccess: false, isPremium: false, subscription: null };
    }
  }

  // Parent -> kiểm tra subscription của con
  if (profile.role === 'parent') {
    try {
      // Lấy subscription của parent
      const { data: subscription, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', profile.id)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking parent subscription:', error);
      }

      const isPremium = !!subscription;
      return { hasFullAccess: isPremium, isPremium, subscription };
    } catch (err) {
      console.error('Error checking parent subscription:', err);
      return { hasFullAccess: false, isPremium: false, subscription: null };
    }
  }

  return { hasFullAccess: false, isPremium: false, subscription: null };
}

/**
 * Kiểm tra một bài học cụ thể có được mở khóa không
 * @param {number} lessonIndex - Thứ tự bài học (bắt đầu từ 0)
 * @param {boolean} hasFullAccess - Có quyền truy cập đầy đủ không
 * @returns {boolean} Bài học có được mở khóa không
 */
export function isLessonUnlocked(lessonIndex, hasFullAccess) {
  if (hasFullAccess) return true;
  return lessonIndex < FREE_LESSONS_LIMIT;
}

/**
 * Lấy thông tin gói cước hiện tại
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} Subscription info hoặc null
 */
export async function getSubscriptionInfo(userId) {
  if (!userId) return null;

  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select(`
        *,
        plan:plans(*)
      `)
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (error) {
      if (error.code !== 'PGRST116') {
        console.error('Error fetching subscription:', error);
      }
      return null;
    }

    return data;
  } catch (err) {
    console.error('Error fetching subscription:', err);
    return null;
  }
}

/**
 * Kiểm tra nhanh từ localStorage (cache)
 * @param {string} userId
 * @returns {Object|null}
 */
export function getCachedAccess(userId) {
  try {
    const cached = localStorage.getItem(`lesson_access_${userId}`);
    if (cached) {
      const data = JSON.parse(cached);
      // Cache 5 phút
      if (Date.now() - data.timestamp < 5 * 60 * 1000) {
        return data;
      }
    }
  } catch (e) {
    console.error('Error reading cache:', e);
  }
  return null;
}

/**
 * Lưu cache quyền truy cập
 * @param {string} userId
 * @param {Object} accessData
 */
export function cacheAccess(userId, accessData) {
  try {
    localStorage.setItem(`lesson_access_${userId}`, JSON.stringify({
      ...accessData,
      timestamp: Date.now()
    }));
  } catch (e) {
    console.error('Error saving cache:', e);
  }
}

export { FREE_LESSONS_LIMIT, UNLIMITED_ROLES };
