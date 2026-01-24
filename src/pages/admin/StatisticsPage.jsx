// src/pages/admin/StatisticsPage.jsx
// Statistics and Analytics Page
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
  BarChart3, Users, School, TrendingUp,
  Loader2, Calendar, PieChart
} from 'lucide-react';

const ROLE_COLORS = {
  super_admin: '#ef4444',
  school_admin: '#3b82f6',
  department_head: '#6366f1',
  teacher: '#22c55e',
  parent: '#f59e0b',
  student: '#a855f7',
};

const ROLE_LABELS = {
  super_admin: 'Super Admin',
  school_admin: 'School Admin',
  department_head: 'Tổ trưởng',
  teacher: 'Giáo viên',
  parent: 'Phụ huynh',
  student: 'Học sinh',
};

export default function StatisticsPage() {
  const [loading, setLoading] = useState(true);
  const [usersByRole, setUsersByRole] = useState([]);
  const [usersByMonth, setUsersByMonth] = useState([]);
  const [usersBySchool, setUsersBySchool] = useState([]);
  const [totalStats, setTotalStats] = useState({
    users: 0,
    schools: 0,
    activeUsers: 0,
  });

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      // Get total counts
      const [usersRes, schoolsRes, activeUsersRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('schools').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('is_active', true),
      ]);

      setTotalStats({
        users: usersRes.count || 0,
        schools: schoolsRes.count || 0,
        activeUsers: activeUsersRes.count || 0,
      });

      // Get users by role
      const { data: usersData } = await supabase
        .from('profiles')
        .select('role');

      const roleCounts = {};
      (usersData || []).forEach(u => {
        const role = u.role || 'student';
        roleCounts[role] = (roleCounts[role] || 0) + 1;
      });

      setUsersByRole(
        Object.entries(roleCounts).map(([role, count]) => ({
          role,
          label: ROLE_LABELS[role] || role,
          count,
          color: ROLE_COLORS[role] || '#6b7280',
        }))
      );

      // Get users by school (top 10)
      const { data: schoolsData } = await supabase
        .from('schools')
        .select('id, name');

      const schoolStats = await Promise.all(
        (schoolsData || []).slice(0, 10).map(async (school) => {
          const { count } = await supabase
            .from('profiles')
            .select('id', { count: 'exact', head: true })
            .eq('school_id', school.id);
          return { name: school.name, count: count || 0 };
        })
      );

      setUsersBySchool(schoolStats.sort((a, b) => b.count - a.count));

      // Generate monthly data (mock for now)
      const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
      const monthlyData = months.map((month, i) => ({
        month,
        count: Math.floor(Math.random() * 80) + 20 + i * 5,
      }));
      setUsersByMonth(monthlyData);

    } catch (err) {
      console.error('Load statistics error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const maxMonthly = Math.max(...usersByMonth.map(d => d.count));
  const totalByRole = usersByRole.reduce((sum, r) => sum + r.count, 0);
  const maxBySchool = Math.max(...usersBySchool.map(s => s.count), 1);

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng người dùng</p>
              <p className="text-2xl font-bold text-gray-900">{totalStats.users.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <School className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng trường học</p>
              <p className="text-2xl font-bold text-gray-900">{totalStats.schools.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Người dùng hoạt động</p>
              <p className="text-2xl font-bold text-gray-900">{totalStats.activeUsers.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users by Month */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Người dùng theo tháng
          </h3>
          <div className="flex items-end gap-2 h-48">
            {usersByMonth.map((data, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-gray-500">{data.count}</span>
                <div
                  className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                  style={{ height: `${(data.count / maxMonthly) * 100}%`, minHeight: '4px' }}
                />
                <span className="text-xs text-gray-500">{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Users by Role */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-purple-600" />
            Phân bố theo role
          </h3>
          <div className="space-y-3">
            {usersByRole.map((role) => (
              <div key={role.role} className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: role.color }}
                />
                <span className="flex-1 text-gray-700">{role.label}</span>
                <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(role.count / totalByRole) * 100}%`,
                      backgroundColor: role.color,
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-600 w-16 text-right">
                  {role.count} ({Math.round((role.count / totalByRole) * 100)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Users by School */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-green-600" />
          Người dùng theo trường (Top 10)
        </h3>
        {usersBySchool.length > 0 ? (
          <div className="space-y-3">
            {usersBySchool.map((school, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="w-6 text-center text-sm font-medium text-gray-500">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-700 truncate">{school.name}</span>
                    <span className="text-sm text-gray-500">{school.count} người</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${(school.count / maxBySchool) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            <School className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Chưa có dữ liệu trường học</p>
          </div>
        )}
      </div>
    </div>
  );
}
