// ============================================
// STORY DATA - Truyện cổ tích Việt Nam
// Nội dung chính xác theo nguyên bản dân gian
// ============================================

export const STORIES = [
  // ==========================================
  // 1. THẠCH SANH
  // ==========================================
  {
    id: 'thach_sanh',
    title: 'Thạch Sanh',
    titleEn: 'The Tale of Thach Sanh',
    icon: '⚔️',
    cover: '🏹',
    color: 'from-red-500 to-orange-500',
    description: 'Chàng dũng sĩ diệt chằn tinh, đại bàng',
    totalChapters: 6,
    chapters: [
      {
        id: 1,
        title: 'Sự ra đời kỳ lạ',
        content: `Ngày xưa, ở quận Cao Bình có hai vợ chồng bác tiều phu họ Thạch, tuổi đã cao mà vẫn chưa có con. Ông bà tuy nghèo nhưng luôn làm việc thiện: ông thì sửa cầu, đắp đường; bà thì nấu nước cho người qua đường uống.

Việc làm tốt của họ thấu đến Ngọc Hoàng. Ngài bèn sai Thái tử xuống đầu thai làm con nhà họ Thạch.

Bà vợ mang thai đến ba năm mới sinh được một cậu con trai khôi ngô tuấn tú, đặt tên là Thạch Sanh.

Chẳng bao lâu sau, cha mẹ lần lượt qua đời. Thạch Sanh sống một mình trong túp lều tranh dưới gốc đa, chỉ có chiếc búa đốn củi làm bạn.

Năm Thạch Sanh mười ba tuổi, Ngọc Hoàng sai thiên thần xuống dạy cho chàng đủ các môn võ nghệ và mọi phép thần thông.`,
        image: '👶⭐🏠',
        question: 'Thạch Sanh được ai dạy võ nghệ?',
        options: ['Cha mẹ', 'Thiên thần', 'Thầy đồ', 'Tự học'],
        answer: 1
      },
      {
        id: 2,
        title: 'Kết nghĩa với Lý Thông',
        content: `Một hôm, có người hàng rượu tên là Lý Thông đi qua gốc đa, thấy Thạch Sanh vác về một gánh củi lớn tướng.

Lý Thông nghĩ bụng: "Người này khỏe như voi. Nếu về ở cùng ta thì lợi biết bao nhiêu."

Hắn bèn đến làm quen, nói ngọt nhạt rồi xin kết nghĩa anh em. Thạch Sanh thật thà, thấy có người quan tâm đến mình liền vui vẻ nhận lời.

Từ đó, Thạch Sanh về sống chung với mẹ con Lý Thông. Chàng làm việc quần quật suốt ngày, còn Lý Thông thì chỉ biết hưởng thụ.

Lúc bấy giờ, trong vùng có con Chằn tinh hung ác, thường bắt người ăn thịt. Mỗi năm, dân làng phải nộp một người cho nó. Năm ấy, đến lượt Lý Thông.`,
        image: '🤝🍶😈',
        question: 'Lý Thông kết nghĩa với Thạch Sanh vì lý do gì?',
        options: ['Vì thương Thạch Sanh', 'Vì muốn lợi dụng sức khỏe của Thạch Sanh', 'Vì Thạch Sanh cứu hắn', 'Vì họ là bạn từ nhỏ'],
        answer: 1
      },
      {
        id: 3,
        title: 'Giết Chằn tinh',
        content: `Mẹ con Lý Thông hoảng sợ, bèn nghĩ kế lừa Thạch Sanh đi thay.

Lý Thông nói: "Đêm nay anh phải canh miếu trong rừng, nhưng trót cất mẻ rượu, em chịu khó đi thay anh một đêm."

Thạch Sanh thật thà nhận lời. Nửa đêm, Chằn tinh hiện ra, nhe nanh, giơ vuốt, há hơi nhả lửa định vồ Thạch Sanh.

Thạch Sanh bình tĩnh vung búa đánh lại. Chằn tinh thoắt biến, thoắt hiện, nhưng không sao địch nổi Thạch Sanh.

Cuối cùng, chàng chém đứt đầu yêu quái, đốt xác nó thành tro. Từ trong đống tro hiện ra một bộ cung tên bằng vàng sáng chói.

Thạch Sanh mang đầu Chằn tinh về, Lý Thông lại lừa chàng rằng đó là vật nuôi của vua, giết nó sẽ bị tội chém đầu. Thạch Sanh sợ hãi, bỏ đi, để Lý Thông cướp công.`,
        image: '🐍⚔️🏹',
        question: 'Thạch Sanh thu được vật gì sau khi giết Chằn tinh?',
        options: ['Thanh gươm', 'Bộ cung tên vàng', 'Chiếc áo giáp', 'Túi vàng'],
        answer: 1
      },
      {
        id: 4,
        title: 'Cứu công chúa',
        content: `Công chúa Quỳnh Nga bị Đại bàng khổng lồ bắt đi. Vua ra chiếu: Ai cứu được công chúa sẽ được gả làm vợ.

Lý Thông biết hang Đại bàng, nhờ Thạch Sanh xuống cứu. Chàng theo dây thừng xuống hang sâu, dùng cung tên vàng bắn chết Đại bàng, cứu được công chúa.

Khi chàng buộc dây cho công chúa lên trước, Lý Thông thấy nàng đẹp quá, liền cắt đứt dây, lấp cửa hang để Thạch Sanh chết, rồi đem công chúa về cướp công.

Thạch Sanh một mình trong hang tối, đi mãi thì gặp con trai vua Thủy Tề bị nhốt trong cũi sắt. Chàng cứu thái tử, được đưa xuống Thủy cung.

Vua Thủy Tề tặng chàng cây đàn thần và niêu cơm thần để trả ơn cứu mạng con trai.`,
        image: '👸🦅🏰',
        question: 'Lý Thông đã làm gì sau khi Thạch Sanh cứu được công chúa?',
        options: ['Cảm ơn Thạch Sanh', 'Lấp cửa hang để Thạch Sanh chết', 'Kéo Thạch Sanh lên', 'Báo cho vua biết'],
        answer: 1
      },
      {
        id: 5,
        title: 'Tiếng đàn thần',
        content: `Công chúa từ khi được cứu thì hóa câm, không nói không cười. Vua cho Lý Thông lập đàn cầu nguyện nhưng không có kết quả.

Lý Thông sợ Thạch Sanh còn sống, bèn sai người ăn trộm của cải trong kho vua rồi chôn ở gốc đa để vu oan cho chàng.

Thạch Sanh bị bắt giam vào ngục. Trong ngục tối, chàng buồn bã lấy đàn thần ra gảy.

Tiếng đàn kể rõ đầu đuôi câu chuyện: chàng đã giết Chằn tinh, bắn Đại bàng, cứu công chúa ra sao, rồi bị Lý Thông phản bội thế nào.

Tiếng đàn bay vào cung, công chúa vừa nghe liền nói được, kể hết mọi chuyện cho vua cha.

Vua truyền đưa Thạch Sanh vào cung. Chàng gảy đàn, tội ác của Lý Thông bị phơi bày. Vua sai bắt mẹ con Lý Thông trị tội.`,
        image: '🎸👑💫',
        question: 'Tiếng đàn thần có tác dụng gì?',
        options: ['Làm mọi người ngủ say', 'Kể lại sự thật và chữa câm cho công chúa', 'Triệu hồi quái vật', 'Không có tác dụng gì'],
        answer: 1
      },
      {
        id: 6,
        title: 'Niêu cơm thần',
        content: `Thạch Sanh xin vua tha tội cho mẹ con Lý Thông. Nhưng trên đường về, cả hai bị sét đánh chết, hóa thành bọ hung.

Vua gả công chúa cho Thạch Sanh. Thái tử mười tám nước chư hầu tức giận vì bị công chúa từ chối, kéo quân sang đánh.

Thạch Sanh đem đàn thần ra gảy. Tiếng đàn khiến quân địch nhớ nhà, nhớ vợ con, không ai còn muốn đánh nhau nữa. Tất cả xin hàng.

Thạch Sanh mời họ ăn cơm. Chàng chỉ có một niêu cơm nhỏ, nhưng niêu cơm thần cứ xới hết lại đầy, quân lính mười tám nước ăn mãi không hết.

Các nước chư hầu kính phục, từ đó quy thuận, không dám gây chiến nữa.

🌟 BÀI HỌC: Người thật thà, dũng cảm sẽ được đền đáp. Kẻ gian ác, phản bội sẽ bị trừng phạt.`,
        image: '🍚👑🎉',
        question: 'Niêu cơm thần có điều kỳ diệu gì?',
        options: ['Nấu cơm rất nhanh', 'Cơm xới hết lại đầy, ăn mãi không hết', 'Cơm có thể chữa bệnh', 'Cơm biến thành vàng'],
        answer: 1
      }
    ]
  },

  // ==========================================
  // 2. SỌ DỪA
  // ==========================================
  {
    id: 'so_dua',
    title: 'Sọ Dừa',
    titleEn: 'The Coconut Shell Boy',
    icon: '🥥',
    cover: '🎋',
    color: 'from-green-500 to-teal-500',
    description: 'Đừng đánh giá người qua vẻ bề ngoài',
    totalChapters: 5,
    chapters: [
      {
        id: 1,
        title: 'Sự ra đời kỳ lạ',
        content: `Ngày xưa, có hai vợ chồng nghèo đi ở cho nhà phú ông. Họ hiền lành, chăm chỉ nhưng đã ngoài năm mươi tuổi mà chưa có con.

Một hôm, bà vợ vào rừng lấy củi. Trời nắng to, bà khát nước quá, thấy cái sọ dừa bên gốc cây đựng đầy nước mưa, bà bèn bưng lên uống.

Về nhà, bà có mang. Ít lâu sau, chồng bà qua đời. Bà sinh ra một đứa con không có chân tay, mình mẩy tròn lông lốc như quả dừa.

Bà buồn lắm, định bỏ đi thì đứa bé cất tiếng nói:

"Mẹ ơi! Con là người đấy! Mẹ đừng bỏ con mà tội nghiệp."

Bà thương tình để lại nuôi và đặt tên là Sọ Dừa.`,
        image: '🥥👶💧',
        question: 'Tại sao bà mẹ sinh ra Sọ Dừa?',
        options: ['Vì bà ăn phải trái cấm', 'Vì bà uống nước trong sọ dừa', 'Vì bà bị phù phép', 'Vì bà cầu xin thần linh'],
        answer: 1
      },
      {
        id: 2,
        title: 'Chàng chăn bò',
        content: `Lớn lên, Sọ Dừa vẫn tròn lông lốc, chẳng làm được việc gì. Bà mẹ phiền lòng lắm.

Sọ Dừa biết vậy, xin mẹ đến chăn bò cho nhà phú ông. Ban đầu phú ông ngần ngại, nhưng nghĩ: nuôi thì ít tốn cơm, tiền công cũng không đáng bao, nên đồng ý.

Sọ Dừa chăn bò rất giỏi. Hàng ngày, cậu lăn sau đàn bò ra đồng, tối lại lăn về. Bò con nào con nấy no căng bụng.

Phú ông có ba cô con gái, thay nhau đưa cơm cho Sọ Dừa. Hai cô chị kiêu kỳ, thường hắt hủi. Chỉ có cô út hiền lành, đối xử tử tế.

Một hôm, cô út mang cơm ra, bỗng nghe tiếng sáo véo von. Nàng rón rén lại gần, thấy một chàng trai khôi ngô đang ngồi thổi sáo cho bò ăn cỏ. Vừa thấy người, chàng biến mất, chỉ còn Sọ Dừa nằm lăn lóc.

Cô út biết Sọ Dừa không phải người thường, bèn đem lòng yêu mến.`,
        image: '🐄🎵👸',
        question: 'Ai là người đối xử tử tế với Sọ Dừa?',
        options: ['Hai cô chị', 'Cô út', 'Phú ông', 'Bà mẹ Sọ Dừa'],
        answer: 1
      },
      {
        id: 3,
        title: 'Đám cưới',
        content: `Cuối mùa, Sọ Dừa giục mẹ đến nhà phú ông hỏi vợ. Bà mẹ sửng sốt nhưng cũng chiều con.

Phú ông cười mỉa mai: "Muốn cưới con gái ta, hãy sắm đủ: một chĩnh vàng cốm, mười tấm lụa đào, mười con lợn béo, mười vò rượu tăm!"

Bà mẹ về, nghĩ là phải bỏ cuộc. Nhưng đúng ngày hẹn, bỗng trong nhà có đầy đủ sính lễ, lại có gia nhân khiêng sang nhà phú ông.

Phú ông hoa mắt, gọi ba con gái ra hỏi ý. Hai cô chị bĩu môi chê Sọ Dừa xấu xí rồi bỏ đi. Chỉ cô út cúi đầu e lệ, tỏ ý bằng lòng.

Ngày cưới, tiệc bày linh đình. Khi rước dâu, không ai thấy Sọ Dừa xấu xí đâu nữa, mà chỉ thấy một chàng trai khôi ngô tuấn tú đứng bên cô dâu.

Mọi người sửng sốt mừng rỡ, hai cô chị thì vừa tiếc vừa ghen tức.`,
        image: '💍🎊👫',
        question: 'Điều gì xảy ra trong ngày cưới của Sọ Dừa?',
        options: ['Sọ Dừa vẫn hình dạng quả dừa', 'Sọ Dừa biến thành chàng trai tuấn tú', 'Đám cưới bị hủy', 'Hai cô chị đến phá đám'],
        answer: 1
      },
      {
        id: 4,
        title: 'Trạng nguyên đi sứ',
        content: `Vợ chồng Sọ Dừa sống với nhau rất hạnh phúc. Sọ Dừa ngày đêm miệt mài đèn sách.

Năm ấy, chàng đi thi và đỗ Trạng nguyên. Vua cử chàng đi sứ sang nước ngoài.

Trước khi đi, Sọ Dừa đưa cho vợ một hòn đá lửa, một con dao và hai quả trứng gà, dặn:

"Nàng hãy giữ những thứ này trong người, phòng khi gặp nạn bất ngờ."

Cô út không hiểu nhưng vẫn vâng lời chồng.

Từ ngày em lấy được chồng tuấn tú, lại đỗ Trạng nguyên, hai cô chị ghen tức lắm. Chúng bàn nhau hại em để một trong hai người thay làm bà Trạng.`,
        image: '📚🎓⛵',
        question: 'Sọ Dừa đưa cho vợ những gì trước khi đi sứ?',
        options: ['Vàng bạc châu báu', 'Đá lửa, dao và hai quả trứng', 'Một bức thư', 'Chiếc nhẫn'],
        answer: 1
      },
      {
        id: 5,
        title: 'Đoàn tụ',
        content: `Hai cô chị rủ em đi chơi thuyền rồi đẩy em xuống biển. Cô út bị cá kình nuốt vào bụng.

Trong bụng cá, nàng lấy dao rạch bụng cá chui ra. Cá chết, xác trôi dạt vào bờ.

Nàng dùng đá lửa nhóm lửa sưởi ấm và nướng thịt cá ăn. Hai quả trứng nở ra hai con gà.

Một hôm, thuyền quan Trạng đi ngang qua. Con gà trống gáy vang:

"Ò ó o! Phải thuyền quan Trạng rước cô tôi về!"

Sọ Dừa nhận ra vợ, đón nàng lên thuyền. Hai vợ chồng đoàn tụ, trở về nhà.

Hai cô chị xấu hổ vì tội lỗi, bỏ đi biệt xứ.

🌟 BÀI HỌC: Đừng đánh giá người qua vẻ bề ngoài. Người nhân hậu sẽ được hưởng hạnh phúc, kẻ ác sẽ phải hổ thẹn.`,
        image: '🐔⛵💕',
        question: 'Con gà trống gáy câu gì?',
        options: ['Gáy báo sáng', 'Phải thuyền quan Trạng rước cô tôi về', 'Kêu cứu', 'Không gáy gì'],
        answer: 1
      }
    ]
  },

  // ==========================================
  // 3. TÍCH CHU
  // ==========================================
  {
    id: 'tich_chu',
    title: 'Tích Chu',
    titleEn: 'The Tale of Tich Chu',
    icon: '👵',
    cover: '🏠',
    color: 'from-amber-500 to-orange-500',
    description: 'Câu chuyện về lòng hiếu thảo',
    totalChapters: 5,
    chapters: [
      {
        id: 1,
        title: 'Cậu bé Tích Chu',
        content: `Ngày xửa ngày xưa, có một cậu bé tên là Tích Chu sống cùng bà ngoại trong một ngôi nhà nhỏ.

Bà ngoại của Tích Chu rất yêu thương cậu. Hàng ngày, bà nấu cơm, giặt áo, chăm sóc Tích Chu chu đáo. Dù tuổi đã cao, bà vẫn làm mọi việc vì thương cháu.

Nhưng Tích Chu lại là một cậu bé ham chơi. Cậu suốt ngày chạy nhảy ngoài đồng với bạn bè, không giúp đỡ bà việc gì.

Mỗi khi bà nhờ việc, Tích Chu đều nói: "Để con chơi xong đã!" rồi tiếp tục chơi, quên hết lời bà dặn.

Bà ngoại buồn lắm, nhưng vẫn yêu thương cháu.`,
        image: '👦🏠👵',
        question: 'Tích Chu có tính cách như thế nào?',
        options: ['Chăm chỉ giúp bà', 'Ham chơi, không giúp bà', 'Hay đi học', 'Thích nấu ăn'],
        answer: 1
      },
      {
        id: 2,
        title: 'Bà ốm nặng',
        content: `Một hôm, bà ngoại bị ốm rất nặng. Bà nằm trên giường, người nóng như lửa đốt, không thể dậy nổi.

Bà khát nước quá, gọi Tích Chu: "Cháu ơi, bà khát nước lắm! Cháu lấy cho bà chén nước được không?"

Nhưng lúc đó Tích Chu đang mải chơi ngoài sân với mấy con dế. Cậu trả lời qua quýt: "Bà đợi con chút, con đang chơi!"

Rồi Tích Chu mải mê với đám bạn, quên mất lời bà dặn.

Bà ngoại nằm chờ, khát khô cả cổ mà không có ai mang nước cho bà uống.`,
        image: '🛏️😢💧',
        question: 'Bà nhờ Tích Chu làm gì?',
        options: ['Nấu cơm', 'Lấy nước uống', 'Đi mua thuốc', 'Gọi thầy thuốc'],
        answer: 1
      },
      {
        id: 3,
        title: 'Bà hóa thành chim',
        content: `Bà ngoại khát nước quá, chờ mãi không thấy Tích Chu mang nước đến.

Bỗng nhiên, một điều kỳ lạ xảy ra. Bà ngoại biến thành một con chim nhỏ!

Con chim bay ra cửa sổ, kêu lên thảm thiết: "Tích Chu ơi! Tích Chu ơi! Nước! Nước!"

Tích Chu nghe tiếng chim kêu lạ, vội chạy vào nhà. Nhưng bà không còn đâu nữa, chỉ thấy con chim đang bay đi.

Tích Chu khóc òa lên: "Bà ơi! Bà ơi! Bà đừng bỏ con!"

Cậu hối hận vô cùng vì đã không nghe lời bà.`,
        image: '🐦😭✨',
        question: 'Bà ngoại biến thành con gì?',
        options: ['Con bướm', 'Con chim', 'Con cá', 'Con thỏ'],
        answer: 1
      },
      {
        id: 4,
        title: 'Hành trình tìm bà',
        content: `Tích Chu quyết tâm đi tìm bà. Cậu đi mãi, đi mãi, qua núi cao, qua rừng sâu.

Cậu hỏi thăm khắp nơi: "Có ai thấy con chim của bà cháu không?"

Cuối cùng, cậu gặp một ông tiên râu tóc bạc phơ. Ông tiên nói:

"Ta biết bà cháu ở đâu. Bà đang ở trên núi Khát Nước. Nhưng muốn cứu bà, cháu phải lấy được nước suối thần trên đỉnh núi cao kia."

Đường lên núi rất hiểm trở, đầy gai góc. Nhưng Tích Chu không ngại khó khăn, cậu cố gắng leo lên.

Chân cậu trầy xước, tay cậu rớm máu, nhưng cậu vẫn kiên trì vì thương bà.`,
        image: '🏔️🧓💫',
        question: 'Tích Chu phải lấy gì để cứu bà?',
        options: ['Hoa thần', 'Nước suối thần', 'Quả táo vàng', 'Lá thuốc'],
        answer: 1
      },
      {
        id: 5,
        title: 'Đoàn tụ',
        content: `Sau bao ngày vất vả, Tích Chu cuối cùng cũng lấy được nước suối thần.

Cậu tìm thấy con chim nhỏ đang đậu trên cành cây. Cậu nhẹ nhàng cho chim uống nước.

Kỳ diệu thay, con chim từ từ biến trở lại thành bà ngoại!

Bà ngoại ôm Tích Chu vào lòng: "Cháu ngoan của bà! Cháu đã biết thương bà rồi!"

Tích Chu khóc nức nở: "Con xin lỗi bà! Từ nay con sẽ nghe lời bà, con sẽ chăm sóc bà thật tốt!"

Từ đó, Tích Chu trở thành một cậu bé hiếu thảo, luôn yêu thương và chăm sóc bà ngoại.

🌟 BÀI HỌC: Hãy luôn yêu thương, hiếu thảo với ông bà, cha mẹ khi còn có thể. Đừng để đến khi mất đi mới hối hận.`,
        image: '👵❤️👦',
        question: 'Bài học từ câu chuyện Tích Chu là gì?',
        options: ['Chăm chỉ học hành', 'Hiếu thảo với ông bà', 'Không nói dối', 'Chia sẻ với bạn bè'],
        answer: 1
      }
    ]
  },

  // ==========================================
  // 4. CÂY TRE TRĂM ĐỐT
  // ==========================================
  {
    id: 'cay_tre_tram_dot',
    title: 'Cây Tre Trăm Đốt',
    titleEn: 'The Hundred-jointed Bamboo',
    icon: '🎋',
    cover: '🌿',
    color: 'from-emerald-500 to-green-600',
    description: 'Thật thà là đức tính quý báu',
    totalChapters: 5,
    chapters: [
      {
        id: 1,
        title: 'Anh Khoai thật thà',
        content: `Ngày xưa, có một anh nông dân tên là Khoai. Anh mồ côi cha mẹ từ nhỏ, phải đi làm thuê để kiếm sống.

Anh Khoai rất thật thà, chăm chỉ, làm việc gì cũng hết sức mình. Anh không bao giờ nói dối hay lừa gạt ai.

Anh đến làm thuê cho một phú ông giàu có. Phú ông thấy anh làm việc giỏi, rất ưng ý.

Phú ông có một cô con gái xinh đẹp, hiền hậu. Dần dần, cô gái đem lòng yêu mến anh Khoai vì tính tình thật thà của anh.

Phú ông biết chuyện, rất tức giận vì không muốn gả con gái cho người nghèo.`,
        image: '👨‍🌾🏠💰',
        question: 'Anh Khoai có đức tính gì nổi bật?',
        options: ['Gian dối', 'Thật thà, chăm chỉ', 'Lười biếng', 'Kiêu ngạo'],
        answer: 1
      },
      {
        id: 2,
        title: 'Lời thách cưới',
        content: `Phú ông nghĩ ra một kế để từ chối anh Khoai. Ông nói:

"Anh muốn cưới con gái ta ư? Được, nhưng anh phải tìm cho ta một cây tre có đúng một trăm đốt. Nếu tìm được, ta sẽ gả con gái cho anh!"

Anh Khoai vui mừng lắm, vội vàng vào rừng tìm tre.

Anh tìm khắp nơi: rừng này qua rừng khác, núi này sang núi kia. Nhưng cây tre nào cũng chỉ có vài chục đốt, không cây nào đến trăm đốt cả.

Anh tìm mãi, tìm mãi mà không được. Anh ngồi bên gốc cây, ôm mặt khóc vì biết mình đã bị phú ông lừa.`,
        image: '🎋😢🌲',
        question: 'Phú ông thách anh Khoai tìm gì?',
        options: ['Cây tre vàng', 'Cây tre trăm đốt', 'Cây tre nghìn tuổi', 'Cây tre biết nói'],
        answer: 1
      },
      {
        id: 3,
        title: 'Bụt hiện lên',
        content: `Bỗng nhiên, Bụt hiện ra trước mặt anh Khoai. Bụt hỏi: "Vì sao con khóc?"

Anh Khoai kể hết sự tình cho Bụt nghe. Bụt mỉm cười hiền từ, nói:

"Con hãy chặt đủ một trăm đốt tre, xếp thành hàng dài rồi đọc: KHẮC NHẬP! KHẮC NHẬP!"

Anh Khoai làm theo lời Bụt dặn. Chàng chặt đủ một trăm đốt tre, xếp thành hàng rồi đọc câu thần chú.

Kỳ diệu thay! Một trăm đốt tre liền dính vào nhau thành một cây tre dài trăm đốt!

Anh Khoai vác cây tre về, lòng vui như mở hội.`,
        image: '✨🧙‍♂️🎋',
        question: 'Câu thần chú để nối tre là gì?',
        options: ['Biến hình!', 'Khắc nhập! Khắc nhập!', 'Abracadabra!', 'Mở ra!'],
        answer: 1
      },
      {
        id: 4,
        title: 'Phú ông bị phạt',
        content: `Anh Khoai mang cây tre trăm đốt về nộp cho phú ông. Phú ông đếm đi đếm lại, đúng một trăm đốt!

Ông ta ngạc nhiên và tức giận, định lật lọng không giữ lời hứa. Ông quát:

"Ta thay đổi ý rồi! Ta không gả con gái cho ngươi nữa!"

Anh Khoai buồn bã quá, bất giác đọc: "KHẮC XUẤT! KHẮC XUẤT!"

Tức thì, cây tre tách ra thành từng đốt, văng tứ tung! Một đốt tre bay trúng dính vào mũi phú ông!

Phú ông kêu la ầm ĩ, đau đớn vô cùng, van xin anh Khoai gỡ ra.`,
        image: '😱🎋👃',
        question: 'Câu thần chú để tách tre là gì?',
        options: ['Khắc xuất! Khắc xuất!', 'Khắc nhập! Khắc nhập!', 'Bay đi!', 'Tan ra!'],
        answer: 0
      },
      {
        id: 5,
        title: 'Kết thúc có hậu',
        content: `Phú ông hứa sẽ giữ đúng lời, gả con gái cho anh Khoai.

Anh Khoai đọc thần chú, đốt tre rời khỏi mũi phú ông.

Phú ông giữ lời hứa, tổ chức đám cưới linh đình cho anh Khoai và con gái.

Anh Khoai và cô gái cưới nhau, sống hạnh phúc bên nhau. Anh vẫn giữ tính thật thà, chăm chỉ như xưa, được mọi người yêu mến.

Còn phú ông, từ đó ông ta không dám lừa dối ai nữa.

🌟 BÀI HỌC: Người thật thà, chăm chỉ sẽ được giúp đỡ và gặp may mắn. Kẻ gian dối, lật lọng sẽ bị trừng phạt xứng đáng.`,
        image: '💒❤️😊',
        question: 'Bài học từ câu chuyện là gì?',
        options: ['Phải giàu có mới hạnh phúc', 'Thật thà sẽ được giúp đỡ, gian dối sẽ bị phạt', 'Phải khôn ngoan mới thành công', 'Phải có phép thuật'],
        answer: 1
      }
    ]
  },

  // ==========================================
  // 5. TẤM CÁM
  // ==========================================
  {
    id: 'tam_cam',
    title: 'Tấm Cám',
    titleEn: 'The Story of Tam and Cam',
    icon: '👸',
    cover: '🎃',
    color: 'from-pink-500 to-rose-500',
    description: 'Người hiền sẽ được đền đáp',
    totalChapters: 6,
    chapters: [
      {
        id: 1,
        title: 'Cô Tấm mồ côi',
        content: `Ngày xưa, có một cô gái tên là Tấm. Mẹ Tấm mất sớm, cha lấy vợ kế rồi cũng qua đời.

Tấm ở với dì ghẻ và Cám - con gái riêng của dì.

Dì ghẻ rất thương Cám nhưng đối xử tệ bạc với Tấm. Tấm phải làm mọi việc nặng nhọc trong nhà: nấu cơm, quét nhà, gánh nước, chăn trâu...

Còn Cám thì được ăn ngon, mặc đẹp, suốt ngày chơi bời.

Dù vất vả, Tấm vẫn hiền lành, chăm chỉ, không một lời oán trách.`,
        image: '👧😢🧹',
        question: 'Tấm phải sống với ai sau khi cha mẹ mất?',
        options: ['Ông bà nội', 'Dì ghẻ và Cám', 'Cô chú', 'Một mình'],
        answer: 1
      },
      {
        id: 2,
        title: 'Con cá bống',
        content: `Một hôm, dì ghẻ sai Tấm và Cám đi bắt tôm cá. Ai bắt được nhiều hơn sẽ được thưởng yếm đỏ.

Tấm chăm chỉ bắt được đầy giỏ. Cám thì lười biếng, chẳng bắt được gì.

Cám lừa Tấm: "Chị Tấm ơi, đầu chị lấm bùn kìa, xuống ao gội đi!"

Khi Tấm xuống gội đầu, Cám trút hết cá sang giỏ mình rồi chạy về.

Tấm khóc. Trong giỏ chỉ còn một con cá bống nhỏ. Tấm mang cá bống về nuôi trong giếng.

Hàng ngày, Tấm nhịn ăn, dành cơm cho cá bống. Cá bống lớn nhanh, rất quấn quýt Tấm.`,
        image: '🐟💧🎵',
        question: 'Tấm nuôi cá bống ở đâu?',
        options: ['Trong ao', 'Trong giếng', 'Trong chậu', 'Trong sông'],
        answer: 1
      },
      {
        id: 3,
        title: 'Bụt hiện lên',
        content: `Mẹ con Cám phát hiện Tấm nuôi cá bống. Họ lừa Tấm đi chăn trâu xa, rồi bắt cá bống giết thịt ăn.

Tấm về, gọi mãi không thấy cá bống, khóc rất nhiều.

Bỗng nhiên, Bụt hiện lên an ủi: "Con đừng khóc! Hãy tìm xương cá, cho vào bốn cái lọ, chôn dưới bốn chân giường."

Tấm làm theo lời Bụt dặn. Nàng tìm được xương cá, bỏ vào bốn lọ, chôn cẩn thận.

Từ đó, mỗi khi buồn, Tấm lại nghĩ đến lời Bụt dạy mà vơi bớt nỗi sầu.`,
        image: '✨🧓🏻💫',
        question: 'Bụt bảo Tấm làm gì với xương cá?',
        options: ['Vứt đi', 'Chôn dưới bốn chân giường', 'Đốt thành tro', 'Thả xuống sông'],
        answer: 1
      },
      {
        id: 4,
        title: 'Đi dự hội',
        content: `Vua mở hội lớn, ai cũng được đi. Dì ghẻ cho Cám đi hội, còn bắt Tấm ở nhà nhặt thóc ra thóc, gạo ra gạo.

Tấm khóc. Bụt lại hiện lên, sai đàn chim sẻ xuống giúp Tấm nhặt thóc.

Bụt bảo Tấm đào bốn cái lọ dưới chân giường lên. Kỳ diệu thay! Trong lọ có quần áo đẹp, hài thêu và một con ngựa hồng.

Tấm mặc đồ đẹp, cưỡi ngựa đi dự hội. Ai nhìn thấy cũng trầm trồ khen đẹp.

Nhà vua nhìn thấy Tấm, đem lòng yêu mến ngay.`,
        image: '👗🐴🎉',
        question: 'Ai giúp Tấm nhặt thóc?',
        options: ['Bà tiên', 'Đàn chim sẻ', 'Cám', 'Dì ghẻ'],
        answer: 1
      },
      {
        id: 5,
        title: 'Chiếc hài rơi',
        content: `Tấm đến hội, ai cũng ngắm nhìn ngưỡng mộ. Nhà vua muốn đến gần làm quen.

Nhưng đến giờ phải về, Tấm vội vàng ra đi vì sợ dì ghẻ biết.

Qua cầu, Tấm vô tình đánh rơi một chiếc hài xuống nước.

Nhà vua nhặt được chiếc hài, thấy nhỏ xinh, tinh xảo. Vua ra lệnh:

"Ai đi vừa chiếc hài này, ta sẽ cưới làm hoàng hậu!"

Bao nhiêu cô gái đến thử, người thì chật, người thì rộng, không ai vừa.

Mẹ con Cám cũng đến thử nhưng chân họ to quá, không thể xỏ vừa.`,
        image: '👠👑💕',
        question: 'Tấm đánh rơi gì khi vội về?',
        options: ['Chiếc nhẫn', 'Chiếc hài', 'Chiếc khăn', 'Bông hoa'],
        answer: 1
      },
      {
        id: 6,
        title: 'Hoàng hậu',
        content: `Cuối cùng, đến lượt Tấm đến thử. Nàng xỏ chân vào, chiếc hài vừa như in!

Tấm lấy chiếc hài còn lại trong túi ra, đi vừa cả đôi.

Nhà vua mừng rỡ, cưới Tấm làm hoàng hậu. Tấm vào cung sống sung sướng.

Dù làm hoàng hậu, Tấm vẫn giữ tấm lòng hiền lành, thường giúp đỡ người nghèo khổ.

🌟 BÀI HỌC: Người hiền lành, chăm chỉ, nhẫn nại sẽ được đền đáp xứng đáng. Hãy luôn giữ tâm hồn trong sáng, không oán hận dù gặp khó khăn.`,
        image: '👸🏰❤️',
        question: 'Cuối cùng Tấm trở thành gì?',
        options: ['Công chúa', 'Hoàng hậu', 'Tiên nữ', 'Cô gái bình thường'],
        answer: 1
      }
    ]
  },

  // ==========================================
  // 6. SƠN TINH THỦY TINH
  // ==========================================
  {
    id: 'son_tinh_thuy_tinh',
    title: 'Sơn Tinh Thủy Tinh',
    titleEn: 'Mountain God and Water God',
    icon: '🏔️',
    cover: '🌊',
    color: 'from-blue-500 to-cyan-500',
    description: 'Truyền thuyết giải thích lũ lụt',
    totalChapters: 5,
    chapters: [
      {
        id: 1,
        title: 'Công chúa Mỵ Nương',
        content: `Đời Hùng Vương thứ mười tám, vua có một người con gái tên là Mỵ Nương. Nàng rất xinh đẹp và hiền hậu.

Vua Hùng muốn kén cho con một người chồng xứng đáng.

Tin loan truyền khắp nơi. Có hai chàng trai tài giỏi đến cầu hôn công chúa.

Một người là Sơn Tinh - thần núi Tản Viên. Chàng có thể vẫy tay làm mọc lên núi đồi, cây cối.

Một người là Thủy Tinh - thần nước biển. Chàng có thể hô mưa gọi gió, dâng nước lên cao.

Cả hai đều tài giỏi phi thường, vua không biết chọn ai.`,
        image: '👸🏔️🌊',
        question: 'Sơn Tinh là thần của gì?',
        options: ['Thần sông', 'Thần núi', 'Thần gió', 'Thần mặt trời'],
        answer: 1
      },
      {
        id: 2,
        title: 'Lễ vật cầu hôn',
        content: `Vua Hùng không biết chọn ai, bèn ra điều kiện:

"Ai mang lễ vật đến trước, ta sẽ gả công chúa cho người đó!"

Lễ vật gồm: một trăm ván cơm nếp, hai trăm nệp bánh chưng, voi chín ngà, gà chín cựa, ngựa chín hồng mao.

Đây đều là những thứ hiếm có, khó tìm.

Sơn Tinh về núi, ra sức tìm kiếm. Chàng có phép thần, nên tìm được đủ lễ vật rất nhanh.

Thủy Tinh cũng vội vã đi tìm. Nhưng những thứ này là vật trên cạn, chàng khó tìm hơn.`,
        image: '🐘🐓🐴',
        question: 'Vua Hùng thách cưới những lễ vật gì?',
        options: ['Vàng bạc châu báu', 'Voi chín ngà, gà chín cựa, ngựa chín hồng mao', 'Ngọc trai, san hô', 'Lụa là gấm vóc'],
        answer: 1
      },
      {
        id: 3,
        title: 'Sơn Tinh thắng cuộc',
        content: `Sáng sớm hôm sau, khi mặt trời chưa mọc, Sơn Tinh đã mang đủ lễ vật đến.

Vua Hùng giữ lời hứa, gả công chúa Mỵ Nương cho Sơn Tinh.

Chàng rước nàng về núi Tản Viên làm vợ.

Thủy Tinh đến sau một bước, không lấy được công chúa. Chàng vô cùng tức giận, uất hận.

Thủy Tinh quyết định đuổi theo, đánh Sơn Tinh để cướp lại Mỵ Nương.

Từ đây, cuộc chiến giữa hai vị thần bắt đầu.`,
        image: '⛰️👰💨',
        question: 'Ai đến trước và cưới được công chúa?',
        options: ['Thủy Tinh', 'Sơn Tinh', 'Cả hai cùng lúc', 'Không ai'],
        answer: 1
      },
      {
        id: 4,
        title: 'Trận chiến long trời',
        content: `Thủy Tinh tức giận, hô mưa gọi gió, dâng nước lên cao ngập cả đồng ruộng, nhà cửa.

Nước mỗi lúc một cao, dâng lên tận chân núi Tản Viên.

Sơn Tinh không hề nao núng. Chàng dùng phép thần làm núi cao thêm. Nước dâng đến đâu, núi cao đến đấy.

Hai bên đánh nhau ròng rã nhiều ngày, nhiều tháng.

Cuối cùng, Thủy Tinh đuối sức, nước rút dần, phải rút quân về biển.

Nhưng Thủy Tinh không chịu thua. Năm nào chàng cũng dâng nước lên đánh Sơn Tinh.`,
        image: '⛰️💨🌊',
        question: 'Khi Thủy Tinh dâng nước, Sơn Tinh làm gì?',
        options: ['Chạy trốn', 'Làm núi cao thêm', 'Đầu hàng', 'Cầu xin Thủy Tinh'],
        answer: 1
      },
      {
        id: 5,
        title: 'Giải thích lũ lụt',
        content: `Từ đó về sau, hàng năm cứ đến mùa mưa tháng bảy, tháng tám, Thủy Tinh lại dâng nước đánh Sơn Tinh.

Nước sông dâng cao, gây ra lũ lụt ở nhiều nơi.

Nhưng Sơn Tinh lần nào cũng chiến thắng, bảo vệ công chúa và người dân.

Câu chuyện này giải thích vì sao Việt Nam hay có lũ lụt vào mùa mưa. Đó chính là do Thủy Tinh dâng nước đánh Sơn Tinh.

🌟 BÀI HỌC: Thiên nhiên rất hùng vĩ với sức mạnh to lớn. Con người cần biết sống hòa hợp với thiên nhiên và bảo vệ môi trường.`,
        image: '🌧️🏔️🏠',
        question: 'Truyện Sơn Tinh Thủy Tinh giải thích hiện tượng gì?',
        options: ['Động đất', 'Lũ lụt hàng năm', 'Núi lửa phun', 'Sấm sét'],
        answer: 1
      }
    ]
  },

  // ==========================================
  // 7. CÓC KIỆN TRỜI
  // ==========================================
  {
    id: 'coc_kien_troi',
    title: 'Cóc Kiện Trời',
    titleEn: 'The Toad Sues Heaven',
    icon: '🐸',
    cover: '☁️',
    color: 'from-yellow-500 to-amber-500',
    description: 'Đoàn kết tạo nên sức mạnh',
    totalChapters: 4,
    chapters: [
      {
        id: 1,
        title: 'Hạn hán kéo dài',
        content: `Ngày xưa, có năm trời làm hạn hán rất lâu. Mấy tháng liền không có một giọt mưa.

Ruộng đồng nứt nẻ, cây cối héo khô, sông suối cạn trơ đáy.

Con người và muôn loài khát nước, đói khổ vô cùng. Nhiều người, nhiều con vật đã chết vì khát.

Ai cũng than khóc, nhưng không biết làm sao.

Cóc thấy tình cảnh ấy, quyết định lên thiên đình kiện Trời, đòi Trời làm mưa cứu muôn loài.

Dù nhỏ bé, Cóc vẫn không sợ hãi, một mình lên đường.`,
        image: '☀️🏜️😢',
        question: 'Vì sao Cóc quyết định kiện Trời?',
        options: ['Vì bị Trời ăn hiếp', 'Vì hạn hán kéo dài, không có mưa', 'Vì muốn nổi tiếng', 'Vì được ai đó nhờ'],
        answer: 1
      },
      {
        id: 2,
        title: 'Đoàn quân của Cóc',
        content: `Trên đường đi, Cóc gặp Cua. Cua hỏi: "Cóc đi đâu thế?"

Cóc nói: "Tôi đi kiện Trời vì Trời không làm mưa." Cua xin theo.

Đi tiếp, gặp Gấu, Cọp, Ong, Cáo, Gà trống. Tất cả đều xin đi cùng.

Mỗi con vật đều có một tài riêng:
- Cua có càng kẹp chắc
- Gấu có sức mạnh vô địch
- Cọp có nanh vuốt sắc
- Ong có nọc độc
- Cáo có mưu trí
- Gà trống biết gáy to

Đoàn quân của Cóc ngày càng đông, cùng tiến lên thiên đình.`,
        image: '🐸🦀🐻🐯🐝🦊🐓',
        question: 'Những con vật nào đi cùng Cóc?',
        options: ['Cua, Gấu, Cọp, Ong, Cáo, Gà trống', 'Chỉ có Cua', 'Cá, Chim, Rắn', 'Không có ai'],
        answer: 0
      },
      {
        id: 3,
        title: 'Đánh tan quân Trời',
        content: `Đến thiên đình, Cóc gõ cửa đòi gặp Ngọc Hoàng. Quân canh cửa cười chê:

"Con Cóc nhỏ bé dám đến đây kiện Trời ư?"

Ngọc Hoàng sai Thần Sấm, Thần Sét ra đánh. Nhưng Cóc đã bố trí sẵn:

- Gấu đứng sau cánh cửa, quật ngã Thần Sấm
- Cọp từ bên hông nhảy ra, vồ Thần Sét
- Ong bay vù vù, đốt khắp nơi
- Cua kẹp chân những ai chạy trốn
- Cáo bày mưu, chỉ huy quân ta

Quân Trời thua chạy tan tác. Ngọc Hoàng thấy vậy phải đích thân ra tiếp.`,
        image: '⚡🐻🐯',
        question: 'Khi quân Trời đánh, các con vật làm gì?',
        options: ['Bỏ chạy', 'Đánh bại quân Trời bằng tài riêng của mỗi con', 'Đầu hàng', 'Van xin'],
        answer: 1
      },
      {
        id: 4,
        title: 'Cóc thắng kiện',
        content: `Ngọc Hoàng hỏi: "Các ngươi muốn gì?"

Cóc đáp: "Muôn tâu Ngọc Hoàng, hạ giới hạn hán đã lâu. Xin Ngọc Hoàng ban mưa cứu muôn loài!"

Ngọc Hoàng thấy Cóc và các bạn dũng cảm, đoàn kết, bèn thuận cho.

Từ đó, Ngọc Hoàng hứa: "Hễ khi nào Cóc nghiến răng kêu, ta sẽ làm mưa ngay!"

Cóc và các bạn vui vẻ trở về. Trời bắt đầu đổ mưa. Muôn loài hoan hỉ.

Từ đó, mỗi khi Cóc nghiến răng kêu là trời đổ mưa. Người ta có câu: "Con Cóc là cậu ông Trời."

🌟 BÀI HỌC: Đoàn kết tạo nên sức mạnh. Dù nhỏ bé, nếu có lòng dũng cảm và biết hợp sức với nhau, ta có thể làm được những việc lớn lao.`,
        image: '🌧️🐸🎉',
        question: 'Từ đó về sau, khi nào thì trời mưa?',
        options: ['Khi Gà gáy', 'Khi Cóc nghiến răng kêu', 'Khi Cọp gầm', 'Khi Ong bay'],
        answer: 1
      }
    ]
  },

  // ==========================================
  // 8. CÂY KHẾ
  // ==========================================
  {
    id: 'cay_khe',
    title: 'Cây Khế',
    titleEn: 'The Star Fruit Tree',
    icon: '⭐',
    cover: '🌳',
    color: 'from-lime-500 to-green-500',
    description: 'Ăn khế trả vàng - Lòng tham sẽ bị trừng phạt',
    totalChapters: 5,
    chapters: [
      {
        id: 1,
        title: 'Hai anh em',
        content: `Ngày xưa, có hai anh em nhà nọ. Cha mẹ mất sớm, để lại cho hai anh em một gia tài khá giả.

Người anh tham lam, khi chia gia tài liền chiếm hết ruộng vườn, nhà cửa, trâu bò. Người em hiền lành chỉ được một mảnh vườn nhỏ có cây khế.

Người em không hề oán trách, cặm cụi làm ăn, chăm sóc cây khế. Cây khế lớn nhanh, mỗi năm cho rất nhiều quả.

Năm ấy, cây khế sai trĩu quả. Người em vui lắm, tính đem bán để có tiền đong gạo.

Nhưng có điều lạ: mỗi sáng ra vườn, anh thấy khế bị ăn mất nhiều quả, chỉ còn hạt vương vãi khắp nơi.`,
        image: '👨‍👦🏠🌳',
        question: 'Người anh chia gia tài như thế nào?',
        options: ['Chia đều cho em', 'Chiếm hết, chỉ cho em cây khế', 'Cho em phần nhiều hơn', 'Hai anh em cùng chung'],
        answer: 1
      },
      {
        id: 2,
        title: 'Chim thần xuất hiện',
        content: `Người em quyết định rình xem ai ăn trộm khế. Nửa đêm, bỗng có một con chim lớn bay đến.

Chim to như cái thuyền, bộ lông óng ánh. Nó đậu trên cây khế, ăn quả ngon lành.

Người em kêu lên: "Chim ơi! Chim ăn hết khế của tôi rồi, tôi biết lấy gì mà sống?"

Chim đáp: "Ăn một quả, trả cục vàng. May túi ba gang, mang đi mà đựng."

Nói rồi chim bay đi. Người em may một cái túi vừa đúng ba gang tay.

Mấy hôm sau, chim lại đến, cõng người em bay qua biển đến một hòn đảo đầy vàng bạc châu báu.`,
        image: '🐦⭐🌙',
        question: 'Chim thần nói gì với người em?',
        options: ['Ăn một quả, trả cục vàng. May túi ba gang', 'Đừng trồng khế nữa', 'Chim sẽ không đến nữa', 'Hãy đuổi chim đi'],
        answer: 0
      },
      {
        id: 3,
        title: 'Túi vàng ba gang',
        content: `Trên đảo, người em chỉ lấy vừa đủ một túi ba gang vàng như chim dặn.

Chim cõng người em về. Từ đó, người em trở nên giàu có, nhưng vẫn sống đơn giản, hay giúp đỡ người nghèo.

Người anh thấy em giàu lên bỗng chốc, liền đến hỏi. Người em thật thà kể hết chuyện.

Người anh tham lam, liền đổi hết gia tài lấy cây khế của em.

Anh ta ngồi chờ dưới gốc khế mỗi đêm, mong chim thần đến.`,
        image: '💰🏝️✨',
        question: 'Người em lấy bao nhiêu vàng?',
        options: ['Lấy đầy thuyền', 'Chỉ lấy vừa đủ túi ba gang', 'Lấy hết vàng trên đảo', 'Không lấy gì'],
        answer: 1
      },
      {
        id: 4,
        title: 'Lòng tham của người anh',
        content: `Quả nhiên, chim thần lại đến ăn khế. Người anh vội nói: "Chim ơi, chim ăn hết khế của tôi rồi!"

Chim cũng đáp: "Ăn một quả, trả cục vàng. May túi ba gang, mang đi mà đựng."

Nhưng người anh tham lam, may một cái túi to gấp mười lần, đến mười hai gang.

Chim cõng anh ta đến đảo vàng. Anh ta nhét đầy túi mười hai gang, còn nhét cả vào túi áo, túi quần.

Nặng quá, chim bay chậm lại, nghiêng ngả.`,
        image: '🐦💰😈',
        question: 'Người anh may túi bao nhiêu gang?',
        options: ['Ba gang như chim dặn', 'Mười hai gang', 'Một gang', 'Không may túi'],
        answer: 1
      },
      {
        id: 5,
        title: 'Kết cục của lòng tham',
        content: `Chim bay qua biển, vì quá nặng, chim bảo người anh bỏ bớt vàng đi.

Người anh tham lam không chịu bỏ. Chim mệt quá, cánh yếu dần.

Cuối cùng, chim không chịu nổi nữa, nghiêng cánh. Người anh và túi vàng rơi xuống biển sâu.

Còn người em, sống cuộc đời bình yên, hạnh phúc bên gia đình. Ai trong vùng cũng yêu mến.

🌟 BÀI HỌC: Lòng tham sẽ dẫn đến tai họa. Hãy biết đủ và sống lương thiện, bạn sẽ được hưởng hạnh phúc thật sự.`,
        image: '🌊💀⚠️',
        question: 'Điều gì xảy ra với người anh tham lam?',
        options: ['Trở nên giàu có', 'Rơi xuống biển vì mang quá nặng', 'Sống hạnh phúc', 'Được chim cứu'],
        answer: 1
      }
    ]
  },

  // ==========================================
  // 9. CON RỒNG CHÁU TIÊN
  // ==========================================
  {
    id: 'con_rong_chau_tien',
    title: 'Con Rồng Cháu Tiên',
    titleEn: 'Children of the Dragon and Fairy',
    icon: '🐉',
    cover: '🧚',
    color: 'from-red-500 to-yellow-500',
    description: 'Truyền thuyết về nguồn gốc dân tộc Việt Nam',
    totalChapters: 5,
    chapters: [
      {
        id: 1,
        title: 'Lạc Long Quân',
        content: `Ngày xưa, ở miền đất Lĩnh Nam có một vị thần tên là Lạc Long Quân. Ngài là con trai của thần Long Nữ, vua của loài rồng dưới biển.

Lạc Long Quân có sức mạnh phi thường, có thể sống dưới nước lẫn trên cạn. Ngài rất yêu thương dân chúng.

Thời đó, vùng đất còn nhiều yêu quái, thú dữ. Lạc Long Quân đã giúp dân trừ Ngư Tinh (quái vật biển), diệt Hồ Tinh (cáo chín đuôi), và đánh đuổi Mộc Tinh (yêu quái rừng).

Ngài còn dạy dân cách trồng lúa nước, dệt vải, xây nhà.

Lạc Long Quân trở thành vị anh hùng được muôn dân kính yêu.`,
        image: '🐉⚔️🌊',
        question: 'Lạc Long Quân là con của ai?',
        options: ['Vua loài chim', 'Thần Long Nữ - vua loài rồng', 'Ngọc Hoàng', 'Một người nông dân'],
        answer: 1
      },
      {
        id: 2,
        title: 'Âu Cơ xinh đẹp',
        content: `Ở vùng núi cao phương Bắc, có nàng Âu Cơ xinh đẹp tuyệt trần. Nàng là con gái của Đế Lai, thuộc dòng dõi thần tiên.

Âu Cơ nghe tiếng vùng đất Lĩnh Nam tươi đẹp, có hoa thơm cỏ lạ, bèn xin cha cho xuống thăm.

Một hôm, Âu Cơ đang dạo chơi bên bờ biển, gặp Lạc Long Quân. Thấy nàng xinh đẹp, dịu dàng, Lạc Long Quân đem lòng yêu mến.

Âu Cơ thấy Lạc Long Quân tài giỏi, hiền hậu, cũng sinh lòng quý mến.

Hai người kết duyên vợ chồng, sống hạnh phúc bên nhau.`,
        image: '🧚👸💕',
        question: 'Âu Cơ là ai?',
        options: ['Một cô gái nghèo', 'Con gái Đế Lai, dòng dõi thần tiên', 'Một nàng tiên cá', 'Con gái Long Nữ'],
        answer: 1
      },
      {
        id: 3,
        title: 'Bọc trăm trứng',
        content: `Sau một thời gian, Âu Cơ sinh ra một cái bọc lạ. Bọc ấy nở ra một trăm quả trứng, mỗi trứng nở ra một người con trai.

Không cần bú mớm mà một trăm người con đều lớn nhanh như thổi, khỏe mạnh, khôi ngô, tuấn tú.

Đó là điều kỳ diệu của Trời Đất ban cho.

Lạc Long Quân và Âu Cơ rất vui mừng, yêu thương các con hết mực.

Một trăm người con là tổ tiên của dân tộc Việt Nam. Vì thế, người Việt tự hào là Con Rồng Cháu Tiên.`,
        image: '🥚👶💯',
        question: 'Âu Cơ sinh ra bao nhiêu người con?',
        options: ['Mười người', 'Năm mươi người', 'Một trăm người', 'Một nghìn người'],
        answer: 2
      },
      {
        id: 4,
        title: 'Chia tay',
        content: `Nhưng Lạc Long Quân là giống Rồng, quen sống ở nước. Âu Cơ là giống Tiên, quen sống ở núi.

Sống với nhau lâu, họ thấy khó hòa hợp. Lạc Long Quân nói:

"Ta là giống Rồng, nàng là giống Tiên. Nước với lửa khó mà ở cùng được lâu. Nay ta đành chia tay."

Âu Cơ đồng ý. Họ chia con: năm mươi người con theo cha xuống biển, năm mươi người con theo mẹ lên núi.

Trước khi chia tay, Lạc Long Quân dặn: "Khi nào có việc gì khó khăn, hãy giúp đỡ lẫn nhau."`,
        image: '💔🏔️🌊',
        question: 'Lạc Long Quân và Âu Cơ chia con như thế nào?',
        options: ['Tất cả theo mẹ', 'Tất cả theo cha', '50 theo cha, 50 theo mẹ', '70 theo cha, 30 theo mẹ'],
        answer: 2
      },
      {
        id: 5,
        title: 'Vua Hùng đầu tiên',
        content: `Người con cả theo mẹ lên vùng đất Phong Châu, được tôn làm vua, lấy hiệu là Hùng Vương.

Hùng Vương lập ra nước Văn Lang - nhà nước đầu tiên của dân tộc Việt Nam.

Từ đó, mười tám đời vua Hùng kế tiếp nhau trị vì đất nước.

Mỗi năm vào ngày mùng 10 tháng 3 âm lịch, con cháu Việt Nam khắp nơi đều hướng về đền Hùng để tưởng nhớ các Vua Hùng.

🌟 BÀI HỌC: Dân tộc Việt Nam có chung một nguồn gốc, đều là con cháu Lạc Long Quân và Âu Cơ - Con Rồng Cháu Tiên. Chúng ta phải đoàn kết, thương yêu nhau như anh em một nhà.`,
        image: '👑🏛️🇻🇳',
        question: 'Vua đầu tiên của nước Văn Lang là ai?',
        options: ['Lạc Long Quân', 'Hùng Vương', 'Đế Lai', 'Âu Cơ'],
        answer: 1
      }
    ]
  },

  // ==========================================
  // 10. THÁNH GIÓNG
  // ==========================================
  {
    id: 'thanh_giong',
    title: 'Thánh Gióng',
    titleEn: 'The Legend of Giong',
    icon: '🐴',
    cover: '⚔️',
    color: 'from-orange-500 to-red-600',
    description: 'Truyền thuyết về người anh hùng đánh giặc Ân',
    totalChapters: 5,
    chapters: [
      {
        id: 1,
        title: 'Đứa bé kỳ lạ',
        content: `Đời Hùng Vương thứ sáu, ở làng Gióng có hai vợ chồng già hiền lành nhưng chưa có con.

Một hôm, bà lão ra đồng, thấy một vết chân to lạ lùng. Bà tò mò đặt chân vào ướm thử.

Về nhà, bà có mang. Mười hai tháng sau mới sinh được một cậu bé khôi ngô.

Nhưng lạ thay, cậu bé lên ba tuổi vẫn không biết nói, biết cười, cũng chẳng biết đi. Suốt ngày cậu chỉ nằm im.

Hai vợ chồng già rất lo lắng, nhưng vẫn yêu thương con hết mực.`,
        image: '👣👶😶',
        question: 'Cậu bé Gióng có điều gì khác thường?',
        options: ['Nói rất giỏi', 'Ba tuổi vẫn không nói, không đi', 'Rất tinh nghịch', 'Biết đọc sách'],
        answer: 1
      },
      {
        id: 2,
        title: 'Tiếng nói đầu tiên',
        content: `Thời ấy, giặc Ân hung bạo từ phương Bắc kéo sang xâm lược. Chúng đông như kiến, mạnh như hổ.

Vua Hùng lo lắng, sai sứ giả đi khắp nơi tìm người tài cứu nước.

Sứ giả đến làng Gióng, rao tin. Nghe tiếng rao, cậu bé bỗng cất tiếng nói:

"Mẹ ơi! Mẹ ra mời sứ giả vào đây cho con!"

Hai vợ chồng sửng sốt mừng rỡ. Sứ giả vào nhà, cậu bé nói:

"Ông về tâu với vua, rèn cho ta một con ngựa sắt, một chiếc roi sắt, một áo giáp sắt. Ta sẽ đánh tan giặc!"`,
        image: '📯👦⚔️',
        question: 'Gióng nói câu đầu tiên khi nào?',
        options: ['Khi được một tuổi', 'Khi nghe sứ giả rao tin tìm người đánh giặc', 'Khi được mười tuổi', 'Khi bố mẹ dạy nói'],
        answer: 1
      },
      {
        id: 3,
        title: 'Gióng lớn nhanh',
        content: `Sứ giả về tâu vua. Vua cho rèn ngựa sắt, roi sắt, áo giáp sắt.

Từ hôm ấy, Gióng lớn nhanh như thổi. Cơm ăn bao nhiêu cũng không đủ, áo mặc bao nhiêu cũng chật.

Bà con hàng xóm nghe chuyện, kẻ góp gạo, người góp cơm, nuôi Gióng đánh giặc.

Chỉ trong ít ngày, Gióng trở thành một tráng sĩ cao lớn, mình đồng da sắt.

Khi vũ khí và áo giáp sắt được mang đến, Gióng vươn vai một cái, trở thành người khổng lồ uy nghiêm.`,
        image: '🍚📈💪',
        question: 'Gióng lớn nhanh nhờ đâu?',
        options: ['Uống thuốc tiên', 'Bà con góp gạo, góp cơm nuôi', 'Tự lớn lên', 'Được thần giúp'],
        answer: 1
      },
      {
        id: 4,
        title: 'Đánh tan giặc Ân',
        content: `Gióng mặc áo giáp sắt, cầm roi sắt, nhảy lên ngựa sắt. Ngựa phun lửa phi như bay ra trận.

Gióng xông vào đánh giặc. Roi sắt vung đến đâu, giặc tan đến đấy.

Đánh một hồi, roi sắt gãy. Gióng nhổ từng bụi tre ven đường quật vào quân giặc.

Giặc Ân chết như rạ, kinh hoàng bỏ chạy tán loạn.

Gióng đuổi giặc đến chân núi Sóc Sơn. Quân giặc tan tành, không còn một tên.`,
        image: '🐴🔥⚔️',
        question: 'Khi roi sắt gãy, Gióng dùng gì đánh giặc?',
        options: ['Roi mới', 'Bụi tre', 'Gươm báu', 'Đá núi'],
        answer: 1
      },
      {
        id: 5,
        title: 'Bay về trời',
        content: `Đánh tan giặc, Gióng cởi áo giáp sắt để lại, rồi cả người lẫn ngựa từ từ bay lên trời.

Vua nhớ công ơn, phong Gióng là "Phù Đổng Thiên Vương" và lập đền thờ ở làng Gióng.

Những bụi tre bị lửa ngựa sắt cháy xém, từ đó có màu vàng óng - người ta gọi là tre đằng ngà.

Những ao hồ do chân ngựa sắt tạo thành vẫn còn đến ngày nay.

🌟 BÀI HỌC: Tinh thần yêu nước, đoàn kết là sức mạnh vô địch. Khi Tổ quốc cần, mỗi người dân đều sẵn sàng đứng lên bảo vệ đất nước.`,
        image: '🏔️☁️🌟',
        question: 'Sau khi đánh tan giặc, Gióng đi đâu?',
        options: ['Về làng', 'Vào cung vua', 'Bay lên trời', 'Đi du ngoạn'],
        answer: 2
      }
    ]
  },

  // ==========================================
  // 11. SỰ TÍCH DƯA HẤU
  // ==========================================
  {
    id: 'su_tich_dua_hau',
    title: 'Sự Tích Dưa Hấu',
    titleEn: 'The Legend of Watermelon',
    icon: '🍉',
    cover: '🏝️',
    color: 'from-green-500 to-red-500',
    description: 'Truyện về Mai An Tiêm và lòng kiên trì',
    totalChapters: 5,
    chapters: [
      {
        id: 1,
        title: 'Mai An Tiêm',
        content: `Đời vua Hùng Vương, có chàng thanh niên tên là Mai An Tiêm. Chàng được vua nhận làm con nuôi từ nhỏ.

An Tiêm thông minh, tài giỏi, được vua yêu quý, ban cho nhiều bổng lộc.

Chàng lấy vợ và có một con trai, sống cuộc đời sung sướng.

Nhưng An Tiêm có tính kiêu ngạo. Một lần, chàng nói: "Của cải ta có được là do tài năng của ta, không phải do vua ban."

Có kẻ ganh ghét, đem lời ấy tâu lên vua.`,
        image: '👨👑💰',
        question: 'Mai An Tiêm là ai?',
        options: ['Con ruột vua Hùng', 'Con nuôi vua Hùng', 'Một nông dân nghèo', 'Một thương gia'],
        answer: 1
      },
      {
        id: 2,
        title: 'Bị đày ra đảo',
        content: `Vua Hùng nghe lời tâu, vô cùng tức giận. Ngài ra lệnh đày Mai An Tiêm cùng vợ con ra một hòn đảo hoang giữa biển.

Hòn đảo toàn cát với đá, không có cây cỏ, không có nước ngọt.

Vua chỉ cho mang theo ít lương thực và dụng cụ đơn giản.

An Tiêm hiểu mình đã sai, nhưng không nản lòng. Chàng nói với vợ:

"Đừng buồn. Trời sinh voi, trời sinh cỏ. Ta hãy cố gắng, sẽ có cách sống."

Gia đình An Tiêm bắt đầu cuộc sống trên đảo hoang.`,
        image: '🏝️😢⛵',
        question: 'Vua Hùng phạt An Tiêm như thế nào?',
        options: ['Bỏ tù', 'Đày ra đảo hoang', 'Phạt tiền', 'Đuổi khỏi kinh thành'],
        answer: 1
      },
      {
        id: 3,
        title: 'Hạt giống lạ',
        content: `Một hôm, An Tiêm thấy một đàn chim lạ bay đến đảo. Chúng ăn một loại quả rồi nhả hạt xuống cát.

An Tiêm nhặt những hạt ấy, gieo xuống đất ẩm gần suối ngầm mà chàng đã tìm được.

Chàng chăm sóc cẩn thận, tưới nước mỗi ngày.

Ít lâu sau, hạt nảy mầm, mọc thành dây leo xanh tốt.

Dây ra hoa, kết quả. Quả tròn to, vỏ xanh bóng. An Tiêm hồi hộp chờ quả chín.`,
        image: '🐦🌱🌿',
        question: 'An Tiêm có được hạt giống từ đâu?',
        options: ['Mua từ thương gia', 'Từ đàn chim nhả hạt', 'Vua ban cho', 'Tự tìm trong rừng'],
        answer: 1
      },
      {
        id: 4,
        title: 'Quả dưa hấu',
        content: `Khi quả chín, An Tiêm bổ ra thử. Bên trong ruột đỏ au, vị ngọt mát, thơm lừng!

An Tiêm vui mừng khôn xiết. Chàng đặt tên là "dưa hấu" vì quả to như quả bầu, vị ngọt hấp dẫn.

Chàng trồng thêm nhiều dưa. Năm sau, đảo hoang phủ kín dây dưa xanh mướt.

An Tiêm khắc tên mình lên vỏ dưa, thả xuống biển.

Các thuyền buôn nhặt được, nếm thử thấy ngon, bèn tìm đến đảo của An Tiêm để đổi lương thực, vải vóc lấy dưa.`,
        image: '🍉😋✨',
        question: 'Ruột quả dưa hấu có màu gì?',
        options: ['Màu vàng', 'Màu trắng', 'Màu đỏ', 'Màu xanh'],
        answer: 2
      },
      {
        id: 5,
        title: 'Được tha tội',
        content: `Tin đồn về loại quả ngon lành lan đến kinh thành. Vua Hùng cũng được nếm thử.

Thấy dưa ngon, đọc tên An Tiêm trên vỏ, vua nhớ đến người con nuôi năm xưa.

Vua ân hận, sai người ra đảo đón gia đình An Tiêm về.

An Tiêm quỳ tạ tội, thưa: "Con đã hiểu, mọi thứ con có được đều nhờ ơn vua và sự giúp đỡ của mọi người."

Vua tha tội, phong thưởng cho An Tiêm. Giống dưa hấu từ đó được trồng khắp nơi.

🌟 BÀI HỌC: Đừng kiêu ngạo về những gì mình có. Lòng kiên trì, chịu khó sẽ giúp ta vượt qua mọi khó khăn.`,
        image: '👑🍉❤️',
        question: 'Bài học từ câu chuyện là gì?',
        options: ['Phải kiêu ngạo để thành công', 'Đừng kiêu ngạo, hãy kiên trì', 'Không cần cố gắng', 'Phải có nhiều tiền'],
        answer: 1
      }
    ]
  },

  // ==========================================
  // 12. SỰ TÍCH BÁNH CHƯNG BÁNH DÀY
  // ==========================================
  {
    id: 'banh_chung_banh_day',
    title: 'Bánh Chưng Bánh Dày',
    titleEn: 'The Legend of Chung and Day Cakes',
    icon: '🎍',
    cover: '🍚',
    color: 'from-green-600 to-emerald-500',
    description: 'Sự tích bánh truyền thống ngày Tết',
    totalChapters: 5,
    chapters: [
      {
        id: 1,
        title: 'Cuộc thi chọn vua',
        content: `Đời Hùng Vương thứ sáu, vua đã già yếu, muốn chọn người nối ngôi.

Vua có hai mươi người con trai, ai cũng tài giỏi. Vua không biết chọn ai, bèn ra thử thách:

"Nhân dịp lễ Tiên Vương, ai dâng lên được món ăn ngon nhất, ta sẽ truyền ngôi."

Các hoàng tử háo hức đi tìm sơn hào hải vị. Họ lên rừng săn thú quý, xuống biển tìm hải sản ngon.

Riêng hoàng tử thứ mười tám tên là Lang Liêu, mẹ mất sớm, không có ai giúp đỡ. Chàng lo lắng không biết phải làm sao.`,
        image: '👑🏆🤔',
        question: 'Vua Hùng thử thách các hoàng tử điều gì?',
        options: ['Ai khỏe nhất', 'Ai dâng món ăn ngon nhất', 'Ai học giỏi nhất', 'Ai đẹp trai nhất'],
        answer: 1
      },
      {
        id: 2,
        title: 'Giấc mơ của Lang Liêu',
        content: `Đêm ấy, Lang Liêu nằm mơ thấy một ông tiên hiện ra và dạy:

"Trong trời đất, không gì quý bằng gạo. Gạo là thứ nuôi sống con người."

"Hãy lấy gạo nếp làm hai loại bánh: một bánh hình vuông tượng trưng cho Đất, một bánh hình tròn tượng trưng cho Trời."

Lang Liêu tỉnh dậy, vui mừng hiểu ra ý nghĩa của giấc mơ.

Chàng lấy gạo nếp, đậu xanh, thịt lợn, lá dong để làm bánh.`,
        image: '💭🧓✨',
        question: 'Ông tiên dạy Lang Liêu dùng gì làm bánh?',
        options: ['Thịt quý', 'Gạo nếp', 'Hải sản', 'Trái cây'],
        answer: 1
      },
      {
        id: 3,
        title: 'Làm bánh Chưng, bánh Dày',
        content: `Lang Liêu lấy gạo nếp vo sạch, ngâm nước. Đậu xanh đãi vỏ, thịt lợn thái miếng.

Chàng lấy lá dong rửa sạch, gói gạo, đậu, thịt thành hình vuông. Đó là bánh Chưng, tượng trưng cho Đất.

Rồi chàng đồ gạo nếp chín, giã nhuyễn, nặn thành hình tròn. Đó là bánh Dày, tượng trưng cho Trời.

Lang Liêu làm bánh suốt đêm, mong sao vừa ý vua cha.

Khi bánh chưng chín, mùi thơm nức lan tỏa khắp nơi.`,
        image: '🍚🌿🔥',
        question: 'Bánh Chưng hình gì, tượng trưng cho gì?',
        options: ['Hình tròn - Trời', 'Hình vuông - Đất', 'Hình tam giác - Núi', 'Hình chữ nhật - Sông'],
        answer: 1
      },
      {
        id: 4,
        title: 'Lễ dâng bánh',
        content: `Ngày lễ Tiên Vương, các hoàng tử mang lễ vật đến dâng.

Hoàng tử cả dâng nem công chả phượng. Hoàng tử thứ hai dâng sơn hào hải vị. Ai cũng có món ngon hiếm lạ.

Đến lượt Lang Liêu, chàng chỉ dâng hai loại bánh đơn sơ.

Vua Hùng nếm thử. Bánh Chưng dẻo thơm, nhân đậm đà. Bánh Dày mềm mịn, ngọt bùi.

Vua hỏi ý nghĩa. Lang Liêu thưa: "Bánh Chưng vuông là Đất, bánh Dày tròn là Trời. Con dâng lên với lòng hiếu thảo và biết ơn Trời Đất."`,
        image: '🎁👑😊',
        question: 'Các hoàng tử khác dâng gì?',
        options: ['Bánh đơn giản', 'Sơn hào hải vị, món quý', 'Hoa quả', 'Vải lụa'],
        answer: 1
      },
      {
        id: 5,
        title: 'Lang Liêu được chọn',
        content: `Vua Hùng cảm động, phán: "Bánh của Lang Liêu tuy đơn sơ nhưng chứa đựng ý nghĩa sâu xa."

"Bánh này vừa ngon, vừa thể hiện lòng biết ơn Trời Đất, tổ tiên. Đây mới là món ăn quý nhất!"

Vua quyết định truyền ngôi cho Lang Liêu.

Từ đó, mỗi dịp Tết đến, người Việt Nam đều gói bánh Chưng, làm bánh Dày để dâng cúng tổ tiên và quây quần bên gia đình.

🌟 BÀI HỌC: Quý trọng những gì gần gũi, giản dị trong cuộc sống. Lòng hiếu thảo, biết ơn mới là điều quý giá nhất.`,
        image: '👨‍👩‍👦🎍🏠',
        question: 'Vì sao vua chọn Lang Liêu?',
        options: ['Vì bánh đắt tiền nhất', 'Vì bánh có ý nghĩa sâu xa về lòng hiếu thảo', 'Vì Lang Liêu khỏe nhất', 'Vì Lang Liêu là con cả'],
        answer: 1
      }
    ]
  },

  // ==========================================
  // 13. HAI CÔ GÁI VÀ CỤC BÔNG
  // ==========================================
  {
    id: 'hai_co_gai_cuc_bong',
    title: 'Hai Cô Gái và Cục Bông',
    titleEn: 'Two Girls and the Cotton',
    icon: '☁️',
    cover: '👧',
    color: 'from-pink-400 to-purple-500',
    description: 'Lòng tốt sẽ được đền đáp',
    totalChapters: 4,
    chapters: [
      {
        id: 1,
        title: 'Hai chị em',
        content: `Ngày xưa, có hai chị em nhà nọ. Chị tên là Lý, em tên là Hoa.

Lý lười biếng, kiêu căng, suốt ngày chỉ biết ăn diện. Còn Hoa thì chăm chỉ, hiền lành, hay giúp đỡ mọi người.

Một hôm, mẹ sai hai chị em đi hái bông vải trên núi. Lý lười không muốn đi, nhưng vì ham có vải mới nên đành theo.

Hai chị em lên núi. Hoa chăm chỉ hái bông, còn Lý chỉ đứng ngắm cảnh, than mệt.

Chiều đến, Hoa hái được đầy gùi bông trắng xóa.`,
        image: '👩‍👧☁️🏔️',
        question: 'Tính cách của Hoa như thế nào?',
        options: ['Lười biếng', 'Chăm chỉ, hiền lành', 'Kiêu căng', 'Hay ghen tị'],
        answer: 1
      },
      {
        id: 2,
        title: 'Bà cụ và cục bông',
        content: `Trên đường về, Hoa gặp một bà cụ già yếu đang ngồi bên vệ đường. Bà cụ rách rưới, đói lả.

Hoa động lòng thương, lấy nắm cơm mang theo chia cho bà cụ ăn.

Bà cụ ăn xong, nói: "Cháu ơi, bà đổi cho cháu cục bông này. Cháu cầm về, nhớ đừng mở ra xem."

Hoa nhận cục bông xù nhỏ như nắm tay, cảm ơn bà cụ rồi đi về.

Còn Lý thấy vậy, cười chê em dại, đổi cả gùi bông lấy cục bông bé tẹo.`,
        image: '👵🤝❤️',
        question: 'Hoa đã làm gì khi gặp bà cụ?',
        options: ['Bỏ đi', 'Chia cơm cho bà cụ', 'Cười chê bà', 'Xin bà tiền'],
        answer: 1
      },
      {
        id: 3,
        title: 'Phép màu của cục bông',
        content: `Về đến nhà, Hoa đặt cục bông xuống góc nhà rồi đi nấu cơm.

Sáng hôm sau, cả nhà kinh ngạc: cục bông nhỏ đã biến thành một đống bông to như núi, trắng tinh, mịn màng!

Mẹ đem bông đi bán, đổi được nhiều gạo, tiền, vải vóc. Từ đó gia đình Hoa không còn nghèo khó.

Lý thấy vậy, ganh tị vô cùng. Cô ta quyết định lên núi tìm bà cụ để xin đổi bông như em.`,
        image: '☁️✨💰',
        question: 'Điều gì xảy ra với cục bông của Hoa?',
        options: ['Biến mất', 'Biến thành đống bông to như núi', 'Vẫn như cũ', 'Bay đi'],
        answer: 1
      },
      {
        id: 4,
        title: 'Kết cục của Lý',
        content: `Lý lên núi, cũng gặp bà cụ. Nhưng Lý không chia cơm, lại còn mắng bà.

Bà cụ cũng đưa cho Lý một cục bông, dặn không được mở ra.

Trên đường về, Lý tò mò, nóng lòng muốn xem thử có gì trong cục bông. Cô ta mở ra xem.

Tức thì, cục bông biến thành một bầy ong vò vẽ, đốt Lý chạy khắp nơi. Từ đó Lý biết hối hận.

🌟 BÀI HỌC: Lòng tốt, sự chăm chỉ sẽ được đền đáp. Còn kẻ tham lam, ích kỷ sẽ gặp quả báo. Hãy luôn giúp đỡ người khó khăn hơn mình.`,
        image: '🐝😱⚡',
        question: 'Vì sao Lý bị ong đốt?',
        options: ['Vì giúp đỡ bà cụ', 'Vì tham lam và không nghe lời dặn', 'Vì chăm chỉ', 'Vì tốt bụng'],
        answer: 1
      }
    ]
  },

  // ==========================================
  // 14. BA CÔ GÁI
  // ==========================================
  {
    id: 'ba_co_gai',
    title: 'Ba Cô Gái',
    titleEn: 'The Three Daughters',
    icon: '👩‍👩‍👧',
    cover: '🏠',
    color: 'from-rose-500 to-pink-600',
    description: 'Câu chuyện về lòng hiếu thảo với mẹ',
    totalChapters: 4,
    chapters: [
      {
        id: 1,
        title: 'Bà mẹ và ba cô con gái',
        content: `Ngày xưa, có một bà mẹ nghèo nuôi ba cô con gái. Bà tần tảo sớm hôm để nuôi các con khôn lớn.

Ba cô gái đều xinh đẹp, được mẹ yêu thương, dạy dỗ chu đáo.

Khi ba cô đến tuổi lấy chồng, cô cả lấy một người buôn vải, cô hai lấy một người buôn muối, còn cô út lấy một người nông dân nghèo.

Bà mẹ ở lại một mình trong căn nhà cũ.

Năm tháng trôi qua, bà ngày càng già yếu. Bà nhớ các con, muốn gặp mặt.`,
        image: '👵👩👩👧',
        question: 'Cô út lấy ai?',
        options: ['Người buôn vải', 'Người buôn muối', 'Người nông dân nghèo', 'Một ông quan'],
        answer: 2
      },
      {
        id: 2,
        title: 'Bà mẹ đi thăm con',
        content: `Bà mẹ quyết định đi thăm các con. Bà đến nhà cô cả đầu tiên.

Cô cả tiếp mẹ trong căn nhà rộng rãi. Nhưng suốt ngày cô bận rộn với hàng vải, không có thời gian nói chuyện với mẹ.

Bà mẹ buồn, đi đến nhà cô thứ hai.

Cô thứ hai sống trong ngôi nhà đẹp đẽ. Nhưng cô cũng bận rộn đếm tiền, bán muối, chẳng hỏi han mẹ được mấy câu.

Bà mẹ lại buồn, quyết định đi thăm cô út.`,
        image: '🏠💔😢',
        question: 'Cô cả và cô hai đối xử với mẹ như thế nào?',
        options: ['Rất quan tâm', 'Bận rộn, không quan tâm mẹ', 'Cho mẹ nhiều tiền', 'Cùng mẹ nói chuyện'],
        answer: 1
      },
      {
        id: 3,
        title: 'Nhà cô út',
        content: `Cô út sống trong căn nhà nhỏ đơn sơ. Thấy mẹ đến, cô vui mừng chạy ra đón:

"Mẹ ơi! Con nhớ mẹ quá! Mẹ vào nhà nghỉ ngơi đi!"

Tuy nghèo khó, cô út vẫn dọn cơm thơm, canh ngọt cho mẹ ăn. Cô ngồi bên mẹ, hỏi han ân cần.

"Mẹ có mệt không? Mẹ ở đây với con nhé!"

Cô chăm sóc mẹ chu đáo, tắm rửa, giặt áo cho mẹ. Bà mẹ cảm động rơi nước mắt vì hạnh phúc.`,
        image: '🏚️❤️👨‍👩‍👧',
        question: 'Cô út đã làm gì khi mẹ đến?',
        options: ['Không tiếp mẹ', 'Đón mẹ vui vẻ, chăm sóc ân cần', 'Xin tiền mẹ', 'Bận rộn làm việc'],
        answer: 1
      },
      {
        id: 4,
        title: 'Phần thưởng xứng đáng',
        content: `Ít lâu sau, có ông tiên đi qua. Ông thấy cô út nghèo mà hiếu thảo, bèn ban phép:

Cánh đồng của cô út năm ấy trúng mùa lớn. Lúa vàng óng, trĩu hạt. Gia đình cô từ đó no đủ.

Còn hai cô chị, vì không quan tâm mẹ, gặp thất bại trong làm ăn. Họ hiểu ra và hối hận.

Họ đến xin lỗi mẹ và em gái, từ đó biết quan tâm mẹ già hơn.

🌟 BÀI HỌC: Lòng hiếu thảo không cần giàu sang, chỉ cần tấm lòng chân thành. Hãy luôn yêu thương, chăm sóc cha mẹ khi còn có thể.`,
        image: '🌾✨👨‍👩‍👧‍👦',
        question: 'Bài học từ câu chuyện là gì?',
        options: ['Phải giàu có mới hiếu thảo được', 'Lòng hiếu thảo chân thành sẽ được đền đáp', 'Không cần quan tâm cha mẹ', 'Chỉ cần cho tiền là đủ'],
        answer: 1
      }
    ]
  },

  // ==========================================
  // 15. CHÚ CUỘI CUNG TRĂNG
  // ==========================================
  {
    id: 'chu_cuoi_cung_trang',
    title: 'Chú Cuội Cung Trăng',
    titleEn: 'Cuoi and the Moon',
    icon: '🌙',
    cover: '🌳',
    color: 'from-indigo-500 to-purple-600',
    description: 'Sự tích chú Cuội ngồi gốc cây đa trên cung trăng',
    totalChapters: 5,
    chapters: [
      {
        id: 1,
        title: 'Chàng tiều phu Cuội',
        content: `Ngày xưa, có chàng tiều phu tên là Cuội. Chàng mồ côi từ nhỏ, sống bằng nghề đốn củi.

Cuội thật thà, tốt bụng, hay giúp đỡ mọi người. Nhưng chàng có tật hay nói dối để chọc cười.

Một hôm, Cuội vào rừng đốn củi. Chàng vô tình gặp hang cọp.

Cọp mẹ không có nhà. Cuội thấy bốn con cọp con, bèn lấy đá đập chết.

Cuội sợ cọp mẹ về trả thù, vội leo lên cây đa gần đó ẩn nấp.`,
        image: '🪓🌲🐯',
        question: 'Cuội làm nghề gì?',
        options: ['Đánh cá', 'Tiều phu (đốn củi)', 'Buôn bán', 'Làm ruộng'],
        answer: 1
      },
      {
        id: 2,
        title: 'Cây thuốc thần',
        content: `Cọp mẹ về, thấy con chết, gầm lên đau đớn. Rồi nó chạy đi đâu đó.

Lát sau, cọp mẹ quay về, miệng ngậm một nắm lá cây lạ. Nó nhai lá, phun vào miệng các con.

Kỳ diệu thay! Bốn con cọp con sống dậy, chạy nhảy vui vẻ!

Cuội kinh ngạc. Đợi cọp đi, chàng tìm đến chỗ cây lạ ấy, đào cả gốc mang về.

Từ đó, Cuội dùng lá cây chữa bệnh cho dân làng. Ai ốm đau gì, nhai lá là khỏi.`,
        image: '🌿🐯✨',
        question: 'Lá cây thần có tác dụng gì?',
        options: ['Biến thành vàng', 'Chữa bệnh, cứu người', 'Làm người bay', 'Thành tiên'],
        answer: 1
      },
      {
        id: 3,
        title: 'Cưới vợ',
        content: `Một hôm, có cô gái con nhà phú ông đi qua sông, chẳng may bị rơi xuống nước chết đuối.

Cuội dùng lá cây thần cứu sống cô gái. Phú ông cảm ơn, gả con gái cho Cuội.

Vợ Cuội tên là Hằng, xinh đẹp nhưng hay quên. Cuội dặn: "Đừng bao giờ tưới phân vào gốc cây thuốc, cây sẽ bay mất!"

Hằng vâng lời chồng, nhưng cô có tính hay quên.

Cuội trồng cây thuốc thần trước sân nhà, hàng ngày chăm sóc cẩn thận.`,
        image: '💑🌳🏠',
        question: 'Cuội dặn vợ điều gì?',
        options: ['Không được tưới nước', 'Không được tưới phân vào gốc cây', 'Không được hái lá', 'Không được nhìn cây'],
        answer: 1
      },
      {
        id: 4,
        title: 'Cây thuốc bay lên trời',
        content: `Một hôm Cuội đi vắng, Hằng ở nhà dọn dẹp. Cô quên lời chồng dặn, đổ cả thùng phân vào gốc cây thuốc.

Tức thì, mặt đất rung chuyển. Cây thuốc thần bật rễ, từ từ bay lên trời!

Cuội về đến nhà, thấy cây đang bay, vội nhảy lên bám vào rễ cây.

Nhưng muộn rồi! Cây cứ bay lên cao mãi, mang theo cả Cuội.

Cuối cùng, cây dừng lại trên cung trăng. Cuội ngồi trên đó, không thể trở về.`,
        image: '🌳🚀🌙',
        question: 'Vì sao cây thuốc bay lên trời?',
        options: ['Vì Cuội muốn bay', 'Vì vợ Cuội tưới phân vào gốc', 'Vì trời muốn lấy cây', 'Vì cây già rồi'],
        answer: 1
      },
      {
        id: 5,
        title: 'Chú Cuội cung trăng',
        content: `Từ đó, Cuội sống mãi trên cung trăng, ngồi dưới gốc cây đa.

Mỗi đêm rằm, nhìn lên mặt trăng sáng, ta có thể thấy bóng chú Cuội ngồi dưới gốc cây.

Cuội nhớ nhà, nhớ vợ, nhớ quê hương. Những đêm trăng sáng, chàng ngồi buồn, mong được trở về.

Trẻ em Việt Nam có bài đồng dao:
"Chú Cuội ngồi gốc cây đa,
Thả trâu ăn lúa, gọi cha ời ời..."

🌟 BÀI HỌC: Hãy nhớ kỹ lời người khác dặn dò. Sự đãng trí, hay quên có thể gây ra hậu quả đáng tiếc.`,
        image: '🌕👤🌳',
        question: 'Chú Cuội bây giờ ở đâu?',
        options: ['Ở dưới biển', 'Trên cung trăng', 'Trong rừng', 'Về nhà rồi'],
        answer: 1
      }
    ]
  }
];

// Lấy truyện theo ID
export const getStory = (id) => STORIES.find(s => s.id === id);

// Lấy tất cả truyện
export const getAllStories = () => STORIES;

export default STORIES;
