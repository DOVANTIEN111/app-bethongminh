// src/pages/school/ClassesPage.jsx
// Classes Management Page
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  BookOpen, Plus, Edit, Trash2, Search, Users,
  Loader2, X, GraduationCap, Building2, ChevronRight
} from 'lucide-react';

export default function ClassesPage() {
  const { profile } = useAuth();
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({
    name: '', grade: '1', teacher_id: '', department_id: ''
  });
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);
  const [classStudents, setClassStudents] = useState([]);

  useEffect(() => {
    loadData();
  }, [profile?.school_id]);

  const loadData = async () => {
    if (!profile?.school_id) {
      setLoading(false);
      return;
    }

    try {
      const [classesRes, teachersRes, deptsRes] = await Promise.all([
        supabase
          .from('classes')
          .select('*, teacher:profiles!teacher_id(full_name), department:departments(name)')
          .eq('school_id', profile.school_id)
          .order('name'),
        supabase
          .from('profiles')
          .select('id, full_name')
          .eq('school_id', profile.school_id)
          .eq('role', 'teacher')
          .order('full_name'),
        supabase
          .from('departments')
          .select('id, name')
          .eq('school_id', profile.school_id)
          .order('name'),
      ]);

      setClasses(classesRes.data || []);
      setTeachers(teachersRes.data || []);
      setDepartments(deptsRes.data || []);
    } catch (err) {
      console.error('Load data error:', err);
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
        .eq('role', 'student');

      if (error) throw error;
      setClassStudents(data || []);
    } catch (err) {
      console.error('Load students error:', err);
    }
  };

  const handleSelectClass = (cls) => {
    setSelectedClass(cls);
    loadClassStudents(cls.id);
  };

  const handleOpenModal = (cls = null) => {
    if (cls) {
      setEditingClass(cls);
      setFormData({
        name: cls.name,
        grade: cls.grade || '1',
        teacher_id: cls.teacher_id || '',
        department_id: cls.department_id || '',
      });
    } else {
      setEditingClass(null);
      setFormData({ name: '', grade: '1', teacher_id: '', department_id: '' });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) return;

    setSaving(true);
    try {
      if (editingClass) {
        // Update
        const { error } = await supabase
          .from('classes')
          .update({
            name: formData.name.trim(),
            grade: formData.grade,
            teacher_id: formData.teacher_id || null,
            department_id: formData.department_id || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingClass.id);

        if (error) throw error;
      } else {
        // Create
        const { error } = await supabase
          .from('classes')
          .insert({
            school_id: profile.school_id,
            name: formData.name.trim(),
            grade: formData.grade,
            teacher_id: formData.teacher_id || null,
            department_id: formData.department_id || null,
          });

        if (error) throw error;
      }

      setShowModal(false);
      loadData();
    } catch (err) {
      console.error('Save class error:', err);
      alert('Có lỗi xảy ra: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cls) => {
    if (!confirm(`Bạn có chắc muốn xóa lớp "${cls.name}"?`)) return;

    try {
      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', cls.id);

      if (error) throw error;
      loadData();
      if (selectedClass?.id === cls.id) {
        setSelectedClass(null);
      }
    } catch (err) {
      console.error('Delete class error:', err);
      alert('Có lỗi xảy ra: ' + err.message);
    }
  };

  const filteredClasses = classes.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm lớp học..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Thêm lớp học
        </button>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Classes List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Danh sách lớp học ({filteredClasses.length})</h3>
          </div>
          <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
            {filteredClasses.map((cls) => (
              <div
                key={cls.id}
                className={`p-4 hover:bg-gray-50 cursor-pointer ${
                  selectedClass?.id === cls.id ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleSelectClass(cls)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">{cls.name}</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="text-xs text-gray-500">Khối {cls.grade}</span>
                      {cls.teacher?.full_name && (
                        <span className="text-xs text-green-600">GV: {cls.teacher.full_name}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleOpenModal(cls); }}
                      className="p-2 hover:bg-gray-200 rounded-lg"
                    >
                      <Edit className="w-4 h-4 text-gray-500" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(cls); }}
                      className="p-2 hover:bg-red-100 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
            ))}
            {filteredClasses.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Chưa có lớp học nào</p>
              </div>
            )}
          </div>
        </div>

        {/* Class Details */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {selectedClass ? (
            <>
              <div className="p-4 border-b border-gray-100 bg-amber-50">
                <h3 className="font-semibold text-gray-900">{selectedClass.name}</h3>
                <div className="flex flex-wrap gap-2 mt-2 text-sm">
                  <span className="px-2 py-1 bg-white rounded-full">Khối {selectedClass.grade}</span>
                  {selectedClass.teacher?.full_name && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                      <GraduationCap className="w-3 h-3" />
                      {selectedClass.teacher.full_name}
                    </span>
                  )}
                  {selectedClass.department?.name && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      {selectedClass.department.name}
                    </span>
                  )}
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  Học sinh trong lớp ({classStudents.length})
                </h4>
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
                          <p className="font-medium text-gray-900">{student.full_name}</p>
                          <p className="text-sm text-gray-500">{student.email}</p>
                        </div>
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
              <p>Chọn lớp học để xem chi tiết</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">
                {editingClass ? 'Sửa lớp học' : 'Thêm lớp học mới'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên lớp *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="VD: Lớp 3A"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Khối
                </label>
                <select
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((g) => (
                    <option key={g} value={g}>Khối {g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giáo viên phụ trách
                </label>
                <select
                  value={formData.teacher_id}
                  onChange={(e) => setFormData({ ...formData, teacher_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Chọn giáo viên --</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>{t.full_name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bộ phận
                </label>
                <select
                  value={formData.department_id}
                  onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Chọn bộ phận --</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
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
                  disabled={saving || !formData.name.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50"
                >
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
