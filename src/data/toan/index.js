// src/data/toan/index.js
// TỔNG HỢP NỘI DUNG TOÁN HỌC CHO TRẺ 3-10 TUỔI

// Import từ mathLessons gốc
import {
  MATH_LESSONS,
  MATH_IMAGES,
  getMathLesson,
  getAllMathLessons,
  getMathLessonsByLevel,
  getNextMathLesson
} from '../mathLessons';

// ============================================
// CẤU TRÚC TOÁN HỌC THEO ĐỘ TUỔI/LỚP
// ============================================
export const TOAN_GRADES = [
  {
    id: 'mam-non',
    title: 'Mầm non',
    subtitle: '3-5 tuổi',
    description: 'Làm quen số đếm 1-10, nhận biết hình khối',
    icon: '👶',
    color: 'from-pink-400 to-rose-500',
    bgColor: 'bg-gradient-to-br from-pink-100 to-rose-100',
    levels: [1, 2],
    lessonCount: 20
  },
  {
    id: 'lop-1',
    title: 'Lớp 1',
    subtitle: '6-7 tuổi',
    description: 'Số đếm 1-100, phép cộng trừ trong 20',
    icon: '📚',
    color: 'from-blue-400 to-indigo-500',
    bgColor: 'bg-gradient-to-br from-blue-100 to-indigo-100',
    levels: [3, 4],
    lessonCount: 25
  },
  {
    id: 'lop-2',
    title: 'Lớp 2',
    subtitle: '7-8 tuổi',
    description: 'Phép nhân chia, đo lường',
    icon: '📖',
    color: 'from-green-400 to-emerald-500',
    bgColor: 'bg-gradient-to-br from-green-100 to-emerald-100',
    levels: [5],
    lessonCount: 5
  }
];

