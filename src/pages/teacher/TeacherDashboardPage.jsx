// src/pages/teacher/TeacherDashboardPage.jsx
// Teacher Dashboard with Real Statistics and Data
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  BookOpen, Users, ClipboardList, Clock,
  Calendar, Bell, CheckCircle, Loader2,
  MessageSquare, FileText, Plus, ChevronRight,
  AlertCircle, Star, TrendingUp
} from 'lucide-react';

export default function TeacherDashboardPage() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalStudents: 0,
    totalAssignments: 0,
    pendingGrading: 0,
    unreadMessages: 0,
    lessonsCreated: 0,
  });
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [pendingAssignments, setPendingAssignments] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.id) {
      loadDashboardData();
    }
  }, [profile?.id]);

  const loadDashboardData = async () => {
    try {
      // Get classes
      const { data: classesData } = await supabase
        .from('classes')
        .select('id, name')
        .eq('teacher_id', profile.id)
        .eq('is_active', true);

      const classIds = classesData?.map(c => c.id) || [];
      const totalClasses = classesData?.length || 0;

      // Get students count
      let totalStudents = 0;
      if (classIds.length > 0) {
        const { count: studentCount } = await supabase
          .from('class_students')
          .select('id', { count: 'exact', head: true })
          .in('class_id', classIds);
        totalStudents = studentCount || 0;
      }

      // Get assignments count
      let totalAssignments = 0;
      if (classIds.length > 0) {
        const { count: assignmentCount } = await supabase
          .from('assignments')
          .select('id', { count: 'exact', head: true })
          .in('class_id', classIds);
        totalAssignments = assignmentCount || 0;
      }

      // Get pending grading count (submitted student_assignments)
      let pendingGrading = 0;
      if (classIds.length > 0) {
        const { data: assignmentsData } = await supabase
          .from('assignments')
          .select('id')
          .in('class_id', classIds);

        const assignmentIds = assignmentsData?.map(a => a.id) || [];

        if (assignmentIds.length > 0) {
          const { count } = await supabase
            .from('student_assignments')
            .select('id', { count: 'exact', head: true })
            .in('assignment_id', assignmentIds)
            .eq('status', 'submitted');
          pendingGrading = count || 0;
        }
      }

      // Get unread messages count
      const { count: unreadCount } = await supabase
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .eq('receiver_id', profile.id)
        .eq('is_read', false);

      // Get lessons created count
      const { count: lessonsCount } = await supabase
        .from('lessons')
        .select('id', { count: 'exact', head: true })
        .eq('teacher_id', profile.id);

      setStats({
        totalClasses,
        totalStudents,
        totalAssignments,
        pendingGrading,
        unreadMessages: unreadCount || 0,
        lessonsCreated: lessonsCount || 0,
      });

      // Get today's schedule
      const today = new Date().getDay(); // 0 = Sunday
      if (classIds.length > 0) {
        const { data: scheduleData } = await supabase
          .from('schedules')
          .select(`
            id,
            subject,
            period,
            start_time,
            end_time,
            room,
            class_id,
            classes:class_id(name)
          `)
          .eq('teacher_id', profile.id)
          .eq('day_of_week', today)
          .eq('is_active', true)
          .order('period');

        setTodaySchedule(scheduleData?.map(s => ({
          time: s.start_time && s.end_time
            ? `${s.start_time.slice(0,5)} - ${s.end_time.slice(0,5)}`
            : `Tiết ${s.period}`,
          class: s.classes?.name || 'N/A',
          subject: s.subject,
          room: s.room,
        })) || []);
      }

      // Get pending assignments to grade
      if (classIds.length > 0) {
        const { data: pendingData } = await supabase
          .from('assignments')
          .select(`
            id,
            title,
            due_date,
            class_id,
            classes:class_id(name)
          `)
          .in('class_id', classIds)
          .eq('status', 'active')
          .order('due_date', { ascending: true })
          .limit(5);

        // For each assignment, get submitted count
        const pendingWithCounts = await Promise.all((pendingData || []).map(async (a) => {
          const { count } = await supabase
            .from('student_assignments')
            .select('id', { count: 'exact', head: true })
            .eq('assignment_id', a.id)
            .eq('status', 'submitted');

          return {
            id: a.id,
            title: a.title,
            class: a.classes?.name || 'N/A',
            dueDate: a.due_date,
            submittedCount: count || 0,
          };
        }));

        setPendingAssignments(pendingWithCounts.filter(p => p.submittedCount > 0));
      }

      // Get recent messages
      const { data: messagesData } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          created_at,
          is_read,
          sender:sender_id(full_name)
        `)
        .eq('receiver_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentMessages(messagesData?.map(m => ({
        id: m.id,
        from: m.sender?.full_name || 'Không rõ',
        content: m.content?.substring(0, 50) + (m.content?.length > 50 ? '...' : ''),
        time: formatTimeAgo(m.created_at),
        unread: !m.is_read,
      })) || []);

      // Get recent student activity (from student_assignments)
      if (classIds.length > 0) {
        const { data: assignmentsData } = await supabase
          .from('assignments')
          .select('id')
          .in('class_id', classIds);

        const assignmentIds = assignmentsData?.map(a => a.id) || [];

        if (assignmentIds.length > 0) {
          const { data: activityData } = await supabase
            .from('student_assignments')
            .select(`
              id,
              status,
              submitted_at,
              score,
              student:student_id(full_name),
              assignment:assignment_id(title)
            `)
            .in('assignment_id', assignmentIds)
            .in('status', ['submitted', 'graded'])
            .order('submitted_at', { ascending: false })
            .limit(5);

          setRecentActivity(activityData?.map(a => ({
            student: a.student?.full_name || 'Học sinh',
            action: a.status === 'submitted'
              ? `Nộp bài: ${a.assignment?.title || 'Bài tập'}`
              : `Hoàn thành: ${a.assignment?.title || 'Bài tập'} - ${a.score || 0} điểm`,
            time: formatTimeAgo(a.submitted_at),
            type: a.status === 'submitted' ? 'submit' : 'complete',
          })) || []);
        }
      }

    } catch (err) {
      console.error('Load dashboard error:', err);
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

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays === 1) return 'Hôm qua';
    return `${diffDays} ngày trước`;
  };

  const getDayName = () => {
    const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    return days[new Date().getDay()];
  };

  const statCards = [
    { label: 'Lớp dạy', value: stats.totalClasses, icon: BookOpen, color: 'text-emerald-500', bgLight: 'bg-emerald-100' },
    { label: 'Học sinh', value: stats.totalStudents, icon: Users, color: 'text-blue-500', bgLight: 'bg-blue-100' },
    { label: 'Bài đã giao', value: stats.totalAssignments, icon: ClipboardList, color: 'text-purple-500', bgLight: 'bg-purple-100' },
    { label: 'Chờ chấm', value: stats.pendingGrading, icon: Clock, color: 'text-amber-500', bgLight: 'bg-amber-100', highlight: stats.pendingGrading > 0 },
  ];

  const quickActions = [
    { label: 'Tạo bài tập', icon: Plus, onClick: () => navigate('/teacher/assignments'), color: 'bg-emerald-600' },
    { label: 'Tạo bài giảng', icon: FileText, onClick: () => navigate('/teacher/lessons'), color: 'bg-blue-600' },
    { label: 'Xem tin nhắn', icon: MessageSquare, onClick: () => navigate('/teacher/messages'), color: 'bg-purple-600', badge: stats.unreadMessages },
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
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-1">Xin chào, {profile?.full_name || 'Giáo viên'}!</h1>
        <p className="text-emerald-100">Hôm nay là {getDayName()}, {new Date().toLocaleDateString('vi-VN')}</p>
        {stats.pendingGrading > 0 && (
          <div className="mt-3 flex items-center gap-2 bg-white/20 rounded-lg px-3 py-2 w-fit">
            <AlertCircle className="w-5 h-5" />
            <span>Bạn có {stats.pendingGrading} bài tập cần chấm điểm</span>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className={`bg-white rounded-xl shadow-sm p-4 lg:p-6 ${stat.highlight ? 'ring-2 ring-amber-400' : ''}`}
          >
            <div className="flex items-center gap-3 lg:gap-4">
              <div className={`w-10 h-10 lg:w-12 lg:h-12 ${stat.bgLight} rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 lg:w-6 lg:h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xs lg:text-sm text-gray-500">{stat.label}</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Thao tác nhanh</h3>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={action.onClick}
              className={`${action.color} text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:opacity-90 transition-opacity relative`}
            >
              <action.icon className="w-4 h-4" />
              <span>{action.label}</span>
              {action.badge > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                  {action.badge > 9 ? '9+' : action.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              <h3 className="font-semibold text-gray-900">Lịch dạy hôm nay</h3>
            </div>
            <span className="text-sm text-gray-500">{getDayName()}</span>
          </div>
          <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
            {todaySchedule.length > 0 ? todaySchedule.map((item, i) => (
              <div key={i} className="p-4 hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.class}</p>
                    <p className="text-sm text-gray-500">{item.subject} {item.room && `- ${item.room}`}</p>
                  </div>
                  <span className="text-sm text-gray-400">{item.time}</span>
                </div>
              </div>
            )) : (
              <div className="p-8 text-center text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p>Không có lịch dạy hôm nay</p>
              </div>
            )}
          </div>
        </div>

        {/* Pending Grading */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-amber-600" />
              <h3 className="font-semibold text-gray-900">Bài cần chấm</h3>
            </div>
            <button
              onClick={() => navigate('/teacher/assignments')}
              className="text-sm text-emerald-600 hover:underline flex items-center gap-1"
            >
              Xem tất cả <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
            {pendingAssignments.length > 0 ? pendingAssignments.map((item) => (
              <div
                key={item.id}
                className="p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate('/teacher/assignments')}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                    <FileText className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.class}</p>
                  </div>
                  <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-medium">
                    {item.submittedCount} bài
                  </span>
                </div>
              </div>
            )) : (
              <div className="p-8 text-center text-gray-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-30 text-emerald-500" />
                <p>Không có bài cần chấm</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">Tin nhắn mới</h3>
              {stats.unreadMessages > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {stats.unreadMessages}
                </span>
              )}
            </div>
            <button
              onClick={() => navigate('/teacher/messages')}
              className="text-sm text-emerald-600 hover:underline flex items-center gap-1"
            >
              Xem tất cả <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
            {recentMessages.length > 0 ? recentMessages.map((msg) => (
              <div
                key={msg.id}
                className={`p-4 hover:bg-gray-50 cursor-pointer ${msg.unread ? 'bg-purple-50' : ''}`}
                onClick={() => navigate('/teacher/messages')}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-sm">👨‍👩‍👧</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm">{msg.from}</p>
                    <p className="text-sm text-gray-500 truncate">{msg.content}</p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">{msg.time}</span>
                </div>
              </div>
            )) : (
              <div className="p-8 text-center text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p>Chưa có tin nhắn mới</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Hoạt động học sinh gần đây</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {recentActivity.map((item, i) => (
              <div key={i} className="p-4 hover:bg-gray-50">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    item.type === 'submit' ? 'bg-blue-100' : 'bg-green-100'
                  }`}>
                    <CheckCircle className={`w-4 h-4 ${
                      item.type === 'submit' ? 'text-blue-600' : 'text-green-600'
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
      )}
    </div>
  );
}
