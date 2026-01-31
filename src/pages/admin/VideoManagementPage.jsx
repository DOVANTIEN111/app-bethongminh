// src/pages/admin/VideoManagementPage.jsx
// Trang quan ly video cho Admin

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, Search, Youtube, Star, ToggleLeft, ToggleRight } from 'lucide-react';
import {
  getAllVideos,
  createVideo,
  updateVideo,
  deleteVideo,
  extractYoutubeId,
  getYoutubeThumbnail,
  toggleVideoFeatured,
  toggleVideoActive
} from '../../services/videoService';

const VideoManagementPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    youtube_url: '',
    description: '',
    subject: 'toan',
    grade: 'lop-1',
    category: 'bai-giang',
    teacher_name: '',
    channel_name: '',
    duration: '',
    tags: '',
    is_featured: false
  });

  const subjects = [
    { id: 'toan', name: 'Toán' },
    { id: 'tieng-viet', name: 'Tiếng Việt' },
    { id: 'tieng-anh', name: 'Tiếng Anh' },
    { id: 'khoa-hoc', name: 'Khoa học' },
    { id: 'ky-nang', name: 'Kỹ năng sống' },
  ];

  const grades = [
    { id: 'mam-non', name: 'Mầm non' },
    { id: 'lop-1', name: 'Lớp 1' },
    { id: 'lop-2', name: 'Lớp 2' },
    { id: 'lop-3', name: 'Lớp 3' },
    { id: 'lop-4', name: 'Lớp 4' },
    { id: 'lop-5', name: 'Lớp 5' },
  ];

  const categories = [
    { id: 'bai-giang', name: 'Bài giảng' },
    { id: 'luyen-tap', name: 'Luyện tập' },
    { id: 'kien-thuc', name: 'Kiến thức' },
    { id: 'giai-tri', name: 'Giải trí giáo dục' },
  ];

  useEffect(() => {
    loadVideos();
  }, [filterSubject]);

  const loadVideos = async () => {
    setLoading(true);
    try {
      const filters = {};
      if (filterSubject) filters.subject = filterSubject;
      if (searchTerm) filters.search = searchTerm;

      const data = await getAllVideos(filters);
      setVideos(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const videoData = {
        ...formData,
        duration: formData.duration ? parseInt(formData.duration) : null,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : []
      };

      if (editingVideo) {
        await updateVideo(editingVideo.id, videoData);
      } else {
        await createVideo(videoData);
      }

      setShowModal(false);
      setEditingVideo(null);
      resetForm();
      loadVideos();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (video) => {
    setEditingVideo(video);
    setFormData({
      title: video.title || '',
      youtube_url: video.youtube_url || '',
      description: video.description || '',
      subject: video.subject || 'toan',
      grade: video.grade || 'lop-1',
      category: video.category || 'bai-giang',
      teacher_name: video.teacher_name || '',
      channel_name: video.channel_name || '',
      duration: video.duration?.toString() || '',
      tags: video.tags?.join(', ') || '',
      is_featured: video.is_featured || false
    });
    setShowModal(true);
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Bạn có chắc muốn xóa video "${title}"?`)) return;

    try {
      await deleteVideo(id);
      loadVideos();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleToggleFeatured = async (id, currentStatus) => {
    try {
      await toggleVideoFeatured(id, !currentStatus);
      setVideos(videos.map(v =>
        v.id === id ? { ...v, is_featured: !currentStatus } : v
      ));
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      await toggleVideoActive(id, !currentStatus);
      setVideos(videos.map(v =>
        v.id === id ? { ...v, is_active: !currentStatus } : v
      ));
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      youtube_url: '',
      description: '',
      subject: 'toan',
      grade: 'lop-1',
      category: 'bai-giang',
      teacher_name: '',
      channel_name: '',
      duration: '',
      tags: '',
      is_featured: false
    });
  };

  const youtubeId = extractYoutubeId(formData.youtube_url);
  const previewThumbnail = youtubeId ? getYoutubeThumbnail(youtubeId) : null;

  const formatViews = (count) => {
    if (!count) return '0';
    return count.toLocaleString();
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            🎬 Quản lý Video YouTube
          </h1>
          <p className="text-gray-500">Thêm và quản lý video bài giảng cho học sinh</p>
        </div>
        <button
          onClick={() => { resetForm(); setEditingVideo(null); setShowModal(true); }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition"
        >
          <Plus className="w-5 h-5" />
          Thêm video mới
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm video..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && loadVideos()}
            className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>
        <select
          value={filterSubject}
          onChange={(e) => setFilterSubject(e.target.value)}
          className="px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500"
        >
          <option value="">Tất cả môn học</option>
          {subjects.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <button
          onClick={loadVideos}
          className="px-4 py-2.5 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition"
        >
          Tìm kiếm
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Tổng video</p>
          <p className="text-2xl font-bold text-gray-800">{videos.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Video nổi bật</p>
          <p className="text-2xl font-bold text-yellow-500">{videos.filter(v => v.is_featured).length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Tổng lượt xem</p>
          <p className="text-2xl font-bold text-blue-500">
            {videos.reduce((sum, v) => sum + (v.view_count || 0), 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Đang hoạt động</p>
          <p className="text-2xl font-bold text-green-500">{videos.filter(v => v.is_active).length}</p>
        </div>
      </div>

      {/* Video Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-600">Video</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-600 hidden md:table-cell">Môn</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-600 hidden lg:table-cell">Lớp</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-600 hidden md:table-cell">Lượt xem</th>
                <th className="px-4 py-3 text-center text-sm font-bold text-gray-600">Nổi bật</th>
                <th className="px-4 py-3 text-center text-sm font-bold text-gray-600">Trạng thái</th>
                <th className="px-4 py-3 text-center text-sm font-bold text-gray-600">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-4 py-12 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-red-500 border-t-transparent mx-auto mb-2"></div>
                    Đang tải...
                  </td>
                </tr>
              ) : videos.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-12 text-center text-gray-500">
                    <div className="text-5xl mb-3">📭</div>
                    <p className="font-medium">Chưa có video nào</p>
                    <p className="text-sm">Bấm "Thêm video mới" để bắt đầu!</p>
                  </td>
                </tr>
              ) : (
                videos.map((video) => (
                  <tr key={video.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={video.thumbnail_url}
                          alt={video.title}
                          className="w-20 md:w-24 h-14 object-cover rounded"
                          onError={(e) => {
                            e.target.src = '/images/video-placeholder.jpg';
                          }}
                        />
                        <div className="min-w-0">
                          <p className="font-medium line-clamp-1 text-sm">{video.title}</p>
                          <p className="text-xs text-gray-500 line-clamp-1">{video.channel_name || video.teacher_name}</p>
                          <p className="text-xs text-gray-400 md:hidden">
                            {subjects.find(s => s.id === video.subject)?.name} • {formatViews(video.view_count)} views
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
                        {subjects.find(s => s.id === video.subject)?.name || video.subject}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 hidden lg:table-cell">
                      {grades.find(g => g.id === video.grade)?.name || video.grade}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">
                      {formatViews(video.view_count)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleToggleFeatured(video.id, video.is_featured)}
                        className="text-2xl hover:scale-110 transition"
                        title={video.is_featured ? 'Bỏ nổi bật' : 'Đánh dấu nổi bật'}
                      >
                        {video.is_featured ? '⭐' : '☆'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleToggleActive(video.id, video.is_active)}
                        className={`p-1 rounded transition ${video.is_active ? 'text-green-500' : 'text-gray-400'}`}
                        title={video.is_active ? 'Đang hiển thị' : 'Đang ẩn'}
                      >
                        {video.is_active ? (
                          <ToggleRight className="w-8 h-8" />
                        ) : (
                          <ToggleLeft className="w-8 h-8" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-1">
                        <a
                          href={`https://youtube.com/watch?v=${video.youtube_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-gray-100 rounded transition"
                          title="Xem trên YouTube"
                        >
                          <Eye className="w-4 h-4 text-gray-500" />
                        </a>
                        <button
                          onClick={() => handleEdit(video)}
                          className="p-2 hover:bg-blue-50 rounded transition"
                          title="Chỉnh sửa"
                        >
                          <Edit2 className="w-4 h-4 text-blue-500" />
                        </button>
                        <button
                          onClick={() => handleDelete(video.id, video.title)}
                          className="p-2 hover:bg-red-50 rounded transition"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 md:p-6 border-b sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Youtube className="w-6 h-6 text-red-500" />
                {editingVideo ? 'Chỉnh sửa video' : 'Thêm video YouTube mới'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4">
              {/* YouTube URL */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Link YouTube <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                  <input
                    type="text"
                    value={formData.youtube_url}
                    onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                    placeholder="https://youtube.com/watch?v=... hoặc https://youtu.be/..."
                    className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
                {previewThumbnail && (
                  <div className="mt-2">
                    <img src={previewThumbnail} alt="Preview" className="w-40 rounded shadow" />
                    <p className="text-xs text-green-600 mt-1">✓ Link YouTube hợp lệ</p>
                  </div>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Tiêu đề video <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="VD: Học đếm số từ 1 đến 10"
                  className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              {/* Subject & Grade */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Môn học</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Lớp</label>
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500"
                  >
                    {grades.map(g => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Category & Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Danh mục</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Thời lượng (giây)</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="VD: 600 = 10 phút"
                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* Teacher & Channel */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tên giáo viên</label>
                  <input
                    type="text"
                    value={formData.teacher_name}
                    onChange={(e) => setFormData({ ...formData, teacher_name: e.target.value })}
                    placeholder="VD: Cô Nguyễn Thị A"
                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tên kênh YouTube</label>
                  <input
                    type="text"
                    value={formData.channel_name}
                    onChange={(e) => setFormData({ ...formData, channel_name: e.target.value })}
                    placeholder="VD: Toán Thầy Quang"
                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1">Mô tả</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả ngắn về nội dung video..."
                  rows={3}
                  className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium mb-1">Tags (cách nhau bởi dấu phẩy)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="VD: phép cộng, lớp 1, toán tư duy"
                  className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Featured */}
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="w-5 h-5 text-yellow-500"
                />
                <label htmlFor="is_featured" className="font-medium flex items-center gap-2">
                  <span className="text-xl">⭐</span>
                  Đánh dấu là video nổi bật
                </label>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setEditingVideo(null); }}
                  className="flex-1 px-4 py-3 border rounded-lg font-bold hover:bg-gray-50 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition disabled:opacity-50"
                >
                  {saving ? 'Đang lưu...' : editingVideo ? 'Cập nhật' : 'Thêm video'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoManagementPage;
