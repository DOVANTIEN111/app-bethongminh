// src/data/scienceLessons.js
// Khoa Học - 22 bài học cho trẻ 3-10 tuổi

export const SCIENCE_LESSONS = {
  // =====================================================
  // LEVEL 1: THẾ GIỚI ĐỘNG VẬT (6 bài)
  // =====================================================

  's1-1': {
    id: 's1-1',
    title: 'Con vật nuôi',
    level: 1,
    icon: '🐕',
    questions: [
      {
        question: 'Con vật nào hay sủa gâu gâu?',
        image: '🐕',
        options: ['Con chó', 'Con mèo', 'Con gà', 'Con vịt'],
        answer: 0,
        explanation: 'Con chó kêu gâu gâu và là bạn thân của con người.',
      },
      {
        question: 'Con mèo thích ăn gì nhất?',
        image: '🐱',
        options: ['Cơm', 'Cá', 'Rau', 'Hoa quả'],
        answer: 1,
        explanation: 'Mèo rất thích ăn cá vì cá có protein và mùi hấp dẫn.',
      },
      {
        question: 'Buổi sáng con gì thường gáy?',
        image: '🐓',
        options: ['Con vịt', 'Con chó', 'Con gà trống', 'Con mèo'],
        answer: 2,
        explanation: 'Gà trống gáy ò ó o mỗi buổi sáng để báo thức.',
      },
      {
        question: 'Con vịt biết làm gì mà gà không biết?',
        image: '🦆',
        options: ['Bay cao', 'Bơi nước', 'Leo cây', 'Chạy nhanh'],
        answer: 1,
        explanation: 'Vịt có chân màng nên bơi được, còn gà thì không.',
      },
    ],
  },

  's1-2': {
    id: 's1-2',
    title: 'Con vật hoang dã',
    level: 1,
    icon: '🦁',
    questions: [
      {
        question: 'Con vật nào được gọi là "Vua của rừng xanh"?',
        image: '🦁',
        options: ['Hổ', 'Sư tử', 'Gấu', 'Voi'],
        answer: 1,
        explanation: 'Sư tử được gọi là Vua của rừng vì bờm hùng vĩ như vương miện.',
      },
      {
        question: 'Con voi dùng gì để uống nước?',
        image: '🐘',
        options: ['Miệng', 'Vòi', 'Tai', 'Chân'],
        answer: 1,
        explanation: 'Voi dùng vòi dài để hút nước rồi phun vào miệng.',
      },
      {
        question: 'Con hổ có lông màu gì?',
        image: '🐅',
        options: ['Đen trắng', 'Vàng sọc đen', 'Nâu', 'Xám'],
        answer: 1,
        explanation: 'Hổ có lông vàng với các sọc đen, giúp ngụy trang trong rừng.',
      },
      {
        question: 'Con khỉ thích ăn gì nhất?',
        image: '🐒',
        options: ['Thịt', 'Chuối', 'Cá', 'Rau'],
        answer: 1,
        explanation: 'Khỉ rất thích ăn chuối và các loại hoa quả.',
      },
    ],
  },

  's1-3': {
    id: 's1-3',
    title: 'Con vật dưới nước',
    level: 1,
    icon: '🐟',
    questions: [
      {
        question: 'Cá thở bằng gì?',
        image: '🐟',
        options: ['Mũi', 'Mang', 'Miệng', 'Da'],
        answer: 1,
        explanation: 'Cá có mang để lấy oxy từ nước để thở.',
      },
      {
        question: 'Con vật nào có 8 cái chân?',
        image: '🐙',
        options: ['Cá', 'Cua', 'Bạch tuộc', 'Tôm'],
        answer: 2,
        explanation: 'Bạch tuộc có 8 cái xúc tu (giống như tay chân).',
      },
      {
        question: 'Cá heo sống ở đâu?',
        image: '🐬',
        options: ['Sông', 'Ao', 'Biển', 'Hồ'],
        answer: 2,
        explanation: 'Cá heo sống ở biển và rất thông minh, thân thiện.',
      },
      {
        question: 'Con cua có mấy cái càng?',
        image: '🦀',
        options: ['1 cái', '2 cái', '4 cái', '6 cái'],
        answer: 1,
        explanation: 'Con cua có 2 cái càng lớn để tự vệ và bắt mồi.',
      },
    ],
  },

  's1-4': {
    id: 's1-4',
    title: 'Côn trùng',
    level: 1,
    icon: '🦋',
    questions: [
      {
        question: 'Con bướm trước khi đẹp thì là con gì?',
        image: '🐛',
        options: ['Con kiến', 'Con sâu', 'Con ruồi', 'Con ong'],
        answer: 1,
        explanation: 'Con sâu sẽ biến thành kén, rồi nở ra thành bướm đẹp.',
      },
      {
        question: 'Con ong làm ra gì?',
        image: '🐝',
        options: ['Sữa', 'Mật ong', 'Đường', 'Nước'],
        answer: 1,
        explanation: 'Ong hút mật hoa và làm ra mật ong ngọt lịm.',
      },
      {
        question: 'Con kiến sống như thế nào?',
        image: '🐜',
        options: ['Một mình', 'Theo đàn', 'Theo cặp', 'Với người'],
        answer: 1,
        explanation: 'Kiến sống theo đàn, cùng nhau xây tổ và tìm thức ăn.',
      },
      {
        question: 'Con vật nào phát sáng ban đêm?',
        image: '🪲',
        options: ['Con ruồi', 'Con đom đóm', 'Con kiến', 'Con bướm'],
        answer: 1,
        explanation: 'Đom đóm có bụng phát sáng, làm đẹp ban đêm.',
      },
    ],
  },

  's1-5': {
    id: 's1-5',
    title: 'Chim chóc',
    level: 1,
    icon: '🐦',
    questions: [
      {
        question: 'Chim dùng gì để bay?',
        image: '🐦',
        options: ['Chân', 'Cánh', 'Đuôi', 'Mỏ'],
        answer: 1,
        explanation: 'Chim có đôi cánh với lông vũ để bay lượn trên trời.',
      },
      {
        question: 'Con chim nào biết nói?',
        image: '🦜',
        options: ['Chim sẻ', 'Chim bồ câu', 'Con vẹt', 'Con cú'],
        answer: 2,
        explanation: 'Vẹt có thể học nói theo tiếng người rất giỏi.',
      },
      {
        question: 'Con chim cánh cụt sống ở đâu?',
        image: '🐧',
        options: ['Rừng nhiệt đới', 'Sa mạc', 'Nơi lạnh', 'Núi cao'],
        answer: 2,
        explanation: 'Chim cánh cụt sống ở nơi lạnh như Nam Cực.',
      },
      {
        question: 'Con cú hoạt động khi nào?',
        image: '🦉',
        options: ['Ban ngày', 'Ban đêm', 'Cả ngày', 'Không bao giờ'],
        answer: 1,
        explanation: 'Cú là chim săn mồi ban đêm với mắt nhìn rất tốt.',
      },
    ],
  },

  's1-6': {
    id: 's1-6',
    title: 'Ôn tập động vật',
    level: 1,
    icon: '📝',
    questions: [
      {
        question: 'Con vật nào sống dưới nước?',
        image: '🌊',
        options: ['Chó', 'Mèo', 'Cá', 'Gà'],
        answer: 2,
        explanation: 'Cá sống dưới nước và thở bằng mang.',
      },
      {
        question: 'Con vật nào có vòi dài?',
        image: '🐘',
        options: ['Hổ', 'Voi', 'Sư tử', 'Khỉ'],
        answer: 1,
        explanation: 'Voi có cái vòi dài để hút nước và bắt thức ăn.',
      },
      {
        question: 'Con côn trùng nào làm mật?',
        image: '🍯',
        options: ['Kiến', 'Ong', 'Bướm', 'Ruồi'],
        answer: 1,
        explanation: 'Ong siêng năng làm ra mật ong từ mật hoa.',
      },
      {
        question: 'Con chim nào không biết bay?',
        image: '🐧',
        options: ['Vẹt', 'Đại bàng', 'Cánh cụt', 'Cú'],
        answer: 2,
        explanation: 'Chim cánh cụt có cánh nhưng chỉ để bơi, không bay được.',
      },
    ],
  },

  // =====================================================
  // LEVEL 2: THỰC VẬT & MÔI TRƯỜNG (6 bài)
  // =====================================================

  's2-1': {
    id: 's2-1',
    title: 'Cây cối',
    level: 2,
    icon: '🌳',
    questions: [
      {
        question: 'Cây hút nước từ đâu?',
        image: '🌳',
        options: ['Lá', 'Hoa', 'Rễ', 'Thân'],
        answer: 2,
        explanation: 'Rễ cây mọc sâu xuống đất để hút nước và chất dinh dưỡng.',
      },
      {
        question: 'Lá cây có màu gì?',
        image: '🍃',
        options: ['Đỏ', 'Xanh lá', 'Vàng', 'Trắng'],
        answer: 1,
        explanation: 'Lá cây thường có màu xanh vì có chất diệp lục.',
      },
      {
        question: 'Hoa dùng để làm gì?',
        image: '🌸',
        options: ['Hút nước', 'Làm đẹp', 'Tạo quả và hạt', 'Che nắng'],
        answer: 2,
        explanation: 'Hoa giúp cây sinh sản, tạo ra quả và hạt giống.',
      },
      {
        question: 'Cây cần gì để sống?',
        image: '☀️',
        options: ['Tivi', 'Ánh sáng, nước, không khí', 'Điện', 'Bánh kẹo'],
        answer: 1,
        explanation: 'Cây cần ánh sáng mặt trời, nước và không khí để sống.',
      },
    ],
  },

  's2-2': {
    id: 's2-2',
    title: 'Hoa quả',
    level: 2,
    icon: '🍎',
    questions: [
      {
        question: 'Quả táo có vị gì?',
        image: '🍎',
        options: ['Chua', 'Ngọt và giòn', 'Đắng', 'Mặn'],
        answer: 1,
        explanation: 'Táo có vị ngọt, giòn và rất tốt cho sức khỏe.',
      },
      {
        question: 'Quả chuối có hình gì?',
        image: '🍌',
        options: ['Tròn', 'Cong', 'Vuông', 'Tam giác'],
        answer: 1,
        explanation: 'Quả chuối có hình cong như mặt trăng khuyết.',
      },
      {
        question: 'Vitamin C có nhiều trong quả nào?',
        image: '🍊',
        options: ['Chuối', 'Cam', 'Nho', 'Táo'],
        answer: 1,
        explanation: 'Cam chứa rất nhiều vitamin C giúp khỏe mạnh.',
      },
      {
        question: 'Quả dưa hấu bên trong màu gì?',
        image: '🍉',
        options: ['Xanh', 'Vàng', 'Đỏ', 'Trắng'],
        answer: 2,
        explanation: 'Dưa hấu có ruột đỏ ngọt và nhiều nước.',
      },
    ],
  },

  's2-3': {
    id: 's2-3',
    title: 'Thời tiết',
    level: 2,
    icon: '🌤️',
    questions: [
      {
        question: 'Mây được tạo từ gì?',
        image: '☁️',
        options: ['Bông', 'Hơi nước', 'Khói', 'Bụi'],
        answer: 1,
        explanation: 'Mây được tạo từ hơi nước bay lên cao rồi ngưng tụ.',
      },
      {
        question: 'Cầu vồng có mấy màu?',
        image: '🌈',
        options: ['5 màu', '6 màu', '7 màu', '8 màu'],
        answer: 2,
        explanation: 'Cầu vồng có 7 màu: đỏ, cam, vàng, lục, lam, chàm, tím.',
      },
      {
        question: 'Mưa rơi từ đâu?',
        image: '🌧️',
        options: ['Mặt đất', 'Cây cối', 'Mây', 'Núi'],
        answer: 2,
        explanation: 'Khi mây chứa nhiều nước, nước sẽ rơi xuống thành mưa.',
      },
      {
        question: 'Tuyết rơi khi nào?',
        image: '❄️',
        options: ['Mùa hè', 'Khi trời rất lạnh', 'Khi trời nóng', 'Mùa thu'],
        answer: 1,
        explanation: 'Tuyết rơi khi trời rất lạnh, nước đóng băng thành bông tuyết.',
      },
    ],
  },

  's2-4': {
    id: 's2-4',
    title: 'Mùa trong năm',
    level: 2,
    icon: '🍂',
    questions: [
      {
        question: 'Một năm có mấy mùa?',
        image: '📅',
        options: ['2 mùa', '3 mùa', '4 mùa', '5 mùa'],
        answer: 2,
        explanation: 'Một năm có 4 mùa: Xuân, Hạ, Thu, Đông.',
      },
      {
        question: 'Mùa nào hoa nở nhiều nhất?',
        image: '🌸',
        options: ['Mùa đông', 'Mùa xuân', 'Mùa thu', 'Mùa hạ'],
        answer: 1,
        explanation: 'Mùa xuân ấm áp, hoa nở rực rỡ khắp nơi.',
      },
      {
        question: 'Mùa nào trời nóng nhất?',
        image: '☀️',
        options: ['Mùa xuân', 'Mùa hạ', 'Mùa thu', 'Mùa đông'],
        answer: 1,
        explanation: 'Mùa hạ (mùa hè) có nắng nóng nhất trong năm.',
      },
      {
        question: 'Mùa thu lá cây chuyển màu gì?',
        image: '🍂',
        options: ['Xanh', 'Vàng, đỏ', 'Tím', 'Trắng'],
        answer: 1,
        explanation: 'Mùa thu lá cây đổi màu vàng, đỏ rồi rụng.',
      },
    ],
  },

  's2-5': {
    id: 's2-5',
    title: 'Bảo vệ môi trường',
    level: 2,
    icon: '♻️',
    questions: [
      {
        question: 'Rác thải nên bỏ ở đâu?',
        image: '🗑️',
        options: ['Ra đường', 'Xuống sông', 'Thùng rác', 'Cửa nhà hàng xóm'],
        answer: 2,
        explanation: 'Bỏ rác đúng nơi giúp môi trường sạch đẹp.',
      },
      {
        question: 'Tại sao cần trồng cây xanh?',
        image: '🌱',
        options: ['Để bán', 'Cho không khí trong lành', 'Để chơi', 'Không lý do'],
        answer: 1,
        explanation: 'Cây xanh tạo ra oxy và làm không khí trong lành.',
      },
      {
        question: 'Tiết kiệm nước là?',
        image: '💧',
        options: ['Dùng ít nước đi', 'Uống ít nước', 'Không tắm', 'Dùng nhiều nước'],
        answer: 0,
        explanation: 'Chỉ dùng nước khi cần, tắt vòi khi không dùng.',
      },
      {
        question: 'Tái chế là gì?',
        image: '♻️',
        options: ['Vứt đi', 'Làm mới từ đồ cũ', 'Mua mới', 'Đốt rác'],
        answer: 1,
        explanation: 'Tái chế là biến đồ cũ thành đồ mới để dùng lại.',
      },
    ],
  },

  's2-6': {
    id: 's2-6',
    title: 'Ôn tập thực vật',
    level: 2,
    icon: '📝',
    questions: [
      {
        question: 'Bộ phận nào hút nước cho cây?',
        image: '🌳',
        options: ['Lá', 'Hoa', 'Rễ', 'Quả'],
        answer: 2,
        explanation: 'Rễ cây hút nước và chất dinh dưỡng từ đất.',
      },
      {
        question: 'Mây tạo thành từ?',
        image: '☁️',
        options: ['Bông gòn', 'Hơi nước', 'Khói', 'Bụi đất'],
        answer: 1,
        explanation: 'Hơi nước bay lên ngưng tụ thành mây.',
      },
      {
        question: 'Rác thải đúng nơi có tác dụng gì?',
        image: '🌍',
        options: ['Làm bẩn', 'Bảo vệ môi trường', 'Gây ô nhiễm', 'Không có tác dụng'],
        answer: 1,
        explanation: 'Bỏ rác đúng nơi giúp bảo vệ môi trường sạch đẹp.',
      },
      {
        question: 'Mùa nào cây rụng lá?',
        image: '🍂',
        options: ['Xuân', 'Hạ', 'Thu', 'Cả năm'],
        answer: 2,
        explanation: 'Mùa thu lá cây đổi màu vàng đỏ và rụng.',
      },
    ],
  },

  // =====================================================
  // LEVEL 3: CƠ THỂ NGƯỜI (5 bài)
  // =====================================================

  's3-1': {
    id: 's3-1',
    title: 'Các bộ phận cơ thể',
    level: 3,
    icon: '👤',
    questions: [
      {
        question: 'Chúng ta nhìn bằng gì?',
        image: '👀',
        options: ['Tai', 'Mũi', 'Mắt', 'Miệng'],
        answer: 2,
        explanation: 'Mắt giúp chúng ta nhìn thấy mọi thứ xung quanh.',
      },
      {
        question: 'Tim nằm ở đâu?',
        image: '❤️',
        options: ['Trong đầu', 'Trong ngực', 'Trong bụng', 'Trong tay'],
        answer: 1,
        explanation: 'Tim nằm trong lồng ngực, bơm máu đi khắp cơ thể.',
      },
      {
        question: 'Chúng ta có mấy ngón tay?',
        image: '✋',
        options: ['5 ngón', '8 ngón', '10 ngón', '12 ngón'],
        answer: 2,
        explanation: 'Mỗi bàn tay có 5 ngón, tổng cộng 10 ngón tay.',
      },
      {
        question: 'Não bộ nằm ở đâu?',
        image: '🧠',
        options: ['Trong bụng', 'Trong đầu', 'Trong ngực', 'Trong chân'],
        answer: 1,
        explanation: 'Não nằm trong đầu, điều khiển mọi hoạt động của cơ thể.',
      },
    ],
  },

  's3-2': {
    id: 's3-2',
    title: '5 giác quan',
    level: 3,
    icon: '👁️',
    questions: [
      {
        question: 'Để nghe nhạc, ta dùng giác quan nào?',
        image: '👂',
        options: ['Thị giác', 'Thính giác', 'Khứu giác', 'Vị giác'],
        answer: 1,
        explanation: 'Tai là cơ quan của thính giác, giúp ta nghe âm thanh.',
      },
      {
        question: 'Giác quan nào giúp ta ngửi mùi?',
        image: '👃',
        options: ['Thị giác', 'Vị giác', 'Khứu giác', 'Xúc giác'],
        answer: 2,
        explanation: 'Mũi là cơ quan khứu giác, giúp ngửi mùi thơm hay hôi.',
      },
      {
        question: 'Lưỡi giúp ta cảm nhận?',
        image: '👅',
        options: ['Màu sắc', 'Âm thanh', 'Mùi hương', 'Vị thức ăn'],
        answer: 3,
        explanation: 'Lưỡi là cơ quan vị giác, nếm được chua, cay, mặn, ngọt.',
      },
      {
        question: 'Xúc giác là gì?',
        image: '✋',
        options: ['Nghe', 'Nhìn', 'Sờ - cảm nhận', 'Ngửi'],
        answer: 2,
        explanation: 'Da giúp ta cảm nhận nóng, lạnh, mềm, cứng khi chạm.',
      },
    ],
  },

  's3-3': {
    id: 's3-3',
    title: 'Dinh dưỡng',
    level: 3,
    icon: '🥗',
    questions: [
      {
        question: 'Nhóm thực phẩm nào giúp xương chắc khỏe?',
        image: '🥛',
        options: ['Kẹo', 'Sữa và phô mai', 'Nước ngọt', 'Kem'],
        answer: 1,
        explanation: 'Sữa và phô mai có canxi giúp xương và răng chắc khỏe.',
      },
      {
        question: 'Rau xanh tốt cho gì?',
        image: '🥦',
        options: ['Não bộ', 'Tiêu hóa', 'Cả hai', 'Không tốt cho gì'],
        answer: 2,
        explanation: 'Rau xanh có vitamin và chất xơ tốt cho tiêu hóa và não.',
      },
      {
        question: 'Ăn nhiều đường có hại gì?',
        image: '🍬',
        options: ['Sâu răng', 'Khỏe mạnh', 'Thông minh', 'Cao hơn'],
        answer: 0,
        explanation: 'Ăn nhiều đường gây sâu răng và không tốt cho sức khỏe.',
      },
      {
        question: 'Uống bao nhiêu nước mỗi ngày?',
        image: '💧',
        options: ['1 cốc', '2-3 cốc', '6-8 cốc', 'Không cần'],
        answer: 2,
        explanation: 'Nên uống 6-8 cốc nước mỗi ngày để cơ thể khỏe mạnh.',
      },
    ],
  },

  's3-4': {
    id: 's3-4',
    title: 'Vệ sinh cá nhân',
    level: 3,
    icon: '🧼',
    questions: [
      {
        question: 'Khi nào cần rửa tay?',
        image: '🙌',
        options: ['Trước khi ăn', 'Sau khi chơi', 'Cả hai', 'Không cần'],
        answer: 2,
        explanation: 'Rửa tay trước khi ăn và sau khi chơi để diệt vi khuẩn.',
      },
      {
        question: 'Đánh răng mấy lần mỗi ngày?',
        image: '🪥',
        options: ['1 lần', '2 lần', '3 lần', 'Không cần'],
        answer: 1,
        explanation: 'Đánh răng 2 lần sáng tối để bảo vệ răng miệng.',
      },
      {
        question: 'Tắm giúp gì cho cơ thể?',
        image: '🛁',
        options: ['Mất nước', 'Sạch sẽ, khỏe mạnh', 'Bẩn hơn', 'Không có gì'],
        answer: 1,
        explanation: 'Tắm rửa giúp cơ thể sạch sẽ và phòng bệnh.',
      },
      {
        question: 'Móng tay dài có hại gì?',
        image: '💅',
        options: ['Đẹp hơn', 'Chứa vi khuẩn', 'Khỏe hơn', 'Không có gì'],
        answer: 1,
        explanation: 'Móng tay dài dễ chứa vi khuẩn, nên cắt ngắn gọn.',
      },
    ],
  },

  's3-5': {
    id: 's3-5',
    title: 'Ôn tập cơ thể',
    level: 3,
    icon: '📝',
    questions: [
      {
        question: 'Bộ phận nào bơm máu?',
        image: '❤️',
        options: ['Não', 'Tim', 'Phổi', 'Gan'],
        answer: 1,
        explanation: 'Tim bơm máu đi nuôi cơ thể không ngừng nghỉ.',
      },
      {
        question: 'Có mấy giác quan?',
        image: '👁️',
        options: ['3', '4', '5', '6'],
        answer: 2,
        explanation: '5 giác quan: thị giác, thính giác, khứu giác, vị giác, xúc giác.',
      },
      {
        question: 'Canxi có trong?',
        image: '🥛',
        options: ['Kẹo', 'Sữa', 'Nước ngọt', 'Kem'],
        answer: 1,
        explanation: 'Sữa chứa nhiều canxi giúp xương chắc khỏe.',
      },
      {
        question: 'Rửa tay bằng gì?',
        image: '🧼',
        options: ['Nước lã', 'Xà phòng và nước', 'Chỉ khăn', 'Không cần'],
        answer: 1,
        explanation: 'Rửa tay với xà phòng và nước sạch để diệt vi khuẩn.',
      },
    ],
  },

  // =====================================================
  // LEVEL 4: KHOA HỌC VUI (5 bài)
  // =====================================================

  's4-1': {
    id: 's4-1',
    title: 'Hệ mặt trời',
    level: 4,
    icon: '🌍',
    questions: [
      {
        question: 'Trái Đất quay quanh gì?',
        image: '☀️',
        options: ['Mặt Trăng', 'Mặt Trời', 'Sao Hỏa', 'Sao Kim'],
        answer: 1,
        explanation: 'Trái Đất quay quanh Mặt Trời tạo ra các mùa trong năm.',
      },
      {
        question: 'Hệ mặt trời có mấy hành tinh?',
        image: '🪐',
        options: ['5', '7', '8', '10'],
        answer: 2,
        explanation: 'Có 8 hành tinh: Thủy, Kim, Trái Đất, Hỏa, Mộc, Thổ, Thiên Vương, Hải Vương.',
      },
      {
        question: 'Mặt Trăng là gì của Trái Đất?',
        image: '🌙',
        options: ['Hành tinh', 'Vệ tinh', 'Ngôi sao', 'Sao băng'],
        answer: 1,
        explanation: 'Mặt Trăng là vệ tinh tự nhiên của Trái Đất.',
      },
      {
        question: 'Ban đêm ta thấy gì trên trời?',
        image: '⭐',
        options: ['Mặt trời', 'Các ngôi sao', 'Cầu vồng', 'Mây'],
        answer: 1,
        explanation: 'Ban đêm ta thấy các ngôi sao lấp lánh trên bầu trời.',
      },
    ],
  },

  's4-2': {
    id: 's4-2',
    title: 'Nước và trạng thái',
    level: 4,
    icon: '💧',
    questions: [
      {
        question: 'Nước đá là nước ở trạng thái gì?',
        image: '🧊',
        options: ['Lỏng', 'Khí', 'Rắn', 'Hơi'],
        answer: 2,
        explanation: 'Khi nước lạnh dưới 0°C, nước đông thành đá (trạng thái rắn).',
      },
      {
        question: 'Khi đun nóng nước, nước biến thành?',
        image: '♨️',
        options: ['Đá', 'Hơi nước', 'Dầu', 'Sữa'],
        answer: 1,
        explanation: 'Khi nóng 100°C, nước sôi và bay hơi thành hơi nước.',
      },
      {
        question: 'Nước uống hàng ngày ở trạng thái?',
        image: '🥤',
        options: ['Rắn', 'Lỏng', 'Khí', 'Bột'],
        answer: 1,
        explanation: 'Nước uống ở trạng thái lỏng, chảy được.',
      },
      {
        question: 'Mây được tạo từ?',
        image: '☁️',
        options: ['Bông', 'Hơi nước ngưng tụ', 'Khói', 'Bụi'],
        answer: 1,
        explanation: 'Hơi nước bay lên cao gặp lạnh ngưng tụ thành mây.',
      },
    ],
  },

  's4-3': {
    id: 's4-3',
    title: 'Âm thanh',
    level: 4,
    icon: '🔊',
    questions: [
      {
        question: 'Âm thanh truyền qua gì?',
        image: '🔊',
        options: ['Chân không', 'Không khí', 'Ánh sáng', 'Điện'],
        answer: 1,
        explanation: 'Âm thanh truyền qua không khí đến tai chúng ta.',
      },
      {
        question: 'Tiếng sấm do đâu?',
        image: '⚡',
        options: ['Mưa', 'Gió', 'Sét - điện trong mây', 'Mây va nhau'],
        answer: 2,
        explanation: 'Sét phóng qua không khí tạo ra âm thanh lớn là tiếng sấm.',
      },
      {
        question: 'Âm thanh cao thì?',
        image: '🎵',
        options: ['Trầm', 'Thanh', 'Nhỏ', 'To'],
        answer: 1,
        explanation: 'Âm cao thì thanh (ví dụ tiếng còi), âm thấp thì trầm.',
      },
      {
        question: 'Tai có tác dụng gì?',
        image: '👂',
        options: ['Nhìn', 'Nghe', 'Ngửi', 'Nếm'],
        answer: 1,
        explanation: 'Tai thu nhận âm thanh giúp chúng ta nghe được.',
      },
    ],
  },

  's4-4': {
    id: 's4-4',
    title: 'Ánh sáng và màu sắc',
    level: 4,
    icon: '🌈',
    questions: [
      {
        question: 'Ánh sáng đi theo đường gì?',
        image: '💡',
        options: ['Cong', 'Thẳng', 'Zigzag', 'Xoắn'],
        answer: 1,
        explanation: 'Ánh sáng đi theo đường thẳng từ nguồn sáng.',
      },
      {
        question: 'Cầu vồng xuất hiện khi nào?',
        image: '🌈',
        options: ['Mưa và nắng cùng lúc', 'Chỉ có nắng', 'Chỉ có mưa', 'Ban đêm'],
        answer: 0,
        explanation: 'Khi có mưa và nắng, ánh sáng qua giọt nước tạo cầu vồng.',
      },
      {
        question: 'Bóng tối xuất hiện khi?',
        image: '🌑',
        options: ['Có ánh sáng', 'Vật cản ánh sáng', 'Trời mưa', 'Có gió'],
        answer: 1,
        explanation: 'Khi vật cản ánh sáng, phía sau vật sẽ có bóng tối.',
      },
      {
        question: 'Mắt nhìn thấy vật nhờ?',
        image: '👁️',
        options: ['Âm thanh', 'Ánh sáng phản chiếu', 'Mùi hương', 'Nhiệt độ'],
        answer: 1,
        explanation: 'Ánh sáng phản chiếu từ vật vào mắt giúp ta nhìn thấy.',
      },
    ],
  },

  's4-5': {
    id: 's4-5',
    title: 'Ôn tập khoa học',
    level: 4,
    icon: '📝',
    questions: [
      {
        question: 'Trái Đất quay quanh?',
        image: '🌍',
        options: ['Mặt Trăng', 'Mặt Trời', 'Sao Hỏa', 'Sao Kim'],
        answer: 1,
        explanation: 'Trái Đất quay quanh Mặt Trời trong 365 ngày.',
      },
      {
        question: 'Nước đông thành đá ở?',
        image: '🧊',
        options: ['0°C', '50°C', '100°C', '25°C'],
        answer: 0,
        explanation: 'Nước đông đá khi nhiệt độ xuống 0°C hoặc thấp hơn.',
      },
      {
        question: 'Âm thanh truyền qua?',
        image: '🔊',
        options: ['Chân không', 'Không khí', 'Ánh sáng', 'Tia X'],
        answer: 1,
        explanation: 'Âm thanh cần môi trường như không khí để truyền đi.',
      },
      {
        question: 'Ánh sáng đi theo đường?',
        image: '💡',
        options: ['Cong', 'Thẳng', 'Vòng', 'Zigzag'],
        answer: 1,
        explanation: 'Ánh sáng luôn đi theo đường thẳng.',
      },
    ],
  },

  // =====================================================
  // LEVEL 5: CÔNG NGHỆ & TRÁI ĐẤT (6 bài)
  // =====================================================

  's5-1': {
    id: 's5-1',
    title: 'Điện trong cuộc sống',
    level: 5,
    icon: '⚡',
    questions: [
      {
        question: 'Điện dùng để làm gì?',
        image: '💡',
        options: ['Uống', 'Thắp sáng và chạy máy', 'Ăn', 'Mặc'],
        answer: 1,
        explanation: 'Điện giúp thắp sáng đèn và chạy các thiết bị điện.',
      },
      {
        question: 'Khi ra khỏi phòng, nên làm gì với đèn?',
        image: '🔌',
        options: ['Để nguyên', 'Tắt đèn', 'Bật thêm', 'Đập vỡ'],
        answer: 1,
        explanation: 'Tắt đèn khi ra khỏi phòng để tiết kiệm điện.',
      },
      {
        question: 'Thiết bị nào dùng điện?',
        image: '📺',
        options: ['Bàn gỗ', 'Tivi', 'Ghế đá', 'Cây xanh'],
        answer: 1,
        explanation: 'Tivi, tủ lạnh, máy tính đều cần điện để hoạt động.',
      },
      {
        question: 'Chạm vào ổ điện có nguy hiểm không?',
        image: '⚠️',
        options: ['Không sao', 'Rất nguy hiểm', 'Tốt cho sức khỏe', 'Vui lắm'],
        answer: 1,
        explanation: 'Điện rất nguy hiểm, không được chạm vào ổ điện!',
      },
    ],
  },

  's5-2': {
    id: 's5-2',
    title: 'Máy tính và công nghệ',
    level: 5,
    icon: '💻',
    questions: [
      {
        question: 'Máy tính dùng để làm gì?',
        image: '💻',
        options: ['Nấu cơm', 'Học tập và làm việc', 'Quét nhà', 'Giặt đồ'],
        answer: 1,
        explanation: 'Máy tính giúp học tập, làm việc và giải trí.',
      },
      {
        question: 'Điện thoại thông minh có thể làm gì?',
        image: '📱',
        options: ['Chỉ gọi điện', 'Gọi, nhắn tin, chụp ảnh, lên mạng', 'Chỉ chụp ảnh', 'Không làm gì'],
        answer: 1,
        explanation: 'Điện thoại thông minh có nhiều chức năng: gọi, nhắn, chụp ảnh, xem video...',
      },
      {
        question: 'Internet là gì?',
        image: '🌐',
        options: ['Món ăn', 'Mạng kết nối toàn cầu', 'Trò chơi', 'Cuốn sách'],
        answer: 1,
        explanation: 'Internet kết nối máy tính khắp thế giới để chia sẻ thông tin.',
      },
      {
        question: 'Robot là gì?',
        image: '🤖',
        options: ['Động vật', 'Máy móc thông minh', 'Loại cây', 'Món ăn'],
        answer: 1,
        explanation: 'Robot là máy móc có thể làm việc theo chương trình.',
      },
    ],
  },

  's5-3': {
    id: 's5-3',
    title: 'Phương tiện giao thông',
    level: 5,
    icon: '🚗',
    questions: [
      {
        question: 'Xe đạp chạy bằng gì?',
        image: '🚲',
        options: ['Xăng', 'Điện', 'Sức người đạp', 'Nước'],
        answer: 2,
        explanation: 'Xe đạp chạy bằng sức người đạp pedal.',
      },
      {
        question: 'Máy bay di chuyển ở đâu?',
        image: '✈️',
        options: ['Dưới nước', 'Trên đường', 'Trên trời', 'Dưới đất'],
        answer: 2,
        explanation: 'Máy bay bay trên bầu trời để di chuyển nhanh.',
      },
      {
        question: 'Tàu thủy di chuyển ở đâu?',
        image: '🚢',
        options: ['Trên đường', 'Trên nước', 'Trên trời', 'Dưới đất'],
        answer: 1,
        explanation: 'Tàu thủy nổi trên mặt nước biển, sông.',
      },
      {
        question: 'Tàu hỏa chạy trên gì?',
        image: '🚂',
        options: ['Đường bộ', 'Đường ray', 'Đường thủy', 'Đường không'],
        answer: 1,
        explanation: 'Tàu hỏa chạy trên đường ray sắt.',
      },
    ],
  },

  's5-4': {
    id: 's5-4',
    title: 'Núi lửa và động đất',
    level: 5,
    icon: '🌋',
    questions: [
      {
        question: 'Núi lửa phun ra gì?',
        image: '🌋',
        options: ['Nước', 'Dung nham nóng chảy', 'Tuyết', 'Hoa'],
        answer: 1,
        explanation: 'Núi lửa phun ra dung nham nóng đỏ từ lòng đất.',
      },
      {
        question: 'Động đất là gì?',
        image: '🏚️',
        options: ['Mưa to', 'Mặt đất rung chuyển', 'Gió lớn', 'Nắng nóng'],
        answer: 1,
        explanation: 'Động đất là khi các mảng đất trong lòng đất dịch chuyển.',
      },
      {
        question: 'Sóng thần thường xảy ra sau?',
        image: '🌊',
        options: ['Mưa', 'Động đất dưới biển', 'Nắng', 'Gió'],
        answer: 1,
        explanation: 'Động đất dưới đáy biển có thể gây ra sóng thần.',
      },
      {
        question: 'Khi động đất nên làm gì?',
        image: '🏃',
        options: ['Đứng yên', 'Chui xuống gầm bàn, tránh xa cửa kính', 'Chạy lên cao', 'Bơi lội'],
        answer: 1,
        explanation: 'Khi động đất, nên chui xuống gầm bàn chắc chắn.',
      },
    ],
  },

  's5-5': {
    id: 's5-5',
    title: 'Tài nguyên thiên nhiên',
    level: 5,
    icon: '🌍',
    questions: [
      {
        question: 'Nước sạch là tài nguyên gì?',
        image: '💧',
        options: ['Vô hạn', 'Có hạn, cần bảo vệ', 'Không quan trọng', 'Dễ tạo ra'],
        answer: 1,
        explanation: 'Nước sạch có hạn, cần tiết kiệm và bảo vệ nguồn nước.',
      },
      {
        question: 'Rừng cây có tác dụng gì?',
        image: '🌲',
        options: ['Làm nóng', 'Tạo oxy và bảo vệ đất', 'Gây ô nhiễm', 'Không có tác dụng'],
        answer: 1,
        explanation: 'Rừng tạo oxy, chống xói mòn và là nhà của động vật.',
      },
      {
        question: 'Than đá và dầu mỏ là?',
        image: '⛽',
        options: ['Thực phẩm', 'Nhiên liệu', 'Đồ chơi', 'Quần áo'],
        answer: 1,
        explanation: 'Than đá và dầu mỏ là nhiên liệu để tạo ra năng lượng.',
      },
      {
        question: 'Năng lượng mặt trời có gì tốt?',
        image: '☀️',
        options: ['Gây ô nhiễm', 'Sạch và vô tận', 'Rất đắt', 'Không dùng được'],
        answer: 1,
        explanation: 'Năng lượng mặt trời sạch, không gây ô nhiễm.',
      },
    ],
  },

  's5-6': {
    id: 's5-6',
    title: 'Ôn tập công nghệ',
    level: 5,
    icon: '📝',
    questions: [
      {
        question: 'Thiết bị nào cần điện?',
        image: '🔌',
        options: ['Xe đạp', 'Tủ lạnh', 'Ghế gỗ', 'Bàn'],
        answer: 1,
        explanation: 'Tủ lạnh là thiết bị điện, cần điện để hoạt động.',
      },
      {
        question: 'Internet giúp?',
        image: '🌐',
        options: ['Nấu ăn', 'Kết nối và tìm thông tin', 'Giặt đồ', 'Dọn nhà'],
        answer: 1,
        explanation: 'Internet giúp kết nối mọi người và tìm kiếm thông tin.',
      },
      {
        question: 'Máy bay bay ở đâu?',
        image: '✈️',
        options: ['Dưới nước', 'Trên đường', 'Trên trời', 'Trong đất'],
        answer: 2,
        explanation: 'Máy bay bay trên bầu trời.',
      },
      {
        question: 'Tài nguyên nào cần tiết kiệm?',
        image: '💧',
        options: ['Không có', 'Nước sạch', 'Rác thải', 'Khói bụi'],
        answer: 1,
        explanation: 'Nước sạch có hạn, cần tiết kiệm và bảo vệ.',
      },
    ],
  },
};

// Lấy bài học khoa học theo ID
export const getScienceLesson = (lessonId) => SCIENCE_LESSONS[lessonId];

// Lấy tất cả bài học khoa học
export const getAllScienceLessons = () => Object.values(SCIENCE_LESSONS);

// Lấy bài học theo level
export const getScienceLessonsByLevel = (level) =>
  Object.values(SCIENCE_LESSONS).filter((lesson) => lesson.level === level);

export default SCIENCE_LESSONS;
