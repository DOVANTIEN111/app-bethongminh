// src/components/games/BalloonPopGame.jsx
// Game bắn bóng bay học toán

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

// Màu sắc bóng bay
const BALLOON_COLORS = [
  'from-red-400 to-red-600',
  'from-blue-400 to-blue-600',
  'from-green-400 to-green-600',
  'from-yellow-400 to-yellow-600',
  'from-purple-400 to-purple-600',
  'from-pink-400 to-pink-600',
  'from-orange-400 to-orange-600',
  'from-cyan-400 to-cyan-600',
];

// Tạo câu hỏi
const generateQuestion = (level) => {
  const maxNum = Math.min(5 + level * 2, 20);
  const type = Math.random() > 0.5 ? 'add' : 'sub';

  let num1, num2, answer;

  if (type === 'add') {
    num1 = Math.floor(Math.random() * (maxNum / 2)) + 1;
    num2 = Math.floor(Math.random() * (maxNum / 2)) + 1;
    answer = num1 + num2;
  } else {
    answer = Math.floor(Math.random() * (maxNum / 2)) + 1;
    num2 = Math.floor(Math.random() * answer) + 1;
    num1 = answer + num2;
    answer = num1 - num2;
  }

  // Tạo các đáp án sai
  const wrongAnswers = [];
  while (wrongAnswers.length < 3) {
    const wrong = answer + Math.floor(Math.random() * 5) - 2;
    if (wrong !== answer && wrong > 0 && !wrongAnswers.includes(wrong)) {
      wrongAnswers.push(wrong);
    }
  }

  return {
    num1,
    num2,
    operator: type === 'add' ? '+' : '-',
    answer,
    options: [answer, ...wrongAnswers].sort(() => Math.random() - 0.5)
  };
};

