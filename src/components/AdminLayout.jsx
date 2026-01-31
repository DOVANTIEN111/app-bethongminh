// src/components/AdminLayout.jsx
// Admin Layout with Sidebar Navigation
import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard, School, Users, CreditCard, BarChart3,
  Settings, LogOut, Menu, X, Shield, ChevronDown, ChevronRight,
  BookOpen, FileText, Languages, HelpCircle, FolderOpen,
  DollarSign, Receipt, Gift, Bell, TrendingUp, ClipboardList
} from 'lucide-react';

const MENU_ITEMS = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { path: '/admin/schools', icon: School, label: 'Trường học' },
  { path: '/admin/users', icon: Users, label: 'Người dùng' },
  { path: '/admin/plans', icon: CreditCard, label: 'Gói cước' },
  { path: '/admin/statistics', icon: BarChart3, label: 'Thống kê' },
];

const CONTENT_MENU_ITEMS = [
  { path: '/admin/subjects', icon: BookOpen, label: 'Môn học' },
  { path: '/admin/lessons', icon: FileText, label: 'Bài học' },
  { path: '/admin/vocabulary', icon: Languages, label: 'Từ vựng' },
  { path: '/admin/questions', icon: HelpCircle, label: 'Câu hỏi Quiz' },
  { path: '/admin/media', icon: FolderOpen, label: 'Thư viện Media' },
];

const FINANCE_MENU_ITEMS = [
  { path: '/admin/finance', icon: DollarSign, label: 'Tổng quan' },
  { path: '/admin/transactions', icon: Receipt, label: 'Giao dịch' },
  { path: '/admin/promotions', icon: Gift, label: 'Khuyến mãi' },
];

export default function AdminLayout() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [contentMenuOpen, setContentMenuOpen] = useState(
    CONTENT_MENU_ITEMS.some(item => location.pathname.startsWith(item.path))
  );
  const [financeMenuOpen, setFinanceMenuOpen] = useState(
    FINANCE_MENU_ITEMS.some(item => location.pathname.startsWith(item.path))
  );

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const isContentActive = CONTENT_MENU_ITEMS.some(item =>
    location.pathname.startsWith(item.path)
  );

  const isFinanceActive = FINANCE_MENU_ITEMS.some(item =>
    location.pathname.startsWith(item.path)
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-blue-900 text-white transform transition-transform lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-blue-800">
          <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Admin Panel</h1>
            <p className="text-xs text-blue-300">Quản lý hệ thống</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden p-1 hover:bg-blue-800 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-1 max-h-[calc(100vh-220px)] overflow-y-auto">
          {/* Main menu items */}
          {MENU_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-blue-700 text-white'
                    : 'text-blue-200 hover:bg-blue-800 hover:text-white'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}

          {/* Content Management Section */}
          <div className="pt-2">
            <button
              onClick={() => setContentMenuOpen(!contentMenuOpen)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isContentActive
                  ? 'bg-blue-700 text-white'
                  : 'text-blue-200 hover:bg-blue-800 hover:text-white'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span className="font-medium flex-1 text-left">Nội dung</span>
              {contentMenuOpen ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>

            {/* Submenu */}
            {contentMenuOpen && (
              <div className="mt-1 ml-4 space-y-1">
                {CONTENT_MENU_ITEMS.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors ${
                        isActive
                          ? 'bg-blue-700/50 text-white'
                          : 'text-blue-300 hover:bg-blue-800/50 hover:text-white'
                      }`
                    }
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="text-sm">{item.label}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {/* Finance Management Section */}
          <div className="pt-2">
            <button
              onClick={() => setFinanceMenuOpen(!financeMenuOpen)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isFinanceActive
                  ? 'bg-blue-700 text-white'
                  : 'text-blue-200 hover:bg-blue-800 hover:text-white'
              }`}
            >
              <DollarSign className="w-5 h-5" />
              <span className="font-medium flex-1 text-left">Tài chính</span>
              {financeMenuOpen ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>

            {/* Finance Submenu */}
            {financeMenuOpen && (
              <div className="mt-1 ml-4 space-y-1">
                {FINANCE_MENU_ITEMS.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors ${
                        isActive
                          ? 'bg-blue-700/50 text-white'
                          : 'text-blue-300 hover:bg-blue-800/50 hover:text-white'
                      }`
                    }
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="text-sm">{item.label}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {/* Notifications */}
          <NavLink
            to="/admin/notifications"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive
                  ? 'bg-blue-700 text-white'
                  : 'text-blue-200 hover:bg-blue-800 hover:text-white'
              }`
            }
          >
            <Bell className="w-5 h-5" />
            <span className="font-medium">Thông báo</span>
          </NavLink>

          {/* Analytics */}
          <NavLink
            to="/admin/analytics"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive
                  ? 'bg-blue-700 text-white'
                  : 'text-blue-200 hover:bg-blue-800 hover:text-white'
              }`
            }
          >
            <TrendingUp className="w-5 h-5" />
            <span className="font-medium">Phân tích</span>
          </NavLink>

          {/* Reports */}
          <NavLink
            to="/admin/reports"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive
                  ? 'bg-blue-700 text-white'
                  : 'text-blue-200 hover:bg-blue-800 hover:text-white'
              }`
            }
          >
            <ClipboardList className="w-5 h-5" />
            <span className="font-medium">Báo cáo</span>
          </NavLink>

          {/* Video Topics */}
          <NavLink
            to="/admin/video-topics"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive
                  ? 'bg-blue-700 text-white'
                  : 'text-blue-200 hover:bg-blue-800 hover:text-white'
              }`
            }
          >
            <span className="text-lg">📁</span>
            <span className="font-medium">Chủ đề Video</span>
          </NavLink>

          {/* Video YouTube */}
          <NavLink
            to="/admin/videos"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive
                  ? 'bg-blue-700 text-white'
                  : 'text-blue-200 hover:bg-blue-800 hover:text-white'
              }`
            }
          >
            <span className="text-lg">🎬</span>
            <span className="font-medium">Video YouTube</span>
          </NavLink>

          {/* Settings */}
          <NavLink
            to="/admin/settings"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive
                  ? 'bg-blue-700 text-white'
                  : 'text-blue-200 hover:bg-blue-800 hover:text-white'
              }`
            }
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Cài đặt</span>
          </NavLink>
        </nav>

        {/* User info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-800 bg-blue-900">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-10 h-10 rounded-full" />
              ) : (
                <span className="text-lg">👤</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{profile?.full_name || 'Admin'}</p>
              <p className="text-xs text-blue-300 truncate">{profile?.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-800 hover:bg-blue-700 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white shadow-sm">
          <div className="flex items-center gap-4 px-4 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-800">Super Admin</h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-10 h-10 rounded-full" />
                ) : (
                  <Shield className="w-5 h-5 text-blue-600" />
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
