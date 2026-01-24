// src/components/LearnLayout.jsx
// Layout for Student Learning Pages - Kid-friendly design
import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, BookOpen, ClipboardList, Trophy, User, Star, Flame } from 'lucide-react';

const MENU_ITEMS = [
  { path: '/learn', icon: Home, label: 'Trang chủ', exact: true },
  { path: '/learn/lessons', icon: BookOpen, label: 'Bài học' },
  { path: '/learn/assignments', icon: ClipboardList, label: 'Bài tập' },
  { path: '/learn/achievements', icon: Trophy, label: 'Thành tích' },
  { path: '/learn/profile', icon: User, label: 'Cá nhân' },
];

export default function LearnLayout() {
  const { profile } = useAuth();
  const location = useLocation();

  // Get first name for display
  const firstName = profile?.full_name?.split(' ').pop() || 'Bé';

  // Mock data - in real app, fetch from database
  const totalPoints = 1250;
  const streak = 7;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-400 via-yellow-400 to-blue-400 text-white shadow-lg sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Avatar & Name */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-white">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-12 h-12 rounded-full" />
                ) : (
                  <span className="text-2xl">🧒</span>
                )}
              </div>
              <div>
                <p className="font-bold text-lg drop-shadow">Chào {firstName}! 👋</p>
                <p className="text-xs text-white/90">Học vui mỗi ngày!</p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3">
              {/* Streak */}
              <div className="flex items-center gap-1 bg-white/20 backdrop-blur rounded-full px-3 py-1.5">
                <Flame className="w-5 h-5 text-orange-200" />
                <span className="font-bold text-sm">{streak}</span>
              </div>

              {/* Points */}
              <div className="flex items-center gap-1 bg-white/20 backdrop-blur rounded-full px-3 py-1.5">
                <Star className="w-5 h-5 text-yellow-200" />
                <span className="font-bold text-sm">{totalPoints}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-24 min-h-[calc(100vh-140px)]">
        <Outlet />
      </main>

      {/* Bottom Navigation - Mobile Friendly */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-orange-100 shadow-lg z-50">
        <div className="flex justify-around items-center py-2">
          {MENU_ITEMS.map((item) => {
            const isActive = item.exact
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center py-2 px-4 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-t from-orange-100 to-yellow-50 scale-110 -translate-y-1'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <div className={`p-2 rounded-full ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-400 to-yellow-400 text-white shadow-lg'
                    : ''
                }`}>
                  <item.icon className={`w-6 h-6 ${isActive ? '' : ''}`} />
                </div>
                <span className={`text-xs mt-1 font-medium ${
                  isActive ? 'text-orange-600' : 'text-gray-400'
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
