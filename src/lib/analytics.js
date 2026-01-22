// src/lib/analytics.js
// Google Analytics 4 Integration

const GA_TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID;

// Khởi tạo Analytics
export const initAnalytics = () => {
  if (!GA_TRACKING_ID) {
    if (import.meta.env.DEV) {
      console.log('ℹ️ GA Tracking ID not configured. Analytics disabled.');
    }
    return false;
  }

  // Dynamically load GA script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
  document.head.appendChild(script);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_TRACKING_ID, {
    send_page_view: false, // Chúng ta sẽ gửi thủ công
  });

  console.log('✅ Google Analytics initialized');
  return true;
};

// Track page view
export const trackPageView = (pagePath, pageTitle) => {
  if (!GA_TRACKING_ID || !window.gtag) return;

  window.gtag('event', 'page_view', {
    page_path: pagePath,
    page_title: pageTitle,
  });
};

// Track custom event
export const trackEvent = (eventName, params = {}) => {
  if (!GA_TRACKING_ID || !window.gtag) {
    if (import.meta.env.DEV) {
      console.log('📊 Analytics Event (disabled):', eventName, params);
    }
    return;
  }

  window.gtag('event', eventName, params);
};

// Preset events cho app
export const analytics = {
  // User events
  userSignUp: (method = 'email') => {
    trackEvent('sign_up', { method });
  },

  userLogin: (method = 'email') => {
    trackEvent('login', { method });
  },

  userLogout: () => {
    trackEvent('logout');
  },

  // Child events
  childCreated: (age, gender) => {
    trackEvent('child_created', { age, gender });
  },

  childSelected: (childId) => {
    trackEvent('child_selected', { child_id: childId });
  },

  // Learning events
  lessonStarted: (subjectId, lessonId) => {
    trackEvent('lesson_started', {
      subject_id: subjectId,
      lesson_id: lessonId,
    });
  },

  lessonCompleted: (subjectId, lessonId, score, duration) => {
    trackEvent('lesson_completed', {
      subject_id: subjectId,
      lesson_id: lessonId,
      score,
      duration_seconds: duration,
    });
  },

  // Game events
  gameStarted: (gameId) => {
    trackEvent('game_started', { game_id: gameId });
  },

  gameCompleted: (gameId, score, duration) => {
    trackEvent('game_completed', {
      game_id: gameId,
      score,
      duration_seconds: duration,
    });
  },

  // Story events
  storyStarted: (storyId) => {
    trackEvent('story_started', { story_id: storyId });
  },

  storyCompleted: (storyId, duration) => {
    trackEvent('story_completed', {
      story_id: storyId,
      duration_seconds: duration,
    });
  },

  // Achievement events
  achievementUnlocked: (achievementId) => {
    trackEvent('unlock_achievement', {
      achievement_id: achievementId,
    });
  },

  levelUp: (newLevel) => {
    trackEvent('level_up', { level: newLevel });
  },

  // Subscription events
  subscriptionViewed: () => {
    trackEvent('view_subscription');
  },

  subscriptionPurchased: (plan, price) => {
    trackEvent('purchase', {
      currency: 'VND',
      value: price,
      items: [{ item_name: plan }],
    });
  },

  // Engagement events
  dailyStreakAchieved: (streakDays) => {
    trackEvent('daily_streak', { streak_days: streakDays });
  },

  petInteraction: (petId, action) => {
    trackEvent('pet_interaction', {
      pet_id: petId,
      action,
    });
  },

  // Navigation
  pageView: (pageName) => {
    trackPageView(window.location.pathname, pageName);
  },
};

export default analytics;
