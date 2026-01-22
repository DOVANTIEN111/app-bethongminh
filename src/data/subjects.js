// src/data/subjects.js
// NỘI DUNG MÔN HỌC - Tiếng Anh thiết kế lại cho trẻ 3-6 tuổi

export const SUBJECTS = {
  math: {
    id: 'math',
    name: 'Toán Học',
    icon: '🔢',
    color: 'from-blue-500 to-cyan-500',
    desc: 'Học đếm, phép tính, hình học',
    useMathLessons: true, // Flag để dùng mathLessons.js
    lessons: [
      // Level 1: Làm quen số (3-4 tuổi)
      { id: 'math-1-1', title: 'Số 1 - Một', level: 1, desc: 'Học số 1 qua hình ảnh' },
      { id: 'math-1-2', title: 'Số 2 - Hai', level: 1, desc: 'Học số 2 qua hình ảnh' },
      { id: 'math-1-3', title: 'Số 3 - Ba', level: 1, desc: 'Học số 3 qua hình ảnh' },
      { id: 'math-1-4', title: 'Số 4 - Bốn', level: 1, desc: 'Học số 4 qua hình ảnh' },
      { id: 'math-1-5', title: 'Số 5 - Năm', level: 1, desc: 'Học số 5 với bàn tay' },
      { id: 'math-1-6', title: 'Số 6 - Sáu', level: 1, desc: 'Học số 6 qua hình ảnh' },
      { id: 'math-1-7', title: 'Số 7 - Bảy', level: 1, desc: 'Học số 7 - cầu vồng' },
      { id: 'math-1-8', title: 'Số 8 - Tám', level: 1, desc: 'Học số 8 - bạch tuộc' },
      { id: 'math-1-9', title: 'Số 9 - Chín', level: 1, desc: 'Học số 9 qua hình ảnh' },
      { id: 'math-1-10', title: 'Số 10 - Mười', level: 1, desc: 'Học số 10 - hai bàn tay' },
      { id: 'math-1-11', title: 'Ôn tập số 1-5', level: 1, desc: 'Ôn lại các số 1 đến 5' },
      { id: 'math-1-12', title: 'Ôn tập số 6-10', level: 1, desc: 'Ôn lại các số 6 đến 10' },
      { id: 'math-1-13', title: 'So sánh: Nhiều hơn', level: 1, desc: 'Học cách so sánh' },
      { id: 'math-1-14', title: 'So sánh: Ít hơn', level: 1, desc: 'Học cách so sánh' },
      { id: 'math-1-15', title: 'Kiểm tra Level 1', level: 1, desc: 'Bài kiểm tra số 1-10' },
      
      // Level 2: Phép cộng (4-5 tuổi)
      { id: 'math-2-1', title: 'Cộng với 1', level: 2, desc: 'Học phép cộng với 1' },
      { id: 'math-2-2', title: 'Cộng với 2', level: 2, desc: 'Học phép cộng với 2' },
      { id: 'math-2-3', title: 'Cộng trong phạm vi 5', level: 2, desc: 'Cộng có kết quả ≤ 5' },
      { id: 'math-2-4', title: 'Cộng với 3', level: 2, desc: 'Học phép cộng với 3' },
      { id: 'math-2-5', title: 'Cộng với 4', level: 2, desc: 'Học phép cộng với 4' },
      { id: 'math-2-6', title: 'Cộng với 5', level: 2, desc: 'Cộng 5 - một bàn tay' },
      { id: 'math-2-7', title: 'Cộng trong phạm vi 10', level: 2, desc: 'Cộng có kết quả ≤ 10' },
      { id: 'math-2-8', title: 'Phép cộng ngược', level: 2, desc: 'Tính chất giao hoán' },
      { id: 'math-2-9', title: 'Cộng với 0', level: 2, desc: 'Số 0 trong phép cộng' },
      { id: 'math-2-10', title: 'Tìm số còn thiếu', level: 2, desc: 'Điền số vào ô trống' },
    ],
  },
  
  vietnamese: {
    id: 'vietnamese',
    name: 'Tiếng Việt',
    icon: '📖',
    color: 'from-green-500 to-emerald-500',
    desc: 'Học chữ cái, ghép vần, đọc hiểu',
    lessons: [
      { id: 'v1', title: 'Chữ cái A-D', level: 1, desc: 'Học A, Ă, Â, B, C, D, Đ' },
      { id: 'v2', title: 'Chữ cái E-I', level: 1, desc: 'Học E, Ê, G, H, I' },
      { id: 'v3', title: 'Chữ cái K-O', level: 1, desc: 'Học K, L, M, N, O, Ô, Ơ' },
      { id: 'v4', title: 'Chữ cái P-U', level: 1, desc: 'Học P, Q, R, S, T, U, Ư' },
      { id: 'v5', title: 'Chữ cái V-Y', level: 1, desc: 'Học V, X, Y' },
      { id: 'v6', title: 'Vần đơn giản', level: 2, desc: 'BA, MA, LA, ĐI, MẸ' },
      { id: 'v7', title: 'Vần có dấu', level: 2, desc: 'Dấu sắc, huyền, hỏi, ngã, nặng' },
      { id: 'v8', title: 'Vần ghép IA, UA', level: 2, desc: 'Học vần ia, ua, ưa' },
      { id: 'v9', title: 'Vần ghép AN, ON', level: 2, desc: 'Học vần an, on, en' },
      { id: 'v10', title: 'Từ đơn giản', level: 2, desc: 'Đọc từ 2 âm tiết' },
      { id: 'v11', title: 'Vần ghép nâng cao', level: 3, desc: 'Vần ong, ang, ung, ương' },
      { id: 'v12', title: 'Đọc câu ngắn', level: 3, desc: 'Đọc câu 3-5 từ' },
      { id: 'v13', title: 'Từ vựng gia đình', level: 3, desc: 'Bố, mẹ, anh, chị, em' },
      { id: 'v14', title: 'Từ vựng con vật', level: 3, desc: 'Tên các con vật' },
      { id: 'v15', title: 'Từ vựng trái cây', level: 3, desc: 'Tên các loại trái cây' },
    ],
  },
  
  english: {
    id: 'english',
    name: 'Tiếng Anh',
    icon: '🌍',
    color: 'from-red-500 to-orange-500',
    desc: 'Học qua hình ảnh, âm thanh, trò chơi',
    lessons: [
      // ========== LEVEL 1: Làm quen (3-4 tuổi) - Nghe + Nhìn + Chọn hình ==========
      { id: 'e1', title: '🍎 Trái cây', level: 1, desc: 'Apple, Banana, Orange...' },
      { id: 'e2', title: '🐕 Con vật', level: 1, desc: 'Dog, Cat, Bird...' },
      { id: 'e3', title: '🔴 Màu sắc', level: 1, desc: 'Red, Blue, Yellow...' },
      { id: 'e4', title: '1️⃣ Số 1-5', level: 1, desc: 'One, Two, Three...' },
      { id: 'e5', title: '👨‍👩‍👧 Gia đình', level: 1, desc: 'Mom, Dad, Baby...' },
      { id: 'e6', title: '🍕 Đồ ăn', level: 1, desc: 'Rice, Bread, Milk...' },
      
      // ========== LEVEL 2: Mở rộng (4-5 tuổi) - Nghe + Chọn hình + Đếm ==========
      { id: 'e7', title: '🐘 Thú hoang dã', level: 2, desc: 'Lion, Elephant, Monkey...' },
      { id: 'e8', title: '🥕 Rau củ', level: 2, desc: 'Carrot, Tomato, Corn...' },
      { id: 'e9', title: '⭕ Hình dạng', level: 2, desc: 'Circle, Square, Star...' },
      { id: 'e10', title: '6️⃣ Số 6-10', level: 2, desc: 'Six, Seven, Eight...' },
      { id: 'e11', title: '👕 Quần áo', level: 2, desc: 'Shirt, Pants, Shoes...' },
      { id: 'e12', title: '🧸 Đồ chơi', level: 2, desc: 'Ball, Doll, Car...' },
      { id: 'e13', title: '🏠 Trong nhà', level: 2, desc: 'Bed, Chair, Door...' },
      { id: 'e14', title: '👀 Cơ thể', level: 2, desc: 'Eyes, Nose, Mouth...' },
      
      // ========== LEVEL 3: Giao tiếp (5-6 tuổi) - Nghe + Nói + Câu đơn giản ==========
      { id: 'e15', title: '👋 Chào hỏi', level: 3, desc: 'Hello! Goodbye!' },
      { id: 'e16', title: '😊 Cảm xúc', level: 3, desc: 'Happy, Sad, Hungry...' },
      { id: 'e17', title: '🌤️ Thời tiết', level: 3, desc: 'Sunny, Rainy, Hot...' },
      { id: 'e18', title: '🎯 Hành động', level: 3, desc: 'Run, Jump, Eat...' },
      { id: 'e19', title: '❓ Hỏi đáp', level: 3, desc: 'What? How many?' },
      { id: 'e20', title: '💬 Câu ngắn', level: 3, desc: 'I like... This is...' },
    ],
  },
  
  science: {
    id: 'science',
    name: 'Khoa Học',
    icon: '🔬',
    color: 'from-purple-500 to-pink-500',
    desc: 'Khám phá thế giới xung quanh',
    lessons: [
      { id: 's1', title: 'Con vật nuôi', level: 1, desc: 'Chó, mèo, gà, vịt...' },
      { id: 's2', title: 'Con vật hoang dã', level: 1, desc: 'Sư tử, voi, hổ...' },
      { id: 's3', title: 'Cây cối', level: 1, desc: 'Các bộ phận của cây' },
      { id: 's4', title: 'Thời tiết', level: 2, desc: 'Nắng, mưa, gió, mây' },
      { id: 's5', title: 'Cơ thể người', level: 2, desc: 'Các bộ phận cơ thể' },
      { id: 's6', title: 'Giác quan', level: 2, desc: 'Nghe, nhìn, ngửi, nếm, sờ' },
      { id: 's7', title: 'Hệ mặt trời', level: 3, desc: 'Mặt trời, trái đất, mặt trăng' },
      { id: 's8', title: 'Nước', level: 3, desc: 'Tính chất của nước' },
    ],
  },
};

export const getSubject = (id) => SUBJECTS[id];
export const getAllSubjects = () => Object.values(SUBJECTS);
export const getLesson = (subjectId, lessonId) => {
  const subject = SUBJECTS[subjectId];
  return subject?.lessons.find(l => l.id === lessonId);
};
