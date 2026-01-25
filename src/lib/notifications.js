// src/lib/notifications.js
// Push Notifications & Local Notifications Library

// Notification types
export const NOTIFICATION_TYPES = {
  DAILY_REMINDER: 'daily_reminder',
  STREAK_REMINDER: 'streak_reminder',
  ACHIEVEMENT: 'achievement',
  LEVEL_UP: 'level_up',
};

// Default settings
const DEFAULT_SETTINGS = {
  enabled: true,
  dailyReminder: true,
  dailyReminderTime: '18:00', // 6 PM
  streakReminder: true,
  achievementNotifications: true,
};

// Storage key
const STORAGE_KEY = 'schoolhub_notification_settings';

// =====================================================
// SETTINGS MANAGEMENT
// =====================================================

export const getNotificationSettings = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.error('Error reading notification settings:', e);
  }
  return DEFAULT_SETTINGS;
};

export const saveNotificationSettings = (settings) => {
  try {
    const newSettings = { ...getNotificationSettings(), ...settings };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
    return newSettings;
  } catch (e) {
    console.error('Error saving notification settings:', e);
    return null;
  }
};

// =====================================================
// PERMISSION & SUBSCRIPTION
// =====================================================

export const checkNotificationPermission = () => {
  if (!('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
};

export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    return { granted: false, reason: 'unsupported' };
  }

  if (Notification.permission === 'granted') {
    return { granted: true };
  }

  if (Notification.permission === 'denied') {
    return { granted: false, reason: 'denied' };
  }

  try {
    const permission = await Notification.requestPermission();
    return { granted: permission === 'granted', reason: permission };
  } catch (e) {
    console.error('Error requesting permission:', e);
    return { granted: false, reason: 'error' };
  }
};

// Check if push notifications are supported
export const isPushSupported = () => {
  return 'serviceWorker' in navigator && 'PushManager' in window;
};

// Subscribe to push notifications
export const subscribeToPush = async () => {
  if (!isPushSupported()) {
    return { success: false, reason: 'unsupported' };
  }

  try {
    const registration = await navigator.serviceWorker.ready;

    // Check for existing subscription
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      // Create new subscription
      // Note: In production, you'd use a VAPID public key from your server
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        // In production, use actual VAPID key
        // applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });
    }

    return { success: true, subscription };
  } catch (e) {
    console.error('Error subscribing to push:', e);
    return { success: false, reason: e.message };
  }
};

// Unsubscribe from push notifications
export const unsubscribeFromPush = async () => {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      await subscription.unsubscribe();
    }

    return { success: true };
  } catch (e) {
    console.error('Error unsubscribing from push:', e);
    return { success: false, reason: e.message };
  }
};

// =====================================================
// LOCAL NOTIFICATIONS
// =====================================================

export const showLocalNotification = async (title, options = {}) => {
  const permission = checkNotificationPermission();

  if (permission !== 'granted') {
    console.log('Notifications not permitted');
    return false;
  }

  const defaultOptions = {
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    tag: 'schoolhub-notification',
    renotify: true,
    requireInteraction: false,
    ...options,
  };

  try {
    // Try using service worker for better reliability
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(title, defaultOptions);
      return true;
    }

    // Fallback to regular notification
    new Notification(title, defaultOptions);
    return true;
  } catch (e) {
    console.error('Error showing notification:', e);
    return false;
  }
};

// =====================================================
// SCHEDULED NOTIFICATIONS
// =====================================================

// Store scheduled notification timers
const scheduledTimers = {};

