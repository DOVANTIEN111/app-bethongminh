// src/components/school/dashboard/RecentActivities.jsx
// Feed hoạt động gần đây với realtime updates
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, RefreshCw, Bell, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const ACTION_CONFIG = {
  check_in: { icon: '👨‍🏫', color: 'bg-blue-100' },
  complete_lesson: { icon: '👧', color: 'bg-green-100' },
  assign_homework: { icon: '📝', color: 'bg-purple-100' },
  send_message: { icon: '💬', color: 'bg-pink-100' },
  create_event: { icon: '📅', color: 'bg-orange-100' },
  submit_assignment: { icon: '✅', color: 'bg-teal-100' },
  grade_assignment: { icon: '📊', color: 'bg-indigo-100' },
};

function formatTime(dateStr) {
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: vi });
  } catch {
    return '';
  }
}

export default function RecentActivities({ activities, loading, onRefresh, lastUpdate }) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh?.();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  if (loading && (!activities || activities.length === 0)) {
    return (
      <div className="bg-white rounded-2xl shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <div className="h-6 bg-gray-200 rounded w-48 animate-pulse" />
        </div>
        <div className="p-4 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Hoạt động gần đây</h3>
              {lastUpdate && (
                <p className="text-xs text-gray-500">
                  Cập nhật: {formatTime(lastUpdate)}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Activities list */}
      <div className="max-h-[400px] overflow-y-auto">
        {activities && activities.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {activities.map((activity, index) => {
              const config = ACTION_CONFIG[activity.action] || { icon: '📌', color: 'bg-gray-100' };

              return (
                <div
                  key={activity.id || index}
                  className="flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors"
                >
                  {/* Avatar */}
                  <div className={`w-10 h-10 ${config.color} rounded-full flex items-center justify-center text-lg flex-shrink-0`}>
                    {activity.profiles?.avatar || config.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      {activity.description || `${activity.profiles?.full_name || 'Người dùng'} ${activity.action}`}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTime(activity.created_at)}
                    </p>
                  </div>

                  {/* Score badge (for lessons) */}
                  {activity.metadata?.score !== undefined && (
                    <div className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      {activity.metadata.score} điểm
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center">
            <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">Chưa có hoạt động nào</p>
          </div>
        )}
      </div>

      {/* Footer */}
      {activities && activities.length > 0 && (
        <div className="p-4 border-t border-gray-100">
          <Link
            to="/school/activities"
            className="flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Xem tất cả hoạt động
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
