// src/components/school/dashboard/TopTeachersTable.jsx
// Bảng xếp hạng giáo viên tích cực
import React from 'react';
import { Link } from 'react-router-dom';
import { Award, ChevronRight, BookOpen, Users } from 'lucide-react';

const RANK_ICONS = ['🥇', '🥈', '🥉'];

export default function TopTeachersTable({ data, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <div className="h-6 bg-gray-200 rounded w-48 animate-pulse" />
        </div>
        <div className="p-4 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
              <div className="w-8 h-8 bg-gray-200 rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-32 mb-1" />
                <div className="h-3 bg-gray-100 rounded w-20" />
              </div>
              <div className="h-6 bg-gray-200 rounded w-12" />
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
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
            <Award className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Top 5 Giáo viên tích cực</h3>
            <p className="text-sm text-gray-500">Giao bài nhiều nhất</p>
          </div>
        </div>
      </div>

      {/* Table */}
      {data && data.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
                <th className="px-6 py-3 font-medium">Hạng</th>
                <th className="px-6 py-3 font-medium">Giáo viên</th>
                <th className="px-6 py-3 font-medium">Bộ phận</th>
                <th className="px-6 py-3 font-medium text-center">Bài giao</th>
                <th className="px-6 py-3 font-medium text-center">Học sinh</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.map((teacher, index) => (
                <tr key={teacher.teacher_id} className="hover:bg-gray-50 transition-colors">
                  {/* Rank */}
                  <td className="px-6 py-4">
                    <span className="text-xl">
                      {index < 3 ? RANK_ICONS[index] : (
                        <span className="text-sm font-medium text-gray-500">{index + 1}</span>
                      )}
                    </span>
                  </td>

                  {/* Name */}
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{teacher.full_name}</p>
                  </td>

                  {/* Department */}
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{teacher.department_name || '-'}</span>
                  </td>

                  {/* Assignments */}
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                      <BookOpen className="w-3 h-3" />
                      {teacher.total_assignments}
                    </span>
                  </td>

                  {/* Students */}
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                      <Users className="w-3 h-3" />
                      {teacher.total_students}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-8 text-center">
          <Award className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500">Chưa có dữ liệu xếp hạng</p>
        </div>
      )}

      {/* Footer */}
      {data && data.length > 0 && (
        <div className="p-4 border-t border-gray-100">
          <Link
            to="/school/teachers"
            className="flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Xem tất cả giáo viên
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
