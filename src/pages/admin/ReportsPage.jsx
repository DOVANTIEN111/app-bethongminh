// src/pages/admin/ReportsPage.jsx
// Trang báo cáo chi tiết với chức năng xuất Excel/PDF
import React, { useState, useEffect } from 'react';
import {
  FileText, Download, Users, BookOpen, DollarSign, School,
  Loader2, Calendar, TrendingUp, TrendingDown, RefreshCw,
  ChevronDown, Filter, FileSpreadsheet
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { supabase } from '../../lib/supabase';
import * as XLSX from 'xlsx';

const TABS = [
  { id: 'users', label: 'Người dùng', icon: Users },
  { id: 'learning', label: 'Học tập', icon: BookOpen },
  { id: 'revenue', label: 'Doanh thu', icon: DollarSign },
  { id: 'schools', label: 'Trường học', icon: School },
];

const PERIODS = [
  { id: '7days', label: '7 ngày qua' },
  { id: '30days', label: '30 ngày qua' },
  { id: 'month', label: 'Tháng này' },
  { id: 'year', label: 'Năm nay' },
];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('users');
  const [period, setPeriod] = useState('30days');
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [data, setData] = useState({
    users: { chart: [], table: [], stats: {} },
    learning: { chart: [], table: [], stats: {} },
    revenue: { chart: [], table: [], stats: {} },
    schools: { chart: [], table: [], stats: {} },
  });

  useEffect(() => {
    loadReportData();
  }, [period]);

  const getDateRange = () => {
    const now = new Date();
    let startDate;
    switch (period) {
      case '7days':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30days':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
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
    return { startDate, endDate: now };
  };

  const loadReportData = async () => {
    setLoading(true);
    try {
      const { startDate, endDate } = getDateRange();

      // Load all data in parallel
      const [
        profilesRes,
        schoolsRes,
        lessonsRes,
        progressRes,
        transactionsRes,
      ] = await Promise.all([
        supabase.from('profiles').select('id, role, plan_id, created_at, full_name, email'),
        supabase.from('schools').select('id, name, created_at, is_active'),
        supabase.from('lessons').select('id, title, subject_id'),
        supabase.from('student_progress').select('id, student_id, lesson_id, score, completed, completed_at, created_at'),
        supabase.from('transactions').select('id, user_id, amount, status, plan_id, created_at'),
      ]);

      const profiles = profilesRes.data || [];
      const schools = schoolsRes.data || [];
      const lessons = lessonsRes.data || [];
      const progress = progressRes.data || [];
      const transactions = transactionsRes.data || [];

      // Process user data
      const usersData = processUsersData(profiles, startDate);

      // Process learning data
      const learningData = processLearningData(progress, lessons, startDate);

      // Process revenue data
      const revenueData = processRevenueData(transactions, startDate);

      // Process schools data
      const schoolsData = processSchoolsData(schools, profiles, startDate);

      setData({
        users: usersData,
        learning: learningData,
        revenue: revenueData,
        schools: schoolsData,
      });
    } catch (error) {
      console.error('Error loading report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processUsersData = (profiles, startDate) => {
    // Group by date
    const byDate = {};
    const recentUsers = [];

    profiles.forEach(p => {
      const date = new Date(p.created_at).toISOString().split('T')[0];
      if (new Date(p.created_at) >= startDate) {
        if (!byDate[date]) byDate[date] = { date, total: 0, student: 0, teacher: 0, parent: 0 };
        byDate[date].total++;
        if (p.role === 'student') byDate[date].student++;
        if (p.role === 'teacher') byDate[date].teacher++;
        if (p.role === 'parent') byDate[date].parent++;

        recentUsers.push({
          id: p.id,
          name: p.full_name || 'Chưa cập nhật',
          email: p.email,
          role: getRoleName(p.role),
          plan: p.plan_id ? 'Premium' : 'Free',
          date: new Date(p.created_at).toLocaleDateString('vi-VN'),
        });
      }
    });

    const chart = Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date));

    // Stats
    const totalUsers = profiles.length;
    const newUsers = profiles.filter(p => new Date(p.created_at) >= startDate).length;
    const premiumUsers = profiles.filter(p => p.plan_id).length;
    const freeUsers = totalUsers - premiumUsers;

    // Growth rate
    const previousPeriodStart = new Date(startDate.getTime() - (Date.now() - startDate.getTime()));
    const previousPeriodUsers = profiles.filter(p => {
      const d = new Date(p.created_at);
      return d >= previousPeriodStart && d < startDate;
    }).length;
    const growthRate = previousPeriodUsers > 0
      ? Math.round(((newUsers - previousPeriodUsers) / previousPeriodUsers) * 100)
      : 100;

    return {
      chart,
      table: recentUsers.slice(0, 50),
      stats: {
        totalUsers,
        newUsers,
        premiumUsers,
        freeUsers,
        growthRate,
        conversionRate: totalUsers > 0 ? Math.round((premiumUsers / totalUsers) * 100) : 0,
      }
    };
  };

  const processLearningData = (progress, lessons, startDate) => {
    // Group by date
    const byDate = {};
    const completedLessons = [];

    progress.forEach(p => {
      if (p.completed && p.completed_at) {
        const date = new Date(p.completed_at).toISOString().split('T')[0];
        if (new Date(p.completed_at) >= startDate) {
          if (!byDate[date]) byDate[date] = { date, completed: 0, avgScore: 0, scores: [] };
          byDate[date].completed++;
          if (p.score) byDate[date].scores.push(p.score);

          const lesson = lessons.find(l => l.id === p.lesson_id);
          completedLessons.push({
            lessonId: p.lesson_id,
            lessonName: lesson?.title || 'Bài học',
            studentId: p.student_id,
            score: p.score || 0,
            date: new Date(p.completed_at).toLocaleDateString('vi-VN'),
          });
        }
      }
    });

    // Calculate average scores
    Object.values(byDate).forEach(d => {
      d.avgScore = d.scores.length > 0
        ? Math.round(d.scores.reduce((a, b) => a + b, 0) / d.scores.length)
        : 0;
      delete d.scores;
    });

    const chart = Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date));

    // Stats
    const totalCompleted = progress.filter(p => p.completed).length;
    const recentCompleted = progress.filter(p => p.completed && new Date(p.completed_at) >= startDate).length;
    const allScores = progress.filter(p => p.score).map(p => p.score);
    const avgScore = allScores.length > 0
      ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
      : 0;

    // Top lessons
    const lessonCounts = {};
    progress.forEach(p => {
      if (!lessonCounts[p.lesson_id]) lessonCounts[p.lesson_id] = 0;
      lessonCounts[p.lesson_id]++;
    });
    const topLessons = Object.entries(lessonCounts)
      .map(([id, count]) => ({
        id,
        name: lessons.find(l => l.id === id)?.title || 'Bài học',
        count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      chart,
      table: completedLessons.slice(0, 50),
      stats: {
        totalCompleted,
        recentCompleted,
        avgScore,
        topLessons,
        avgTimePerLesson: 15, // mock - would need activity tracking
      }
    };
  };

  const processRevenueData = (transactions, startDate) => {
    // Group by date
    const byDate = {};
    const recentTransactions = [];

    const completedTx = transactions.filter(t => t.status === 'completed');

    completedTx.forEach(t => {
      const date = new Date(t.created_at).toISOString().split('T')[0];
      if (new Date(t.created_at) >= startDate) {
        if (!byDate[date]) byDate[date] = { date, revenue: 0, count: 0 };
        byDate[date].revenue += t.amount || 0;
        byDate[date].count++;

        recentTransactions.push({
          id: t.id,
          userId: t.user_id,
          amount: (t.amount || 0).toLocaleString('vi-VN') + ' VND',
          plan: t.plan_id || 'Premium',
          date: new Date(t.created_at).toLocaleDateString('vi-VN'),
        });
      }
    });

    const chart = Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date));

    // Stats
    const totalRevenue = completedTx.reduce((sum, t) => sum + (t.amount || 0), 0);
    const periodRevenue = completedTx
      .filter(t => new Date(t.created_at) >= startDate)
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    const transactionCount = completedTx.filter(t => new Date(t.created_at) >= startDate).length;
    const avgTransactionValue = transactionCount > 0 ? Math.round(periodRevenue / transactionCount) : 0;

    return {
      chart,
      table: recentTransactions.slice(0, 50),
      stats: {
        totalRevenue,
        periodRevenue,
        transactionCount,
        avgTransactionValue,
        refundRate: 0, // Would need refund tracking
      }
    };
  };

  const processSchoolsData = (schools, profiles, startDate) => {
    // Group by date
    const byDate = {};
    const schoolsList = [];

    schools.forEach(s => {
      const date = new Date(s.created_at).toISOString().split('T')[0];
      if (new Date(s.created_at) >= startDate) {
        if (!byDate[date]) byDate[date] = { date, count: 0 };
        byDate[date].count++;
      }

      const usersInSchool = profiles.filter(p => p.school_id === s.id).length;
      schoolsList.push({
        id: s.id,
        name: s.name,
        users: usersInSchool,
        status: s.is_active ? 'Hoạt động' : 'Tạm ngưng',
        date: new Date(s.created_at).toLocaleDateString('vi-VN'),
      });
    });

    const chart = Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date));

    // Stats
    const totalSchools = schools.length;
    const activeSchools = schools.filter(s => s.is_active).length;
    const newSchools = schools.filter(s => new Date(s.created_at) >= startDate).length;

    // Schools needing attention (no users or inactive)
    const needsAttention = schoolsList.filter(s => s.users === 0 || s.status === 'Tạm ngưng').length;

    return {
      chart,
      table: schoolsList.sort((a, b) => b.users - a.users).slice(0, 50),
      stats: {
        totalSchools,
        activeSchools,
        newSchools,
        needsAttention,
        avgUsersPerSchool: totalSchools > 0
          ? Math.round(profiles.filter(p => p.school_id).length / totalSchools)
          : 0,
      }
    };
  };

  const getRoleName = (role) => {
    const names = {
      super_admin: 'Super Admin',
      school_admin: 'Admin trường',
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

  const exportToExcel = () => {
    setExporting(true);
    try {
      const currentData = data[activeTab];
      const wb = XLSX.utils.book_new();

      // Create worksheet from table data
      const ws = XLSX.utils.json_to_sheet(currentData.table);
      XLSX.utils.book_append_sheet(wb, ws, 'Báo cáo');

      // Create stats worksheet
      const statsArray = Object.entries(currentData.stats)
        .filter(([key]) => !Array.isArray(currentData.stats[key]))
        .map(([key, value]) => ({ 'Chỉ số': key, 'Giá trị': value }));
      const wsStats = XLSX.utils.json_to_sheet(statsArray);
      XLSX.utils.book_append_sheet(wb, wsStats, 'Thống kê');

      // Generate filename
      const date = new Date().toISOString().split('T')[0];
      const tabName = TABS.find(t => t.id === activeTab)?.label || activeTab;
      const filename = `baocao_${tabName}_${date}.xlsx`;

      XLSX.writeFile(wb, filename);
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setExporting(false);
    }
  };

  const currentData = data[activeTab];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FileText className="w-7 h-7 text-blue-500" />
            Báo cáo Chi tiết
          </h1>
          <p className="text-gray-500">Xem và xuất báo cáo thống kê</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {PERIODS.map(p => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
          <button
            onClick={loadReportData}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <RefreshCw className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={exportToExcel}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
          >
            {exporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileSpreadsheet className="w-4 h-4" />
            )}
            Xuất Excel
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm p-1 flex gap-1">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      {activeTab === 'users' && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Người dùng mới"
            value={currentData.stats.newUsers?.toLocaleString()}
            change={currentData.stats.growthRate}
            icon={Users}
            color="blue"
          />
          <StatCard
            label="Tổng người dùng"
            value={currentData.stats.totalUsers?.toLocaleString()}
            icon={Users}
            color="green"
          />
          <StatCard
            label="Premium"
            value={currentData.stats.premiumUsers?.toLocaleString()}
            icon={TrendingUp}
            color="purple"
          />
          <StatCard
            label="Tỷ lệ chuyển đổi"
            value={`${currentData.stats.conversionRate}%`}
            icon={TrendingUp}
            color="orange"
          />
        </div>
      )}

      {activeTab === 'learning' && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Bài hoàn thành"
            value={currentData.stats.recentCompleted?.toLocaleString()}
            icon={BookOpen}
            color="blue"
          />
          <StatCard
            label="Tổng hoàn thành"
            value={currentData.stats.totalCompleted?.toLocaleString()}
            icon={BookOpen}
            color="green"
          />
          <StatCard
            label="Điểm trung bình"
            value={currentData.stats.avgScore}
            icon={TrendingUp}
            color="purple"
          />
          <StatCard
            label="Thời gian TB/bài"
            value={`${currentData.stats.avgTimePerLesson} phút`}
            icon={Calendar}
            color="orange"
          />
        </div>
      )}

      {activeTab === 'revenue' && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Doanh thu kỳ này"
            value={`${(currentData.stats.periodRevenue / 1000000).toFixed(1)}M`}
            icon={DollarSign}
            color="green"
          />
          <StatCard
            label="Tổng doanh thu"
            value={`${(currentData.stats.totalRevenue / 1000000).toFixed(1)}M`}
            icon={DollarSign}
            color="blue"
          />
          <StatCard
            label="Số giao dịch"
            value={currentData.stats.transactionCount?.toLocaleString()}
            icon={TrendingUp}
            color="purple"
          />
          <StatCard
            label="Giá trị TB/GD"
            value={`${(currentData.stats.avgTransactionValue / 1000).toFixed(0)}K`}
            icon={TrendingUp}
            color="orange"
          />
        </div>
      )}

      {activeTab === 'schools' && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Trường mới"
            value={currentData.stats.newSchools?.toLocaleString()}
            icon={School}
            color="blue"
          />
          <StatCard
            label="Tổng trường"
            value={currentData.stats.totalSchools?.toLocaleString()}
            icon={School}
            color="green"
          />
          <StatCard
            label="Đang hoạt động"
            value={currentData.stats.activeSchools?.toLocaleString()}
            icon={TrendingUp}
            color="purple"
          />
          <StatCard
            label="Cần hỗ trợ"
            value={currentData.stats.needsAttention?.toLocaleString()}
            icon={TrendingDown}
            color="orange"
          />
        </div>
      )}

      {/* Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Biểu đồ theo thời gian
        </h3>
        <div className="h-[300px]">
          {currentData.chart.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              {activeTab === 'users' ? (
                <AreaChart data={currentData.chart}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" tickFormatter={formatChartDate} tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip labelFormatter={formatChartDate} />
                  <Legend />
                  <Area type="monotone" dataKey="total" name="Tổng" stroke="#3B82F6" fill="url(#colorTotal)" />
                  <Area type="monotone" dataKey="student" name="Học sinh" stroke="#10B981" fill="#10B98133" />
                  <Area type="monotone" dataKey="teacher" name="Giáo viên" stroke="#8B5CF6" fill="#8B5CF633" />
                </AreaChart>
              ) : activeTab === 'learning' ? (
                <LineChart data={currentData.chart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" tickFormatter={formatChartDate} tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                  <Tooltip labelFormatter={formatChartDate} />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="completed" name="Bài hoàn thành" stroke="#3B82F6" strokeWidth={2} dot={false} />
                  <Line yAxisId="right" type="monotone" dataKey="avgScore" name="Điểm TB" stroke="#10B981" strokeWidth={2} dot={false} />
                </LineChart>
              ) : activeTab === 'revenue' ? (
                <BarChart data={currentData.chart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" tickFormatter={formatChartDate} tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v/1000000).toFixed(1)}M`} />
                  <Tooltip
                    labelFormatter={formatChartDate}
                    formatter={(value) => [`${value.toLocaleString('vi-VN')} VND`, 'Doanh thu']}
                  />
                  <Legend />
                  <Bar dataKey="revenue" name="Doanh thu" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : (
                <BarChart data={currentData.chart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" tickFormatter={formatChartDate} tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip labelFormatter={formatChartDate} />
                  <Legend />
                  <Bar dataKey="count" name="Trường mới" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Chưa có dữ liệu cho khoảng thời gian này
            </div>
          )}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            Dữ liệu chi tiết
          </h3>
          <span className="text-sm text-gray-500">
            {currentData.table.length} bản ghi
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                {currentData.table.length > 0 && Object.keys(currentData.table[0]).map(key => (
                  <th key={key} className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentData.table.length > 0 ? (
                currentData.table.slice(0, 20).map((row, i) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                    {Object.values(row).map((val, j) => (
                      <td key={j} className="px-4 py-3 text-sm text-gray-700">
                        {val}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    Chưa có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {currentData.table.length > 20 && (
          <div className="p-4 text-center border-t bg-gray-50">
            <p className="text-sm text-gray-500">
              Hiển thị 20/{currentData.table.length} bản ghi. Xuất Excel để xem toàn bộ.
            </p>
          </div>
        )}
      </div>

      {/* Top Lessons (for learning tab) */}
      {activeTab === 'learning' && currentData.stats.topLessons?.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Top 10 bài học được học nhiều nhất
          </h3>
          <div className="space-y-3">
            {currentData.stats.topLessons.map((lesson, i) => (
              <div key={lesson.id} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                  i === 0 ? 'bg-yellow-500' :
                  i === 1 ? 'bg-gray-400' :
                  i === 2 ? 'bg-orange-400' : 'bg-gray-300'
                }`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">{lesson.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-blue-600">{lesson.count}</p>
                  <p className="text-xs text-gray-500">lượt học</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Stats Card Component
function StatCard({ label, value, change, icon: Icon, color }) {
  const colors = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
  };
  const bgColors = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
  };

  return (
    <div className={`bg-gradient-to-br ${bgColors[color]} rounded-xl p-5 text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
          <Icon className="w-6 h-6" />
        </div>
      </div>
      {change !== undefined && (
        <div className="mt-3 flex items-center gap-1 text-sm">
          {change >= 0 ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span>{change >= 0 ? '+' : ''}{change}% so với kỳ trước</span>
        </div>
      )}
    </div>
  );
}