const BalloonPopGame = ({ onComplete, onExit }) => {
  const [question, setQuestion] = useState(null);
  const [balloons, setBalloons] = useState([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [poppedBalloon, setPoppedBalloon] = useState(null);
  const gameAreaRef = useRef(null);

  // Tạo bóng bay mới
  const createBalloons = useCallback((question) => {
    const newBalloons = question.options.map((value, index) => ({
      id: index,
      value,
      color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
      x: 20 + index * 25,
      y: 100,
      delay: index * 0.2
    }));
    setBalloons(newBalloons);
  }, []);

  // Tạo câu hỏi mới
  const newQuestion = useCallback(() => {
    const q = generateQuestion(level);
    setQuestion(q);
    createBalloons(q);
    setShowResult(false);
    setPoppedBalloon(null);
  }, [level, createBalloons]);

  useEffect(() => {
    newQuestion();
  }, []);

  // Xử lý bắn bóng
  const handlePop = (balloon) => {
    if (showResult) return;

    setPoppedBalloon(balloon.id);
    const correct = balloon.value === question.answer;

    setShowResult(true);
    setLastResult({ correct, answer: question.answer });
    setQuestionsAnswered(prev => prev + 1);

    if (correct) {
      setScore(prev => prev + 10 * level);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff']
      });

      // Level up
      if ((questionsAnswered + 1) % 5 === 0 && level < 5) {
        setLevel(prev => prev + 1);
      }
    } else {
      setLives(prev => prev - 1);

      if (lives <= 1) {
        setGameOver(true);
        if (onComplete) {
          onComplete({ score, level, questionsAnswered: questionsAnswered + 1 });
        }
        return;
      }
    }

    setTimeout(() => {
      newQuestion();
    }, 1500);
  };

  // Render game over
  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-400 via-blue-400 to-indigo-400 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 shadow-2xl text-center max-w-md w-full"
        >
          <div className="text-6xl mb-4">🎈</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Hết lượt!</h2>
          <p className="text-gray-600 mb-6">Bé bắn bóng giỏi lắm!</p>

          <div className="bg-gradient-to-r from-sky-100 to-blue-100 rounded-2xl p-6 mb-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-sky-600">{score}</div>
                <div className="text-sm text-gray-600">Điểm số</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">{questionsAnswered}</div>
                <div className="text-sm text-gray-600">Câu trả lời</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-indigo-600">Cấp {level}</div>
                <div className="text-sm text-gray-600">Đạt được</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600">
                  {Math.round((score / (questionsAnswered * 10 * level || 1)) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Chính xác</div>
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
                setGameOver(false);
                newQuestion();
              }}
              className="flex-1 bg-gradient-to-r from-sky-500 to-blue-500 text-white font-bold py-3 px-6 rounded-xl"
            >
              Chơi lại
            </button>
            <button
              onClick={onExit}
              className="flex-1 bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-xl"
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
    <div className="min-h-screen bg-gradient-to-b from-sky-300 via-blue-300 to-indigo-400 p-4 overflow-hidden">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-1">
            {[1, 2, 3].map((i) => (
              <span key={i} className="text-3xl">
                {i <= lives ? '❤️' : '🖤'}
              </span>
            ))}
          </div>
          <div className="bg-white/90 rounded-full px-4 py-2 shadow-lg">
            <span className="font-bold text-blue-600">{score} điểm</span>
          </div>
          <div className="bg-yellow-400 rounded-full px-4 py-2 shadow-lg">
            <span className="font-bold text-yellow-900">Cấp {level}</span>
          </div>
        </div>

        {/* Question */}
        <motion.div
          key={questionsAnswered}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-6 shadow-2xl mb-6"
        >
          <h2 className="text-center text-gray-700 mb-2">Bắn bóng có đáp án đúng!</h2>
          <div className="text-center text-5xl font-bold text-gray-800">
            {question.num1} {question.operator} {question.num2} = ?
          </div>
        </motion.div>

        {/* Balloon area */}
        <div
          ref={gameAreaRef}
          className="relative h-[300px] bg-gradient-to-b from-transparent to-green-200/30 rounded-3xl overflow-hidden"
        >
          {/* Clouds */}
          <div className="absolute top-4 left-4 text-4xl opacity-50">☁️</div>
          <div className="absolute top-8 right-8 text-3xl opacity-50">☁️</div>
          <div className="absolute top-16 left-1/2 text-2xl opacity-30">☁️</div>

          {/* Balloons */}
          <AnimatePresence>
            {balloons.map((balloon) => (
              <motion.button
                key={balloon.id}
                initial={{ y: 300, opacity: 0 }}
                animate={{
                  y: poppedBalloon === balloon.id ? -100 : [0, -20, 0],
                  opacity: poppedBalloon === balloon.id ? 0 : 1,
                  scale: poppedBalloon === balloon.id ? 1.5 : 1
                }}
                transition={{
                  y: poppedBalloon === balloon.id
                    ? { duration: 0.3 }
                    : {
                        delay: balloon.delay,
                        duration: 2,
                        repeat: Infinity,
                        repeatType: 'reverse'
                      }
                }}
                onClick={() => handlePop(balloon)}
                disabled={showResult}
                className={`absolute w-20 h-24 cursor-pointer`}
                style={{ left: `${balloon.x}%`, top: '50%', transform: 'translateX(-50%)' }}
              >
                {/* Balloon body */}
                <div className={`w-full h-20 rounded-full bg-gradient-to-br ${balloon.color} shadow-lg flex items-center justify-center relative`}>
                  {/* Shine */}
                  <div className="absolute top-2 left-3 w-4 h-4 bg-white/40 rounded-full" />

                  {/* Number */}
                  <span className="text-2xl font-bold text-white drop-shadow-lg">
                    {balloon.value}
                  </span>
                </div>

                {/* String */}
                <div className="w-0.5 h-6 bg-gray-400 mx-auto" />

                {/* Knot */}
                <div className="w-2 h-2 bg-gray-400 rounded-full mx-auto -mt-1" />
              </motion.button>
            ))}
          </AnimatePresence>

          {/* Pop effect */}
          {poppedBalloon !== null && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.5, 0] }}
              transition={{ duration: 0.5 }}
              className="absolute text-6xl"
              style={{
                left: `${balloons.find(b => b.id === poppedBalloon)?.x}%`,
                top: '40%',
                transform: 'translate(-50%, -50%)'
              }}
            >
              💥
            </motion.div>
          )}
        </div>

        {/* Result */}
        <AnimatePresence>
          {showResult && lastResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mt-4 text-center p-4 rounded-xl ${
                lastResult.correct
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              <span className="text-3xl mr-2">{lastResult.correct ? '🎉' : '😢'}</span>
              <span className="text-xl font-bold">
                {lastResult.correct
                  ? 'Bắn trúng rồi!'
                  : `Đáp án đúng là ${lastResult.answer}`
                }
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={onExit}
          className="mt-4 w-full bg-white/30 text-white font-bold py-3 rounded-xl"
        >
          Thoát game
        </button>
      </div>
    </div>
  );
};

export default BalloonPopGame;
