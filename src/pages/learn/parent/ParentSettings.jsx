// src/pages/learn/parent/ParentSettings.jsx
// Trang cài đặt cho Phụ huynh
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../lib/supabase';
import {
  Settings, Key, User, Phone, Bell, Clock, Shield,
  Save, Eye, EyeOff, AlertCircle, Check, ChevronRight
} from 'lucide-react';

export default function ParentSettings() {
  const { profile, refreshProfile } = useAuth();
  const [activeSection, setActiveSection] = useState('info');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Parent info state
  const [parentInfo, setParentInfo] = useState({
    parent_name: '',
    parent_phone: '',
  });

  // PIN change state
  const [pinData, setPinData] = useState({
    currentPin: '',
    newPin: '',
    confirmPin: '',
  });
  const [showPins, setShowPins] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Time limit state
  const [timeLimits, setTimeLimits] = useState({
    study_time_limit: 0,
    play_time_limit: 0,
  });

  // Notification state
  const [notifications, setNotifications] = useState({
    parent_notifications: true,
  });

  useEffect(() => {
    if (profile) {
      setParentInfo({
        parent_name: profile.parent_name || '',
        parent_phone: profile.parent_phone || '',
      });
      setTimeLimits({
        study_time_limit: profile.study_time_limit || 0,
        play_time_limit: profile.play_time_limit || 0,
      });
      setNotifications({
        parent_notifications: profile.parent_notifications !== false,
      });
    }
  }, [profile]);

  const handleSaveInfo = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          parent_name: parentInfo.parent_name.trim() || null,
          parent_phone: parentInfo.parent_phone.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      setSuccess('Đã lưu thông tin phụ huynh');
      if (refreshProfile) refreshProfile();
    } catch (err) {
      console.error('Save info error:', err);
      setError('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePin = async () => {
    setError('');
    setSuccess('');

    // Validate
    if (!pinData.currentPin || pinData.currentPin.length !== 4) {
      setError('Vui lòng nhập PIN hiện tại (4 số)');
      return;
    }
    if (!pinData.newPin || pinData.newPin.length !== 4) {
      setError('Vui lòng nhập PIN mới (4 số)');
      return;
    }
    if (pinData.newPin !== pinData.confirmPin) {
      setError('PIN xác nhận không khớp');
      return;
    }
    if (!/^\d{4}$/.test(pinData.newPin)) {
      setError('PIN phải là 4 chữ số');
      return;
    }

    setSaving(true);
    try {
      // Verify current PIN
      const currentHash = btoa(pinData.currentPin + '_schoolhub_salt');
      const { data } = await supabase
        .from('profiles')
        .select('parent_pin')
        .eq('id', profile.id)
        .single();

      if (data?.parent_pin !== currentHash) {
        setError('PIN hiện tại không đúng');
        setSaving(false);
        return;
      }

      // Update new PIN
      const newHash = btoa(pinData.newPin + '_schoolhub_salt');
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          parent_pin: newHash,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      setSuccess('Đã đổi PIN thành công');
      setPinData({ currentPin: '', newPin: '', confirmPin: '' });
    } catch (err) {
      console.error('Change PIN error:', err);
      setError('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveTimeLimits = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          study_time_limit: timeLimits.study_time_limit,
          play_time_limit: timeLimits.play_time_limit,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      setSuccess('Đã lưu giới hạn thời gian');
      if (refreshProfile) refreshProfile();
    } catch (err) {
      console.error('Save time limits error:', err);
      setError('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          parent_notifications: notifications.parent_notifications,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      setSuccess('Đã lưu cài đặt thông báo');
      if (refreshProfile) refreshProfile();
    } catch (err) {
      console.error('Save notifications error:', err);
      setError('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setSaving(false);
    }
  };

  const sections = [
    { id: 'info', label: 'Thông tin', icon: User },
    { id: 'pin', label: 'Đổi PIN', icon: Key },
    { id: 'time', label: 'Giới hạn thời gian', icon: Clock },
    { id: 'notifications', label: 'Thông báo', icon: Bell },
  ];

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h1 className="text-lg font-bold text-gray-800 mb-1">Cài đặt</h1>
        <p className="text-sm text-gray-500">Quản lý thông tin và quyền kiểm soát</p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm">{error}</span>
        </div>
      )}
      {success && (
        <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl flex items-center gap-2">
          <Check className="w-5 h-5" />
          <span className="text-sm">{success}</span>
        </div>
      )}

      {/* Section Navigation */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {sections.map((section, index) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`w-full flex items-center justify-between px-4 py-3 ${
              index !== sections.length - 1 ? 'border-b border-gray-100' : ''
            } ${activeSection === section.id ? 'bg-indigo-50' : 'hover:bg-gray-50'}`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                activeSection === section.id ? 'bg-indigo-100' : 'bg-gray-100'
              }`}>
                <section.icon className={`w-5 h-5 ${
                  activeSection === section.id ? 'text-indigo-600' : 'text-gray-500'
                }`} />
              </div>
              <span className={`font-medium ${
                activeSection === section.id ? 'text-indigo-700' : 'text-gray-700'
              }`}>
                {section.label}
              </span>
            </div>
            <ChevronRight className={`w-5 h-5 ${
              activeSection === section.id ? 'text-indigo-600' : 'text-gray-400'
            }`} />
          </button>
        ))}
      </div>

      {/* Section Content */}
      {activeSection === 'info' && (
        <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
          <h2 className="font-medium text-gray-800">Thông tin phụ huynh</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Họ và tên
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={parentInfo.parent_name}
                onChange={(e) => setParentInfo({ ...parentInfo, parent_name: e.target.value })}
                placeholder="Nguyễn Văn A"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số điện thoại
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                value={parentInfo.parent_phone}
                onChange={(e) => setParentInfo({ ...parentInfo, parent_phone: e.target.value })}
                placeholder="0901234567"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            onClick={handleSaveInfo}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Đang lưu...' : 'Lưu thông tin'}
          </button>
        </div>
      )}

      {activeSection === 'pin' && (
        <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
          <h2 className="font-medium text-gray-800">Đổi mã PIN</h2>
          <p className="text-sm text-gray-500">PIN dùng để truy cập khu vực Phụ huynh</p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              PIN hiện tại
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPins.current ? 'text' : 'password'}
                value={pinData.currentPin}
                onChange={(e) => setPinData({ ...pinData, currentPin: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                placeholder="****"
                maxLength={4}
                className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPins({ ...showPins, current: !showPins.current })}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPins.current ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              PIN mới
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPins.new ? 'text' : 'password'}
                value={pinData.newPin}
                onChange={(e) => setPinData({ ...pinData, newPin: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                placeholder="****"
                maxLength={4}
                className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPins({ ...showPins, new: !showPins.new })}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPins.new ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Xác nhận PIN mới
            </label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPins.confirm ? 'text' : 'password'}
                value={pinData.confirmPin}
                onChange={(e) => setPinData({ ...pinData, confirmPin: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                placeholder="****"
                maxLength={4}
                className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPins({ ...showPins, confirm: !showPins.confirm })}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPins.confirm ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
              </button>
            </div>
          </div>

          <button
            onClick={handleChangePin}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50"
          >
            <Key className="w-5 h-5" />
            {saving ? 'Đang xử lý...' : 'Đổi PIN'}
          </button>
        </div>
      )}

      {activeSection === 'time' && (
        <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
          <h2 className="font-medium text-gray-800">Giới hạn thời gian</h2>
          <p className="text-sm text-gray-500">Đặt giới hạn thời gian học và chơi game mỗi ngày cho bé</p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thời gian học tối đa (phút/ngày)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="180"
                step="15"
                value={timeLimits.study_time_limit}
                onChange={(e) => setTimeLimits({ ...timeLimits, study_time_limit: parseInt(e.target.value) })}
                className="flex-1"
              />
              <span className="w-16 text-center font-medium text-indigo-600">
                {timeLimits.study_time_limit === 0 ? 'Không giới hạn' : `${timeLimits.study_time_limit}p`}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thời gian chơi game tối đa (phút/ngày)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="120"
                step="15"
                value={timeLimits.play_time_limit}
                onChange={(e) => setTimeLimits({ ...timeLimits, play_time_limit: parseInt(e.target.value) })}
                className="flex-1"
              />
              <span className="w-16 text-center font-medium text-indigo-600">
                {timeLimits.play_time_limit === 0 ? 'Không giới hạn' : `${timeLimits.play_time_limit}p`}
              </span>
            </div>
          </div>

          <div className="bg-amber-50 p-3 rounded-lg">
            <p className="text-sm text-amber-700">
              <strong>Lưu ý:</strong> Đặt 0 nghĩa là không giới hạn thời gian
            </p>
          </div>

          <button
            onClick={handleSaveTimeLimits}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Đang lưu...' : 'Lưu giới hạn'}
          </button>
        </div>
      )}

      {activeSection === 'notifications' && (
        <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
          <h2 className="font-medium text-gray-800">Cài đặt thông báo</h2>

          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-800">Nhận thông báo</p>
              <p className="text-sm text-gray-500">Thông báo về hoạt động học tập của bé</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.parent_notifications}
                onChange={(e) => setNotifications({ ...notifications, parent_notifications: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <button
            onClick={handleSaveNotifications}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
          </button>
        </div>
      )}
    </div>
  );
}
