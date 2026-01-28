// src/components/school/dashboard/QuickActions.jsx
// Nút truy cập nhanh
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const ACTIONS = [
  {
    id: 'teachers',
    icon: '👨‍🏫',
    iconBg: 'bg-blue-100',
    label: 'Giáo viên',
    description: 'Quản lý giáo viên',
    link: '/school/teachers',
    color: 'hover:border-blue-300',
  },
  {
    id: 'students',
    icon: '👧',
    iconBg: 'bg-green-100',
    label: 'Học sinh',
    description: 'Quản lý học sinh',
    link: '/school/students',
    color: 'hover:border-green-300',
  },
  {
    id: 'classes',
    icon: '📚',
    iconBg: 'bg-orange-100',
    label: 'Lớp học',
    description: 'Quản lý lớp học',
    link: '/school/classes',
    color: 'hover:border-orange-300',
  },
  {
    id: 'departments',
    icon: '🏢',
    iconBg: 'bg-purple-100',
    label: 'Bộ phận',
    description: 'Quản lý bộ phận',
    link: '/school/departments',
    color: 'hover:border-purple-300',
  },
];

export default function QuickActions() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
          <span className="text-xl">⚡</span>
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Truy cập nhanh</h3>
          <p className="text-sm text-gray-500">Các chức năng thường dùng</p>
        </div>
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-2 gap-3">
        {ACTIONS.map((action) => (
          <Link
            key={action.id}
            to={action.link}
            className={`group flex items-center gap-3 p-4 rounded-xl border-2 border-gray-100 ${action.color} transition-all hover:shadow-md`}
          >
            {/* Icon */}
            <div className={`w-12 h-12 ${action.iconBg} rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform`}>
              {action.icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                {action.label}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {action.description}
              </p>
            </div>

            {/* Arrow */}
            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>

      {/* Additional links */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-center">
          <Link to="/school/settings" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
            ⚙️ Cài đặt
          </Link>
        </div>
      </div>
    </div>
  );
}
