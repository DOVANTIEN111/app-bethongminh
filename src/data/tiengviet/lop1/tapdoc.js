// src/data/tiengviet/lop1/tapdoc.js
// 20 BÀI TẬP ĐỌC - TIẾNG VIỆT LỚP 1

export const TAP_DOC_LESSONS = {
  // ========== BÀI 1: ĐỌC TỪ ĐƠN GIẢN 1 - GIA ĐÌNH ==========
  'tv1-td-01': {
    id: 'tv1-td-01',
    title: 'Đọc từ: Gia đình',
    subject: 'tieng-viet',
    grade: 1,
    category: 'tap-doc',
    order: 1,
    duration: 10,
    icon: '👨‍👩‍👧‍👦',
    color: 'from-pink-400 to-rose-500',
    objectives: ['Đọc từ về gia đình', 'Nhận biết người thân', 'Nối từ với hình'],
    content: {
      introduction: { title: 'Gia đình', description: 'Học đọc các từ về người thân trong gia đình', image: '👨‍👩‍👧‍👦' },
      vocabulary: [
        { word: 'ba', meaning: 'Ba (bố)', image: '👨', audio: 'ba.mp3' },
        { word: 'má', meaning: 'Má (mẹ)', image: '👩', audio: 'ma.mp3' },
        { word: 'bé', meaning: 'Em bé', image: '👶', audio: 'be.mp3' },
        { word: 'bà', meaning: 'Bà nội/ngoại', image: '👵', audio: 'ba2.mp3' },
        { word: 'bố', meaning: 'Bố', image: '👨', audio: 'bo.mp3' }
      ],
      exercises: [
        { type: 'read-match', question: 'Đọc và nối từ với hình đúng', pairs: [{ word: 'ba', image: '👨' }, { word: 'má', image: '👩' }, { word: 'bé', image: '👶' }] },
        { type: 'listen-read', question: 'Nghe và đọc theo', words: ['ba', 'má', 'bé', 'bà', 'bố'] }
      ],
      quiz: [
        { question: '👨 đọc là gì?', options: ['Ba', 'Má', 'Bé', 'Bà'], correctAnswer: 0, explanation: 'Ba (bố)' },
        { question: '👩 đọc là gì?', options: ['Má', 'Ba', 'Bé', 'Bà'], correctAnswer: 0, explanation: 'Má (mẹ)' },
        { question: '👶 đọc là gì?', options: ['Bé', 'Ba', 'Má', 'Bà'], correctAnswer: 0, explanation: 'Em bé' },
        { question: '👵 đọc là gì?', options: ['Bà', 'Ba', 'Má', 'Bé'], correctAnswer: 0, explanation: 'Bà nội/ngoại' },
        { question: 'Từ nào chỉ người lớn tuổi nhất?', options: ['Bà', 'Ba', 'Má', 'Bé'], correctAnswer: 0, explanation: 'Bà là người lớn tuổi nhất' }
      ]
    }
  },

  // ========== BÀI 2: ĐỌC TỪ ĐƠN GIẢN 2 - ĐỘNG VẬT ==========
  'tv1-td-02': {
    id: 'tv1-td-02',
    title: 'Đọc từ: Động vật',
    subject: 'tieng-viet',
    grade: 1,
    category: 'tap-doc',
    order: 2,
    duration: 10,
    icon: '🐾',
    color: 'from-green-400 to-emerald-500',
    objectives: ['Đọc từ về động vật', 'Nhận biết con vật', 'Nối từ với hình'],
    content: {
      introduction: { title: 'Động vật', description: 'Học đọc các từ về con vật quen thuộc', image: '🐾' },
      vocabulary: [
        { word: 'cá', meaning: 'Con cá', image: '🐟', audio: 'ca.mp3' },
        { word: 'gà', meaning: 'Con gà', image: '🐔', audio: 'ga.mp3' },
        { word: 'vịt', meaning: 'Con vịt', image: '🦆', audio: 'vit.mp3' },
        { word: 'mèo', meaning: 'Con mèo', image: '🐱', audio: 'meo.mp3' },
        { word: 'chó', meaning: 'Con chó', image: '🐕', audio: 'cho.mp3' }
      ],
      exercises: [
        { type: 'read-match', question: 'Đọc và nối từ với hình đúng', pairs: [{ word: 'cá', image: '🐟' }, { word: 'gà', image: '🐔' }, { word: 'mèo', image: '🐱' }] },
        { type: 'listen-read', question: 'Nghe và đọc theo', words: ['cá', 'gà', 'vịt', 'mèo', 'chó'] }
      ],
      quiz: [
        { question: '🐟 đọc là gì?', options: ['Cá', 'Gà', 'Vịt', 'Mèo'], correctAnswer: 0, explanation: 'Con cá' },
        { question: '🐔 đọc là gì?', options: ['Gà', 'Cá', 'Vịt', 'Chó'], correctAnswer: 0, explanation: 'Con gà' },
        { question: '🐱 đọc là gì?', options: ['Mèo', 'Chó', 'Cá', 'Gà'], correctAnswer: 0, explanation: 'Con mèo' },
        { question: '🐕 đọc là gì?', options: ['Chó', 'Mèo', 'Gà', 'Vịt'], correctAnswer: 0, explanation: 'Con chó' },
        { question: 'Con vật nào sống dưới nước?', options: ['Cá', 'Gà', 'Mèo', 'Chó'], correctAnswer: 0, explanation: 'Cá sống dưới nước' }
      ]
    }
  },

  // ========== BÀI 3: ĐỌC TỪ - MÀU SẮC ==========
  'tv1-td-03': {
    id: 'tv1-td-03',
    title: 'Đọc từ: Màu sắc',
    subject: 'tieng-viet',
    grade: 1,
    category: 'tap-doc',
    order: 3,
    duration: 10,
    icon: '🌈',
    color: 'from-rainbow-400 to-gradient-500',
    objectives: ['Đọc từ về màu sắc', 'Nhận biết màu', 'Nối từ với hình'],
    content: {
      introduction: { title: 'Màu sắc', description: 'Học đọc các từ về màu sắc', image: '🌈' },
      vocabulary: [
        { word: 'đỏ', meaning: 'Màu đỏ', image: '🔴', audio: 'do.mp3' },
        { word: 'vàng', meaning: 'Màu vàng', image: '🟡', audio: 'vang.mp3' },
        { word: 'xanh', meaning: 'Màu xanh', image: '🟢', audio: 'xanh.mp3' },
        { word: 'tím', meaning: 'Màu tím', image: '🟣', audio: 'tim.mp3' },
        { word: 'cam', meaning: 'Màu cam', image: '🟠', audio: 'cam.mp3' }
      ],
      exercises: [
        { type: 'read-match', question: 'Đọc và nối từ với màu đúng', pairs: [{ word: 'đỏ', image: '🔴' }, { word: 'vàng', image: '🟡' }, { word: 'xanh', image: '🟢' }] },
        { type: 'listen-read', question: 'Nghe và đọc theo', words: ['đỏ', 'vàng', 'xanh', 'tím', 'cam'] }
      ],
      quiz: [
        { question: '🔴 đọc là gì?', options: ['Đỏ', 'Vàng', 'Xanh', 'Tím'], correctAnswer: 0, explanation: 'Màu đỏ' },
        { question: '🟡 đọc là gì?', options: ['Vàng', 'Đỏ', 'Xanh', 'Cam'], correctAnswer: 0, explanation: 'Màu vàng' },
        { question: '🟢 đọc là gì?', options: ['Xanh', 'Đỏ', 'Vàng', 'Tím'], correctAnswer: 0, explanation: 'Màu xanh' },
        { question: '🟣 đọc là gì?', options: ['Tím', 'Xanh', 'Đỏ', 'Vàng'], correctAnswer: 0, explanation: 'Màu tím' },
        { question: 'Màu của quả táo chín?', options: ['Đỏ', 'Vàng', 'Xanh', 'Tím'], correctAnswer: 0, explanation: 'Táo chín màu đỏ' }
      ]
    }
  },

  // ========== BÀI 4: ĐỌC TỪ - SỐ ĐẾM ==========
  'tv1-td-04': {
    id: 'tv1-td-04',
    title: 'Đọc từ: Số đếm',
    subject: 'tieng-viet',
    grade: 1,
    category: 'tap-doc',
    order: 4,
    duration: 10,
    icon: '🔢',
    color: 'from-blue-400 to-indigo-500',
    objectives: ['Đọc số từ 1-10', 'Nhận biết số', 'Đếm và đọc'],
    content: {
      introduction: { title: 'Số đếm', description: 'Học đọc các số từ 1 đến 10', image: '🔢' },
      vocabulary: [
        { word: 'một', meaning: 'Số 1', image: '1️⃣', audio: 'mot.mp3' },
        { word: 'hai', meaning: 'Số 2', image: '2️⃣', audio: 'hai.mp3' },
        { word: 'ba', meaning: 'Số 3', image: '3️⃣', audio: 'ba.mp3' },
        { word: 'bốn', meaning: 'Số 4', image: '4️⃣', audio: 'bon.mp3' },
        { word: 'năm', meaning: 'Số 5', image: '5️⃣', audio: 'nam.mp3' }
      ],
      exercises: [
        { type: 'read-match', question: 'Đọc và nối số với từ', pairs: [{ word: 'một', image: '1️⃣' }, { word: 'hai', image: '2️⃣' }, { word: 'ba', image: '3️⃣' }] },
        { type: 'listen-read', question: 'Nghe và đọc theo', words: ['một', 'hai', 'ba', 'bốn', 'năm'] }
      ],
      quiz: [
        { question: '1️⃣ đọc là gì?', options: ['Một', 'Hai', 'Ba', 'Bốn'], correctAnswer: 0, explanation: 'Số 1 đọc là một' },
        { question: '2️⃣ đọc là gì?', options: ['Hai', 'Một', 'Ba', 'Bốn'], correctAnswer: 0, explanation: 'Số 2 đọc là hai' },
        { question: '5️⃣ đọc là gì?', options: ['Năm', 'Bốn', 'Sáu', 'Bảy'], correctAnswer: 0, explanation: 'Số 5 đọc là năm' },
        { question: 'Số nào đứng sau số hai?', options: ['Ba', 'Một', 'Bốn', 'Năm'], correctAnswer: 0, explanation: 'Sau số 2 là số 3 (ba)' },
        { question: 'Đếm: một, hai, ...?', options: ['Ba', 'Bốn', 'Năm', 'Sáu'], correctAnswer: 0, explanation: 'Một, hai, ba' }
      ]
    }
  },

  // ========== BÀI 5: ĐỌC TỪ - ĐỒ VẬT ==========
  'tv1-td-05': {
    id: 'tv1-td-05',
    title: 'Đọc từ: Đồ vật',
    subject: 'tieng-viet',
    grade: 1,
    category: 'tap-doc',
    order: 5,
    duration: 10,
    icon: '🎒',
    color: 'from-amber-400 to-orange-500',
    objectives: ['Đọc từ về đồ vật', 'Nhận biết đồ dùng', 'Nối từ với hình'],
    content: {
      introduction: { title: 'Đồ vật', description: 'Học đọc các từ về đồ vật quen thuộc', image: '🎒' },
      vocabulary: [
        { word: 'bút', meaning: 'Cây bút', image: '✏️', audio: 'but.mp3' },
        { word: 'vở', meaning: 'Quyển vở', image: '📓', audio: 'vo.mp3' },
        { word: 'sách', meaning: 'Quyển sách', image: '📚', audio: 'sach.mp3' },
        { word: 'bàn', meaning: 'Cái bàn', image: '🪑', audio: 'ban.mp3' },
        { word: 'ghế', meaning: 'Cái ghế', image: '💺', audio: 'ghe.mp3' }
      ],
      exercises: [
        { type: 'read-match', question: 'Đọc và nối từ với hình', pairs: [{ word: 'bút', image: '✏️' }, { word: 'vở', image: '📓' }, { word: 'sách', image: '📚' }] },
        { type: 'listen-read', question: 'Nghe và đọc theo', words: ['bút', 'vở', 'sách', 'bàn', 'ghế'] }
      ],
      quiz: [
        { question: '✏️ đọc là gì?', options: ['Bút', 'Vở', 'Sách', 'Bàn'], correctAnswer: 0, explanation: 'Cây bút' },
        { question: '📓 đọc là gì?', options: ['Vở', 'Bút', 'Sách', 'Ghế'], correctAnswer: 0, explanation: 'Quyển vở' },
        { question: '📚 đọc là gì?', options: ['Sách', 'Vở', 'Bút', 'Bàn'], correctAnswer: 0, explanation: 'Quyển sách' },
        { question: 'Dùng gì để viết?', options: ['Bút', 'Vở', 'Sách', 'Ghế'], correctAnswer: 0, explanation: 'Dùng bút để viết' },
        { question: 'Ngồi trên cái gì?', options: ['Ghế', 'Bàn', 'Sách', 'Vở'], correctAnswer: 0, explanation: 'Ngồi trên ghế' }
      ]
    }
  },

  // ========== BÀI 6: ĐỌC TỪ - HOA QUẢ ==========
  'tv1-td-06': {
    id: 'tv1-td-06',
    title: 'Đọc từ: Hoa quả',
    subject: 'tieng-viet',
    grade: 1,
    category: 'tap-doc',
    order: 6,
    duration: 10,
    icon: '🍎',
    color: 'from-red-400 to-pink-500',
    objectives: ['Đọc từ về hoa quả', 'Nhận biết trái cây', 'Nối từ với hình'],
    content: {
      introduction: { title: 'Hoa quả', description: 'Học đọc các từ về trái cây', image: '🍎' },
      vocabulary: [
        { word: 'táo', meaning: 'Quả táo', image: '🍎', audio: 'tao.mp3' },
        { word: 'cam', meaning: 'Quả cam', image: '🍊', audio: 'cam.mp3' },
        { word: 'chuối', meaning: 'Quả chuối', image: '🍌', audio: 'chuoi.mp3' },
        { word: 'nho', meaning: 'Quả nho', image: '🍇', audio: 'nho.mp3' },
        { word: 'dưa', meaning: 'Quả dưa', image: '🍉', audio: 'dua.mp3' }
      ],
      exercises: [
        { type: 'read-match', question: 'Đọc và nối từ với hình', pairs: [{ word: 'táo', image: '🍎' }, { word: 'cam', image: '🍊' }, { word: 'chuối', image: '🍌' }] },
        { type: 'listen-read', question: 'Nghe và đọc theo', words: ['táo', 'cam', 'chuối', 'nho', 'dưa'] }
      ],
      quiz: [
        { question: '🍎 đọc là gì?', options: ['Táo', 'Cam', 'Chuối', 'Nho'], correctAnswer: 0, explanation: 'Quả táo' },
        { question: '🍊 đọc là gì?', options: ['Cam', 'Táo', 'Chuối', 'Dưa'], correctAnswer: 0, explanation: 'Quả cam' },
        { question: '🍌 đọc là gì?', options: ['Chuối', 'Táo', 'Cam', 'Nho'], correctAnswer: 0, explanation: 'Quả chuối' },
        { question: 'Quả màu vàng dài?', options: ['Chuối', 'Táo', 'Cam', 'Nho'], correctAnswer: 0, explanation: 'Chuối màu vàng và dài' },
        { question: 'Quả to nhất?', options: ['Dưa', 'Táo', 'Cam', 'Nho'], correctAnswer: 0, explanation: 'Quả dưa to nhất' }
      ]
    }
  },

  // ========== BÀI 7: ĐỌC TỪ - THỜI TIẾT ==========
  'tv1-td-07': {
    id: 'tv1-td-07',
    title: 'Đọc từ: Thời tiết',
    subject: 'tieng-viet',
    grade: 1,
    category: 'tap-doc',
    order: 7,
    duration: 10,
    icon: '⛅',
    color: 'from-sky-400 to-blue-500',
    objectives: ['Đọc từ về thời tiết', 'Nhận biết thời tiết', 'Nối từ với hình'],
    content: {
      introduction: { title: 'Thời tiết', description: 'Học đọc các từ về thời tiết', image: '⛅' },
      vocabulary: [
        { word: 'nắng', meaning: 'Trời nắng', image: '☀️', audio: 'nang.mp3' },
        { word: 'mưa', meaning: 'Trời mưa', image: '🌧️', audio: 'mua.mp3' },
        { word: 'gió', meaning: 'Có gió', image: '💨', audio: 'gio.mp3' },
        { word: 'mây', meaning: 'Đám mây', image: '☁️', audio: 'may.mp3' },
        { word: 'lạnh', meaning: 'Trời lạnh', image: '❄️', audio: 'lanh.mp3' }
      ],
      exercises: [
        { type: 'read-match', question: 'Đọc và nối từ với hình', pairs: [{ word: 'nắng', image: '☀️' }, { word: 'mưa', image: '🌧️' }, { word: 'gió', image: '💨' }] },
        { type: 'listen-read', question: 'Nghe và đọc theo', words: ['nắng', 'mưa', 'gió', 'mây', 'lạnh'] }
      ],
      quiz: [
        { question: '☀️ đọc là gì?', options: ['Nắng', 'Mưa', 'Gió', 'Mây'], correctAnswer: 0, explanation: 'Trời nắng' },
        { question: '🌧️ đọc là gì?', options: ['Mưa', 'Nắng', 'Gió', 'Lạnh'], correctAnswer: 0, explanation: 'Trời mưa' },
        { question: '❄️ đọc là gì?', options: ['Lạnh', 'Nắng', 'Mưa', 'Gió'], correctAnswer: 0, explanation: 'Trời lạnh' },
        { question: 'Mùa hè thường có?', options: ['Nắng', 'Lạnh', 'Tuyết', 'Sương'], correctAnswer: 0, explanation: 'Mùa hè thường nắng' },
        { question: 'Cần ô khi trời?', options: ['Mưa', 'Nắng', 'Gió', 'Mây'], correctAnswer: 0, explanation: 'Cần ô khi trời mưa' }
      ]
    }
  },

  // ========== BÀI 8: ĐỌC TỪ - HOẠT ĐỘNG ==========
  'tv1-td-08': {
    id: 'tv1-td-08',
    title: 'Đọc từ: Hoạt động',
    subject: 'tieng-viet',
    grade: 1,
    category: 'tap-doc',
    order: 8,
    duration: 10,
    icon: '🏃',
    color: 'from-orange-400 to-red-500',
    objectives: ['Đọc từ về hoạt động', 'Nhận biết hành động', 'Nối từ với hình'],
    content: {
      introduction: { title: 'Hoạt động', description: 'Học đọc các từ về hoạt động hàng ngày', image: '🏃' },
      vocabulary: [
        { word: 'ăn', meaning: 'Ăn cơm', image: '🍽️', audio: 'an.mp3' },
        { word: 'uống', meaning: 'Uống nước', image: '🥤', audio: 'uong.mp3' },
        { word: 'ngủ', meaning: 'Đi ngủ', image: '😴', audio: 'ngu.mp3' },
        { word: 'chơi', meaning: 'Đi chơi', image: '🎮', audio: 'choi.mp3' },
        { word: 'học', meaning: 'Đi học', image: '📖', audio: 'hoc.mp3' }
      ],
      exercises: [
        { type: 'read-match', question: 'Đọc và nối từ với hình', pairs: [{ word: 'ăn', image: '🍽️' }, { word: 'ngủ', image: '😴' }, { word: 'học', image: '📖' }] },
        { type: 'listen-read', question: 'Nghe và đọc theo', words: ['ăn', 'uống', 'ngủ', 'chơi', 'học'] }
      ],
      quiz: [
        { question: '🍽️ là hoạt động gì?', options: ['Ăn', 'Uống', 'Ngủ', 'Chơi'], correctAnswer: 0, explanation: 'Ăn cơm' },
        { question: '😴 là hoạt động gì?', options: ['Ngủ', 'Ăn', 'Chơi', 'Học'], correctAnswer: 0, explanation: 'Đi ngủ' },
        { question: '📖 là hoạt động gì?', options: ['Học', 'Chơi', 'Ngủ', 'Ăn'], correctAnswer: 0, explanation: 'Đi học' },
        { question: 'Buổi tối con làm gì?', options: ['Ngủ', 'Chơi', 'Học', 'Ăn'], correctAnswer: 0, explanation: 'Buổi tối đi ngủ' },
        { question: 'Đến trường để làm gì?', options: ['Học', 'Ngủ', 'Chơi', 'Ăn'], correctAnswer: 0, explanation: 'Đến trường để học' }
      ]
    }
  },

  // ========== BÀI 9: ĐỌC TỪ - CƠ THỂ ==========
  'tv1-td-09': {
    id: 'tv1-td-09',
    title: 'Đọc từ: Cơ thể',
    subject: 'tieng-viet',
    grade: 1,
    category: 'tap-doc',
    order: 9,
    duration: 10,
    icon: '🧍',
    color: 'from-purple-400 to-pink-500',
    objectives: ['Đọc từ về cơ thể', 'Nhận biết bộ phận', 'Nối từ với hình'],
    content: {
      introduction: { title: 'Cơ thể', description: 'Học đọc các từ về bộ phận cơ thể', image: '🧍' },
      vocabulary: [
        { word: 'mắt', meaning: 'Đôi mắt', image: '👀', audio: 'mat.mp3' },
        { word: 'mũi', meaning: 'Cái mũi', image: '👃', audio: 'mui.mp3' },
        { word: 'miệng', meaning: 'Cái miệng', image: '👄', audio: 'mieng.mp3' },
        { word: 'tai', meaning: 'Đôi tai', image: '👂', audio: 'tai.mp3' },
        { word: 'tay', meaning: 'Bàn tay', image: '✋', audio: 'tay.mp3' }
      ],
      exercises: [
        { type: 'read-match', question: 'Đọc và nối từ với hình', pairs: [{ word: 'mắt', image: '👀' }, { word: 'mũi', image: '👃' }, { word: 'tay', image: '✋' }] },
        { type: 'listen-read', question: 'Nghe và đọc theo', words: ['mắt', 'mũi', 'miệng', 'tai', 'tay'] }
      ],
      quiz: [
        { question: '👀 đọc là gì?', options: ['Mắt', 'Mũi', 'Miệng', 'Tai'], correctAnswer: 0, explanation: 'Đôi mắt' },
        { question: '👃 đọc là gì?', options: ['Mũi', 'Mắt', 'Miệng', 'Tai'], correctAnswer: 0, explanation: 'Cái mũi' },
        { question: '✋ đọc là gì?', options: ['Tay', 'Chân', 'Đầu', 'Vai'], correctAnswer: 0, explanation: 'Bàn tay' },
        { question: 'Dùng gì để nhìn?', options: ['Mắt', 'Tai', 'Mũi', 'Miệng'], correctAnswer: 0, explanation: 'Dùng mắt để nhìn' },
        { question: 'Dùng gì để nghe?', options: ['Tai', 'Mắt', 'Mũi', 'Miệng'], correctAnswer: 0, explanation: 'Dùng tai để nghe' }
      ]
    }
  },

  // ========== BÀI 10: ĐỌC TỪ - PHƯƠNG TIỆN ==========
  'tv1-td-10': {
    id: 'tv1-td-10',
    title: 'Đọc từ: Phương tiện',
    subject: 'tieng-viet',
    grade: 1,
    category: 'tap-doc',
    order: 10,
    duration: 10,
    icon: '🚗',
    color: 'from-slate-400 to-gray-500',
    objectives: ['Đọc từ về phương tiện', 'Nhận biết xe cộ', 'Nối từ với hình'],
    content: {
      introduction: { title: 'Phương tiện', description: 'Học đọc các từ về phương tiện giao thông', image: '🚗' },
      vocabulary: [
        { word: 'xe', meaning: 'Cái xe', image: '🚗', audio: 'xe.mp3' },
        { word: 'tàu', meaning: 'Con tàu', image: '🚂', audio: 'tau.mp3' },
        { word: 'máy bay', meaning: 'Máy bay', image: '✈️', audio: 'maybay.mp3' },
        { word: 'thuyền', meaning: 'Con thuyền', image: '⛵', audio: 'thuyen.mp3' },
        { word: 'xe đạp', meaning: 'Xe đạp', image: '🚲', audio: 'xedap.mp3' }
      ],
      exercises: [
        { type: 'read-match', question: 'Đọc và nối từ với hình', pairs: [{ word: 'xe', image: '🚗' }, { word: 'tàu', image: '🚂' }, { word: 'thuyền', image: '⛵' }] },
        { type: 'listen-read', question: 'Nghe và đọc theo', words: ['xe', 'tàu', 'máy bay', 'thuyền', 'xe đạp'] }
      ],
      quiz: [
        { question: '🚗 đọc là gì?', options: ['Xe', 'Tàu', 'Thuyền', 'Máy bay'], correctAnswer: 0, explanation: 'Cái xe (ô tô)' },
        { question: '✈️ đọc là gì?', options: ['Máy bay', 'Tàu', 'Xe', 'Thuyền'], correctAnswer: 0, explanation: 'Máy bay' },
        { question: '⛵ đọc là gì?', options: ['Thuyền', 'Tàu', 'Xe', 'Máy bay'], correctAnswer: 0, explanation: 'Con thuyền' },
        { question: 'Đi trên trời bằng gì?', options: ['Máy bay', 'Xe', 'Tàu', 'Thuyền'], correctAnswer: 0, explanation: 'Máy bay bay trên trời' },
        { question: 'Đi trên biển bằng gì?', options: ['Thuyền', 'Xe', 'Tàu', 'Máy bay'], correctAnswer: 0, explanation: 'Thuyền đi trên biển' }
      ]
    }
  },

  // ========== BÀI 11: ĐỌC CÂU NGẮN 1 ==========
  'tv1-td-11': {
    id: 'tv1-td-11',
    title: 'Đọc câu: Bé ăn cơm',
    subject: 'tieng-viet',
    grade: 1,
    category: 'tap-doc',
    order: 11,
    duration: 12,
    icon: '🍚',
    color: 'from-yellow-400 to-amber-500',
    objectives: ['Đọc câu ngắn', 'Hiểu nghĩa câu', 'Ghép từ thành câu'],
    content: {
      introduction: { title: 'Đọc câu ngắn', description: 'Học đọc câu đơn giản: Bé ăn cơm', image: '🍚' },
      vocabulary: [
        { word: 'Bé ăn cơm.', meaning: 'Em bé đang ăn cơm', image: '👶🍚', audio: 'beancơm.mp3' },
        { word: 'Bé', meaning: 'Em bé', image: '👶', audio: 'be.mp3' },
        { word: 'ăn', meaning: 'Ăn', image: '🍽️', audio: 'an.mp3' },
        { word: 'cơm', meaning: 'Cơm', image: '🍚', audio: 'com.mp3' }
      ],
      exercises: [
        { type: 'sentence-build', question: 'Ghép thành câu', words: ['Bé', 'ăn', 'cơm'], answer: 'Bé ăn cơm.' },
        { type: 'read-sentence', question: 'Đọc câu', sentence: 'Bé ăn cơm.', image: '👶🍚' }
      ],
      quiz: [
        { question: 'Ai ăn cơm?', options: ['Bé', 'Mẹ', 'Ba', 'Bà'], correctAnswer: 0, explanation: 'Bé ăn cơm' },
        { question: 'Bé làm gì?', options: ['Ăn cơm', 'Ngủ', 'Chơi', 'Học'], correctAnswer: 0, explanation: 'Bé ăn cơm' },
        { question: 'Bé ăn gì?', options: ['Cơm', 'Phở', 'Bánh', 'Cháo'], correctAnswer: 0, explanation: 'Bé ăn cơm' },
        { question: 'Sắp xếp thành câu: ăn/Bé/cơm', options: ['Bé ăn cơm', 'Ăn Bé cơm', 'Cơm Bé ăn', 'Ăn cơm Bé'], correctAnswer: 0, explanation: 'Bé ăn cơm' },
        { question: 'Câu có mấy từ?', options: ['3', '2', '4', '5'], correctAnswer: 0, explanation: 'Có 3 từ: Bé, ăn, cơm' }
      ]
    }
  },

  // ========== BÀI 12: ĐỌC CÂU NGẮN 2 ==========
  'tv1-td-12': {
    id: 'tv1-td-12',
    title: 'Đọc câu: Mẹ đi chợ',
    subject: 'tieng-viet',
    grade: 1,
    category: 'tap-doc',
    order: 12,
    duration: 12,
    icon: '🛒',
    color: 'from-green-400 to-teal-500',
    objectives: ['Đọc câu ngắn', 'Hiểu nghĩa câu', 'Ghép từ thành câu'],
    content: {
      introduction: { title: 'Đọc câu ngắn', description: 'Học đọc câu đơn giản: Mẹ đi chợ', image: '🛒' },
      vocabulary: [
        { word: 'Mẹ đi chợ.', meaning: 'Mẹ đang đi chợ', image: '👩🛒', audio: 'medicho.mp3' },
        { word: 'Mẹ', meaning: 'Mẹ', image: '👩', audio: 'me.mp3' },
        { word: 'đi', meaning: 'Đi', image: '🚶', audio: 'di.mp3' },
        { word: 'chợ', meaning: 'Chợ', image: '🏪', audio: 'cho.mp3' }
      ],
      exercises: [
        { type: 'sentence-build', question: 'Ghép thành câu', words: ['Mẹ', 'đi', 'chợ'], answer: 'Mẹ đi chợ.' },
        { type: 'read-sentence', question: 'Đọc câu', sentence: 'Mẹ đi chợ.', image: '👩🛒' }
      ],
      quiz: [
        { question: 'Ai đi chợ?', options: ['Mẹ', 'Ba', 'Bé', 'Bà'], correctAnswer: 0, explanation: 'Mẹ đi chợ' },
        { question: 'Mẹ đi đâu?', options: ['Chợ', 'Trường', 'Công viên', 'Nhà'], correctAnswer: 0, explanation: 'Mẹ đi chợ' },
        { question: 'Mẹ làm gì?', options: ['Đi chợ', 'Nấu cơm', 'Ngủ', 'Đọc sách'], correctAnswer: 0, explanation: 'Mẹ đi chợ' },
        { question: 'Sắp xếp: chợ/đi/Mẹ', options: ['Mẹ đi chợ', 'Đi Mẹ chợ', 'Chợ đi Mẹ', 'Đi chợ Mẹ'], correctAnswer: 0, explanation: 'Mẹ đi chợ' },
        { question: 'Câu có mấy từ?', options: ['3', '2', '4', '5'], correctAnswer: 0, explanation: 'Có 3 từ: Mẹ, đi, chợ' }
      ]
    }
  },

  // ========== BÀI 13: ĐỌC CÂU NGẮN 3 ==========
  'tv1-td-13': {
    id: 'tv1-td-13',
    title: 'Đọc câu: Ba đọc báo',
    subject: 'tieng-viet',
    grade: 1,
    category: 'tap-doc',
    order: 13,
    duration: 12,
    icon: '📰',
    color: 'from-blue-400 to-indigo-500',
    objectives: ['Đọc câu ngắn', 'Hiểu nghĩa câu', 'Ghép từ thành câu'],
    content: {
      introduction: { title: 'Đọc câu ngắn', description: 'Học đọc câu: Ba đọc báo', image: '📰' },
      vocabulary: [
        { word: 'Ba đọc báo.', meaning: 'Ba đang đọc báo', image: '👨📰', audio: 'badocbao.mp3' },
        { word: 'Ba', meaning: 'Ba (bố)', image: '👨', audio: 'ba.mp3' },
        { word: 'đọc', meaning: 'Đọc', image: '📖', audio: 'doc.mp3' },
        { word: 'báo', meaning: 'Tờ báo', image: '📰', audio: 'bao.mp3' }
      ],
      exercises: [
        { type: 'sentence-build', question: 'Ghép thành câu', words: ['Ba', 'đọc', 'báo'], answer: 'Ba đọc báo.' },
        { type: 'read-sentence', question: 'Đọc câu', sentence: 'Ba đọc báo.', image: '👨📰' }
      ],
      quiz: [
        { question: 'Ai đọc báo?', options: ['Ba', 'Mẹ', 'Bé', 'Bà'], correctAnswer: 0, explanation: 'Ba đọc báo' },
        { question: 'Ba làm gì?', options: ['Đọc báo', 'Nấu cơm', 'Đi chợ', 'Ngủ'], correctAnswer: 0, explanation: 'Ba đọc báo' },
        { question: 'Ba đọc gì?', options: ['Báo', 'Sách', 'Truyện', 'Vở'], correctAnswer: 0, explanation: 'Ba đọc báo' },
        { question: 'Sắp xếp: báo/Ba/đọc', options: ['Ba đọc báo', 'Đọc Ba báo', 'Báo đọc Ba', 'Đọc báo Ba'], correctAnswer: 0, explanation: 'Ba đọc báo' },
        { question: 'Câu có mấy từ?', options: ['3', '2', '4', '5'], correctAnswer: 0, explanation: 'Có 3 từ: Ba, đọc, báo' }
      ]
    }
  },

  // ========== BÀI 14: ĐỌC CÂU NGẮN 4 ==========
  'tv1-td-14': {
    id: 'tv1-td-14',
    title: 'Đọc câu: Bà nấu cơm',
    subject: 'tieng-viet',
    grade: 1,
    category: 'tap-doc',
    order: 14,
    duration: 12,
    icon: '🍳',
    color: 'from-orange-400 to-red-500',
    objectives: ['Đọc câu ngắn', 'Hiểu nghĩa câu', 'Ghép từ thành câu'],
    content: {
      introduction: { title: 'Đọc câu ngắn', description: 'Học đọc câu: Bà nấu cơm', image: '🍳' },
      vocabulary: [
        { word: 'Bà nấu cơm.', meaning: 'Bà đang nấu cơm', image: '👵🍳', audio: 'banaucom.mp3' },
        { word: 'Bà', meaning: 'Bà nội/ngoại', image: '👵', audio: 'ba2.mp3' },
        { word: 'nấu', meaning: 'Nấu', image: '🍳', audio: 'nau.mp3' },
        { word: 'cơm', meaning: 'Cơm', image: '🍚', audio: 'com.mp3' }
      ],
      exercises: [
        { type: 'sentence-build', question: 'Ghép thành câu', words: ['Bà', 'nấu', 'cơm'], answer: 'Bà nấu cơm.' },
        { type: 'read-sentence', question: 'Đọc câu', sentence: 'Bà nấu cơm.', image: '👵🍳' }
      ],
      quiz: [
        { question: 'Ai nấu cơm?', options: ['Bà', 'Mẹ', 'Ba', 'Bé'], correctAnswer: 0, explanation: 'Bà nấu cơm' },
        { question: 'Bà làm gì?', options: ['Nấu cơm', 'Đọc báo', 'Đi chợ', 'Ngủ'], correctAnswer: 0, explanation: 'Bà nấu cơm' },
        { question: 'Bà nấu gì?', options: ['Cơm', 'Phở', 'Canh', 'Bánh'], correctAnswer: 0, explanation: 'Bà nấu cơm' },
        { question: 'Sắp xếp: cơm/nấu/Bà', options: ['Bà nấu cơm', 'Nấu Bà cơm', 'Cơm nấu Bà', 'Nấu cơm Bà'], correctAnswer: 0, explanation: 'Bà nấu cơm' },
        { question: 'Câu có mấy từ?', options: ['3', '2', '4', '5'], correctAnswer: 0, explanation: 'Có 3 từ: Bà, nấu, cơm' }
      ]
    }
  },

  // ========== BÀI 15: ĐỌC CÂU NGẮN 5 ==========
  'tv1-td-15': {
    id: 'tv1-td-15',
    title: 'Đọc câu: Bé đi học',
    subject: 'tieng-viet',
    grade: 1,
    category: 'tap-doc',
    order: 15,
    duration: 12,
    icon: '🎒',
    color: 'from-purple-400 to-pink-500',
    objectives: ['Đọc câu ngắn', 'Hiểu nghĩa câu', 'Ghép từ thành câu'],
    content: {
      introduction: { title: 'Đọc câu ngắn', description: 'Học đọc câu: Bé đi học', image: '🎒' },
      vocabulary: [
        { word: 'Bé đi học.', meaning: 'Bé đang đi học', image: '👶🎒', audio: 'bedihoc.mp3' },
        { word: 'Bé', meaning: 'Em bé', image: '👶', audio: 'be.mp3' },
        { word: 'đi', meaning: 'Đi', image: '🚶', audio: 'di.mp3' },
        { word: 'học', meaning: 'Học', image: '📖', audio: 'hoc.mp3' }
      ],
      exercises: [
        { type: 'sentence-build', question: 'Ghép thành câu', words: ['Bé', 'đi', 'học'], answer: 'Bé đi học.' },
        { type: 'read-sentence', question: 'Đọc câu', sentence: 'Bé đi học.', image: '👶🎒' }
      ],
      quiz: [
        { question: 'Ai đi học?', options: ['Bé', 'Mẹ', 'Ba', 'Bà'], correctAnswer: 0, explanation: 'Bé đi học' },
        { question: 'Bé đi đâu?', options: ['Học', 'Chợ', 'Chơi', 'Ngủ'], correctAnswer: 0, explanation: 'Bé đi học' },
        { question: 'Bé làm gì?', options: ['Đi học', 'Ăn cơm', 'Ngủ', 'Chơi'], correctAnswer: 0, explanation: 'Bé đi học' },
        { question: 'Sắp xếp: học/đi/Bé', options: ['Bé đi học', 'Đi Bé học', 'Học đi Bé', 'Đi học Bé'], correctAnswer: 0, explanation: 'Bé đi học' },
        { question: 'Buổi sáng bé thường?', options: ['Đi học', 'Ngủ', 'Chơi game', 'Xem TV'], correctAnswer: 0, explanation: 'Buổi sáng bé đi học' }
      ]
    }
  },

  // ========== BÀI 16: ĐỌC CÂU - CHÓ SỦA ==========
  'tv1-td-16': {
    id: 'tv1-td-16',
    title: 'Đọc câu: Chó sủa gâu gâu',
    subject: 'tieng-viet',
    grade: 1,
    category: 'tap-doc',
    order: 16,
    duration: 12,
    icon: '🐕',
    color: 'from-amber-400 to-yellow-500',
    objectives: ['Đọc câu dài hơn', 'Hiểu từ tượng thanh', 'Nhận biết tiếng kêu'],
    content: {
      introduction: { title: 'Đọc câu', description: 'Học đọc câu: Chó sủa gâu gâu', image: '🐕' },
      vocabulary: [
        { word: 'Chó sủa gâu gâu.', meaning: 'Con chó đang sủa', image: '🐕', audio: 'chosuagaugau.mp3' },
        { word: 'chó', meaning: 'Con chó', image: '🐕', audio: 'cho.mp3' },
        { word: 'sủa', meaning: 'Sủa (kêu)', image: '📢', audio: 'sua.mp3' },
        { word: 'gâu gâu', meaning: 'Tiếng chó sủa', image: '🔊', audio: 'gaugau.mp3' }
      ],
      exercises: [
        { type: 'sentence-build', question: 'Ghép thành câu', words: ['Chó', 'sủa', 'gâu gâu'], answer: 'Chó sủa gâu gâu.' },
        { type: 'sound-match', question: 'Nối con vật với tiếng kêu', pairs: [{ animal: '🐕', sound: 'Gâu gâu' }] }
      ],
      quiz: [
        { question: 'Con gì sủa gâu gâu?', options: ['Chó', 'Mèo', 'Gà', 'Vịt'], correctAnswer: 0, explanation: 'Chó sủa gâu gâu' },
        { question: 'Chó kêu thế nào?', options: ['Gâu gâu', 'Meo meo', 'Cục cục', 'Quạc quạc'], correctAnswer: 0, explanation: 'Chó sủa gâu gâu' },
        { question: '"Gâu gâu" là tiếng của con gì?', options: ['Chó', 'Mèo', 'Gà', 'Vịt'], correctAnswer: 0, explanation: 'Tiếng chó' },
        { question: 'Câu có mấy từ?', options: ['3', '2', '4', '5'], correctAnswer: 0, explanation: 'Có 3 từ: Chó, sủa, gâu gâu' },
        { question: 'Chó làm gì?', options: ['Sủa', 'Kêu', 'Hát', 'Ngủ'], correctAnswer: 0, explanation: 'Chó sủa' }
      ]
    }
  },

  // ========== BÀI 17: ĐỌC CÂU - MÈO KÊU ==========
  'tv1-td-17': {
    id: 'tv1-td-17',
    title: 'Đọc câu: Mèo kêu meo meo',
    subject: 'tieng-viet',
    grade: 1,
    category: 'tap-doc',
    order: 17,
    duration: 12,
    icon: '🐱',
    color: 'from-gray-400 to-slate-500',
    objectives: ['Đọc câu dài hơn', 'Hiểu từ tượng thanh', 'Nhận biết tiếng kêu'],
    content: {
      introduction: { title: 'Đọc câu', description: 'Học đọc câu: Mèo kêu meo meo', image: '🐱' },
      vocabulary: [
        { word: 'Mèo kêu meo meo.', meaning: 'Con mèo đang kêu', image: '🐱', audio: 'meokeumeo.mp3' },
        { word: 'mèo', meaning: 'Con mèo', image: '🐱', audio: 'meo.mp3' },
        { word: 'kêu', meaning: 'Kêu (phát ra tiếng)', image: '📢', audio: 'keu.mp3' },
        { word: 'meo meo', meaning: 'Tiếng mèo kêu', image: '🔊', audio: 'meomeo.mp3' }
      ],
      exercises: [
        { type: 'sentence-build', question: 'Ghép thành câu', words: ['Mèo', 'kêu', 'meo meo'], answer: 'Mèo kêu meo meo.' },
        { type: 'sound-match', question: 'Nối con vật với tiếng kêu', pairs: [{ animal: '🐱', sound: 'Meo meo' }] }
      ],
      quiz: [
        { question: 'Con gì kêu meo meo?', options: ['Mèo', 'Chó', 'Gà', 'Vịt'], correctAnswer: 0, explanation: 'Mèo kêu meo meo' },
        { question: 'Mèo kêu thế nào?', options: ['Meo meo', 'Gâu gâu', 'Cục cục', 'Quạc quạc'], correctAnswer: 0, explanation: 'Mèo kêu meo meo' },
        { question: '"Meo meo" là tiếng của con gì?', options: ['Mèo', 'Chó', 'Gà', 'Vịt'], correctAnswer: 0, explanation: 'Tiếng mèo' },
        { question: 'Câu có mấy từ?', options: ['3', '2', '4', '5'], correctAnswer: 0, explanation: 'Có 3 từ: Mèo, kêu, meo meo' },
        { question: 'Mèo làm gì?', options: ['Kêu', 'Sủa', 'Hát', 'Ngủ'], correctAnswer: 0, explanation: 'Mèo kêu' }
      ]
    }
  },

  // ========== BÀI 18: ĐỌC CÂU - GÀ GÁY ==========
  'tv1-td-18': {
    id: 'tv1-td-18',
    title: 'Đọc câu: Gà gáy ò ó o',
    subject: 'tieng-viet',
    grade: 1,
    category: 'tap-doc',
    order: 18,
    duration: 12,
    icon: '🐓',
    color: 'from-red-400 to-orange-500',
    objectives: ['Đọc câu dài hơn', 'Hiểu từ tượng thanh', 'Nhận biết tiếng kêu'],
    content: {
      introduction: { title: 'Đọc câu', description: 'Học đọc câu: Gà gáy ò ó o', image: '🐓' },
      vocabulary: [
        { word: 'Gà gáy ò ó o.', meaning: 'Gà trống đang gáy', image: '🐓', audio: 'gagayooo.mp3' },
        { word: 'gà', meaning: 'Con gà', image: '🐓', audio: 'ga.mp3' },
        { word: 'gáy', meaning: 'Gáy (gà trống kêu)', image: '📢', audio: 'gay.mp3' },
        { word: 'ò ó o', meaning: 'Tiếng gà gáy', image: '🔊', audio: 'ooo.mp3' }
      ],
      exercises: [
        { type: 'sentence-build', question: 'Ghép thành câu', words: ['Gà', 'gáy', 'ò ó o'], answer: 'Gà gáy ò ó o.' },
        { type: 'sound-match', question: 'Nối con vật với tiếng kêu', pairs: [{ animal: '🐓', sound: 'Ò ó o' }] }
      ],
      quiz: [
        { question: 'Con gì gáy ò ó o?', options: ['Gà', 'Vịt', 'Chó', 'Mèo'], correctAnswer: 0, explanation: 'Gà gáy ò ó o' },
        { question: 'Gà gáy thế nào?', options: ['Ò ó o', 'Meo meo', 'Gâu gâu', 'Quạc quạc'], correctAnswer: 0, explanation: 'Gà gáy ò ó o' },
        { question: 'Gà gáy vào lúc nào?', options: ['Sáng sớm', 'Tối', 'Trưa', 'Chiều'], correctAnswer: 0, explanation: 'Gà gáy sáng sớm' },
        { question: '"Ò ó o" là tiếng của con gì?', options: ['Gà', 'Vịt', 'Chó', 'Mèo'], correctAnswer: 0, explanation: 'Tiếng gà gáy' },
        { question: 'Gà làm gì?', options: ['Gáy', 'Sủa', 'Kêu meo meo', 'Ngủ'], correctAnswer: 0, explanation: 'Gà gáy' }
      ]
    }
  },

  // ========== BÀI 19: ĐỌC ĐOẠN NGẮN 1 ==========
  'tv1-td-19': {
    id: 'tv1-td-19',
    title: 'Đọc đoạn: Gia đình em',
    subject: 'tieng-viet',
    grade: 1,
    category: 'tap-doc',
    order: 19,
    duration: 15,
    icon: '👨‍👩‍👧',
    color: 'from-pink-400 to-rose-500',
    objectives: ['Đọc đoạn văn ngắn', 'Hiểu nội dung', 'Trả lời câu hỏi'],
    content: {
      introduction: { title: 'Đọc đoạn văn', description: 'Đọc đoạn văn ngắn về gia đình', image: '👨‍👩‍👧' },
      vocabulary: [
        { word: 'Gia đình em có ba, mẹ và em. Ba đi làm. Mẹ nấu cơm. Em đi học.', meaning: 'Đoạn văn về gia đình', image: '👨‍👩‍👧', audio: 'giadinhem.mp3' }
      ],
      exercises: [
        { type: 'read-paragraph', question: 'Đọc đoạn văn', text: 'Gia đình em có ba, mẹ và em. Ba đi làm. Mẹ nấu cơm. Em đi học.' },
        { type: 'comprehension', question: 'Trả lời câu hỏi về đoạn văn' }
      ],
      quiz: [
        { question: 'Gia đình em có mấy người?', options: ['3 người', '2 người', '4 người', '5 người'], correctAnswer: 0, explanation: 'Ba, mẹ và em = 3 người' },
        { question: 'Ba làm gì?', options: ['Đi làm', 'Nấu cơm', 'Đi học', 'Ngủ'], correctAnswer: 0, explanation: 'Ba đi làm' },
        { question: 'Mẹ làm gì?', options: ['Nấu cơm', 'Đi làm', 'Đi học', 'Đi chợ'], correctAnswer: 0, explanation: 'Mẹ nấu cơm' },
        { question: 'Em làm gì?', options: ['Đi học', 'Đi làm', 'Nấu cơm', 'Ngủ'], correctAnswer: 0, explanation: 'Em đi học' },
        { question: 'Đoạn văn nói về gì?', options: ['Gia đình', 'Trường học', 'Con vật', 'Hoa quả'], correctAnswer: 0, explanation: 'Đoạn văn nói về gia đình' }
      ]
    }
  },

  // ========== BÀI 20: ĐỌC ĐOẠN NGẮN 2 ==========
  'tv1-td-20': {
    id: 'tv1-td-20',
    title: 'Đọc đoạn: Buổi sáng',
    subject: 'tieng-viet',
    grade: 1,
    category: 'tap-doc',
    order: 20,
    duration: 15,
    icon: '🌅',
    color: 'from-yellow-400 to-orange-500',
    objectives: ['Đọc đoạn văn ngắn', 'Hiểu nội dung', 'Trả lời câu hỏi'],
    content: {
      introduction: { title: 'Đọc đoạn văn', description: 'Đọc đoạn văn ngắn về buổi sáng', image: '🌅' },
      vocabulary: [
        { word: 'Buổi sáng, em dậy sớm. Em đánh răng rửa mặt. Em ăn sáng. Em đi học.', meaning: 'Đoạn văn về buổi sáng', image: '🌅', audio: 'buoisang.mp3' }
      ],
      exercises: [
        { type: 'read-paragraph', question: 'Đọc đoạn văn', text: 'Buổi sáng, em dậy sớm. Em đánh răng rửa mặt. Em ăn sáng. Em đi học.' },
        { type: 'comprehension', question: 'Trả lời câu hỏi về đoạn văn' }
      ],
      quiz: [
        { question: 'Buổi sáng em làm gì đầu tiên?', options: ['Dậy sớm', 'Ăn sáng', 'Đi học', 'Chơi'], correctAnswer: 0, explanation: 'Buổi sáng em dậy sớm' },
        { question: 'Sau khi dậy, em làm gì?', options: ['Đánh răng rửa mặt', 'Ăn sáng', 'Đi học', 'Ngủ'], correctAnswer: 0, explanation: 'Em đánh răng rửa mặt' },
        { question: 'Trước khi đi học, em làm gì?', options: ['Ăn sáng', 'Ngủ', 'Chơi', 'Xem TV'], correctAnswer: 0, explanation: 'Em ăn sáng' },
        { question: 'Cuối cùng em làm gì?', options: ['Đi học', 'Ăn sáng', 'Ngủ', 'Chơi'], correctAnswer: 0, explanation: 'Em đi học' },
        { question: 'Đoạn văn nói về lúc nào?', options: ['Buổi sáng', 'Buổi trưa', 'Buổi tối', 'Buổi chiều'], correctAnswer: 0, explanation: 'Đoạn văn nói về buổi sáng' }
      ]
    }
  }
};

// Export helper functions
export const getTapDocLesson = (lessonId) => {
  return TAP_DOC_LESSONS[lessonId] || null;
};

export const getTapDocLessonList = () => {
  return Object.values(TAP_DOC_LESSONS).sort((a, b) => a.order - b.order);
};
