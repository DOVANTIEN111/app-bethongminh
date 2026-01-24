// src/pages/admin/UsersPage.jsx
// Users Management Page
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
  Users, Search, Loader2, Edit, Check, X, Shield,
  GraduationCap, UserCheck, User, School
} from 'lucide-react';

const ROLE_OPTIONS = [
  { value: '', label: 'Tat ca role', icon: Users },
  { value: 'super_admin', label: 'Super Admin', icon: Shield },
  { value: 'school_admin', label: 'School Admin', icon: School },
  { value: 'department_head', label: 'To truong', icon: GraduationCap },
  { value: 'teacher', label: 'Giao vien', icon: GraduationCap },
  { value: 'parent', label: 'Phu huynh', icon: User },
  { value: 'student', label: 'Hoc sinh', icon: UserCheck },
];

const ROLE_COLORS = {
  super_admin: 'bg-red-100 text-red-700',
  school_admin: 'bg-blue-100 text-blue-700',
  department_head: 'bg-indigo-100 text-indigo-700',
  teacher: 'bg-green-100 text-green-700',
  parent: 'bg-amber-100 text-amber-700',
  student: 'bg-purple-100 text-purple-700',
};

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterSchool, setFilterSchool] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({ role: '', is_active: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersRes, schoolsRes] = await Promise.all([
        supabase
          .from('profiles')
          .select('*, school:schools(name)')
          .order('created_at', { ascending: false }),
        supabase
          .from('schools')
          .select('id, name')
          .order('name'),
      ]);

      setUsers(usersRes.data || []);
      setSchools(schoolsRes.data || []);
    } catch (err) {
      console.error('Load data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setEditFormData({
      role: user.role || 'student',
      is_active: user.is_active !== false,
    });
    setShowEditModal(true);
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          role: editFormData.role,
          is_active: editFormData.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingUser.id);

      if (error) throw error;

      setShowEditModal(false);
      loadData();
    } catch (err) {
      console.error('Save user error:', err);
      alert('Co loi xay ra: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (user) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          is_active: !user.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;
      loadData();
    } catch (err) {
      console.error('Toggle active error:', err);
      alert('Co loi xay ra: ' + err.message);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchSearch = !searchQuery ||
      u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = !filterRole || u.role === filterRole;
    const matchSchool = !filterSchool || u.school_id === filterSchool;
    return matchSearch && matchRole && matchSchool;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tim kiem theo email hoac ten..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
        >
          {ROLE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <select
          value={filterSchool}
          onChange={(e) => setFilterSchool(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tat ca truong</option>
          {schools.map((school) => (
            <option key={school.id} value={school.id}>{school.name}</option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <p className="text-gray-600">
          Tim thay: <strong className="text-blue-600">{filteredUsers.length}</strong> nguoi dung
        </p>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Nguoi dung</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Role</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Truong</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Trang thai</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Thao tac</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt="" className="w-10 h-10 rounded-full" />
                        ) : (
                          <User className="w-5 h-5 text-gray-500" />
                        )}
                      </div>
                      <span className="font-medium text-gray-900">{user.full_name || 'Chua dat ten'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${ROLE_COLORS[user.role] || 'bg-gray-100 text-gray-700'}`}>
                      {user.role || 'N/A'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {user.school?.name || <span className="text-gray-400">-</span>}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleActive(user)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.is_active !== false
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {user.is_active !== false ? 'Hoat dong' : 'Vo hieu'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="p-2 hover:bg-gray-200 rounded-lg inline-block"
                    >
                      <Edit className="w-4 h-4 text-gray-500" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Khong tim thay nguoi dung nao</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Sua thong tin nguoi dung</h3>
              <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="font-medium">{editingUser.full_name}</p>
              <p className="text-sm text-gray-500">{editingUser.email}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={editFormData.role}
                  onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                >
                  <option value="student">Hoc sinh</option>
                  <option value="parent">Phu huynh</option>
                  <option value="teacher">Giao vien</option>
                  <option value="department_head">To truong</option>
                  <option value="school_admin">School Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trang thai
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={editFormData.is_active === true}
                      onChange={() => setEditFormData({ ...editFormData, is_active: true })}
                      className="text-blue-600"
                    />
                    <span className="text-green-600">Hoat dong</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={editFormData.is_active === false}
                      onChange={() => setEditFormData({ ...editFormData, is_active: false })}
                      className="text-blue-600"
                    />
                    <span className="text-red-600">Vo hieu hoa</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50"
                >
                  Huy
                </button>
                <button
                  onClick={handleSaveUser}
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? 'Dang luu...' : 'Luu'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
