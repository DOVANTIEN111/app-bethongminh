// src/pages/admin/SchoolsPage.jsx
// Trang quản lý trường học - Tự động tạo tài khoản Hiệu trưởng
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
  School, Plus, Edit2, Trash2, Search, RefreshCw,
  Loader2, X, MapPin, Phone, Mail, Users, GraduationCap,
  Calendar, CheckCircle, UserCog, Eye
} from 'lucide-react';

const DEFAULT_PASSWORD = 'School@123';

export default function SchoolsPage() {
  const navigate = useNavigate();
  const [schools, setSchools] = useState([]);
  const [schoolStats, setSchoolStats] = useState({});
  const [schoolPrincipals, setSchoolPrincipals] = useState({});
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSchool, setEditingSchool] = useState(null);
  const [saving, setSaving] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Form data
  const [formData, setFormData] = useState({
    // Thông tin trường
    name: '',
    email: '',
    address: '',
    phone: '',
    // Thông tin hiệu trưởng
    principal_name: '',
    principal_email: '',
    principal_phone: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load schools
      const { data: schoolsData, error: schoolsError } = await supabase
        .from('schools')
        .select('id, name, email, address, phone, created_at')
        .order('created_at', { ascending: false });

      if (schoolsError) {
        console.error('Schools error:', schoolsError);
        setSchools([]);
        return;
      }

      setSchools(schoolsData || []);

      // Load plans
      loadPlans();

      // Load principals và stats cho từng trường
      if (schoolsData && schoolsData.length > 0) {
        loadPrincipals(schoolsData.map(s => s.id));
        loadAllStats(schoolsData.map(s => s.id));
      }
    } catch (err) {
      console.error('Load error:', err);
      setSchools([]);
    } finally {
      setLoading(false);
    }
  };

  const loadPlans = async () => {
    try {
      const { data } = await supabase
        .from('plans')
        .select('id, name, slug');
      if (data) setPlans(data);
    } catch {
      // Ignore
    }
  };

  const loadPrincipals = async (schoolIds) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone, school_id')
        .eq('role', 'school_admin')
        .in('school_id', schoolIds);

      if (data) {
        const principalsMap = {};
        data.forEach(p => {
          principalsMap[p.school_id] = p;
        });
        setSchoolPrincipals(principalsMap);
      }
    } catch {
      // Ignore
    }
  };

  const loadAllStats = async (schoolIds) => {
    const defaultStats = {};
    schoolIds.forEach(id => {
      defaultStats[id] = { teachers: 0, students: 0, classes: 0 };
    });
    setSchoolStats(defaultStats);

    try {
      for (const id of schoolIds) {
        try {
          const [t, s, c] = await Promise.all([
            supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('school_id', id).eq('role', 'teacher'),
            supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('school_id', id).eq('role', 'student'),
            supabase.from('classes').select('id', { count: 'exact', head: true }).eq('school_id', id),
          ]);
          setSchoolStats(prev => ({
            ...prev,
            [id]: { teachers: t.count || 0, students: s.count || 0, classes: c.count || 0 }
          }));
        } catch {
          // Keep default
        }
      }
    } catch {
      // Keep default
    }
  };

  const handleOpenModal = async (school = null) => {
    if (school) {
      setEditingSchool(school);

      // Load thông tin hiệu trưởng hiện tại
      const principal = schoolPrincipals[school.id];

      setFormData({
        name: school.name || '',
        email: school.email || '',
        address: school.address || '',
        phone: school.phone || '',
        principal_name: principal?.full_name || '',
        principal_email: principal?.email || '',
        principal_phone: principal?.phone || '',
      });
    } else {
      setEditingSchool(null);
      setFormData({
        name: '',
        email: '',
        address: '',
        phone: '',
        principal_name: '',
        principal_email: '',
        principal_phone: '',
      });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    // Validate
    if (!formData.name.trim()) {
      alert('Vui lòng nhập tên trường');
      return;
    }
    if (!formData.email.trim()) {
      alert('Vui lòng nhập email trường');
      return;
    }

    // Validate hiệu trưởng khi tạo mới
    if (!editingSchool) {
      if (!formData.principal_name.trim()) {
        alert('Vui lòng nhập họ tên Hiệu trưởng');
        return;
      }
      if (!formData.principal_email.trim()) {
        alert('Vui lòng nhập email Hiệu trưởng');
        return;
      }
    }

    setSaving(true);
    try {
      const schoolData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        address: formData.address.trim() || null,
        phone: formData.phone.trim() || null,
      };

      if (editingSchool) {
        // === CẬP NHẬT TRƯỜNG ===
        const { error: updateError } = await supabase
          .from('schools')
          .update(schoolData)
          .eq('id', editingSchool.id);

        if (updateError) throw updateError;

        // Cập nhật thông tin hiệu trưởng nếu có
        const existingPrincipal = schoolPrincipals[editingSchool.id];
        if (existingPrincipal && formData.principal_name) {
          await supabase
            .from('profiles')
            .update({
              full_name: formData.principal_name.trim(),
              phone: formData.principal_phone.trim() || null,
            })
            .eq('id', existingPrincipal.id);
        }

        alert('Đã cập nhật thông tin trường thành công!');
      } else {
        // === TẠO TRƯỜNG MỚI ===

        // 1. Kiểm tra email hiệu trưởng đã tồn tại chưa
        const { data: existingUser } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', formData.principal_email.trim())
          .single();

        if (existingUser) {
          alert('Email Hiệu trưởng đã tồn tại trong hệ thống!\nVui lòng sử dụng email khác.');
          setSaving(false);
          return;
        }

        // 2. Tạo trường mới
        const { data: newSchool, error: schoolError } = await supabase
          .from('schools')
          .insert(schoolData)
          .select()
          .single();

        if (schoolError) throw schoolError;

        // 3. Tạo tài khoản auth cho hiệu trưởng
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.principal_email.trim(),
          password: DEFAULT_PASSWORD,
          options: {
            data: {
              full_name: formData.principal_name.trim(),
              role: 'school_admin',
            }
          }
        });

        if (authError) {
          // Rollback - xóa trường vừa tạo
          await supabase.from('schools').delete().eq('id', newSchool.id);

          if (authError.message.includes('already registered')) {
            alert('Email Hiệu trưởng đã được đăng ký!\nVui lòng sử dụng email khác.');
          } else {
            throw authError;
          }
          setSaving(false);
          return;
        }

        // 4. Tạo profile cho hiệu trưởng
        if (authData.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: authData.user.id,
              email: formData.principal_email.trim(),
              full_name: formData.principal_name.trim(),
              phone: formData.principal_phone.trim() || null,
              role: 'school_admin',
              school_id: newSchool.id,
            });

          if (profileError) {
            console.error('Profile error:', profileError);
            // Không rollback vì auth đã tạo, chỉ log lỗi
          }
        }

        alert(
          `Đã tạo trường và tài khoản Hiệu trưởng thành công!\n\n` +
          `Thông tin đăng nhập:\n` +
          `- Email: ${formData.principal_email}\n` +
          `- Mật khẩu mặc định: ${DEFAULT_PASSWORD}\n\n` +
          `Vui lòng thông báo cho Hiệu trưởng đổi mật khẩu sau khi đăng nhập.`
        );
      }

      setShowModal(false);
      loadData();
    } catch (err) {
      console.error('Save error:', err);
      alert('Có lỗi xảy ra: ' + (err.message || JSON.stringify(err)));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (school) => {
    if (!confirm(`Bạn có chắc muốn xóa trường "${school.name}"?\n\nLưu ý: Tất cả dữ liệu liên quan (giáo viên, học sinh, hiệu trưởng) sẽ bị xóa!`)) {
      return;
    }

    try {
      // Xóa profiles liên quan trước
      await supabase.from('profiles').delete().eq('school_id', school.id);

      // Xóa trường
      const { error } = await supabase.from('schools').delete().eq('id', school.id);
      if (error) throw error;

      loadData();
    } catch (err) {
      console.error('Delete error:', err);
      alert('Có lỗi xảy ra: ' + err.message);
    }
  };

  // Filter and sort
  const filteredSchools = schools
    .filter(s => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      const principal = schoolPrincipals[s.id];
      return (
        s.name?.toLowerCase().includes(query) ||
        s.email?.toLowerCase().includes(query) ||
        s.address?.toLowerCase().includes(query) ||
        principal?.full_name?.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.created_at) - new Date(b.created_at);
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'students':
          return (schoolStats[b.id]?.students || 0) - (schoolStats[a.id]?.students || 0);
        default:
          return new Date(b.created_at) - new Date(a.created_at);
      }
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Trường học</h1>
          <p className="text-gray-600">Quản lý thông tin trường và tài khoản Hiệu trưởng</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Thêm trường mới
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <School className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Tổng số trường</p>
              <p className="text-xl font-bold">{schools.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <UserCog className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Hiệu trưởng</p>
              <p className="text-xl font-bold">{Object.keys(schoolPrincipals).length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Tổng giáo viên</p>
              <p className="text-xl font-bold">{Object.values(schoolStats).reduce((sum, s) => sum + (s?.teachers || 0), 0)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Tổng học sinh</p>
              <p className="text-xl font-bold">{Object.values(schoolStats).reduce((sum, s) => sum + (s?.students || 0), 0)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm tên trường, email, hiệu trưởng..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
            <option value="name">Tên A-Z</option>
            <option value="students">Nhiều HS nhất</option>
          </select>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Hiển thị {filteredSchools.length} / {schools.length} trường
          </span>
          <button
            onClick={loadData}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
          >
            <RefreshCw className="w-4 h-4" />
            Làm mới
          </button>
        </div>
      </div>

      {/* Schools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSchools.map((school) => {
          const stats = schoolStats[school.id] || { teachers: 0, students: 0, classes: 0 };
          const principal = schoolPrincipals[school.id];

          return (
            <div
              key={school.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                    <School className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{school.name}</h3>
                    {school.email && (
                      <p className="text-sm text-gray-500 truncate flex items-center gap-1 mt-1">
                        <Mail className="w-3 h-3" /> {school.email}
                      </p>
                    )}
                    {school.address && (
                      <p className="text-sm text-gray-500 truncate flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {school.address}
                      </p>
                    )}
                  </div>
                </div>

                {/* Hiệu trưởng */}
                {principal ? (
                  <div className="mt-3 p-2 bg-green-50 rounded-lg">
                    <p className="text-xs text-green-600 font-medium">Hiệu trưởng</p>
                    <p className="text-sm font-medium text-gray-800">{principal.full_name}</p>
                    <p className="text-xs text-gray-500">{principal.email}</p>
                  </div>
                ) : (
                  <div className="mt-3 p-2 bg-yellow-50 rounded-lg">
                    <p className="text-xs text-yellow-600">Chưa có Hiệu trưởng</p>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="px-4 py-3 bg-gray-50 border-t grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-lg font-bold text-blue-600">{stats.teachers}</p>
                  <p className="text-xs text-gray-500">Giáo viên</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-purple-600">{stats.students}</p>
                  <p className="text-xs text-gray-500">Học sinh</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-orange-600">{stats.classes}</p>
                  <p className="text-xs text-gray-500">Lớp học</p>
                </div>
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Calendar className="w-3 h-3" />
                  {school.created_at ? new Date(school.created_at).toLocaleDateString('vi-VN') : 'N/A'}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => navigate(`/admin/schools/${school.id}`)}
                    className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Xem chi tiết"
                  >
                    <Eye className="w-4 h-4 text-blue-500" />
                  </button>
                  <button
                    onClick={() => handleOpenModal(school)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Sửa"
                  >
                    <Edit2 className="w-4 h-4 text-gray-500" />
                  </button>
                  <button
                    onClick={() => handleDelete(school)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredSchools.length === 0 && (
          <div className="col-span-full bg-white rounded-xl shadow-sm p-12 text-center">
            <School className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-lg">Không tìm thấy trường học nào</p>
            <p className="text-gray-400 text-sm mt-1">Thử thay đổi từ khóa tìm kiếm hoặc thêm trường mới</p>
          </div>
        )}
      </div>

      {/* Modal Thêm/Sửa */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white flex items-center justify-between p-4 border-b z-10">
              <h3 className="text-lg font-bold">
                {editingSchool ? 'Sửa thông tin trường' : 'Thêm trường mới'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-6">
              {/* THÔNG TIN TRƯỜNG */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <School className="w-5 h-5 text-blue-600" />
                  Thông tin Trường học
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên trường <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="VD: Trường Tiểu học ABC"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email trường <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="truong@email.com"
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
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
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Địa chỉ
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="123 Đường ABC, Quận XYZ"
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* THÔNG TIN HIỆU TRƯỞNG */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <UserCog className="w-5 h-5 text-green-600" />
                  Thông tin Hiệu trưởng
                  {!editingSchool && <span className="text-red-500 text-sm font-normal">(Bắt buộc)</span>}
                </h4>

                {editingSchool && schoolPrincipals[editingSchool.id] && (
                  <div className="mb-3 p-3 bg-blue-50 rounded-lg text-sm">
                    <p className="text-blue-700">
                      Hiệu trưởng hiện tại: <strong>{schoolPrincipals[editingSchool.id].full_name}</strong>
                    </p>
                    <p className="text-blue-600 text-xs">{schoolPrincipals[editingSchool.id].email}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Họ tên Hiệu trưởng {!editingSchool && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="text"
                      value={formData.principal_name}
                      onChange={(e) => setFormData({ ...formData, principal_name: e.target.value })}
                      placeholder="Nguyễn Văn A"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Hiệu trưởng {!editingSchool && <span className="text-red-500">*</span>}
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={formData.principal_email}
                        onChange={(e) => setFormData({ ...formData, principal_email: e.target.value })}
                        placeholder="hieutruong@email.com"
                        disabled={editingSchool && schoolPrincipals[editingSchool.id]}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      />
                    </div>
                    {editingSchool && schoolPrincipals[editingSchool.id] && (
                      <p className="text-xs text-gray-500 mt-1">Email không thể thay đổi. Dùng chức năng "Đổi Hiệu trưởng" trong trang chi tiết.</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số điện thoại Hiệu trưởng
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.principal_phone}
                        onChange={(e) => setFormData({ ...formData, principal_phone: e.target.value })}
                        placeholder="0987654321"
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {!editingSchool && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Lưu ý:</strong> Tài khoản Hiệu trưởng sẽ được tạo tự động với mật khẩu mặc định: <code className="bg-yellow-100 px-1 rounded">{DEFAULT_PASSWORD}</code>
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !formData.name.trim() || !formData.email.trim() || (!editingSchool && (!formData.principal_name.trim() || !formData.principal_email.trim()))}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
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
