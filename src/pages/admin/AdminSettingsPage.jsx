// src/pages/admin/AdminSettingsPage.jsx
// Admin Settings Page
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Settings, User, Shield, Bell, Database, Save, Loader2 } from 'lucide-react';

export default function AdminSettingsPage() {
  const { profile, updateProfile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
  });

  const [systemSettings, setSystemSettings] = useState({
    maintenance_mode: false,
    allow_registration: true,
    require_email_verification: true,
    max_students_per_class: 50,
    default_plan: 'free',
  });

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await updateProfile(formData);
      alert('Đã lưu thay đổi!');
    } catch (err) {
      alert('Có lỗi xảy ra: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSystem = async () => {
    setSaving(true);
    try {
      // In real app, save to database or settings table
      await new Promise(resolve => setTimeout(resolve, 500));
      alert('Đã lưu cài đặt hệ thống!');
    } catch (err) {
      alert('Có lỗi xảy ra: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Thông tin cá nhân', icon: User },
    { id: 'system', label: 'Cài đặt hệ thống', icon: Settings },
    { id: 'security', label: 'Bảo mật', icon: Shield },
    { id: 'notifications', label: 'Thông báo', icon: Bell },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={profile?.email || ''}
                  disabled
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0912345678"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Lưu thay đổi
              </button>
            </div>
          )}

          {/* System Tab */}
          {activeTab === 'system' && (
            <div className="space-y-6 max-w-md">
              <div className="p-4 bg-blue-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="w-5 h-5 text-blue-600" />
                  <h3 className="font-medium text-blue-800">Cài đặt hệ thống</h3>
                </div>
                <p className="text-sm text-blue-600">
                  Các cài đặt này ảnh hưởng đến toàn bộ hệ thống.
                </p>
              </div>

              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-700">Chế độ bảo trì</p>
                    <p className="text-sm text-gray-500">Tất cả người dùng sẽ không thể đăng nhập</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={systemSettings.maintenance_mode}
                    onChange={(e) => setSystemSettings({ ...systemSettings, maintenance_mode: e.target.checked })}
                    className="w-5 h-5 rounded text-blue-600"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-700">Cho phép đăng ký</p>
                    <p className="text-sm text-gray-500">Người dùng mới có thể tự đăng ký tài khoản</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={systemSettings.allow_registration}
                    onChange={(e) => setSystemSettings({ ...systemSettings, allow_registration: e.target.checked })}
                    className="w-5 h-5 rounded text-blue-600"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-700">Xác thực email</p>
                    <p className="text-sm text-gray-500">Yêu cầu xác thực email trước khi đăng nhập</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={systemSettings.require_email_verification}
                    onChange={(e) => setSystemSettings({ ...systemSettings, require_email_verification: e.target.checked })}
                    className="w-5 h-5 rounded text-blue-600"
                  />
                </label>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số học sinh tối đa mỗi lớp
                  </label>
                  <input
                    type="number"
                    value={systemSettings.max_students_per_class}
                    onChange={(e) => setSystemSettings({ ...systemSettings, max_students_per_class: parseInt(e.target.value) })}
                    min="1"
                    max="200"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                onClick={handleSaveSystem}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Lưu cài đặt
              </button>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6 max-w-md">
              <div className="p-4 bg-yellow-50 rounded-xl">
                <h3 className="font-medium text-yellow-800 mb-2">Đổi mật khẩu</h3>
                <p className="text-sm text-yellow-600 mb-4">
                  Để đổi mật khẩu, vui lòng đăng xuất và sử dụng chức năng "Quên mật khẩu" trên trang đăng nhập.
                </p>
                <button
                  onClick={signOut}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700"
                >
                  Đăng xuất
                </button>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-medium text-gray-800 mb-2">Thông tin tài khoản</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500">Role:</span> <strong className="text-red-600">{profile?.role}</strong></p>
                  <p><span className="text-gray-500">ID:</span> <strong>{profile?.id}</strong></p>
                  <p><span className="text-gray-500">Trạng thái:</span> <strong className="text-green-600">{profile?.is_active ? 'Hoạt động' : 'Không hoạt động'}</strong></p>
                  <p><span className="text-gray-500">Tạo lúc:</span> <strong>{new Date(profile?.created_at).toLocaleString('vi-VN')}</strong></p>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-4 max-w-md">
              <p className="text-gray-500">Chức năng cài đặt thông báo đang được phát triển.</p>

              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-700">Thông báo email</p>
                    <p className="text-sm text-gray-500">Nhận thông báo qua email</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 rounded text-blue-600"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-700">Thông báo trường mới</p>
                    <p className="text-sm text-gray-500">Khi có trường học mới đăng ký</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 rounded text-blue-600"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-700">Báo cáo hàng tuần</p>
                    <p className="text-sm text-gray-500">Nhận báo cáo thống kê mỗi tuần</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 rounded text-blue-600"
                  />
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
