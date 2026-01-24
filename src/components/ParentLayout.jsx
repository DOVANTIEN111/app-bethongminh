// src/components/ParentLayout.jsx
// Layout for Parent Pages
import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, Users, MessageSquare, BarChart3, Settings, Bell } from 'lucide-react';

const MENU_ITEMS = [
  { path: '/parent', icon: Home, label: 'Trang chủ', exact: true },
  { path: '/parent/children', icon: Users, label: 'Con của tôi' },
  { path: '/parent/messages', icon: MessageSquare, label: 'Tin nhắn' },
  { path: '/parent/reports', icon: BarChart3, label: 'Báo cáo' },
  { path: '/parent/settings', icon: Settings, label: 'Cài đặt' },
];

export default function ParentLayout() {
  const { profile } = useAuth();
  const location = useLocation();

  const firstName = profile?.full_name?.split(' ').slice(-1)[0] || 'Phụ huynh';

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-blue-50 to-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Avatar & Name */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center shadow-md border-2 border-white/30">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-12 h-12 rounded-full" />
                ) : (
                  <span className="text-2xl">👨‍👩‍👧</span>
                )}
              </div>
              <div>
                <p className="font-bold text-lg">Xin chào, {firstName}!</p>
                <p className="text-sm text-white/80">Chào mừng trở lại</p>
              </div>
            </div>

            {/* Notifications */}
            <button className="relative p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold">
                3
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-24 min-h-[calc(100vh-140px)]">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-purple-100 shadow-lg z-50">
        <div className="flex justify-around items-center py-2">
          {MENU_ITEMS.map((item) => {
            const isActive = item.exact
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path) && location.pathname !== '/parent';

            // Special case for /parent exact match
            const isExactParent = item.path === '/parent' && location.pathname === '/parent';
            const finalActive = item.exact ? isExactParent : isActive;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-200 ${
                  finalActive
                    ? 'bg-gradient-to-t from-purple-100 to-blue-50'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <div className={`p-2 rounded-full ${
                  finalActive
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                    : ''
                }`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <span className={`text-xs mt-1 font-medium ${
                  finalActive ? 'text-purple-600' : 'text-gray-400'
                }`}>
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
