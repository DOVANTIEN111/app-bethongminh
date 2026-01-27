// src/services/schoolDashboardService.js
// Service cho School Dashboard - Lấy dữ liệu thực từ database

import { supabase } from '../lib/supabase';

// =============================================
// THONG KE TONG QUAN
// =============================================

/**
 * Lấy thống kê tổng quan cho dashboard
 */
export async function getDashboardStats(schoolId, date = new Date()) {
  const dateStr = date.toISOString().split('T')[0];

  // Gọi function trong database
  const { data, error } = await supabase.rpc('get_school_dashboard_stats', {
    p_school_id: schoolId,
    p_date: dateStr,
  });

  if (error) {
    console.error('getDashboardStats error:', error);
    // Fallback: Query trực tiếp
    return await getDashboardStatsFallback(schoolId, dateStr);
  }

  return data;
}

/**
 * Fallback khi function chưa được tạo
 */
async function getDashboardStatsFallback(schoolId, dateStr) {
  try {
    const [
      { count: totalTeachers },
      { count: totalStudents },
      { count: totalClasses },
      { count: presentTeachers },
      { count: presentStudents },
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true })
        .eq('school_id', schoolId).eq('role', 'teacher').eq('is_active', true),
      supabase.from('profiles').select('*', { count: 'exact', head: true })
        .eq('school_id', schoolId).eq('role', 'student').eq('is_active', true),
      supabase.from('classes').select('*', { count: 'exact', head: true })
        .eq('school_id', schoolId).eq('is_active', true),
      supabase.from('teacher_attendance').select('*', { count: 'exact', head: true })
        .eq('school_id', schoolId).eq('date', dateStr).in('status', ['present', 'late']),
      supabase.from('student_attendance').select('*', { count: 'exact', head: true })
        .eq('school_id', schoolId).eq('date', dateStr).in('status', ['present', 'late']),
    ]);

    // Đếm bài học hoàn thành hôm nay
    const { count: lessonsToday } = await supabase
      .from('student_progress')
      .select('*, profiles!inner(school_id)', { count: 'exact', head: true })
      .eq('profiles.school_id', schoolId)
      .gte('completed_at', `${dateStr}T00:00:00`)
      .lt('completed_at', `${dateStr}T23:59:59`);

    return {
      total_teachers: totalTeachers || 0,
      present_teachers: presentTeachers || 0,
      total_students: totalStudents || 0,
      present_students: presentStudents || 0,
      total_classes: totalClasses || 0,
      lessons_today: lessonsToday || 0,
    };
  } catch (err) {
    console.error('getDashboardStatsFallback error:', err);
    return {
      total_teachers: 0,
      present_teachers: 0,
      total_students: 0,
      present_students: 0,
      total_classes: 0,
      lessons_today: 0,
    };
  }
}

// =============================================
// CANH BAO
// =============================================

/**
 * Lấy danh sách cảnh báo
 */
export async function getAlerts(schoolId, date = new Date()) {
  const dateStr = date.toISOString().split('T')[0];

  const { data, error } = await supabase.rpc('get_school_alerts', {
    p_school_id: schoolId,
    p_date: dateStr,
  });

  if (error) {
    console.error('getAlerts error:', error);
    return await getAlertsFallback(schoolId, dateStr);
  }

  return data || [];
}

/**
 * Fallback lấy cảnh báo
 */
