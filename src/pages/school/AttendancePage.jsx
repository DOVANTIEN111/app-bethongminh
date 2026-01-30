// src/pages/school/AttendancePage.jsx
// Teacher Attendance Tracking Page
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  Calendar, UserCheck, UserX, Clock, Search, Filter,
  Loader2, ChevronLeft, ChevronRight, Download, RefreshCw,
  Check, X, AlertCircle, Building2
} from 'lucide-react';

// Attendance status options
const ATTENDANCE_STATUS = {
  present: { label: 'Có mặt', color: 'green', icon: UserCheck },
  absent: { label: 'Vắng mặt', color: 'red', icon: UserX },
  late: { label: 'Đi trễ', color: 'yellow', icon: Clock },
  leave: { label: 'Nghỉ phép', color: 'blue', icon: Calendar },
};

// Format date for display
function formatDateVN(date) {
  return new Date(date).toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Get week dates
function getWeekDates(date) {
  const start = new Date(date);
  const day = start.getDay();
  const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Monday
  start.setDate(diff);

  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    dates.push(d);
  }
  return dates;
}

export default function AttendancePage() {
  const { profile } = useAuth();
  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Filters
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('day'); // 'day' or 'week'
  const [filterDepartment, setFilterDepartment] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const weekDates = getWeekDates(currentDate);
  const dateStr = currentDate.toISOString().split('T')[0];

  useEffect(() => {
    loadData();
  }, [profile?.school_id, currentDate, viewMode]);

  const loadData = async () => {
    if (!profile?.school_id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Load teachers and departments
      const [teachersRes, deptsRes] = await Promise.all([
        supabase
          .from('profiles')
          .select('id, full_name, email, avatar_url, department_id, department:departments(name)')
          .eq('school_id', profile.school_id)
          .eq('role', 'teacher')
          .eq('is_active', true)
          .order('full_name'),
        supabase
          .from('departments')
          .select('id, name')
          .eq('school_id', profile.school_id)
          .order('name'),
      ]);

      setTeachers(teachersRes.data || []);
      setDepartments(deptsRes.data || []);

      // Load attendance for current date/week
      let startDate, endDate;
      if (viewMode === 'week') {
        startDate = weekDates[0].toISOString().split('T')[0];
        endDate = weekDates[6].toISOString().split('T')[0];
      } else {
        startDate = dateStr;
        endDate = dateStr;
      }

      const { data: attendanceData } = await supabase
        .from('teacher_attendance')
        .select('*')
        .eq('school_id', profile.school_id)
        .gte('date', startDate)
        .lte('date', endDate);

      // Build attendance map
      const attendanceMap = {};
      (attendanceData || []).forEach(record => {
        const key = `${record.teacher_id}_${record.date}`;
        attendanceMap[key] = record;
      });
      setAttendance(attendanceMap);
    } catch (err) {
      console.error('Load attendance error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Mark attendance
  const handleMarkAttendance = async (teacherId, date, status) => {
    const dateKey = date.toISOString().split('T')[0];
    const key = `${teacherId}_${dateKey}`;

    setSaving(true);
    try {
      const existingRecord = attendance[key];

      if (existingRecord) {
        // Update existing record
        const { error } = await supabase
          .from('teacher_attendance')
          .update({
            status,
            marked_by: profile.id,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingRecord.id);

        if (error) throw error;
      } else {
        // Create new record
        const { data, error } = await supabase
          .from('teacher_attendance')
          .insert({
            school_id: profile.school_id,
            teacher_id: teacherId,
            date: dateKey,
            status,
            marked_by: profile.id,
          })
          .select()
          .single();

        if (error) throw error;

        setAttendance(prev => ({
          ...prev,
          [key]: data
        }));
        return;
      }

      // Update local state
      setAttendance(prev => ({
        ...prev,
        [key]: { ...prev[key], status }
      }));
    } catch (err) {
      console.error('Mark attendance error:', err);
      alert('Có lỗi xảy ra: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Navigate dates
  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Filter teachers
  const filteredTeachers = teachers.filter(t => {
    const matchSearch = !searchQuery ||
      t.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDept = !filterDepartment || t.department_id === filterDepartment;
    return matchSearch && matchDept;
  });

  // Calculate stats
  const getStats = () => {
    let present = 0, absent = 0, late = 0, leave = 0, unmarked = 0;

    filteredTeachers.forEach(teacher => {
      const key = `${teacher.id}_${dateStr}`;
      const record = attendance[key];
      if (!record) {
        unmarked++;
      } else {
        switch (record.status) {
          case 'present': present++; break;
          case 'absent': absent++; break;
          case 'late': late++; break;
          case 'leave': leave++; break;
          default: unmarked++;
        }
      }
    });

    return { present, absent, late, leave, unmarked, total: filteredTeachers.length };
  };

  const stats = getStats();

  // Export to Excel
  const handleExport = () => {
    // Build CSV data
    let csv = 'Họ tên,Email,Bộ phận,Ngày,Trạng thái\n';

    filteredTeachers.forEach(teacher => {
      const dates = viewMode === 'week' ? weekDates : [currentDate];
      dates.forEach(date => {
        const key = `${teacher.id}_${date.toISOString().split('T')[0]}`;
        const record = attendance[key];
        const status = record ? ATTENDANCE_STATUS[record.status]?.label : 'Chưa điểm danh';
        csv += `"${teacher.full_name}","${teacher.email}","${teacher.department?.name || ''}","${date.toLocaleDateString('vi-VN')}","${status}"\n`;
      });
    });

    // Download
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `diem-danh-giao-vien-${dateStr}.csv`;
    link.click();
    URL.revokeObjectURL(url);
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
            Điểm danh Giáo viên
          </h1>
          <p className="text-gray-500 mt-1">{formatDateVN(currentDate)}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700"
          >
            <Download className="w-4 h-4" />
            Xuất Excel
          </button>
          <button
            onClick={loadData}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-500">
          <p className="text-gray-500 text-sm">Có mặt</p>
          <p className="text-2xl font-bold text-green-600">{stats.present}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-red-500">
          <p className="text-gray-500 text-sm">Vắng mặt</p>
          <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-yellow-500">
          <p className="text-gray-500 text-sm">Đi trễ</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.late}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-blue-500">
          <p className="text-gray-500 text-sm">Nghỉ phép</p>
          <p className="text-2xl font-bold text-blue-600">{stats.leave}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-gray-400">
          <p className="text-gray-500 text-sm">Chưa điểm danh</p>
          <p className="text-2xl font-bold text-gray-600">{stats.unmarked}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Date Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={goToPrevious}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToToday}
              className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-200"
            >
              Hôm nay
            </button>
            <button
              onClick={goToNext}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* View Mode */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1 rounded-md text-sm ${viewMode === 'day' ? 'bg-white shadow text-blue-600' : 'text-gray-600'}`}
            >
              Ngày
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 rounded-md text-sm ${viewMode === 'week' ? 'bg-white shadow text-blue-600' : 'text-gray-600'}`}
            >
              Tuần
            </button>
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm giáo viên..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Department Filter */}
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả bộ phận</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 sticky left-0 bg-gray-50">
                  Giáo viên
                </th>
                {viewMode === 'week' ? (
                  weekDates.map((date, idx) => (
                    <th key={idx} className="px-2 py-3 text-center text-sm font-medium text-gray-600 min-w-[100px]">
                      <div>{['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][date.getDay()]}</div>
                      <div className="text-xs text-gray-400">{date.getDate()}/{date.getMonth() + 1}</div>
                    </th>
                  ))
                ) : (
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                    Trạng thái
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTeachers.map(teacher => (
                <tr key={teacher.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 sticky left-0 bg-white">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        {teacher.avatar_url ? (
                          <img src={teacher.avatar_url} alt="" className="w-10 h-10 rounded-full" />
                        ) : (
                          <span className="text-lg">👨‍🏫</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">{teacher.full_name}</p>
                        {teacher.department?.name && (
                          <p className="text-xs text-gray-500 truncate">{teacher.department.name}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  {viewMode === 'week' ? (
                    weekDates.map((date, idx) => {
                      const key = `${teacher.id}_${date.toISOString().split('T')[0]}`;
                      const record = attendance[key];
                      const status = record?.status;
                      return (
                        <td key={idx} className="px-2 py-3 text-center">
                          <div className="flex justify-center gap-1">
                            {Object.entries(ATTENDANCE_STATUS).map(([key, config]) => {
                              const isActive = status === key;
                              return (
                                <button
                                  key={key}
                                  onClick={() => handleMarkAttendance(teacher.id, date, key)}
                                  disabled={saving}
                                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                                    isActive
                                      ? `bg-${config.color}-500 text-white`
                                      : `bg-gray-100 text-gray-400 hover:bg-${config.color}-100 hover:text-${config.color}-600`
                                  }`}
                                  title={config.label}
                                >
                                  <config.icon className="w-4 h-4" />
                                </button>
                              );
                            })}
                          </div>
                        </td>
                      );
                    })
                  ) : (
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        {Object.entries(ATTENDANCE_STATUS).map(([key, config]) => {
                          const recordKey = `${teacher.id}_${dateStr}`;
                          const record = attendance[recordKey];
                          const isActive = record?.status === key;
                          return (
                            <button
                              key={key}
                              onClick={() => handleMarkAttendance(teacher.id, currentDate, key)}
                              disabled={saving}
                              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                                isActive
                                  ? `bg-${config.color}-500 text-white`
                                  : `bg-gray-100 text-gray-600 hover:bg-${config.color}-100 hover:text-${config.color}-600`
                              }`}
                            >
                              <config.icon className="w-4 h-4" />
                              <span className="text-sm">{config.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {filteredTeachers.length === 0 && (
                <tr>
                  <td colSpan={viewMode === 'week' ? 8 : 2} className="px-4 py-12 text-center text-gray-500">
                    <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Không tìm thấy giáo viên nào</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
