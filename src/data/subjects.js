// src/data/subjects.js
// NỘI DUNG MÔN HỌC - Tiếng Anh thiết kế lại cho trẻ 3-6 tuổi

export const SUBJECTS = {
  math: {
    id: 'math',
    name: 'Toán Học',
    icon: '🔢',
    color: 'from-blue-500 to-cyan-500',
    desc: 'Học đếm, phép tính, hình học',
    useMathLessons: true, // Flag để dùng mathLessons.js
    lessons: [
      // Level 1: Làm quen số (3-4 tuổi) - 15 bài
      { id: 'math-1-1', title: 'Số 1 - Một', level: 1, desc: 'Học số 1 qua hình ảnh' },
      { id: 'math-1-2', title: 'Số 2 - Hai', level: 1, desc: 'Học số 2 qua hình ảnh' },
      { id: 'math-1-3', title: 'Số 3 - Ba', level: 1, desc: 'Học số 3 qua hình ảnh' },
      { id: 'math-1-4', title: 'Số 4 - Bốn', level: 1, desc: 'Học số 4 qua hình ảnh' },
      { id: 'math-1-5', title: 'Số 5 - Năm', level: 1, desc: 'Học số 5 với bàn tay' },
      { id: 'math-1-6', title: 'Số 6 - Sáu', level: 1, desc: 'Học số 6 qua hình ảnh' },
      { id: 'math-1-7', title: 'Số 7 - Bảy', level: 1, desc: 'Học số 7 - cầu vồng' },
      { id: 'math-1-8', title: 'Số 8 - Tám', level: 1, desc: 'Học số 8 - bạch tuộc' },
      { id: 'math-1-9', title: 'Số 9 - Chín', level: 1, desc: 'Học số 9 qua hình ảnh' },
      { id: 'math-1-10', title: 'Số 10 - Mười', level: 1, desc: 'Học số 10 - hai bàn tay' },
      { id: 'math-1-11', title: 'Ôn tập số 1-5', level: 1, desc: 'Ôn lại các số 1 đến 5' },
      { id: 'math-1-12', title: 'Ôn tập số 6-10', level: 1, desc: 'Ôn lại các số 6 đến 10' },
      { id: 'math-1-13', title: 'So sánh: Nhiều hơn', level: 1, desc: 'Học cách so sánh' },
      { id: 'math-1-14', title: 'So sánh: Ít hơn', level: 1, desc: 'Học cách so sánh' },
      { id: 'math-1-15', title: '🏆 Kiểm tra Level 1', level: 1, desc: 'Bài kiểm tra số 1-10' },
      
      // Level 2: Phép cộng (4-5 tuổi) - 10 bài
      { id: 'math-2-1', title: 'Cộng với 1', level: 2, desc: 'Học phép cộng với 1' },
      { id: 'math-2-2', title: 'Cộng với 2', level: 2, desc: 'Học phép cộng với 2' },
      { id: 'math-2-3', title: 'Cộng trong phạm vi 5', level: 2, desc: 'Cộng có kết quả ≤ 5' },
      { id: 'math-2-4', title: 'Cộng với 3', level: 2, desc: 'Học phép cộng với 3' },
      { id: 'math-2-5', title: 'Cộng với 4', level: 2, desc: 'Học phép cộng với 4' },
      { id: 'math-2-6', title: 'Cộng với 5', level: 2, desc: 'Cộng 5 - một bàn tay' },
      { id: 'math-2-7', title: 'Cộng trong phạm vi 10', level: 2, desc: 'Cộng có kết quả ≤ 10' },
      { id: 'math-2-8', title: 'Phép cộng ngược', level: 2, desc: 'Tính chất giao hoán' },
      { id: 'math-2-9', title: 'Cộng với 0', level: 2, desc: 'Số 0 trong phép cộng' },
      { id: 'math-2-10', title: 'Tìm số còn thiếu', level: 2, desc: 'Điền số vào ô trống' },
      
      // Level 3: Phép trừ (5-6 tuổi) - 15 bài
      { id: 'math-3-1', title: 'Trừ đi 1', level: 3, desc: 'Học phép trừ với 1' },
      { id: 'math-3-2', title: 'Trừ đi 2', level: 3, desc: 'Học phép trừ với 2' },
      { id: 'math-3-3', title: 'Trừ trong phạm vi 5', level: 3, desc: 'Trừ có kết quả ≤ 5' },
      { id: 'math-3-4', title: 'Trừ đi 3', level: 3, desc: 'Học phép trừ với 3' },
      { id: 'math-3-5', title: 'Trừ đi 4', level: 3, desc: 'Học phép trừ với 4' },
      { id: 'math-3-6', title: 'Trừ đi 5', level: 3, desc: 'Trừ 5 - một bàn tay' },
      { id: 'math-3-7', title: 'Trừ trong phạm vi 10', level: 3, desc: 'Trừ trong phạm vi 10' },
      { id: 'math-3-8', title: 'Trừ với 0', level: 3, desc: 'Số 0 trong phép trừ' },
      { id: 'math-3-9', title: 'Tìm số bị trừ', level: 3, desc: 'Điền số vào ô trống' },
      { id: 'math-3-10', title: 'Tìm số trừ', level: 3, desc: 'Điền số trừ' },
      { id: 'math-3-11', title: 'Cộng và Trừ', level: 3, desc: 'Luyện cả cộng và trừ' },
      { id: 'math-3-12', title: 'Bài toán có lời văn 1', level: 3, desc: 'Giải bài toán đơn giản' },
      { id: 'math-3-13', title: 'Bài toán có lời văn 2', level: 3, desc: 'Giải thêm bài toán' },
      { id: 'math-3-14', title: 'Ôn tập Level 3', level: 3, desc: 'Ôn lại phép trừ' },
      { id: 'math-3-15', title: '🏆 Kiểm tra Level 3', level: 3, desc: 'Bài kiểm tra phép trừ' },
      
      // Level 4: Số đến 20 (6-7 tuổi) - 10 bài
      { id: 'math-4-1', title: 'Số 11 - Mười một', level: 4, desc: 'Học số 11' },
      { id: 'math-4-2', title: 'Số 12-15', level: 4, desc: 'Học số từ 12 đến 15' },
      { id: 'math-4-3', title: 'Số 16-20', level: 4, desc: 'Học số từ 16 đến 20' },
      { id: 'math-4-4', title: 'Đếm 11-20', level: 4, desc: 'Luyện đếm số 11-20' },
      { id: 'math-4-5', title: 'Cộng có kết quả đến 20', level: 4, desc: 'Phép cộng lớn hơn' },
      { id: 'math-4-6', title: 'Trừ từ số đến 20', level: 4, desc: 'Phép trừ với số lớn' },
      { id: 'math-4-7', title: 'So sánh số đến 20', level: 4, desc: 'Lớn hơn, nhỏ hơn' },
      { id: 'math-4-8', title: 'Bài toán đến 20', level: 4, desc: 'Giải bài toán' },
      { id: 'math-4-9', title: 'Ôn tập Level 4', level: 4, desc: 'Ôn lại số đến 20' },
      { id: 'math-4-10', title: '🏆 Kiểm tra Level 4', level: 4, desc: 'Bài kiểm tra cuối' },
    ],
  },
  
  vietnamese: {
    id: 'vietnamese',
    name: 'Tiếng Việt',
    icon: '📖',
    color: 'from-green-500 to-emerald-500',
    desc: 'Học chữ cái, ghép vần, đọc hiểu',
    useVietnameseLessons: true, // Flag để dùng vietnameseLessons.js
    lessons: [
      // Level 1: Chữ cái (3-4 tuổi) - 15 bài
      { id: 'viet-1-1', title: 'Chữ A - a', level: 1, desc: 'Học chữ A và từ bắt đầu bằng A' },
      { id: 'viet-1-2', title: 'Chữ B - b', level: 1, desc: 'Học chữ B và từ bắt đầu bằng B' },
      { id: 'viet-1-3', title: 'Chữ C - c', level: 1, desc: 'Học chữ C và từ bắt đầu bằng C' },
      { id: 'viet-1-4', title: 'Chữ D - Đ', level: 1, desc: 'Học chữ D, Đ và phân biệt' },
      { id: 'viet-1-5', title: 'Chữ E - Ê', level: 1, desc: 'Học chữ E, Ê và phân biệt' },
      { id: 'viet-1-6', title: 'Chữ G - H', level: 1, desc: 'Học chữ G, H' },
      { id: 'viet-1-7', title: 'Chữ I - K', level: 1, desc: 'Học chữ I, K' },
      { id: 'viet-1-8', title: 'Chữ L - M', level: 1, desc: 'Học chữ L, M' },
      { id: 'viet-1-9', title: 'Chữ N - O - Ô - Ơ', level: 1, desc: 'Học N và 3 chữ O' },
      { id: 'viet-1-10', title: 'Chữ P - Q - R', level: 1, desc: 'Học chữ P, Q, R' },
      { id: 'viet-1-11', title: 'Chữ S - T', level: 1, desc: 'Học chữ S, T' },
      { id: 'viet-1-12', title: 'Chữ U - Ư - V', level: 1, desc: 'Học chữ U, Ư, V' },
      { id: 'viet-1-13', title: 'Chữ X - Y', level: 1, desc: 'Học chữ X, Y' },
      { id: 'viet-1-14', title: 'Ôn tập chữ cái', level: 1, desc: 'Ôn lại tất cả chữ cái' },
      { id: 'viet-1-15', title: '🏆 Kiểm tra Level 1', level: 1, desc: 'Kiểm tra chữ cái' },
      
      // Level 2: Nguyên âm & Phụ âm (4-5 tuổi) - 10 bài
      { id: 'viet-2-1', title: 'Nguyên âm đơn', level: 2, desc: 'A, E, I, O, U, Y' },
      { id: 'viet-2-2', title: 'Nguyên âm có dấu phụ', level: 2, desc: 'Ă, Â, Ê, Ô, Ơ, Ư' },
      { id: 'viet-2-3', title: 'Phụ âm đơn (1)', level: 2, desc: 'B, C, D, Đ, G, H' },
      { id: 'viet-2-4', title: 'Phụ âm đơn (2)', level: 2, desc: 'K, L, M, N, P, Q' },
      { id: 'viet-2-5', title: 'Phụ âm đơn (3)', level: 2, desc: 'R, S, T, V, X' },
      { id: 'viet-2-6', title: 'Phụ âm ghép CH - GH', level: 2, desc: 'Học CH, GH' },
      { id: 'viet-2-7', title: 'Phụ âm ghép KH - NG - NGH', level: 2, desc: 'Học KH, NG, NGH' },
      { id: 'viet-2-8', title: 'Phụ âm ghép NH - PH - TH - TR', level: 2, desc: 'Học NH, PH, TH, TR' },
      { id: 'viet-2-9', title: 'Ôn tập nguyên âm & phụ âm', level: 2, desc: 'Ôn lại Level 2' },
      { id: 'viet-2-10', title: '🏆 Kiểm tra Level 2', level: 2, desc: 'Kiểm tra nguyên âm & phụ âm' },
      
      // Level 3: Vần đơn giản (5-6 tuổi) - 15 bài
      { id: 'viet-3-1', title: 'Vần có A', level: 3, desc: 'BA, CA, LA, MA, NA' },
      { id: 'viet-3-2', title: 'Vần có O - Ô - Ơ', level: 3, desc: 'BO, BÔ, BƠ' },
      { id: 'viet-3-3', title: 'Vần có E - Ê', level: 3, desc: 'BE, ME, BÊ, MÊ' },
      { id: 'viet-3-4', title: 'Vần có I - U - Ư', level: 3, desc: 'BI, BU, TƯ' },
      { id: 'viet-3-5', title: 'Đọc từ gia đình', level: 3, desc: 'Bố, Mẹ, Bé, Anh, Chị' },
      { id: 'viet-3-6', title: 'Đọc từ con vật', level: 3, desc: 'Gà, Vịt, Cá, Chó, Mèo' },
      { id: 'viet-3-7', title: 'Đọc từ trái cây', level: 3, desc: 'Cam, Táo, Chuối, Nho' },
      { id: 'viet-3-8', title: 'Vần AN - ÂN - ƠN', level: 3, desc: 'Vần kết thúc bằng N' },
      { id: 'viet-3-9', title: 'Vần AT - ÂT - ƠT', level: 3, desc: 'Vần kết thúc bằng T' },
      { id: 'viet-3-10', title: 'Vần AM - ÂM - ƠM', level: 3, desc: 'Vần kết thúc bằng M' },
      { id: 'viet-3-11', title: 'Vần ONG - ÔNG - UNG', level: 3, desc: 'Vần kết thúc bằng NG' },
      { id: 'viet-3-12', title: 'Vần ANG - ÂNG - ƯNG', level: 3, desc: 'Thêm vần có NG' },
      { id: 'viet-3-13', title: 'Đọc từ 2 âm tiết', level: 3, desc: 'Ba mẹ, Con cá, Nhà cửa' },
      { id: 'viet-3-14', title: 'Ôn tập vần', level: 3, desc: 'Ôn lại các vần đã học' },
      { id: 'viet-3-15', title: '🏆 Kiểm tra Level 3', level: 3, desc: 'Kiểm tra vần và từ' },
      
      // Level 4: Dấu thanh & Từ (6-7 tuổi) - 10 bài
      { id: 'viet-4-1', title: 'Dấu Sắc (´)', level: 4, desc: 'Học dấu sắc - giọng cao' },
      { id: 'viet-4-2', title: 'Dấu Huyền (`)', level: 4, desc: 'Học dấu huyền - giọng thấp' },
      { id: 'viet-4-3', title: 'Dấu Hỏi (?)', level: 4, desc: 'Học dấu hỏi - giọng uốn' },
      { id: 'viet-4-4', title: 'Dấu Ngã (~)', level: 4, desc: 'Học dấu ngã - giọng gãy' },
      { id: 'viet-4-5', title: 'Dấu Nặng (.)', level: 4, desc: 'Học dấu nặng - giọng đứt' },
      { id: 'viet-4-6', title: 'Phân biệt 5 dấu', level: 4, desc: 'Ôn tập 5 dấu thanh' },
      { id: 'viet-4-7', title: 'Đọc câu ngắn (1)', level: 4, desc: 'Câu 3-4 từ' },
      { id: 'viet-4-8', title: 'Đọc câu ngắn (2)', level: 4, desc: 'Thêm câu mới' },
      { id: 'viet-4-9', title: 'Ôn tập Level 4', level: 4, desc: 'Ôn lại dấu và câu' },
      { id: 'viet-4-10', title: '🏆 Kiểm tra Level 4', level: 4, desc: 'Kiểm tra cuối cùng' },
    ],
  },
  
  english: {
    id: 'english',
    name: 'Tiếng Anh',
    icon: '🌍',
    color: 'from-red-500 to-orange-500',
    desc: 'Học qua hình ảnh, âm thanh, trò chơi',
    lessons: [
      // ========== LEVEL 1: Làm quen (3-4 tuổi) - Nghe + Nhìn + Chọn hình ==========
      { id: 'e1', title: '🍎 Trái cây', level: 1, desc: 'Apple, Banana, Orange...' },
      { id: 'e2', title: '🐕 Con vật', level: 1, desc: 'Dog, Cat, Bird...' },
      { id: 'e3', title: '🔴 Màu sắc', level: 1, desc: 'Red, Blue, Yellow...' },
      { id: 'e4', title: '1️⃣ Số 1-5', level: 1, desc: 'One, Two, Three...' },
      { id: 'e5', title: '👨‍👩‍👧 Gia đình', level: 1, desc: 'Mom, Dad, Baby...' },
      { id: 'e6', title: '🍕 Đồ ăn', level: 1, desc: 'Rice, Bread, Milk...' },
      
      // ========== LEVEL 2: Mở rộng (4-5 tuổi) - Nghe + Chọn hình + Đếm ==========
      { id: 'e7', title: '🐘 Thú hoang dã', level: 2, desc: 'Lion, Elephant, Monkey...' },
      { id: 'e8', title: '🥕 Rau củ', level: 2, desc: 'Carrot, Tomato, Corn...' },
      { id: 'e9', title: '⭕ Hình dạng', level: 2, desc: 'Circle, Square, Star...' },
      { id: 'e10', title: '6️⃣ Số 6-10', level: 2, desc: 'Six, Seven, Eight...' },
      { id: 'e11', title: '👕 Quần áo', level: 2, desc: 'Shirt, Pants, Shoes...' },
      { id: 'e12', title: '🧸 Đồ chơi', level: 2, desc: 'Ball, Doll, Car...' },
      { id: 'e13', title: '🏠 Trong nhà', level: 2, desc: 'Bed, Chair, Door...' },
      { id: 'e14', title: '👀 Cơ thể', level: 2, desc: 'Eyes, Nose, Mouth...' },
      
      // ========== LEVEL 3: Giao tiếp (5-6 tuổi) - Nghe + Nói + Câu đơn giản ==========
      { id: 'e15', title: '👋 Chào hỏi', level: 3, desc: 'Hello! Goodbye!' },
      { id: 'e16', title: '😊 Cảm xúc', level: 3, desc: 'Happy, Sad, Hungry...' },
      { id: 'e17', title: '🌤️ Thời tiết', level: 3, desc: 'Sunny, Rainy, Hot...' },
      { id: 'e18', title: '🎯 Hành động', level: 3, desc: 'Run, Jump, Eat...' },
      { id: 'e19', title: '❓ Hỏi đáp', level: 3, desc: 'What? How many?' },
      { id: 'e20', title: '💬 Câu ngắn', level: 3, desc: 'I like... This is...' },
    ],
  },
  
  science: {
    id: 'science',
    name: 'Khoa Học',
    icon: '🔬',
    color: 'from-purple-500 to-pink-500',
    desc: 'Khám phá thế giới xung quanh',
    useScienceLessons: true, // Flag để dùng scienceLessons.js
    lessons: [
      // Level 1: Thế giới động vật (6 bài)
      { id: 's1-1', title: 'Con vật nuôi', level: 1, desc: 'Chó, mèo, gà, vịt...' },
      { id: 's1-2', title: 'Con vật hoang dã', level: 1, desc: 'Sư tử, voi, hổ...' },
      { id: 's1-3', title: 'Con vật dưới nước', level: 1, desc: 'Cá, tôm, cua, cá heo...' },
      { id: 's1-4', title: 'Côn trùng', level: 1, desc: 'Bướm, ong, kiến, đom đóm...' },
      { id: 's1-5', title: 'Chim chóc', level: 1, desc: 'Chim sẻ, vẹt, cánh cụt...' },
      { id: 's1-6', title: 'Ôn tập động vật', level: 1, desc: 'Ôn lại kiến thức động vật' },

      // Level 2: Thực vật & Môi trường (6 bài)
      { id: 's2-1', title: 'Cây cối', level: 2, desc: 'Rễ, thân, lá, hoa, quả' },
      { id: 's2-2', title: 'Hoa quả', level: 2, desc: 'Táo, chuối, cam, dưa hấu...' },
      { id: 's2-3', title: 'Thời tiết', level: 2, desc: 'Nắng, mưa, mây, cầu vồng' },
      { id: 's2-4', title: 'Mùa trong năm', level: 2, desc: 'Xuân, hạ, thu, đông' },
      { id: 's2-5', title: 'Bảo vệ môi trường', level: 2, desc: 'Tái chế, tiết kiệm nước' },
      { id: 's2-6', title: 'Ôn tập thực vật', level: 2, desc: 'Ôn lại thực vật & môi trường' },

      // Level 3: Cơ thể người (5 bài)
      { id: 's3-1', title: 'Các bộ phận cơ thể', level: 3, desc: 'Mắt, tai, tim, não...' },
      { id: 's3-2', title: '5 giác quan', level: 3, desc: 'Nghe, nhìn, ngửi, nếm, sờ' },
      { id: 's3-3', title: 'Dinh dưỡng', level: 3, desc: 'Ăn uống lành mạnh' },
      { id: 's3-4', title: 'Vệ sinh cá nhân', level: 3, desc: 'Rửa tay, đánh răng, tắm' },
      { id: 's3-5', title: 'Ôn tập cơ thể', level: 3, desc: 'Ôn lại kiến thức cơ thể' },

      // Level 4: Khoa học vui (5 bài)
      { id: 's4-1', title: 'Hệ mặt trời', level: 4, desc: 'Mặt trời, trái đất, hành tinh' },
      { id: 's4-2', title: 'Nước và trạng thái', level: 4, desc: 'Rắn, lỏng, khí' },
      { id: 's4-3', title: 'Âm thanh', level: 4, desc: 'Âm thanh truyền đi thế nào' },
      { id: 's4-4', title: 'Ánh sáng và màu sắc', level: 4, desc: 'Ánh sáng, bóng tối, cầu vồng' },
      { id: 's4-5', title: 'Ôn tập khoa học', level: 4, desc: 'Ôn tập toàn bộ khoa học' },

      // Level 5: Công nghệ & Trái đất (6 bài)
      { id: 's5-1', title: 'Điện trong cuộc sống', level: 5, desc: 'An toàn điện, tiết kiệm điện' },
      { id: 's5-2', title: 'Máy tính và công nghệ', level: 5, desc: 'Internet, robot, điện thoại' },
      { id: 's5-3', title: 'Phương tiện giao thông', level: 5, desc: 'Xe, máy bay, tàu hỏa, tàu thủy' },
      { id: 's5-4', title: 'Núi lửa và động đất', level: 5, desc: 'Thiên tai và cách phòng tránh' },
      { id: 's5-5', title: 'Tài nguyên thiên nhiên', level: 5, desc: 'Nước, rừng, năng lượng xanh' },
      { id: 's5-6', title: 'Ôn tập công nghệ', level: 5, desc: 'Ôn tập Level 5' },
    ],
  },
};

export const getSubject = (id) => SUBJECTS[id];
export const getAllSubjects = () => Object.values(SUBJECTS);
export const getLesson = (subjectId, lessonId) => {
  const subject = SUBJECTS[subjectId];
  return subject?.lessons.find(l => l.id === lessonId);
};
