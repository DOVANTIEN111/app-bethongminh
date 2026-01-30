// src/data/khoahoc/index.js
// TỔNG HỢP NỘI DUNG KHOA HỌC CHO TRẺ 3-10 TUỔI

// Import từ scienceLessons gốc
import {
  SCIENCE_LESSONS,
  getScienceLesson,
  getAllScienceLessons,
  getScienceLessonsByLevel,
  getNextScienceLesson
} from '../scienceLessons';

// ============================================
// CẤU TRÚC KHOA HỌC THEO ĐỘ TUỔI/LỚP
// ============================================
export const KHOA_HOC_GRADES = [
  {
    id: 'mam-non',
    title: 'Mầm non',
    subtitle: '3-5 tuổi',
    description: 'Khám phá thế giới động vật, thực vật',
    icon: '🌱',
    color: 'from-green-400 to-emerald-500',
    bgColor: 'bg-gradient-to-br from-green-100 to-emerald-100',
    levels: [1],
    categories: ['animals', 'plants']
  },
  {
    id: 'lop-1',
    title: 'Lớp 1',
    subtitle: '6-7 tuổi',
    description: 'Môi trường và thời tiết',
    icon: '🌍',
    color: 'from-blue-400 to-cyan-500',
    bgColor: 'bg-gradient-to-br from-blue-100 to-cyan-100',
    levels: [2],
    categories: ['environment', 'weather']
  },
  {
    id: 'lop-2',
    title: 'Lớp 2',
    subtitle: '7-8 tuổi',
    description: 'Cơ thể người và sức khỏe',
    icon: '👤',
    color: 'from-pink-400 to-rose-500',
    bgColor: 'bg-gradient-to-br from-pink-100 to-rose-100',
    levels: [3],
    categories: ['body', 'health']
  },
  {
    id: 'lop-3',
    title: 'Lớp 3',
    subtitle: '8-9 tuổi',
    description: 'Khoa học vui - Vũ trụ và vật lý',
    icon: '🚀',
    color: 'from-purple-400 to-violet-500',
    bgColor: 'bg-gradient-to-br from-purple-100 to-violet-100',
    levels: [4],
    categories: ['space', 'physics']
  },
  {
    id: 'lop-4',
    title: 'Lớp 4',
    subtitle: '9-10 tuổi',
    description: 'Công nghệ và Trái Đất',
    icon: '💻',
    color: 'from-orange-400 to-amber-500',
    bgColor: 'bg-gradient-to-br from-orange-100 to-amber-100',
    levels: [5],
    categories: ['technology', 'earth']
  }
];

// ============================================
// CATEGORIES CHO KHOA HỌC
// ============================================
export const KHOA_HOC_CATEGORIES = [
  {
    id: 'animals',
    title: 'Thế giới động vật',
    icon: '🦁',
    description: 'Tìm hiểu về các loài động vật',
    color: 'from-amber-400 to-orange-500'
  },
  {
    id: 'plants',
    title: 'Thực vật & Hoa quả',
    icon: '🌳',
    description: 'Khám phá cây cối và hoa quả',
    color: 'from-green-400 to-emerald-500'
  },
  {
    id: 'environment',
    title: 'Môi trường',
    icon: '🌍',
    description: 'Bảo vệ môi trường xung quanh',
    color: 'from-teal-400 to-cyan-500'
  },
  {
    id: 'weather',
    title: 'Thời tiết & Mùa',
    icon: '🌤️',
    description: 'Tìm hiểu về thời tiết và các mùa',
    color: 'from-blue-400 to-sky-500'
  },
  {
    id: 'body',
    title: 'Cơ thể người',
    icon: '👤',
    description: 'Các bộ phận và giác quan',
    color: 'from-pink-400 to-rose-500'
  },
  {
    id: 'health',
    title: 'Sức khỏe',
    icon: '🥗',
    description: 'Dinh dưỡng và vệ sinh',
    color: 'from-red-400 to-pink-500'
  },
  {
    id: 'space',
    title: 'Vũ trụ',
    icon: '🌍',
    description: 'Hệ mặt trời và các hành tinh',
    color: 'from-indigo-400 to-purple-500'
  },
  {
    id: 'physics',
    title: 'Vật lý cơ bản',
    icon: '💧',
    description: 'Nước, ánh sáng, âm thanh',
    color: 'from-cyan-400 to-blue-500'
  },
  {
    id: 'technology',
    title: 'Công nghệ',
    icon: '💻',
    description: 'Điện, máy tính, internet',
    color: 'from-violet-400 to-purple-500'
  },
  {
    id: 'earth',
    title: 'Trái Đất',
    icon: '🌋',
    description: 'Núi lửa, động đất, tài nguyên',
    color: 'from-orange-400 to-red-500'
  }
];

