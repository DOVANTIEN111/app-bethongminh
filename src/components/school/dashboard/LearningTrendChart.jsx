// src/components/school/dashboard/LearningTrendChart.jsx
// Biểu đồ xu hướng học tập 30 ngày (LineChart)
import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { TrendingUp } from 'lucide-react';

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
        <p className="font-medium text-gray-900 mb-2">
          {new Date(label).toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' })}
        </p>
        <div className="space-y-1 text-sm">
          {payload.map((entry, index) => (
            <p key={index} className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600">{entry.name}:</span>
              <span className="font-medium" style={{ color: entry.color }}>
                {entry.value}
              </span>
            </p>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

function CustomLegend({ payload }) {
  return (
    <div className="flex justify-center gap-6 mt-4">
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-gray-600">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function LearningTrendChart({ data, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse" />
          <div className="h-6 bg-gray-200 rounded w-48 animate-pulse" />
        </div>
        <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
      </div>
    );
  }

  // Chuẩn bị dữ liệu
  const chartData = (data || []).map(item => ({
    ...item,
    // Format date for display
    displayDate: new Date(item.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
  }));

  // Tính tổng và trung bình
  const totalLessons = chartData.reduce((sum, d) => sum + d.lessons, 0);
  const avgScore = chartData.length > 0
    ? Math.round(chartData.filter(d => d.avgScore > 0).reduce((sum, d) => sum + d.avgScore, 0) / chartData.filter(d => d.avgScore > 0).length || 0)
    : 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Xu hướng học tập</h3>
            <p className="text-sm text-gray-500">30 ngày qua</p>
          </div>
        </div>

        {/* Summary stats */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-lg font-bold text-blue-600">{totalLessons}</p>
            <p className="text-xs text-gray-500">Bài học</p>
          </div>
          <div className="w-px h-8 bg-gray-200" />
          <div className="text-right">
            <p className="text-lg font-bold text-green-600">{avgScore}</p>
            <p className="text-xs text-gray-500">Điểm TB</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 ? (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="displayDate"
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
                interval={4}
              />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[0, 10]}
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="lessons"
                name="Bài học hoàn thành"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#3b82f6' }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="avgScore"
                name="Điểm TB"
                stroke="#22c55e"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#22c55e' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl">
          <div className="text-center">
            <TrendingUp className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">Chưa có dữ liệu học tập</p>
          </div>
        </div>
      )}
    </div>
  );
}
