// src/pages/learn/LearnHomePage.jsx
// Student Learning Home Page - Improved with real data
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  getStudentProgress,
  calculateTotalPoints,
  getCompletedLessonsCount,
  getTodayProgress,
  calculateStreak,
  getUnlockedBadges,
  getNextLesson,
  getEnglishTopicsWithProgress
} from '../../services/studentProgress';
import {
  BookOpen, Star, Trophy, Flame, Play, ChevronRight,
  Sparkles, Target, Clock, Award, Loader2, ClipboardList,
  AlertCircle
} from 'lucide-react';

export default function LearnHomePage() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const firstName = profile?.full_name?.split(' ').pop() || 'Be';

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
  const [pendingAssignments, setPendingAssignments] = useState([]);
  const [continueLearning, setContinueLearning] = useState(null);

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

      // Check for continue learning (in-progress lesson)
      const inProgress = Object.entries(progressData).find(([id, p]) => p.status === 'in_progress');
      if (inProgress) {
        setContinueLearning({
          id: inProgress[0],
          progress: inProgress[1],
        });
      }

      // Load pending assignments
      if (profile?.class_id) {
        const { data: assignmentsData } = await supabase
          .from('assignments')
          .select(`
            id, title, due_date, note,
            teacher:teacher_id(full_name),
            lesson:lesson_id(title, subject_id)
          `)
          .eq('class_id', profile.class_id)
          .eq('status', 'active')
          .gte('due_date', new Date().toISOString().split('T')[0])
          .order('due_date', { ascending: true })
          .limit(3);

        // Check which ones student hasn't submitted
        if (assignmentsData?.length > 0) {
          const { data: submissions } = await supabase
            .from('student_assignments')
            .select('assignment_id')
            .eq('student_id', profile.id)
            .in('status', ['submitted', 'graded']);

          const submittedIds = new Set(submissions?.map(s => s.assignment_id) || []);
          const pending = assignmentsData.filter(a => !submittedIds.has(a.id));
          setPendingAssignments(pending);
        }
      }
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDueDate = (date) => {
    const due = new Date(date);
    const today = new Date();
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return 'Hom nay';
    if (diffDays === 1) return 'Ngay mai';
    return `Con ${diffDays} ngay`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 space-y-4 sm:space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-300 rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-20 sm:w-24 h-20 sm:h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <h1 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">
            Xin chao, {firstName}!
          </h1>
          <p className="text-white/90 text-sm sm:text-base mb-3 sm:mb-4">
            {stats.todayMinutes > 0
              ? `Hom nay ban da hoc duoc ${stats.todayMinutes} phut roi!`
              : 'Hay bat dau hoc ngay nao!'}
          </p>

          {/* Today's Progress */}
          <div className="bg-white/20 backdrop-blur rounded-xl sm:rounded-2xl p-3 sm:p-4">
            <div className="flex items-center justify-between mb-1.5 sm:mb-2">
              <span className="font-medium text-sm sm:text-base">Tien do hom nay</span>
              <span className="font-bold text-base sm:text-lg">{todayProgress}%</span>
            </div>
            <div className="h-3 sm:h-4 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500 relative"
                style={{ width: `${todayProgress}%` }}
              >
                {todayProgress > 10 && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 bg-yellow-300 rounded-full border-2 border-white flex items-center justify-center">
                    <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-orange-500" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats - 4 cards */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-gradient-to-br from-red-100 to-orange-100 rounded-xl p-2.5 sm:p-3 text-center shadow">
          <div className="text-lg sm:text-2xl mb-0.5">🔥</div>
          <p className="text-sm sm:text-lg font-bold text-gray-800">{stats.streak}</p>
          <p className="text-[8px] sm:text-xs text-gray-500">Chuoi</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-100 to-amber-100 rounded-xl p-2.5 sm:p-3 text-center shadow">
          <div className="text-lg sm:text-2xl mb-0.5">⭐</div>
          <p className="text-sm sm:text-lg font-bold text-gray-800">{stats.totalPoints}</p>
          <p className="text-[8px] sm:text-xs text-gray-500">Diem</p>
        </div>
        <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl p-2.5 sm:p-3 text-center shadow">
          <div className="text-lg sm:text-2xl mb-0.5">📚</div>
          <p className="text-sm sm:text-lg font-bold text-gray-800">{stats.lessonsCompleted}</p>
          <p className="text-[8px] sm:text-xs text-gray-500">Bai hoc</p>
        </div>
        <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-2.5 sm:p-3 text-center shadow">
          <div className="text-lg sm:text-2xl mb-0.5">🏆</div>
          <p className="text-sm sm:text-lg font-bold text-gray-800">{badges.length}</p>
          <p className="text-[8px] sm:text-xs text-gray-500">Huy hieu</p>
        </div>
      </div>

      {/* Streak Card */}
      {stats.streak > 0 && (
        <div className="bg-gradient-to-r from-red-400 to-orange-400 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-white flex items-center gap-3 sm:gap-4 shadow-lg">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            <Flame className="w-7 h-7 sm:w-10 sm:h-10 text-yellow-200 animate-pulse" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white/80 text-xs sm:text-sm">Chuoi ngay hoc</p>
            <p className="text-2xl sm:text-3xl font-bold">{stats.streak} ngay 🔥</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-xs sm:text-sm text-white/80">Tiep tuc nao!</p>
            <p className="text-base sm:text-lg font-bold">+{stats.streak * 10} diem</p>
          </div>
        </div>
      )}

      {/* Continue Learning Card */}
      {continueLearning && (
        <div className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-lg border-2 border-amber-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2">
              <Play className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
              Tiep tuc hoc
            </h2>
            <span className="text-[10px] sm:text-xs bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full">
              Dang hoc
            </span>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center text-3xl shadow-inner flex-shrink-0">
              📖
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-800 text-sm sm:text-base truncate">
                {continueLearning.id.replace('english_', '').replace('math-', 'Toan ').replace('vietnamese-', 'Tieng Viet ')}
              </h3>
              <p className="text-xs text-gray-500">Tien do: {continueLearning.progress.score || 0}%</p>
            </div>
          </div>

          <button
            onClick={() => {
              const id = continueLearning.id;
              if (id.startsWith('english_')) navigate(`/english/${id.replace('english_', '')}`);
              else if (id.startsWith('math-')) navigate(`/math/${id}`);
              else if (id.startsWith('vietnamese-')) navigate(`/vietnamese/${id}`);
            }}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow active:scale-95 transition-transform"
          >
            <Play className="w-4 h-4 sm:w-5 sm:h-5" />
            Tiep tuc
          </button>
        </div>
      )}

      {/* Next Lesson Card */}
      {nextLesson && !continueLearning && (
        <div className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-lg border-2 border-blue-100">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
              Bai hoc tiep theo
            </h2>
            <span className="text-[10px] sm:text-xs bg-blue-100 text-blue-600 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
              Tieng Anh
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div className="w-14 h-14 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl sm:rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shadow-inner flex-shrink-0">
              {nextLesson.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-800 text-base sm:text-lg truncate">{nextLesson.nameVn}</h3>
              <p className="text-xs sm:text-sm text-gray-500 truncate">{nextLesson.name}</p>
              <div className="flex items-center gap-2 sm:gap-3 mt-0.5 sm:mt-1 text-xs sm:text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  📝 {nextLesson.words?.length || 0} tu vung
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate(`/english/${nextLesson.id}`)}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg flex items-center justify-center gap-2 sm:gap-3 shadow-lg active:scale-95 transition-transform min-h-[44px]"
          >
            <Play className="w-5 h-5 sm:w-6 sm:h-6" />
            Hoc ngay!
          </button>
        </div>
      )}

      {/* New Assignments Section */}
      {pendingAssignments.length > 0 && (
        <div className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-lg border-2 border-orange-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
              Bai tap moi
            </h2>
            <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
              {pendingAssignments.length}
            </span>
          </div>

          <div className="space-y-2">
            {pendingAssignments.slice(0, 2).map((assignment) => (
              <div
                key={assignment.id}
                onClick={() => navigate('/learn/assignments')}
                className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl cursor-pointer hover:bg-orange-100 transition-colors"
              >
                <div className="w-10 h-10 bg-orange-200 rounded-lg flex items-center justify-center text-xl">
                  📝
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 text-sm truncate">{assignment.title}</p>
                  <p className="text-xs text-gray-500">
                    {assignment.teacher?.full_name} • {formatDueDate(assignment.due_date)}
                  </p>
                </div>
                <div className="bg-orange-500 text-white px-2 py-1 rounded-lg text-xs flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Moi
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('/learn/assignments')}
            className="w-full mt-3 py-2 bg-orange-100 text-orange-600 rounded-xl font-medium text-sm flex items-center justify-center gap-1"
          >
            Xem tat ca bai tap <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Subject Quick Links */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-lg">
        <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-1.5 sm:gap-2">
          <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
          Mon hoc
        </h2>

        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <button
            onClick={() => navigate('/learn/lessons')}
            className="bg-gradient-to-br from-blue-400 to-blue-500 text-white p-3 sm:p-4 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3 shadow active:scale-95 transition-transform min-h-[60px]"
          >
            <span className="text-2xl sm:text-3xl">🇬🇧</span>
            <div className="text-left min-w-0">
              <p className="font-bold text-sm sm:text-base">Tieng Anh</p>
              <p className="text-[10px] sm:text-xs text-white/80 truncate">
                {englishTopics.filter(t => t.status === 'completed').length}/{englishTopics.length} bai
              </p>
            </div>
          </button>

          <button
            onClick={() => navigate('/learn/lessons')}
            className="bg-gradient-to-br from-green-400 to-green-500 text-white p-3 sm:p-4 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3 shadow active:scale-95 transition-transform min-h-[60px]"
          >
            <span className="text-2xl sm:text-3xl">🔢</span>
            <div className="text-left min-w-0">
              <p className="font-bold text-sm sm:text-base">Toan</p>
              <p className="text-[10px] sm:text-xs text-white/80">Hoc ngay</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/learn/lessons')}
            className="bg-gradient-to-br from-purple-400 to-purple-500 text-white p-3 sm:p-4 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3 shadow active:scale-95 transition-transform min-h-[60px]"
          >
            <span className="text-2xl sm:text-3xl">🔬</span>
            <div className="text-left min-w-0">
              <p className="font-bold text-sm sm:text-base">Khoa hoc</p>
              <p className="text-[10px] sm:text-xs text-white/80">Hoc ngay</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/learn/lessons')}
            className="bg-gradient-to-br from-orange-400 to-orange-500 text-white p-3 sm:p-4 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3 shadow active:scale-95 transition-transform min-h-[60px]"
          >
            <span className="text-2xl sm:text-3xl">📖</span>
            <div className="text-left min-w-0">
              <p className="font-bold text-sm sm:text-base">Tieng Viet</p>
              <p className="text-[10px] sm:text-xs text-white/80">Hoc ngay</p>
            </div>
          </button>
        </div>
      </div>

      {/* Badges Section */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-lg">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-1.5 sm:gap-2">
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
            Huy hieu cua ban
          </h2>
          <button
            onClick={() => navigate('/learn/achievements')}
            className="text-orange-500 text-xs sm:text-sm font-medium flex items-center gap-0.5 sm:gap-1 active:opacity-70 min-h-[44px] px-2"
          >
            Xem tat ca
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {badges.length > 0 ? (
          <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 -mx-1 px-1">
            {badges.slice(0, 5).map((badge) => (
              <div
                key={badge.id}
                className="flex-shrink-0 w-16 sm:w-20 p-2 sm:p-3 rounded-xl sm:rounded-2xl text-center bg-gradient-to-br from-yellow-100 to-orange-100 shadow"
              >
                <div className="text-2xl sm:text-3xl mb-0.5 sm:mb-1">{badge.icon}</div>
                <p className="text-[10px] sm:text-xs font-medium text-gray-600 truncate">{badge.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-3 sm:py-4">
            <div className="text-3xl sm:text-4xl mb-1.5 sm:mb-2">🎯</div>
            <p className="text-xs sm:text-sm text-gray-500">Hoan thanh bai hoc de nhan huy hieu!</p>
          </div>
        )}
      </div>
    </div>
  );
}