// ============================================
// BÀI HỌC BỔ SUNG - CHỦ ĐỀ MỚI
// ============================================
export const KHOA_HOC_EXTRA_LESSONS = {
  // Côn trùng thú vị
  'kh-insects': {
    id: 'kh-insects',
    title: 'Côn trùng thú vị',
    level: 1,
    category: 'animals',
    icon: '🐛',
    description: 'Tìm hiểu về các loài côn trùng',

    intro: {
      title: 'Thế giới côn trùng',
      subtitle: 'Những sinh vật nhỏ bé kỳ diệu',
      image: '🦋',
      voice: 'Côn trùng có 6 chân và rất thú vị!',
    },

    questions: [
      {
        question: 'Côn trùng có mấy chân?',
        image: '🐜',
        options: ['4 chân', '6 chân', '8 chân', '2 chân'],
        answer: 1,
        explanation: 'Tất cả côn trùng đều có 6 chân.',
      },
      {
        question: 'Con nào không phải côn trùng?',
        image: '🕷️',
        options: ['Con kiến', 'Con nhện', 'Con ong', 'Con bướm'],
        answer: 1,
        explanation: 'Nhện có 8 chân nên không phải côn trùng.',
      },
      {
        question: 'Con sâu sẽ biến thành gì?',
        image: '🐛',
        options: ['Con kiến', 'Con bướm', 'Con ong', 'Con ruồi'],
        answer: 1,
        explanation: 'Sâu hóa kén rồi thành bướm xinh đẹp!',
      },
      {
        question: 'Con ong lấy gì từ hoa?',
        image: '🐝',
        options: ['Lá', 'Mật hoa', 'Rễ', 'Hạt'],
        answer: 1,
        explanation: 'Ong hút mật hoa để làm mật ong ngọt ngào.',
      },
    ],
  },

  // Động vật biển
  'kh-sea': {
    id: 'kh-sea',
    title: 'Động vật biển',
    level: 1,
    category: 'animals',
    icon: '🐳',
    description: 'Khám phá đại dương bao la',

    intro: {
      title: 'Dưới đáy đại dương',
      subtitle: 'Những sinh vật biển kỳ diệu',
      image: '🌊',
      voice: 'Biển có rất nhiều động vật thú vị!',
    },

    questions: [
      {
        question: 'Con cá voi là loài gì?',
        image: '🐋',
        options: ['Cá', 'Động vật có vú', 'Bò sát', 'Lưỡng cư'],
        answer: 1,
        explanation: 'Cá voi là động vật có vú, thở bằng phổi như con người!',
      },
      {
        question: 'Con sứa có gì nguy hiểm?',
        image: '🪼',
        options: ['Răng sắc', 'Xúc tu chích', 'Móng vuốt', 'Không nguy hiểm'],
        answer: 1,
        explanation: 'Xúc tu sứa có thể gây ngứa và đau khi chạm vào.',
      },
      {
        question: 'Cá mập có bao nhiêu hàng răng?',
        image: '🦈',
        options: ['1 hàng', '2 hàng', 'Nhiều hàng', 'Không có răng'],
        answer: 2,
        explanation: 'Cá mập có nhiều hàng răng, răng rụng sẽ mọc lại!',
      },
      {
        question: 'Con rùa biển sống được bao lâu?',
        image: '🐢',
        options: ['5 năm', '20 năm', 'Hơn 50 năm', '1 năm'],
        answer: 2,
        explanation: 'Rùa biển có thể sống rất lâu, hơn 50 năm!',
      },
    ],
  },

  // Các bộ phận cơ thể
  'kh-body-parts': {
    id: 'kh-body-parts',
    title: 'Các bộ phận cơ thể',
    level: 3,
    category: 'body',
    icon: '🧍',
    description: 'Tìm hiểu cơ thể con người',

    intro: {
      title: 'Cơ thể kỳ diệu',
      subtitle: 'Khám phá các bộ phận',
      image: '👤',
      voice: 'Cơ thể chúng ta có nhiều bộ phận quan trọng!',
    },

    questions: [
      {
        question: 'Xương giúp cơ thể làm gì?',
        image: '🦴',
        options: ['Tiêu hóa', 'Nâng đỡ cơ thể', 'Thở', 'Nghe'],
        answer: 1,
        explanation: 'Bộ xương nâng đỡ và bảo vệ các cơ quan bên trong.',
      },
      {
        question: 'Máu được bơm đi từ đâu?',
        image: '❤️',
        options: ['Não', 'Tim', 'Phổi', 'Dạ dày'],
        answer: 1,
        explanation: 'Tim bơm máu đi nuôi khắp cơ thể không ngừng nghỉ.',
      },
      {
        question: 'Phổi giúp ta làm gì?',
        image: '🫁',
        options: ['Nhìn', 'Nghe', 'Thở', 'Ăn'],
        answer: 2,
        explanation: 'Phổi giúp ta hít oxy và thở ra khí carbon dioxide.',
      },
      {
        question: 'Não điều khiển gì?',
        image: '🧠',
        options: ['Chỉ tay', 'Chỉ chân', 'Mọi hoạt động', 'Không có gì'],
        answer: 2,
        explanation: 'Não là "máy tính" điều khiển mọi hoạt động cơ thể!',
      },
    ],
  },

  // Năng lượng xanh
  'kh-green-energy': {
    id: 'kh-green-energy',
    title: 'Năng lượng xanh',
    level: 5,
    category: 'technology',
    icon: '☀️',
    description: 'Năng lượng sạch cho tương lai',

    intro: {
      title: 'Năng lượng tái tạo',
      subtitle: 'Bảo vệ Trái Đất',
      image: '🌱',
      voice: 'Năng lượng xanh giúp bảo vệ môi trường!',
    },

    questions: [
      {
        question: 'Năng lượng mặt trời đến từ đâu?',
        image: '☀️',
        options: ['Trái Đất', 'Mặt Trời', 'Mặt Trăng', 'Sao'],
        answer: 1,
        explanation: 'Mặt Trời là nguồn năng lượng vô tận và sạch!',
      },
      {
        question: 'Turbine gió dùng để làm gì?',
        image: '🌬️',
        options: ['Tạo gió', 'Tạo điện từ gió', 'Làm mát', 'Quạt'],
        answer: 1,
        explanation: 'Turbine gió biến sức gió thành điện năng.',
      },
      {
        question: 'Năng lượng nào không gây ô nhiễm?',
        image: '🌍',
        options: ['Than đá', 'Dầu mỏ', 'Năng lượng mặt trời', 'Xăng'],
        answer: 2,
        explanation: 'Năng lượng mặt trời sạch, không thải khí độc.',
      },
      {
        question: 'Tại sao cần tiết kiệm điện?',
        image: '💡',
        options: ['Không cần', 'Để bảo vệ môi trường', 'Để tối hơn', 'Vì thích'],
        answer: 1,
        explanation: 'Tiết kiệm điện giúp giảm ô nhiễm và bảo vệ Trái Đất.',
      },
    ],
  },

  // Thí nghiệm vui
  'kh-experiments': {
    id: 'kh-experiments',
    title: 'Thí nghiệm vui',
    level: 4,
    category: 'physics',
    icon: '🧪',
    description: 'Khoa học qua thí nghiệm',

    intro: {
      title: 'Nhà khoa học nhí',
      subtitle: 'Thí nghiệm thú vị',
      image: '🔬',
      voice: 'Khám phá khoa học qua các thí nghiệm vui!',
    },

    questions: [
      {
        question: 'Nước đá để ngoài trời nắng sẽ như thế nào?',
        image: '🧊',
        options: ['Cứng hơn', 'Tan chảy thành nước', 'Bay hơi', 'Không đổi'],
        answer: 1,
        explanation: 'Nước đá gặp nóng sẽ tan chảy thành nước lỏng.',
      },
      {
        question: 'Bỏ quả trứng vào nước muối đặc, điều gì xảy ra?',
        image: '🥚',
        options: ['Chìm xuống', 'Nổi lên', 'Tan ra', 'Vỡ'],
        answer: 1,
        explanation: 'Nước muối đặc hơn nên đẩy trứng nổi lên!',
      },
      {
        question: 'Trộn màu xanh và vàng được màu gì?',
        image: '🎨',
        options: ['Đỏ', 'Tím', 'Xanh lá', 'Cam'],
        answer: 2,
        explanation: 'Xanh dương + Vàng = Xanh lá cây!',
      },
      {
        question: 'Tại sao bầu trời ban ngày màu xanh?',
        image: '☀️',
        options: ['Do biển', 'Ánh sáng mặt trời tán xạ', 'Do mây', 'Do gió'],
        answer: 1,
        explanation: 'Ánh sáng mặt trời gặp khí quyển tán xạ ra màu xanh!',
      },
    ],
  },
};

