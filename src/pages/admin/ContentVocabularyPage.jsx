// src/pages/admin/ContentVocabularyPage.jsx
// Trang quản lý từ vựng cho Admin

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Languages, Plus, Edit, Trash2, Search, Loader2, AlertCircle,
  CheckCircle, X, Filter, Upload, Image, Volume2, ArrowLeft
} from 'lucide-react';
import {
  getSubjects,
  getLessons,
  getVocabulary,
  createVocabulary,
  createVocabularyBulk,
  updateVocabulary,
  deleteVocabulary
} from '../../services/contentManagement';

export default function ContentVocabularyPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [vocabulary, setVocabulary] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterLesson, setFilterLesson] = useState(searchParams.get('lesson') || '');

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedVocab, setSelectedVocab] = useState(null);
  const [saving, setSaving] = useState(false);

  // Import Modal
  const [showImportModal, setShowImportModal] = useState(false);
  const [importData, setImportData] = useState('');
  const [importing, setImporting] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    lesson_id: '',
    word: '',
    meaning: '',
    pronunciation: '',
    example_sentence: '',
    image_url: '',
    audio_url: '',
    sort_order: 0,
    is_active: true,
  });

  // Delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Toast
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (filterSubject) {
      setFilteredLessons(lessons.filter(l => l.subject_id === filterSubject));
      setFilterLesson('');
    } else {
      setFilteredLessons(lessons);
    }
  }, [filterSubject, lessons]);

  useEffect(() => {
    loadVocabulary();
  }, [filterLesson]);

  const loadInitialData = async () => {
    try {
      const [subjectsData, lessonsData] = await Promise.all([
        getSubjects(true),
        getLessons({ includeInactive: true }),
      ]);
      setSubjects(subjectsData || []);
      setLessons(lessonsData || []);
      setFilteredLessons(lessonsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const loadVocabulary = async () => {
    setLoading(true);
    try {
      const data = await getVocabulary({
        lessonId: filterLesson || undefined,
        includeInactive: true,
      });
      setVocabulary(data || []);
    } catch (error) {
      console.error('Error loading vocabulary:', error);
      showToast('error', 'Không thể tải từ vựng');
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
      lesson_id: filterLesson || '',
      word: '',
      meaning: '',
      pronunciation: '',
      example_sentence: '',
      image_url: '',
      audio_url: '',
      sort_order: vocabulary.length + 1,
      is_active: true,
    });
    setModalMode('create');
    setSelectedVocab(null);
    setShowModal(true);
  };

  const openEditModal = (vocab) => {
    setFormData({
      lesson_id: vocab.lesson_id || '',
      word: vocab.word || '',
      meaning: vocab.meaning || '',
      pronunciation: vocab.pronunciation || '',
      example_sentence: vocab.example_sentence || '',
      image_url: vocab.image_url || '',
      audio_url: vocab.audio_url || '',
      sort_order: vocab.sort_order || 0,
      is_active: vocab.is_active ?? true,
    });
    setModalMode('edit');
    setSelectedVocab(vocab);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.word.trim()) {
      showToast('error', 'Vui lòng nhập từ');
      return;
    }
    if (!formData.meaning.trim()) {
      showToast('error', 'Vui lòng nhập nghĩa');
      return;
    }
    if (!formData.lesson_id) {
      showToast('error', 'Vui lòng chọn bài học');
      return;
    }

    setSaving(true);
    try {
      if (modalMode === 'create') {
        await createVocabulary(formData);
        showToast('success', 'Thêm từ vựng thành công!');
      } else {
        await updateVocabulary(selectedVocab.id, formData);
        showToast('success', 'Cập nhật từ vựng thành công!');
      }
      setShowModal(false);
      loadVocabulary();
    } catch (error) {
      console.error('Error saving vocabulary:', error);
      showToast('error', 'Lỗi khi lưu từ vựng');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteVocabulary(deleteTarget.id);
      showToast('success', 'Đã xóa từ vựng!');
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
      loadVocabulary();
    } catch (error) {
      console.error('Error deleting vocabulary:', error);
      showToast('error', 'Lỗi khi xóa từ vựng');
    }
  };

  const handleImport = async () => {
    if (!importData.trim()) {
      showToast('error', 'Vui lòng nhập dữ liệu');
      return;
    }
    if (!filterLesson) {
      showToast('error', 'Vui lòng chọn bài học trước');
      return;
    }

    setImporting(true);
    try {
      // Parse CSV/tab-separated data
      const lines = importData.trim().split('\n');
      const vocabList = lines.map((line, index) => {
        const [word, meaning, pronunciation] = line.split('\t').map(s => s.trim());
        return {
          lesson_id: filterLesson,
          word: word || '',
          meaning: meaning || '',
          pronunciation: pronunciation || '',
          sort_order: vocabulary.length + index + 1,
          is_active: true,
        };
      }).filter(v => v.word && v.meaning);

      if (vocabList.length === 0) {
        showToast('error', 'Không có dữ liệu hợp lệ');
        return;
      }

      await createVocabularyBulk(vocabList);
      showToast('success', `Đã import ${vocabList.length} từ vựng!`);
      setShowImportModal(false);
      setImportData('');
      loadVocabulary();
    } catch (error) {
      console.error('Error importing vocabulary:', error);
      showToast('error', 'Lỗi khi import từ vựng');
    } finally {
      setImporting(false);
    }
  };

  const filteredVocabulary = vocabulary.filter(v =>
    v.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.meaning.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedLesson = lessons.find(l => l.id === filterLesson);

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
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Languages className="w-7 h-7 text-blue-500" />
          Quản lý Từ vựng
          {selectedLesson && (
            <span className="text-lg font-normal text-gray-500">
              - {selectedLesson.title}
            </span>
          )}
        </h1>
        <p className="text-gray-500 mt-1">Thêm, sửa, xóa từ vựng trong hệ thống</p>
      </div>

      {/* Actions Bar */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
          {/* Filter by Subject */}
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white min-w-[150px]"
          >
            <option value="">Tất cả môn học</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.icon} {subject.name}
              </option>
            ))}
          </select>

          {/* Filter by Lesson */}
          <select
            value={filterLesson}
            onChange={(e) => {
              setFilterLesson(e.target.value);
              if (e.target.value) {
                setSearchParams({ lesson: e.target.value });
              } else {
                setSearchParams({});
              }
            }}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white min-w-[200px]"
          >
            <option value="">Tất cả bài học</option>
            {filteredLessons.map((lesson) => (
              <option key={lesson.id} value={lesson.id}>
                {lesson.subject?.icon} {lesson.title}
              </option>
            ))}
          </select>

          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm từ vựng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <Upload className="w-5 h-5" />
            Import
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Plus className="w-5 h-5" />
            Thêm từ
          </button>
        </div>
      </div>

      {/* Vocabulary List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : filteredVocabulary.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Languages className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            {searchTerm ? 'Không tìm thấy từ vựng' : 'Chưa có từ vựng nào'}
          </p>
          {!searchTerm && filterLesson && (
            <button onClick={openCreateModal} className="mt-4 text-blue-500 hover:underline">
              Thêm từ vựng đầu tiên
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">#</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Từ vựng</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Nghĩa</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Bài học</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Media</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredVocabulary.map((vocab, index) => (
                <tr key={vocab.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-semibold text-gray-800">{vocab.word}</p>
                      {vocab.pronunciation && (
                        <p className="text-sm text-gray-400">/{vocab.pronunciation}/</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-gray-700">{vocab.meaning}</p>
                    {vocab.example_sentence && (
                      <p className="text-sm text-gray-400 italic line-clamp-1">
                        {vocab.example_sentence}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {vocab.lesson && (
                      <span className="text-sm text-gray-600">
                        {vocab.lesson.subject?.icon} {vocab.lesson.title}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      {vocab.image_url && (
                        <span className="text-green-500" title="Có hình ảnh">
                          <Image className="w-4 h-4" />
                        </span>
                      )}
                      {vocab.audio_url && (
                        <span className="text-blue-500" title="Có audio">
                          <Volume2 className="w-4 h-4" />
                        </span>
                      )}
                      {!vocab.image_url && !vocab.audio_url && (
                        <span className="text-gray-300">-</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(vocab)}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteTarget(vocab);
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
                {modalMode === 'create' ? 'Thêm từ vựng mới' : 'Chỉnh sửa từ vựng'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Lesson */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bài học <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.lesson_id}
                  onChange={(e) => setFormData({ ...formData, lesson_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Chọn bài học --</option>
                  {lessons.map((lesson) => (
                    <option key={lesson.id} value={lesson.id}>
                      {lesson.subject?.icon} {lesson.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Word */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Từ tiếng Anh <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.word}
                  onChange={(e) => setFormData({ ...formData, word: e.target.value })}
                  placeholder="VD: Hello"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Meaning */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nghĩa tiếng Việt <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.meaning}
                  onChange={(e) => setFormData({ ...formData, meaning: e.target.value })}
                  placeholder="VD: Xin chào"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Pronunciation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phiên âm
                </label>
                <input
                  type="text"
                  value={formData.pronunciation}
                  onChange={(e) => setFormData({ ...formData, pronunciation: e.target.value })}
                  placeholder="VD: həˈloʊ"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Example */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Câu ví dụ
                </label>
                <textarea
                  value={formData.example_sentence}
                  onChange={(e) => setFormData({ ...formData, example_sentence: e.target.value })}
                  placeholder="VD: Hello, how are you?"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link hình ảnh
                </label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Audio URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link audio
                </label>
                <input
                  type="url"
                  value={formData.audio_url}
                  onChange={(e) => setFormData({ ...formData, audio_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
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
                {modalMode === 'create' ? 'Thêm từ vựng' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold text-gray-800">Import từ vựng</h2>
              <button onClick={() => setShowImportModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="bg-blue-50 text-blue-700 p-3 rounded-lg text-sm">
                <p className="font-medium mb-1">Hướng dẫn:</p>
                <p>Nhập mỗi từ vựng trên một dòng, các cột cách nhau bằng Tab:</p>
                <code className="block mt-2 bg-white p-2 rounded">
                  từ tiếng Anh [Tab] nghĩa tiếng Việt [Tab] phiên âm
                </code>
              </div>

              {!filterLesson && (
                <div className="bg-yellow-50 text-yellow-700 p-3 rounded-lg text-sm">
                  Vui lòng chọn bài học trước khi import!
                </div>
              )}

              <textarea
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                placeholder="Hello	Xin chào	həˈloʊ
Goodbye	Tạm biệt	ˌɡʊdˈbaɪ"
                rows={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              />
            </div>

            <div className="flex items-center justify-end gap-3 p-4 border-t bg-gray-50">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Hủy
              </button>
              <button
                onClick={handleImport}
                disabled={importing || !filterLesson}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {importing && <Loader2 className="w-4 h-4 animate-spin" />}
                Import
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
              Bạn có chắc muốn xóa từ vựng <strong>{deleteTarget.word}</strong>?
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
                Xóa từ vựng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
