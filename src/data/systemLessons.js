// src/data/systemLessons.js
// Bài giảng hệ thống cho giáo viên sử dụng
// Được tạo từ dữ liệu bài học có sẵn trong hệ thống

import { SUBJECTS } from './subjects';
import { LESSON_QUESTIONS } from './lessons';

// Subject ID mapping (sẽ được thay thế bằng UUID thực từ database)
const SUBJECT_KEYS = {
  math: 'Toán',
  vietnamese: 'Tiếng Việt',
  english: 'Tiếng Anh',
  science: 'Khoa học',
  lifeskills: 'Kỹ năng sống',
};

/**
 * Tạo danh sách bài giảng hệ thống từ SUBJECTS
 * Được sử dụng khi không có dữ liệu trong database
 */
export const generateSystemLessons = () => {
  const systemLessons = [];

  Object.entries(SUBJECTS).forEach(([subjectKey, subject]) => {
    const subjectName = SUBJECT_KEYS[subjectKey] || subject.name;

    subject.lessons.forEach((lesson, index) => {
      // Tìm câu hỏi tương ứng từ LESSON_QUESTIONS
      const questionKey = lesson.id.replace(/-/g, '').replace('viet', 'v').replace('math', 'm');
      const questions = LESSON_QUESTIONS[questionKey] || LESSON_QUESTIONS[lesson.id] || [];

      systemLessons.push({
        id: `system_${lesson.id}`,
        original_id: lesson.id,
        title: lesson.title,
        description: lesson.desc || lesson.description || '',
        subject_key: subjectKey,
        subject_name: subjectName,
        subject_icon: subject.icon,
        level: lesson.level || 1,
        sort_order: index,
        questions: questions.map((q, qIndex) => ({
          id: `q_${lesson.id}_${qIndex}`,
          type: 'multiple_choice',
          content: q.q,
          options: q.options,
          correct_answer: q.options.indexOf(q.answer),
          hint: q.hint || null,
        })),
        question_count: questions.length,
        is_system: true,
        status: 'published',
      });
    });
  });

  return systemLessons;
};

/**
 * Lấy bài giảng hệ thống theo môn học
 */
export const getSystemLessonsBySubject = (subjectKey) => {
  const allLessons = generateSystemLessons();
  if (!subjectKey) return allLessons;
  return allLessons.filter(l => l.subject_key === subjectKey);
};

/**
 * Lấy bài giảng hệ thống theo ID
 */
export const getSystemLessonById = (lessonId) => {
  const allLessons = generateSystemLessons();
  return allLessons.find(l => l.id === lessonId || l.original_id === lessonId);
};

/**
 * Nhóm bài giảng theo môn học
 */
export const groupLessonsBySubject = (lessons) => {
  const grouped = {};

  lessons.forEach(lesson => {
    const key = lesson.subject_name || lesson.subject_key || 'Khác';
    if (!grouped[key]) {
      grouped[key] = {
        name: key,
        icon: lesson.subject_icon || '📚',
        lessons: [],
      };
    }
    grouped[key].lessons.push(lesson);
  });

  return Object.values(grouped);
};

// Export danh sách môn học cho dropdown
export const SYSTEM_SUBJECTS = Object.entries(SUBJECTS).map(([key, subject]) => ({
  key,
  name: subject.name,
  icon: subject.icon,
  color: subject.color,
  lessonCount: subject.lessons.length,
}));

export default {
  generateSystemLessons,
  getSystemLessonsBySubject,
  getSystemLessonById,
  groupLessonsBySubject,
  SYSTEM_SUBJECTS,
};
