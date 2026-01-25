// src/data/tiengviet/index.js
// TỔNG HỢP TẤT CẢ NỘI DUNG TIẾNG VIỆT THEO ĐỘ TUỔI/LỚP

// Import Mầm non (3-5 tuổi)
import {
  MAM_NON_LESSONS,
  MAM_NON_CATEGORIES,
  getMamNonLesson,
  getMamNonLessonList,
  getMamNonLessonsByCategory,
  getMamNonLessonsByLevel,
  getNextMamNonLesson,
  getNextLessonInLevel,
  getMamNonStats,
  VIET_IMAGES
} from './mamnon';

// Import Lớp 1 (6-7 tuổi)
import {
  TIENG_VIET_LOP_1,
  TIENG_VIET_LOP_1_CATEGORIES,
  getTiengVietLop1Lesson,
  getTiengVietLop1LessonList,
  getLessonsByCategory as getLop1LessonsByCategory,
  getNextTiengVietLop1Lesson,
  getNextLessonInCategory as getNextLop1LessonInCategory,
  getTiengVietLop1Stats
} from './lop1';

// ============================================
// CẤU TRÚC TIẾNG VIỆT THEO ĐỘ TUỔI/LỚP
// ============================================
export const TIENG_VIET_GRADES = [
  {
    id: 'mam-non',
    title: 'Mầm non',
    subtitle: '3-5 tuổi',
    description: 'Nhận biết chữ cái, tập nói, nghe kể chuyện',
    icon: '👶',
    color: 'from-pink-400 to-rose-500',
    bgColor: 'bg-gradient-to-br from-pink-100 to-rose-100',
    lessonCount: 50,
    categories: MAM_NON_CATEGORIES
  },
  {
    id: 'lop-1',
    title: 'Lớp 1',
    subtitle: '6-7 tuổi',
    description: 'Học vần, tập đọc, tập viết, chính tả',
    icon: '📚',
    color: 'from-blue-400 to-indigo-500',
    bgColor: 'bg-gradient-to-br from-blue-100 to-indigo-100',
    lessonCount: 75,
    categories: TIENG_VIET_LOP_1_CATEGORIES
  },
  {
    id: 'lop-2',
    title: 'Lớp 2',
    subtitle: '7-8 tuổi',
    description: 'Đọc hiểu, tập làm văn, từ vựng nâng cao',
    icon: '📖',
    color: 'from-green-400 to-emerald-500',
    bgColor: 'bg-gradient-to-br from-green-100 to-emerald-100',
    lessonCount: 0,
    categories: [],
    comingSoon: true
  },
  {
    id: 'lop-3',
    title: 'Lớp 3',
    subtitle: '8-9 tuổi',
    description: 'Văn học, ngữ pháp, viết đoạn văn',
    icon: '📝',
    color: 'from-purple-400 to-violet-500',
    bgColor: 'bg-gradient-to-br from-purple-100 to-violet-100',
    lessonCount: 0,
    categories: [],
    comingSoon: true
  },
  {
    id: 'lop-4',
    title: 'Lớp 4',
    subtitle: '9-10 tuổi',
    description: 'Đọc hiểu văn bản, viết bài văn',
    icon: '✍️',
    color: 'from-orange-400 to-amber-500',
    bgColor: 'bg-gradient-to-br from-orange-100 to-amber-100',
    lessonCount: 0,
    categories: [],
    comingSoon: true
  }
];

// ============================================
// HÀM TIỆN ÍCH CHUNG
// ============================================

// Lấy bài học theo grade và lessonId
export const getLesson = (gradeId, lessonId) => {
  switch (gradeId) {
    case 'mam-non':
      return getMamNonLesson(lessonId);
    case 'lop-1':
      return getTiengVietLop1Lesson(lessonId);
    default:
      return null;
  }
};

// Lấy danh sách bài học theo grade
export const getLessonList = (gradeId) => {
  switch (gradeId) {
    case 'mam-non':
      return getMamNonLessonList();
    case 'lop-1':
      return getTiengVietLop1LessonList();
    default:
      return [];
  }
};

// Lấy bài học theo category
export const getLessonsByCategory = (gradeId, categoryId) => {
  switch (gradeId) {
    case 'mam-non':
      return getMamNonLessonsByCategory(categoryId);
    case 'lop-1':
      return getLop1LessonsByCategory(categoryId);
    default:
      return [];
  }
};

// Lấy categories theo grade
export const getCategoriesByGrade = (gradeId) => {
  switch (gradeId) {
    case 'mam-non':
      return MAM_NON_CATEGORIES;
    case 'lop-1':
      return TIENG_VIET_LOP_1_CATEGORIES;
    default:
      return [];
  }
};

// Lấy bài học tiếp theo
export const getNextLesson = (gradeId, currentLessonId) => {
  switch (gradeId) {
    case 'mam-non':
      return getNextMamNonLesson(currentLessonId);
    case 'lop-1':
      return getNextTiengVietLop1Lesson(currentLessonId);
    default:
      return null;
  }
};

// Lấy thông tin grade
export const getGradeInfo = (gradeId) => {
  return TIENG_VIET_GRADES.find(g => g.id === gradeId) || null;
};

// Thống kê tổng hợp
export const getTiengVietStats = () => {
  return {
    totalGrades: TIENG_VIET_GRADES.length,
    totalLessons: TIENG_VIET_GRADES.reduce((sum, g) => sum + g.lessonCount, 0),
    grades: TIENG_VIET_GRADES.map(g => ({
      id: g.id,
      title: g.title,
      lessonCount: g.lessonCount
    }))
  };
};

// ============================================
// EXPORTS
// ============================================

// Export Mầm non
export {
  MAM_NON_LESSONS,
  MAM_NON_CATEGORIES,
  getMamNonLesson,
  getMamNonLessonList,
  getMamNonLessonsByCategory,
  getMamNonLessonsByLevel,
  getNextMamNonLesson,
  getNextLessonInLevel,
  getMamNonStats,
  VIET_IMAGES
};

// Export Lớp 1
export {
  TIENG_VIET_LOP_1,
  TIENG_VIET_LOP_1_CATEGORIES,
  getTiengVietLop1Lesson,
  getTiengVietLop1LessonList,
  getLop1LessonsByCategory,
  getNextTiengVietLop1Lesson,
  getNextLop1LessonInCategory,
  getTiengVietLop1Stats
};

// Default export
export default TIENG_VIET_GRADES;
