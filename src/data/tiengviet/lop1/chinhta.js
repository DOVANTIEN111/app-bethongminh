// src/data/tiengviet/lop1/chinhta.js
// 10 BÀI CHÍNH TẢ - TIẾNG VIỆT LỚP 1

export const CHINH_TA_LESSONS = {
  // ========== BÀI 1: NGHE VIẾT TỪ 1 - GIA ĐÌNH ==========
  'tv1-ct-01': {
    id: 'tv1-ct-01',
    title: 'Nghe viết: Gia đình',
    subject: 'tieng-viet',
    grade: 1,
    category: 'chinh-ta',
    order: 1,
    duration: 10,
    icon: '👨‍👩‍👧',
    color: 'from-pink-400 to-rose-500',
    objectives: ['Nghe và viết đúng từ về gia đình', 'Phân biệt các từ có âm giống nhau', 'Rèn kỹ năng nghe'],
    content: {
      introduction: {
        title: 'Nghe viết từ về gia đình',
        description: 'Nghe từ và chọn cách viết đúng',
        image: '👨‍👩‍👧'
      },
      dictation: [
        { word: 'ba', audio: 'ba.mp3', image: '👨', meaning: 'Ba (bố)' },
        { word: 'má', audio: 'ma.mp3', image: '👩', meaning: 'Má (mẹ)' },
        { word: 'bé', audio: 'be.mp3', image: '👶', meaning: 'Em bé' },
        { word: 'bà', audio: 'ba2.mp3', image: '👵', meaning: 'Bà nội/ngoại' },
        { word: 'ông', audio: 'ong.mp3', image: '👴', meaning: 'Ông nội/ngoại' }
      ],
      exercises: [
        { type: 'listen-choose', question: 'Nghe và chọn từ đúng', audio: 'ba.mp3', options: ['ba', 'bà', 'bá', 'bả'], answer: 0 },
        { type: 'listen-choose', question: 'Nghe và chọn từ đúng', audio: 'ma.mp3', options: ['má', 'ma', 'mà', 'mả'], answer: 0 },
        { type: 'listen-choose', question: 'Nghe và chọn từ đúng', audio: 'be.mp3', options: ['bé', 'be', 'bè', 'bẻ'], answer: 0 }
      ],
      quiz: [
        { question: 'Nghe: "ba" - Chọn từ đúng', options: ['ba', 'bà', 'bá', 'bả'], correctAnswer: 0, explanation: 'ba - không dấu' },
        { question: 'Nghe: "má" - Chọn từ đúng', options: ['má', 'ma', 'mà', 'mả'], correctAnswer: 0, explanation: 'má - dấu sắc' },
        { question: 'Nghe: "bé" - Chọn từ đúng', options: ['bé', 'be', 'bè', 'bẻ'], correctAnswer: 0, explanation: 'bé - dấu sắc' },
        { question: 'Nghe: "bà" - Chọn từ đúng', options: ['bà', 'ba', 'bá', 'bả'], correctAnswer: 0, explanation: 'bà - dấu huyền' },
        { question: 'Nghe: "ông" - Chọn từ đúng', options: ['ông', 'ong', 'óng', 'ỏng'], correctAnswer: 0, explanation: 'ông - không dấu, có dấu mũ' }
      ]
    }
  },

  // ========== BÀI 2: NGHE VIẾT TỪ 2 - ĐỘNG VẬT ==========
  'tv1-ct-02': {
    id: 'tv1-ct-02',
    title: 'Nghe viết: Động vật',
    subject: 'tieng-viet',
    grade: 1,
    category: 'chinh-ta',
    order: 2,
    duration: 10,
    icon: '🐾',
    color: 'from-green-400 to-emerald-500',
    objectives: ['Nghe và viết đúng từ về động vật', 'Phân biệt dấu thanh', 'Rèn kỹ năng nghe'],
    content: {
      introduction: {
        title: 'Nghe viết từ về động vật',
        description: 'Nghe từ và chọn cách viết đúng',
        image: '🐾'
      },
      dictation: [
        { word: 'cá', audio: 'ca.mp3', image: '🐟', meaning: 'Con cá' },
        { word: 'gà', audio: 'ga.mp3', image: '🐔', meaning: 'Con gà' },
        { word: 'vịt', audio: 'vit.mp3', image: '🦆', meaning: 'Con vịt' },
        { word: 'mèo', audio: 'meo.mp3', image: '🐱', meaning: 'Con mèo' },
        { word: 'chó', audio: 'cho.mp3', image: '🐕', meaning: 'Con chó' }
      ],
      exercises: [
        { type: 'listen-choose', question: 'Nghe và chọn từ đúng', audio: 'ca.mp3', options: ['cá', 'ca', 'cà', 'cả'], answer: 0 },
        { type: 'listen-choose', question: 'Nghe và chọn từ đúng', audio: 'ga.mp3', options: ['gà', 'ga', 'gá', 'gả'], answer: 0 },
        { type: 'listen-choose', question: 'Nghe và chọn từ đúng', audio: 'meo.mp3', options: ['mèo', 'meo', 'méo', 'mẻo'], answer: 0 }
      ],
      quiz: [
        { question: 'Nghe: "cá" - Chọn từ đúng', options: ['cá', 'ca', 'cà', 'cả'], correctAnswer: 0, explanation: 'cá - dấu sắc' },
        { question: 'Nghe: "gà" - Chọn từ đúng', options: ['gà', 'ga', 'gá', 'gả'], correctAnswer: 0, explanation: 'gà - dấu huyền' },
        { question: 'Nghe: "vịt" - Chọn từ đúng', options: ['vịt', 'vit', 'vít', 'vỉt'], correctAnswer: 0, explanation: 'vịt - dấu nặng' },
        { question: 'Nghe: "mèo" - Chọn từ đúng', options: ['mèo', 'meo', 'méo', 'mẻo'], correctAnswer: 0, explanation: 'mèo - dấu huyền' },
        { question: 'Nghe: "chó" - Chọn từ đúng', options: ['chó', 'cho', 'chò', 'chỏ'], correctAnswer: 0, explanation: 'chó - dấu sắc' }
      ]
    }
  },

  // ========== BÀI 3: NGHE VIẾT TỪ 3 - MÀU SẮC ==========
  'tv1-ct-03': {
    id: 'tv1-ct-03',
    title: 'Nghe viết: Màu sắc',
    subject: 'tieng-viet',
    grade: 1,
    category: 'chinh-ta',
    order: 3,
    duration: 10,
    icon: '🌈',
    color: 'from-rainbow-400 to-gradient-500',
    objectives: ['Nghe và viết đúng từ về màu sắc', 'Phân biệt dấu thanh', 'Rèn kỹ năng nghe'],
    content: {
      introduction: {
        title: 'Nghe viết từ về màu sắc',
        description: 'Nghe từ và chọn cách viết đúng',
        image: '🌈'
      },
      dictation: [
        { word: 'đỏ', audio: 'do.mp3', image: '🔴', meaning: 'Màu đỏ' },
        { word: 'vàng', audio: 'vang.mp3', image: '🟡', meaning: 'Màu vàng' },
        { word: 'xanh', audio: 'xanh.mp3', image: '🟢', meaning: 'Màu xanh' },
        { word: 'tím', audio: 'tim.mp3', image: '🟣', meaning: 'Màu tím' },
        { word: 'trắng', audio: 'trang.mp3', image: '⚪', meaning: 'Màu trắng' }
      ],
      exercises: [
        { type: 'listen-choose', question: 'Nghe và chọn từ đúng', audio: 'do.mp3', options: ['đỏ', 'đo', 'đò', 'đỏ'], answer: 0 },
        { type: 'listen-choose', question: 'Nghe và chọn từ đúng', audio: 'vang.mp3', options: ['vàng', 'vang', 'váng', 'vảng'], answer: 0 }
      ],
      quiz: [
        { question: 'Nghe: "đỏ" - Chọn từ đúng', options: ['đỏ', 'đo', 'đò', 'đọ'], correctAnswer: 0, explanation: 'đỏ - dấu hỏi' },
        { question: 'Nghe: "vàng" - Chọn từ đúng', options: ['vàng', 'vang', 'váng', 'vảng'], correctAnswer: 0, explanation: 'vàng - dấu huyền' },
        { question: 'Nghe: "xanh" - Chọn từ đúng', options: ['xanh', 'sanh', 'xành', 'xãnh'], correctAnswer: 0, explanation: 'xanh - không dấu' },
        { question: 'Nghe: "tím" - Chọn từ đúng', options: ['tím', 'tim', 'tìm', 'tỉm'], correctAnswer: 0, explanation: 'tím - dấu sắc' },
        { question: 'Nghe: "trắng" - Chọn từ đúng', options: ['trắng', 'trăng', 'tráng', 'trảng'], correctAnswer: 0, explanation: 'trắng - dấu sắc' }
      ]
    }
  },

  // ========== BÀI 4: NGHE VIẾT TỪ 4 - HOA QUẢ ==========
  'tv1-ct-04': {
    id: 'tv1-ct-04',
    title: 'Nghe viết: Hoa quả',
    subject: 'tieng-viet',
    grade: 1,
    category: 'chinh-ta',
    order: 4,
    duration: 10,
    icon: '🍎',
    color: 'from-red-400 to-pink-500',
    objectives: ['Nghe và viết đúng từ về hoa quả', 'Phân biệt dấu thanh', 'Rèn kỹ năng nghe'],
    content: {
      introduction: {
        title: 'Nghe viết từ về hoa quả',
        description: 'Nghe từ và chọn cách viết đúng',
        image: '🍎'
      },
      dictation: [
        { word: 'táo', audio: 'tao.mp3', image: '🍎', meaning: 'Quả táo' },
        { word: 'cam', audio: 'cam.mp3', image: '🍊', meaning: 'Quả cam' },
        { word: 'chuối', audio: 'chuoi.mp3', image: '🍌', meaning: 'Quả chuối' },
        { word: 'nho', audio: 'nho.mp3', image: '🍇', meaning: 'Quả nho' },
        { word: 'dưa', audio: 'dua.mp3', image: '🍉', meaning: 'Quả dưa' }
      ],
      exercises: [
        { type: 'listen-choose', question: 'Nghe và chọn từ đúng', audio: 'tao.mp3', options: ['táo', 'tao', 'tào', 'tảo'], answer: 0 },
        { type: 'listen-choose', question: 'Nghe và chọn từ đúng', audio: 'chuoi.mp3', options: ['chuối', 'chuoi', 'chuôi', 'chuỗi'], answer: 0 }
      ],
      quiz: [
        { question: 'Nghe: "táo" - Chọn từ đúng', options: ['táo', 'tao', 'tào', 'tảo'], correctAnswer: 0, explanation: 'táo - dấu sắc' },
        { question: 'Nghe: "cam" - Chọn từ đúng', options: ['cam', 'cám', 'càm', 'cảm'], correctAnswer: 0, explanation: 'cam - không dấu' },
        { question: 'Nghe: "chuối" - Chọn từ đúng', options: ['chuối', 'chuoi', 'chuôi', 'chuỗi'], correctAnswer: 0, explanation: 'chuối - dấu sắc' },
        { question: 'Nghe: "nho" - Chọn từ đúng', options: ['nho', 'nhó', 'nhò', 'nhọ'], correctAnswer: 0, explanation: 'nho - không dấu' },
        { question: 'Nghe: "dưa" - Chọn từ đúng', options: ['dưa', 'dừa', 'dứa', 'dựa'], correctAnswer: 0, explanation: 'dưa - không dấu' }
      ]
    }
  },

  // ========== BÀI 5: NGHE VIẾT TỪ 5 - HOẠT ĐỘNG ==========
  'tv1-ct-05': {
    id: 'tv1-ct-05',
    title: 'Nghe viết: Hoạt động',
    subject: 'tieng-viet',
    grade: 1,
    category: 'chinh-ta',
    order: 5,
    duration: 10,
    icon: '🏃',
    color: 'from-orange-400 to-amber-500',
    objectives: ['Nghe và viết đúng từ về hoạt động', 'Phân biệt dấu thanh', 'Rèn kỹ năng nghe'],
    content: {
      introduction: {
        title: 'Nghe viết từ về hoạt động',
        description: 'Nghe từ và chọn cách viết đúng',
        image: '🏃'
      },
      dictation: [
        { word: 'ăn', audio: 'an.mp3', image: '🍽️', meaning: 'Ăn cơm' },
        { word: 'uống', audio: 'uong.mp3', image: '🥤', meaning: 'Uống nước' },
        { word: 'ngủ', audio: 'ngu.mp3', image: '😴', meaning: 'Đi ngủ' },
        { word: 'học', audio: 'hoc.mp3', image: '📖', meaning: 'Đi học' },
        { word: 'chơi', audio: 'choi.mp3', image: '🎮', meaning: 'Đi chơi' }
      ],
      exercises: [
        { type: 'listen-choose', question: 'Nghe và chọn từ đúng', audio: 'an.mp3', options: ['ăn', 'an', 'ân', 'ẩn'], answer: 0 },
        { type: 'listen-choose', question: 'Nghe và chọn từ đúng', audio: 'ngu.mp3', options: ['ngủ', 'ngu', 'ngù', 'ngũ'], answer: 0 }
      ],
      quiz: [
        { question: 'Nghe: "ăn" - Chọn từ đúng', options: ['ăn', 'an', 'ân', 'ẩn'], correctAnswer: 0, explanation: 'ăn - chữ ă không dấu' },
        { question: 'Nghe: "uống" - Chọn từ đúng', options: ['uống', 'uong', 'ướng', 'ưởng'], correctAnswer: 0, explanation: 'uống - dấu sắc' },
        { question: 'Nghe: "ngủ" - Chọn từ đúng', options: ['ngủ', 'ngu', 'ngù', 'ngũ'], correctAnswer: 0, explanation: 'ngủ - dấu hỏi' },
        { question: 'Nghe: "học" - Chọn từ đúng', options: ['học', 'hoc', 'họcc', 'hốc'], correctAnswer: 0, explanation: 'học - dấu nặng' },
        { question: 'Nghe: "chơi" - Chọn từ đúng', options: ['chơi', 'choi', 'chời', 'chởi'], correctAnswer: 0, explanation: 'chơi - không dấu' }
      ]
    }
  },

  // ========== BÀI 6: PHÂN BIỆT C/K ==========
  'tv1-ct-06': {
    id: 'tv1-ct-06',
    title: 'Phân biệt: c/k',
    subject: 'tieng-viet',
    grade: 1,
    category: 'chinh-ta',
    order: 6,
    duration: 12,
    icon: '🔤',
    color: 'from-blue-400 to-indigo-500',
    objectives: ['Phân biệt khi nào dùng c, khi nào dùng k', 'Viết đúng chính tả', 'Nắm quy tắc'],
    content: {
      introduction: {
        title: 'Quy tắc c/k',
        description: 'C đứng trước a, ă, â, o, ô, ơ, u, ư. K đứng trước e, ê, i.',
        image: '🔤'
      },
      rules: [
        { rule: 'C + a, ă, â, o, ô, ơ, u, ư', examples: ['cá', 'căn', 'câu', 'cò', 'cô', 'cơ', 'cua', 'cư'] },
        { rule: 'K + e, ê, i', examples: ['kẻ', 'kê', 'kì'] }
      ],
      exercises: [
        { type: 'fill-blank', question: 'Con _á bơi', options: ['c', 'k'], answer: 0 },
        { type: 'fill-blank', question: '_ẻ vạch', options: ['k', 'c'], answer: 0 },
        { type: 'fill-blank', question: '_ẹo ngon', options: ['k', 'c'], answer: 0 }
      ],
      quiz: [
        { question: 'Điền c hay k: _á?', options: ['c', 'k'], correctAnswer: 0, explanation: 'cá - c đứng trước a' },
        { question: 'Điền c hay k: _ẻ?', options: ['k', 'c'], correctAnswer: 0, explanation: 'kẻ - k đứng trước e' },
        { question: 'Điền c hay k: _ẹo?', options: ['k', 'c'], correctAnswer: 0, explanation: 'kẹo - k đứng trước e' },
        { question: 'Điền c hay k: _ò?', options: ['c', 'k'], correctAnswer: 0, explanation: 'cò - c đứng trước o' },
        { question: 'Điền c hay k: _ì?', options: ['k', 'c'], correctAnswer: 0, explanation: 'kì - k đứng trước i' }
      ]
    }
  },

  // ========== BÀI 7: PHÂN BIỆT G/GH ==========
  'tv1-ct-07': {
    id: 'tv1-ct-07',
    title: 'Phân biệt: g/gh',
    subject: 'tieng-viet',
    grade: 1,
    category: 'chinh-ta',
    order: 7,
    duration: 12,
    icon: '📝',
    color: 'from-purple-400 to-pink-500',
    objectives: ['Phân biệt khi nào dùng g, khi nào dùng gh', 'Viết đúng chính tả', 'Nắm quy tắc'],
    content: {
      introduction: {
        title: 'Quy tắc g/gh',
        description: 'G đứng trước a, ă, â, o, ô, ơ, u, ư. GH đứng trước e, ê, i.',
        image: '📝'
      },
      rules: [
        { rule: 'G + a, ă, â, o, ô, ơ, u, ư', examples: ['gà', 'gắt', 'gấu', 'gỗ', 'gô', 'gơ', 'gù', 'gư'] },
        { rule: 'GH + e, ê, i', examples: ['ghẻ', 'ghế', 'ghi'] }
      ],
      exercises: [
        { type: 'fill-blank', question: 'Con _à', options: ['g', 'gh'], answer: 0 },
        { type: 'fill-blank', question: 'Cái _ế', options: ['gh', 'g'], answer: 0 },
        { type: 'fill-blank', question: '_i nhớ', options: ['gh', 'g'], answer: 0 }
      ],
      quiz: [
        { question: 'Điền g hay gh: _à?', options: ['g', 'gh'], correctAnswer: 0, explanation: 'gà - g đứng trước a' },
        { question: 'Điền g hay gh: _ế?', options: ['gh', 'g'], correctAnswer: 0, explanation: 'ghế - gh đứng trước e' },
        { question: 'Điền g hay gh: _i?', options: ['gh', 'g'], correctAnswer: 0, explanation: 'ghi - gh đứng trước i' },
        { question: 'Điền g hay gh: _ấu?', options: ['g', 'gh'], correctAnswer: 0, explanation: 'gấu - g đứng trước â' },
        { question: 'Điền g hay gh: _ê?', options: ['gh', 'g'], correctAnswer: 0, explanation: 'ghê - gh đứng trước ê' }
      ]
    }
  },

  // ========== BÀI 8: PHÂN BIỆT NG/NGH ==========
  'tv1-ct-08': {
    id: 'tv1-ct-08',
    title: 'Phân biệt: ng/ngh',
    subject: 'tieng-viet',
    grade: 1,
    category: 'chinh-ta',
    order: 8,
    duration: 12,
    icon: '✏️',
    color: 'from-teal-400 to-cyan-500',
    objectives: ['Phân biệt khi nào dùng ng, khi nào dùng ngh', 'Viết đúng chính tả', 'Nắm quy tắc'],
    content: {
      introduction: {
        title: 'Quy tắc ng/ngh',
        description: 'NG đứng trước a, ă, â, o, ô, ơ, u, ư. NGH đứng trước e, ê, i.',
        image: '✏️'
      },
      rules: [
        { rule: 'NG + a, ă, â, o, ô, ơ, u, ư', examples: ['ngà', 'ngăn', 'ngân', 'ngọ', 'ngô', 'ngơ', 'ngủ', 'ngư'] },
        { rule: 'NGH + e, ê, i', examples: ['nghe', 'nghề', 'nghỉ'] }
      ],
      exercises: [
        { type: 'fill-blank', question: '_ủ ngon', options: ['ng', 'ngh'], answer: 0 },
        { type: 'fill-blank', question: '_e nhạc', options: ['ngh', 'ng'], answer: 0 },
        { type: 'fill-blank', question: '_ỉ học', options: ['ngh', 'ng'], answer: 0 }
      ],
      quiz: [
        { question: 'Điền ng hay ngh: _ủ?', options: ['ng', 'ngh'], correctAnswer: 0, explanation: 'ngủ - ng đứng trước u' },
        { question: 'Điền ng hay ngh: _e?', options: ['ngh', 'ng'], correctAnswer: 0, explanation: 'nghe - ngh đứng trước e' },
        { question: 'Điền ng hay ngh: _ỉ?', options: ['ngh', 'ng'], correctAnswer: 0, explanation: 'nghỉ - ngh đứng trước i' },
        { question: 'Điền ng hay ngh: _ô?', options: ['ng', 'ngh'], correctAnswer: 0, explanation: 'ngô - ng đứng trước ô' },
        { question: 'Điền ng hay ngh: _ề?', options: ['ngh', 'ng'], correctAnswer: 0, explanation: 'nghề - ngh đứng trước ê' }
      ]
    }
  },

  // ========== BÀI 9: NGHE VIẾT CÂU 1 ==========
  'tv1-ct-09': {
    id: 'tv1-ct-09',
    title: 'Nghe viết câu đơn giản',
    subject: 'tieng-viet',
    grade: 1,
    category: 'chinh-ta',
    order: 9,
    duration: 15,
    icon: '📖',
    color: 'from-amber-400 to-orange-500',
    objectives: ['Nghe và viết đúng câu đơn giản', 'Viết đúng dấu câu', 'Rèn kỹ năng nghe viết'],
    content: {
      introduction: {
        title: 'Nghe viết câu đơn giản',
        description: 'Nghe câu và chọn cách viết đúng',
        image: '📖'
      },
      dictation: [
        { sentence: 'Bé ăn cơm.', audio: 'beancom.mp3' },
        { sentence: 'Mẹ đi chợ.', audio: 'medicho.mp3' },
        { sentence: 'Ba đọc báo.', audio: 'badocbao.mp3' }
      ],
      exercises: [
        { type: 'listen-choose-sentence', question: 'Nghe và chọn câu đúng', audio: 'beancom.mp3', options: ['Bé ăn cơm.', 'Bé an cơm.', 'Be ăn cơm.', 'Bé ăn com.'], answer: 0 },
        { type: 'listen-choose-sentence', question: 'Nghe và chọn câu đúng', audio: 'medicho.mp3', options: ['Mẹ đi chợ.', 'Me đi chợ.', 'Mẹ di chợ.', 'Mẹ đi cho.'], answer: 0 }
      ],
      quiz: [
        { question: 'Nghe: "Bé ăn cơm" - Chọn câu đúng', options: ['Bé ăn cơm.', 'Bé an cơm.', 'Be ăn cơm.', 'Bé ăn com.'], correctAnswer: 0, explanation: 'Bé ăn cơm.' },
        { question: 'Nghe: "Mẹ đi chợ" - Chọn câu đúng', options: ['Mẹ đi chợ.', 'Me đi chợ.', 'Mẹ di chợ.', 'Mẹ đi cho.'], correctAnswer: 0, explanation: 'Mẹ đi chợ.' },
        { question: 'Nghe: "Ba đọc báo" - Chọn câu đúng', options: ['Ba đọc báo.', 'Ba doc báo.', 'Ba đọc bao.', 'ba đọc báo.'], correctAnswer: 0, explanation: 'Ba đọc báo.' },
        { question: 'Câu phải bắt đầu bằng chữ gì?', options: ['Chữ hoa', 'Chữ thường', 'Số', 'Dấu'], correctAnswer: 0, explanation: 'Câu bắt đầu bằng chữ hoa' },
        { question: 'Cuối câu có dấu gì?', options: ['Dấu chấm', 'Dấu phẩy', 'Dấu hỏi', 'Không có'], correctAnswer: 0, explanation: 'Cuối câu có dấu chấm' }
      ]
    }
  },

  // ========== BÀI 10: ÔN TẬP CHÍNH TẢ ==========
  'tv1-ct-10': {
    id: 'tv1-ct-10',
    title: 'Ôn tập chính tả',
    subject: 'tieng-viet',
    grade: 1,
    category: 'chinh-ta',
    order: 10,
    duration: 15,
    icon: '🎯',
    color: 'from-gradient-400 to-rainbow-500',
    objectives: ['Ôn tập tất cả quy tắc chính tả', 'Nghe viết thành thạo', 'Viết đúng chính tả'],
    content: {
      introduction: {
        title: 'Ôn tập chính tả',
        description: 'Ôn tập tất cả các quy tắc đã học',
        image: '🎯'
      },
      review: [
        { topic: 'Dấu thanh', examples: ['sắc', 'huyền', 'hỏi', 'ngã', 'nặng'] },
        { topic: 'c/k', rule: 'C trước a,o,u. K trước e,ê,i' },
        { topic: 'g/gh', rule: 'G trước a,o,u. GH trước e,ê,i' },
        { topic: 'ng/ngh', rule: 'NG trước a,o,u. NGH trước e,ê,i' }
      ],
      exercises: [
        { type: 'mixed', question: 'Điền đúng: _á (c/k)', options: ['c', 'k'], answer: 0 },
        { type: 'mixed', question: 'Điền đúng: _ế (g/gh)', options: ['gh', 'g'], answer: 0 },
        { type: 'mixed', question: 'Điền đúng: _e (ng/ngh)', options: ['ngh', 'ng'], answer: 0 }
      ],
      quiz: [
        { question: 'c hay k: _on _á?', options: ['c, c', 'c, k', 'k, c', 'k, k'], correctAnswer: 0, explanation: 'con cá - c trước o, c trước a' },
        { question: 'g hay gh: _à _ế?', options: ['g, gh', 'gh, g', 'g, g', 'gh, gh'], correctAnswer: 0, explanation: 'gà ghế - g trước a, gh trước e' },
        { question: 'ng hay ngh: _ủ _ê?', options: ['ng, ngh', 'ngh, ng', 'ng, ng', 'ngh, ngh'], correctAnswer: 0, explanation: 'ngủ nghê - ng trước u, ngh trước ê' },
        { question: 'Từ nào viết đúng?', options: ['kẹo', 'cẹo', 'qẹo', 'gẹo'], correctAnswer: 0, explanation: 'kẹo - k trước e' },
        { question: 'Từ nào viết đúng?', options: ['ghế', 'gế', 'khế', 'hế'], correctAnswer: 0, explanation: 'ghế - gh trước e' }
      ]
    }
  }
};

// Export helper functions
export const getChinhTaLesson = (lessonId) => {
  return CHINH_TA_LESSONS[lessonId] || null;
};

export const getChinhTaLessonList = () => {
  return Object.values(CHINH_TA_LESSONS).sort((a, b) => a.order - b.order);
};
