// src/pages/TeacherDashboard.jsx
// Trang quản lý cho Giáo viên
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRBAC } from '../contexts/RBACContext';
import {
  GraduationCap, Users, BookOpen, FileText, Plus,
  ChevronRight, Clock, CheckCircle, AlertCircle,
  Loader2, X, Calendar, Target, BarChart3,
  Clipboard, Send, Eye, Edit, Trash2
} from 'lucide-react';

export default function TeacherDashboard() {
  const {
    userProfile, signOut, getTeacherStats, getMyClasses,
    createClass, getClassStudents, createAssignment,
    getClassAssignments, getStudentProgressInClass
  } = useRBAC();

  const [stats, setStats] = useState(null);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('classes'); // classes, students, assignments

  // Modal states
  const [showCreateClass, setShowCreateClass] = useState(false);
  const [showCreateAssignment, setShowCreateAssignment] = useState(false);
  const [newClass, setNewClass] = useState({ name: '', description: '', gradeLevel: 1 });
  const [newAssignment, setNewAssignment] = useState({
    title: '', description: '', subject: 'math', deadline: '', lessonIds: []
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [statsData, classesData] = await Promise.all([
      getTeacherStats(),
      getMyClasses()
    ]);
    setStats(statsData);
    setClasses(classesData);
    setLoading(false);
  };

  const handleSelectClass = async (classItem) => {
    setSelectedClass(classItem);
    const [studentsData, assignmentsData] = await Promise.all([
      getClassStudents(classItem.id),
      getClassAssignments(classItem.id)
    ]);
    setStudents(studentsData);
    setAssignments(assignmentsData);
  };

  const handleCreateClass = async () => {
    const { data, error } = await createClass(
      newClass.name,
      newClass.description,
      newClass.gradeLevel
    );
    if (!error) {
      setClasses([data, ...classes]);
      setShowCreateClass(false);
      setNewClass({ name: '', description: '', gradeLevel: 1 });
    }
  };

  const handleCreateAssignment = async () => {
    if (!selectedClass) return;
    const { data, error } = await createAssignment(
      selectedClass.id,
      newAssignment.title,
      newAssignment.description,
      newAssignment.subject,
      newAssignment.lessonIds,
      newAssignment.deadline || null
    );
    if (!error) {
      setAssignments([data, ...assignments]);
      setShowCreateAssignment(false);
      setNewAssignment({ title: '', description: '', subject: 'math', deadline: '', lessonIds: [] });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Giáo viên</h1>
                <p className="text-white/80 text-sm">{userProfile?.name}</p>
              </div>
            </div>
            <button
              onClick={signOut}
              className="px-4 py-2 bg-white/20 rounded-xl text-sm hover:bg-white/30"
            >
              Đăng xuất
            </button>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen className="w-5 h-5" />
                  <span className="text-sm opacity-80">Lớp học</span>
                </div>
                <p className="text-2xl font-bold">{stats.total_classes}</p>
              </div>
              <div className="bg-white/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-5 h-5" />
                  <span className="text-sm opacity-80">Học sinh</span>
                </div>
                <p className="text-2xl font-bold">{stats.total_students}</p>
              </div>
              <div className="bg-white/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="w-5 h-5" />
                  <span className="text-sm opacity-80">Bài tập</span>
                </div>
                <p className="text-2xl font-bold">{stats.total_assignments}</p>
              </div>
              <div className="bg-white/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-5 h-5" />
                  <span className="text-sm opacity-80">Chờ chấm</span>
                </div>
                <p className="text-2xl font-bold">{stats.pending_submissions}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Classes List */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-semibold text-gray-800">Lớp học của tôi</h2>
                <button
                  onClick={() => setShowCreateClass(true)}
                  className="p-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
                {classes.map((classItem) => (
                  <button
                    key={classItem.id}
                    onClick={() => handleSelectClass(classItem)}
                    className={`w-full p-4 text-left hover:bg-gray-50 flex items-center gap-3 ${
                      selectedClass?.id === classItem.id ? 'bg-indigo-50' : ''
                    }`}
                  >
                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-bold">
                      {classItem.grade_level}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">{classItem.name}</p>
                      <p className="text-sm text-gray-500">
                        {classItem.class_students?.[0]?.count || 0} học sinh
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                ))}

                {classes.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Chưa có lớp học nào</p>
                    <button
                      onClick={() => setShowCreateClass(true)}
                      className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm"
                    >
                      Tạo lớp học đầu tiên
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Class Details */}
          <div className="lg:w-2/3">
            {selectedClass ? (
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {/* Class header */}
                <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold">{selectedClass.name}</h2>
                      <p className="text-white/80 text-sm">Lớp {selectedClass.grade_level}</p>
                    </div>
                    <button
                      onClick={() => setShowCreateAssignment(true)}
                      className="px-4 py-2 bg-white/20 rounded-xl text-sm hover:bg-white/30 flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Giao bài
                    </button>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100">
                  <button
                    onClick={() => setActiveTab('students')}
                    className={`flex-1 px-4 py-3 text-sm font-medium ${
                      activeTab === 'students'
                        ? 'text-indigo-600 border-b-2 border-indigo-600'
                        : 'text-gray-500'
                    }`}
                  >
                    Học sinh ({students.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('assignments')}
                    className={`flex-1 px-4 py-3 text-sm font-medium ${
                      activeTab === 'assignments'
                        ? 'text-indigo-600 border-b-2 border-indigo-600'
                        : 'text-gray-500'
                    }`}
                  >
                    Bài tập ({assignments.length})
                  </button>
                </div>

                {/* Tab content */}
                <div className="p-4">
                  {activeTab === 'students' && (
                    <div className="space-y-3">
                      {students.map((item) => (
                        <div key={item.student?.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-xl">
                            {item.student?.avatar || '👤'}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{item.student?.name}</p>
                            <p className="text-sm text-gray-500">{item.student?.email}</p>
                          </div>
                          <button className="p-2 hover:bg-gray-200 rounded-lg">
                            <Eye className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      ))}

                      {students.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p>Chưa có học sinh nào</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'assignments' && (
                    <div className="space-y-3">
                      {assignments.map((assignment) => (
                        <div key={assignment.id} className="p-4 border border-gray-200 rounded-xl">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-gray-800">{assignment.title}</h3>
                              <p className="text-sm text-gray-500">{assignment.description}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              assignment.subject === 'math' ? 'bg-blue-100 text-blue-700' :
                              assignment.subject === 'vietnamese' ? 'bg-red-100 text-red-700' :
                              assignment.subject === 'english' ? 'bg-green-100 text-green-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {assignment.subject === 'math' ? 'Toán' :
                               assignment.subject === 'vietnamese' ? 'Tiếng Việt' :
                               assignment.subject === 'english' ? 'Tiếng Anh' :
                               assignment.subject}
                            </span>
                          </div>
                          {assignment.deadline && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Calendar className="w-4 h-4" />
                              <span>Hạn: {new Date(assignment.deadline).toLocaleDateString('vi-VN')}</span>
                            </div>
                          )}
                        </div>
                      ))}

                      {assignments.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p>Chưa có bài tập nào</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Chọn một lớp học</h3>
                <p className="text-gray-500">Chọn lớp học bên trái để xem chi tiết</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Class Modal */}
      <AnimatePresence>
        {showCreateClass && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreateClass(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-md p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Tạo lớp học mới</h3>
                <button
                  onClick={() => setShowCreateClass(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên lớp
                  </label>
                  <input
                    type="text"
                    value={newClass.name}
                    onChange={e => setNewClass({ ...newClass, name: e.target.value })}
                    placeholder="VD: Lớp 3A"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Khối lớp
                  </label>
                  <select
                    value={newClass.gradeLevel}
                    onChange={e => setNewClass({ ...newClass, gradeLevel: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl"
                  >
                    {[1, 2, 3, 4, 5].map(g => (
                      <option key={g} value={g}>Lớp {g}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả (tùy chọn)
                  </label>
                  <textarea
                    value={newClass.description}
                    onChange={e => setNewClass({ ...newClass, description: e.target.value })}
                    placeholder="Mô tả về lớp học..."
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl h-24 resize-none"
                  />
                </div>

                <button
                  onClick={handleCreateClass}
                  disabled={!newClass.name}
                  className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium disabled:opacity-50"
                >
                  Tạo lớp học
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Assignment Modal */}
      <AnimatePresence>
        {showCreateAssignment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreateAssignment(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-md p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Giao bài tập mới</h3>
                <button
                  onClick={() => setShowCreateAssignment(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tiêu đề
                  </label>
                  <input
                    type="text"
                    value={newAssignment.title}
                    onChange={e => setNewAssignment({ ...newAssignment, title: e.target.value })}
                    placeholder="VD: Bài tập Toán tuần 1"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Môn học
                  </label>
                  <select
                    value={newAssignment.subject}
                    onChange={e => setNewAssignment({ ...newAssignment, subject: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl"
                  >
                    <option value="math">Toán</option>
                    <option value="vietnamese">Tiếng Việt</option>
                    <option value="english">Tiếng Anh</option>
                    <option value="science">Khoa học</option>
                    <option value="lifeskills">Kỹ năng sống</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hạn nộp (tùy chọn)
                  </label>
                  <input
                    type="datetime-local"
                    value={newAssignment.deadline}
                    onChange={e => setNewAssignment({ ...newAssignment, deadline: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả
                  </label>
                  <textarea
                    value={newAssignment.description}
                    onChange={e => setNewAssignment({ ...newAssignment, description: e.target.value })}
                    placeholder="Hướng dẫn làm bài..."
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl h-24 resize-none"
                  />
                </div>

                <button
                  onClick={handleCreateAssignment}
                  disabled={!newAssignment.title}
                  className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium disabled:opacity-50"
                >
                  Giao bài tập
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
