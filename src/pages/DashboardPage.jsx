import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMember } from '../contexts/MemberContext';
import { ArrowLeft, Users, BookOpen, Gamepad2, Clock, Trophy } from 'lucide-react';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { members, getLevel } = useMember();
  
  const totalLessons = members.reduce((sum, m) => sum + (m.stats?.totalLessons || 0), 0);
  const totalGames = members.reduce((sum, m) => sum + (m.stats?.totalGamesPlayed || 0), 0);
  const totalAchievements = members.reduce((sum, m) => sum + (m.achievements?.length || 0), 0);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-6">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/member-select')} className="p-2 rounded-full hover:bg-white/20">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Dashboard Phụ Huynh</h1>
        </div>
        <p className="text-white/80">Theo dõi tiến độ của {members.length} thành viên</p>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-2xl p-4 text-center shadow">
              <BookOpen className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800">{totalLessons}</p>
              <p className="text-sm text-gray-500">Bài học</p>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center shadow">
              <Gamepad2 className="w-8 h-8 text-pink-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800">{totalGames}</p>
              <p className="text-sm text-gray-500">Lượt chơi</p>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center shadow">
              <Trophy className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800">{totalAchievements}</p>
              <p className="text-sm text-gray-500">Huy hiệu</p>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center shadow">
              <Users className="w-8 h-8 text-teal-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800">{members.length}</p>
              <p className="text-sm text-gray-500">Thành viên</p>
            </div>
          </div>
        </motion.div>
        
        {/* Members */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="text-lg font-bold text-gray-800 mb-3">👨‍👩‍👧‍👦 Các thành viên</h2>
          
          <div className="space-y-3">
            {members.map(member => {
              const level = getLevel(member.xp || 0);
              return (
                <div key={member.id} className="bg-white rounded-2xl p-4 shadow">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-4xl">{member.avatar}</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800">{member.name}</h3>
                      <p className="text-sm text-gray-500">{member.age} tuổi • Level {level.level}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-orange-500">
                        <span>🔥</span>
                        <span className="font-bold">{member.stats?.streak || 0}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center text-sm">
                    <div>
                      <p className="font-bold text-indigo-600">{member.stats?.totalLessons || 0}</p>
                      <p className="text-gray-500">Bài học</p>
                    </div>
                    <div>
                      <p className="font-bold text-green-600">{member.stats?.perfectLessons || 0}</p>
                      <p className="text-gray-500">Điểm 100</p>
                    </div>
                    <div>
                      <p className="font-bold text-purple-600">{member.stats?.totalGamesPlayed || 0}</p>
                      <p className="text-gray-500">Games</p>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {members.length === 0 && (
              <div className="bg-white rounded-2xl p-6 text-center shadow">
                <div className="text-4xl mb-2">👨‍👩‍👧‍👦</div>
                <p className="text-gray-500">Chưa có thành viên</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
