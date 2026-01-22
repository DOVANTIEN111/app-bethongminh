// src/pages/VietnameseLessonPage.jsx
// Trang bài học Tiếng Việt - Thiết kế đẹp cho trẻ em
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useAudio } from '../contexts/AudioContext';
import { getVietnameseLesson } from '../data/vietnameseLessons';
import { ArrowLeft, Home, Star, Heart, CheckCircle, XCircle, Sparkles, Trophy, ChevronRight, RotateCcw, Lightbulb } from 'lucide-react';

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

// Image display with animation
const ImageDisplay = ({ emoji, count = 1, size = 'large' }) => {
  // Đảm bảo count là số hợp lệ
  const validCount = Math.max(1, Math.min(count || 1, 20));
  const sizeClass = { small: 'text-2xl', medium: 'text-4xl', large: 'text-5xl', xlarge: 'text-6xl' }[size];
  const gridClass = validCount <= 3 ? 'flex gap-2 justify-center' : validCount <= 6 ? 'grid grid-cols-3 gap-2' : 'grid grid-cols-5 gap-1';
  
  return (
    <div className={gridClass}>
      {Array(validCount).fill(null).map((_, i) => (
        <motion.span
          key={i}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: i * 0.08, type: 'spring' }}
          className={`${sizeClass} inline-block`}
        >
          {emoji}
        </motion.span>
      ))}
    </div>
  );
};

// Answer button component
const AnswerButton = ({ option, index, selected, showResult, isCorrect, onSelect, large }) => {
  const isSelected = selected === index;
  let bgClass = 'bg-white hover:bg-gray-50';
  
  if (showResult) {
    if (isCorrect) bgClass = 'bg-green-500 text-white';
    else if (isSelected) bgClass = 'bg-red-500 text-white';
  }
  
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={() => onSelect(option, index)}
      disabled={showResult}
      className={`${bgClass} ${large ? 'py-6 text-3xl' : 'py-4 text-2xl'} rounded-2xl font-bold shadow-lg transition-all border-4 ${
        showResult && isCorrect ? 'border-green-300' : showResult && isSelected ? 'border-red-300' : 'border-transparent'
      }`}
    >
      <div className="flex items-center justify-center gap-2">
        {showResult && isCorrect && <CheckCircle className="w-6 h-6" />}
        {showResult && isSelected && !isCorrect && <XCircle className="w-6 h-6" />}
        {option}
      </div>
    </motion.button>
  );
};

