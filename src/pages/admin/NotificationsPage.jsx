// src/pages/admin/NotificationsPage.jsx
// Trang quản lý thông báo
import React, { useState, useEffect } from 'react';
import {
  Bell, Plus, Send, Edit2, Trash2, Search, Eye, RefreshCw,
  X, Users, School, User, Calendar, CheckCircle, Clock, Filter
} from 'lucide-react';
import {
  getNotifications, getNotificationById, createNotification, updateNotification,
  deleteNotification, sendNotification, getNotificationStats, getOverallNotificationStats,
  NOTIFICATION_TYPES, TARGET_TYPES
} from '../../services/notificationManagement';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export default function NotificationsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sentFilter, setSentFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingNotification, setEditingNotification] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [notificationStats, setNotificationStats] = useState(null);
  const [sending, setSending] = useState(false);

  // For target selection
  const [schools, setSchools] = useState([]);
  const [users, setUsers] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'general',
    target_type: 'all',
    target_roles: [],
    target_schools: [],
    target_users: [],
    image_url: '',
    action_url: '',
    scheduled_at: '',
  });

  const ROLES = [
    { id: 'super_admin', name: 'Super Admin' },
    { id: 'school_admin', name: 'Admin trường' },
    { id: 'teacher', name: 'Giáo viên' },
    { id: 'parent', name: 'Phụ huynh' },
    { id: 'student', name: 'Học sinh' },
  ];

  useEffect(() => {
    loadData();
    loadSchoolsAndUsers();
  }, []);

  useEffect(() => {
    filterNotifications();
  }, [notifications, search, typeFilter, sentFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [notifData, overallStats] = await Promise.all([
        getNotifications(),
        getOverallNotificationStats()
      ]);
      setNotifications(notifData || []);
      setStats(overallStats);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSchoolsAndUsers = async () => {
    try {
      const [schoolsRes, usersRes] = await Promise.all([
        supabase.from('schools').select('id, name').order('name'),
        supabase.from('profiles').select('id, full_name, email').limit(100).order('full_name')
      ]);
      setSchools(schoolsRes.data || []);
      setUsers(usersRes.data || []);
    } catch (error) {
      console.error('Error loading schools/users:', error);
    }
  };

  const filterNotifications = () => {
    let filtered = [...notifications];

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(n =>
        n.title.toLowerCase().includes(searchLower) ||
        n.content.toLowerCase().includes(searchLower)
      );
    }

    if (typeFilter) {
      filtered = filtered.filter(n => n.type === typeFilter);
    }

    if (sentFilter !== '') {
      const isSent = sentFilter === 'sent';
      filtered = filtered.filter(n => n.is_sent === isSent);
    }

    setFilteredNotifications(filtered);
  };

  const openCreateModal = () => {
    setEditingNotification(null);
    setFormData({
      title: '',
      content: '',
      type: 'general',
      target_type: 'all',
      target_roles: [],
      target_schools: [],
      target_users: [],
      image_url: '',
      action_url: '',
      scheduled_at: '',
    });
    setShowModal(true);
  };

  const openEditModal = async (id) => {
    try {
      const notif = await getNotificationById(id);
      setEditingNotification(notif);
      setFormData({
        title: notif.title || '',
        content: notif.content || '',
        type: notif.type || 'general',
        target_type: notif.target_type || 'all',
        target_roles: notif.target_roles || [],
        target_schools: notif.target_schools || [],
        target_users: notif.target_users || [],
        image_url: notif.image_url || '',
        action_url: notif.action_url || '',
        scheduled_at: notif.scheduled_at ? notif.scheduled_at.split('T')[0] + 'T' + notif.scheduled_at.split('T')[1]?.substring(0, 5) : '',
      });
      setShowModal(true);
    } catch (error) {
      console.error('Error loading notification:', error);
    }
  };

  const viewNotification = async (id) => {
    try {
      const [notif, stats] = await Promise.all([
        getNotificationById(id),
        getNotificationStats(id)
      ]);
      setSelectedNotification(notif);
      setNotificationStats(stats);
      setShowDetailModal(true);
    } catch (error) {
      console.error('Error loading notification:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        created_by: user?.id,
        scheduled_at: formData.scheduled_at ? new Date(formData.scheduled_at).toISOString() : null,
      };

      if (editingNotification) {
        await updateNotification(editingNotification.id, data);
      } else {
        await createNotification(data);
      }

      setShowModal(false);
      loadData();
    } catch (error) {
      console.error('Error saving notification:', error);
      alert('Lỗi: ' + (error.message || 'Không thể lưu thông báo'));
    }
  };

  const handleSend = async (id) => {
    if (!confirm('Bạn có chắc muốn gửi thông báo này?')) return;
    try {
      setSending(true);
      const result = await sendNotification(id);
      alert(`Đã gửi thông báo đến ${result.sent} người dùng`);
      loadData();
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Lỗi: ' + (error.message || 'Không thể gửi thông báo'));
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa thông báo này?')) return;
    try {
      await deleteNotification(id);
      loadData();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getTypeIcon = (type) => {
    const typeInfo = NOTIFICATION_TYPES.find(t => t.id === type);
    return typeInfo?.icon || '📢';
  };

  const getTargetLabel = (notif) => {
    if (notif.target_type === 'all') return 'Tất cả';
    if (notif.target_type === 'role') return `${notif.target_roles?.length || 0} vai trò`;
    if (notif.target_type === 'school') return `${notif.target_schools?.length || 0} trường`;
    if (notif.target_type === 'user') return `${notif.target_users?.length || 0} người`;
    return 'N/A';
  };

  const toggleArrayItem = (array, item) => {
    if (array.includes(item)) {
      return array.filter(i => i !== item);
    }
    return [...array, item];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Hệ thống Thông báo</h1>
          <p className="text-gray-600">Gửi thông báo đến người dùng</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Tạo thông báo
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Tổng thông báo</p>
              <p className="text-xl font-bold">{stats?.totalNotifications || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Send className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Đã gửi</p>
              <p className="text-xl font-bold">{stats?.totalSent || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Chờ gửi</p>
              <p className="text-xl font-bold">{stats?.totalPending || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Tỷ lệ đọc</p>
              <p className="text-xl font-bold">{stats?.readRate || 0}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm tiêu đề, nội dung..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả loại</option>
            {NOTIFICATION_TYPES.map(t => (
              <option key={t.id} value={t.id}>{t.icon} {t.name}</option>
            ))}
          </select>
          <select
            value={sentFilter}
            onChange={(e) => setSentFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="sent">Đã gửi</option>
            <option value="pending">Chưa gửi</option>
          </select>
          <button
            onClick={loadData}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <RefreshCw className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.map((notif) => (
          <div key={notif.id} className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-start gap-4">
              <div className="text-2xl">{getTypeIcon(notif.type)}</div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-800 truncate">{notif.title}</h3>
                  {notif.is_sent ? (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      Đã gửi
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                      Nháp
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{notif.content}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {getTargetLabel(notif)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(notif.created_at).toLocaleDateString('vi-VN')}
                  </span>
                  {notif.creator && (
                    <span>Tạo bởi: {notif.creator.full_name}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!notif.is_sent && (
                  <button
                    onClick={() => handleSend(notif.id)}
                    disabled={sending}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Gửi ngay"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={() => viewNotification(notif.id)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Xem chi tiết"
                >
                  <Eye className="w-5 h-5" />
                </button>
                {!notif.is_sent && (
                  <button
                    onClick={() => openEditModal(notif.id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Sửa"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(notif.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Xóa"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredNotifications.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Chưa có thông báo nào</p>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">
                {editingNotification ? 'Sửa Thông báo' : 'Tạo Thông báo mới'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tiêu đề *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Tiêu đề thông báo"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nội dung *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Nội dung thông báo..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại thông báo
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {NOTIFICATION_TYPES.map(t => (
                      <option key={t.id} value={t.id}>{t.icon} {t.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Đối tượng nhận
                  </label>
                  <select
                    value={formData.target_type}
                    onChange={(e) => setFormData({
                      ...formData,
                      target_type: e.target.value,
                      target_roles: [],
                      target_schools: [],
                      target_users: [],
                    })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {TARGET_TYPES.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Target Selection */}
              {formData.target_type === 'role' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chọn vai trò
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {ROLES.map(role => (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => setFormData({
                          ...formData,
                          target_roles: toggleArrayItem(formData.target_roles, role.id)
                        })}
                        className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                          formData.target_roles.includes(role.id)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {role.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {formData.target_type === 'school' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chọn trường
                  </label>
                  <div className="max-h-40 overflow-y-auto border rounded-lg p-2 space-y-1">
                    {schools.map(school => (
                      <label key={school.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.target_schools.includes(school.id)}
                          onChange={() => setFormData({
                            ...formData,
                            target_schools: toggleArrayItem(formData.target_schools, school.id)
                          })}
                          className="w-4 h-4 rounded text-blue-600"
                        />
                        <span className="text-sm">{school.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {formData.target_type === 'user' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chọn người dùng
                  </label>
                  <div className="max-h-40 overflow-y-auto border rounded-lg p-2 space-y-1">
                    {users.map(u => (
                      <label key={u.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.target_users.includes(u.id)}
                          onChange={() => setFormData({
                            ...formData,
                            target_users: toggleArrayItem(formData.target_users, u.id)
                          })}
                          className="w-4 h-4 rounded text-blue-600"
                        />
                        <span className="text-sm">{u.full_name} ({u.email})</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hình ảnh (URL)
                  </label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link action (URL)
                  </label>
                  <input
                    type="url"
                    value={formData.action_url}
                    onChange={(e) => setFormData({ ...formData, action_url: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hẹn giờ gửi (tùy chọn)
                </label>
                <input
                  type="datetime-local"
                  value={formData.scheduled_at}
                  onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  {editingNotification ? 'Cập nhật' : 'Lưu nháp'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedNotification && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Chi tiết Thông báo</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{getTypeIcon(selectedNotification.type)}</span>
                <div>
                  <h4 className="font-semibold text-lg">{selectedNotification.title}</h4>
                  <p className="text-sm text-gray-500">
                    {NOTIFICATION_TYPES.find(t => t.id === selectedNotification.type)?.name}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-700 whitespace-pre-wrap">{selectedNotification.content}</p>
              </div>

              {selectedNotification.image_url && (
                <img
                  src={selectedNotification.image_url}
                  alt=""
                  className="w-full h-40 object-cover rounded-lg"
                />
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="text-gray-500">Đối tượng</label>
                  <p className="font-medium">{getTargetLabel(selectedNotification)}</p>
                </div>
                <div>
                  <label className="text-gray-500">Trạng thái</label>
                  <p className="font-medium">
                    {selectedNotification.is_sent ? 'Đã gửi' : 'Chưa gửi'}
                  </p>
                </div>
                <div>
                  <label className="text-gray-500">Ngày tạo</label>
                  <p>{new Date(selectedNotification.created_at).toLocaleString('vi-VN')}</p>
                </div>
                {selectedNotification.sent_at && (
                  <div>
                    <label className="text-gray-500">Ngày gửi</label>
                    <p>{new Date(selectedNotification.sent_at).toLocaleString('vi-VN')}</p>
                  </div>
                )}
              </div>

              {notificationStats && selectedNotification.is_sent && (
                <div className="pt-4 border-t">
                  <h5 className="font-medium mb-3">Thống kê</h5>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{notificationStats.total}</p>
                      <p className="text-xs text-gray-500">Đã gửi</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{notificationStats.read}</p>
                      <p className="text-xs text-gray-500">Đã đọc</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">{notificationStats.readRate}%</p>
                      <p className="text-xs text-gray-500">Tỷ lệ đọc</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
