// src/pages/admin/ContentLessonsPage.jsx
// Trang quản lý bài học cho Admin

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  FileText, Plus, Edit, Trash2, Eye, EyeOff, Search,
  Loader2, AlertCircle, CheckCircle, X, ChevronRight,
  Filter, Crown, ArrowLeft
} from 'lucide-react';
import {
  getSubjects,
  getLessons,
  createLesson,
  updateLesson,
  deleteLesson
} from '../../services/contentManagement';

export default function ContentLessonsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [lessons, setLessons] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState(searchParams.get('subject') || '');

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    subject_id: '',
    title: '',
    title_en: '',
    description: '',
    level: 1,
    sort_order: 0,
    is_active: true,
    is_premium: false,
    content: {},
  });

  // Delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Toast
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadData();
  }, [filterSubject]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [subjectsData, lessonsData] = await Promise.all([
        getSubjects(true),
        getLessons({ subjectId: filterSubject || undefined, includeInactive: true }),
      ]);
      setSubjects(subjectsData || []);
      setLessons(lessonsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      showToast('error', 'Không thể tải dữ liệu');
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
      subject_id: filterSubject || '',
      title: '',
      title_en: '',
      description: '',
      level: 1,
      sort_order: lessons.length + 1,
      is_active: true,
      is_premium: false,
      content: {},
    });
    setModalMode('create');
    setSelectedLesson(null);
    setShowModal(true);
  };

  const openEditModal = (lesson) => {
    setFormData({
      subject_id: lesson.subject_id || '',
      title: lesson.title || '',
      title_en: lesson.title_en || '',
      description: lesson.description || '',
      level: lesson.level || 1,
      sort_order: lesson.sort_order || 0,
      is_active: lesson.is_active ?? true,
      is_premium: lesson.is_premium ?? false,
      content: lesson.content || {},
    });
    setModalMode('edit');
    setSelectedLesson(lesson);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      showToast('error', 'Vui lòng nhập tiêu đề bài học');
      return;
    }
    if (!formData.subject_id) {
      showToast('error', 'Vui lòng chọn môn học');
      return;
    }

    setSaving(true);
    try {
      if (modalMode === 'create') {
        await createLesson(formData);
        showToast('success', 'Thêm bài học thành công!');
      } else {
        await updateLesson(selectedLesson.id, formData);
        showToast('success', 'Cập nhật bài học thành công!');
      }
      setShowModal(false);
      loadData();
    } catch (error) {
      console.error('Error saving lesson:', error);
      showToast('error', 'Lỗi khi lưu bài học');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteLesson(deleteTarget.id);
      showToast('success', 'Đã xóa bài học!');
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
      loadData();
    } catch (error) {
      console.error('Error deleting lesson:', error);
      showToast('error', 'Lỗi khi xóa bài học');
    }
  };

  const toggleActive = async (lesson) => {
    try {
      await updateLesson(lesson.id, { is_active: !lesson.is_active });
      showToast('success', lesson.is_active ? 'Đã ẩn bài học' : 'Đã hiện bài học');
      loadData();
    } catch (error) {
      console.error('Error toggling active:', error);
      showToast('error', 'Lỗi khi cập nhật trạng thái');
    }
  };

  const handleFilterChange = (subjectId) => {
    setFilterSubject(subjectId);
    if (subjectId) {
      setSearchParams({ subject: subjectId });
    } else {
      setSearchParams({});
    }
  };

  const filteredLessons = lessons.filter(l =>
    l.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLevelLabel = (level) => {
    const levels = {
      1: { text: 'Cơ bản', color: 'bg-green-100 text-green-700' },
      2: { text: 'Trung bình', color: 'bg-yellow-100 text-yellow-700' },
      3: { text: 'Nâng cao', color: 'bg-red-100 text-red-700' },
    };
    return levels[level] || levels[1];
  };

  const selectedSubject = subjects.find(s => s.id === filterSubject);

  return (
    <div className="p-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
          toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          {filterSubject && (
            <button
              onClick={() => handleFilterChange('')}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ArrowLeft className="w-5 h-5 text-gray-500" />
            </button>
          )}
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FileText className="w-7 h-7 text-blue-500" />
            Quản lý Bài học
            {selectedSubject && (
              <span className="text-lg font-normal text-gray-500">
                - {selectedSubject.icon} {selectedSubject.name}
              </span>
            )}
          </h1>
        </div>
        <p className="text-gray-500">Thêm, sửa, xóa các bài học trong hệ thống</p>
      </div>

      {/* Actions Bar */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
          {/* Filter by Subject */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={filterSubject}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="pl-9 pr-8 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none cursor-pointer min-w-[180px]"
            >
              <option value="">Tất cả môn học</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.icon} {subject.name}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm bài học..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          Thêm bài học
        </button>
      </div>

      {/* Lessons List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : filteredLessons.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            {searchTerm ? 'Không tìm thấy bài học' : 'Chưa có bài học nào'}
          </p>
          {!searchTerm && (
            <button onClick={openCreateModal} className="mt-4 text-blue-500 hover:underline">
              Thêm bài học đầu tiên
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">#</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Bài học</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Môn học</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Cấp độ</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Nội dung</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Trạng thái</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredLessons.map((lesson, index) => (
                <tr key={lesson.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                  <td className="px-4 py-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-800">{lesson.title}</p>
                        {lesson.is_premium && (
                          <Crown className="w-4 h-4 text-yellow-500" />
                        )}
                      </div>
                      {lesson.description && (
                        <p className="text-sm text-gray-500 line-clamp-1 max-w-xs">
                          {lesson.description}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {lesson.subject && (
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{lesson.subject.icon}</span>
                        <span className="text-sm text-gray-600">{lesson.subject.name}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelLabel(lesson.level).color}`}>
                      {getLevelLabel(lesson.level).text}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-3 text-sm text-gray-500">
                      <span title="Từ vựng">{lesson.vocabulary_count?.[0]?.count || 0} từ</span>
                      <span title="Câu hỏi">{lesson.question_count?.[0]?.count || 0} câu</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleActive(lesson)}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        lesson.is_active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {lesson.is_active ? (
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
                        onClick={() => navigate(`/admin/vocabulary?lesson=${lesson.id}`)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                        title="Quản lý từ vựng"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => openEditModal(lesson)}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteTarget(lesson);
                          setShowDeleteConfirm(true);
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
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
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                {modalMode === 'create' ? 'Thêm bài học mới' : 'Chỉnh sửa bài học'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Môn học <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.subject_id}
                  onChange={(e) => setFormData({ ...formData, subject_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Chọn môn học --</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.icon} {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tiêu đề <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="VD: Bài 1 - Chào hỏi"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Title English */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tiêu đề tiếng Anh
                </label>
                <input
                  type="text"
                  value={formData.title_en}
                  onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                  placeholder="VD: Lesson 1 - Greetings"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                  placeholder="Mô tả ngắn về bài học..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cấp độ
                </label>
                <div className="flex gap-3">
                  {[1, 2, 3].map((level) => (
                    <button
                      key={level}
                      onClick={() => setFormData({ ...formData, level })}
                      className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                        formData.level === level
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {getLevelLabel(level).text}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thứ tự
                </label>
                <input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                  min={0}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Checkboxes */}
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-5 h-5 text-blue-500 rounded"
                  />
                  <span className="text-sm text-gray-700">Hiển thị bài học</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.is_premium}
                    onChange={(e) => setFormData({ ...formData, is_premium: e.target.checked })}
                    className="w-5 h-5 text-yellow-500 rounded"
                  />
                  <span className="text-sm text-gray-700 flex items-center gap-1">
                    <Crown className="w-4 h-4 text-yellow-500" />
                    Bài học Premium (yêu cầu trả phí)
                  </span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-4 border-t bg-gray-50">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {modalMode === 'create' ? 'Thêm bài học' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Xác nhận xóa</h3>
            <p className="text-gray-600 mb-6">
              Bạn có chắc muốn xóa bài học <strong>{deleteTarget.title}</strong>?
              <br />
              <span className="text-red-500 text-sm">
                Tất cả từ vựng và câu hỏi thuộc bài này cũng sẽ bị xóa.
              </span>
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteTarget(null);
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Hủy
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Xóa bài học
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
