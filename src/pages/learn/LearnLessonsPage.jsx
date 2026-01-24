// src/pages/learn/LearnLessonsPage.jsx
// Student Lessons Page - Kid-friendly design
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, Star, Lock, CheckCircle, Play, ChevronRight,
  ChevronLeft, Sparkles, Clock, Target
} from 'lucide-react';

const SUBJECTS = [
  {
    id: 'english',
    name: 'Tiếng Anh',
    icon: '🇬🇧',
    color: 'from-blue-400 to-blue-500',
    bgColor: 'bg-blue-100',
    lessons: [
      { id: 'eng-1', title: 'Bảng chữ cái', icon: '🔤', duration: '10 phút', status: 'completed', score: 95 },
      { id: 'eng-2', title: 'Chào hỏi', icon: '👋', duration: '8 phút', status: 'completed', score: 88 },
      { id: 'eng-3', title: 'Số đếm 1-10', icon: '🔢', duration: '12 phút', status: 'completed', score: 100 },
      { id: 'eng-4', title: 'Màu sắc', icon: '🌈', duration: '10 phút', status: 'current', progress: 60 },
      { id: 'eng-5', title: 'Động vật', icon: '🐻', duration: '15 phút', status: 'locked' },
      { id: 'eng-6', title: 'Trái cây', icon: '🍎', duration: '10 phút', status: 'locked' },
      { id: 'eng-7', title: 'Gia đình', icon: '👨‍👩‍👧', duration: '12 phút', status: 'locked' },
      { id: 'eng-8', title: 'Đồ vật trong nhà', icon: '🏠', duration: '10 phút', status: 'locked' },
    ]
  },
  {
    id: 'math',
    name: 'Toán',
    icon: '🔢',
    color: 'from-green-400 to-green-500',
    bgColor: 'bg-green-100',
    lessons: [
      { id: 'math-1', title: 'Đếm số 1-10', icon: '1️⃣', duration: '8 phút', status: 'completed', score: 100 },
      { id: 'math-2', title: 'Phép cộng cơ bản', icon: '➕', duration: '12 phút', status: 'completed', score: 92 },
      { id: 'math-3', title: 'Phép trừ cơ bản', icon: '➖', duration: '12 phút', status: 'current', progress: 30 },
      { id: 'math-4', title: 'So sánh số', icon: '⚖️', duration: '10 phút', status: 'locked' },
      { id: 'math-5', title: 'Hình khối', icon: '🔷', duration: '15 phút', status: 'locked' },
    ]
  },
  {
    id: 'science',
    name: 'Khoa học',
    icon: '🔬',
    color: 'from-purple-400 to-purple-500',
    bgColor: 'bg-purple-100',
    lessons: [
      { id: 'sci-1', title: 'Cơ thể người', icon: '🧍', duration: '15 phút', status: 'completed', score: 85 },
      { id: 'sci-2', title: 'Các loài động vật', icon: '🦁', duration: '12 phút', status: 'current', progress: 45 },
      { id: 'sci-3', title: 'Thực vật', icon: '🌱', duration: '10 phút', status: 'locked' },
      { id: 'sci-4', title: 'Thời tiết', icon: '🌤️', duration: '10 phút', status: 'locked' },
    ]
  },
  {
    id: 'vietnamese',
    name: 'Tiếng Việt',
    icon: '📖',
    color: 'from-orange-400 to-orange-500',
    bgColor: 'bg-orange-100',
    lessons: [
      { id: 'vn-1', title: 'Bảng chữ cái', icon: '🔤', duration: '10 phút', status: 'completed', score: 98 },
      { id: 'vn-2', title: 'Ghép vần', icon: '📝', duration: '15 phút', status: 'completed', score: 90 },
      { id: 'vn-3', title: 'Đọc từ đơn', icon: '📖', duration: '12 phút', status: 'current', progress: 80 },
      { id: 'vn-4', title: 'Đọc câu ngắn', icon: '📄', duration: '15 phút', status: 'locked' },
    ]
  }
];

