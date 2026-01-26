// src/pages/teacher/AssignmentsPage.jsx
// Quản lý Giao bài cho Giáo viên - Cập nhật với bài giảng hệ thống và chấm điểm
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { generateSystemLessons, SYSTEM_SUBJECTS } from '../../data/systemLessons';
import {
  ClipboardList, Plus, Search, Loader2, X, Calendar,
  CheckCircle, Clock, AlertCircle, Users, BookOpen, Star,
  Send, User, ChevronDown, ChevronUp, Eye, Edit2, Filter,
  MessageSquare, Save, CheckCircle2, XCircle, Award
} from 'lucide-react';

export default function AssignmentsPage() {
  const { profile } = useAuth();
  const location = useLocation();
  const [assignments, setAssignments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [systemLessonsData, setSystemLessonsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [studentSubmissions, setStudentSubmissions] = useState([]);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterClass, setFilterClass] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Form state
  const [formData, setFormData] = useState({
    lesson_id: '',
    lesson_source: 'system', // 'system' hoặc 'teacher'
    title: '',
    class_id: '',
    assignment_type: 'class',
    selected_students: [],
    start_date: new Date().toISOString().slice(0, 16),
    deadline: '',
    note: '',
  });

  // Grade form state
  const [gradeForm, setGradeForm] = useState({
    score: '',
    feedback: '',
    question_scores: [],
  });

  useEffect(() => {
    if (profile?.id) {
      loadData();
    }
  }, [profile?.id, profile?.school_id]);

  // Handle selected lesson from navigation
  useEffect(() => {
    if (location.state?.selectedLesson) {
      const lesson = location.state.selectedLesson;
      setFormData(prev => ({
        ...prev,
        lesson_id: lesson.id,
        lesson_source: lesson.is_system ? 'system' : 'teacher',
        title: lesson.title,
      }));
      setShowModal(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load classes
      const { data: classesData } = await supabase
        .from('classes')
        .select('id, name, grade')
        .eq('school_id', profile.school_id)
        .order('name');
      setClasses(classesData || []);

      // Load teacher's lessons from database
      const { data: teacherLessons } = await supabase
        .from('lessons')
        .select('id, title, subject_id, lesson_type, status')
        .eq('teacher_id', profile.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      setLessons(teacherLessons || []);

      // Load system lessons from data file
      const sysLessons = generateSystemLessons();
      setSystemLessonsData(sysLessons);

      // Load assignments
      const { data: assignData } = await supabase
        .from('assignments')
        .select(`
          *,
          lesson:lessons(id, title, subject_id),
          class:classes(id, name)
        `)
        .eq('teacher_id', profile.id)
        .order('created_at', { ascending: false });

      if (assignData && assignData.length > 0) {
        const assignmentsWithStats = await Promise.all(assignData.map(async (a) => {
          const { data: stats } = await supabase
            .from('student_assignments')
            .select('status')
            .eq('assignment_id', a.id);

          const total = stats?.length || 0;
          const submitted = stats?.filter(s => s.status === 'submitted' || s.status === 'graded').length || 0;
          const graded = stats?.filter(s => s.status === 'graded').length || 0;

          return { ...a, total_students: total, submitted, graded };
        }));
        setAssignments(assignmentsWithStats);
      } else {
        // Mock data khi không có dữ liệu
        setAssignments([
          {
            id: 'a1',
            title: 'Bài tập Animals - Động vật',
            lesson: { title: 'Animals - Động vật' },
            class: { name: 'Lớp 3A' },
            deadline: new Date(Date.now() + 86400000 * 2).toISOString(),
            total_students: 25,
            submitted: 15,
            graded: 10,
            status: 'active',
            created_at: new Date().toISOString(),
          },
          {
            id: 'a2',
            title: 'Bài tập Màu sắc',
            lesson: { title: 'Colors - Màu sắc' },
            class: { name: 'Lớp 3B' },
            deadline: new Date(Date.now() - 86400000).toISOString(),
            total_students: 28,
            submitted: 28,
            graded: 20,
            status: 'active',
            created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
          },
        ]);
      }
    } catch (err) {
      console.error('Load data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadClassStudents = async (classId) => {
    if (!classId) {
      setStudents([]);
      return;
    }

    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, email, avatar_url')
      .eq('class_id', classId)
      .eq('role', 'student')
      .eq('is_active', true)
      .order('full_name');

    setStudents(data || []);
  };

  const handleOpenModal = () => {
    setFormData({
      lesson_id: '',
      lesson_source: 'system',
      title: '',
      class_id: '',
      assignment_type: 'class',
      selected_students: [],
      start_date: new Date().toISOString().slice(0, 16),
      deadline: '',
      note: '',
    });
    setStudents([]);
    setShowModal(true);
  };

  const handleLessonChange = (lessonId, source) => {
    let lesson;
    if (source === 'system') {
      lesson = systemLessonsData.find(l => l.id === lessonId || l.original_id === lessonId);
    } else {
      lesson = lessons.find(l => l.id === lessonId);
    }
    setFormData({
      ...formData,
      lesson_id: lessonId,
      lesson_source: source,
      title: lesson?.title || '',
    });
  };

  const handleClassChange = (classId) => {
    setFormData({
      ...formData,
      class_id: classId,
      selected_students: [],
    });
    loadClassStudents(classId);
  };

  const handleStudentToggle = (studentId) => {
    const selected = formData.selected_students.includes(studentId)
      ? formData.selected_students.filter(id => id !== studentId)
      : [...formData.selected_students, studentId];
    setFormData({ ...formData, selected_students: selected });
  };

  const handleSave = async () => {
    if (!formData.lesson_id || !formData.deadline) {
      alert('Vui lòng chọn bài giảng và hạn nộp');
      return;
    }
    if (formData.assignment_type === 'class' && !formData.class_id) {
      alert('Vui lòng chọn lớp');
      return;
    }
    if (formData.assignment_type === 'individual' && formData.selected_students.length === 0) {
      alert('Vui lòng chọn ít nhất 1 học sinh');
      return;
    }

    setSaving(true);
    try {
      // Lấy thông tin lesson
      let lessonTitle = formData.title;
      let lessonData = null;

      if (formData.lesson_source === 'system') {
        lessonData = systemLessonsData.find(l => l.id === formData.lesson_id || l.original_id === formData.lesson_id);
        lessonTitle = lessonTitle || lessonData?.title;
      } else {
        lessonData = lessons.find(l => l.id === formData.lesson_id);
        lessonTitle = lessonTitle || lessonData?.title;
      }

      const assignmentData = {
        lesson_id: formData.lesson_source === 'teacher' ? formData.lesson_id : null,
        title: lessonTitle,
        teacher_id: profile.id,
        school_id: profile.school_id,
        class_id: formData.assignment_type === 'class' ? formData.class_id : null,
        assignment_type: formData.assignment_type,
        start_date: new Date(formData.start_date).toISOString(),
        deadline: new Date(formData.deadline).toISOString(),
        note: formData.note || null,
        status: 'active',
      };

      const { data: newAssignment, error } = await supabase
        .from('assignments')
        .insert(assignmentData)
        .select()
        .single();

      if (error) throw error;

      // Tạo student_assignments
      let studentsToAssign = [];

      if (formData.assignment_type === 'class') {
        // Lấy tất cả học sinh trong lớp
        const { data: classStudents } = await supabase
          .from('profiles')
          .select('id')
          .eq('class_id', formData.class_id)
          .eq('role', 'student')
          .eq('is_active', true);
        studentsToAssign = classStudents?.map(s => s.id) || [];
      } else {
        studentsToAssign = formData.selected_students;
      }

      if (studentsToAssign.length > 0) {
        const studentAssignments = studentsToAssign.map(studentId => ({
          assignment_id: newAssignment.id,
          student_id: studentId,
          status: 'not_started',
          max_score: lessonData?.questions?.length * 10 || 100,
        }));

        await supabase.from('student_assignments').insert(studentAssignments);
      }

      alert('Đã giao bài thành công!');
      setShowModal(false);
      loadData();
    } catch (err) {
      console.error('Save assignment error:', err);
      alert('Có lỗi xảy ra: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleViewDetail = async (assignment) => {
    setSelectedAssignment(assignment);

    const { data } = await supabase
      .from('student_assignments')
      .select(`
        *,
        student:profiles(id, full_name, email, avatar_url)
      `)
      .eq('assignment_id', assignment.id)
      .order('submitted_at', { ascending: false, nullsFirst: false });

    setStudentSubmissions(data || []);
    setShowDetailModal(true);
  };

  const handleOpenGradeModal = (submission) => {
    setSelectedSubmission(submission);

    // Parse answers nếu có
    let answers = [];
    if (submission.answers) {
      try {
        answers = typeof submission.answers === 'string'
          ? JSON.parse(submission.answers)
          : submission.answers;
      } catch (e) {
        console.error('Parse answers error:', e);
      }
    }

    setGradeForm({
      score: submission.score || '',
      feedback: submission.feedback || '',
      question_scores: answers,
    });
    setShowGradeModal(true);
  };

  const handleSaveGrade = async () => {
    if (!selectedSubmission) return;

    setSaving(true);
    try {
      await supabase
        .from('student_assignments')
        .update({
          score: parseFloat(gradeForm.score) || 0,
          feedback: gradeForm.feedback || null,
          status: 'graded',
          graded_at: new Date().toISOString(),
          graded_by: profile.id,
        })
        .eq('id', selectedSubmission.id);

      // Refresh submissions
      const { data } = await supabase
        .from('student_assignments')
        .select(`*, student:profiles(id, full_name, email, avatar_url)`)
        .eq('assignment_id', selectedAssignment.id)
        .order('submitted_at', { ascending: false, nullsFirst: false });

      setStudentSubmissions(data || []);
      setShowGradeModal(false);
      alert('Đã lưu điểm thành công!');
    } catch (err) {
      console.error('Grade error:', err);
      alert('Có lỗi: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const getStatusInfo = (assignment) => {
    const deadline = new Date(assignment.deadline);
    const now = new Date();

    if (assignment.graded === assignment.total_students && assignment.total_students > 0) {
      return { text: 'Đã chấm hết', color: 'text-green-600 bg-green-100', icon: CheckCircle };
    }
    if (assignment.submitted > assignment.graded) {
      return { text: 'Đang chờ chấm', color: 'text-amber-600 bg-amber-100', icon: Clock };
    }
    if (deadline < now) {
      return { text: 'Quá hạn', color: 'text-red-600 bg-red-100', icon: AlertCircle };
    }
    return { text: 'Chưa đến hạn', color: 'text-blue-600 bg-blue-100', icon: Calendar };
  };

  const getSubmissionStatusInfo = (status, deadline) => {
    const now = new Date();
    const isOverdue = deadline && new Date(deadline) < now;

    switch (status) {
      case 'graded': return { text: 'Đã chấm', color: 'text-green-600 bg-green-100' };
      case 'submitted': return { text: 'Đã nộp', color: 'text-blue-600 bg-blue-100' };
      case 'in_progress': return { text: 'Đang làm', color: 'text-amber-600 bg-amber-100' };
      default:
        return isOverdue
          ? { text: 'Quá hạn', color: 'text-red-600 bg-red-100' }
          : { text: 'Chưa làm', color: 'text-gray-600 bg-gray-100' };
    }
  };

  // Filter assignments
  const filteredAssignments = assignments.filter(a => {
    const matchSearch = !searchQuery ||
      a.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.lesson?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.class?.name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchClass = !filterClass || a.class_id === filterClass;

    const deadline = new Date(a.deadline);
    const now = new Date();
    let matchStatus = true;
    if (filterStatus === 'active') matchStatus = deadline >= now;
    if (filterStatus === 'expired') matchStatus = deadline < now;

    let matchTab = true;
    if (activeTab === 'not_graded') matchTab = a.submitted > a.graded;
    if (activeTab === 'graded') matchTab = a.graded > 0;

    return matchSearch && matchClass && matchStatus && matchTab;
  });

  // Group system lessons by subject
  const groupedSystemLessons = SYSTEM_SUBJECTS.map(subject => ({
    ...subject,
    lessons: systemLessonsData.filter(l => l.subject_key === subject.key),
  }));

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
          <h1 className="text-2xl font-bold text-gray-800">Quản lý giao bài</h1>
          <p className="text-gray-600">Giao bài và theo dõi tiến độ học sinh</p>
        </div>
        <button
          onClick={handleOpenModal}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700"
        >
          <Plus className="w-5 h-5" />
          Giao bài mới
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="flex border-b">
          {[
            { id: 'all', label: 'Tất cả', count: assignments.length },
            { id: 'not_graded', label: 'Chưa chấm', count: assignments.filter(a => a.submitted > a.graded).length },
            { id: 'graded', label: 'Đã chấm', count: assignments.filter(a => a.graded > 0).length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="p-4 border-b">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm bài tập..."
                className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="px-4 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Tất cả lớp</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Chưa đến hạn</option>
              <option value="expired">Quá hạn</option>
            </select>
          </div>
        </div>

        {/* Assignments List */}
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAssignments.map((assignment) => {
              const statusInfo = getStatusInfo(assignment);
              const StatusIcon = statusInfo.icon;
              return (
                <div
                  key={assignment.id}
                  className="border rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleViewDetail(assignment)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <ClipboardList className="w-5 h-5 text-emerald-600" />
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusInfo.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {statusInfo.text}
                    </span>
                  </div>

                  <h4 className="font-semibold text-gray-900 mb-1 line-clamp-1">{assignment.title}</h4>
                  {assignment.lesson && (
                    <p className="text-sm text-gray-500 mb-2 flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      {assignment.lesson.title}
                    </p>
                  )}
                  {assignment.class && (
                    <p className="text-sm text-gray-500 mb-2 flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {assignment.class.name}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <Calendar className="w-4 h-4" />
                    <span>Hạn: {new Date(assignment.deadline).toLocaleDateString('vi-VN', {
                      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
                    })}</span>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Tiến độ nộp bài</span>
                      <span>{assignment.submitted}/{assignment.total_students}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all"
                        style={{ width: `${assignment.total_students > 0 ? (assignment.submitted / assignment.total_students) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-3 border-t">
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
              );
            })}
            {filteredAssignments.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                <ClipboardList className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg">Chưa có bài tập nào</p>
                <button
                  onClick={handleOpenModal}
                  className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700"
                >
                  Giao bài đầu tiên
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Assignment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-bold">Giao bài mới</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Lesson source tabs */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chọn bài giảng <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => setFormData({ ...formData, lesson_source: 'system', lesson_id: '' })}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                      formData.lesson_source === 'system'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Bài giảng hệ thống
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, lesson_source: 'teacher', lesson_id: '' })}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                      formData.lesson_source === 'teacher'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Bài giảng của tôi
                  </button>
                </div>

                {/* Lesson dropdown with optgroups */}
                <select
                  value={formData.lesson_id}
                  onChange={(e) => handleLessonChange(e.target.value, formData.lesson_source)}
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">-- Chọn bài giảng --</option>

                  {formData.lesson_source === 'system' ? (
                    // System lessons grouped by subject
                    groupedSystemLessons.map(group => (
                      group.lessons.length > 0 && (
                        <optgroup key={group.key} label={`${group.icon} ${group.name} (${group.lessons.length} bài)`}>
                          {group.lessons.slice(0, 20).map(lesson => (
                            <option key={lesson.id} value={lesson.id}>
                              {lesson.title} {lesson.question_count > 0 && `(${lesson.question_count} câu)`}
                            </option>
                          ))}
                          {group.lessons.length > 20 && (
                            <option disabled>... và {group.lessons.length - 20} bài khác</option>
                          )}
                        </optgroup>
                      )
                    ))
                  ) : (
                    // Teacher's lessons
                    lessons.length > 0 ? (
                      <>
                        <optgroup label="Đã xuất bản">
                          {lessons.filter(l => l.status === 'published').map(lesson => (
                            <option key={lesson.id} value={lesson.id}>{lesson.title}</option>
                          ))}
                        </optgroup>
                        <optgroup label="Bản nháp">
                          {lessons.filter(l => l.status === 'draft').map(lesson => (
                            <option key={lesson.id} value={lesson.id}>{lesson.title} (nháp)</option>
                          ))}
                        </optgroup>
                      </>
                    ) : (
                      <option disabled>Bạn chưa có bài giảng nào</option>
                    )
                  )}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tiêu đề bài giao
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="VD: Bài tập về nhà tuần 1"
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Assignment type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giao cho <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="assignment_type"
                      value="class"
                      checked={formData.assignment_type === 'class'}
                      onChange={(e) => setFormData({ ...formData, assignment_type: e.target.value })}
                      className="text-emerald-600"
                    />
                    <span>Cả lớp</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="assignment_type"
                      value="individual"
                      checked={formData.assignment_type === 'individual'}
                      onChange={(e) => setFormData({ ...formData, assignment_type: e.target.value })}
                      className="text-emerald-600"
                    />
                    <span>Học sinh cụ thể</span>
                  </label>
                </div>
              </div>

              {/* Class selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chọn lớp <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.class_id}
                  onChange={(e) => handleClassChange(e.target.value)}
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">-- Chọn lớp --</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                  ))}
                </select>
              </div>

              {/* Student selection */}
              {formData.assignment_type === 'individual' && formData.class_id && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chọn học sinh ({formData.selected_students.length} đã chọn)
                  </label>
                  <div className="max-h-40 overflow-y-auto border rounded-xl p-2 space-y-1">
                    {students.length > 0 ? students.map(student => (
                      <label
                        key={student.id}
                        className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.selected_students.includes(student.id)}
                          onChange={() => handleStudentToggle(student.id)}
                          className="text-emerald-600 rounded"
                        />
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-purple-600" />
                        </div>
                        <span className="text-sm">{student.full_name}</span>
                      </label>
                    )) : (
                      <p className="text-center text-gray-500 py-4">Không có học sinh trong lớp này</p>
                    )}
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày bắt đầu
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hạn nộp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Note */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ghi chú cho học sinh
                </label>
                <textarea
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  placeholder="Hướng dẫn, lưu ý cho học sinh..."
                  rows={3}
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex gap-3 p-4 border-t">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border rounded-xl hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {saving ? 'Đang giao...' : 'Giao bài'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h3 className="text-lg font-bold">{selectedAssignment.title}</h3>
                <p className="text-sm text-gray-500">
                  {selectedAssignment.class?.name} • Hạn: {new Date(selectedAssignment.deadline).toLocaleString('vi-VN')}
                </p>
              </div>
              <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <p className="text-2xl font-bold text-gray-800">{studentSubmissions.length}</p>
                  <p className="text-xs text-gray-500">Tổng HS</p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-xl">
                  <p className="text-2xl font-bold text-blue-600">
                    {studentSubmissions.filter(s => s.status === 'submitted' || s.status === 'graded').length}
                  </p>
                  <p className="text-xs text-blue-600">Đã nộp</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-xl">
                  <p className="text-2xl font-bold text-green-600">
                    {studentSubmissions.filter(s => s.status === 'graded').length}
                  </p>
                  <p className="text-xs text-green-600">Đã chấm</p>
                </div>
                <div className="text-center p-3 bg-amber-50 rounded-xl">
                  <p className="text-2xl font-bold text-amber-600">
                    {studentSubmissions.filter(s => !['submitted', 'graded'].includes(s.status)).length}
                  </p>
                  <p className="text-xs text-amber-600">Chưa nộp</p>
                </div>
              </div>

              {/* Student list */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">Danh sách học sinh</h4>
                </div>

                {studentSubmissions.map((sub) => {
                  const statusInfo = getSubmissionStatusInfo(sub.status, selectedAssignment.deadline);
                  return (
                    <div key={sub.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        {sub.student?.avatar_url ? (
                          <img src={sub.student.avatar_url} alt="" className="w-10 h-10 rounded-full" />
                        ) : (
                          <User className="w-5 h-5 text-purple-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900">{sub.student?.full_name || 'Học sinh'}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                            {statusInfo.text}
                          </span>
                          {sub.submitted_at && (
                            <span className="text-xs text-gray-500">
                              Nộp: {new Date(sub.submitted_at).toLocaleString('vi-VN')}
                            </span>
                          )}
                          {sub.status === 'graded' && sub.score !== null && (
                            <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                              <Award className="w-3 h-3" />
                              {sub.score}/{sub.max_score || 100} điểm
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {(sub.status === 'submitted' || sub.status === 'graded') && (
                          <button
                            onClick={() => handleOpenGradeModal(sub)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                              sub.status === 'graded'
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                            }`}
                          >
                            {sub.status === 'graded' ? (
                              <>
                                <Eye className="w-4 h-4" />
                                Xem điểm
                              </>
                            ) : (
                              <>
                                <Edit2 className="w-4 h-4" />
                                Chấm điểm
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {studentSubmissions.length === 0 && (
                  <p className="text-center text-gray-500 py-8">Chưa có học sinh nào được giao bài</p>
                )}
              </div>
            </div>

            <div className="p-4 border-t">
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-full px-4 py-2 bg-gray-100 rounded-xl hover:bg-gray-200"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grade Modal */}
      {showGradeModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h3 className="text-lg font-bold">Chấm điểm</h3>
                <p className="text-sm text-gray-500">{selectedSubmission.student?.full_name}</p>
              </div>
              <button onClick={() => setShowGradeModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Thông tin học sinh */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{selectedSubmission.student?.full_name}</p>
                  <p className="text-sm text-gray-500">{selectedSubmission.student?.email}</p>
                </div>
              </div>

              {/* Thời gian nộp */}
              {selectedSubmission.submitted_at && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Nộp bài lúc: {new Date(selectedSubmission.submitted_at).toLocaleString('vi-VN')}</span>
                </div>
              )}

              {/* Hiển thị câu trả lời nếu có */}
              {gradeForm.question_scores && gradeForm.question_scores.length > 0 && (
                <div className="border rounded-xl p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Bài làm của học sinh</h4>
                  <div className="space-y-3">
                    {gradeForm.question_scores.map((answer, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                          answer.isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm text-gray-700">{answer.question}</p>
                          <p className={`text-sm font-medium mt-1 ${
                            answer.isCorrect ? 'text-green-600' : 'text-red-600'
                          }`}>
                            Đáp án: {answer.selectedAnswer}
                            {!answer.isCorrect && (
                              <span className="text-gray-500"> (Đúng: {answer.correctAnswer})</span>
                            )}
                          </p>
                        </div>
                        {answer.isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Điểm */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Điểm số (0 - {selectedSubmission.max_score || 100})
                </label>
                <div className="relative">
                  <Star className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
                  <input
                    type="number"
                    min="0"
                    max={selectedSubmission.max_score || 100}
                    value={gradeForm.score}
                    onChange={(e) => setGradeForm({ ...gradeForm, score: e.target.value })}
                    placeholder="Nhập điểm"
                    className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 text-lg font-medium"
                  />
                </div>
              </div>

              {/* Nhận xét */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nhận xét cho học sinh
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <textarea
                    value={gradeForm.feedback}
                    onChange={(e) => setGradeForm({ ...gradeForm, feedback: e.target.value })}
                    placeholder="Nhận xét về bài làm của học sinh..."
                    rows={4}
                    className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-4 border-t">
              <button
                onClick={() => setShowGradeModal(false)}
                className="flex-1 px-4 py-2 border rounded-xl hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveGrade}
                disabled={saving}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'Đang lưu...' : 'Lưu điểm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
