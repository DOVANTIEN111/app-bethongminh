// src/pages/school/StudentsPage.jsx
// Students Management Page - Quản lý học sinh cho Nhà trường
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  Users, Search, Loader2, Eye, BookOpen, Building2,
  Plus, X, Mail, Phone, User, Key, RefreshCw, Copy, Check, Edit, Trash2
} from 'lucide-react';

export default function StudentsPage() {
  const { profile } = useAuth();
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    class_id: '',
    parent_name: '',
    parent_phone: '',
  });
  const [saving, setSaving] = useState(false);
  const [generatedPin, setGeneratedPin] = useState('');
  const [createdStudentInfo, setCreatedStudentInfo] = useState(null);

  useEffect(() => {
    loadData();
  }, [profile?.school_id]);

  const loadData = async () => {
    if (!profile?.school_id) {
      setLoading(false);
      return;
    }

    try {
      const [studentsRes, classesRes] = await Promise.all([
        supabase
          .from('profiles')
          .select('*, class:classes(id, name)')
          .eq('school_id', profile.school_id)
          .eq('role', 'student')
          .eq('is_active', true)
          .order('full_name'),
        supabase
          .from('classes')
          .select('id, name, grade')
          .eq('school_id', profile.school_id)
          .order('name'),
      ]);

      setStudents(studentsRes.data || []);
      setClasses(classesRes.data || []);
    } catch (err) {
      console.error('Load data error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Tạo PIN ngẫu nhiên
  const generateRandomPin = () => {
    return String(Math.floor(1000 + Math.random() * 9000));
  };

  // Mở modal tạo học sinh
  const handleOpenCreateModal = () => {
    const newPin = generateRandomPin();
    setFormData({
      full_name: '',
      email: '',
      phone: '',
      class_id: classes.length > 0 ? classes[0].id : '',
      parent_name: '',
      parent_phone: '',
    });
    setGeneratedPin(newPin);
    setShowCreateModal(true);
  };

  // Tạo học sinh mới
  const handleCreateStudent = async () => {
    if (!formData.full_name.trim() || !formData.email.trim()) {
      alert('Vui lòng nhập họ tên và email');
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      alert('Email không hợp lệ');
      return;
    }

    setSaving(true);
    try {
      // Kiểm tra email đã tồn tại chưa
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', formData.email.trim().toLowerCase())
        .single();

      if (existingUser) {
        alert('Email này đã được sử dụng. Vui lòng dùng email khác.');
        setSaving(false);
        return;
      }

      // Lưu session hiện tại
      const { data: currentSession } = await supabase.auth.getSession();
      const savedSession = currentSession?.session;

      // Tạo tài khoản mới
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email.trim().toLowerCase(),
        password: 'Student@123',
        options: {
          data: {
            full_name: formData.full_name.trim(),
            role: 'student',
          },
        },
      });

      // Khôi phục session
      if (savedSession) {
        await supabase.auth.setSession({
          access_token: savedSession.access_token,
          refresh_token: savedSession.refresh_token,
        });
      }

      if (authError) throw authError;

      // Hash PIN
      const hashedPin = btoa(generatedPin + '_schoolhub_salt');

      // Tạo profile
      if (authData.user) {
        const { error: profileError } = await supabase.from('profiles').upsert({
          id: authData.user.id,
          email: formData.email.trim().toLowerCase(),
          full_name: formData.full_name.trim(),
          phone: formData.phone.trim() || null,
          role: 'student',
          school_id: profile.school_id,
          class_id: formData.class_id || null,
          is_active: true,
          parent_name: formData.parent_name.trim() || null,
          parent_phone: formData.parent_phone.trim() || null,
          parent_pin: hashedPin,
        });

        if (profileError) throw profileError;
      }

      // Hiển thị modal thành công
      setCreatedStudentInfo({
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        parent_name: formData.parent_name.trim(),
        parent_phone: formData.parent_phone.trim(),
        pin: generatedPin,
      });
      setShowCreateModal(false);
      setShowSuccessModal(true);
      loadData();
    } catch (err) {
      console.error('Create student error:', err);
      alert('Có lỗi xảy ra: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Xem chi tiết học sinh
  const handleViewDetail = (student) => {
    setSelectedStudent(student);
    setShowDetailModal(true);
  };

  // Mở modal chuyển lớp
  const handleOpenTransferModal = (student) => {
    setSelectedStudent(student);
    setFormData({ ...formData, class_id: student.class_id || '' });
    setShowTransferModal(true);
  };

  // Chuyển lớp
  const handleTransferClass = async () => {
    if (!selectedStudent) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          class_id: formData.class_id || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedStudent.id);

      if (error) throw error;

      const newClassName = classes.find(c => c.id === formData.class_id)?.name || 'Không có lớp';
      alert(`Đã chuyển "${selectedStudent.full_name}" sang ${newClassName}`);
      setShowTransferModal(false);
      setShowDetailModal(false);
      loadData();
    } catch (err) {
      console.error('Transfer class error:', err);
      alert('Có lỗi xảy ra: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Xóa học sinh (soft delete)
  const handleDeleteStudent = async (student) => {
    if (!confirm(`Bạn có chắc muốn xóa học sinh "${student.full_name}"?`)) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: false })
        .eq('id', student.id);

      if (error) throw error;
      loadData();
      setShowDetailModal(false);
    } catch (err) {
      console.error('Delete student error:', err);
      alert('Có lỗi xảy ra: ' + err.message);
    }
  };

  // Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Đã sao chép!');
  };

  // Filter
  const filteredStudents = students.filter(s => {
    const matchSearch = !searchQuery ||
      s.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchClass = !filterClass || s.class_id === filterClass;
    return matchSearch && matchClass;
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
            placeholder="Tìm kiếm học sinh..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filterClass}
          onChange={(e) => setFilterClass(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tất cả lớp</option>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>{cls.name}</option>
          ))}
        </select>
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Thêm học sinh
        </button>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <p className="text-gray-600">
          Tổng cộng: <strong className="text-blue-600">{filteredStudents.length}</strong> học sinh
        </p>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map((student) => (
          <div
            key={student.id}
            className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleViewDetail(student)}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                {student.avatar_url ? (
                  <img src={student.avatar_url} alt="" className="w-12 h-12 rounded-full" />
                ) : (
                  <Users className="w-6 h-6 text-purple-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{student.full_name}</p>
                <p className="text-sm text-gray-500 truncate">{student.email}</p>
              </div>
              <Eye className="w-5 h-5 text-gray-400" />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {student.class?.name ? (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  {student.class.name}
                </span>
              ) : (
                <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-xs">
                  Chưa có lớp
                </span>
              )}
            </div>
          </div>
        ))}
        {filteredStudents.length === 0 && (
          <div className="col-span-full bg-white rounded-xl shadow-sm p-12 text-center text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Chưa có học sinh nào</p>
            <button
              onClick={handleOpenCreateModal}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Thêm học sinh đầu tiên
            </button>
          </div>
        )}
      </div>

      {/* ==================== MODAL TẠO HỌC SINH ==================== */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Thêm học sinh mới</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên <span className="text-red-500">*</span>
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
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="hocsinh@email.com"
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
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
                    placeholder="0901234567"
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lớp học
                </label>
                <select
                  value={formData.class_id}
                  onChange={(e) => setFormData({ ...formData, class_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Chưa xếp lớp --</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                  ))}
                </select>
              </div>

              {/* Thông tin phụ huynh */}
              <div className="border-t pt-4 mt-2">
                <p className="text-sm font-medium text-indigo-700 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Thông tin phụ huynh (tùy chọn)
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên phụ huynh
                    </label>
                    <input
                      type="text"
                      value={formData.parent_name}
                      onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
                      placeholder="Nguyễn Văn B"
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số điện thoại phụ huynh
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.parent_phone}
                        onChange={(e) => setFormData({ ...formData, parent_phone: e.target.value })}
                        placeholder="0901234567"
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* PIN phụ huynh */}
              <div className="bg-indigo-50 p-3 rounded-lg">
                <p className="text-sm text-indigo-700 mb-1">
                  <Key className="w-4 h-4 inline mr-1" />
                  PIN chế độ phụ huynh:
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-indigo-800 tracking-widest">{generatedPin}</span>
                  <button
                    type="button"
                    onClick={() => setGeneratedPin(generateRandomPin())}
                    className="p-1 hover:bg-indigo-100 rounded"
                    title="Tạo PIN mới"
                  >
                    <RefreshCw className="w-4 h-4 text-indigo-600" />
                  </button>
                </div>
                <p className="text-xs text-indigo-600 mt-1">
                  Gửi PIN này cho phụ huynh để truy cập chế độ Phụ huynh
                </p>
              </div>

              <div className="bg-yellow-50 p-3 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Mật khẩu mặc định: <strong>Student@123</strong>
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleCreateStudent}
                  disabled={saving || !formData.full_name.trim() || !formData.email.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? 'Đang tạo...' : 'Tạo học sinh'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL CHI TIẾT ==================== */}
      {showDetailModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="text-center mb-4">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                {selectedStudent.avatar_url ? (
                  <img src={selectedStudent.avatar_url} alt="" className="w-20 h-20 rounded-full" />
                ) : (
                  <Users className="w-10 h-10 text-purple-600" />
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900">{selectedStudent.full_name}</h3>
              <p className="text-gray-500">{selectedStudent.email}</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Số điện thoại</span>
                <span className="font-medium">{selectedStudent.phone || '-'}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Lớp</span>
                <span className="font-medium">{selectedStudent.class?.name || 'Chưa có lớp'}</span>
              </div>
              {selectedStudent.parent_name && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Phụ huynh</span>
                  <span className="font-medium">{selectedStudent.parent_name}</span>
                </div>
              )}
              {selectedStudent.parent_phone && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">SĐT phụ huynh</span>
                  <span className="font-medium">{selectedStudent.parent_phone}</span>
                </div>
              )}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Ngày tạo</span>
                <span className="font-medium">
                  {new Date(selectedStudent.created_at).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                onClick={() => handleOpenTransferModal(selectedStudent)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100"
              >
                <RefreshCw className="w-4 h-4" />
                Chuyển lớp
              </button>
              <button
                onClick={() => handleDeleteStudent(selectedStudent)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100"
              >
                <Trash2 className="w-4 h-4" />
                Xóa
              </button>
            </div>

            <button
              onClick={() => setShowDetailModal(false)}
              className="w-full mt-4 px-4 py-2 bg-gray-100 rounded-xl hover:bg-gray-200"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* ==================== MODAL CHUYỂN LỚP ==================== */}
      {showTransferModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Chuyển lớp</h3>
              <button onClick={() => setShowTransferModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-gray-600 mb-4">
              Chuyển <strong>{selectedStudent.full_name}</strong> sang lớp:
            </p>

            <select
              value={formData.class_id}
              onChange={(e) => setFormData({ ...formData, class_id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 mb-4"
            >
              <option value="">-- Không có lớp --</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>

            <div className="flex gap-3">
              <button
                onClick={() => setShowTransferModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleTransferClass}
                disabled={saving}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Đang chuyển...' : 'Chuyển lớp'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL THÀNH CÔNG ==================== */}
      {showSuccessModal && createdStudentInfo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Tạo học sinh thành công!</h3>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 space-y-3 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Họ tên:</span>
                <span className="font-medium">{createdStudentInfo.full_name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Email:</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{createdStudentInfo.email}</span>
                  <button
                    onClick={() => copyToClipboard(createdStudentInfo.email)}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <Copy className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Mật khẩu:</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Student@123</span>
                  <button
                    onClick={() => copyToClipboard('Student@123')}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <Copy className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>
              {createdStudentInfo.parent_name && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Phụ huynh:</span>
                  <span className="font-medium">{createdStudentInfo.parent_name}</span>
                </div>
              )}
            </div>

            {/* PIN nổi bật */}
            <div className="bg-indigo-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-indigo-700 text-center mb-2">
                <Key className="w-4 h-4 inline mr-1" />
                PIN chế độ Phụ huynh
              </p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-4xl font-bold text-indigo-800 tracking-[0.3em]">
                  {createdStudentInfo.pin}
                </span>
                <button
                  onClick={() => copyToClipboard(createdStudentInfo.pin)}
                  className="p-2 hover:bg-indigo-100 rounded-lg"
                >
                  <Copy className="w-5 h-5 text-indigo-600" />
                </button>
              </div>
              <p className="text-xs text-indigo-600 text-center mt-2">
                Gửi mã PIN này cho phụ huynh để truy cập chế độ Phụ huynh
              </p>
            </div>

            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
