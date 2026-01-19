import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useMember } from '../contexts/MemberContext';
import { useAudio } from '../contexts/AudioContext';
import { getSubject } from '../data/subjects';
import { ArrowLeft, CheckCircle, XCircle, Star, Home } from 'lucide-react';

// Sample questions for each lesson
const LESSON_QUESTIONS = {
  // MATH
  m1: [
    { q: 'Đếm số quả táo: 🍎🍎🍎', options: ['2', '3', '4', '5'], answer: '3' },
    { q: 'Số nào đứng sau số 4?', options: ['3', '5', '6', '2'], answer: '5' },
    { q: 'Đếm: 🌟🌟🌟🌟🌟', options: ['4', '5', '6', '7'], answer: '5' },
    { q: 'Số nào nhỏ nhất?', options: ['3', '1', '5', '2'], answer: '1' },
    { q: 'Đếm ngón tay: ✋', options: ['4', '5', '6', '3'], answer: '5' },
  ],
  m2: [
    { q: 'Số nào đứng sau 10?', options: ['9', '11', '12', '10'], answer: '11' },
    { q: 'Đếm: 15 quả bóng', options: ['14', '15', '16', '13'], answer: '15' },
    { q: '12 + 3 = ?', options: ['14', '15', '16', '13'], answer: '15' },
    { q: 'Số nào lớn nhất?', options: ['12', '18', '15', '11'], answer: '18' },
    { q: '20 - 5 = ?', options: ['14', '15', '16', '13'], answer: '15' },
  ],
  m3: [
    { q: '2 + 3 = ?', options: ['4', '5', '6', '7'], answer: '5' },
    { q: '4 + 2 = ?', options: ['5', '6', '7', '8'], answer: '6' },
    { q: '1 + 7 = ?', options: ['7', '8', '9', '6'], answer: '8' },
    { q: '5 + 5 = ?', options: ['9', '10', '11', '8'], answer: '10' },
    { q: '3 + 4 = ?', options: ['6', '7', '8', '5'], answer: '7' },
  ],
  m4: [
    { q: '5 - 2 = ?', options: ['2', '3', '4', '1'], answer: '3' },
    { q: '8 - 3 = ?', options: ['4', '5', '6', '7'], answer: '5' },
    { q: '10 - 4 = ?', options: ['5', '6', '7', '8'], answer: '6' },
    { q: '7 - 7 = ?', options: ['0', '1', '2', '7'], answer: '0' },
    { q: '9 - 5 = ?', options: ['3', '4', '5', '6'], answer: '4' },
  ],
  m5: [
    { q: 'Số nào lớn hơn: 5 hay 3?', options: ['5', '3'], answer: '5' },
    { q: 'Số nào nhỏ hơn: 8 hay 10?', options: ['8', '10'], answer: '8' },
    { q: '7 __ 9 (điền dấu)', options: ['<', '>', '='], answer: '<' },
    { q: '5 + 2 __ 6', options: ['<', '>', '='], answer: '>' },
    { q: 'Sắp xếp tăng dần: 3, 1, 2', options: ['1, 2, 3', '3, 2, 1', '2, 1, 3'], answer: '1, 2, 3' },
  ],
  // VIETNAMESE
  v1: [
    { q: 'Chữ cái đầu bảng chữ cái?', options: ['B', 'A', 'C', 'D'], answer: 'A' },
    { q: 'Chữ nào sau chữ B?', options: ['A', 'C', 'D', 'E'], answer: 'C' },
    { q: 'Từ "Bé" bắt đầu bằng chữ?', options: ['A', 'B', 'C', 'D'], answer: 'B' },
    { q: 'Đây là chữ gì? Đ', options: ['D', 'Đ', 'E', 'G'], answer: 'Đ' },
    { q: 'Chữ nào có dấu mũ?', options: ['A', 'Â', 'B', 'C'], answer: 'Â' },
  ],
  v2: [
    { q: 'Chữ nào sau chữ I?', options: ['H', 'K', 'L', 'J'], answer: 'K' },
    { q: 'Từ "Mẹ" bắt đầu bằng chữ?', options: ['N', 'M', 'L', 'K'], answer: 'M' },
    { q: 'Chữ Ô khác chữ O ở?', options: ['Có dấu mũ', 'Có dấu móc', 'Giống nhau'], answer: 'Có dấu mũ' },
    { q: 'Đây là chữ gì? Ơ', options: ['O', 'Ô', 'Ơ', 'U'], answer: 'Ơ' },
    { q: 'Chữ nào đứng trước P?', options: ['O', 'Q', 'N', 'R'], answer: 'O' },
  ],
  v3: [
    { q: 'Chữ nào cuối bảng chữ cái?', options: ['X', 'Y', 'Z', 'W'], answer: 'Z' },
    { q: 'Từ "Xe" bắt đầu bằng?', options: ['S', 'X', 'V', 'Z'], answer: 'X' },
    { q: 'Chữ Ư khác U như nào?', options: ['Có dấu móc', 'Có dấu mũ', 'Giống nhau'], answer: 'Có dấu móc' },
    { q: 'Đây là chữ gì? Y', options: ['I', 'Y', 'V', 'W'], answer: 'Y' },
    { q: 'Bảng chữ cái có mấy chữ?', options: ['26', '29', '24', '30'], answer: '29' },
  ],
  v4: [
    { q: 'Ghép: B + A = ?', options: ['BA', 'AB', 'BE', 'BI'], answer: 'BA' },
    { q: 'Ghép: M + E = ?', options: ['ME', 'MA', 'MO', 'MI'], answer: 'ME' },
    { q: 'Từ "CÁ" có vần gì?', options: ['A', 'Á', 'O', 'I'], answer: 'A' },
    { q: 'Ghép: L + A = ?', options: ['LA', 'LO', 'LE', 'LI'], answer: 'LA' },
    { q: 'Ghép: Đ + I = ?', options: ['ĐI', 'ĐA', 'ĐO', 'ĐE'], answer: 'ĐI' },
  ],
  v5: [
    { q: 'Đây là con gì? 🐱', options: ['Chó', 'Mèo', 'Gà', 'Vịt'], answer: 'Mèo' },
    { q: 'Đây là quả gì? 🍎', options: ['Cam', 'Chuối', 'Táo', 'Nho'], answer: 'Táo' },
    { q: 'Đây là gì? 🏠', options: ['Xe', 'Nhà', 'Cây', 'Hoa'], answer: 'Nhà' },
    { q: 'Đây là gì? ☀️', options: ['Trăng', 'Trời', 'Sao', 'Mây'], answer: 'Trời' },
    { q: 'Đây là gì? 🌸', options: ['Lá', 'Cây', 'Hoa', 'Quả'], answer: 'Hoa' },
  ],
  // ENGLISH
  e1: [
    { q: 'What letter is this? A', options: ['A', 'B', 'C', 'D'], answer: 'A' },
    { q: 'Apple starts with?', options: ['B', 'A', 'C', 'D'], answer: 'A' },
    { q: 'What comes after B?', options: ['A', 'C', 'D', 'E'], answer: 'C' },
    { q: 'Dog starts with?', options: ['B', 'C', 'D', 'E'], answer: 'D' },
    { q: 'What letter is this? M', options: ['N', 'M', 'W', 'L'], answer: 'M' },
  ],
  e2: [
    { q: 'What comes after N?', options: ['M', 'O', 'P', 'Q'], answer: 'O' },
    { q: 'Sun starts with?', options: ['R', 'S', 'T', 'U'], answer: 'S' },
    { q: 'What is the last letter?', options: ['Y', 'X', 'Z', 'W'], answer: 'Z' },
    { q: 'Water starts with?', options: ['V', 'W', 'X', 'Y'], answer: 'W' },
    { q: 'What comes before Z?', options: ['X', 'Y', 'W', 'V'], answer: 'Y' },
  ],
  e3: [
    { q: 'How do you say "1"?', options: ['Two', 'One', 'Three', 'Four'], answer: 'One' },
    { q: 'What number is "Five"?', options: ['4', '5', '6', '7'], answer: '5' },
    { q: '🍎🍎🍎 = How many?', options: ['Two', 'Three', 'Four', 'Five'], answer: 'Three' },
    { q: 'What comes after Seven?', options: ['Six', 'Eight', 'Nine', 'Ten'], answer: 'Eight' },
    { q: 'How do you say "10"?', options: ['Nine', 'Ten', 'Eleven', 'Twelve'], answer: 'Ten' },
  ],
  e4: [
    { q: 'What color is 🍎?', options: ['Blue', 'Red', 'Green', 'Yellow'], answer: 'Red' },
    { q: 'What color is 🌊?', options: ['Red', 'Blue', 'Green', 'Yellow'], answer: 'Blue' },
    { q: 'What color is 🍌?', options: ['Red', 'Blue', 'Green', 'Yellow'], answer: 'Yellow' },
    { q: 'What color is 🌿?', options: ['Red', 'Blue', 'Green', 'Yellow'], answer: 'Green' },
    { q: 'What color is ☀️?', options: ['Orange', 'Blue', 'Green', 'Yellow'], answer: 'Yellow' },
  ],
  e5: [
    { q: '🐱 is a...', options: ['Dog', 'Cat', 'Bird', 'Fish'], answer: 'Cat' },
    { q: '🐕 is a...', options: ['Dog', 'Cat', 'Bird', 'Fish'], answer: 'Dog' },
    { q: '🐦 is a...', options: ['Dog', 'Cat', 'Bird', 'Fish'], answer: 'Bird' },
    { q: '🐠 is a...', options: ['Dog', 'Cat', 'Bird', 'Fish'], answer: 'Fish' },
    { q: '🐘 is an...', options: ['Lion', 'Tiger', 'Elephant', 'Bear'], answer: 'Elephant' },
  ],
  e6: [
    { q: '👨 is...', options: ['Mother', 'Father', 'Sister', 'Brother'], answer: 'Father' },
    { q: '👩 is...', options: ['Mother', 'Father', 'Sister', 'Brother'], answer: 'Mother' },
    { q: '👧 is...', options: ['Mother', 'Father', 'Sister', 'Brother'], answer: 'Sister' },
    { q: '👦 is...', options: ['Mother', 'Father', 'Sister', 'Brother'], answer: 'Brother' },
    { q: '👴👵 are...', options: ['Parents', 'Grandparents', 'Children', 'Friends'], answer: 'Grandparents' },
  ],
  // SCIENCE & LIFE SKILLS
  s1: [
    { q: 'Dùng gì để nhìn?', options: ['Tai', 'Mắt', 'Mũi', 'Miệng'], answer: 'Mắt' },
    { q: 'Dùng gì để nghe?', options: ['Tai', 'Mắt', 'Mũi', 'Miệng'], answer: 'Tai' },
    { q: 'Con người có mấy tay?', options: ['1', '2', '3', '4'], answer: '2' },
    { q: 'Bộ phận nào giúp thở?', options: ['Mắt', 'Tai', 'Mũi', 'Tay'], answer: 'Mũi' },
    { q: 'Tim nằm ở đâu?', options: ['Đầu', 'Ngực', 'Bụng', 'Chân'], answer: 'Ngực' },
  ],
  s2: [
    { q: '🐕 là động vật gì?', options: ['Hoang dã', 'Nuôi nhà', 'Dưới nước'], answer: 'Nuôi nhà' },
    { q: 'Con gì kêu "Meo meo"?', options: ['Chó', 'Mèo', 'Gà', 'Vịt'], answer: 'Mèo' },
    { q: 'Con gì sống dưới nước?', options: ['Chim', 'Mèo', 'Cá', 'Gà'], answer: 'Cá' },
    { q: 'Con gì có vòi dài?', options: ['Hổ', 'Sư tử', 'Voi', 'Gấu'], answer: 'Voi' },
    { q: 'Con gì đẻ trứng?', options: ['Chó', 'Mèo', 'Gà', 'Bò'], answer: 'Gà' },
  ],
  s3: [
    { q: 'Cây cần gì để sống?', options: ['Chỉ nước', 'Nước và ánh sáng', 'Chỉ đất'], answer: 'Nước và ánh sáng' },
    { q: 'Phần nào hút nước?', options: ['Lá', 'Hoa', 'Rễ', 'Thân'], answer: 'Rễ' },
    { q: '🌻 là gì?', options: ['Lá', 'Rễ', 'Hoa', 'Quả'], answer: 'Hoa' },
    { q: 'Quả nào mọc trên cây?', options: ['Khoai', 'Táo', 'Củ cải'], answer: 'Táo' },
    { q: 'Cây cho ta gì?', options: ['Oxy', 'Nước', 'Đất'], answer: 'Oxy' },
  ],
  l1: [
    { q: 'Khi nào cần rửa tay?', options: ['Trước ăn', 'Sau chơi', 'Cả hai'], answer: 'Cả hai' },
    { q: 'Đánh răng mấy lần/ngày?', options: ['1', '2', '3'], answer: '2' },
    { q: 'Tắm giúp ta...', options: ['Bẩn hơn', 'Sạch sẽ', 'Mệt hơn'], answer: 'Sạch sẽ' },
    { q: 'Khi ho, hắt hơi nên...', options: ['Để vậy', 'Che miệng', 'Hướng người khác'], answer: 'Che miệng' },
    { q: 'Móng tay dài nên...', options: ['Để vậy', 'Cắt ngắn', 'Cắn'], answer: 'Cắt ngắn' },
  ],
  l2: [
    { q: 'Đèn đỏ nghĩa là?', options: ['Đi', 'Dừng', 'Chạy nhanh'], answer: 'Dừng' },
    { q: 'Qua đường ở đâu an toàn?', options: ['Bất cứ đâu', 'Vạch kẻ đường', 'Giữa đường'], answer: 'Vạch kẻ đường' },
    { q: 'Ngồi xe máy phải...', options: ['Không cần gì', 'Đội mũ bảo hiểm', 'Đứng'], answer: 'Đội mũ bảo hiểm' },
    { q: 'Đi bộ ở đâu?', options: ['Lòng đường', 'Vỉa hè', 'Đều được'], answer: 'Vỉa hè' },
    { q: 'Đèn xanh nghĩa là?', options: ['Dừng', 'Được đi', 'Chờ'], answer: 'Được đi' },
  ],
  l3: [
    { q: '😊 là cảm xúc gì?', options: ['Buồn', 'Vui', 'Giận', 'Sợ'], answer: 'Vui' },
    { q: '😢 là cảm xúc gì?', options: ['Vui', 'Buồn', 'Giận', 'Ngạc nhiên'], answer: 'Buồn' },
    { q: 'Khi buồn, nên...', options: ['Giữ trong lòng', 'Nói với người thân', 'Đánh bạn'], answer: 'Nói với người thân' },
    { q: '😠 là cảm xúc gì?', options: ['Vui', 'Buồn', 'Giận', 'Sợ'], answer: 'Giận' },
    { q: 'Khi được giúp, nói...', options: ['Không', 'Cảm ơn', 'Đi đi'], answer: 'Cảm ơn' },
  ],
};

