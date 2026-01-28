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
        alert('Đã cập nhật thông tin giáo viên!');
      } else {
        // === TẠO GIÁO VIÊN MỚI ===
        const email = formData.email.trim().toLowerCase();

        // 1. Kiểm tra email đã tồn tại chưa
        const { data: existingUser } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', email)
          .single();

        if (existingUser) {
          alert('Email này đã được sử dụng. Vui lòng dùng email khác.');
          setSaving(false);
          return;
        }

        // 2. Lưu session hiện tại
        const { data: currentSession } = await supabase.auth.getSession();
        const savedSession = currentSession?.session;

        // 3. Tạo tài khoản auth
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: email,
          password: 'Teacher@123',
          options: {
            data: {
              full_name: formData.full_name.trim(),
              role: 'teacher',
            },
          },
        });

        // 4. Khôi phục session cũ NGAY LẬP TỨC
        if (savedSession) {
          await supabase.auth.setSession({
            access_token: savedSession.access_token,
            refresh_token: savedSession.refresh_token,
          });
        }

        // 5. Kiểm tra lỗi signUp
        if (signUpError) {
          if (signUpError.message.includes('already registered')) {
            throw new Error('Email này đã được đăng ký. Vui lòng dùng email khác.');
          }
          throw signUpError;
        }

        // 6. Tạo/cập nhật profile
        if (signUpData?.user) {
          const { error: profileError } = await supabase.from('profiles').upsert({
            id: signUpData.user.id,
            email: email,
            full_name: formData.full_name.trim(),
            role: 'teacher',
            school_id: profile.school_id,
            department_id: formData.department_id || null,
            phone: formData.phone.trim() || null,
            is_active: true,
            created_at: new Date().toISOString(),
          });

          if (profileError) {
            console.error('Profile error:', profileError);
            // Không throw vì user đã được tạo
          }

          alert(`Đã tạo giáo viên thành công!\n\nEmail: ${email}\nMật khẩu: Teacher@123`);
        } else {
          throw new Error('Không thể tạo tài khoản. Vui lòng thử lại.');
        }
      }

      setShowModal(false);
      loadData();
    } catch (err) {
      console.error('Save teacher error:', err);
      alert('Có lỗi xảy ra: ' + (err.message || 'Vui lòng thử lại'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (teacher) => {
    if (!confirm(`Bạn có chắc muốn xóa giáo viên "${teacher.full_name}"?`)) return;

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
      alert('Có lỗi xảy ra: ' + err.message);
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
            placeholder="Tìm kiếm giáo viên..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tất cả bộ phận</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>{dept.name}</option>
          ))}
        </select>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Thêm giáo viên
        </button>
      </div>

      {/* Teachers List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Giáo viên</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Số điện thoại</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Bộ phận</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Thao tác</th>
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
                    <p>Chưa có giáo viên nào</p>
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
                {editingTeacher ? 'Sửa thông tin giáo viên' : 'Thêm giáo viên mới'}
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
                  Họ và tên *
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Nguyễn Văn A"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại
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
                  Bộ phận
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={formData.department_id}
                    onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Chọn bộ phận --</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {!editingTeacher && (
                <p className="text-sm text-gray-500 bg-yellow-50 p-3 rounded-lg">
                  Mật khẩu mặc định: <strong>Teacher@123</strong>
                </p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !formData.email.trim() || !formData.full_name.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? 'Đang lưu...' : 'Lưu'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
