// src/pages/admin/ContentSubjectsPage.jsx
// Trang quản lý môn học cho Admin

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, Plus, Edit, Trash2, Eye, EyeOff, Search,
  Loader2, AlertCircle, CheckCircle, X, ChevronRight,
  GripVertical
} from 'lucide-react';
import {
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject
} from '../../services/contentManagement';

// Màu sắc có sẵn
const COLOR_OPTIONS = [
  { id: 'from-blue-400 to-blue-500', name: 'Xanh dương', preview: 'bg-blue-500' },
  { id: 'from-green-400 to-green-500', name: 'Xanh lá', preview: 'bg-green-500' },
  { id: 'from-orange-400 to-orange-500', name: 'Cam', preview: 'bg-orange-500' },
  { id: 'from-purple-400 to-purple-500', name: 'Tím', preview: 'bg-purple-500' },
  { id: 'from-red-400 to-red-500', name: 'Đỏ', preview: 'bg-red-500' },
  { id: 'from-yellow-400 to-yellow-500', name: 'Vàng', preview: 'bg-yellow-500' },
  { id: 'from-pink-400 to-pink-500', name: 'Hồng', preview: 'bg-pink-500' },
  { id: 'from-teal-400 to-teal-500', name: 'Xanh ngọc', preview: 'bg-teal-500' },
];

// Icon có sẵn
const ICON_OPTIONS = ['📚', '🇬🇧', '🔢', '📖', '🔬', '🎨', '🎵', '⚽', '🌍', '💻', '🧮', '📝'];

export default function ContentSubjectsPage() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // create | edit
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    name_en: '',
    description: '',
    icon: '📚',
    color: 'from-blue-400 to-blue-500',
    sort_order: 0,
    is_active: true,
  });

  // Delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Toast notification
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    setLoading(true);
    try {
      const data = await getSubjects(true);
      setSubjects(data || []);
    } catch (error) {
      console.error('Error loading subjects:', error);
      showToast('error', 'Không thể tải danh sách môn học');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const openCreateModal = () => {
    setFormData({
      name: '',
      name_en: '',
      description: '',
      icon: '📚',
      color: 'from-blue-400 to-blue-500',
      sort_order: subjects.length + 1,
      is_active: true,
    });
    setModalMode('create');
    setSelectedSubject(null);
    setShowModal(true);
  };

  const openEditModal = (subject) => {
    setFormData({
      name: subject.name || '',
      name_en: subject.name_en || '',
      description: subject.description || '',
      icon: subject.icon || '📚',
      color: subject.color || 'from-blue-400 to-blue-500',
      sort_order: subject.sort_order || 0,
      is_active: subject.is_active ?? true,
    });
    setModalMode('edit');
    setSelectedSubject(subject);
    setShowModal(true);
  };

  const handleSave = async () => {
    // Validate
    if (!formData.name.trim()) {
      showToast('error', 'Vui lòng nhập tên môn học');
      return;
    }

    setSaving(true);
    try {
      if (modalMode === 'create') {
        await createSubject(formData);
        showToast('success', 'Thêm môn học thành công!');
      } else {
        await updateSubject(selectedSubject.id, formData);
        showToast('success', 'Cập nhật môn học thành công!');
      }
      setShowModal(false);
      loadSubjects();
    } catch (error) {
      console.error('Error saving subject:', error);
      showToast('error', 'Lỗi khi lưu môn học');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteSubject(deleteTarget.id);
      showToast('success', 'Đã xóa môn học!');
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
      loadSubjects();
    } catch (error) {
      console.error('Error deleting subject:', error);
      showToast('error', 'Lỗi khi xóa môn học');
    }
  };

  const toggleActive = async (subject) => {
    try {
      await updateSubject(subject.id, { is_active: !subject.is_active });
      showToast('success', subject.is_active ? 'Đã ẩn môn học' : 'Đã hiện môn học');
      loadSubjects();
    } catch (error) {
      console.error('Error toggling active:', error);
      showToast('error', 'Lỗi khi cập nhật trạng thái');
    }
  };

  const filteredSubjects = subjects.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.name_en && s.name_en.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
          toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <BookOpen className="w-7 h-7 text-blue-500" />
          Quản lý Môn học
        </h1>
        <p className="text-gray-500 mt-1">Thêm, sửa, xóa các môn học trong hệ thống</p>
      </div>

      {/* Actions Bar */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm môn học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Add Button */}
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Thêm môn học
        </button>
      </div>

      {/* Subjects List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : filteredSubjects.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            {searchTerm ? 'Không tìm thấy môn học' : 'Chưa có môn học nào'}
          </p>
          {!searchTerm && (
            <button
              onClick={openCreateModal}
              className="mt-4 text-blue-500 hover:underline"
            >
              Thêm môn học đầu tiên
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Thứ tự</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Môn học</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Mô tả</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Trạng thái</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubjects.map((subject, index) => (
                <tr key={subject.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-gray-400">
                      <GripVertical className="w-4 h-4" />
                      <span className="font-medium">{index + 1}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 bg-gradient-to-br ${subject.color} rounded-xl flex items-center justify-center text-2xl shadow-sm`}>
                        {subject.icon}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{subject.name}</p>
                        {subject.name_en && (
                          <p className="text-sm text-gray-400">{subject.name_en}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-600 line-clamp-2 max-w-xs">
                      {subject.description || '-'}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleActive(subject)}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        subject.is_active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {subject.is_active ? (
                        <>
                          <Eye className="w-3 h-3" />
                          Hiện
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" />
                          Ẩn
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => navigate(`/admin/lessons?subject=${subject.id}`)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Xem bài học"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => openEditModal(subject)}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteTarget(subject);
                          setShowDeleteConfirm(true);
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                {modalMode === 'create' ? 'Thêm môn học mới' : 'Chỉnh sửa môn học'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-4">
              {/* Preview */}
              <div className="flex justify-center mb-4">
                <div className={`w-20 h-20 bg-gradient-to-br ${formData.color} rounded-2xl flex items-center justify-center text-4xl shadow-lg`}>
                  {formData.icon}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên môn học <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="VD: Tiếng Anh"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Name English */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên tiếng Anh
                </label>
                <input
                  type="text"
                  value={formData.name_en}
                  onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                  placeholder="VD: English"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả ngắn về môn học..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Icon */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Biểu tượng
                </label>
                <div className="flex flex-wrap gap-2">
                  {ICON_OPTIONS.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setFormData({ ...formData, icon })}
                      className={`w-10 h-10 text-xl rounded-lg border-2 transition-all ${
                        formData.icon === icon
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Màu sắc
                </label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_OPTIONS.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setFormData({ ...formData, color: color.id })}
                      className={`w-10 h-10 rounded-lg ${color.preview} transition-all ${
                        formData.color === color.id
                          ? 'ring-2 ring-offset-2 ring-blue-500'
                          : ''
                      }`}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thứ tự hiển thị
                </label>
                <input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                  min={0}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Is Active */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-5 h-5 text-blue-500 rounded focus:ring-blue-500"
                />
                <label htmlFor="is_active" className="text-sm text-gray-700">
                  Hiển thị môn học cho học sinh
                </label>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-4 border-t bg-gray-50">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {modalMode === 'create' ? 'Thêm môn học' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Xác nhận xóa</h3>
              <p className="text-gray-600 mb-6">
                Bạn có chắc muốn xóa môn học <strong>{deleteTarget.name}</strong>?
                <br />
                <span className="text-red-500 text-sm">
                  Tất cả bài học, từ vựng và câu hỏi thuộc môn này cũng sẽ bị xóa.
                </span>
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteTarget(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Xóa môn học
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
