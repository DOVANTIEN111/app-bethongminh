// src/components/games/MatchingGame.jsx
// Game nối hình cho trẻ em

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

// Các cặp nối
const MATCHING_PAIRS = [
  // Số và hình
  { left: '1', right: '🍎', leftType: 'number', rightType: 'image', hint: 'Một quả táo' },
  { left: '2', right: '🍎🍎', leftType: 'number', rightType: 'image', hint: 'Hai quả táo' },
  { left: '3', right: '⭐⭐⭐', leftType: 'number', rightType: 'image', hint: 'Ba ngôi sao' },
  { left: '4', right: '🌸🌸🌸🌸', leftType: 'number', rightType: 'image', hint: 'Bốn bông hoa' },
  { left: '5', right: '🐱🐱🐱🐱🐱', leftType: 'number', rightType: 'image', hint: 'Năm con mèo' },

  // Chữ và hình
  { left: 'MÈO', right: '🐱', leftType: 'word', rightType: 'image', hint: 'Con mèo' },
  { left: 'CHÓ', right: '🐶', leftType: 'word', rightType: 'image', hint: 'Con chó' },
  { left: 'CÁ', right: '🐟', leftType: 'word', rightType: 'image', hint: 'Con cá' },
  { left: 'HOA', right: '🌸', leftType: 'word', rightType: 'image', hint: 'Bông hoa' },
  { left: 'SAO', right: '⭐', leftType: 'word', rightType: 'image', hint: 'Ngôi sao' },
  { left: 'TRĂNG', right: '🌙', leftType: 'word', rightType: 'image', hint: 'Mặt trăng' },
  { left: 'MƯA', right: '🌧️', leftType: 'word', rightType: 'image', hint: 'Trời mưa' },

  // Màu sắc
  { left: 'ĐỎ', right: '🔴', leftType: 'color', rightType: 'image', hint: 'Màu đỏ' },
  { left: 'XANH', right: '🔵', leftType: 'color', rightType: 'image', hint: 'Màu xanh' },
  { left: 'VÀNG', right: '🟡', leftType: 'color', rightType: 'image', hint: 'Màu vàng' },
  { left: 'CAM', right: '🟠', leftType: 'color', rightType: 'image', hint: 'Màu cam' },

  // Phép tính
  { left: '1+1', right: '2', leftType: 'math', rightType: 'number', hint: 'Một cộng một' },
  { left: '2+1', right: '3', leftType: 'math', rightType: 'number', hint: 'Hai cộng một' },
  { left: '3-1', right: '2', leftType: 'math', rightType: 'number', hint: 'Ba trừ một' },
  { left: '4-2', right: '2', leftType: 'math', rightType: 'number', hint: 'Bốn trừ hai' },
];

