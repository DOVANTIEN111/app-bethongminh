// src/services/notificationManagement.js
// Service quản lý thông báo

import { supabase } from '../lib/supabase';

// ========================================
// NOTIFICATIONS (Thông báo)
// ========================================

export async function getNotifications(filters = {}) {
  let query = supabase
    .from('notifications')
    .select(`
      *,
      creator:profiles!notifications_created_by_fkey(id, full_name, avatar_url)
    `)
    .order('created_at', { ascending: false });

  if (filters.isSent !== undefined) {
    query = query.eq('is_sent', filters.isSent);
  }

  if (filters.type) {
    query = query.eq('type', filters.type);
  }

  if (filters.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getNotificationById(id) {
  const { data, error } = await supabase
    .from('notifications')
    .select(`
      *,
      creator:profiles!notifications_created_by_fkey(id, full_name, avatar_url)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createNotification(notification) {
  const { data, error } = await supabase
    .from('notifications')
    .insert([notification])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateNotification(id, updates) {
  const { data, error } = await supabase
    .from('notifications')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteNotification(id) {
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

// ========================================
// SEND NOTIFICATIONS
// ========================================

export async function sendNotification(notificationId) {
  // Get notification
  const notification = await getNotificationById(notificationId);
  if (!notification) throw new Error('Notification not found');

  // Get target users
  let targetUsers = [];

  if (notification.target_type === 'all') {
    const { data } = await supabase
      .from('profiles')
      .select('id');
    targetUsers = data || [];
  } else if (notification.target_type === 'role') {
    const { data } = await supabase
      .from('profiles')
      .select('id')
      .in('role', notification.target_roles || []);
    targetUsers = data || [];
  } else if (notification.target_type === 'school') {
    const { data } = await supabase
      .from('profiles')
      .select('id')
      .in('school_id', notification.target_schools || []);
    targetUsers = data || [];
  } else if (notification.target_type === 'user') {
    targetUsers = (notification.target_users || []).map(id => ({ id }));
  }

  // Create user notifications
  if (targetUsers.length > 0) {
    const userNotifications = targetUsers.map(user => ({
      notification_id: notificationId,
      user_id: user.id,
      is_read: false,
    }));

    // Insert in batches of 100
    for (let i = 0; i < userNotifications.length; i += 100) {
      const batch = userNotifications.slice(i, i + 100);
      await supabase
        .from('user_notifications')
        .upsert(batch, { onConflict: 'notification_id,user_id' });
    }
  }

  // Update notification as sent
  await updateNotification(notificationId, {
    is_sent: true,
    sent_at: new Date().toISOString(),
  });

  return { sent: targetUsers.length };
}

// ========================================
// NOTIFICATION STATS
// ========================================

export async function getNotificationStats(notificationId) {
  const { data, error } = await supabase
    .from('user_notifications')
    .select('id, is_read')
    .eq('notification_id', notificationId);

  if (error) throw error;

  const total = data?.length || 0;
  const read = data?.filter(n => n.is_read).length || 0;

  return {
    total,
    read,
    unread: total - read,
    readRate: total > 0 ? Math.round((read / total) * 100) : 0,
  };
}

export async function getOverallNotificationStats() {
  const { data: notifications } = await supabase
    .from('notifications')
    .select('id, is_sent');

  const { data: userNotifs } = await supabase
    .from('user_notifications')
    .select('id, is_read');

  const totalSent = notifications?.filter(n => n.is_sent).length || 0;
  const totalPending = notifications?.filter(n => !n.is_sent).length || 0;
  const totalDelivered = userNotifs?.length || 0;
  const totalRead = userNotifs?.filter(n => n.is_read).length || 0;

  return {
    totalNotifications: notifications?.length || 0,
    totalSent,
    totalPending,
    totalDelivered,
    totalRead,
    readRate: totalDelivered > 0 ? Math.round((totalRead / totalDelivered) * 100) : 0,
  };
}

// ========================================
// USER NOTIFICATIONS
// ========================================

export async function getUserNotifications(userId, unreadOnly = false) {
  let query = supabase
    .from('user_notifications')
    .select(`
      *,
      notification:notifications(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (unreadOnly) {
    query = query.eq('is_read', false);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function markNotificationAsRead(id) {
  const { error } = await supabase
    .from('user_notifications')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw error;
  return true;
}

export async function markAllNotificationsAsRead(userId) {
  const { error } = await supabase
    .from('user_notifications')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) throw error;
  return true;
}

// ========================================
// NOTIFICATION TYPES
// ========================================

export const NOTIFICATION_TYPES = [
  { id: 'general', name: 'Thông báo chung', icon: '📢' },
  { id: 'promotion', name: 'Khuyến mãi', icon: '🎁' },
  { id: 'system', name: 'Hệ thống', icon: '⚙️' },
  { id: 'reminder', name: 'Nhắc nhở', icon: '⏰' },
  { id: 'announcement', name: 'Thông báo quan trọng', icon: '📣' },
];

export const TARGET_TYPES = [
  { id: 'all', name: 'Tất cả người dùng' },
  { id: 'role', name: 'Theo vai trò' },
  { id: 'school', name: 'Theo trường' },
  { id: 'user', name: 'Người dùng cụ thể' },
];
