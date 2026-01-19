export const SUBJECTS = {
  math: {
    id: 'math',
    name: 'Toán Học',
    icon: '🔢',
    color: 'from-blue-500 to-cyan-500',
    desc: 'Học đếm, phép tính',
    lessons: [
      { id: 'm1', title: 'Đếm 1-10', level: 1 },
      { id: 'm2', title: 'Đếm 11-20', level: 1 },
      { id: 'm3', title: 'Phép cộng cơ bản', level: 2 },
      { id: 'm4', title: 'Phép trừ cơ bản', level: 2 },
      { id: 'm5', title: 'So sánh số', level: 2 },
    ],
  },
  vietnamese: {
    id: 'vietnamese',
    name: 'Tiếng Việt',
    icon: '📖',
    color: 'from-green-500 to-emerald-500',
    desc: 'Học chữ, ghép vần',
    lessons: [
      { id: 'v1', title: 'Bảng chữ cái A-H', level: 1 },
      { id: 'v2', title: 'Bảng chữ cái I-Q', level: 1 },
      { id: 'v3', title: 'Bảng chữ cái R-Z', level: 1 },
      { id: 'v4', title: 'Ghép vần cơ bản', level: 2 },
      { id: 'v5', title: 'Từ đơn giản', level: 2 },
    ],
  },
  english: {
    id: 'english',
    name: 'Tiếng Anh',
    icon: '🌍',
    color: 'from-purple-500 to-pink-500',
    desc: 'Từ vựng, phát âm',
    lessons: [
      { id: 'e1', title: 'Alphabet A-M', level: 1 },
      { id: 'e2', title: 'Alphabet N-Z', level: 1 },
      { id: 'e3', title: 'Numbers 1-10', level: 1 },
      { id: 'e4', title: 'Colors', level: 2 },
      { id: 'e5', title: 'Animals', level: 2 },
      { id: 'e6', title: 'Family', level: 2 },
    ],
  },
  science: {
    id: 'science',
    name: 'Khoa Học',
    icon: '🔬',
    color: 'from-teal-500 to-cyan-500',
    desc: 'Khám phá thế giới',
    lessons: [
      { id: 's1', title: 'Cơ thể người', level: 1 },
      { id: 's2', title: 'Động vật', level: 1 },
      { id: 's3', title: 'Thực vật', level: 2 },
    ],
  },
  lifeskills: {
    id: 'lifeskills',
    name: 'Kỹ Năng Sống',
    icon: '🌟',
    color: 'from-orange-500 to-amber-500',
    desc: 'An toàn, vệ sinh',
    lessons: [
      { id: 'l1', title: 'Vệ sinh cá nhân', level: 1 },
      { id: 'l2', title: 'An toàn giao thông', level: 1 },
      { id: 'l3', title: 'Cảm xúc của em', level: 2 },
    ],
  },
};

export const getSubject = (id) => SUBJECTS[id];
export const getAllSubjects = () => Object.values(SUBJECTS);
