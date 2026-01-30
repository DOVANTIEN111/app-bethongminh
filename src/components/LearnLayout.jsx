// src/components/LearnLayout.jsx
// Layout for Student Learning Pages - Kid-friendly design with subscription info
import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, BookOpen, ClipboardList, Trophy, User, Star, Flame, Users, Clock, X, Crown, AlertTriangle, Gamepad2 } from 'lucide-react';
import ParentPinModal from './ParentPinModal';
import { getUserSubscription, checkSubscriptionExpiry, expireSubscription } from '../services/subscriptionService';

const MENU_ITEMS = [
  { path: '/learn', icon: Home, label: 'Trang chủ', exact: true },
  { path: '/learn/lessons', icon: BookOpen, label: 'Bài học' },
  { path: '/learn/games', icon: Gamepad2, label: 'Trò chơi' },
  { path: '/learn/assignments', icon: ClipboardList, label: 'Bài tập' },
  { path: '/learn/profile', icon: User, label: 'Cá nhân' },
];

export default function LearnLayout() {
  const { profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showParentModal, setShowParentModal] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [daysRemaining, setDaysRemaining] = useState(null);
  const [showExpiredPopup, setShowExpiredPopup] = useState(false);
  const [showUpgradeReminder, setShowUpgradeReminder] = useState(false);

  // Get first name for display
  const firstName = profile?.full_name?.split(' ').pop() || 'Bé';

  // Mock data - in real app, fetch from database
  const totalPoints = profile?.xp_points || 0;
  const streak = profile?.streak_days || 0;

  // Load subscription on mount
  useEffect(() => {
    if (profile?.id) {
      loadSubscription();
    }
  }, [profile?.id]);

  const loadSubscription = async () => {
    const sub = await getUserSubscription(profile.id);
    if (sub) {
      setSubscription(sub);

      const { isExpired, daysRemaining: days } = checkSubscriptionExpiry(sub);
      setDaysRemaining(days);

      // Nếu subscription đã hết hạn và vẫn là active, cập nhật status
      if (isExpired && sub.status === 'active') {
        await expireSubscription(sub.id);
        setShowExpiredPopup(true);
      }

      // Hiện reminder khi còn 7 ngày hoặc ít hơn
      if (sub.is_trial && days > 0 && days <= 7) {
        setShowUpgradeReminder(true);
      }
    }
  };

  const isTrial = subscription?.is_trial;
  const isExpired = daysRemaining !== null && daysRemaining <= 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-orange-50 to-yellow-50">
      {/* Expired Popup */}
      {showExpiredPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-scale-up">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Gói dùng thử đã hết hạn!
              </h3>
              <p className="text-gray-600 mb-6">
                Nâng cấp ngay để tiếp tục học tất cả bài học. Hoặc bạn có thể học 3 bài đầu miễn phí.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowExpiredPopup(false)}
                  className="flex-1 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50"
                >
                  Để sau
                </button>
                <Link
                  to="/pricing"
                  className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-medium hover:opacity-90 flex items-center justify-center gap-2"
                >
                  <Crown className="w-5 h-5" />
                  Nâng cấp
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Reminder Banner (còn 3 ngày) */}
      {isTrial && daysRemaining !== null && daysRemaining <= 3 && daysRemaining > 0 && (
        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm font-medium">
              Còn {daysRemaining} ngày dùng thử!
            </span>
          </div>
          <Link
            to="/pricing"
            className="bg-white text-orange-600 px-3 py-1 rounded-full text-sm font-medium hover:bg-orange-50"
          >
            Nâng cấp ngay
          </Link>
        </div>
      )}

      {/* Header - Mobile Optimized */}
      <header className="bg-gradient-to-r from-orange-400 via-yellow-400 to-blue-400 text-white shadow-lg sticky top-0 z-40 pt-safe">
        <div className="px-3 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center justify-between">
            {/* Avatar & Name */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-white">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full" />
                ) : (
                  <span className="text-xl sm:text-2xl">🧒</span>
                )}
              </div>
              <div>
                <p className="font-bold text-base sm:text-lg drop-shadow">Chào {firstName}! 👋</p>
                <p className="text-[10px] sm:text-xs text-white/90 hidden sm:block">Học vui mỗi ngày!</p>
              </div>
            </div>

            {/* Stats & Parent Button */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Trial Days Remaining */}
              {isTrial && daysRemaining !== null && daysRemaining > 0 && (
                <Link
                  to="/pricing"
                  className={`flex items-center gap-1 backdrop-blur rounded-full px-2 py-1 sm:px-2.5 sm:py-1.5 ${
                    daysRemaining <= 7
                      ? 'bg-red-500/80 active:bg-red-600/80'
                      : 'bg-white/20 active:bg-white/30'
                  }`}
                  title="Nâng cấp tài khoản"
                >
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="font-bold text-xs sm:text-sm">{daysRemaining}</span>
                </Link>
              )}

              {/* Streak */}
              <div className="flex items-center gap-0.5 sm:gap-1 bg-white/20 backdrop-blur rounded-full px-2 py-1 sm:px-2.5 sm:py-1.5">
                <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-200" />
                <span className="font-bold text-xs sm:text-sm">{streak}</span>
              </div>

              {/* Points */}
              <div className="flex items-center gap-0.5 sm:gap-1 bg-white/20 backdrop-blur rounded-full px-2 py-1 sm:px-2.5 sm:py-1.5">
                <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-200" />
                <span className="font-bold text-xs sm:text-sm">{totalPoints}</span>
              </div>

              {/* Parent Mode Button */}
              <button
                onClick={() => setShowParentModal(true)}
                className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-white/20 backdrop-blur rounded-full active:bg-white/30 transition-colors"
                title="Chế độ Phụ huynh"
              >
                <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Upgrade Reminder (còn 7 ngày) */}
        {showUpgradeReminder && daysRemaining > 3 && daysRemaining <= 7 && (
          <div className="bg-gradient-to-r from-amber-400 to-yellow-400 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-900">
              <Crown className="w-4 h-4" />
              <span className="text-sm font-medium">
                Còn {daysRemaining} ngày dùng thử. Nâng cấp để học không giới hạn!
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/pricing"
                className="bg-amber-900 text-white px-3 py-1 rounded-full text-xs font-medium hover:bg-amber-800"
              >
                Xem gói cước
              </Link>
              <button
                onClick={() => setShowUpgradeReminder(false)}
                className="text-amber-900 hover:bg-amber-300 rounded-full p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="pb-20 sm:pb-24 min-h-[calc(100vh-120px)]">
        <Outlet context={{ subscription, daysRemaining, isExpired }} />
      </main>

      {/* Bottom Navigation - Mobile Optimized */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-orange-100 shadow-lg z-50 pb-safe">
        <div className="flex justify-around items-center h-14 sm:h-16">
          {MENU_ITEMS.map((item) => {
            const isActive = item.exact
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center py-1 px-2 sm:px-3 rounded-lg transition-all min-w-[56px] ${
                  isActive
                    ? 'text-orange-500'
                    : 'text-gray-400 active:text-gray-600'
                }`}
              >
                <div className={`p-1.5 sm:p-2 rounded-full ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-400 to-yellow-400 text-white shadow-md'
                    : ''
                }`}>
                  <item.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className={`text-[10px] sm:text-xs mt-0.5 font-medium truncate ${
                  isActive ? 'text-orange-600' : 'text-gray-400'
                }`}>
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Parent PIN Modal */}
      <ParentPinModal
        isOpen={showParentModal}
        onClose={() => setShowParentModal(false)}
      />

      {/* CSS Animation & Safe Area */}
      <style>{`
        @keyframes scale-up {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-up {
          animation: scale-up 0.2s ease-out;
        }
        /* Safe area for iPhone X+ */
        .pt-safe {
          padding-top: env(safe-area-inset-top);
        }
        .pb-safe {
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </div>
  );
}
