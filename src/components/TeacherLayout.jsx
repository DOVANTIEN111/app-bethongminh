// src/components/TeacherLayout.jsx
// Teacher Layout with Sidebar Navigation
import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard, BookOpen, FileText, ClipboardList,
  Users, MessageSquare, Settings, LogOut, Menu, X, GraduationCap
} from 'lucide-react';

const MENU_ITEMS = [
  { path: '/teacher', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { path: '/teacher/classes', icon: BookOpen, label: 'Lop hoc' },
  { path: '/teacher/lessons', icon: FileText, label: 'Bai giang' },
  { path: '/teacher/assignments', icon: ClipboardList, label: 'Giao bai' },
  { path: '/teacher/students', icon: Users, label: 'Hoc sinh' },
  { path: '/teacher/messages', icon: MessageSquare, label: 'Tin nhan' },
  { path: '/teacher/settings', icon: Settings, label: 'Cai dat' },
];

export default function TeacherLayout() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

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
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-emerald-700 text-white transform transition-transform lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-emerald-600">
          <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Giao Vien</h1>
            <p className="text-xs text-emerald-200">Quan ly lop hoc</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden p-1 hover:bg-emerald-600 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-1">
          {MENU_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-emerald-600 text-white'
                    : 'text-emerald-100 hover:bg-emerald-600 hover:text-white'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-emerald-600">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-10 h-10 rounded-full" />
              ) : (
                <span className="text-lg">👨‍🏫</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{profile?.full_name || 'Giao vien'}</p>
              <p className="text-xs text-emerald-200 truncate">{profile?.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Dang xuat</span>
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
              <h2 className="text-lg font-semibold text-gray-800">
                Xin chao, {profile?.full_name || 'Giao vien'}!
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-10 h-10 rounded-full" />
                ) : (
                  <GraduationCap className="w-5 h-5 text-emerald-600" />
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