export default function VietnameseLessonPage() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { completeLesson } = useAuth();
  const { playSound } = useAudio();
  
  const lesson = getVietnameseLesson(lessonId);
  
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
        <div className={`bg-gradient-to-br ${lesson.color} p-6 pb-12 rounded-b-[40px]`}>
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => navigate(-1)} className="p-2 bg-white/20 rounded-full">
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <span className="text-white/80">Tiếng Việt</span>
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
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-4 mb-6 text-white">
            <p className="text-5xl font-bold">{score}/{questions.length}</p>
            <p className="text-white/80">Câu trả lời đúng</p>
            {passed && lesson.reward && (
              <p className="mt-2 text-amber-300 font-medium">+{lesson.reward.xp} XP</p>
            )}
          </div>
          
          {/* Buttons */}
          <div className="flex gap-3">
            <button onClick={restart} className="flex-1 py-4 bg-gray-100 rounded-xl font-bold flex items-center justify-center gap-2">
              <RotateCcw className="w-5 h-5" /> Học lại
            </button>
            <button onClick={() => navigate('/subject/vietnamese')} className={`flex-1 py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 ${passed ? 'bg-green-500' : 'bg-indigo-500'}`}>
              <Home className="w-5 h-5" /> Tiếp tục
            </button>
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50">
      {/* Header */}
      <div className={`bg-gradient-to-r ${lesson.color} p-4`}>
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
            <div className="bg-white rounded-3xl p-6 shadow-xl mb-6">
              <p className="text-xl font-bold text-gray-800 text-center mb-6">{question.question}</p>
              
              {/* Visual based on question type */}
              {question.type === 'count' && question.image && (
                <div className="flex justify-center py-4">
                  <ImageDisplay emoji={question.image} count={question.imageCount || 1} size={(question.imageCount || 1) > 6 ? 'medium' : 'large'} />
                </div>
              )}
              
              {/* Tiếng Việt: identify, spell, read, match_word, sound - hiển thị visual nếu có */}
              {(question.type === 'identify' || question.type === 'spell' || question.type === 'read' || question.type === 'match_word' || question.type === 'sound' || question.type === 'sequence') && question.visual && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-4">
                  <div className="flex flex-wrap justify-center gap-2">
                    {question.visual.options?.map((opt, i) => (
                      <span key={i} className="text-lg bg-white px-3 py-1 rounded-lg shadow-sm">{opt}</span>
                    ))}
                  </div>
                </div>
              )}
              
              {question.type === 'addition' && question.visual && (
                <div className="flex items-center justify-center gap-3 flex-wrap py-4">
                  <div className="bg-blue-50 rounded-xl p-3">
                    <ImageDisplay emoji={question.visual.left} count={question.visual.leftCount} size="medium" />
                  </div>
                  <span className="text-4xl font-bold text-indigo-500">+</span>
                  <div className="bg-green-50 rounded-xl p-3">
                    <ImageDisplay emoji={question.visual.right} count={question.visual.rightCount} size="medium" />
                  </div>
                </div>
              )}
              
              {question.type === 'subtraction' && question.visual && (
                <div className="flex items-center justify-center gap-3 flex-wrap py-4">
                  <div className="bg-blue-50 rounded-xl p-3 relative">
                    <ImageDisplay emoji={question.visual.emoji} count={question.visual.startCount} size={question.visual.startCount > 6 ? 'small' : 'medium'} />
                  </div>
                  <span className="text-4xl font-bold text-red-500">−</span>
                  <div className="bg-red-50 rounded-xl p-3 opacity-50">
                    <ImageDisplay emoji={question.visual.emoji} count={question.visual.removeCount} size={question.visual.removeCount > 6 ? 'small' : 'medium'} />
                  </div>
                </div>
              )}
              
              {question.type === 'word_problem' && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 text-center">
                  <p className="text-lg text-gray-700 leading-relaxed">{question.question}</p>
                </div>
              )}
              
              {question.type === 'compare' && (
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAnswer('A', 0)}
                    disabled={showResult}
                    className={`p-4 rounded-2xl border-4 ${
                      showResult && question.answer === 'A' ? 'border-green-500 bg-green-50' :
                      showResult && selected === 0 ? 'border-red-500 bg-red-50' :
                      'border-blue-200 bg-blue-50'
                    }`}
                  >
                    <p className="text-sm font-bold text-gray-500 mb-2">A</p>
                    <ImageDisplay emoji={question.optionA.image} count={question.optionA.count} size="medium" />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAnswer('B', 1)}
                    disabled={showResult}
                    className={`p-4 rounded-2xl border-4 ${
                      showResult && question.answer === 'B' ? 'border-green-500 bg-green-50' :
                      showResult && selected === 1 ? 'border-red-500 bg-red-50' :
                      'border-orange-200 bg-orange-50'
                    }`}
                  >
                    <p className="text-sm font-bold text-gray-500 mb-2">B</p>
                    <ImageDisplay emoji={question.optionB.image} count={question.optionB.count} size="medium" />
                  </motion.button>
                </div>
              )}
              
              {question.hint && showResult && selected !== null && question.answer !== question.options?.[selected] && (
                <p className="text-center text-amber-600 text-sm mt-2">💡 {question.hint}</p>
              )}
            </div>
            
            {/* Answer options (for non-compare types) */}
            {question.type !== 'compare' && question.options && question.options.length > 0 && (
              <div className={`grid gap-3 ${
                question.options.length === 2 ? 'grid-cols-2' : 
                question.options.length === 3 ? 'grid-cols-3' : 
                'grid-cols-2'  /* 4 options = 2x2 grid */
              }`}>
                {question.options.map((opt, i) => {
                  let correct = false;
                  if (question.type === 'select') {
                    correct = i === question.answer;
                  } else {
                    correct = opt === question.answer;
                  }
                  
                  // Hiển thị option text
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
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        
        {/* Score display */}
        <div className="mt-6 flex justify-center">
          <div className="bg-white rounded-full px-6 py-2 shadow flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500" />
            <span className="font-bold text-gray-700">{score} điểm</span>
          </div>
        </div>
      </div>
    </div>
  );
}
