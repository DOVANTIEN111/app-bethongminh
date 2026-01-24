// src/pages/school/SchoolSettingsPage.jsx
// School Settings Page
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Settings, User, Lock, Bell, Save, Loader2 } from 'lucide-react';

export default function SchoolSettingsPage() {
  const { profile, updateProfile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
  });

  const handleSave = async () => {
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

  const tabs = [
    { id: 'profile', label: 'Thong tin ca nhan', icon: User },
    { id: 'security', label: 'Bao mat', icon: Lock },
    { id: 'notifications', label: 'Thong bao', icon: Bell },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
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
                onClick={handleSave}
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
                  <p><span className="text-gray-500">Role:</span> <strong>{profile?.role}</strong></p>
                  <p><span className="text-gray-500">School ID:</span> <strong>{profile?.school_id || 'Chua gan'}</strong></p>
                  <p><span className="text-gray-500">Trang thai:</span> <strong className="text-green-600">{profile?.is_active ? 'Hoat dong' : 'Khong hoat dong'}</strong></p>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-4 max-w-md">
              <p className="text-gray-500">Chuc nang thong bao dang duoc phat trien.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
