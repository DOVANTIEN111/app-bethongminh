// src/pages/teacher/TeacherStudentsPage.jsx
// Quản lý Học sinh cho Giáo viên - Hỗ trợ Import từ Excel
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
// Dynamic import xlsx để giảm bundle size - chỉ load khi cần
const loadXLSX = () => import('xlsx');
import {
  Users, Search, Loader2, X, BookOpen, Plus,
  TrendingUp, Clock, Star, Eye, UserPlus, Edit2,
  Trash2, Upload, Download, RefreshCw, Mail, Phone,
  AlertCircle, Check, FileSpreadsheet, User, Copy, Key,
  CheckCircle2, XCircle
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
      const hashedPin = btoa(generatedPin + '_schoolhub_salt');

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
      const hashedPin = btoa(newPin + '_schoolhub_salt');

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
  const [importResults, setImportResults] = useState([]);
  const [showResultModal, setShowResultModal] = useState(false);

  // Tải file Excel mẫu
  const handleDownloadTemplate = async () => {
    // Dynamic import xlsx
    const XLSX = await loadXLSX();

    // Tạo workbook mới
    const wb = XLSX.utils.book_new();

    // Dữ liệu mẫu
    const templateData = [
      ['STT', 'Họ và tên', 'Email', 'Lớp'],
      [1, 'Nguyễn Văn A', 'nguyenvana@email.com', 'Lớp 1A'],
      [2, 'Trần Thị B', 'tranthib@email.com', 'Lớp 1A'],
      [3, 'Lê Văn C', 'levanc@email.com', 'Lớp 1B'],
    ];

    // Tạo worksheet
    const ws = XLSX.utils.aoa_to_sheet(templateData);

    // Set độ rộng cột
    ws['!cols'] = [
      { wch: 5 },   // STT
      { wch: 25 },  // Họ và tên
      { wch: 30 },  // Email
      { wch: 15 },  // Lớp
    ];

    // Thêm worksheet vào workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Danh sách học sinh');

    // Tải file
    XLSX.writeFile(wb, 'mau_import_hocsinh.xlsx');
  };

  // Đọc file Excel
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Dynamic import xlsx
    const XLSX = await loadXLSX();

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Lấy sheet đầu tiên
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Chuyển thành JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Parse data (skip header row)
        const parsedData = [];
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (!row || row.length === 0) continue;

          const fullName = String(row[1] || '').trim();
          const email = String(row[2] || '').trim().toLowerCase();
          const className = String(row[3] || '').trim();

          // Validate dữ liệu
          let status = 'pending';
          let errorMsg = '';

          if (!fullName) {
            status = 'invalid';
            errorMsg = 'Thiếu họ tên';
          } else if (!email) {
            status = 'invalid';
            errorMsg = 'Thiếu email';
          } else if (!emailRegex.test(email)) {
            status = 'invalid';
            errorMsg = 'Email không hợp lệ';
          }

          // Kiểm tra email trùng trong danh sách
          const duplicateIndex = parsedData.findIndex(p => p.email === email);
          if (duplicateIndex >= 0) {
            status = 'invalid';
            errorMsg = 'Email trùng với dòng ' + (duplicateIndex + 2);
          }

          if (fullName || email) {
            parsedData.push({
              stt: i,
              full_name: fullName,
              email: email,
              class_name: className,
              status: status,
              errorMsg: errorMsg,
              password: 'Student@123',
              pin: '',
            });
          }
        }

        setImportData(parsedData);
        setShowImportModal(true);
      } catch (err) {
        console.error('Parse Excel error:', err);
        alert('Không thể đọc file. Vui lòng kiểm tra định dạng file Excel.');
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = '';
  };

  // Import học sinh hàng loạt
  const handleImportStudents = async () => {
    // Chỉ import các dòng hợp lệ
    const validStudents = importData.filter(s => s.status === 'pending');
    if (validStudents.length === 0) {
      alert('Không có học sinh hợp lệ để import!');
      return;
    }

    setImporting(true);
    setImportProgress({ current: 0, total: validStudents.length });

    // Lưu session trước khi tạo users
    const { data: currentSession } = await supabase.auth.getSession();
    const savedSession = currentSession?.session;

    const results = [...importData];
    let successCount = 0;
    const createdStudents = [];

    for (let i = 0; i < importData.length; i++) {
      const student = importData[i];

      // Bỏ qua các dòng không hợp lệ
      if (student.status === 'invalid') {
        continue;
      }

      setImportProgress({ current: successCount + 1, total: validStudents.length });

      try {
        // Kiểm tra email đã tồn tại
        const { data: existing } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', student.email)
          .single();

        if (existing) {
          results[i] = { ...student, status: 'error', errorMsg: 'Email đã tồn tại trong hệ thống' };
          continue;
        }

        // Tạo PIN ngẫu nhiên
        const pin = String(Math.floor(1000 + Math.random() * 9000));
        const hashedPin = btoa(pin + '_schoolhub_salt');

        // Tạo tài khoản (KHÔNG đăng nhập vào tài khoản mới)
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: student.email,
          password: 'Student@123',
          options: {
            data: {
              full_name: student.full_name,
              role: 'student',
            },
          },
        });

        // QUAN TRỌNG: Khôi phục session GV ngay sau mỗi lần tạo
        if (savedSession) {
          await supabase.auth.setSession({
            access_token: savedSession.access_token,
            refresh_token: savedSession.refresh_token,
          });
        }

        if (authError) {
          results[i] = { ...student, status: 'error', errorMsg: authError.message };
          continue;
        }

        // Tạo profile
        if (authData.user) {
          await supabase.from('profiles').upsert({
            id: authData.user.id,
            email: student.email,
            full_name: student.full_name,
            role: 'student',
            school_id: profile.school_id,
            class_id: formData.class_id || null,
            is_active: true,
            parent_pin: hashedPin,
          });
        }

        results[i] = { ...student, status: 'success', pin: pin };
        createdStudents.push({
          ...student,
          pin: pin,
          password: 'Student@123',
        });
        successCount++;
      } catch (err) {
        results[i] = { ...student, status: 'error', errorMsg: err.message };
      }

      setImportData([...results]);
    }

    setImporting(false);
    setImportResults(createdStudents);
    setShowImportModal(false);
    setShowResultModal(true);
    loadData();
  };

  // Tải file kết quả sau khi import
  const handleDownloadResults = async () => {
    if (importResults.length === 0) return;

    // Dynamic import xlsx
    const XLSX = await loadXLSX();

    const wb = XLSX.utils.book_new();

    const resultData = [
      ['STT', 'Họ và tên', 'Email', 'Mật khẩu', 'PIN Phụ huynh'],
      ...importResults.map((s, i) => [
        i + 1,
        s.full_name,
        s.email,
        s.password,
        s.pin,
      ])
    ];

    const ws = XLSX.utils.aoa_to_sheet(resultData);
    ws['!cols'] = [
      { wch: 5 },
      { wch: 25 },
      { wch: 30 },
      { wch: 15 },
      { wch: 15 },
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Thông tin đăng nhập');
    XLSX.writeFile(wb, 'thongtin_dangnhap_hocsinh.xlsx');
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
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-bold">Import học sinh từ Excel</h3>
              <button onClick={() => setShowImportModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 border-b bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-sm text-gray-600">
                    Tìm thấy <strong className="text-emerald-600">{importData.filter(s => s.status === 'pending').length}</strong> hợp lệ /
                    <strong className="text-gray-700 ml-1">{importData.length}</strong> dòng
                  </span>
                  {importData.filter(s => s.status === 'invalid').length > 0 && (
                    <span className="text-sm text-red-500 ml-2">
                      ({importData.filter(s => s.status === 'invalid').length} lỗi)
                    </span>
                  )}
                </div>
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
                  Xếp tất cả vào lớp
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
              {/* Preview Table */}
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-3 py-2 text-left font-medium text-gray-600 w-12">STT</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-600">Họ và tên</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-600">Email</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-600">Lớp</th>
                    <th className="px-3 py-2 text-center font-medium text-gray-600 w-24">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {importData.map((student, index) => (
                    <tr
                      key={index}
                      className={`${
                        student.status === 'success' ? 'bg-green-50' :
                        student.status === 'error' ? 'bg-red-50' :
                        student.status === 'invalid' ? 'bg-amber-50' : ''
                      }`}
                    >
                      <td className="px-3 py-2 text-gray-500">{student.stt}</td>
                      <td className="px-3 py-2">
                        <span className={`font-medium ${!student.full_name ? 'text-red-500 italic' : 'text-gray-900'}`}>
                          {student.full_name || 'Thiếu họ tên'}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <span className={`${!student.email ? 'text-red-500 italic' : 'text-gray-600'}`}>
                          {student.email || 'Thiếu email'}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-gray-500">{student.class_name || '-'}</td>
                      <td className="px-3 py-2 text-center">
                        {student.status === 'success' ? (
                          <span className="inline-flex items-center gap-1 text-green-600">
                            <CheckCircle2 className="w-4 h-4" />
                          </span>
                        ) : student.status === 'error' ? (
                          <span className="inline-flex items-center gap-1 text-red-600" title={student.errorMsg}>
                            <XCircle className="w-4 h-4" />
                          </span>
                        ) : student.status === 'invalid' ? (
                          <span className="inline-flex items-center gap-1 text-amber-600" title={student.errorMsg}>
                            <AlertCircle className="w-4 h-4" />
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                        {(student.status === 'error' || student.status === 'invalid') && student.errorMsg && (
                          <p className="text-xs text-red-500 mt-1">{student.errorMsg}</p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {importData.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <FileSpreadsheet className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Không có dữ liệu</p>
                </div>
              )}
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
              <div className="bg-yellow-50 p-3 rounded-lg mb-4">
                <p className="text-sm text-yellow-800">
                  <strong>Lưu ý:</strong> Mật khẩu mặc định là <strong>Student@123</strong>.
                  PIN phụ huynh sẽ được tạo tự động cho mỗi học sinh.
                </p>
              </div>
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
                  disabled={importing || importData.filter(s => s.status === 'pending').length === 0}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {importing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Đang import...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Import {importData.filter(s => s.status === 'pending').length} học sinh
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL KẾT QUẢ IMPORT ==================== */}
      {showResultModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Import thành công!</h3>
              <p className="text-gray-600 mt-2">
                Đã tạo <strong className="text-emerald-600">{importResults.length}</strong> học sinh mới
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">Thông tin tài khoản</span>
                <button
                  onClick={handleDownloadResults}
                  className="flex items-center gap-1 text-sm text-emerald-600 hover:underline"
                >
                  <Download className="w-4 h-4" />
                  Tải file Excel
                </button>
              </div>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-gray-400" />
                  <span>Mật khẩu mặc định: <strong>Student@123</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span>Mỗi học sinh có PIN phụ huynh riêng</span>
                </li>
              </ul>
            </div>

            <div className="bg-amber-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-amber-800">
                <strong>Quan trọng:</strong> Hãy tải file Excel chứa thông tin đăng nhập để gửi cho phụ huynh.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowResultModal(false);
                  setImportResults([]);
                }}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50"
              >
                Đóng
              </button>
              <button
                onClick={handleDownloadResults}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Tải thông tin đăng nhập
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
