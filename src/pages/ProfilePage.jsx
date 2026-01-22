// src/pages/ProfilePage.jsx
// Trang hồ sơ bé - v3.1.0
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useAudio } from '../contexts/AudioContext';
import { ACHIEVEMENTS, getAchievement } from '../data/achievements';
import { PETS, getPetStage } from '../data/pets';
import { 
  Trophy, Flame, Star, Target, BookOpen, Gamepad2,
  Calendar, Clock, Zap, Heart, Users, ChevronRight
} from 'lucide-react';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { currentChild, levelInfo } = useAuth();
  const { playSound } = useAudio();
  const [activeTab, setActiveTab] = useState('stats');
  
  // Get achievements
  const earnedAchievements = (currentChild?.achievements || [])
    .map(id => getAchievement(id))
    .filter(Boolean);
  
  const allAchievements = Object.values(ACHIEVEMENTS);
  const unlockedCount = earnedAchievements.length;
  const totalCount = allAchievements.length;
  
  // Get pet info
  const pet = currentChild?.pet;
  const petStage = pet ? getPetStage(pet.type, pet.xp || 0) : null;
  
  // Stats data
  const stats = currentChild?.stats || {};
  const progress = currentChild?.progress || {};
  
  // Calculate total lessons completed
  const totalLessonsCompleted = Object.values(progress).reduce((sum, subject) => {
    return sum + (subject?.completed?.length || 0);
  }, 0);
  
  const handleSwitchChild = () => {
    playSound('click');
    navigate('/select-role');
  };

  const tabs = [
    { id: 'stats', label: 'Thống kê', icon: '📊' },
    { id: 'achievements', label: 'Huy hiệu', icon: '🏆' },
    { id: 'history', label: 'Lịch sử', icon: '📅' },
  ];
  
  return (
    <div className="px-4 py-4 pb-8">
      {/* Profile Header Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-6 mb-6 overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative">
          {/* Avatar & Name */}
          <div className="flex items-center gap-4 mb-4">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-5xl shadow-lg"
            >
              {currentChild?.avatar || '👦'}
            </motion.div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-1">
                {currentChild?.name || 'Bé'}
              </h2>
              <p className="text-white/80">
                {currentChild?.age ? `${currentChild.age} tuổi` : 'Học sinh chăm chỉ'}
              </p>
            </div>
            <button
              onClick={handleSwitchChild}
              className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition"
            >
              <Users className="w-5 h-5 text-white" />
            </button>
          </div>
          
          {/* Level Progress */}
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-amber-800" />
                </div>
                <div>
                  <p className="text-white font-bold">Level {levelInfo?.level || 1}</p>
                  <p className="text-white/70 text-xs">{levelInfo?.title || 'Người mới'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-bold">{currentChild?.xp || 0} XP</p>
                <p className="text-white/70 text-xs">{levelInfo?.xpToNext || 100} để lên level</p>
              </div>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${levelInfo?.progress || 0}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-4 gap-3 mb-6"
      >
        {[
          { icon: Flame, value: stats.streak || 0, label: 'Streak', color: 'text-orange-500', bg: 'bg-orange-50' },
          { icon: BookOpen, value: totalLessonsCompleted, label: 'Bài học', color: 'text-blue-500', bg: 'bg-blue-50' },
          { icon: Gamepad2, value: stats.totalGames || 0, label: 'Games', color: 'text-pink-500', bg: 'bg-pink-50' },
          { icon: Trophy, value: unlockedCount, label: 'Huy hiệu', color: 'text-amber-500', bg: 'bg-amber-50' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className={`${stat.bg} rounded-2xl p-3 text-center`}
            >
              <Icon className={`w-5 h-5 ${stat.color} mx-auto mb-1`} />
              <p className="text-lg font-bold text-gray-800">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Pet Card (if has pet) */}
      {pet && petStage && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => {
            playSound('click');
            navigate('/pet');
          }}
          className="w-full bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-4 mb-6 flex items-center gap-4 text-left"
        >
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-4xl"
          >
            {petStage.icon}
          </motion.div>
          <div className="flex-1">
            <p className="font-bold text-gray-800">{petStage.name}</p>
            <p className="text-sm text-gray-600">
              <Star className="w-3 h-3 inline mr-1 text-amber-500" />
              {pet.xp || 0} XP
            </p>
          </div>
          <div className="flex items-center gap-1 text-purple-500">
            <span className="text-sm font-medium">Chăm sóc</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </motion.button>
      )}

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="flex bg-gray-100 rounded-2xl p-1.5 mb-4"
      >
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              playSound('click');
              setActiveTab(tab.id);
            }}
            className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-1.5 ${
              activeTab === tab.id 
                ? 'bg-white shadow text-indigo-600' 
                : 'text-gray-500'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {activeTab === 'stats' && (
          <div className="space-y-4">
            {/* Learning Progress */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-indigo-500" />
                Tiến độ học tập
              </h4>
              <div className="space-y-3">
                {[
                  { subject: 'Toán học', icon: '🔢', completed: progress.math?.completed?.length || 0, total: 15, color: 'bg-blue-500' },
                  { subject: 'Tiếng Việt', icon: '📖', completed: progress.vietnamese?.completed?.length || 0, total: 15, color: 'bg-green-500' },
                  { subject: 'Tiếng Anh', icon: '🌍', completed: progress.english?.completed?.length || 0, total: 20, color: 'bg-red-500' },
                  { subject: 'Khoa học', icon: '🔬', completed: progress.science?.completed?.length || 0, total: 8, color: 'bg-purple-500' },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600 flex items-center gap-2">
                        <span>{item.icon}</span>
                        {item.subject}
                      </span>
                      <span className="text-sm font-medium text-gray-800">
                        {item.completed}/{item.total}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${item.color} rounded-full transition-all`}
                        style={{ width: `${(item.completed / item.total) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Time Stats */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-500" />
                Thời gian học
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-indigo-50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-indigo-600">{stats.totalTime || 0}</p>
                  <p className="text-xs text-indigo-600/70">phút tổng cộng</p>
                </div>
                <div className="bg-green-50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-green-600">{stats.daysActive || 0}</p>
                  <p className="text-xs text-green-600/70">ngày hoạt động</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-gray-800">
                Đã mở khóa: {unlockedCount}/{totalCount}
              </h4>
              <div className="text-sm text-indigo-600 font-medium">
                {Math.round((unlockedCount / totalCount) * 100)}%
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-3">
              {allAchievements.map(ach => {
                const isUnlocked = earnedAchievements.some(e => e.id === ach.id);
                return (
                  <motion.div
                    key={ach.id}
                    whileHover={{ scale: 1.05 }}
                    className={`rounded-xl p-3 text-center transition-all ${
                      isUnlocked 
                        ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200' 
                        : 'bg-gray-100 opacity-50'
                    }`}
                  >
                    <div className={`text-2xl mb-1 ${!isUnlocked && 'grayscale'}`}>
                      {isUnlocked ? ach.icon : '🔒'}
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2 font-medium">
                      {isUnlocked ? ach.name : '???'}
                    </p>
                  </motion.div>
                );
              })}
            </div>
            
            {unlockedCount === 0 && (
              <div className="text-center py-6">
                <div className="text-4xl mb-2">🏆</div>
                <p className="text-gray-500">Hoàn thành bài học để nhận huy hiệu!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-500" />
              Hoạt động gần đây
            </h4>
            
            {/* Placeholder for activity history */}
            <div className="text-center py-8">
              <div className="text-4xl mb-2">📅</div>
              <p className="text-gray-500 text-sm">Lịch sử hoạt động sẽ hiển thị ở đây</p>
              <p className="text-gray-400 text-xs mt-1">Tiếp tục học để tạo lịch sử!</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Switch Child Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        onClick={handleSwitchChild}
        className="w-full mt-6 py-4 bg-gray-100 text-gray-700 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-200 transition"
      >
        <Users className="w-5 h-5" />
        Đổi thành viên
      </motion.button>
    </div>
  );
}
