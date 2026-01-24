// src/pages/teacher/TeacherStudentsPage.jsx
// Quản lý Học sinh cho Giáo viên
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  Users, Search, Loader2, X, BookOpen, Plus,
  TrendingUp, Clock, Star, Eye, UserPlus, Edit2,
  Trash2, Upload, Download, RefreshCw, Mail, Phone,
  AlertCircle, Check, FileSpreadsheet, User, Copy, Key
} from 'lucide-react';

export default function TeacherStudentsPage() {
  const { profile } = useAuth();
  const fileInputRef = useRef(null);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    class_id: '',
    note: '',
    parent_name: '',
    parent_phone: '',
  });
  const [saving, setSaving] = useState(false);
  const [generatedPin, setGeneratedPin] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdStudentInfo, setCreatedStudentInfo] = useState(null);

  // Import states
  const [importData, setImportData] = useState([]);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState({ current: 0, total: 0 });

  useEffect(() => {
    if (profile?.id) {
      loadData();
    }
  }, [profile?.id]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load classes của giáo viên hoặc trong trường
      const { data: classesData } = await supabase
        .from('classes')
        .select('id, name, grade')
        .eq('school_id', profile.school_id)
        .or(`teacher_id.eq.${profile.id},teacher_id.is.null`)
        .order('name');

      setClasses(classesData || []);

      // Load tất cả học sinh trong trường của GV (bao gồm thông tin phụ huynh)
      const { data: studentsData } = await supabase
        .from('profiles')
        .select('*, class:classes(id, name), parent_name, parent_phone')
        .eq('school_id', profile.school_id)
        .eq('role', 'student')
        .eq('is_active', true)
        .order('full_name');

      // Add mock progress data
      const studentsWithProgress = (studentsData || []).map(s => ({
        ...s,
        progress: Math.floor(Math.random() * 40) + 60,
        total_time: Math.floor(Math.random() * 20) + 5,
        avg_score: (Math.random() * 3 + 7).toFixed(1),
        lessons_completed: Math.floor(Math.random() * 20) + 5,
      }));

      setStudents(studentsWithProgress);
    } catch (err) {
      console.error('Load data error:', err);
    } finally {
      setLoading(false);
    }
  };

  // ==================== TẠO HỌC SINH MỚI ====================
  // Tạo PIN ngẫu nhiên 4 số
  const generateRandomPin = () => {
    return String(Math.floor(1000 + Math.random() * 9000));
  };

  const handleOpenCreateModal = () => {
    const newPin = generateRandomPin();
    setFormData({
      full_name: '',
      email: '',
      phone: '',
      class_id: classes.length > 0 ? classes[0].id : '',
      note: '',
      parent_name: '',
      parent_phone: '',
    });
    setGeneratedPin(newPin);
    setShowCreateModal(true);
  };

  const handleCreateStudent = async () => {
    if (!formData.full_name.trim() || !formData.email.trim()) {
      alert('Vui lòng nhập họ tên và email');
      return;
    }

    // Validate email format
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

      // === LƯU SESSION HIỆN TẠI TRƯỚC KHI TẠO USER MỚI ===
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

      // === KHÔI PHỤC SESSION CŨ NGAY SAU KHI TẠO USER ===
      if (savedSession) {
        await supabase.auth.setSession({
          access_token: savedSession.access_token,
          refresh_token: savedSession.refresh_token,
        });
      }

      if (authError) throw authError;

      // Hash PIN đơn giản (client-side, trong production nên hash ở server)
      const hashedPin = btoa(generatedPin + '_bethongminh_salt');

      // Tạo profile với thông tin phụ huynh
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
          // Thông tin phụ huynh
          parent_name: formData.parent_name.trim() || null,
          parent_phone: formData.parent_phone.trim() || null,
          parent_pin: hashedPin,
        });

        if (profileError) throw profileError;
      }

      // Hiển thị modal thành công với thông tin
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

  // ==================== XEM CHI TIẾT ====================
  const handleViewDetail = (student) => {
    setSelectedStudent(student);
    setShowDetailModal(true);
  };

  // ==================== CHUYỂN LỚP ====================
  const handleOpenTransferModal = (student) => {
    setSelectedStudent(student);
    setFormData({ ...formData, class_id: student.class_id || '' });
    setShowTransferModal(true);
  };

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

  // ==================== XÓA KHỎI LỚP ====================
  const handleRemoveFromClass = async (student) => {
    if (!confirm(`Bạn có chắc muốn xóa "${student.full_name}" khỏi lớp?`)) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ class_id: null })
        .eq('id', student.id);

      if (error) throw error;

      loadData();
      if (showDetailModal) {
        setSelectedStudent({ ...student, class_id: null, class: null });
      }
    } catch (err) {
      console.error('Remove from class error:', err);
      alert('Có lỗi xảy ra: ' + err.message);
    }
  };

  // ==================== XEM/CẬP NHẬT THÔNG TIN PHỤ HUYNH ====================
  const [showParentInfoModal, setShowParentInfoModal] = useState(false);
  const [parentFormData, setParentFormData] = useState({
    parent_name: '',
    parent_phone: '',
  });

  const handleOpenParentInfo = (student) => {
    setSelectedStudent(student);
    setParentFormData({
      parent_name: student.parent_name || '',
      parent_phone: student.parent_phone || '',
    });
    setShowParentInfoModal(true);
  };

  const handleUpdateParentInfo = async () => {
    if (!selectedStudent) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          parent_name: parentFormData.parent_name.trim() || null,
          parent_phone: parentFormData.parent_phone.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedStudent.id);

      if (error) throw error;

      alert('Đã cập nhật thông tin phụ huynh!');
      setShowParentInfoModal(false);
      loadData();
    } catch (err) {
      console.error('Update parent info error:', err);
      alert('Có lỗi xảy ra: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Reset PIN cho phụ huynh
  const handleResetPin = async (student) => {
    if (!confirm(`Bạn có chắc muốn đặt lại PIN phụ huynh cho "${student.full_name}"?`)) return;

    try {
      const newPin = generateRandomPin();
      const hashedPin = btoa(newPin + '_bethongminh_salt');

      const { error } = await supabase
        .from('profiles')
        .update({
          parent_pin: hashedPin,
          updated_at: new Date().toISOString(),
        })
        .eq('id', student.id);

      if (error) throw error;

      setCreatedStudentInfo({
        full_name: student.full_name,
        email: student.email,
        parent_name: student.parent_name,
        parent_phone: student.parent_phone,
        pin: newPin,
        isReset: true,
      });
      setShowSuccessModal(true);
    } catch (err) {
      console.error('Reset PIN error:', err);
      alert('Có lỗi xảy ra: ' + err.message);
    }
  };

  // Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Đã sao chép!');
  };

  // ==================== IMPORT TỪ EXCEL ====================
  const handleDownloadTemplate = () => {
    // Tạo template CSV
    const template = 'Họ và tên,Email,Số điện thoại phụ huynh,Ghi chú\nNguyễn Văn A,nguyenvana@email.com,0901234567,Học sinh giỏi\nTrần Thị B,tranthib@email.com,0912345678,';
    const blob = new Blob(['\ufeff' + template], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mau_import_hoc_sinh.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split('\n').filter(line => line.trim());
      const data = [];

      // Skip header row
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
        if (cols[0] && cols[1]) {
          data.push({
            full_name: cols[0],
            email: cols[1],
            phone: cols[2] || '',
            note: cols[3] || '',
            status: 'pending',
          });
        }
      }

      setImportData(data);
      setShowImportModal(true);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleImportStudents = async () => {
    if (importData.length === 0) return;

    setImporting(true);
    setImportProgress({ current: 0, total: importData.length });

    // Lưu session trước
    const { data: currentSession } = await supabase.auth.getSession();
    const savedSession = currentSession?.session;

    const results = [...importData];
    let successCount = 0;

    for (let i = 0; i < importData.length; i++) {
      const student = importData[i];
      setImportProgress({ current: i + 1, total: importData.length });

      try {
        // Kiểm tra email
        const { data: existing } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', student.email.toLowerCase())
          .single();

        if (existing) {
          results[i] = { ...student, status: 'error', message: 'Email đã tồn tại' };
          continue;
        }

        // Tạo tài khoản
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: student.email.toLowerCase(),
          password: 'Student@123',
          options: {
            data: {
              full_name: student.full_name,
              role: 'student',
            },
          },
        });

        // Khôi phục session ngay sau mỗi lần tạo
        if (savedSession) {
          await supabase.auth.setSession({
            access_token: savedSession.access_token,
            refresh_token: savedSession.refresh_token,
          });
        }

        if (authError) {
          results[i] = { ...student, status: 'error', message: authError.message };
          continue;
        }

        // Tạo profile
        if (authData.user) {
          await supabase.from('profiles').upsert({
            id: authData.user.id,
            email: student.email.toLowerCase(),
            full_name: student.full_name,
            phone: student.phone || null,
            role: 'student',
            school_id: profile.school_id,
            class_id: formData.class_id || null,
            is_active: true,
          });
        }

        results[i] = { ...student, status: 'success' };
        successCount++;
      } catch (err) {
        results[i] = { ...student, status: 'error', message: err.message };
      }

      setImportData([...results]);
    }

    setImporting(false);
    alert(`Đã import ${successCount}/${importData.length} học sinh thành công!\nMật khẩu mặc định: Student@123`);
    loadData();
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
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý học sinh</h1>
          <p className="text-gray-600">Thêm và quản lý học sinh trong trường</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 border border-emerald-600 text-emerald-600 rounded-xl hover:bg-emerald-50"
          >
            <Upload className="w-5 h-5" />
            Import Excel
          </button>
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700"
          >
            <UserPlus className="w-5 h-5" />
            Thêm học sinh mới
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm học sinh..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <select
          value={filterClass}
          onChange={(e) => setFilterClass(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">Tất cả lớp</option>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>{cls.name}</option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <p className="text-gray-600">
          Tổng cộng: <strong className="text-emerald-600">{filteredStudents.length}</strong> học sinh
        </p>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Học sinh</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Lớp</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Tiến độ</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Thời gian học</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Điểm TB</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        {student.avatar_url ? (
                          <img src={student.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <Users className="w-5 h-5 text-purple-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{student.full_name}</p>
                        <p className="text-sm text-gray-500">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {student.class?.name ? (
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs">
                        {student.class.name}
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-xs">
                        Chưa có lớp
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            student.progress >= 80 ? 'bg-green-500' :
                            student.progress >= 50 ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${student.progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{student.progress}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm text-gray-600 flex items-center justify-center gap-1">
                      <Clock className="w-4 h-4 text-blue-500" />
                      {student.total_time}h
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm font-medium text-amber-600 flex items-center justify-center gap-1">
                      <Star className="w-4 h-4" />
                      {student.avg_score}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleViewDetail(student)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() => handleOpenTransferModal(student)}
                        className="p-2 hover:bg-blue-100 rounded-lg"
                        title="Chuyển lớp"
                      >
                        <RefreshCw className="w-4 h-4 text-blue-500" />
                      </button>
                      <button
                        onClick={() => handleRemoveFromClass(student)}
                        className="p-2 hover:bg-red-100 rounded-lg"
                        title="Xóa khỏi lớp"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Không có học sinh nào</p>
                    <button
                      onClick={handleOpenCreateModal}
                      className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                    >
                      Thêm học sinh đầu tiên
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==================== MODAL TẠO HỌC SINH ==================== */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
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
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
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
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
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
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
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
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
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
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
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
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50"
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
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Chi tiết học sinh</h3>
              <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                {selectedStudent.avatar_url ? (
                  <img src={selectedStudent.avatar_url} alt="" className="w-20 h-20 rounded-full object-cover" />
                ) : (
                  <Users className="w-10 h-10 text-purple-600" />
                )}
              </div>
              <h4 className="text-xl font-bold text-gray-900">{selectedStudent.full_name}</h4>
              <p className="text-gray-500">{selectedStudent.email}</p>
              {selectedStudent.class?.name ? (
                <span className="inline-block mt-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">
                  {selectedStudent.class.name}
                </span>
              ) : (
                <span className="inline-block mt-2 px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-sm">
                  Chưa có lớp
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">{selectedStudent.progress}%</p>
                <p className="text-sm text-blue-700">Tiến độ</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-4 text-center">
                <Star className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-amber-600">{selectedStudent.avg_score}</p>
                <p className="text-sm text-amber-700">Điểm TB</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <BookOpen className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">{selectedStudent.lessons_completed}</p>
                <p className="text-sm text-green-700">Bài hoàn thành</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 text-center">
                <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-600">{selectedStudent.total_time}h</p>
                <p className="text-sm text-purple-700">Thời gian học</p>
              </div>
            </div>

            {/* Thông tin phụ huynh */}
            {(selectedStudent.parent_name || selectedStudent.parent_phone) && (
              <div className="bg-indigo-50 rounded-xl p-4 mb-4">
                <p className="text-sm font-medium text-indigo-700 mb-2">Thông tin phụ huynh</p>
                {selectedStudent.parent_name && (
                  <p className="text-sm text-indigo-600">
                    <User className="w-4 h-4 inline mr-1" />
                    {selectedStudent.parent_name}
                  </p>
                )}
                {selectedStudent.parent_phone && (
                  <p className="text-sm text-indigo-600 mt-1">
                    <Phone className="w-4 h-4 inline mr-1" />
                    {selectedStudent.parent_phone}
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={() => handleOpenTransferModal(selectedStudent)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100"
              >
                <RefreshCw className="w-4 h-4" />
                Chuyển lớp
              </button>
              <button
                onClick={() => handleOpenParentInfo(selectedStudent)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-100"
              >
                <User className="w-4 h-4" />
                Thông tin PH
              </button>
            </div>

            {/* Reset PIN Button */}
            <button
              onClick={() => handleResetPin(selectedStudent)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-100 mb-4"
            >
              <Key className="w-4 h-4" />
              Đặt lại PIN phụ huynh
            </button>

            <button
              onClick={() => setShowDetailModal(false)}
              className="w-full px-4 py-2 bg-gray-100 rounded-xl hover:bg-gray-200"
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
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 mb-4"
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
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50"
              >
                {saving ? 'Đang chuyển...' : 'Chuyển lớp'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL THÔNG TIN PHỤ HUYNH ==================== */}
      {showParentInfoModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Thông tin phụ huynh</h3>
              <button onClick={() => setShowParentInfoModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-gray-600 mb-4">
              Cập nhật thông tin phụ huynh của <strong>{selectedStudent.full_name}</strong>
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên phụ huynh
                </label>
                <input
                  type="text"
                  value={parentFormData.parent_name}
                  onChange={(e) => setParentFormData({ ...parentFormData, parent_name: e.target.value })}
                  placeholder="Nguyễn Văn B"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
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
                    value={parentFormData.parent_phone}
                    onChange={(e) => setParentFormData({ ...parentFormData, parent_phone: e.target.value })}
                    placeholder="0901234567"
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowParentInfoModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdateParentInfo}
                disabled={saving}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50"
              >
                {saving ? 'Đang lưu...' : 'Lưu'}
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
              <h3 className="text-xl font-bold text-gray-900">
                {createdStudentInfo.isReset ? 'Đã đặt lại PIN!' : 'Tạo học sinh thành công!'}
              </h3>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 space-y-3 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Họ tên:</span>
                <span className="font-medium">{createdStudentInfo.full_name}</span>
              </div>
              {!createdStudentInfo.isReset && (
                <>
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
                </>
              )}
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
              className="w-full px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-medium"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* ==================== MODAL IMPORT ==================== */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-bold">Import học sinh từ file</h3>
              <button onClick={() => setShowImportModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 border-b bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600">Tìm thấy {importData.length} học sinh</span>
                <button
                  onClick={handleDownloadTemplate}
                  className="flex items-center gap-1 text-sm text-emerald-600 hover:underline"
                >
                  <Download className="w-4 h-4" />
                  Tải file mẫu
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Xếp vào lớp
                </label>
                <select
                  value={formData.class_id}
                  onChange={(e) => setFormData({ ...formData, class_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">-- Chưa xếp lớp --</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {importData.map((student, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      student.status === 'success' ? 'bg-green-50' :
                      student.status === 'error' ? 'bg-red-50' : 'bg-gray-50'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white">
                      {student.status === 'success' ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : student.status === 'error' ? (
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      ) : (
                        <span className="text-gray-400 text-sm">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm">{student.full_name}</p>
                      <p className="text-xs text-gray-500">{student.email}</p>
                      {student.status === 'error' && (
                        <p className="text-xs text-red-600">{student.message}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {importing && (
              <div className="p-4 border-t bg-blue-50">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                  <span className="text-sm text-blue-700">
                    Đang import... {importProgress.current}/{importProgress.total}
                  </span>
                </div>
                <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 rounded-full h-2 transition-all"
                    style={{ width: `${(importProgress.current / importProgress.total) * 100}%` }}
                  />
                </div>
              </div>
            )}

            <div className="p-4 border-t">
              <div className="flex gap-3">
                <button
                  onClick={() => setShowImportModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50"
                  disabled={importing}
                >
                  Hủy
                </button>
                <button
                  onClick={handleImportStudents}
                  disabled={importing || importData.length === 0}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {importing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Đang import...
                    </>
                  ) : (
                    <>
                      <FileSpreadsheet className="w-4 h-4" />
                      Import {importData.length} học sinh
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
