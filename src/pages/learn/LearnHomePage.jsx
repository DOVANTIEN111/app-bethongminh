// src/pages/learn/LearnHomePage.jsx
// Student Learning Home Page - Kid-friendly design
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  BookOpen, Star, Trophy, Flame, Play, ChevronRight,
  Sparkles, Target, Clock, Award
} from 'lucide-react';

export default function LearnHomePage() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const firstName = profile?.full_name?.split(' ').pop() || 'Bé';

  // Mock data - in real app, fetch from database
  const [todayProgress] = useState(65);
  const [streak] = useState(7);
  const [nextLesson] = useState({
    id: 'eng-vocab-1',
    title: 'Học từ vựng: Động vật',
    subject: 'Tiếng Anh',
    icon: '🐻',
    progress: 30,
    duration: '10 phút'
  });

  const [badges] = useState([
    { id: 1, icon: '🌟', name: 'Ngôi sao mới', unlocked: true },
    { id: 2, icon: '🔥', name: '7 ngày liên tiếp', unlocked: true },
    { id: 3, icon: '📚', name: 'Đọc sách giỏi', unlocked: true },
    { id: 4, icon: '🎯', name: 'Bắn trúng đích', unlocked: false },
    { id: 5, icon: '🏆', name: 'Vô địch lớp', unlocked: false },
  ]);

  const [quickStats] = useState({
    totalPoints: 1250,
    lessonsCompleted: 24,
    todayMinutes: 35
  });

  return (
    <div className="p-4 space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-300 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <h1 className="text-2xl font-bold mb-2">
            Chào {firstName}! 🎉
          </h1>
          <p className="text-white/90 mb-4">
            Hôm nay bạn đã học được {quickStats.todayMinutes} phút rồi!
          </p>

          {/* Today's Progress */}
          <div className="bg-white/20 backdrop-blur rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Tiến độ hôm nay</span>
              <span className="font-bold text-lg">{todayProgress}%</span>
            </div>
            <div className="h-4 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500 relative"
                style={{ width: `${todayProgress}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 bg-yellow-300 rounded-full border-2 border-white flex items-center justify-center">
                  <Star className="w-3 h-3 text-orange-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Streak Card */}
      <div className="bg-gradient-to-r from-red-400 to-orange-400 rounded-2xl p-4 text-white flex items-center gap-4 shadow-lg">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
          <Flame className="w-10 h-10 text-yellow-200 animate-pulse" />
        </div>
        <div className="flex-1">
          <p className="text-white/80 text-sm">Chuỗi ngày học</p>
          <p className="text-3xl font-bold">{streak} ngày 🔥</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-white/80">Tiếp tục nào!</p>
          <p className="text-lg font-bold">+50 điểm</p>
        </div>
      </div>

      {/* Next Lesson Card */}
      <div className="bg-white rounded-3xl p-5 shadow-lg border-2 border-blue-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            Bài học tiếp theo
          </h2>
          <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
            {nextLesson.subject}
          </span>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center text-4xl shadow-inner">
            {nextLesson.icon}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-800 text-lg">{nextLesson.title}</h3>
            <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {nextLesson.duration}
              </span>
              <span className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                {nextLesson.progress}% hoàn thành
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate('/learn/lessons')}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-95"
        >
          <Play className="w-6 h-6" />
          Học ngay!
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl p-4 text-center shadow">
          <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-800">{quickStats.totalPoints}</p>
          <p className="text-xs text-gray-500">Điểm</p>
        </div>
        <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl p-4 text-center shadow">
          <BookOpen className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-800">{quickStats.lessonsCompleted}</p>
          <p className="text-xs text-gray-500">Bài học</p>
        </div>
        <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-4 text-center shadow">
          <Clock className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-800">{quickStats.todayMinutes}</p>
          <p className="text-xs text-gray-500">Phút hôm nay</p>
        </div>
      </div>

      {/* Badges Section */}
      <div className="bg-white rounded-3xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Huy hiệu của bạn
          </h2>
          <button
            onClick={() => navigate('/learn/achievements')}
            className="text-orange-500 text-sm font-medium flex items-center gap-1"
          >
            Xem tất cả
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`flex-shrink-0 w-20 p-3 rounded-2xl text-center transition-all ${
                badge.unlocked
                  ? 'bg-gradient-to-br from-yellow-100 to-orange-100 shadow'
                  : 'bg-gray-100 opacity-50'
              }`}
            >
              <div className={`text-3xl mb-1 ${badge.unlocked ? '' : 'grayscale'}`}>
                {badge.icon}
              </div>
              <p className="text-xs font-medium text-gray-600 truncate">{badge.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Subject Quick Links */}
      <div className="bg-white rounded-3xl p-5 shadow-lg">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-500" />
          Môn học
        </h2>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/learn/lessons')}
            className="bg-gradient-to-br from-blue-400 to-blue-500 text-white p-4 rounded-2xl flex items-center gap-3 shadow hover:shadow-lg transition-all active:scale-95"
          >
            <span className="text-3xl">🇬🇧</span>
            <div className="text-left">
              <p className="font-bold">Tiếng Anh</p>
              <p className="text-xs text-white/80">12 bài học</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/learn/lessons')}
            className="bg-gradient-to-br from-green-400 to-green-500 text-white p-4 rounded-2xl flex items-center gap-3 shadow hover:shadow-lg transition-all active:scale-95"
          >
            <span className="text-3xl">🔢</span>
            <div className="text-left">
              <p className="font-bold">Toán</p>
              <p className="text-xs text-white/80">8 bài học</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/learn/lessons')}
            className="bg-gradient-to-br from-purple-400 to-purple-500 text-white p-4 rounded-2xl flex items-center gap-3 shadow hover:shadow-lg transition-all active:scale-95"
          >
            <span className="text-3xl">🔬</span>
            <div className="text-left">
              <p className="font-bold">Khoa học</p>
              <p className="text-xs text-white/80">6 bài học</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/learn/lessons')}
            className="bg-gradient-to-br from-orange-400 to-orange-500 text-white p-4 rounded-2xl flex items-center gap-3 shadow hover:shadow-lg transition-all active:scale-95"
          >
            <span className="text-3xl">📖</span>
            <div className="text-left">
              <p className="font-bold">Tiếng Việt</p>
              <p className="text-xs text-white/80">10 bài học</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
