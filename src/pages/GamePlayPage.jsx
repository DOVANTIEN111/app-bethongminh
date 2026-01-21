import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useAudio } from '../contexts/AudioContext';
import { getGame } from '../data/games';
import { ArrowLeft, RotateCcw, Home, Trophy } from 'lucide-react';

// ============================================
// 1. MEMORY GAME - Lật hình nhớ
// ============================================
const MemoryGame = ({ onComplete }) => {
  const { playSound } = useAudio();
  const emojis = ['🐶', '🐱', '🐼', '🦊', '🐸', '🐵', '🐰', '🐻'];
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  
  useEffect(() => {
    const deck = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, i) => ({ id: i, emoji }));
    setCards(deck);
  }, []);
  
  const handleFlip = (id) => {
    if (flipped.length === 2 || flipped.includes(id) || matched.includes(id)) return;
    
    playSound('click');
    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);
    
    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlipped;
      if (cards[first].emoji === cards[second].emoji) {
        playSound('correct');
        const newMatched = [...matched, first, second];
        setMatched(newMatched);
        setFlipped([]);
        
        if (newMatched.length === cards.length) {
          setTimeout(() => {
            const score = Math.max(100, 1000 - moves * 20);
            onComplete(score);
          }, 500);
        }
      } else {
        playSound('wrong');
        setTimeout(() => setFlipped([]), 800);
      }
    }
  };
  
  return (
    <div>
      <div className="text-center mb-4">
        <span className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full font-medium">
          Lượt: {moves} | Còn: {(cards.length - matched.length) / 2} cặp
        </span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {cards.map(card => {
          const isFlipped = flipped.includes(card.id) || matched.includes(card.id);
          return (
            <motion.button
              key={card.id}
              onClick={() => handleFlip(card.id)}
              whileTap={{ scale: 0.95 }}
              className={`aspect-square rounded-xl text-3xl flex items-center justify-center shadow-lg transition-all duration-300 ${
                matched.includes(card.id) 
                  ? 'bg-green-100 scale-95' 
                  : isFlipped 
                    ? 'bg-white' 
                    : 'bg-gradient-to-br from-indigo-500 to-purple-500'
              }`}
            >
              {isFlipped ? card.emoji : '❓'}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

// ============================================
// 2. MATH RACE - Đua xe toán
// ============================================
const MathRaceGame = ({ onComplete }) => {
  const { playSound } = useAudio();
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(30);
  const [question, setQuestion] = useState(null);
  const [carPosition, setCarPosition] = useState(0);
  const scoreRef = React.useRef(0);
  
  useEffect(() => { scoreRef.current = score; }, [score]);
  
  const generateQuestion = useCallback(() => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    const isAdd = Math.random() > 0.5;
    const correct = isAdd ? a + b : a - b;
    
    const options = new Set([correct]);
    while (options.size < 4) {
      options.add(correct + Math.floor(Math.random() * 7) - 3);
    }
    
    return {
      q: `${a} ${isAdd ? '+' : '-'} ${b}`,
      answer: correct,
      options: Array.from(options).sort(() => Math.random() - 0.5)
    };
  }, []);
  
  useEffect(() => {
    setQuestion(generateQuestion());
    const timer = setInterval(() => {
      setTime(t => {
        if (t <= 1) {
          clearInterval(timer);
          setTimeout(() => onComplete(scoreRef.current), 100);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  
  const handleAnswer = (opt) => {
    if (opt === question.answer) {
      playSound('correct');
      setScore(s => s + 100);
      setCarPosition(p => Math.min(100, p + 12));
    } else {
      playSound('wrong');
    }
    setQuestion(generateQuestion());
  };
  
  if (!question) return null;
  
  return (
    <div>
      <div className="flex justify-between mb-4">
        <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold">
          🏆 {score}
        </span>
        <span className={`px-4 py-2 rounded-full font-bold ${time <= 10 ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-blue-100 text-blue-700'}`}>
          ⏱️ {time}s
        </span>
      </div>
      
      {/* Race Track */}
      <div className="bg-gray-200 rounded-full h-8 mb-4 relative overflow-hidden">
        <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-300" style={{ width: `${carPosition}%` }} />
        <div className="absolute inset-y-0 transition-all duration-300" style={{ left: `${carPosition}%` }}>
          <span className="text-2xl">🏎️</span>
        </div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xl">🏁</div>
      </div>
      
      <div className="bg-white rounded-2xl p-6 shadow-lg mb-6 text-center">
        <p className="text-4xl font-bold text-gray-800">{question.q} = ?</p>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {question.options.map((opt, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleAnswer(opt)}
            className="py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold text-xl shadow-lg"
          >
            {opt}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

// ============================================
// 3. WHACK MOLE - Đập chuột
// ============================================
const WhackMoleGame = ({ onComplete }) => {
  const { playSound } = useAudio();
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(20);
  const [molePos, setMolePos] = useState(null);
  const [hitEffect, setHitEffect] = useState(null);
  const scoreRef = React.useRef(0);
  
  useEffect(() => { scoreRef.current = score; }, [score]);
  
  useEffect(() => {
    const moleTimer = setInterval(() => {
      setMolePos(Math.floor(Math.random() * 9));
    }, 700);
    
    const gameTimer = setInterval(() => {
      setTime(t => {
        if (t <= 1) {
          clearInterval(moleTimer);
          clearInterval(gameTimer);
          setTimeout(() => onComplete(scoreRef.current), 100);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    
    return () => {
      clearInterval(moleTimer);
      clearInterval(gameTimer);
    };
  }, []);
  
  const handleWhack = (pos) => {
    if (pos === molePos) {
      playSound('correct');
      setScore(s => s + 50);
      setHitEffect(pos);
      setMolePos(null);
      setTimeout(() => setHitEffect(null), 200);
    }
  };
  
  return (
    <div>
      <div className="flex justify-between mb-4">
        <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold">
          🏆 {score}
        </span>
        <span className={`px-4 py-2 rounded-full font-bold ${time <= 5 ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-blue-100 text-blue-700'}`}>
          ⏱️ {time}s
        </span>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleWhack(i)}
            className={`aspect-square rounded-xl text-4xl flex items-center justify-center transition-all ${
              hitEffect === i 
                ? 'bg-yellow-300 scale-110' 
                : molePos === i 
                  ? 'bg-amber-200' 
                  : 'bg-amber-100'
            }`}
          >
            {molePos === i ? '🐹' : '🕳️'}
          </motion.button>
        ))}
      </div>
      
      <p className="text-center text-gray-500 mt-4 text-sm">Đập nhanh khi chuột xuất hiện!</p>
    </div>
  );
};

// ============================================
// 4. COLOR MATCH - Bắt màu
// ============================================
const ColorMatchGame = ({ onComplete }) => {
  const { playSound } = useAudio();
  const colors = [
    { name: 'Đỏ', color: 'bg-red-500', value: 'red' },
    { name: 'Xanh dương', color: 'bg-blue-500', value: 'blue' },
    { name: 'Xanh lá', color: 'bg-green-500', value: 'green' },
    { name: 'Vàng', color: 'bg-yellow-400', value: 'yellow' },
  ];
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(20);
  const [target, setTarget] = useState(colors[0]);
  const scoreRef = React.useRef(0);
  
  useEffect(() => { scoreRef.current = score; }, [score]);
  
  useEffect(() => {
    setTarget(colors[Math.floor(Math.random() * colors.length)]);
    const timer = setInterval(() => {
      setTime(t => {
        if (t <= 1) {
          clearInterval(timer);
          setTimeout(() => onComplete(scoreRef.current), 100);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  
  const handleClick = (color) => {
    if (color.value === target.value) {
      playSound('correct');
      setScore(s => s + 50);
    } else {
      playSound('wrong');
    }
    setTarget(colors[Math.floor(Math.random() * colors.length)]);
  };
  
  return (
    <div>
      <div className="flex justify-between mb-4">
        <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold">
          🏆 {score}
        </span>
        <span className={`px-4 py-2 rounded-full font-bold ${time <= 5 ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-blue-100 text-blue-700'}`}>
          ⏱️ {time}s
        </span>
      </div>
      
      <div className="bg-white rounded-2xl p-6 shadow-lg mb-6 text-center">
        <p className="text-gray-500 mb-2">Bấm vào màu:</p>
        <p className="text-3xl font-bold text-gray-800">{target.name}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {colors.map(c => (
          <motion.button
            key={c.value}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleClick(c)}
            className={`${c.color} h-24 rounded-xl shadow-lg`}
          />
        ))}
      </div>
    </div>
  );
};

// ============================================
// 5. SIMON SAYS - Nhớ và lặp lại
// ============================================
const SimonSaysGame = ({ onComplete }) => {
  const { playSound } = useAudio();
  const colors = [
    { id: 0, color: 'bg-red-500', activeColor: 'bg-red-300', name: 'Đỏ' },
    { id: 1, color: 'bg-blue-500', activeColor: 'bg-blue-300', name: 'Xanh' },
    { id: 2, color: 'bg-yellow-500', activeColor: 'bg-yellow-300', name: 'Vàng' },
    { id: 3, color: 'bg-green-500', activeColor: 'bg-green-300', name: 'Lá' },
  ];
  
  const [sequence, setSequence] = useState([]);
  const [playerSeq, setPlayerSeq] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [round, setRound] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('Bấm Bắt đầu!');
  
  const playSequence = async (seq) => {
    setIsPlaying(true);
    setMessage('Xem và nhớ...');
    
    for (let i = 0; i < seq.length; i++) {
      await new Promise(r => setTimeout(r, 400));
      setActiveId(seq[i]);
      playSound('click');
      await new Promise(r => setTimeout(r, 400));
      setActiveId(null);
    }
    
    setIsPlaying(false);
    setMessage('Đến lượt bạn!');
  };
  
  const startGame = () => {
    const first = Math.floor(Math.random() * 4);
    setSequence([first]);
    setPlayerSeq([]);
    setRound(1);
    setGameOver(false);
    playSequence([first]);
  };
  
  const handlePress = (id) => {
    if (isPlaying || gameOver) return;
    
    playSound('click');
    setActiveId(id);
    setTimeout(() => setActiveId(null), 200);
    
    const newPlayerSeq = [...playerSeq, id];
    setPlayerSeq(newPlayerSeq);
    
    const idx = newPlayerSeq.length - 1;
    if (newPlayerSeq[idx] !== sequence[idx]) {
      playSound('wrong');
      setGameOver(true);
      setMessage('Sai rồi! 😢');
      setTimeout(() => onComplete(round * 100), 1500);
      return;
    }
    
    if (newPlayerSeq.length === sequence.length) {
      playSound('correct');
      setMessage('Tuyệt vời! 🎉');
      
      setTimeout(() => {
        const next = Math.floor(Math.random() * 4);
        const newSeq = [...sequence, next];
        setSequence(newSeq);
        setPlayerSeq([]);
        setRound(r => r + 1);
        playSequence(newSeq);
      }, 1000);
    }
  };
  
  return (
    <div>
      <div className="flex justify-between mb-4">
        <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full font-bold">
          Vòng: {round}
        </span>
        <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold">
          🏆 {round * 100}
        </span>
      </div>
      
      <div className="bg-white rounded-2xl p-4 shadow-lg mb-4 text-center">
        <p className="text-lg font-semibold text-gray-700">{message}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-4">
        {colors.map(c => (
          <motion.button
            key={c.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePress(c.id)}
            disabled={isPlaying || gameOver}
            className={`h-28 rounded-xl shadow-lg transition-all duration-150 ${
              activeId === c.id ? c.activeColor + ' scale-105' : c.color
            } ${(isPlaying || gameOver) ? 'opacity-70' : ''}`}
          />
        ))}
      </div>
      
      {round === 0 && (
        <button
          onClick={startGame}
          className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-bold text-lg"
        >
          🎮 Bắt đầu
        </button>
      )}
    </div>
  );
};

// ============================================
// 6. WORD MATCH - Nối từ tiếng Anh
// ============================================
const WordMatchGame = ({ onComplete }) => {
  const { playSound, speak } = useAudio();
  const allWords = [
    { word: 'Cat', emoji: '🐱', vn: 'Con mèo' },
    { word: 'Dog', emoji: '🐶', vn: 'Con chó' },
    { word: 'Bird', emoji: '🐦', vn: 'Con chim' },
    { word: 'Fish', emoji: '🐟', vn: 'Con cá' },
    { word: 'Apple', emoji: '🍎', vn: 'Quả táo' },
    { word: 'Banana', emoji: '🍌', vn: 'Quả chuối' },
    { word: 'Sun', emoji: '☀️', vn: 'Mặt trời' },
    { word: 'Moon', emoji: '🌙', vn: 'Mặt trăng' },
    { word: 'Star', emoji: '⭐', vn: 'Ngôi sao' },
    { word: 'House', emoji: '🏠', vn: 'Ngôi nhà' },
    { word: 'Car', emoji: '🚗', vn: 'Xe hơi' },
    { word: 'Book', emoji: '📚', vn: 'Quyển sách' },
  ];
  
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [currentWord, setCurrentWord] = useState(null);
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const totalRounds = 8;
  
  const generateRound = useCallback(() => {
    const shuffled = [...allWords].sort(() => Math.random() - 0.5);
    const correct = shuffled[0];
    const wrongOptions = shuffled.slice(1, 4);
    const allOptions = [correct, ...wrongOptions].sort(() => Math.random() - 0.5);
    
    setCurrentWord(correct);
    setOptions(allOptions);
    setFeedback(null);
    
    setTimeout(() => speak(correct.word), 300);
  }, []);
  
  useEffect(() => {
    generateRound();
  }, []);
  
  const handleAnswer = (option) => {
    if (feedback) return;
    
    const isCorrect = option.word === currentWord.word;
    setFeedback({ correct: isCorrect, selected: option.word });
    
    if (isCorrect) {
      playSound('correct');
      setScore(s => s + 100);
    } else {
      playSound('wrong');
    }
    
    setTimeout(() => {
      if (round >= totalRounds) {
        onComplete(score + (isCorrect ? 100 : 0));
      } else {
        setRound(r => r + 1);
        generateRound();
      }
    }, 1200);
  };
  
  if (!currentWord) return null;
  
  return (
    <div>
      <div className="flex justify-between mb-4">
        <span className="bg-violet-100 text-violet-700 px-4 py-2 rounded-full font-bold">
          {round}/{totalRounds}
        </span>
        <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold">
          🏆 {score}
        </span>
      </div>
      
      <div className="bg-white rounded-2xl p-6 shadow-lg mb-6 text-center">
        <p className="text-6xl mb-3">{currentWord.emoji}</p>
        <button 
          onClick={() => speak(currentWord.word)}
          className="text-indigo-500 text-sm"
        >
          🔊 Nghe phát âm
        </button>
      </div>
      
      <p className="text-center text-gray-600 mb-3">Chọn từ tiếng Anh đúng:</p>
      
      <div className="grid grid-cols-2 gap-3">
        {options.map((opt, i) => {
          let bg = 'bg-white border-2 border-gray-200';
          if (feedback) {
            if (opt.word === currentWord.word) {
              bg = 'bg-green-100 border-2 border-green-500';
            } else if (opt.word === feedback.selected && !feedback.correct) {
              bg = 'bg-red-100 border-2 border-red-500';
            }
          }
          
          return (
            <motion.button
              key={i}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAnswer(opt)}
              disabled={!!feedback}
              className={`${bg} p-4 rounded-xl shadow transition-all`}
            >
              <p className="font-bold text-lg text-gray-800">{opt.word}</p>
              <p className="text-sm text-gray-500">{opt.vn}</p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

// ============================================
// 7. QUICK MATH - Tính nhanh 60 giây
// ============================================
const QuickMathGame = ({ onComplete }) => {
  const { playSound } = useAudio();
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(60);
  const [question, setQuestion] = useState(null);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const scoreRef = React.useRef(0);
  
  useEffect(() => { scoreRef.current = score; }, [score]);
  
  const generateQuestion = useCallback(() => {
    const ops = ['+', '-', '×'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a, b, answer;
    
    if (op === '×') {
      a = Math.floor(Math.random() * 10) + 1;
      b = Math.floor(Math.random() * 10) + 1;
      answer = a * b;
    } else if (op === '+') {
      a = Math.floor(Math.random() * 50) + 1;
      b = Math.floor(Math.random() * 50) + 1;
      answer = a + b;
    } else {
      a = Math.floor(Math.random() * 50) + 10;
      b = Math.floor(Math.random() * a);
      answer = a - b;
    }
    
    const options = new Set([answer]);
    while (options.size < 4) {
      const wrong = answer + Math.floor(Math.random() * 11) - 5;
      if (wrong !== answer && wrong >= 0) options.add(wrong);
    }
    
    return {
      q: `${a} ${op} ${b}`,
      answer,
      options: Array.from(options).sort(() => Math.random() - 0.5)
    };
  }, []);
  
  useEffect(() => {
    setQuestion(generateQuestion());
    const timer = setInterval(() => {
      setTime(t => {
        if (t <= 1) {
          clearInterval(timer);
          setTimeout(() => onComplete(scoreRef.current), 100);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  
  const handleAnswer = (opt) => {
    const isCorrect = opt === question.answer;
    
    if (isCorrect) {
      playSound('correct');
      const bonus = streak >= 3 ? streak * 10 : 0;
      setScore(s => s + 50 + bonus);
      setStreak(s => s + 1);
      setFeedback({ type: 'correct', bonus });
    } else {
      playSound('wrong');
      setStreak(0);
      setFeedback({ type: 'wrong', bonus: 0 });
    }
    
    setTimeout(() => {
      setQuestion(generateQuestion());
      setFeedback(null);
    }, 300);
  };
  
  if (!question) return null;
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold">
          🏆 {score}
        </span>
        {streak >= 3 && (
          <span className="bg-orange-100 text-orange-700 px-3 py-2 rounded-full font-bold text-sm">
            🔥 x{streak}
          </span>
        )}
        <span className={`px-4 py-2 rounded-full font-bold ${time <= 10 ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-blue-100 text-blue-700'}`}>
          ⏱️ {time}s
        </span>
      </div>
      
      <div className={`bg-white rounded-2xl p-8 shadow-lg mb-6 text-center transition-all ${
        feedback?.type === 'correct' ? 'ring-4 ring-green-400' : feedback?.type === 'wrong' ? 'ring-4 ring-red-400' : ''
      }`}>
        <p className="text-4xl font-bold text-gray-800">{question.q} = ?</p>
        {feedback?.bonus > 0 && (
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-green-500 text-sm mt-2"
          >
            +{feedback.bonus} bonus streak!
          </motion.p>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {question.options.map((opt, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleAnswer(opt)}
            className="py-5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold text-2xl shadow-lg"
          >
            {opt}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

// ============================================
// 8. BALLOON POP - Bắn bóng bay
// ============================================
const BalloonPopGame = ({ onComplete }) => {
  const { playSound } = useAudio();
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(25);
  const [balloons, setBalloons] = useState([]);
  const [poppedCount, setPoppedCount] = useState(0);
  const scoreRef = React.useRef(0);
  
  useEffect(() => { scoreRef.current = score; }, [score]);
  
  const balloonEmojis = ['🎈', '🔴', '🟢', '🟡', '🟣', '🟠', '🔵'];
  
  useEffect(() => {
    const gameTimer = setInterval(() => {
      setTime(t => {
        if (t <= 1) {
          clearInterval(gameTimer);
          setTimeout(() => onComplete(scoreRef.current), 100);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    
    const spawnTimer = setInterval(() => {
      const newBalloon = {
        id: Date.now() + Math.random(),
        x: Math.random() * 80 + 10,
        emoji: balloonEmojis[Math.floor(Math.random() * balloonEmojis.length)],
        speed: Math.random() * 2 + 3,
        size: Math.floor(Math.random() * 20) + 35,
      };
      setBalloons(b => [...b, newBalloon]);
      
      setTimeout(() => {
        setBalloons(b => b.filter(balloon => balloon.id !== newBalloon.id));
      }, newBalloon.speed * 1000);
    }, 500);
    
    return () => {
      clearInterval(gameTimer);
      clearInterval(spawnTimer);
    };
  }, []);
  
  const popBalloon = (id) => {
    playSound('pop');
    setScore(s => s + 30);
    setPoppedCount(c => c + 1);
    setBalloons(b => b.filter(balloon => balloon.id !== id));
  };
  
  return (
    <div>
      <div className="flex justify-between mb-4">
        <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold">
          🏆 {score}
        </span>
        <span className="bg-purple-100 text-purple-700 px-3 py-2 rounded-full font-bold text-sm">
          💥 {poppedCount}
        </span>
        <span className={`px-4 py-2 rounded-full font-bold ${time <= 5 ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-blue-100 text-blue-700'}`}>
          ⏱️ {time}s
        </span>
      </div>
      
      <div className="bg-gradient-to-b from-sky-300 to-sky-500 rounded-2xl h-96 relative overflow-hidden shadow-lg">
        <AnimatePresence>
          {balloons.map(balloon => (
            <motion.button
              key={balloon.id}
              initial={{ bottom: -60, left: `${balloon.x}%`, opacity: 1 }}
              animate={{ bottom: '110%' }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: balloon.speed, ease: 'linear' }}
              onClick={() => popBalloon(balloon.id)}
              className="absolute transform -translate-x-1/2 cursor-pointer"
              style={{ fontSize: balloon.size }}
            >
              {balloon.emoji}
            </motion.button>
          ))}
        </AnimatePresence>
        
        {/* Clouds */}
        <div className="absolute top-4 left-4 text-4xl opacity-50">☁️</div>
        <div className="absolute top-8 right-8 text-3xl opacity-50">☁️</div>
        
        {/* Ground */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-green-500 to-green-400" />
        
        {/* Instructions */}
        {balloons.length === 0 && time > 23 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-white text-xl font-bold bg-black/30 px-4 py-2 rounded-xl">
              Bấm vào bóng bay! 🎈
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// MAIN GAME PAGE
// ============================================
export default function GamePlayPage() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { completeGame } = useAuth();
  const { playSound } = useAudio();
  
  const game = getGame(gameId);
  const [gameState, setGameState] = useState('playing');
  const [finalScore, setFinalScore] = useState(0);
  const [key, setKey] = useState(0);
  
  const handleComplete = (score) => {
    setFinalScore(score);
    setGameState('finished');
    completeGame(gameId, score);
    playSound('levelUp');
  };
  
  const handleRestart = () => {
    setGameState('playing');
    setFinalScore(0);
    setKey(k => k + 1);
  };
  
  if (!game) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-6xl mb-4">🎮</div>
        <p className="text-gray-500 mb-4">Game không tồn tại</p>
        <button onClick={() => navigate('/games')} className="px-6 py-2 bg-indigo-500 text-white rounded-xl">
          Quay lại
        </button>
      </div>
    );
  }
  
  // Finished screen
  if (gameState === 'finished') {
    const isGood = finalScore >= 300;
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0, rotate: -10 }} 
          animate={{ scale: 1, rotate: 0 }} 
          className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
        >
          <motion.div 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className="text-6xl mb-4"
          >
            {isGood ? '🎉' : '👍'}
          </motion.div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {isGood ? 'Xuất sắc!' : 'Tốt lắm!'}
          </h2>
          <p className="text-gray-500 mb-4">{game.name}</p>
          
          <div className="flex items-center justify-center gap-2 mb-6">
            <Trophy className="w-8 h-8 text-amber-500" />
            <span className="text-5xl font-bold text-indigo-600">{finalScore}</span>
            <span className="text-gray-500">điểm</span>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={handleRestart} 
              className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-5 h-5" /> Chơi lại
            </button>
            <button 
              onClick={() => navigate('/games')} 
              className="flex-1 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Home className="w-5 h-5" /> Games
            </button>
          </div>
        </motion.div>
      </div>
    );
  }
  
  // Game components mapping
  const GameComponent = {
    memory: MemoryGame,
    mathRace: MathRaceGame,
    whackMole: WhackMoleGame,
    colorMatch: ColorMatchGame,
    simonSays: SimonSaysGame,
    wordMatch: WordMatchGame,
    quickMath: QuickMathGame,
    balloonPop: BalloonPopGame,
  }[gameId];
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className={`bg-gradient-to-r ${game.color} text-white px-4 py-4`}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/games')} className="p-2 rounded-full hover:bg-white/20 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <span className="text-3xl">{game.icon}</span>
          <div>
            <h1 className="text-xl font-bold">{game.name}</h1>
            <p className="text-white/80 text-sm">{game.desc}</p>
          </div>
        </div>
      </div>
      
      {/* Game Content */}
      <div className="p-4">
        {GameComponent ? (
          <GameComponent key={key} onComplete={handleComplete} />
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🚧</div>
            <p className="text-gray-500 mb-4">Game đang phát triển</p>
            <button 
              onClick={() => navigate('/games')} 
              className="px-6 py-2 bg-indigo-500 text-white rounded-xl"
            >
              Quay lại
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
