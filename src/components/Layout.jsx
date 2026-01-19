import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMember } from '../contexts/MemberContext';
import { useAudio } from '../contexts/AudioContext';
import { Home, Gamepad2, User, Settings, Volume2, VolumeX } from 'lucide-react';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentMember, levelInfo } = useMember();
  const { soundEnabled, toggleSound, playSound } = useAudio();
  
  const navItems = [
    { icon: Home, label: 'Trang chủ', path: '/' },
    { icon: Gamepad2, label: 'Trò chơi', path: '/games' },
    { icon: User, label: 'Hồ sơ', path: '/profile' },
  ];
  
  const handleNav = (path) => {
    playSound('click');
    navigate(path);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 safe-top">
        <div className="flex items-center justify-between px-4 py-3">
          {/* User */}
          <button onClick={() => handleNav('/profile')} className="flex items-center gap-2 bg-gray-100 rounded-full pl-1 pr-4 py-1">
            <span className="text-2xl">{currentMember?.avatar}</span>
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-800 leading-tight">{currentMember?.name}</p>
              <p className="text-xs text-indigo-600">Lv.{levelInfo?.level}</p>
            </div>
          </button>
          
          {/* Actions */}
          <div className="flex items-center gap-2">
            <button onClick={toggleSound} className="p-2.5 rounded-full bg-gray-100 hover:bg-gray-200">
              {soundEnabled ? <Volume2 className="w-5 h-5 text-indigo-600" /> : <VolumeX className="w-5 h-5 text-gray-400" />}
            </button>
            <button onClick={() => handleNav('/settings')} className="p-2.5 rounded-full bg-gray-100 hover:bg-gray-200">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>
      
      {/* Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Outlet />
        </motion.div>
      </main>
      
      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 safe-bottom">
        <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
          {navItems.map(({ icon: Icon, label, path }) => {
            const isActive = location.pathname === path;
            return (
              <button
                key={path}
                onClick={() => handleNav(path)}
                className={`flex flex-col items-center py-2 px-4 rounded-xl transition-colors ${
                  isActive ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500'
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'scale-110' : ''} transition-transform`} />
                <span className="text-xs mt-1 font-medium">{label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
