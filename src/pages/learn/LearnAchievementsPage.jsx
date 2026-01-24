// src/pages/learn/LearnAchievementsPage.jsx
// Student Achievements Page - Kid-friendly design
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Trophy, Star, Medal, Crown, Flame, Target,
  BookOpen, Clock, Award, TrendingUp, Users
} from 'lucide-react';

const BADGES = [
  { id: 1, icon: '🌟', name: 'Ngôi sao mới', description: 'Hoàn thành bài học đầu tiên', unlocked: true, date: '2025-01-15' },
  { id: 2, icon: '🔥', name: 'Chuỗi 7 ngày', description: 'Học 7 ngày liên tiếp', unlocked: true, date: '2025-01-20' },
  { id: 3, icon: '📚', name: 'Đọc sách giỏi', description: 'Hoàn thành 5 bài đọc', unlocked: true, date: '2025-01-18' },
  { id: 4, icon: '🎯', name: 'Bắn trúng đích', description: 'Đạt 100 điểm trong 1 bài', unlocked: true, date: '2025-01-19' },
  { id: 5, icon: '💪', name: 'Siêu cố gắng', description: 'Học 10 bài trong 1 tuần', unlocked: true, date: '2025-01-21' },
  { id: 6, icon: '🏆', name: 'Vô địch lớp', description: 'Đứng đầu bảng xếp hạng', unlocked: false },
  { id: 7, icon: '🚀', name: 'Tên lửa', description: 'Chuỗi 30 ngày học liên tiếp', unlocked: false },
  { id: 8, icon: '👑', name: 'Vua học tập', description: 'Hoàn thành 50 bài học', unlocked: false },
  { id: 9, icon: '🌈', name: 'Cầu vồng', description: 'Học đủ 5 môn trong 1 ngày', unlocked: false },
  { id: 10, icon: '⚡', name: 'Tia chớp', description: 'Hoàn thành bài học trong 5 phút', unlocked: false },
];

const LEADERBOARD = [
  { rank: 1, name: 'Minh Anh', points: 2450, avatar: '👧', isMe: false },
  { rank: 2, name: 'Gia Bảo', points: 2100, avatar: '👦', isMe: false },
  { rank: 3, name: 'Thanh Tâm', points: 1950, avatar: '👧', isMe: false },
  { rank: 4, name: 'Bạn', points: 1250, avatar: '🧒', isMe: true },
  { rank: 5, name: 'Hải Đăng', points: 1100, avatar: '👦', isMe: false },
];

const HISTORY = [
  { date: '2025-01-23', activity: 'Hoàn thành bài "Màu sắc"', points: 50, icon: '🌈' },
  { date: '2025-01-23', activity: 'Đạt 95 điểm bài tập Toán', points: 30, icon: '➕' },
  { date: '2025-01-22', activity: 'Chuỗi 7 ngày - Nhận huy hiệu', points: 100, icon: '🔥' },
  { date: '2025-01-22', activity: 'Hoàn thành bài "Số đếm"', points: 40, icon: '🔢' },
  { date: '2025-01-21', activity: 'Học từ vựng mới', points: 25, icon: '📖' },
];

