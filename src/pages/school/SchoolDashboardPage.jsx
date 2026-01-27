// src/pages/school/SchoolDashboardPage.jsx
// Dashboard thông minh Real-time cho Nhà trường
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Building2, RefreshCw, Loader2, ChevronDown } from 'lucide-react';

// Dashboard Components
import {
  StatsCards,
  AlertsSection,
  RecentActivities,
  ClassScoresChart,
  AttendanceChart,
  LearningTrendChart,
  TopStudentsTable,
  TopTeachersTable,
  EventsCalendar,
  QuickActions,
} from '../../components/school/dashboard';

// Dashboard Service
import * as dashboardService from '../../services/schoolDashboardService';

// Date range options
const DATE_RANGES = [
  { value: 'today', label: 'Hôm nay' },
  { value: 'week', label: 'Tuần này' },
  { value: 'month', label: 'Tháng này' },
  { value: 'year', label: 'Năm học' },
];

// Format ngày
function formatDate(date) {
  const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
  const day = days[date.getDay()];
  return `${day}, ngày ${date.toLocaleDateString('vi-VN')}`;
}

// Get date range
function getDateRange(range) {
  const end = new Date();
  const start = new Date();

  switch (range) {
    case 'today':
      return { start, end };
    case 'week':
      start.setDate(start.getDate() - 7);
      return { start, end };
    case 'month':
      start.setDate(1);
      return { start, end };
    case 'year':
      start.setMonth(8); // Tháng 9 năm học
      if (start > end) start.setFullYear(start.getFullYear() - 1);
      return { start, end };
    default:
      return { start, end };
  }
}

export default function SchoolDashboardPage() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState('week');
  const [lastUpdate, setLastUpdate] = useState(null);

  // Data states
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [activities, setActivities] = useState([]);
  const [classScores, setClassScores] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [learningTrend, setLearningTrend] = useState([]);
  const [topStudents, setTopStudents] = useState([]);
  const [topTeachers, setTopTeachers] = useState([]);
  const [events, setEvents] = useState([]);
  const [sparklineData, setSparklineData] = useState({});
  const [schoolInfo, setSchoolInfo] = useState(null);

  // Load all dashboard data
  const loadDashboardData = useCallback(async () => {
    if (!profile?.school_id) return;

    const schoolId = profile.school_id;
    const { start, end } = getDateRange(dateRange);

    try {
      // Load all data in parallel
      const [
        statsData,
        alertsData,
        activitiesData,
        classScoresData,
        attendanceData,
        trendData,
        studentsData,
        teachersData,
        eventsData,
        schoolData,
      ] = await Promise.all([
        dashboardService.getDashboardStats(schoolId),
        dashboardService.getAlerts(schoolId),
        dashboardService.getRecentActivities(schoolId, 20),
        dashboardService.getClassAverageScores(schoolId),
        dashboardService.getAttendanceStats(schoolId, start, end),
        dashboardService.getLearningTrend(schoolId, 30),
        dashboardService.getTopStudents(schoolId, 10),
        dashboardService.getTopTeachers(schoolId, 5),
        dashboardService.getUpcomingEvents(schoolId, 7),
        supabase.from('schools').select('*').eq('id', schoolId).single(),
      ]);

      setStats(statsData);
      setAlerts(alertsData);
      setActivities(activitiesData);
      setClassScores(classScoresData);
      setAttendanceStats(attendanceData);
      setLearningTrend(trendData);
      setTopStudents(studentsData);
      setTopTeachers(teachersData);
      setEvents(eventsData);
      setSchoolInfo(schoolData.data);
      setLastUpdate(new Date().toISOString());

      // Load sparkline data
      const [teacherSparkline, studentSparkline] = await Promise.all([
        dashboardService.getSparklineData(schoolId, 'teacher'),
        dashboardService.getSparklineData(schoolId, 'student'),
      ]);
      setSparklineData({
        teachers: teacherSparkline,
        students: studentSparkline,
      });
    } catch (err) {
      console.error('Load dashboard error:', err);
    }
  }, [profile?.school_id, dateRange]);

  // Initial load
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await loadDashboardData();
      setLoading(false);
    };
    init();
  }, [loadDashboardData]);

  // Subscribe to realtime updates
  useEffect(() => {
    if (!profile?.school_id) return;

    const subscription = dashboardService.subscribeToActivities(
      profile.school_id,
      async (newActivity) => {
        // Fetch full activity with profile
        const { data } = await supabase
          .from('activity_log')
          .select('*, profiles:user_id (id, full_name, avatar)')
          .eq('id', newActivity.id)
          .single();

        if (data) {
          setActivities(prev => [data, ...prev.slice(0, 19)]);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [profile?.school_id]);

  // Auto refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadDashboardData();
    }, 30000);

    return () => clearInterval(interval);
  }, [loadDashboardData]);

  // Manual refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-gray-500">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  // No school assigned
  if (!profile?.school_id) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
        <Building2 className="w-16 h-16 mx-auto mb-4 text-yellow-600" />
        <h3 className="text-xl font-semibold text-yellow-800 mb-2">Chưa được gán trường</h3>
        <p className="text-yellow-600">Vui lòng liên hệ quản trị viên để được gán trường.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              Xin chào, {profile?.full_name}! 👋
            </h1>
            <p className="text-white/80 mt-1">
              Tổng quan trường {schoolInfo?.name || 'SchoolHub'} - {formatDate(new Date())}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Date Range Selector */}
            <div className="relative">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="appearance-none bg-white/20 text-white px-4 py-2 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer"
              >
                {DATE_RANGES.map(range => (
                  <option key={range.value} value={range.value} className="text-gray-900">
                    {range.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Làm mới</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} sparklineData={sparklineData} loading={false} />

      {/* Alerts Section */}
      <AlertsSection alerts={alerts} loading={false} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ClassScoresChart data={classScores} loading={false} />
            <AttendanceChart
              data={attendanceStats}
              loading={false}
              dateRange={DATE_RANGES.find(r => r.value === dateRange)?.label}
            />
          </div>

          {/* Learning Trend */}
          <LearningTrendChart data={learningTrend} loading={false} />

          {/* Rankings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TopStudentsTable data={topStudents} loading={false} />
            <TopTeachersTable data={topTeachers} loading={false} />
          </div>
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          {/* Recent Activities */}
          <RecentActivities
            activities={activities}
            loading={false}
            onRefresh={handleRefresh}
            lastUpdate={lastUpdate}
          />

          {/* Events Calendar */}
          <EventsCalendar
            events={events}
            loading={false}
            onRefresh={() => dashboardService.getUpcomingEvents(profile.school_id, 7).then(setEvents)}
            schoolId={profile.school_id}
            userId={profile.id}
          />

          {/* Quick Actions */}
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
