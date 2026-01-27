// src/components/school/dashboard/StatsCards.jsx
// 4 Card thống kê tổng quan với sparkline
import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown } from 'lucide-react';

// Mini sparkline component
function Sparkline({ data, color = '#3b82f6' }) {
  if (!data || data.length === 0) return null;

  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 60;
    const y = 20 - ((value - min) / range) * 18;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width="60" height="24" className="ml-auto">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function StatsCards({ stats, sparklineData, loading }) {
  const cards = [
    {
      id: 'teachers',
      icon: '👨‍🏫',
      label: 'Giáo viên đi làm hôm nay',
      value: stats?.present_teachers || 0,
      total: stats?.total_teachers || 0,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      sparkColor: '#3b82f6',
      link: '/school/teachers',
    },
    {
      id: 'students',
      icon: '👧',
      label: 'Học sinh đi học hôm nay',
      value: stats?.present_students || 0,
      total: stats?.total_students || 0,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      sparkColor: '#22c55e',
      link: '/school/students',
    },
    {
      id: 'classes',
      icon: '🏫',
      label: 'Lớp học đang hoạt động',
      value: stats?.total_classes || 0,
      total: null,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      sparkColor: '#f97316',
      link: '/school/classes',
      subText: stats?.classes_no_teacher > 0 ? `${stats.classes_no_teacher} lớp chưa có GVCN` : null,
    },
    {
      id: 'lessons',
      icon: '📚',
      label: 'Bài học hoàn thành hôm nay',
      value: stats?.lessons_today || 0,
      total: null,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      sparkColor: '#a855f7',
      link: '/school/students',
      change: stats?.lessons_change,
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-gray-200 rounded-xl" />
              <div className="flex-1">
                <div className="h-8 bg-gray-200 rounded w-20 mb-2" />
                <div className="h-4 bg-gray-100 rounded w-32" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const percentage = card.total
          ? Math.round((card.value / card.total) * 100) || 0
          : null;

        return (
          <Link
            key={card.id}
            to={card.link}
            className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition-all group"
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className={`w-14 h-14 ${card.bgColor} rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                {card.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Value */}
                <div className="flex items-baseline gap-1">
                  <span className={`text-2xl font-bold ${card.textColor}`}>
                    {card.value.toLocaleString()}
                  </span>
                  {card.total !== null && (
                    <span className="text-gray-400 text-sm">
                      / {card.total.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Label */}
                <p className="text-sm text-gray-600 truncate">{card.label}</p>

                {/* Percentage or SubText */}
                {percentage !== null && (
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`h-1.5 flex-1 ${card.bgColor} rounded-full overflow-hidden`}>
                      <div
                        className={`h-full bg-gradient-to-r ${card.color} rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className={`text-xs font-medium ${card.textColor}`}>
                      {percentage}%
                    </span>
                  </div>
                )}

                {card.subText && (
                  <p className="text-xs text-orange-500 mt-1">{card.subText}</p>
                )}

                {card.change !== undefined && card.change !== null && (
                  <div className={`flex items-center gap-1 mt-1 text-xs ${
                    card.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {card.change >= 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span>{card.change >= 0 ? '+' : ''}{card.change}% so với hôm qua</span>
                  </div>
                )}
              </div>
            </div>

            {/* Sparkline */}
            {sparklineData?.[card.id] && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">7 ngày qua</span>
                  <Sparkline data={sparklineData[card.id]} color={card.sparkColor} />
                </div>
              </div>
            )}
          </Link>
        );
      })}
    </div>
  );
}
