// src/data/tiengviet/lop1/tapviet.js
// 15 BÀI TẬP VIẾT - TIẾNG VIỆT LỚP 1

export const TAP_VIET_LESSONS = {
  // ========== BÀI 1: NÉT NGANG ==========
  'tv1-tv-01': {
    id: 'tv1-tv-01',
    title: 'Viết nét ngang',
    subject: 'tieng-viet',
    grade: 1,
    category: 'tap-viet',
    order: 1,
    duration: 10,
    icon: '➖',
    color: 'from-blue-400 to-cyan-500',
    objectives: ['Biết cách viết nét ngang', 'Viết đúng chiều', 'Luyện tập viết'],
    content: {
      introduction: {
        stroke: 'ngang',
        description: 'Nét ngang là nét kẻ thẳng từ trái sang phải',
        direction: 'Trái → Phải',
        image: '➖'
      },
      guide: [
        { step: 1, instruction: 'Đặt bút ở bên trái', image: '📍' },
        { step: 2, instruction: 'Kéo bút thẳng sang phải', image: '➡️' },
        { step: 3, instruction: 'Nhấc bút lên', image: '✋' }
      ],
      practice: {
        type: 'trace',
        lines: 5,
        example: '—'
      },
      quiz: [
        { question: 'Nét ngang viết theo hướng nào?', options: ['Trái sang phải', 'Phải sang trái', 'Trên xuống dưới', 'Dưới lên trên'], correctAnswer: 0, explanation: 'Nét ngang viết từ trái sang phải' },
        { question: 'Nét ngang có trong chữ nào?', options: ['A', 'O', 'C', 'S'], correctAnswer: 0, explanation: 'Chữ A có nét ngang ở giữa' },
        { question: 'Bắt đầu viết nét ngang ở đâu?', options: ['Bên trái', 'Bên phải', 'Ở giữa', 'Ở trên'], correctAnswer: 0, explanation: 'Bắt đầu ở bên trái' },
        { question: 'Nét ngang giống hình gì?', options: ['Đường thẳng nằm', 'Đường thẳng đứng', 'Hình tròn', 'Hình cong'], correctAnswer: 0, explanation: 'Nét ngang là đường thẳng nằm ngang' },
        { question: 'Chữ E có mấy nét ngang?', options: ['3', '1', '2', '4'], correctAnswer: 0, explanation: 'Chữ E có 3 nét ngang' }
      ]
    }
  },

  // ========== BÀI 2: NÉT SỔ ==========
  'tv1-tv-02': {
    id: 'tv1-tv-02',
    title: 'Viết nét sổ',
    subject: 'tieng-viet',
    grade: 1,
    category: 'tap-viet',
    order: 2,
    duration: 10,
    icon: '|',
    color: 'from-green-400 to-emerald-500',
    objectives: ['Biết cách viết nét sổ', 'Viết đúng chiều', 'Luyện tập viết'],
    content: {
      introduction: {
        stroke: 'sổ',
        description: 'Nét sổ là nét kẻ thẳng từ trên xuống dưới',
        direction: 'Trên → Dưới',
        image: '|'
      },
      guide: [
        { step: 1, instruction: 'Đặt bút ở trên', image: '📍' },
        { step: 2, instruction: 'Kéo bút thẳng xuống dưới', image: '⬇️' },
        { step: 3, instruction: 'Nhấc bút lên', image: '✋' }
      ],
      practice: {
        type: 'trace',
        lines: 5,
        example: '|'
      },
      quiz: [
        { question: 'Nét sổ viết theo hướng nào?', options: ['Trên xuống dưới', 'Dưới lên trên', 'Trái sang phải', 'Phải sang trái'], correctAnswer: 0, explanation: 'Nét sổ viết từ trên xuống dưới' },
        { question: 'Nét sổ có trong chữ nào?', options: ['I', 'O', 'C', 'S'], correctAnswer: 0, explanation: 'Chữ I là nét sổ' },
        { question: 'Bắt đầu viết nét sổ ở đâu?', options: ['Ở trên', 'Ở dưới', 'Bên trái', 'Bên phải'], correctAnswer: 0, explanation: 'Bắt đầu ở trên' },
        { question: 'Nét sổ giống hình gì?', options: ['Đường thẳng đứng', 'Đường thẳng nằm', 'Hình tròn', 'Hình cong'], correctAnswer: 0, explanation: 'Nét sổ là đường thẳng đứng' },
        { question: 'Chữ L có mấy nét sổ?', options: ['1', '2', '3', '0'], correctAnswer: 0, explanation: 'Chữ L có 1 nét sổ' }
      ]
    }
  },

  // ========== BÀI 3: NÉT MÓC ==========
  'tv1-tv-03': {
    id: 'tv1-tv-03',
    title: 'Viết nét móc',
    subject: 'tieng-viet',
    grade: 1,
    category: 'tap-viet',
    order: 3,
    duration: 12,
    icon: '⌐',
    color: 'from-purple-400 to-violet-500',
    objectives: ['Biết cách viết nét móc xuôi', 'Biết cách viết nét móc ngược', 'Luyện tập viết'],
    content: {
      introduction: {
        stroke: 'móc',
        description: 'Nét móc gồm nét móc xuôi và nét móc ngược',
        direction: 'Móc xuôi: uốn sang phải. Móc ngược: uốn sang trái',
        image: '⌐'
      },
      guide: [
        { step: 1, instruction: 'Nét móc xuôi: Viết từ trên xuống, uốn sang phải', image: '↪️' },
        { step: 2, instruction: 'Nét móc ngược: Viết từ trên xuống, uốn sang trái', image: '↩️' },
        { step: 3, instruction: 'Luyện tập cả hai loại', image: '✏️' }
      ],
      practice: {
        type: 'trace',
        lines: 5,
        example: '⌐ ⌐'
      },
      quiz: [
        { question: 'Có mấy loại nét móc?', options: ['2 loại', '1 loại', '3 loại', '4 loại'], correctAnswer: 0, explanation: 'Có 2 loại: móc xuôi và móc ngược' },
        { question: 'Nét móc xuôi uốn về hướng nào?', options: ['Phải', 'Trái', 'Trên', 'Dưới'], correctAnswer: 0, explanation: 'Móc xuôi uốn sang phải' },
        { question: 'Nét móc ngược uốn về hướng nào?', options: ['Trái', 'Phải', 'Trên', 'Dưới'], correctAnswer: 0, explanation: 'Móc ngược uốn sang trái' },
        { question: 'Chữ nào có nét móc?', options: ['n', 'o', 'c', 's'], correctAnswer: 0, explanation: 'Chữ n có nét móc' },
        { question: 'Nét móc bắt đầu từ đâu?', options: ['Trên', 'Dưới', 'Trái', 'Phải'], correctAnswer: 0, explanation: 'Bắt đầu từ trên' }
      ]
    }
  },

  // ========== BÀI 4: NÉT CONG ==========
  'tv1-tv-04': {
    id: 'tv1-tv-04',
    title: 'Viết nét cong',
    subject: 'tieng-viet',
    grade: 1,
    category: 'tap-viet',
    order: 4,
    duration: 12,
    icon: '⌒',
    color: 'from-pink-400 to-rose-500',
    objectives: ['Biết cách viết nét cong trái', 'Biết cách viết nét cong phải', 'Luyện tập viết'],
    content: {
      introduction: {
        stroke: 'cong',
        description: 'Nét cong gồm nét cong trái và nét cong phải',
        direction: 'Cong trái: mở về bên trái. Cong phải: mở về bên phải',
        image: '⌒'
      },
      guide: [
        { step: 1, instruction: 'Nét cong trái: Viết cong mở về bên trái', image: '(' },
        { step: 2, instruction: 'Nét cong phải: Viết cong mở về bên phải', image: ')' },
        { step: 3, instruction: 'Luyện tập cả hai loại', image: '✏️' }
      ],
      practice: {
        type: 'trace',
        lines: 5,
        example: '( )'
      },
      quiz: [
        { question: 'Có mấy loại nét cong?', options: ['2 loại', '1 loại', '3 loại', '4 loại'], correctAnswer: 0, explanation: 'Có 2 loại: cong trái và cong phải' },
        { question: 'Chữ C có nét cong gì?', options: ['Cong phải', 'Cong trái', 'Cả hai', 'Không có'], correctAnswer: 0, explanation: 'Chữ C có nét cong phải (mở về bên phải)' },
        { question: 'Chữ O có nét cong không?', options: ['Có', 'Không', 'Ít', 'Nhiều'], correctAnswer: 0, explanation: 'Chữ O có nét cong' },
        { question: 'Nét cong trái giống hình gì?', options: ['(', ')', '|', '-'], correctAnswer: 0, explanation: 'Nét cong trái giống dấu (' },
        { question: 'Nét cong phải giống hình gì?', options: [')', '(', '|', '-'], correctAnswer: 0, explanation: 'Nét cong phải giống dấu )' }
      ]
    }
  },

  // ========== BÀI 5: NÉT THẮT ==========
  'tv1-tv-05': {
    id: 'tv1-tv-05',
    title: 'Viết nét thắt',
    subject: 'tieng-viet',
    grade: 1,
    category: 'tap-viet',
    order: 5,
    duration: 12,
    icon: '∞',
    color: 'from-amber-400 to-orange-500',
    objectives: ['Biết cách viết nét thắt', 'Viết đúng kỹ thuật', 'Luyện tập viết'],
    content: {
      introduction: {
        stroke: 'thắt',
        description: 'Nét thắt là nét uốn lượn tạo vòng nhỏ',
        direction: 'Viết liên tục tạo vòng thắt',
        image: '∞'
      },
      guide: [
        { step: 1, instruction: 'Bắt đầu từ trên', image: '📍' },
        { step: 2, instruction: 'Viết cong xuống và tạo vòng nhỏ', image: '🔄' },
        { step: 3, instruction: 'Tiếp tục kéo lên hoặc xuống', image: '✏️' }
      ],
      practice: {
        type: 'trace',
        lines: 5,
        example: '∞'
      },
      quiz: [
        { question: 'Nét thắt có hình gì?', options: ['Vòng nhỏ', 'Đường thẳng', 'Đường đứt', 'Hình vuông'], correctAnswer: 0, explanation: 'Nét thắt tạo vòng nhỏ' },
        { question: 'Chữ nào có nét thắt?', options: ['b', 'i', 'l', 'o'], correctAnswer: 0, explanation: 'Chữ b có nét thắt' },
        { question: 'Viết nét thắt cần gì?', options: ['Liên tục', 'Đứt đoạn', 'Chậm', 'Nhanh'], correctAnswer: 0, explanation: 'Viết nét thắt liên tục' },
        { question: 'Nét thắt ở vị trí nào của chữ b?', options: ['Giữa', 'Trên', 'Dưới', 'Bên'], correctAnswer: 0, explanation: 'Nét thắt ở giữa chữ b' },
        { question: 'Nét thắt khó hay dễ?', options: ['Khó', 'Dễ', 'Rất dễ', 'Rất khó'], correctAnswer: 0, explanation: 'Nét thắt cần luyện tập nhiều' }
      ]
    }
  },

  // ========== BÀI 6: VIẾT CHỮ a, ă, â ==========
  'tv1-tv-06': {
    id: 'tv1-tv-06',
    title: 'Viết chữ a, ă, â',
    subject: 'tieng-viet',
    grade: 1,
    category: 'tap-viet',
    order: 6,
    duration: 15,
    icon: '🅰️',
    color: 'from-red-400 to-pink-500',
    objectives: ['Viết đúng chữ a', 'Viết đúng chữ ă', 'Viết đúng chữ â'],
    content: {
      introduction: {
        letters: ['a', 'ă', 'â'],
        description: 'Học viết 3 chữ cái: a, ă, â',
        image: '🅰️'
      },
      guide: [
        { letter: 'a', steps: ['Viết nét cong trái', 'Viết nét sổ ngắn'] },
        { letter: 'ă', steps: ['Viết chữ a', 'Thêm dấu trăng ở trên'] },
        { letter: 'â', steps: ['Viết chữ a', 'Thêm dấu mũ ở trên'] }
      ],
      practice: {
        type: 'trace',
        letters: ['a', 'ă', 'â'],
        lines: 3
      },
      quiz: [
        { question: 'Chữ a có mấy nét?', options: ['2 nét', '1 nét', '3 nét', '4 nét'], correctAnswer: 0, explanation: 'Chữ a có 2 nét: cong trái và sổ' },
        { question: 'Chữ ă khác chữ a ở đâu?', options: ['Có dấu trăng', 'Có dấu mũ', 'Có dấu móc', 'Giống nhau'], correctAnswer: 0, explanation: 'Chữ ă có dấu trăng' },
        { question: 'Chữ â khác chữ a ở đâu?', options: ['Có dấu mũ', 'Có dấu trăng', 'Có dấu móc', 'Giống nhau'], correctAnswer: 0, explanation: 'Chữ â có dấu mũ' },
        { question: 'Viết chữ a bắt đầu từ đâu?', options: ['Bên phải', 'Bên trái', 'Ở giữa', 'Ở trên'], correctAnswer: 0, explanation: 'Bắt đầu từ bên phải' },
        { question: 'Dấu trăng hình gì?', options: ['Nửa vòng tròn cong xuống', 'Tam giác', 'Hình vuông', 'Đường thẳng'], correctAnswer: 0, explanation: 'Dấu trăng như nửa vòng tròn' }
      ]
    }
  },

  // ========== BÀI 7: VIẾT CHỮ b, c, d ==========
  'tv1-tv-07': {
    id: 'tv1-tv-07',
    title: 'Viết chữ b, c, d',
    subject: 'tieng-viet',
    grade: 1,
    category: 'tap-viet',
    order: 7,
    duration: 15,
    icon: '🔤',
    color: 'from-blue-400 to-indigo-500',
    objectives: ['Viết đúng chữ b', 'Viết đúng chữ c', 'Viết đúng chữ d'],
    content: {
      introduction: {
        letters: ['b', 'c', 'd'],
        description: 'Học viết 3 chữ cái: b, c, d',
        image: '🔤'
      },
      guide: [
        { letter: 'b', steps: ['Viết nét sổ cao', 'Viết nét thắt', 'Viết nét cong'] },
        { letter: 'c', steps: ['Viết nét cong phải'] },
        { letter: 'd', steps: ['Viết nét cong trái', 'Viết nét sổ cao'] }
      ],
      practice: {
        type: 'trace',
        letters: ['b', 'c', 'd'],
        lines: 3
      },
      quiz: [
        { question: 'Chữ b cao hơn chữ c không?', options: ['Có', 'Không', 'Bằng nhau', 'Thấp hơn'], correctAnswer: 0, explanation: 'Chữ b cao hơn chữ c' },
        { question: 'Chữ c có mấy nét?', options: ['1 nét', '2 nét', '3 nét', '4 nét'], correctAnswer: 0, explanation: 'Chữ c chỉ có 1 nét cong' },
        { question: 'Chữ d giống chữ nào?', options: ['b lật ngược', 'c', 'a', 'e'], correctAnswer: 0, explanation: 'Chữ d như chữ b lật ngược' },
        { question: 'Viết chữ b bắt đầu từ đâu?', options: ['Trên', 'Dưới', 'Trái', 'Phải'], correctAnswer: 0, explanation: 'Bắt đầu từ trên' },
        { question: 'Chữ nào đơn giản nhất?', options: ['c', 'b', 'd', 'Bằng nhau'], correctAnswer: 0, explanation: 'Chữ c chỉ có 1 nét' }
      ]
    }
  },

  // ========== BÀI 8: VIẾT CHỮ đ, e, ê ==========
  'tv1-tv-08': {
    id: 'tv1-tv-08',
    title: 'Viết chữ đ, e, ê',
    subject: 'tieng-viet',
    grade: 1,
    category: 'tap-viet',
    order: 8,
    duration: 15,
    icon: '✏️',
    color: 'from-green-400 to-teal-500',
    objectives: ['Viết đúng chữ đ', 'Viết đúng chữ e', 'Viết đúng chữ ê'],
    content: {
      introduction: {
        letters: ['đ', 'e', 'ê'],
        description: 'Học viết 3 chữ cái: đ, e, ê',
        image: '✏️'
      },
      guide: [
        { letter: 'đ', steps: ['Viết chữ d', 'Thêm gạch ngang ở giữa'] },
        { letter: 'e', steps: ['Viết nét thắt nhỏ', 'Viết nét cong'] },
        { letter: 'ê', steps: ['Viết chữ e', 'Thêm dấu mũ ở trên'] }
      ],
      practice: {
        type: 'trace',
        letters: ['đ', 'e', 'ê'],
        lines: 3
      },
      quiz: [
        { question: 'Chữ đ khác chữ d ở đâu?', options: ['Có gạch ngang', 'Có dấu mũ', 'Có dấu trăng', 'Giống nhau'], correctAnswer: 0, explanation: 'Chữ đ có gạch ngang' },
        { question: 'Chữ e có mấy nét?', options: ['2 nét', '1 nét', '3 nét', '4 nét'], correctAnswer: 0, explanation: 'Chữ e có 2 nét' },
        { question: 'Chữ ê khác chữ e ở đâu?', options: ['Có dấu mũ', 'Có gạch ngang', 'Có dấu trăng', 'Giống nhau'], correctAnswer: 0, explanation: 'Chữ ê có dấu mũ' },
        { question: 'Gạch ngang của chữ đ ở đâu?', options: ['Giữa thân chữ', 'Trên đầu', 'Dưới chân', 'Bên cạnh'], correctAnswer: 0, explanation: 'Gạch ngang ở giữa thân chữ đ' },
        { question: 'Dấu mũ hình gì?', options: ['Tam giác nhỏ', 'Hình tròn', 'Hình vuông', 'Đường thẳng'], correctAnswer: 0, explanation: 'Dấu mũ như tam giác nhỏ ^' }
      ]
    }
  },

  // ========== BÀI 9: VIẾT CHỮ g, h, i ==========
  'tv1-tv-09': {
    id: 'tv1-tv-09',
    title: 'Viết chữ g, h, i',
    subject: 'tieng-viet',
    grade: 1,
    category: 'tap-viet',
    order: 9,
    duration: 15,
    icon: '📝',
    color: 'from-purple-400 to-pink-500',
    objectives: ['Viết đúng chữ g', 'Viết đúng chữ h', 'Viết đúng chữ i'],
    content: {
      introduction: {
        letters: ['g', 'h', 'i'],
        description: 'Học viết 3 chữ cái: g, h, i',
        image: '📝'
      },
      guide: [
        { letter: 'g', steps: ['Viết nét cong', 'Viết nét móc dưới'] },
        { letter: 'h', steps: ['Viết nét sổ cao', 'Viết nét móc'] },
        { letter: 'i', steps: ['Viết nét sổ ngắn', 'Thêm dấu chấm ở trên'] }
      ],
      practice: {
        type: 'trace',
        letters: ['g', 'h', 'i'],
        lines: 3
      },
      quiz: [
        { question: 'Chữ g có nét gì đặc biệt?', options: ['Nét móc dưới', 'Nét trên', 'Dấu chấm', 'Dấu mũ'], correctAnswer: 0, explanation: 'Chữ g có nét móc ở dưới' },
        { question: 'Chữ h cao như chữ nào?', options: ['b', 'a', 'c', 'e'], correctAnswer: 0, explanation: 'Chữ h cao như chữ b' },
        { question: 'Chữ i có gì ở trên?', options: ['Dấu chấm', 'Dấu mũ', 'Dấu trăng', 'Không có gì'], correctAnswer: 0, explanation: 'Chữ i có dấu chấm ở trên' },
        { question: 'Chữ nào đơn giản nhất?', options: ['i', 'g', 'h', 'Bằng nhau'], correctAnswer: 0, explanation: 'Chữ i đơn giản nhất' },
        { question: 'Chữ g có phần dưới đường kẻ?', options: ['Có', 'Không', 'Ít', 'Nhiều'], correctAnswer: 0, explanation: 'Chữ g có nét xuống dưới đường kẻ' }
      ]
    }
  },

  // ========== BÀI 10: VIẾT CHỮ k, l, m ==========
  'tv1-tv-10': {
    id: 'tv1-tv-10',
    title: 'Viết chữ k, l, m',
    subject: 'tieng-viet',
    grade: 1,
    category: 'tap-viet',
    order: 10,
    duration: 15,
    icon: '✍️',
    color: 'from-orange-400 to-amber-500',
    objectives: ['Viết đúng chữ k', 'Viết đúng chữ l', 'Viết đúng chữ m'],
    content: {
      introduction: {
        letters: ['k', 'l', 'm'],
        description: 'Học viết 3 chữ cái: k, l, m',
        image: '✍️'
      },
      guide: [
        { letter: 'k', steps: ['Viết nét sổ cao', 'Viết 2 nét xiên'] },
        { letter: 'l', steps: ['Viết nét sổ cao liền nét cong'] },
        { letter: 'm', steps: ['Viết 2 nét móc liên tiếp'] }
      ],
      practice: {
        type: 'trace',
        letters: ['k', 'l', 'm'],
        lines: 3
      },
      quiz: [
        { question: 'Chữ k có mấy nét xiên?', options: ['2', '1', '3', '0'], correctAnswer: 0, explanation: 'Chữ k có 2 nét xiên' },
        { question: 'Chữ l đơn giản không?', options: ['Đơn giản', 'Phức tạp', 'Rất khó', 'Trung bình'], correctAnswer: 0, explanation: 'Chữ l khá đơn giản' },
        { question: 'Chữ m có mấy nét móc?', options: ['2', '1', '3', '4'], correctAnswer: 0, explanation: 'Chữ m có 2 nét móc' },
        { question: 'Chữ nào cao nhất?', options: ['k và l', 'm', 'Bằng nhau', 'Không biết'], correctAnswer: 0, explanation: 'Chữ k và l cao hơn chữ m' },
        { question: 'Chữ m rộng hơn chữ nào?', options: ['i', 'k', 'l', 'Không có'], correctAnswer: 0, explanation: 'Chữ m rộng hơn chữ i' }
      ]
    }
  },

  // ========== BÀI 11: VIẾT CHỮ n, o, ô ==========
  'tv1-tv-11': {
    id: 'tv1-tv-11',
    title: 'Viết chữ n, o, ô',
    subject: 'tieng-viet',
    grade: 1,
    category: 'tap-viet',
    order: 11,
    duration: 15,
    icon: '🖊️',
    color: 'from-cyan-400 to-blue-500',
    objectives: ['Viết đúng chữ n', 'Viết đúng chữ o', 'Viết đúng chữ ô'],
    content: {
      introduction: {
        letters: ['n', 'o', 'ô'],
        description: 'Học viết 3 chữ cái: n, o, ô',
        image: '🖊️'
      },
      guide: [
        { letter: 'n', steps: ['Viết 1 nét móc'] },
        { letter: 'o', steps: ['Viết nét cong khép kín thành hình tròn'] },
        { letter: 'ô', steps: ['Viết chữ o', 'Thêm dấu mũ ở trên'] }
      ],
      practice: {
        type: 'trace',
        letters: ['n', 'o', 'ô'],
        lines: 3
      },
      quiz: [
        { question: 'Chữ n khác chữ m ở đâu?', options: ['Ít nét móc hơn', 'Nhiều nét móc hơn', 'Giống nhau', 'Cao hơn'], correctAnswer: 0, explanation: 'Chữ n có 1 nét móc, m có 2' },
        { question: 'Chữ o có hình gì?', options: ['Hình tròn', 'Hình vuông', 'Hình tam giác', 'Hình chữ nhật'], correctAnswer: 0, explanation: 'Chữ o hình tròn' },
        { question: 'Chữ ô khác chữ o ở đâu?', options: ['Có dấu mũ', 'Có dấu trăng', 'Có dấu móc', 'Giống nhau'], correctAnswer: 0, explanation: 'Chữ ô có dấu mũ' },
        { question: 'Viết chữ o bắt đầu từ đâu?', options: ['Bên phải', 'Bên trái', 'Ở trên', 'Ở dưới'], correctAnswer: 0, explanation: 'Bắt đầu từ bên phải' },
        { question: 'Chữ nào dễ viết nhất?', options: ['o', 'n', 'ô', 'Bằng nhau'], correctAnswer: 0, explanation: 'Chữ o chỉ cần viết tròn' }
      ]
    }
  },

  // ========== BÀI 12: VIẾT CHỮ ơ, p, q ==========
  'tv1-tv-12': {
    id: 'tv1-tv-12',
    title: 'Viết chữ ơ, p, q',
    subject: 'tieng-viet',
    grade: 1,
    category: 'tap-viet',
    order: 12,
    duration: 15,
    icon: '📖',
    color: 'from-rose-400 to-red-500',
    objectives: ['Viết đúng chữ ơ', 'Viết đúng chữ p', 'Viết đúng chữ q'],
    content: {
      introduction: {
        letters: ['ơ', 'p', 'q'],
        description: 'Học viết 3 chữ cái: ơ, p, q',
        image: '📖'
      },
      guide: [
        { letter: 'ơ', steps: ['Viết chữ o', 'Thêm dấu móc ở trên'] },
        { letter: 'p', steps: ['Viết nét sổ xuống dưới', 'Viết nét cong'] },
        { letter: 'q', steps: ['Viết nét cong', 'Viết nét sổ xuống dưới'] }
      ],
      practice: {
        type: 'trace',
        letters: ['ơ', 'p', 'q'],
        lines: 3
      },
      quiz: [
        { question: 'Chữ ơ khác chữ o ở đâu?', options: ['Có dấu móc', 'Có dấu mũ', 'Có dấu trăng', 'Giống nhau'], correctAnswer: 0, explanation: 'Chữ ơ có dấu móc' },
        { question: 'Chữ p có phần dưới đường kẻ?', options: ['Có', 'Không', 'Ít', 'Nhiều'], correctAnswer: 0, explanation: 'Chữ p có nét xuống dưới đường kẻ' },
        { question: 'Chữ q giống chữ nào?', options: ['p lật ngược', 'b', 'd', 'a'], correctAnswer: 0, explanation: 'Chữ q như chữ p lật ngược' },
        { question: 'Dấu móc của chữ ơ hình gì?', options: ['Như dấu hỏi nhỏ', 'Tam giác', 'Hình tròn', 'Đường thẳng'], correctAnswer: 0, explanation: 'Dấu móc như dấu hỏi nhỏ' },
        { question: 'Chữ nào có nét xuống dưới đường kẻ?', options: ['p và q', 'ơ', 'Tất cả', 'Không có'], correctAnswer: 0, explanation: 'Chữ p và q có nét xuống dưới' }
      ]
    }
  },

  // ========== BÀI 13: VIẾT CHỮ r, s, t ==========
  'tv1-tv-13': {
    id: 'tv1-tv-13',
    title: 'Viết chữ r, s, t',
    subject: 'tieng-viet',
    grade: 1,
    category: 'tap-viet',
    order: 13,
    duration: 15,
    icon: '📚',
    color: 'from-indigo-400 to-purple-500',
    objectives: ['Viết đúng chữ r', 'Viết đúng chữ s', 'Viết đúng chữ t'],
    content: {
      introduction: {
        letters: ['r', 's', 't'],
        description: 'Học viết 3 chữ cái: r, s, t',
        image: '📚'
      },
      guide: [
        { letter: 'r', steps: ['Viết nét sổ ngắn', 'Viết nét cong nhỏ'] },
        { letter: 's', steps: ['Viết nét cong trên', 'Viết nét cong dưới ngược lại'] },
        { letter: 't', steps: ['Viết nét sổ', 'Viết nét ngang cắt ngang'] }
      ],
      practice: {
        type: 'trace',
        letters: ['r', 's', 't'],
        lines: 3
      },
      quiz: [
        { question: 'Chữ r có mấy nét?', options: ['2 nét', '1 nét', '3 nét', '4 nét'], correctAnswer: 0, explanation: 'Chữ r có 2 nét' },
        { question: 'Chữ s có hình gì?', options: ['Như con rắn', 'Hình tròn', 'Hình vuông', 'Đường thẳng'], correctAnswer: 0, explanation: 'Chữ s uốn lượn như con rắn' },
        { question: 'Chữ t có nét ngang ở đâu?', options: ['Cắt ngang thân chữ', 'Ở trên', 'Ở dưới', 'Không có'], correctAnswer: 0, explanation: 'Nét ngang cắt ngang thân chữ t' },
        { question: 'Chữ nào khó viết nhất?', options: ['s', 'r', 't', 'Bằng nhau'], correctAnswer: 0, explanation: 'Chữ s phức tạp hơn' },
        { question: 'Chữ t cao hơn chữ nào?', options: ['r và s', 'Không chữ nào', 'Bằng nhau', 'Không biết'], correctAnswer: 0, explanation: 'Chữ t cao hơn r và s' }
      ]
    }
  },

  // ========== BÀI 14: VIẾT CHỮ u, ư, v ==========
  'tv1-tv-14': {
    id: 'tv1-tv-14',
    title: 'Viết chữ u, ư, v',
    subject: 'tieng-viet',
    grade: 1,
    category: 'tap-viet',
    order: 14,
    duration: 15,
    icon: '🖋️',
    color: 'from-teal-400 to-green-500',
    objectives: ['Viết đúng chữ u', 'Viết đúng chữ ư', 'Viết đúng chữ v'],
    content: {
      introduction: {
        letters: ['u', 'ư', 'v'],
        description: 'Học viết 3 chữ cái: u, ư, v',
        image: '🖋️'
      },
      guide: [
        { letter: 'u', steps: ['Viết nét móc ngược', 'Viết nét sổ ngắn'] },
        { letter: 'ư', steps: ['Viết chữ u', 'Thêm dấu móc ở trên'] },
        { letter: 'v', steps: ['Viết 2 nét xiên gặp nhau ở dưới'] }
      ],
      practice: {
        type: 'trace',
        letters: ['u', 'ư', 'v'],
        lines: 3
      },
      quiz: [
        { question: 'Chữ u có mấy nét?', options: ['2 nét', '1 nét', '3 nét', '4 nét'], correctAnswer: 0, explanation: 'Chữ u có 2 nét' },
        { question: 'Chữ ư khác chữ u ở đâu?', options: ['Có dấu móc', 'Có dấu mũ', 'Có dấu trăng', 'Giống nhau'], correctAnswer: 0, explanation: 'Chữ ư có dấu móc' },
        { question: 'Chữ v có hình gì?', options: ['Hình chữ V', 'Hình tròn', 'Hình vuông', 'Đường thẳng'], correctAnswer: 0, explanation: 'Chữ v có hình chữ V' },
        { question: 'Viết chữ v từ đâu?', options: ['Từ trên xuống', 'Từ dưới lên', 'Từ trái sang', 'Từ phải sang'], correctAnswer: 0, explanation: 'Viết từ trên xuống' },
        { question: 'Chữ u giống hình gì?', options: ['Hình chữ U', 'Hình tròn', 'Hình tam giác', 'Đường thẳng'], correctAnswer: 0, explanation: 'Chữ u có hình chữ U' }
      ]
    }
  },

  // ========== BÀI 15: VIẾT CHỮ x, y ==========
  'tv1-tv-15': {
    id: 'tv1-tv-15',
    title: 'Viết chữ x, y',
    subject: 'tieng-viet',
    grade: 1,
    category: 'tap-viet',
    order: 15,
    duration: 15,
    icon: '📝',
    color: 'from-yellow-400 to-orange-500',
    objectives: ['Viết đúng chữ x', 'Viết đúng chữ y', 'Ôn tập tất cả chữ cái'],
    content: {
      introduction: {
        letters: ['x', 'y'],
        description: 'Học viết 2 chữ cái cuối: x, y',
        image: '📝'
      },
      guide: [
        { letter: 'x', steps: ['Viết 2 nét xiên cắt nhau ở giữa'] },
        { letter: 'y', steps: ['Viết nét xiên', 'Viết nét móc xuống dưới'] }
      ],
      practice: {
        type: 'trace',
        letters: ['x', 'y'],
        lines: 3
      },
      quiz: [
        { question: 'Chữ x có mấy nét?', options: ['2 nét', '1 nét', '3 nét', '4 nét'], correctAnswer: 0, explanation: 'Chữ x có 2 nét xiên cắt nhau' },
        { question: 'Chữ y có phần dưới đường kẻ?', options: ['Có', 'Không', 'Ít', 'Nhiều'], correctAnswer: 0, explanation: 'Chữ y có nét móc xuống dưới đường kẻ' },
        { question: 'Chữ x có hình gì?', options: ['Hình chữ X', 'Hình tròn', 'Hình vuông', 'Hình chữ nhật'], correctAnswer: 0, explanation: 'Chữ x có hình chữ X' },
        { question: 'Chữ y còn gọi là gì?', options: ['I dài', 'I ngắn', 'U dài', 'O dài'], correctAnswer: 0, explanation: 'Chữ y còn gọi là i dài' },
        { question: 'Bảng chữ cái có bao nhiêu chữ?', options: ['29 chữ', '26 chữ', '24 chữ', '30 chữ'], correctAnswer: 0, explanation: 'Bảng chữ cái tiếng Việt có 29 chữ' }
      ]
    }
  }
};

// Export helper functions
export const getTapVietLesson = (lessonId) => {
  return TAP_VIET_LESSONS[lessonId] || null;
};

export const getTapVietLessonList = () => {
  return Object.values(TAP_VIET_LESSONS).sort((a, b) => a.order - b.order);
};
