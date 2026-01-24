// src/pages/teacher/TeacherStudentsPage.jsx
// Teacher's Students View Page
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  Users, Search, Loader2, X, BookOpen,
  TrendingUp, Clock, Star, Eye
} from 'lucide-react';

export default function TeacherStudentsPage() {
  const { profile } = useAuth();
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

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

      const classIds = classesData?.map(c => c.id) || [];

      if (classIds.length > 0) {
        // Load students in teacher's classes
        const { data: studentsData } = await supabase
          .from('profiles')
          .select('*, class:classes(id, name)')
          .in('class_id', classIds)
          .eq('role', 'student')
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
      }
    } catch (err) {
      console.error('Load data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (student) => {
    setSelectedStudent(student);
    setShowDetailModal(true);
  };

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
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tim kiem hoc sinh..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <select
          value={filterClass}
          onChange={(e) => setFilterClass(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">Tat ca lop</option>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>{cls.name}</option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <p className="text-gray-600">
          Tong cong: <strong className="text-emerald-600">{filteredStudents.length}</strong> hoc sinh
        </p>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Hoc sinh</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Lop</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Tien do</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Thoi gian hoc</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Diem TB</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Chi tiet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        {student.avatar_url ? (
                          <img src={student.avatar_url} alt="" className="w-10 h-10 rounded-full" />
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
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs">
                      {student.class?.name}
                    </span>
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
                    <button
                      onClick={() => handleViewDetail(student)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <Eye className="w-4 h-4 text-gray-500" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Khong co hoc sinh nao</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Chi tiet hoc sinh</h3>
              <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                {selectedStudent.avatar_url ? (
                  <img src={selectedStudent.avatar_url} alt="" className="w-20 h-20 rounded-full" />
                ) : (
                  <Users className="w-10 h-10 text-purple-600" />
                )}
              </div>
              <h4 className="text-xl font-bold text-gray-900">{selectedStudent.full_name}</h4>
              <p className="text-gray-500">{selectedStudent.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">
                {selectedStudent.class?.name}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">{selectedStudent.progress}%</p>
                <p className="text-sm text-blue-700">Tien do</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-4 text-center">
                <Star className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-amber-600">{selectedStudent.avg_score}</p>
                <p className="text-sm text-amber-700">Diem TB</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <BookOpen className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">{selectedStudent.lessons_completed}</p>
                <p className="text-sm text-green-700">Bai hoan thanh</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 text-center">
                <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-600">{selectedStudent.total_time}h</p>
                <p className="text-sm text-purple-700">Thoi gian hoc</p>
              </div>
            </div>

            <button
              onClick={() => setShowDetailModal(false)}
              className="w-full px-4 py-2 bg-gray-100 rounded-xl hover:bg-gray-200"
            >
              Dong
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
