// src/pages/admin/SchoolDetailPage.jsx
// Trang chi tiết trường học - Quản lý Hiệu trưởng
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
  School, ArrowLeft, Edit2, Mail, Phone, MapPin, Calendar,
  Users, GraduationCap, Building2, BookOpen, CreditCard,
  CheckCircle, XCircle, Loader2, RefreshCw, UserCog, Key, UserPlus
} from 'lucide-react';

const DEFAULT_PASSWORD = 'School@123';

export default function SchoolDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [school, setSchool] = useState(null);
  const [principal, setPrincipal] = useState(null);
  const [stats, setStats] = useState({});
  const [departments, setDepartments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [updating, setUpdating] = useState(false);

  // Modals
  const [showChangePrincipalModal, setShowChangePrincipalModal] = useState(false);
  const [newPrincipalData, setNewPrincipalData] = useState({
    full_name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    if (id) {
      loadSchoolData();
    }
  }, [id]);

  const loadSchoolData = async () => {
    try {
      setLoading(true);

      // Load school info - query đơn giản
      const { data: schoolData, error: schoolError } = await supabase
        .from('schools')
        .select('id, name, email, address, phone, created_at')
        .eq('id', id)
        .single();

      if (schoolError) throw schoolError;
      setSchool(schoolData);

      // Load principal
      const { data: principalData } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone, created_at')
        .eq('school_id', id)
        .eq('role', 'school_admin')
        .single();

      setPrincipal(principalData);

      // Load stats
      const [t, s, p, d, c] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('school_id', id).eq('role', 'teacher'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('school_id', id).eq('role', 'student'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('school_id', id).eq('role', 'parent'),
        supabase.from('departments').select('id', { count: 'exact', head: true }).eq('school_id', id),
        supabase.from('classes').select('id', { count: 'exact', head: true }).eq('school_id', id),
      ]);

      setStats({
        teachers: t.count || 0,
        students: s.count || 0,
        parents: p.count || 0,
        departments: d.count || 0,
        classes: c.count || 0,
      });

      // Load departments
      const { data: deptData } = await supabase
        .from('departments')
        .select('*')
        .eq('school_id', id)
        .order('name')
        .limit(5);
      setDepartments(deptData || []);

      // Load teachers
      const { data: teachersData } = await supabase
        .from('profiles')
        .select('id, full_name, email, avatar_url')
        .eq('school_id', id)
        .eq('role', 'teacher')
        .order('created_at', { ascending: false })
        .limit(5);
      setTeachers(teachersData || []);

      // Load classes
      const { data: classesData } = await supabase
        .from('classes')
        .select('*')
        .eq('school_id', id)
        .order('name')
        .limit(5);
      setClasses(classesData || []);

    } catch (error) {
      console.error('Error loading school:', error);
      alert('Không thể tải thông tin trường: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPrincipalPassword = async () => {
    if (!principal) {
      alert('Chưa có Hiệu trưởng để reset mật khẩu');
      return;
    }

    if (!confirm(`Bạn có chắc muốn reset mật khẩu cho Hiệu trưởng "${principal.full_name}"?\n\nMật khẩu mới sẽ là: ${DEFAULT_PASSWORD}`)) {
      return;
    }

    try {
      setUpdating(true);

      // Sử dụng admin API để reset password
      // Note: Trong thực tế cần sử dụng server-side function
      const { error } = await supabase.auth.admin.updateUserById(
        principal.id,
        { password: DEFAULT_PASSWORD }
      );

      if (error) {
        // Fallback: gửi email reset password
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(principal.email);
        if (resetError) throw resetError;

        alert(`Đã gửi email reset mật khẩu đến: ${principal.email}\n\nVui lòng thông báo cho Hiệu trưởng kiểm tra email.`);
      } else {
        alert(`Đã reset mật khẩu thành công!\n\nMật khẩu mới: ${DEFAULT_PASSWORD}\n\nVui lòng thông báo cho Hiệu trưởng.`);
      }
    } catch (error) {
      console.error('Reset password error:', error);
      // Try sending reset email as fallback
      try {
        await supabase.auth.resetPasswordForEmail(principal.email);
        alert(`Đã gửi email reset mật khẩu đến: ${principal.email}`);
      } catch {
        alert('Không thể reset mật khẩu. Vui lòng thử lại sau.');
      }
    } finally {
      setUpdating(false);
    }
  };

  const handleChangePrincipal = async () => {
    if (!newPrincipalData.full_name.trim() || !newPrincipalData.email.trim()) {
      alert('Vui lòng nhập đầy đủ họ tên và email Hiệu trưởng mới');
      return;
    }

    try {
      setUpdating(true);

      // Kiểm tra email đã tồn tại
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', newPrincipalData.email.trim())
        .single();

      if (existingUser) {
        alert('Email này đã tồn tại trong hệ thống!');
        setUpdating(false);
        return;
      }

      // Xóa role school_admin của hiệu trưởng cũ (nếu có)
      if (principal) {
        await supabase
          .from('profiles')
          .update({ role: 'teacher', school_id: null })
          .eq('id', principal.id);
      }

      // === LƯU SESSION HIỆN TẠI TRƯỚC KHI TẠO USER MỚI ===
      const { data: currentSession } = await supabase.auth.getSession();
      const savedSession = currentSession?.session;

      // Tạo tài khoản mới cho hiệu trưởng
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newPrincipalData.email.trim(),
        password: DEFAULT_PASSWORD,
        options: {
          data: {
            full_name: newPrincipalData.full_name.trim(),
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
          alert('Email đã được đăng ký! Vui lòng sử dụng email khác.');
        } else {
          throw authError;
        }
        setUpdating(false);
        return;
      }

      // Tạo profile cho hiệu trưởng mới
      if (authData.user) {
        await supabase.from('profiles').insert({
          id: authData.user.id,
          email: newPrincipalData.email.trim(),
          full_name: newPrincipalData.full_name.trim(),
          phone: newPrincipalData.phone.trim() || null,
          role: 'school_admin',
          school_id: id,
        });
      }

      alert(
        `Đã đổi Hiệu trưởng thành công!\n\n` +
        `Hiệu trưởng mới: ${newPrincipalData.full_name}\n` +
        `Email: ${newPrincipalData.email}\n` +
        `Mật khẩu: ${DEFAULT_PASSWORD}`
      );

      setShowChangePrincipalModal(false);
      setNewPrincipalData({ full_name: '', email: '', phone: '' });
      loadSchoolData();
    } catch (error) {
      console.error('Change principal error:', error);
      alert('Có lỗi xảy ra: ' + error.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!school) {
    return (
      <div className="text-center py-12">
        <School className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <p className="text-gray-500">Không tìm thấy trường học</p>
        <button
          onClick={() => navigate('/admin/schools')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/schools')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800">Chi tiết Trường học</h1>
          <p className="text-gray-600">Xem và quản lý thông tin trường</p>
        </div>
        <button
          onClick={loadSchoolData}
          className="p-2 hover:bg-gray-100 rounded-lg"
          title="Làm mới"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* School Info Card */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex items-start gap-6">
            {/* Logo */}
            <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <School className="w-12 h-12 text-white" />
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{school.name}</h2>
                </div>
                <button
                  onClick={() => navigate('/admin/schools')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Sửa thông tin
                </button>
              </div>

              {/* Contact Info */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {school.email && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{school.email}</span>
                  </div>
                )}
                {school.phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{school.phone}</span>
                  </div>
                )}
                {school.address && (
                  <div className="flex items-center gap-2 text-gray-600 sm:col-span-2">
                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span>{school.address}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>Tham gia: {new Date(school.created_at).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="px-6 py-4 bg-gray-50 border-t grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="w-10 h-10 mx-auto bg-blue-100 rounded-xl flex items-center justify-center mb-2">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-600">{stats.departments}</p>
            <p className="text-xs text-gray-500">Bộ phận</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 mx-auto bg-green-100 rounded-xl flex items-center justify-center mb-2">
              <GraduationCap className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-600">{stats.teachers}</p>
            <p className="text-xs text-gray-500">Giáo viên</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 mx-auto bg-purple-100 rounded-xl flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-purple-600">{stats.students}</p>
            <p className="text-xs text-gray-500">Học sinh</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 mx-auto bg-orange-100 rounded-xl flex items-center justify-center mb-2">
              <BookOpen className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-orange-600">{stats.classes}</p>
            <p className="text-xs text-gray-500">Lớp học</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 mx-auto bg-pink-100 rounded-xl flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-pink-600" />
            </div>
            <p className="text-2xl font-bold text-pink-600">{stats.parents}</p>
            <p className="text-xs text-gray-500">Phụ huynh</p>
          </div>
        </div>
      </div>

      {/* Principal Card */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <UserCog className="w-5 h-5 text-green-600" />
            Thông tin Hiệu trưởng
          </h3>
          <div className="flex items-center gap-2">
            {principal && (
              <button
                onClick={handleResetPrincipalPassword}
                disabled={updating}
                className="flex items-center gap-2 px-3 py-1.5 text-sm border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-50 transition-colors disabled:opacity-50"
              >
                <Key className="w-4 h-4" />
                Reset mật khẩu
              </button>
            )}
            <button
              onClick={() => setShowChangePrincipalModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              {principal ? 'Đổi Hiệu trưởng' : 'Thêm Hiệu trưởng'}
            </button>
          </div>
        </div>

        <div className="p-6">
          {principal ? (
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <UserCog className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-semibold text-gray-900">{principal.full_name}</h4>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{principal.email}</span>
                  </div>
                  {principal.phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{principal.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>Ngày tạo: {new Date(principal.created_at).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
              </div>
              <div className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                Hiệu trưởng
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <UserCog className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">Chưa có Hiệu trưởng</p>
              <p className="text-gray-400 text-sm mt-1">Nhấn "Thêm Hiệu trưởng" để tạo tài khoản</p>
            </div>
          )}
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Departments */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Danh sách Bộ phận</h3>
            <span className="text-sm text-gray-500">{stats.departments} bộ phận</span>
          </div>
          <div className="p-4">
            {departments.length > 0 ? (
              <div className="space-y-3">
                {departments.map((dept) => (
                  <div key={dept.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">{dept.name}</p>
                      {dept.description && (
                        <p className="text-sm text-gray-500 truncate">{dept.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">Chưa có bộ phận nào</p>
            )}
          </div>
        </div>

        {/* Teachers */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Giáo viên mới nhất</h3>
            <span className="text-sm text-gray-500">{stats.teachers} giáo viên</span>
          </div>
          <div className="p-4">
            {teachers.length > 0 ? (
              <div className="space-y-3">
                {teachers.map((teacher) => (
                  <div key={teacher.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center overflow-hidden">
                      {teacher.avatar_url ? (
                        <img src={teacher.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <GraduationCap className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">{teacher.full_name || 'Chưa có tên'}</p>
                      <p className="text-sm text-gray-500 truncate">{teacher.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">Chưa có giáo viên nào</p>
            )}
          </div>
        </div>

        {/* Classes */}
        <div className="bg-white rounded-xl shadow-sm lg:col-span-2">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Lớp học</h3>
            <span className="text-sm text-gray-500">{stats.classes} lớp</span>
          </div>
          <div className="p-4">
            {classes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {classes.map((cls) => (
                  <div key={cls.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">{cls.name}</p>
                      {cls.grade && (
                        <p className="text-sm text-gray-500">Khối {cls.grade}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">Chưa có lớp học nào</p>
            )}
          </div>
        </div>
      </div>

      {/* Change Principal Modal */}
      {showChangePrincipalModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-4 border-b">
              <h3 className="text-lg font-bold">
                {principal ? 'Đổi Hiệu trưởng' : 'Thêm Hiệu trưởng mới'}
              </h3>
            </div>
            <div className="p-4 space-y-4">
              {principal && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Lưu ý:</strong> Hiệu trưởng hiện tại ({principal.full_name}) sẽ bị gỡ quyền quản lý.
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ tên Hiệu trưởng mới <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newPrincipalData.full_name}
                  onChange={(e) => setNewPrincipalData({ ...newPrincipalData, full_name: e.target.value })}
                  placeholder="Nguyễn Văn A"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={newPrincipalData.email}
                  onChange={(e) => setNewPrincipalData({ ...newPrincipalData, email: e.target.value })}
                  placeholder="email@example.com"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  value={newPrincipalData.phone}
                  onChange={(e) => setNewPrincipalData({ ...newPrincipalData, phone: e.target.value })}
                  placeholder="0912345678"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  Tài khoản sẽ được tạo với mật khẩu mặc định: <code className="bg-blue-100 px-1 rounded">{DEFAULT_PASSWORD}</code>
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowChangePrincipalModal(false);
                    setNewPrincipalData({ full_name: '', email: '', phone: '' });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleChangePrincipal}
                  disabled={updating || !newPrincipalData.full_name.trim() || !newPrincipalData.email.trim()}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {updating && <Loader2 className="w-4 h-4 animate-spin" />}
                  {updating ? 'Đang xử lý...' : 'Xác nhận'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
