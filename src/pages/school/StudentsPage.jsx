// src/pages/school/StudentsPage.jsx
// Students Management Page
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  Users, Search, Loader2, Eye, BookOpen, Building2
} from 'lucide-react';

export default function StudentsPage() {
  const { profile } = useAuth();
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    loadData();
  }, [profile?.school_id]);

  const loadData = async () => {
    if (!profile?.school_id) {
      setLoading(false);
      return;
    }

    try {
      const [studentsRes, classesRes, deptsRes] = await Promise.all([
        supabase
          .from('profiles')
          .select('*, class:classes(name), department:departments(name)')
          .eq('school_id', profile.school_id)
          .eq('role', 'student')
          .order('full_name'),
        supabase
          .from('classes')
          .select('id, name')
          .eq('school_id', profile.school_id)
          .order('name'),
        supabase
          .from('departments')
          .select('id, name')
          .eq('school_id', profile.school_id)
          .order('name'),
      ]);

      setStudents(studentsRes.data || []);
      setClasses(classesRes.data || []);
      setDepartments(deptsRes.data || []);
    } catch (err) {
      console.error('Load data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(s => {
    const matchSearch = !searchQuery ||
      s.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchClass = !filterClass || s.class_id === filterClass;
    const matchDept = !filterDepartment || s.department_id === filterDepartment;
    return matchSearch && matchClass && matchDept;
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
        <select
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tất cả bộ phận</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>{dept.name}</option>
          ))}
        </select>
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
            onClick={() => setSelectedStudent(student)}
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
              {student.class?.name && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  {student.class.name}
                </span>
              )}
              {student.department?.name && (
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs flex items-center gap-1">
                  <Building2 className="w-3 h-3" />
                  {student.department.name}
                </span>
              )}
            </div>
          </div>
        ))}
        {filteredStudents.length === 0 && (
          <div className="col-span-full bg-white rounded-xl shadow-sm p-12 text-center text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Chưa có học sinh nào</p>
          </div>
        )}
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
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
                <span className="font-medium">{selectedStudent.class?.name || '-'}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Bộ phận</span>
                <span className="font-medium">{selectedStudent.department?.name || '-'}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Ngày tạo</span>
                <span className="font-medium">
                  {new Date(selectedStudent.created_at).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedStudent(null)}
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
