// src/components/games/SpellingGame.jsx
// Game đánh vần cho trẻ em

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

// Danh sách từ vựng với hình ảnh
const WORDS = [
  { word: 'MÈO', letters: ['M', 'È', 'O'], image: '🐱', hint: 'Con vật kêu meo meo' },
  { word: 'CHÓ', letters: ['C', 'H', 'Ó'], image: '🐶', hint: 'Con vật trung thành' },
  { word: 'CÁ', letters: ['C', 'Á'], image: '🐟', hint: 'Sống dưới nước' },
  { word: 'GÀ', letters: ['G', 'À'], image: '🐔', hint: 'Gáy mỗi sáng' },
  { word: 'VỊT', letters: ['V', 'Ị', 'T'], image: '🦆', hint: 'Biết bơi' },
  { word: 'ONG', letters: ['O', 'N', 'G'], image: '🐝', hint: 'Làm mật' },
  { word: 'HOA', letters: ['H', 'O', 'A'], image: '🌸', hint: 'Màu sắc đẹp' },
  { word: 'LÁ', letters: ['L', 'Á'], image: '🍃', hint: 'Trên cây' },
  { word: 'MƯA', letters: ['M', 'Ư', 'A'], image: '🌧️', hint: 'Rơi từ trời' },
  { word: 'SAO', letters: ['S', 'A', 'O'], image: '⭐', hint: 'Sáng trên trời đêm' },
  { word: 'MẶT TRỜI', letters: ['M', 'Ặ', 'T', ' ', 'T', 'R', 'Ờ', 'I'], image: '☀️', hint: 'Chiếu sáng ban ngày' },
  { word: 'TRĂNG', letters: ['T', 'R', 'Ă', 'N', 'G'], image: '🌙', hint: 'Sáng ban đêm' },
  { word: 'TÁO', letters: ['T', 'Á', 'O'], image: '🍎', hint: 'Quả màu đỏ' },
  { word: 'CHUỐI', letters: ['C', 'H', 'U', 'Ố', 'I'], image: '🍌', hint: 'Quả màu vàng, cong' },
  { word: 'NHÀ', letters: ['N', 'H', 'À'], image: '🏠', hint: 'Nơi ta ở' },
];

