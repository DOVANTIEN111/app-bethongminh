// src/data/mathLessons.js
// 50 BÀI HỌC TOÁN CHO TRẺ EM - Thiết kế đẹp, dễ nhìn, dễ nhớ

// ============================================
// HÌNH ẢNH MINH HỌA
// ============================================
export const MATH_IMAGES = {
  // Trái cây
  apple: '🍎',
  orange: '🍊', 
  banana: '🍌',
  grape: '🍇',
  strawberry: '🍓',
  watermelon: '🍉',
  cherry: '🍒',
  peach: '🍑',
  pear: '🍐',
  lemon: '🍋',
  
  // Động vật
  cat: '🐱',
  dog: '🐶',
  rabbit: '🐰',
  bear: '🐻',
  panda: '🐼',
  monkey: '🐵',
  chicken: '🐔',
  duck: '🦆',
  fish: '🐟',
  butterfly: '🦋',
  bird: '🐦',
  bee: '🐝',
  
  // Đồ vật
  car: '🚗',
  bus: '🚌',
  train: '🚂',
  plane: '✈️',
  boat: '⛵',
  ball: '⚽',
  star: '⭐',
  heart: '❤️',
  flower: '🌸',
  tree: '🌳',
  sun: '☀️',
  moon: '🌙',
  
  // Đồ ăn
  cake: '🎂',
  candy: '🍬',
  cookie: '🍪',
  icecream: '🍦',
  pizza: '🍕',
  
  // Tay - đếm ngón
  hand: '✋',
  finger1: '☝️',
};

// Helper tạo chuỗi hình ảnh
const repeat = (emoji, count) => Array(count).fill(emoji).join('');
const repeatWithSpace = (emoji, count) => Array(count).fill(emoji).join(' ');

