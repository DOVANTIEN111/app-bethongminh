// src/services/notificationService.js
// Service xu ly push notification va local notification

import { supabase } from '../lib/supabase';

// Kiem tra co phai native app khong (Capacitor)
const isNative = () => {
  return typeof window !== 'undefined' &&
         window.Capacitor &&
         window.Capacitor.isNativePlatform &&
         window.Capacitor.isNativePlatform();
};

// Dang ky push notification
export const registerPushNotifications = async (userId) => {
  if (!isNative()) {
    console.log('Push notifications only work on native apps');
    // Fallback to web push if supported
    return registerWebPush(userId);
  }

  try {
    const { PushNotifications } = await import('@capacitor/push-notifications');

    // Xin quyen
    const permission = await PushNotifications.requestPermissions();

    if (permission.receive !== 'granted') {
      console.log('Push notification permission denied');
      return { success: false, reason: 'permission_denied' };
    }

    // Dang ky
    await PushNotifications.register();

    // Lay token
    PushNotifications.addListener('registration', async (token) => {
      console.log('Push token:', token.value);

      // Luu token vao database
      await savePushToken(userId, token.value, 'fcm');
    });

    // Xu ly loi dang ky
    PushNotifications.addListener('registrationError', (error) => {
      console.error('Push registration error:', error);
    });

    // Xu ly notification khi app dang mo
    PushNotifications.addListener('pushNotificationReceived', async (notification) => {
      console.log('Notification received:', notification);

      // Hien thi local notification
      await sendLocalNotification(
        notification.title || 'SchoolHub',
        notification.body || '',
        notification.data
      );
    });

    // Xu ly khi user tap vao notification
    PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
      console.log('Notification action:', action);

      // Navigate den trang tuong ung
      const data = action.notification.data;
      if (data?.route) {
        window.location.href = data.route;
      }
    });

    return { success: true };

  } catch (error) {
    console.error('Error registering push notifications:', error);
    return { success: false, error: error.message };
  }
};

// Dang ky web push notification
const registerWebPush = async (userId) => {
  if (!('Notification' in window)) {
    console.log('Browser does not support notifications');
    return { success: false, reason: 'not_supported' };
  }

  try {
    const permission = await Notification.requestPermission();

    if (permission !== 'granted') {
      console.log('Web notification permission denied');
      return { success: false, reason: 'permission_denied' };
    }

    // Neu co service worker, dang ky push
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          import.meta.env.VITE_VAPID_PUBLIC_KEY || ''
        )
      });

      // Luu subscription vao database
      await savePushToken(userId, JSON.stringify(subscription), 'web');
    }

    return { success: true };

  } catch (error) {
    console.error('Error registering web push:', error);
    return { success: false, error: error.message };
  }
};

// Helper function for VAPID key
const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

// Luu push token vao database
const savePushToken = async (userId, token, platform) => {
  try {
    await supabase
      .from('profiles')
      .update({
        push_token: token,
        push_platform: platform,
        push_updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    return { success: true };
  } catch (error) {
    console.error('Error saving push token:', error);
    return { success: false, error: error.message };
  }
};

// Gui local notification
export const sendLocalNotification = async (title, body, data = {}) => {
  if (isNative()) {
    try {
      const { LocalNotifications } = await import('@capacitor/local-notifications');

      await LocalNotifications.schedule({
        notifications: [{
          id: Date.now(),
          title,
          body,
          extra: data,
          smallIcon: 'ic_stat_icon',
          largeIcon: 'ic_launcher',
          sound: 'default'
        }]
      });

      return { success: true };
    } catch (error) {
      console.error('Error sending local notification:', error);
      return { success: false, error: error.message };
    }
  }

  // Web notification
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      data
    });
    return { success: true };
  }

  return { success: false, reason: 'not_permitted' };
};

// Xin quyen web notification
export const requestWebNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('Browser does not support notifications');
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

// Gui thong bao hoc tap
export const sendLearningReminder = async () => {
  return await sendLocalNotification(
    'Den gio hoc roi!',
    'Hay vao SchoolHub hoan thanh bai hoc hom nay nhe!',
    { route: '/learn' }
  );
};

// Gui thong bao thanh tich
export const sendAchievementNotification = async (achievementName) => {
  return await sendLocalNotification(
    'Chuc mung!',
    `Ban vua dat thanh tich: ${achievementName}`,
    { route: '/learn/achievements' }
  );
};

// Gui thong bao bai tap moi
export const sendNewAssignmentNotification = async (assignmentTitle) => {
  return await sendLocalNotification(
    'Bai tap moi!',
    `Giao vien vua giao bai: ${assignmentTitle}`,
    { route: '/learn/assignments' }
  );
};

// Gui thong bao streak
export const sendStreakNotification = async (streakDays) => {
  return await sendLocalNotification(
    `Streak ${streakDays} ngay!`,
    'Tuyet voi! Tiep tuc phat huy nhe!',
    { route: '/learn' }
  );
};

// Len lich thong bao
export const scheduleNotification = async (title, body, scheduledAt, data = {}) => {
  if (!isNative()) {
    console.log('Scheduled notifications only work on native apps');
    return { success: false, reason: 'not_native' };
  }

  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications');

    await LocalNotifications.schedule({
      notifications: [{
        id: Date.now(),
        title,
        body,
        extra: data,
        schedule: { at: new Date(scheduledAt) },
        smallIcon: 'ic_stat_icon',
        largeIcon: 'ic_launcher'
      }]
    });

    return { success: true };
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return { success: false, error: error.message };
  }
};

// Huy tat ca thong bao da len lich
export const cancelAllScheduledNotifications = async () => {
  if (!isNative()) return { success: true };

  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications');
    await LocalNotifications.cancel({ notifications: [] });
    return { success: true };
  } catch (error) {
    console.error('Error canceling notifications:', error);
    return { success: false, error: error.message };
  }
};

export default {
  registerPushNotifications,
  sendLocalNotification,
  requestWebNotificationPermission,
  sendLearningReminder,
  sendAchievementNotification,
  sendNewAssignmentNotification,
  sendStreakNotification,
  scheduleNotification,
  cancelAllScheduledNotifications
};
