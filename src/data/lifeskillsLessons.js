// src/data/lifeskillsLessons.js
// Kỹ năng sống - 30 bài học cho trẻ 3-10 tuổi

export const LIFESKILLS_LESSONS = {
  // =====================================================
  // LEVEL 1: AN TOÀN CÁ NHÂN (6 bài)
  // =====================================================

  'ls1-1': {
    id: 'ls1-1',
    title: 'An toàn giao thông',
    level: 1,
    icon: '🚦',
    questions: [
      {
        question: 'Khi qua đường, con nên làm gì?',
        image: '🚶',
        options: ['Chạy thật nhanh', 'Dừng lại, nhìn trái phải rồi mới đi', 'Nhắm mắt đi qua', 'Đi khi xe đang chạy'],
        answer: 1,
        explanation: 'Luôn dừng lại, nhìn trái - nhìn phải - nhìn trái lần nữa rồi mới đi qua đường.',
      },
      {
        question: 'Đèn giao thông màu đỏ có nghĩa là gì?',
        image: '🔴',
        options: ['Được đi', 'Dừng lại', 'Đi nhanh', 'Đi chậm'],
        answer: 1,
        explanation: 'Đèn đỏ nghĩa là DỪNG LẠI, không được đi.',
      },
      {
        question: 'Con nên đi bộ ở đâu?',
        image: '🛤️',
        options: ['Giữa đường', 'Trên vỉa hè', 'Đường dành cho xe', 'Bất cứ đâu'],
        answer: 1,
        explanation: 'Luôn đi trên vỉa hè để an toàn.',
      },
      {
        question: 'Khi ngồi xe máy, con phải đội gì?',
        image: '🏍️',
        options: ['Mũ vải', 'Mũ bảo hiểm', 'Không cần đội gì', 'Mũ len'],
        answer: 1,
        explanation: 'Luôn đội mũ bảo hiểm để bảo vệ đầu.',
      },
    ],
  },

  'ls1-2': {
    id: 'ls1-2',
    title: 'An toàn với người lạ',
    level: 1,
    icon: '🚫',
    questions: [
      {
        question: 'Nếu người lạ cho kẹo, con nên làm gì?',
        image: '🍬',
        options: ['Nhận và cảm ơn', 'Từ chối lịch sự, không nhận', 'Lấy và ăn ngay', 'Lấy rồi chạy đi'],
        answer: 1,
        explanation: 'Không nhận bất cứ thứ gì từ người lạ. Nói "Cháu cảm ơn, nhưng cháu không nhận đồ từ người lạ".',
      },
      {
        question: 'Người lạ rủ con đi theo, con nên làm gì?',
        image: '😰',
        options: ['Đi theo họ', 'Từ chối và chạy về chỗ có người lớn', 'Im lặng đứng đó', 'Nói chuyện với họ'],
        answer: 1,
        explanation: 'Nói "KHÔNG!", chạy ngay về chỗ có người lớn đáng tin và kể lại.',
      },
      {
        question: 'Ai là người đáng tin cậy?',
        image: '👨‍👩‍👧',
        options: ['Người lạ cho quà', 'Bố mẹ, ông bà, thầy cô', 'Người tự xưng là bạn của bố mẹ', 'Ai cũng tin được'],
        answer: 1,
        explanation: 'Chỉ tin tưởng bố mẹ, ông bà, thầy cô và người thân đã được bố mẹ giới thiệu.',
      },
      {
        question: 'Nếu bị lạc ở siêu thị, con nên tìm ai?',
        image: '🏪',
        options: ['Người lạ bất kỳ', 'Nhân viên mặc đồng phục hoặc bảo vệ', 'Tự đi tìm bố mẹ', 'Khóc thật to'],
        answer: 1,
        explanation: 'Tìm nhân viên mặc đồng phục, bảo vệ, hoặc quầy thông tin để nhờ giúp đỡ.',
      },
    ],
  },

  'ls1-3': {
    id: 'ls1-3',
    title: 'An toàn ở nhà',
    level: 1,
    icon: '🏠',
    questions: [
      {
        question: 'Con có nên chơi với ổ điện không?',
        image: '🔌',
        options: ['Có, rất vui', 'Không, rất nguy hiểm', 'Chỉ khi không có ai', 'Có thể thử'],
        answer: 1,
        explanation: 'KHÔNG BAO GIỜ chạm vào ổ điện! Điện có thể gây nguy hiểm đến tính mạng.',
      },
      {
        question: 'Dao kéo là đồ vật như thế nào?',
        image: '✂️',
        options: ['Đồ chơi vui', 'Đồ vật sắc nhọn, nguy hiểm', 'Không nguy hiểm', 'Dùng thoải mái'],
        answer: 1,
        explanation: 'Dao kéo rất sắc, có thể gây đứt tay. Chỉ người lớn mới được sử dụng.',
      },
      {
        question: 'Khi ở nhà một mình, có người gõ cửa, con nên làm gì?',
        image: '🚪',
        options: ['Mở cửa ngay', 'Không mở cửa cho người lạ', 'Hỏi họ muốn gì rồi mở', 'Ra ngoài chơi'],
        answer: 1,
        explanation: 'Không mở cửa cho người lạ. Nói rằng bố mẹ đang bận và yêu cầu quay lại sau.',
      },
      {
        question: 'Khi thấy khói hoặc lửa trong nhà, con nên làm gì?',
        image: '🔥',
        options: ['Trốn vào tủ', 'Hét to, chạy ra ngoài ngay, gọi người lớn', 'Đứng yên xem', 'Tự dập lửa'],
        answer: 1,
        explanation: 'Hét to báo mọi người, bò thấp để tránh khói, chạy ra ngoài ngay. Gọi 114.',
      },
    ],
  },

  'ls1-4': {
    id: 'ls1-4',
    title: 'Phòng cháy chữa cháy',
    level: 1,
    icon: '🧯',
    questions: [
      {
        question: 'Số điện thoại gọi cứu hỏa là bao nhiêu?',
        image: '📞',
        options: ['113', '114', '115', '116'],
        answer: 1,
        explanation: 'Số 114 là số cứu hỏa. Nhớ thuộc: 113 Công an, 114 Cứu hỏa, 115 Cấp cứu.',
      },
      {
        question: 'Khi có hỏa hoạn, con nên di chuyển thế nào?',
        image: '🏃',
        options: ['Chạy đứng thẳng', 'Bò sát mặt đất', 'Đứng yên', 'Chạy lên tầng cao'],
        answer: 1,
        explanation: 'Khói bay lên cao, nên bò sát mặt đất để tránh hít khói độc.',
      },
      {
        question: 'Con có nên nghịch lửa, diêm, bật lửa không?',
        image: '🔥',
        options: ['Có, rất vui', 'Không, rất nguy hiểm', 'Chỉ khi có bạn', 'Thỉnh thoảng được'],
        answer: 1,
        explanation: 'KHÔNG BAO GIỜ nghịch lửa. Lửa có thể gây cháy nhà và nguy hiểm tính mạng.',
      },
      {
        question: 'Thoát hiểm bằng đường nào khi cháy?',
        image: '🚪',
        options: ['Thang máy', 'Cầu thang bộ hoặc lối thoát hiểm', 'Cửa sổ tầng cao', 'Ở yên trong phòng'],
        answer: 1,
        explanation: 'Luôn đi cầu thang bộ, không dùng thang máy khi có hỏa hoạn.',
      },
    ],
  },

  'ls1-5': {
    id: 'ls1-5',
    title: 'An toàn khi chơi',
    level: 1,
    icon: '⛹️',
    questions: [
      {
        question: 'Khi chơi xích đu, con nên làm gì?',
        image: '🎢',
        options: ['Đứng trên xích đu', 'Ngồi ngay ngắn, bám chắc tay', 'Nhảy xuống khi đang đu', 'Đu thật mạnh'],
        answer: 1,
        explanation: 'Luôn ngồi ngay ngắn và bám chắc tay vịn khi chơi xích đu.',
      },
      {
        question: 'Con có nên chơi gần ao hồ khi không có người lớn?',
        image: '🏊',
        options: ['Có, nước mát lắm', 'Không, rất nguy hiểm', 'Chỉ đứng ở bờ', 'Rủ thêm bạn'],
        answer: 1,
        explanation: 'Không chơi gần nước khi không có người lớn. Nước có thể gây đuối nước.',
      },
      {
        question: 'Khi chơi đồ chơi nhỏ, con không nên làm gì?',
        image: '🧸',
        options: ['Cất gọn gàng', 'Cho vào miệng', 'Chia sẻ với bạn', 'Giữ gìn cẩn thận'],
        answer: 1,
        explanation: 'Không cho đồ chơi nhỏ vào miệng vì có thể bị hóc.',
      },
      {
        question: 'Khi chơi ngoài trời nắng, con nên làm gì?',
        image: '☀️',
        options: ['Chơi thật lâu', 'Đội mũ, uống nước, nghỉ ngơi trong bóng râm', 'Không cần mũ', 'Không uống nước'],
        answer: 1,
        explanation: 'Đội mũ, uống nhiều nước và nghỉ ngơi trong bóng râm để tránh say nắng.',
      },
    ],
  },

  'ls1-6': {
    id: 'ls1-6',
    title: 'Ôn tập an toàn',
    level: 1,
    icon: '📝',
    questions: [
      {
        question: 'Đèn đỏ nghĩa là gì?',
        image: '🚦',
        options: ['Đi được', 'Dừng lại', 'Chạy nhanh', 'Đi chậm'],
        answer: 1,
        explanation: 'Đèn đỏ = DỪNG LẠI.',
      },
      {
        question: 'Số cứu hỏa là?',
        image: '🔥',
        options: ['113', '114', '115', '119'],
        answer: 1,
        explanation: '114 là số cứu hỏa.',
      },
      {
        question: 'Con có nhận đồ từ người lạ không?',
        image: '🍭',
        options: ['Có', 'Không bao giờ', 'Nếu họ tốt', 'Khi đói'],
        answer: 1,
        explanation: 'Không bao giờ nhận đồ từ người lạ.',
      },
      {
        question: 'Khi có hỏa hoạn, đi bằng gì?',
        image: '🏢',
        options: ['Thang máy', 'Cầu thang bộ', 'Đợi trong phòng', 'Nhảy cửa sổ'],
        answer: 1,
        explanation: 'Luôn đi cầu thang bộ khi có hỏa hoạn.',
      },
    ],
  },

  // =====================================================
  // LEVEL 2: LỄ PHÉP & ỨNG XỬ (6 bài)
  // =====================================================

  'ls2-1': {
    id: 'ls2-1',
    title: 'Lễ phép với người lớn',
    level: 2,
    icon: '🙏',
    questions: [
      {
        question: 'Khi gặp người lớn, con nên nói gì?',
        image: '👋',
        options: ['Không nói gì', 'Chào ạ', 'Nhìn rồi đi', 'Chạy đi'],
        answer: 1,
        explanation: 'Luôn chào hỏi lễ phép: "Con chào ông/bà/cô/chú ạ!"',
      },
      {
        question: 'Khi nhận được quà, con nói gì?',
        image: '🎁',
        options: ['Cho con nữa', 'Con cảm ơn ạ', 'Không nói gì', 'Con không thích'],
        answer: 1,
        explanation: 'Luôn nói "Con cảm ơn ạ!" khi nhận được quà hoặc sự giúp đỡ.',
      },
      {
        question: 'Khi làm sai, con nên nói gì?',
        image: '😔',
        options: ['Không phải lỗi con', 'Con xin lỗi ạ', 'Im lặng', 'Đổ lỗi cho người khác'],
        answer: 1,
        explanation: 'Biết nhận lỗi và nói "Con xin lỗi ạ" là điều dũng cảm và đúng đắn.',
      },
      {
        question: 'Khi người lớn đang nói chuyện, con nên làm gì?',
        image: '🗣️',
        options: ['Chen vào nói', 'Chờ họ nói xong rồi mới nói', 'Hét to lên', 'Kéo tay họ'],
        answer: 1,
        explanation: 'Kiên nhẫn chờ đợi, không ngắt lời người lớn.',
      },
    ],
  },

  'ls2-2': {
    id: 'ls2-2',
    title: 'Ứng xử với bạn bè',
    level: 2,
    icon: '🤝',
    questions: [
      {
        question: 'Khi bạn cho mượn đồ chơi, con nói gì?',
        image: '🧸',
        options: ['Không nói gì', 'Cảm ơn bạn', 'Cho mình luôn đi', 'Mình không thích'],
        answer: 1,
        explanation: 'Luôn nói "Cảm ơn bạn!" khi bạn giúp đỡ hoặc chia sẻ.',
      },
      {
        question: 'Khi vô tình làm bạn đau, con nên làm gì?',
        image: '😢',
        options: ['Chạy đi', 'Xin lỗi bạn và hỏi bạn có sao không', 'Cười', 'Đổ lỗi cho bạn'],
        answer: 1,
        explanation: 'Nói "Mình xin lỗi" và quan tâm xem bạn có đau không.',
      },
      {
        question: 'Bạn bè nên đối xử với nhau thế nào?',
        image: '💕',
        options: ['Đánh nhau', 'Yêu thương và giúp đỡ nhau', 'Tranh giành đồ chơi', 'Không nói chuyện'],
        answer: 1,
        explanation: 'Bạn bè yêu thương, chia sẻ và giúp đỡ lẫn nhau.',
      },
      {
        question: 'Khi có 1 cái kẹo và 2 bạn muốn, con làm gì?',
        image: '🍬',
        options: ['Ăn một mình', 'Chia đều cho các bạn', 'Giấu đi', 'Vứt đi'],
        answer: 1,
        explanation: 'Biết chia sẻ với bạn bè là điều tốt đẹp.',
      },
    ],
  },

  'ls2-3': {
    id: 'ls2-3',
    title: 'Lịch sự nơi công cộng',
    level: 2,
    icon: '🏛️',
    questions: [
      {
        question: 'Khi xếp hàng, con nên làm gì?',
        image: '👥',
        options: ['Chen lên trước', 'Đứng xếp hàng theo thứ tự', 'Đẩy bạn ra', 'Không xếp hàng'],
        answer: 1,
        explanation: 'Xếp hàng theo thứ tự, không chen lấn.',
      },
      {
        question: 'Rác thải nên bỏ ở đâu?',
        image: '🗑️',
        options: ['Vứt ra đường', 'Bỏ vào thùng rác', 'Để trên ghế', 'Vứt xuống sông'],
        answer: 1,
        explanation: 'Luôn bỏ rác vào thùng rác, giữ gìn vệ sinh công cộng.',
      },
      {
        question: 'Ở thư viện, con nên nói chuyện thế nào?',
        image: '📚',
        options: ['Nói to', 'Nói thì thầm hoặc im lặng', 'Hét to', 'Gọi điện thoại'],
        answer: 1,
        explanation: 'Thư viện cần yên tĩnh, nói thì thầm hoặc giữ im lặng.',
      },
      {
        question: 'Trên xe buýt, thấy bà cụ đứng, con nên làm gì?',
        image: '🚌',
        options: ['Giả vờ ngủ', 'Nhường ghế cho bà', 'Nhìn ra cửa sổ', 'Không quan tâm'],
        answer: 1,
        explanation: 'Nhường ghế cho người già, phụ nữ có thai, người tàn tật.',
      },
    ],
  },

  'ls2-4': {
    id: 'ls2-4',
    title: 'Lịch sự khi ăn uống',
    level: 2,
    icon: '🍽️',
    questions: [
      {
        question: 'Trước khi ăn, con nên làm gì?',
        image: '🙌',
        options: ['Ăn ngay', 'Rửa tay sạch sẽ', 'Không cần', 'Lau tay vào quần áo'],
        answer: 1,
        explanation: 'Luôn rửa tay sạch trước khi ăn để bảo vệ sức khỏe.',
      },
      {
        question: 'Khi ăn cơm, con nên làm gì?',
        image: '🍚',
        options: ['Nói chuyện ầm ĩ', 'Ngồi ngay ngắn, nhai kỹ', 'Chơi điện thoại', 'Đứng lên chạy'],
        answer: 1,
        explanation: 'Ngồi ngay ngắn, ăn chậm, nhai kỹ và không nói khi đang có thức ăn trong miệng.',
      },
      {
        question: 'Khi muốn lấy món ở xa, con nên làm gì?',
        image: '🥢',
        options: ['Với tay qua mặt người khác', 'Nhờ người gần đó đưa giúp', 'Đứng lên lấy', 'Bò lên bàn'],
        answer: 1,
        explanation: 'Nhờ người gần món đó đưa giúp một cách lịch sự.',
      },
      {
        question: 'Sau khi ăn xong, con nên nói gì?',
        image: '😊',
        options: ['Không nói gì', 'Con cảm ơn ạ, con ăn xong rồi', 'Dở quá', 'Cho con thêm'],
        answer: 1,
        explanation: 'Cảm ơn người nấu ăn và xin phép rời bàn.',
      },
    ],
  },

  'ls2-5': {
    id: 'ls2-5',
    title: 'Nói lời hay ý đẹp',
    level: 2,
    icon: '💬',
    questions: [
      {
        question: 'Lời nói nào là lời nói đẹp?',
        image: '😊',
        options: ['Mày ngu quá', 'Bạn giỏi quá, mình ngưỡng mộ bạn', 'Tao ghét mày', 'Đồ xấu xí'],
        answer: 1,
        explanation: 'Lời nói đẹp là lời khen ngợi, động viên, làm người khác vui.',
      },
      {
        question: 'Khi bạn buồn, con nên nói gì?',
        image: '😢',
        options: ['Mặc kệ bạn', 'Bạn có sao không? Mình có thể giúp gì?', 'Cười bạn', 'Chế giễu bạn'],
        answer: 1,
        explanation: 'Quan tâm và hỏi thăm khi bạn buồn hoặc gặp khó khăn.',
      },
      {
        question: 'Con có nên nói dối không?',
        image: '🤥',
        options: ['Có, không ai biết', 'Không, nói dối là sai', 'Nói dối khi cần', 'Tùy lúc'],
        answer: 1,
        explanation: 'Không nên nói dối. Thật thà là đức tính tốt đẹp.',
      },
      {
        question: 'Khi bạn làm được việc tốt, con nên nói gì?',
        image: '🌟',
        options: ['Không nói gì', 'Bạn giỏi quá!', 'Mình làm tốt hơn', 'Có gì đâu'],
        answer: 1,
        explanation: 'Khen ngợi bạn khi họ làm tốt, điều đó làm bạn vui.',
      },
    ],
  },

  'ls2-6': {
    id: 'ls2-6',
    title: 'Ôn tập lễ phép',
    level: 2,
    icon: '📝',
    questions: [
      {
        question: 'Khi nhận quà, con nói gì?',
        image: '🎁',
        options: ['Cho con nữa', 'Cảm ơn ạ', 'Không thích', 'Im lặng'],
        answer: 1,
        explanation: 'Luôn nói "Cảm ơn ạ" khi nhận được quà.',
      },
      {
        question: 'Rác bỏ vào đâu?',
        image: '🗑️',
        options: ['Đường phố', 'Thùng rác', 'Sông', 'Vườn'],
        answer: 1,
        explanation: 'Bỏ rác vào thùng rác.',
      },
      {
        question: 'Trước khi ăn phải làm gì?',
        image: '🙌',
        options: ['Ăn ngay', 'Rửa tay', 'Chạy nhảy', 'Xem TV'],
        answer: 1,
        explanation: 'Rửa tay sạch trước khi ăn.',
      },
      {
        question: 'Thấy người già trên xe buýt, con làm gì?',
        image: '🚌',
        options: ['Ngồi yên', 'Nhường ghế', 'Ngủ', 'Nhìn ra cửa'],
        answer: 1,
        explanation: 'Nhường ghế cho người già.',
      },
    ],
  },

  // =====================================================
  // LEVEL 3: CẢM XÚC & TÂM LÝ (6 bài)
  // =====================================================

  'ls3-1': {
    id: 'ls3-1',
    title: 'Nhận biết cảm xúc',
    level: 3,
    icon: '😊',
    questions: [
      {
        question: 'Khuôn mặt này thể hiện cảm xúc gì?',
        image: '😊',
        options: ['Buồn', 'Vui', 'Sợ', 'Giận'],
        answer: 1,
        explanation: 'Mặt cười, mắt sáng là biểu hiện của niềm vui.',
      },
      {
        question: 'Khuôn mặt này thể hiện cảm xúc gì?',
        image: '😢',
        options: ['Vui', 'Buồn', 'Ngạc nhiên', 'Tức giận'],
        answer: 1,
        explanation: 'Nước mắt rơi, môi buồn là biểu hiện của sự buồn bã.',
      },
      {
        question: 'Khuôn mặt này thể hiện cảm xúc gì?',
        image: '😠',
        options: ['Vui', 'Sợ', 'Tức giận', 'Buồn'],
        answer: 2,
        explanation: 'Mày nhíu, mặt đỏ là biểu hiện của sự tức giận.',
      },
      {
        question: 'Khuôn mặt này thể hiện cảm xúc gì?',
        image: '😨',
        options: ['Vui', 'Giận', 'Buồn', 'Sợ hãi'],
        answer: 3,
        explanation: 'Mắt mở to, miệng há là biểu hiện của sự sợ hãi.',
      },
    ],
  },

  'ls3-2': {
    id: 'ls3-2',
    title: 'Khi con buồn',
    level: 3,
    icon: '😢',
    questions: [
      {
        question: 'Khi con buồn, con nên làm gì?',
        image: '😔',
        options: ['Giữ trong lòng', 'Nói với bố mẹ hoặc người thân', 'Đánh bạn', 'Phá đồ'],
        answer: 1,
        explanation: 'Chia sẻ với người thân khi buồn, họ sẽ giúp con cảm thấy tốt hơn.',
      },
      {
        question: 'Hoạt động nào giúp con bớt buồn?',
        image: '🎨',
        options: ['Ngồi một mình khóc', 'Vẽ tranh, nghe nhạc, chơi với bạn', 'Đập phá đồ đạc', 'La hét'],
        answer: 1,
        explanation: 'Vẽ tranh, nghe nhạc, hoặc chơi với bạn giúp con cảm thấy vui hơn.',
      },
      {
        question: 'Khóc khi buồn có sao không?',
        image: '😭',
        options: ['Xấu hổ lắm', 'Bình thường, ai cũng có lúc khóc', 'Chỉ con nít mới khóc', 'Không bao giờ nên khóc'],
        answer: 1,
        explanation: 'Khóc là cách thể hiện cảm xúc bình thường, ai cũng có lúc khóc.',
      },
      {
        question: 'Khi bạn buồn, con nên làm gì?',
        image: '🤗',
        options: ['Chế giễu bạn', 'An ủi và ở bên cạnh bạn', 'Bỏ đi', 'Cười'],
        answer: 1,
        explanation: 'Ở bên cạnh và an ủi bạn khi họ buồn.',
      },
    ],
  },

  'ls3-3': {
    id: 'ls3-3',
    title: 'Khi con giận',
    level: 3,
    icon: '😤',
    questions: [
      {
        question: 'Khi con tức giận, con nên làm gì?',
        image: '😤',
        options: ['Đánh bạn', 'Hít thở sâu, bình tĩnh lại', 'La hét', 'Đập phá đồ'],
        answer: 1,
        explanation: 'Hít thở sâu, đếm từ 1 đến 10, giúp con bình tĩnh lại.',
      },
      {
        question: 'Khi tức giận, đánh bạn có đúng không?',
        image: '👊',
        options: ['Đúng, để bạn sợ', 'Sai, không nên đánh bạn', 'Tùy lúc', 'Đánh nhẹ được'],
        answer: 1,
        explanation: 'Không bao giờ đánh bạn. Dùng lời nói để giải quyết.',
      },
      {
        question: 'Thay vì đánh bạn, con nên làm gì?',
        image: '🗣️',
        options: ['Im lặng mãi mãi', 'Nói với bạn: "Mình không thích điều đó"', 'Trả thù sau', 'Khóc'],
        answer: 1,
        explanation: 'Dùng lời nói để bày tỏ cảm xúc thay vì hành động bạo lực.',
      },
      {
        question: 'Làm gì để hết giận?',
        image: '🧘',
        options: ['Hét to hơn', 'Hít thở sâu, đi bộ, uống nước', 'Đập vỡ đồ', 'Không làm gì'],
        answer: 1,
        explanation: 'Hít thở sâu, đi bộ, uống nước, hoặc nói chuyện với người lớn.',
      },
    ],
  },

  'ls3-4': {
    id: 'ls3-4',
    title: 'Sự tự tin',
    level: 3,
    icon: '💪',
    questions: [
      {
        question: 'Tự tin là gì?',
        image: '😎',
        options: ['Kiêu ngạo', 'Tin vào khả năng của mình', 'Chê bai người khác', 'Làm mọi thứ một mình'],
        answer: 1,
        explanation: 'Tự tin là tin vào bản thân, dám thử sức và không sợ thất bại.',
      },
      {
        question: 'Khi sợ nói trước lớp, con nên làm gì?',
        image: '🎤',
        options: ['Không bao giờ nói', 'Hít thở sâu, chuẩn bị kỹ, và thử sức', 'Khóc', 'Bỏ về'],
        answer: 1,
        explanation: 'Chuẩn bị kỹ, hít thở sâu và dũng cảm thử sức. Ai cũng từng sợ lần đầu!',
      },
      {
        question: 'Khi làm sai, con nên nghĩ gì?',
        image: '🤔',
        options: ['Mình dở quá', 'Mình sẽ học từ sai lầm và làm tốt hơn', 'Không làm nữa', 'Đổ lỗi cho người khác'],
        answer: 1,
        explanation: 'Sai lầm là bài học quý giá, giúp con tiến bộ.',
      },
      {
        question: 'Làm gì để tự tin hơn?',
        image: '⭐',
        options: ['Chê bai người khác', 'Luyện tập, cố gắng mỗi ngày', 'So sánh với bạn', 'Không cần làm gì'],
        answer: 1,
        explanation: 'Luyện tập và cố gắng mỗi ngày giúp con tự tin hơn.',
      },
    ],
  },

  'ls3-5': {
    id: 'ls3-5',
    title: 'Yêu thương bản thân',
    level: 3,
    icon: '💖',
    questions: [
      {
        question: 'Con có cần yêu bản thân không?',
        image: '❤️',
        options: ['Không, đó là ích kỷ', 'Có, yêu bản thân rất quan trọng', 'Chỉ yêu người khác', 'Không biết'],
        answer: 1,
        explanation: 'Yêu bản thân là bước đầu để yêu thương người khác.',
      },
      {
        question: 'Con là người như thế nào?',
        image: '🌟',
        options: ['Dở tệ', 'Đặc biệt và có giá trị', 'Không bằng ai', 'Bình thường'],
        answer: 1,
        explanation: 'Mỗi người đều đặc biệt và có giá trị riêng.',
      },
      {
        question: 'Khi bạn chê cười con, con nên nghĩ gì?',
        image: '😌',
        options: ['Mình thật tệ', 'Mình vẫn ổn, mỗi người một khác', 'Mình phải thay đổi', 'Khóc'],
        answer: 1,
        explanation: 'Mỗi người là duy nhất, không cần giống ai. Con vẫn rất tuyệt!',
      },
      {
        question: 'Chăm sóc bản thân là làm gì?',
        image: '🛁',
        options: ['Không cần làm gì', 'Ăn uống đủ, ngủ đủ, vui chơi lành mạnh', 'Chỉ chơi game', 'Ăn nhiều kẹo'],
        answer: 1,
        explanation: 'Ăn uống đủ chất, ngủ đủ giấc, và vận động mỗi ngày.',
      },
    ],
  },

  'ls3-6': {
    id: 'ls3-6',
    title: 'Ôn tập cảm xúc',
    level: 3,
    icon: '📝',
    questions: [
      {
        question: 'Mặt 😊 thể hiện cảm xúc gì?',
        image: '😊',
        options: ['Buồn', 'Vui', 'Giận', 'Sợ'],
        answer: 1,
        explanation: 'Mặt cười thể hiện niềm vui.',
      },
      {
        question: 'Khi buồn nên làm gì?',
        image: '😢',
        options: ['Giữ một mình', 'Nói với người thân', 'Đánh bạn', 'Phá đồ'],
        answer: 1,
        explanation: 'Chia sẻ với người thân khi buồn.',
      },
      {
        question: 'Khi giận nên làm gì?',
        image: '😤',
        options: ['Đánh', 'Hít thở sâu, bình tĩnh', 'Hét', 'Phá đồ'],
        answer: 1,
        explanation: 'Hít thở sâu để bình tĩnh lại.',
      },
      {
        question: 'Con là người thế nào?',
        image: '🌟',
        options: ['Tệ hại', 'Đặc biệt và có giá trị', 'Không bằng ai', 'Vô dụng'],
        answer: 1,
        explanation: 'Mỗi người đều đặc biệt và có giá trị riêng.',
      },
    ],
  },

  // =====================================================
  // LEVEL 4: TỰ LẬP & TRÁCH NHIỆM (6 bài)
  // =====================================================

  'ls4-1': {
    id: 'ls4-1',
    title: 'Tự chăm sóc bản thân',
    level: 4,
    icon: '🧹',
    questions: [
      {
        question: 'Sáng thức dậy, con nên làm gì đầu tiên?',
        image: '🌅',
        options: ['Xem TV', 'Đánh răng, rửa mặt', 'Chơi game', 'Ăn sáng luôn'],
        answer: 1,
        explanation: 'Đánh răng và rửa mặt sạch sẽ sau khi thức dậy.',
      },
      {
        question: 'Con có tự gấp quần áo được không?',
        image: '👕',
        options: ['Không, mẹ làm', 'Có, con tự gấp được', 'Khó lắm', 'Để lung tung'],
        answer: 1,
        explanation: 'Con hoàn toàn có thể tự gấp quần áo của mình.',
      },
      {
        question: 'Sau khi chơi xong đồ chơi, con nên làm gì?',
        image: '🧸',
        options: ['Để đó', 'Cất gọn vào đúng chỗ', 'Vứt lung tung', 'Nhờ mẹ dọn'],
        answer: 1,
        explanation: 'Cất đồ chơi gọn gàng sau khi chơi xong.',
      },
      {
        question: 'Con có nên tự buộc dây giày không?',
        image: '👟',
        options: ['Không, mẹ buộc', 'Có, tập tự buộc', 'Không cần buộc', 'Mang dép'],
        answer: 1,
        explanation: 'Học cách tự buộc dây giày là kỹ năng quan trọng.',
      },
    ],
  },

  'ls4-2': {
    id: 'ls4-2',
    title: 'Giúp đỡ gia đình',
    level: 4,
    icon: '🏠',
    questions: [
      {
        question: 'Con có thể giúp mẹ việc gì?',
        image: '🧹',
        options: ['Không làm gì', 'Quét nhà, dọn bàn, phơi quần áo', 'Chỉ chơi', 'Xem TV'],
        answer: 1,
        explanation: 'Con có thể giúp nhiều việc nhà nhẹ nhàng.',
      },
      {
        question: 'Sau khi ăn cơm, con nên làm gì?',
        image: '🍽️',
        options: ['Đi chơi ngay', 'Mang bát đĩa ra bồn rửa', 'Để mẹ dọn', 'Không quan tâm'],
        answer: 1,
        explanation: 'Tự mang bát đĩa của mình ra bồn rửa.',
      },
      {
        question: 'Giúp đỡ gia đình có tốt không?',
        image: '👨‍👩‍👧',
        options: ['Mất thời gian chơi', 'Rất tốt, thể hiện yêu thương', 'Không cần', 'Chỉ người lớn làm'],
        answer: 1,
        explanation: 'Giúp đỡ gia đình thể hiện tình yêu thương.',
      },
      {
        question: 'Con có thể tự tưới cây không?',
        image: '🌱',
        options: ['Không biết', 'Có, con tưới được', 'Cây tự sống', 'Không thích'],
        answer: 1,
        explanation: 'Tưới cây là việc con có thể giúp được.',
      },
    ],
  },

  'ls4-3': {
    id: 'ls4-3',
    title: 'Quản lý thời gian',
    level: 4,
    icon: '⏰',
    questions: [
      {
        question: 'Mỗi ngày con nên ngủ đủ mấy tiếng?',
        image: '😴',
        options: ['3-4 tiếng', '9-11 tiếng', '5 tiếng', 'Thức khuya được'],
        answer: 1,
        explanation: 'Trẻ em cần ngủ 9-11 tiếng mỗi đêm.',
      },
      {
        question: 'Thời gian nào để học, thời gian nào để chơi?',
        image: '📚',
        options: ['Chơi cả ngày', 'Học xong mới chơi', 'Không cần học', 'Làm gì cũng được'],
        answer: 1,
        explanation: 'Hoàn thành bài học trước, sau đó mới chơi.',
      },
      {
        question: 'Xem TV, chơi game bao lâu mỗi ngày?',
        image: '📺',
        options: ['Cả ngày', 'Giới hạn 1-2 tiếng', '5 tiếng', 'Không giới hạn'],
        answer: 1,
        explanation: 'Nên giới hạn thời gian xem màn hình khoảng 1-2 tiếng/ngày.',
      },
      {
        question: 'Buổi tối con nên làm gì?',
        image: '🌙',
        options: ['Thức khuya chơi game', 'Ăn tối, học bài, đi ngủ đúng giờ', 'Xem TV đến khuya', 'Không cần ngủ sớm'],
        answer: 1,
        explanation: 'Buổi tối nên ăn tối, học bài và đi ngủ đúng giờ.',
      },
    ],
  },

  'ls4-4': {
    id: 'ls4-4',
    title: 'Bảo vệ môi trường',
    level: 4,
    icon: '🌍',
    questions: [
      {
        question: 'Cách nào tiết kiệm điện?',
        image: '💡',
        options: ['Bật đèn cả ngày', 'Tắt đèn khi ra khỏi phòng', 'Mở điều hòa to', 'Không quan tâm'],
        answer: 1,
        explanation: 'Tắt đèn và thiết bị điện khi không sử dụng.',
      },
      {
        question: 'Cách nào tiết kiệm nước?',
        image: '💧',
        options: ['Xả nước cả ngày', 'Khóa vòi khi không dùng', 'Rửa tay lâu', 'Tắm thật lâu'],
        answer: 1,
        explanation: 'Khóa vòi nước khi đánh răng, rửa mặt, không lãng phí nước.',
      },
      {
        question: 'Túi nhựa có hại gì?',
        image: '🛍️',
        options: ['Không hại gì', 'Gây ô nhiễm môi trường', 'Rất tốt', 'Cần dùng nhiều'],
        answer: 1,
        explanation: 'Túi nhựa gây ô nhiễm, nên dùng túi vải thay thế.',
      },
      {
        question: 'Cây xanh giúp gì cho môi trường?',
        image: '🌳',
        options: ['Không giúp gì', 'Tạo oxy, làm mát, bảo vệ đất', 'Gây bẩn', 'Tốn chỗ'],
        answer: 1,
        explanation: 'Cây xanh tạo oxy, làm mát và bảo vệ đất.',
      },
    ],
  },

  'ls4-5': {
    id: 'ls4-5',
    title: 'Tiết kiệm và chia sẻ',
    level: 4,
    icon: '💰',
    questions: [
      {
        question: 'Khi được cho tiền, con nên làm gì?',
        image: '💵',
        options: ['Tiêu hết ngay', 'Bỏ ống heo tiết kiệm', 'Mua kẹo', 'Cho bạn'],
        answer: 1,
        explanation: 'Học cách tiết kiệm tiền từ nhỏ là thói quen tốt.',
      },
      {
        question: 'Đồ ăn dư, con nên làm gì?',
        image: '🍚',
        options: ['Vứt đi', 'Không lấy dư, ăn hết', 'Để thiu', 'Không quan tâm'],
        answer: 1,
        explanation: 'Chỉ lấy vừa đủ ăn, không lãng phí thức ăn.',
      },
      {
        question: 'Con có nên chia sẻ với bạn nghèo không?',
        image: '🤝',
        options: ['Không', 'Có, chia sẻ đồ chơi, sách vở', 'Mình không dư', 'Không quan tâm'],
        answer: 1,
        explanation: 'Chia sẻ với người khó khăn hơn là điều tốt đẹp.',
      },
      {
        question: 'Đồ chơi cũ có thể làm gì?',
        image: '🧸',
        options: ['Vứt đi', 'Tặng bạn hoặc quyên góp', 'Để đó', 'Phá hỏng'],
        answer: 1,
        explanation: 'Đồ chơi cũ có thể tặng cho bạn hoặc quyên góp cho trẻ em nghèo.',
      },
    ],
  },

  'ls4-6': {
    id: 'ls4-6',
    title: 'Ôn tập tự lập',
    level: 4,
    icon: '📝',
    questions: [
      {
        question: 'Sáng thức dậy nên làm gì?',
        image: '🌅',
        options: ['Chơi game', 'Đánh răng, rửa mặt', 'Ngủ tiếp', 'Xem TV'],
        answer: 1,
        explanation: 'Đánh răng và rửa mặt mỗi sáng.',
      },
      {
        question: 'Mỗi ngày nên ngủ mấy tiếng?',
        image: '😴',
        options: ['3 tiếng', '9-11 tiếng', '5 tiếng', '15 tiếng'],
        answer: 1,
        explanation: 'Trẻ em cần ngủ 9-11 tiếng/đêm.',
      },
      {
        question: 'Tiết kiệm điện là?',
        image: '💡',
        options: ['Bật cả ngày', 'Tắt khi không dùng', 'Mở to', 'Không quan tâm'],
        answer: 1,
        explanation: 'Tắt điện khi không sử dụng.',
      },
      {
        question: 'Đồ chơi cũ nên làm gì?',
        image: '🧸',
        options: ['Vứt', 'Tặng bạn hoặc quyên góp', 'Phá', 'Để đó'],
        answer: 1,
        explanation: 'Tặng hoặc quyên góp đồ chơi cũ.',
      },
    ],
  },
};

// Lấy bài học theo ID
export const getLifeSkillsLesson = (lessonId) => LIFESKILLS_LESSONS[lessonId];

// Lấy tất cả bài học
export const getAllLifeSkillsLessons = () => Object.values(LIFESKILLS_LESSONS);

// Lấy bài học theo level
export const getLifeSkillsLessonsByLevel = (level) =>
  Object.values(LIFESKILLS_LESSONS).filter((lesson) => lesson.level === level);

export default LIFESKILLS_LESSONS;
