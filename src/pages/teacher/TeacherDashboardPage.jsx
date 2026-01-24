// src/pages/teacher/TeacherDashboardPage.jsx
// Teacher Dashboard with Statistics
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  BookOpen, Users, ClipboardList, Clock,
  Calendar, Bell, CheckCircle, Loader2
} from 'lucide-react';

export default function TeacherDashboardPage() {
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalStudents: 0,
    totalAssignments: 0,
    pendingGrading: 0,
  });
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.id) {
      loadDashboardData();
    }
  }, [profile?.id]);

  const loadDashboardData = async () => {
    try {
      // Get classes count
      const { count: classCount } = await supabase
        .from('classes')
        .select('id', { count: 'exact', head: true })
        .eq('teacher_id', profile.id);

      // Get students in teacher's classes
      const { data: classesData } = await supabase
        .from('classes')
        .select('id')
        .eq('teacher_id', profile.id);

      const classIds = classesData?.map(c => c.id) || [];

      let studentCount = 0;
      if (classIds.length > 0) {
        const { count } = await supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .in('class_id', classIds)
          .eq('role', 'student');
        studentCount = count || 0;
      }

      setStats({
        totalClasses: classCount || 0,
        totalStudents: studentCount,
        totalAssignments: 12, // Mock data
        pendingGrading: 5, // Mock data
      });

      // Mock today's schedule
      setTodaySchedule([
        { time: '07:30 - 08:15', class: 'Lớp 3A', subject: 'Toán' },
        { time: '08:20 - 09:05', class: 'Lớp 3B', subject: 'Toán' },
        { time: '09:20 - 10:05', class: 'Lớp 4A', subject: 'Toán' },
        { time: '10:10 - 10:55', class: 'Lớp 4B', subject: 'Toán' },
      ]);

      // Mock recent activity
      setRecentActivity([
        { student: 'Nguyễn Văn A', action: 'Đã nộp bài tập Toán', time: '10 phút trước', type: 'submit' },
        { student: 'Trần Thị B', action: 'Hoàn thành bài học', time: '30 phút trước', type: 'complete' },
        { student: 'Lê Văn C', action: 'Đạt điểm cao bài kiểm tra', time: '1 giờ trước', type: 'achievement' },
        { student: 'Phạm Thị D', action: 'Đăng nhập học', time: '2 giờ trước', type: 'login' },
      ]);

      // Mock notifications
      setNotifications([
        { title: 'Bài tập mới cần chấm', message: '5 học sinh đã nộp bài tập', time: '5 phút trước', unread: true },
        { title: 'Họp tổ bộ môn', message: 'Ngày mai lúc 14:00', time: '1 giờ trước', unread: true },
        { title: 'Cập nhật hệ thống', message: 'Phiên bản mới đã được cập nhật', time: '2 giờ trước', unread: false },
      ]);

    } catch (err) {
      console.error('Load dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Lớp dạy', value: stats.totalClasses, icon: BookOpen, color: 'bg-emerald-500', bgLight: 'bg-emerald-100' },
    { label: 'Học sinh', value: stats.totalStudents, icon: Users, color: 'bg-blue-500', bgLight: 'bg-blue-100' },
    { label: 'Bài đã giao', value: stats.totalAssignments, icon: ClipboardList, color: 'bg-purple-500', bgLight: 'bg-purple-100' },
    { label: 'Chưa chấm', value: stats.pendingGrading, icon: Clock, color: 'bg-amber-500', bgLight: 'bg-amber-100' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm p-4 lg:p-6">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className={`w-10 h-10 lg:w-12 lg:h-12 ${stat.bgLight} rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 lg:w-6 lg:h-6 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
              <div>
                <p className="text-xs lg:text-sm text-gray-500">{stat.label}</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-600" />
            <h3 className="font-semibold text-gray-900">Lịch dạy hôm nay</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {todaySchedule.map((item, i) => (
              <div key={i} className="p-4 hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.class}</p>
                    <p className="text-sm text-gray-500">{item.subject}</p>
                  </div>
                  <span className="text-sm text-gray-400">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Hoạt động gần đây</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {recentActivity.map((item, i) => (
              <div key={i} className="p-4 hover:bg-gray-50">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    item.type === 'submit' ? 'bg-blue-100' :
                    item.type === 'complete' ? 'bg-green-100' :
                    item.type === 'achievement' ? 'bg-amber-100' : 'bg-gray-100'
                  }`}>
                    <CheckCircle className={`w-4 h-4 ${
                      item.type === 'submit' ? 'text-blue-600' :
                      item.type === 'complete' ? 'text-green-600' :
                      item.type === 'achievement' ? 'text-amber-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm">{item.student}</p>
                    <p className="text-sm text-gray-500 truncate">{item.action}</p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-600" />
            <h3 className="font-semibold text-gray-900">Thông báo</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {notifications.map((item, i) => (
              <div key={i} className={`p-4 hover:bg-gray-50 ${item.unread ? 'bg-amber-50' : ''}`}>
                <div className="flex items-start gap-3">
                  {item.unread && (
                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-2" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm">{item.title}</p>
                    <p className="text-sm text-gray-500">{item.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{item.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
