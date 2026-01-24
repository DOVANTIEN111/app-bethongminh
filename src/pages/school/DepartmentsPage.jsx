// src/pages/school/DepartmentsPage.jsx
// Departments Management Page
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  Building2, Plus, Edit, Trash2, Users,
  Loader2, X, Search, ChevronRight
} from 'lucide-react';

export default function DepartmentsPage() {
  const { profile } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [departmentTeachers, setDepartmentTeachers] = useState([]);

  useEffect(() => {
    loadDepartments();
  }, [profile?.school_id]);

  const loadDepartments = async () => {
    if (!profile?.school_id) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .eq('school_id', profile.school_id)
        .order('name');

      if (error) throw error;
      setDepartments(data || []);
    } catch (err) {
      console.error('Load departments error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadDepartmentTeachers = async (departmentId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone, avatar_url')
        .eq('department_id', departmentId)
        .eq('role', 'teacher');

      if (error) throw error;
      setDepartmentTeachers(data || []);
    } catch (err) {
      console.error('Load teachers error:', err);
    }
  };

  const handleSelectDepartment = (dept) => {
    setSelectedDepartment(dept);
    loadDepartmentTeachers(dept.id);
  };

  const handleOpenModal = (department = null) => {
    if (department) {
      setEditingDepartment(department);
      setFormData({ name: department.name, description: department.description || '' });
    } else {
      setEditingDepartment(null);
      setFormData({ name: '', description: '' });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) return;

    setSaving(true);
    try {
      if (editingDepartment) {
        // Update
        const { error } = await supabase
          .from('departments')
          .update({
            name: formData.name.trim(),
            description: formData.description.trim(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingDepartment.id);

        if (error) throw error;
      } else {
        // Create
        const { error } = await supabase
          .from('departments')
          .insert({
            school_id: profile.school_id,
            name: formData.name.trim(),
            description: formData.description.trim(),
          });

        if (error) throw error;
      }

      setShowModal(false);
      loadDepartments();
    } catch (err) {
      console.error('Save department error:', err);
      alert('Có lỗi xảy ra: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (department) => {
    if (!confirm(`Bạn có chắc muốn xóa bộ phận "${department.name}"?`)) return;

    try {
      const { error } = await supabase
        .from('departments')
        .delete()
        .eq('id', department.id);

      if (error) throw error;
      loadDepartments();
      if (selectedDepartment?.id === department.id) {
        setSelectedDepartment(null);
      }
    } catch (err) {
      console.error('Delete department error:', err);
      alert('Có lỗi xảy ra: ' + err.message);
    }
  };

  const filteredDepartments = departments.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
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
            placeholder="Tìm kiếm bộ phận..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Thêm bộ phận
        </button>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Departments List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Danh sách bộ phận ({filteredDepartments.length})</h3>
          </div>
          <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
            {filteredDepartments.map((dept) => (
              <div
                key={dept.id}
                className={`p-4 hover:bg-gray-50 cursor-pointer ${
                  selectedDepartment?.id === dept.id ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleSelectDepartment(dept)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">{dept.name}</p>
                    {dept.description && (
                      <p className="text-sm text-gray-500 truncate">{dept.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleOpenModal(dept); }}
                      className="p-2 hover:bg-gray-200 rounded-lg"
                    >
                      <Edit className="w-4 h-4 text-gray-500" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(dept); }}
                      className="p-2 hover:bg-red-100 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
            ))}
            {filteredDepartments.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <Building2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Chưa có bộ phận nào</p>
              </div>
            )}
          </div>
        </div>

        {/* Department Details */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {selectedDepartment ? (
            <>
              <div className="p-4 border-b border-gray-100 bg-blue-50">
                <h3 className="font-semibold text-gray-900">{selectedDepartment.name}</h3>
                {selectedDepartment.description && (
                  <p className="text-sm text-gray-600 mt-1">{selectedDepartment.description}</p>
                )}
              </div>
              <div className="p-4">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" />
                  Giáo viên trong bộ phận ({departmentTeachers.length})
                </h4>
                {departmentTeachers.length > 0 ? (
                  <div className="space-y-2">
                    {departmentTeachers.map((teacher) => (
                      <div key={teacher.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          {teacher.avatar_url ? (
                            <img src={teacher.avatar_url} alt="" className="w-10 h-10 rounded-full" />
                          ) : (
                            <span>👤</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900">{teacher.full_name}</p>
                          <p className="text-sm text-gray-500">{teacher.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">Chưa có giáo viên nào</p>
                )}
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Building2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Chọn bộ phận để xem chi tiết</p>
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
                {editingDepartment ? 'Sửa bộ phận' : 'Thêm bộ phận mới'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên bộ phận *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="VD: Tổ Toán"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả về bộ phận..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
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
