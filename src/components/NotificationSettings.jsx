// src/components/NotificationSettings.jsx
// Component cài đặt notifications
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, BellOff, Clock, Flame, Trophy, AlertCircle, Check } from 'lucide-react';
import {
  getNotificationSettings,
  saveNotificationSettings,
  checkNotificationPermission,
  requestNotificationPermission,
  scheduleDailyReminder,
} from '../lib/notifications';

export default function NotificationSettings() {
  const [settings, setSettings] = useState(getNotificationSettings());
  const [permission, setPermission] = useState('default');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setPermission(checkNotificationPermission());
  }, []);

  const handleToggle = async (key) => {
    let newValue = !settings[key];

    // If enabling notifications, request permission first
    if (key === 'enabled' && newValue) {
      setLoading(true);
      const { granted } = await requestNotificationPermission();
      setLoading(false);

      if (!granted) {
        alert('Vui lòng cho phép thông báo trong cài đặt trình duyệt để sử dụng tính năng này.');
        return;
      }
      setPermission('granted');
    }

    const newSettings = saveNotificationSettings({ [key]: newValue });
    setSettings(newSettings);

    // Reschedule daily reminder if time changed
    if (key === 'dailyReminder' && newValue) {
      scheduleDailyReminder(newSettings.dailyReminderTime);
    }

    // Show success feedback
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1500);
  };

  const handleTimeChange = (e) => {
    const newTime = e.target.value;
    const newSettings = saveNotificationSettings({ dailyReminderTime: newTime });
    setSettings(newSettings);

    // Reschedule if enabled
    if (newSettings.dailyReminder) {
      scheduleDailyReminder(newTime);
    }

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1500);
  };

  const permissionStatus = {
    granted: { icon: Check, color: 'text-green-500', text: 'Đã bật' },
    denied: { icon: AlertCircle, color: 'text-red-500', text: 'Đã chặn' },
    default: { icon: Bell, color: 'text-gray-500', text: 'Chưa cấp phép' },
    unsupported: { icon: AlertCircle, color: 'text-orange-500', text: 'Không hỗ trợ' },
  }[permission];

  const PermissionIcon = permissionStatus.icon;

  return (
    <div className="space-y-4">
      {/* Permission Status */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
        <div className="flex items-center gap-3">
          <PermissionIcon className={`w-5 h-5 ${permissionStatus.color}`} />
          <div>
            <p className="text-sm font-medium text-gray-700">Quyền thông báo</p>
            <p className="text-xs text-gray-500">{permissionStatus.text}</p>
          </div>
        </div>
        {permission === 'denied' && (
          <p className="text-xs text-red-500">Bật lại trong cài đặt trình duyệt</p>
        )}
      </div>

      {/* Master Toggle */}
      <SettingItem
        icon={settings.enabled ? Bell : BellOff}
        iconColor={settings.enabled ? 'text-indigo-500' : 'text-gray-400'}
        label="Thông báo"
        description="Bật/tắt tất cả thông báo"
        toggle
        value={settings.enabled}
        onChange={() => handleToggle('enabled')}
        loading={loading}
      />

      {/* Daily Reminder */}
      <SettingItem
        icon={Clock}
        iconColor={settings.dailyReminder ? 'text-blue-500' : 'text-gray-400'}
        label="Nhắc học hàng ngày"
        description="Nhắc nhở học tập mỗi ngày"
        toggle
        value={settings.dailyReminder}
        onChange={() => handleToggle('dailyReminder')}
        disabled={!settings.enabled}
      />

      {/* Reminder Time */}
      {settings.dailyReminder && settings.enabled && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="flex items-center justify-between p-3 bg-blue-50 rounded-xl ml-8"
        >
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-700">Thời gian nhắc</span>
          </div>
          <input
            type="time"
            value={settings.dailyReminderTime}
            onChange={handleTimeChange}
            className="px-3 py-1.5 bg-white border border-blue-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </motion.div>
      )}

      {/* Streak Reminder */}
      <SettingItem
        icon={Flame}
        iconColor={settings.streakReminder ? 'text-orange-500' : 'text-gray-400'}
        label="Nhắc giữ streak"
        description="Nhắc khi sắp mất streak"
        toggle
        value={settings.streakReminder}
        onChange={() => handleToggle('streakReminder')}
        disabled={!settings.enabled}
      />

      {/* Achievement Notifications */}
      <SettingItem
        icon={Trophy}
        iconColor={settings.achievementNotifications ? 'text-amber-500' : 'text-gray-400'}
        label="Thông báo thành tích"
        description="Thông báo khi đạt huy hiệu, lên cấp"
        toggle
        value={settings.achievementNotifications}
        onChange={() => handleToggle('achievementNotifications')}
        disabled={!settings.enabled}
      />

      {/* Success Toast */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg flex items-center gap-2"
        >
          <Check className="w-4 h-4" />
          Đã lưu
        </motion.div>
      )}
    </div>
  );
}

// Reusable setting item component
function SettingItem({
  icon: Icon,
  iconColor,
  label,
  description,
  toggle,
  value,
  onChange,
  disabled = false,
  loading = false,
}) {
  return (
    <div
      className={`flex items-center gap-4 p-3 rounded-xl transition ${
        disabled ? 'opacity-50' : 'hover:bg-gray-50'
      }`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gray-100`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>

      <div className="flex-1">
        <p className="font-medium text-gray-800">{label}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>

      {toggle && (
        <button
          onClick={disabled ? undefined : onChange}
          disabled={disabled || loading}
          className={`w-12 h-7 rounded-full transition-colors ${
            value ? 'bg-indigo-500' : 'bg-gray-200'
          } ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {loading ? (
            <div className="w-5 h-5 mx-auto border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <motion.div
              animate={{ x: value ? 22 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="w-5 h-5 mt-1 bg-white rounded-full shadow"
            />
          )}
        </button>
      )}
    </div>
  );
}
