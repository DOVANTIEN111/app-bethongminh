// src/pages/AdminDashboard.jsx
// Trang quản trị cho Admin
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRBAC, ROLES } from '../contexts/RBACContext';
import {
  Users, GraduationCap, BookOpen, Shield,
  Search, Filter, MoreVertical, Edit, Trash2,
  ChevronDown, Check, X, Loader2, BarChart3,
  TrendingUp, School, FileText
} from 'lucide-react';

// Role badges
const ROLE_BADGES = {
  admin: { label: 'Admin', color: 'bg-red-100 text-red-700' },
  teacher: { label: 'Giáo viên', color: 'bg-blue-100 text-blue-700' },
  parent: { label: 'Phụ huynh', color: 'bg-green-100 text-green-700' },
  student: { label: 'Học sinh', color: 'bg-amber-100 text-amber-700' },
};

export default function AdminDashboard() {
  const { userProfile, getAdminStats, getAllUsers, updateUserRole, deleteUser, signOut } = useRBAC();

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRoleMenu, setShowRoleMenu] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [statsData, usersData] = await Promise.all([
      getAdminStats(),
      getAllUsers()
    ]);
    setStats(statsData);
    setUsers(usersData);
    setLoading(false);
  };

  const handleSearch = async () => {
    const data = await getAllUsers({
      search: searchQuery,
      role: filterRole !== 'all' ? filterRole : undefined
    });
    setUsers(data);
  };

  const handleRoleChange = async (userId, newRole) => {
    const { error } = await updateUserRole(userId, newRole);
    if (!error) {
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    }
    setShowRoleMenu(null);
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Bạn có chắc muốn xóa người dùng này?')) return;
    const { error } = await deleteUser(userId);
    if (!error) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  const filteredUsers = users.filter(u => {
    const matchSearch = !searchQuery ||
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = filterRole === 'all' || u.role === filterRole;
    return matchSearch && matchRole;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Quản trị viên</h1>
                <p className="text-white/80 text-sm">{userProfile?.name}</p>
              </div>
            </div>
            <button
              onClick={signOut}
              className="px-4 py-2 bg-white/20 rounded-xl text-sm hover:bg-white/30"
            >
              Đăng xuất
            </button>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-5 h-5" />
                  <span className="text-sm opacity-80">Tổng users</span>
                </div>
                <p className="text-2xl font-bold">{stats.total_users}</p>
              </div>
              <div className="bg-white/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen className="w-5 h-5" />
                  <span className="text-sm opacity-80">Học sinh</span>
                </div>
                <p className="text-2xl font-bold">{stats.total_students}</p>
              </div>
              <div className="bg-white/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <GraduationCap className="w-5 h-5" />
                  <span className="text-sm opacity-80">Giáo viên</span>
                </div>
                <p className="text-2xl font-bold">{stats.total_teachers}</p>
              </div>
              <div className="bg-white/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <School className="w-5 h-5" />
                  <span className="text-sm opacity-80">Lớp học</span>
                </div>
                <p className="text-2xl font-bold">{stats.total_classes}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Search & Filter */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Tìm kiếm theo tên hoặc email..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Tất cả vai trò</option>
              <option value="admin">Admin</option>
              <option value="teacher">Giáo viên</option>
              <option value="parent">Phụ huynh</option>
              <option value="student">Học sinh</option>
            </select>
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
            >
              Tìm kiếm
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">
              Danh sách người dùng ({filteredUsers.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Người dùng</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Vai trò</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Ngày tạo</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl">
                          {user.avatar || '👤'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{user.name}</p>
                          <p className="text-xs text-gray-500">ID: {user.id?.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{user.email}</td>
                    <td className="px-4 py-3">
                      <div className="relative">
                        <button
                          onClick={() => setShowRoleMenu(showRoleMenu === user.id ? null : user.id)}
                          className={`px-3 py-1 rounded-full text-sm font-medium ${ROLE_BADGES[user.role]?.color} flex items-center gap-1`}
                        >
                          {ROLE_BADGES[user.role]?.label}
                          <ChevronDown className="w-4 h-4" />
                        </button>

                        {/* Role dropdown */}
                        {showRoleMenu === user.id && (
                          <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10 min-w-[140px]">
                            {Object.entries(ROLE_BADGES).map(([role, info]) => (
                              <button
                                key={role}
                                onClick={() => handleRoleChange(user.id, role)}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center justify-between"
                              >
                                <span>{info.label}</span>
                                {user.role === role && <Check className="w-4 h-4 text-green-500" />}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-sm">
                      {new Date(user.created_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-2 hover:bg-red-50 rounded-lg text-red-500"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-gray-500">
                      Không tìm thấy người dùng nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
