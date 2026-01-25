// src/pages/SettingsPage.jsx
// Trang cài đặt - v3.5.0
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useAudio } from '../contexts/AudioContext';
import { useTheme } from '../contexts/ThemeContext';
import ConfirmDialog from '../components/ConfirmDialog';
import NotificationSettings from '../components/NotificationSettings';
import {
  Volume2, VolumeX, Music, Download, Trash2, Shield,
  ChevronRight, Smartphone, CreditCard, LogOut,
  HelpCircle, MessageCircle, Star, Heart, Bell, Moon
} from 'lucide-react';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { signOut, account, subscription, planInfo } = useAuth();
  const { soundEnabled, musicEnabled, toggleSound, toggleMusic, playSound } = useAudio();
  const { isDark, toggleTheme } = useTheme();
  
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  
  const [showNotifications, setShowNotifications] = useState(false);

  // Settings sections
  const sections = [
    {
      title: 'Âm thanh',
      items: [
        {
          icon: soundEnabled ? Volume2 : VolumeX,
          iconColor: soundEnabled ? 'text-indigo-500' : 'text-gray-400',
          label: 'Hiệu ứng âm thanh',
          description: soundEnabled ? 'Đang bật' : 'Đang tắt',
          toggle: true,
          value: soundEnabled,
          onChange: () => {
            toggleSound();
            playSound('click');
          }
        },
        {
          icon: Music,
          iconColor: musicEnabled ? 'text-pink-500' : 'text-gray-400',
          label: 'Nhạc nền',
          description: musicEnabled ? 'Đang bật' : 'Đang tắt',
          toggle: true,
          value: musicEnabled,
          onChange: toggleMusic
        }
      ]
    },
    {
      title: 'Giao diện',
      items: [
        {
          icon: Moon,
          iconColor: isDark ? 'text-indigo-400' : 'text-gray-400',
          label: 'Chế độ tối',
          description: isDark ? 'Đang bật' : 'Đang tắt',
          toggle: true,
          value: isDark,
          onChange: () => {
            toggleTheme();
            playSound('click');
          }
        }
      ]
    },
    {
      title: 'Thông báo',
      items: [
        {
          icon: Bell,
          iconColor: 'text-blue-500',
          label: 'Cài đặt thông báo',
          description: 'Nhắc học tập, thành tích',
          onClick: () => setShowNotifications(!showNotifications),
          expanded: showNotifications,
          expandedContent: <NotificationSettings />
        }
      ]
    },
    {
      title: 'Tài khoản',
      items: [
        {
          icon: Smartphone,
          iconColor: 'text-blue-500',
          label: 'Quản lý thiết bị',
          description: `${planInfo?.maxDevices || 1} thiết bị`,
          onClick: () => navigate('/parent'),
        },
        {
          icon: CreditCard,
          iconColor: 'text-green-500',
          label: 'Gói đăng ký',
          description: planInfo?.name || 'Miễn phí',
          badge: subscription?.plan === 'family' ? 'PRO' : null,
          onClick: () => navigate('/parent'),
        },
        {
          icon: Shield,
          iconColor: 'text-purple-500',
          label: 'Khu vực phụ huynh',
          description: 'Quản lý, báo cáo',
          onClick: () => navigate('/parent'),
        }
      ]
    },
    {
      title: 'Dữ liệu',
      items: [
        {
          icon: Download,
          iconColor: 'text-cyan-500',
          label: 'Xuất dữ liệu',
          description: 'Tải file backup',
          onClick: handleExport,
        },
        {
          icon: Trash2,
          iconColor: 'text-red-500',
          label: 'Xóa dữ liệu local',
          description: 'Xóa cache trên thiết bị này',
          danger: true,
          onClick: () => setShowClearDialog(true),
        }
      ]
    },
    {
      title: 'Hỗ trợ',
      items: [
        {
          icon: HelpCircle,
          iconColor: 'text-amber-500',
          label: 'Hướng dẫn sử dụng',
          description: 'Xem cách dùng app',
          onClick: () => {
            localStorage.removeItem('schoolhub_onboarding_seen');
            navigate('/auth');
          },
        },
        {
          icon: MessageCircle,
          iconColor: 'text-green-500',
          label: 'Liên hệ hỗ trợ',
          description: 'Gửi phản hồi',
          onClick: () => window.open('mailto:support@schoolhub.app'),
        },
        {
          icon: Star,
          iconColor: 'text-yellow-500',
          label: 'Đánh giá app',
          description: 'Cho chúng tôi 5 sao nhé!',
          onClick: () => alert('Cảm ơn bạn! ⭐⭐⭐⭐⭐'),
        }
      ]
    }
  ];

  function handleExport() {
    try {
      // Collect all relevant localStorage data
      const data = {
        exportDate: new Date().toISOString(),
        appVersion: '3.5.0',
        settings: {
          soundEnabled: localStorage.getItem('soundEnabled'),
          musicEnabled: localStorage.getItem('musicEnabled'),
        }
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `schoolhub_backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      playSound('complete');
    } catch (error) {
      console.error('Export error:', error);
      alert('Không thể xuất dữ liệu');
    }
  }

  function handleClearData() {
    // Only clear local cache, not account data
    const keysToKeep = ['schoolhub_device_id'];
    const savedValues = {};
    
    keysToKeep.forEach(key => {
      savedValues[key] = localStorage.getItem(key);
    });
    
    localStorage.clear();
    
    keysToKeep.forEach(key => {
      if (savedValues[key]) {
        localStorage.setItem(key, savedValues[key]);
      }
    });
    
    window.location.reload();
  }

  function handleLogout() {
    signOut();
    navigate('/auth');
  }
  
  return (
    <div className="px-4 py-4 pb-8 dark:text-gray-100">
      {/* Account Info Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-5 mb-6 text-white"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">
            👤
          </div>
          <div className="flex-1">
            <p className="font-bold text-lg">{account?.parent_name || 'Phụ huynh'}</p>
            <p className="text-white/80 text-sm">{account?.email || ''}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                subscription?.plan === 'family' 
                  ? 'bg-amber-400 text-amber-900' 
                  : subscription?.plan === 'plus'
                    ? 'bg-blue-400 text-blue-900'
                    : 'bg-white/20 text-white'
              }`}>
                {planInfo?.name || 'Free'}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Settings Sections */}
      {sections.map((section, sectionIndex) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: sectionIndex * 0.1 }}
          className="mb-6"
        >
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 px-1">
            {section.title}
          </h3>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden">
            {section.items.map((item, itemIndex) => {
              const Icon = item.icon;
              
              return (
                <div key={itemIndex}>
                  {itemIndex > 0 && <div className="h-px bg-gray-100 dark:bg-slate-700 mx-4" />}

                  <button
                    onClick={item.onClick}
                    className={`w-full flex items-center gap-4 p-4 transition-colors ${
                      item.danger ? 'hover:bg-red-50 dark:hover:bg-red-900/20' : 'hover:bg-gray-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      item.danger ? 'bg-red-50 dark:bg-red-900/30' : 'bg-gray-50 dark:bg-slate-700'
                    }`}>
                      <Icon className={`w-5 h-5 ${item.iconColor}`} />
                    </div>

                    <div className="flex-1 text-left">
                      <p className={`font-medium ${item.danger ? 'text-red-600 dark:text-red-400' : 'text-gray-800 dark:text-gray-100'}`}>
                        {item.label}
                      </p>
                      <p className={`text-sm ${item.danger ? 'text-red-400 dark:text-red-300' : 'text-gray-500 dark:text-gray-400'}`}>
                        {item.description}
                      </p>
                    </div>
                    
                    {item.badge && (
                      <span className="px-2 py-1 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-bold rounded-full">
                        {item.badge}
                      </span>
                    )}
                    
                    {item.toggle ? (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          item.onChange();
                        }}
                        className={`w-12 h-7 rounded-full transition-colors cursor-pointer ${
                          item.value ? 'bg-indigo-500' : 'bg-gray-200'
                        }`}
                      >
                        <motion.div
                          animate={{ x: item.value ? 22 : 2 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          className="w-5 h-5 mt-1 bg-white rounded-full shadow"
                        />
                      </div>
                    ) : (
                      <ChevronRight className={`w-5 h-5 text-gray-300 transition-transform ${
                        item.expanded ? 'rotate-90' : ''
                      }`} />
                    )}
                  </button>

                  {/* Expanded content for notifications */}
                  {item.expandedContent && item.expanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-4 pb-4 bg-gray-50"
                    >
                      {item.expandedContent}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      ))}

      {/* Logout Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        onClick={() => setShowLogoutDialog(true)}
        className="w-full flex items-center justify-center gap-2 py-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm text-red-500 dark:text-red-400 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition"
      >
        <LogOut className="w-5 h-5" />
        Đăng xuất
      </motion.button>

      {/* App Info */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center"
      >
        <div className="flex items-center justify-center gap-2 text-gray-400 mb-2">
          <Heart className="w-4 h-4 text-pink-400" />
          <span className="text-sm">Made with love for kids</span>
        </div>
        <p className="text-sm text-gray-400">
          SchoolHub v3.6.0
        </p>
        <p className="text-xs text-gray-300 mt-1">
          © 2024 SchoolHub. All rights reserved.
        </p>
      </motion.div>

      {/* Confirm Dialogs */}
      <ConfirmDialog
        isOpen={showClearDialog}
        onClose={() => setShowClearDialog(false)}
        onConfirm={handleClearData}
        title="Xóa dữ liệu?"
        message="Dữ liệu cache trên thiết bị này sẽ bị xóa. Dữ liệu tài khoản trên server vẫn được giữ nguyên."
        confirmText="Xóa"
        variant="warning"
      />

      <ConfirmDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={handleLogout}
        title="Đăng xuất?"
        message="Bạn sẽ cần đăng nhập lại để tiếp tục sử dụng app."
        confirmText="Đăng xuất"
        variant="danger"
      />
    </div>
  );
}
