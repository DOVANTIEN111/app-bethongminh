// src/data/tiengviet/lop1/hocvan.js
// 30 BÀI HỌC VẦN - TIẾNG VIỆT LỚP 1

export const HOC_VAN_LESSONS = {
  // ========== BÀI 1: CHỮ CÁI A ==========
  'tv1-hv-01': {
    id: 'tv1-hv-01',
    title: 'Chữ cái A',
    subject: 'tieng-viet',
    grade: 1,
    category: 'hoc-van',
    order: 1,
    duration: 10,
    icon: '🅰️',
    color: 'from-red-400 to-pink-500',
    objectives: ['Nhận biết chữ A, a', 'Đọc đúng âm "a"', 'Tìm từ có chữ a'],
    content: {
      introduction: {
        letter: 'A',
        letterLower: 'a',
        sound: '/a/',
        description: 'Chữ A là chữ cái đầu tiên trong bảng chữ cái tiếng Việt',
        image: '🍎'
      },
      vocabulary: [
        { word: 'ao', meaning: 'Ao nước', image: '💧', audio: 'ao.mp3' },
        { word: 'an', meaning: 'Bình an', image: '😊', audio: 'an.mp3' },
        { word: 'anh', meaning: 'Anh trai', image: '👦', audio: 'anh.mp3' },
        { word: 'ăn', meaning: 'Ăn cơm', image: '🍚', audio: 'an2.mp3' },
        { word: 'áo', meaning: 'Cái áo', image: '👕', audio: 'ao2.mp3' }
      ],
      exercises: [
        {
          type: 'listen-choose',
          question: 'Nghe và chọn chữ cái đúng',
          audio: 'a.mp3',
          options: ['A', 'B', 'C', 'D'],
          answer: 0
        },
        {
          type: 'image-match',
          question: 'Chọn hình bắt đầu bằng chữ A',
          options: [
            { image: '🍎', word: 'Áo', correct: true },
            { image: '🐕', word: 'Chó', correct: false },
            { image: '🐱', word: 'Mèo', correct: false },
            { image: '👕', word: 'Áo', correct: true }
          ]
        },
        {
          type: 'drag-match',
          question: 'Nối chữ với hình',
          pairs: [
            { letter: 'a', image: '🍎', word: 'Áo' },
            { letter: 'ao', image: '💧', word: 'Ao' }
          ]
        }
      ],
      quiz: [
        { question: 'Chữ nào là chữ A?', options: ['A', 'B', 'C', 'D'], correctAnswer: 0, explanation: 'Chữ A có hình tam giác với gạch ngang ở giữa' },
        { question: 'Từ nào bắt đầu bằng chữ A?', options: ['Áo', 'Bố', 'Cá', 'Dưa'], correctAnswer: 0, explanation: 'Áo bắt đầu bằng chữ A' },
        { question: 'Hình nào có từ bắt đầu bằng A?', options: ['🍎 Áo', '🐕 Chó', '🐱 Mèo', '🐟 Cá'], correctAnswer: 0, explanation: 'Áo bắt đầu bằng chữ A' },
        { question: 'Chữ a viết thường giống hình gì?', options: ['Quả táo nhỏ', 'Ngôi sao', 'Mặt trăng', 'Ông mặt trời'], correctAnswer: 0, explanation: 'Chữ a viết thường tròn như quả táo nhỏ' },
        { question: 'Đếm số từ có chữ a: ao, an, bé, áo', options: ['3', '2', '4', '1'], correctAnswer: 0, explanation: 'Có 3 từ: ao, an, áo' }
      ]
    }
  },

  // ========== BÀI 2: CHỮ CÁI Ă ==========
  'tv1-hv-02': {
    id: 'tv1-hv-02',
    title: 'Chữ cái Ă',
    subject: 'tieng-viet',
    grade: 1,
    category: 'hoc-van',
    order: 2,
    duration: 10,
    icon: '🌙',
    color: 'from-orange-400 to-amber-500',
    objectives: ['Nhận biết chữ Ă, ă', 'Đọc đúng âm "ă"', 'Phân biệt a và ă'],
    content: {
      introduction: {
        letter: 'Ă',
        letterLower: 'ă',
        sound: '/ă/',
        description: 'Chữ Ă có dấu trăng ở trên, đọc ngắn hơn chữ A',
        image: '🌙'
      },
      vocabulary: [
        { word: 'ăn', meaning: 'Ăn cơm', image: '🍚', audio: 'an.mp3' },
        { word: 'ăm', meaning: 'Ấm áp', image: '☀️', audio: 'am.mp3' },
        { word: 'ắt', meaning: 'Chắc chắn', image: '✅', audio: 'at.mp3' },
        { word: 'ắc', meaning: 'Tắc đường', image: '🚗', audio: 'ac.mp3' },
        { word: 'ẳng', meaning: 'Chó sủa ẳng ẳng', image: '🐕', audio: 'ang.mp3' }
      ],
      exercises: [
        {
          type: 'listen-choose',
          question: 'Nghe và chọn chữ cái đúng',
          audio: 'a_breve.mp3',
          options: ['A', 'Ă', 'Â', 'E'],
          answer: 1
        },
        {
          type: 'image-match',
          question: 'Chọn hình có từ chứa chữ Ă',
          options: [
            { image: '🍚', word: 'Ăn', correct: true },
            { image: '🍎', word: 'Táo', correct: false },
            { image: '🐱', word: 'Mèo', correct: false },
            { image: '☀️', word: 'Ấm', correct: true }
          ]
        }
      ],
      quiz: [
        { question: 'Chữ Ă khác chữ A ở điểm nào?', options: ['Có dấu trăng', 'Có dấu mũ', 'Có dấu móc', 'Giống nhau'], correctAnswer: 0, explanation: 'Chữ Ă có dấu trăng (˘) ở trên' },
        { question: 'Từ nào có chữ Ă?', options: ['Ăn', 'An', 'Anh', 'Ao'], correctAnswer: 0, explanation: 'Ăn có chữ Ă' },
        { question: 'Âm ă đọc như thế nào?', options: ['Ngắn và gọn', 'Dài và kéo', 'Cao vút', 'Trầm thấp'], correctAnswer: 0, explanation: 'Âm ă đọc ngắn gọn' },
        { question: 'Hình 🍚 là từ gì?', options: ['Ăn cơm', 'An cơm', 'Anh cơm', 'Ao cơm'], correctAnswer: 0, explanation: 'Ăn cơm - hành động ăn' },
        { question: 'Chữ nào KHÔNG có dấu trăng?', options: ['A', 'Ă', 'Ắ', 'Ằ'], correctAnswer: 0, explanation: 'Chữ A không có dấu trăng' }
      ]
    }
  },

  // ========== BÀI 3: CHỮ CÁI Â ==========
  'tv1-hv-03': {
    id: 'tv1-hv-03',
    title: 'Chữ cái Â',
    subject: 'tieng-viet',
    grade: 1,
    category: 'hoc-van',
    order: 3,
    duration: 10,
    icon: '🎩',
    color: 'from-purple-400 to-violet-500',
    objectives: ['Nhận biết chữ Â, â', 'Đọc đúng âm "â"', 'Phân biệt a, ă, â'],
    content: {
      introduction: {
        letter: 'Â',
        letterLower: 'â',
        sound: '/ə/',
        description: 'Chữ Â có dấu mũ ở trên, đọc âm "ơ" ngắn',
        image: '🎩'
      },
      vocabulary: [
        { word: 'ân', meaning: 'Ân tình', image: '❤️', audio: 'an3.mp3' },
        { word: 'âm', meaning: 'Âm thanh', image: '🔊', audio: 'am3.mp3' },
        { word: 'ât', meaning: 'Mất mát', image: '😢', audio: 'at3.mp3' },
        { word: 'âp', meaning: 'Ấp trứng', image: '🥚', audio: 'ap3.mp3' },
        { word: 'ấy', meaning: 'Cái ấy', image: '👆', audio: 'ay.mp3' }
      ],
      exercises: [
        {
          type: 'listen-choose',
          question: 'Nghe và chọn chữ cái đúng',
          audio: 'a_circumflex.mp3',
          options: ['A', 'Ă', 'Â', 'O'],
          answer: 2
        },
        {
          type: 'compare',
          question: 'So sánh cách viết A, Ă, Â',
          items: [
            { letter: 'A', description: 'Không dấu' },
            { letter: 'Ă', description: 'Dấu trăng' },
            { letter: 'Â', description: 'Dấu mũ' }
          ]
        }
      ],
      quiz: [
        { question: 'Chữ Â có dấu gì ở trên?', options: ['Dấu mũ (^)', 'Dấu trăng (˘)', 'Dấu móc', 'Không dấu'], correctAnswer: 0, explanation: 'Chữ Â có dấu mũ (^) ở trên' },
        { question: 'Từ nào có chữ Â?', options: ['Âm thanh', 'An toàn', 'Ăn cơm', 'Ao hồ'], correctAnswer: 0, explanation: 'Âm thanh có chữ Â' },
        { question: '🔊 là hình cho từ gì?', options: ['Âm thanh', 'An thanh', 'Ăn thanh', 'Ao thanh'], correctAnswer: 0, explanation: 'Âm thanh - tiếng động' },
        { question: 'Sắp xếp đúng: A, Ă, Â', options: ['A → Ă → Â', 'Â → Ă → A', 'Ă → A → Â', 'Ă → Â → A'], correctAnswer: 0, explanation: 'Thứ tự trong bảng chữ cái: A, Ă, Â' },
        { question: 'Chữ nào có dấu MŨ?', options: ['Â', 'A', 'Ă', 'E'], correctAnswer: 0, explanation: 'Chữ Â có dấu mũ' }
      ]
    }
  },

  // ========== BÀI 4: CHỮ CÁI B ==========
  'tv1-hv-04': {
    id: 'tv1-hv-04',
    title: 'Chữ cái B',
    subject: 'tieng-viet',
    grade: 1,
    category: 'hoc-van',
    order: 4,
    duration: 10,
    icon: '👶',
    color: 'from-blue-400 to-cyan-500',
    objectives: ['Nhận biết chữ B, b', 'Đọc đúng âm "bờ"', 'Tìm từ có chữ b'],
    content: {
      introduction: {
        letter: 'B',
        letterLower: 'b',
        sound: '/b/',
        description: 'Chữ B đọc là "bờ", giống hình em bé',
        image: '👶'
      },
      vocabulary: [
        { word: 'ba', meaning: 'Ba (bố)', image: '👨', audio: 'ba.mp3' },
        { word: 'bà', meaning: 'Bà nội/ngoại', image: '👵', audio: 'ba2.mp3' },
        { word: 'bé', meaning: 'Em bé', image: '👶', audio: 'be.mp3' },
        { word: 'bò', meaning: 'Con bò', image: '🐄', audio: 'bo.mp3' },
        { word: 'bút', meaning: 'Cây bút', image: '✏️', audio: 'but.mp3' }
      ],
      exercises: [
        {
          type: 'listen-choose',
          question: 'Nghe và chọn chữ cái đúng',
          audio: 'b.mp3',
          options: ['B', 'D', 'P', 'V'],
          answer: 0
        },
        {
          type: 'image-match',
          question: 'Chọn hình bắt đầu bằng chữ B',
          options: [
            { image: '👶', word: 'Bé', correct: true },
            { image: '🐄', word: 'Bò', correct: true },
            { image: '🐱', word: 'Mèo', correct: false },
            { image: '🐕', word: 'Chó', correct: false }
          ]
        }
      ],
      quiz: [
        { question: 'Chữ B đọc là gì?', options: ['Bờ', 'Dờ', 'Pờ', 'Vờ'], correctAnswer: 0, explanation: 'Chữ B đọc là "bờ"' },
        { question: 'Từ nào bắt đầu bằng B?', options: ['Bé', 'Mẹ', 'Cá', 'Gà'], correctAnswer: 0, explanation: 'Bé bắt đầu bằng chữ B' },
        { question: '👶 là hình cho từ gì?', options: ['Bé', 'Mẹ', 'Ba', 'Bà'], correctAnswer: 0, explanation: 'Em bé - Bé' },
        { question: 'Từ nào KHÔNG bắt đầu bằng B?', options: ['Mẹ', 'Ba', 'Bà', 'Bé'], correctAnswer: 0, explanation: 'Mẹ bắt đầu bằng chữ M' },
        { question: '🐄 là con gì?', options: ['Bò', 'Dê', 'Trâu', 'Ngựa'], correctAnswer: 0, explanation: 'Con bò' }
      ]
    }
  },

  // ========== BÀI 5: CHỮ CÁI C ==========
  'tv1-hv-05': {
    id: 'tv1-hv-05',
    title: 'Chữ cái C',
    subject: 'tieng-viet',
    grade: 1,
    category: 'hoc-van',
    order: 5,
    duration: 10,
    icon: '🐟',
    color: 'from-cyan-400 to-teal-500',
    objectives: ['Nhận biết chữ C, c', 'Đọc đúng âm "cờ"', 'Tìm từ có chữ c'],
    content: {
      introduction: {
        letter: 'C',
        letterLower: 'c',
        sound: '/k/',
        description: 'Chữ C đọc là "cờ", giống hình con cá',
        image: '🐟'
      },
      vocabulary: [
        { word: 'cá', meaning: 'Con cá', image: '🐟', audio: 'ca.mp3' },
        { word: 'cò', meaning: 'Con cò', image: '🦢', audio: 'co.mp3' },
        { word: 'cua', meaning: 'Con cua', image: '🦀', audio: 'cua.mp3' },
        { word: 'cây', meaning: 'Cái cây', image: '🌳', audio: 'cay.mp3' },
        { word: 'cơm', meaning: 'Cơm ăn', image: '🍚', audio: 'com.mp3' }
      ],
      exercises: [
        {
          type: 'listen-choose',
          question: 'Nghe và chọn chữ cái đúng',
          audio: 'c.mp3',
          options: ['C', 'K', 'G', 'Q'],
          answer: 0
        },
        {
          type: 'image-match',
          question: 'Chọn hình bắt đầu bằng chữ C',
          options: [
            { image: '🐟', word: 'Cá', correct: true },
            { image: '🦀', word: 'Cua', correct: true },
            { image: '🐕', word: 'Chó', correct: false },
            { image: '🐱', word: 'Mèo', correct: false }
          ]
        }
      ],
      quiz: [
        { question: 'Chữ C đọc là gì?', options: ['Cờ', 'Kờ', 'Gờ', 'Qờ'], correctAnswer: 0, explanation: 'Chữ C đọc là "cờ"' },
        { question: 'Từ nào bắt đầu bằng C?', options: ['Cá', 'Gà', 'Vịt', 'Bò'], correctAnswer: 0, explanation: 'Cá bắt đầu bằng chữ C' },
        { question: '🐟 là con gì?', options: ['Cá', 'Cua', 'Cò', 'Chó'], correctAnswer: 0, explanation: 'Con cá' },
        { question: '🦀 là con gì?', options: ['Cua', 'Cá', 'Cò', 'Chó'], correctAnswer: 0, explanation: 'Con cua' },
        { question: 'Từ nào KHÔNG bắt đầu bằng C?', options: ['Gà', 'Cá', 'Cò', 'Cua'], correctAnswer: 0, explanation: 'Gà bắt đầu bằng chữ G' }
      ]
    }
  },

  // ========== BÀI 6: CHỮ CÁI D ==========
  'tv1-hv-06': {
    id: 'tv1-hv-06',
    title: 'Chữ cái D',
    subject: 'tieng-viet',
    grade: 1,
    category: 'hoc-van',
    order: 6,
    duration: 10,
    icon: '🍉',
    color: 'from-green-400 to-emerald-500',
    objectives: ['Nhận biết chữ D, d', 'Đọc đúng âm "dờ"', 'Tìm từ có chữ d'],
    content: {
      introduction: {
        letter: 'D',
        letterLower: 'd',
        sound: '/z/',
        description: 'Chữ D đọc là "dờ" (giống âm "z")',
        image: '🍉'
      },
      vocabulary: [
        { word: 'dưa', meaning: 'Quả dưa', image: '🍉', audio: 'dua.mp3' },
        { word: 'da', meaning: 'Làn da', image: '🖐️', audio: 'da.mp3' },
        { word: 'dê', meaning: 'Con dê', image: '🐐', audio: 'de.mp3' },
        { word: 'dép', meaning: 'Đôi dép', image: '🩴', audio: 'dep.mp3' },
        { word: 'dù', meaning: 'Cái dù', image: '☂️', audio: 'du.mp3' }
      ],
      exercises: [
        {
          type: 'listen-choose',
          question: 'Nghe và chọn chữ cái đúng',
          audio: 'd.mp3',
          options: ['D', 'Đ', 'B', 'P'],
          answer: 0
        },
        {
          type: 'image-match',
          question: 'Chọn hình bắt đầu bằng chữ D',
          options: [
            { image: '🍉', word: 'Dưa', correct: true },
            { image: '🐐', word: 'Dê', correct: true },
            { image: '🐕', word: 'Chó', correct: false },
            { image: '🐱', word: 'Mèo', correct: false }
          ]
        }
      ],
      quiz: [
        { question: 'Chữ D đọc là gì?', options: ['Dờ', 'Đờ', 'Bờ', 'Pờ'], correctAnswer: 0, explanation: 'Chữ D đọc là "dờ"' },
        { question: 'Từ nào bắt đầu bằng D?', options: ['Dưa', 'Đỏ', 'Bé', 'Cá'], correctAnswer: 0, explanation: 'Dưa bắt đầu bằng chữ D' },
        { question: '🍉 là quả gì?', options: ['Dưa hấu', 'Táo', 'Cam', 'Nho'], correctAnswer: 0, explanation: 'Quả dưa hấu' },
        { question: '🐐 là con gì?', options: ['Dê', 'Bò', 'Trâu', 'Cừu'], correctAnswer: 0, explanation: 'Con dê' },
        { question: 'D và Đ khác nhau thế nào?', options: ['D không gạch, Đ có gạch', 'Giống nhau', 'D có gạch', 'Đ không gạch'], correctAnswer: 0, explanation: 'Chữ Đ có gạch ngang ở giữa' }
      ]
    }
  },

  // ========== BÀI 7: CHỮ CÁI Đ ==========
  'tv1-hv-07': {
    id: 'tv1-hv-07',
    title: 'Chữ cái Đ',
    subject: 'tieng-viet',
    grade: 1,
    category: 'hoc-van',
    order: 7,
    duration: 10,
    icon: '🔴',
    color: 'from-red-500 to-rose-500',
    objectives: ['Nhận biết chữ Đ, đ', 'Đọc đúng âm "đờ"', 'Phân biệt D và Đ'],
    content: {
      introduction: {
        letter: 'Đ',
        letterLower: 'đ',
        sound: '/d/',
        description: 'Chữ Đ có gạch ngang, đọc là "đờ" (giống âm "d" tiếng Anh)',
        image: '🔴'
      },
      vocabulary: [
        { word: 'đỏ', meaning: 'Màu đỏ', image: '🔴', audio: 'do.mp3' },
        { word: 'đi', meaning: 'Đi bộ', image: '🚶', audio: 'di.mp3' },
        { word: 'đèn', meaning: 'Cái đèn', image: '💡', audio: 'den.mp3' },
        { word: 'đồ', meaning: 'Đồ vật', image: '📦', audio: 'do2.mp3' },
        { word: 'đẹp', meaning: 'Xinh đẹp', image: '✨', audio: 'dep2.mp3' }
      ],
      exercises: [
        {
          type: 'listen-choose',
          question: 'Nghe và chọn chữ cái đúng',
          audio: 'd_stroke.mp3',
          options: ['Đ', 'D', 'B', 'P'],
          answer: 0
        },
        {
          type: 'compare',
          question: 'So sánh D và Đ',
          items: [
            { letter: 'D', description: 'Không gạch ngang' },
            { letter: 'Đ', description: 'Có gạch ngang' }
          ]
        }
      ],
      quiz: [
        { question: 'Chữ Đ khác chữ D ở điểm nào?', options: ['Có gạch ngang', 'Không gạch', 'Có dấu mũ', 'Có dấu trăng'], correctAnswer: 0, explanation: 'Chữ Đ có gạch ngang ở giữa' },
        { question: 'Từ nào bắt đầu bằng Đ?', options: ['Đỏ', 'Dưa', 'Bé', 'Cá'], correctAnswer: 0, explanation: 'Đỏ bắt đầu bằng chữ Đ' },
        { question: '🔴 là màu gì?', options: ['Đỏ', 'Dưa', 'Da', 'Dê'], correctAnswer: 0, explanation: 'Màu đỏ' },
        { question: '💡 là cái gì?', options: ['Đèn', 'Dù', 'Dép', 'Dê'], correctAnswer: 0, explanation: 'Cái đèn' },
        { question: 'Chữ nào có gạch ngang?', options: ['Đ', 'D', 'B', 'P'], correctAnswer: 0, explanation: 'Chữ Đ có gạch ngang' }
      ]
    }
  },

  // ========== BÀI 8: CHỮ CÁI E ==========
  'tv1-hv-08': {
    id: 'tv1-hv-08',
    title: 'Chữ cái E',
    subject: 'tieng-viet',
    grade: 1,
    category: 'hoc-van',
    order: 8,
    duration: 10,
    icon: '👧',
    color: 'from-pink-400 to-rose-400',
    objectives: ['Nhận biết chữ E, e', 'Đọc đúng âm "e"', 'Tìm từ có chữ e'],
    content: {
      introduction: {
        letter: 'E',
        letterLower: 'e',
        sound: '/ɛ/',
        description: 'Chữ E đọc là "e", miệng mở rộng',
        image: '👧'
      },
      vocabulary: [
        { word: 'em', meaning: 'Em bé', image: '👶', audio: 'em.mp3' },
        { word: 'én', meaning: 'Chim én', image: '🐦', audio: 'en.mp3' },
        { word: 'ếch', meaning: 'Con ếch', image: '🐸', audio: 'ech.mp3' },
        { word: 'ép', meaning: 'Ép nước', image: '🧃', audio: 'ep.mp3' },
        { word: 'xe', meaning: 'Cái xe', image: '🚗', audio: 'xe.mp3' }
      ],
      exercises: [
        {
          type: 'listen-choose',
          question: 'Nghe và chọn chữ cái đúng',
          audio: 'e.mp3',
          options: ['E', 'Ê', 'I', 'A'],
          answer: 0
        },
        {
          type: 'image-match',
          question: 'Chọn từ có chữ E',
          options: [
            { image: '👶', word: 'Em', correct: true },
            { image: '🐦', word: 'Én', correct: true },
            { image: '🐕', word: 'Chó', correct: false },
            { image: '🐱', word: 'Mèo', correct: false }
          ]
        }
      ],
      quiz: [
        { question: 'Chữ E đọc là gì?', options: ['E', 'Ê', 'I', 'A'], correctAnswer: 0, explanation: 'Chữ E đọc là "e"' },
        { question: 'Từ nào có chữ E?', options: ['Em', 'Ăn', 'Ông', 'Ba'], correctAnswer: 0, explanation: 'Em có chữ E' },
        { question: '👶 là từ gì?', options: ['Em bé', 'Anh', 'Chị', 'Ba'], correctAnswer: 0, explanation: 'Em bé' },
        { question: 'Chữ nào là E viết thường?', options: ['e', 'ê', 'i', 'a'], correctAnswer: 0, explanation: 'Chữ e viết thường' },
        { question: 'Từ nào KHÔNG có chữ E?', options: ['Ba', 'Em', 'Én', 'Xe'], correctAnswer: 0, explanation: 'Ba không có chữ E' }
      ]
    }
  },

  // ========== BÀI 9: CHỮ CÁI Ê ==========
  'tv1-hv-09': {
    id: 'tv1-hv-09',
    title: 'Chữ cái Ê',
    subject: 'tieng-viet',
    grade: 1,
    category: 'hoc-van',
    order: 9,
    duration: 10,
    icon: '🐝',
    color: 'from-yellow-400 to-amber-500',
    objectives: ['Nhận biết chữ Ê, ê', 'Đọc đúng âm "ê"', 'Phân biệt E và Ê'],
    content: {
      introduction: {
        letter: 'Ê',
        letterLower: 'ê',
        sound: '/e/',
        description: 'Chữ Ê có dấu mũ, đọc là "ê"',
        image: '🐝'
      },
      vocabulary: [
        { word: 'ê', meaning: 'Kêu ê ê', image: '😣', audio: 'e2.mp3' },
        { word: 'bê', meaning: 'Con bê', image: '🐄', audio: 'be2.mp3' },
        { word: 'mê', meaning: 'Say mê', image: '😍', audio: 'me2.mp3' },
        { word: 'lê', meaning: 'Quả lê', image: '🍐', audio: 'le.mp3' },
        { word: 'ghế', meaning: 'Cái ghế', image: '🪑', audio: 'ghe.mp3' }
      ],
      exercises: [
        {
          type: 'listen-choose',
          question: 'Nghe và chọn chữ cái đúng',
          audio: 'e_circumflex.mp3',
          options: ['Ê', 'E', 'I', 'A'],
          answer: 0
        },
        {
          type: 'compare',
          question: 'So sánh E và Ê',
          items: [
            { letter: 'E', description: 'Không dấu mũ' },
            { letter: 'Ê', description: 'Có dấu mũ' }
          ]
        }
      ],
      quiz: [
        { question: 'Chữ Ê có dấu gì?', options: ['Dấu mũ (^)', 'Dấu trăng (˘)', 'Dấu móc', 'Không dấu'], correctAnswer: 0, explanation: 'Chữ Ê có dấu mũ' },
        { question: 'Từ nào có chữ Ê?', options: ['Ghế', 'Gà', 'Cá', 'Ba'], correctAnswer: 0, explanation: 'Ghế có chữ Ê' },
        { question: '🪑 là cái gì?', options: ['Ghế', 'Bàn', 'Tủ', 'Giường'], correctAnswer: 0, explanation: 'Cái ghế' },
        { question: '🍐 là quả gì?', options: ['Lê', 'Táo', 'Cam', 'Nho'], correctAnswer: 0, explanation: 'Quả lê' },
        { question: 'E và Ê khác nhau thế nào?', options: ['Ê có dấu mũ', 'E có dấu mũ', 'Giống nhau', 'Ê có dấu trăng'], correctAnswer: 0, explanation: 'Ê có dấu mũ, E không có' }
      ]
    }
  },

  // ========== BÀI 10: CHỮ CÁI G ==========
  'tv1-hv-10': {
    id: 'tv1-hv-10',
    title: 'Chữ cái G',
    subject: 'tieng-viet',
    grade: 1,
    category: 'hoc-van',
    order: 10,
    duration: 10,
    icon: '🐔',
    color: 'from-orange-400 to-red-400',
    objectives: ['Nhận biết chữ G, g', 'Đọc đúng âm "gờ"', 'Tìm từ có chữ g'],
    content: {
      introduction: {
        letter: 'G',
        letterLower: 'g',
        sound: '/ɣ/',
        description: 'Chữ G đọc là "gờ"',
        image: '🐔'
      },
      vocabulary: [
        { word: 'gà', meaning: 'Con gà', image: '🐔', audio: 'ga.mp3' },
        { word: 'gấu', meaning: 'Con gấu', image: '🐻', audio: 'gau.mp3' },
        { word: 'gạo', meaning: 'Hạt gạo', image: '🌾', audio: 'gao.mp3' },
        { word: 'gió', meaning: 'Gió thổi', image: '💨', audio: 'gio.mp3' },
        { word: 'gỗ', meaning: 'Gỗ cây', image: '🪵', audio: 'go.mp3' }
      ],
      exercises: [
        {
          type: 'listen-choose',
          question: 'Nghe và chọn chữ cái đúng',
          audio: 'g.mp3',
          options: ['G', 'C', 'K', 'Q'],
          answer: 0
        },
        {
          type: 'image-match',
          question: 'Chọn hình bắt đầu bằng chữ G',
          options: [
            { image: '🐔', word: 'Gà', correct: true },
            { image: '🐻', word: 'Gấu', correct: true },
            { image: '🐕', word: 'Chó', correct: false },
            { image: '🐱', word: 'Mèo', correct: false }
          ]
        }
      ],
      quiz: [
        { question: 'Chữ G đọc là gì?', options: ['Gờ', 'Cờ', 'Kờ', 'Qờ'], correctAnswer: 0, explanation: 'Chữ G đọc là "gờ"' },
        { question: 'Từ nào bắt đầu bằng G?', options: ['Gà', 'Cá', 'Vịt', 'Bò'], correctAnswer: 0, explanation: 'Gà bắt đầu bằng chữ G' },
        { question: '🐔 là con gì?', options: ['Gà', 'Vịt', 'Ngan', 'Ngỗng'], correctAnswer: 0, explanation: 'Con gà' },
        { question: '🐻 là con gì?', options: ['Gấu', 'Chó', 'Mèo', 'Thỏ'], correctAnswer: 0, explanation: 'Con gấu' },
        { question: 'Từ nào KHÔNG bắt đầu bằng G?', options: ['Cá', 'Gà', 'Gấu', 'Gạo'], correctAnswer: 0, explanation: 'Cá bắt đầu bằng chữ C' }
      ]
    }
  },

  // ========== BÀI 11: CHỮ CÁI H ==========
  'tv1-hv-11': {
    id: 'tv1-hv-11',
    title: 'Chữ cái H',
    subject: 'tieng-viet',
    grade: 1,
    category: 'hoc-van',
    order: 11,
    duration: 10,
    icon: '🌸',
    color: 'from-pink-400 to-fuchsia-500',
    objectives: ['Nhận biết chữ H, h', 'Đọc đúng âm "hờ"', 'Tìm từ có chữ h'],
    content: {
      introduction: {
        letter: 'H',
        letterLower: 'h',
        sound: '/h/',
        description: 'Chữ H đọc là "hờ"',
        image: '🌸'
      },
      vocabulary: [
        { word: 'hoa', meaning: 'Bông hoa', image: '🌸', audio: 'hoa.mp3' },
        { word: 'hồ', meaning: 'Hồ nước', image: '🏞️', audio: 'ho.mp3' },
        { word: 'hát', meaning: 'Ca hát', image: '🎤', audio: 'hat.mp3' },
        { word: 'học', meaning: 'Học bài', image: '📚', audio: 'hoc.mp3' },
        { word: 'hổ', meaning: 'Con hổ', image: '🐅', audio: 'ho2.mp3' }
      ],
      exercises: [
        {
          type: 'listen-choose',
          question: 'Nghe và chọn chữ cái đúng',
          audio: 'h.mp3',
          options: ['H', 'K', 'L', 'N'],
          answer: 0
        },
        {
          type: 'image-match',
          question: 'Chọn hình bắt đầu bằng chữ H',
          options: [
            { image: '🌸', word: 'Hoa', correct: true },
            { image: '🐅', word: 'Hổ', correct: true },
            { image: '🐕', word: 'Chó', correct: false },
            { image: '🐱', word: 'Mèo', correct: false }
          ]
        }
      ],
      quiz: [
        { question: 'Chữ H đọc là gì?', options: ['Hờ', 'Kờ', 'Lờ', 'Nờ'], correctAnswer: 0, explanation: 'Chữ H đọc là "hờ"' },
        { question: 'Từ nào bắt đầu bằng H?', options: ['Hoa', 'Cá', 'Vịt', 'Bò'], correctAnswer: 0, explanation: 'Hoa bắt đầu bằng chữ H' },
        { question: '🌸 là gì?', options: ['Hoa', 'Lá', 'Cây', 'Quả'], correctAnswer: 0, explanation: 'Bông hoa' },
        { question: '🐅 là con gì?', options: ['Hổ', 'Sư tử', 'Báo', 'Mèo'], correctAnswer: 0, explanation: 'Con hổ' },
        { question: '📚 là hành động gì?', options: ['Học', 'Chơi', 'Ăn', 'Ngủ'], correctAnswer: 0, explanation: 'Học bài' }
      ]
    }
  },

  // ========== BÀI 12: CHỮ CÁI I ==========
  'tv1-hv-12': {
    id: 'tv1-hv-12',
    title: 'Chữ cái I',
    subject: 'tieng-viet',
    grade: 1,
    category: 'hoc-van',
    order: 12,
    duration: 10,
    icon: '🦔',
    color: 'from-gray-400 to-slate-500',
    objectives: ['Nhận biết chữ I, i', 'Đọc đúng âm "i"', 'Tìm từ có chữ i'],
    content: {
      introduction: {
        letter: 'I',
        letterLower: 'i',
        sound: '/i/',
        description: 'Chữ I đọc là "i", miệng cười',
        image: '🦔'
      },
      vocabulary: [
        { word: 'im', meaning: 'Im lặng', image: '🤫', audio: 'im.mp3' },
        { word: 'ít', meaning: 'Ít ỏi', image: '1️⃣', audio: 'it.mp3' },
        { word: 'in', meaning: 'In sách', image: '🖨️', audio: 'in.mp3' },
        { word: 'kì', meaning: 'Kỳ lạ', image: '❓', audio: 'ki.mp3' },
        { word: 'lì', meaning: 'Lì xì', image: '🧧', audio: 'li.mp3' }
      ],
      exercises: [
        {
          type: 'listen-choose',
          question: 'Nghe và chọn chữ cái đúng',
          audio: 'i.mp3',
          options: ['I', 'E', 'Y', 'U'],
          answer: 0
        },
        {
          type: 'image-match',
          question: 'Chọn từ có chữ I',
          options: [
            { image: '🤫', word: 'Im', correct: true },
            { image: '🧧', word: 'Lì xì', correct: true },
            { image: '🐕', word: 'Chó', correct: false },
            { image: '🐱', word: 'Mèo', correct: false }
          ]
        }
      ],
      quiz: [
        { question: 'Chữ I đọc là gì?', options: ['I', 'E', 'Y', 'U'], correctAnswer: 0, explanation: 'Chữ I đọc là "i"' },
        { question: 'Từ nào có chữ I?', options: ['Im', 'Em', 'Ăn', 'Ông'], correctAnswer: 0, explanation: 'Im có chữ I' },
        { question: '🤫 là hành động gì?', options: ['Im lặng', 'Nói to', 'Hát', 'Cười'], correctAnswer: 0, explanation: 'Im lặng' },
        { question: '🧧 là gì?', options: ['Lì xì', 'Quà', 'Bánh', 'Kẹo'], correctAnswer: 0, explanation: 'Lì xì' },
        { question: 'Chữ i viết thường có gì ở trên?', options: ['Dấu chấm', 'Dấu mũ', 'Dấu trăng', 'Không có gì'], correctAnswer: 0, explanation: 'Chữ i có dấu chấm ở trên' }
      ]
    }
  },

  // ========== BÀI 13: CHỮ CÁI K ==========
  'tv1-hv-13': {
    id: 'tv1-hv-13',
    title: 'Chữ cái K',
    subject: 'tieng-viet',
    grade: 1,
    category: 'hoc-van',
    order: 13,
    duration: 10,
    icon: '🍬',
    color: 'from-purple-400 to-indigo-500',
    objectives: ['Nhận biết chữ K, k', 'Đọc đúng âm "ca"', 'Tìm từ có chữ k'],
    content: {
      introduction: {
        letter: 'K',
        letterLower: 'k',
        sound: '/k/',
        description: 'Chữ K đọc là "ca"',
        image: '🍬'
      },
      vocabulary: [
        { word: 'kẹo', meaning: 'Cái kẹo', image: '🍬', audio: 'keo.mp3' },
        { word: 'kéo', meaning: 'Cái kéo', image: '✂️', audio: 'keo2.mp3' },
        { word: 'kế', meaning: 'Kế bên', image: '➡️', audio: 'ke.mp3' },
        { word: 'kể', meaning: 'Kể chuyện', image: '📖', audio: 'ke2.mp3' },
        { word: 'kì', meaning: 'Kỳ nghỉ', image: '🏖️', audio: 'ki.mp3' }
      ],
      exercises: [
        {
          type: 'listen-choose',
          question: 'Nghe và chọn chữ cái đúng',
          audio: 'k.mp3',
          options: ['K', 'C', 'G', 'Q'],
          answer: 0
        },
        {
          type: 'image-match',
          question: 'Chọn hình bắt đầu bằng chữ K',
          options: [
            { image: '🍬', word: 'Kẹo', correct: true },
            { image: '✂️', word: 'Kéo', correct: true },
            { image: '🐕', word: 'Chó', correct: false },
            { image: '🐱', word: 'Mèo', correct: false }
          ]
        }
      ],
      quiz: [
        { question: 'Chữ K đọc là gì?', options: ['Ca', 'Cờ', 'Gờ', 'Qờ'], correctAnswer: 0, explanation: 'Chữ K đọc là "ca"' },
        { question: 'Từ nào bắt đầu bằng K?', options: ['Kẹo', 'Cá', 'Gà', 'Bò'], correctAnswer: 0, explanation: 'Kẹo bắt đầu bằng chữ K' },
        { question: '🍬 là gì?', options: ['Kẹo', 'Bánh', 'Cơm', 'Phở'], correctAnswer: 0, explanation: 'Cái kẹo' },
        { question: '✂️ là gì?', options: ['Kéo', 'Dao', 'Bút', 'Thước'], correctAnswer: 0, explanation: 'Cái kéo' },
        { question: 'K và C đọc giống hay khác?', options: ['Khác nhau', 'Giống nhau', 'K to hơn', 'C to hơn'], correctAnswer: 0, explanation: 'K đọc là "ca", C đọc là "cờ"' }
      ]
    }
  },

  // ========== BÀI 14: CHỮ CÁI L ==========
  'tv1-hv-14': {
    id: 'tv1-hv-14',
    title: 'Chữ cái L',
    subject: 'tieng-viet',
    grade: 1,
    category: 'hoc-van',
    order: 14,
    duration: 10,
    icon: '🍃',
    color: 'from-green-400 to-lime-500',
    objectives: ['Nhận biết chữ L, l', 'Đọc đúng âm "lờ"', 'Tìm từ có chữ l'],
    content: {
      introduction: {
        letter: 'L',
        letterLower: 'l',
        sound: '/l/',
        description: 'Chữ L đọc là "lờ"',
        image: '🍃'
      },
      vocabulary: [
        { word: 'lá', meaning: 'Chiếc lá', image: '🍃', audio: 'la.mp3' },
        { word: 'lê', meaning: 'Quả lê', image: '🍐', audio: 'le.mp3' },
        { word: 'lợn', meaning: 'Con lợn', image: '🐷', audio: 'lon.mp3' },
        { word: 'lửa', meaning: 'Ngọn lửa', image: '🔥', audio: 'lua.mp3' },
        { word: 'lúa', meaning: 'Cây lúa', image: '🌾', audio: 'lua2.mp3' }
      ],
      exercises: [
        {
          type: 'listen-choose',
          question: 'Nghe và chọn chữ cái đúng',
          audio: 'l.mp3',
          options: ['L', 'N', 'M', 'R'],
          answer: 0
        },
        {
          type: 'image-match',
          question: 'Chọn hình bắt đầu bằng chữ L',
          options: [
            { image: '🍃', word: 'Lá', correct: true },
            { image: '🐷', word: 'Lợn', correct: true },
            { image: '🐕', word: 'Chó', correct: false },
            { image: '🐱', word: 'Mèo', correct: false }
          ]
        }
      ],
      quiz: [
        { question: 'Chữ L đọc là gì?', options: ['Lờ', 'Nờ', 'Mờ', 'Rờ'], correctAnswer: 0, explanation: 'Chữ L đọc là "lờ"' },
        { question: 'Từ nào bắt đầu bằng L?', options: ['Lá', 'Cá', 'Gà', 'Bò'], correctAnswer: 0, explanation: 'Lá bắt đầu bằng chữ L' },
        { question: '🍃 là gì?', options: ['Lá', 'Hoa', 'Cây', 'Quả'], correctAnswer: 0, explanation: 'Chiếc lá' },
        { question: '🐷 là con gì?', options: ['Lợn', 'Bò', 'Gà', 'Vịt'], correctAnswer: 0, explanation: 'Con lợn' },
        { question: '🔥 là gì?', options: ['Lửa', 'Nước', 'Đất', 'Gió'], correctAnswer: 0, explanation: 'Ngọn lửa' }
      ]
    }
  },

  // ========== BÀI 15: CHỮ CÁI M ==========
  'tv1-hv-15': {
    id: 'tv1-hv-15',
    title: 'Chữ cái M',
    subject: 'tieng-viet',
    grade: 1,
    category: 'hoc-van',
    order: 15,
    duration: 10,
    icon: '👩',
    color: 'from-rose-400 to-pink-500',
    objectives: ['Nhận biết chữ M, m', 'Đọc đúng âm "mờ"', 'Tìm từ có chữ m'],
    content: {
      introduction: {
        letter: 'M',
        letterLower: 'm',
        sound: '/m/',
        description: 'Chữ M đọc là "mờ"',
        image: '👩'
      },
      vocabulary: [
        { word: 'mẹ', meaning: 'Mẹ yêu', image: '👩', audio: 'me.mp3' },
        { word: 'mèo', meaning: 'Con mèo', image: '🐱', audio: 'meo.mp3' },
        { word: 'mưa', meaning: 'Trời mưa', image: '🌧️', audio: 'mua.mp3' },
        { word: 'mũ', meaning: 'Cái mũ', image: '🧢', audio: 'mu.mp3' },
        { word: 'muối', meaning: 'Muối ăn', image: '🧂', audio: 'muoi.mp3' }
      ],
      exercises: [
        {
          type: 'listen-choose',
          question: 'Nghe và chọn chữ cái đúng',
          audio: 'm.mp3',
          options: ['M', 'N', 'L', 'R'],
          answer: 0
        },
        {
          type: 'image-match',
          question: 'Chọn hình bắt đầu bằng chữ M',
          options: [
            { image: '👩', word: 'Mẹ', correct: true },
            { image: '🐱', word: 'Mèo', correct: true },
            { image: '🐕', word: 'Chó', correct: false },
            { image: '🐔', word: 'Gà', correct: false }
          ]
        }
      ],
      quiz: [
        { question: 'Chữ M đọc là gì?', options: ['Mờ', 'Nờ', 'Lờ', 'Rờ'], correctAnswer: 0, explanation: 'Chữ M đọc là "mờ"' },
        { question: 'Từ nào bắt đầu bằng M?', options: ['Mẹ', 'Bố', 'Chị', 'Anh'], correctAnswer: 0, explanation: 'Mẹ bắt đầu bằng chữ M' },
        { question: '👩 là ai?', options: ['Mẹ', 'Bố', 'Bà', 'Ông'], correctAnswer: 0, explanation: 'Mẹ' },
        { question: '🐱 là con gì?', options: ['Mèo', 'Chó', 'Gà', 'Vịt'], correctAnswer: 0, explanation: 'Con mèo' },
        { question: '🌧️ là gì?', options: ['Mưa', 'Nắng', 'Gió', 'Sấm'], correctAnswer: 0, explanation: 'Trời mưa' }
      ]
    }
  },

  // ========== BÀI 16: CHỮ CÁI N ==========
  'tv1-hv-16': {
    id: 'tv1-hv-16',
    title: 'Chữ cái N',
    subject: 'tieng-viet',
    grade: 1,
    category: 'hoc-van',
    order: 16,
    duration: 10,
    icon: '💧',
    color: 'from-blue-400 to-sky-500',
    objectives: ['Nhận biết chữ N, n', 'Đọc đúng âm "nờ"', 'Phân biệt n và l'],
    content: {
      introduction: { letter: 'N', letterLower: 'n', sound: '/n/', description: 'Chữ N đọc là "nờ"', image: '💧' },
      vocabulary: [
        { word: 'nước', meaning: 'Nước uống', image: '💧', audio: 'nuoc.mp3' },
        { word: 'nắng', meaning: 'Trời nắng', image: '☀️', audio: 'nang.mp3' },
        { word: 'núi', meaning: 'Ngọn núi', image: '⛰️', audio: 'nui.mp3' },
        { word: 'nón', meaning: 'Cái nón', image: '👒', audio: 'non.mp3' },
        { word: 'na', meaning: 'Quả na', image: '🍈', audio: 'na.mp3' }
      ],
      exercises: [
        { type: 'listen-choose', question: 'Nghe và chọn chữ cái đúng', options: ['N', 'L', 'M', 'R'], answer: 0 },
        { type: 'image-match', question: 'Chọn hình bắt đầu bằng chữ N', options: [{ image: '💧', word: 'Nước', correct: true }, { image: '☀️', word: 'Nắng', correct: true }, { image: '🐕', word: 'Chó', correct: false }, { image: '🐱', word: 'Mèo', correct: false }] }
      ],
      quiz: [
        { question: 'Chữ N đọc là gì?', options: ['Nờ', 'Lờ', 'Mờ', 'Rờ'], correctAnswer: 0, explanation: 'Chữ N đọc là "nờ"' },
        { question: '💧 là gì?', options: ['Nước', 'Lửa', 'Gió', 'Đất'], correctAnswer: 0, explanation: 'Nước uống' },
        { question: '⛰️ là gì?', options: ['Núi', 'Sông', 'Biển', 'Hồ'], correctAnswer: 0, explanation: 'Ngọn núi' },
        { question: '☀️ là gì?', options: ['Nắng', 'Mưa', 'Gió', 'Sấm'], correctAnswer: 0, explanation: 'Trời nắng' },
        { question: 'N và L khác nhau thế nào?', options: ['N đọc nờ, L đọc lờ', 'Giống nhau', 'N to hơn', 'L to hơn'], correctAnswer: 0, explanation: 'N đọc "nờ", L đọc "lờ"' }
      ]
    }
  },

  // ========== BÀI 17: CHỮ CÁI O ==========
  'tv1-hv-17': {
    id: 'tv1-hv-17',
    title: 'Chữ cái O',
    subject: 'tieng-viet',
    grade: 1,
    category: 'hoc-van',
    order: 17,
    duration: 10,
    icon: '☂️',
    color: 'from-indigo-400 to-blue-500',
    objectives: ['Nhận biết chữ O, o', 'Đọc đúng âm "o"', 'Tìm từ có chữ o'],
    content: {
      introduction: { letter: 'O', letterLower: 'o', sound: '/ɔ/', description: 'Chữ O đọc là "o", miệng tròn', image: '☂️' },
      vocabulary: [
        { word: 'ô', meaning: 'Cái ô', image: '☂️', audio: 'o.mp3' },
        { word: 'ong', meaning: 'Con ong', image: '🐝', audio: 'ong.mp3' },
        { word: 'ốc', meaning: 'Con ốc', image: '🐌', audio: 'oc.mp3' },
        { word: 'ổi', meaning: 'Quả ổi', image: '🍐', audio: 'oi.mp3' },
        { word: 'con', meaning: 'Con cái', image: '👶', audio: 'con.mp3' }
      ],
      exercises: [
        { type: 'listen-choose', question: 'Nghe và chọn chữ cái đúng', options: ['O', 'Ô', 'Ơ', 'A'], answer: 0 },
        { type: 'image-match', question: 'Chọn từ có chữ O', options: [{ image: '🐝', word: 'Ong', correct: true }, { image: '🐌', word: 'Ốc', correct: true }, { image: '🐕', word: 'Chó', correct: false }, { image: '🐱', word: 'Mèo', correct: false }] }
      ],
      quiz: [
        { question: 'Chữ O có hình gì?', options: ['Hình tròn', 'Hình vuông', 'Hình tam giác', 'Hình chữ nhật'], correctAnswer: 0, explanation: 'Chữ O có hình tròn' },
        { question: '🐝 là con gì?', options: ['Ong', 'Kiến', 'Ruồi', 'Muỗi'], correctAnswer: 0, explanation: 'Con ong' },
        { question: '🐌 là con gì?', options: ['Ốc', 'Sên', 'Rắn', 'Giun'], correctAnswer: 0, explanation: 'Con ốc' },
        { question: 'Từ nào có chữ O?', options: ['Ong', 'Ăn', 'Em', 'Ba'], correctAnswer: 0, explanation: 'Ong có chữ O' },
        { question: 'O, Ô, Ơ có gì khác nhau?', options: ['Dấu khác nhau', 'Giống nhau', 'Đọc giống', 'Viết giống'], correctAnswer: 0, explanation: 'O không dấu, Ô có mũ, Ơ có móc' }
      ]
    }
  },

  // ========== BÀI 18: CHỮ CÁI Ô ==========
  'tv1-hv-18': {
    id: 'tv1-hv-18',
    title: 'Chữ cái Ô',
    subject: 'tieng-viet',
    grade: 1,
    category: 'hoc-van',
    order: 18,
    duration: 10,
    icon: '🚗',
    color: 'from-red-400 to-orange-500',
    objectives: ['Nhận biết chữ Ô, ô', 'Đọc đúng âm "ô"', 'Phân biệt O và Ô'],
    content: {
      introduction: { letter: 'Ô', letterLower: 'ô', sound: '/o/', description: 'Chữ Ô có dấu mũ, đọc là "ô"', image: '🚗' },
      vocabulary: [
        { word: 'ô tô', meaning: 'Xe ô tô', image: '🚗', audio: 'oto.mp3' },
        { word: 'ổ', meaning: 'Ổ gà', image: '🕳️', audio: 'o2.mp3' },
        { word: 'ông', meaning: 'Ông nội', image: '👴', audio: 'ong2.mp3' },
        { word: 'ốm', meaning: 'Bị ốm', image: '🤒', audio: 'om.mp3' },
        { word: 'hồ', meaning: 'Hồ nước', image: '🏞️', audio: 'ho3.mp3' }
      ],
      exercises: [
        { type: 'listen-choose', question: 'Nghe và chọn chữ cái đúng', options: ['Ô', 'O', 'Ơ', 'A'], answer: 0 },
        { type: 'compare', question: 'So sánh O và Ô', items: [{ letter: 'O', description: 'Không dấu' }, { letter: 'Ô', description: 'Có dấu mũ' }] }
      ],
      quiz: [
        { question: 'Chữ Ô có dấu gì?', options: ['Dấu mũ (^)', 'Dấu trăng', 'Dấu móc', 'Không dấu'], correctAnswer: 0, explanation: 'Ô có dấu mũ' },
        { question: '🚗 là gì?', options: ['Ô tô', 'Xe máy', 'Xe đạp', 'Máy bay'], correctAnswer: 0, explanation: 'Xe ô tô' },
        { question: '👴 là ai?', options: ['Ông', 'Bà', 'Bố', 'Mẹ'], correctAnswer: 0, explanation: 'Ông nội/ngoại' },
        { question: 'Từ nào có chữ Ô?', options: ['Ông', 'Ong', 'Ớt', 'Ơi'], correctAnswer: 0, explanation: 'Ông có chữ Ô' },
        { question: 'O và Ô khác nhau thế nào?', options: ['Ô có dấu mũ', 'O có dấu mũ', 'Giống nhau', 'O có dấu móc'], correctAnswer: 0, explanation: 'Ô có dấu mũ, O không có' }
      ]
    }
  },

  // ========== BÀI 19: CHỮ CÁI Ơ ==========
  'tv1-hv-19': {
    id: 'tv1-hv-19',
    title: 'Chữ cái Ơ',
    subject: 'tieng-viet',
    grade: 1,
    category: 'hoc-van',
    order: 19,
    duration: 10,
    icon: '🌶️',
    color: 'from-red-500 to-rose-600',
    objectives: ['Nhận biết chữ Ơ, ơ', 'Đọc đúng âm "ơ"', 'Phân biệt O, Ô, Ơ'],
    content: {
      introduction: { letter: 'Ơ', letterLower: 'ơ', sound: '/ɤ/', description: 'Chữ Ơ có dấu móc, đọc là "ơ"', image: '🌶️' },
      vocabulary: [
        { word: 'ớt', meaning: 'Quả ớt', image: '🌶️', audio: 'ot.mp3' },
        { word: 'ơi', meaning: 'Ơi kìa', image: '📢', audio: 'oi2.mp3' },
        { word: 'bơ', meaning: 'Quả bơ', image: '🥑', audio: 'bo2.mp3' },
        { word: 'cờ', meaning: 'Lá cờ', image: '🚩', audio: 'co2.mp3' },
        { word: 'mơ', meaning: 'Giấc mơ', image: '💭', audio: 'mo.mp3' }
      ],
      exercises: [
        { type: 'listen-choose', question: 'Nghe và chọn chữ cái đúng', options: ['Ơ', 'O', 'Ô', 'A'], answer: 0 },
        { type: 'compare', question: 'So sánh O, Ô, Ơ', items: [{ letter: 'O', description: 'Không dấu' }, { letter: 'Ô', description: 'Dấu mũ' }, { letter: 'Ơ', description: 'Dấu móc' }] }
      ],
      quiz: [
        { question: 'Chữ Ơ có dấu gì?', options: ['Dấu móc', 'Dấu mũ', 'Dấu trăng', 'Không dấu'], correctAnswer: 0, explanation: 'Ơ có dấu móc' },
        { question: '🌶️ là gì?', options: ['Ớt', 'Cà', 'Dưa', 'Bí'], correctAnswer: 0, explanation: 'Quả ớt' },
        { question: '🥑 là quả gì?', options: ['Bơ', 'Ổi', 'Na', 'Mít'], correctAnswer: 0, explanation: 'Quả bơ' },
        { question: '🚩 là gì?', options: ['Cờ', 'Ô', 'Mũ', 'Nón'], correctAnswer: 0, explanation: 'Lá cờ' },
        { question: 'Sắp xếp đúng: O, Ô, Ơ', options: ['O → Ô → Ơ', 'Ơ → Ô → O', 'Ô → O → Ơ', 'O → Ơ → Ô'], correctAnswer: 0, explanation: 'Thứ tự bảng chữ cái: O, Ô, Ơ' }
      ]
    }
  },

  // ========== BÀI 20: CHỮ CÁI P ==========
  'tv1-hv-20': {
    id: 'tv1-hv-20',
    title: 'Chữ cái P',
    subject: 'tieng-viet',
    grade: 1,
    category: 'hoc-van',
    order: 20,
    duration: 10,
    icon: '🎆',
    color: 'from-purple-400 to-pink-500',
    objectives: ['Nhận biết chữ P, p', 'Đọc đúng âm "pờ"', 'Tìm từ có chữ p'],
    content: {
      introduction: { letter: 'P', letterLower: 'p', sound: '/p/', description: 'Chữ P đọc là "pờ"', image: '🎆' },
      vocabulary: [
        { word: 'pháo', meaning: 'Pháo hoa', image: '🎆', audio: 'phao.mp3' },
        { word: 'pin', meaning: 'Cục pin', image: '🔋', audio: 'pin.mp3' },
        { word: 'phở', meaning: 'Phở bò', image: '🍜', audio: 'pho.mp3' },
        { word: 'phố', meaning: 'Phố xá', image: '🏙️', audio: 'pho2.mp3' },
        { word: 'pha', meaning: 'Pha trà', image: '🍵', audio: 'pha.mp3' }
      ],
      exercises: [
        { type: 'listen-choose', question: 'Nghe và chọn chữ cái đúng', options: ['P', 'B', 'D', 'V'], answer: 0 },
        { type: 'image-match', question: 'Chọn hình bắt đầu bằng chữ P', options: [{ image: '🎆', word: 'Pháo', correct: true }, { image: '🍜', word: 'Phở', correct: true }, { image: '🐕', word: 'Chó', correct: false }, { image: '🐱', word: 'Mèo', correct: false }] }
      ],
      quiz: [
        { question: 'Chữ P đọc là gì?', options: ['Pờ', 'Bờ', 'Dờ', 'Vờ'], correctAnswer: 0, explanation: 'Chữ P đọc là "pờ"' },
        { question: '🎆 là gì?', options: ['Pháo hoa', 'Lửa', 'Sao', 'Đèn'], correctAnswer: 0, explanation: 'Pháo hoa' },
        { question: '🍜 là món gì?', options: ['Phở', 'Bún', 'Mì', 'Cháo'], correctAnswer: 0, explanation: 'Phở' },
        { question: 'Từ nào bắt đầu bằng P?', options: ['Pháo', 'Báo', 'Cáo', 'Đào'], correctAnswer: 0, explanation: 'Pháo bắt đầu bằng P' },
        { question: 'P và B khác nhau thế nào?', options: ['P đọc pờ, B đọc bờ', 'Giống nhau', 'P to hơn', 'B to hơn'], correctAnswer: 0, explanation: 'P đọc "pờ", B đọc "bờ"' }
      ]
    }
  },

  // ========== BÀI 21: CHỮ CÁI Q ==========
  'tv1-hv-21': {
    id: 'tv1-hv-21',
    title: 'Chữ cái Q',
    subject: 'tieng-viet',
    grade: 1,
    category: 'hoc-van',
    order: 21,
    duration: 10,
    icon: '🍊',
    color: 'from-orange-400 to-yellow-500',
    objectives: ['Nhận biết chữ Q, q', 'Đọc đúng âm "cu"', 'Tìm từ có chữ q'],
    content: {
      introduction: { letter: 'Q', letterLower: 'q', sound: '/k/', description: 'Chữ Q đọc là "cu", luôn đi với u', image: '🍊' },
      vocabulary: [
        { word: 'quả', meaning: 'Quả cam', image: '🍊', audio: 'qua.mp3' },
        { word: 'quạt', meaning: 'Cái quạt', image: '🌀', audio: 'quat.mp3' },
        { word: 'quần', meaning: 'Cái quần', image: '👖', audio: 'quan.mp3' },
        { word: 'quê', meaning: 'Quê hương', image: '🏡', audio: 'que.mp3' },
        { word: 'que', meaning: 'Que kem', image: '🍦', audio: 'que2.mp3' }
      ],
      exercises: [
        { type: 'listen-choose', question: 'Nghe và chọn chữ cái đúng', options: ['Q', 'C', 'K', 'G'], answer: 0 },
        { type: 'image-match', question: 'Chọn hình bắt đầu bằng chữ Q', options: [{ image: '🍊', word: 'Quả', correct: true }, { image: '👖', word: 'Quần', correct: true }, { image: '🐕', word: 'Chó', correct: false }, { image: '🐱', word: 'Mèo', correct: false }] }
      ],
      quiz: [
        { question: 'Chữ Q đọc là gì?', options: ['Cu', 'Cờ', 'Kờ', 'Gờ'], correctAnswer: 0, explanation: 'Chữ Q đọc là "cu"' },
        { question: 'Q luôn đi với chữ nào?', options: ['U', 'A', 'E', 'O'], correctAnswer: 0, explanation: 'Q luôn đi với U: qu' },
        { question: '🍊 là gì?', options: ['Quả cam', 'Quả táo', 'Quả chuối', 'Quả nho'], correctAnswer: 0, explanation: 'Quả cam' },
        { question: '👖 là gì?', options: ['Quần', 'Áo', 'Váy', 'Mũ'], correctAnswer: 0, explanation: 'Cái quần' },
        { question: 'Từ nào bắt đầu bằng Q?', options: ['Quạt', 'Cát', 'Gạt', 'Vát'], correctAnswer: 0, explanation: 'Quạt bắt đầu bằng Q' }
      ]
    }
  },

  // ========== BÀI 22: CHỮ CÁI R ==========
  'tv1-hv-22': {
    id: 'tv1-hv-22',
    title: 'Chữ cái R',
    subject: 'tieng-viet',
    grade: 1,
    category: 'hoc-van',
    order: 22,
    duration: 10,
    icon: '🥬',
    color: 'from-green-400 to-emerald-500',
    objectives: ['Nhận biết chữ R, r', 'Đọc đúng âm "rờ"', 'Tìm từ có chữ r'],
    content: {
      introduction: { letter: 'R', letterLower: 'r', sound: '/r/', description: 'Chữ R đọc là "rờ"', image: '🥬' },
      vocabulary: [
        { word: 'rau', meaning: 'Rau xanh', image: '🥬', audio: 'rau.mp3' },
        { word: 'rắn', meaning: 'Con rắn', image: '🐍', audio: 'ran.mp3' },
        { word: 'rừng', meaning: 'Rừng cây', image: '🌲', audio: 'rung.mp3' },
        { word: 'ruộng', meaning: 'Cánh đồng', image: '🌾', audio: 'ruong.mp3' },
        { word: 'rổ', meaning: 'Cái rổ', image: '🧺', audio: 'ro.mp3' }
      ],
      exercises: [
        { type: 'listen-choose', question: 'Nghe và chọn chữ cái đúng', options: ['R', 'L', 'N', 'M'], answer: 0 },
        { type: 'image-match', question: 'Chọn hình bắt đầu bằng chữ R', options: [{ image: '🥬', word: 'Rau', correct: true }, { image: '🐍', word: 'Rắn', correct: true }, { image: '🐕', word: 'Chó', correct: false }, { image: '🐱', word: 'Mèo', correct: false }] }
      ],
      quiz: [
        { question: 'Chữ R đọc là gì?', options: ['Rờ', 'Lờ', 'Nờ', 'Mờ'], correctAnswer: 0, explanation: 'Chữ R đọc là "rờ"' },
        { question: '🥬 là gì?', options: ['Rau', 'Cỏ', 'Lá', 'Hoa'], correctAnswer: 0, explanation: 'Rau xanh' },
        { question: '🐍 là con gì?', options: ['Rắn', 'Lươn', 'Giun', 'Sên'], correctAnswer: 0, explanation: 'Con rắn' },
        { question: '🌲 là gì?', options: ['Rừng', 'Vườn', 'Ruộng', 'Ao'], correctAnswer: 0, explanation: 'Rừng cây' },
        { question: 'Từ nào bắt đầu bằng R?', options: ['Rau', 'Lau', 'Nau', 'Mau'], correctAnswer: 0, explanation: 'Rau bắt đầu bằng R' }
      ]
    }
  },

  // ========== BÀI 23: CHỮ CÁI S ==========
  'tv1-hv-23': {
    id: 'tv1-hv-23',
    title: 'Chữ cái S',
    subject: 'tieng-viet',
    grade: 1,
    category: 'hoc-van',
    order: 23,
    duration: 10,
    icon: '📚',
    color: 'from-blue-400 to-indigo-500',
    objectives: ['Nhận biết chữ S, s', 'Đọc đúng âm "sờ"', 'Tìm từ có chữ s'],
    content: {
      introduction: { letter: 'S', letterLower: 's', sound: '/s/', description: 'Chữ S đọc là "sờ"', image: '📚' },
      vocabulary: [
        { word: 'sách', meaning: 'Quyển sách', image: '📚', audio: 'sach.mp3' },
        { word: 'sao', meaning: 'Ngôi sao', image: '⭐', audio: 'sao.mp3' },
        { word: 'sông', meaning: 'Con sông', image: '🏞️', audio: 'song.mp3' },
        { word: 'sữa', meaning: 'Sữa uống', image: '🥛', audio: 'sua.mp3' },
        { word: 'sư tử', meaning: 'Sư tử', image: '🦁', audio: 'sutu.mp3' }
      ],
      exercises: [
        { type: 'listen-choose', question: 'Nghe và chọn chữ cái đúng', options: ['S', 'X', 'C', 'Z'], answer: 0 },
        { type: 'image-match', question: 'Chọn hình bắt đầu bằng chữ S', options: [{ image: '📚', word: 'Sách', correct: true }, { image: '⭐', word: 'Sao', correct: true }, { image: '🐕', word: 'Chó', correct: false }, { image: '🐱', word: 'Mèo', correct: false }] }
      ],
      quiz: [
        { question: 'Chữ S đọc là gì?', options: ['Sờ', 'Xờ', 'Cờ', 'Zờ'], correctAnswer: 0, explanation: 'Chữ S đọc là "sờ"' },
        { question: '📚 là gì?', options: ['Sách', 'Vở', 'Báo', 'Tạp chí'], correctAnswer: 0, explanation: 'Quyển sách' },
        { question: '⭐ là gì?', options: ['Sao', 'Mặt trời', 'Mặt trăng', 'Đám mây'], correctAnswer: 0, explanation: 'Ngôi sao' },
        { question: '🦁 là con gì?', options: ['Sư tử', 'Hổ', 'Báo', 'Gấu'], correctAnswer: 0, explanation: 'Sư tử' },
        { question: 'Từ nào bắt đầu bằng S?', options: ['Sông', 'Xong', 'Công', 'Đông'], correctAnswer: 0, explanation: 'Sông bắt đầu bằng S' }
      ]
    }
  },

  // ========== BÀI 24: CHỮ CÁI T ==========
  'tv1-hv-24': {
    id: 'tv1-hv-24',
    title: 'Chữ cái T',
    subject: 'tieng-viet',
    grade: 1,
    category: 'hoc-van',
    order: 24,
    duration: 10,
    icon: '✋',
    color: 'from-amber-400 to-orange-500',
    objectives: ['Nhận biết chữ T, t', 'Đọc đúng âm "tờ"', 'Tìm từ có chữ t'],
    content: {
      introduction: { letter: 'T', letterLower: 't', sound: '/t/', description: 'Chữ T đọc là "tờ"', image: '✋' },
      vocabulary: [
        { word: 'tay', meaning: 'Bàn tay', image: '✋', audio: 'tay.mp3' },
        { word: 'táo', meaning: 'Quả táo', image: '🍎', audio: 'tao.mp3' },
        { word: 'trăng', meaning: 'Mặt trăng', image: '🌙', audio: 'trang.mp3' },
        { word: 'trời', meaning: 'Bầu trời', image: '🌤️', audio: 'troi.mp3' },
        { word: 'thỏ', meaning: 'Con thỏ', image: '🐰', audio: 'tho.mp3' }
      ],
      exercises: [
        { type: 'listen-choose', question: 'Nghe và chọn chữ cái đúng', options: ['T', 'D', 'Đ', 'N'], answer: 0 },
        { type: 'image-match', question: 'Chọn hình bắt đầu bằng chữ T', options: [{ image: '✋', word: 'Tay', correct: true }, { image: '🍎', word: 'Táo', correct: true }, { image: '🐕', word: 'Chó', correct: false }, { image: '🐱', word: 'Mèo', correct: false }] }
      ],
      quiz: [
        { question: 'Chữ T đọc là gì?', options: ['Tờ', 'Dờ', 'Đờ', 'Nờ'], correctAnswer: 0, explanation: 'Chữ T đọc là "tờ"' },
        { question: '✋ là gì?', options: ['Tay', 'Chân', 'Đầu', 'Vai'], correctAnswer: 0, explanation: 'Bàn tay' },
        { question: '🍎 là quả gì?', options: ['Táo', 'Cam', 'Nho', 'Chuối'], correctAnswer: 0, explanation: 'Quả táo' },
        { question: '🐰 là con gì?', options: ['Thỏ', 'Mèo', 'Chó', 'Gấu'], correctAnswer: 0, explanation: 'Con thỏ' },
        { question: 'Từ nào bắt đầu bằng T?', options: ['Trời', 'Đời', 'Nơi', 'Lời'], correctAnswer: 0, explanation: 'Trời bắt đầu bằng T' }
      ]
    }
  },

  // ========== BÀI 25: CHỮ CÁI U ==========
  'tv1-hv-25': {
    id: 'tv1-hv-25',
    title: 'Chữ cái U',
    subject: 'tieng-viet',
    grade: 1,
    category: 'hoc-van',
    order: 25,
    duration: 10,
    icon: '🐄',
    color: 'from-yellow-400 to-lime-500',
    objectives: ['Nhận biết chữ U, u', 'Đọc đúng âm "u"', 'Tìm từ có chữ u'],
    content: {
      introduction: { letter: 'U', letterLower: 'u', sound: '/u/', description: 'Chữ U đọc là "u", miệng chụm', image: '🐄' },
      vocabulary: [
        { word: 'u', meaning: 'Con bò rống u u', image: '🐄', audio: 'u.mp3' },
        { word: 'ủng', meaning: 'Ủng hộ', image: '👍', audio: 'ung.mp3' },
        { word: 'uống', meaning: 'Uống nước', image: '🥤', audio: 'uong.mp3' },
        { word: 'ướt', meaning: 'Bị ướt', image: '💦', audio: 'uot.mp3' },
        { word: 'cua', meaning: 'Con cua', image: '🦀', audio: 'cua2.mp3' }
      ],
      exercises: [
        { type: 'listen-choose', question: 'Nghe và chọn chữ cái đúng', options: ['U', 'Ư', 'O', 'A'], answer: 0 },
        { type: 'image-match', question: 'Chọn từ có chữ U', options: [{ image: '🥤', word: 'Uống', correct: true }, { image: '🦀', word: 'Cua', correct: true }, { image: '🐕', word: 'Chó', correct: false }, { image: '🐱', word: 'Mèo', correct: false }] }
      ],
      quiz: [
        { question: 'Chữ U đọc là gì?', options: ['U', 'Ư', 'O', 'A'], correctAnswer: 0, explanation: 'Chữ U đọc là "u"' },
        { question: '🥤 là hành động gì?', options: ['Uống', 'Ăn', 'Ngủ', 'Chơi'], correctAnswer: 0, explanation: 'Uống nước' },
        { question: '🦀 là con gì?', options: ['Cua', 'Tôm', 'Cá', 'Ốc'], correctAnswer: 0, explanation: 'Con cua' },
        { question: 'Từ nào có chữ U?', options: ['Uống', 'Ăn', 'Ở', 'Ơi'], correctAnswer: 0, explanation: 'Uống có chữ U' },
        { question: 'U và Ư khác nhau thế nào?', options: ['Ư có dấu móc', 'U có dấu móc', 'Giống nhau', 'U có dấu mũ'], correctAnswer: 0, explanation: 'Ư có dấu móc, U không có' }
      ]
    }
  },

  // ========== BÀI 26: CHỮ CÁI Ư ==========
  'tv1-hv-26': {
    id: 'tv1-hv-26',
    title: 'Chữ cái Ư',
    subject: 'tieng-viet',
    grade: 1,
    category: 'hoc-van',
    order: 26,
    duration: 10,
    icon: '🍇',
    color: 'from-purple-400 to-violet-500',
    objectives: ['Nhận biết chữ Ư, ư', 'Đọc đúng âm "ư"', 'Phân biệt U và Ư'],
    content: {
      introduction: { letter: 'Ư', letterLower: 'ư', sound: '/ɯ/', description: 'Chữ Ư có dấu móc, đọc là "ư"', image: '🍇' },
      vocabulary: [
        { word: 'ươi', meaning: 'Con vượn', image: '🦧', audio: 'uoi.mp3' },
        { word: 'ướt', meaning: 'Bị ướt', image: '💦', audio: 'uot2.mp3' },
        { word: 'ưa', meaning: 'Ưa thích', image: '❤️', audio: 'ua.mp3' },
        { word: 'ưng', meaning: 'Chim ưng', image: '🦅', audio: 'ung2.mp3' },
        { word: 'dưa', meaning: 'Quả dưa', image: '🍈', audio: 'dua2.mp3' }
      ],
      exercises: [
        { type: 'listen-choose', question: 'Nghe và chọn chữ cái đúng', options: ['Ư', 'U', 'O', 'Ô'], answer: 0 },
        { type: 'compare', question: 'So sánh U và Ư', items: [{ letter: 'U', description: 'Không dấu' }, { letter: 'Ư', description: 'Có dấu móc' }] }
      ],
      quiz: [
        { question: 'Chữ Ư có dấu gì?', options: ['Dấu móc', 'Dấu mũ', 'Dấu trăng', 'Không dấu'], correctAnswer: 0, explanation: 'Ư có dấu móc' },
        { question: '🦧 là con gì?', options: ['Vượn', 'Khỉ', 'Gấu', 'Chó'], correctAnswer: 0, explanation: 'Con vượn' },
        { question: '🦅 là con gì?', options: ['Chim ưng', 'Chim bồ câu', 'Chim sẻ', 'Chim én'], correctAnswer: 0, explanation: 'Chim ưng' },
        { question: 'Từ nào có chữ Ư?', options: ['Dưa', 'Dua', 'Dơa', 'Doa'], correctAnswer: 0, explanation: 'Dưa có chữ Ư' },
        { question: 'U và Ư khác nhau thế nào?', options: ['Ư có dấu móc', 'U có dấu móc', 'Giống nhau', 'U có dấu mũ'], correctAnswer: 0, explanation: 'Ư có dấu móc, U không có' }
      ]
    }
  },

  // ========== BÀI 27: CHỮ CÁI V ==========
  'tv1-hv-27': {
    id: 'tv1-hv-27',
    title: 'Chữ cái V',
    subject: 'tieng-viet',
    grade: 1,
    category: 'hoc-van',
    order: 27,
    duration: 10,
    icon: '🦆',
    color: 'from-teal-400 to-cyan-500',
    objectives: ['Nhận biết chữ V, v', 'Đọc đúng âm "vờ"', 'Tìm từ có chữ v'],
    content: {
      introduction: { letter: 'V', letterLower: 'v', sound: '/v/', description: 'Chữ V đọc là "vờ"', image: '🦆' },
      vocabulary: [
        { word: 'vịt', meaning: 'Con vịt', image: '🦆', audio: 'vit.mp3' },
        { word: 'voi', meaning: 'Con voi', image: '🐘', audio: 'voi.mp3' },
        { word: 'vườn', meaning: 'Vườn cây', image: '🏡', audio: 'vuon.mp3' },
        { word: 'vở', meaning: 'Quyển vở', image: '📓', audio: 'vo.mp3' },
        { word: 'váy', meaning: 'Cái váy', image: '👗', audio: 'vay.mp3' }
      ],
      exercises: [
        { type: 'listen-choose', question: 'Nghe và chọn chữ cái đúng', options: ['V', 'B', 'D', 'P'], answer: 0 },
        { type: 'image-match', question: 'Chọn hình bắt đầu bằng chữ V', options: [{ image: '🦆', word: 'Vịt', correct: true }, { image: '🐘', word: 'Voi', correct: true }, { image: '🐕', word: 'Chó', correct: false }, { image: '🐱', word: 'Mèo', correct: false }] }
      ],
      quiz: [
        { question: 'Chữ V đọc là gì?', options: ['Vờ', 'Bờ', 'Dờ', 'Pờ'], correctAnswer: 0, explanation: 'Chữ V đọc là "vờ"' },
        { question: '🦆 là con gì?', options: ['Vịt', 'Gà', 'Ngan', 'Ngỗng'], correctAnswer: 0, explanation: 'Con vịt' },
        { question: '🐘 là con gì?', options: ['Voi', 'Tê giác', 'Hà mã', 'Ngựa'], correctAnswer: 0, explanation: 'Con voi' },
        { question: '📓 là gì?', options: ['Vở', 'Sách', 'Báo', 'Tạp chí'], correctAnswer: 0, explanation: 'Quyển vở' },
        { question: 'Từ nào bắt đầu bằng V?', options: ['Vịt', 'Bịt', 'Dịt', 'Pịt'], correctAnswer: 0, explanation: 'Vịt bắt đầu bằng V' }
      ]
    }
  },

  // ========== BÀI 28: CHỮ CÁI X ==========
  'tv1-hv-28': {
    id: 'tv1-hv-28',
    title: 'Chữ cái X',
    subject: 'tieng-viet',
    grade: 1,
    category: 'hoc-van',
    order: 28,
    duration: 10,
    icon: '🚲',
    color: 'from-slate-400 to-gray-500',
    objectives: ['Nhận biết chữ X, x', 'Đọc đúng âm "xờ"', 'Tìm từ có chữ x'],
    content: {
      introduction: { letter: 'X', letterLower: 'x', sound: '/s/', description: 'Chữ X đọc là "xờ"', image: '🚲' },
      vocabulary: [
        { word: 'xe', meaning: 'Xe đạp', image: '🚲', audio: 'xe.mp3' },
        { word: 'xanh', meaning: 'Màu xanh', image: '🟢', audio: 'xanh.mp3' },
        { word: 'xoài', meaning: 'Quả xoài', image: '🥭', audio: 'xoai.mp3' },
        { word: 'xôi', meaning: 'Xôi ăn', image: '🍚', audio: 'xoi.mp3' },
        { word: 'xúc xích', meaning: 'Xúc xích', image: '🌭', audio: 'xucxich.mp3' }
      ],
      exercises: [
        { type: 'listen-choose', question: 'Nghe và chọn chữ cái đúng', options: ['X', 'S', 'C', 'Z'], answer: 0 },
        { type: 'image-match', question: 'Chọn hình bắt đầu bằng chữ X', options: [{ image: '🚲', word: 'Xe', correct: true }, { image: '🥭', word: 'Xoài', correct: true }, { image: '🐕', word: 'Chó', correct: false }, { image: '🐱', word: 'Mèo', correct: false }] }
      ],
      quiz: [
        { question: 'Chữ X đọc là gì?', options: ['Xờ', 'Sờ', 'Cờ', 'Zờ'], correctAnswer: 0, explanation: 'Chữ X đọc là "xờ"' },
        { question: '🚲 là gì?', options: ['Xe đạp', 'Xe máy', 'Ô tô', 'Máy bay'], correctAnswer: 0, explanation: 'Xe đạp' },
        { question: '🥭 là quả gì?', options: ['Xoài', 'Táo', 'Cam', 'Nho'], correctAnswer: 0, explanation: 'Quả xoài' },
        { question: '🟢 là màu gì?', options: ['Xanh', 'Đỏ', 'Vàng', 'Tím'], correctAnswer: 0, explanation: 'Màu xanh' },
        { question: 'Từ nào bắt đầu bằng X?', options: ['Xe', 'Se', 'Ce', 'De'], correctAnswer: 0, explanation: 'Xe bắt đầu bằng X' }
      ]
    }
  },

  // ========== BÀI 29: CHỮ CÁI Y ==========
  'tv1-hv-29': {
    id: 'tv1-hv-29',
    title: 'Chữ cái Y',
    subject: 'tieng-viet',
    grade: 1,
    category: 'hoc-van',
    order: 29,
    duration: 10,
    icon: '❤️',
    color: 'from-red-400 to-pink-500',
    objectives: ['Nhận biết chữ Y, y', 'Đọc đúng âm "i dài"', 'Tìm từ có chữ y'],
    content: {
      introduction: { letter: 'Y', letterLower: 'y', sound: '/i/', description: 'Chữ Y đọc là "i dài" hoặc "y"', image: '❤️' },
      vocabulary: [
        { word: 'yêu', meaning: 'Yêu thương', image: '❤️', audio: 'yeu.mp3' },
        { word: 'yến', meaning: 'Chim yến', image: '🐦', audio: 'yen.mp3' },
        { word: 'yên', meaning: 'Yên tĩnh', image: '🤫', audio: 'yen2.mp3' },
        { word: 'ý', meaning: 'Ý kiến', image: '💡', audio: 'y.mp3' },
        { word: 'may', meaning: 'May mắn', image: '🍀', audio: 'may.mp3' }
      ],
      exercises: [
        { type: 'listen-choose', question: 'Nghe và chọn chữ cái đúng', options: ['Y', 'I', 'U', 'V'], answer: 0 },
        { type: 'image-match', question: 'Chọn từ có chữ Y', options: [{ image: '❤️', word: 'Yêu', correct: true }, { image: '🍀', word: 'May', correct: true }, { image: '🐕', word: 'Chó', correct: false }, { image: '🐱', word: 'Mèo', correct: false }] }
      ],
      quiz: [
        { question: 'Chữ Y còn gọi là gì?', options: ['I dài', 'I ngắn', 'U dài', 'O dài'], correctAnswer: 0, explanation: 'Y còn gọi là "i dài"' },
        { question: '❤️ là từ gì?', options: ['Yêu', 'Thương', 'Nhớ', 'Mến'], correctAnswer: 0, explanation: 'Yêu thương' },
        { question: '🍀 là gì?', options: ['May mắn', 'Cỏ', 'Lá', 'Hoa'], correctAnswer: 0, explanation: 'May mắn' },
        { question: 'Từ nào có chữ Y?', options: ['Yêu', 'Êu', 'Iu', 'Ưu'], correctAnswer: 0, explanation: 'Yêu có chữ Y' },
        { question: 'Y và I khác nhau thế nào?', options: ['Y dài hơn', 'I dài hơn', 'Giống nhau', 'Y ngắn hơn'], correctAnswer: 0, explanation: 'Y là "i dài", I là "i ngắn"' }
      ]
    }
  },

  // ========== BÀI 30: GHÉP VẦN CƠ BẢN ==========
  'tv1-hv-30': {
    id: 'tv1-hv-30',
    title: 'Ghép vần cơ bản',
    subject: 'tieng-viet',
    grade: 1,
    category: 'hoc-van',
    order: 30,
    duration: 15,
    icon: '🔤',
    color: 'from-gradient-400 to-rainbow-500',
    objectives: ['Học các vần cơ bản', 'Ghép phụ âm với vần', 'Đọc từ ghép vần'],
    content: {
      introduction: { letter: 'VẦN', letterLower: 'vần', sound: '/vần/', description: 'Ghép phụ âm + vần = từ có nghĩa', image: '🔤' },
      vocabulary: [
        { word: 'an', meaning: 'Vần an: b+an=ban', image: '📖', audio: 'an.mp3' },
        { word: 'at', meaning: 'Vần at: m+at=mát', image: '❄️', audio: 'at.mp3' },
        { word: 'ang', meaning: 'Vần ang: v+ang=vang', image: '🔔', audio: 'ang.mp3' },
        { word: 'anh', meaning: 'Vần anh: t+anh=tanh', image: '🐟', audio: 'anh.mp3' },
        { word: 'ao', meaning: 'Vần ao: b+ao=bao', image: '📦', audio: 'ao.mp3' },
        { word: 'au', meaning: 'Vần au: s+au=sau', image: '➡️', audio: 'au.mp3' },
        { word: 'ay', meaning: 'Vần ay: t+ay=tay', image: '✋', audio: 'ay.mp3' }
      ],
      exercises: [
        { type: 'blend', question: 'Ghép: b + an = ?', options: ['ban', 'can', 'dan', 'man'], answer: 0 },
        { type: 'blend', question: 'Ghép: m + at = ?', options: ['mát', 'bát', 'cát', 'hát'], answer: 0 },
        { type: 'blend', question: 'Ghép: t + ay = ?', options: ['tay', 'bay', 'cay', 'hay'], answer: 0 }
      ],
      quiz: [
        { question: 'b + an = ?', options: ['ban', 'can', 'dan', 'man'], correctAnswer: 0, explanation: 'b ghép với an thành ban' },
        { question: 'm + at = ?', options: ['mát', 'bát', 'cát', 'hát'], correctAnswer: 0, explanation: 'm ghép với at thành mát' },
        { question: 'c + ao = ?', options: ['cao', 'bao', 'dao', 'hao'], correctAnswer: 0, explanation: 'c ghép với ao thành cao' },
        { question: 'Vần nào trong từ "bay"?', options: ['ay', 'an', 'ao', 'au'], correctAnswer: 0, explanation: 'Bay = b + ay' },
        { question: 'Từ "mang" có vần gì?', options: ['ang', 'an', 'anh', 'ao'], correctAnswer: 0, explanation: 'Mang = m + ang' }
      ]
    }
  }
};

// Export helper function
export const getHocVanLesson = (lessonId) => {
  return HOC_VAN_LESSONS[lessonId] || null;
};

export const getHocVanLessonList = () => {
  return Object.values(HOC_VAN_LESSONS).sort((a, b) => a.order - b.order);
};
