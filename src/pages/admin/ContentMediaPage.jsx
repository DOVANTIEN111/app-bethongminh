// src/pages/admin/ContentMediaPage.jsx
// Trang quản lý thư viện Media cho Admin

import React, { useState, useEffect, useRef } from 'react';
import {
  FolderOpen, Upload, Trash2, Search, Loader2, AlertCircle,
  CheckCircle, X, Image, Volume2, Video, Copy, Filter,
  ExternalLink, FileImage, FileAudio, FileVideo
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getMedia, uploadMedia, deleteMedia } from '../../services/contentManagement';

export default function ContentMediaPage() {
  const { profile } = useAuth();
  const fileInputRef = useRef(null);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');

  // Delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Preview modal
  const [showPreview, setShowPreview] = useState(false);
  const [previewItem, setPreviewItem] = useState(null);

  // Toast
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadMedia();
  }, [filterType]);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const data = await getMedia({ type: filterType || undefined });
      setMedia(data || []);
    } catch (error) {
      console.error('Error loading media:', error);
      showToast('error', 'Không thể tải thư viện media');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    let successCount = 0;

    for (const file of files) {
      try {
        // Determine type from mime type
        let type = 'image';
        if (file.type.startsWith('audio/')) type = 'audio';
        else if (file.type.startsWith('video/')) type = 'video';

        await uploadMedia(file, type, profile?.id);
        successCount++;
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }

    setUploading(false);
    fileInputRef.current.value = '';

    if (successCount > 0) {
      showToast('success', `Đã tải lên ${successCount} file!`);
      loadMedia();
    } else {
      showToast('error', 'Không thể tải lên file');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteMedia(deleteTarget.id, deleteTarget.url);
      showToast('success', 'Đã xóa file!');
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
      loadMedia();
    } catch (error) {
      console.error('Error deleting media:', error);
      showToast('error', 'Lỗi khi xóa file');
    }
  };

  const copyLink = (url) => {
    navigator.clipboard.writeText(url);
    showToast('success', 'Đã sao chép link!');
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '-';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'audio': return <FileAudio className="w-8 h-8 text-blue-500" />;
      case 'video': return <FileVideo className="w-8 h-8 text-purple-500" />;
      default: return <FileImage className="w-8 h-8 text-green-500" />;
    }
  };

  const filteredMedia = media.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: media.length,
    images: media.filter(m => m.type === 'image').length,
    audio: media.filter(m => m.type === 'audio').length,
    video: media.filter(m => m.type === 'video').length,
  };

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
          <FolderOpen className="w-7 h-7 text-blue-500" />
          Thư viện Media
        </h1>
        <p className="text-gray-500 mt-1">Quản lý hình ảnh, audio, video trong hệ thống</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-gray-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              <p className="text-sm text-gray-500">Tổng file</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Image className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.images}</p>
              <p className="text-sm text-gray-500">Hình ảnh</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Volume2 className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.audio}</p>
              <p className="text-sm text-gray-500">Audio</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Video className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.video}</p>
              <p className="text-sm text-gray-500">Video</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex gap-3 flex-1 w-full">
          {/* Filter by Type */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Tất cả loại</option>
            <option value="image">🖼️ Hình ảnh</option>
            <option value="audio">🔊 Audio</option>
            <option value="video">🎬 Video</option>
          </select>

          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm file..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Upload Button */}
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,audio/*,video/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Upload className="w-5 h-5" />
            )}
            {uploading ? 'Đang tải...' : 'Tải lên'}
          </button>
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            {searchTerm ? 'Không tìm thấy file' : 'Chưa có file nào'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 text-blue-500 hover:underline"
            >
              Tải lên file đầu tiên
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-md transition-shadow"
            >
              {/* Preview */}
              <div
                className="aspect-square bg-gray-100 relative cursor-pointer"
                onClick={() => {
                  setPreviewItem(item);
                  setShowPreview(true);
                }}
              >
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '';
                      e.target.className = 'hidden';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {getTypeIcon(item.type)}
                  </div>
                )}

                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyLink(item.url);
                    }}
                    className="p-2 bg-white rounded-full hover:bg-gray-100"
                    title="Sao chép link"
                  >
                    <Copy className="w-4 h-4 text-gray-700" />
                  </button>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 bg-white rounded-full hover:bg-gray-100"
                    title="Mở link"
                  >
                    <ExternalLink className="w-4 h-4 text-gray-700" />
                  </a>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteTarget(item);
                      setShowDeleteConfirm(true);
                    }}
                    className="p-2 bg-white rounded-full hover:bg-gray-100"
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-3">
                <p className="text-sm font-medium text-gray-800 truncate" title={item.name}>
                  {item.name}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-400">{formatFileSize(item.size)}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    item.type === 'image' ? 'bg-green-100 text-green-700' :
                    item.type === 'audio' ? 'bg-blue-100 text-blue-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {item.type}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && previewItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setShowPreview(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-bold text-gray-800 truncate flex-1 mr-4">{previewItem.name}</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4">
              {/* Preview content */}
              <div className="flex items-center justify-center mb-4 min-h-[300px] bg-gray-100 rounded-lg overflow-hidden">
                {previewItem.type === 'image' && (
                  <img
                    src={previewItem.url}
                    alt={previewItem.name}
                    className="max-w-full max-h-[60vh] object-contain"
                  />
                )}
                {previewItem.type === 'audio' && (
                  <audio controls src={previewItem.url} className="w-full max-w-md" />
                )}
                {previewItem.type === 'video' && (
                  <video controls src={previewItem.url} className="max-w-full max-h-[60vh]" />
                )}
              </div>

              {/* Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Kích thước</p>
                  <p className="font-medium">{formatFileSize(previewItem.size)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Loại file</p>
                  <p className="font-medium">{previewItem.mime_type || previewItem.type}</p>
                </div>
                <div>
                  <p className="text-gray-500">Ngày tải lên</p>
                  <p className="font-medium">{formatDate(previewItem.created_at)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Link</p>
                  <button
                    onClick={() => copyLink(previewItem.url)}
                    className="text-blue-500 hover:underline flex items-center gap-1"
                  >
                    <Copy className="w-4 h-4" />
                    Sao chép link
                  </button>
                </div>
              </div>
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
              Bạn có chắc muốn xóa file <strong>{deleteTarget.name}</strong>?
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
                Xóa file
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
