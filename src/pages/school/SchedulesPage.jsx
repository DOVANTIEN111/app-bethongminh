// src/pages/school/SchedulesPage.jsx
// School Timetable/Schedule Management Page
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  Calendar, Clock, Plus, Edit, Trash2, Search,
  Loader2, X, BookOpen, GraduationCap, ChevronLeft, ChevronRight,
  Download, Copy, Check, Building2
} from 'lucide-react';

// Days of week
const DAYS = [
  { value: 1, label: 'Thứ 2' },
  { value: 2, label: 'Thứ 3' },
  { value: 3, label: 'Thứ 4' },
  { value: 4, label: 'Thứ 5' },
  { value: 5, label: 'Thứ 6' },
  { value: 6, label: 'Thứ 7' },
  { value: 0, label: 'Chủ nhật' },
];

// Time slots (periods)
const TIME_SLOTS = [
  { value: 1, label: 'Tiết 1', start: '07:00', end: '07:45' },
  { value: 2, label: 'Tiết 2', start: '07:50', end: '08:35' },
  { value: 3, label: 'Tiết 3', start: '08:55', end: '09:40' },
  { value: 4, label: 'Tiết 4', start: '09:45', end: '10:30' },
  { value: 5, label: 'Tiết 5', start: '10:35', end: '11:20' },
  { value: 6, label: 'Tiết 6', start: '13:30', end: '14:15' },
  { value: 7, label: 'Tiết 7', start: '14:20', end: '15:05' },
  { value: 8, label: 'Tiết 8', start: '15:20', end: '16:05' },
  { value: 9, label: 'Tiết 9', start: '16:10', end: '16:55' },
];

// Subject colors
const SUBJECT_COLORS = {
  'Toán': 'bg-blue-100 text-blue-700 border-blue-200',
  'Tiếng Việt': 'bg-green-100 text-green-700 border-green-200',
  'Tiếng Anh': 'bg-purple-100 text-purple-700 border-purple-200',
  'Khoa học': 'bg-orange-100 text-orange-700 border-orange-200',
  'Lịch sử': 'bg-amber-100 text-amber-700 border-amber-200',
  'Địa lý': 'bg-teal-100 text-teal-700 border-teal-200',
  'Thể dục': 'bg-red-100 text-red-700 border-red-200',
  'Âm nhạc': 'bg-pink-100 text-pink-700 border-pink-200',
  'Mỹ thuật': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  'default': 'bg-gray-100 text-gray-700 border-gray-200',
};

