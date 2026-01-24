// src/pages/admin/ContentQuestionsPage.jsx
// Trang quản lý câu hỏi Quiz cho Admin

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  HelpCircle, Plus, Edit, Trash2, Search, Loader2, AlertCircle,
  CheckCircle, X, Filter, Upload
} from 'lucide-react';
import {
  getSubjects,
  getLessons,
  getQuestions,
  createQuestion,
  createQuestionsBulk,
  updateQuestion,
  deleteQuestion,
  QUESTION_TYPES,
  DIFFICULTY_LEVELS
} from '../../services/contentManagement';

export default function ContentQuestionsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [questions, setQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterLesson, setFilterLesson] = useState(searchParams.get('lesson') || '');
  const [filterType, setFilterType] = useState('');

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    lesson_id: '',
    type: 'multiple_choice',
    content: '',
    options: ['', '', '', ''],
    correct_answer: 0,
    explanation: '',
    difficulty: 1,
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
    loadQuestions();
  }, [filterLesson, filterType]);

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

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const data = await getQuestions({
        lessonId: filterLesson || undefined,
        type: filterType || undefined,
        includeInactive: true,
      });
      setQuestions(data || []);
    } catch (error) {
      console.error('Error loading questions:', error);
      showToast('error', 'Không thể tải câu hỏi');
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
      type: 'multiple_choice',
      content: '',
      options: ['', '', '', ''],
      correct_answer: 0,
      explanation: '',
      difficulty: 1,
      image_url: '',
      audio_url: '',
      sort_order: questions.length + 1,
      is_active: true,
    });
    setModalMode('create');
    setSelectedQuestion(null);
    setShowModal(true);
  };

  const openEditModal = (question) => {
    const options = question.options || ['', '', '', ''];
    while (options.length < 4) options.push('');

    setFormData({
      lesson_id: question.lesson_id || '',
      type: question.type || 'multiple_choice',
      content: question.content || '',
      options: options,
      correct_answer: question.correct_answer || 0,
      explanation: question.explanation || '',
      difficulty: question.difficulty || 1,
      image_url: question.image_url || '',
      audio_url: question.audio_url || '',
      sort_order: question.sort_order || 0,
      is_active: question.is_active ?? true,
    });
    setModalMode('edit');
    setSelectedQuestion(question);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.content.trim()) {
      showToast('error', 'Vui lòng nhập nội dung câu hỏi');
      return;
    }
    if (!formData.lesson_id) {
      showToast('error', 'Vui lòng chọn bài học');
      return;
    }

    // Filter empty options
    const validOptions = formData.options.filter(opt => opt.trim());
    if (formData.type === 'multiple_choice' && validOptions.length < 2) {
      showToast('error', 'Cần ít nhất 2 đáp án');
      return;
    }

    setSaving(true);
    try {
      const dataToSave = {
        ...formData,
        options: validOptions,
      };

      if (modalMode === 'create') {
        await createQuestion(dataToSave);
        showToast('success', 'Thêm câu hỏi thành công!');
      } else {
        await updateQuestion(selectedQuestion.id, dataToSave);
        showToast('success', 'Cập nhật câu hỏi thành công!');
      }
      setShowModal(false);
      loadQuestions();
    } catch (error) {
      console.error('Error saving question:', error);
      showToast('error', 'Lỗi khi lưu câu hỏi');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteQuestion(deleteTarget.id);
      showToast('success', 'Đã xóa câu hỏi!');
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
      loadQuestions();
    } catch (error) {
      console.error('Error deleting question:', error);
      showToast('error', 'Lỗi khi xóa câu hỏi');
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const filteredQuestions = questions.filter(q =>
    q.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeInfo = (type) => QUESTION_TYPES.find(t => t.id === type) || QUESTION_TYPES[0];
  const getDifficultyInfo = (level) => DIFFICULTY_LEVELS.find(d => d.id === level) || DIFFICULTY_LEVELS[0];

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
          <HelpCircle className="w-7 h-7 text-blue-500" />
          Quản lý Câu hỏi Quiz
          {selectedLesson && (
            <span className="text-lg font-normal text-gray-500">
              - {selectedLesson.title}
            </span>
          )}
        </h1>
        <p className="text-gray-500 mt-1">Thêm, sửa, xóa câu hỏi trong hệ thống</p>
      </div>

      {/* Actions Bar */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-3 flex-1 w-full">
          {/* Filter by Subject */}
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
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
            className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Tất cả bài học</option>
            {filteredLessons.map((lesson) => (
              <option key={lesson.id} value={lesson.id}>
                {lesson.subject?.icon} {lesson.title}
              </option>
            ))}
          </select>

          {/* Filter by Type */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Tất cả loại</option>
            {QUESTION_TYPES.map((type) => (
              <option key={type.id} value={type.id}>
                {type.icon} {type.name}
              </option>
            ))}
          </select>

          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm câu hỏi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          Thêm câu hỏi
        </button>
      </div>

      {/* Questions List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            {searchTerm ? 'Không tìm thấy câu hỏi' : 'Chưa có câu hỏi nào'}
          </p>
          {!searchTerm && filterLesson && (
            <button onClick={openCreateModal} className="mt-4 text-blue-500 hover:underline">
              Thêm câu hỏi đầu tiên
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map((question, index) => (
            <div key={question.id} className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold flex-shrink-0">
                  {index + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{getTypeInfo(question.type).icon}</span>
                    <span className="text-sm text-gray-500">{getTypeInfo(question.type).name}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      getDifficultyInfo(question.difficulty).color === 'green' ? 'bg-green-100 text-green-700' :
                      getDifficultyInfo(question.difficulty).color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {getDifficultyInfo(question.difficulty).name}
                    </span>
                  </div>

                  <p className="font-medium text-gray-800 mb-2">{question.content}</p>

                  {question.options && question.options.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {question.options.map((opt, idx) => (
                        <span
                          key={idx}
                          className={`px-3 py-1 rounded-lg text-sm ${
                            idx === question.correct_answer
                              ? 'bg-green-100 text-green-700 font-medium'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {String.fromCharCode(65 + idx)}. {opt}
                        </span>
                      ))}
                    </div>
                  )}

                  {question.lesson && (
                    <p className="text-sm text-gray-400 mt-2">
                      {question.lesson.subject?.icon} {question.lesson.title}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => openEditModal(question)}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                    title="Chỉnh sửa"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      setDeleteTarget(question);
                      setShowDeleteConfirm(true);
                    }}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    title="Xóa"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                {modalMode === 'create' ? 'Thêm câu hỏi mới' : 'Chỉnh sửa câu hỏi'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
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

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại câu hỏi
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {QUESTION_TYPES.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.icon} {type.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nội dung câu hỏi <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Nhập câu hỏi..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Options for multiple choice */}
              {formData.type === 'multiple_choice' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Các đáp án
                  </label>
                  <div className="space-y-2">
                    {formData.options.map((opt, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <button
                          onClick={() => setFormData({ ...formData, correct_answer: idx })}
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm transition-colors ${
                            formData.correct_answer === idx
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {String.fromCharCode(65 + idx)}
                        </button>
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => updateOption(idx, e.target.value)}
                          placeholder={`Đáp án ${String.fromCharCode(65 + idx)}`}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Click vào chữ cái để chọn đáp án đúng
                  </p>
                </div>
              )}

              {/* Explanation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giải thích đáp án
                </label>
                <textarea
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  placeholder="Giải thích tại sao đáp án này đúng..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Độ khó
                </label>
                <div className="flex gap-3">
                  {DIFFICULTY_LEVELS.map((level) => (
                    <button
                      key={level.id}
                      onClick={() => setFormData({ ...formData, difficulty: level.id })}
                      className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                        formData.difficulty === level.id
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {level.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                {modalMode === 'create' ? 'Thêm câu hỏi' : 'Lưu thay đổi'}
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
              Bạn có chắc muốn xóa câu hỏi này?
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
                Xóa câu hỏi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
