// src/components/school/dashboard/ClassScoresChart.jsx
// Biểu đồ điểm TB theo lớp (BarChart)
import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList
} from 'recharts';
import { BarChart3 } from 'lucide-react';

function getBarColor(score) {
  if (score >= 7) return '#22c55e'; // Green
  if (score >= 5) return '#f59e0b'; // Yellow
  return '#ef4444'; // Red
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
        <p className="font-bold text-gray-900 mb-2">{data.class_name}</p>
        <div className="space-y-1 text-sm">
          <p className="flex items-center justify-between gap-4">
            <span className="text-gray-500">Điểm TB:</span>
            <span className={`font-bold ${
              data.avg_score >= 7 ? 'text-green-600' :
              data.avg_score >= 5 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {data.avg_score.toFixed(1)}
            </span>
          </p>
          <p className="flex items-center justify-between gap-4">
            <span className="text-gray-500">Số học sinh:</span>
            <span className="font-medium text-gray-900">{data.student_count}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
}

export default function ClassScoresChart({ data, loading }) {
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
    // Rút gọn tên lớp cho trục X
    shortName: item.class_name?.length > 6
      ? item.class_name.substring(0, 6)
      : item.class_name,
  }));

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Điểm trung bình theo lớp</h3>
          <p className="text-sm text-gray-500">{chartData.length} lớp học</p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-500 rounded" />
          <span className="text-gray-600">Giỏi (≥7)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-yellow-500 rounded" />
          <span className="text-gray-600">TB (5-7)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-500 rounded" />
          <span className="text-gray-600">Yếu (&lt;5)</span>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 ? (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="shortName"
                tick={{ fontSize: 11, fill: '#6b7280' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 10]}
                ticks={[0, 2, 4, 6, 8, 10]}
                tick={{ fontSize: 11, fill: '#6b7280' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f3f4f6' }} />
              <Bar dataKey="avg_score" radius={[4, 4, 0, 0]} maxBarSize={40}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={getBarColor(entry.avg_score)} />
                ))}
                <LabelList
                  dataKey="avg_score"
                  position="top"
                  formatter={(value) => value?.toFixed(1)}
                  style={{ fontSize: 10, fill: '#6b7280' }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">Chưa có dữ liệu điểm</p>
          </div>
        </div>
      )}
    </div>
  );
}