// ============================================
// BÀI HỌC BỔ SUNG - SỐ 0 VÀ CÁC BÀI ĐẶC BIỆT
// ============================================
export const TOAN_EXTRA_LESSONS = {
  // Số 0
  'toan-0': {
    id: 'toan-0',
    title: 'Số 0 - Không',
    level: 1,
    description: 'Học số 0 - Không có gì',
    icon: '0️⃣',
    color: 'from-gray-400 to-slate-500',

    intro: {
      title: 'Đây là số 0',
      subtitle: 'Không - Zero',
      image: '🫗',
      imageCount: 0,
      voice: 'Số 0, đọc là KHÔNG. Không có gì cả.',
      animation: 'bounce',
    },

    examples: [
      { image: '📦', count: 0, text: 'Hộp trống rỗng' },
      { image: '🍎', count: 0, text: 'Không có táo' },
      { image: '⭐', count: 0, text: 'Không có sao' },
      { image: '🐱', count: 0, text: 'Không có mèo' },
    ],

    questions: [
      {
        type: 'count',
        question: 'Có mấy quả táo trong giỏ trống?',
        image: '📦',
        imageCount: 0,
        options: ['0', '1', '2'],
        answer: '0',
        hint: 'Giỏ trống không có gì!',
      },
      {
        type: 'select',
        question: 'Chọn hình có 0 đồ vật',
        options: [
          { image: '🍎', count: 1 },
          { image: '🍎', count: 0 },
          { image: '🍎', count: 2 },
        ],
        answer: 1,
      },
      {
        type: 'match',
        question: 'Số 0 đọc là gì?',
        options: ['Không', 'Một', 'Hai'],
        answer: 'Không',
      },
      {
        type: 'count',
        question: 'Con ăn hết táo rồi, còn mấy quả?',
        image: '😋',
        imageCount: 0,
        options: ['1', '2', '0'],
        answer: '0',
      },
    ],

    reward: {
      xp: 10,
      message: 'Giỏi lắm! Bé đã hiểu số 0 rồi! 🎉',
    },
  },

  // So sánh số
  'toan-compare': {
    id: 'toan-compare',
    title: 'So sánh lớn hơn, nhỏ hơn',
    level: 2,
    description: 'Học so sánh các số',
    icon: '⚖️',
    color: 'from-purple-400 to-violet-500',

    intro: {
      title: 'Lớn hơn và Nhỏ hơn',
      subtitle: 'So sánh số',
      image: '⚖️',
      imageCount: 1,
      voice: 'Chúng ta sẽ học so sánh số nào lớn hơn, số nào nhỏ hơn.',
    },

    examples: [
      { leftImage: '🍎🍎🍎', rightImage: '🍎', text: '3 > 1 (3 lớn hơn 1)' },
      { leftImage: '⭐', rightImage: '⭐⭐⭐', text: '1 < 3 (1 nhỏ hơn 3)' },
      { leftImage: '🐱🐱', rightImage: '🐱🐱', text: '2 = 2 (bằng nhau)' },
    ],

    questions: [
      {
        type: 'compare',
        question: 'Số nào lớn hơn?',
        leftValue: 5,
        rightValue: 3,
        leftImage: '🍎',
        rightImage: '🍎',
        options: ['5', '3'],
        answer: '5',
        hint: 'Đếm xem bên nào nhiều hơn!',
      },
      {
        type: 'compare',
        question: 'Số nào nhỏ hơn?',
        leftValue: 2,
        rightValue: 7,
        leftImage: '⭐',
        rightImage: '⭐',
        options: ['2', '7'],
        answer: '2',
      },
      {
        type: 'select',
        question: '4 ... 6. Điền dấu thích hợp',
        options: ['>', '<', '='],
        answer: 1,
        hint: '4 nhỏ hơn 6',
      },
      {
        type: 'compare',
        question: 'Chọn nhóm có nhiều hơn',
        leftValue: 4,
        rightValue: 4,
        leftImage: '🐰',
        rightImage: '🐰',
        options: ['Bằng nhau', 'Nhóm trái', 'Nhóm phải'],
        answer: 'Bằng nhau',
      },
    ],

    reward: {
      xp: 15,
      message: 'Tuyệt vời! Bé giỏi so sánh số quá! 🌟',
    },
  },

  // Bài toán đố vui
  'toan-word-1': {
    id: 'toan-word-1',
    title: 'Bài toán đố vui 1',
    level: 3,
    description: 'Giải toán đố bằng hình ảnh',
    icon: '🧩',
    color: 'from-amber-400 to-orange-500',

    intro: {
      title: 'Toán đố vui',
      subtitle: 'Giải quyết vấn đề',
      image: '🧩',
      imageCount: 1,
      voice: 'Chúng ta sẽ giải những bài toán thú vị với hình ảnh!',
    },

    questions: [
      {
        type: 'word_problem',
        question: 'Mẹ cho con 3 quả táo 🍎🍎🍎. Bố cho thêm 2 quả nữa 🍎🍎. Con có tất cả mấy quả?',
        image: '🍎',
        imageCount: 5,
        calculation: '3 + 2 = ?',
        options: ['4', '5', '6'],
        answer: '5',
        hint: 'Đếm tất cả các quả táo nhé!',
        explanation: '3 + 2 = 5. Con có 5 quả táo!',
      },
      {
        type: 'word_problem',
        question: 'Trong ao có 6 con vịt 🦆. Có 2 con lên bờ 🚶. Còn mấy con trong ao?',
        image: '🦆',
        imageCount: 4,
        calculation: '6 - 2 = ?',
        options: ['3', '4', '5'],
        answer: '4',
        explanation: '6 - 2 = 4. Còn 4 con vịt trong ao!',
      },
      {
        type: 'word_problem',
        question: 'Lan có 4 bông hoa đỏ 🌹🌹🌹🌹 và 3 bông hoa vàng 🌼🌼🌼. Lan có tất cả mấy bông hoa?',
        image: '🌸',
        imageCount: 7,
        calculation: '4 + 3 = ?',
        options: ['6', '7', '8'],
        answer: '7',
        explanation: '4 + 3 = 7. Lan có 7 bông hoa!',
      },
      {
        type: 'word_problem',
        question: 'Bà cho em 10 viên kẹo 🍬. Em ăn mất 4 viên. Còn lại mấy viên kẹo?',
        image: '🍬',
        imageCount: 6,
        calculation: '10 - 4 = ?',
        options: ['5', '6', '7'],
        answer: '6',
        explanation: '10 - 4 = 6. Còn 6 viên kẹo!',
      },
    ],

    reward: {
      xp: 20,
      message: 'Xuất sắc! Bé giải toán đố rất giỏi! 🏆',
    },
  },

  // Phép cộng hình ảnh
  'toan-add-visual': {
    id: 'toan-add-visual',
    title: 'Phép cộng hình ảnh',
    level: 2,
    description: 'Học cộng bằng đếm hình',
    icon: '➕',
    color: 'from-green-400 to-teal-500',

    intro: {
      title: 'Cộng = Gộp lại',
      subtitle: 'Đếm tổng số',
      image: '➕',
      imageCount: 1,
      voice: 'Khi cộng, chúng ta gộp tất cả lại và đếm!',
    },

    examples: [
      { left: '🍎🍎', right: '🍎', result: '🍎🍎🍎', text: '2 + 1 = 3' },
      { left: '⭐⭐', right: '⭐⭐', result: '⭐⭐⭐⭐', text: '2 + 2 = 4' },
      { left: '🐰', right: '🐰🐰', result: '🐰🐰🐰', text: '1 + 2 = 3' },
    ],

    questions: [
      {
        type: 'addition_visual',
        question: '🍎🍎 + 🍎 = ?',
        leftImage: '🍎',
        leftCount: 2,
        rightImage: '🍎',
        rightCount: 1,
        options: ['2', '3', '4'],
        answer: '3',
        hint: 'Gộp lại và đếm!',
      },
      {
        type: 'addition_visual',
        question: '⭐⭐⭐ + ⭐⭐ = ?',
        leftImage: '⭐',
        leftCount: 3,
        rightImage: '⭐',
        rightCount: 2,
        options: ['4', '5', '6'],
        answer: '5',
      },
      {
        type: 'addition_visual',
        question: '🐱🐱🐱🐱 + 🐱 = ?',
        leftImage: '🐱',
        leftCount: 4,
        rightImage: '🐱',
        rightCount: 1,
        options: ['4', '5', '6'],
        answer: '5',
      },
      {
        type: 'addition_visual',
        question: '🌸🌸 + 🌸🌸🌸 = ?',
        leftImage: '🌸',
        leftCount: 2,
        rightImage: '🌸',
        rightCount: 3,
        options: ['4', '5', '6'],
        answer: '5',
      },
    ],

    reward: {
      xp: 15,
      message: 'Giỏi quá! Bé cộng rất nhanh! 🌟',
    },
  },

  // Phép trừ hình ảnh
  'toan-sub-visual': {
    id: 'toan-sub-visual',
    title: 'Phép trừ hình ảnh',
    level: 2,
    description: 'Học trừ bằng bớt đi',
    icon: '➖',
    color: 'from-red-400 to-rose-500',

    intro: {
      title: 'Trừ = Bớt đi',
      subtitle: 'Đếm số còn lại',
      image: '➖',
      imageCount: 1,
      voice: 'Khi trừ, chúng ta bớt đi và đếm số còn lại!',
    },

    examples: [
      { original: '🍎🍎🍎', removed: '🍎', result: '🍎🍎', text: '3 - 1 = 2' },
      { original: '⭐⭐⭐⭐', removed: '⭐⭐', result: '⭐⭐', text: '4 - 2 = 2' },
      { original: '🐰🐰🐰🐰🐰', removed: '🐰🐰', result: '🐰🐰🐰', text: '5 - 2 = 3' },
    ],

    questions: [
      {
        type: 'subtraction_visual',
        question: '🍎🍎🍎🍎🍎 bớt đi 🍎🍎 còn mấy?',
        image: '🍎',
        originalCount: 5,
        removeCount: 2,
        options: ['2', '3', '4'],
        answer: '3',
        hint: 'Che 2 quả táo rồi đếm!',
      },
      {
        type: 'subtraction_visual',
        question: '⭐⭐⭐⭐ bớt đi ⭐ còn mấy?',
        image: '⭐',
        originalCount: 4,
        removeCount: 1,
        options: ['2', '3', '4'],
        answer: '3',
      },
      {
        type: 'subtraction_visual',
        question: '🐱🐱🐱🐱🐱🐱 bớt đi 🐱🐱🐱 còn mấy?',
        image: '🐱',
        originalCount: 6,
        removeCount: 3,
        options: ['2', '3', '4'],
        answer: '3',
      },
      {
        type: 'subtraction_visual',
        question: '🌸🌸🌸🌸🌸🌸🌸 bớt đi 🌸🌸🌸🌸 còn mấy?',
        image: '🌸',
        originalCount: 7,
        removeCount: 4,
        options: ['2', '3', '4'],
        answer: '3',
      },
    ],

    reward: {
      xp: 15,
      message: 'Tuyệt vời! Bé trừ giỏi lắm! 🎉',
    },
  },
};

