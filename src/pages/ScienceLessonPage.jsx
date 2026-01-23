// src/pages/ScienceLessonPage.jsx
// Trang bài học Khoa học - Thiết kế cho trẻ em
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useAudio } from '../contexts/AudioContext';
import { getScienceLesson } from '../data/scienceLessons';
import { ArrowLeft, Home, Star, Heart, CheckCircle, XCircle, Sparkles, RotateCcw, Lightbulb, ChevronRight } from 'lucide-react';

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

// Level color mapping
const getLevelColor = (level) => {
  const colors = {
    1: 'from-green-500 to-emerald-500',
    2: 'from-blue-500 to-cyan-500',
    3: 'from-purple-500 to-pink-500',
    4: 'from-orange-500 to-amber-500',
    5: 'from-red-500 to-rose-500',
  };
  return colors[level] || 'from-purple-500 to-pink-500';
};

export default function ScienceLessonPage() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { completeLesson } = useAuth();
  const { playSound } = useAudio();

  const lesson = getScienceLesson(lessonId);

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
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-purple-100 to-pink-100">
        <div className="text-8xl mb-4">🔬</div>
        <p className="text-xl text-gray-600 mb-4">Bài học chưa sẵn sàng</p>
        <button onClick={() => navigate(-1)} className="px-6 py-3 bg-purple-500 text-white rounded-xl font-bold">
          Quay lại
        </button>
      </div>
    );
  }

  const questions = lesson.questions || [];
  const question = questions[currentQ];
  const color = getLevelColor(lesson.level);

  const handleAnswer = (index) => {
    if (showResult) return;
    setSelected(index);

    const correct = index === question.answer;
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
          completeLesson('science', lessonId, percentage);
        }
      }
    }, 2000);
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
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
        {/* Header */}
        <div className={`bg-gradient-to-br ${color} p-6 pb-12 rounded-b-[40px]`}>
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => navigate(-1)} className="p-2 bg-white/20 rounded-full">
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <span className="text-white/80">Khoa học - Cấp độ {lesson.level}</span>
          </div>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center text-white">
            <div className="text-7xl mb-3">{lesson.icon}</div>
            <h1 className="text-3xl font-bold">{lesson.title}</h1>
            <p className="text-white/80 mt-1">{questions.length} câu hỏi</p>
          </motion.div>
        </div>

        <div className="p-4 -mt-6">
          {/* Preview questions */}
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white rounded-3xl p-6 shadow-xl mb-4">
            <h2 className="text-lg font-bold text-center text-gray-800 mb-4 flex items-center justify-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              Bạn sẽ học về
            </h2>
            <div className="space-y-2">
              {questions.slice(0, 3).map((q, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <span className="text-2xl">{q.image}</span>
                  <span className="text-sm text-gray-600 line-clamp-1">{q.question}</span>
                </div>
              ))}
              {questions.length > 3 && (
                <p className="text-center text-gray-400 text-sm">...và {questions.length - 3} câu hỏi khác</p>
              )}
            </div>
          </motion.div>

          {/* Start button */}
          <motion.button
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { playSound('click'); setStage('learning'); }}
            className={`w-full py-5 bg-gradient-to-r ${color} text-white rounded-2xl font-bold text-xl shadow-lg flex items-center justify-center gap-2`}
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
          <p className="text-gray-500 mb-4">{lesson.title}</p>

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
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-4 mb-6 text-white">
            <p className="text-5xl font-bold">{score}/{questions.length}</p>
            <p className="text-white/80">Câu trả lời đúng</p>
            {passed && <p className="mt-2 text-amber-300 font-medium">+{10 + lesson.level * 5} XP</p>}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button onClick={restart} className="flex-1 py-4 bg-gray-100 rounded-xl font-bold flex items-center justify-center gap-2">
              <RotateCcw className="w-5 h-5" /> Học lại
            </button>
            <button onClick={() => navigate('/subject/science')} className={`flex-1 py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 ${passed ? 'bg-green-500' : 'bg-purple-500'}`}>
              <Home className="w-5 h-5" /> Tiếp tục
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ==================== LEARNING SCREEN ====================
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
      {/* Header */}
      <div className={`bg-gradient-to-r ${color} p-4`}>
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => navigate(-1)} className="p-2 bg-white/20 rounded-full">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <span className="text-white font-bold">{lesson.title}</span>
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <Heart key={i} className={`w-6 h-6 ${i < lives ? 'text-red-400 fill-red-400' : 'text-white/30'}`} />
            ))}
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white/20 rounded-full h-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
            className="bg-white rounded-full h-3"
          />
        </div>
        <p className="text-center text-white/80 text-sm mt-1">Câu {currentQ + 1}/{questions.length}</p>
      </div>

      {/* Question */}
      <div className="p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
          >
            {/* Question card */}
            <div className="bg-white rounded-3xl p-6 shadow-xl mb-4">
              {/* Image */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-7xl text-center mb-4"
              >
                {question.image}
              </motion.div>

              {/* Question text */}
              <p className="text-xl font-bold text-gray-800 text-center mb-2">{question.question}</p>
            </div>

            {/* Answer options - 2x2 grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {question.options.map((option, index) => {
                const isSelected = selected === index;
                const isCorrect = index === question.answer;
                let bgClass = 'bg-white';
                let borderClass = 'border-2 border-gray-100';

                if (showResult) {
                  if (isCorrect) {
                    bgClass = 'bg-green-500';
                    borderClass = 'border-2 border-green-300';
                  } else if (isSelected) {
                    bgClass = 'bg-red-500';
                    borderClass = 'border-2 border-red-300';
                  }
                }

                return (
                  <motion.button
                    key={index}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAnswer(index)}
                    disabled={showResult}
                    className={`${bgClass} ${borderClass} p-4 rounded-2xl shadow-lg transition-all min-h-[80px] flex items-center justify-center`}
                  >
                    <div className={`flex items-center gap-2 ${showResult && (isCorrect || isSelected) ? 'text-white' : 'text-gray-800'}`}>
                      {showResult && isCorrect && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
                      {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5 flex-shrink-0" />}
                      <span className="font-bold text-center text-sm leading-tight">{option}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {showResult && question.explanation && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`p-4 rounded-2xl ${selected === question.answer ? 'bg-green-50 border-2 border-green-200' : 'bg-orange-50 border-2 border-orange-200'}`}
                >
                  <div className="flex items-start gap-3">
                    <Lightbulb className={`w-6 h-6 flex-shrink-0 ${selected === question.answer ? 'text-green-500' : 'text-orange-500'}`} />
                    <p className="text-gray-700">{question.explanation}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