export default function LearnAchievementsPage() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('badges');

  const totalPoints = 1250;
  const unlockedBadges = BADGES.filter(b => b.unlocked).length;
  const streak = 7;
  const lessonsCompleted = 24;

  return (
    <div className="p-4 space-y-4">
      {/* Header Stats */}
      <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 rounded-3xl p-6 text-white shadow-xl">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
            <Trophy className="w-7 h-7" />
            Thành tích của bạn
          </h1>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/20 backdrop-blur rounded-2xl p-3 text-center">
            <Star className="w-6 h-6 mx-auto mb-1" />
            <p className="text-2xl font-bold">{totalPoints}</p>
            <p className="text-xs text-white/80">Điểm</p>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-2xl p-3 text-center">
            <Medal className="w-6 h-6 mx-auto mb-1" />
            <p className="text-2xl font-bold">{unlockedBadges}</p>
            <p className="text-xs text-white/80">Huy hiệu</p>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-2xl p-3 text-center">
            <Flame className="w-6 h-6 mx-auto mb-1" />
            <p className="text-2xl font-bold">{streak}</p>
            <p className="text-xs text-white/80">Ngày liên tiếp</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-2xl p-1">
        <button
          onClick={() => setActiveTab('badges')}
          className={`flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
            activeTab === 'badges'
              ? 'bg-white text-yellow-600 shadow'
              : 'text-gray-500'
          }`}
        >
          <Medal className="w-5 h-5" />
          Huy hiệu
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
            activeTab === 'leaderboard'
              ? 'bg-white text-blue-600 shadow'
              : 'text-gray-500'
          }`}
        >
          <Crown className="w-5 h-5" />
          Xếp hạng
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
            activeTab === 'history'
              ? 'bg-white text-green-600 shadow'
              : 'text-gray-500'
          }`}
        >
          <Clock className="w-5 h-5" />
          Lịch sử
        </button>
      </div>

      {/* Badges Tab */}
      {activeTab === 'badges' && (
        <div className="space-y-4">
          {/* Unlocked Badges */}
          <div className="bg-white rounded-3xl p-5 shadow-lg">
            <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              Đã mở khóa ({unlockedBadges}/{BADGES.length})
            </h2>

            <div className="grid grid-cols-3 gap-3">
              {BADGES.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-4 rounded-2xl text-center transition-all ${
                    badge.unlocked
                      ? 'bg-gradient-to-br from-yellow-50 to-orange-50 shadow hover:shadow-lg'
                      : 'bg-gray-100 opacity-50'
                  }`}
                >
                  <div className={`text-4xl mb-2 ${badge.unlocked ? '' : 'grayscale'}`}>
                    {badge.unlocked ? badge.icon : '🔒'}
                  </div>
                  <p className="font-medium text-sm text-gray-700 truncate">{badge.name}</p>
                  {badge.unlocked && (
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(badge.date).toLocaleDateString('vi-VN')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Next Badge to Unlock */}
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-3xl shadow">
                🏆
              </div>
              <div className="flex-1">
                <p className="text-sm text-purple-600">Huy hiệu tiếp theo</p>
                <p className="font-bold text-purple-800">Vô địch lớp</p>
                <p className="text-xs text-purple-500">Đứng đầu bảng xếp hạng</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-purple-600">Còn thiếu</p>
                <p className="font-bold text-purple-800">1200 điểm</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Tab */}
      {activeTab === 'leaderboard' && (
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 text-white text-center">
            <h2 className="font-bold flex items-center justify-center gap-2">
              <Users className="w-5 h-5" />
              Bảng xếp hạng lớp
            </h2>
          </div>

          <div className="p-4 space-y-2">
            {LEADERBOARD.map((student) => (
              <div
                key={student.rank}
                className={`flex items-center gap-3 p-3 rounded-2xl transition-all ${
                  student.isMe
                    ? 'bg-gradient-to-r from-orange-100 to-yellow-100 ring-2 ring-orange-300'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                {/* Rank */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                  student.rank === 1
                    ? 'bg-yellow-400 text-white'
                    : student.rank === 2
                    ? 'bg-gray-300 text-white'
                    : student.rank === 3
                    ? 'bg-orange-400 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {student.rank === 1 ? '👑' : student.rank === 2 ? '🥈' : student.rank === 3 ? '🥉' : student.rank}
                </div>

                {/* Avatar */}
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                  {student.avatar}
                </div>

                {/* Name */}
                <div className="flex-1">
                  <p className={`font-bold ${student.isMe ? 'text-orange-600' : 'text-gray-800'}`}>
                    {student.name} {student.isMe && '(Bạn)'}
                  </p>
                </div>

                {/* Points */}
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-5 h-5 fill-yellow-400" />
                  <span className="font-bold">{student.points}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Your Position */}
          <div className="p-4 border-t border-gray-100">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-600">Vị trí của bạn</p>
              <p className="text-3xl font-bold text-blue-600">#4</p>
              <p className="text-sm text-gray-500">Còn 700 điểm để lên hạng 3!</p>
            </div>
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-3xl p-5 shadow-lg">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            Lịch sử học tập
          </h2>

          <div className="space-y-3">
            {HISTORY.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-inner">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800 text-sm">{item.activity}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(item.date).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">+{item.points}</p>
                  <p className="text-xs text-gray-400">điểm</p>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          <button className="w-full mt-4 py-3 text-blue-500 font-medium">
            Xem thêm...
          </button>
        </div>
      )}
    </div>
  );
}
