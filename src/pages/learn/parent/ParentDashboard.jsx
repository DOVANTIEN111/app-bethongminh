// src/pages/learn/parent/ParentDashboard.jsx
// Trang chủ chế độ Phụ huynh
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../lib/supabase';
import {
  BarChart3, Clock, BookOpen, Trophy, Star, Flame,
  TrendingUp, ArrowRight, Calendar, Target, MessageSquare
} from 'lucide-react';

export default function ParentDashboard() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    completedLessons: 0,
    totalLessons: 0,
    avgScore: 0,
    totalStudyTime: 0,
    streak: 0,
    xpPoints: 0,
    badges: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const childName = profile?.full_name || 'Bé';

  useEffect(() => {
    if (profile?.id) {
      loadStats();
    }
  }, [profile?.id]);

  const loadStats = async () => {
    try {
      // Load stats từ profile
      setStats({
        completedLessons: profile?.completed_lessons || 12,
        totalLessons: 50,
        avgScore: profile?.avg_score || 8.5,
        totalStudyTime: profile?.total_study_time || 15,
        streak: profile?.streak_days || 7,
        xpPoints: profile?.xp_points || 1250,
        badges: profile?.badge_count || 5,
      });

      // Mock recent activities
      setRecentActivities([
        { id: 1, type: 'lesson', title: 'Phép cộng trong phạm vi 20', time: '2 giờ trước', score: 9 },
        { id: 2, type: 'game', title: 'Trò chơi toán học', time: '5 giờ trước', score: 8.5 },
        { id: 3, type: 'lesson', title: 'Học chữ cái A-D', time: 'Hôm qua', score: 10 },
        { id: 4, type: 'assignment', title: 'Bài tập về nhà', time: '2 ngày trước', score: 8 },
      ]);
    } catch (err) {
      console.error('Load stats error:', err);
    } finally {
      setLoading(false);
    }
  };

  const progressPercent = Math.round((stats.completedLessons / stats.totalLessons) * 100);

  return (
    <div className="p-4 space-y-6">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-5 text-white">
        <h2 className="text-xl font-bold mb-2">Chào mừng đến khu vực Phụ huynh</h2>
        <p className="text-white/80 text-sm mb-4">
          Theo dõi tiến độ học tập của {childName} và liên hệ với giáo viên
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/learn/parent/progress')}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur rounded-xl hover:bg-white/30 transition-colors"
          >
            <BarChart3 className="w-4 h-4" />
            Xem chi tiết
          </button>
          <button
            onClick={() => navigate('/learn/parent/messages')}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur rounded-xl hover:bg-white/30 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            Nhắn tin
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">Bài hoàn thành</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.completedLessons}</p>
          <p className="text-xs text-gray-400">/{stats.totalLessons} bài</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
              <Star className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-sm text-gray-500">Điểm trung bình</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.avgScore}</p>
          <p className="text-xs text-gray-400">/10 điểm</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm text-gray-500">Thời gian học</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.totalStudyTime}</p>
          <p className="text-xs text-gray-400">giờ tổng cộng</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <Flame className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-sm text-gray-500">Chuỗi ngày học</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.streak}</p>
          <p className="text-xs text-gray-400">ngày liên tiếp</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-600" />
            <span className="font-medium text-gray-800">Tiến độ tổng thể</span>
          </div>
          <span className="text-lg font-bold text-indigo-600">{progressPercent}%</span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {childName} đã hoàn thành {stats.completedLessons}/{stats.totalLessons} bài học
        </p>
      </div>

      {/* Achievements Row */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-600" />
            <span className="font-medium text-gray-800">Thành tích</span>
          </div>
          <button
            onClick={() => navigate('/learn/parent/progress')}
            className="text-sm text-indigo-600 flex items-center gap-1"
          >
            Xem tất cả <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-1">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-lg font-bold text-gray-800">{stats.xpPoints}</p>
            <p className="text-xs text-gray-500">XP</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-1">
              <Trophy className="w-6 h-6 text-amber-600" />
            </div>
            <p className="text-lg font-bold text-gray-800">{stats.badges}</p>
            <p className="text-xs text-gray-500">Huy hiệu</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-1">
              <Flame className="w-6 h-6 text-orange-600" />
            </div>
            <p className="text-lg font-bold text-gray-800">{stats.streak}</p>
            <p className="text-xs text-gray-500">Streak</p>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-800">Hoạt động gần đây</span>
          </div>
        </div>
        <div className="space-y-3">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activity.type === 'lesson' ? 'bg-blue-100' :
                  activity.type === 'game' ? 'bg-green-100' : 'bg-purple-100'
                }`}>
                  {activity.type === 'lesson' && <BookOpen className="w-5 h-5 text-blue-600" />}
                  {activity.type === 'game' && <TrendingUp className="w-5 h-5 text-green-600" />}
                  {activity.type === 'assignment' && <Target className="w-5 h-5 text-purple-600" />}
                </div>
                <div>
                  <p className="font-medium text-gray-800 text-sm">{activity.title}</p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-full">
                <Star className="w-3 h-3 text-amber-500" />
                <span className="text-sm font-medium text-amber-600">{activity.score}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