const MatchingGame = ({ onComplete, onExit }) => {
  const [pairs, setPairs] = useState([]);
  const [leftItems, setLeftItems] = useState([]);
  const [rightItems, setRightItems] = useState([]);
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [round, setRound] = useState(1);
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [totalMatches, setTotalMatches] = useState(0);

  // Tạo round mới
  const startNewRound = useCallback(() => {
    const numPairs = Math.min(3 + round, 6);
    const shuffledPairs = [...MATCHING_PAIRS].sort(() => Math.random() - 0.5).slice(0, numPairs);

    setPairs(shuffledPairs);
    setLeftItems(shuffledPairs.map((p, i) => ({ ...p, id: `l-${i}`, side: 'left', value: p.left })));
    setRightItems([...shuffledPairs].sort(() => Math.random() - 0.5).map((p, i) => ({ ...p, id: `r-${i}`, side: 'right', value: p.right })));
    setMatchedPairs([]);
    setSelectedLeft(null);
    setSelectedRight(null);
  }, [round]);

  useEffect(() => {
    startNewRound();
  }, []);

  // Xử lý chọn item
  const handleSelect = (item, side) => {
    if (matchedPairs.includes(item.left)) return;

    if (side === 'left') {
      setSelectedLeft(item);

      // Nếu đã chọn bên phải, kiểm tra match
      if (selectedRight) {
        checkMatch(item, selectedRight);
      }
    } else {
      setSelectedRight(item);

      // Nếu đã chọn bên trái, kiểm tra match
      if (selectedLeft) {
        checkMatch(selectedLeft, item);
      }
    }
  };

  // Kiểm tra match
  const checkMatch = (left, right) => {
    const isMatch = left.left === right.left;

    setShowResult(true);
    setLastResult({ isMatch, pair: left });

    if (isMatch) {
      setMatchedPairs(prev => [...prev, left.left]);
      setScore(prev => prev + 20);
      setTotalMatches(prev => prev + 1);

      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 }
      });

      // Kiểm tra hoàn thành round
      if (matchedPairs.length + 1 === pairs.length) {
        setTimeout(() => {
          setRound(prev => prev + 1);
          startNewRound();
        }, 1500);
      }
    } else {
      setLives(prev => prev - 1);

      if (lives <= 1) {
        setGameOver(true);
        if (onComplete) {
          onComplete({ score, round, totalMatches });
        }
      }
    }

    setTimeout(() => {
      setSelectedLeft(null);
      setSelectedRight(null);
      setShowResult(false);
    }, 1000);
  };

  // Render game over
  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-400 via-pink-400 to-purple-400 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 shadow-2xl text-center max-w-md w-full"
        >
          <div className="text-6xl mb-4">🎯</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Hết lượt!</h2>

          <div className="bg-gradient-to-r from-orange-100 to-pink-100 rounded-2xl p-6 mb-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-orange-600">{score}</div>
                <div className="text-sm text-gray-600">Điểm số</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-pink-600">{totalMatches}</div>
                <div className="text-sm text-gray-600">Cặp nối đúng</div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => {
                setRound(1);
                setScore(0);
                setLives(3);
                setTotalMatches(0);
                setGameOver(false);
                startNewRound();
              }}
              className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold py-3 px-6 rounded-xl"
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-400 via-pink-400 to-purple-400 p-4">
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
            <span className="font-bold text-orange-600">{score} điểm</span>
          </div>
          <div className="bg-yellow-400 rounded-full px-4 py-2 shadow-lg">
            <span className="font-bold text-yellow-900">Vòng {round}</span>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white/30 rounded-full h-3 mb-4">
          <div
            className="bg-white rounded-full h-3 transition-all"
            style={{ width: `${(matchedPairs.length / pairs.length) * 100}%` }}
          />
        </div>

        {/* Instruction */}
        <p className="text-center text-white font-medium mb-4">
          Nối cặp giống nhau
        </p>

        {/* Game area */}
        <div className="bg-white rounded-3xl p-4 shadow-2xl">
          <div className="grid grid-cols-2 gap-4">
            {/* Left column */}
            <div className="space-y-3">
              {leftItems.map((item) => {
                const isMatched = matchedPairs.includes(item.left);
                const isSelected = selectedLeft?.id === item.id;

                return (
                  <motion.button
                    key={item.id}
                    onClick={() => !isMatched && handleSelect(item, 'left')}
                    disabled={isMatched}
                    className={`w-full py-4 px-3 rounded-xl text-xl font-bold transition-all
                      ${isMatched
                        ? 'bg-green-100 border-2 border-green-400 text-green-600'
                        : isSelected
                          ? 'bg-blue-200 border-2 border-blue-500 text-blue-700'
                          : 'bg-gradient-to-r from-blue-100 to-indigo-100 border-2 border-transparent hover:border-blue-300'
                      }`}
                    whileHover={!isMatched ? { scale: 1.05 } : {}}
                    whileTap={!isMatched ? { scale: 0.95 } : {}}
                  >
                    {item.value}
                    {isMatched && <span className="ml-2">✓</span>}
                  </motion.button>
                );
              })}
            </div>

            {/* Right column */}
            <div className="space-y-3">
              {rightItems.map((item) => {
                const isMatched = matchedPairs.includes(item.left);
                const isSelected = selectedRight?.id === item.id;

                return (
                  <motion.button
                    key={item.id}
                    onClick={() => !isMatched && handleSelect(item, 'right')}
                    disabled={isMatched}
                    className={`w-full py-4 px-3 rounded-xl text-xl font-bold transition-all
                      ${isMatched
                        ? 'bg-green-100 border-2 border-green-400 text-green-600'
                        : isSelected
                          ? 'bg-pink-200 border-2 border-pink-500 text-pink-700'
                          : 'bg-gradient-to-r from-pink-100 to-rose-100 border-2 border-transparent hover:border-pink-300'
                      }`}
                    whileHover={!isMatched ? { scale: 1.05 } : {}}
                    whileTap={!isMatched ? { scale: 0.95 } : {}}
                  >
                    {item.value}
                    {isMatched && <span className="ml-2">✓</span>}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Result feedback */}
          <AnimatePresence>
            {showResult && lastResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`mt-4 text-center p-3 rounded-xl ${
                  lastResult.isMatch
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                <span className="text-2xl mr-2">{lastResult.isMatch ? '🎉' : '❌'}</span>
                <span className="font-bold">
                  {lastResult.isMatch ? 'Đúng rồi!' : 'Thử lại nhé!'}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

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

export default MatchingGame;