async function getAlertsFallback(schoolId, dateStr) {
  const alerts = [];

  try {
    // GV chưa chấm công
    const { data: teachers } = await supabase
      .from('profiles')
      .select('id, full_name')
      .eq('school_id', schoolId)
      .eq('role', 'teacher')
      .eq('is_active', true);

    if (teachers) {
      const { data: checkedIn } = await supabase
        .from('teacher_attendance')
        .select('teacher_id')
        .eq('school_id', schoolId)
        .eq('date', dateStr)
        .in('status', ['present', 'late']);

      const checkedInIds = new Set(checkedIn?.map(t => t.teacher_id) || []);
      const notCheckedIn = teachers.filter(t => !checkedInIds.has(t.id));

      if (notCheckedIn.length > 0) {
        alerts.push({
          type: 'teacher_no_checkin',
          severity: 'high',
          message: `${notCheckedIn.length} giáo viên chưa chấm công`,
          details: notCheckedIn.slice(0, 5).map(t => t.full_name),
          count: notCheckedIn.length,
        });
      }
    }

    // HS nghỉ không phép
    const { count: absentCount } = await supabase
      .from('student_attendance')
      .select('*', { count: 'exact', head: true })
      .eq('school_id', schoolId)
      .eq('date', dateStr)
      .eq('status', 'absent_unexcused');

    if (absentCount > 0) {
      alerts.push({
        type: 'student_absent_unexcused',
        severity: 'medium',
        message: `${absentCount} học sinh nghỉ không phép hôm nay`,
        count: absentCount,
      });
    }

    // Lớp chưa có GVCN
    const { count: noTeacherCount } = await supabase
      .from('classes')
      .select('*', { count: 'exact', head: true })
      .eq('school_id', schoolId)
      .eq('is_active', true)
      .is('teacher_id', null);

    if (noTeacherCount > 0) {
      alerts.push({
        type: 'class_no_teacher',
        severity: 'low',
        message: `${noTeacherCount} lớp chưa có giáo viên chủ nhiệm`,
        count: noTeacherCount,
      });
    }

    // Bài tập quá hạn chưa chấm
    const { count: ungradedCount } = await supabase
      .from('student_assignments')
      .select('*, assignments!inner(school_id, deadline)', { count: 'exact', head: true })
      .eq('assignments.school_id', schoolId)
      .lt('assignments.deadline', new Date().toISOString())
      .eq('status', 'submitted')
      .is('graded_at', null);

    if (ungradedCount > 0) {
      alerts.push({
        type: 'ungraded_assignments',
        severity: 'medium',
        message: `${ungradedCount} bài tập quá hạn chưa chấm điểm`,
        count: ungradedCount,
      });
    }
  } catch (err) {
    console.error('getAlertsFallback error:', err);
  }

  return alerts;
}

// =============================================
// HOAT DONG GAN DAY
// =============================================

/**
 * Lấy hoạt động gần đây
 */
export async function getRecentActivities(schoolId, limit = 20) {
  const { data, error } = await supabase
    .from('activity_log')
    .select(`
      *,
      profiles:user_id (id, full_name, avatar)
    `)
    .eq('school_id', schoolId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('getRecentActivities error:', error);
    return [];
  }

  return data || [];
}

/**
 * Subscribe realtime activities
 */
