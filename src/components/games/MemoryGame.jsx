// src/components/games/MemoryGame.jsx
// Game trí nhớ lật thẻ cho trẻ em

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

// Các emoji cho game
const CARD_EMOJIS = [
  '🍎', '🍊', '🍌', '🍇', '🍓', '🍉',
  '🐱', '🐶', '🐰', '🐻', '🐼', '🐵',
  '⭐', '🌙', '☀️', '🌈', '❤️', '🌸',
  '🚗', '✈️', '🚂', '⛵', '🎈', '🎁'
];

const MemoryGame = ({ onComplete, onExit }) => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bestScore, setBestScore] = useState(0);

  // Tạo bảng game
  const createBoard = useCallback(() => {
    const numPairs = Math.min(4 + level, 8);
    const selectedEmojis = [...CARD_EMOJIS]
      .sort(() => Math.random() - 0.5)
      .slice(0, numPairs);

    const cardPairs = [...selectedEmojis, ...selectedEmojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false
      }));

    setCards(cardPairs);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setTimer(0);
    setIsPlaying(true);
  }, [level]);

  useEffect(() => {
    createBoard();
  }, []);

  // Timer
  useEffect(() => {
    let interval;
    if (isPlaying && !gameOver) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, gameOver]);

  // Xử lý lật thẻ
  const handleCardClick = (card) => {
    if (isChecking || flipped.includes(card.id) || matched.includes(card.emoji)) return;

    const newFlipped = [...flipped, card.id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      setIsChecking(true);

      const [first, second] = newFlipped;
      const firstCard = cards.find(c => c.id === first);
      const secondCard = cards.find(c => c.id === second);

      if (firstCard.emoji === secondCard.emoji) {
        // Match!
        setMatched(prev => [...prev, firstCard.emoji]);
        setScore(prev => prev + 50);
        setFlipped([]);
        setIsChecking(false);

        confetti({
          particleCount: 30,
          spread: 50,
          origin: { y: 0.7 }
        });

        // Check win
        const totalPairs = cards.length / 2;
        if (matched.length + 1 === totalPairs) {
          setIsPlaying(false);

          // Tính điểm bonus
          const timeBonus = Math.max(0, 100 - timer);
          const moveBonus = Math.max(0, 50 - moves) * 2;
          const finalScore = score + 50 + timeBonus + moveBonus + level * 100;
          setScore(finalScore);

          if (finalScore > bestScore) {
            setBestScore(finalScore);
          }

          confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.5 }
          });

          // Tăng level
          setTimeout(() => {
            if (level < 5) {
              setLevel(prev => prev + 1);
            }
            setGameOver(true);
          }, 1500);
        }
      } else {
        // No match
        setTimeout(() => {
          setFlipped([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  };

  // Format timer
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Render game over / win screen
  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-400 via-purple-400 to-pink-400 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 shadow-2xl text-center max-w-md w-full"
        >
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Hoàn thành!</h2>
          <p className="text-gray-600 mb-6">Trí nhớ của bé rất tốt!</p>

          <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl p-6 mb-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-indigo-600">{score}</div>
                <div className="text-sm text-gray-600">Điểm số</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600">{moves}</div>
                <div className="text-sm text-gray-600">Lượt lật</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-pink-600">{formatTime(timer)}</div>
                <div className="text-sm text-gray-600">Thời gian</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-rose-600">Cấp {level}</div>
                <div className="text-sm text-gray-600">Đã đạt</div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => {
                setGameOver(false);
                createBoard();
              }}
              className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold py-3 px-6 rounded-xl"
            >
              Tiếp tục
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

  const gridCols = cards.length <= 8 ? 'grid-cols-4' : cards.length <= 12 ? 'grid-cols-4' : 'grid-cols-4';

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-400 via-purple-400 to-pink-400 p-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="bg-white/90 rounded-full px-4 py-2 shadow-lg">
            <span className="font-bold text-indigo-600">{score} điểm</span>
          </div>
          <div className="bg-white/90 rounded-full px-4 py-2 shadow-lg">
            <span className="font-bold text-purple-600">{formatTime(timer)}</span>
          </div>
          <div className="bg-yellow-400 rounded-full px-4 py-2 shadow-lg">
            <span className="font-bold text-yellow-900">Cấp {level}</span>
          </div>
        </div>

        {/* Moves counter */}
        <div className="text-center mb-4">
          <span className="bg-white/80 rounded-full px-4 py-1 text-gray-700 font-medium">
            Lượt lật: {moves}
          </span>
        </div>

        {/* Game board */}
        <div className="bg-white/20 rounded-3xl p-4 backdrop-blur-sm">
          <div className={`grid ${gridCols} gap-2`}>
            {cards.map((card) => {
              const isFlipped = flipped.includes(card.id) || matched.includes(card.emoji);

              return (
                <motion.div
                  key={card.id}
                  onClick={() => handleCardClick(card)}
                  className="aspect-square cursor-pointer"
                  whileHover={{ scale: isFlipped ? 1 : 1.05 }}
                  whileTap={{ scale: isFlipped ? 1 : 0.95 }}
                >
                  <motion.div
                    className="w-full h-full relative"
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {/* Back */}
                    <div
                      className={`absolute inset-0 rounded-xl flex items-center justify-center text-3xl
                        ${matched.includes(card.emoji)
                          ? 'bg-green-400'
                          : 'bg-gradient-to-br from-blue-500 to-purple-500'
                        } shadow-lg`}
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      {!isFlipped && '❓'}
                    </div>

                    {/* Front */}
                    <div
                      className={`absolute inset-0 rounded-xl flex items-center justify-center text-4xl
                        ${matched.includes(card.emoji)
                          ? 'bg-green-100 border-2 border-green-400'
                          : 'bg-white'
                        } shadow-lg`}
                      style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)'
                      }}
                    >
                      {card.emoji}
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4 bg-white/30 rounded-full h-3">
          <div
            className="bg-white rounded-full h-3 transition-all"
            style={{ width: `${(matched.length / (cards.length / 2)) * 100}%` }}
          />
        </div>
        <p className="text-center text-white mt-2">
          {matched.length} / {cards.length / 2} cặp
        </p>

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

export default MemoryGame;
