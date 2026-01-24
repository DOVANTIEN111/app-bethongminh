// src/pages/parent/ParentChildrenPage.jsx
// Parent's Children Page
import React, { useState } from 'react';
import {
  Users, ChevronLeft, BookOpen, Clock, Star, Trophy,
  TrendingUp, Calendar, Award, Target, X
} from 'lucide-react';

const MOCK_CHILDREN = [
  {
    id: 1,
    name: 'Nguyễn Minh Anh',
    avatar: '👧',
    class: 'Lớp 3A',
    school: 'Trường Tiểu học Nguyễn Du',
    teacher: 'Cô Nguyễn Thị Mai',
    todayProgress: 75,
    overallProgress: 68,
    avgScore: 8.5,
    lessonsToday: 3,
    lessonsTotal: 45,
    timeToday: 45,
    timeTotal: 1250,
    streak: 7,
    badges: [
      { icon: '🌟', name: 'Ngôi sao mới' },
      { icon: '🔥', name: 'Chuỗi 7 ngày' },
      { icon: '📚', name: 'Đọc sách giỏi' },
      { icon: '🎯', name: 'Bắn trúng đích' },
    ],
    todayLessons: [
      { name: 'Tiếng Anh - Màu sắc', completed: true, score: 95 },
      { name: 'Toán - Phép cộng', completed: true, score: 100 },
      { name: 'Khoa học - Động vật', completed: false, progress: 60 },
    ],
  },
  {
    id: 2,
    name: 'Nguyễn Gia Bảo',
    avatar: '👦',
    class: 'Lớp 1B',
    school: 'Trường Tiểu học Nguyễn Du',
    teacher: 'Cô Trần Thị Lan',
    todayProgress: 50,
    overallProgress: 55,
    avgScore: 7.8,
    lessonsToday: 2,
    lessonsTotal: 28,
    timeToday: 30,
    timeTotal: 850,
    streak: 5,
    badges: [
      { icon: '🌟', name: 'Ngôi sao mới' },
      { icon: '💪', name: 'Siêu cố gắng' },
    ],
    todayLessons: [
      { name: 'Tiếng Việt - Bảng chữ cái', completed: true, score: 88 },
      { name: 'Toán - Đếm số', completed: false, progress: 40 },
    ],
  },
];

