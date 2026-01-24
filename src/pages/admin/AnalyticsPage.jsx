// src/pages/admin/AnalyticsPage.jsx
// Trang báo cáo phân tích
import React, { useState, useEffect } from 'react';
import {
  Users, TrendingUp, Clock, Target, Award, BookOpen,
  Calendar, RefreshCw, ArrowUp, ArrowDown, Download
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { supabase } from '../../lib/supabase';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');
  const [stats, setStats] = useState({
    dailyActiveUsers: [],
    conversionRate: 0,
    freeUsers: 0,
    premiumUsers: 0,
    popularLessons: [],
    avgStudyTime: 0,
    retentionRate: 0,
    userGrowth: [],
    roleDistribution: [],
    activityByHour: [],
  });

  useEffect(() => {
    loadAnalytics();
  }, [period]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);

      // Get date range
      const now = new Date();
      let startDate;
      switch (period) {
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }

      // Load all data in parallel
      const [
        profilesRes,
        activityRes,
        lessonsRes,
        plansRes
      ] = await Promise.all([
        supabase.from('profiles').select('id, role, plan_id, created_at'),
        supabase.from('user_activity')
          .select('user_id, activity_type, duration, created_at')
          .gte('created_at', startDate.toISOString()),
        supabase.from('lessons').select('id, title'),
        supabase.from('plans').select('id, name, price')
      ]);

      const profiles = profilesRes.data || [];
      const activities = activityRes.data || [];
      const lessons = lessonsRes.data || [];
      const plans = plansRes.data || [];

      // Calculate Daily Active Users
      const dauByDate = {};
      activities.forEach(a => {
        const date = new Date(a.created_at).toISOString().split('T')[0];
        if (!dauByDate[date]) dauByDate[date] = new Set();
        dauByDate[date].add(a.user_id);
      });
      const dailyActiveUsers = Object.entries(dauByDate)
        .map(([date, users]) => ({ date, users: users.size }))
        .sort((a, b) => a.date.localeCompare(b.date));

      // Calculate conversion rate (Free to Premium)
      const freeUsers = profiles.filter(p => !p.plan_id || p.plan_id === null).length;
      const premiumUsers = profiles.filter(p => p.plan_id).length;
      const conversionRate = profiles.length > 0
        ? Math.round((premiumUsers / profiles.length) * 100)
        : 0;

      // Calculate popular lessons from activity
      const lessonViews = {};
      activities
        .filter(a => a.activity_type === 'lesson_view' || a.activity_type === 'lesson_complete')
        .forEach(a => {
          // Giả sử activity_data chứa lesson_id
          const lessonId = a.lesson_id;
          if (lessonId) {
            if (!lessonViews[lessonId]) lessonViews[lessonId] = 0;
            lessonViews[lessonId]++;
          }
        });
      const popularLessons = Object.entries(lessonViews)
        .map(([id, views]) => {
          const lesson = lessons.find(l => l.id === id);
          return { id, title: lesson?.title || 'Bài học', views };
        })
        .sort((a, b) => b.views - a.views)
        .slice(0, 10);

      // Calculate average study time
      const totalDuration = activities.reduce((sum, a) => sum + (a.duration || 0), 0);
      const uniqueUsers = new Set(activities.map(a => a.user_id)).size;
      const avgStudyTime = uniqueUsers > 0 ? Math.round(totalDuration / uniqueUsers / 60) : 0; // in minutes

      // Calculate retention rate (users active in last 7 days vs 30 days ago)
      const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const recentActive = new Set(
        activities
          .filter(a => new Date(a.created_at) >= last7Days)
          .map(a => a.user_id)
      );
      const retentionRate = uniqueUsers > 0 ? Math.round((recentActive.size / uniqueUsers) * 100) : 0;

      // User growth by date
      const usersByDate = {};
      profiles.forEach(p => {
        const date = new Date(p.created_at).toISOString().split('T')[0];
        if (!usersByDate[date]) usersByDate[date] = 0;
        usersByDate[date]++;
      });
      const userGrowth = Object.entries(usersByDate)
        .filter(([date]) => new Date(date) >= startDate)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));

      // Cumulative user growth
      let cumulative = 0;
      userGrowth.forEach(item => {
        cumulative += item.count;
        item.total = cumulative;
      });

      // Role distribution
      const roleCount = {};
      profiles.forEach(p => {
        const role = p.role || 'unknown';
        if (!roleCount[role]) roleCount[role] = 0;
        roleCount[role]++;
      });
      const roleDistribution = Object.entries(roleCount).map(([role, count]) => ({
        name: getRoleName(role),
        value: count
      }));

      // Activity by hour
      const hourlyActivity = Array(24).fill(0);
      activities.forEach(a => {
        const hour = new Date(a.created_at).getHours();
        hourlyActivity[hour]++;
      });
      const activityByHour = hourlyActivity.map((count, hour) => ({
        hour: `${hour}:00`,
        activities: count
      }));

      setStats({
        dailyActiveUsers,
        conversionRate,
        freeUsers,
        premiumUsers,
        popularLessons,
        avgStudyTime,
        retentionRate,
        userGrowth,
        roleDistribution,
        activityByHour,
        totalUsers: profiles.length,
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleName = (role) => {
    const names = {
      super_admin: 'Super Admin',
      school_admin: 'Admin trường',
      department_head: 'Trưởng bộ môn',
      teacher: 'Giáo viên',
      parent: 'Phụ huynh',
      student: 'Học sinh',
    };
    return names[role] || role;
  };

  const formatChartDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Báo cáo Phân tích</h1>
          <p className="text-gray-600">Thống kê hoạt động và người dùng</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">7 ngày qua</option>
            <option value="month">Tháng này</option>
            <option value="year">Năm nay</option>
          </select>
          <button
            onClick={loadAnalytics}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <RefreshCw className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Tổng người dùng</p>
              <p className="text-2xl font-bold mt-1">{stats.totalUsers?.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-sm">
            <span className="text-blue-100">
              {stats.premiumUsers} Premium / {stats.freeUsers} Free
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Tỷ lệ chuyển đổi</p>
              <p className="text-2xl font-bold mt-1">{stats.conversionRate}%</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <p className="text-green-100 text-sm mt-3">Free → Premium</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Thời gian học TB</p>
              <p className="text-2xl font-bold mt-1">{stats.avgStudyTime} phút</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <p className="text-purple-100 text-sm mt-3">Mỗi người dùng</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Tỷ lệ giữ chân</p>
              <p className="text-2xl font-bold mt-1">{stats.retentionRate}%</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
          </div>
          <p className="text-orange-100 text-sm mt-3">7 ngày gần nhất</p>
        </div>
      </div>

      {/* Daily Active Users Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Người dùng hoạt động hàng ngày (DAU)
        </h3>
        <div className="h-[300px]">
          {stats.dailyActiveUsers.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.dailyActiveUsers}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatChartDate}
                  tick={{ fontSize: 12 }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  labelFormatter={(label) => `Ngày: ${formatChartDate(label)}`}
                  formatter={(value) => [`${value} người`, 'DAU']}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  name="Người dùng"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fill="url(#colorUsers)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Chưa có dữ liệu hoạt động
            </div>
          )}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Tăng trưởng người dùng
          </h3>
          <div className="h-[280px]">
            {stats.userGrowth.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatChartDate}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    labelFormatter={(label) => `Ngày: ${formatChartDate(label)}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    name="Đăng ký mới"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    name="Tổng cộng"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Chưa có dữ liệu
              </div>
            )}
          </div>
        </div>

        {/* Role Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Phân bố vai trò
          </h3>
          <div className="h-[280px]">
            {stats.roleDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.roleDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {stats.roleDistribution.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Chưa có dữ liệu
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Activity by Hour & Popular Lessons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity by Hour */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Hoạt động theo giờ
          </h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.activityByHour}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar
                  dataKey="activities"
                  name="Hoạt động"
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Lessons */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Bài học phổ biến nhất
          </h3>
          <div className="space-y-3 max-h-[280px] overflow-y-auto">
            {stats.popularLessons.length > 0 ? (
              stats.popularLessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-400' :
                    index === 2 ? 'bg-orange-400' : 'bg-gray-300'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{lesson.title}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-blue-600">{lesson.views}</p>
                    <p className="text-xs text-gray-500">lượt xem</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-[200px] text-gray-500">
                <div className="text-center">
                  <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p>Chưa có dữ liệu bài học</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Phễu chuyển đổi
        </h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-xl relative">
            <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
            <p className="text-sm text-gray-600 mt-1">Tổng đăng ký</p>
            <div className="absolute -right-2 top-1/2 -translate-y-1/2 text-gray-300 text-2xl">→</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-xl relative">
            <p className="text-3xl font-bold text-green-600">
              {stats.dailyActiveUsers.length > 0
                ? Math.max(...stats.dailyActiveUsers.map(d => d.users))
                : 0}
            </p>
            <p className="text-sm text-gray-600 mt-1">DAU cao nhất</p>
            <div className="absolute -right-2 top-1/2 -translate-y-1/2 text-gray-300 text-2xl">→</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-xl relative">
            <p className="text-3xl font-bold text-purple-600">{stats.premiumUsers}</p>
            <p className="text-sm text-gray-600 mt-1">Premium</p>
            <div className="absolute -right-2 top-1/2 -translate-y-1/2 text-gray-300 text-2xl">→</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-xl">
            <p className="text-3xl font-bold text-orange-600">{stats.conversionRate}%</p>
            <p className="text-sm text-gray-600 mt-1">Tỷ lệ chuyển đổi</p>
          </div>
        </div>
      </div>
    </div>
  );
}
