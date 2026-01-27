// src/components/school/dashboard/AttendanceChart.jsx
// Biểu đồ tỷ lệ chuyên cần (PieChart)
import React from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip
} from 'recharts';
import { Users } from 'lucide-react';

const COLORS = {
  present: '#22c55e',
  late: '#f59e0b',
  absent_excused: '#3b82f6',
  absent_unexcused: '#ef4444',
};

const LABELS = {
  present: 'Đi học',
  late: 'Đi muộn',
  absent_excused: 'Nghỉ phép',
  absent_unexcused: 'Nghỉ không phép',
};

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-3">
        <p className="font-medium text-gray-900">{data.name}</p>
        <p className="text-sm text-gray-600">
          {data.value} ({data.payload.percent}%)
        </p>
      </div>
    );
  }
  return null;
}

function CustomLegend({ payload }) {
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
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

export default function AttendanceChart({ data, loading, dateRange }) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse" />
          <div className="h-6 bg-gray-200 rounded w-48 animate-pulse" />
        </div>
        <div className="h-64 flex items-center justify-center">
          <div className="w-40 h-40 bg-gray-100 rounded-full animate-pulse" />
        </div>
      </div>
    );
  }

  // Chuẩn bị dữ liệu cho chart
  const chartData = [];
  const total = data?.total || 0;

  if (data) {
    if (data.present > 0) {
      chartData.push({
        name: LABELS.present,
        value: data.present,
        percent: total > 0 ? Math.round((data.present / total) * 100) : 0,
        color: COLORS.present,
      });
    }
    if (data.late > 0) {
      chartData.push({
        name: LABELS.late,
        value: data.late,
        percent: total > 0 ? Math.round((data.late / total) * 100) : 0,
        color: COLORS.late,
      });
    }
    if (data.absent_excused > 0) {
      chartData.push({
        name: LABELS.absent_excused,
        value: data.absent_excused,
        percent: total > 0 ? Math.round((data.absent_excused / total) * 100) : 0,
        color: COLORS.absent_excused,
      });
    }
    if (data.absent_unexcused > 0) {
      chartData.push({
        name: LABELS.absent_unexcused,
        value: data.absent_unexcused,
        percent: total > 0 ? Math.round((data.absent_unexcused / total) * 100) : 0,
        color: COLORS.absent_unexcused,
      });
    }
  }

  // Tính tỷ lệ đi học
  const attendanceRate = data && total > 0
    ? Math.round(((data.present + data.late) / total) * 100)
    : 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
          <Users className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Tỷ lệ chuyên cần</h3>
          <p className="text-sm text-gray-500">{dateRange || 'Tuần này'}</p>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 ? (
        <div className="h-64 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Center label */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center" style={{ marginTop: '-10px' }}>
            <p className="text-3xl font-bold text-gray-900">{attendanceRate}%</p>
            <p className="text-xs text-gray-500">Đi học</p>
          </div>
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl">
          <div className="text-center">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">Chưa có dữ liệu điểm danh</p>
          </div>
        </div>
      )}

      {/* Summary */}
      {data && total > 0 && (
        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">
          <div className="text-center p-3 bg-green-50 rounded-xl">
            <p className="text-lg font-bold text-green-600">{data.present + data.late}</p>
            <p className="text-xs text-gray-600">Đi học</p>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-xl">
            <p className="text-lg font-bold text-red-600">{data.absent_excused + data.absent_unexcused}</p>
            <p className="text-xs text-gray-600">Vắng mặt</p>
          </div>
        </div>
      )}
    </div>
  );
}
