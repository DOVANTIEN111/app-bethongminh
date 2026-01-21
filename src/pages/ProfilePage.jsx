import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { getAchievement } from '../data/achievements';
import { ArrowLeft, LogOut, Trophy, Flame, Star, Target } from 'lucide-react';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { currentChild, logout, levelInfo } = useAuth();
  
  const achievements = (currentChild?.achievements || [])
    .map(id => getAchievement(id))
    .filter(Boolean);
  
  const handleLogout = () => {
    // Không cần logout, chỉ đổi bé;
    navigate('/select-role');
  };
  
  return (
    <div className="px-4 py-4">
      {/* Profile Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="bg-white rounded-3xl p-6 shadow-lg text-center mb-6">
          <div className="text-6xl mb-4">{currentChild?.avatar}</div>
          <h2 className="text-2xl font-bold text-gray-800">{currentChild?.name}</h2>
          <p className="text-gray-500 mb-4">{currentChild?.age} tuổi</p>
          
          {/* Level */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl p-4 mb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="w-5 h-5" />
              <span className="font-bold">Level {levelInfo?.level}</span>
            </div>
            <p className="text-white/80 text-sm mb-2">{levelInfo?.title}</p>
            <div className="h-2 bg-white/30 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full" style={{ width: `${levelInfo?.progress}%` }} />
            </div>
            <p className="text-white/70 text-xs mt-1">{currentChild?.xp || 0} XP</p>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-orange-500">
                <Flame className="w-5 h-5" />
                <span className="text-xl font-bold">{currentChild?.stats?.streak || 0}</span>
              </div>
              <p className="text-xs text-gray-500">Streak</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-indigo-500">
                <Target className="w-5 h-5" />
                <span className="text-xl font-bold">{currentChild?.stats?.totalLessons || 0}</span>
              </div>
              <p className="text-xs text-gray-500">Bài học</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-amber-500">
                <Trophy className="w-5 h-5" />
                <span className="text-xl font-bold">{achievements.length}</span>
              </div>
              <p className="text-xs text-gray-500">Huy hiệu</p>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Achievements */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          Huy Hiệu ({achievements.length})
        </h3>
        
        {achievements.length > 0 ? (
          <div className="grid grid-cols-4 gap-3 mb-6">
            {achievements.map(ach => (
              <div key={ach.id} className="bg-white rounded-2xl p-3 text-center shadow">
                <div className="text-3xl mb-1">{ach.icon}</div>
                <p className="text-xs text-gray-600 line-clamp-2">{ach.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 text-center shadow mb-6">
            <div className="text-4xl mb-2">🏆</div>
            <p className="text-gray-500 text-sm">Hoàn thành bài học để nhận huy hiệu!</p>
          </div>
        )}
      </motion.div>
      
      {/* Logout */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onClick={handleLogout}
        className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold flex items-center justify-center gap-2"
      >
        <LogOut className="w-5 h-5" /> Đổi Thành Viên
      </motion.button>
    </div>
  );
}
