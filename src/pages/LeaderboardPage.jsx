// src/pages/LeaderboardPage.jsx
// Trang bảng xếp hạng - v3.5.0
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useAudio } from '../contexts/AudioContext';
import { LeaderboardCard } from '../components/LeaderboardCard';
import { Trophy, Calendar, CalendarDays, Infinity, RefreshCw } from 'lucide-react';

export default function LeaderboardPage() {
  const { fetchLeaderboard, currentChild, getChildRank } = useAuth();
  const { playSound } = useAudio();
  const [activeTab, setActiveTab] = useState('all');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myRank, setMyRank] = useState(null);

  const tabs = [
    { id: 'week', label: 'Tuần này', icon: Calendar },
    { id: 'month', label: 'Tháng này', icon: CalendarDays },
    { id: 'all', label: 'Tất cả', icon: Infinity },
  ];

  // Fetch leaderboard data
  const loadLeaderboard = async (period) => {
    setLoading(true);
    try {
      const data = await fetchLeaderboard(period, 100);
      setLeaderboardData(data);

      // Tìm vị trí của user hiện tại
      const rank = data.findIndex(u => u.id === currentChild?.id);
      setMyRank(rank >= 0 ? rank + 1 : null);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaderboard(activeTab);
  }, [activeTab]);

  const handleTabChange = (tabId) => {
    playSound('click');
    setActiveTab(tabId);
  };

  const handleRefresh = () => {
    playSound('click');
    loadLeaderboard(activeTab);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-amber-400 via-orange-400 to-red-400 px-4 pt-4 pb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Bảng xếp hạng</h1>
              <p className="text-white/80 text-sm">Top 100 học sinh giỏi nhất</p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition"
          >
            <RefreshCw className={`w-5 h-5 text-white ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* My Rank Card */}
        {currentChild && myRank && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/20 backdrop-blur-sm rounded-2xl p-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                {currentChild.avatar || '👦'}
              </div>
              <div className="flex-1">
                <p className="text-white/80 text-sm">Xếp hạng của bạn</p>
                <p className="text-3xl font-bold text-white">#{myRank}</p>
              </div>
              <div className="text-right">
                <p className="text-white/80 text-sm">Tổng XP</p>
                <p className="text-2xl font-bold text-white">{currentChild.xp?.toLocaleString() || 0}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Tabs */}
      <div className="px-4 -mt-4">
        <div className="bg-white rounded-2xl shadow-lg p-1.5 flex gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-md'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="px-4 mt-6 space-y-2">
        {loading ? (
          // Skeleton loading
          [...Array(10)].map((_, i) => (
            <div key={i} className="h-20 bg-white rounded-2xl animate-pulse" />
          ))
        ) : leaderboardData.length > 0 ? (
          leaderboardData.map((user, index) => (
            <LeaderboardCard
              key={user.id}
              user={user}
              rank={index + 1}
              isCurrentUser={user.id === currentChild?.id}
              delay={index * 0.05}
            />
          ))
        ) : (
          // Empty state
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">📊</span>
            <h3 className="text-xl font-bold text-gray-700 mb-2">Chưa có dữ liệu</h3>
            <p className="text-gray-500">
              {activeTab === 'week' && 'Tuần này chưa có ai học tập'}
              {activeTab === 'month' && 'Tháng này chưa có ai học tập'}
              {activeTab === 'all' && 'Bắt đầu học để lên bảng xếp hạng!'}
            </p>
          </div>
        )}
      </div>

      {/* Bottom padding for safe area */}
      <div className="h-8" />
    </div>
  );
}
