// src/services/studentProgress.js
// Service to manage student learning progress
import { supabase } from '../lib/supabase';
import { ENGLISH_TOPICS, getAllTopics } from '../data/englishVocab';

// ============================================
// PROGRESS TRACKING
// ============================================

// Get student progress from database or localStorage
export async function getStudentProgress(studentId) {
  if (!studentId) {
    // Return from localStorage for anonymous users
    const localProgress = localStorage.getItem('student_progress');
    return localProgress ? JSON.parse(localProgress) : {};
  }

  try {
    const { data, error } = await supabase
      .from('student_progress')
      .select('*')
      .eq('student_id', studentId);

    if (error) throw error;

    // Convert array to object keyed by lesson_id
    const progress = {};
    (data || []).forEach(item => {
      progress[item.lesson_id] = item;
    });
    return progress;
  } catch (err) {
    console.error('Error fetching progress:', err);
    // Fallback to localStorage
    const localProgress = localStorage.getItem('student_progress');
    return localProgress ? JSON.parse(localProgress) : {};
  }
}

// Save lesson progress
export async function saveLessonProgress(studentId, lessonId, data) {
  const progressData = {
    student_id: studentId,
    lesson_id: lessonId,
    score: data.score || 0,
    status: data.status || 'completed',
    time_spent: data.timeSpent || 0,
    completed_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (!studentId) {
    // Save to localStorage for anonymous users
    const localProgress = JSON.parse(localStorage.getItem('student_progress') || '{}');
    localProgress[lessonId] = progressData;
    localStorage.setItem('student_progress', JSON.stringify(localProgress));
    return progressData;
  }

  try {
    // Upsert to database
    const { data: result, error } = await supabase
      .from('student_progress')
      .upsert(progressData, {
        onConflict: 'student_id,lesson_id'
      })
      .select()
      .single();

    if (error) throw error;
    return result;
  } catch (err) {
    console.error('Error saving progress:', err);
    // Fallback to localStorage
    const localProgress = JSON.parse(localStorage.getItem('student_progress') || '{}');
    localProgress[lessonId] = progressData;
    localStorage.setItem('student_progress', JSON.stringify(localProgress));
    return progressData;
  }
}

// ============================================
// STATISTICS
// ============================================

// Calculate total points
export function calculateTotalPoints(progress) {
  return Object.values(progress).reduce((sum, p) => sum + (p.score || 0), 0);
}

// Calculate completed lessons count
export function getCompletedLessonsCount(progress) {
  return Object.values(progress).filter(p => p.status === 'completed').length;
}

// Calculate total learning time (in minutes)
export function getTotalLearningTime(progress) {
  const totalSeconds = Object.values(progress).reduce((sum, p) => sum + (p.time_spent || 0), 0);
  return Math.round(totalSeconds / 60);
}

// Get today's progress
export function getTodayProgress(progress) {
  const today = new Date().toDateString();
  const todayLessons = Object.values(progress).filter(p => {
    const completedDate = new Date(p.completed_at).toDateString();
    return completedDate === today;
  });

  return {
    lessonsCompleted: todayLessons.length,
    pointsEarned: todayLessons.reduce((sum, p) => sum + (p.score || 0), 0),
    timeSpent: Math.round(todayLessons.reduce((sum, p) => sum + (p.time_spent || 0), 0) / 60),
  };
}

// ============================================
// STREAK CALCULATION
// ============================================

export function calculateStreak(progress) {
  const dates = Object.values(progress)
    .map(p => new Date(p.completed_at).toDateString())
    .filter((date, index, self) => self.indexOf(date) === index) // unique dates
    .sort((a, b) => new Date(b) - new Date(a)); // newest first

  if (dates.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < dates.length; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);

    if (dates.includes(checkDate.toDateString())) {
      streak++;
    } else if (i === 0) {
      // Today hasn't learned yet, check from yesterday
      continue;
    } else {
      break;
    }
  }

  return streak;
}

// ============================================
// ACHIEVEMENTS / BADGES
// ============================================

export const BADGES = [
  { id: 'first_lesson', icon: '🌟', name: 'Bài học đầu tiên', description: 'Hoàn thành 1 bài học', requirement: 1, type: 'lessons' },
  { id: 'lessons_5', icon: '📚', name: 'Học sinh chăm chỉ', description: 'Hoàn thành 5 bài học', requirement: 5, type: 'lessons' },
  { id: 'lessons_10', icon: '🎓', name: 'Học giỏi', description: 'Hoàn thành 10 bài học', requirement: 10, type: 'lessons' },
  { id: 'lessons_20', icon: '🏆', name: 'Siêu học sinh', description: 'Hoàn thành 20 bài học', requirement: 20, type: 'lessons' },
  { id: 'points_100', icon: '💯', name: '100 điểm đầu tiên', description: 'Đạt 100 điểm', requirement: 100, type: 'points' },
  { id: 'points_500', icon: '⭐', name: 'Ngôi sao sáng', description: 'Đạt 500 điểm', requirement: 500, type: 'points' },
  { id: 'points_1000', icon: '🌈', name: 'Cầu vồng điểm', description: 'Đạt 1000 điểm', requirement: 1000, type: 'points' },
  { id: 'streak_3', icon: '🔥', name: 'Chuỗi 3 ngày', description: 'Học 3 ngày liên tiếp', requirement: 3, type: 'streak' },
  { id: 'streak_7', icon: '💪', name: 'Chuỗi 7 ngày', description: 'Học 7 ngày liên tiếp', requirement: 7, type: 'streak' },
  { id: 'streak_30', icon: '👑', name: 'Vua kiên trì', description: 'Học 30 ngày liên tiếp', requirement: 30, type: 'streak' },
];

