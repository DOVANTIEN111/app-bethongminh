// src/pages/MathLessonPage.jsx
// Trang bài học Toán - Thiết kế đẹp cho trẻ em
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useAudio } from '../contexts/AudioContext';
import { getMathLesson, getNextMathLesson } from '../data/mathLessons';
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

// Image display with animation - CẢI TIẾN với kích thước lớn hơn
const ImageDisplay = ({ emoji, count = 1, size = 'large', crossedOut = 0 }) => {
  const validCount = Math.max(1, Math.min(count || 1, 20));

  // Kích thước lớn hơn, responsive - emoji 50-60px
  const sizeClass = {
    small: 'text-4xl sm:text-5xl',           // 36-48px
    medium: 'text-5xl sm:text-6xl',          // 48-60px
    large: 'text-6xl sm:text-7xl',           // 60-72px
    xlarge: 'text-7xl sm:text-8xl',          // 72-96px
    hero: 'text-8xl sm:text-9xl'             // 96-128px
  }[size] || 'text-6xl';

  const gridClass = validCount <= 3 ? 'flex gap-3 sm:gap-4 justify-center flex-wrap' :
                    validCount <= 6 ? 'grid grid-cols-3 gap-2 sm:gap-3' :
                    'grid grid-cols-5 gap-1 sm:gap-2';

  return (
    <div className={gridClass}>
      {Array(validCount).fill(null).map((_, i) => {
        const isCrossed = i >= (validCount - crossedOut);
        return (
          <motion.span
            key={i}
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: i * 0.06, type: 'spring', bounce: 0.5 }}
            className={`${sizeClass} inline-block drop-shadow-lg relative ${isCrossed ? 'opacity-30' : ''}`}
          >
            {emoji}
            {isCrossed && (
              <span className="absolute inset-0 flex items-center justify-center text-red-500 text-4xl sm:text-5xl font-bold">
                ✕
              </span>
            )}
          </motion.span>
        );
      })}
    </div>
  );
};

// Answer button component - CẢI TIẾN với màu pastel
const AnswerButton = ({ option, index, selected, showResult, isCorrect, onSelect, large }) => {
  const isSelected = selected === index;

  // Màu pastel tươi sáng theo yêu cầu
  const pastelColors = [
    'bg-gradient-to-br from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 border-blue-300',     // #93c5fd
    'bg-gradient-to-br from-orange-100 to-orange-200 hover:from-orange-200 hover:to-orange-300 border-orange-300', // #fdba74
    'bg-gradient-to-br from-violet-100 to-violet-200 hover:from-violet-200 hover:to-violet-300 border-violet-300', // #c4b5fd
    'bg-gradient-to-br from-green-100 to-green-200 hover:from-green-200 hover:to-green-300 border-green-300',  // #86efac
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
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onSelect(option, index)}
      disabled={showResult}
      className={`${bgClass} ${textClass} ${large ? 'py-6 sm:py-8 text-3xl sm:text-4xl' : 'py-5 sm:py-6 text-2xl sm:text-3xl'}
        rounded-2xl sm:rounded-3xl font-bold shadow-lg transition-all border-4 min-h-[70px] sm:min-h-[90px]
        active:shadow-inner disabled:cursor-not-allowed`}
    >
      <div className="flex items-center justify-center gap-2 px-2">
        {showResult && isCorrect && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8" />
          </motion.div>
        )}
        {showResult && isSelected && !isCorrect && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <XCircle className="w-7 h-7 sm:w-8 sm:h-8" />
          </motion.div>
        )}
        <span className="leading-tight">{option}</span>
      </div>
    </motion.button>
  );
};

// Select type button - Hiển thị hình ảnh thay vì số
const SelectImageButton = ({ opt, index, selected, showResult, isCorrect, onSelect }) => {
  const isSelected = selected === index;

  const pastelColors = [
    'bg-gradient-to-br from-pink-100 to-pink-200 hover:from-pink-200 hover:to-pink-300 border-pink-300',
    'bg-gradient-to-br from-sky-100 to-sky-200 hover:from-sky-200 hover:to-sky-300 border-sky-300',
    'bg-gradient-to-br from-amber-100 to-amber-200 hover:from-amber-200 hover:to-amber-300 border-amber-300',
    'bg-gradient-to-br from-lime-100 to-lime-200 hover:from-lime-200 hover:to-lime-300 border-lime-300',
  ];

  let bgClass = pastelColors[index % 4];

  if (showResult) {
    if (isCorrect) {
      bgClass = 'bg-gradient-to-br from-green-300 to-emerald-400 border-green-500';
    } else if (isSelected) {
      bgClass = 'bg-gradient-to-br from-red-200 to-red-300 border-red-400';
    }
  }

  // Hiển thị emoji theo grid, max 5 mỗi hàng, emoji 40-50px
  const renderEmojis = () => {
    const count = opt.count || 1;
    const emoji = opt.image || '⭐';
    const emojis = [];

    for (let i = 0; i < count; i++) {
      emojis.push(
        <motion.span
          key={i}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: i * 0.03 }}
          className="text-3xl sm:text-4xl md:text-5xl inline-block"
        >
          {emoji}
        </motion.span>
      );
    }
    return emojis;
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(opt, index)}
      disabled={showResult}
      className={`${bgClass} p-3 sm:p-4 rounded-2xl sm:rounded-3xl border-4 shadow-lg transition-all
        min-h-[100px] sm:min-h-[120px] w-full relative
        active:shadow-inner disabled:cursor-not-allowed`}
    >
      {/* Hiển thị các emoji theo grid */}
      <div className="flex flex-wrap justify-center items-center gap-1 sm:gap-2" style={{ maxWidth: '180px', margin: '0 auto' }}>
        {renderEmojis()}
      </div>

      {/* Icon đúng/sai */}
      {showResult && isCorrect && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1 shadow-lg"
        >
          <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
        </motion.div>
      )}
      {showResult && isSelected && !isCorrect && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 shadow-lg"
        >
          <XCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
        </motion.div>
      )}
    </motion.button>
  );
};