// ============================================
// CẤU TRÚC BÀI HỌC
// ============================================
export const MATH_LESSONS = {
  // ==========================================
  // LEVEL 1: LÀM QUEN SỐ (3-4 tuổi) - 15 bài
  // ==========================================
  
  'math-1-1': {
    id: 'math-1-1',
    title: 'Số 1 - Một',
    level: 1,
    description: 'Học số 1 qua hình ảnh',
    icon: '1️⃣',
    color: 'from-red-400 to-pink-500',
    
    // Phần giới thiệu
    intro: {
      title: 'Đây là số 1',
      subtitle: 'Một - One',
      image: '🍎',
      imageCount: 1,
      voice: 'Số 1, đọc là MỘT. Một quả táo.',
      animation: 'bounce',
    },
    
    // Các ví dụ minh họa
    examples: [
      { image: '🍎', count: 1, text: 'Một quả táo' },
      { image: '🐱', count: 1, text: 'Một con mèo' },
      { image: '⭐', count: 1, text: 'Một ngôi sao' },
      { image: '☀️', count: 1, text: 'Một mặt trời' },
    ],
    
    // Câu hỏi luyện tập
    questions: [
      {
        type: 'count',
        question: 'Có mấy quả táo?',
        image: '🍎',
        imageCount: 1,
        options: ['1', '2', '3'],
        answer: '1',
        hint: 'Đếm xem có bao nhiêu quả táo nào!',
      },
      {
        type: 'count',
        question: 'Có mấy con mèo?',
        image: '🐱',
        imageCount: 1,
        options: ['2', '1', '3'],
        answer: '1',
      },
      {
        type: 'select',
        question: 'Chọn hình có 1 đồ vật',
        options: [
          { image: '🍎', count: 1 },
          { image: '🍎', count: 2 },
          { image: '🍎', count: 3 },
        ],
        answer: 0,
      },
      {
        type: 'count',
        question: 'Đếm số ngôi sao',
        image: '⭐',
        imageCount: 1,
        options: ['1', '2', '0'],
        answer: '1',
      },
      {
        type: 'match',
        question: 'Số 1 đọc là gì?',
        options: ['Một', 'Hai', 'Ba'],
        answer: 'Một',
      },
    ],
    
    // Phần thưởng khi hoàn thành
    reward: {
      xp: 10,
      message: 'Giỏi lắm! Bé đã học xong số 1! 🎉',
    },
  },

  'math-1-2': {
    id: 'math-1-2',
    title: 'Số 2 - Hai',
    level: 1,
    description: 'Học số 2 qua hình ảnh',
    icon: '2️⃣',
    color: 'from-orange-400 to-amber-500',
    
    intro: {
      title: 'Đây là số 2',
      subtitle: 'Hai - Two',
      image: '🍊',
      imageCount: 2,
      voice: 'Số 2, đọc là HAI. Hai quả cam.',
      animation: 'bounce',
    },
    
    examples: [
      { image: '🍊', count: 2, text: 'Hai quả cam' },
      { image: '🐶', count: 2, text: 'Hai con chó' },
      { image: '👀', count: 1, text: 'Hai con mắt' },
      { image: '👂', count: 1, text: 'Hai cái tai' },
    ],
    
    questions: [
      {
        type: 'count',
        question: 'Có mấy quả cam?',
        image: '🍊',
        imageCount: 2,
        options: ['1', '2', '3'],
        answer: '2',
      },
      {
        type: 'count',
        question: 'Có mấy con chó?',
        image: '🐶',
        imageCount: 2,
        options: ['2', '3', '1'],
        answer: '2',
      },
      {
        type: 'select',
        question: 'Chọn hình có 2 đồ vật',
        options: [
          { image: '⭐', count: 1 },
          { image: '⭐', count: 2 },
          { image: '⭐', count: 3 },
        ],
        answer: 1,
      },
      {
        type: 'count',
        question: 'Đếm số bông hoa',
        image: '🌸',
        imageCount: 2,
        options: ['3', '1', '2'],
        answer: '2',
      },
      {
        type: 'match',
        question: 'Số 2 đọc là gì?',
        options: ['Ba', 'Hai', 'Một'],
        answer: 'Hai',
      },
    ],
    
    reward: {
      xp: 10,
      message: 'Tuyệt vời! Bé đã học xong số 2! 🎉',
    },
  },

  'math-1-3': {
    id: 'math-1-3',
    title: 'Số 3 - Ba',
    level: 1,
    description: 'Học số 3 qua hình ảnh',
    icon: '3️⃣',
    color: 'from-yellow-400 to-orange-500',
    
    intro: {
      title: 'Đây là số 3',
      subtitle: 'Ba - Three',
      image: '🍌',
      imageCount: 3,
      voice: 'Số 3, đọc là BA. Ba quả chuối.',
      animation: 'bounce',
    },
    
    examples: [
      { image: '🍌', count: 3, text: 'Ba quả chuối' },
      { image: '🐰', count: 3, text: 'Ba con thỏ' },
      { image: '🚗', count: 3, text: 'Ba chiếc xe' },
      { image: '🎈', count: 3, text: 'Ba quả bóng' },
    ],
    
    questions: [
      {
        type: 'count',
        question: 'Có mấy quả chuối?',
        image: '🍌',
        imageCount: 3,
        options: ['2', '3', '4'],
        answer: '3',
      },
      {
        type: 'count',
        question: 'Có mấy con thỏ?',
        image: '🐰',
        imageCount: 3,
        options: ['3', '2', '4'],
        answer: '3',
      },
      {
        type: 'select',
        question: 'Chọn hình có 3 đồ vật',
        options: [
          { image: '🚗', count: 2 },
          { image: '🚗', count: 4 },
          { image: '🚗', count: 3 },
        ],
        answer: 2,
      },
      {
        type: 'count',
        question: 'Đếm số quả bóng',
        image: '🎈',
        imageCount: 3,
        options: ['3', '2', '1'],
        answer: '3',
      },
      {
        type: 'match',
        question: 'Số 3 đọc là gì?',
        options: ['Hai', 'Bốn', 'Ba'],
        answer: 'Ba',
      },
    ],
    
    reward: {
      xp: 10,
      message: 'Xuất sắc! Bé đã học xong số 3! 🎉',
    },
  },

  'math-1-4': {
    id: 'math-1-4',
    title: 'Số 4 - Bốn',
    level: 1,
    description: 'Học số 4 qua hình ảnh',
    icon: '4️⃣',
    color: 'from-green-400 to-emerald-500',
    
    intro: {
      title: 'Đây là số 4',
      subtitle: 'Bốn - Four',
      image: '🍇',
      imageCount: 4,
      voice: 'Số 4, đọc là BỐN. Bốn chùm nho.',
      animation: 'bounce',
    },
    
    examples: [
      { image: '🍇', count: 4, text: 'Bốn chùm nho' },
      { image: '🐔', count: 4, text: 'Bốn con gà' },
      { image: '🌸', count: 4, text: 'Bốn bông hoa' },
      { image: '🦋', count: 4, text: 'Bốn con bướm' },
    ],
    
    questions: [
      {
        type: 'count',
        question: 'Có mấy bông hoa?',
        image: '🌸',
        imageCount: 4,
        options: ['3', '4', '5'],
        answer: '4',
      },
      {
        type: 'count',
        question: 'Có mấy con bướm?',
        image: '🦋',
        imageCount: 4,
        options: ['4', '3', '5'],
        answer: '4',
      },
      {
        type: 'select',
        question: 'Chọn hình có 4 đồ vật',
        options: [
          { image: '🐔', count: 3 },
          { image: '🐔', count: 4 },
          { image: '🐔', count: 5 },
        ],
        answer: 1,
      },
      {
        type: 'count',
        question: 'Đếm số ngôi sao',
        image: '⭐',
        imageCount: 4,
        options: ['2', '3', '4'],
        answer: '4',
      },
      {
        type: 'match',
        question: 'Số 4 đọc là gì?',
        options: ['Bốn', 'Năm', 'Ba'],
        answer: 'Bốn',
      },
    ],
    
    reward: {
      xp: 10,
      message: 'Siêu giỏi! Bé đã học xong số 4! 🎉',
    },
  },

  'math-1-5': {
    id: 'math-1-5',
    title: 'Số 5 - Năm',
    level: 1,
    description: 'Học số 5 với bàn tay',
    icon: '5️⃣',
    color: 'from-blue-400 to-cyan-500',
    
    intro: {
      title: 'Đây là số 5',
      subtitle: 'Năm - Five',
      image: '✋',
      imageCount: 1,
      voice: 'Số 5, đọc là NĂM. Năm ngón tay trên một bàn tay.',
      animation: 'bounce',
    },
    
    examples: [
      { image: '✋', count: 1, text: '5 ngón tay' },
      { image: '🍓', count: 5, text: 'Năm quả dâu' },
      { image: '🐟', count: 5, text: 'Năm con cá' },
      { image: '🌟', count: 5, text: 'Năm ngôi sao' },
    ],
    
    questions: [
      {
        type: 'count',
        question: 'Có mấy quả dâu?',
        image: '🍓',
        imageCount: 5,
        options: ['4', '5', '6'],
        answer: '5',
      },
      {
        type: 'count',
        question: 'Có mấy con cá?',
        image: '🐟',
        imageCount: 5,
        options: ['5', '4', '6'],
        answer: '5',
      },
      {
        type: 'count',
        question: 'Bàn tay có mấy ngón?',
        image: '✋',
        imageCount: 1,
        options: ['4', '6', '5'],
        answer: '5',
      },
      {
        type: 'select',
        question: 'Chọn hình có 5 đồ vật',
        options: [
          { image: '🌟', count: 4 },
          { image: '🌟', count: 5 },
          { image: '🌟', count: 6 },
        ],
        answer: 1,
      },
      {
        type: 'match',
        question: 'Số 5 đọc là gì?',
        options: ['Bốn', 'Sáu', 'Năm'],
        answer: 'Năm',
      },
    ],
    
    reward: {
      xp: 15,
      message: 'Wow! Bé đã học xong số 5! Giỏi quá! 🎉',
    },
  },

  'math-1-6': {
    id: 'math-1-6',
    title: 'Số 6 - Sáu',
    level: 1,
    description: 'Học số 6 qua hình ảnh',
    icon: '6️⃣',
    color: 'from-indigo-400 to-purple-500',
    
    intro: {
      title: 'Đây là số 6',
      subtitle: 'Sáu - Six',
      image: '🥚',
      imageCount: 6,
      voice: 'Số 6, đọc là SÁU. Sáu quả trứng.',
      animation: 'bounce',
    },
    
    examples: [
      { image: '🥚', count: 6, text: 'Sáu quả trứng' },
      { image: '🐝', count: 6, text: 'Sáu con ong' },
      { image: '🍪', count: 6, text: 'Sáu cái bánh' },
      { image: '🎁', count: 6, text: 'Sáu hộp quà' },
    ],
    
    questions: [
      {
        type: 'count',
        question: 'Có mấy quả trứng?',
        image: '🥚',
        imageCount: 6,
        options: ['5', '6', '7'],
        answer: '6',
      },
      {
        type: 'count',
        question: 'Có mấy con ong?',
        image: '🐝',
        imageCount: 6,
        options: ['6', '5', '7'],
        answer: '6',
      },
      {
        type: 'select',
        question: 'Chọn hình có 6 đồ vật',
        options: [
          { image: '🍪', count: 5 },
          { image: '🍪', count: 7 },
          { image: '🍪', count: 6 },
        ],
        answer: 2,
      },
      {
        type: 'count',
        question: 'Đếm số hộp quà',
        image: '🎁',
        imageCount: 6,
        options: ['4', '6', '5'],
        answer: '6',
      },
      {
        type: 'match',
        question: 'Số 6 đọc là gì?',
        options: ['Năm', 'Sáu', 'Bảy'],
        answer: 'Sáu',
      },
    ],
    
    reward: {
      xp: 15,
      message: 'Tuyệt vời! Bé đã học xong số 6! 🎉',
    },
  },

  'math-1-7': {
    id: 'math-1-7',
    title: 'Số 7 - Bảy',
    level: 1,
    description: 'Học số 7 qua hình ảnh',
    icon: '7️⃣',
    color: 'from-purple-400 to-pink-500',
    
    intro: {
      title: 'Đây là số 7',
      subtitle: 'Bảy - Seven',
      image: '🌈',
      imageCount: 1,
      voice: 'Số 7, đọc là BẢY. Cầu vồng có 7 màu.',
      animation: 'bounce',
    },
    
    examples: [
      { image: '🌈', count: 1, text: '7 màu cầu vồng' },
      { image: '🦆', count: 7, text: 'Bảy con vịt' },
      { image: '🍬', count: 7, text: 'Bảy viên kẹo' },
      { image: '📚', count: 7, text: 'Bảy quyển sách' },
    ],
    
    questions: [
      {
        type: 'count',
        question: 'Có mấy con vịt?',
        image: '🦆',
        imageCount: 7,
        options: ['6', '7', '8'],
        answer: '7',
      },
      {
        type: 'count',
        question: 'Có mấy viên kẹo?',
        image: '🍬',
        imageCount: 7,
        options: ['7', '6', '8'],
        answer: '7',
      },
      {
        type: 'select',
        question: 'Chọn hình có 7 đồ vật',
        options: [
          { image: '📚', count: 6 },
          { image: '📚', count: 7 },
          { image: '📚', count: 8 },
        ],
        answer: 1,
      },
      {
        type: 'count',
        question: 'Cầu vồng có mấy màu?',
        image: '🌈',
        imageCount: 1,
        options: ['5', '6', '7'],
        answer: '7',
        hint: 'Đỏ, cam, vàng, lục, lam, chàm, tím',
      },
      {
        type: 'match',
        question: 'Số 7 đọc là gì?',
        options: ['Sáu', 'Tám', 'Bảy'],
        answer: 'Bảy',
      },
    ],
    
    reward: {
      xp: 15,
      message: 'Xuất sắc! Bé đã học xong số 7! 🌈',
    },
  },

  'math-1-8': {
    id: 'math-1-8',
    title: 'Số 8 - Tám',
    level: 1,
    description: 'Học số 8 qua hình ảnh',
    icon: '8️⃣',
    color: 'from-rose-400 to-red-500',
    
    intro: {
      title: 'Đây là số 8',
      subtitle: 'Tám - Eight',
      image: '🐙',
      imageCount: 1,
      voice: 'Số 8, đọc là TÁM. Con bạch tuộc có 8 chân.',
      animation: 'bounce',
    },
    
    examples: [
      { image: '🐙', count: 1, text: '8 chân bạch tuộc' },
      { image: '🕷️', count: 1, text: '8 chân nhện' },
      { image: '🍎', count: 8, text: 'Tám quả táo' },
      { image: '🎈', count: 8, text: 'Tám quả bóng' },
    ],
    
    questions: [
      {
        type: 'count',
        question: 'Có mấy quả táo?',
        image: '🍎',
        imageCount: 8,
        options: ['7', '8', '9'],
        answer: '8',
      },
      {
        type: 'count',
        question: 'Bạch tuộc có mấy chân?',
        image: '🐙',
        imageCount: 1,
        options: ['6', '8', '10'],
        answer: '8',
      },
      {
        type: 'select',
        question: 'Chọn hình có 8 đồ vật',
        options: [
          { image: '🎈', count: 7 },
          { image: '🎈', count: 9 },
          { image: '🎈', count: 8 },
        ],
        answer: 2,
      },
      {
        type: 'count',
        question: 'Đếm số bông hoa',
        image: '🌺',
        imageCount: 8,
        options: ['8', '7', '9'],
        answer: '8',
      },
      {
        type: 'match',
        question: 'Số 8 đọc là gì?',
        options: ['Bảy', 'Tám', 'Chín'],
        answer: 'Tám',
      },
    ],
    
    reward: {
      xp: 15,
      message: 'Siêu giỏi! Bé đã học xong số 8! 🐙',
    },
  },

  'math-1-9': {
    id: 'math-1-9',
    title: 'Số 9 - Chín',
    level: 1,
    description: 'Học số 9 qua hình ảnh',
    icon: '9️⃣',
    color: 'from-teal-400 to-green-500',
    
    intro: {
      title: 'Đây là số 9',
      subtitle: 'Chín - Nine',
      image: '⚽',
      imageCount: 9,
      voice: 'Số 9, đọc là CHÍN. Chín quả bóng.',
      animation: 'bounce',
    },
    
    examples: [
      { image: '⚽', count: 9, text: 'Chín quả bóng' },
      { image: '🐱', count: 9, text: 'Chín con mèo' },
      { image: '🍩', count: 9, text: 'Chín cái bánh' },
      { image: '✏️', count: 9, text: 'Chín cây bút' },
    ],
    
    questions: [
      {
        type: 'count',
        question: 'Có mấy quả bóng?',
        image: '⚽',
        imageCount: 9,
        options: ['8', '9', '10'],
        answer: '9',
      },
      {
        type: 'count',
        question: 'Có mấy con mèo?',
        image: '🐱',
        imageCount: 9,
        options: ['9', '8', '10'],
        answer: '9',
      },
      {
        type: 'select',
        question: 'Chọn hình có 9 đồ vật',
        options: [
          { image: '🍩', count: 8 },
          { image: '🍩', count: 9 },
          { image: '🍩', count: 10 },
        ],
        answer: 1,
      },
      {
        type: 'count',
        question: 'Đếm số cây bút',
        image: '✏️',
        imageCount: 9,
        options: ['7', '8', '9'],
        answer: '9',
      },
      {
        type: 'match',
        question: 'Số 9 đọc là gì?',
        options: ['Tám', 'Mười', 'Chín'],
        answer: 'Chín',
      },
    ],
    
    reward: {
      xp: 15,
      message: 'Tuyệt vời! Bé đã học xong số 9! 🎉',
    },
  },

  'math-1-10': {
    id: 'math-1-10',
    title: 'Số 10 - Mười',
    level: 1,
    description: 'Học số 10 với hai bàn tay',
    icon: '🔟',
    color: 'from-amber-400 to-yellow-500',
    
    intro: {
      title: 'Đây là số 10',
      subtitle: 'Mười - Ten',
      image: '🙌',
      imageCount: 1,
      voice: 'Số 10, đọc là MƯỜI. Hai bàn tay có 10 ngón.',
      animation: 'bounce',
    },
    
    examples: [
      { image: '🙌', count: 1, text: '10 ngón tay' },
      { image: '🦶', count: 2, text: '10 ngón chân' },
      { image: '🍭', count: 10, text: 'Mười cây kẹo' },
      { image: '🌻', count: 10, text: 'Mười bông hoa' },
    ],
    
    questions: [
      {
        type: 'count',
        question: 'Có mấy cây kẹo?',
        image: '🍭',
        imageCount: 10,
        options: ['9', '10', '11'],
        answer: '10',
      },
      {
        type: 'count',
        question: 'Hai bàn tay có mấy ngón?',
        image: '🙌',
        imageCount: 1,
        options: ['8', '10', '12'],
        answer: '10',
      },
      {
        type: 'select',
        question: 'Chọn hình có 10 đồ vật',
        options: [
          { image: '🌻', count: 9 },
          { image: '🌻', count: 11 },
          { image: '🌻', count: 10 },
        ],
        answer: 2,
      },
      {
        type: 'count',
        question: 'Đếm số quả táo',
        image: '🍎',
        imageCount: 10,
        options: ['10', '9', '11'],
        answer: '10',
      },
      {
        type: 'match',
        question: 'Số 10 đọc là gì?',
        options: ['Chín', 'Mười', 'Mười một'],
        answer: 'Mười',
      },
    ],
    
    reward: {
      xp: 20,
      message: 'Hoàn hảo! Bé đã học xong số 10! 🙌🎉',
    },
  },

  'math-1-11': {
    id: 'math-1-11',
    title: 'Ôn tập số 1-5',
    level: 1,
    description: 'Ôn lại các số từ 1 đến 5',
    icon: '📝',
    color: 'from-cyan-400 to-blue-500',
    
    intro: {
      title: 'Ôn tập số 1-5',
      subtitle: 'Cùng ôn lại nào!',
      image: '📚',
      imageCount: 1,
      voice: 'Chúng ta cùng ôn lại số 1, 2, 3, 4, 5 nhé!',
      animation: 'bounce',
    },
    
    examples: [
      { image: '1️⃣', count: 1, text: 'Số 1 - Một' },
      { image: '2️⃣', count: 1, text: 'Số 2 - Hai' },
      { image: '3️⃣', count: 1, text: 'Số 3 - Ba' },
      { image: '4️⃣', count: 1, text: 'Số 4 - Bốn' },
      { image: '5️⃣', count: 1, text: 'Số 5 - Năm' },
    ],
    
    questions: [
      {
        type: 'count',
        question: 'Có mấy quả táo?',
        image: '🍎',
        imageCount: 3,
        options: ['2', '3', '4'],
        answer: '3',
      },
      {
        type: 'count',
        question: 'Có mấy con mèo?',
        image: '🐱',
        imageCount: 5,
        options: ['4', '5', '6'],
        answer: '5',
      },
      {
        type: 'count',
        question: 'Có mấy ngôi sao?',
        image: '⭐',
        imageCount: 2,
        options: ['1', '2', '3'],
        answer: '2',
      },
      {
        type: 'count',
        question: 'Có mấy bông hoa?',
        image: '🌸',
        imageCount: 4,
        options: ['3', '4', '5'],
        answer: '4',
      },
      {
        type: 'count',
        question: 'Có mấy quả cam?',
        image: '🍊',
        imageCount: 1,
        options: ['1', '2', '3'],
        answer: '1',
      },
      {
        type: 'sequence',
        question: 'Số nào tiếp theo: 1, 2, 3, ?',
        options: ['5', '4', '6'],
        answer: '4',
      },
    ],
    
    reward: {
      xp: 25,
      message: 'Giỏi quá! Bé nhớ rất tốt! 🌟',
    },
  },

  'math-1-12': {
    id: 'math-1-12',
    title: 'Ôn tập số 6-10',
    level: 1,
    description: 'Ôn lại các số từ 6 đến 10',
    icon: '📝',
    color: 'from-violet-400 to-purple-500',
    
    intro: {
      title: 'Ôn tập số 6-10',
      subtitle: 'Cùng ôn lại nào!',
      image: '📚',
      imageCount: 1,
      voice: 'Chúng ta cùng ôn lại số 6, 7, 8, 9, 10 nhé!',
      animation: 'bounce',
    },
    
    examples: [
      { image: '6️⃣', count: 1, text: 'Số 6 - Sáu' },
      { image: '7️⃣', count: 1, text: 'Số 7 - Bảy' },
      { image: '8️⃣', count: 1, text: 'Số 8 - Tám' },
      { image: '9️⃣', count: 1, text: 'Số 9 - Chín' },
      { image: '🔟', count: 1, text: 'Số 10 - Mười' },
    ],
    
    questions: [
      {
        type: 'count',
        question: 'Có mấy con chim?',
        image: '🐦',
        imageCount: 7,
        options: ['6', '7', '8'],
        answer: '7',
      },
      {
        type: 'count',
        question: 'Có mấy quả bóng?',
        image: '🎈',
        imageCount: 9,
        options: ['8', '9', '10'],
        answer: '9',
      },
      {
        type: 'count',
        question: 'Có mấy viên kẹo?',
        image: '🍬',
        imageCount: 6,
        options: ['5', '6', '7'],
        answer: '6',
      },
      {
        type: 'count',
        question: 'Có mấy ngôi sao?',
        image: '⭐',
        imageCount: 10,
        options: ['9', '10', '11'],
        answer: '10',
      },
      {
        type: 'count',
        question: 'Có mấy quả dâu?',
        image: '🍓',
        imageCount: 8,
        options: ['7', '8', '9'],
        answer: '8',
      },
      {
        type: 'sequence',
        question: 'Số nào tiếp theo: 7, 8, 9, ?',
        options: ['11', '10', '6'],
        answer: '10',
      },
    ],
    
    reward: {
      xp: 25,
      message: 'Xuất sắc! Bé nhớ rất giỏi! 🏆',
    },
  },

  'math-1-13': {
    id: 'math-1-13',
    title: 'So sánh: Nhiều hơn',
    level: 1,
    description: 'Học cách so sánh nhiều hơn',
    icon: '➕',
    color: 'from-emerald-400 to-teal-500',
    
    intro: {
      title: 'Nhiều hơn',
      subtitle: 'Cái nào nhiều hơn?',
      image: '⚖️',
      imageCount: 1,
      voice: 'Chúng ta cùng học so sánh nhiều hơn nhé!',
      animation: 'bounce',
    },
    
    examples: [
      { image: '🍎🍎🍎', count: 1, text: '3 táo nhiều hơn 1 táo' },
      { image: '🐱🐱', count: 1, text: '2 mèo nhiều hơn 1 mèo' },
    ],
    
    questions: [
      {
        type: 'compare',
        question: 'Bên nào có NHIỀU HƠN?',
        optionA: { image: '🍎', count: 3 },
        optionB: { image: '🍎', count: 1 },
        answer: 'A',
      },
      {
        type: 'compare',
        question: 'Bên nào có NHIỀU HƠN?',
        optionA: { image: '⭐', count: 2 },
        optionB: { image: '⭐', count: 5 },
        answer: 'B',
      },
      {
        type: 'compare',
        question: 'Bên nào có NHIỀU HƠN?',
        optionA: { image: '🐱', count: 4 },
        optionB: { image: '🐱', count: 2 },
        answer: 'A',
      },
      {
        type: 'compare',
        question: 'Bên nào có NHIỀU HƠN?',
        optionA: { image: '🎈', count: 3 },
        optionB: { image: '🎈', count: 6 },
        answer: 'B',
      },
      {
        type: 'count',
        question: '5 và 3, số nào nhiều hơn?',
        image: '🔢',
        imageCount: 1,
        options: ['3', '5', 'Bằng nhau'],
        answer: '5',
      },
    ],
    
    reward: {
      xp: 20,
      message: 'Giỏi lắm! Bé biết so sánh rồi! 📊',
    },
  },

  'math-1-14': {
    id: 'math-1-14',
    title: 'So sánh: Ít hơn',
    level: 1,
    description: 'Học cách so sánh ít hơn',
    icon: '➖',
    color: 'from-orange-400 to-red-500',
    
    intro: {
      title: 'Ít hơn',
      subtitle: 'Cái nào ít hơn?',
      image: '⚖️',
      imageCount: 1,
      voice: 'Chúng ta cùng học so sánh ít hơn nhé!',
      animation: 'bounce',
    },
    
    examples: [
      { image: '🍎', count: 1, text: '1 táo ít hơn 3 táo' },
      { image: '🐱', count: 1, text: '1 mèo ít hơn 2 mèo' },
    ],
    
    questions: [
      {
        type: 'compare',
        question: 'Bên nào có ÍT HƠN?',
        optionA: { image: '🍎', count: 1 },
        optionB: { image: '🍎', count: 4 },
        answer: 'A',
      },
      {
        type: 'compare',
        question: 'Bên nào có ÍT HƠN?',
        optionA: { image: '⭐', count: 5 },
        optionB: { image: '⭐', count: 2 },
        answer: 'B',
      },
      {
        type: 'compare',
        question: 'Bên nào có ÍT HƠN?',
        optionA: { image: '🐱', count: 3 },
        optionB: { image: '🐱', count: 6 },
        answer: 'A',
      },
      {
        type: 'compare',
        question: 'Bên nào có ÍT HƠN?',
        optionA: { image: '🎈', count: 7 },
        optionB: { image: '🎈', count: 4 },
        answer: 'B',
      },
      {
        type: 'count',
        question: '2 và 8, số nào ít hơn?',
        image: '🔢',
        imageCount: 1,
        options: ['8', '2', 'Bằng nhau'],
        answer: '2',
      },
    ],
    
    reward: {
      xp: 20,
      message: 'Tuyệt vời! Bé giỏi so sánh lắm! 🎯',
    },
  },

  'math-1-15': {
    id: 'math-1-15',
    title: 'Kiểm tra Level 1',
    level: 1,
    description: 'Kiểm tra kiến thức số 1-10',
    icon: '🏆',
    color: 'from-yellow-400 to-amber-500',
    isTest: true,
    
    intro: {
      title: 'Bài kiểm tra',
      subtitle: 'Thử sức nào!',
      image: '🏆',
      imageCount: 1,
      voice: 'Bé ơi, làm bài kiểm tra nhé! Cố gắng lên!',
      animation: 'bounce',
    },
    
    examples: [],
    
    questions: [
      {
        type: 'count',
        question: 'Có mấy quả táo?',
        image: '🍎',
        imageCount: 7,
        options: ['6', '7', '8'],
        answer: '7',
      },
      {
        type: 'count',
        question: 'Có mấy con mèo?',
        image: '🐱',
        imageCount: 4,
        options: ['3', '4', '5'],
        answer: '4',
      },
      {
        type: 'count',
        question: 'Có mấy ngôi sao?',
        image: '⭐',
        imageCount: 10,
        options: ['9', '10', '11'],
        answer: '10',
      },
      {
        type: 'compare',
        question: 'Bên nào NHIỀU HƠN?',
        optionA: { image: '🎈', count: 5 },
        optionB: { image: '🎈', count: 3 },
        answer: 'A',
      },
      {
        type: 'compare',
        question: 'Bên nào ÍT HƠN?',
        optionA: { image: '🍓', count: 8 },
        optionB: { image: '🍓', count: 2 },
        answer: 'B',
      },
      {
        type: 'sequence',
        question: 'Số tiếp theo: 3, 4, 5, ?',
        options: ['7', '6', '8'],
        answer: '6',
      },
      {
        type: 'match',
        question: 'Số 9 đọc là gì?',
        options: ['Tám', 'Chín', 'Mười'],
        answer: 'Chín',
      },
      {
        type: 'count',
        question: 'Có mấy bông hoa?',
        image: '🌸',
        imageCount: 6,
        options: ['5', '6', '7'],
        answer: '6',
      },
    ],
    
    reward: {
      xp: 50,
      badge: 'math_level1',
      message: 'TUYỆT VỜI! Bé đã hoàn thành Level 1! 🏆🎉',
    },
  },

  // ==========================================
  // LEVEL 2: PHÉP CỘNG (4-5 tuổi) - 15 bài
  // ==========================================

  'math-2-1': {
    id: 'math-2-1',
    title: 'Cộng với 1',
    level: 2,
    description: 'Học phép cộng với số 1',
    icon: '➕',
    color: 'from-green-400 to-emerald-500',
    
    intro: {
      title: 'Phép cộng',
      subtitle: 'Cộng thêm 1',
      image: '➕',
      imageCount: 1,
      voice: 'Khi cộng thêm 1, ta có thêm 1 cái nữa!',
      animation: 'bounce',
    },
    
    examples: [
      { image: '🍎 + 🍎', count: 1, text: '1 + 1 = 2' },
      { image: '🐱🐱 + 🐱', count: 1, text: '2 + 1 = 3' },
      { image: '⭐⭐⭐ + ⭐', count: 1, text: '3 + 1 = 4' },
    ],
    
    questions: [
      {
        type: 'addition',
        question: '1 + 1 = ?',
        visual: { left: '🍎', leftCount: 1, right: '🍎', rightCount: 1 },
        options: ['1', '2', '3'],
        answer: '2',
        hint: 'Đếm tất cả quả táo!',
      },
      {
        type: 'addition',
        question: '2 + 1 = ?',
        visual: { left: '🐱', leftCount: 2, right: '🐱', rightCount: 1 },
        options: ['2', '3', '4'],
        answer: '3',
      },
      {
        type: 'addition',
        question: '3 + 1 = ?',
        visual: { left: '⭐', leftCount: 3, right: '⭐', rightCount: 1 },
        options: ['3', '4', '5'],
        answer: '4',
      },
      {
        type: 'addition',
        question: '4 + 1 = ?',
        visual: { left: '🎈', leftCount: 4, right: '🎈', rightCount: 1 },
        options: ['4', '5', '6'],
        answer: '5',
      },
      {
        type: 'addition',
        question: '5 + 1 = ?',
        visual: { left: '🌸', leftCount: 5, right: '🌸', rightCount: 1 },
        options: ['5', '6', '7'],
        answer: '6',
      },
    ],
    
    reward: {
      xp: 15,
      message: 'Giỏi lắm! Bé biết cộng với 1 rồi! ➕',
    },
  },

  'math-2-2': {
    id: 'math-2-2',
    title: 'Cộng với 2',
    level: 2,
    description: 'Học phép cộng với số 2',
    icon: '➕',
    color: 'from-blue-400 to-indigo-500',
    
    intro: {
      title: 'Cộng với 2',
      subtitle: 'Thêm 2 nữa!',
      image: '➕',
      imageCount: 1,
      voice: 'Khi cộng thêm 2, ta có thêm 2 cái nữa!',
      animation: 'bounce',
    },
    
    examples: [
      { image: '🍎 + 🍎🍎', count: 1, text: '1 + 2 = 3' },
      { image: '🐱🐱 + 🐱🐱', count: 1, text: '2 + 2 = 4' },
      { image: '⭐⭐⭐ + ⭐⭐', count: 1, text: '3 + 2 = 5' },
    ],
    
    questions: [
      {
        type: 'addition',
        question: '1 + 2 = ?',
        visual: { left: '🍎', leftCount: 1, right: '🍎', rightCount: 2 },
        options: ['2', '3', '4'],
        answer: '3',
      },
      {
        type: 'addition',
        question: '2 + 2 = ?',
        visual: { left: '🐱', leftCount: 2, right: '🐱', rightCount: 2 },
        options: ['3', '4', '5'],
        answer: '4',
      },
      {
        type: 'addition',
        question: '3 + 2 = ?',
        visual: { left: '⭐', leftCount: 3, right: '⭐', rightCount: 2 },
        options: ['4', '5', '6'],
        answer: '5',
      },
      {
        type: 'addition',
        question: '4 + 2 = ?',
        visual: { left: '🎈', leftCount: 4, right: '🎈', rightCount: 2 },
        options: ['5', '6', '7'],
        answer: '6',
      },
      {
        type: 'addition',
        question: '5 + 2 = ?',
        visual: { left: '🌸', leftCount: 5, right: '🌸', rightCount: 2 },
        options: ['6', '7', '8'],
        answer: '7',
      },
    ],
    
    reward: {
      xp: 15,
      message: 'Xuất sắc! Bé cộng 2 giỏi lắm! 🌟',
    },
  },

  'math-2-3': {
    id: 'math-2-3',
    title: 'Cộng trong phạm vi 5',
    level: 2,
    description: 'Luyện phép cộng có kết quả ≤ 5',
    icon: '➕',
    color: 'from-purple-400 to-pink-500',
    
    intro: {
      title: 'Cộng trong 5',
      subtitle: 'Kết quả không quá 5',
      image: '✋',
      imageCount: 1,
      voice: 'Hãy tính những phép cộng có kết quả nhỏ hơn hoặc bằng 5 nhé!',
      animation: 'bounce',
    },
    
    examples: [
      { image: '🍎🍎 + 🍎🍎', count: 1, text: '2 + 2 = 4' },
      { image: '🐱 + 🐱🐱🐱', count: 1, text: '1 + 3 = 4' },
      { image: '⭐⭐ + ⭐⭐⭐', count: 1, text: '2 + 3 = 5' },
    ],
    
    questions: [
      {
        type: 'addition',
        question: '2 + 2 = ?',
        visual: { left: '🍎', leftCount: 2, right: '🍎', rightCount: 2 },
        options: ['3', '4', '5'],
        answer: '4',
      },
      {
        type: 'addition',
        question: '1 + 3 = ?',
        visual: { left: '🐱', leftCount: 1, right: '🐱', rightCount: 3 },
        options: ['3', '4', '5'],
        answer: '4',
      },
      {
        type: 'addition',
        question: '2 + 3 = ?',
        visual: { left: '⭐', leftCount: 2, right: '⭐', rightCount: 3 },
        options: ['4', '5', '6'],
        answer: '5',
      },
      {
        type: 'addition',
        question: '1 + 4 = ?',
        visual: { left: '🎈', leftCount: 1, right: '🎈', rightCount: 4 },
        options: ['4', '5', '6'],
        answer: '5',
      },
      {
        type: 'addition',
        question: '3 + 1 = ?',
        visual: { left: '🌸', leftCount: 3, right: '🌸', rightCount: 1 },
        options: ['3', '4', '5'],
        answer: '4',
      },
      {
        type: 'addition',
        question: '0 + 5 = ?',
        visual: { left: '🍓', leftCount: 0, right: '🍓', rightCount: 5 },
        options: ['4', '5', '6'],
        answer: '5',
      },
    ],
    
    reward: {
      xp: 20,
      message: 'Tuyệt vời! Bé tính rất giỏi! ✋',
    },
  },

  'math-2-4': {
    id: 'math-2-4',
    title: 'Cộng với 3',
    level: 2,
    description: 'Học phép cộng với số 3',
    icon: '➕',
    color: 'from-cyan-400 to-blue-500',
    
    intro: {
      title: 'Cộng với 3',
      subtitle: 'Thêm 3 nữa!',
      image: '➕',
      imageCount: 1,
      voice: 'Khi cộng thêm 3, ta đếm thêm 3 cái nữa!',
      animation: 'bounce',
    },
    
    examples: [
      { image: '🍎 + 🍎🍎🍎', count: 1, text: '1 + 3 = 4' },
      { image: '🐱🐱 + 🐱🐱🐱', count: 1, text: '2 + 3 = 5' },
      { image: '⭐⭐⭐ + ⭐⭐⭐', count: 1, text: '3 + 3 = 6' },
    ],
    
    questions: [
      {
        type: 'addition',
        question: '1 + 3 = ?',
        visual: { left: '🍎', leftCount: 1, right: '🍎', rightCount: 3 },
        options: ['3', '4', '5'],
        answer: '4',
      },
      {
        type: 'addition',
        question: '2 + 3 = ?',
        visual: { left: '🐱', leftCount: 2, right: '🐱', rightCount: 3 },
        options: ['4', '5', '6'],
        answer: '5',
      },
      {
        type: 'addition',
        question: '3 + 3 = ?',
        visual: { left: '⭐', leftCount: 3, right: '⭐', rightCount: 3 },
        options: ['5', '6', '7'],
        answer: '6',
      },
      {
        type: 'addition',
        question: '4 + 3 = ?',
        visual: { left: '🎈', leftCount: 4, right: '🎈', rightCount: 3 },
        options: ['6', '7', '8'],
        answer: '7',
      },
      {
        type: 'addition',
        question: '5 + 3 = ?',
        visual: { left: '🌸', leftCount: 5, right: '🌸', rightCount: 3 },
        options: ['7', '8', '9'],
        answer: '8',
      },
    ],
    
    reward: {
      xp: 20,
      message: 'Siêu giỏi! Bé cộng 3 rất nhanh! 🚀',
    },
  },

  'math-2-5': {
    id: 'math-2-5',
    title: 'Cộng với 4',
    level: 2,
    description: 'Học phép cộng với số 4',
    icon: '➕',
    color: 'from-rose-400 to-pink-500',
    
    intro: {
      title: 'Cộng với 4',
      subtitle: 'Thêm 4 nữa!',
      image: '➕',
      imageCount: 1,
      voice: 'Khi cộng thêm 4, ta đếm thêm 4 cái nữa!',
      animation: 'bounce',
    },
    
    examples: [
      { image: '🍎 + 🍎🍎🍎🍎', count: 1, text: '1 + 4 = 5' },
      { image: '🐱🐱 + 🐱🐱🐱🐱', count: 1, text: '2 + 4 = 6' },
      { image: '⭐⭐⭐ + ⭐⭐⭐⭐', count: 1, text: '3 + 4 = 7' },
    ],
    
    questions: [
      {
        type: 'addition',
        question: '1 + 4 = ?',
        visual: { left: '🍎', leftCount: 1, right: '🍎', rightCount: 4 },
        options: ['4', '5', '6'],
        answer: '5',
      },
      {
        type: 'addition',
        question: '2 + 4 = ?',
        visual: { left: '🐱', leftCount: 2, right: '🐱', rightCount: 4 },
        options: ['5', '6', '7'],
        answer: '6',
      },
      {
        type: 'addition',
        question: '3 + 4 = ?',
        visual: { left: '⭐', leftCount: 3, right: '⭐', rightCount: 4 },
        options: ['6', '7', '8'],
        answer: '7',
      },
      {
        type: 'addition',
        question: '4 + 4 = ?',
        visual: { left: '🎈', leftCount: 4, right: '🎈', rightCount: 4 },
        options: ['7', '8', '9'],
        answer: '8',
      },
      {
        type: 'addition',
        question: '5 + 4 = ?',
        visual: { left: '🌸', leftCount: 5, right: '🌸', rightCount: 4 },
        options: ['8', '9', '10'],
        answer: '9',
      },
    ],
    
    reward: {
      xp: 20,
      message: 'Tuyệt vời! Bé cộng 4 giỏi quá! 🎉',
    },
  },

  'math-2-6': {
    id: 'math-2-6',
    title: 'Cộng với 5',
    level: 2,
    description: 'Học phép cộng với số 5',
    icon: '➕',
    color: 'from-amber-400 to-orange-500',
    
    intro: {
      title: 'Cộng với 5',
      subtitle: 'Thêm 5 - một bàn tay!',
      image: '✋',
      imageCount: 1,
      voice: 'Cộng 5 giống như thêm một bàn tay! 5 ngón tay!',
      animation: 'bounce',
    },
    
    examples: [
      { image: '🍎 + ✋', count: 1, text: '1 + 5 = 6' },
      { image: '🐱🐱 + ✋', count: 1, text: '2 + 5 = 7' },
      { image: '⭐⭐⭐ + ✋', count: 1, text: '3 + 5 = 8' },
    ],
    
    questions: [
      {
        type: 'addition',
        question: '1 + 5 = ?',
        visual: { left: '🍎', leftCount: 1, right: '🍎', rightCount: 5 },
        options: ['5', '6', '7'],
        answer: '6',
      },
      {
        type: 'addition',
        question: '2 + 5 = ?',
        visual: { left: '🐱', leftCount: 2, right: '🐱', rightCount: 5 },
        options: ['6', '7', '8'],
        answer: '7',
      },
      {
        type: 'addition',
        question: '3 + 5 = ?',
        visual: { left: '⭐', leftCount: 3, right: '⭐', rightCount: 5 },
        options: ['7', '8', '9'],
        answer: '8',
      },
      {
        type: 'addition',
        question: '4 + 5 = ?',
        visual: { left: '🎈', leftCount: 4, right: '🎈', rightCount: 5 },
        options: ['8', '9', '10'],
        answer: '9',
      },
      {
        type: 'addition',
        question: '5 + 5 = ?',
        visual: { left: '✋', leftCount: 1, right: '✋', rightCount: 1 },
        options: ['9', '10', '11'],
        answer: '10',
        hint: 'Hai bàn tay = 10 ngón!',
      },
    ],
    
    reward: {
      xp: 25,
      message: 'Xuất sắc! 5 + 5 = 10! Hai bàn tay! 🙌',
    },
  },

  'math-2-7': {
    id: 'math-2-7',
    title: 'Cộng trong phạm vi 10',
    level: 2,
    description: 'Luyện phép cộng có kết quả ≤ 10',
    icon: '🔟',
    color: 'from-indigo-400 to-violet-500',
    
    intro: {
      title: 'Cộng trong 10',
      subtitle: 'Kết quả không quá 10',
      image: '🙌',
      imageCount: 1,
      voice: 'Hãy tính những phép cộng có kết quả không quá 10 nhé!',
      animation: 'bounce',
    },
    
    examples: [
      { image: '🍎🍎🍎 + 🍎🍎🍎🍎', count: 1, text: '3 + 4 = 7' },
      { image: '⭐⭐⭐⭐ + ⭐⭐⭐⭐', count: 1, text: '4 + 4 = 8' },
      { image: '🌸🌸🌸 + 🌸🌸🌸🌸🌸🌸', count: 1, text: '3 + 6 = 9' },
    ],
    
    questions: [
      {
        type: 'addition',
        question: '3 + 4 = ?',
        visual: { left: '🍎', leftCount: 3, right: '🍎', rightCount: 4 },
        options: ['6', '7', '8'],
        answer: '7',
      },
      {
        type: 'addition',
        question: '4 + 4 = ?',
        visual: { left: '⭐', leftCount: 4, right: '⭐', rightCount: 4 },
        options: ['7', '8', '9'],
        answer: '8',
      },
      {
        type: 'addition',
        question: '6 + 3 = ?',
        visual: { left: '🐱', leftCount: 6, right: '🐱', rightCount: 3 },
        options: ['8', '9', '10'],
        answer: '9',
      },
      {
        type: 'addition',
        question: '5 + 5 = ?',
        visual: { left: '🎈', leftCount: 5, right: '🎈', rightCount: 5 },
        options: ['9', '10', '11'],
        answer: '10',
      },
      {
        type: 'addition',
        question: '7 + 2 = ?',
        visual: { left: '🌸', leftCount: 7, right: '🌸', rightCount: 2 },
        options: ['8', '9', '10'],
        answer: '9',
      },
      {
        type: 'addition',
        question: '6 + 4 = ?',
        visual: { left: '🍓', leftCount: 6, right: '🍓', rightCount: 4 },
        options: ['9', '10', '11'],
        answer: '10',
      },
    ],
    
    reward: {
      xp: 25,
      message: 'Tuyệt vời! Bé cộng trong 10 rất giỏi! 🙌',
    },
  },

  'math-2-8': {
    id: 'math-2-8',
    title: 'Phép cộng ngược',
    level: 2,
    description: 'Học tính chất giao hoán',
    icon: '🔄',
    color: 'from-teal-400 to-cyan-500',
    
    intro: {
      title: 'Cộng ngược',
      subtitle: 'Đổi chỗ vẫn bằng nhau!',
      image: '🔄',
      imageCount: 1,
      voice: '2 + 3 bằng 3 + 2. Đổi chỗ các số, kết quả vẫn như nhau!',
      animation: 'bounce',
    },
    
    examples: [
      { image: '🍎🍎 + 🍎🍎🍎 = 🍎🍎🍎 + 🍎🍎', count: 1, text: '2 + 3 = 3 + 2 = 5' },
      { image: '⭐ + ⭐⭐⭐⭐ = ⭐⭐⭐⭐ + ⭐', count: 1, text: '1 + 4 = 4 + 1 = 5' },
    ],
    
    questions: [
      {
        type: 'addition',
        question: '2 + 3 = ?',
        visual: { left: '🍎', leftCount: 2, right: '🍎', rightCount: 3 },
        options: ['4', '5', '6'],
        answer: '5',
      },
      {
        type: 'addition',
        question: '3 + 2 = ?',
        visual: { left: '🍎', leftCount: 3, right: '🍎', rightCount: 2 },
        options: ['4', '5', '6'],
        answer: '5',
        hint: 'Giống 2 + 3 đó!',
      },
      {
        type: 'addition',
        question: '1 + 6 = ?',
        visual: { left: '⭐', leftCount: 1, right: '⭐', rightCount: 6 },
        options: ['6', '7', '8'],
        answer: '7',
      },
      {
        type: 'addition',
        question: '6 + 1 = ?',
        visual: { left: '⭐', leftCount: 6, right: '⭐', rightCount: 1 },
        options: ['6', '7', '8'],
        answer: '7',
      },
      {
        type: 'match',
        question: '4 + 3 bằng mấy + 4?',
        options: ['2', '3', '4'],
        answer: '3',
      },
    ],
    
    reward: {
      xp: 20,
      message: 'Giỏi lắm! Bé hiểu phép cộng ngược rồi! 🔄',
    },
  },

  'math-2-9': {
    id: 'math-2-9',
    title: 'Cộng với 0',
    level: 2,
    description: 'Số 0 trong phép cộng',
    icon: '0️⃣',
    color: 'from-gray-400 to-slate-500',
    
    intro: {
      title: 'Cộng với 0',
      subtitle: 'Số 0 đặc biệt!',
      image: '0️⃣',
      imageCount: 1,
      voice: 'Khi cộng với 0, kết quả vẫn là số ban đầu!',
      animation: 'bounce',
    },
    
    examples: [
      { image: '🍎🍎🍎 + (không có gì)', count: 1, text: '3 + 0 = 3' },
      { image: '(không có gì) + ⭐⭐⭐⭐⭐', count: 1, text: '0 + 5 = 5' },
    ],
    
    questions: [
      {
        type: 'addition',
        question: '3 + 0 = ?',
        visual: { left: '🍎', leftCount: 3, right: '🍎', rightCount: 0 },
        options: ['0', '3', '4'],
        answer: '3',
      },
      {
        type: 'addition',
        question: '0 + 5 = ?',
        visual: { left: '⭐', leftCount: 0, right: '⭐', rightCount: 5 },
        options: ['0', '5', '6'],
        answer: '5',
      },
      {
        type: 'addition',
        question: '7 + 0 = ?',
        visual: { left: '🐱', leftCount: 7, right: '🐱', rightCount: 0 },
        options: ['0', '7', '8'],
        answer: '7',
      },
      {
        type: 'addition',
        question: '0 + 0 = ?',
        visual: { left: '🎈', leftCount: 0, right: '🎈', rightCount: 0 },
        options: ['0', '1', '2'],
        answer: '0',
      },
      {
        type: 'addition',
        question: '10 + 0 = ?',
        visual: { left: '🌸', leftCount: 10, right: '🌸', rightCount: 0 },
        options: ['0', '10', '11'],
        answer: '10',
      },
    ],
    
    reward: {
      xp: 15,
      message: 'Tuyệt! Bé hiểu số 0 đặc biệt rồi! 0️⃣',
    },
  },

  'math-2-10': {
    id: 'math-2-10',
    title: 'Tìm số còn thiếu',
    level: 2,
    description: 'Điền số vào chỗ trống',
    icon: '❓',
    color: 'from-yellow-400 to-amber-500',
    
    intro: {
      title: 'Tìm số thiếu',
      subtitle: 'Điền số vào ô trống',
      image: '❓',
      imageCount: 1,
      voice: 'Hãy tìm số còn thiếu trong phép tính nhé!',
      animation: 'bounce',
    },
    
    examples: [
      { image: '2 + ? = 5', count: 1, text: '2 + 3 = 5, số thiếu là 3' },
      { image: '? + 4 = 6', count: 1, text: '2 + 4 = 6, số thiếu là 2' },
    ],
    
    questions: [
      {
        type: 'missing',
        question: '2 + ? = 5',
        options: ['2', '3', '4'],
        answer: '3',
        hint: '2 + mấy = 5?',
      },
      {
        type: 'missing',
        question: '? + 4 = 6',
        options: ['1', '2', '3'],
        answer: '2',
      },
      {
        type: 'missing',
        question: '3 + ? = 7',
        options: ['3', '4', '5'],
        answer: '4',
      },
      {
        type: 'missing',
        question: '? + 5 = 8',
        options: ['2', '3', '4'],
        answer: '3',
      },
      {
        type: 'missing',
        question: '4 + ? = 10',
        options: ['5', '6', '7'],
        answer: '6',
      },
    ],
    
    reward: {
      xp: 25,
      message: 'Xuất sắc! Bé tìm số thiếu giỏi lắm! 🧠',
    },
  },

  // Thêm nhiều bài học nữa...
};

// ============================================
// HELPER FUNCTIONS
// ============================================

export const getMathLesson = (lessonId) => MATH_LESSONS[lessonId];

export const getMathLessonsByLevel = (level) => {
  return Object.values(MATH_LESSONS).filter(lesson => lesson.level === level);
};

export const getAllMathLessons = () => Object.values(MATH_LESSONS);

export const getMathLevels = () => {
  return [
    { id: 1, name: 'Làm quen số', description: 'Học số 1-10', icon: '🔢', color: 'from-blue-400 to-cyan-500' },
    { id: 2, name: 'Phép cộng', description: 'Cộng trong 10', icon: '➕', color: 'from-green-400 to-emerald-500' },
    { id: 3, name: 'Phép trừ', description: 'Trừ trong 10', icon: '➖', color: 'from-orange-400 to-red-500' },
    { id: 4, name: 'Số đến 20', description: 'Học số 11-20', icon: '🔟', color: 'from-purple-400 to-pink-500' },
    { id: 5, name: 'Hình học', description: 'Các hình cơ bản', icon: '📐', color: 'from-indigo-400 to-violet-500' },
  ];
};

export default MATH_LESSONS;