const SpellingGame = ({ onComplete, onExit }) => {
  const [currentWord, setCurrentWord] = useState(null);
  const [shuffledLetters, setShuffledLetters] = useState([]);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [wordsCompleted, setWordsCompleted] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [usedWords, setUsedWords] = useState([]);

  // Chọn từ mới
  const selectNewWord = useCallback(() => {
    // Lọc từ phù hợp với level (ngắn hơn cho level thấp)
    const maxLength = 2 + level;
    let availableWords = WORDS.filter(w =>
      w.letters.filter(l => l !== ' ').length <= maxLength &&
      !usedWords.includes(w.word)
    );

    if (availableWords.length === 0) {
      availableWords = WORDS.filter(w => w.letters.filter(l => l !== ' ').length <= maxLength);
      setUsedWords([]);
    }

    const word = availableWords[Math.floor(Math.random() * availableWords.length)];
    setCurrentWord(word);
    setUsedWords(prev => [...prev, word.word]);

    // Xáo trộn chữ cái (không xáo trộn khoảng trắng)
    const lettersOnly = word.letters.filter(l => l !== ' ');
    const shuffled = [...lettersOnly].sort(() => Math.random() - 0.5);
    setShuffledLetters(shuffled.map((letter, index) => ({ letter, id: index, used: false })));
    setSelectedLetters([]);
    setShowResult(false);
    setShowHint(false);
  }, [level, usedWords]);

  useEffect(() => {
    selectNewWord();
  }, []);

  // Chọn chữ cái
  const handleSelectLetter = (letterObj) => {
    if (showResult || letterObj.used) return;

    // Thêm vào selected
    setSelectedLetters(prev => [...prev, letterObj]);

    // Đánh dấu đã dùng
    setShuffledLetters(prev =>
      prev.map(l => l.id === letterObj.id ? { ...l, used: true } : l)
    );
  };

  // Bỏ chữ cái đã chọn
  const handleRemoveLetter = (index) => {
    if (showResult) return;

    const removed = selectedLetters[index];
    setSelectedLetters(prev => prev.filter((_, i) => i !== index));

    // Đánh dấu chưa dùng
    setShuffledLetters(prev =>
      prev.map(l => l.id === removed.id ? { ...l, used: false } : l)
    );
  };

  // Kiểm tra đáp án
  const checkAnswer = () => {
    const answer = selectedLetters.map(l => l.letter).join('');
    const correctLetters = currentWord.letters.filter(l => l !== ' ').join('');
    const correct = answer === correctLetters;

    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      const points = currentWord.letters.length * 5;
      setScore(prev => prev + points);
      setWordsCompleted(prev => prev + 1);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Tăng level
      if ((wordsCompleted + 1) % 3 === 0 && level < 5) {
        setLevel(prev => prev + 1);
      }
    } else {
      setLives(prev => prev - 1);

      if (lives <= 1) {
        setGameOver(true);
        if (onComplete) {
          onComplete({ score, level, wordsCompleted });
        }
        return;
      }
    }

    setTimeout(() => {
      selectNewWord();
    }, 2000);
  };

  // Render game over
  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-400 via-teal-400 to-blue-400 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 shadow-2xl text-center max-w-md w-full"
        >
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Hết lượt!</h2>
          <p className="text-gray-600 mb-6">Bé đánh vần giỏi lắm!</p>

          <div className="bg-gradient-to-r from-green-100 to-teal-100 rounded-2xl p-6 mb-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-green-600">{score}</div>
                <div className="text-sm text-gray-600">Điểm số</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-teal-600">{wordsCompleted}</div>
                <div className="text-sm text-gray-600">Từ hoàn thành</div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => {
                setLevel(1);
                setScore(0);
                setLives(3);
                setWordsCompleted(0);
                setUsedWords([]);
                setGameOver(false);
                selectNewWord();
              }}
              className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg"
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

  if (!currentWord) return null;

  const lettersNeeded = currentWord.letters.filter(l => l !== ' ').length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-400 via-teal-400 to-blue-400 p-4">
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
            <span className="font-bold text-green-600">{score} điểm</span>
          </div>
          <div className="bg-yellow-400 rounded-full px-4 py-2 shadow-lg">
            <span className="font-bold text-yellow-900">Cấp {level}</span>
          </div>
        </div>

        {/* Game Card */}
        <motion.div
          key={wordsCompleted}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-6 shadow-2xl"
        >
          {/* Image */}
          <div className="text-center mb-4">
            <motion.span
              className="text-8xl inline-block"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              {currentWord.image}
            </motion.span>
          </div>

          {/* Hint */}
          <div className="text-center mb-4">
            {showHint ? (
              <p className="text-gray-600 italic">Gợi ý: {currentWord.hint}</p>
            ) : (
              <button
                onClick={() => setShowHint(true)}
                className="text-blue-500 text-sm underline"
              >
                Xem gợi ý
              </button>
            )}
          </div>

          {/* Answer slots */}
          <div className="flex justify-center gap-2 mb-6 min-h-[60px] flex-wrap">
            {Array(lettersNeeded).fill(null).map((_, index) => (
              <motion.div
                key={index}
                onClick={() => selectedLetters[index] && handleRemoveLetter(index)}
                className={`w-12 h-14 rounded-xl border-3 flex items-center justify-center text-2xl font-bold cursor-pointer
                  ${selectedLetters[index]
                    ? showResult
                      ? isCorrect
                        ? 'bg-green-100 border-green-400 text-green-700'
                        : 'bg-red-100 border-red-400 text-red-700'
                      : 'bg-blue-100 border-blue-400 text-blue-700 hover:bg-blue-200'
                    : 'bg-gray-100 border-gray-300 border-dashed'
                  }`}
                whileHover={selectedLetters[index] && !showResult ? { scale: 1.1 } : {}}
              >
                {selectedLetters[index]?.letter || ''}
              </motion.div>
            ))}
          </div>

          {/* Shuffled letters */}
          <div className="flex justify-center gap-2 mb-6 flex-wrap">
            {shuffledLetters.map((letterObj) => (
              <motion.button
                key={letterObj.id}
                onClick={() => handleSelectLetter(letterObj)}
                disabled={letterObj.used || showResult}
                className={`w-14 h-14 rounded-xl text-2xl font-bold shadow-lg transition-all
                  ${letterObj.used
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-br from-yellow-400 to-orange-400 text-white hover:from-yellow-500 hover:to-orange-500'
                  }`}
                whileHover={!letterObj.used ? { scale: 1.1 } : {}}
                whileTap={!letterObj.used ? { scale: 0.95 } : {}}
              >
                {letterObj.letter}
              </motion.button>
            ))}
          </div>

          {/* Check button */}
          {selectedLetters.length === lettersNeeded && !showResult && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={checkAnswer}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-4 rounded-xl text-xl shadow-lg"
            >
              Kiểm tra
            </motion.button>
          )}

          {/* Result */}
          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-center p-4 rounded-xl ${
                  isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}
              >
                <span className="text-3xl mr-2">{isCorrect ? '🎉' : '😢'}</span>
                <span className="text-xl font-bold">
                  {isCorrect
                    ? 'Đúng rồi! Giỏi quá!'
                    : `Đáp án: ${currentWord.word}`
                  }
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

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

export default SpellingGame;
