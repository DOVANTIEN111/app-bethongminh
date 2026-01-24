// src/pages/school/TeachersPage.jsx
// Teachers Management Page
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  GraduationCap, Plus, Edit, Trash2, Search,
  Loader2, X, Mail, Phone, Building2
} from 'lucide-react';

export default function TeachersPage() {
  const { profile } = useAuth();
  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [formData, setFormData] = useState({
    email: '', full_name: '', phone: '', department_id: ''
  });
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');

  useEffect(() => {
    loadData();
  }, [profile?.school_id]);

  const loadData = async () => {
    if (!profile?.school_id) {
      setLoading(false);
      return;
    }

    try {
      const [teachersRes, deptsRes] = await Promise.all([
        supabase
          .from('profiles')
          .select('*, department:departments(name)')
          .eq('school_id', profile.school_id)
          .eq('role', 'teacher')
          .order('full_name'),
        supabase
          .from('departments')
          .select('id, name')
          .eq('school_id', profile.school_id)
          .order('name'),
      ]);

      setTeachers(teachersRes.data || []);
      setDepartments(deptsRes.data || []);
    } catch (err) {
      console.error('Load data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (teacher = null) => {
    if (teacher) {
      setEditingTeacher(teacher);
      setFormData({
        email: teacher.email,
        full_name: teacher.full_name,
        phone: teacher.phone || '',
        department_id: teacher.department_id || '',
      });
    } else {
      setEditingTeacher(null);
      setFormData({ email: '', full_name: '', phone: '', department_id: '' });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.email.trim() || !formData.full_name.trim()) return;

    setSaving(true);
    try {
      if (editingTeacher) {
        // Update existing teacher
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: formData.full_name.trim(),
            phone: formData.phone.trim() || null,
            department_id: formData.department_id || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingTeacher.id);

        if (error) throw error;
      } else {
        // Create new teacher
        // First create auth user
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: formData.email.trim(),
          password: 'Teacher@123', // Default password
          email_confirm: true,
          user_metadata: {
            full_name: formData.full_name.trim(),
            role: 'teacher',
          },
        });

        if (authError) {
          // Try using signUp instead
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: formData.email.trim(),
            password: 'Teacher@123',
            options: {
              data: {
                full_name: formData.full_name.trim(),
                role: 'teacher',
              },
            },
          });

          if (signUpError) throw signUpError;

          // Update profile with school_id and department_id
          if (signUpData.user) {
            await supabase
              .from('profiles')
              .update({
                school_id: profile.school_id,
                department_id: formData.department_id || null,
                phone: formData.phone.trim() || null,
              })
              .eq('id', signUpData.user.id);
          }
        } else if (authData.user) {
          // Create profile
          await supabase
            .from('profiles')
            .upsert({
              id: authData.user.id,
              email: formData.email.trim(),
              full_name: formData.full_name.trim(),
              role: 'teacher',
              school_id: profile.school_id,
              department_id: formData.department_id || null,
              phone: formData.phone.trim() || null,
              is_active: true,
            });
        }
      }

      setShowModal(false);
      loadData();
    } catch (err) {
      console.error('Save teacher error:', err);
      alert('Co loi xay ra: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (teacher) => {
    if (!confirm(`Ban co chac muon xoa giao vien "${teacher.full_name}"?`)) return;

    try {
      // Soft delete - set is_active = false
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: false })
        .eq('id', teacher.id);

      if (error) throw error;
      loadData();
    } catch (err) {
      console.error('Delete teacher error:', err);
      alert('Co loi xay ra: ' + err.message);
    }
  };

  const filteredTeachers = teachers.filter(t => {
    const matchSearch = !searchQuery ||
      t.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDept = !filterDepartment || t.department_id === filterDepartment;
    return matchSearch && matchDept;
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tim kiem giao vien..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tat ca bo phan</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>{dept.name}</option>
          ))}
        </select>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Them giao vien
        </button>
      </div>

      {/* Teachers List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Giao vien</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">So dien thoai</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Bo phan</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Thao tac</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTeachers.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        {teacher.avatar_url ? (
                          <img src={teacher.avatar_url} alt="" className="w-10 h-10 rounded-full" />
                        ) : (
                          <GraduationCap className="w-5 h-5 text-green-600" />
                        )}
                      </div>
                      <span className="font-medium text-gray-900">{teacher.full_name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{teacher.email}</td>
                  <td className="px-4 py-3 text-gray-600">{teacher.phone || '-'}</td>
                  <td className="px-4 py-3">
                    {teacher.department?.name ? (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {teacher.department.name}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleOpenModal(teacher)}
                      className="p-2 hover:bg-gray-200 rounded-lg inline-block"
                    >
                      <Edit className="w-4 h-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => handleDelete(teacher)}
                      className="p-2 hover:bg-red-100 rounded-lg inline-block ml-1"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredTeachers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-gray-500">
                    <GraduationCap className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Chua co giao vien nao</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">
                {editingTeacher ? 'Sua thong tin giao vien' : 'Them giao vien moi'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                    disabled={!!editingTeacher}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ho va ten *
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Nguyen Van A"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  So dien thoai
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0912345678"
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bo phan
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={formData.department_id}
                    onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Chon bo phan --</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {!editingTeacher && (
                <p className="text-sm text-gray-500 bg-yellow-50 p-3 rounded-lg">
                  Mat khau mac dinh: <strong>Teacher@123</strong>
                </p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50"
                >
                  Huy
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !formData.email.trim() || !formData.full_name.trim()}
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
