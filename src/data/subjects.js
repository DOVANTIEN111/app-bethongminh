// src/data/subjects.js
// NỘI DUNG MÔN HỌC - Phiên bản đầy đủ

export const SUBJECTS = {
  math: {
    id: 'math',
    name: 'Toán Học',
    icon: '🔢',
    color: 'from-blue-500 to-cyan-500',
    desc: 'Học đếm, phép tính, hình học',
    lessons: [
      // Level 1 - Cơ bản (3-4 tuổi)
      { id: 'm1', title: 'Đếm 1-5', level: 1, desc: 'Học đếm số từ 1 đến 5' },
      { id: 'm2', title: 'Đếm 6-10', level: 1, desc: 'Học đếm số từ 6 đến 10' },
      { id: 'm3', title: 'Nhận biết số', level: 1, desc: 'Nhận biết các chữ số' },
      { id: 'm4', title: 'So sánh nhiều ít', level: 1, desc: 'So sánh số lượng' },
      
      // Level 2 - Nâng cao (4-5 tuổi)
      { id: 'm5', title: 'Đếm 11-20', level: 2, desc: 'Học đếm số từ 11 đến 20' },
      { id: 'm6', title: 'Phép cộng đến 5', level: 2, desc: 'Cộng các số nhỏ hơn 5' },
      { id: 'm7', title: 'Phép cộng đến 10', level: 2, desc: 'Cộng các số đến 10' },
      { id: 'm8', title: 'Phép trừ đến 5', level: 2, desc: 'Trừ các số nhỏ hơn 5' },
      { id: 'm9', title: 'Phép trừ đến 10', level: 2, desc: 'Trừ các số đến 10' },
      { id: 'm10', title: 'So sánh số', level: 2, desc: 'Lớn hơn, nhỏ hơn, bằng' },
      
      // Level 3 - Tiền tiểu học (5-6 tuổi)
      { id: 'm11', title: 'Đếm đến 50', level: 3, desc: 'Học đếm số đến 50' },
      { id: 'm12', title: 'Cộng có nhớ', level: 3, desc: 'Phép cộng vượt 10' },
      { id: 'm13', title: 'Trừ có nhớ', level: 3, desc: 'Phép trừ vượt 10' },
      { id: 'm14', title: 'Hình học cơ bản', level: 3, desc: 'Nhận biết hình dạng' },
      { id: 'm15', title: 'Đo lường cơ bản', level: 3, desc: 'Dài ngắn, cao thấp' },
    ],
  },
  
  vietnamese: {
    id: 'vietnamese',
    name: 'Tiếng Việt',
    icon: '📖',
    color: 'from-green-500 to-emerald-500',
    desc: 'Học chữ cái, ghép vần, đọc hiểu',
    lessons: [
      // Level 1 - Chữ cái (3-4 tuổi)
      { id: 'v1', title: 'Chữ cái A-D', level: 1, desc: 'Học A, Ă, Â, B, C, D, Đ' },
      { id: 'v2', title: 'Chữ cái E-I', level: 1, desc: 'Học E, Ê, G, H, I' },
      { id: 'v3', title: 'Chữ cái K-O', level: 1, desc: 'Học K, L, M, N, O, Ô, Ơ' },
      { id: 'v4', title: 'Chữ cái P-U', level: 1, desc: 'Học P, Q, R, S, T, U, Ư' },
      { id: 'v5', title: 'Chữ cái V-Y', level: 1, desc: 'Học V, X, Y' },
      
      // Level 2 - Ghép vần (4-5 tuổi)
      { id: 'v6', title: 'Vần đơn giản', level: 2, desc: 'BA, MA, LA, ĐI, MẸ' },
      { id: 'v7', title: 'Vần có dấu', level: 2, desc: 'Dấu sắc, huyền, hỏi, ngã, nặng' },
      { id: 'v8', title: 'Vần ghép IA, UA', level: 2, desc: 'Học vần ia, ua, ưa' },
      { id: 'v9', title: 'Vần ghép AN, ON', level: 2, desc: 'Học vần an, on, en' },
      { id: 'v10', title: 'Từ đơn giản', level: 2, desc: 'Đọc từ 2 âm tiết' },
      
      // Level 3 - Đọc hiểu (5-6 tuổi)
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
    desc: 'Học từ vựng, phát âm cơ bản',
    lessons: [
      // Level 1 - Alphabet (3-4 tuổi)
      { id: 'e1', title: 'Letters A-F', level: 1, desc: 'Learn A, B, C, D, E, F' },
      { id: 'e2', title: 'Letters G-L', level: 1, desc: 'Learn G, H, I, J, K, L' },
      { id: 'e3', title: 'Letters M-R', level: 1, desc: 'Learn M, N, O, P, Q, R' },
      { id: 'e4', title: 'Letters S-Z', level: 1, desc: 'Learn S, T, U, V, W, X, Y, Z' },
      { id: 'e5', title: 'Numbers 1-10', level: 1, desc: 'Count from 1 to 10' },
      
      // Level 2 - Basic vocab (4-5 tuổi)
      { id: 'e6', title: 'Colors', level: 2, desc: 'Red, blue, green, yellow...' },
      { id: 'e7', title: 'Animals', level: 2, desc: 'Dog, cat, bird, fish...' },
      { id: 'e8', title: 'Fruits', level: 2, desc: 'Apple, banana, orange...' },
      { id: 'e9', title: 'Family', level: 2, desc: 'Mom, dad, brother, sister...' },
      { id: 'e10', title: 'Body Parts', level: 2, desc: 'Head, eyes, nose, mouth...' },
      
      // Level 3 - Simple phrases (5-6 tuổi)
      { id: 'e11', title: 'Greetings', level: 3, desc: 'Hello, goodbye, thank you' },
      { id: 'e12', title: 'I am...', level: 3, desc: 'Simple self-introduction' },
      { id: 'e13', title: 'This is...', level: 3, desc: 'Identifying objects' },
      { id: 'e14', title: 'I like...', level: 3, desc: 'Express preferences' },
      { id: 'e15', title: 'Questions', level: 3, desc: 'What, where, who' },
    ],
  },
  
  science: {
    id: 'science',
    name: 'Khoa Học',
    icon: '🔬',
    color: 'from-purple-500 to-pink-500',
    desc: 'Khám phá thế giới xung quanh',
    lessons: [
      // Level 1 - Thiên nhiên
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
