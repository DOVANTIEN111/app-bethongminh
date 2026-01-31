// src/pages/admin/VideoTopicsPage.jsx
// Trang quan ly chu de video cho admin

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ChevronRight, FolderOpen, BookOpen } from 'lucide-react';
import { getAllTopics, createTopic, updateTopic, deleteTopic } from '../../services/videoService';

const VideoTopicsPage = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [filterSubject, setFilterSubject] = useState('');
  const [filterGrade, setFilterGrade] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: 'toan',
    grade: 'lop-1',
    is_free: false,
    is_active: true,
    display_order: 0
  });

  const subjects = [
    { id: 'toan', name: 'Toán', icon: '📐' },
    { id: 'tieng-viet', name: 'Tiếng Việt', icon: '📖' },
    { id: 'tieng-anh', name: 'Tiếng Anh', icon: '🌍' },
    { id: 'khoa-hoc', name: 'Khoa học', icon: '🔬' },
  ];

  const grades = [
    { id: 'lop-1', name: 'Lớp 1' },
    { id: 'lop-2', name: 'Lớp 2' },
    { id: 'lop-3', name: 'Lớp 3' },
    { id: 'lop-4', name: 'Lớp 4' },
    { id: 'lop-5', name: 'Lớp 5' },
  ];

  useEffect(() => {
    loadTopics();
  }, [filterSubject, filterGrade]);

  const loadTopics = async () => {
    setLoading(true);
    try {
      const filters = {};
      if (filterSubject) filters.subject = filterSubject;
      if (filterGrade) filters.grade = filterGrade;

      const data = await getAllTopics(filters);
      setTopics(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTopic) {
        await updateTopic(editingTopic.id, formData);
      } else {
        await createTopic(formData);
      }
      setShowModal(false);
      setEditingTopic(null);
      resetForm();
      loadTopics();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleEdit = (topic) => {
    setEditingTopic(topic);
    setFormData({
      title: topic.title || '',
      description: topic.description || '',
      subject: topic.subject || 'toan',
      grade: topic.grade || 'lop-1',
      is_free: topic.is_free || false,
      is_active: topic.is_active !== false,
      display_order: topic.display_order || 0
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Xóa chủ đề này? Video trong chủ đề sẽ không bị xóa.')) return;
    try {
      await deleteTopic(id);
      loadTopics();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      subject: 'toan',
      grade: 'lop-1',
      is_free: false,
      is_active: true,
      display_order: 0
    });
  };

  // Nhom theo mon hoc va lop
  const groupedTopics = topics.reduce((acc, topic) => {
    const key = `${topic.subject}-${topic.grade}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(topic);
    return acc;
  }, {});

  // Stats
  const totalTopics = topics.length;
  const freeTopics = topics.filter(t => t.is_free).length;
  const activeTopics = topics.filter(t => t.is_active).length;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FolderOpen className="w-7 h-7 text-blue-500" />
            Quản lý Chủ đề Video
          </h1>
          <p className="text-gray-500">Phân loại video theo chương, bài học</p>
        </div>
        <button
          onClick={() => { resetForm(); setEditingTopic(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition"
        >
          <Plus className="w-5 h-5" />
          Thêm chủ đề
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-gray-500 text-sm">Tổng chủ đề</p>
          <p className="text-2xl font-bold text-blue-600">{totalTopics}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-gray-500 text-sm">Miễn phí</p>
          <p className="text-2xl font-bold text-green-600">{freeTopics}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-gray-500 text-sm">Đang hoạt động</p>
          <p className="text-2xl font-bold text-purple-600">{activeTopics}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={filterSubject}
          onChange={(e) => setFilterSubject(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">Tất cả môn học</option>
          {subjects.map(s => (
            <option key={s.id} value={s.id}>{s.icon} {s.name}</option>
          ))}
        </select>
        <select
          value={filterGrade}
          onChange={(e) => setFilterGrade(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">Tất cả lớp</option>
          {grades.map(g => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>
      </div>

      {/* Topics List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : Object.keys(groupedTopics).length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-gray-500">Chưa có chủ đề nào</p>
          <button
            onClick={() => { resetForm(); setShowModal(true); }}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg font-bold"
          >
            Thêm chủ đề đầu tiên
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedTopics).map(([key, groupTopics]) => {
            const [subjectId, gradeId] = key.split('-');
            const subject = subjects.find(s => s.id === subjectId);
            const grade = grades.find(g => g.id === gradeId);

            return (
              <div key={key} className="bg-white rounded-xl shadow overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-3 font-bold text-gray-700 flex items-center gap-2">
                  <span className="text-xl">{subject?.icon}</span>
                  {subject?.name} - {grade?.name}
                  <span className="ml-auto text-sm font-normal text-gray-500">
                    {groupTopics.length} chủ đề
                  </span>
                </div>
                <div className="divide-y">
                  {groupTopics.map((topic, index) => (
                    <div key={topic.id} className={`flex items-center gap-4 p-4 hover:bg-gray-50 ${!topic.is_active ? 'opacity-50' : ''}`}>
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        topic.is_free ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {topic.display_order || index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-gray-800">{topic.title}</h3>
                          {topic.is_free && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded-full font-medium">
                              Miễn phí
                            </span>
                          )}
                          {!topic.is_active && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">
                              Ẩn
                            </span>
                          )}
                        </div>
                        {topic.description && (
                          <p className="text-sm text-gray-500 line-clamp-1">{topic.description}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          {topic.video_count || 0} video
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(topic)}
                          className="p-2 hover:bg-blue-50 rounded-lg transition"
                          title="Chỉnh sửa"
                        >
                          <Edit2 className="w-4 h-4 text-blue-500" />
                        </button>
                        <button
                          onClick={() => handleDelete(topic.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FolderOpen className="w-6 h-6 text-blue-500" />
              {editingTopic ? 'Sửa chủ đề' : 'Thêm chủ đề mới'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tên chủ đề *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="VD: Phép cộng trong phạm vi 10"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Môn học</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.icon} {s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Lớp</label>
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {grades.map(g => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Mô tả</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Mô tả ngắn về nội dung chủ đề..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Thứ tự hiển thị</label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  min="0"
                />
                <p className="text-xs text-gray-400 mt-1">Số nhỏ hơn sẽ hiển thị trước</p>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_free}
                    onChange={(e) => setFormData({ ...formData, is_free: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-green-500 focus:ring-green-500"
                  />
                  <span className="font-medium">Miễn phí (không cần Premium)</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="font-medium">Hiển thị (đang hoạt động)</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setEditingTopic(null); }}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-bold text-gray-700 hover:bg-gray-50 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition"
                >
                  {editingTopic ? 'Cập nhật' : 'Thêm chủ đề'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoTopicsPage;
