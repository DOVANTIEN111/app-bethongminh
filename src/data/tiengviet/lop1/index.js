// src/data/tiengviet/lop1/index.js
// TIẾNG VIỆT LỚP 1 - 75 BÀI HỌC

import { HOC_VAN_LESSONS, getHocVanLesson, getHocVanLessonList } from './hocvan';
import { TAP_DOC_LESSONS, getTapDocLesson, getTapDocLessonList } from './tapdoc';
import { TAP_VIET_LESSONS, getTapVietLesson, getTapVietLessonList } from './tapviet';
import { CHINH_TA_LESSONS, getChinhTaLesson, getChinhTaLessonList } from './chinhta';

// ============================================
// TỔNG HỢP TẤT CẢ BÀI HỌC LỚP 1
// ============================================
export const TIENG_VIET_LOP_1 = {
  ...HOC_VAN_LESSONS,
  ...TAP_DOC_LESSONS,
  ...TAP_VIET_LESSONS,
  ...CHINH_TA_LESSONS
};

// ============================================
// DANH MỤC THEO CHỦ ĐỀ
// ============================================
export const TIENG_VIET_LOP_1_CATEGORIES = [
  {
    id: 'hoc-van',
    title: 'Học vần',
    description: '29 chữ cái và ghép vần cơ bản',
    icon: '🔤',
    color: 'from-red-400 to-pink-500',
    lessonCount: 30,
    lessons: getHocVanLessonList()
  },
  {
    id: 'tap-doc',
    title: 'Tập đọc',
    description: 'Đọc từ, câu và đoạn văn ngắn',
    icon: '📖',
    color: 'from-blue-400 to-indigo-500',
    lessonCount: 20,
    lessons: getTapDocLessonList()
  },
  {
    id: 'tap-viet',
    title: 'Tập viết',
    description: 'Viết nét cơ bản và chữ cái',
    icon: '✏️',
    color: 'from-green-400 to-emerald-500',
    lessonCount: 15,
    lessons: getTapVietLessonList()
  },
  {
    id: 'chinh-ta',
    title: 'Chính tả',
    description: 'Nghe viết và quy tắc chính tả',
    icon: '📝',
    color: 'from-purple-400 to-violet-500',
    lessonCount: 10,
    lessons: getChinhTaLessonList()
  }
];

// ============================================
// HÀM TIỆN ÍCH
// ============================================

// Lấy bài học theo ID
export const getTiengVietLop1Lesson = (lessonId) => {
  return TIENG_VIET_LOP_1[lessonId] || null;
};

// Lấy danh sách tất cả bài học
export const getTiengVietLop1LessonList = () => {
  return Object.values(TIENG_VIET_LOP_1).sort((a, b) => {
    // Sắp xếp theo category rồi theo order
    const categoryOrder = { 'hoc-van': 1, 'tap-doc': 2, 'tap-viet': 3, 'chinh-ta': 4 };
    if (a.category !== b.category) {
      return categoryOrder[a.category] - categoryOrder[b.category];
    }
    return a.order - b.order;
  });
};

// Lấy bài học theo danh mục
export const getLessonsByCategory = (categoryId) => {
  switch (categoryId) {
    case 'hoc-van':
      return getHocVanLessonList();
    case 'tap-doc':
      return getTapDocLessonList();
    case 'tap-viet':
      return getTapVietLessonList();
    case 'chinh-ta':
      return getChinhTaLessonList();
    default:
      return [];
  }
};

// Lấy bài học tiếp theo
export const getNextTiengVietLop1Lesson = (currentLessonId) => {
  const allLessons = getTiengVietLop1LessonList();
  const currentIndex = allLessons.findIndex(l => l.id === currentLessonId);

  if (currentIndex === -1 || currentIndex >= allLessons.length - 1) {
    return null;
  }

  return allLessons[currentIndex + 1];
};

// Lấy bài học tiếp theo trong cùng danh mục
export const getNextLessonInCategory = (currentLessonId) => {
  const lesson = getTiengVietLop1Lesson(currentLessonId);
  if (!lesson) return null;

  const categoryLessons = getLessonsByCategory(lesson.category);
  const currentIndex = categoryLessons.findIndex(l => l.id === currentLessonId);

  if (currentIndex === -1 || currentIndex >= categoryLessons.length - 1) {
    return null;
  }

  return categoryLessons[currentIndex + 1];
};

// Thống kê
export const getTiengVietLop1Stats = () => {
  return {
    totalLessons: Object.keys(TIENG_VIET_LOP_1).length,
    categories: TIENG_VIET_LOP_1_CATEGORIES.map(cat => ({
      id: cat.id,
      title: cat.title,
      count: cat.lessonCount
    })),
    grade: 1,
    subject: 'tieng-viet'
  };
};

// Export các module con
export {
  HOC_VAN_LESSONS,
  TAP_DOC_LESSONS,
  TAP_VIET_LESSONS,
  CHINH_TA_LESSONS,
  getHocVanLesson,
  getHocVanLessonList,
  getTapDocLesson,
  getTapDocLessonList,
  getTapVietLesson,
  getTapVietLessonList,
  getChinhTaLesson,
  getChinhTaLessonList
};

// Default export
export default TIENG_VIET_LOP_1;
