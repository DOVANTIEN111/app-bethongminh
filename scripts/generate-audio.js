/**
 * ============================================
 * SCRIPT TỰ ĐỘNG TẠO AUDIO TỪ FPT.AI
 * ============================================
 * 
 * HƯỚNG DẪN:
 * 1. Copy file này vào: /Users/dotien/bethongminh1/scripts/generate-audio.js
 * 2. Mở Terminal, chạy:
 *    cd /Users/dotien/bethongminh1
 *    mkdir -p scripts public/audio/stories
 *    node scripts/generate-audio.js
 * 3. Đợi khoảng 15-20 phút để tạo xong 36 file MP3
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// ============================================
// CẤU HÌNH FPT.AI
// ============================================
const FPT_API_KEY = 'nlzVb59O6i3UHC0hO1qh6lTyhUGD1fWb';
const VOICE = 'banmai';  // Giọng nữ Bắc - kể chuyện hay nhất
const SPEED = '0';       // Tốc độ bình thường (-3 đến 3)

// Thư mục lưu audio
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'audio', 'stories');

// ============================================
// NỘI DUNG 36 CHƯƠNG TRUYỆN
// ============================================
const CHAPTERS = [
  // === THẠCH SANH (6 chương) ===
  {
    id: 'thach_sanh_01',
    title: 'Thạch Sanh - Chương 1: Sự ra đời kỳ lạ',
    content: `Ngày xưa, ở quận Cao Bình có hai vợ chồng bác tiều phu họ Thạch, tuổi đã cao mà vẫn chưa có con. Ông bà tuy nghèo nhưng luôn làm việc thiện: ông thì sửa cầu, đắp đường; bà thì nấu nước cho người qua đường uống.

Việc làm tốt của họ thấu đến Ngọc Hoàng. Ngài bèn sai Thái tử xuống đầu thai làm con nhà họ Thạch.

Bà vợ mang thai đến ba năm mới sinh được một cậu con trai khôi ngô tuấn tú, đặt tên là Thạch Sanh.

Chẳng bao lâu sau, cha mẹ lần lượt qua đời. Thạch Sanh sống một mình trong túp lều tranh dưới gốc đa, chỉ có chiếc búa đốn củi làm bạn.

Năm Thạch Sanh mười ba tuổi, Ngọc Hoàng sai thiên thần xuống dạy cho chàng đủ các môn võ nghệ và mọi phép thần thông.`
  },
  {
    id: 'thach_sanh_02',
    title: 'Thạch Sanh - Chương 2: Kết nghĩa với Lý Thông',
    content: `Một hôm, có người hàng rượu tên là Lý Thông đi qua gốc đa, thấy Thạch Sanh vác về một gánh củi lớn tướng.

Lý Thông nghĩ bụng: "Người này khỏe như voi. Nếu về ở cùng ta thì lợi biết bao nhiêu."

Hắn bèn đến làm quen, nói ngọt nhạt rồi xin kết nghĩa anh em. Thạch Sanh thật thà, thấy có người quan tâm đến mình liền vui vẻ nhận lời.

Từ đó, Thạch Sanh về sống chung với mẹ con Lý Thông. Chàng làm việc quần quật suốt ngày, còn Lý Thông thì chỉ biết hưởng thụ.

Lúc bấy giờ, trong vùng có con Chằn tinh hung ác, thường bắt người ăn thịt. Mỗi năm, dân làng phải nộp một người cho nó. Năm ấy, đến lượt Lý Thông.`
  },
  {
    id: 'thach_sanh_03',
    title: 'Thạch Sanh - Chương 3: Giết Chằn tinh',
    content: `Mẹ con Lý Thông hoảng sợ, bèn nghĩ kế lừa Thạch Sanh đi thay.

Lý Thông nói: "Đêm nay anh phải canh miếu trong rừng, nhưng trót cất mẻ rượu, em chịu khó đi thay anh một đêm."

Thạch Sanh thật thà nhận lời. Nửa đêm, Chằn tinh hiện ra, nhe nanh, giơ vuốt, há hơi nhả lửa định vồ Thạch Sanh.

Thạch Sanh bình tĩnh vung búa đánh lại. Chằn tinh thoắt biến, thoắt hiện, nhưng không sao địch nổi Thạch Sanh.

Cuối cùng, chàng chém đứt đầu yêu quái, đốt xác nó thành tro. Từ trong đống tro hiện ra một bộ cung tên bằng vàng sáng chói.

Thạch Sanh mang đầu Chằn tinh về, Lý Thông lại lừa chàng rằng đó là vật nuôi của vua, giết nó sẽ bị tội chém đầu. Thạch Sanh sợ hãi, bỏ đi, để Lý Thông cướp công.`
  },
  {
    id: 'thach_sanh_04',
    title: 'Thạch Sanh - Chương 4: Cứu công chúa',
    content: `Công chúa Quỳnh Nga bị Đại bàng khổng lồ bắt đi. Vua ra chiếu: Ai cứu được công chúa sẽ được gả làm vợ.

Lý Thông biết hang Đại bàng, nhờ Thạch Sanh xuống cứu. Chàng theo dây thừng xuống hang sâu, dùng cung tên vàng bắn chết Đại bàng, cứu được công chúa.

Khi chàng buộc dây cho công chúa lên trước, Lý Thông thấy nàng đẹp quá, liền cắt đứt dây, lấp cửa hang để Thạch Sanh chết, rồi đem công chúa về cướp công.

Thạch Sanh một mình trong hang tối, đi mãi thì gặp con trai vua Thủy Tề bị nhốt trong cũi sắt. Chàng cứu thái tử, được đưa xuống Thủy cung.

Vua Thủy Tề tặng chàng cây đàn thần và niêu cơm thần để trả ơn cứu mạng con trai.`
  },
  {
    id: 'thach_sanh_05',
    title: 'Thạch Sanh - Chương 5: Tiếng đàn thần',
    content: `Công chúa từ khi được cứu thì hóa câm, không nói không cười. Vua cho Lý Thông lập đàn cầu nguyện nhưng không có kết quả.

Lý Thông sợ Thạch Sanh còn sống, bèn sai người ăn trộm của cải trong kho vua rồi chôn ở gốc đa để vu oan cho chàng.

Thạch Sanh bị bắt giam vào ngục. Trong ngục tối, chàng buồn bã lấy đàn thần ra gảy.

Tiếng đàn kể rõ đầu đuôi câu chuyện: chàng đã giết Chằn tinh, bắn Đại bàng, cứu công chúa ra sao, rồi bị Lý Thông phản bội thế nào.

Tiếng đàn bay vào cung, công chúa vừa nghe liền nói được, kể hết mọi chuyện cho vua cha.

Vua truyền đưa Thạch Sanh vào cung. Chàng gảy đàn, tội ác của Lý Thông bị phơi bày. Vua sai bắt mẹ con Lý Thông trị tội.`
  },
  {
    id: 'thach_sanh_06',
    title: 'Thạch Sanh - Chương 6: Niêu cơm thần',
    content: `Thạch Sanh xin vua tha tội cho mẹ con Lý Thông. Nhưng trên đường về, cả hai bị sét đánh chết, hóa thành bọ hung.

Vua gả công chúa cho Thạch Sanh. Thái tử mười tám nước chư hầu tức giận vì bị công chúa từ chối, kéo quân sang đánh.

Thạch Sanh đem đàn thần ra gảy. Tiếng đàn khiến quân địch nhớ nhà, nhớ vợ con, không ai còn muốn đánh nhau nữa. Tất cả xin hàng.

Thạch Sanh mời họ ăn cơm. Chàng chỉ có một niêu cơm nhỏ, nhưng niêu cơm thần cứ xới hết lại đầy, quân lính mười tám nước ăn mãi không hết.

Các nước chư hầu kính phục, từ đó quy thuận, không dám gây chiến nữa.

Bài học từ câu chuyện: Người thật thà, dũng cảm sẽ được đền đáp. Kẻ gian ác, phản bội sẽ bị trừng phạt.`
  },

  // === SỌ DỪA (5 chương) ===
  {
    id: 'so_dua_01',
    title: 'Sọ Dừa - Chương 1: Sự ra đời kỳ lạ',
    content: `Ngày xưa, có hai vợ chồng nghèo đi ở cho nhà phú ông. Họ hiền lành, chăm chỉ nhưng đã ngoài năm mươi tuổi mà chưa có con.

Một hôm, bà vợ vào rừng lấy củi. Trời nắng to, bà khát nước quá, thấy cái sọ dừa bên gốc cây đựng đầy nước mưa, bà bèn bưng lên uống.

Về nhà, bà có mang. Ít lâu sau, chồng bà qua đời. Bà sinh ra một đứa con không có chân tay, mình mẩy tròn lông lốc như quả dừa.

Bà buồn lắm, định bỏ đi thì đứa bé cất tiếng nói:

"Mẹ ơi! Con là người đấy! Mẹ đừng bỏ con mà tội nghiệp."

Bà thương tình để lại nuôi và đặt tên là Sọ Dừa.`
  },
  {
    id: 'so_dua_02',
    title: 'Sọ Dừa - Chương 2: Chàng chăn bò',
    content: `Lớn lên, Sọ Dừa vẫn tròn lông lốc, chẳng làm được việc gì. Bà mẹ phiền lòng lắm.

Sọ Dừa biết vậy, xin mẹ đến chăn bò cho nhà phú ông. Ban đầu phú ông ngần ngại, nhưng nghĩ: nuôi thì ít tốn cơm, tiền công cũng không đáng bao, nên đồng ý.

Sọ Dừa chăn bò rất giỏi. Hàng ngày, cậu lăn sau đàn bò ra đồng, tối lại lăn về. Bò con nào con nấy no căng bụng.

Phú ông có ba cô con gái, thay nhau đưa cơm cho Sọ Dừa. Hai cô chị kiêu kỳ, thường hắt hủi. Chỉ có cô út hiền lành, đối xử tử tế.

Một hôm, cô út mang cơm ra, bỗng nghe tiếng sáo véo von. Nàng rón rén lại gần, thấy một chàng trai khôi ngô đang ngồi thổi sáo cho bò ăn cỏ. Vừa thấy người, chàng biến mất, chỉ còn Sọ Dừa nằm lăn lóc.

Cô út biết Sọ Dừa không phải người thường, bèn đem lòng yêu mến.`
  },
  {
    id: 'so_dua_03',
    title: 'Sọ Dừa - Chương 3: Đám cưới',
    content: `Cuối mùa, Sọ Dừa giục mẹ đến nhà phú ông hỏi vợ. Bà mẹ sửng sốt nhưng cũng chiều con.

Phú ông cười mỉa mai: "Muốn cưới con gái ta, hãy sắm đủ: một chĩnh vàng cốm, mười tấm lụa đào, mười con lợn béo, mười vò rượu tăm!"

Bà mẹ về, nghĩ là phải bỏ cuộc. Nhưng đúng ngày hẹn, bỗng trong nhà có đầy đủ sính lễ, lại có gia nhân khiêng sang nhà phú ông.

Phú ông hoa mắt, gọi ba con gái ra hỏi ý. Hai cô chị bĩu môi chê Sọ Dừa xấu xí rồi bỏ đi. Chỉ cô út cúi đầu e lệ, tỏ ý bằng lòng.

Ngày cưới, tiệc bày linh đình. Khi rước dâu, không ai thấy Sọ Dừa xấu xí đâu nữa, mà chỉ thấy một chàng trai khôi ngô tuấn tú đứng bên cô dâu.

Mọi người sửng sốt mừng rỡ, hai cô chị thì vừa tiếc vừa ghen tức.`
  },
  {
    id: 'so_dua_04',
    title: 'Sọ Dừa - Chương 4: Trạng nguyên đi sứ',
    content: `Vợ chồng Sọ Dừa sống với nhau rất hạnh phúc. Sọ Dừa ngày đêm miệt mài đèn sách.

Năm ấy, chàng đi thi và đỗ Trạng nguyên. Vua cử chàng đi sứ sang nước ngoài.

Trước khi đi, Sọ Dừa đưa cho vợ một hòn đá lửa, một con dao và hai quả trứng gà, dặn:

"Nàng hãy giữ những thứ này trong người, phòng khi gặp nạn bất ngờ."

Cô út không hiểu nhưng vẫn vâng lời chồng.

Từ ngày em lấy được chồng tuấn tú, lại đỗ Trạng nguyên, hai cô chị ghen tức lắm. Chúng bàn nhau hại em để một trong hai người thay làm bà Trạng.`
  },
  {
    id: 'so_dua_05',
    title: 'Sọ Dừa - Chương 5: Đoàn tụ',
    content: `Hai cô chị rủ em đi chơi thuyền rồi đẩy em xuống biển. Cô út bị cá kình nuốt vào bụng.

Trong bụng cá, nàng lấy dao rạch bụng cá chui ra. Cá chết, xác trôi dạt vào bờ.

Nàng dùng đá lửa nhóm lửa sưởi ấm và nướng thịt cá ăn. Hai quả trứng nở ra hai con gà.

Một hôm, thuyền quan Trạng đi ngang qua. Con gà trống gáy vang:

"Ò ó o! Phải thuyền quan Trạng rước cô tôi về!"

Sọ Dừa nhận ra vợ, đón nàng lên thuyền. Hai vợ chồng đoàn tụ, trở về nhà.

Hai cô chị xấu hổ vì tội lỗi, bỏ đi biệt xứ.

Bài học từ câu chuyện: Đừng đánh giá người qua vẻ bề ngoài. Người nhân hậu sẽ được hưởng hạnh phúc, kẻ ác sẽ phải hổ thẹn.`
  },

  // === TÍCH CHU (5 chương) ===
  {
    id: 'tich_chu_01',
    title: 'Tích Chu - Chương 1: Cậu bé Tích Chu',
    content: `Ngày xửa ngày xưa, có một cậu bé tên là Tích Chu sống cùng bà ngoại trong một ngôi nhà nhỏ.

Bà ngoại của Tích Chu rất yêu thương cậu. Hàng ngày, bà nấu cơm, giặt áo, chăm sóc Tích Chu chu đáo. Dù tuổi đã cao, bà vẫn làm mọi việc vì thương cháu.

Nhưng Tích Chu lại là một cậu bé ham chơi. Cậu suốt ngày chạy nhảy ngoài đồng với bạn bè, không giúp đỡ bà việc gì.

Mỗi khi bà nhờ việc, Tích Chu đều nói: "Để con chơi xong đã!" rồi tiếp tục chơi, quên hết lời bà dặn.

Bà ngoại buồn lắm, nhưng vẫn yêu thương cháu.`
  },
  {
    id: 'tich_chu_02',
    title: 'Tích Chu - Chương 2: Bà ốm nặng',
    content: `Một hôm, bà ngoại bị ốm rất nặng. Bà nằm trên giường, người nóng như lửa đốt, không thể dậy nổi.

Bà khát nước quá, gọi Tích Chu: "Cháu ơi, bà khát nước lắm! Cháu lấy cho bà chén nước được không?"

Nhưng lúc đó Tích Chu đang mải chơi ngoài sân với mấy con dế. Cậu trả lời qua quýt: "Bà đợi con chút, con đang chơi!"

Rồi Tích Chu mải mê với đám bạn, quên mất lời bà dặn.

Bà ngoại nằm chờ, khát khô cả cổ mà không có ai mang nước cho bà uống.`
  },
  {
    id: 'tich_chu_03',
    title: 'Tích Chu - Chương 3: Bà hóa thành chim',
    content: `Bà ngoại khát nước quá, chờ mãi không thấy Tích Chu mang nước đến.

Bỗng nhiên, một điều kỳ lạ xảy ra. Bà ngoại biến thành một con chim nhỏ!

Con chim bay ra cửa sổ, kêu lên thảm thiết: "Tích Chu ơi! Tích Chu ơi! Nước! Nước!"

Tích Chu nghe tiếng chim kêu lạ, vội chạy vào nhà. Nhưng bà không còn đâu nữa, chỉ thấy con chim đang bay đi.

Tích Chu khóc òa lên: "Bà ơi! Bà ơi! Bà đừng bỏ con!"

Cậu hối hận vô cùng vì đã không nghe lời bà.`
  },
  {
    id: 'tich_chu_04',
    title: 'Tích Chu - Chương 4: Hành trình tìm bà',
    content: `Tích Chu quyết tâm đi tìm bà. Cậu đi mãi, đi mãi, qua núi cao, qua rừng sâu.

Cậu hỏi thăm khắp nơi: "Có ai thấy con chim của bà cháu không?"

Cuối cùng, cậu gặp một ông tiên râu tóc bạc phơ. Ông tiên nói:

"Ta biết bà cháu ở đâu. Bà đang ở trên núi Khát Nước. Nhưng muốn cứu bà, cháu phải lấy được nước suối thần trên đỉnh núi cao kia."

Đường lên núi rất hiểm trở, đầy gai góc. Nhưng Tích Chu không ngại khó khăn, cậu cố gắng leo lên.

Chân cậu trầy xước, tay cậu rớm máu, nhưng cậu vẫn kiên trì vì thương bà.`
  },
  {
    id: 'tich_chu_05',
    title: 'Tích Chu - Chương 5: Đoàn tụ',
    content: `Sau bao ngày vất vả, Tích Chu cuối cùng cũng lấy được nước suối thần.

Cậu tìm thấy con chim nhỏ đang đậu trên cành cây. Cậu nhẹ nhàng cho chim uống nước.

Kỳ diệu thay, con chim từ từ biến trở lại thành bà ngoại!

Bà ngoại ôm Tích Chu vào lòng: "Cháu ngoan của bà! Cháu đã biết thương bà rồi!"

Tích Chu khóc nức nở: "Con xin lỗi bà! Từ nay con sẽ nghe lời bà, con sẽ chăm sóc bà thật tốt!"

Từ đó, Tích Chu trở thành một cậu bé hiếu thảo, luôn yêu thương và chăm sóc bà ngoại.

Bài học từ câu chuyện: Hãy luôn yêu thương, hiếu thảo với ông bà, cha mẹ khi còn có thể. Đừng để đến khi mất đi mới hối hận.`
  },

  // === CÂY TRE TRĂM ĐỐT (5 chương) ===
  {
    id: 'cay_tre_01',
    title: 'Cây Tre Trăm Đốt - Chương 1: Anh Khoai thật thà',
    content: `Ngày xưa, có một anh nông dân tên là Khoai. Anh mồ côi cha mẹ từ nhỏ, phải đi làm thuê để kiếm sống.

Anh Khoai rất thật thà, chăm chỉ, làm việc gì cũng hết sức mình. Anh không bao giờ nói dối hay lừa gạt ai.

Anh đến làm thuê cho một phú ông giàu có. Phú ông thấy anh làm việc giỏi, rất ưng ý.

Phú ông có một cô con gái xinh đẹp, hiền hậu. Dần dần, cô gái đem lòng yêu mến anh Khoai vì tính tình thật thà của anh.

Phú ông biết chuyện, rất tức giận vì không muốn gả con gái cho người nghèo.`
  },
  {
    id: 'cay_tre_02',
    title: 'Cây Tre Trăm Đốt - Chương 2: Lời thách cưới',
    content: `Phú ông nghĩ ra một kế để từ chối anh Khoai. Ông nói:

"Anh muốn cưới con gái ta ư? Được, nhưng anh phải tìm cho ta một cây tre có đúng một trăm đốt. Nếu tìm được, ta sẽ gả con gái cho anh!"

Anh Khoai vui mừng lắm, vội vàng vào rừng tìm tre.

Anh tìm khắp nơi: rừng này qua rừng khác, núi này sang núi kia. Nhưng cây tre nào cũng chỉ có vài chục đốt, không cây nào đến trăm đốt cả.

Anh tìm mãi, tìm mãi mà không được. Anh ngồi bên gốc cây, ôm mặt khóc vì biết mình đã bị phú ông lừa.`
  },
  {
    id: 'cay_tre_03',
    title: 'Cây Tre Trăm Đốt - Chương 3: Bụt hiện lên',
    content: `Bỗng nhiên, Bụt hiện ra trước mặt anh Khoai. Bụt hỏi: "Vì sao con khóc?"

Anh Khoai kể hết sự tình cho Bụt nghe. Bụt mỉm cười hiền từ, nói:

"Con hãy chặt đủ một trăm đốt tre, xếp thành hàng dài rồi đọc: Khắc nhập! Khắc nhập!"

Anh Khoai làm theo lời Bụt dặn. Chàng chặt đủ một trăm đốt tre, xếp thành hàng rồi đọc câu thần chú.

Kỳ diệu thay! Một trăm đốt tre liền dính vào nhau thành một cây tre dài trăm đốt!

Anh Khoai vác cây tre về, lòng vui như mở hội.`
  },
  {
    id: 'cay_tre_04',
    title: 'Cây Tre Trăm Đốt - Chương 4: Phú ông bị phạt',
    content: `Anh Khoai mang cây tre trăm đốt về nộp cho phú ông. Phú ông đếm đi đếm lại, đúng một trăm đốt!

Ông ta ngạc nhiên và tức giận, định lật lọng không giữ lời hứa. Ông quát:

"Ta thay đổi ý rồi! Ta không gả con gái cho ngươi nữa!"

Anh Khoai buồn bã quá, bất giác đọc: "Khắc xuất! Khắc xuất!"

Tức thì, cây tre tách ra thành từng đốt, văng tứ tung! Một đốt tre bay trúng dính vào mũi phú ông!

Phú ông kêu la ầm ĩ, đau đớn vô cùng, van xin anh Khoai gỡ ra.`
  },
  {
    id: 'cay_tre_05',
    title: 'Cây Tre Trăm Đốt - Chương 5: Kết thúc có hậu',
    content: `Phú ông hứa sẽ giữ đúng lời, gả con gái cho anh Khoai.

Anh Khoai đọc thần chú, đốt tre rời khỏi mũi phú ông.

Phú ông giữ lời hứa, tổ chức đám cưới linh đình cho anh Khoai và con gái.

Anh Khoai và cô gái cưới nhau, sống hạnh phúc bên nhau. Anh vẫn giữ tính thật thà, chăm chỉ như xưa, được mọi người yêu mến.

Còn phú ông, từ đó ông ta không dám lừa dối ai nữa.

Bài học từ câu chuyện: Người thật thà, chăm chỉ sẽ được giúp đỡ và gặp may mắn. Kẻ gian dối, lật lọng sẽ bị trừng phạt xứng đáng.`
  },

  // === TẤM CÁM (6 chương) ===
  {
    id: 'tam_cam_01',
    title: 'Tấm Cám - Chương 1: Cô Tấm mồ côi',
    content: `Ngày xưa, có một cô gái tên là Tấm. Mẹ Tấm mất sớm, cha lấy vợ kế rồi cũng qua đời.

Tấm ở với dì ghẻ và Cám, con gái riêng của dì.

Dì ghẻ rất thương Cám nhưng đối xử tệ bạc với Tấm. Tấm phải làm mọi việc nặng nhọc trong nhà: nấu cơm, quét nhà, gánh nước, chăn trâu.

Còn Cám thì được ăn ngon, mặc đẹp, suốt ngày chơi bời.

Dù vất vả, Tấm vẫn hiền lành, chăm chỉ, không một lời oán trách.`
  },
  {
    id: 'tam_cam_02',
    title: 'Tấm Cám - Chương 2: Con cá bống',
    content: `Một hôm, dì ghẻ sai Tấm và Cám đi bắt tôm cá. Ai bắt được nhiều hơn sẽ được thưởng yếm đỏ.

Tấm chăm chỉ bắt được đầy giỏ. Cám thì lười biếng, chẳng bắt được gì.

Cám lừa Tấm: "Chị Tấm ơi, đầu chị lấm bùn kìa, xuống ao gội đi!"

Khi Tấm xuống gội đầu, Cám trút hết cá sang giỏ mình rồi chạy về.

Tấm khóc. Trong giỏ chỉ còn một con cá bống nhỏ. Tấm mang cá bống về nuôi trong giếng.

Hàng ngày, Tấm nhịn ăn, dành cơm cho cá bống. Cá bống lớn nhanh, rất quấn quýt Tấm.`
  },
  {
    id: 'tam_cam_03',
    title: 'Tấm Cám - Chương 3: Bụt hiện lên',
    content: `Mẹ con Cám phát hiện Tấm nuôi cá bống. Họ lừa Tấm đi chăn trâu xa, rồi bắt cá bống giết thịt ăn.

Tấm về, gọi mãi không thấy cá bống, khóc rất nhiều.

Bỗng nhiên, Bụt hiện lên an ủi: "Con đừng khóc! Hãy tìm xương cá, cho vào bốn cái lọ, chôn dưới bốn chân giường."

Tấm làm theo lời Bụt dặn. Nàng tìm được xương cá, bỏ vào bốn lọ, chôn cẩn thận.

Từ đó, mỗi khi buồn, Tấm lại nghĩ đến lời Bụt dạy mà vơi bớt nỗi sầu.`
  },
  {
    id: 'tam_cam_04',
    title: 'Tấm Cám - Chương 4: Đi dự hội',
    content: `Vua mở hội lớn, ai cũng được đi. Dì ghẻ cho Cám đi hội, còn bắt Tấm ở nhà nhặt thóc ra thóc, gạo ra gạo.

Tấm khóc. Bụt lại hiện lên, sai đàn chim sẻ xuống giúp Tấm nhặt thóc.

Bụt bảo Tấm đào bốn cái lọ dưới chân giường lên. Kỳ diệu thay! Trong lọ có quần áo đẹp, hài thêu và một con ngựa hồng.

Tấm mặc đồ đẹp, cưỡi ngựa đi dự hội. Ai nhìn thấy cũng trầm trồ khen đẹp.

Nhà vua nhìn thấy Tấm, đem lòng yêu mến ngay.`
  },
  {
    id: 'tam_cam_05',
    title: 'Tấm Cám - Chương 5: Chiếc hài rơi',
    content: `Tấm đến hội, ai cũng ngắm nhìn ngưỡng mộ. Nhà vua muốn đến gần làm quen.

Nhưng đến giờ phải về, Tấm vội vàng ra đi vì sợ dì ghẻ biết.

Qua cầu, Tấm vô tình đánh rơi một chiếc hài xuống nước.

Nhà vua nhặt được chiếc hài, thấy nhỏ xinh, tinh xảo. Vua ra lệnh:

"Ai đi vừa chiếc hài này, ta sẽ cưới làm hoàng hậu!"

Bao nhiêu cô gái đến thử, người thì chật, người thì rộng, không ai vừa.

Mẹ con Cám cũng đến thử nhưng chân họ to quá, không thể xỏ vừa.`
  },
  {
    id: 'tam_cam_06',
    title: 'Tấm Cám - Chương 6: Hoàng hậu',
    content: `Cuối cùng, đến lượt Tấm đến thử. Nàng xỏ chân vào, chiếc hài vừa như in!

Tấm lấy chiếc hài còn lại trong túi ra, đi vừa cả đôi.

Nhà vua mừng rỡ, cưới Tấm làm hoàng hậu. Tấm vào cung sống sung sướng.

Dù làm hoàng hậu, Tấm vẫn giữ tấm lòng hiền lành, thường giúp đỡ người nghèo khổ.

Bài học từ câu chuyện: Người hiền lành, chăm chỉ, nhẫn nại sẽ được đền đáp xứng đáng. Hãy luôn giữ tâm hồn trong sáng, không oán hận dù gặp khó khăn.`
  },

  // === SƠN TINH THỦY TINH (5 chương) ===
  {
    id: 'son_tinh_01',
    title: 'Sơn Tinh Thủy Tinh - Chương 1: Công chúa Mỵ Nương',
    content: `Đời Hùng Vương thứ mười tám, vua có một người con gái tên là Mỵ Nương. Nàng rất xinh đẹp và hiền hậu.

Vua Hùng muốn kén cho con một người chồng xứng đáng.

Tin loan truyền khắp nơi. Có hai chàng trai tài giỏi đến cầu hôn công chúa.

Một người là Sơn Tinh, thần núi Tản Viên. Chàng có thể vẫy tay làm mọc lên núi đồi, cây cối.

Một người là Thủy Tinh, thần nước biển. Chàng có thể hô mưa gọi gió, dâng nước lên cao.

Cả hai đều tài giỏi phi thường, vua không biết chọn ai.`
  },
  {
    id: 'son_tinh_02',
    title: 'Sơn Tinh Thủy Tinh - Chương 2: Lễ vật cầu hôn',
    content: `Vua Hùng không biết chọn ai, bèn ra điều kiện:

"Ai mang lễ vật đến trước, ta sẽ gả công chúa cho người đó!"

Lễ vật gồm: một trăm ván cơm nếp, hai trăm nệp bánh chưng, voi chín ngà, gà chín cựa, ngựa chín hồng mao.

Đây đều là những thứ hiếm có, khó tìm.

Sơn Tinh về núi, ra sức tìm kiếm. Chàng có phép thần, nên tìm được đủ lễ vật rất nhanh.

Thủy Tinh cũng vội vã đi tìm. Nhưng những thứ này là vật trên cạn, chàng khó tìm hơn.`
  },
  {
    id: 'son_tinh_03',
    title: 'Sơn Tinh Thủy Tinh - Chương 3: Sơn Tinh thắng cuộc',
    content: `Sáng sớm hôm sau, khi mặt trời chưa mọc, Sơn Tinh đã mang đủ lễ vật đến.

Vua Hùng giữ lời hứa, gả công chúa Mỵ Nương cho Sơn Tinh.

Chàng rước nàng về núi Tản Viên làm vợ.

Thủy Tinh đến sau một bước, không lấy được công chúa. Chàng vô cùng tức giận, uất hận.

Thủy Tinh quyết định đuổi theo, đánh Sơn Tinh để cướp lại Mỵ Nương.

Từ đây, cuộc chiến giữa hai vị thần bắt đầu.`
  },
  {
    id: 'son_tinh_04',
    title: 'Sơn Tinh Thủy Tinh - Chương 4: Trận chiến long trời',
    content: `Thủy Tinh tức giận, hô mưa gọi gió, dâng nước lên cao ngập cả đồng ruộng, nhà cửa.

Nước mỗi lúc một cao, dâng lên tận chân núi Tản Viên.

Sơn Tinh không hề nao núng. Chàng dùng phép thần làm núi cao thêm. Nước dâng đến đâu, núi cao đến đấy.

Hai bên đánh nhau ròng rã nhiều ngày, nhiều tháng.

Cuối cùng, Thủy Tinh đuối sức, nước rút dần, phải rút quân về biển.

Nhưng Thủy Tinh không chịu thua. Năm nào chàng cũng dâng nước lên đánh Sơn Tinh.`
  },
  {
    id: 'son_tinh_05',
    title: 'Sơn Tinh Thủy Tinh - Chương 5: Giải thích lũ lụt',
    content: `Từ đó về sau, hàng năm cứ đến mùa mưa tháng bảy, tháng tám, Thủy Tinh lại dâng nước đánh Sơn Tinh.

Nước sông dâng cao, gây ra lũ lụt ở nhiều nơi.

Nhưng Sơn Tinh lần nào cũng chiến thắng, bảo vệ công chúa và người dân.

Câu chuyện này giải thích vì sao Việt Nam hay có lũ lụt vào mùa mưa. Đó chính là do Thủy Tinh dâng nước đánh Sơn Tinh.

Bài học từ câu chuyện: Thiên nhiên rất hùng vĩ với sức mạnh to lớn. Con người cần biết sống hòa hợp với thiên nhiên và bảo vệ môi trường.`
  },

  // === CÓC KIỆN TRỜI (4 chương) ===
  {
    id: 'coc_kien_troi_01',
    title: 'Cóc Kiện Trời - Chương 1: Hạn hán kéo dài',
    content: `Ngày xưa, có năm trời làm hạn hán rất lâu. Mấy tháng liền không có một giọt mưa.

Ruộng đồng nứt nẻ, cây cối héo khô, sông suối cạn trơ đáy.

Con người và muôn loài khát nước, đói khổ vô cùng. Nhiều người, nhiều con vật đã chết vì khát.

Ai cũng than khóc, nhưng không biết làm sao.

Cóc thấy tình cảnh ấy, quyết định lên thiên đình kiện Trời, đòi Trời làm mưa cứu muôn loài.

Dù nhỏ bé, Cóc vẫn không sợ hãi, một mình lên đường.`
  },
  {
    id: 'coc_kien_troi_02',
    title: 'Cóc Kiện Trời - Chương 2: Đoàn quân của Cóc',
    content: `Trên đường đi, Cóc gặp Cua. Cua hỏi: "Cóc đi đâu thế?"

Cóc nói: "Tôi đi kiện Trời vì Trời không làm mưa." Cua xin theo.

Đi tiếp, gặp Gấu, Cọp, Ong, Cáo, Gà trống. Tất cả đều xin đi cùng.

Mỗi con vật đều có một tài riêng: Cua có càng kẹp chắc. Gấu có sức mạnh vô địch. Cọp có nanh vuốt sắc. Ong có nọc độc. Cáo có mưu trí. Gà trống biết gáy to.

Đoàn quân của Cóc ngày càng đông, cùng tiến lên thiên đình.`
  },
  {
    id: 'coc_kien_troi_03',
    title: 'Cóc Kiện Trời - Chương 3: Đánh tan quân Trời',
    content: `Đến thiên đình, Cóc gõ cửa đòi gặp Ngọc Hoàng. Quân canh cửa cười chê:

"Con Cóc nhỏ bé dám đến đây kiện Trời ư?"

Ngọc Hoàng sai Thần Sấm, Thần Sét ra đánh. Nhưng Cóc đã bố trí sẵn:

Gấu đứng sau cánh cửa, quật ngã Thần Sấm. Cọp từ bên hông nhảy ra, vồ Thần Sét. Ong bay vù vù, đốt khắp nơi. Cua kẹp chân những ai chạy trốn. Cáo bày mưu, chỉ huy quân ta.

Quân Trời thua chạy tan tác. Ngọc Hoàng thấy vậy phải đích thân ra tiếp.`
  },
  {
    id: 'coc_kien_troi_04',
    title: 'Cóc Kiện Trời - Chương 4: Cóc thắng kiện',
    content: `Ngọc Hoàng hỏi: "Các ngươi muốn gì?"

Cóc đáp: "Muôn tâu Ngọc Hoàng, hạ giới hạn hán đã lâu. Xin Ngọc Hoàng ban mưa cứu muôn loài!"

Ngọc Hoàng thấy Cóc và các bạn dũng cảm, đoàn kết, bèn thuận cho.

Từ đó, Ngọc Hoàng hứa: "Hễ khi nào Cóc nghiến răng kêu, ta sẽ làm mưa ngay!"

Cóc và các bạn vui vẻ trở về. Trời bắt đầu đổ mưa. Muôn loài hoan hỉ.

Từ đó, mỗi khi Cóc nghiến răng kêu là trời đổ mưa. Người ta có câu: "Con Cóc là cậu ông Trời."

Bài học từ câu chuyện: Đoàn kết tạo nên sức mạnh. Dù nhỏ bé, nếu có lòng dũng cảm và biết hợp sức với nhau, ta có thể làm được những việc lớn lao.`
  }
];

// ============================================
// HÀM GỌI FPT.AI API
// ============================================
function callFPTApi(text) {
  return new Promise((resolve, reject) => {
    const postData = text;
    
    const options = {
      hostname: 'api.fpt.ai',
      port: 443,
      path: '/hmi/tts/v5',
      method: 'POST',
      headers: {
        'api_key': FPT_API_KEY,
        'voice': VOICE,
        'speed': SPEED,
        'prosody': '1',
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Length': Buffer.byteLength(postData, 'utf8')
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (e) {
          reject(new Error('Invalid JSON response'));
        }
      });
    });

    req.on('error', reject);
    req.write(postData, 'utf8');
    req.end();
  });
}

// ============================================
// HÀM TẢI FILE MP3
// ============================================
function downloadFile(url, filePath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    
    https.get(url, (response) => {
      // Xử lý redirect
      if (response.statusCode === 301 || response.statusCode === 302) {
        https.get(response.headers.location, (res) => {
          res.pipe(file);
          file.on('finish', () => {
            file.close();
            resolve();
          });
        }).on('error', reject);
      } else {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      }
    }).on('error', (err) => {
      fs.unlink(filePath, () => {});
      reject(err);
    });
  });
}

// ============================================
// HÀM ĐỢI FILE AUDIO SẴN SÀNG
// ============================================
function waitForAudio(url, maxAttempts = 30) {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    
    const check = () => {
      attempts++;
      
      https.get(url, (res) => {
        if (res.statusCode === 200) {
          resolve(url);
        } else if (attempts < maxAttempts) {
          setTimeout(check, 1000);
        } else {
          reject(new Error('Audio file not ready after ' + maxAttempts + ' seconds'));
        }
      }).on('error', () => {
        if (attempts < maxAttempts) {
          setTimeout(check, 1000);
        } else {
          reject(new Error('Cannot reach audio URL'));
        }
      });
    };
    
    check();
  });
}

// ============================================
// HÀM CHÍNH - TẠO TẤT CẢ AUDIO
// ============================================
async function generateAllAudio() {
  console.log('============================================');
  console.log('🎙️  BẮT ĐẦU TẠO AUDIO TỪ FPT.AI');
  console.log('============================================');
  console.log(`📂 Thư mục lưu: ${OUTPUT_DIR}`);
  console.log(`🎤 Giọng đọc: ${VOICE}`);
  console.log(`📚 Tổng số chương: ${CHAPTERS.length}`);
  console.log('============================================\n');

  // Tạo thư mục nếu chưa có
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log('📁 Đã tạo thư mục:', OUTPUT_DIR);
  }

  let successCount = 0;
  let failCount = 0;
  const results = [];

  for (let i = 0; i < CHAPTERS.length; i++) {
    const chapter = CHAPTERS[i];
    const fileName = `${chapter.id}.mp3`;
    const filePath = path.join(OUTPUT_DIR, fileName);

    console.log(`\n[${i + 1}/${CHAPTERS.length}] 🔄 Đang tạo: ${chapter.title}`);

    try {
      // Gọi API
      const textToSpeak = `${chapter.title}. ${chapter.content}`;
      const response = await callFPTApi(textToSpeak);

      if (response.error === 0 && response.async) {
        console.log(`   ⏳ Đang đợi audio sẵn sàng...`);
        
        // Đợi file sẵn sàng
        await waitForAudio(response.async);
        
        // Tải file
        await downloadFile(response.async, filePath);
        
        console.log(`   ✅ Đã lưu: ${fileName}`);
        successCount++;
        results.push({ id: chapter.id, file: fileName, status: 'success' });
      } else {
        throw new Error(response.message || 'API Error');
      }
    } catch (error) {
      console.log(`   ❌ Lỗi: ${error.message}`);
      failCount++;
      results.push({ id: chapter.id, file: fileName, status: 'failed', error: error.message });
    }

    // Đợi 2 giây giữa mỗi request để tránh rate limit
    if (i < CHAPTERS.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  // Tổng kết
  console.log('\n============================================');
  console.log('📊 KẾT QUẢ');
  console.log('============================================');
  console.log(`✅ Thành công: ${successCount}/${CHAPTERS.length}`);
  console.log(`❌ Thất bại: ${failCount}/${CHAPTERS.length}`);
  console.log(`📂 File lưu tại: ${OUTPUT_DIR}`);
  console.log('============================================\n');

  // Lưu kết quả ra file JSON
  const resultFile = path.join(OUTPUT_DIR, 'audio-results.json');
  fs.writeFileSync(resultFile, JSON.stringify(results, null, 2));
  console.log(`📄 Kết quả chi tiết: ${resultFile}`);

  // Tạo file audioMap để dùng trong app
  const audioMap = {};
  results.filter(r => r.status === 'success').forEach(r => {
    audioMap[r.id] = `/audio/stories/${r.file}`;
  });
  
  const mapFile = path.join(OUTPUT_DIR, 'audioMap.json');
  fs.writeFileSync(mapFile, JSON.stringify(audioMap, null, 2));
  console.log(`📄 Audio map: ${mapFile}`);
}

// Chạy script
generateAllAudio().catch(console.error);