export default function SchedulesPage() {
  const { profile } = useAuth();
  const [schedules, setSchedules] = useState([]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selected class for viewing schedule
  const [selectedClass, setSelectedClass] = useState(null);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [formData, setFormData] = useState({
    class_id: '',
    day_of_week: 1,
    period: 1,
    subject: '',
    teacher_id: '',
    room: '',
  });
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, [profile?.school_id]);

  useEffect(() => {
    if (selectedClass) {
      loadClassSchedule(selectedClass.id);
    }
  }, [selectedClass]);

  const loadInitialData = async () => {
    if (!profile?.school_id) {
      setLoading(false);
      return;
    }

    try {
      const [classesRes, teachersRes] = await Promise.all([
        supabase
          .from('classes')
          .select('*, teacher:profiles!teacher_id(full_name)')
          .eq('school_id', profile.school_id)
          .order('name'),
        supabase
          .from('profiles')
          .select('id, full_name')
          .eq('school_id', profile.school_id)
          .eq('role', 'teacher')
          .eq('is_active', true)
          .order('full_name'),
      ]);

      setClasses(classesRes.data || []);
      setTeachers(teachersRes.data || []);

      // Set default selected class
      if (classesRes.data?.length > 0 && !selectedClass) {
        setSelectedClass(classesRes.data[0]);
      }

      // Load subjects from database or use defaults
      setSubjects([
        'Toán', 'Tiếng Việt', 'Tiếng Anh', 'Khoa học',
        'Lịch sử', 'Địa lý', 'Thể dục', 'Âm nhạc', 'Mỹ thuật',
        'Tin học', 'Đạo đức', 'Tự nhiên & Xã hội'
      ]);
    } catch (err) {
      console.error('Load initial data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadClassSchedule = async (classId) => {
    try {
      const { data, error } = await supabase
        .from('schedules')
        .select('*, teacher:profiles!teacher_id(full_name)')
        .eq('class_id', classId)
        .order('day_of_week')
        .order('period');

      if (error) throw error;
      setSchedules(data || []);
    } catch (err) {
      console.error('Load schedule error:', err);
    }
  };

  // Open modal for add/edit
  const handleOpenModal = (schedule = null, day = null, period = null) => {
    if (schedule) {
      setEditingSchedule(schedule);
      setFormData({
        class_id: schedule.class_id,
        day_of_week: schedule.day_of_week,
        period: schedule.period,
        subject: schedule.subject || '',
        teacher_id: schedule.teacher_id || '',
        room: schedule.room || '',
      });
    } else {
      setEditingSchedule(null);
      setFormData({
        class_id: selectedClass?.id || '',
        day_of_week: day !== null ? day : 1,
        period: period !== null ? period : 1,
        subject: '',
        teacher_id: '',
        room: '',
      });
    }
    setShowModal(true);
  };

  // Save schedule
  const handleSave = async () => {
    if (!formData.subject.trim() || !formData.class_id) {
      alert('Vui lòng chọn môn học');
      return;
    }

    setSaving(true);
    try {
      if (editingSchedule) {
        // Update
        const { error } = await supabase
          .from('schedules')
          .update({
            subject: formData.subject.trim(),
            teacher_id: formData.teacher_id || null,
            room: formData.room.trim() || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingSchedule.id);

        if (error) throw error;
      } else {
        // Check for existing schedule at same slot
        const { data: existing } = await supabase
          .from('schedules')
          .select('id')
          .eq('class_id', formData.class_id)
          .eq('day_of_week', formData.day_of_week)
          .eq('period', formData.period)
          .single();

        if (existing) {
          alert('Đã có tiết học tại khung giờ này');
          setSaving(false);
          return;
        }

        // Create new
        const { error } = await supabase
          .from('schedules')
          .insert({
            school_id: profile.school_id,
            class_id: formData.class_id,
            day_of_week: formData.day_of_week,
            period: formData.period,
            subject: formData.subject.trim(),
            teacher_id: formData.teacher_id || null,
            room: formData.room.trim() || null,
          });

        if (error) throw error;
      }

      setShowModal(false);
      if (selectedClass) {
        loadClassSchedule(selectedClass.id);
      }
    } catch (err) {
      console.error('Save schedule error:', err);
      alert('Có lỗi xảy ra: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Delete schedule
  const handleDelete = async (schedule) => {
    if (!confirm('Bạn có chắc muốn xóa tiết học này?')) return;

    try {
      const { error } = await supabase
        .from('schedules')
        .delete()
        .eq('id', schedule.id);

      if (error) throw error;

      if (selectedClass) {
        loadClassSchedule(selectedClass.id);
      }
    } catch (err) {
      console.error('Delete schedule error:', err);
      alert('Có lỗi xảy ra: ' + err.message);
    }
  };

  // Get schedule for a specific slot
  const getScheduleForSlot = (day, period) => {
    return schedules.find(s => s.day_of_week === day && s.period === period);
  };

  // Get color for subject
  const getSubjectColor = (subject) => {
    return SUBJECT_COLORS[subject] || SUBJECT_COLORS.default;
  };

  // Copy schedule to clipboard
  const handleCopySchedule = () => {
    if (!selectedClass) return;

    let text = `Thời khóa biểu: ${selectedClass.name}\n\n`;

    DAYS.filter(d => d.value !== 0).forEach(day => {
      text += `${day.label}:\n`;
      TIME_SLOTS.forEach(slot => {
        const schedule = getScheduleForSlot(day.value, slot.value);
        if (schedule) {
          text += `  ${slot.label} (${slot.start}-${slot.end}): ${schedule.subject}`;
          if (schedule.teacher?.full_name) {
            text += ` - GV: ${schedule.teacher.full_name}`;
          }
          text += '\n';
        }
      });
      text += '\n';
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="w-7 h-7 text-blue-600" />
            Thời khóa biểu
          </h1>
          <p className="text-gray-500 mt-1">Quản lý lịch học các lớp</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopySchedule}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200"
          >
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Đã sao chép' : 'Sao chép'}
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Thêm tiết học
          </button>
        </div>
      </div>

      {/* Class Selector */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center gap-4 overflow-x-auto pb-2">
          {classes.map(cls => (
            <button
              key={cls.id}
              onClick={() => setSelectedClass(cls)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${
                selectedClass?.id === cls.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              {cls.name}
            </button>
          ))}
          {classes.length === 0 && (
            <p className="text-gray-500">Chưa có lớp học nào</p>
          )}
        </div>
      </div>

      {/* Timetable Grid */}
      {selectedClass && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-blue-50">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              Thời khóa biểu: {selectedClass.name}
              {selectedClass.teacher?.full_name && (
                <span className="text-sm text-gray-500 font-normal">
                  (GVCN: {selectedClass.teacher.full_name})
                </span>
              )}
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left text-sm font-medium text-gray-600 w-24">
                    Tiết
                  </th>
                  {DAYS.filter(d => d.value !== 0).map(day => (
                    <th key={day.value} className="px-3 py-3 text-center text-sm font-medium text-gray-600 min-w-[120px]">
                      {day.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {TIME_SLOTS.map(slot => (
                  <tr key={slot.value} className="hover:bg-gray-50">
                    <td className="px-3 py-2 border-r border-gray-100">
                      <div className="font-medium text-gray-900">{slot.label}</div>
                      <div className="text-xs text-gray-500">{slot.start} - {slot.end}</div>
                    </td>
                    {DAYS.filter(d => d.value !== 0).map(day => {
                      const schedule = getScheduleForSlot(day.value, slot.value);
                      return (
                        <td key={day.value} className="px-2 py-2">
                          {schedule ? (
                            <div
                              className={`p-2 rounded-lg border cursor-pointer hover:shadow-md transition-shadow ${getSubjectColor(schedule.subject)}`}
                              onClick={() => handleOpenModal(schedule)}
                            >
                              <div className="font-medium text-sm">{schedule.subject}</div>
                              {schedule.teacher?.full_name && (
                                <div className="text-xs mt-1 flex items-center gap-1 opacity-80">
                                  <GraduationCap className="w-3 h-3" />
                                  {schedule.teacher.full_name}
                                </div>
                              )}
                              {schedule.room && (
                                <div className="text-xs mt-0.5 opacity-60">
                                  Phòng: {schedule.room}
                                </div>
                              )}
                            </div>
                          ) : (
                            <button
                              onClick={() => handleOpenModal(null, day.value, slot.value)}
                              className="w-full h-16 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-center"
                            >
                              <Plus className="w-5 h-5" />
                            </button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">
                {editingSchedule ? 'Sửa tiết học' : 'Thêm tiết học mới'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Class selector (only show when adding new) */}
              {!editingSchedule && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lớp học *
                  </label>
                  <select
                    value={formData.class_id}
                    onChange={(e) => setFormData({ ...formData, class_id: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Chọn lớp --</option>
                    {classes.map(cls => (
                      <option key={cls.id} value={cls.id}>{cls.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Day and Period */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày
                  </label>
                  <select
                    value={formData.day_of_week}
                    onChange={(e) => setFormData({ ...formData, day_of_week: parseInt(e.target.value) })}
                    disabled={!!editingSchedule}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  >
                    {DAYS.filter(d => d.value !== 0).map(day => (
                      <option key={day.value} value={day.value}>{day.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tiết học
                  </label>
                  <select
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: parseInt(e.target.value) })}
                    disabled={!!editingSchedule}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  >
                    {TIME_SLOTS.map(slot => (
                      <option key={slot.value} value={slot.value}>
                        {slot.label} ({slot.start})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Môn học *
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Chọn môn học --</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              {/* Teacher */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giáo viên
                </label>
                <select
                  value={formData.teacher_id}
                  onChange={(e) => setFormData({ ...formData, teacher_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Chọn giáo viên --</option>
                  {teachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>{teacher.full_name}</option>
                  ))}
                </select>
              </div>

              {/* Room */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phòng học
                </label>
                <input
                  type="text"
                  value={formData.room}
                  onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                  placeholder="VD: Phòng 101"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                {editingSchedule && (
                  <button
                    onClick={() => {
                      handleDelete(editingSchedule);
                      setShowModal(false);
                    }}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !formData.subject.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50"
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
