// src/components/games/CountingGame.jsx
// Game đếm số cho trẻ em

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

// Danh sách emoji cho game
const GAME_ITEMS = [
  { emoji: '🍎', name: 'táo' },
  { emoji: '🍊', name: 'cam' },
  { emoji: '🍌', name: 'chuối' },
  { emoji: '🍇', name: 'nho' },
  { emoji: '🍓', name: 'dâu' },
  { emoji: '⭐', name: 'sao' },
  { emoji: '🌸', name: 'hoa' },
  { emoji: '🐱', name: 'mèo' },
  { emoji: '🐶', name: 'chó' },
  { emoji: '🐰', name: 'thỏ' },
  { emoji: '🦋', name: 'bướm' },
  { emoji: '🐦', name: 'chim' },
];

// Tạo câu hỏi ngẫu nhiên
const generateQuestion = (level) => {
  const maxNumber = Math.min(3 + level * 2, 10);
  const correctAnswer = Math.floor(Math.random() * maxNumber) + 1;
  const item = GAME_ITEMS[Math.floor(Math.random() * GAME_ITEMS.length)];

  // Tạo các lựa chọn sai
  const options = [correctAnswer];
  while (options.length < 4) {
    const wrong = Math.floor(Math.random() * maxNumber) + 1;
    if (!options.includes(wrong)) {
      options.push(wrong);
    }
  }

  // Xáo trộn
  options.sort(() => Math.random() - 0.5);

  return {
    emoji: item.emoji,
    name: item.name,
    count: correctAnswer,
    options,
    correctAnswer,
  };
};

const CountingGame = ({ onComplete, onExit }) => {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [streak, setStreak] = useState(0);

  // Tạo câu hỏi mới
  const newQuestion = useCallback(() => {
    setQuestion(generateQuestion(level));
    setSelectedAnswer(null);
    setShowResult(false);
  }, [level]);

  useEffect(() => {
    newQuestion();
  }, []);

  // Xử lý khi chọn đáp án
  const handleAnswer = (answer) => {
    if (showResult) return;

    setSelectedAnswer(answer);
    const correct = answer === question.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      // Đúng
      const points = 10 + streak * 5;
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);

      // Confetti cho streak
      if (streak >= 2) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      }
    } else {
      // Sai
      setLives(prev => prev - 1);
      setStreak(0);

      if (lives <= 1) {
        setGameOver(true);
        if (onComplete) {
          onComplete({ score, level, questionsAnswered });
        }
      }
    }

    setQuestionsAnswered(prev => prev + 1);

    // Chuyển câu sau 1.5s
    setTimeout(() => {
      if (lives > 1 || correct) {
        // Tăng level sau mỗi 5 câu đúng liên tiếp
        if (correct && (questionsAnswered + 1) % 5 === 0 && level < 5) {
          setLevel(prev => prev + 1);
        }
        newQuestion();
      }
    }, 1500);
  };

  // Render game over
  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-400 via-pink-400 to-red-400 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 shadow-2xl text-center max-w-md w-full"
        >
          <div className="text-6xl mb-4">🎮</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Hết lượt!</h2>
          <p className="text-gray-600 mb-6">Cố gắng lần sau nhé!</p>

          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 mb-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-purple-600">{score}</div>
                <div className="text-sm text-gray-600">Điểm số</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-pink-600">{questionsAnswered}</div>
                <div className="text-sm text-gray-600">Câu trả lời</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-indigo-600">Cấp {level}</div>
                <div className="text-sm text-gray-600">Đạt được</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-rose-600">{streak}</div>
                <div className="text-sm text-gray-600">Streak cao nhất</div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => {
                setLevel(1);
                setScore(0);
                setLives(3);
                setQuestionsAnswered(0);
                setStreak(0);
                setGameOver(false);
                newQuestion();
              }}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Chơi lại
            </button>
            <button
              onClick={onExit}
              className="flex-1 bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-xl hover:bg-gray-300 transition-all"
            >
              Thoát
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!question) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 via-purple-400 to-pink-400 p-4">
      {/* Header */}
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-4">
          {/* Lives */}
          <div className="flex gap-1">
            {[1, 2, 3].map((i) => (
              <motion.span
                key={i}
                animate={i > lives ? { scale: 0.8, opacity: 0.3 } : {}}
                className="text-3xl"
              >
                {i <= lives ? '❤️' : '🖤'}
              </motion.span>
            ))}
          </div>

          {/* Score */}
          <div className="bg-white/90 rounded-full px-4 py-2 shadow-lg">
            <span className="font-bold text-purple-600">{score} điểm</span>
          </div>

          {/* Level */}
          <div className="bg-yellow-400 rounded-full px-4 py-2 shadow-lg">
            <span className="font-bold text-yellow-900">Cấp {level}</span>
          </div>
        </div>

        {/* Streak indicator */}
        {streak >= 2 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-center mb-4"
          >
            <span className="bg-orange-400 text-white font-bold px-4 py-1 rounded-full text-sm">
              🔥 {streak} combo!
            </span>
          </motion.div>
        )}

        {/* Question Card */}
        <motion.div
          key={questionsAnswered}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-6 shadow-2xl"
        >
          {/* Question */}
          <h2 className="text-xl font-bold text-center text-gray-800 mb-6">
            Có mấy {question.name}?
          </h2>

          {/* Emoji display */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 mb-6 min-h-[160px] flex items-center justify-center">
            <div className="flex flex-wrap justify-center gap-3">
              {Array(question.count).fill(null).map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-5xl sm:text-6xl drop-shadow-lg"
                >
                  {question.emoji}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-3">
            {question.options.map((option, index) => {
              let buttonClass = 'bg-gradient-to-r from-indigo-100 to-purple-100 hover:from-indigo-200 hover:to-purple-200 border-2 border-transparent';

              if (showResult) {
                if (option === question.correctAnswer) {
                  buttonClass = 'bg-gradient-to-r from-green-400 to-emerald-400 border-2 border-green-500 text-white';
                } else if (option === selectedAnswer && !isCorrect) {
                  buttonClass = 'bg-gradient-to-r from-red-400 to-rose-400 border-2 border-red-500 text-white';
                }
              } else if (selectedAnswer === option) {
                buttonClass = 'bg-gradient-to-r from-indigo-300 to-purple-300 border-2 border-indigo-400';
              }

              return (
                <motion.button
                  key={index}
                  whileHover={{ scale: showResult ? 1 : 1.05 }}
                  whileTap={{ scale: showResult ? 1 : 0.95 }}
                  onClick={() => handleAnswer(option)}
                  disabled={showResult}
                  className={`${buttonClass} text-3xl font-bold py-5 rounded-2xl shadow-lg transition-all`}
                >
                  {option}
                </motion.button>
              );
            })}
          </div>

          {/* Result feedback */}
          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`mt-4 text-center p-3 rounded-xl ${
                  isCorrect
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                <span className="text-2xl mr-2">{isCorrect ? '🎉' : '😢'}</span>
                <span className="font-bold">
                  {isCorrect ? 'Đúng rồi! Giỏi quá!' : `Đáp án đúng là ${question.correctAnswer}`}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Exit button */}
        <button
          onClick={onExit}
          className="mt-4 w-full bg-white/30 text-white font-bold py-3 rounded-xl hover:bg-white/40 transition-all"
        >
          Thoát game
        </button>
      </div>
    </div>
  );
};

export default CountingGame;
