// src/pages/admin/AdminDashboardPage.jsx
// Admin Dashboard with Statistics
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { School, Users, GraduationCap, UserCheck, TrendingUp, Loader2 } from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalSchools: 0,
    totalUsers: 0,
    totalTeachers: 0,
    totalStudents: 0,
  });
  const [recentSchools, setRecentSchools] = useState([]);
  const [monthlyUsers, setMonthlyUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Get stats in parallel
      const [schoolsRes, usersRes, teachersRes, studentsRes, recentSchoolsRes] = await Promise.all([
        supabase.from('schools').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'teacher'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'student'),
        supabase.from('schools').select('*').order('created_at', { ascending: false }).limit(5),
      ]);

      setStats({
        totalSchools: schoolsRes.count || 0,
        totalUsers: usersRes.count || 0,
        totalTeachers: teachersRes.count || 0,
        totalStudents: studentsRes.count || 0,
      });

      setRecentSchools(recentSchoolsRes.data || []);

      // Generate mock monthly data (in real app, you'd query this from database)
      const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
      const mockData = months.map((month, i) => ({
        month,
        users: Math.floor(Math.random() * 50) + 10 + i * 5,
        revenue: Math.floor(Math.random() * 10000000) + 5000000,
      }));
      setMonthlyUsers(mockData);
    } catch (err) {
      console.error('Load dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Truong hoc', value: stats.totalSchools, icon: School, color: 'bg-blue-500', bgLight: 'bg-blue-100' },
    { label: 'Tong nguoi dung', value: stats.totalUsers, icon: Users, color: 'bg-green-500', bgLight: 'bg-green-100' },
    { label: 'Giao vien', value: stats.totalTeachers, icon: GraduationCap, color: 'bg-purple-500', bgLight: 'bg-purple-100' },
    { label: 'Hoc sinh', value: stats.totalStudents, icon: UserCheck, color: 'bg-amber-500', bgLight: 'bg-amber-100' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const maxUsers = Math.max(...monthlyUsers.map(d => d.users));

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.bgLight} rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Nguoi dung moi theo thang
          </h3>
          <div className="flex items-end gap-2 h-48">
            {monthlyUsers.map((data, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                  style={{ height: `${(data.users / maxUsers) * 100}%`, minHeight: '4px' }}
                />
                <span className="text-xs text-gray-500">{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Doanh thu theo thang
          </h3>
          <div className="flex items-end gap-2 h-48">
            {monthlyUsers.map((data, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-green-500 rounded-t transition-all hover:bg-green-600"
                  style={{ height: `${(data.revenue / 15000000) * 100}%`, minHeight: '4px' }}
                />
                <span className="text-xs text-gray-500">{data.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Schools */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Truong hoc moi dang ky</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {recentSchools.length > 0 ? (
            recentSchools.map((school) => (
              <div key={school.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <School className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">{school.name}</p>
                    <p className="text-sm text-gray-500">{school.email || school.address || 'Chua cap nhat thong tin'}</p>
                  </div>
                  <div className="text-sm text-gray-400">
                    {new Date(school.created_at).toLocaleDateString('vi-VN')}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              <School className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Chua co truong hoc nao</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