export default function LearnLessonsPage() {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState(null);

  const handleLessonClick = (lesson) => {
    if (lesson.status === 'locked') return;

    // Navigate to lesson based on type
    // For English lessons, connect to existing English learning pages
    if (selectedSubject?.id === 'english') {
      navigate('/english');
    } else {
      // For other subjects, show alert for now
      alert(`Bắt đầu bài học: ${lesson.title}`);
    }
  };

  const getStatusIcon = (status, score) => {
    switch (status) {
      case 'completed':
        return (
          <div className="relative">
            <CheckCircle className="w-6 h-6 text-green-500" />
            {score && (
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-xs font-bold text-white w-5 h-5 rounded-full flex items-center justify-center">
                {score >= 90 ? '⭐' : '✓'}
              </span>
            )}
          </div>
        );
      case 'current':
        return <Play className="w-6 h-6 text-blue-500" />;
      case 'locked':
        return <Lock className="w-6 h-6 text-gray-300" />;
      default:
        return null;
    }
  };

  if (selectedSubject) {
    return (
      <div className="p-4 space-y-4">
        {/* Back Button */}
        <button
          onClick={() => setSelectedSubject(null)}
          className="flex items-center gap-2 text-gray-600 font-medium"
        >
          <ChevronLeft className="w-5 h-5" />
          Quay lại
        </button>

        {/* Subject Header */}
        <div className={`bg-gradient-to-r ${selectedSubject.color} rounded-3xl p-6 text-white shadow-xl`}>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-4xl">
              {selectedSubject.icon}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{selectedSubject.name}</h1>
              <p className="text-white/80">
                {selectedSubject.lessons.filter(l => l.status === 'completed').length}/
                {selectedSubject.lessons.length} bài học
              </p>
            </div>
          </div>
        </div>

        {/* Lessons List */}
        <div className="space-y-3">
          {selectedSubject.lessons.map((lesson, index) => (
            <button
              key={lesson.id}
              onClick={() => handleLessonClick(lesson)}
              disabled={lesson.status === 'locked'}
              className={`w-full bg-white rounded-2xl p-4 shadow-md flex items-center gap-4 transition-all ${
                lesson.status === 'locked'
                  ? 'opacity-60 cursor-not-allowed'
                  : 'hover:shadow-lg active:scale-[0.98]'
              } ${
                lesson.status === 'current'
                  ? 'ring-2 ring-blue-400 ring-offset-2'
                  : ''
              }`}
            >
              {/* Lesson Number */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                lesson.status === 'completed'
                  ? 'bg-green-100 text-green-600'
                  : lesson.status === 'current'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-400'
              }`}>
                {index + 1}
              </div>

              {/* Lesson Icon */}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl ${
                lesson.status === 'locked' ? 'bg-gray-100' : selectedSubject.bgColor
              }`}>
                {lesson.status === 'locked' ? '🔒' : lesson.icon}
              </div>

              {/* Lesson Info */}
              <div className="flex-1 text-left">
                <h3 className={`font-bold ${
                  lesson.status === 'locked' ? 'text-gray-400' : 'text-gray-800'
                }`}>
                  {lesson.title}
                </h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {lesson.duration}
                  </span>
                  {lesson.status === 'current' && (
                    <span className="text-xs text-blue-500 flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      {lesson.progress}% hoàn thành
                    </span>
                  )}
                  {lesson.status === 'completed' && (
                    <span className="text-xs text-green-500 flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Điểm: {lesson.score}
                    </span>
                  )}
                </div>

                {/* Progress bar for current lesson */}
                {lesson.status === 'current' && (
                  <div className="h-2 bg-gray-100 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full"
                      style={{ width: `${lesson.progress}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Status Icon */}
              {getStatusIcon(lesson.status, lesson.score)}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
          <BookOpen className="w-7 h-7 text-blue-500" />
          Bài học của bạn
        </h1>
        <p className="text-gray-500 mt-1">Chọn môn học để bắt đầu nhé!</p>
      </div>

      {/* Subjects Grid */}
      <div className="space-y-4">
        {SUBJECTS.map((subject) => {
          const completedCount = subject.lessons.filter(l => l.status === 'completed').length;
          const progress = Math.round((completedCount / subject.lessons.length) * 100);

          return (
            <button
              key={subject.id}
              onClick={() => setSelectedSubject(subject)}
              className="w-full bg-white rounded-3xl p-5 shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
            >
              <div className="flex items-center gap-4">
                {/* Subject Icon */}
                <div className={`w-20 h-20 bg-gradient-to-br ${subject.color} rounded-2xl flex items-center justify-center text-5xl shadow-lg`}>
                  {subject.icon}
                </div>

                {/* Subject Info */}
                <div className="flex-1 text-left">
                  <h2 className="text-xl font-bold text-gray-800">{subject.name}</h2>
                  <p className="text-sm text-gray-500">
                    {completedCount}/{subject.lessons.length} bài học hoàn thành
                  </p>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${subject.color} rounded-full transition-all`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{progress}% hoàn thành</p>
                  </div>
                </div>

                {/* Arrow */}
                <ChevronRight className="w-6 h-6 text-gray-400" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Tip Card */}
      <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-4 flex items-center gap-3">
        <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center text-2xl">
          💡
        </div>
        <div className="flex-1">
          <p className="font-medium text-yellow-800">Mẹo học tập</p>
          <p className="text-sm text-yellow-700">
            Học mỗi ngày 15-20 phút sẽ giúp bạn nhớ lâu hơn đấy!
          </p>
        </div>
      </div>
    </div>
  );
}