export default function MathLessonPage() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { completeLesson } = useAuth();
  const { playSound } = useAudio();
  
  const lesson = getMathLesson(lessonId);
  
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
  
  const questions = lesson.questions || [];
  const question = questions[currentQ];
  
  const handleAnswer = (option, index) => {
    if (showResult) return;
    setSelected(index);
    
    // Check answer
    let correct = false;
    if (question.type === 'compare') {
      correct = (index === 0 && question.answer === 'A') || (index === 1 && question.answer === 'B');
    } else if (question.type === 'select') {
      correct = index === question.answer;
    } else {
      correct = option === question.answer;
    }
    
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
          completeLesson('math', lessonId, percentage);
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
        <div className={`bg-gradient-to-br ${lesson.color} p-6 pb-12 rounded-b-[40px]`}>
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => navigate(-1)} className="p-2 bg-white/20 rounded-full">
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <span className="text-white/80">Toán học</span>
          </div>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center text-white">
            <div className="text-7xl mb-3">{lesson.icon}</div>
            <h1 className="text-3xl font-bold">{lesson.title}</h1>
            <p className="text-white/80 mt-1">{lesson.description}</p>
          </motion.div>
        </div>
        
        <div className="p-4 -mt-6">
          {/* Intro card */}
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white rounded-3xl p-6 shadow-xl mb-4">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">{lesson.intro.title}</h2>
            <p className="text-center text-gray-500 mb-4">{lesson.intro.subtitle}</p>
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="flex justify-center py-4">
              <ImageDisplay emoji={lesson.intro.image} count={lesson.intro.imageCount} size="xlarge" />
            </motion.div>
          </motion.div>
          
          {/* Examples */}
          {lesson.examples?.length > 0 && (
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="mb-4">
              <h3 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" /> Ví dụ
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {lesson.examples.slice(0, 4).map((ex, i) => (
                  <div key={i} className="bg-white rounded-xl p-3 text-center shadow">
                    <div className="text-2xl mb-1">{Array(Math.min(ex.count, 5)).fill(ex.image).join('')}</div>
                    <p className="text-xs text-gray-600">{ex.text}</p>
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
    const nextLesson = getNextMathLesson(lessonId);

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
          <p className="text-lg font-bold text-indigo-600 mb-4">{lesson.title}</p>

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
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-4 mb-6 text-white">
            <p className="text-5xl font-bold">{score}/{questions.length}</p>
            <p className="text-white/80">Câu trả lời đúng</p>
            {passed && lesson.reward && (
              <p className="mt-2 text-amber-300 font-medium">+{lesson.reward.xp} XP</p>
            )}
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            {/* Nút học bài tiếp theo - chỉ hiện khi có bài tiếp */}
            {nextLesson && passed && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={() => navigate(`/math/${nextLesson.id}`)}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl font-bold text-white flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
              >
                <ChevronRight className="w-5 h-5" /> Học bài tiếp theo
              </motion.button>
            )}

            <div className="flex gap-3">
              <button onClick={restart} className="flex-1 py-4 bg-gray-100 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
                <RotateCcw className="w-5 h-5" /> Học lại
              </button>
              <button onClick={() => navigate('/learn/lessons')} className="flex-1 py-4 bg-indigo-100 text-indigo-700 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-200 transition-colors">
                <List className="w-5 h-5" /> Danh sách
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }
  
  // ==================== LEARNING SCREEN ====================
  // Lấy emoji minh họa từ câu hỏi
  const getQuestionEmoji = () => {
    if (question.image) return question.image;
    if (question.visual?.emoji) return question.visual.emoji;
    if (question.visual?.left) return question.visual.left;
    // Mặc định theo loại bài
    if (question.question?.includes('kẹo')) return '🍬';
    if (question.question?.includes('táo')) return '🍎';
    if (question.question?.includes('bánh')) return '🍰';
    if (question.question?.includes('chim')) return '🐦';
    if (question.question?.includes('hoa')) return '🌸';
    if (question.question?.includes('bút')) return '✏️';
    if (question.question?.includes('sách')) return '📚';
    return '🔢';
  };

  // Lấy số lượng để hiển thị
  const getDisplayCount = () => {
    if (question.imageCount) return question.imageCount;
    if (question.visual?.startCount) return question.visual.startCount;
    if (question.visual?.leftCount) return question.visual.leftCount + (question.visual.rightCount || 0);
    return 5;
  };

  // Kiểm tra đáp án đúng
  const checkCorrect = (opt, idx) => {
    if (question.type === 'select') return idx === question.answer;
    return opt === question.answer;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-indigo-50 to-purple-100">
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
            {/* Question Card */}
            <div className="bg-white rounded-3xl sm:rounded-[2rem] p-4 sm:p-6 md:p-8 shadow-xl border-4 border-white/50">

              {/* HÌNH MINH HỌA LỚN - 200-300px */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', bounce: 0.4 }}
                className="flex justify-center py-4 sm:py-6"
              >
                <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 rounded-3xl p-6 sm:p-8 shadow-inner min-w-[200px]">
                  {/* Đếm số */}
                  {question.type === 'count' && (
                    <ImageDisplay
                      emoji={question.image}
                      count={question.imageCount}
                      size={question.imageCount > 6 ? 'medium' : 'large'}
                    />
                  )}

                  {/* Phép cộng */}
                  {question.type === 'addition' && question.visual && (
                    <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
                      <div className="bg-blue-100 rounded-2xl p-3 sm:p-4">
                        <ImageDisplay emoji={question.visual.left} count={question.visual.leftCount} size="medium" />
                      </div>
                      <span className="text-4xl sm:text-5xl font-bold text-indigo-500 drop-shadow">+</span>
                      <div className="bg-green-100 rounded-2xl p-3 sm:p-4">
                        <ImageDisplay emoji={question.visual.right} count={question.visual.rightCount} size="medium" />
                      </div>
                    </div>
                  )}

                  {/* Phép trừ - với animation gạch chéo */}
                  {question.type === 'subtraction' && question.visual && (
                    <div className="space-y-4">
                      {/* Hiển thị tất cả, với phần bị trừ bị gạch */}
                      <ImageDisplay
                        emoji={question.visual.emoji}
                        count={question.visual.startCount}
                        size={question.visual.startCount > 6 ? 'small' : 'medium'}
                        crossedOut={question.visual.removeCount}
                      />
                      <p className="text-center text-gray-500 text-sm">
                        {question.visual.startCount} − {question.visual.removeCount} = ?
                      </p>
                    </div>
                  )}

                  {/* Bài toán có lời văn - CHỈ HÌNH, KHÔNG CÂU HỎI Ở ĐÂY */}
                  {question.type === 'word_problem' && (
                    <div className="text-center">
                      <ImageDisplay emoji={getQuestionEmoji()} count={Math.min(getDisplayCount(), 10)} size="large" />
                    </div>
                  )}

                  {/* So sánh */}
                  {question.type === 'compare' && (
                    <div className="grid grid-cols-2 gap-4">
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
                        <ImageDisplay emoji={question.optionA?.image} count={question.optionA?.count || 1} size="medium" />
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
                        <ImageDisplay emoji={question.optionB?.image} count={question.optionB?.count || 1} size="medium" />
                      </motion.button>
                    </div>
                  )}

                  {/* Mặc định: hiển thị emoji */}
                  {!['count', 'addition', 'subtraction', 'word_problem', 'compare'].includes(question.type) && (
                    <ImageDisplay emoji={getQuestionEmoji()} count={1} size="hero" />
                  )}
                </div>
              </motion.div>

              {/* CÂU HỎI - CHỈ HIỂN THỊ 1 LẦN */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 sm:p-5 border-2 border-indigo-100"
              >
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 text-center leading-relaxed">
                  {question.question}
                </p>
              </motion.div>

              {/* Hint khi trả lời sai */}
              {showResult && selected !== null && !checkCorrect(question.options?.[selected], selected) && question.hint && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-4 border-2 border-amber-200"
                >
                  <p className="text-center text-amber-700 font-medium flex items-center justify-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    {question.hint}
                  </p>
                </motion.div>
              )}

              {/* Hiển thị khi trả lời đúng */}
              {showResult && selected !== null && checkCorrect(question.options?.[selected], selected) && (
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
            {question.type !== 'compare' && question.options && (
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className={`grid gap-3 sm:gap-4 ${
                  question.type === 'select' ? 'grid-cols-2' :
                  question.options.length === 2 ? 'grid-cols-2' :
                  question.options.length === 3 ? 'grid-cols-3' :
                  'grid-cols-2'
                }`}
              >
                {question.options.map((opt, i) => {
                  const correct = checkCorrect(opt, i);

                  // Nếu là select type -> hiển thị hình ảnh
                  if (question.type === 'select') {
                    return (
                      <SelectImageButton
                        key={i}
                        opt={opt}
                        index={i}
                        selected={selected}
                        showResult={showResult}
                        isCorrect={correct}
                        onSelect={handleAnswer}
                      />
                    );
                  }

                  // Các loại khác -> hiển thị text
                  return (
                    <AnswerButton
                      key={i}
                      option={opt}
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
