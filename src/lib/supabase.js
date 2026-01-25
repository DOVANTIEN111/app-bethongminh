// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

// Lấy config từ environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Kiểm tra env vars bắt buộc
if (!supabaseUrl || !supabaseAnonKey) {
  const missingVars = [];
  if (!supabaseUrl) missingVars.push('VITE_SUPABASE_URL');
  if (!supabaseAnonKey) missingVars.push('VITE_SUPABASE_ANON_KEY');

  console.error(
    `❌ Missing required environment variables: ${missingVars.join(', ')}\n` +
    'Vui lòng tạo file .env.local với các giá trị Supabase.\n' +
    'Xem file .env.example để biết cách setup.'
  );

  // Trong development, hiển thị hướng dẫn
  if (import.meta.env.DEV) {
    throw new Error(
      `Missing Supabase configuration. Please create .env.local file with:\n` +
      `VITE_SUPABASE_URL=https://your-project.supabase.co\n` +
      `VITE_SUPABASE_ANON_KEY=your-anon-key`
    );
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// =====================================================
// DEVICE FINGERPRINT
// =====================================================

// Tạo device fingerprint từ thông tin trình duyệt
export const generateDeviceFingerprint = () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.textBaseline = 'top';
  ctx.font = '14px Arial';
  ctx.fillText('fingerprint', 2, 2);
  const canvasData = canvas.toDataURL();
  
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    !!window.sessionStorage,
    !!window.localStorage,
    navigator.hardwareConcurrency || 'unknown',
    canvasData.slice(-50),
  ];
  
  // Simple hash function
  const str = components.join('###');
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  return 'DEV_' + Math.abs(hash).toString(36).toUpperCase();
};

// Lấy thông tin thiết bị
export const getDeviceInfo = () => {
  const ua = navigator.userAgent;
  
  // Detect device type
  let deviceType = 'desktop';
  if (/tablet|ipad|playbook|silk/i.test(ua)) {
    deviceType = 'tablet';
  } else if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) {
    deviceType = 'phone';
  }
  
  // Detect OS
  let os = 'Unknown';
  if (/windows/i.test(ua)) os = 'Windows';
  else if (/macintosh|mac os x/i.test(ua)) os = 'macOS';
  else if (/linux/i.test(ua)) os = 'Linux';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';
  
  // Detect browser
  let browser = 'Unknown';
  if (/chrome/i.test(ua) && !/edge|edg/i.test(ua)) browser = 'Chrome';
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = 'Safari';
  else if (/firefox/i.test(ua)) browser = 'Firefox';
  else if (/edge|edg/i.test(ua)) browser = 'Edge';
  else if (/opera|opr/i.test(ua)) browser = 'Opera';
  
  // Device name suggestion
  let deviceName = '';
  if (deviceType === 'phone') {
    if (os === 'iOS') deviceName = 'iPhone';
    else if (os === 'Android') deviceName = 'Điện thoại Android';
    else deviceName = 'Điện thoại';
  } else if (deviceType === 'tablet') {
    if (os === 'iOS') deviceName = 'iPad';
    else deviceName = 'Máy tính bảng';
  } else {
    if (os === 'macOS') deviceName = 'MacBook';
    else if (os === 'Windows') deviceName = 'Máy tính Windows';
    else deviceName = 'Máy tính';
  }
  
  return {
    fingerprint: generateDeviceFingerprint(),
    deviceType,
    os,
    browser,
    screenSize: `${screen.width}x${screen.height}`,
    suggestedName: deviceName,
  };
};

// Lưu device fingerprint vào localStorage
export const getOrCreateDeviceId = () => {
  let deviceId = localStorage.getItem('schoolhub_device_id');
  if (!deviceId) {
    deviceId = generateDeviceFingerprint();
    localStorage.setItem('schoolhub_device_id', deviceId);
  }
  return deviceId;
};

export default supabase;
