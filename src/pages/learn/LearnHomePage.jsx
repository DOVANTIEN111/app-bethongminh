// src/pages/learn/LearnHomePage.jsx
// Student Learning Home Page - Connected to real progress
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  getStudentProgress,
  calculateTotalPoints,
  getCompletedLessonsCount,
  getTotalLearningTime,
  getTodayProgress,
  calculateStreak,
  getUnlockedBadges,
  getNextLesson,
  getEnglishTopicsWithProgress
} from '../../services/studentProgress';
import {
  BookOpen, Star, Trophy, Flame, Play, ChevronRight,
  Sparkles, Target, Clock, Award, Loader2
} from 'lucide-react';

export default function LearnHomePage() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const firstName = profile?.full_name?.split(' ').pop() || 'Bé';

  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState({});
  const [stats, setStats] = useState({
    totalPoints: 0,
    lessonsCompleted: 0,
    todayMinutes: 0,
    streak: 0,
  });
  const [todayProgress, setTodayProgress] = useState(0);
  const [nextLesson, setNextLesson] = useState(null);
  const [badges, setBadges] = useState([]);
  const [englishTopics, setEnglishTopics] = useState([]);

  useEffect(() => {
    loadData();
  }, [profile?.id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const progressData = await getStudentProgress(profile?.id);
      setProgress(progressData);

      // Calculate stats
      const totalPoints = calculateTotalPoints(progressData);
      const lessonsCompleted = getCompletedLessonsCount(progressData);
      const totalTime = getTotalLearningTime(progressData);
      const streak = calculateStreak(progressData);
      const today = getTodayProgress(progressData);

      setStats({
        totalPoints,
        lessonsCompleted,
        todayMinutes: today.timeSpent,
        streak,
      });

      // Calculate today's progress (percentage of daily goal - 3 lessons)
      const dailyGoal = 3;
      setTodayProgress(Math.min(100, Math.round((today.lessonsCompleted / dailyGoal) * 100)));

      // Get English topics and next lesson
      const topics = getEnglishTopicsWithProgress(progressData);
      setEnglishTopics(topics);

      const next = getNextLesson(progressData);
      setNextLesson(next);

      // Get badges
      const unlockedBadges = getUnlockedBadges(progressData);
      setBadges(unlockedBadges);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

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
            {stats.todayMinutes > 0
              ? `Hôm nay bạn đã học được ${stats.todayMinutes} phút rồi!`
              : 'Hãy bắt đầu học ngay nào!'}
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
                {todayProgress > 10 && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 bg-yellow-300 rounded-full border-2 border-white flex items-center justify-center">
                    <Star className="w-3 h-3 text-orange-500" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Streak Card */}
      {stats.streak > 0 && (
        <div className="bg-gradient-to-r from-red-400 to-orange-400 rounded-2xl p-4 text-white flex items-center gap-4 shadow-lg">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <Flame className="w-10 h-10 text-yellow-200 animate-pulse" />
          </div>
          <div className="flex-1">
            <p className="text-white/80 text-sm">Chuỗi ngày học</p>
            <p className="text-3xl font-bold">{stats.streak} ngày 🔥</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-white/80">Tiếp tục nào!</p>
            <p className="text-lg font-bold">+{stats.streak * 10} điểm</p>
          </div>
        </div>
      )}

      {/* Next Lesson Card */}
      {nextLesson && (
        <div className="bg-white rounded-3xl p-5 shadow-lg border-2 border-blue-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              Bài học tiếp theo
            </h2>
            <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
              Tiếng Anh
            </span>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center text-4xl shadow-inner">
              {nextLesson.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 text-lg">{nextLesson.nameVn}</h3>
              <p className="text-sm text-gray-500">{nextLesson.name}</p>
              <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  📝 {nextLesson.words?.length || 0} từ vựng
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate(`/english/${nextLesson.id}`)}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-95"
          >
            <Play className="w-6 h-6" />
            Học ngay!
          </button>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl p-4 text-center shadow">
          <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-800">{stats.totalPoints}</p>
          <p className="text-xs text-gray-500">Điểm</p>
        </div>
        <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl p-4 text-center shadow">
          <BookOpen className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-800">{stats.lessonsCompleted}</p>
          <p className="text-xs text-gray-500">Bài học</p>
        </div>
        <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-4 text-center shadow">
          <Clock className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-800">{stats.todayMinutes}</p>
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

        {badges.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {badges.slice(0, 5).map((badge) => (
              <div
                key={badge.id}
                className="flex-shrink-0 w-20 p-3 rounded-2xl text-center bg-gradient-to-br from-yellow-100 to-orange-100 shadow"
              >
                <div className="text-3xl mb-1">{badge.icon}</div>
                <p className="text-xs font-medium text-gray-600 truncate">{badge.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="text-4xl mb-2">🎯</div>
            <p className="text-sm text-gray-500">Hoàn thành bài học để nhận huy hiệu!</p>
          </div>
        )}
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
              <p className="text-xs text-white/80">
                {englishTopics.filter(t => t.status === 'completed').length}/{englishTopics.length} bài
              </p>
            </div>
          </button>

          <button
            onClick={() => navigate('/learn/lessons')}
            className="bg-gradient-to-br from-gray-300 to-gray-400 text-white p-4 rounded-2xl flex items-center gap-3 shadow opacity-70"
          >
            <span className="text-3xl">🔢</span>
            <div className="text-left">
              <p className="font-bold">Toán</p>
              <p className="text-xs text-white/80">Sắp ra mắt</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/learn/lessons')}
            className="bg-gradient-to-br from-gray-300 to-gray-400 text-white p-4 rounded-2xl flex items-center gap-3 shadow opacity-70"
          >
            <span className="text-3xl">🔬</span>
            <div className="text-left">
              <p className="font-bold">Khoa học</p>
              <p className="text-xs text-white/80">Sắp ra mắt</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/learn/lessons')}
            className="bg-gradient-to-br from-gray-300 to-gray-400 text-white p-4 rounded-2xl flex items-center gap-3 shadow opacity-70"
          >
            <span className="text-3xl">📖</span>
            <div className="text-left">
              <p className="font-bold">Tiếng Việt</p>
              <p className="text-xs text-white/80">Sắp ra mắt</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
