// src/pages/teacher/TeacherClassesPage.jsx
// Teacher's Classes Management Page
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  BookOpen, Users, Search, Loader2, X,
  Plus, ChevronRight, TrendingUp, UserPlus
} from 'lucide-react';

export default function TeacherClassesPage() {
  const { profile } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState(null);
  const [classStudents, setClassStudents] = useState([]);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (profile?.id) {
      loadClasses();
    }
  }, [profile?.id]);

  const loadClasses = async () => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('*, department:departments(name)')
        .eq('teacher_id', profile.id)
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

  const handleOpenAddStudent = () => {
    loadAvailableStudents();
    setShowAddStudentModal(true);
  };

  const handleAddStudent = async (studentId) => {
    if (!selectedClass) return;

    setAdding(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ class_id: selectedClass.id })
        .eq('id', studentId);

      if (error) throw error;

      // Refresh data
      loadClassStudents(selectedClass.id);
      loadAvailableStudents();
      loadClasses();
    } catch (err) {
      console.error('Add student error:', err);
      alert('Có lỗi xảy ra: ' + err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveStudent = async (studentId) => {
    if (!confirm('Bạn có chắc muốn xóa học sinh khỏi lớp?')) return;

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

  const filteredClasses = classes.filter(c =>
    c.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAvailable = availableStudents.filter(s =>
    s.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm lớp học..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Classes List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Lớp đang dạy ({filteredClasses.length})</h3>
          </div>
          <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
            {filteredClasses.map((cls) => (
              <div
                key={cls.id}
                className={`p-4 hover:bg-gray-50 cursor-pointer ${
                  selectedClass?.id === cls.id ? 'bg-emerald-50' : ''
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
                      <span className="text-sm text-gray-500">Khối {cls.grade}</span>
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
                <p>Bạn chưa được gán lớp nào</p>
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
                    <p className="text-sm text-gray-600">Khối {selectedClass.grade}</p>
                  </div>
                  <button
                    onClick={handleOpenAddStudent}
                    className="flex items-center gap-2 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm"
                  >
                    <UserPlus className="w-4 h-4" />
                    Thêm HS
                  </button>
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
                  <p className="text-xl font-bold text-green-600">85%</p>
                  <p className="text-xs text-green-700">Tiến độ TB</p>
                </div>
              </div>

              {/* Students List */}
              <div className="p-4">
                <h4 className="font-medium text-gray-900 mb-3">Danh sách học sinh</h4>
                {classStudents.length > 0 ? (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {classStudents.map((student) => (
                      <div key={student.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          {student.avatar_url ? (
                            <img src={student.avatar_url} alt="" className="w-10 h-10 rounded-full" />
                          ) : (
                            <span>👤</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm">{student.full_name}</p>
                          <p className="text-xs text-gray-500 truncate">{student.email}</p>
                        </div>
                        <button
                          onClick={() => handleRemoveStudent(student.id)}
                          className="p-1 hover:bg-red-100 rounded text-red-500"
                          title="Xóa khỏi lớp"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">Chưa có học sinh nào</p>
                )}
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Chọn lớp để xem chi tiết</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddStudentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Thêm học sinh vào lớp</h3>
              <button onClick={() => setShowAddStudentModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm học sinh..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {filteredAvailable.map((student) => (
                <div key={student.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    {student.avatar_url ? (
                      <img src={student.avatar_url} alt="" className="w-10 h-10 rounded-full" />
                    ) : (
                      <span>👤</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm">{student.full_name}</p>
                    <p className="text-xs text-gray-500 truncate">{student.email}</p>
                  </div>
                  <button
                    onClick={() => handleAddStudent(student.id)}
                    disabled={adding}
                    className="px-3 py-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {filteredAvailable.length === 0 && (
                <p className="text-gray-500 text-center py-4">Không có học sinh nào chưa có lớp</p>
              )}
            </div>

            <button
              onClick={() => setShowAddStudentModal(false)}
              className="w-full mt-4 px-4 py-2 bg-gray-100 rounded-xl hover:bg-gray-200"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
