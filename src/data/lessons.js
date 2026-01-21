// src/data/lessons.js
// NỘI DUNG CÂU HỎI CHO TẤT CẢ BÀI HỌC

export const LESSON_QUESTIONS = {
  // ==========================================
  // TOÁN HỌC
  // ==========================================
  
  // M1: Đếm 1-5
  m1: [
    { q: 'Đếm số quả táo: 🍎', options: ['1', '2', '3', '4'], answer: '1' },
    { q: 'Đếm số ngôi sao: ⭐⭐', options: ['1', '2', '3', '4'], answer: '2' },
    { q: 'Đếm: 🍎🍎🍎', options: ['2', '3', '4', '5'], answer: '3' },
    { q: 'Đếm số trái tim: ❤️❤️❤️❤️', options: ['3', '4', '5', '6'], answer: '4' },
    { q: 'Đếm: ✋ (ngón tay)', options: ['4', '5', '6', '3'], answer: '5' },
    { q: 'Số nào đứng sau số 2?', options: ['1', '3', '4', '5'], answer: '3' },
    { q: 'Số nào đứng trước số 4?', options: ['2', '3', '5', '6'], answer: '3' },
    { q: 'Đếm: 🌸🌸🌸🌸🌸', options: ['3', '4', '5', '6'], answer: '5' },
  ],
  
  // M2: Đếm 6-10
  m2: [
    { q: 'Đếm: 🎈🎈🎈🎈🎈🎈', options: ['5', '6', '7', '8'], answer: '6' },
    { q: 'Đếm: 🌟🌟🌟🌟🌟🌟🌟', options: ['6', '7', '8', '9'], answer: '7' },
    { q: 'Số nào đứng sau số 7?', options: ['6', '7', '8', '9'], answer: '8' },
    { q: 'Đếm: 🐱🐱🐱🐱🐱🐱🐱🐱🐱', options: ['7', '8', '9', '10'], answer: '9' },
    { q: 'Hai bàn tay có mấy ngón?', options: ['8', '9', '10', '11'], answer: '10' },
    { q: 'Số nào lớn nhất trong 1-10?', options: ['8', '9', '10', '1'], answer: '10' },
    { q: 'Số nào đứng trước số 10?', options: ['8', '9', '11', '7'], answer: '9' },
    { q: 'Đếm ngược: 10, 9, 8, ...?', options: ['6', '7', '5', '9'], answer: '7' },
  ],
  
  // M3: Nhận biết số
  m3: [
    { q: 'Đây là số mấy? 3️⃣', options: ['2', '3', '4', '5'], answer: '3' },
    { q: 'Đây là số mấy? 7️⃣', options: ['6', '7', '8', '9'], answer: '7' },
    { q: 'Số nào giống chữ O?', options: ['0', '6', '8', '9'], answer: '0' },
    { q: 'Số nào có 2 vòng tròn?', options: ['0', '6', '8', '9'], answer: '8' },
    { q: 'Viết số "năm" bằng số?', options: ['4', '5', '6', '7'], answer: '5' },
    { q: 'Số "chín" viết là?', options: ['6', '7', '8', '9'], answer: '9' },
    { q: 'Đây là số mấy? 1️⃣0️⃣', options: ['1', '10', '100', '0'], answer: '10' },
    { q: 'Số không viết là?', options: ['O', '0', '1', '00'], answer: '0' },
  ],
  
  // M4: So sánh nhiều ít
  m4: [
    { q: '🍎🍎🍎 hay 🍎🍎 nhiều hơn?', options: ['3 táo', '2 táo', 'Bằng nhau'], answer: '3 táo' },
    { q: '⭐⭐ hay ⭐⭐⭐⭐ ít hơn?', options: ['2 sao', '4 sao', 'Bằng nhau'], answer: '2 sao' },
    { q: '5 và 3, số nào lớn hơn?', options: ['5', '3', 'Bằng nhau'], answer: '5' },
    { q: '2 và 7, số nào nhỏ hơn?', options: ['2', '7', 'Bằng nhau'], answer: '2' },
    { q: '🎈🎈🎈 và 🎈🎈🎈 bằng nhau?', options: ['Có', 'Không'], answer: 'Có' },
    { q: 'Đĩa A: 4 kẹo, Đĩa B: 6 kẹo. Đĩa nào nhiều?', options: ['Đĩa A', 'Đĩa B', 'Bằng nhau'], answer: 'Đĩa B' },
    { q: '8 và 8, so sánh?', options: ['8 > 8', '8 < 8', '8 = 8'], answer: '8 = 8' },
    { q: '1 là số nhỏ nhất trong?', options: ['1, 2, 3', '0, 1, 2', '2, 3, 4'], answer: '0, 1, 2' },
  ],
  
  // M5: Đếm 11-20
  m5: [
    { q: 'Số nào đứng sau 10?', options: ['9', '11', '12', '10'], answer: '11' },
    { q: '10 + 2 = ?', options: ['11', '12', '13', '14'], answer: '12' },
    { q: 'Mười lăm viết là?', options: ['14', '15', '16', '17'], answer: '15' },
    { q: 'Số nào đứng trước 20?', options: ['18', '19', '21', '17'], answer: '19' },
    { q: '10 + 7 = ?', options: ['16', '17', '18', '19'], answer: '17' },
    { q: 'Hai mươi viết là?', options: ['12', '20', '21', '200'], answer: '20' },
    { q: 'Số nào lớn nhất: 13, 18, 11, 16?', options: ['13', '18', '11', '16'], answer: '18' },
    { q: '10 + 10 = ?', options: ['10', '20', '100', '11'], answer: '20' },
  ],
  
  // M6: Phép cộng đến 5
  m6: [
    { q: '1 + 1 = ?', options: ['1', '2', '3', '0'], answer: '2' },
    { q: '2 + 1 = ?', options: ['2', '3', '4', '1'], answer: '3' },
    { q: '2 + 2 = ?', options: ['3', '4', '5', '2'], answer: '4' },
    { q: '1 + 3 = ?', options: ['3', '4', '5', '2'], answer: '4' },
    { q: '3 + 2 = ?', options: ['4', '5', '6', '3'], answer: '5' },
    { q: '0 + 4 = ?', options: ['0', '4', '5', '3'], answer: '4' },
    { q: '1 + 4 = ?', options: ['4', '5', '6', '3'], answer: '5' },
    { q: '🍎 + 🍎🍎 = ? quả', options: ['2', '3', '4', '1'], answer: '3' },
  ],
  
  // M7: Phép cộng đến 10
  m7: [
    { q: '3 + 4 = ?', options: ['6', '7', '8', '5'], answer: '7' },
    { q: '5 + 3 = ?', options: ['7', '8', '9', '6'], answer: '8' },
    { q: '4 + 5 = ?', options: ['8', '9', '10', '7'], answer: '9' },
    { q: '5 + 5 = ?', options: ['9', '10', '11', '8'], answer: '10' },
    { q: '6 + 2 = ?', options: ['7', '8', '9', '6'], answer: '8' },
    { q: '7 + 3 = ?', options: ['9', '10', '11', '8'], answer: '10' },
    { q: '4 + 4 = ?', options: ['7', '8', '9', '6'], answer: '8' },
    { q: '2 + 6 = ?', options: ['7', '8', '9', '6'], answer: '8' },
  ],
  
  // M8: Phép trừ đến 5
  m8: [
    { q: '2 - 1 = ?', options: ['0', '1', '2', '3'], answer: '1' },
    { q: '3 - 1 = ?', options: ['1', '2', '3', '4'], answer: '2' },
    { q: '4 - 2 = ?', options: ['1', '2', '3', '4'], answer: '2' },
    { q: '5 - 3 = ?', options: ['1', '2', '3', '4'], answer: '2' },
    { q: '5 - 5 = ?', options: ['0', '1', '5', '10'], answer: '0' },
    { q: '4 - 1 = ?', options: ['2', '3', '4', '5'], answer: '3' },
    { q: '3 - 0 = ?', options: ['0', '3', '2', '1'], answer: '3' },
    { q: '🍎🍎🍎 - 🍎 = ? quả', options: ['1', '2', '3', '4'], answer: '2' },
  ],
  
  // M9: Phép trừ đến 10
  m9: [
    { q: '7 - 3 = ?', options: ['3', '4', '5', '6'], answer: '4' },
    { q: '8 - 5 = ?', options: ['2', '3', '4', '5'], answer: '3' },
    { q: '10 - 4 = ?', options: ['5', '6', '7', '8'], answer: '6' },
    { q: '9 - 6 = ?', options: ['2', '3', '4', '5'], answer: '3' },
    { q: '10 - 10 = ?', options: ['0', '1', '10', '20'], answer: '0' },
    { q: '6 - 4 = ?', options: ['1', '2', '3', '4'], answer: '2' },
    { q: '8 - 2 = ?', options: ['5', '6', '7', '8'], answer: '6' },
    { q: '10 - 7 = ?', options: ['2', '3', '4', '5'], answer: '3' },
  ],
  
  // M10: So sánh số
  m10: [
    { q: '5 __ 3 (điền dấu)', options: ['<', '>', '='], answer: '>' },
    { q: '2 __ 7 (điền dấu)', options: ['<', '>', '='], answer: '<' },
    { q: '4 __ 4 (điền dấu)', options: ['<', '>', '='], answer: '=' },
    { q: '9 __ 6 (điền dấu)', options: ['<', '>', '='], answer: '>' },
    { q: '1 __ 10 (điền dấu)', options: ['<', '>', '='], answer: '<' },
    { q: 'Sắp xếp tăng dần: 3, 1, 2', options: ['1, 2, 3', '3, 2, 1', '2, 1, 3'], answer: '1, 2, 3' },
    { q: 'Sắp xếp giảm dần: 5, 8, 3', options: ['3, 5, 8', '8, 5, 3', '5, 3, 8'], answer: '8, 5, 3' },
    { q: 'Số nào nằm giữa 4 và 6?', options: ['3', '5', '7', '4'], answer: '5' },
  ],
  
  // M11-M15: Nâng cao
  m11: [
    { q: '20 + 10 = ?', options: ['25', '30', '35', '40'], answer: '30' },
    { q: 'Số nào đứng sau 29?', options: ['28', '30', '31', '39'], answer: '30' },
    { q: '40 + 5 = ?', options: ['44', '45', '46', '50'], answer: '45' },
    { q: '50 - 10 = ?', options: ['30', '40', '45', '50'], answer: '40' },
    { q: 'Số nào lớn nhất: 32, 45, 28, 50?', options: ['32', '45', '28', '50'], answer: '50' },
  ],
  
  m12: [
    { q: '7 + 5 = ?', options: ['11', '12', '13', '14'], answer: '12' },
    { q: '8 + 6 = ?', options: ['13', '14', '15', '16'], answer: '14' },
    { q: '9 + 4 = ?', options: ['12', '13', '14', '15'], answer: '13' },
    { q: '8 + 8 = ?', options: ['14', '15', '16', '17'], answer: '16' },
    { q: '9 + 9 = ?', options: ['16', '17', '18', '19'], answer: '18' },
  ],
  
  m13: [
    { q: '12 - 5 = ?', options: ['6', '7', '8', '9'], answer: '7' },
    { q: '15 - 8 = ?', options: ['6', '7', '8', '9'], answer: '7' },
    { q: '14 - 6 = ?', options: ['7', '8', '9', '10'], answer: '8' },
    { q: '16 - 9 = ?', options: ['6', '7', '8', '9'], answer: '7' },
    { q: '18 - 9 = ?', options: ['8', '9', '10', '11'], answer: '9' },
  ],
  
  m14: [
    { q: 'Hình vuông có mấy cạnh?', options: ['3', '4', '5', '6'], answer: '4' },
    { q: 'Hình tròn có mấy góc?', options: ['0', '1', '2', '4'], answer: '0' },
    { q: 'Hình tam giác có mấy cạnh?', options: ['2', '3', '4', '5'], answer: '3' },
    { q: 'Quả bóng có hình gì?', options: ['Vuông', 'Tròn', 'Tam giác'], answer: 'Tròn' },
    { q: 'Bánh xe có hình?', options: ['Vuông', 'Tròn', 'Tam giác'], answer: 'Tròn' },
  ],
  
  m15: [
    { q: 'Cái nào dài hơn: Bút chì hay cục tẩy?', options: ['Bút chì', 'Cục tẩy'], answer: 'Bút chì' },
    { q: 'Cái nào cao hơn: Cây hay hoa?', options: ['Cây', 'Hoa'], answer: 'Cây' },
    { q: 'Cái nào nặng hơn: Voi hay kiến?', options: ['Voi', 'Kiến'], answer: 'Voi' },
    { q: '1 giờ có bao nhiêu phút?', options: ['30', '60', '100'], answer: '60' },
    { q: '1 ngày có bao nhiêu giờ?', options: ['12', '24', '60'], answer: '24' },
  ],
};