export default function LessonPage() {
  const { subjectId, lessonId } = useParams();
  const navigate = useNavigate();
  const { completeLesson } = useMember();
  const { playSound, speak } = useAudio();
  
  const subject = getSubject(subjectId);
  const lesson = subject?.lessons.find(l => l.id === lessonId);
  const questions = LESSON_QUESTIONS[lessonId] || [];
  
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);
  
  useEffect(() => {
    if (subjectId === 'english' && questions[current]) {
      setTimeout(() => speak(questions[current].q), 500);
    }
  }, [current, subjectId]);
  
  if (!subject || !lesson || questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-6xl mb-4">📚</div>
        <p className="text-gray-500 mb-4">Bài học chưa sẵn sàng</p>
        <button onClick={() => navigate(-1)} className="px-6 py-3 bg-indigo-500 text-white rounded-xl">Quay lại</button>
      </div>
    );
  }
  
  const q = questions[current];
  
  const handleAnswer = (opt) => {
    if (showResult) return;
    setSelected(opt);
    setShowResult(true);
    if (opt === q.answer) {
      playSound('correct');
      setScore(s => s + 1);
    } else {
      playSound('wrong');
    }
  };
  
  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(c => c + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      const finalScore = Math.round((score / questions.length) * 100);
      completeLesson(subjectId, lessonId, finalScore);
      playSound(finalScore >= 80 ? 'levelUp' : 'pop');
      setFinished(true);
    }
  };
  
  if (finished) {
    const finalScore = Math.round((score / questions.length) * 100);
    const stars = finalScore >= 90 ? 3 : finalScore >= 70 ? 2 : finalScore >= 50 ? 1 : 0;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-col items-center justify-center p-4">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
          <div className="text-6xl mb-4">{finalScore >= 80 ? '🎉' : finalScore >= 50 ? '👍' : '💪'}</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {finalScore >= 80 ? 'Xuất sắc!' : finalScore >= 50 ? 'Tốt lắm!' : 'Cố gắng nhé!'}
          </h2>
          <p className="text-gray-500 mb-4">{lesson.title}</p>
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3].map(i => (
              <Star key={i} className={`w-10 h-10 ${i <= stars ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
            ))}
          </div>
          <div className="text-5xl font-bold text-indigo-600 mb-2">{finalScore}</div>
          <p className="text-gray-500 mb-6">điểm</p>
          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div className="bg-green-50 rounded-xl p-3">
              <p className="text-green-600 font-bold text-lg">{score}</p>
              <p className="text-green-500">Đúng</p>
            </div>
            <div className="bg-red-50 rounded-xl p-3">
              <p className="text-red-600 font-bold text-lg">{questions.length - score}</p>
              <p className="text-red-500">Sai</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate(`/subject/${subjectId}`)} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold flex items-center justify-center gap-2">
              <ArrowLeft className="w-5 h-5" /> Quay lại
            </button>
            <button onClick={() => navigate('/')} className="flex-1 py-3 bg-indigo-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2">
              <Home className="w-5 h-5" /> Trang chủ
            </button>
          </div>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`bg-gradient-to-r ${subject.color} text-white px-4 py-4`}>
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-white/20">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <span className="font-semibold">{lesson.title}</span>
          <span className="text-sm bg-white/20 px-3 py-1 rounded-full">{current + 1}/{questions.length}</span>
        </div>
        <div className="h-2 bg-white/30 rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${((current + 1) / questions.length) * 100}%` }} className="h-full bg-white rounded-full" />
        </div>
      </div>
      
      <div className="p-4">
        <motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <p className="text-xl font-semibold text-gray-800 text-center">{q.q}</p>
          {subjectId === 'english' && (
            <button onClick={() => speak(q.q)} className="mt-3 mx-auto block text-indigo-500 text-sm">🔊 Nghe lại</button>
          )}
        </motion.div>
        
        <div className="grid grid-cols-2 gap-3">
          {q.options.map((opt, i) => {
            const isCorrect = opt === q.answer;
            const isSelected = opt === selected;
            let bg = 'bg-white', border = 'border-gray-200', text = 'text-gray-800';
            if (showResult) {
              if (isCorrect) { bg = 'bg-green-50'; border = 'border-green-500'; text = 'text-green-700'; }
              else if (isSelected) { bg = 'bg-red-50'; border = 'border-red-500'; text = 'text-red-700'; }
            } else if (isSelected) { bg = 'bg-indigo-50'; border = 'border-indigo-500'; }
            
            return (
              <motion.button key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                onClick={() => handleAnswer(opt)} disabled={showResult}
                className={`p-4 rounded-2xl border-2 ${bg} ${border} ${text} font-semibold text-lg flex items-center justify-center gap-2`}>
                {showResult && isCorrect && <CheckCircle className="w-5 h-5 text-green-500" />}
                {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500" />}
                {opt}
              </motion.button>
            );
          })}
        </div>
        
        <AnimatePresence>
          {showResult && (
            <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onClick={handleNext}
              className="w-full mt-6 py-4 bg-indigo-500 text-white rounded-2xl font-semibold text-lg">
              {current < questions.length - 1 ? 'Câu tiếp theo →' : 'Xem kết quả 🎉'}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
