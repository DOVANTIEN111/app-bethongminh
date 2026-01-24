// src/pages/teacher/TeacherSettingsPage.jsx
// Teacher Settings Page
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Settings, User, Lock, Bell, Save, Loader2 } from 'lucide-react';

export default function TeacherSettingsPage() {
  const { profile, updateProfile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    new_submission: true,
    parent_message: true,
    system_update: true,
    daily_summary: false,
  });

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await updateProfile(formData);
      alert('Da luu thay doi!');
    } catch (err) {
      alert('Co loi xay ra: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    setSaving(true);
    try {
      // In real app, save to database
      await new Promise(resolve => setTimeout(resolve, 500));
      alert('Da luu cai dat thong bao!');
    } catch (err) {
      alert('Co loi xay ra: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Thong tin ca nhan', icon: User },
    { id: 'security', label: 'Bao mat', icon: Lock },
    { id: 'notifications', label: 'Thong bao', icon: Bell },
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
                  ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50'
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
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="" className="w-20 h-20 rounded-full" />
                  ) : (
                    <span className="text-3xl">👨‍🏫</span>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{profile?.full_name}</h3>
                  <p className="text-sm text-gray-500">Giao vien</p>
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
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ho va ten
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  So dien thoai
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0912345678"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Luu thay doi
              </button>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6 max-w-md">
              <div className="p-4 bg-yellow-50 rounded-xl">
                <h3 className="font-medium text-yellow-800 mb-2">Doi mat khau</h3>
                <p className="text-sm text-yellow-600 mb-4">
                  De doi mat khau, vui long dang xuat va su dung chuc nang "Quen mat khau" tren trang dang nhap.
                </p>
                <button
                  onClick={signOut}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700"
                >
                  Dang xuat
                </button>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-medium text-gray-800 mb-2">Thong tin tai khoan</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500">Role:</span> <strong className="text-emerald-600">{profile?.role}</strong></p>
                  <p><span className="text-gray-500">School ID:</span> <strong>{profile?.school_id || 'Chua gan'}</strong></p>
                  <p><span className="text-gray-500">Department ID:</span> <strong>{profile?.department_id || 'Chua gan'}</strong></p>
                  <p><span className="text-gray-500">Trang thai:</span> <strong className="text-green-600">{profile?.is_active ? 'Hoat dong' : 'Khong hoat dong'}</strong></p>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-4 max-w-md">
              <p className="text-gray-600 mb-4">Quan ly cai dat thong bao cua ban.</p>

              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-700">Bai nop moi</p>
                    <p className="text-sm text-gray-500">Thong bao khi hoc sinh nop bai</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.new_submission}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, new_submission: e.target.checked })}
                    className="w-5 h-5 rounded text-emerald-600"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-700">Tin nhan phu huynh</p>
                    <p className="text-sm text-gray-500">Thong bao khi nhan tin nhan moi</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.parent_message}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, parent_message: e.target.checked })}
                    className="w-5 h-5 rounded text-emerald-600"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-700">Cap nhat he thong</p>
                    <p className="text-sm text-gray-500">Thong bao ve cac cap nhat moi</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.system_update}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, system_update: e.target.checked })}
                    className="w-5 h-5 rounded text-emerald-600"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-700">Tong hop hang ngay</p>
                    <p className="text-sm text-gray-500">Nhan email tong hop hoat dong moi ngay</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.daily_summary}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, daily_summary: e.target.checked })}
                    className="w-5 h-5 rounded text-emerald-600"
                  />
                </label>
              </div>

              <button
                onClick={handleSaveNotifications}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Luu cai dat
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
