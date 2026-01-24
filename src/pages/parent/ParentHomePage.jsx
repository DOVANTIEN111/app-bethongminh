// src/pages/parent/ParentHomePage.jsx
// Parent Home Dashboard
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Users, BookOpen, Clock, Star, Bell, ChevronRight,
  Calendar, AlertCircle, TrendingUp, Award
} from 'lucide-react';

const MOCK_CHILDREN = [
  {
    id: 1,
    name: 'Nguyễn Minh Anh',
    avatar: '👧',
    class: 'Lớp 3A',
    todayProgress: 75,
    lessonsToday: 3,
    timeToday: 45,
    streak: 7,
  },
  {
    id: 2,
    name: 'Nguyễn Gia Bảo',
    avatar: '👦',
    class: 'Lớp 1B',
    todayProgress: 50,
    lessonsToday: 2,
    timeToday: 30,
    streak: 5,
  },
];

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: 'teacher',
    title: 'Tin nhắn từ Cô Mai',
    content: 'Minh Anh học rất tốt tuần này',
    time: '10 phút trước',
    read: false,
  },
  {
    id: 2,
    type: 'assignment',
    title: 'Bài tập mới',
    content: 'Gia Bảo có bài tập Toán cần hoàn thành',
    time: '1 giờ trước',
    read: false,
  },
  {
    id: 3,
    type: 'achievement',
    title: 'Huy hiệu mới!',
    content: 'Minh Anh đạt huy hiệu "Chuỗi 7 ngày"',
    time: '2 giờ trước',
    read: true,
  },
];

const MOCK_ASSIGNMENTS = [
  {
    id: 1,
    child: 'Minh Anh',
    title: 'Học từ vựng động vật',
    subject: 'Tiếng Anh',
    deadline: '2025-01-25',
    daysLeft: 1,
  },
  {
    id: 2,
    child: 'Gia Bảo',
    title: 'Phép cộng trong phạm vi 10',
    subject: 'Toán',
    deadline: '2025-01-24',
    daysLeft: 0,
  },
];

export default function ParentHomePage() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const firstName = profile?.full_name?.split(' ').slice(-1)[0] || 'Phụ huynh';

  return (
    <div className="p-4 space-y-5">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <h1 className="text-2xl font-bold mb-2">
            Xin chào, {firstName}! 👋
          </h1>
          <p className="text-white/80 mb-4">
            Hôm nay các con đang học rất chăm chỉ!
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/20 backdrop-blur rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-5 h-5" />
                <span className="font-medium">{MOCK_CHILDREN.length} con</span>
              </div>
              <p className="text-xs text-white/80">Đang theo dõi</p>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="w-5 h-5" />
                <span className="font-medium">5 bài</span>
              </div>
              <p className="text-xs text-white/80">Hoàn thành hôm nay</p>
            </div>
          </div>
        </div>
      </div>

      {/* Children Summary */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-500" />
            Học tập hôm nay
          </h2>
          <button
            onClick={() => navigate('/parent/children')}
            className="text-purple-500 text-sm font-medium flex items-center gap-1"
          >
            Chi tiết
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="divide-y divide-gray-50">
          {MOCK_CHILDREN.map((child) => (
            <button
              key={child.id}
              onClick={() => navigate('/parent/children')}
              className="w-full p-4 hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center text-2xl shadow-inner">
                  {child.avatar}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-gray-800">{child.name}</h3>
                    <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                      {child.class}
                    </span>
                  </div>

                  {/* Progress */}
                  <div className="mb-2">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>Tiến độ hôm nay</span>
                      <span className="font-medium text-purple-600">{child.todayProgress}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"
                        style={{ width: `${child.todayProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-blue-500" />
                      {child.lessonsToday} bài học
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-green-500" />
                      {child.timeToday} phút
                    </span>
                    <span className="flex items-center gap-1">
                      🔥 {child.streak} ngày
                    </span>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-gray-300" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <Bell className="w-5 h-5 text-purple-500" />
            Thông báo mới
          </h2>
          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
            {MOCK_NOTIFICATIONS.filter(n => !n.read).length} mới
          </span>
        </div>

        <div className="divide-y divide-gray-50">
          {MOCK_NOTIFICATIONS.slice(0, 3).map((notif) => (
            <div
              key={notif.id}
              className={`p-4 ${!notif.read ? 'bg-purple-50/50' : ''}`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  notif.type === 'teacher' ? 'bg-blue-100' :
                  notif.type === 'assignment' ? 'bg-orange-100' :
                  'bg-yellow-100'
                }`}>
                  {notif.type === 'teacher' ? '👨‍🏫' :
                   notif.type === 'assignment' ? '📝' : '🏆'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-800 text-sm">{notif.title}</p>
                    {!notif.read && (
                      <span className="w-2 h-2 bg-purple-500 rounded-full" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{notif.content}</p>
                  <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="w-full p-3 text-purple-600 font-medium text-sm hover:bg-purple-50">
          Xem tất cả thông báo
        </button>
      </div>

      {/* Upcoming Assignments */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-500" />
            Bài tập sắp đến hạn
          </h2>
        </div>

        <div className="divide-y divide-gray-50">
          {MOCK_ASSIGNMENTS.map((assignment) => (
            <div key={assignment.id} className="p-4">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  assignment.daysLeft === 0 ? 'bg-red-100' : 'bg-orange-100'
                }`}>
                  <AlertCircle className={`w-6 h-6 ${
                    assignment.daysLeft === 0 ? 'text-red-500' : 'text-orange-500'
                  }`} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{assignment.title}</p>
                  <p className="text-sm text-gray-500">
                    {assignment.child} • {assignment.subject}
                  </p>
                </div>
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                  assignment.daysLeft === 0
                    ? 'bg-red-100 text-red-600'
                    : 'bg-orange-100 text-orange-600'
                }`}>
                  {assignment.daysLeft === 0 ? 'Hôm nay' : `Còn ${assignment.daysLeft} ngày`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl p-4 shadow">
          <TrendingUp className="w-8 h-8 text-purple-500 mb-2" />
          <p className="text-2xl font-bold text-gray-800">+15%</p>
          <p className="text-sm text-gray-600">Tiến bộ tuần này</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl p-4 shadow">
          <Award className="w-8 h-8 text-orange-500 mb-2" />
          <p className="text-2xl font-bold text-gray-800">12</p>
          <p className="text-sm text-gray-600">Huy hiệu đạt được</p>
        </div>
      </div>
    </div>
  );
}
