// src/components/mobile/BottomNavigation.jsx
// Bottom Navigation cho mobile - responsive va touch-friendly

import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, BookOpen, Gamepad2, Trophy, User, Users, Settings, ClipboardList, MessageCircle } from 'lucide-react';

const BottomNavigation = ({ userRole = 'student' }) => {
  const location = useLocation();

  // Menu theo role
  const menuItems = {
    student: [
      { to: '/learn', icon: Home, label: 'Trang chu', exact: true },
      { to: '/learn/lessons', icon: BookOpen, label: 'Hoc tap' },
      { to: '/learn/games', icon: Gamepad2, label: 'Tro choi' },
      { to: '/learn/achievements', icon: Trophy, label: 'Thanh tich' },
      { to: '/learn/profile', icon: User, label: 'Ca nhan' },
    ],
    teacher: [
      { to: '/teacher', icon: Home, label: 'Trang chu', exact: true },
      { to: '/teacher/classes', icon: Users, label: 'Lop hoc' },
      { to: '/teacher/assignments', icon: ClipboardList, label: 'Bai tap' },
      { to: '/teacher/students', icon: BookOpen, label: 'Hoc sinh' },
      { to: '/teacher/settings', icon: Settings, label: 'Cai dat' },
    ],
    school_admin: [
      { to: '/school', icon: Home, label: 'Tong quan', exact: true },
      { to: '/school/teachers', icon: Users, label: 'Giao vien' },
      { to: '/school/students', icon: BookOpen, label: 'Hoc sinh' },
      { to: '/school/reports', icon: Trophy, label: 'Bao cao' },
      { to: '/school/settings', icon: Settings, label: 'Cai dat' },
    ],
    parent: [
      { to: '/parent', icon: Home, label: 'Trang chu', exact: true },
      { to: '/parent/children', icon: Users, label: 'Con em' },
      { to: '/parent/messages', icon: MessageCircle, label: 'Tin nhan' },
      { to: '/parent/reports', icon: Trophy, label: 'Bao cao' },
      { to: '/parent/settings', icon: Settings, label: 'Cai dat' },
    ],
  };

  const items = menuItems[userRole] || menuItems.student;

  // An bottom nav tren mot so trang
  const hiddenPaths = ['/login', '/register', '/payment', '/english/', '/math/', '/vietnamese/', '/science/'];
  const shouldHide = hiddenPaths.some(path => location.pathname.includes(path));

  if (shouldHide) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex justify-around items-center h-16">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to);

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-all active:scale-95 ${
                isActive
                  ? 'text-blue-600'
                  : 'text-gray-500'
              }`}
            >
              <div className={`relative p-1.5 rounded-xl transition-all ${
                isActive ? 'bg-blue-100' : ''
              }`}>
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
                )}
              </div>
              <span className={`text-[10px] mt-0.5 ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
