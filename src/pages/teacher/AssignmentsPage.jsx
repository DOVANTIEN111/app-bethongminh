// src/pages/teacher/AssignmentsPage.jsx
// Teacher's Assignments Management Page
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  ClipboardList, Plus, Search, Loader2, X, Calendar,
  CheckCircle, Clock, AlertCircle, Users, BookOpen, Star
} from 'lucide-react';

export default function AssignmentsPage() {
  const { profile } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [formData, setFormData] = useState({
    lesson_id: '',
    class_id: '',
    deadline: '',
    instructions: '',
  });
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    if (profile?.id) {
      loadData();
    }
  }, [profile?.id]);

  const loadData = async () => {
    try {
      // Load classes
      const { data: classesData } = await supabase
        .from('classes')
        .select('id, name')
        .eq('teacher_id', profile.id)
        .order('name');

      setClasses(classesData || []);

      // Mock lessons data
      setLessons([
        { id: 'l1', title: 'Phép cộng trong phạm vi 10' },
        { id: 'l2', title: 'Phép trừ trong phạm vi 10' },
        { id: 'l3', title: 'Học vần: Chữ cái A, B, C' },
      ]);

      // Mock assignments data
      setAssignments([
        {
          id: 'a1',
          lesson: { title: 'Phép cộng trong phạm vi 10' },
          class: { name: 'Lớp 3A' },
          deadline: new Date(Date.now() + 86400000).toISOString(),
          total_students: 25,
          submitted: 20,
          graded: 15,
          status: 'active',
        },
        {
          id: 'a2',
          lesson: { title: 'Phép trừ trong phạm vi 10' },
          class: { name: 'Lớp 3B' },
          deadline: new Date(Date.now() - 86400000).toISOString(),
          total_students: 28,
          submitted: 28,
          graded: 25,
          status: 'expired',
        },
        {
          id: 'a3',
          lesson: { title: 'Học vần: Chữ cái A, B, C' },
          class: { name: 'Lớp 3A' },
          deadline: new Date(Date.now() + 172800000).toISOString(),
          total_students: 25,
          submitted: 10,
          graded: 5,
          status: 'active',
        },
      ]);

    } catch (err) {
      console.error('Load data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setFormData({
      lesson_id: '',
      class_id: '',
      deadline: '',
      instructions: '',
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.lesson_id || !formData.class_id || !formData.deadline) return;

    setSaving(true);
    try {
      // In real app, save to database
      const selectedLesson = lessons.find(l => l.id === formData.lesson_id);
      const selectedClass = classes.find(c => c.id === formData.class_id);

      setAssignments(prev => [{
        id: 'a' + Date.now(),
        lesson: { title: selectedLesson?.title },
        class: { name: selectedClass?.name },
        deadline: new Date(formData.deadline).toISOString(),
        total_students: 25,
        submitted: 0,
        graded: 0,
        status: 'active',
      }, ...prev]);

      setShowModal(false);
    } catch (err) {
      console.error('Save assignment error:', err);
      alert('Có lỗi xảy ra: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleViewSubmissions = (assignment) => {
    setSelectedAssignment(assignment);
    // Mock submissions
    setSubmissions([
      { id: 's1', student: 'Nguyễn Văn A', submitted_at: new Date().toISOString(), grade: 9, feedback: 'Làm tốt!' },
      { id: 's2', student: 'Trần Thị B', submitted_at: new Date().toISOString(), grade: 8, feedback: '' },
      { id: 's3', student: 'Lê Văn C', submitted_at: new Date().toISOString(), grade: null, feedback: '' },
      { id: 's4', student: 'Phạm Thị D', submitted_at: null, grade: null, feedback: '' },
      { id: 's5', student: 'Hoàng Văn E', submitted_at: null, grade: null, feedback: '' },
    ]);
    setShowGradeModal(true);
  };

  const handleGrade = (submissionId, grade) => {
    setSubmissions(prev => prev.map(s =>
      s.id === submissionId ? { ...s, grade: parseInt(grade) || null } : s
    ));
  };

  const getStatusColor = (assignment) => {
    const deadline = new Date(assignment.deadline);
    const now = new Date();
    if (deadline < now) return 'text-red-600 bg-red-100';
    if (assignment.submitted === assignment.total_students) return 'text-green-600 bg-green-100';
    return 'text-amber-600 bg-amber-100';
  };

  const getStatusText = (assignment) => {
    const deadline = new Date(assignment.deadline);
    const now = new Date();
    if (deadline < now) return 'Hết hạn';
    if (assignment.submitted === assignment.total_students) return 'Hoàn thành';
    return 'Đang mở';
  };

  const filteredAssignments = assignments.filter(a => {
    const matchSearch = !searchQuery ||
      a.lesson?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.class?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = !filterStatus || a.status === filterStatus;
    return matchSearch && matchStatus;
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
        <div className="flex flex-1 gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm bài tập..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="active">Đang mở</option>
            <option value="expired">Hết hạn</option>
          </select>
        </div>
        <button
          onClick={handleOpenModal}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700"
        >
          <Plus className="w-5 h-5" />
          Giao bài mới
        </button>
      </div>

      {/* Assignments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAssignments.map((assignment) => (
          <div
            key={assignment.id}
            className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleViewSubmissions(assignment)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-emerald-600" />
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment)}`}>
                {getStatusText(assignment)}
              </span>
            </div>

            <h4 className="font-medium text-gray-900 mb-1">{assignment.lesson?.title}</h4>
            <p className="text-sm text-gray-500 mb-3 flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              {assignment.class?.name}
            </p>

            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
              <Calendar className="w-4 h-4" />
              <span>Hạn: {new Date(assignment.deadline).toLocaleDateString('vi-VN')}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
              <div className="text-center">
                <p className="text-lg font-bold text-blue-600">{assignment.total_students}</p>
                <p className="text-xs text-gray-500">Tổng</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-amber-600">{assignment.submitted}</p>
                <p className="text-xs text-gray-500">Đã nộp</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-green-600">{assignment.graded}</p>
                <p className="text-xs text-gray-500">Đã chấm</p>
              </div>
            </div>
          </div>
        ))}
        {filteredAssignments.length === 0 && (
          <div className="col-span-full bg-white rounded-xl shadow-sm p-12 text-center text-gray-500">
            <ClipboardList className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Chưa có bài tập nào</p>
          </div>
        )}
      </div>

      {/* Create Assignment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Giao bài mới</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chọn bài giảng *
                </label>
                <select
                  value={formData.lesson_id}
                  onChange={(e) => setFormData({ ...formData, lesson_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">-- Chọn bài giảng --</option>
                  {lessons.map((lesson) => (
                    <option key={lesson.id} value={lesson.id}>{lesson.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chọn lớp *
                </label>
                <select
                  value={formData.class_id}
                  onChange={(e) => setFormData({ ...formData, class_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">-- Chọn lớp --</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hạn nộp *
                </label>
                <input
                  type="datetime-local"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hướng dẫn thêm
                </label>
                <textarea
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  placeholder="Hướng dẫn cho học sinh..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !formData.lesson_id || !formData.class_id || !formData.deadline}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50"
                >
                  {saving ? 'Đang lưu...' : 'Giao bài'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grade Modal */}
      {showGradeModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold">{selectedAssignment.lesson?.title}</h3>
                <p className="text-sm text-gray-500">{selectedAssignment.class?.name}</p>
              </div>
              <button onClick={() => setShowGradeModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {submissions.map((sub) => (
                <div key={sub.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span>👤</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm">{sub.student}</p>
                    {sub.submitted_at ? (
                      <p className="text-xs text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Đã nộp
                      </p>
                    ) : (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Chưa nộp
                      </p>
                    )}
                  </div>
                  {sub.submitted_at && (
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-500" />
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={sub.grade || ''}
                        onChange={(e) => handleGrade(sub.id, e.target.value)}
                        placeholder="0-10"
                        className="w-16 px-2 py-1 border border-gray-200 rounded-lg text-center"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowGradeModal(false)}
              className="w-full mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700"
            >
              Lưu điểm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
