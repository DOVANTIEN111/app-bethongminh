// src/lib/sentry.js
// Sentry Error Tracking Configuration
import * as Sentry from '@sentry/react';

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;

// Khởi tạo Sentry
export const initSentry = () => {
  // Chỉ khởi tạo nếu có DSN
  if (!SENTRY_DSN) {
    if (import.meta.env.DEV) {
      console.log('ℹ️ Sentry DSN not configured. Error tracking disabled.');
    }
    return false;
  }

  Sentry.init({
    dsn: SENTRY_DSN,

    // Chỉ enable trong production
    enabled: import.meta.env.PROD,

    // Môi trường
    environment: import.meta.env.MODE,

    // Version của app
    release: `gia-dinh-thong-minh@${import.meta.env.VITE_APP_VERSION || '3.5.0'}`,

    // Sample rate cho performance monitoring
    tracesSampleRate: 0.1, // 10% transactions

    // Sample rate cho session replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    // Integrations
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],

    // Chặn các lỗi không cần thiết
    ignoreErrors: [
      // Các lỗi phổ biến không cần track
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered notifications',
      'Non-Error promise rejection captured',
      'Network request failed',
      'Failed to fetch',
      'Load failed',
      // Chrome extensions
      /extensions\//i,
      /^chrome:\/\//i,
    ],

    // Gắn tag cho dễ filter
    beforeSend(event, hint) {
      // Thêm thông tin người dùng nếu có
      const currentChild = localStorage.getItem('gdtm_current_child');
      if (currentChild) {
        try {
          const child = JSON.parse(currentChild);
          event.user = {
            id: child.id,
            username: child.name,
          };
        } catch (e) {
          // Ignore parse error
        }
      }

      // Thêm device info
      event.tags = {
        ...event.tags,
        device_id: localStorage.getItem('gdtm_device_id'),
        app_version: import.meta.env.VITE_APP_VERSION || '3.5.0',
      };

      return event;
    },
  });

  console.log('✅ Sentry initialized');
  return true;
};

// Báo cáo lỗi thủ công
export const captureError = (error, context = {}) => {
  if (!SENTRY_DSN) {
    console.error('Error (Sentry disabled):', error, context);
    return;
  }

  Sentry.withScope((scope) => {
    // Thêm context
    Object.entries(context).forEach(([key, value]) => {
      scope.setExtra(key, value);
    });

    Sentry.captureException(error);
  });
};

// Báo cáo message
export const captureMessage = (message, level = 'info', context = {}) => {
  if (!SENTRY_DSN) {
    console.log(`Message (Sentry disabled) [${level}]:`, message, context);
    return;
  }

  Sentry.withScope((scope) => {
    scope.setLevel(level);
    Object.entries(context).forEach(([key, value]) => {
      scope.setExtra(key, value);
    });

    Sentry.captureMessage(message);
  });
};

// Set user context
export const setUser = (user) => {
  if (!SENTRY_DSN) return;

  Sentry.setUser(user ? {
    id: user.id,
    email: user.email,
    username: user.name,
  } : null);
};

// Add breadcrumb
export const addBreadcrumb = (message, category = 'user', data = {}) => {
  if (!SENTRY_DSN) return;

  Sentry.addBreadcrumb({
    message,
    category,
    level: 'info',
    data,
  });
};

export default {
  initSentry,
  captureError,
  captureMessage,
  setUser,
  addBreadcrumb,
};
