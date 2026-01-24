// src/pages/learn/parent/ParentProgress.jsx
// Trang tiến độ học tập cho Phụ huynh
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../lib/supabase';
import {
  BarChart3, BookOpen, Trophy, Star, Clock, Calendar,
  TrendingUp, Award, Target, CheckCircle, Flame, ChevronRight
} from 'lucide-react';

export default function ParentProgress() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    completedLessons: 12,
    totalLessons: 50,
    avgScore: 8.5,
    totalStudyTime: 15,
    weeklyStudyTime: 5,
    streak: 7,
    xpPoints: 1250,
    level: 5,
  });
  const [weeklyData, setWeeklyData] = useState([
    { day: 'T2', hours: 1.5, lessons: 2 },
    { day: 'T3', hours: 2, lessons: 3 },
    { day: 'T4', hours: 1, lessons: 1 },
    { day: 'T5', hours: 1.5, lessons: 2 },
    { day: 'T6', hours: 2.5, lessons: 4 },
    { day: 'T7', hours: 0.5, lessons: 1 },
    { day: 'CN', hours: 1, lessons: 2 },
  ]);
  const [recentLessons, setRecentLessons] = useState([
    { id: 1, title: 'Phép cộng trong phạm vi 20', subject: 'Toán', score: 9, date: '2024-01-24', status: 'completed' },
    { id: 2, title: 'Học chữ cái A-D', subject: 'Tiếng Việt', score: 10, date: '2024-01-23', status: 'completed' },
    { id: 3, title: 'Các con vật nuôi', subject: 'Tự nhiên', score: 8, date: '2024-01-22', status: 'completed' },
    { id: 4, title: 'Phép trừ đơn giản', subject: 'Toán', score: 8.5, date: '2024-01-21', status: 'completed' },
    { id: 5, title: 'Bài tập về nhà tuần 3', subject: 'Tổng hợp', score: null, date: '2024-01-25', status: 'in_progress' },
  ]);
  const [badges, setBadges] = useState([
    { id: 1, name: 'Siêu sao', icon: '🌟', description: 'Hoàn thành 10 bài học', earned: true },
    { id: 2, name: 'Chăm chỉ', icon: '📚', description: 'Học 7 ngày liên tiếp', earned: true },
    { id: 3, name: 'Toán học', icon: '🧮', description: 'Đạt 10 điểm 5 bài Toán', earned: true },
    { id: 4, name: 'Nhà vô địch', icon: '🏆', description: 'Hoàn thành 50 bài học', earned: false },
    { id: 5, name: 'Thiên tài', icon: '🎓', description: 'Đạt level 10', earned: false },
  ]);
  const [loading, setLoading] = useState(false);

  const childName = profile?.full_name?.split(' ').pop() || 'Bé';
  const progressPercent = Math.round((stats.completedLessons / stats.totalLessons) * 100);
  const maxHours = Math.max(...weeklyData.map(d => d.hours));

  const tabs = [
    { id: 'overview', label: 'Tổng quan', icon: BarChart3 },
    { id: 'lessons', label: 'Bài học', icon: BookOpen },
    { id: 'badges', label: 'Huy hiệu', icon: Trophy },
  ];

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h1 className="text-lg font-bold text-gray-800 mb-1">Tiến độ học tập</h1>
        <p className="text-sm text-gray-500">Theo dõi chi tiết quá trình học của {childName}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white rounded-xl p-2 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="text-sm font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
              <BookOpen className="w-6 h-6 mb-2 opacity-80" />
              <p className="text-2xl font-bold">{stats.completedLessons}</p>
              <p className="text-sm text-white/80">Bài đã học</p>
            </div>
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-4 text-white">
              <Star className="w-6 h-6 mb-2 opacity-80" />
              <p className="text-2xl font-bold">{stats.avgScore}</p>
              <p className="text-sm text-white/80">Điểm trung bình</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
              <Clock className="w-6 h-6 mb-2 opacity-80" />
              <p className="text-2xl font-bold">{stats.totalStudyTime}h</p>
              <p className="text-sm text-white/80">Tổng thời gian</p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white">
              <Flame className="w-6 h-6 mb-2 opacity-80" />
              <p className="text-2xl font-bold">{stats.streak}</p>
              <p className="text-sm text-white/80">Ngày liên tiếp</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-800">Tiến độ hoàn thành</span>
              <span className="text-lg font-bold text-indigo-600">{progressPercent}%</span>
            </div>
            <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Còn {stats.totalLessons - stats.completedLessons} bài nữa để hoàn thành
            </p>
          </div>

          {/* Weekly Chart */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-800">Thời gian học tuần này</span>
            </div>
            <div className="flex items-end justify-between h-32 gap-2">
              {weeklyData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col items-center justify-end h-24">
                    <span className="text-xs text-gray-500 mb-1">{data.hours}h</span>
                    <div
                      className="w-full bg-gradient-to-t from-indigo-500 to-indigo-400 rounded-t-lg transition-all"
                      style={{ height: `${(data.hours / maxHours) * 100}%`, minHeight: '8px' }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 mt-2">{data.day}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <span className="text-sm text-gray-500">Tổng tuần này:</span>
              <span className="font-bold text-indigo-600">{stats.weeklyStudyTime} giờ</span>
            </div>
          </div>

          {/* Level & XP */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {stats.level}
                </div>
                <div>
                  <p className="font-medium text-gray-800">Level {stats.level}</p>
                  <p className="text-sm text-gray-500">{stats.xpPoints} XP</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Đến Level {stats.level + 1}</p>
                <p className="font-medium text-indigo-600">{(stats.level + 1) * 300 - stats.xpPoints} XP nữa</p>
              </div>
            </div>
            <div className="mt-3 w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                style={{ width: `${(stats.xpPoints % 300) / 3}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'lessons' && (
        <div className="space-y-3">
          {recentLessons.map((lesson) => (
            <div key={lesson.id} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      lesson.subject === 'Toán' ? 'bg-blue-100 text-blue-700' :
                      lesson.subject === 'Tiếng Việt' ? 'bg-green-100 text-green-700' :
                      lesson.subject === 'Tự nhiên' ? 'bg-amber-100 text-amber-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {lesson.subject}
                    </span>
                    {lesson.status === 'completed' && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                    {lesson.status === 'in_progress' && (
                      <Clock className="w-4 h-4 text-amber-500" />
                    )}
                  </div>
                  <p className="font-medium text-gray-800">{lesson.title}</p>
                  <p className="text-sm text-gray-400 mt-1">{lesson.date}</p>
                </div>
                {lesson.score !== null ? (
                  <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-full">
                    <Star className="w-4 h-4 text-amber-500" />
                    <span className="font-bold text-amber-600">{lesson.score}</span>
                  </div>
                ) : (
                  <span className="px-3 py-1.5 bg-gray-100 text-gray-500 rounded-full text-sm">
                    Đang làm
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'badges' && (
        <div className="space-y-3">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium text-gray-800">Huy hiệu đã nhận</span>
              <span className="text-sm text-indigo-600 font-medium">
                {badges.filter(b => b.earned).length}/{badges.length}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`flex flex-col items-center p-3 rounded-xl ${
                    badge.earned ? 'bg-amber-50' : 'bg-gray-50 opacity-50'
                  }`}
                >
                  <span className="text-3xl mb-1">{badge.icon}</span>
                  <span className={`text-xs font-medium text-center ${
                    badge.earned ? 'text-amber-700' : 'text-gray-500'
                  }`}>
                    {badge.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Badge Details */}
          <div className="space-y-2">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`bg-white rounded-xl p-4 shadow-sm flex items-center gap-3 ${
                  !badge.earned && 'opacity-60'
                }`}
              >
                <span className="text-3xl">{badge.icon}</span>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{badge.name}</p>
                  <p className="text-sm text-gray-500">{badge.description}</p>
                </div>
                {badge.earned ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <div className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-500">
                    Chưa đạt
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
