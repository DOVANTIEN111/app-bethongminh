// src/components/ParentModeLayout.jsx
// Layout cho chế độ Phụ huynh (trong tài khoản học sinh)
import React, { useEffect } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, BarChart3, MessageSquare, Settings, ArrowLeft, Bell } from 'lucide-react';

const MENU_ITEMS = [
  { path: '/learn/parent', icon: Home, label: 'Trang chủ', exact: true },
  { path: '/learn/parent/progress', icon: BarChart3, label: 'Tiến độ' },
  { path: '/learn/parent/messages', icon: MessageSquare, label: 'Tin nhắn' },
  { path: '/learn/parent/settings', icon: Settings, label: 'Cài đặt' },
];

export default function ParentModeLayout() {
  const { profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Kiểm tra xác thực PIN
  useEffect(() => {
    const verified = sessionStorage.getItem('parentModeVerified');
    const verifyTime = sessionStorage.getItem('parentModeTime');

    if (!verified) {
      navigate('/learn');
      return;
    }

    // Timeout sau 30 phút
    const timeElapsed = Date.now() - parseInt(verifyTime || '0');
    if (timeElapsed > 30 * 60 * 1000) {
      sessionStorage.removeItem('parentModeVerified');
      sessionStorage.removeItem('parentModeTime');
      navigate('/learn');
    }
  }, [navigate]);

  // Tên con
  const childName = profile?.full_name?.split(' ').pop() || 'Bé';
  const parentName = profile?.parent_name || 'Phụ huynh';

  // Quay lại chế độ bé học
  const handleBackToKidMode = () => {
    sessionStorage.removeItem('parentModeVerified');
    sessionStorage.removeItem('parentModeTime');
    navigate('/learn');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-indigo-50 to-white">
      {/* Header - Màu sắc nghiêm túc hơn */}
      <header className="bg-gradient-to-r from-slate-700 to-indigo-700 text-white shadow-lg sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Back Button & Info */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleBackToKidMode}
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                title="Quay lại chế độ Bé học"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <p className="font-semibold text-lg">Xin chào, {parentName}!</p>
                <p className="text-sm text-white/80">Phụ huynh của {childName}</p>
              </div>
            </div>

            {/* Notifications */}
            <button className="relative p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-24 min-h-[calc(100vh-140px)]">
        <Outlet />
      </main>

      {/* Bottom Navigation - Màu sắc nghiêm túc */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg z-50">
        <div className="flex justify-around items-center py-2">
          {MENU_ITEMS.map((item) => {
            const isExactMatch = item.exact && location.pathname === item.path;
            const isStartsWith = !item.exact && location.pathname.startsWith(item.path) && location.pathname !== '/learn/parent';
            const isActive = isExactMatch || isStartsWith;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-t from-slate-100 to-indigo-50'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <div className={`p-2 rounded-full ${
                  isActive
                    ? 'bg-gradient-to-r from-slate-600 to-indigo-600 text-white shadow-lg'
                    : ''
                }`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <span className={`text-xs mt-1 font-medium ${
                  isActive ? 'text-indigo-700' : 'text-gray-400'
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
