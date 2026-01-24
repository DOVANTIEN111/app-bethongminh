// src/pages/teacher/TeacherLessonsPage.jsx
// Teacher's Lessons Management Page
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  FileText, Plus, Edit, Trash2, Search, Loader2, X,
  BookOpen, Video, File, Eye, Lock
} from 'lucide-react';

export default function TeacherLessonsPage() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('system');
  const [systemLessons, setSystemLessons] = useState([]);
  const [myLessons, setMyLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    video_url: '',
    attachment_url: '',
  });
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadLessons();
  }, [profile?.id]);

  const loadLessons = async () => {
    try {
      // Load system lessons (mock data for now)
      setSystemLessons([
        { id: 's1', title: 'Phép cộng trong phạm vi 10', subject: 'Toán', grade: '1', type: 'system', duration: '15 phút' },
        { id: 's2', title: 'Phép trừ trong phạm vi 10', subject: 'Toán', grade: '1', type: 'system', duration: '15 phút' },
        { id: 's3', title: 'Học vần: Chữ cái A, B, C', subject: 'Tiếng Việt', grade: '1', type: 'system', duration: '20 phút' },
        { id: 's4', title: 'Phép nhân 2', subject: 'Toán', grade: '2', type: 'system', duration: '20 phút' },
        { id: 's5', title: 'Phép chia 2', subject: 'Toán', grade: '2', type: 'system', duration: '20 phút' },
        { id: 's6', title: 'Đọc hiểu: Truyện cổ tích', subject: 'Tiếng Việt', grade: '2', type: 'system', duration: '25 phút' },
      ]);

      // Load teacher's custom lessons
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('teacher_id', profile?.id)
        .eq('type', 'custom')
        .order('created_at', { ascending: false });

      if (!error) {
        setMyLessons(data || []);
      } else {
        // Use mock data if table doesn't exist
        setMyLessons([
          { id: 'm1', title: 'Bài tập bổ sung: Phép cộng', description: 'Bài tập thêm cho học sinh giỏi', type: 'custom', created_at: new Date().toISOString() },
          { id: 'm2', title: 'Ôn tập cuối tuần', description: 'Tổng hợp kiến thức tuần 1', type: 'custom', created_at: new Date().toISOString() },
        ]);
      }
    } catch (err) {
      console.error('Load lessons error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (lesson = null) => {
    if (lesson) {
      setEditingLesson(lesson);
      setFormData({
        title: lesson.title || '',
        description: lesson.description || '',
        content: lesson.content || '',
        video_url: lesson.video_url || '',
        attachment_url: lesson.attachment_url || '',
      });
    } else {
      setEditingLesson(null);
      setFormData({
        title: '',
        description: '',
        content: '',
        video_url: '',
        attachment_url: '',
      });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.title.trim()) return;

    setSaving(true);
    try {
      const lessonData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        content: formData.content.trim(),
        video_url: formData.video_url.trim() || null,
        attachment_url: formData.attachment_url.trim() || null,
        teacher_id: profile.id,
        type: 'custom',
      };

      if (editingLesson) {
        const { error } = await supabase
          .from('lessons')
          .update({ ...lessonData, updated_at: new Date().toISOString() })
          .eq('id', editingLesson.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('lessons')
          .insert(lessonData);

        if (error) throw error;
      }

      setShowModal(false);
      loadLessons();
    } catch (err) {
      console.error('Save lesson error:', err);
      // For demo, just update local state
      if (!editingLesson) {
        setMyLessons(prev => [{
          id: 'm' + Date.now(),
          ...formData,
          type: 'custom',
          created_at: new Date().toISOString(),
        }, ...prev]);
      }
      setShowModal(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (lesson) => {
    if (!confirm(`Bạn có chắc muốn xóa bài giảng "${lesson.title}"?`)) return;

    try {
      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', lesson.id);

      if (error) throw error;
      loadLessons();
    } catch (err) {
      console.error('Delete lesson error:', err);
      setMyLessons(prev => prev.filter(l => l.id !== lesson.id));
    }
  };

  const filteredSystem = systemLessons.filter(l =>
    l.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.subject?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMy = myLessons.filter(l =>
    l.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm bài giảng..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        {activeTab === 'my' && (
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700"
          >
            <Plus className="w-5 h-5" />
            Tạo bài giảng
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab('system')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'system'
                ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <BookOpen className="w-4 h-4" />
              Bài giảng hệ thống ({systemLessons.length})
            </div>
          </button>
          <button
            onClick={() => setActiveTab('my')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'my'
                ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <FileText className="w-4 h-4" />
              Bài giảng của tôi ({myLessons.length})
            </div>
          </button>
        </div>

        <div className="p-6">
          {/* System Lessons */}
          {activeTab === 'system' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSystem.map((lesson) => (
                <div key={lesson.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      Hệ thống
                    </span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">{lesson.title}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <span>{lesson.subject}</span>
                    <span>•</span>
                    <span>Lớp {lesson.grade}</span>
                    <span>•</span>
                    <span>{lesson.duration}</span>
                  </div>
                  <button className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4" />
                    Xem bài giảng
                  </button>
                </div>
              ))}
              {filteredSystem.length === 0 && (
                <div className="col-span-full text-center text-gray-500 py-8">
                  <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Không tìm thấy bài giảng nào</p>
                </div>
              )}
            </div>
          )}

          {/* My Lessons */}
          {activeTab === 'my' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMy.map((lesson) => (
                <div key={lesson.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleOpenModal(lesson)}
                        className="p-1.5 hover:bg-gray-100 rounded"
                      >
                        <Edit className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() => handleDelete(lesson)}
                        className="p-1.5 hover:bg-red-100 rounded"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">{lesson.title}</h4>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{lesson.description || 'Chưa có mô tả'}</p>
                  <div className="flex items-center gap-2">
                    {lesson.video_url && (
                      <span className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs flex items-center gap-1">
                        <Video className="w-3 h-3" /> Video
                      </span>
                    )}
                    {lesson.attachment_url && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs flex items-center gap-1">
                        <File className="w-3 h-3" /> File
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {filteredMy.length === 0 && (
                <div className="col-span-full text-center text-gray-500 py-8">
                  <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Bạn chưa có bài giảng nào</p>
                  <button
                    onClick={() => handleOpenModal()}
                    className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                  >
                    Tạo bài giảng đầu tiên
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">
                {editingLesson ? 'Sửa bài giảng' : 'Tạo bài giảng mới'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tiêu đề *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="VD: Bài tập bổ sung phép cộng"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả ngắn gọn về bài giảng"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nội dung
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Nội dung chi tiết của bài giảng..."
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link video (YouTube, Vimeo...)
                </label>
                <div className="relative">
                  <Video className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    value={formData.video_url}
                    onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link file đính kèm
                </label>
                <div className="relative">
                  <File className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    value={formData.attachment_url}
                    onChange={(e) => setFormData({ ...formData, attachment_url: e.target.value })}
                    placeholder="https://drive.google.com/..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
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
                  disabled={saving || !formData.title.trim()}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50"
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