// ============================================
// HÀM TIỆN ÍCH
// ============================================

// Lấy tất cả bài học toán (bao gồm cả bài bổ sung)
export const getAllToanLessons = () => {
  return [
    ...Object.values(TOAN_EXTRA_LESSONS),
    ...getAllMathLessons()
  ];
};

// Lấy bài học theo ID
export const getToanLesson = (lessonId) => {
  // Tìm trong bài bổ sung trước
  if (TOAN_EXTRA_LESSONS[lessonId]) {
    return TOAN_EXTRA_LESSONS[lessonId];
  }
  // Sau đó tìm trong MATH_LESSONS
  return getMathLesson(lessonId);
};

// Lấy bài học theo grade
export const getToanLessonsByGrade = (gradeId) => {
  const grade = TOAN_GRADES.find(g => g.id === gradeId);
  if (!grade) return [];

  const allLessons = getAllToanLessons();
  return allLessons.filter(lesson => grade.levels.includes(lesson.level));
};

// Lấy bài học theo level
export const getToanLessonsByLevel = (level) => {
  const allLessons = getAllToanLessons();
  return allLessons.filter(lesson => lesson.level === level);
};

// Lấy info grade
export const getGradeInfo = (gradeId) => {
  return TOAN_GRADES.find(g => g.id === gradeId) || null;
};

// Thống kê
export const getToanStats = () => {
  return {
    totalGrades: TOAN_GRADES.length,
    totalLessons: getAllToanLessons().length,
    grades: TOAN_GRADES.map(g => ({
      id: g.id,
      title: g.title,
      lessonCount: getToanLessonsByGrade(g.id).length
    }))
  };
};

// ============================================
// EXPORTS
// ============================================
export {
  MATH_LESSONS,
  MATH_IMAGES,
  getMathLesson,
  getAllMathLessons,
  getMathLessonsByLevel,
  getNextMathLesson
};

export default TOAN_GRADES;