// Schedule a daily reminder
export const scheduleDailyReminder = (time = '18:00') => {
  // Cancel existing timer
  if (scheduledTimers.dailyReminder) {
    clearTimeout(scheduledTimers.dailyReminder);
  }

  const settings = getNotificationSettings();
  if (!settings.enabled || !settings.dailyReminder) {
    return;
  }

  const [hours, minutes] = time.split(':').map(Number);
  const now = new Date();
  const scheduledTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hours,
    minutes,
    0
  );

  // If time has passed today, schedule for tomorrow
  if (scheduledTime <= now) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }

  const msUntilReminder = scheduledTime.getTime() - now.getTime();

  scheduledTimers.dailyReminder = setTimeout(() => {
    showLocalNotification('Đến giờ học rồi! 📚', {
      body: 'Hãy dành 10 phút học tập cùng SchoolHub nhé!',
      tag: 'daily-reminder',
      data: { type: NOTIFICATION_TYPES.DAILY_REMINDER },
    });

    // Reschedule for tomorrow
    scheduleDailyReminder(time);
  }, msUntilReminder);

  console.log(`Daily reminder scheduled for ${scheduledTime.toLocaleString()}`);
};

// Schedule streak reminder (if streak > 0 and haven't learned today)
export const scheduleStreakReminder = (streak, hasLearnedToday) => {
  if (scheduledTimers.streakReminder) {
    clearTimeout(scheduledTimers.streakReminder);
  }

  const settings = getNotificationSettings();
  if (!settings.enabled || !settings.streakReminder || streak === 0 || hasLearnedToday) {
    return;
  }

  // Remind at 8 PM if haven't learned
  const now = new Date();
  const scheduledTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    20, // 8 PM
    0,
    0
  );

  if (scheduledTime <= now) {
    return; // Already past 8 PM
  }

  const msUntilReminder = scheduledTime.getTime() - now.getTime();

  scheduledTimers.streakReminder = setTimeout(() => {
    showLocalNotification(`Giữ streak ${streak} ngày! 🔥`, {
      body: 'Đừng quên học hôm nay để giữ streak nhé!',
      tag: 'streak-reminder',
      data: { type: NOTIFICATION_TYPES.STREAK_REMINDER },
    });
  }, msUntilReminder);
};

// =====================================================
// INSTANT NOTIFICATIONS
// =====================================================

// Show achievement notification
export const notifyAchievement = async (achievement) => {
  const settings = getNotificationSettings();
  if (!settings.enabled || !settings.achievementNotifications) {
    return false;
  }

  return showLocalNotification('Huy hiệu mới! 🏆', {
    body: `Chúc mừng! Bạn đã đạt "${achievement.name}"`,
    tag: 'achievement',
    data: { type: NOTIFICATION_TYPES.ACHIEVEMENT, achievement },
  });
};

// Show level up notification
export const notifyLevelUp = async (newLevel, title) => {
  const settings = getNotificationSettings();
  if (!settings.enabled || !settings.achievementNotifications) {
    return false;
  }

  return showLocalNotification(`Lên cấp ${newLevel}! 🎉`, {
    body: `Tuyệt vời! Bạn đã trở thành "${title}"`,
    tag: 'level-up',
    data: { type: NOTIFICATION_TYPES.LEVEL_UP, level: newLevel },
  });
};

// =====================================================
// INITIALIZATION
// =====================================================

export const initNotifications = async () => {
  const settings = getNotificationSettings();

  if (!settings.enabled) {
    return { initialized: false, reason: 'disabled' };
  }

  // Request permission if not granted
  const { granted } = await requestNotificationPermission();

  if (!granted) {
    return { initialized: false, reason: 'permission_denied' };
  }

  // Schedule daily reminder if enabled
  if (settings.dailyReminder) {
    scheduleDailyReminder(settings.dailyReminderTime);
  }

  return { initialized: true };
};

export default {
  NOTIFICATION_TYPES,
  getNotificationSettings,
  saveNotificationSettings,
  checkNotificationPermission,
  requestNotificationPermission,
  isPushSupported,
  subscribeToPush,
  unsubscribeFromPush,
  showLocalNotification,
  scheduleDailyReminder,
  scheduleStreakReminder,
  notifyAchievement,
  notifyLevelUp,
  initNotifications,
};
