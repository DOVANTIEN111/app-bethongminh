// src/pages/admin/SchoolsPage.jsx
// Schools Management Page
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
  School, Plus, Edit, Trash2, Search, Eye,
  Loader2, X, MapPin, Phone, Mail, Users, GraduationCap
} from 'lucide-react';

export default function SchoolsPage() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingSchool, setEditingSchool] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [schoolStats, setSchoolStats] = useState({ teachers: 0, students: 0 });
  const [formData, setFormData] = useState({
    name: '', email: '', address: '', phone: ''
  });
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadSchools();
  }, []);

  const loadSchools = async () => {
    try {
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSchools(data || []);
    } catch (err) {
      console.error('Load schools error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSchoolStats = async (schoolId) => {
    try {
      const [teachersRes, studentsRes] = await Promise.all([
        supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .eq('school_id', schoolId)
          .eq('role', 'teacher'),
        supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .eq('school_id', schoolId)
          .eq('role', 'student'),
      ]);

      setSchoolStats({
        teachers: teachersRes.count || 0,
        students: studentsRes.count || 0,
      });
    } catch (err) {
      console.error('Load school stats error:', err);
    }
  };

  const handleOpenModal = (school = null) => {
    if (school) {
      setEditingSchool(school);
      setFormData({
        name: school.name || '',
        email: school.email || '',
        address: school.address || '',
        phone: school.phone || '',
      });
    } else {
      setEditingSchool(null);
      setFormData({ name: '', email: '', address: '', phone: '' });
    }
    setShowModal(true);
  };

  const handleViewDetail = async (school) => {
    setSelectedSchool(school);
    await loadSchoolStats(school.id);
    setShowDetailModal(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) return;

    setSaving(true);
    try {
      if (editingSchool) {
        const { error } = await supabase
          .from('schools')
          .update({
            name: formData.name.trim(),
            email: formData.email.trim() || null,
            address: formData.address.trim() || null,
            phone: formData.phone.trim() || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingSchool.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('schools')
          .insert({
            name: formData.name.trim(),
            email: formData.email.trim() || null,
            address: formData.address.trim() || null,
            phone: formData.phone.trim() || null,
          });

        if (error) throw error;
      }

      setShowModal(false);
      loadSchools();
    } catch (err) {
      console.error('Save school error:', err);
      alert('Có lỗi xảy ra: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (school) => {
    if (!confirm(`Bạn có chắc muốn xóa trường "${school.name}"? Tất cả dữ liệu liên quan sẽ bị xóa!`)) return;

    try {
      const { error } = await supabase
        .from('schools')
        .delete()
        .eq('id', school.id);

      if (error) throw error;
      loadSchools();
    } catch (err) {
      console.error('Delete school error:', err);
      alert('Có lỗi xảy ra: ' + err.message);
    }
  };

  const filteredSchools = schools.filter(s =>
    s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchQuery.toLowerCase())
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
            placeholder="Tìm kiếm trường học..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Thêm trường
        </button>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <p className="text-gray-600">
          Tổng cộng: <strong className="text-blue-600">{filteredSchools.length}</strong> trường học
        </p>
      </div>

      {/* Schools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSchools.map((school) => (
          <div
            key={school.id}
            className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <School className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{school.name}</h3>
                {school.email && (
                  <p className="text-sm text-gray-500 truncate flex items-center gap-1 mt-1">
                    <Mail className="w-3 h-3" /> {school.email}
                  </p>
                )}
                {school.address && (
                  <p className="text-sm text-gray-500 truncate flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" /> {school.address}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <span className="text-xs text-gray-400">
                {new Date(school.created_at).toLocaleDateString('vi-VN')}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleViewDetail(school)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                  title="Xem chi tiết"
                >
                  <Eye className="w-4 h-4 text-gray-500" />
                </button>
                <button
                  onClick={() => handleOpenModal(school)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                  title="Sửa"
                >
                  <Edit className="w-4 h-4 text-gray-500" />
                </button>
                <button
                  onClick={() => handleDelete(school)}
                  className="p-2 hover:bg-red-100 rounded-lg"
                  title="Xóa"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredSchools.length === 0 && (
          <div className="col-span-full bg-white rounded-xl shadow-sm p-12 text-center text-gray-500">
            <School className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Chưa có trường học nào</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">
                {editingSchool ? 'Sửa thông tin trường' : 'Thêm trường mới'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên trường *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="VD: Trường Tiểu học ABC"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="school@email.com"
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="123 Đường ABC, Quận XYZ"
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0912345678"
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
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

      {/* Detail Modal */}
      {showDetailModal && selectedSchool && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Chi tiết trường học</h3>
              <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <School className="w-10 h-10 text-blue-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900">{selectedSchool.name}</h4>
            </div>

            <div className="space-y-3">
              {selectedSchool.email && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span>{selectedSchool.email}</span>
                </div>
              )}
              {selectedSchool.address && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span>{selectedSchool.address}</span>
                </div>
              )}
              {selectedSchool.phone && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span>{selectedSchool.phone}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <GraduationCap className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">{schoolStats.teachers}</p>
                <p className="text-sm text-green-700">Giáo viên</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 text-center">
                <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-600">{schoolStats.students}</p>
                <p className="text-sm text-purple-700">Học sinh</p>
              </div>
            </div>

            <button
              onClick={() => setShowDetailModal(false)}
              className="w-full mt-6 px-4 py-2 bg-gray-100 rounded-xl hover:bg-gray-200"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
