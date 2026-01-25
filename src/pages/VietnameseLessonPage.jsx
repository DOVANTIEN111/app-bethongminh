// src/pages/VietnameseLessonPage.jsx
// Trang bài học Tiếng Việt - Thiết kế đẹp cho trẻ em
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useAudio } from '../contexts/AudioContext';
import { getVietnameseLesson, getNextVietnameseLesson } from '../data/vietnameseLessons';
import { getTiengVietLop1Lesson, getNextLessonInCategory } from '../data/tiengviet/lop1';
import { ArrowLeft, Home, Star, Heart, CheckCircle, XCircle, Sparkles, Trophy, ChevronRight, RotateCcw, Lightbulb, List } from 'lucide-react';

// Confetti animation
const Confetti = ({ show }) => {
  if (!show) return null;
  const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3', '#f38181', '#aa96da'];
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ top: -20, left: `${Math.random() * 100}%`, rotate: 0 }}
          animate={{ top: '110%', rotate: Math.random() * 720 }}
          transition={{ duration: Math.random() * 2 + 2, ease: 'linear' }}
          className="absolute w-3 h-3 rounded-sm"
          style={{ backgroundColor: colors[Math.floor(Math.random() * colors.length)] }}
        />
      ))}
    </div>
  );
};

// Image display with animation - CẢI TIẾN cho trẻ em
const ImageDisplay = ({ emoji, count = 1, size = 'large' }) => {
  // Đảm bảo count là số hợp lệ
  const validCount = Math.max(1, Math.min(count || 1, 20));

  // Kích thước lớn hơn, responsive
  const sizeClass = {
    small: 'text-4xl sm:text-5xl',
    medium: 'text-5xl sm:text-6xl md:text-7xl',
    large: 'text-6xl sm:text-7xl md:text-8xl',
    xlarge: 'text-7xl sm:text-8xl md:text-9xl',
    hero: 'text-8xl sm:text-9xl md:text-[120px]' // Siêu to cho câu hỏi chính
  }[size] || 'text-6xl';

  const gridClass = validCount <= 3 ? 'flex gap-3 justify-center' : validCount <= 6 ? 'grid grid-cols-3 gap-3' : 'grid grid-cols-5 gap-2';

  return (
    <div className={gridClass}>
      {Array(validCount).fill(null).map((_, i) => (
        <motion.span
          key={i}
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: i * 0.08, type: 'spring', bounce: 0.5 }}
          className={`${sizeClass} inline-block drop-shadow-lg`}
        >
          {emoji}
        </motion.span>
      ))}
    </div>
  );
};

// Answer button component - CẢI TIẾN cho trẻ em
const AnswerButton = ({ option, index, selected, showResult, isCorrect, onSelect, large }) => {
  const isSelected = selected === index;

  // Màu pastel tươi sáng cho từng nút
  const pastelColors = [
    'bg-gradient-to-br from-pink-100 to-pink-200 hover:from-pink-200 hover:to-pink-300 border-pink-300',
    'bg-gradient-to-br from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 border-blue-300',
    'bg-gradient-to-br from-yellow-100 to-amber-200 hover:from-yellow-200 hover:to-amber-300 border-amber-300',
    'bg-gradient-to-br from-green-100 to-emerald-200 hover:from-green-200 hover:to-emerald-300 border-emerald-300',
  ];

  let bgClass = pastelColors[index % 4];
  let textClass = 'text-gray-800';

  if (showResult) {
    if (isCorrect) {
      bgClass = 'bg-gradient-to-br from-green-400 to-emerald-500 border-green-400';
      textClass = 'text-white';
    } else if (isSelected) {
      bgClass = 'bg-gradient-to-br from-red-300 to-red-400 border-red-400';
      textClass = 'text-white';
    }
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onSelect(option, index)}
      disabled={showResult}
      className={`${bgClass} ${textClass} ${large ? 'py-6 sm:py-8 text-2xl sm:text-3xl' : 'py-5 sm:py-6 text-xl sm:text-2xl'}
        rounded-2xl sm:rounded-3xl font-bold shadow-lg transition-all border-4 min-h-[60px] sm:min-h-[80px]
        active:shadow-inner disabled:cursor-not-allowed`}
    >
      <div className="flex items-center justify-center gap-2 px-2">
        {showResult && isCorrect && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8" />
          </motion.div>
        )}
        {showResult && isSelected && !isCorrect && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <XCircle className="w-6 h-6 sm:w-8 sm:h-8" />
          </motion.div>
        )}
        <span className="leading-tight">{option}</span>
      </div>
    </motion.button>
  );
};

