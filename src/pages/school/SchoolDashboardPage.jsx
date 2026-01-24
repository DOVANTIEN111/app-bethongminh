// src/pages/school/SchoolDashboardPage.jsx
// Dashboard for School Admin
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  Building2, Users, GraduationCap, BookOpen,
  TrendingUp, Clock, Loader2
} from 'lucide-react';

export default function SchoolDashboardPage() {
  const { profile } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [profile?.school_id]);

  const loadDashboardData = async () => {
    if (!profile?.school_id) {
      setLoading(false);
      return;
    }

    try {
      // Load stats
      const [
        { count: departmentCount },
        { count: teacherCount },
        { count: studentCount },
        { count: classCount }
      ] = await Promise.all([
        supabase.from('departments').select('*', { count: 'exact', head: true }).eq('school_id', profile.school_id),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('school_id', profile.school_id).eq('role', 'teacher'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('school_id', profile.school_id).eq('role', 'student'),
        supabase.from('classes').select('*', { count: 'exact', head: true }).eq('school_id', profile.school_id),
      ]);

      setStats({
        departments: departmentCount || 0,
        teachers: teacherCount || 0,
        students: studentCount || 0,
        classes: classCount || 0,
      });

      // Load recent activity (recent profiles)
      const { data: recent } = await supabase
        .from('profiles')
        .select('id, full_name, role, created_at')
        .eq('school_id', profile.school_id)
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentActivity(recent || []);
    } catch (err) {
      console.error('Load dashboard error:', err);
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

  if (!profile?.school_id) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
        <Building2 className="w-12 h-12 mx-auto mb-4 text-yellow-600" />
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">Chua duoc gan truong</h3>
        <p className="text-yellow-600">Vui long lien he quan tri vien de duoc gan truong.</p>
      </div>
    );
  }

  const statCards = [
    { label: 'Bo phan', value: stats?.departments || 0, icon: Building2, color: 'bg-blue-500' },
    { label: 'Giao vien', value: stats?.teachers || 0, icon: GraduationCap, color: 'bg-green-500' },
    { label: 'Hoc sinh', value: stats?.students || 0, icon: Users, color: 'bg-purple-500' },
    { label: 'Lop hoc', value: stats?.classes || 0, icon: BookOpen, color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Simple Chart Placeholder */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Thong ke
          </h3>
          <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="flex items-end justify-center gap-2 mb-4">
                <div className="w-8 bg-blue-500 rounded-t" style={{ height: `${(stats?.departments || 0) * 10 + 20}px` }}></div>
                <div className="w-8 bg-green-500 rounded-t" style={{ height: `${(stats?.teachers || 0) * 5 + 20}px` }}></div>
                <div className="w-8 bg-purple-500 rounded-t" style={{ height: `${(stats?.students || 0) * 2 + 20}px` }}></div>
                <div className="w-8 bg-amber-500 rounded-t" style={{ height: `${(stats?.classes || 0) * 8 + 20}px` }}></div>
              </div>
              <div className="flex justify-center gap-4 text-xs text-gray-500">
                <span>Bo phan</span>
                <span>Giao vien</span>
                <span>Hoc sinh</span>
                <span>Lop</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Hoat dong gan day
          </h3>
          {recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    item.role === 'teacher' ? 'bg-green-100' :
                    item.role === 'student' ? 'bg-purple-100' : 'bg-gray-100'
                  }`}>
                    {item.role === 'teacher' ? (
                      <GraduationCap className="w-5 h-5 text-green-600" />
                    ) : (
                      <Users className="w-5 h-5 text-purple-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{item.full_name}</p>
                    <p className="text-xs text-gray-500">
                      {item.role === 'teacher' ? 'Giao vien' : 'Hoc sinh'} -
                      {new Date(item.created_at).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Chua co hoat dong nao</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
