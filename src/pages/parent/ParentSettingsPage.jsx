// src/pages/parent/ParentSettingsPage.jsx
// Parent Settings Page
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Settings, User, Bell, Lock, Clock, LogOut,
  ChevronRight, Save, Loader2, Users, Shield
} from 'lucide-react';

const MOCK_CHILDREN = [
  { id: 1, name: 'Minh Anh', avatar: '👧', dailyLimit: 60, playLimit: 30 },
  { id: 2, name: 'Gia Bảo', avatar: '👦', dailyLimit: 45, playLimit: 20 },
];

export default function ParentSettingsPage() {
  const { profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [saving, setSaving] = useState(false);

  // Account settings
  const [accountForm, setAccountForm] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    daily_report: true,
    teacher_message: true,
    assignment_reminder: true,
    achievement: true,
  });

  // Time limits
  const [timeLimits, setTimeLimits] = useState(
    MOCK_CHILDREN.map(c => ({
      id: c.id,
      name: c.name,
      avatar: c.avatar,
      dailyLimit: c.dailyLimit,
      playLimit: c.playLimit,
    }))
  );

  // Password
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const handleSaveAccount = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    alert('Đã lưu thông tin tài khoản!');
    setSaving(false);
  };

  const handleSaveNotifications = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    alert('Đã lưu cài đặt thông báo!');
    setSaving(false);
  };

  const handleSaveTimeLimits = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    alert('Đã lưu giới hạn thời gian!');
    setSaving(false);
  };

  const handleChangePassword = async () => {
    if (passwordForm.new !== passwordForm.confirm) {
      alert('Mật khẩu mới không khớp!');
      return;
    }
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    alert('Đã đổi mật khẩu thành công!');
    setPasswordForm({ current: '', new: '', confirm: '' });
    setSaving(false);
  };

  const handleLogout = () => {
    if (confirm('Bạn có chắc muốn đăng xuất không?')) {
      signOut();
    }
  };

  const tabs = [
    { id: 'account', label: 'Tài khoản', icon: User },
    { id: 'time', label: 'Giới hạn thời gian', icon: Clock },
    { id: 'notifications', label: 'Thông báo', icon: Bell },
    { id: 'security', label: 'Bảo mật', icon: Lock },
  ];

  return (
    <div className="p-4 space-y-4 pb-28">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
          <Settings className="w-7 h-7 text-purple-500" />
          Cài đặt
        </h1>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {/* Account Tab */}
          {activeTab === 'account' && (
            <div className="space-y-5">
              {/* Profile Preview */}
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-3xl">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="" className="w-16 h-16 rounded-full" />
                  ) : (
                    '👨‍👩‍👧'
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{profile?.full_name}</h3>
                  <p className="text-sm text-gray-500">{profile?.email}</p>
                  <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">
                    Phụ huynh
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={profile?.email || ''}
                  disabled
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên
                </label>
                <input
                  type="text"
                  value={accountForm.full_name}
                  onChange={(e) => setAccountForm({ ...accountForm, full_name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  value={accountForm.phone}
                  onChange={(e) => setAccountForm({ ...accountForm, phone: e.target.value })}
                  placeholder="0912345678"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <button
                onClick={handleSaveAccount}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Lưu thay đổi
              </button>
            </div>
          )}

          {/* Time Limits Tab */}
          {activeTab === 'time' && (
            <div className="space-y-5">
              <div className="p-4 bg-purple-50 rounded-xl">
                <div className="flex items-center gap-2 text-purple-700">
                  <Shield className="w-5 h-5" />
                  <span className="font-medium">Kiểm soát thời gian học</span>
                </div>
                <p className="text-sm text-purple-600 mt-1">
                  Đặt giới hạn thời gian học và chơi game cho từng con.
                </p>
              </div>

              {timeLimits.map((child, index) => (
                <div key={child.id} className="bg-gray-50 rounded-xl p-4 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl">
                      {child.avatar}
                    </div>
                    <span className="font-bold text-gray-800">{child.name}</span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm text-gray-600">Thời gian học tối đa mỗi ngày</label>
                      <span className="font-bold text-purple-600">{child.dailyLimit} phút</span>
                    </div>
                    <input
                      type="range"
                      min="15"
                      max="120"
                      step="15"
                      value={child.dailyLimit}
                      onChange={(e) => {
                        const newLimits = [...timeLimits];
                        newLimits[index].dailyLimit = parseInt(e.target.value);
                        setTimeLimits(newLimits);
                      }}
                      className="w-full h-2 bg-purple-200 rounded-full appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>15 phút</span>
                      <span>2 giờ</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm text-gray-600">Thời gian chơi game tối đa</label>
                      <span className="font-bold text-blue-600">{child.playLimit} phút</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="60"
                      step="10"
                      value={child.playLimit}
                      onChange={(e) => {
                        const newLimits = [...timeLimits];
                        newLimits[index].playLimit = parseInt(e.target.value);
                        setTimeLimits(newLimits);
                      }}
                      className="w-full h-2 bg-blue-200 rounded-full appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>Không chơi</span>
                      <span>1 giờ</span>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={handleSaveTimeLimits}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Lưu giới hạn
              </button>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <p className="text-gray-600">Quản lý thông báo bạn muốn nhận.</p>

              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-800">Báo cáo hàng ngày</p>
                  <p className="text-sm text-gray-500">Nhận tổng kết học tập mỗi ngày</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.daily_report}
                  onChange={(e) => setNotifications({ ...notifications, daily_report: e.target.checked })}
                  className="w-5 h-5 rounded text-purple-600"
                />
              </label>

              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-800">Tin nhắn từ giáo viên</p>
                  <p className="text-sm text-gray-500">Thông báo khi có tin nhắn mới</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.teacher_message}
                  onChange={(e) => setNotifications({ ...notifications, teacher_message: e.target.checked })}
                  className="w-5 h-5 rounded text-purple-600"
                />
              </label>

              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-800">Nhắc nhở bài tập</p>
                  <p className="text-sm text-gray-500">Thông báo khi bài tập sắp đến hạn</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.assignment_reminder}
                  onChange={(e) => setNotifications({ ...notifications, assignment_reminder: e.target.checked })}
                  className="w-5 h-5 rounded text-purple-600"
                />
              </label>

              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-800">Thành tích của con</p>
                  <p className="text-sm text-gray-500">Thông báo khi con đạt huy hiệu mới</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.achievement}
                  onChange={(e) => setNotifications({ ...notifications, achievement: e.target.checked })}
                  className="w-5 h-5 rounded text-purple-600"
                />
              </label>

              <button
                onClick={handleSaveNotifications}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Lưu cài đặt
              </button>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-5">
              <div className="p-4 bg-yellow-50 rounded-xl">
                <h3 className="font-medium text-yellow-800 mb-1">Đổi mật khẩu</h3>
                <p className="text-sm text-yellow-600">
                  Đảm bảo mật khẩu mạnh để bảo vệ tài khoản.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu hiện tại
                </label>
                <input
                  type="password"
                  value={passwordForm.current}
                  onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  value={passwordForm.new}
                  onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Xác nhận mật khẩu mới
                </label>
                <input
                  type="password"
                  value={passwordForm.confirm}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  placeholder="••••••••"
                />
              </div>

              <button
                onClick={handleChangePassword}
                disabled={saving || !passwordForm.current || !passwordForm.new}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
                Đổi mật khẩu
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 py-4 bg-red-50 text-red-500 rounded-xl font-medium hover:bg-red-100 transition-colors"
      >
        <LogOut className="w-5 h-5" />
        Đăng xuất
      </button>

      {/* App Info */}
      <div className="text-center text-sm text-gray-400">
        <p>SchoolHub v4.0.0</p>
        <p>© 2025 SchoolHub. All rights reserved.</p>
      </div>
    </div>
  );
}