export default function VietnameseLessonPage() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { completeLesson } = useAuth();
  const { playSound } = useAudio();

  // Thử lấy bài học từ dữ liệu lớp 1 mới trước, nếu không có thì lấy từ dữ liệu cũ
  const lop1Lesson = getTiengVietLop1Lesson(lessonId);
  const oldLesson = getVietnameseLesson(lessonId);
  const lesson = lop1Lesson || oldLesson;
  const isLop1 = !!lop1Lesson;
  
  const [stage, setStage] = useState('intro'); // intro, learning, finished
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Not found
  if (!lesson) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-indigo-100 to-purple-100">
        <div className="text-8xl mb-4">📚</div>
        <p className="text-xl text-gray-600 mb-4">Bài học chưa sẵn sàng</p>
        <button onClick={() => navigate(-1)} className="px-6 py-3 bg-indigo-500 text-white rounded-xl font-bold">
          Quay lại
        </button>
      </div>
    );
  }

  // Lấy câu hỏi từ cấu trúc phù hợp (lớp 1 mới hoặc cũ)
  const questions = isLop1 ? (lesson.content?.quiz || []) : (lesson.questions || []);
  const question = questions[currentQ];

  // Chuẩn hóa intro và examples cho cả 2 format
  const lessonIntro = isLop1
    ? {
        title: lesson.content?.introduction?.letter || lesson.title,
        subtitle: lesson.content?.introduction?.sound || lesson.description,
        image: lesson.content?.introduction?.image || lesson.icon,
        imageCount: 1
      }
    : lesson.intro;

  const lessonExamples = isLop1
    ? (lesson.content?.vocabulary || []).map(v => ({ image: v.image, text: v.word }))
    : (lesson.examples || []);

  // Hàm kiểm tra đáp án đúng
  const checkCorrectAnswer = (option, index) => {
    if (isLop1) {
      // Lớp 1: sử dụng correctAnswer (là index)
      return index === question.correctAnswer;
    } else {
      // Cấu trúc cũ
      if (question.type === 'compare') {
        return (index === 0 && question.answer === 'A') || (index === 1 && question.answer === 'B');
      } else if (question.type === 'select') {
        return index === question.answer;
      } else {
        return option === question.answer;
      }
    }
  };

  const handleAnswer = (option, index) => {
    if (showResult) return;
    setSelected(index);

    // Check answer
    const correct = checkCorrectAnswer(option, index);

    setShowResult(true);
    
    if (correct) {
      playSound('correct');
      setScore(s => s + 1);
    } else {
      playSound('wrong');
      setLives(l => l - 1);
    }
    
    // Next question or finish
    setTimeout(() => {
      if (currentQ < questions.length - 1 && lives > (correct ? 0 : 1)) {
        setCurrentQ(c => c + 1);
        setSelected(null);
        setShowResult(false);
      } else {
        // Finished
        setStage('finished');
        const finalScore = correct ? score + 1 : score;
        const percentage = Math.round((finalScore / questions.length) * 100);
        if (percentage >= 60) {
          setShowConfetti(true);
          playSound('complete');
          completeLesson('vietnamese', lessonId, percentage);
        }
      }
    }, 1500);
  };
  
  const restart = () => {
    setStage('intro');
    setCurrentQ(0);
    setScore(0);
    setLives(3);
    setSelected(null);
    setShowResult(false);
    setShowConfetti(false);
  };
  
  // ==================== INTRO SCREEN ====================
  if (stage === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50">
        {/* Header */}
        <div className={`bg-gradient-to-br ${lesson.color || 'from-indigo-400 to-purple-500'} p-6 pb-12 rounded-b-[40px]`}>
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => navigate(-1)} className="p-2 bg-white/20 rounded-full">
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <span className="text-white/80">Tiếng Việt {isLop1 ? '- Lớp 1' : ''}</span>
          </div>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center text-white">
            <div className="text-7xl mb-3">{lesson.icon}</div>
            <h1 className="text-3xl font-bold">{lesson.title}</h1>
            <p className="text-white/80 mt-1">{lesson.description || lesson.objectives?.[0]}</p>
          </motion.div>
        </div>

        <div className="p-4 -mt-6">
          {/* Intro card */}
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white rounded-3xl p-6 shadow-xl mb-4">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">{lessonIntro?.title || lesson.title}</h2>
            <p className="text-center text-gray-500 mb-4">{lessonIntro?.subtitle || ''}</p>
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="flex justify-center py-4">
              <ImageDisplay emoji={lessonIntro?.image || lesson.icon} count={lessonIntro?.imageCount || 1} size="xlarge" />
            </motion.div>
            {/* Mô tả cho lớp 1 */}
            {isLop1 && lesson.content?.introduction?.description && (
              <p className="text-center text-gray-600 text-sm mt-2">{lesson.content.introduction.description}</p>
            )}
          </motion.div>

          {/* Examples / Vocabulary */}
          {lessonExamples?.length > 0 && (
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="mb-4">
              <h3 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" /> {isLop1 ? 'Từ vựng' : 'Ví dụ'}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {lessonExamples.slice(0, 4).map((ex, i) => (
                  <div key={i} className="bg-white rounded-xl p-3 text-center shadow">
                    <div className="text-3xl mb-1">{ex.image}</div>
                    <p className="text-sm font-medium text-gray-700">{ex.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
          
          {/* Start button */}
          <motion.button
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { playSound('click'); setStage('learning'); }}
            className={`w-full py-5 bg-gradient-to-r ${lesson.color} text-white rounded-2xl font-bold text-xl shadow-lg flex items-center justify-center gap-2`}
          >
            <Sparkles className="w-6 h-6" /> Bắt đầu học! <ChevronRight className="w-6 h-6" />
          </motion.button>
        </div>
      </div>
    );
  }
  
  // ==================== FINISHED SCREEN ====================
  if (stage === 'finished') {
    const percentage = Math.round((score / questions.length) * 100);
    const stars = percentage >= 90 ? 3 : percentage >= 70 ? 2 : percentage >= 50 ? 1 : 0;
    const passed = percentage >= 60;
    const nextLesson = isLop1 ? getNextLessonInCategory(lessonId) : getNextVietnameseLesson(lessonId);

    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${passed ? 'bg-gradient-to-b from-green-400 to-emerald-500' : 'bg-gradient-to-b from-orange-400 to-red-500'}`}>
        <Confetti show={showConfetti} />

        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
          <motion.div initial={{ y: -20 }} animate={{ y: 0 }} transition={{ type: 'spring', bounce: 0.5 }} className="text-7xl mb-4">
            {passed ? '🎉' : '💪'}
          </motion.div>

          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            {passed ? 'Tuyệt vời!' : 'Cố gắng thêm nhé!'}
          </h2>
          <p className="text-gray-500 mb-2">Bạn đã hoàn thành</p>
          <p className="text-lg font-bold text-green-600 mb-4">{lesson.title}</p>

          {/* Stars */}
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3].map(i => (
              <motion.div
                key={i}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: i * 0.2 }}
              >
                <Star className={`w-12 h-12 ${i <= stars ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
              </motion.div>
            ))}
          </div>

          {/* Score */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-4 mb-6 text-white">
            <p className="text-5xl font-bold">{score}/{questions.length}</p>
            <p className="text-white/80">Câu trả lời đúng</p>
            {passed && lesson.reward && (
              <p className="mt-2 text-amber-300 font-medium">+{lesson.reward.xp} XP</p>
            )}
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            {/* Nút học bài tiếp theo */}
            {nextLesson && passed && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={() => navigate(`/vietnamese/${nextLesson.id}`)}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl font-bold text-white flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
              >
                <ChevronRight className="w-5 h-5" /> Học bài tiếp theo
              </motion.button>
            )}

            <div className="flex gap-3">
              <button onClick={restart} className="flex-1 py-4 bg-gray-100 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
                <RotateCcw className="w-5 h-5" /> Học lại
              </button>
              <button onClick={() => navigate('/learn/lessons')} className="flex-1 py-4 bg-green-100 text-green-700 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-200 transition-colors">
                <List className="w-5 h-5" /> Danh sách
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ==================== LEARNING SCREEN ====================
  // Check if question exists
  if (!question) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-indigo-100 to-purple-100">
        <div className="text-8xl mb-4">⏳</div>
        <p className="text-xl text-gray-600 mb-4">Đang tải bài học...</p>
        <button onClick={() => navigate(-1)} className="px-6 py-3 bg-indigo-500 text-white rounded-xl font-bold">
          Quay lại
        </button>
      </div>
    );
  }

  // Lấy hình ảnh minh họa cho câu hỏi (emoji hoặc từ options)
  const getQuestionImage = () => {
    // Nếu câu hỏi có image
    if (question.image) return question.image;
    // Nếu là câu hỏi về chữ cái, lấy chữ từ options
    if (question.options && question.options.length > 0) {
      const firstOpt = question.options[0];
      // Tìm emoji trong option
      const emojiMatch = String(firstOpt).match(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]/u);
      if (emojiMatch) return emojiMatch[0];
    }
    // Mặc định cho từng loại câu hỏi
    if (question.question?.includes('chữ') || question.question?.includes('Chữ')) return '🔤';
    if (question.question?.includes('từ') || question.question?.includes('Từ')) return '📖';
    if (question.question?.includes('đọc') || question.question?.includes('Đọc')) return '🗣️';
    return lesson.icon || '📚';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-blue-50 to-indigo-100">
      {/* Header - Compact & Colorful */}
      <div className={`bg-gradient-to-r ${lesson.color || 'from-indigo-500 to-purple-600'} px-4 py-3 shadow-lg`}>
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2.5 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>

          <div className="flex-1 mx-4">
            {/* Progress Bar */}
            <div className="bg-white/20 rounded-full h-3 sm:h-4 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
                className="bg-gradient-to-r from-yellow-300 to-amber-400 h-full rounded-full"
              />
            </div>
            <p className="text-center text-white/90 text-xs sm:text-sm mt-1 font-medium">
              Câu {currentQ + 1} / {questions.length}
            </p>
          </div>

          {/* Lives */}
          <div className="flex gap-0.5 sm:gap-1">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={i < lives ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Heart className={`w-6 h-6 sm:w-7 sm:h-7 ${i < lives ? 'text-red-400 fill-red-400 drop-shadow-md' : 'text-white/30'}`} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-3 sm:p-4 md:p-6 max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            className="space-y-4 sm:space-y-6"
          >
            {/* Question Card - HÌNH ẢNH LỚN */}
            <div className="bg-white rounded-3xl sm:rounded-[2rem] p-4 sm:p-6 md:p-8 shadow-xl border-4 border-white/50">

              {/* HÌNH ẢNH MINH HỌA LỚN - 200-300px */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', bounce: 0.4 }}
                className="flex justify-center py-4 sm:py-6"
              >
                <div className="bg-gradient-to-br from-yellow-100 via-amber-50 to-orange-100 rounded-3xl p-6 sm:p-8 shadow-inner">
                  {/* Visual based on question type */}
                  {question.type === 'count' && question.image ? (
                    <ImageDisplay emoji={question.image} count={question.imageCount || 1} size={(question.imageCount || 1) > 6 ? 'medium' : 'hero'} />
                  ) : question.type === 'compare' ? null : (
                    <ImageDisplay emoji={getQuestionImage()} count={1} size="hero" />
                  )}
                </div>
              </motion.div>

              {/* CÂU HỎI - Font lớn, rõ ràng */}
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 text-center leading-relaxed px-2"
              >
                {question.question}
              </motion.p>

              {/* Visual options nếu có */}
              {(question.type === 'identify' || question.type === 'spell' || question.type === 'read' || question.type === 'match_word' || question.type === 'sound' || question.type === 'sequence') && question.visual && (
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-4 mt-4 border-2 border-emerald-200">
                  <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                    {question.visual.options?.map((opt, i) => (
                      <motion.span
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="text-lg sm:text-xl bg-white px-4 py-2 rounded-xl shadow-sm font-medium"
                      >
                        {opt}
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}

              {/* Compare type */}
              {question.type === 'compare' && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAnswer('A', 0)}
                    disabled={showResult}
                    className={`p-4 sm:p-6 rounded-2xl border-4 transition-all ${
                      showResult && question.answer === 'A' ? 'border-green-500 bg-green-100 scale-105' :
                      showResult && selected === 0 ? 'border-red-400 bg-red-100' :
                      'border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100 hover:border-blue-400'
                    }`}
                  >
                    <p className="text-sm font-bold text-gray-500 mb-2">A</p>
                    <ImageDisplay emoji={question.optionA?.image} count={question.optionA?.count || 1} size="large" />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAnswer('B', 1)}
                    disabled={showResult}
                    className={`p-4 sm:p-6 rounded-2xl border-4 transition-all ${
                      showResult && question.answer === 'B' ? 'border-green-500 bg-green-100 scale-105' :
                      showResult && selected === 1 ? 'border-red-400 bg-red-100' :
                      'border-orange-300 bg-gradient-to-br from-orange-50 to-orange-100 hover:border-orange-400'
                    }`}
                  >
                    <p className="text-sm font-bold text-gray-500 mb-2">B</p>
                    <ImageDisplay emoji={question.optionB?.image} count={question.optionB?.count || 1} size="large" />
                  </motion.button>
                </div>
              )}

              {/* Hiển thị hint/explanation khi trả lời sai */}
              {showResult && selected !== null && !checkCorrectAnswer(question.options?.[selected], selected) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-4 border-2 border-amber-200"
                >
                  <p className="text-center text-amber-700 font-medium flex items-center justify-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    {question.hint || question.explanation || 'Hãy thử lại nhé!'}
                  </p>
                </motion.div>
              )}

              {/* Hiển thị khi trả lời đúng */}
              {showResult && selected !== null && checkCorrectAnswer(question.options?.[selected], selected) && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="mt-4 text-center"
                >
                  <span className="text-4xl">🎉</span>
                  <p className="text-green-600 font-bold text-lg mt-1">Giỏi lắm!</p>
                </motion.div>
              )}
            </div>

            {/* ĐÁP ÁN - Nút lớn, màu pastel */}
            {question.type !== 'compare' && question.options && question.options.length > 0 && (
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className={`grid gap-3 sm:gap-4 ${
                  question.options.length === 2 ? 'grid-cols-2' :
                  question.options.length === 3 ? 'grid-cols-3' :
                  'grid-cols-2'
                }`}
              >
                {question.options.map((opt, i) => {
                  const correct = checkCorrectAnswer(opt, i);
                  const displayText = typeof opt === 'object' ? (opt.text || opt.count || JSON.stringify(opt)) : opt;

                  return (
                    <AnswerButton
                      key={i}
                      option={displayText}
                      index={i}
                      selected={selected}
                      showResult={showResult}
                      isCorrect={correct}
                      onSelect={handleAnswer}
                      large={question.options.length <= 2}
                    />
                  );
                })}
              </motion.div>
            )}

            {/* Score display - Floating */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center pt-2"
            >
              <div className="bg-gradient-to-r from-amber-100 to-yellow-100 rounded-full px-6 py-3 shadow-lg border-2 border-amber-200 flex items-center gap-3">
                <Star className="w-6 h-6 sm:w-7 sm:h-7 text-amber-500 fill-amber-400" />
                <span className="font-bold text-lg sm:text-xl text-amber-700">{score} điểm</span>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
