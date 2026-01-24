// src/pages/parent/ParentReportsPage.jsx
// Parent Reports Page with Charts
import React, { useState } from 'react';
import {
  BarChart3, TrendingUp, TrendingDown, Clock, BookOpen,
  Star, Calendar, ChevronDown, Users
} from 'lucide-react';

const MOCK_CHILDREN = [
  { id: 1, name: 'Minh Anh', avatar: '👧' },
  { id: 2, name: 'Gia Bảo', avatar: '👦' },
];

const WEEKLY_DATA = {
  lessons: [3, 4, 2, 5, 3, 4, 3],
  time: [30, 45, 25, 50, 35, 40, 35],
  score: [85, 90, 88, 92, 87, 95, 90],
  days: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
};

const MONTHLY_DATA = {
  weeks: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
  lessons: [18, 22, 20, 24],
  time: [240, 280, 260, 300],
  score: [87, 89, 88, 91],
};

export default function ParentReportsPage() {
  const [selectedChild, setSelectedChild] = useState(MOCK_CHILDREN[0]);
  const [period, setPeriod] = useState('week');
  const [showChildSelector, setShowChildSelector] = useState(false);

  const data = period === 'week' ? WEEKLY_DATA : MONTHLY_DATA;

  // Calculate stats
  const totalLessons = data.lessons.reduce((a, b) => a + b, 0);
  const totalTime = data.time.reduce((a, b) => a + b, 0);
  const avgScore = Math.round(data.score.reduce((a, b) => a + b, 0) / data.score.length);

  // Compare with previous period (mock data)
  const prevLessons = period === 'week' ? 20 : 75;
  const prevTime = period === 'week' ? 230 : 950;
  const prevScore = period === 'week' ? 86 : 85;

  const lessonsDiff = ((totalLessons - prevLessons) / prevLessons * 100).toFixed(0);
  const timeDiff = ((totalTime - prevTime) / prevTime * 100).toFixed(0);
  const scoreDiff = avgScore - prevScore;

  const maxValue = Math.max(...data.lessons) + 1;

  return (
    <div className="p-4 space-y-4 pb-28">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
          <BarChart3 className="w-7 h-7 text-purple-500" />
          Báo cáo học tập
        </h1>
      </div>

      {/* Child Selector */}
      <div className="relative">
        <button
          onClick={() => setShowChildSelector(!showChildSelector)}
          className="w-full bg-white rounded-xl p-4 shadow flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl">
              {selectedChild.avatar}
            </div>
            <div className="text-left">
              <p className="text-sm text-gray-500">Xem báo cáo của</p>
              <p className="font-bold text-gray-800">{selectedChild.name}</p>
            </div>
          </div>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showChildSelector ? 'rotate-180' : ''}`} />
        </button>

        {showChildSelector && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg z-10 overflow-hidden">
            {MOCK_CHILDREN.map((child) => (
              <button
                key={child.id}
                onClick={() => {
                  setSelectedChild(child);
                  setShowChildSelector(false);
                }}
                className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 ${
                  selectedChild.id === child.id ? 'bg-purple-50' : ''
                }`}
              >
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-xl">
                  {child.avatar}
                </div>
                <span className="font-medium text-gray-800">{child.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Period Tabs */}
      <div className="flex bg-gray-100 rounded-xl p-1">
        <button
          onClick={() => setPeriod('week')}
          className={`flex-1 py-3 rounded-lg font-medium transition-all ${
            period === 'week'
              ? 'bg-white text-purple-600 shadow'
              : 'text-gray-500'
          }`}
        >
          Tuần này
        </button>
        <button
          onClick={() => setPeriod('month')}
          className={`flex-1 py-3 rounded-lg font-medium transition-all ${
            period === 'month'
              ? 'bg-white text-purple-600 shadow'
              : 'text-gray-500'
          }`}
        >
          Tháng này
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl p-4 shadow">
          <BookOpen className="w-6 h-6 text-purple-500 mb-2" />
          <p className="text-2xl font-bold text-gray-800">{totalLessons}</p>
          <p className="text-xs text-gray-500">Bài học</p>
          <div className={`flex items-center gap-1 mt-1 text-xs ${
            lessonsDiff >= 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            {lessonsDiff >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {lessonsDiff >= 0 ? '+' : ''}{lessonsDiff}%
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow">
          <Clock className="w-6 h-6 text-blue-500 mb-2" />
          <p className="text-2xl font-bold text-gray-800">{Math.round(totalTime / 60)}h</p>
          <p className="text-xs text-gray-500">Thời gian</p>
          <div className={`flex items-center gap-1 mt-1 text-xs ${
            timeDiff >= 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            {timeDiff >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {timeDiff >= 0 ? '+' : ''}{timeDiff}%
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow">
          <Star className="w-6 h-6 text-yellow-500 mb-2" />
          <p className="text-2xl font-bold text-gray-800">{avgScore}</p>
          <p className="text-xs text-gray-500">Điểm TB</p>
          <div className={`flex items-center gap-1 mt-1 text-xs ${
            scoreDiff >= 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            {scoreDiff >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {scoreDiff >= 0 ? '+' : ''}{scoreDiff}
          </div>
        </div>
      </div>

      {/* Lessons Chart */}
      <div className="bg-white rounded-2xl shadow-lg p-5">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-500" />
          Số bài học hoàn thành
        </h3>

        <div className="flex items-end justify-between gap-2 h-40">
          {data.lessons.map((value, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full flex flex-col items-center justify-end h-32">
                <span className="text-xs font-medium text-purple-600 mb-1">{value}</span>
                <div
                  className="w-full bg-gradient-to-t from-purple-500 to-blue-400 rounded-t-lg transition-all duration-500"
                  style={{ height: `${(value / maxValue) * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 mt-2">
                {period === 'week' ? data.days[index] : data.weeks[index]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Time Chart */}
      <div className="bg-white rounded-2xl shadow-lg p-5">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-500" />
          Thời gian học (phút)
        </h3>

        <div className="space-y-3">
          {data.time.map((value, index) => {
            const maxTime = Math.max(...data.time);
            const percentage = (value / maxTime) * 100;
            return (
              <div key={index} className="flex items-center gap-3">
                <span className="text-sm text-gray-500 w-16">
                  {period === 'week' ? data.days[index] : data.weeks[index]}
                </span>
                <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  >
                    <span className="text-xs font-medium text-white">{value}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Score Chart */}
      <div className="bg-white rounded-2xl shadow-lg p-5">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500" />
          Điểm trung bình
        </h3>

        <div className="relative h-40">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {[100, 80, 60, 40, 20].map((val) => (
              <div key={val} className="flex items-center gap-2">
                <span className="text-xs text-gray-400 w-6">{val}</span>
                <div className="flex-1 border-t border-gray-100" />
              </div>
            ))}
          </div>

          {/* Line chart */}
          <svg className="absolute inset-0 ml-8" viewBox={`0 0 ${(data.score.length - 1) * 60} 100`} preserveAspectRatio="none">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>
            <polyline
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={data.score.map((val, i) => `${i * 60},${100 - val}`).join(' ')}
            />
            {data.score.map((val, i) => (
              <circle
                key={i}
                cx={i * 60}
                cy={100 - val}
                r="5"
                fill="#fff"
                stroke="#f59e0b"
                strokeWidth="2"
              />
            ))}
          </svg>
        </div>

        <div className="flex justify-between mt-2 ml-8">
          {(period === 'week' ? data.days : data.weeks).map((label, i) => (
            <span key={i} className="text-xs text-gray-500">{label}</span>
          ))}
        </div>
      </div>

      {/* Comparison Card */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl p-5 text-white">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          So sánh với {period === 'week' ? 'tuần trước' : 'tháng trước'}
        </h3>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/20 backdrop-blur rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">{lessonsDiff >= 0 ? '+' : ''}{lessonsDiff}%</p>
            <p className="text-xs text-white/80">Bài học</p>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">{timeDiff >= 0 ? '+' : ''}{timeDiff}%</p>
            <p className="text-xs text-white/80">Thời gian</p>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">{scoreDiff >= 0 ? '+' : ''}{scoreDiff}</p>
            <p className="text-xs text-white/80">Điểm</p>
          </div>
        </div>

        <p className="mt-4 text-sm text-white/80">
          {lessonsDiff >= 0 && scoreDiff >= 0
            ? `🎉 ${selectedChild.name} đang tiến bộ rất tốt! Hãy tiếp tục khuyến khích con.`
            : `💪 ${selectedChild.name} cần được hỗ trợ thêm. Hãy dành thời gian học cùng con.`
          }
        </p>
      </div>

      {/* Subject Breakdown */}
      <div className="bg-white rounded-2xl shadow-lg p-5">
        <h3 className="font-bold text-gray-800 mb-4">Theo môn học</h3>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🇬🇧</span>
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">Tiếng Anh</span>
                <span className="font-medium text-purple-600">92 điểm</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-400 rounded-full" style={{ width: '92%' }} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-2xl">🔢</span>
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">Toán</span>
                <span className="font-medium text-purple-600">88 điểm</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-400 rounded-full" style={{ width: '88%' }} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-2xl">🔬</span>
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">Khoa học</span>
                <span className="font-medium text-purple-600">85 điểm</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-400 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-2xl">📖</span>
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">Tiếng Việt</span>
                <span className="font-medium text-purple-600">90 điểm</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-orange-400 rounded-full" style={{ width: '90%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
