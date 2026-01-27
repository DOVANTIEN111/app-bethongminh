// src/components/school/dashboard/EventsCalendar.jsx
// Lịch sự kiện tuần này
import React, { useState } from 'react';
import { Calendar, Plus, Clock, MapPin, X, Loader2 } from 'lucide-react';
import { createEvent } from '../../../services/schoolDashboardService';

const EVENT_TYPES = {
  meeting: { label: 'Họp', icon: '👥', color: 'bg-blue-100 text-blue-700' },
  exam: { label: 'Kiểm tra', icon: '📝', color: 'bg-red-100 text-red-700' },
  holiday: { label: 'Nghỉ lễ', icon: '🎉', color: 'bg-green-100 text-green-700' },
  deadline: { label: 'Deadline', icon: '⏰', color: 'bg-orange-100 text-orange-700' },
  activity: { label: 'Hoạt động', icon: '🎯', color: 'bg-purple-100 text-purple-700' },
  other: { label: 'Khác', icon: '📌', color: 'bg-gray-100 text-gray-700' },
};

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return 'Hôm nay';
  if (date.toDateString() === tomorrow.toDateString()) return 'Ngày mai';

  return date.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' });
}

function AddEventModal({ isOpen, onClose, onAdd, schoolId, userId }) {
  const [form, setForm] = useState({
    title: '',
    event_date: new Date().toISOString().split('T')[0],
    event_time: '08:00',
    event_type: 'meeting',
    description: '',
    location: '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    setSaving(true);
    try {
      await createEvent({
        ...form,
        school_id: schoolId,
        created_by: userId,
      });
      onAdd();
      onClose();
      setForm({
        title: '',
        event_date: new Date().toISOString().split('T')[0],
        event_time: '08:00',
        event_type: 'meeting',
        description: '',
        location: '',
      });
    } catch (err) {
      console.error('Create event error:', err);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Thêm sự kiện mới</h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập tiêu đề sự kiện"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngày</label>
              <input
                type="date"
                value={form.event_date}
                onChange={(e) => setForm({ ...form, event_date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Giờ</label>
              <input
                type="time"
                value={form.event_time}
                onChange={(e) => setForm({ ...form, event_time: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Loại sự kiện</label>
            <select
              value={form.event_type}
              onChange={(e) => setForm({ ...form, event_type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(EVENT_TYPES).map(([key, { label, icon }]) => (
                <option key={key} value={key}>{icon} {label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Địa điểm</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập địa điểm (tùy chọn)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
              placeholder="Mô tả chi tiết (tùy chọn)"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Thêm sự kiện
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EventsCalendar({ events, loading, onRefresh, schoolId, userId }) {
  const [showAddModal, setShowAddModal] = useState(false);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <div className="h-6 bg-gray-200 rounded w-48 animate-pulse" />
        </div>
        <div className="p-4 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // Group events by date
  const eventsByDate = {};
  events?.forEach(event => {
    const dateKey = event.event_date;
    if (!eventsByDate[dateKey]) eventsByDate[dateKey] = [];
    eventsByDate[dateKey].push(event);
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Lịch tuần này</h3>
              <p className="text-sm text-gray-500">{events?.length || 0} sự kiện</p>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Thêm sự kiện
          </button>
        </div>
      </div>

      {/* Events list */}
      <div className="max-h-[350px] overflow-y-auto">
        {events && events.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {events.map((event) => {
              const typeConfig = EVENT_TYPES[event.event_type] || EVENT_TYPES.other;

              return (
                <div key={event.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3">
                    {/* Date */}
                    <div className="text-center min-w-[50px]">
                      <p className="text-xs text-gray-500">{formatDate(event.event_date)}</p>
                      {event.event_time && (
                        <p className="text-sm font-medium text-gray-900">
                          {event.event_time.substring(0, 5)}
                        </p>
                      )}
                    </div>

                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${typeConfig.color}`}>
                      {typeConfig.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">{event.title}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span className={`px-2 py-0.5 rounded ${typeConfig.color}`}>
                          {typeConfig.label}
                        </span>
                        {event.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {event.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">Không có sự kiện nào trong tuần</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              + Thêm sự kiện mới
            </button>
          </div>
        )}
      </div>

      {/* Add Event Modal */}
      <AddEventModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={onRefresh}
        schoolId={schoolId}
        userId={userId}
      />
    </div>
  );
}