export function subscribeToActivities(schoolId, callback) {
  const subscription = supabase
    .channel(`school_activities_${schoolId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'activity_log',
        filter: `school_id=eq.${schoolId}`,
      },
      (payload) => {
        callback(payload.new);
      }
    )
    .subscribe();

  return subscription;
}

// =============================================
// BIEU DO
// =============================================

/**
 * Lấy điểm TB theo lớp
 */
export async function getClassAverageScores(schoolId) {
  const { data, error } = await supabase.rpc('get_class_average_scores', {
    p_school_id: schoolId,
  });

  if (error) {
    console.error('getClassAverageScores error:', error);
    return await getClassAverageScoresFallback(schoolId);
  }

  return data || [];
}

async function getClassAverageScoresFallback(schoolId) {
  try {
    const { data: classes } = await supabase
      .from('classes')
      .select('id, name')
      .eq('school_id', schoolId)
      .eq('is_active', true)
      .order('name');

    if (!classes) return [];

    const results = [];
    for (const cls of classes) {
      // Đếm học sinh
      const { count: studentCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('class_id', cls.id)
        .eq('role', 'student')
        .eq('is_active', true);

      // Lấy điểm TB
      const { data: scores } = await supabase
        .from('student_progress')
        .select('score, profiles!inner(class_id)')
        .eq('profiles.class_id', cls.id);

      const avgScore = scores && scores.length > 0
        ? scores.reduce((sum, s) => sum + s.score, 0) / scores.length
        : 0;

      results.push({
        class_id: cls.id,
        class_name: cls.name,
        student_count: studentCount || 0,
        avg_score: Math.round(avgScore * 100) / 100,
      });
    }

    return results;
  } catch (err) {
    console.error('getClassAverageScoresFallback error:', err);
    return [];
  }
}

/**
 * Lấy thống kê chuyên cần
 */
export async function getAttendanceStats(schoolId, startDate, endDate) {
  const { data, error } = await supabase.rpc('get_attendance_stats', {
    p_school_id: schoolId,
    p_start_date: startDate.toISOString().split('T')[0],
    p_end_date: endDate.toISOString().split('T')[0],
  });

  if (error) {
    console.error('getAttendanceStats error:', error);
    return await getAttendanceStatsFallback(schoolId, startDate, endDate);
  }

  return data;
}

async function getAttendanceStatsFallback(schoolId, startDate, endDate) {
  try {
    const { data } = await supabase
      .from('student_attendance')
      .select('status')
      .eq('school_id', schoolId)
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0]);

    if (!data) return { present: 0, late: 0, absent_excused: 0, absent_unexcused: 0, total: 0 };

    return {
      present: data.filter(d => d.status === 'present').length,
      late: data.filter(d => d.status === 'late').length,
      absent_excused: data.filter(d => d.status === 'absent_excused').length,
      absent_unexcused: data.filter(d => d.status === 'absent_unexcused').length,
      total: data.length,
    };
  } catch (err) {
    console.error('getAttendanceStatsFallback error:', err);
    return { present: 0, late: 0, absent_excused: 0, absent_unexcused: 0, total: 0 };
  }
}

/**
 * Lấy xu hướng học tập 30 ngày
 */
export async function getLearningTrend(schoolId, days = 30) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  try {
    // Lấy số bài học hoàn thành theo ngày
    const { data: progressData } = await supabase
      .from('student_progress')
      .select('completed_at, score, profiles!inner(school_id)')
      .eq('profiles.school_id', schoolId)
      .gte('completed_at', startDate.toISOString())
      .lte('completed_at', endDate.toISOString());

    // Group theo ngày
    const dailyStats = {};
    const dateList = [];

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      dateList.push(dateStr);
      dailyStats[dateStr] = { lessons: 0, totalScore: 0, count: 0 };
    }

    progressData?.forEach(p => {
      const dateStr = p.completed_at.split('T')[0];
      if (dailyStats[dateStr]) {
        dailyStats[dateStr].lessons++;
        dailyStats[dateStr].totalScore += p.score;
        dailyStats[dateStr].count++;
      }
    });

    return dateList.map(date => ({
      date,
      lessons: dailyStats[date].lessons,
      avgScore: dailyStats[date].count > 0
        ? Math.round(dailyStats[date].totalScore / dailyStats[date].count)
        : 0,
    }));
  } catch (err) {
    console.error('getLearningTrend error:', err);
    return [];
  }
}

// =============================================
// BANG XEP HANG
// =============================================

/**
 * Lấy top học sinh xuất sắc
 */
export async function getTopStudents(schoolId, limit = 10) {
  const { data, error } = await supabase.rpc('get_top_students', {
    p_school_id: schoolId,
    p_limit: limit,
  });

  if (error) {
    console.error('getTopStudents error:', error);
    return await getTopStudentsFallback(schoolId, limit);
  }

  return data || [];
}

async function getTopStudentsFallback(schoolId, limit) {
  try {
    // Query đơn giản hơn
    const { data: students } = await supabase
      .from('profiles')
      .select(`
        id, full_name,
        classes (name)
      `)
      .eq('school_id', schoolId)
      .eq('role', 'student')
      .eq('is_active', true)
      .limit(50);

    if (!students) return [];

    // Lấy điểm cho từng học sinh
    const results = [];
    for (const student of students) {
      const { data: progress } = await supabase
        .from('student_progress')
        .select('score')
        .eq('student_id', student.id);

      if (progress && progress.length >= 5) {
        const avgScore = progress.reduce((sum, p) => sum + p.score, 0) / progress.length;
        results.push({
          student_id: student.id,
          full_name: student.full_name,
          class_name: student.classes?.name || '',
          avg_score: Math.round(avgScore * 100) / 100,
          total_lessons: progress.length,
        });
      }
    }

    return results
      .sort((a, b) => b.avg_score - a.avg_score || b.total_lessons - a.total_lessons)
      .slice(0, limit);
  } catch (err) {
    console.error('getTopStudentsFallback error:', err);
    return [];
  }
}

/**
 * Lấy top giáo viên tích cực
 */
export async function getTopTeachers(schoolId, limit = 5) {
  const { data, error } = await supabase.rpc('get_top_teachers', {
    p_school_id: schoolId,
    p_limit: limit,
  });

  if (error) {
    console.error('getTopTeachers error:', error);
    return await getTopTeachersFallback(schoolId, limit);
  }

  return data || [];
}

async function getTopTeachersFallback(schoolId, limit) {
  try {
    const { data: teachers } = await supabase
      .from('profiles')
      .select(`
        id, full_name,
        departments (name)
      `)
      .eq('school_id', schoolId)
      .eq('role', 'teacher')
      .eq('is_active', true);

    if (!teachers) return [];

    const results = [];
    for (const teacher of teachers) {
      // Đếm assignments
      const { count: assignmentCount } = await supabase
        .from('assignments')
        .select('*', { count: 'exact', head: true })
        .eq('teacher_id', teacher.id);

      // Đếm học sinh qua assignments
      const { count: studentCount } = await supabase
        .from('student_assignments')
        .select('*, assignments!inner(teacher_id)', { count: 'exact', head: true })
        .eq('assignments.teacher_id', teacher.id);

      results.push({
        teacher_id: teacher.id,
        full_name: teacher.full_name,
        department_name: teacher.departments?.name || '',
        total_assignments: assignmentCount || 0,
        total_students: studentCount || 0,
      });
    }

    return results
      .sort((a, b) => b.total_assignments - a.total_assignments)
      .slice(0, limit);
  } catch (err) {
    console.error('getTopTeachersFallback error:', err);
    return [];
  }
}

// =============================================
// SU KIEN
// =============================================

/**
 * Lấy sự kiện sắp tới
 */
export async function getUpcomingEvents(schoolId, days = 7) {
  const today = new Date().toISOString().split('T')[0];
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + days);

  const { data, error } = await supabase
    .from('school_events')
    .select('*')
    .eq('school_id', schoolId)
    .gte('event_date', today)
    .lte('event_date', endDate.toISOString().split('T')[0])
    .order('event_date', { ascending: true });

  if (error) {
    console.error('getUpcomingEvents error:', error);
    return [];
  }

  return data || [];
}

/**
 * Tạo sự kiện mới
 */
export async function createEvent(eventData) {
  const { data, error } = await supabase
    .from('school_events')
    .insert(eventData)
    .select()
    .single();

  if (error) {
    console.error('createEvent error:', error);
    throw error;
  }

  return data;
}

/**
 * Xóa sự kiện
 */
export async function deleteEvent(eventId) {
  const { error } = await supabase
    .from('school_events')
    .delete()
    .eq('id', eventId);

  if (error) {
    console.error('deleteEvent error:', error);
    throw error;
  }
}

// =============================================
// CHAM CONG
// =============================================

/**
 * Chấm công giáo viên
 */
export async function checkInTeacher(teacherId, schoolId) {
  const today = new Date().toISOString().split('T')[0];
  const now = new Date().toTimeString().split(' ')[0];

  // Kiểm tra đã chấm công chưa
  const { data: existing } = await supabase
    .from('teacher_attendance')
    .select('id')
    .eq('teacher_id', teacherId)
    .eq('date', today)
    .single();

  if (existing) {
    // Cập nhật
    const { data, error } = await supabase
      .from('teacher_attendance')
      .update({
        check_in_time: now,
        status: now > '08:00:00' ? 'late' : 'present',
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } else {
    // Tạo mới
    const { data, error } = await supabase
      .from('teacher_attendance')
      .insert({
        teacher_id: teacherId,
        school_id: schoolId,
        date: today,
        check_in_time: now,
        status: now > '08:00:00' ? 'late' : 'present',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

/**
 * Điểm danh học sinh
 */
export async function markStudentAttendance(studentId, classId, schoolId, status, recordedBy, note = '') {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('student_attendance')
    .upsert({
      student_id: studentId,
      class_id: classId,
      school_id: schoolId,
      date: today,
      status,
      note,
      recorded_by: recordedBy,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'student_id,date',
    })
    .select()
    .single();

  if (error) {
    console.error('markStudentAttendance error:', error);
    throw error;
  }

  return data;
}

/**
 * Lấy danh sách điểm danh lớp
 */
export async function getClassAttendance(classId, date) {
  const dateStr = date.toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('student_attendance')
    .select(`
      *,
      profiles:student_id (id, full_name, avatar)
    `)
    .eq('class_id', classId)
    .eq('date', dateStr);

  if (error) {
    console.error('getClassAttendance error:', error);
    return [];
  }

  return data || [];
}

// =============================================
// SPARKLINE DATA
// =============================================

/**
 * Lấy dữ liệu sparkline 7 ngày
 */
export async function getSparklineData(schoolId, type = 'teacher') {
  const data = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    if (type === 'teacher') {
      const { count } = await supabase
        .from('teacher_attendance')
        .select('*', { count: 'exact', head: true })
        .eq('school_id', schoolId)
        .eq('date', dateStr)
        .in('status', ['present', 'late']);
      data.push(count || 0);
    } else {
      const { count } = await supabase
        .from('student_attendance')
        .select('*', { count: 'exact', head: true })
        .eq('school_id', schoolId)
        .eq('date', dateStr)
        .in('status', ['present', 'late']);
      data.push(count || 0);
    }
  }

  return data;
}
