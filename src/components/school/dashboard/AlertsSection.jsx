// src/components/school/dashboard/AlertsSection.jsx
// Section cảnh báo và thông báo quan trọng
import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle, ChevronRight, XCircle, Clock, Users, BookOpen } from 'lucide-react';

const ALERT_CONFIG = {
  teacher_no_checkin: {
    icon: Clock,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    link: '/school/teachers',
  },
  student_absent_unexcused: {
    icon: Users,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    link: '/school/students',
  },
  ungraded_assignments: {
    icon: BookOpen,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    link: '/school/classes',
  },
  class_no_teacher: {
    icon: AlertTriangle,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    link: '/school/classes',
  },
};

export default function AlertsSection({ alerts, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-48 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  // Nếu không có cảnh báo
  if (!alerts || alerts.length === 0) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
            <CheckCircle className="w-7 h-7 text-green-600" />
          </div>
          <div>
            <h3 className="font-bold text-green-800 text-lg">
              Mọi thứ đang ổn!
            </h3>
            <p className="text-green-600">
              Không có vấn đề cần chú ý hôm nay.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Đếm cảnh báo theo mức độ
  const highCount = alerts.filter(a => a.severity === 'high').length;
  const mediumCount = alerts.filter(a => a.severity === 'medium').length;

  return (
    <div className={`rounded-2xl shadow-sm overflow-hidden ${
      highCount > 0 ? 'bg-red-50 border-2 border-red-200' :
      mediumCount > 0 ? 'bg-orange-50 border-2 border-orange-200' :
      'bg-yellow-50 border-2 border-yellow-200'
    }`}>
      {/* Header */}
      <div className={`px-6 py-4 ${
        highCount > 0 ? 'bg-red-100' :
        mediumCount > 0 ? 'bg-orange-100' :
        'bg-yellow-100'
      }`}>
        <div className="flex items-center gap-3">
          <AlertTriangle className={`w-6 h-6 ${
            highCount > 0 ? 'text-red-600' :
            mediumCount > 0 ? 'text-orange-600' :
            'text-yellow-600'
          }`} />
          <h3 className="font-bold text-gray-900 text-lg">
            CẦN CHÚ Ý ({alerts.length} vấn đề)
          </h3>
        </div>
      </div>

      {/* Alerts list */}
      <div className="p-4 space-y-3">
        {alerts.map((alert, index) => {
          const config = ALERT_CONFIG[alert.type] || {
            icon: AlertTriangle,
            color: 'text-gray-600',
            bgColor: 'bg-gray-50',
            borderColor: 'border-gray-200',
            link: '/school',
          };
          const Icon = config.icon;

          return (
            <Link
              key={index}
              to={config.link}
              className={`flex items-center gap-4 p-4 ${config.bgColor} ${config.borderColor} border rounded-xl hover:shadow-md transition-all group`}
            >
              {/* Icon */}
              <div className={`w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm`}>
                {alert.severity === 'high' ? (
                  <XCircle className="w-5 h-5 text-red-500" />
                ) : (
                  <Icon className={`w-5 h-5 ${config.color}`} />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className={`font-medium text-gray-900`}>
                  {alert.severity === 'high' && <span className="text-red-600">🔴 </span>}
                  {alert.severity === 'medium' && <span className="text-orange-500">⚠️ </span>}
                  {alert.message}
                </p>
                {alert.details && (
                  <p className="text-sm text-gray-500 truncate mt-0.5">
                    {alert.details.join(', ')}
                  </p>
                )}
              </div>

              {/* Arrow */}
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
