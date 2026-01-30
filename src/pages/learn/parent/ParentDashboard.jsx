// src/pages/learn/parent/ParentDashboard.jsx
// Parent Dashboard - Real Statistics and Data
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../lib/supabase';
import {
  getStudentProgress,
  calculateTotalPoints,
  getCompletedLessonsCount,
  getTodayProgress,
  calculateStreak,
  getUnlockedBadges,
  getTotalLearningTime
} from '../../../services/studentProgress';
import {
  BarChart3, Clock, BookOpen, Trophy, Star, Flame,
  TrendingUp, ArrowRight, Calendar, Target, MessageSquare,
  Settings, ChevronRight, ArrowLeft, Loader2, Lock, Bell, Eye
} from 'lucide-react';

export default function ParentDashboard() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('progress');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    completedLessons: 0,
    totalLessons: 50,
    avgScore: 0,
    totalStudyTime: 0,
    streak: 0,
    xpPoints: 0,
    badges: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [weeklyData, setWeeklyData] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [teachers, setTeachers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [badges, setBadges] = useState([]);

  const childName = profile?.full_name || 'Be';

  useEffect(() => {
    if (profile?.id) {
      loadAllData();
    }
  }, [profile?.id]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      // Load student progress
      const progress = await getStudentProgress(profile.id);

      // Calculate stats
      const totalPoints = calculateTotalPoints(progress);
      const completedLessons = getCompletedLessonsCount(progress);
      const streak = calculateStreak(progress);
      const totalMinutes = getTotalLearningTime(progress);
      const unlockedBadges = getUnlockedBadges(progress);

      // Calculate average score
      const scores = Object.values(progress).filter(p => p.score).map(p => p.score);
      const avgScore = scores.length > 0
        ? (scores.reduce((sum, s) => sum + s, 0) / scores.length).toFixed(1)
        : 0;

      setStats({
        completedLessons,
        totalLessons: 50,
        avgScore,
        totalStudyTime: Math.round(totalMinutes / 60),
        streak,
        xpPoints: totalPoints,
        badges: unlockedBadges.length,
      });

      setBadges(unlockedBadges);

      // Build weekly data (lessons per day)
      const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
      const today = new Date();
      const weekData = [0, 0, 0, 0, 0, 0, 0];

      Object.values(progress).forEach(p => {
        if (p.completed_at) {
          const completedDate = new Date(p.completed_at);
          const diffDays = Math.floor((today - completedDate) / (1000 * 60 * 60 * 24));
          if (diffDays >= 0 && diffDays < 7) {
            const dayIndex = (today.getDay() - diffDays + 7) % 7;
            weekData[dayIndex]++;
          }
        }
      });

      setWeeklyData(weekData);

      // Build recent activities from progress
      const activities = Object.entries(progress)
        .filter(([_, p]) => p.completed_at)
        .map(([lessonId, p]) => ({
          id: lessonId,
          type: lessonId.startsWith('english_') ? 'lesson' : lessonId.startsWith('math-') ? 'math' : 'other',
          title: lessonId.replace('english_', '').replace('math-', 'Toan ').replace(/-/g, ' '),
          time: formatTimeAgo(p.completed_at),
          score: p.score || 0,
        }))
        .sort((a, b) => new Date(b.time) - new Date(a.time))
        .slice(0, 10);

      setRecentActivities(activities);

      // Load teachers (if student is in a class)
      if (profile.class_id) {
        const { data: classData } = await supabase
          .from('classes')
          .select('teacher_id, profiles:teacher_id(id, full_name)')
          .eq('id', profile.class_id)
          .single();

        if (classData?.profiles) {
          setTeachers([classData.profiles]);
        }
      }

      // Or get teachers from class_students
      const { data: classStudentData } = await supabase
        .from('class_students')
        .select(`
          class_id,
          classes:class_id(
            teacher_id,
            profiles:teacher_id(id, full_name)
          )
        `)
        .eq('student_id', profile.id);

      if (classStudentData?.length > 0) {
        const teacherList = classStudentData
          .map(cs => cs.classes?.profiles)
          .filter(t => t);
        setTeachers(teacherList);
      }

      // Load messages
      const { data: messagesData } = await supabase
        .from('messages')
        .select(`
          id, content, created_at, is_read,
          sender:sender_id(full_name)
        `)
        .eq('student_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(10);

      setMessages(messagesData || []);

    } catch (err) {
      console.error('Load data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Vua xong';
    if (diffMins < 60) return `${diffMins} phut truoc`;
    if (diffHours < 24) return `${diffHours} gio truoc`;
    if (diffDays === 1) return 'Hom qua';
    return `${diffDays} ngay truoc`;
  };

  const progressPercent = Math.round((stats.completedLessons / stats.totalLessons) * 100);
  const maxWeekly = Math.max(...weeklyData, 1);

  const handleBackToChild = () => {
    sessionStorage.removeItem('parentModeVerified');
    sessionStorage.removeItem('parentModeTime');
    navigate('/learn');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBackToChild}
              className="p-2 bg-white/20 rounded-full hover:bg-white/30"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-bold">Khu vuc Phu huynh</h1>
              <p className="text-white/80 text-sm">Con: {childName}</p>
            </div>
          </div>
          <button
            onClick={handleBackToChild}
            className="px-3 py-1.5 bg-white/20 rounded-full text-sm hover:bg-white/30"
          >
            Quay lai
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex border-b bg-white sticky top-[72px] z-30">
        <button
          onClick={() => setActiveTab('progress')}
          className={`flex-1 py-3 flex items-center justify-center gap-2 font-medium ${
            activeTab === 'progress'
              ? 'border-b-2 border-indigo-600 text-indigo-600'
              : 'text-gray-500'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Tien do
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`flex-1 py-3 flex items-center justify-center gap-2 font-medium relative ${
            activeTab === 'messages'
              ? 'border-b-2 border-indigo-600 text-indigo-600'
              : 'text-gray-500'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Tin nhan
          {messages.filter(m => !m.is_read).length > 0 && (
            <span className="absolute top-2 right-1/4 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
              {messages.filter(m => !m.is_read).length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-3 flex items-center justify-center gap-2 font-medium ${
            activeTab === 'settings'
              ? 'border-b-2 border-indigo-600 text-indigo-600'
              : 'text-gray-500'
          }`}
        >
          <Settings className="w-4 h-4" />
          Cai dat
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 pb-20">
        {activeTab === 'progress' && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-500">Bai hoan thanh</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">{stats.completedLessons}</p>
                <p className="text-xs text-gray-400">/{stats.totalLessons} bai</p>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                    <Star className="w-5 h-5 text-amber-600" />
                  </div>
                  <span className="text-sm text-gray-500">Diem trung binh</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">{stats.avgScore}</p>
                <p className="text-xs text-gray-400">/10 diem</p>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-sm text-gray-500">Thoi gian hoc</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">{stats.totalStudyTime}</p>
                <p className="text-xs text-gray-400">gio tong cong</p>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <Flame className="w-5 h-5 text-orange-600" />
                  </div>
                  <span className="text-sm text-gray-500">Chuoi ngay hoc</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">{stats.streak}</p>
                <p className="text-xs text-gray-400">ngay lien tiep</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-indigo-600" />
                  <span className="font-medium text-gray-800">Tien do tong the</span>
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
                {childName} da hoan thanh {stats.completedLessons}/{stats.totalLessons} bai hoc
              </p>
            </div>

            {/* Weekly Chart */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <span className="font-medium text-gray-800">Bai hoc 7 ngay qua</span>
              </div>
              <div className="flex items-end justify-between h-32 gap-2">
                {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day, i) => (
                  <div key={day} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className={`w-full rounded-t transition-all ${
                        weeklyData[i] > 0 ? 'bg-indigo-500' : 'bg-gray-200'
                      }`}
                      style={{ height: `${Math.max(8, (weeklyData[i] / maxWeekly) * 100)}%` }}
                    />
                    <span className="text-xs text-gray-500">{day}</span>
                    <span className="text-xs font-bold text-gray-700">{weeklyData[i]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Badges */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-600" />
                  <span className="font-medium text-gray-800">Huy hieu ({badges.length})</span>
                </div>
              </div>
              {badges.length > 0 ? (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {badges.map((badge) => (
                    <div
                      key={badge.id}
                      className="flex-shrink-0 w-16 p-2 rounded-xl text-center bg-gradient-to-br from-yellow-100 to-orange-100"
                    >
                      <div className="text-2xl mb-1">{badge.icon}</div>
                      <p className="text-xs text-gray-600 truncate">{badge.name}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  Chua co huy hieu nao. Hay khich le be hoc de nhan huy hieu!
                </p>
              )}
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-800">Hoat dong gan day</span>
              </div>
              <div className="space-y-3">
                {recentActivities.length > 0 ? recentActivities.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.type === 'lesson' ? 'bg-blue-100' :
                        activity.type === 'math' ? 'bg-green-100' : 'bg-purple-100'
                      }`}>
                        {activity.type === 'lesson' && <BookOpen className="w-5 h-5 text-blue-600" />}
                        {activity.type === 'math' && <Target className="w-5 h-5 text-green-600" />}
                        {activity.type === 'other' && <Star className="w-5 h-5 text-purple-600" />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-sm capitalize">{activity.title}</p>
                        <p className="text-xs text-gray-400">{activity.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-full">
                      <Star className="w-3 h-3 text-amber-500" />
                      <span className="text-sm font-medium text-amber-600">{activity.score}</span>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Chua co hoat dong nao
                  </p>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === 'messages' && (
          <>
            {/* Teachers List */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-medium text-gray-800 mb-3">Giao vien cua {childName}</h3>
              {teachers.length > 0 ? (
                <div className="space-y-2">
                  {teachers.map((teacher) => (
                    <button
                      key={teacher.id}
                      onClick={() => navigate('/learn/parent/messages')}
                      className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100"
                    >
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-lg">👩‍🏫</span>
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-gray-800">{teacher.full_name}</p>
                        <p className="text-xs text-gray-500">Giao vien chu nhiem</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  {childName} chua duoc them vao lop hoc nao
                </p>
              )}
            </div>

            {/* Messages */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-medium text-gray-800 mb-3">Tin nhan gan day</h3>
              {messages.length > 0 ? (
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-3 rounded-xl ${msg.is_read ? 'bg-gray-50' : 'bg-blue-50 border border-blue-200'}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-lg">👩‍🏫</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-800 text-sm">
                              {msg.sender?.full_name || 'Giao vien'}
                            </p>
                            {!msg.is_read && (
                              <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">Moi</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{msg.content}</p>
                          <p className="text-xs text-gray-400 mt-1">{formatTimeAgo(msg.created_at)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-8">
                  Chua co tin nhan nao
                </p>
              )}

              {teachers.length > 0 && (
                <button
                  onClick={() => navigate('/learn/parent/messages')}
                  className="w-full mt-4 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700"
                >
                  Nhan tin voi giao vien
                </button>
              )}
            </div>
          </>
        )}

        {activeTab === 'settings' && (
          <>
            {/* Parent Info */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-medium text-gray-800 mb-3">Thong tin phu huynh</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Ten phu huynh</span>
                  <span className="font-medium">{profile?.parent_name || 'Chua cap nhat'}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">So dien thoai</span>
                  <span className="font-medium">{profile?.parent_phone || 'Chua cap nhat'}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">Ten con</span>
                  <span className="font-medium">{childName}</span>
                </div>
              </div>
            </div>

            {/* PIN Settings */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                <Lock className="w-5 h-5 text-gray-600" />
                Bao mat
              </h3>
              <button
                onClick={() => navigate('/learn/parent/settings')}
                className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100"
              >
                <span className="text-gray-700">Doi ma PIN</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                <Bell className="w-5 h-5 text-gray-600" />
                Thong bao
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-700">Khi con hoan thanh bai</span>
                  <input type="checkbox" defaultChecked className="w-5 h-5 accent-indigo-600" />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-700">Khi co bai tap moi</span>
                  <input type="checkbox" defaultChecked className="w-5 h-5 accent-indigo-600" />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-700">Tin nhan tu giao vien</span>
                  <input type="checkbox" defaultChecked className="w-5 h-5 accent-indigo-600" />
                </div>
              </div>
            </div>

            {/* Study Limits */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                <Eye className="w-5 h-5 text-gray-600" />
                Gioi han hoc tap (sap co)
              </h3>
              <div className="space-y-3 opacity-50">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-700">Gioi han thoi gian/ngay</span>
                  <span className="text-gray-400">60 phut</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-700">Gio duoc hoc</span>
                  <span className="text-gray-400">6:00 - 21:00</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">
                Tinh nang nay dang duoc phat trien
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
