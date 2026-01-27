// src/components/landing/DemoLesson.jsx
// Component Demo bài học tương tác - Mini game học Toán
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, X, Star, Sparkles, RotateCcw } from 'lucide-react';

const QUESTIONS = [
  {
    id: 1,
    question: 'Đếm xem có bao nhiêu quả táo?',
    image: '🍎🍎🍎',
    options: ['2', '3', '4', '5'],
    answer: 1, // index
    hint: 'Hãy đếm từng quả táo nhé!',
  },
  {
    id: 2,
    question: 'Đây là số mấy?',
    image: '5️⃣',
    options: ['3', '4', '5', '6'],
    answer: 2,
    hint: 'Nhìn kỹ số trong hình!',
  },
  {
    id: 3,
    question: '2 + 1 = ?',
    image: '🔢',
    options: ['2', '3', '4', '1'],
    answer: 1,
    hint: 'Hai cộng một bằng mấy nhỉ?',
  },
];

// Confetti animation
function Confetti() {
  const colors = ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6'];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 10 + 5}px`,
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
            animationDelay: `${Math.random() * 0.5}s`,
            animationDuration: `${Math.random() * 2 + 1}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function DemoLesson() {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const question = QUESTIONS[currentQ];

  const handleAnswer = (index) => {
    if (selectedAnswer !== null) return; // Already answered

    setSelectedAnswer(index);
    const correct = index === question.answer;
    setIsCorrect(correct);

    if (correct) {
      setScore((prev) => prev + 10);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);

      // Move to next question after delay
      setTimeout(() => {
        if (currentQ < QUESTIONS.length - 1) {
          setCurrentQ((prev) => prev + 1);
          setSelectedAnswer(null);
          setIsCorrect(null);
          setShowHint(false);
        } else {
          setIsComplete(true);
        }
      }, 1500);
    } else {
      setShowHint(true);
      // Reset after showing wrong
      setTimeout(() => {
        setSelectedAnswer(null);
        setIsCorrect(null);
      }, 1500);
    }
  };

  const handleRestart = () => {
    setCurrentQ(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowHint(false);
    setIsComplete(false);
  };

  if (isComplete) {
    return (
      <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-8 text-center text-white overflow-hidden">
        <Confetti />
        <div className="relative z-10">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl sm:text-3xl font-bold mb-2">Tuyệt vời!</h3>
          <p className="text-lg text-white/90 mb-4">
            Con bạn vừa học xong 1 bài học mini!
          </p>
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-6 py-3 mb-6">
            <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" />
            <span className="text-2xl font-bold">{score} điểm</span>
          </div>

          <p className="text-white/80 mb-6">
            SchoolHub có <strong>500+ bài học</strong> thú vị như thế này!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-green-600 font-bold text-lg rounded-2xl hover:bg-green-50 transition-all"
            >
              <Sparkles className="w-5 h-5" />
              Đăng ký học thêm 500+ bài
            </Link>
            <button
              onClick={handleRestart}
              className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-white/20 text-white font-semibold rounded-2xl hover:bg-white/30 transition-all"
            >
              <RotateCcw className="w-5 h-5" />
              Chơi lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
      {showConfetti && <Confetti />}

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎮</span>
            <span className="font-bold">Demo: Học Toán vui</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-white/20 rounded-full px-3 py-1">
              <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
              <span className="font-bold">{score}</span>
            </div>
            <div className="text-sm">
              Câu {currentQ + 1}/{QUESTIONS.length}
            </div>
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-yellow-400 transition-all duration-500"
            style={{ width: `${((currentQ + 1) / QUESTIONS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="p-6 sm:p-8">
        {/* Question text */}
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-6">
          {question.question}
        </h3>

        {/* Image/Emoji */}
        <div className="text-6xl sm:text-8xl text-center mb-8 select-none">
          {question.image}
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          {question.options.map((option, index) => {
            let bgClass = 'bg-gray-50 hover:bg-gray-100 border-gray-200';
            let textClass = 'text-gray-900';

            if (selectedAnswer !== null) {
              if (index === question.answer) {
                bgClass = 'bg-green-100 border-green-500';
                textClass = 'text-green-700';
              } else if (index === selectedAnswer && !isCorrect) {
                bgClass = 'bg-red-100 border-red-500 animate-shake';
                textClass = 'text-red-700';
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={selectedAnswer !== null}
                className={`relative p-4 sm:p-6 rounded-2xl border-2 font-bold text-2xl sm:text-3xl transition-all ${bgClass} ${textClass} ${
                  selectedAnswer === null ? 'hover:scale-105 active:scale-95' : ''
                }`}
              >
                {option}
                {selectedAnswer !== null && index === question.answer && (
                  <Check className="absolute top-2 right-2 w-6 h-6 text-green-600" />
                )}
                {selectedAnswer === index && !isCorrect && (
                  <X className="absolute top-2 right-2 w-6 h-6 text-red-600" />
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {isCorrect === true && (
          <div className="mt-6 text-center animate-bounce-in">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-6 py-3 rounded-full font-bold">
              <span className="text-xl">🎉</span>
              Chính xác! +10 điểm
            </div>
          </div>
        )}

        {isCorrect === false && showHint && (
          <div className="mt-6 text-center animate-shake">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-6 py-3 rounded-full font-medium">
              <span className="text-xl">💡</span>
              {question.hint}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes confetti {
          0% { transform: translateY(-100%) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-confetti {
          animation: confetti 3s ease-out forwards;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
        @keyframes bounce-in {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