// ============================================
// HÀM TIỆN ÍCH
// ============================================

// Lấy tất cả bài học khoa học
export const getAllKhoaHocLessons = () => {
  return [
    ...Object.values(KHOA_HOC_EXTRA_LESSONS),
    ...getAllScienceLessons()
  ];
};

// Lấy bài học theo ID
export const getKhoaHocLesson = (lessonId) => {
  if (KHOA_HOC_EXTRA_LESSONS[lessonId]) {
    return KHOA_HOC_EXTRA_LESSONS[lessonId];
  }
  return getScienceLesson(lessonId);
};

// Lấy bài học theo grade
export const getKhoaHocLessonsByGrade = (gradeId) => {
  const grade = KHOA_HOC_GRADES.find(g => g.id === gradeId);
  if (!grade) return [];

  const allLessons = getAllKhoaHocLessons();
  return allLessons.filter(lesson => grade.levels.includes(lesson.level));
};

// Lấy bài học theo category
export const getKhoaHocLessonsByCategory = (categoryId) => {
  const allLessons = getAllKhoaHocLessons();
  return allLessons.filter(lesson => lesson.category === categoryId);
};

// Lấy info grade
export const getKhoaHocGradeInfo = (gradeId) => {
  return KHOA_HOC_GRADES.find(g => g.id === gradeId) || null;
};

// Thống kê
export const getKhoaHocStats = () => {
  return {
    totalGrades: KHOA_HOC_GRADES.length,
    totalLessons: getAllKhoaHocLessons().length,
    totalCategories: KHOA_HOC_CATEGORIES.length,
    grades: KHOA_HOC_GRADES.map(g => ({
      id: g.id,
      title: g.title,
      lessonCount: getKhoaHocLessonsByGrade(g.id).length
    }))
  };
};

// ============================================
// EXPORTS
// ============================================
export {
  SCIENCE_LESSONS,
  getScienceLesson,
  getAllScienceLessons,
  getScienceLessonsByLevel,
  getNextScienceLesson
};

export default KHOA_HOC_GRADES;