export const getLessonQuestions = (lessonId) => LESSON_QUESTIONS[lessonId] || [];

// V1: Chữ cái A-D
export const VIETNAMESE_LESSONS = {
  v1: [
    { q: 'Chữ cái đầu tiên trong bảng chữ cái?', options: ['B', 'A', 'C', 'D'], answer: 'A' },
    { q: 'Từ "Ăn" bắt đầu bằng chữ?', options: ['A', 'Ă', 'Â', 'B'], answer: 'Ă' },
    { q: 'Chữ nào có dấu mũ? A, Ă, Â', options: ['A', 'Ă', 'Â'], answer: 'Â' },
    { q: 'Từ "Bố" bắt đầu bằng chữ?', options: ['A', 'B', 'C', 'D'], answer: 'B' },
    { q: 'Chữ nào đứng sau B?', options: ['A', 'C', 'D', 'Đ'], answer: 'C' },
    { q: 'Từ "Cá" bắt đầu bằng chữ?', options: ['B', 'C', 'D', 'K'], answer: 'C' },
    { q: 'Chữ Đ khác chữ D như thế nào?', options: ['Có gạch ngang', 'Có dấu mũ', 'Giống nhau'], answer: 'Có gạch ngang' },
    { q: 'Đọc chữ này: Đ', options: ['Dê', 'Đê', 'De'], answer: 'Đê' },
  ],
  
  // V2: Chữ cái E-I
  v2: [
    { q: 'Chữ nào có dấu mũ: E hay Ê?', options: ['E', 'Ê', 'Cả hai'], answer: 'Ê' },
    { q: 'Từ "Em" bắt đầu bằng chữ?', options: ['E', 'Ê', 'I', 'A'], answer: 'E' },
    { q: 'Chữ nào đứng sau G?', options: ['F', 'H', 'I', 'K'], answer: 'H' },
    { q: 'Từ "Gà" bắt đầu bằng chữ?', options: ['G', 'H', 'K', 'C'], answer: 'G' },
    { q: 'Đọc chữ này: H', options: ['Hát', 'Hờ', 'Ha'], answer: 'Hờ' },
    { q: 'Chữ nào đứng trước I?', options: ['G', 'H', 'K', 'E'], answer: 'H' },
    { q: 'Từ "Hoa" bắt đầu bằng chữ?', options: ['H', 'O', 'A', 'K'], answer: 'H' },
    { q: 'Từ "Ì" có dấu gì?', options: ['Sắc', 'Huyền', 'Hỏi', 'Nặng'], answer: 'Huyền' },
  ],
  
  // V3: Chữ cái K-O
  v3: [
    { q: 'Chữ K đọc là?', options: ['Ka', 'Kờ', 'Ke'], answer: 'Ka' },
    { q: 'Từ "Lá" bắt đầu bằng chữ?', options: ['K', 'L', 'M', 'N'], answer: 'L' },
    { q: 'Chữ nào đứng sau M?', options: ['L', 'N', 'O', 'P'], answer: 'N' },
    { q: 'Từ "Mẹ" bắt đầu bằng chữ?', options: ['M', 'N', 'L', 'K'], answer: 'M' },
    { q: 'Chữ O, Ô, Ơ - chữ nào có dấu móc?', options: ['O', 'Ô', 'Ơ'], answer: 'Ơ' },
    { q: 'Chữ Ô có dấu gì?', options: ['Dấu móc', 'Dấu mũ', 'Không dấu'], answer: 'Dấu mũ' },
    { q: 'Từ "Nước" bắt đầu bằng chữ?', options: ['M', 'N', 'L', 'Ư'], answer: 'N' },
    { q: 'Đọc chữ này: Ơ', options: ['O', 'Ô', 'Ơ'], answer: 'Ơ' },
  ],
  
  // V4: Chữ cái P-U
  v4: [
    { q: 'Chữ P đọc là?', options: ['Pờ', 'Pa', 'Pe'], answer: 'Pờ' },
    { q: 'Từ "Quả" bắt đầu bằng chữ?', options: ['Q', 'K', 'C', 'P'], answer: 'Q' },
    { q: 'Chữ nào đứng sau R?', options: ['Q', 'S', 'T', 'P'], answer: 'S' },
    { q: 'Từ "Sách" bắt đầu bằng chữ?', options: ['S', 'X', 'C', 'T'], answer: 'S' },
    { q: 'Chữ U, Ư - chữ nào có dấu móc?', options: ['U', 'Ư'], answer: 'Ư' },
    { q: 'Từ "Tay" bắt đầu bằng chữ?', options: ['T', 'S', 'R', 'D'], answer: 'T' },
    { q: 'Đọc chữ này: Ư', options: ['U', 'Ư', 'Ơ'], answer: 'Ư' },
    { q: 'Chữ nào đứng trước U?', options: ['T', 'S', 'R', 'V'], answer: 'T' },
  ],
  
  // V5: Chữ cái V-Y
  v5: [
    { q: 'Chữ V đọc là?', options: ['Vờ', 'Va', 'Ve'], answer: 'Vờ' },
    { q: 'Từ "Xe" bắt đầu bằng chữ?', options: ['X', 'S', 'C', 'K'], answer: 'X' },
    { q: 'Chữ cuối bảng chữ cái tiếng Việt?', options: ['Z', 'Y', 'W', 'X'], answer: 'Y' },
    { q: 'Từ "Yêu" bắt đầu bằng chữ?', options: ['I', 'Y', 'U', 'Ư'], answer: 'Y' },
    { q: 'Bảng chữ cái tiếng Việt có mấy chữ?', options: ['26', '29', '24'], answer: '29' },
    { q: 'Chữ nào KHÔNG có trong tiếng Việt?', options: ['W', 'Y', 'X', 'V'], answer: 'W' },
    { q: 'Từ "Vui" bắt đầu bằng chữ?', options: ['V', 'U', 'I', 'Y'], answer: 'V' },
    { q: 'Chữ X đọc là?', options: ['Xờ', 'Ích', 'Xi'], answer: 'Ích' },
  ],
  
  // V6: Vần đơn giản
  v6: [
    { q: 'Ghép: B + A = ?', options: ['BA', 'AB', 'BE', 'BI'], answer: 'BA' },
    { q: 'Ghép: M + Ẹ = ?', options: ['MẸ', 'ME', 'MA', 'MO'], answer: 'MẸ' },
    { q: 'Từ "BÉ" có vần gì?', options: ['A', 'E', 'I', 'O'], answer: 'E' },
    { q: 'Ghép: L + A = ?', options: ['LA', 'LO', 'LE', 'LI'], answer: 'LA' },
    { q: 'Ghép: Đ + I = ?', options: ['ĐI', 'ĐA', 'ĐO', 'ĐE'], answer: 'ĐI' },
    { q: 'Từ "CÁ" ghép từ?', options: ['C + A', 'C + Á', 'K + A'], answer: 'C + A' },
    { q: 'Ghép: N + O = ?', options: ['NO', 'NA', 'NE', 'NI'], answer: 'NO' },
    { q: 'Từ "TÔ" có vần gì?', options: ['O', 'Ô', 'Ơ', 'U'], answer: 'Ô' },
  ],
  
  // V7: Vần có dấu
  v7: [
    { q: 'Từ "MÁ" có dấu gì?', options: ['Sắc', 'Huyền', 'Hỏi', 'Ngã'], answer: 'Sắc' },
    { q: 'Từ "MÀ" có dấu gì?', options: ['Sắc', 'Huyền', 'Hỏi', 'Ngã'], answer: 'Huyền' },
    { q: 'Từ "MẢ" có dấu gì?', options: ['Sắc', 'Huyền', 'Hỏi', 'Ngã'], answer: 'Hỏi' },
    { q: 'Từ "MÃ" có dấu gì?', options: ['Sắc', 'Huyền', 'Hỏi', 'Ngã'], answer: 'Ngã' },
    { q: 'Từ "MẠ" có dấu gì?', options: ['Sắc', 'Huyền', 'Nặng', 'Ngã'], answer: 'Nặng' },
    { q: 'Dấu nào nằm dưới chữ?', options: ['Sắc', 'Huyền', 'Nặng', 'Ngã'], answer: 'Nặng' },
    { q: 'Từ "BỐ" có dấu gì?', options: ['Sắc', 'Huyền', 'Hỏi', 'Nặng'], answer: 'Sắc' },
    { q: 'Từ "CỦA" có dấu gì?', options: ['Sắc', 'Huyền', 'Hỏi', 'Ngã'], answer: 'Hỏi' },
  ],
  
  // V8: Vần ghép IA, UA
  v8: [
    { q: 'Ghép: T + IA = ?', options: ['TIA', 'TUA', 'TƯA'], answer: 'TIA' },
    { q: 'Từ "MÚA" có vần gì?', options: ['IA', 'UA', 'ƯA'], answer: 'UA' },
    { q: 'Ghép: M + ƯA = ?', options: ['MIA', 'MUA', 'MƯA'], answer: 'MƯA' },
    { q: 'Từ "LỪA" có vần gì?', options: ['IA', 'UA', 'ƯA'], answer: 'ƯA' },
    { q: 'Ghép: C + UA = ?', options: ['CIA', 'CUA', 'CƯA'], answer: 'CUA' },
    { q: 'Từ "CHIA" có vần gì?', options: ['IA', 'UA', 'ƯA'], answer: 'IA' },
    { q: 'Ghép: Đ + ƯA = ?', options: ['ĐIA', 'ĐUA', 'ĐƯA'], answer: 'ĐƯA' },
    { q: 'Từ "HOA" có vần gì?', options: ['IA', 'UA', 'OA'], answer: 'OA' },
  ],
  
  // V9: Vần ghép AN, ON
  v9: [
    { q: 'Ghép: B + AN = ?', options: ['BAN', 'BON', 'BEN'], answer: 'BAN' },
    { q: 'Từ "CON" có vần gì?', options: ['AN', 'ON', 'EN'], answer: 'ON' },
    { q: 'Ghép: Đ + EN = ?', options: ['ĐAN', 'ĐON', 'ĐEN'], answer: 'ĐEN' },
    { q: 'Từ "BÁN" có vần gì?', options: ['AN', 'ON', 'EN'], answer: 'AN' },
    { q: 'Ghép: T + IN = ?', options: ['TAN', 'TON', 'TIN'], answer: 'TIN' },
    { q: 'Từ "SEN" có vần gì?', options: ['AN', 'ON', 'EN'], answer: 'EN' },
    { q: 'Ghép: M + AN = ?', options: ['MAN', 'MON', 'MEN'], answer: 'MAN' },
    { q: 'Từ "LON" có vần gì?', options: ['AN', 'ON', 'UN'], answer: 'ON' },
  ],
  
  // V10: Từ đơn giản
  v10: [
    { q: 'Đây là con gì? 🐱', options: ['Chó', 'Mèo', 'Gà', 'Vịt'], answer: 'Mèo' },
    { q: 'Đây là quả gì? 🍎', options: ['Cam', 'Chuối', 'Táo', 'Nho'], answer: 'Táo' },
    { q: 'Đây là gì? 🏠', options: ['Xe', 'Nhà', 'Cây', 'Hoa'], answer: 'Nhà' },
    { q: 'Đây là gì? ☀️', options: ['Mặt trăng', 'Mặt trời', 'Sao', 'Mây'], answer: 'Mặt trời' },
    { q: 'Đây là gì? 🌸', options: ['Lá', 'Cây', 'Hoa', 'Quả'], answer: 'Hoa' },
    { q: 'Đây là con gì? 🐕', options: ['Chó', 'Mèo', 'Gà', 'Vịt'], answer: 'Chó' },
    { q: 'Đây là gì? 📚', options: ['Vở', 'Sách', 'Bút', 'Thước'], answer: 'Sách' },
    { q: 'Đây là gì? 🚗', options: ['Xe đạp', 'Xe máy', 'Ô tô', 'Xe buýt'], answer: 'Ô tô' },
  ],
  
  // V11-V15: Nâng cao
  v11: [
    { q: 'Từ "BÔNG" có vần gì?', options: ['ONG', 'ANG', 'UNG'], answer: 'ONG' },
    { q: 'Ghép: T + ANG = ?', options: ['TONG', 'TANG', 'TUNG'], answer: 'TANG' },
    { q: 'Từ "SÔNG" có vần gì?', options: ['ONG', 'ÔNG', 'UNG'], answer: 'ÔNG' },
    { q: 'Từ "HƯƠNG" có vần gì?', options: ['ƯƠI', 'ƯƠNG', 'ƯNG'], answer: 'ƯƠNG' },
    { q: 'Từ "RỪNG" có vần gì?', options: ['ƯNG', 'ỨNG', 'ỪNG'], answer: 'ỪNG' },
  ],
  
  v12: [
    { q: '"Bé đi học" có mấy từ?', options: ['2', '3', '4'], answer: '3' },
    { q: 'Câu nào đúng chính tả?', options: ['bé đi học', 'Bé đi học.', 'BE DI HOC'], answer: 'Bé đi học.' },
    { q: '"Mẹ yêu con" - Ai yêu con?', options: ['Bố', 'Mẹ', 'Bé'], answer: 'Mẹ' },
    { q: '"Bố đọc sách" - Bố làm gì?', options: ['Viết', 'Đọc sách', 'Ngủ'], answer: 'Đọc sách' },
    { q: 'Câu hỏi kết thúc bằng dấu?', options: ['Chấm (.)', 'Hỏi (?)', 'Phẩy (,)'], answer: 'Hỏi (?)' },
  ],
  
  v13: [
    { q: 'Người sinh ra mình là?', options: ['Bố mẹ', 'Anh chị', 'Ông bà'], answer: 'Bố mẹ' },
    { q: 'Bố của bố gọi là?', options: ['Ông nội', 'Ông ngoại', 'Bác'], answer: 'Ông nội' },
    { q: 'Mẹ của mẹ gọi là?', options: ['Bà nội', 'Bà ngoại', 'Dì'], answer: 'Bà ngoại' },
    { q: 'Em gái của mẹ gọi là?', options: ['Cô', 'Dì', 'Bác'], answer: 'Dì' },
    { q: 'Em trai của bố gọi là?', options: ['Cậu', 'Chú', 'Bác'], answer: 'Chú' },
  ],
  
  v14: [
    { q: 'Con vật nào kêu "gâu gâu"?', options: ['Mèo', 'Chó', 'Gà'], answer: 'Chó' },
    { q: 'Con vật nào kêu "meo meo"?', options: ['Mèo', 'Chó', 'Gà'], answer: 'Mèo' },
    { q: 'Con vật nào đẻ trứng?', options: ['Chó', 'Mèo', 'Gà'], answer: 'Gà' },
    { q: 'Con vật nào sống dưới nước?', options: ['Chim', 'Cá', 'Gà'], answer: 'Cá' },
    { q: 'Con vật nào có vòi dài?', options: ['Hổ', 'Sư tử', 'Voi'], answer: 'Voi' },
  ],
  
  v15: [
    { q: 'Quả nào màu vàng, cong cong?', options: ['Táo', 'Chuối', 'Cam'], answer: 'Chuối' },
    { q: 'Quả nào màu đỏ, có cuống?', options: ['Táo', 'Chuối', 'Cam'], answer: 'Táo' },
    { q: 'Quả nào màu cam, nhiều vitamin C?', options: ['Táo', 'Chuối', 'Cam'], answer: 'Cam' },
    { q: 'Quả nào to, xanh vỏ đỏ ruột?', options: ['Táo', 'Dưa hấu', 'Cam'], answer: 'Dưa hấu' },
    { q: 'Quả nào nhỏ, mọc thành chùm?', options: ['Táo', 'Chuối', 'Nho'], answer: 'Nho' },
  ],
};

  // ==========================================
  // LEVEL 1: ALPHABET & NUMBERS (3-4 tuổi)
  // ==========================================
  
  // E1: Letters A-F
  e1: [
    { q: 'What letter is this? A', options: ['A', 'B', 'C', 'D'], answer: 'A' },
    { q: 'Apple starts with?', options: ['A', 'B', 'C', 'D'], answer: 'A' },
    { q: 'What comes after A?', options: ['A', 'B', 'C', 'D'], answer: 'B' },
    { q: 'Ball starts with?', options: ['A', 'B', 'C', 'D'], answer: 'B' },
    { q: 'Cat starts with?', options: ['B', 'C', 'D', 'E'], answer: 'C' },
    { q: 'What comes after C?', options: ['B', 'C', 'D', 'E'], answer: 'D' },
    { q: 'Dog starts with?', options: ['B', 'C', 'D', 'E'], answer: 'D' },
    { q: 'Elephant starts with?', options: ['D', 'E', 'F', 'G'], answer: 'E' },
    { q: 'Fish starts with?', options: ['D', 'E', 'F', 'G'], answer: 'F' },
    { q: 'What comes after E?', options: ['D', 'E', 'F', 'G'], answer: 'F' },
  ],
  
  // E2: Letters G-L
  e2: [
    { q: 'Girl starts with?', options: ['F', 'G', 'H', 'I'], answer: 'G' },
    { q: 'What comes after G?', options: ['F', 'G', 'H', 'I'], answer: 'H' },
    { q: 'House starts with?', options: ['G', 'H', 'I', 'J'], answer: 'H' },
    { q: 'Ice cream starts with?', options: ['H', 'I', 'J', 'K'], answer: 'I' },
    { q: 'What comes after I?', options: ['H', 'I', 'J', 'K'], answer: 'J' },
    { q: 'Jump starts with?', options: ['I', 'J', 'K', 'L'], answer: 'J' },
    { q: 'King starts with?', options: ['J', 'K', 'L', 'M'], answer: 'K' },
    { q: 'Kite starts with?', options: ['J', 'K', 'L', 'M'], answer: 'K' },
    { q: 'Lion starts with?', options: ['K', 'L', 'M', 'N'], answer: 'L' },
    { q: 'What comes after K?', options: ['J', 'K', 'L', 'M'], answer: 'L' },
  ],
  
  // E3: Letters M-R
  e3: [
    { q: 'Mom starts with?', options: ['L', 'M', 'N', 'O'], answer: 'M' },
    { q: 'Monkey starts with?', options: ['L', 'M', 'N', 'O'], answer: 'M' },
    { q: 'What comes after M?', options: ['L', 'M', 'N', 'O'], answer: 'N' },
    { q: 'Nose starts with?', options: ['M', 'N', 'O', 'P'], answer: 'N' },
    { q: 'Orange starts with?', options: ['N', 'O', 'P', 'Q'], answer: 'O' },
    { q: 'Pig starts with?', options: ['O', 'P', 'Q', 'R'], answer: 'P' },
    { q: 'Queen starts with?', options: ['P', 'Q', 'R', 'S'], answer: 'Q' },
    { q: 'What comes after Q?', options: ['P', 'Q', 'R', 'S'], answer: 'R' },
    { q: 'Red starts with?', options: ['P', 'Q', 'R', 'S'], answer: 'R' },
    { q: 'Rabbit starts with?', options: ['P', 'Q', 'R', 'S'], answer: 'R' },
  ],
  
  // E4: Letters S-Z
  e4: [
    { q: 'Sun starts with?', options: ['R', 'S', 'T', 'U'], answer: 'S' },
    { q: 'What comes after S?', options: ['R', 'S', 'T', 'U'], answer: 'T' },
    { q: 'Tiger starts with?', options: ['S', 'T', 'U', 'V'], answer: 'T' },
    { q: 'Umbrella starts with?', options: ['T', 'U', 'V', 'W'], answer: 'U' },
    { q: 'What comes after U?', options: ['T', 'U', 'V', 'W'], answer: 'V' },
    { q: 'Water starts with?', options: ['V', 'W', 'X', 'Y'], answer: 'W' },
    { q: 'What comes after W?', options: ['V', 'W', 'X', 'Y'], answer: 'X' },
    { q: 'Yellow starts with?', options: ['W', 'X', 'Y', 'Z'], answer: 'Y' },
    { q: 'Zebra starts with?', options: ['W', 'X', 'Y', 'Z'], answer: 'Z' },
    { q: 'What is the last letter?', options: ['X', 'Y', 'Z', 'W'], answer: 'Z' },
  ],
  
  // E5: Numbers 1-10
  e5: [
    { q: 'How do you say "1"?', options: ['Two', 'One', 'Three'], answer: 'One' },
    { q: 'How do you say "2"?', options: ['One', 'Two', 'Three'], answer: 'Two' },
    { q: 'What number is "Three"?', options: ['2', '3', '4'], answer: '3' },
    { q: 'How do you say "4"?', options: ['Three', 'Four', 'Five'], answer: 'Four' },
    { q: 'How do you say "5"?', options: ['Four', 'Five', 'Six'], answer: 'Five' },
    { q: 'What number is "Six"?', options: ['5', '6', '7'], answer: '6' },
    { q: 'What number is "Seven"?', options: ['6', '7', '8'], answer: '7' },
    { q: 'How do you say "8"?', options: ['Seven', 'Eight', 'Nine'], answer: 'Eight' },
    { q: 'How do you say "9"?', options: ['Eight', 'Nine', 'Ten'], answer: 'Nine' },
    { q: 'How do you say "10"?', options: ['Nine', 'Ten', 'Eleven'], answer: 'Ten' },
  ],
  
  // E6: Numbers 11-20
  e6: [
    { q: 'How do you say "11"?', options: ['Ten', 'Eleven', 'Twelve'], answer: 'Eleven' },
    { q: 'How do you say "12"?', options: ['Eleven', 'Twelve', 'Thirteen'], answer: 'Twelve' },
    { q: 'What number is "Thirteen"?', options: ['12', '13', '14'], answer: '13' },
    { q: 'How do you say "14"?', options: ['Thirteen', 'Fourteen', 'Fifteen'], answer: 'Fourteen' },
    { q: 'How do you say "15"?', options: ['Fourteen', 'Fifteen', 'Sixteen'], answer: 'Fifteen' },
    { q: 'What number is "Sixteen"?', options: ['15', '16', '17'], answer: '16' },
    { q: 'How do you say "17"?', options: ['Sixteen', 'Seventeen', 'Eighteen'], answer: 'Seventeen' },
    { q: 'What number is "Eighteen"?', options: ['17', '18', '19'], answer: '18' },
    { q: 'How do you say "19"?', options: ['Eighteen', 'Nineteen', 'Twenty'], answer: 'Nineteen' },
    { q: 'How do you say "20"?', options: ['Nineteen', 'Twenty', 'Thirty'], answer: 'Twenty' },
  ],

  // ==========================================
  // LEVEL 2: BASIC VOCABULARY (4-5 tuổi)
  // ==========================================
  
  // E7: Colors
  e7: [
    { q: 'What color is the sky? 🌤️', options: ['Red', 'Blue', 'Green'], answer: 'Blue' },
    { q: 'What color is grass? 🌿', options: ['Red', 'Blue', 'Green'], answer: 'Green' },
    { q: 'What color is the sun? ☀️', options: ['Red', 'Blue', 'Yellow'], answer: 'Yellow' },
    { q: 'What color is a tomato? 🍅', options: ['Red', 'Blue', 'Green'], answer: 'Red' },
    { q: 'What color is an orange? 🍊', options: ['Red', 'Orange', 'Yellow'], answer: 'Orange' },
    { q: 'What color is snow? ❄️', options: ['White', 'Blue', 'Gray'], answer: 'White' },
    { q: 'What color is night? 🌙', options: ['White', 'Blue', 'Black'], answer: 'Black' },
    { q: 'What color is a pig? 🐷', options: ['Pink', 'Purple', 'Brown'], answer: 'Pink' },
    { q: 'What color is chocolate? 🍫', options: ['Pink', 'Purple', 'Brown'], answer: 'Brown' },
    { q: 'What color is a grape? 🍇', options: ['Purple', 'Green', 'Both'], answer: 'Both' },
  ],
  
  // E8: Shapes
  e8: [
    { q: 'What shape is a ball? ⚽', options: ['Square', 'Circle', 'Triangle'], answer: 'Circle' },
    { q: 'What shape is a box? 📦', options: ['Square', 'Circle', 'Triangle'], answer: 'Square' },
    { q: 'A pizza slice is a...', options: ['Square', 'Circle', 'Triangle'], answer: 'Triangle' },
    { q: 'What shape has 4 equal sides?', options: ['Rectangle', 'Square', 'Triangle'], answer: 'Square' },
    { q: 'What shape has 3 sides?', options: ['Square', 'Circle', 'Triangle'], answer: 'Triangle' },
    { q: 'A door is usually a...', options: ['Circle', 'Rectangle', 'Triangle'], answer: 'Rectangle' },
    { q: 'What shape is a heart? ❤️', options: ['Circle', 'Heart', 'Star'], answer: 'Heart' },
    { q: 'What shape is this? ⭐', options: ['Circle', 'Heart', 'Star'], answer: 'Star' },
    { q: 'An egg is like an...', options: ['Circle', 'Oval', 'Square'], answer: 'Oval' },
    { q: 'A coin is a...', options: ['Square', 'Circle', 'Triangle'], answer: 'Circle' },
  ],
  
  // E9: Animals - Pets
  e9: [
    { q: 'What is this? 🐕', options: ['Cat', 'Dog', 'Bird'], answer: 'Dog' },
    { q: 'What is this? 🐱', options: ['Cat', 'Dog', 'Fish'], answer: 'Cat' },
    { q: 'What is this? 🐟', options: ['Cat', 'Dog', 'Fish'], answer: 'Fish' },
    { q: 'What is this? 🐦', options: ['Cat', 'Bird', 'Fish'], answer: 'Bird' },
    { q: 'What is this? 🐰', options: ['Mouse', 'Rabbit', 'Cat'], answer: 'Rabbit' },
    { q: 'What is this? 🐹', options: ['Mouse', 'Hamster', 'Rabbit'], answer: 'Hamster' },
    { q: 'What is this? 🐢', options: ['Frog', 'Turtle', 'Snake'], answer: 'Turtle' },
    { q: 'A dog says...', options: ['Meow', 'Woof', 'Moo'], answer: 'Woof' },
    { q: 'A cat says...', options: ['Meow', 'Woof', 'Moo'], answer: 'Meow' },
    { q: 'Which pet can swim?', options: ['Dog', 'Cat', 'Fish'], answer: 'Fish' },
  ],
  
  // E10: Animals - Farm
  e10: [
    { q: 'What is this? 🐄', options: ['Pig', 'Cow', 'Horse'], answer: 'Cow' },
    { q: 'What is this? 🐷', options: ['Pig', 'Cow', 'Dog'], answer: 'Pig' },
    { q: 'What is this? 🐔', options: ['Duck', 'Chicken', 'Bird'], answer: 'Chicken' },
    { q: 'What is this? 🦆', options: ['Duck', 'Chicken', 'Goose'], answer: 'Duck' },
    { q: 'What is this? 🐴', options: ['Donkey', 'Horse', 'Cow'], answer: 'Horse' },
    { q: 'What is this? 🐑', options: ['Goat', 'Sheep', 'Cow'], answer: 'Sheep' },
    { q: 'What is this? 🐐', options: ['Goat', 'Sheep', 'Deer'], answer: 'Goat' },
    { q: 'A cow says...', options: ['Oink', 'Moo', 'Baa'], answer: 'Moo' },
    { q: 'A pig says...', options: ['Oink', 'Moo', 'Baa'], answer: 'Oink' },
    { q: 'Which gives us milk?', options: ['Pig', 'Cow', 'Chicken'], answer: 'Cow' },
  ],
  
  // E11: Animals - Wild
  e11: [
    { q: 'What is this? 🦁', options: ['Tiger', 'Lion', 'Bear'], answer: 'Lion' },
    { q: 'What is this? 🐘', options: ['Hippo', 'Rhino', 'Elephant'], answer: 'Elephant' },
    { q: 'What is this? 🐵', options: ['Monkey', 'Gorilla', 'Bear'], answer: 'Monkey' },
    { q: 'What is this? 🦒', options: ['Zebra', 'Giraffe', 'Horse'], answer: 'Giraffe' },
    { q: 'What is this? 🦓', options: ['Zebra', 'Horse', 'Donkey'], answer: 'Zebra' },
    { q: 'What is this? 🐻', options: ['Lion', 'Tiger', 'Bear'], answer: 'Bear' },
    { q: 'What is this? 🐊', options: ['Snake', 'Crocodile', 'Lizard'], answer: 'Crocodile' },
    { q: 'What is this? 🦈', options: ['Whale', 'Dolphin', 'Shark'], answer: 'Shark' },
    { q: 'Which animal is the biggest?', options: ['Lion', 'Elephant', 'Tiger'], answer: 'Elephant' },
    { q: 'Which animal has a long neck?', options: ['Elephant', 'Giraffe', 'Zebra'], answer: 'Giraffe' },
  ],
  
  // E12: Fruits
  e12: [
    { q: 'What is this? 🍎', options: ['Orange', 'Apple', 'Pear'], answer: 'Apple' },
    { q: 'What is this? 🍌', options: ['Orange', 'Apple', 'Banana'], answer: 'Banana' },
    { q: 'What is this? 🍊', options: ['Orange', 'Apple', 'Lemon'], answer: 'Orange' },
    { q: 'What is this? 🍇', options: ['Blueberry', 'Grapes', 'Cherry'], answer: 'Grapes' },
    { q: 'What is this? 🍓', options: ['Cherry', 'Strawberry', 'Raspberry'], answer: 'Strawberry' },
    { q: 'What is this? 🍉', options: ['Melon', 'Watermelon', 'Coconut'], answer: 'Watermelon' },
    { q: 'What is this? 🍋', options: ['Orange', 'Lemon', 'Lime'], answer: 'Lemon' },
    { q: 'What is this? 🥭', options: ['Peach', 'Mango', 'Papaya'], answer: 'Mango' },
    { q: 'What is this? 🍑', options: ['Peach', 'Mango', 'Orange'], answer: 'Peach' },
    { q: 'What is this? 🍒', options: ['Cherry', 'Strawberry', 'Grape'], answer: 'Cherry' },
  ],
  
  // E13: Vegetables
  e13: [
    { q: 'What is this? 🥕', options: ['Potato', 'Carrot', 'Radish'], answer: 'Carrot' },
    { q: 'What is this? 🥔', options: ['Potato', 'Onion', 'Garlic'], answer: 'Potato' },
    { q: 'What is this? 🍅', options: ['Apple', 'Tomato', 'Pepper'], answer: 'Tomato' },
    { q: 'What is this? 🥒', options: ['Zucchini', 'Cucumber', 'Pickle'], answer: 'Cucumber' },
    { q: 'What is this? 🥬', options: ['Lettuce', 'Cabbage', 'Spinach'], answer: 'Lettuce' },
    { q: 'What is this? 🧅', options: ['Potato', 'Onion', 'Garlic'], answer: 'Onion' },
    { q: 'What is this? 🧄', options: ['Onion', 'Garlic', 'Ginger'], answer: 'Garlic' },
    { q: 'What is this? 🌽', options: ['Wheat', 'Rice', 'Corn'], answer: 'Corn' },
    { q: 'What is this? 🥦', options: ['Broccoli', 'Lettuce', 'Spinach'], answer: 'Broccoli' },
    { q: 'Carrots are good for your...', options: ['Ears', 'Eyes', 'Nose'], answer: 'Eyes' },
  ],
  
  // E14: Food & Drinks
  e14: [
    { q: 'What is this? 🍞', options: ['Rice', 'Bread', 'Pasta'], answer: 'Bread' },
    { q: 'What is this? 🍚', options: ['Rice', 'Bread', 'Noodles'], answer: 'Rice' },
    { q: 'What is this? 🥛', options: ['Water', 'Juice', 'Milk'], answer: 'Milk' },
    { q: 'What is this? 🧃', options: ['Water', 'Juice', 'Milk'], answer: 'Juice' },
    { q: 'What is this? 🍳', options: ['Egg', 'Pancake', 'Cheese'], answer: 'Egg' },
    { q: 'What is this? 🧀', options: ['Butter', 'Cheese', 'Bread'], answer: 'Cheese' },
    { q: 'What is this? 🍕', options: ['Burger', 'Pizza', 'Sandwich'], answer: 'Pizza' },
    { q: 'What is this? 🍔', options: ['Burger', 'Pizza', 'Hot dog'], answer: 'Burger' },
    { q: 'What is this? 🍦', options: ['Cake', 'Ice cream', 'Candy'], answer: 'Ice cream' },
    { q: 'What is this? 🍰', options: ['Cake', 'Pie', 'Cookie'], answer: 'Cake' },
  ],
  
  // E15: Family
  e15: [
    { q: 'Who is "Dad"?', options: ['Mẹ', 'Bố', 'Anh'], answer: 'Bố' },
    { q: 'Who is "Mom"?', options: ['Mẹ', 'Bố', 'Chị'], answer: 'Mẹ' },
    { q: 'Who is "Brother"?', options: ['Chị gái', 'Anh/Em trai', 'Bố'], answer: 'Anh/Em trai' },
    { q: 'Who is "Sister"?', options: ['Chị/Em gái', 'Anh trai', 'Mẹ'], answer: 'Chị/Em gái' },
    { q: 'Who is "Grandfather"?', options: ['Bố', 'Chú', 'Ông'], answer: 'Ông' },
    { q: 'Who is "Grandmother"?', options: ['Mẹ', 'Cô', 'Bà'], answer: 'Bà' },
    { q: 'Who is "Uncle"?', options: ['Cô/Dì', 'Chú/Bác', 'Ông'], answer: 'Chú/Bác' },
    { q: 'Who is "Aunt"?', options: ['Cô/Dì', 'Chú', 'Bà'], answer: 'Cô/Dì' },
    { q: 'Who is "Baby"?', options: ['Người lớn', 'Em bé', 'Ông bà'], answer: 'Em bé' },
    { q: 'Mom and Dad are your...', options: ['Friends', 'Parents', 'Teachers'], answer: 'Parents' },
  ],
  
  // E16: Body Parts
  e16: [
    { q: 'What is this? 👀', options: ['Nose', 'Eyes', 'Ears'], answer: 'Eyes' },
    { q: 'What is this? 👃', options: ['Nose', 'Mouth', 'Ear'], answer: 'Nose' },
    { q: 'What is this? 👂', options: ['Eye', 'Nose', 'Ear'], answer: 'Ear' },
    { q: 'What is this? 👄', options: ['Nose', 'Eye', 'Mouth'], answer: 'Mouth' },
    { q: 'What do you see with?', options: ['Ears', 'Eyes', 'Nose'], answer: 'Eyes' },
    { q: 'What do you hear with?', options: ['Ears', 'Eyes', 'Mouth'], answer: 'Ears' },
    { q: 'What do you smell with?', options: ['Ears', 'Eyes', 'Nose'], answer: 'Nose' },
    { q: 'How many fingers on one hand?', options: ['Four', 'Five', 'Six'], answer: 'Five' },
    { q: 'What do you walk with?', options: ['Hands', 'Arms', 'Legs'], answer: 'Legs' },
    { q: 'What is on top of your body?', options: ['Feet', 'Head', 'Hands'], answer: 'Head' },
  ],
  
  // E17: Clothes
  e17: [
    { q: 'What do you wear on your head?', options: ['Shoes', 'Hat', 'Gloves'], answer: 'Hat' },
    { q: 'What do you wear on your feet?', options: ['Hat', 'Shirt', 'Shoes'], answer: 'Shoes' },
    { q: 'What is this? 👕', options: ['Pants', 'Shirt', 'Dress'], answer: 'Shirt' },
    { q: 'What is this? 👖', options: ['Pants', 'Shirt', 'Skirt'], answer: 'Pants' },
    { q: 'What is this? 👗', options: ['Shirt', 'Dress', 'Skirt'], answer: 'Dress' },
    { q: 'What is this? 🧦', options: ['Gloves', 'Socks', 'Shoes'], answer: 'Socks' },
    { q: 'What is this? 🧤', options: ['Gloves', 'Socks', 'Mittens'], answer: 'Gloves' },
    { q: 'What do you wear when it\'s cold?', options: ['T-shirt', 'Jacket', 'Shorts'], answer: 'Jacket' },
    { q: 'What do you wear when it rains?', options: ['Sunglasses', 'Raincoat', 'Sandals'], answer: 'Raincoat' },
    { q: 'What is this? 👟', options: ['Boots', 'Sneakers', 'Sandals'], answer: 'Sneakers' },
  ],
  
  // E18: Toys
  e18: [
    { q: 'What is this? ⚽', options: ['Ball', 'Doll', 'Car'], answer: 'Ball' },
    { q: 'What is this? 🧸', options: ['Doll', 'Teddy bear', 'Robot'], answer: 'Teddy bear' },
    { q: 'What is this? 🚗', options: ['Truck', 'Toy car', 'Bus'], answer: 'Toy car' },
    { q: 'What is this? 🪁', options: ['Balloon', 'Kite', 'Bird'], answer: 'Kite' },
    { q: 'What is this? 🎈', options: ['Ball', 'Balloon', 'Kite'], answer: 'Balloon' },
    { q: 'What is this? 🧩', options: ['Blocks', 'Puzzle', 'Cards'], answer: 'Puzzle' },
    { q: 'What do you ride? 🚲', options: ['Car', 'Bike', 'Plane'], answer: 'Bike' },
    { q: 'What do you read? 📚', options: ['Ball', 'Book', 'Block'], answer: 'Book' },
    { q: 'What makes music? 🎸', options: ['Ball', 'Doll', 'Guitar'], answer: 'Guitar' },
    { q: 'What do you draw with? 🖍️', options: ['Crayons', 'Blocks', 'Ball'], answer: 'Crayons' },
  ],
  
  // E19: School Things
  e19: [
    { q: 'What is this? 📚', options: ['Pen', 'Book', 'Bag'], answer: 'Book' },
    { q: 'What is this? ✏️', options: ['Pen', 'Pencil', 'Ruler'], answer: 'Pencil' },
    { q: 'What is this? 🖊️', options: ['Pen', 'Pencil', 'Marker'], answer: 'Pen' },
    { q: 'What is this? 📏', options: ['Pen', 'Pencil', 'Ruler'], answer: 'Ruler' },
    { q: 'What is this? ✂️', options: ['Knife', 'Scissors', 'Ruler'], answer: 'Scissors' },
    { q: 'What is this? 🎒', options: ['Bag', 'Box', 'Basket'], answer: 'Bag' },
    { q: 'What is this? 📓', options: ['Book', 'Notebook', 'Paper'], answer: 'Notebook' },
    { q: 'What do you write on?', options: ['Chair', 'Paper', 'Floor'], answer: 'Paper' },
    { q: 'Who teaches you?', options: ['Doctor', 'Teacher', 'Driver'], answer: 'Teacher' },
    { q: 'Where do you learn?', options: ['Hospital', 'School', 'Market'], answer: 'School' },
  ],
  
  // E20: Home & Rooms
  e20: [
    { q: 'Where do you sleep?', options: ['Kitchen', 'Bedroom', 'Bathroom'], answer: 'Bedroom' },
    { q: 'Where do you cook?', options: ['Kitchen', 'Bedroom', 'Living room'], answer: 'Kitchen' },
    { q: 'Where do you take a bath?', options: ['Kitchen', 'Bedroom', 'Bathroom'], answer: 'Bathroom' },
    { q: 'Where do you watch TV?', options: ['Kitchen', 'Bedroom', 'Living room'], answer: 'Living room' },
    { q: 'What is this? 🛏️', options: ['Chair', 'Bed', 'Table'], answer: 'Bed' },
    { q: 'What is this? 🪑', options: ['Chair', 'Table', 'Desk'], answer: 'Chair' },
    { q: 'What is this? 🚪', options: ['Window', 'Door', 'Wall'], answer: 'Door' },
    { q: 'What is this? 🪟', options: ['Window', 'Door', 'Mirror'], answer: 'Window' },
    { q: 'What is this? 📺', options: ['Radio', 'Computer', 'TV'], answer: 'TV' },
    { q: 'What is this? 🏠', options: ['School', 'House', 'Hospital'], answer: 'House' },
  ],

  // ==========================================
  // LEVEL 3: SENTENCES & COMMUNICATION (5-6 tuổi)
  // ==========================================
  
  // E21: Greetings
  e21: [
    { q: 'How do you say "Xin chào"?', options: ['Goodbye', 'Hello', 'Sorry'], answer: 'Hello' },
    { q: 'How do you say "Tạm biệt"?', options: ['Goodbye', 'Hello', 'Thanks'], answer: 'Goodbye' },
    { q: 'How do you say "Cảm ơn"?', options: ['Sorry', 'Please', 'Thank you'], answer: 'Thank you' },
    { q: 'How do you say "Xin lỗi"?', options: ['Sorry', 'Please', 'Thank you'], answer: 'Sorry' },
    { q: 'Morning greeting?', options: ['Good night', 'Good morning', 'Goodbye'], answer: 'Good morning' },
    { q: 'Night greeting?', options: ['Good night', 'Good morning', 'Hello'], answer: 'Good night' },
    { q: 'Afternoon greeting?', options: ['Good morning', 'Good afternoon', 'Good night'], answer: 'Good afternoon' },
    { q: 'Reply to "Thank you"?', options: ['Sorry', 'Please', "You're welcome"], answer: "You're welcome" },
    { q: '"How are you?" means?', options: ['Bạn khỏe không?', 'Bạn tên gì?', 'Bạn bao tuổi?'], answer: 'Bạn khỏe không?' },
    { q: 'Reply: "I\'m fine, ___"', options: ['sorry', 'please', 'thank you'], answer: 'thank you' },
  ],
  
  // E22: I am...
  e22: [
    { q: '"I am a boy" means?', options: ['Tôi là con gái', 'Tôi là con trai', 'Tôi là em bé'], answer: 'Tôi là con trai' },
    { q: '"I am a girl" means?', options: ['Tôi là con gái', 'Tôi là con trai', 'Tôi là mẹ'], answer: 'Tôi là con gái' },
    { q: '"I am happy" means?', options: ['Tôi buồn', 'Tôi vui', 'Tôi mệt'], answer: 'Tôi vui' },
    { q: '"I am sad" means?', options: ['Tôi buồn', 'Tôi vui', 'Tôi giận'], answer: 'Tôi buồn' },
    { q: '"I am hungry" means?', options: ['Tôi no', 'Tôi đói', 'Tôi khát'], answer: 'Tôi đói' },
    { q: '"I am thirsty" means?', options: ['Tôi đói', 'Tôi khát', 'Tôi mệt'], answer: 'Tôi khát' },
    { q: 'How do you say "Tôi 5 tuổi"?', options: ['I am five', 'I have five', 'I like five'], answer: 'I am five' },
    { q: '"I am a student" means?', options: ['Giáo viên', 'Học sinh', 'Bác sĩ'], answer: 'Học sinh' },
    { q: 'Fill: "I ___ tall"', options: ['is', 'am', 'are'], answer: 'am' },
    { q: '"My name is..." means?', options: ['Tôi là...', 'Tên tôi là...', 'Tôi thích...'], answer: 'Tên tôi là...' },
  ],
  
  // E23: This is / That is
  e23: [
    { q: '"This is a cat" means?', options: ['Đó là con mèo', 'Đây là con mèo', 'Kia là con mèo'], answer: 'Đây là con mèo' },
    { q: '"That is a dog" means?', options: ['Đây là con chó', 'Đó là con chó', 'Con chó này'], answer: 'Đó là con chó' },
    { q: 'Point to a book: "_____ is a book"', options: ['This', 'These', 'Those'], answer: 'This' },
    { q: 'Point far away: "_____ is a bird"', options: ['This', 'That', 'These'], answer: 'That' },
    { q: '"It is red" means?', options: ['Nó màu xanh', 'Nó màu đỏ', 'Nó màu vàng'], answer: 'Nó màu đỏ' },
    { q: 'Fill: "This ___ my bag"', options: ['is', 'am', 'are'], answer: 'is' },
    { q: 'Fill: "That ___ a car"', options: ['is', 'am', 'are'], answer: 'is' },
    { q: '"These are apples" means?', options: ['Đây là những quả táo', 'Đó là quả táo', 'Một quả táo'], answer: 'Đây là những quả táo' },
    { q: '"Those are birds" means?', options: ['Đây là chim', 'Đó là những con chim', 'Một con chim'], answer: 'Đó là những con chim' },
    { q: '"What is this?" means?', options: ['Đây là gì?', 'Đó là gì?', 'Cái này à?'], answer: 'Đây là gì?' },
  ],
  
  // E24: I like / I don't like
  e24: [
    { q: '"I like apples" means?', options: ['Tôi có táo', 'Tôi thích táo', 'Tôi ăn táo'], answer: 'Tôi thích táo' },
    { q: '"I don\'t like fish" means?', options: ['Tôi thích cá', 'Tôi không thích cá', 'Tôi có cá'], answer: 'Tôi không thích cá' },
    { q: '"I love my mom" means?', options: ['Tôi thích mẹ', 'Tôi yêu mẹ', 'Tôi có mẹ'], answer: 'Tôi yêu mẹ' },
    { q: 'Fill: "I ___ ice cream"', options: ['likes', 'like', 'liking'], answer: 'like' },
    { q: '"Do you like pizza?" means?', options: ['Bạn ăn pizza?', 'Bạn thích pizza không?', 'Bạn mua pizza?'], answer: 'Bạn thích pizza không?' },
    { q: 'Answer "Yes" to "Do you like...?"', options: ['Yes, I do', 'Yes, I am', 'Yes, it is'], answer: 'Yes, I do' },
    { q: 'Answer "No" to "Do you like...?"', options: ['No, I am not', 'No, I don\'t', 'No, it isn\'t'], answer: 'No, I don\'t' },
    { q: '"I want milk" means?', options: ['Tôi có sữa', 'Tôi uống sữa', 'Tôi muốn sữa'], answer: 'Tôi muốn sữa' },
    { q: '"My favorite color is blue" means?', options: ['Tôi thích màu xanh', 'Màu yêu thích là xanh', 'Xanh là màu đẹp'], answer: 'Màu yêu thích là xanh' },
    { q: '"I hate vegetables" means?', options: ['Tôi thích rau', 'Tôi ghét rau', 'Tôi ăn rau'], answer: 'Tôi ghét rau' },
  ],
  
  // E25: I can / I can't
  e25: [
    { q: '"I can swim" means?', options: ['Tôi biết bơi', 'Tôi thích bơi', 'Tôi đang bơi'], answer: 'Tôi biết bơi' },
    { q: '"I can\'t fly" means?', options: ['Tôi biết bay', 'Tôi không biết bay', 'Tôi thích bay'], answer: 'Tôi không biết bay' },
    { q: '"Can you dance?" means?', options: ['Bạn nhảy không?', 'Bạn biết nhảy không?', 'Bạn đang nhảy?'], answer: 'Bạn biết nhảy không?' },
    { q: 'Fill: "I ___ run fast"', options: ['am', 'can', 'is'], answer: 'can' },
    { q: 'Fish ___ swim', options: ['can', 'can\'t', 'is'], answer: 'can' },
    { q: 'Birds ___ fly', options: ['can', 'can\'t', 'is'], answer: 'can' },
    { q: 'Dogs ___ fly', options: ['can', 'can\'t', 'is'], answer: 'can\'t' },
    { q: 'Answer "Yes": "Can you read?"', options: ['Yes, I can', 'Yes, I do', 'Yes, I am'], answer: 'Yes, I can' },
    { q: 'Answer "No": "Can you fly?"', options: ['No, I don\'t', 'No, I can\'t', 'No, I am not'], answer: 'No, I can\'t' },
    { q: '"She can sing" means?', options: ['Cô ấy thích hát', 'Cô ấy biết hát', 'Cô ấy đang hát'], answer: 'Cô ấy biết hát' },
  ],
  
  // E26: Questions - What
  e26: [
    { q: '"What is this?" means?', options: ['Đây là gì?', 'Đây ở đâu?', 'Đây là ai?'], answer: 'Đây là gì?' },
    { q: '"What color is it?" means?', options: ['Nó màu gì?', 'Nó ở đâu?', 'Nó là gì?'], answer: 'Nó màu gì?' },
    { q: '"What is your name?" means?', options: ['Bạn khỏe không?', 'Bạn tên gì?', 'Bạn bao tuổi?'], answer: 'Bạn tên gì?' },
    { q: '"What do you like?" means?', options: ['Bạn thích gì?', 'Bạn ở đâu?', 'Bạn là ai?'], answer: 'Bạn thích gì?' },
    { q: 'Answer: "What is this?" (🍎)', options: ['It is red', 'It is an apple', 'I like it'], answer: 'It is an apple' },
    { q: 'Answer: "What color is it?" (🌿)', options: ['It is grass', 'It is green', 'It is big'], answer: 'It is green' },
    { q: '"What time is it?" means?', options: ['Hôm nay thứ mấy?', 'Mấy giờ rồi?', 'Ngày bao nhiêu?'], answer: 'Mấy giờ rồi?' },
    { q: '"What day is today?" means?', options: ['Hôm nay thứ mấy?', 'Mấy giờ rồi?', 'Hôm nay ngày mấy?'], answer: 'Hôm nay thứ mấy?' },
    { q: 'Fill: "___ is your favorite animal?"', options: ['What', 'Where', 'Who'], answer: 'What' },
    { q: '"What are you doing?" means?', options: ['Bạn là ai?', 'Bạn đang làm gì?', 'Bạn ở đâu?'], answer: 'Bạn đang làm gì?' },
  ],
  
  // E27: Questions - Where
  e27: [
    { q: '"Where is the cat?" means?', options: ['Con mèo là gì?', 'Con mèo ở đâu?', 'Con mèo là ai?'], answer: 'Con mèo ở đâu?' },
    { q: '"Where are you?" means?', options: ['Bạn là ai?', 'Bạn ở đâu?', 'Bạn khỏe không?'], answer: 'Bạn ở đâu?' },
    { q: '"Where do you live?" means?', options: ['Bạn sống ở đâu?', 'Bạn thích gì?', 'Bạn bao tuổi?'], answer: 'Bạn sống ở đâu?' },
    { q: 'The cat is ___ the table', options: ['on', 'in', 'at'], answer: 'on' },
    { q: 'The ball is ___ the box', options: ['on', 'in', 'at'], answer: 'in' },
    { q: 'The dog is ___ the door', options: ['on', 'in', 'at'], answer: 'at' },
    { q: '"under" means?', options: ['Trên', 'Dưới', 'Trong'], answer: 'Dưới' },
    { q: '"next to" means?', options: ['Trên', 'Dưới', 'Bên cạnh'], answer: 'Bên cạnh' },
    { q: '"behind" means?', options: ['Phía trước', 'Phía sau', 'Bên cạnh'], answer: 'Phía sau' },
    { q: '"in front of" means?', options: ['Phía trước', 'Phía sau', 'Bên trong'], answer: 'Phía trước' },
  ],
  
  // E28: Questions - How many
  e28: [
    { q: '"How many?" means?', options: ['Bao nhiêu?', 'Như thế nào?', 'Ở đâu?'], answer: 'Bao nhiêu?' },
    { q: 'How many eyes do you have?', options: ['One', 'Two', 'Three'], answer: 'Two' },
    { q: 'How many fingers on one hand?', options: ['Four', 'Five', 'Six'], answer: 'Five' },
    { q: 'How many legs does a dog have?', options: ['Two', 'Four', 'Six'], answer: 'Four' },
    { q: 'How many legs does a bird have?', options: ['Two', 'Four', 'Six'], answer: 'Two' },
    { q: '🍎🍎🍎 - How many apples?', options: ['Two', 'Three', 'Four'], answer: 'Three' },
    { q: '⭐⭐⭐⭐⭐ - How many stars?', options: ['Four', 'Five', 'Six'], answer: 'Five' },
    { q: '"How much?" means?', options: ['Bao nhiêu (đếm được)?', 'Bao nhiêu (giá)?', 'Như thế nào?'], answer: 'Bao nhiêu (giá)?' },
    { q: '"How old are you?" means?', options: ['Bạn ở đâu?', 'Bạn bao tuổi?', 'Bạn tên gì?'], answer: 'Bạn bao tuổi?' },
    { q: 'Answer: "I am ___ years old" (5 tuổi)', options: ['four', 'five', 'six'], answer: 'five' },
  ],
  
  // E29: Weather
  e29: [
    { q: '"Sunny" means?', options: ['Mưa', 'Nắng', 'Gió'], answer: 'Nắng' },
    { q: '"Rainy" means?', options: ['Mưa', 'Nắng', 'Tuyết'], answer: 'Mưa' },
    { q: '"Cloudy" means?', options: ['Nắng', 'Mây', 'Gió'], answer: 'Mây' },
    { q: '"Windy" means?', options: ['Mưa', 'Nắng', 'Gió'], answer: 'Gió' },
    { q: '"Hot" means?', options: ['Nóng', 'Lạnh', 'Ấm'], answer: 'Nóng' },
    { q: '"Cold" means?', options: ['Nóng', 'Lạnh', 'Mát'], answer: 'Lạnh' },
    { q: '"Snowy" means?', options: ['Mưa', 'Tuyết', 'Sương mù'], answer: 'Tuyết' },
    { q: '"How is the weather?" means?', options: ['Trời thế nào?', 'Mấy giờ rồi?', 'Hôm nay thứ mấy?'], answer: 'Trời thế nào?' },
    { q: 'When it\'s sunny, we see the...', options: ['Moon', 'Sun', 'Stars'], answer: 'Sun' },
    { q: 'When it\'s rainy, we need an...', options: ['Umbrella', 'Hat', 'Sunglasses'], answer: 'Umbrella' },
  ],
  
  // E30: Days & Time
  e30: [
    { q: '"Monday" is thứ mấy?', options: ['Thứ Hai', 'Thứ Ba', 'Thứ Tư'], answer: 'Thứ Hai' },
    { q: '"Sunday" is thứ mấy?', options: ['Thứ Bảy', 'Chủ Nhật', 'Thứ Sáu'], answer: 'Chủ Nhật' },
    { q: '"Morning" means?', options: ['Buổi sáng', 'Buổi chiều', 'Buổi tối'], answer: 'Buổi sáng' },
    { q: '"Afternoon" means?', options: ['Buổi sáng', 'Buổi chiều', 'Buổi tối'], answer: 'Buổi chiều' },
    { q: '"Night" means?', options: ['Buổi sáng', 'Buổi chiều', 'Buổi tối'], answer: 'Buổi tối' },
    { q: '"Today" means?', options: ['Hôm qua', 'Hôm nay', 'Ngày mai'], answer: 'Hôm nay' },
    { q: '"Tomorrow" means?', options: ['Hôm qua', 'Hôm nay', 'Ngày mai'], answer: 'Ngày mai' },
    { q: '"Yesterday" means?', options: ['Hôm qua', 'Hôm nay', 'Ngày mai'], answer: 'Hôm qua' },
    { q: 'How many days in a week?', options: ['Five', 'Six', 'Seven'], answer: 'Seven' },
    { q: 'We go to school in the...', options: ['Morning', 'Night', 'Midnight'], answer: 'Morning' },
  ],

  // ==========================================
  // KHOA HỌC
  // ==========================================
  
  // S1: Con vật nuôi
  s1: [
    { q: 'Con vật nào được nuôi để giữ nhà?', options: ['Mèo', 'Chó', 'Gà', 'Cá'], answer: 'Chó' },
    { q: 'Con vật nào đẻ trứng và cho ta ăn?', options: ['Chó', 'Mèo', 'Gà', 'Lợn'], answer: 'Gà' },
    { q: 'Con vật nào cho ta sữa uống?', options: ['Gà', 'Vịt', 'Bò', 'Lợn'], answer: 'Bò' },
    { q: 'Con vật nào sống trong nước?', options: ['Gà', 'Cá', 'Chó', 'Mèo'], answer: 'Cá' },
    { q: 'Con vật nào bắt chuột giỏi?', options: ['Chó', 'Mèo', 'Gà', 'Vịt'], answer: 'Mèo' },
    { q: 'Con vịt sống ở đâu?', options: ['Trên cây', 'Trong nhà', 'Gần ao hồ'], answer: 'Gần ao hồ' },
    { q: 'Con lợn cho ta thức ăn gì?', options: ['Sữa', 'Trứng', 'Thịt'], answer: 'Thịt' },
    { q: 'Con vật nào kéo cày giúp nông dân?', options: ['Chó', 'Mèo', 'Trâu/Bò'], answer: 'Trâu/Bò' },
  ],
  
  // S2: Con vật hoang dã
  s2: [
    { q: 'Con vật nào gọi là "Chúa tể rừng xanh"?', options: ['Hổ', 'Sư tử', 'Voi'], answer: 'Sư tử' },
    { q: 'Con vật nào có vòi dài?', options: ['Hươu cao cổ', 'Voi', 'Tê giác'], answer: 'Voi' },
    { q: 'Con vật nào có cổ dài nhất?', options: ['Voi', 'Hươu cao cổ', 'Đà điểu'], answer: 'Hươu cao cổ' },
    { q: 'Con vật nào sống ở Bắc Cực?', options: ['Sư tử', 'Gấu trắng', 'Hổ'], answer: 'Gấu trắng' },
    { q: 'Con vật nào có vằn đen trắng?', options: ['Ngựa', 'Ngựa vằn', 'Bò'], answer: 'Ngựa vằn' },
    { q: 'Con vật nào biết leo cây giỏi?', options: ['Voi', 'Sư tử', 'Khỉ'], answer: 'Khỉ' },
    { q: 'Con vật nào có hàm răng sắc, sống dưới nước?', options: ['Cá heo', 'Cá sấu', 'Cá voi'], answer: 'Cá sấu' },
    { q: 'Con vật nào nhảy bằng hai chân sau?', options: ['Thỏ', 'Kangaroo', 'Cả hai'], answer: 'Cả hai' },
  ],
  
  // S3: Cây cối
  s3: [
    { q: 'Cây hấp thụ gì để quang hợp?', options: ['Oxy', 'Nước', 'Ánh sáng', 'Cả B và C'], answer: 'Cả B và C' },
    { q: 'Phần nào của cây hút nước?', options: ['Lá', 'Thân', 'Rễ', 'Hoa'], answer: 'Rễ' },
    { q: 'Phần nào của cây quang hợp?', options: ['Lá', 'Thân', 'Rễ', 'Hoa'], answer: 'Lá' },
    { q: 'Cây thải ra khí gì?', options: ['CO2', 'Oxy', 'Nitơ', 'Hydro'], answer: 'Oxy' },
    { q: 'Quả phát triển từ phần nào?', options: ['Lá', 'Thân', 'Rễ', 'Hoa'], answer: 'Hoa' },
    { q: 'Cây nào cho ta gạo?', options: ['Ngô', 'Lúa', 'Khoai', 'Sắn'], answer: 'Lúa' },
    { q: 'Cây nào cho ta hoa quả?', options: ['Cây lúa', 'Cây ăn quả', 'Cây cỏ'], answer: 'Cây ăn quả' },
    { q: 'Lá cây thường có màu gì?', options: ['Đỏ', 'Vàng', 'Xanh', 'Tím'], answer: 'Xanh' },
  ],
  
  // S4: Thời tiết
  s4: [
    { q: 'Khi trời nắng, ta thấy gì?', options: ['Mưa', 'Mặt trời', 'Tuyết', 'Sấm'], answer: 'Mặt trời' },
    { q: 'Nước rơi từ trời xuống là?', options: ['Tuyết', 'Mưa', 'Sương', 'Băng'], answer: 'Mưa' },
    { q: 'Mùa nào nóng nhất?', options: ['Xuân', 'Hạ', 'Thu', 'Đông'], answer: 'Hạ' },
    { q: 'Mùa nào lạnh nhất?', options: ['Xuân', 'Hạ', 'Thu', 'Đông'], answer: 'Đông' },
    { q: 'Cầu vồng có mấy màu?', options: ['5', '6', '7', '8'], answer: '7' },
    { q: 'Mây màu đen báo hiệu?', options: ['Trời nắng', 'Trời mưa', 'Trời tuyết'], answer: 'Trời mưa' },
    { q: 'Gió là gì?', options: ['Không khí chuyển động', 'Nước bay lên', 'Mây di chuyển'], answer: 'Không khí chuyển động' },
    { q: 'Sấm sét thường có khi?', options: ['Trời nắng', 'Trời mưa to', 'Trời tuyết'], answer: 'Trời mưa to' },
  ],
  
  // S5: Cơ thể người
  s5: [
    { q: 'Tim nằm ở đâu?', options: ['Bụng', 'Ngực', 'Đầu', 'Chân'], answer: 'Ngực' },
    { q: 'Phổi dùng để làm gì?', options: ['Tiêu hóa', 'Thở', 'Suy nghĩ', 'Đi lại'], answer: 'Thở' },
    { q: 'Não nằm ở đâu?', options: ['Bụng', 'Ngực', 'Đầu', 'Tay'], answer: 'Đầu' },
    { q: 'Dạ dày dùng để làm gì?', options: ['Thở', 'Tiêu hóa', 'Suy nghĩ', 'Nhìn'], answer: 'Tiêu hóa' },
    { q: 'Xương giúp cơ thể?', options: ['Thở', 'Đứng vững', 'Tiêu hóa', 'Nghe'], answer: 'Đứng vững' },
    { q: 'Máu có màu gì?', options: ['Xanh', 'Đỏ', 'Trắng', 'Vàng'], answer: 'Đỏ' },
    { q: 'Người có mấy tay?', options: ['1', '2', '3', '4'], answer: '2' },
    { q: 'Răng dùng để làm gì?', options: ['Nhìn', 'Nghe', 'Nhai', 'Ngửi'], answer: 'Nhai' },
  ],
  
  // S6: Giác quan
  s6: [
    { q: 'Mắt dùng để làm gì?', options: ['Nghe', 'Nhìn', 'Ngửi', 'Nếm'], answer: 'Nhìn' },
    { q: 'Tai dùng để làm gì?', options: ['Nghe', 'Nhìn', 'Ngửi', 'Nếm'], answer: 'Nghe' },
    { q: 'Mũi dùng để làm gì?', options: ['Nghe', 'Nhìn', 'Ngửi', 'Nếm'], answer: 'Ngửi' },
    { q: 'Lưỡi dùng để làm gì?', options: ['Nghe', 'Nhìn', 'Ngửi', 'Nếm'], answer: 'Nếm' },
    { q: 'Da dùng để làm gì?', options: ['Nghe', 'Sờ/Cảm nhận', 'Ngửi', 'Nếm'], answer: 'Sờ/Cảm nhận' },
    { q: 'Con người có mấy giác quan?', options: ['3', '4', '5', '6'], answer: '5' },
    { q: 'Khi ăn chanh, lưỡi cảm thấy?', options: ['Ngọt', 'Chua', 'Mặn', 'Đắng'], answer: 'Chua' },
    { q: 'Khi sờ lửa, ta cảm thấy?', options: ['Lạnh', 'Nóng', 'Mềm', 'Cứng'], answer: 'Nóng' },
  ],
  
  // S7: Hệ mặt trời
  s7: [
    { q: 'Hành tinh nào gần Mặt trời nhất?', options: ['Trái Đất', 'Sao Thủy', 'Sao Kim', 'Sao Hỏa'], answer: 'Sao Thủy' },
    { q: 'Chúng ta sống trên hành tinh nào?', options: ['Sao Hỏa', 'Sao Kim', 'Trái Đất', 'Mặt Trăng'], answer: 'Trái Đất' },
    { q: 'Mặt Trăng quay quanh?', options: ['Mặt Trời', 'Trái Đất', 'Sao Hỏa', 'Sao Kim'], answer: 'Trái Đất' },
    { q: 'Ngày và đêm do đâu mà có?', options: ['Trái Đất quay', 'Mặt Trời quay', 'Mặt Trăng quay'], answer: 'Trái Đất quay' },
    { q: '1 năm có mấy mùa?', options: ['2', '3', '4', '5'], answer: '4' },
    { q: 'Hành tinh nào có vành đai?', options: ['Trái Đất', 'Sao Hỏa', 'Sao Thổ', 'Sao Kim'], answer: 'Sao Thổ' },
    { q: 'Mặt Trời là gì?', options: ['Hành tinh', 'Ngôi sao', 'Vệ tinh', 'Sao chổi'], answer: 'Ngôi sao' },
    { q: 'Ban đêm ta thấy gì trên trời?', options: ['Mặt Trời', 'Mặt Trăng và sao', 'Cầu vồng'], answer: 'Mặt Trăng và sao' },
  ],
  
  // S8: Nước
  s8: [
    { q: 'Nước có màu gì?', options: ['Xanh', 'Trắng', 'Không màu', 'Vàng'], answer: 'Không màu' },
    { q: 'Nước đóng băng ở nhiệt độ?', options: ['0°C', '10°C', '50°C', '100°C'], answer: '0°C' },
    { q: 'Nước sôi ở nhiệt độ?', options: ['0°C', '50°C', '100°C', '200°C'], answer: '100°C' },
    { q: 'Nước có thể ở dạng nào?', options: ['Lỏng', 'Rắn (đá)', 'Khí (hơi)', 'Cả 3'], answer: 'Cả 3' },
    { q: 'Con người cần nước để?', options: ['Thở', 'Sống', 'Bay', 'Ngủ'], answer: 'Sống' },
    { q: 'Nguồn nước nào uống được?', options: ['Nước biển', 'Nước sông', 'Nước lọc', 'Nước ao'], answer: 'Nước lọc' },
    { q: 'Mây được tạo từ?', options: ['Khói', 'Hơi nước', 'Bụi', 'Không khí'], answer: 'Hơi nước' },
    { q: 'Khi nước bốc hơi thành?', options: ['Đá', 'Hơi nước', 'Mưa', 'Tuyết'], answer: 'Hơi nước' },
  ],
};

export const getLessonQuestions = (lessonId) => LESSON_QUESTIONS[lessonId] || [];
