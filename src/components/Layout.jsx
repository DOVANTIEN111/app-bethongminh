// src/components/Layout.jsx
// Layout chính với Header + Bottom Navigation - v3.1.0
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useAudio } from '../contexts/AudioContext';
import { 
  Home, Gamepad2, User, Settings, Volume2, VolumeX, 
  BookOpen, Star, Flame, ChevronLeft
} from 'lucide-react';
import EncouragementBanner from './EncouragementBanner';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentChild, levelInfo } = useAuth();
  const { soundEnabled, toggleSound, playSound } = useAudio();
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  // Navigation items
  const navItems = [
    { icon: Home, label: 'Trang chủ', path: '/', emoji: '🏠' },
    { icon: BookOpen, label: 'Học tập', path: '/english', emoji: '📚' },
    { icon: Gamepad2, label: 'Trò chơi', path: '/games', emoji: '🎮' },
    { icon: User, label: 'Hồ sơ', path: '/profile', emoji: '👤' },
  ];

  // Hide header on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 60) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);
  
  const handleNav = (path) => {
    playSound('click');
    navigate(path);
  };

  // Check if current page needs back button
  const needsBackButton = !['/'].includes(location.pathname);
  const pageTitle = getPageTitle(location.pathname);
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Encouragement Banner */}
      <EncouragementBanner />

      {/* Header */}
      <motion.header 
        initial={false}
        animate={{ 
          y: showHeader ? 0 : -80,
          opacity: showHeader ? 1 : 0 
        }}
        transition={{ duration: 0.2 }}
        className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100"
      >
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left side - User info or Back button */}
          {needsBackButton ? (
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center gap-1 text-gray-600 hover:text-gray-800 transition"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Quay lại</span>
            </button>
          ) : (
            <button 
              onClick={() => handleNav('/profile')} 
              className="flex items-center gap-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full pl-1 pr-4 py-1 border border-indigo-100"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-xl shadow-sm">
                {currentChild?.avatar || '👦'}
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-gray-800 leading-tight">
                  {currentChild?.name || 'Bé'}
                </p>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-indigo-600 font-medium">Lv.{levelInfo?.level || 1}</span>
                  <span className="text-orange-500 flex items-center gap-0.5">
                    <Flame className="w-3 h-3" />
                    {currentChild?.stats?.streak || 0}
                  </span>
                </div>
              </div>
            </button>
          )}

          {/* Center - Page title (for sub pages) */}
          {needsBackButton && pageTitle && (
            <h1 className="text-lg font-bold text-gray-800 absolute left-1/2 -translate-x-1/2">
              {pageTitle}
            </h1>
          )}
          
          {/* Right side - Actions */}
          <div className="flex items-center gap-2">
            {/* XP display */}
            {!needsBackButton && (
              <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-3 py-1.5 rounded-full border border-amber-200">
                <Star className="w-4 h-4" />
                <span className="text-sm font-bold">{currentChild?.xp || 0}</span>
              </div>
            )}
            
            {/* Sound toggle */}
            <button 
              onClick={() => {
                toggleSound();
                playSound('click');
              }} 
              className={`p-2.5 rounded-full transition-all ${
                soundEnabled 
                  ? 'bg-indigo-100 text-indigo-600' 
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
            
            {/* Settings */}
            <button 
              onClick={() => handleNav('/settings')} 
              className="p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 transition"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        {!needsBackButton && levelInfo && (
          <div className="px-4 pb-2">
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${levelInfo.progress || 0}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
              />
            </div>
          </div>
        )}
      </motion.header>
      
      {/* Content */}
      <main className="flex-1 overflow-y-auto pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-t border-gray-100 pb-safe">
        <div className="flex items-center justify-around py-2 px-2 max-w-lg mx-auto">
          {navItems.map(({ icon: Icon, label, path, emoji }) => {
            const isActive = location.pathname === path || 
              (path !== '/' && location.pathname.startsWith(path));
            
            return (
              <motion.button
                key={path}
                onClick={() => handleNav(path)}
                whileTap={{ scale: 0.9 }}
                className="relative flex flex-col items-center py-2 px-4 rounded-2xl transition-all"
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="navIndicator"
                    className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl"
                    transition={{ type: 'spring', duration: 0.5 }}
                  />
                )}
                
                <div className={`relative z-10 transition-transform ${isActive ? 'scale-110' : ''}`}>
                  {isActive ? (
                    <span className="text-2xl">{emoji}</span>
                  ) : (
                    <Icon className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                
                <span className={`relative z-10 text-xs mt-1 font-medium transition-colors ${
                  isActive ? 'text-indigo-600' : 'text-gray-400'
                }`}>
                  {label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

// Helper function to get page title
function getPageTitle(pathname) {
  const titles = {
    '/games': 'Trò chơi',
    '/profile': 'Hồ sơ',
    '/settings': 'Cài đặt',
    '/english': 'English Zone',
    '/stories': 'Truyện cổ tích',
    '/pet': 'Pet của tôi',
  };
  
  // Check exact match first
  if (titles[pathname]) return titles[pathname];
  
  // Check prefix match
  if (pathname.startsWith('/subject/')) return 'Môn học';
  if (pathname.startsWith('/lesson/')) return 'Bài học';
  if (pathname.startsWith('/game/')) return 'Chơi game';
  if (pathname.startsWith('/story/')) return 'Đọc truyện';
  if (pathname.startsWith('/english/')) return 'English Zone';
  
  return null;
}
