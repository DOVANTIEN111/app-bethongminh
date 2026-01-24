// src/pages/learn/LearnProfilePage.jsx
// Student Profile Page - Kid-friendly design
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  User, Settings, Volume2, VolumeX, Bell, BellOff,
  Lock, LogOut, Star, BookOpen, Clock, Trophy,
  ChevronRight, Moon, Sun, Palette
} from 'lucide-react';

const AVATARS = ['🧒', '👦', '👧', '🧒🏻', '👦🏻', '👧🏻', '🧒🏽', '👦🏽', '👧🏽', '🦸', '🦸‍♀️', '🧙', '🧚', '🦊', '🐻', '🐰', '🐱', '🦁'];

export default function LearnProfilePage() {
  const { profile, signOut } = useAuth();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('🧒');
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const firstName = profile?.full_name?.split(' ').pop() || 'Bé';

  // Mock stats
  const stats = {
    totalPoints: 1250,
    lessonsCompleted: 24,
    totalTime: 35,
    streak: 7
  };

  const handleLogout = () => {
    if (confirm('Bạn có chắc muốn đăng xuất không?')) {
      signOut();
    }
  };

  return (
    <div className="p-4 space-y-4 pb-28">
      {/* Profile Card */}
      <div className="bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-3xl p-6 text-white shadow-xl">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <button
            onClick={() => setShowAvatarModal(true)}
            className="relative"
          >
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl shadow-lg border-4 border-white">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-20 h-20 rounded-full" />
              ) : (
                selectedAvatar
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-yellow-400 rounded-full flex items-center justify-center shadow">
              <Palette className="w-4 h-4 text-white" />
            </div>
          </button>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{profile?.full_name}</h1>
            <p className="text-white/80">Lớp {profile?.class?.name || '3A'}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm flex items-center gap-1">
                <Star className="w-4 h-4" /> {stats.totalPoints} điểm
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-white rounded-2xl p-3 text-center shadow">
          <Star className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
          <p className="text-lg font-bold text-gray-800">{stats.totalPoints}</p>
          <p className="text-xs text-gray-500">Điểm</p>
        </div>
        <div className="bg-white rounded-2xl p-3 text-center shadow">
          <BookOpen className="w-6 h-6 text-blue-500 mx-auto mb-1" />
          <p className="text-lg font-bold text-gray-800">{stats.lessonsCompleted}</p>
          <p className="text-xs text-gray-500">Bài học</p>
        </div>
        <div className="bg-white rounded-2xl p-3 text-center shadow">
          <Clock className="w-6 h-6 text-green-500 mx-auto mb-1" />
          <p className="text-lg font-bold text-gray-800">{stats.totalTime}h</p>
          <p className="text-xs text-gray-500">Thời gian</p>
        </div>
        <div className="bg-white rounded-2xl p-3 text-center shadow">
          <Trophy className="w-6 h-6 text-orange-500 mx-auto mb-1" />
          <p className="text-lg font-bold text-gray-800">{stats.streak}</p>
          <p className="text-xs text-gray-500">Ngày</p>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <Settings className="w-5 h-5 text-gray-400" />
            Cài đặt
          </h2>
        </div>

        {/* Sound Toggle */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              soundEnabled ? 'bg-blue-100' : 'bg-gray-100'
            }`}>
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-blue-500" />
              ) : (
                <VolumeX className="w-5 h-5 text-gray-400" />
              )}
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-800">Âm thanh</p>
              <p className="text-sm text-gray-500">
                {soundEnabled ? 'Đang bật' : 'Đang tắt'}
              </p>
            </div>
          </div>
          <div className={`w-12 h-7 rounded-full transition-colors ${
            soundEnabled ? 'bg-blue-500' : 'bg-gray-200'
          }`}>
            <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform mt-1 ${
              soundEnabled ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </div>
        </button>

        {/* Notifications Toggle */}
        <button
          onClick={() => setNotificationsEnabled(!notificationsEnabled)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-t border-gray-100"
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              notificationsEnabled ? 'bg-orange-100' : 'bg-gray-100'
            }`}>
              {notificationsEnabled ? (
                <Bell className="w-5 h-5 text-orange-500" />
              ) : (
                <BellOff className="w-5 h-5 text-gray-400" />
              )}
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-800">Thông báo</p>
              <p className="text-sm text-gray-500">
                {notificationsEnabled ? 'Đang bật' : 'Đang tắt'}
              </p>
            </div>
          </div>
          <div className={`w-12 h-7 rounded-full transition-colors ${
            notificationsEnabled ? 'bg-orange-500' : 'bg-gray-200'
          }`}>
            <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform mt-1 ${
              notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </div>
        </button>

        {/* Change Password */}
        <button
          onClick={() => setShowPasswordModal(true)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-t border-gray-100"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Lock className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-800">Đổi mật khẩu</p>
              <p className="text-sm text-gray-500">Bảo mật tài khoản</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Account Section */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <User className="w-5 h-5 text-gray-400" />
            Tài khoản
          </h2>
        </div>

        <div className="p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Email</span>
            <span className="text-gray-800">{profile?.email || 'chua.cap.nhat@email.com'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Lớp</span>
            <span className="text-gray-800">{profile?.class?.name || 'Lớp 3A'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Trường</span>
            <span className="text-gray-800">{profile?.school?.name || 'Trường Tiểu học ABC'}</span>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full bg-red-50 text-red-500 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
      >
        <LogOut className="w-5 h-5" />
        Đăng xuất
      </button>

      {/* Avatar Selection Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 text-center mb-4">
              Chọn avatar của bạn
            </h2>

            <div className="grid grid-cols-6 gap-3 mb-6">
              {AVATARS.map((avatar, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`w-12 h-12 text-2xl rounded-full flex items-center justify-center transition-all ${
                    selectedAvatar === avatar
                      ? 'bg-gradient-to-r from-blue-400 to-purple-400 scale-110 shadow-lg'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowAvatarModal(false)}
                className="flex-1 py-3 bg-gray-100 rounded-xl font-medium text-gray-600"
              >
                Hủy
              </button>
              <button
                onClick={() => setShowAvatarModal(false)}
                className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 text-center mb-4">
              Đổi mật khẩu
            </h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu hiện tại
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Xác nhận mật khẩu mới
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 py-3 bg-gray-100 rounded-xl font-medium text-gray-600"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  alert('Đã đổi mật khẩu thành công!');
                  setShowPasswordModal(false);
                }}
                className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
