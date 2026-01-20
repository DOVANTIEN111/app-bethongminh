// ============================================
// STORY DATA - Truyện cổ tích mở khóa
// ============================================

export const STORIES = [
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
        content: `Ngày xửa ngày xưa, có một cậu bé tên là Tích Chu sống cùng bà ngoại trong một ngôi nhà nhỏ ven rừng.

Bà ngoại của Tích Chu rất yêu thương cậu. Hàng ngày, bà nấu cơm, giặt áo, chăm sóc Tích Chu chu đáo.

Nhưng Tích Chu lại là một cậu bé ham chơi. Cậu suốt ngày chạy nhảy ngoài đồng, không giúp đỡ bà việc gì.`,
        image: '👦🏠👵',
        question: 'Tích Chu sống cùng ai?',
        options: ['Bố mẹ', 'Bà ngoại', 'Ông nội', 'Một mình'],
        answer: 1
      },
      {
        id: 2,
        title: 'Bà ốm nặng',
        content: `Một hôm, bà ngoại bị ốm rất nặng. Bà nằm trên giường, không thể dậy nấu cơm được.

Bà gọi Tích Chu: "Cháu ơi, bà khát nước quá. Cháu lấy cho bà chén nước được không?"

Nhưng Tích Chu đang mải chơi ngoài sân. Cậu trả lời: "Bà đợi con chút, con đang chơi!"

Rồi Tích Chu tiếp tục chơi, quên mất lời bà dặn.`,
        image: '🛏️😢💧',
        question: 'Bà nhờ Tích Chu làm gì?',
        options: ['Nấu cơm', 'Lấy nước', 'Quét nhà', 'Đi chợ'],
        answer: 1
      },
      {
        id: 3,
        title: 'Bà hóa thành chim',
        content: `Bà ngoại khát nước quá, chờ mãi không thấy Tích Chu mang nước đến.

Bỗng nhiên, một điều kỳ lạ xảy ra. Bà ngoại biến thành một con chim nhỏ!

Con chim bay ra cửa sổ, kêu lên: "Tích Chu ơi! Tích Chu ơi! Nước đâu? Nước đâu?"

Tích Chu nghe tiếng chim, chạy vào nhà thì không thấy bà đâu. Cậu khóc òa lên.`,
        image: '🐦😭✨',
        question: 'Bà ngoại biến thành con gì?',
        options: ['Con mèo', 'Con chim', 'Con bướm', 'Con cá'],
        answer: 1
      },
      {
        id: 4,
        title: 'Hành trình tìm bà',
        content: `Tích Chu hối hận vô cùng. Cậu quyết định đi tìm bà.

Cậu đi qua núi cao, qua rừng sâu, hỏi thăm khắp nơi: "Có ai thấy con chim của bà cháu không?"

Cuối cùng, một ông tiên xuất hiện và nói: "Ta biết bà cháu ở đâu. Nhưng cháu phải lấy được nước từ suối thần trên đỉnh núi cao kia."

Tích Chu không ngại khó khăn, leo lên đỉnh núi lấy nước thần.`,
        image: '🏔️🧓💫',
        question: 'Tích Chu phải lấy gì để cứu bà?',
        options: ['Hoa thần', 'Nước suối thần', 'Trái cây thần', 'Lá thuốc'],
        answer: 1
      },
      {
        id: 5,
        title: 'Đoàn tụ',
        content: `Sau bao ngày vất vả, Tích Chu mang được nước suối thần về.

Cậu tìm thấy con chim nhỏ và cho chim uống nước. Kỳ diệu thay, con chim biến trở lại thành bà ngoại!

Bà ngoại ôm Tích Chu vào lòng: "Cháu ngoan của bà!"

Từ đó, Tích Chu trở thành một cậu bé hiếu thảo, luôn yêu thương và chăm sóc bà.

🌟 BÀI HỌC: Hãy luôn yêu thương và hiếu thảo với ông bà, cha mẹ nhé các con!`,
        image: '👵❤️👦',
        question: 'Bài học của câu chuyện là gì?',
        options: ['Chăm chỉ học hành', 'Hiếu thảo với ông bà', 'Không nói dối', 'Chia sẻ với bạn bè'],
        answer: 1
      }
    ]
  },
  {
    id: 'tam_cam',
    title: 'Tấm Cám',
    titleEn: 'The Story of Tam and Cam',
    icon: '👸',
    cover: '🎃',
    color: 'from-pink-500 to-rose-500',
    description: 'Người tốt sẽ được đền đáp',
    totalChapters: 6,
    chapters: [
      {
        id: 1,
        title: 'Cô Tấm mồ côi',
        content: `Ngày xưa, có một cô gái tên là Tấm. Mẹ Tấm mất sớm, cha lấy vợ kế.

Dì ghẻ sinh được một cô con gái tên là Cám. Dì ghẻ rất thương Cám nhưng lại bắt Tấm làm việc vất vả.

Tấm phải dậy sớm nấu cơm, quét nhà, chăn trâu, còn Cám thì được ăn ngon, mặc đẹp.

Dù vất vả, Tấm vẫn luôn hiền lành, chăm chỉ và không oán trách ai.`,
        image: '👧😢🧹',
        question: 'Tấm sống với ai?',
        options: ['Mẹ đẻ', 'Dì ghẻ và Cám', 'Ông bà', 'Một mình'],
        answer: 1
      },
      {
        id: 2,
        title: 'Con cá bống',
        content: `Một hôm, dì ghẻ sai Tấm và Cám đi bắt tôm cá. Ai bắt được nhiều hơn sẽ được thưởng.

Tấm chăm chỉ bắt được đầy giỏ cá. Nhưng Cám lười biếng, lừa Tấm đi gội đầu rồi trút hết cá sang giỏ mình.

Tấm khóc. Trong giỏ chỉ còn một con cá bống nhỏ. Tấm mang cá bống về nuôi trong giếng.

Hàng ngày, Tấm mang cơm ra cho cá bống ăn và hát: "Bống bống bang bang..."`,
        image: '🐟💧🎵',
        question: 'Tấm nuôi cá bống ở đâu?',
        options: ['Trong ao', 'Trong giếng', 'Trong chậu', 'Trong sông'],
        answer: 1
      },
      {
        id: 3,
        title: 'Bụt hiện lên',
        content: `Cám phát hiện Tấm nuôi cá bống. Cám lừa Tấm đi chăn trâu xa, rồi bắt cá bống giết thịt.

Tấm về không thấy cá bống, khóc rất nhiều.

Bỗng nhiên, Bụt hiện lên và nói: "Con đừng khóc. Hãy tìm xương cá, cho vào bốn cái lọ, chôn dưới bốn chân giường."

Tấm làm theo lời Bụt dặn.`,
        image: '✨🧓🏻💫',
        question: 'Ai đã giúp đỡ Tấm?',
        options: ['Ông tiên', 'Bụt', 'Bà tiên', 'Vua'],
        answer: 1
      },
      {
        id: 4,
        title: 'Đi dự hội',
        content: `Vua mở hội lớn. Dì ghẻ cho Cám đi dự hội, còn bắt Tấm ở nhà nhặt thóc ra thóc, gạo ra gạo.

Tấm khóc. Bụt lại hiện lên, sai đàn chim sẻ xuống giúp Tấm nhặt thóc.

Bụt bảo Tấm đào bốn cái lọ lên. Kỳ diệu thay! Trong lọ có quần áo đẹp, hài thêu và một con ngựa.

Tấm mặc đồ đẹp, cưỡi ngựa đi dự hội.`,
        image: '👗🐴🎉',
        question: 'Ai giúp Tấm nhặt thóc?',
        options: ['Đàn kiến', 'Đàn chim sẻ', 'Đàn ong', 'Đàn bướm'],
        answer: 1
      },
      {
        id: 5,
        title: 'Chiếc hài rơi',
        content: `Tấm đến hội, ai cũng trầm trồ khen đẹp. Nhà vua nhìn thấy Tấm và rất ngưỡng mộ.

Nhưng đến giờ phải về, Tấm vội vàng ra đi. Qua cầu, Tấm đánh rơi một chiếc hài xuống nước.

Nhà vua nhặt được chiếc hài. Vua ra lệnh: "Ai đi vừa chiếc hài này, ta sẽ cưới làm hoàng hậu!"

Bao nhiêu cô gái đến thử nhưng không ai vừa.`,
        image: '👠👑💕',
        question: 'Tấm đánh rơi gì?',
        options: ['Vòng tay', 'Chiếc hài', 'Túi tiền', 'Khăn tay'],
        answer: 1
      },
      {
        id: 6,
        title: 'Hoàng hậu',
        content: `Cuối cùng, đến lượt Tấm thử hài. Chiếc hài vừa như in!

Tấm trở thành hoàng hậu, sống trong cung điện nguy nga.

Tấm vẫn giữ tấm lòng hiền lành, thường giúp đỡ người nghèo khổ.

🌟 BÀI HỌC: Người hiền lành, chăm chỉ sẽ luôn được đền đáp xứng đáng!`,
        image: '👸🏰❤️',
        question: 'Cuối cùng Tấm trở thành gì?',
        options: ['Công chúa', 'Hoàng hậu', 'Tiên nữ', 'Phú hộ'],
        answer: 1
      }
    ]
  },
  {
    id: 'cay_tre_tram_dot',
    title: 'Cây Tre Trăm Đốt',
    titleEn: 'The Hundred-jointed Bamboo',
    icon: '🎋',
    cover: '🌿',
    color: 'from-green-500 to-emerald-500',
    description: 'Thật thà là đức tính tốt',
    totalChapters: 5,
    chapters: [
      {
        id: 1,
        title: 'Anh Khoai thật thà',
        content: `Ngày xưa, có một anh nông dân tên là Khoai. Anh rất thật thà, chăm chỉ làm việc.

Anh Khoai đi làm thuê cho một phú ông giàu có. Phú ông có một cô con gái rất xinh đẹp.

Anh Khoai làm việc chăm chỉ, cô gái dần dần yêu mến anh.

Phú ông biết chuyện, rất tức giận vì không muốn con gái lấy người nghèo.`,
        image: '👨‍🌾🏠💰',
        question: 'Anh Khoai có tính cách như thế nào?',
        options: ['Lười biếng', 'Thật thà, chăm chỉ', 'Gian dối', 'Kiêu ngạo'],
        answer: 1
      },
      {
        id: 2,
        title: 'Lời hứa khó thực hiện',
        content: `Phú ông nghĩ ra một kế. Ông ta nói với anh Khoai:

"Nếu anh tìm được cây tre trăm đốt, ta sẽ gả con gái cho anh."

Anh Khoai vui mừng, vội vàng vào rừng tìm tre. Anh tìm khắp nơi nhưng không cây tre nào có đến trăm đốt.

Anh ngồi khóc bên gốc cây, vì biết mình bị lừa.`,
        image: '🎋😢🌲',
        question: 'Phú ông yêu cầu anh Khoai tìm gì?',
        options: ['Cây đa trăm tuổi', 'Cây tre trăm đốt', 'Vàng bạc', 'Ngọc trai'],
        answer: 1
      },
      {
        id: 3,
        title: 'Ông Bụt giúp đỡ',
        content: `Bỗng nhiên, ông Bụt hiện ra hỏi: "Tại sao con khóc?"

Anh Khoai kể hết sự tình. Ông Bụt mỉm cười và nói:

"Con hãy chặt một trăm đốt tre, xếp thành hàng rồi đọc: Khắc nhập khắc nhập!"

Anh Khoai làm theo. Kỳ diệu thay, một trăm đốt tre dính liền thành một cây tre dài!`,
        image: '✨🧙‍♂️🎋',
        question: 'Câu thần chú để nối tre là gì?',
        options: ['Abracadabra', 'Khắc nhập khắc nhập', 'Sim sala bim', 'Biến biến biến'],
        answer: 1
      },
      {
        id: 4,
        title: 'Phú ông bị phạt',
        content: `Anh Khoai mang cây tre trăm đốt về. Phú ông rất ngạc nhiên và tức giận.

Phú ông định lật lọng, không giữ lời hứa. Anh Khoai liền đọc: "Khắc xuất khắc xuất!"

Cây tre tách ra thành trăm đốt, văng khắp nơi! Một đốt tre dính vào mũi phú ông.

Phú ông đau quá, van xin anh Khoai gỡ ra.`,
        image: '😱🎋👃',
        question: 'Câu thần chú để tách tre là gì?',
        options: ['Khắc xuất khắc xuất', 'Khắc nhập khắc nhập', 'Tan đi', 'Bay đi'],
        answer: 0
      },
      {
        id: 5,
        title: 'Kết thúc có hậu',
        content: `Phú ông hứa sẽ giữ lời, gả con gái cho anh Khoai.

Anh Khoai đọc thần chú, đốt tre rời khỏi mũi phú ông.

Anh Khoai và cô gái cưới nhau, sống hạnh phúc bên nhau.

🌟 BÀI HỌC: Người thật thà, chăm chỉ sẽ được giúp đỡ. Còn người gian dối sẽ bị trừng phạt!`,
        image: '💒❤️😊',
        question: 'Bài học của câu chuyện là gì?',
        options: ['Phải giàu có', 'Thật thà sẽ được giúp đỡ', 'Phải khôn ngoan', 'Phải mạnh mẽ'],
        answer: 1
      }
    ]
  },
  {
    id: 'son_tinh_thuy_tinh',
    title: 'Sơn Tinh Thủy Tinh',
    titleEn: 'Mountain God and Water God',
    icon: '🏔️',
    cover: '🌊',
    color: 'from-blue-500 to-cyan-500',
    description: 'Truyền thuyết về lũ lụt',
    totalChapters: 5,
    chapters: [
      {
        id: 1,
        title: 'Công chúa Mỵ Nương',
        content: `Ngày xưa, vua Hùng thứ 18 có một người con gái tên là Mỵ Nương. Nàng rất xinh đẹp và hiền hậu.

Vua muốn tìm cho công chúa một người chồng xứng đáng.

Tin loan truyền khắp nơi. Có hai chàng trai tài giỏi đến cầu hôn công chúa.

Một người là Sơn Tinh - thần núi. Một người là Thủy Tinh - thần nước.`,
        image: '👸🏔️🌊',
        question: 'Công chúa tên là gì?',
        options: ['Mỵ Châu', 'Mỵ Nương', 'Tiên Dung', 'Âu Cơ'],
        answer: 1
      },
      {
        id: 2,
        title: 'Hai chàng trai tài giỏi',
        content: `Sơn Tinh sống trên núi cao. Chàng có thể vẫy tay là núi mọc lên, đồi xuất hiện.

Thủy Tinh sống dưới biển sâu. Chàng có thể gọi mưa, dâng nước, tạo sóng lớn.

Cả hai đều rất tài giỏi, đẹp trai. Vua Hùng không biết chọn ai.

Vua bèn ra điều kiện: "Ai mang lễ vật đến trước sẽ được cưới công chúa!"`,
        image: '⛰️🌊👑',
        question: 'Sơn Tinh có khả năng gì?',
        options: ['Gọi mưa', 'Làm núi mọc lên', 'Bay trên trời', 'Biến hình'],
        answer: 1
      },
      {
        id: 3,
        title: 'Lễ vật kỳ lạ',
        content: `Vua yêu cầu lễ vật gồm: voi chín ngà, gà chín cựa, ngựa chín hồng mao.

Sáng sớm hôm sau, Sơn Tinh đã mang đủ lễ vật đến. Chàng cưới được công chúa Mỵ Nương.

Thủy Tinh đến sau, không cưới được công chúa. Chàng vô cùng tức giận.

Thủy Tinh quyết định đánh Sơn Tinh để cướp lại Mỵ Nương.`,
        image: '🐘🐓🐴',
        question: 'Ai mang lễ vật đến trước?',
        options: ['Thủy Tinh', 'Sơn Tinh', 'Cả hai cùng lúc', 'Không ai'],
        answer: 1
      },
      {
        id: 4,
        title: 'Trận chiến lớn',
        content: `Thủy Tinh dâng nước lên cao. Nước ngập đồng ruộng, nhà cửa.

Sơn Tinh bèn làm núi cao lên. Nước dâng bao nhiêu, núi cao bấy nhiêu.

Hai bên đánh nhau ròng rã nhiều tháng. Cuối cùng, Thủy Tinh đuối sức, phải rút lui.

Nhưng Thủy Tinh không chịu thua. Năm nào chàng cũng dâng nước đánh Sơn Tinh.`,
        image: '⛰️💨🌊',
        question: 'Khi nước dâng, Sơn Tinh làm gì?',
        options: ['Chạy trốn', 'Làm núi cao lên', 'Đầu hàng', 'Gọi vua giúp'],
        answer: 1
      },
      {
        id: 5,
        title: 'Giải thích lũ lụt',
        content: `Từ đó, hàng năm cứ đến mùa mưa, Thủy Tinh lại dâng nước đánh Sơn Tinh.

Đó là lý do vì sao Việt Nam hay có lũ lụt vào mùa mưa.

Nhưng Sơn Tinh luôn chiến thắng, bảo vệ người dân bình an.

🌟 BÀI HỌC: Đây là câu chuyện giải thích hiện tượng lũ lụt của ông cha ta ngày xưa. Thiên nhiên rất hùng vĩ, chúng ta cần biết bảo vệ môi trường!`,
        image: '🌧️🏔️🏠',
        question: 'Truyện giải thích hiện tượng gì?',
        options: ['Động đất', 'Lũ lụt', 'Núi lửa', 'Sấm sét'],
        answer: 1
      }
    ]
  },
  {
    id: 'coc_va_tho',
    title: 'Rùa và Thỏ',
    titleEn: 'The Tortoise and the Hare',
    icon: '🐢',
    cover: '🐰',
    color: 'from-yellow-500 to-amber-500',
    description: 'Chậm mà chắc',
    totalChapters: 4,
    chapters: [
      {
        id: 1,
        title: 'Thỏ kiêu ngạo',
        content: `Trong khu rừng nọ, có một chú Thỏ chạy rất nhanh. Thỏ luôn khoe khoang và chê cười các con vật khác.

Một hôm, Thỏ gặp Rùa đang chậm chạp bò trên đường.

Thỏ cười lớn: "Ha ha! Rùa chậm như sên! Đến mai cũng không đi hết con đường này!"

Rùa bình tĩnh đáp: "Thỏ ơi, chậm mà chắc. Hay chúng ta thi chạy đua xem ai thắng?"`,
        image: '🐰😏🐢',
        question: 'Thỏ có tính cách như thế nào?',
        options: ['Khiêm tốn', 'Kiêu ngạo', 'Nhút nhát', 'Thật thà'],
        answer: 1
      },
      {
        id: 2,
        title: 'Cuộc thi bắt đầu',
        content: `Các con vật trong rừng kéo đến xem cuộc đua giữa Thỏ và Rùa.

"Một... hai... ba... Bắt đầu!" - Cáo làm trọng tài hô to.

Thỏ phóng vụt đi như tên bay. Chỉ trong chốc lát, Thỏ đã bỏ xa Rùa.

Còn Rùa, vẫn từng bước chậm rãi, kiên nhẫn tiến về phía trước.`,
        image: '🏃‍♂️🐢🚩',
        question: 'Ai làm trọng tài?',
        options: ['Sư tử', 'Cáo', 'Gấu', 'Khỉ'],
        answer: 1
      },
      {
        id: 3,
        title: 'Thỏ ngủ quên',
        content: `Thỏ chạy được nửa đường, ngoảnh lại không thấy Rùa đâu.

"Rùa chậm thế này, mình ngủ một giấc cũng kịp!" - Thỏ nghĩ.

Thỏ nằm xuống gốc cây, ngủ một giấc ngon lành.

Trong khi đó, Rùa vẫn kiên trì bò từng bước một, không dừng lại nghỉ.`,
        image: '😴🌳🐢',
        question: 'Thỏ làm gì khi dẫn trước?',
        options: ['Tiếp tục chạy', 'Ngủ dưới gốc cây', 'Quay lại chờ Rùa', 'Ăn cà rốt'],
        answer: 1
      },
      {
        id: 4,
        title: 'Rùa chiến thắng',
        content: `Khi Thỏ tỉnh dậy, mặt trời đã lặn. Thỏ hốt hoảng chạy về đích.

Nhưng đã quá muộn! Rùa đã về đích từ lâu, đang được các bạn chúc mừng.

Thỏ xấu hổ, cúi đầu nhận thua.

Rùa nói: "Chậm mà chắc, bạn Thỏ ạ. Kiên trì sẽ đến đích!"

🌟 BÀI HỌC: Không nên kiêu ngạo. Kiên trì và nỗ lực sẽ mang lại thành công!`,
        image: '🐢🏆🎉',
        question: 'Ai chiến thắng cuộc đua?',
        options: ['Thỏ', 'Rùa', 'Hòa', 'Không ai'],
        answer: 1
      }
    ]
  }
];

// Lấy truyện theo ID
export const getStory = (id) => STORIES.find(s => s.id === id);

// Lấy tất cả truyện
export const getAllStories = () => STORIES;

// Tính số chương đã mở khóa dựa trên ngày học liên tiếp
export const getUnlockedChapters = (storyId, startDate, streak) => {
  const story = getStory(storyId);
  if (!story) return 0;
  
  // Mỗi ngày học liên tiếp mở 1 chương
  return Math.min(streak + 1, story.totalChapters);
};

export default STORIES;
