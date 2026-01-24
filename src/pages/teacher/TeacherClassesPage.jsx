// src/pages/teacher/TeacherClassesPage.jsx
// Quản lý Lớp học cho Giáo viên
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  BookOpen, Users, Search, Loader2, X, Plus, ChevronRight,
  TrendingUp, UserPlus, Edit2, Trash2, Check, AlertCircle
} from 'lucide-react';

const GRADES = [
  { value: 'mam_non', label: 'Mầm non' },
  { value: 'lop_1', label: 'Lớp 1' },
  { value: 'lop_2', label: 'Lớp 2' },
  { value: 'lop_3', label: 'Lớp 3' },
  { value: 'lop_4', label: 'Lớp 4' },
  { value: 'lop_5', label: 'Lớp 5' },
  { value: 'lop_6', label: 'Lớp 6' },
  { value: 'lop_7', label: 'Lớp 7' },
  { value: 'lop_8', label: 'Lớp 8' },
  { value: 'lop_9', label: 'Lớp 9' },
  { value: 'lop_10', label: 'Lớp 10' },
  { value: 'lop_11', label: 'Lớp 11' },
  { value: 'lop_12', label: 'Lớp 12' },
];

export default function TeacherClassesPage() {
  const { profile } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState(null);
  const [classStudents, setClassStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    grade: 'lop_1',
    description: '',
  });
  const [saving, setSaving] = useState(false);

  // Add students states
  const [availableStudents, setAvailableStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [addingStudents, setAddingStudents] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');

  useEffect(() => {
    if (profile?.id) {
      loadClasses();
    }
  }, [profile?.id]);

  const loadClasses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('classes')
        .select('*, department:departments(name)')
        .eq('school_id', profile.school_id)
        .or(`teacher_id.eq.${profile.id},teacher_id.is.null`)
        .order('name');

      if (error) throw error;

      // Get student count for each class
      const classesWithCount = await Promise.all(
        (data || []).map(async (cls) => {
          const { count } = await supabase
            .from('profiles')
            .select('id', { count: 'exact', head: true })
            .eq('class_id', cls.id)
            .eq('role', 'student');
          return { ...cls, student_count: count || 0 };
        })
      );

      setClasses(classesWithCount);
    } catch (err) {
      console.error('Load classes error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadClassStudents = async (classId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, avatar_url')
        .eq('class_id', classId)
        .eq('role', 'student')
        .eq('is_active', true)
        .order('full_name');

      if (error) throw error;
      setClassStudents(data || []);
    } catch (err) {
      console.error('Load students error:', err);
    }
  };

  const loadAvailableStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, avatar_url')
        .eq('school_id', profile.school_id)
        .eq('role', 'student')
        .eq('is_active', true)
        .is('class_id', null)
        .order('full_name');

      if (error) throw error;
      setAvailableStudents(data || []);
    } catch (err) {
      console.error('Load available students error:', err);
    }
  };

  const handleSelectClass = (cls) => {
    setSelectedClass(cls);
    loadClassStudents(cls.id);
  };

  // ==================== TẠO LỚP MỚI ====================
  const handleOpenCreateModal = () => {
    setFormData({ name: '', grade: 'lop_1', description: '' });
    setShowCreateModal(true);
  };

  const handleCreateClass = async () => {
    if (!formData.name.trim()) {
      alert('Vui lòng nhập tên lớp');
      return;
    }

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('classes')
        .insert({
          name: formData.name.trim(),
          grade: formData.grade,
          description: formData.description.trim() || null,
          teacher_id: profile.id,
          school_id: profile.school_id,
        })
        .select()
        .single();

      if (error) throw error;

      alert('Tạo lớp thành công!');
      setShowCreateModal(false);
      loadClasses();

      // Select the new class
      setSelectedClass({ ...data, student_count: 0 });
      setClassStudents([]);
    } catch (err) {
      console.error('Create class error:', err);
      alert('Có lỗi xảy ra: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // ==================== SỬA LỚP ====================
  const handleOpenEditModal = () => {
    if (!selectedClass) return;
    setFormData({
      name: selectedClass.name || '',
      grade: selectedClass.grade || 'lop_1',
      description: selectedClass.description || '',
    });
    setShowEditModal(true);
  };

  const handleUpdateClass = async () => {
    if (!formData.name.trim()) {
      alert('Vui lòng nhập tên lớp');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('classes')
        .update({
          name: formData.name.trim(),
          grade: formData.grade,
          description: formData.description.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedClass.id);

      if (error) throw error;

      alert('Cập nhật lớp thành công!');
      setShowEditModal(false);
      loadClasses();

      // Update selected class
      setSelectedClass({
        ...selectedClass,
        name: formData.name.trim(),
        grade: formData.grade,
        description: formData.description.trim() || null,
      });
    } catch (err) {
      console.error('Update class error:', err);
      alert('Có lỗi xảy ra: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // ==================== XÓA LỚP ====================
  const handleDeleteClass = async () => {
    if (!selectedClass) return;

    setSaving(true);
    try {
      // First, remove all students from this class
      await supabase
        .from('profiles')
        .update({ class_id: null })
        .eq('class_id', selectedClass.id);

      // Then delete the class
      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', selectedClass.id);

      if (error) throw error;

      alert('Xóa lớp thành công!');
      setShowDeleteConfirm(false);
      setSelectedClass(null);
      setClassStudents([]);
      loadClasses();
    } catch (err) {
      console.error('Delete class error:', err);
      alert('Có lỗi xảy ra: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // ==================== THÊM HỌC SINH ====================
  const handleOpenAddStudent = () => {
    loadAvailableStudents();
    setSelectedStudents([]);
    setStudentSearch('');
    setShowAddStudentModal(true);
  };

  const handleToggleStudent = (studentId) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAllStudents = () => {
    const filteredIds = filteredAvailable.map(s => s.id);
    if (selectedStudents.length === filteredIds.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredIds);
    }
  };

  const handleAddStudents = async () => {
    if (!selectedClass || selectedStudents.length === 0) return;

    setAddingStudents(true);
    try {
      // Update all selected students at once
      const { error } = await supabase
        .from('profiles')
        .update({ class_id: selectedClass.id })
        .in('id', selectedStudents);

      if (error) throw error;

      alert(`Đã thêm ${selectedStudents.length} học sinh vào lớp!`);
      setShowAddStudentModal(false);
      loadClassStudents(selectedClass.id);
      loadClasses();
    } catch (err) {
      console.error('Add students error:', err);
      alert('Có lỗi xảy ra: ' + err.message);
    } finally {
      setAddingStudents(false);
    }
  };

  // ==================== XÓA HỌC SINH KHỎI LỚP ====================
  const handleRemoveStudent = async (studentId, studentName) => {
    if (!confirm(`Bạn có chắc muốn xóa "${studentName}" khỏi lớp?`)) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ class_id: null })
        .eq('id', studentId);

      if (error) throw error;

      loadClassStudents(selectedClass.id);
      loadClasses();
    } catch (err) {
      console.error('Remove student error:', err);
      alert('Có lỗi xảy ra: ' + err.message);
    }
  };

  // Filter
  const filteredClasses = classes.filter(c =>
    c.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAvailable = availableStudents.filter(s =>
    s.full_name?.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.email?.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const getGradeLabel = (gradeValue) => {
    return GRADES.find(g => g.value === gradeValue)?.label || gradeValue;
  };

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
          <h1 className="text-2xl font-bold text-gray-800">Quản lý lớp học</h1>
          <p className="text-gray-600">Tạo và quản lý các lớp học của bạn</p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700"
        >
          <Plus className="w-5 h-5" />
          Tạo lớp mới
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm lớp học..."
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Classes List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Danh sách lớp ({filteredClasses.length})</h3>
          </div>
          <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
            {filteredClasses.map((cls) => (
              <div
                key={cls.id}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedClass?.id === cls.id ? 'bg-emerald-50 border-l-4 border-emerald-500' : ''
                }`}
                onClick={() => handleSelectClass(cls)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">{cls.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-gray-500">{getGradeLabel(cls.grade)}</span>
                      <span className="text-sm text-emerald-600 flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {cls.student_count} học sinh
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))}
            {filteredClasses.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Bạn chưa có lớp nào</p>
                <button
                  onClick={handleOpenCreateModal}
                  className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  Tạo lớp đầu tiên
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Class Details */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {selectedClass ? (
            <>
              <div className="p-4 border-b border-gray-100 bg-emerald-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedClass.name}</h3>
                    <p className="text-sm text-gray-600">{getGradeLabel(selectedClass.grade)}</p>
                    {selectedClass.description && (
                      <p className="text-sm text-gray-500 mt-1">{selectedClass.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleOpenEditModal}
                      className="p-2 bg-white text-gray-600 rounded-lg hover:bg-gray-100"
                      title="Sửa thông tin lớp"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="p-2 bg-white text-red-600 rounded-lg hover:bg-red-50"
                      title="Xóa lớp"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 p-4 border-b border-gray-100">
                <div className="bg-blue-50 rounded-xl p-3 text-center">
                  <Users className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                  <p className="text-xl font-bold text-blue-600">{classStudents.length}</p>
                  <p className="text-xs text-blue-700">Học sinh</p>
                </div>
                <div className="bg-green-50 rounded-xl p-3 text-center">
                  <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-1" />
                  <p className="text-xl font-bold text-green-600">--</p>
                  <p className="text-xs text-green-700">Tiến độ TB</p>
                </div>
              </div>

              {/* Students List */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Danh sách học sinh</h4>
                  <button
                    onClick={handleOpenAddStudent}
                    className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm"
                  >
                    <UserPlus className="w-4 h-4" />
                    Thêm học sinh
                  </button>
                </div>
                {classStudents.length > 0 ? (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {classStudents.map((student) => (
                      <div key={student.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          {student.avatar_url ? (
                            <img src={student.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                          ) : (
                            <span className="text-lg">👤</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm">{student.full_name}</p>
                          <p className="text-xs text-gray-500 truncate">{student.email}</p>
                        </div>
                        <button
                          onClick={() => handleRemoveStudent(student.id, student.full_name)}
                          className="p-2 hover:bg-red-100 rounded-lg text-red-500"
                          title="Xóa khỏi lớp"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p>Chưa có học sinh nào trong lớp</p>
                    <button
                      onClick={handleOpenAddStudent}
                      className="mt-2 text-emerald-600 hover:underline text-sm"
                    >
                      Thêm học sinh ngay
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">Chọn lớp để xem chi tiết</p>
              <p className="text-sm mt-1">Hoặc tạo lớp mới để bắt đầu</p>
            </div>
          )}
        </div>
      </div>

      {/* ==================== MODAL TẠO LỚP ==================== */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Tạo lớp mới</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên lớp <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="VD: Lớp 3A, Lớp Mầm non 1..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Khối/Cấp độ
                </label>
                <select
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                >
                  {GRADES.map(g => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả ngắn về lớp học..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleCreateClass}
                  disabled={saving || !formData.name.trim()}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50"
                >
                  {saving ? 'Đang tạo...' : 'Tạo lớp'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL SỬA LỚP ==================== */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Sửa thông tin lớp</h3>
              <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên lớp <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="VD: Lớp 3A, Lớp Mầm non 1..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Khối/Cấp độ
                </label>
                <select
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                >
                  {GRADES.map(g => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả ngắn về lớp học..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleUpdateClass}
                  disabled={saving || !formData.name.trim()}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50"
                >
                  {saving ? 'Đang lưu...' : 'Cập nhật'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL XÁC NHẬN XÓA LỚP ==================== */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Xác nhận xóa lớp</h3>
              <p className="text-gray-600 mb-4">
                Bạn có chắc muốn xóa lớp <strong>"{selectedClass?.name}"</strong>?
                {classStudents.length > 0 && (
                  <span className="block text-red-600 mt-2">
                    {classStudents.length} học sinh sẽ bị xóa khỏi lớp này.
                  </span>
                )}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDeleteClass}
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50"
                >
                  {saving ? 'Đang xóa...' : 'Xóa lớp'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL THÊM HỌC SINH ==================== */}
      {showAddStudentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-bold">Thêm học sinh vào lớp</h3>
              <button onClick={() => setShowAddStudentModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="Tìm học sinh..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              {filteredAvailable.length > 0 && (
                <div className="flex items-center justify-between mt-3">
                  <button
                    onClick={handleSelectAllStudents}
                    className="text-sm text-emerald-600 hover:underline"
                  >
                    {selectedStudents.length === filteredAvailable.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                  </button>
                  <span className="text-sm text-gray-500">
                    Đã chọn: {selectedStudents.length}/{filteredAvailable.length}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {filteredAvailable.map((student) => (
                  <label
                    key={student.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedStudents.includes(student.id) ? 'bg-emerald-50 border border-emerald-200' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => handleToggleStudent(student.id)}
                      className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      {student.avatar_url ? (
                        <img src={student.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <span className="text-lg">👤</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm">{student.full_name}</p>
                      <p className="text-xs text-gray-500 truncate">{student.email}</p>
                    </div>
                    {selectedStudents.includes(student.id) && (
                      <Check className="w-5 h-5 text-emerald-600" />
                    )}
                  </label>
                ))}
                {filteredAvailable.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p>Không có học sinh nào chưa có lớp</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t bg-gray-50">
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddStudentModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  onClick={handleAddStudents}
                  disabled={addingStudents || selectedStudents.length === 0}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {addingStudents ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Đang thêm...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Thêm {selectedStudents.length > 0 ? `(${selectedStudents.length})` : ''}
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
