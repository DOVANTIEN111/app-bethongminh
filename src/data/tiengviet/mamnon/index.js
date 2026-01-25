// src/data/tiengviet/mamnon/index.js
// TIẾNG VIỆT MẦM NON (3-5 tuổi) - 50 BÀI HỌC

// Import từ file gốc vietnameseLessons.js
import { VIETNAMESE_LESSONS, VIET_IMAGES } from '../../vietnameseLessons';

// ============================================
// DANH MỤC THEO ĐỘ TUỔI
// ============================================
export const MAM_NON_CATEGORIES = [
  {
    id: 'chu-cai',
    title: 'Học chữ cái',
    description: 'Nhận biết 29 chữ cái qua hình ảnh',
    icon: '🔤',
    color: 'from-pink-400 to-rose-500',
    ageRange: '3-4 tuổi',
    level: 1,
    lessonCount: 15
  },
  {
    id: 'nguyen-am-phu-am',
    title: 'Nguyên âm & Phụ âm',
    description: 'Phân biệt nguyên âm và phụ âm',
    icon: '🗣️',
    color: 'from-orange-400 to-amber-500',
    ageRange: '4-5 tuổi',
    level: 2,
    lessonCount: 10
  },
  {
    id: 'van-don-gian',
    title: 'Vần đơn giản',
    description: 'Ghép vần cơ bản, đọc từ đơn giản',
    icon: '📖',
    color: 'from-cyan-400 to-teal-500',
    ageRange: '5-6 tuổi',
    level: 3,
    lessonCount: 15
  },
  {
    id: 'tu-vung-chu-de',
    title: 'Từ vựng theo chủ đề',
    description: 'Gia đình, động vật, màu sắc, trái cây',
    icon: '🎨',
    color: 'from-purple-400 to-violet-500',
    ageRange: '3-5 tuổi',
    level: 0,
    lessonCount: 10
  }
];

// ============================================
// HÀM TIỆN ÍCH
// ============================================

// Lấy tất cả bài học mầm non
export const getMamNonLessons = () => {
  return VIETNAMESE_LESSONS;
};

// Lấy danh sách bài học theo level
export const getMamNonLessonsByLevel = (level) => {
  return Object.values(VIETNAMESE_LESSONS)
    .filter(lesson => lesson.level === level)
    .sort((a, b) => {
      // Sắp xếp theo id
      const aNum = parseInt(a.id.split('-').pop());
      const bNum = parseInt(b.id.split('-').pop());
      return aNum - bNum;
    });
};

// Lấy danh sách bài học theo category
export const getMamNonLessonsByCategory = (categoryId) => {
  switch (categoryId) {
    case 'chu-cai':
      return getMamNonLessonsByLevel(1);
    case 'nguyen-am-phu-am':
      return getMamNonLessonsByLevel(2);
    case 'van-don-gian':
      return getMamNonLessonsByLevel(3);
    case 'tu-vung-chu-de':
      return getMamNonLessonsByLevel(0);
    default:
      return [];
  }
};

// Lấy bài học theo ID
export const getMamNonLesson = (lessonId) => {
  return VIETNAMESE_LESSONS[lessonId] || null;
};

// Lấy tất cả bài học dạng danh sách
export const getMamNonLessonList = () => {
  return Object.values(VIETNAMESE_LESSONS).sort((a, b) => {
    // Sắp xếp theo level rồi theo id
    if (a.level !== b.level) {
      return a.level - b.level;
    }
    const aNum = parseInt(a.id.split('-').pop());
    const bNum = parseInt(b.id.split('-').pop());
    return aNum - bNum;
  });
};

// Lấy bài học tiếp theo
export const getNextMamNonLesson = (currentLessonId) => {
  const allLessons = getMamNonLessonList();
  const currentIndex = allLessons.findIndex(l => l.id === currentLessonId);

  if (currentIndex === -1 || currentIndex >= allLessons.length - 1) {
    return null;
  }

  return allLessons[currentIndex + 1];
};

// Lấy bài học tiếp theo trong cùng level
export const getNextLessonInLevel = (currentLessonId) => {
  const lesson = getMamNonLesson(currentLessonId);
  if (!lesson) return null;

  const levelLessons = getMamNonLessonsByLevel(lesson.level);
  const currentIndex = levelLessons.findIndex(l => l.id === currentLessonId);

  if (currentIndex === -1 || currentIndex >= levelLessons.length - 1) {
    return null;
  }

  return levelLessons[currentIndex + 1];
};

// Thống kê
export const getMamNonStats = () => {
  return {
    totalLessons: Object.keys(VIETNAMESE_LESSONS).length,
    categories: MAM_NON_CATEGORIES.map(cat => ({
      id: cat.id,
      title: cat.title,
      count: cat.lessonCount
    })),
    ageRange: '3-6 tuổi',
    subject: 'tieng-viet'
  };
};

// Export hình ảnh minh họa
export { VIET_IMAGES };

// Export tất cả bài học
export { VIETNAMESE_LESSONS as MAM_NON_LESSONS };

// Default export
export default VIETNAMESE_LESSONS;