export default function ParentChildrenPage() {
  const [selectedChild, setSelectedChild] = useState(null);

  if (selectedChild) {
    return (
      <div className="p-4 space-y-4">
        {/* Back Button */}
        <button
          onClick={() => setSelectedChild(null)}
          className="flex items-center gap-2 text-gray-600 font-medium"
        >
          <ChevronLeft className="w-5 h-5" />
          Quay lại
        </button>

        {/* Child Profile Card */}
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl p-6 text-white shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl shadow-lg">
              {selectedChild.avatar}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{selectedChild.name}</h1>
              <p className="text-white/80">{selectedChild.class}</p>
              <p className="text-sm text-white/70">{selectedChild.school}</p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-white/20 backdrop-blur rounded-xl">
            <p className="text-sm text-white/80">Giáo viên chủ nhiệm</p>
            <p className="font-medium">{selectedChild.teacher}</p>
          </div>
        </div>

        {/* Today's Progress */}
        <div className="bg-white rounded-2xl shadow-lg p-5">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-500" />
            Học tập hôm nay
          </h2>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-purple-50 rounded-xl p-3 text-center">
              <BookOpen className="w-6 h-6 text-purple-500 mx-auto mb-1" />
              <p className="text-xl font-bold text-gray-800">{selectedChild.lessonsToday}</p>
              <p className="text-xs text-gray-500">Bài học</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-3 text-center">
              <Clock className="w-6 h-6 text-blue-500 mx-auto mb-1" />
              <p className="text-xl font-bold text-gray-800">{selectedChild.timeToday}</p>
              <p className="text-xs text-gray-500">Phút</p>
            </div>
            <div className="bg-orange-50 rounded-xl p-3 text-center">
              <Target className="w-6 h-6 text-orange-500 mx-auto mb-1" />
              <p className="text-xl font-bold text-gray-800">{selectedChild.todayProgress}%</p>
              <p className="text-xs text-gray-500">Tiến độ</p>
            </div>
          </div>

          {/* Today's Lessons */}
          <div className="space-y-2">
            {selectedChild.todayLessons.map((lesson, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  lesson.completed ? 'bg-green-100' : 'bg-orange-100'
                }`}>
                  {lesson.completed ? '✅' : '⏳'}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800 text-sm">{lesson.name}</p>
                  {lesson.completed ? (
                    <p className="text-xs text-green-600">Hoàn thành - {lesson.score} điểm</p>
                  ) : (
                    <div className="mt-1">
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orange-400 rounded-full"
                          style={{ width: `${lesson.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-orange-600 mt-0.5">{lesson.progress}% đang học</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Overall Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-5">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            Tổng quan học tập
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4">
              <p className="text-sm text-gray-500 mb-1">Tiến độ tổng</p>
              <p className="text-2xl font-bold text-purple-600">{selectedChild.overallProgress}%</p>
              <div className="h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"
                  style={{ width: `${selectedChild.overallProgress}%` }}
                />
              </div>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4">
              <p className="text-sm text-gray-500 mb-1">Điểm trung bình</p>
              <p className="text-2xl font-bold text-orange-600">{selectedChild.avgScore}</p>
              <div className="flex gap-0.5 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(selectedChild.avgScore / 2)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
              <p className="text-sm text-gray-500 mb-1">Tổng bài học</p>
              <p className="text-2xl font-bold text-green-600">{selectedChild.lessonsTotal}</p>
              <p className="text-xs text-gray-400 mt-1">bài hoàn thành</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4">
              <p className="text-sm text-gray-500 mb-1">Tổng thời gian</p>
              <p className="text-2xl font-bold text-blue-600">{Math.floor(selectedChild.timeTotal / 60)}h</p>
              <p className="text-xs text-gray-400 mt-1">{selectedChild.timeTotal} phút học</p>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="bg-white rounded-2xl shadow-lg p-5">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-500" />
            Huy hiệu đạt được ({selectedChild.badges.length})
          </h2>

          <div className="flex flex-wrap gap-3">
            {selectedChild.badges.map((badge, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-3 text-center min-w-[80px]"
              >
                <div className="text-3xl mb-1">{badge.icon}</div>
                <p className="text-xs font-medium text-gray-600">{badge.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Streak */}
        <div className="bg-gradient-to-r from-orange-400 to-red-400 rounded-2xl p-5 text-white">
          <div className="flex items-center gap-4">
            <div className="text-5xl">🔥</div>
            <div>
              <p className="text-white/80">Chuỗi ngày học</p>
              <p className="text-3xl font-bold">{selectedChild.streak} ngày liên tiếp!</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
          <Users className="w-7 h-7 text-purple-500" />
          Con của tôi
        </h1>
        <p className="text-gray-500 mt-1">Theo dõi học tập của các con</p>
      </div>

      {/* Children List */}
      <div className="space-y-4">
        {MOCK_CHILDREN.map((child) => (
          <button
            key={child.id}
            onClick={() => setSelectedChild(child)}
            className="w-full bg-white rounded-2xl shadow-lg p-5 text-left hover:shadow-xl transition-all"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center text-3xl shadow-inner">
                {child.avatar}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 text-lg">{child.name}</h3>
                <p className="text-purple-600 text-sm">{child.class}</p>
                <p className="text-gray-400 text-xs">{child.school}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-orange-500">
                  <span className="text-lg">🔥</span>
                  <span className="font-bold">{child.streak}</span>
                </div>
                <p className="text-xs text-gray-400">ngày</p>
              </div>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-500">Tiến độ tổng quan</span>
                <span className="font-bold text-purple-600">{child.overallProgress}%</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"
                  style={{ width: `${child.overallProgress}%` }}
                />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-purple-50 rounded-xl p-2 text-center">
                <p className="text-lg font-bold text-purple-600">{child.lessonsToday}</p>
                <p className="text-xs text-gray-500">Bài hôm nay</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-2 text-center">
                <p className="text-lg font-bold text-blue-600">{child.timeToday}p</p>
                <p className="text-xs text-gray-500">Thời gian</p>
              </div>
              <div className="bg-yellow-50 rounded-xl p-2 text-center">
                <p className="text-lg font-bold text-yellow-600">{child.avgScore}</p>
                <p className="text-xs text-gray-500">Điểm TB</p>
              </div>
              <div className="bg-green-50 rounded-xl p-2 text-center">
                <p className="text-lg font-bold text-green-600">{child.badges.length}</p>
                <p className="text-xs text-gray-500">Huy hiệu</p>
              </div>
            </div>

            {/* Today Status */}
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-sm text-gray-500">Hôm nay</span>
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                child.todayProgress >= 70
                  ? 'bg-green-100 text-green-600'
                  : child.todayProgress >= 40
                  ? 'bg-yellow-100 text-yellow-600'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {child.todayProgress >= 70 ? 'Học tốt!' : child.todayProgress >= 40 ? 'Đang học' : 'Chưa bắt đầu'}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Tip Card */}
      <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl p-4 flex items-center gap-3">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow">
          💡
        </div>
        <div className="flex-1">
          <p className="font-medium text-purple-800">Mẹo cho phụ huynh</p>
          <p className="text-sm text-purple-600">
            Khuyến khích con học 15-20 phút mỗi ngày để đạt hiệu quả tốt nhất!
          </p>
        </div>
      </div>
    </div>
  );
}
