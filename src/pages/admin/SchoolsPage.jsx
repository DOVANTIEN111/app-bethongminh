// src/pages/admin/SchoolsPage.jsx
// Trang quản lý trường học - Form đơn giản hóa
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
  School, Plus, Edit2, Trash2, Search, RefreshCw,
  Loader2, X, MapPin, Phone, Mail, Users, GraduationCap,
  Calendar, UserCog, Eye
} from 'lucide-react';

const DEFAULT_PASSWORD = 'School@123';

export default function SchoolsPage() {
  const navigate = useNavigate();
  const [schools, setSchools] = useState([]);
  const [schoolStats, setSchoolStats] = useState({});
  const [schoolPrincipals, setSchoolPrincipals] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSchool, setEditingSchool] = useState(null);
  const [saving, setSaving] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Form data - chỉ 4 trường
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
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

  const handleOpenModal = (school = null) => {
    if (school) {
      setEditingSchool(school);
      setFormData({
        name: school.name || '',
        email: school.email || '',
        phone: school.phone || '',
        address: school.address || '',
      });
    } else {
      setEditingSchool(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
      });
    }
    setShowModal(true);
  };

  // Validate email format
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSave = async () => {
    // Validate
    if (!formData.name.trim()) {
      alert('Vui lòng nhập tên trường');
      return;
    }
    if (!formData.email.trim()) {
      alert('Vui lòng nhập email');
      return;
    }
    if (!isValidEmail(formData.email.trim())) {
      alert('Email không hợp lệ');
      return;
    }

    setSaving(true);
    try {
      const email = formData.email.trim().toLowerCase();
      const schoolData = {
        name: formData.name.trim(),
        email: email,
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

        alert('Đã cập nhật thông tin trường thành công!');
      } else {
        // === TẠO TRƯỜNG MỚI ===

        // 1. Kiểm tra email đã tồn tại trong profiles chưa
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id, role')
          .eq('email', email)
          .single();

        let userId = null;
        let isNewAccount = false;

        if (existingProfile) {
          // Email đã tồn tại - chỉ cần cập nhật role
          userId = existingProfile.id;
        } else {
          // === LƯU SESSION HIỆN TẠI TRƯỚC KHI TẠO USER MỚI ===
          const { data: currentSession } = await supabase.auth.getSession();
          const savedSession = currentSession?.session;

          // Email chưa tồn tại - tạo tài khoản mới
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email: email,
            password: DEFAULT_PASSWORD,
            options: {
              data: {
                full_name: formData.name.trim(),
                role: 'school_admin',
              }
            }
          });

          // === KHÔI PHỤC SESSION CŨ NGAY SAU KHI TẠO USER ===
          if (savedSession) {
            await supabase.auth.setSession({
              access_token: savedSession.access_token,
              refresh_token: savedSession.refresh_token,
            });
          }

          if (authError) {
            if (authError.message.includes('already registered')) {
              // Email có trong auth nhưng chưa có profile - lấy user id từ auth
              alert('Email đã được đăng ký trong hệ thống.\nVui lòng sử dụng email khác hoặc liên hệ Admin.');
              setSaving(false);
              return;
            }
            throw authError;
          }

          userId = authData.user?.id;
          isNewAccount = true;

          // Tạo profile mới
          if (userId) {
            await supabase.from('profiles').insert({
              id: userId,
              email: email,
              full_name: formData.name.trim(),
              role: 'school_admin',
            });
          }
        }

        // 2. Tạo trường mới
        const { data: newSchool, error: schoolError } = await supabase
          .from('schools')
          .insert(schoolData)
          .select()
          .single();

        if (schoolError) {
          // Rollback nếu đã tạo auth account
          if (isNewAccount && userId) {
            console.error('Rollback: School creation failed after auth created');
          }
          throw schoolError;
        }

        // 3. Cập nhật profile với school_id và role
        if (userId) {
          await supabase
            .from('profiles')
            .update({
              school_id: newSchool.id,
              role: 'school_admin',
            })
            .eq('id', userId);
        }

        // 4. Thông báo thành công
        if (isNewAccount) {
          alert(
            `Tạo trường thành công!\n\n` +
            `Tài khoản quản lý: ${email}\n` +
            `Mật khẩu mặc định: ${DEFAULT_PASSWORD}\n\n` +
            `Vui lòng đổi mật khẩu sau khi đăng nhập.`
          );
        } else {
          alert(
            `Tạo trường thành công!\n\n` +
            `Tài khoản quản lý: ${email}\n` +
            `(Đã cập nhật quyền school_admin cho tài khoản hiện có)`
          );
        }
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
    if (!confirm(`Bạn có chắc muốn xóa trường "${school.name}"?\n\nLưu ý: Tất cả dữ liệu liên quan sẽ bị xóa!`)) {
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
          <p className="text-gray-600">Thêm và quản lý thông tin trường học</p>
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
              <p className="text-xs text-gray-500">Quản lý</p>
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
              placeholder="Tìm tên trường, email..."
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
                    {school.phone && (
                      <p className="text-sm text-gray-500 truncate flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {school.phone}
                      </p>
                    )}
                    {school.address && (
                      <p className="text-sm text-gray-500 truncate flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {school.address}
                      </p>
                    )}
                  </div>
                </div>

                {/* Quản lý */}
                {principal ? (
                  <div className="mt-3 p-2 bg-green-50 rounded-lg">
                    <p className="text-xs text-green-600 font-medium">Quản lý trường</p>
                    <p className="text-sm font-medium text-gray-800">{principal.full_name || principal.email}</p>
                    <p className="text-xs text-gray-500">{principal.email}</p>
                  </div>
                ) : (
                  <div className="mt-3 p-2 bg-yellow-50 rounded-lg">
                    <p className="text-xs text-yellow-600">Chưa có quản lý</p>
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

      {/* Modal Thêm/Sửa - Đơn giản hóa */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-bold">
                {editingSchool ? 'Sửa thông tin trường' : 'Thêm trường mới'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Tên trường */}
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

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="truong@email.com"
                    disabled={editingSchool}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>
                {!editingSchool && (
                  <p className="text-xs text-gray-500 mt-1">
                    Email này sẽ dùng làm tài khoản quản lý trường
                  </p>
                )}
              </div>

              {/* Số điện thoại */}
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

              {/* Địa chỉ */}
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

              {/* Ghi chú mật khẩu khi tạo mới */}
              {!editingSchool && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Lưu ý:</strong> Tài khoản quản lý sẽ được tạo tự động với mật khẩu: <code className="bg-blue-100 px-1 rounded font-mono">{DEFAULT_PASSWORD}</code>
                  </p>
                </div>
              )}

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
                  disabled={saving || !formData.name.trim() || !formData.email.trim()}
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