export function getUnlockedBadges(progress) {
  const totalPoints = calculateTotalPoints(progress);
  const completedLessons = getCompletedLessonsCount(progress);
  const streak = calculateStreak(progress);

  return BADGES.filter(badge => {
    switch (badge.type) {
      case 'lessons':
        return completedLessons >= badge.requirement;
      case 'points':
        return totalPoints >= badge.requirement;
      case 'streak':
        return streak >= badge.requirement;
      default:
        return false;
    }
  });
}

export function getNextBadge(progress) {
  const totalPoints = calculateTotalPoints(progress);
  const completedLessons = getCompletedLessonsCount(progress);
  const streak = calculateStreak(progress);

  for (const badge of BADGES) {
    let current, requirement;
    switch (badge.type) {
      case 'lessons':
        current = completedLessons;
        requirement = badge.requirement;
        break;
      case 'points':
        current = totalPoints;
        requirement = badge.requirement;
        break;
      case 'streak':
        current = streak;
        requirement = badge.requirement;
        break;
      default:
        continue;
    }

    if (current < requirement) {
      return { ...badge, current, remaining: requirement - current };
    }
  }

  return null;
}

// ============================================
// ENGLISH TOPICS HELPERS
// ============================================

export function getEnglishTopicsWithProgress(progress) {
  const topics = getAllTopics();

  return topics.map(topic => {
    const lessonId = `english_${topic.id}`;
    const lessonProgress = progress[lessonId];

    return {
      ...topic,
      lessonId,
      status: lessonProgress?.status || 'not_started',
      score: lessonProgress?.score || 0,
      completedAt: lessonProgress?.completed_at,
    };
  });
}

// Get next lesson to learn
export function getNextLesson(progress) {
  const topics = getAllTopics();

  for (const topic of topics) {
    const lessonId = `english_${topic.id}`;
    if (!progress[lessonId] || progress[lessonId].status !== 'completed') {
      return {
        ...topic,
        lessonId,
        status: progress[lessonId]?.status || 'not_started',
      };
    }
  }

  // All completed, return first one for review
  return topics[0] ? { ...topics[0], lessonId: `english_${topics[0].id}`, status: 'review' } : null;
}

// ============================================
// ASSIGNMENTS (from teacher)
// ============================================

export async function getStudentAssignments(studentId, classId) {
  if (!classId) {
    return { assignments: [], noClass: true };
  }

  try {
    const { data, error } = await supabase
      .from('assignments')
      .select(`
        *,
        teacher:profiles!assignments_teacher_id_fkey(full_name)
      `)
      .eq('class_id', classId)
      .order('deadline', { ascending: true });

    if (error) throw error;

    // Get student's submissions
    const { data: submissions } = await supabase
      .from('assignment_submissions')
      .select('*')
      .eq('student_id', studentId);

    const submissionMap = {};
    (submissions || []).forEach(s => {
      submissionMap[s.assignment_id] = s;
    });

    // Merge assignment with submission status
    const assignmentsWithStatus = (data || []).map(a => ({
      ...a,
      submission: submissionMap[a.id],
      status: submissionMap[a.id]?.status || 'pending',
    }));

    return { assignments: assignmentsWithStatus, noClass: false };
  } catch (err) {
    console.error('Error fetching assignments:', err);
    return { assignments: [], noClass: false, error: err.message };
  }
}

// ============================================
// LEADERBOARD
// ============================================

export async function getClassLeaderboard(classId) {
  if (!classId) return [];

  try {
    // Get all students in the class with their progress
    const { data: students, error } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url')
      .eq('class_id', classId)
      .eq('role', 'student');

    if (error) throw error;

    // Get progress for all students
    const studentIds = students.map(s => s.id);
    const { data: progressData } = await supabase
      .from('student_progress')
      .select('*')
      .in('student_id', studentIds);

    // Calculate points for each student
    const studentPoints = {};
    (progressData || []).forEach(p => {
      if (!studentPoints[p.student_id]) {
        studentPoints[p.student_id] = 0;
      }
      studentPoints[p.student_id] += p.score || 0;
    });

    // Build leaderboard
    const leaderboard = students.map(s => ({
      ...s,
      points: studentPoints[s.id] || 0,
    })).sort((a, b) => b.points - a.points);

    // Add ranks
    return leaderboard.map((s, index) => ({
      ...s,
      rank: index + 1,
    }));
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    return [];
  }
}
