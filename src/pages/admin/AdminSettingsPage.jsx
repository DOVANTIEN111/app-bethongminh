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
      alert('Da luu thay doi!');
    } catch (err) {
      alert('Co loi xay ra: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSystem = async () => {
    setSaving(true);
    try {
      // In real app, save to database or settings table
      await new Promise(resolve => setTimeout(resolve, 500));
      alert('Da luu cai dat he thong!');
    } catch (err) {
      alert('Co loi xay ra: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Thong tin ca nhan', icon: User },
    { id: 'system', label: 'Cai dat he thong', icon: Settings },
    { id: 'security', label: 'Bao mat', icon: Shield },
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
                  Ho va ten
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
                  So dien thoai
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
                Luu thay doi
              </button>
            </div>
          )}

          {/* System Tab */}
          {activeTab === 'system' && (
            <div className="space-y-6 max-w-md">
              <div className="p-4 bg-blue-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="w-5 h-5 text-blue-600" />
                  <h3 className="font-medium text-blue-800">Cai dat he thong</h3>
                </div>
                <p className="text-sm text-blue-600">
                  Cac cai dat nay anh huong den toan bo he thong.
                </p>
              </div>

              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-700">Che do bao tri</p>
                    <p className="text-sm text-gray-500">Tat ca nguoi dung se khong the dang nhap</p>
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
                    <p className="font-medium text-gray-700">Cho phep dang ky</p>
                    <p className="text-sm text-gray-500">Nguoi dung moi co the tu dang ky tai khoan</p>
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
                    <p className="font-medium text-gray-700">Xac thuc email</p>
                    <p className="text-sm text-gray-500">Yeu cau xac thuc email truoc khi dang nhap</p>
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
                    So hoc sinh toi da moi lop
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
                Luu cai dat
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
                  <p><span className="text-gray-500">Role:</span> <strong className="text-red-600">{profile?.role}</strong></p>
                  <p><span className="text-gray-500">ID:</span> <strong>{profile?.id}</strong></p>
                  <p><span className="text-gray-500">Trang thai:</span> <strong className="text-green-600">{profile?.is_active ? 'Hoat dong' : 'Khong hoat dong'}</strong></p>
                  <p><span className="text-gray-500">Tao luc:</span> <strong>{new Date(profile?.created_at).toLocaleString('vi-VN')}</strong></p>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-4 max-w-md">
              <p className="text-gray-500">Chuc nang cai dat thong bao dang duoc phat trien.</p>

              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-700">Thong bao email</p>
                    <p className="text-sm text-gray-500">Nhan thong bao qua email</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 rounded text-blue-600"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-700">Thong bao truong moi</p>
                    <p className="text-sm text-gray-500">Khi co truong hoc moi dang ky</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 rounded text-blue-600"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-700">Bao cao hang tuan</p>
                    <p className="text-sm text-gray-500">Nhan bao cao thong ke moi tuan</p>
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
