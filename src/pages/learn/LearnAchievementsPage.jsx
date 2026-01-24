// src/pages/learn/LearnAchievementsPage.jsx
// Student Achievements Page - Connected to real progress
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  getStudentProgress,
  calculateTotalPoints,
  getCompletedLessonsCount,
  calculateStreak,
  getUnlockedBadges,
  getNextBadge,
  getClassLeaderboard,
  BADGES
} from '../../services/studentProgress';
import {
  Trophy, Star, Medal, Crown, Flame, Target,
  BookOpen, Clock, Award, TrendingUp, Users, Loader2
} from 'lucide-react';

export default function LearnAchievementsPage() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('badges');
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalPoints: 0,
    lessonsCompleted: 0,
    streak: 0,
  });
  const [unlockedBadges, setUnlockedBadges] = useState([]);
  const [nextBadge, setNextBadge] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadData();
  }, [profile?.id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const progressData = await getStudentProgress(profile?.id);

      // Calculate stats
      const totalPoints = calculateTotalPoints(progressData);
      const lessonsCompleted = getCompletedLessonsCount(progressData);
      const streak = calculateStreak(progressData);

      setStats({ totalPoints, lessonsCompleted, streak });

      // Get badges
      const badges = getUnlockedBadges(progressData);
      setUnlockedBadges(badges);

      const next = getNextBadge(progressData);
      setNextBadge(next);

      // Get leaderboard if has class
      if (profile?.class_id) {
        const lb = await getClassLeaderboard(profile.class_id);
        setLeaderboard(lb);
      }

      // Build history from progress
      const historyItems = Object.entries(progressData)
        .map(([lessonId, data]) => ({
          date: data.completed_at,
          activity: `Hoàn thành bài "${lessonId.replace('english_', '')}"`,
          points: data.score || 0,
          icon: '📚',
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 10);

      setHistory(historyItems);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </div>
    );
  }

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
            <p className="text-2xl font-bold">{stats.totalPoints}</p>
            <p className="text-xs text-white/80">Điểm</p>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-2xl p-3 text-center">
            <Medal className="w-6 h-6 mx-auto mb-1" />
            <p className="text-2xl font-bold">{unlockedBadges.length}</p>
            <p className="text-xs text-white/80">Huy hiệu</p>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-2xl p-3 text-center">
            <Flame className="w-6 h-6 mx-auto mb-1" />
            <p className="text-2xl font-bold">{stats.streak}</p>
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
          {/* All Badges */}
          <div className="bg-white rounded-3xl p-5 shadow-lg">
            <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              Tất cả huy hiệu ({unlockedBadges.length}/{BADGES.length})
            </h2>

            <div className="grid grid-cols-3 gap-3">
              {BADGES.map((badge) => {
                const isUnlocked = unlockedBadges.some(b => b.id === badge.id);

                return (
                  <div
                    key={badge.id}
                    className={`p-4 rounded-2xl text-center transition-all ${
                      isUnlocked
                        ? 'bg-gradient-to-br from-yellow-50 to-orange-50 shadow hover:shadow-lg'
                        : 'bg-gray-100 opacity-50'
                    }`}
                  >
                    <div className={`text-4xl mb-2 ${isUnlocked ? '' : 'grayscale'}`}>
                      {isUnlocked ? badge.icon : '🔒'}
                    </div>
                    <p className="font-medium text-sm text-gray-700">{badge.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{badge.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Next Badge to Unlock */}
          {nextBadge && (
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-3xl shadow">
                  {nextBadge.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-purple-600">Huy hiệu tiếp theo</p>
                  <p className="font-bold text-purple-800">{nextBadge.name}</p>
                  <p className="text-xs text-purple-500">{nextBadge.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-purple-600">Còn thiếu</p>
                  <p className="font-bold text-purple-800">{nextBadge.remaining}</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-3">
                <div className="h-2 bg-purple-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                    style={{ width: `${(nextBadge.current / nextBadge.requirement) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-purple-500 mt-1 text-right">
                  {nextBadge.current}/{nextBadge.requirement}
                </p>
              </div>
            </div>
          )}
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

          {leaderboard.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Chưa có dữ liệu xếp hạng</p>
              <p className="text-sm text-gray-400 mt-1">
                Hoàn thành bài học để lên bảng xếp hạng!
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-2">
              {leaderboard.map((student) => {
                const isMe = student.id === profile?.id;

                return (
                  <div
                    key={student.id}
                    className={`flex items-center gap-3 p-3 rounded-2xl transition-all ${
                      isMe
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
                      {student.avatar_url ? (
                        <img src={student.avatar_url} alt="" className="w-12 h-12 rounded-full" />
                      ) : (
                        '🧒'
                      )}
                    </div>

                    {/* Name */}
                    <div className="flex-1">
                      <p className={`font-bold ${isMe ? 'text-orange-600' : 'text-gray-800'}`}>
                        {student.full_name} {isMe && '(Bạn)'}
                      </p>
                    </div>

                    {/* Points */}
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-5 h-5 fill-yellow-400" />
                      <span className="font-bold">{student.points}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Your Position */}
          {leaderboard.length > 0 && (
            <div className="p-4 border-t border-gray-100">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-600">Vị trí của bạn</p>
                <p className="text-3xl font-bold text-blue-600">
                  #{leaderboard.find(s => s.id === profile?.id)?.rank || '-'}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-3xl p-5 shadow-lg">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            Lịch sử học tập
          </h2>

          {history.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Chưa có lịch sử học tập</p>
              <p className="text-sm text-gray-400 mt-1">
                Hoàn thành bài học đầu tiên để bắt đầu!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item, index) => (
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
                      {new Date(item.date).toLocaleDateString('vi-VN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">+{item.points}</p>
                    <p className="text-xs text-gray-400">điểm</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
