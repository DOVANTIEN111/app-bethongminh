// src/pages/school/SchoolReportsPage.jsx
// School Reports Page - Comprehensive reporting for school management
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  BarChart3, TrendingUp, Users, GraduationCap, BookOpen,
  Download, Loader2, Calendar, Award, Target, Clock,
  ChevronDown, FileText, PieChart
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RechartsPie, Pie, Cell, LineChart, Line, Legend
} from 'recharts';

// Colors for charts
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

// Date range options
const DATE_RANGES = [
  { value: 'week', label: 'Tuần này' },
  { value: 'month', label: 'Tháng này' },
  { value: 'quarter', label: 'Quý này' },
  { value: 'year', label: 'Năm học' },
];

export default function SchoolReportsPage() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('month');
  const [activeTab, setActiveTab] = useState('overview');

  // Data states
  const [stats, setStats] = useState({});
  const [classPerformance, setClassPerformance] = useState([]);
  const [subjectScores, setSubjectScores] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [learningProgress, setLearningProgress] = useState([]);
  const [topStudents, setTopStudents] = useState([]);
  const [teacherStats, setTeacherStats] = useState([]);

  useEffect(() => {
    loadReportData();
  }, [profile?.school_id, dateRange]);

  const loadReportData = async () => {
    if (!profile?.school_id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const schoolId = profile.school_id;

      // Calculate date range
      const now = new Date();
      let startDate = new Date();
      switch (dateRange) {
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          startDate.setMonth(now.getMonth() - 3);
          break;
        case 'year':
          startDate.setMonth(8); // September
          if (startDate > now) startDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      const startStr = startDate.toISOString();

      // Load all data in parallel
      const [
        studentsRes,
        teachersRes,
        classesRes,
        lessonsRes,
        scoresRes,
      ] = await Promise.all([
        supabase
          .from('profiles')
          .select('id, full_name, class_id, total_xp, completed_lessons')
          .eq('school_id', schoolId)
          .eq('role', 'student')
          .eq('is_active', true),
        supabase
          .from('profiles')
          .select('id, full_name, department_id')
          .eq('school_id', schoolId)
          .eq('role', 'teacher')
          .eq('is_active', true),
        supabase
          .from('classes')
          .select('id, name, grade')
          .eq('school_id', schoolId),
        supabase
          .from('lesson_progress')
          .select('*')
          .eq('school_id', schoolId)
          .gte('created_at', startStr),
        supabase
          .from('quiz_scores')
          .select('*, profiles:student_id(full_name, class_id)')
          .eq('school_id', schoolId)
          .gte('created_at', startStr),
      ]);

      const students = studentsRes.data || [];
      const teachers = teachersRes.data || [];
      const classes = classesRes.data || [];
      const lessons = lessonsRes.data || [];
      const scores = scoresRes.data || [];

      // Calculate basic stats
      setStats({
        totalStudents: students.length,
        totalTeachers: teachers.length,
        totalClasses: classes.length,
        totalLessonsCompleted: lessons.filter(l => l.completed).length,
        averageScore: scores.length > 0
          ? Math.round(scores.reduce((sum, s) => sum + (s.score || 0), 0) / scores.length)
          : 0,
        totalXP: students.reduce((sum, s) => sum + (s.total_xp || 0), 0),
      });

      // Class performance data
      const classMap = {};
      classes.forEach(c => {
        classMap[c.id] = { name: c.name, students: 0, avgScore: 0, totalScores: 0, count: 0 };
      });
      students.forEach(s => {
        if (s.class_id && classMap[s.class_id]) {
          classMap[s.class_id].students++;
        }
      });
      scores.forEach(s => {
        const classId = s.profiles?.class_id;
        if (classId && classMap[classId]) {
          classMap[classId].totalScores += s.score || 0;
          classMap[classId].count++;
        }
      });
      const classPerf = Object.values(classMap).map(c => ({
        name: c.name,
        students: c.students,
        avgScore: c.count > 0 ? Math.round(c.totalScores / c.count) : 0
      }));
      setClassPerformance(classPerf);

      // Subject scores (mock data - would need real subject data)
      setSubjectScores([
        { name: 'Toán', score: 82 },
        { name: 'Tiếng Việt', score: 78 },
        { name: 'Tiếng Anh', score: 75 },
        { name: 'Khoa học', score: 85 },
        { name: 'Lịch sử', score: 72 },
      ]);

      // Attendance data (mock - would need real attendance table)
      setAttendanceData([
        { name: 'T2', present: 95, absent: 5 },
        { name: 'T3', present: 92, absent: 8 },
        { name: 'T4', present: 94, absent: 6 },
        { name: 'T5', present: 88, absent: 12 },
        { name: 'T6', present: 90, absent: 10 },
      ]);

      // Learning progress over time
      const progressByWeek = {};
      lessons.forEach(l => {
        const date = new Date(l.created_at);
        const weekKey = `${date.getMonth() + 1}/${Math.ceil(date.getDate() / 7)}`;
        if (!progressByWeek[weekKey]) {
          progressByWeek[weekKey] = { completed: 0, started: 0 };
        }
        if (l.completed) {
          progressByWeek[weekKey].completed++;
        } else {
          progressByWeek[weekKey].started++;
        }
      });
      setLearningProgress(Object.entries(progressByWeek).map(([week, data]) => ({
        week,
        ...data
      })));

      // Top students
      const sortedStudents = [...students]
        .sort((a, b) => (b.total_xp || 0) - (a.total_xp || 0))
        .slice(0, 10);
      setTopStudents(sortedStudents);

      // Teacher stats
      const teacherMap = {};
      teachers.forEach(t => {
        teacherMap[t.id] = { name: t.full_name, lessons: 0, students: 0 };
      });
      setTeacherStats(Object.values(teacherMap).slice(0, 10));

    } catch (err) {
      console.error('Load report data error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Export to Excel
  const handleExport = () => {
    const data = {
      'Tong quan': stats,
      'Hieu suat lop': classPerformance,
      'Diem mon hoc': subjectScores,
      'Top hoc sinh': topStudents.map(s => ({
        'Ho ten': s.full_name,
        'XP': s.total_xp,
        'Bai hoc': s.completed_lessons
      }))
    };

    // Create CSV
    let csv = 'Bao cao truong hoc\n\n';
    csv += 'TONG QUAN\n';
    csv += `Tong so hoc sinh,${stats.totalStudents}\n`;
    csv += `Tong so giao vien,${stats.totalTeachers}\n`;
    csv += `Tong so lop,${stats.totalClasses}\n`;
    csv += `Bai hoc hoan thanh,${stats.totalLessonsCompleted}\n`;
    csv += `Diem trung binh,${stats.averageScore}\n\n`;

    csv += 'TOP 10 HOC SINH\n';
    csv += 'Ho ten,XP,Bai hoc hoan thanh\n';
    topStudents.forEach(s => {
      csv += `"${s.full_name}",${s.total_xp || 0},${s.completed_lessons || 0}\n`;
    });

    // Download
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bao-cao-truong-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-blue-600" />
            Báo cáo & Thống kê
          </h1>
          <p className="text-gray-500 mt-1">Phân tích dữ liệu trường học</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="appearance-none bg-white border border-gray-200 px-4 py-2 pr-10 rounded-xl focus:ring-2 focus:ring-blue-500"
            >
              {DATE_RANGES.map(range => (
                <option key={range.value} value={range.value}>{range.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700"
          >
            <Download className="w-4 h-4" />
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
              <p className="text-xs text-gray-500">Học sinh</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTeachers}</p>
              <p className="text-xs text-gray-500">Giáo viên</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalClasses}</p>
              <p className="text-xs text-gray-500">Lớp học</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalLessonsCompleted}</p>
              <p className="text-xs text-gray-500">Bài học</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.averageScore}%</p>
              <p className="text-xs text-gray-500">Điểm TB</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalXP?.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Tổng XP</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Class Performance */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Hiệu suất theo lớp
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={classPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar dataKey="students" fill="#3B82F6" name="Số học sinh" />
              <Bar dataKey="avgScore" fill="#10B981" name="Điểm TB" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Subject Scores */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-green-600" />
            Điểm trung bình theo môn
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPie>
              <Pie
                data={subjectScores}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, score }) => `${name}: ${score}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="score"
              >
                {subjectScores.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPie>
          </ResponsiveContainer>
        </div>

        {/* Attendance Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-600" />
            Chuyên cần trong tuần
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar dataKey="present" stackId="a" fill="#10B981" name="Có mặt %" />
              <Bar dataKey="absent" stackId="a" fill="#EF4444" name="Vắng %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Learning Progress */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Tiến độ học tập
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={learningProgress}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="completed" stroke="#10B981" name="Hoàn thành" strokeWidth={2} />
              <Line type="monotone" dataKey="started" stroke="#F59E0B" name="Đang học" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Students Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-600" />
            Top 10 Học sinh xuất sắc
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Hạng</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Học sinh</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Điểm XP</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Bài học</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {topStudents.map((student, index) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? 'bg-yellow-100 text-yellow-700' :
                      index === 1 ? 'bg-gray-100 text-gray-700' :
                      index === 2 ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-50 text-gray-500'
                    }`}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <span>👨‍🎓</span>
                      </div>
                      <span className="font-medium text-gray-900">{student.full_name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-bold text-blue-600">{(student.total_xp || 0).toLocaleString()}</span>
                    <span className="text-gray-400 ml-1">XP</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-medium text-gray-900">{student.completed_lessons || 0}</span>
                  </td>
                </tr>
              ))}
              {topStudents.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-gray-500">
                    Chưa có dữ liệu học sinh
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
