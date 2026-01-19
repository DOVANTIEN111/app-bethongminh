import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useMember } from '../contexts/MemberContext';
import { useAudio } from '../contexts/AudioContext';
import { getAllWords } from '../data/englishVocab';
import { ArrowLeft, RotateCcw, Home, Trophy, Volume2, Check, X, Mic, MicOff } from 'lucide-react';

// ============================================
// 1. FLASHCARD GAME
// ============================================
const FlashcardGame = ({ onComplete }) => {
  const { playSound, speak } = useAudio();
  const allWords = getAllWords();
  const [words, setWords] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const totalRounds = 10;
  
  useEffect(() => {
    const shuffled = [...allWords].sort(() => Math.random() - 0.5).slice(0, totalRounds);
    setWords(shuffled);
  }, []);
  
  const word = words[current];
  
  useEffect(() => {
    if (word) setTimeout(() => speak(word.word), 300);
  }, [current, word]);
  
  const handleKnow = () => {
    playSound('correct');
    setScore(s => s + 100);
    setFeedback('correct');
    setTimeout(nextWord, 800);
  };
  
  const handleDontKnow = () => {
    playSound('wrong');
    setShowAnswer(true);
    setFeedback('wrong');
    setTimeout(nextWord, 1500);
  };
  
  const nextWord = () => {
    setShowAnswer(false);
    setFeedback(null);
    if (current < words.length - 1) {
      setCurrent(c => c + 1);
    } else {
      onComplete(score);
    }
  };
  
  if (!word) return <div className="text-center py-12">Đang tải...</div>;
  
  return (
    <div>
      <div className="flex justify-between mb-4">
        <span className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full font-bold">
          {current + 1}/{totalRounds}
        </span>
        <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold">
          🏆 {score}
        </span>
      </div>
      
      <motion.div 
        key={current}
        initial={{ opacity: 0, rotateY: -90 }}
        animate={{ opacity: 1, rotateY: 0 }}
        className={`bg-white rounded-3xl shadow-xl p-8 text-center min-h-[300px] flex flex-col items-center justify-center ${
          feedback === 'correct' ? 'ring-4 ring-green-400' : feedback === 'wrong' ? 'ring-4 ring-red-400' : ''
        }`}
      >
        <div className="text-7xl mb-4">{word.emoji}</div>
        <button onClick={() => speak(word.word)} className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-full flex items-center gap-2 mb-4">
          <Volume2 className="w-5 h-5" /> Nghe
        </button>
        {showAnswer ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="text-3xl font-bold text-gray-800">{word.word}</p>
            <p className="text-xl text-gray-500">{word.vn}</p>
          </motion.div>
        ) : (
          <p className="text-gray-400">Bạn biết từ này không?</p>
        )}
      </motion.div>
      
      {!showAnswer && !feedback && (
        <div className="flex gap-4 mt-6">
          <button onClick={handleDontKnow} className="flex-1 py-4 bg-red-100 text-red-600 rounded-xl font-bold flex items-center justify-center gap-2">
            <X className="w-6 h-6" /> Không biết
          </button>
          <button onClick={handleKnow} className="flex-1 py-4 bg-green-500 text-white rounded-xl font-bold flex items-center justify-center gap-2">
            <Check className="w-6 h-6" /> Biết rồi!
          </button>
        </div>
      )}
    </div>
  );
};

// ============================================
// 2. LISTEN & PICK GAME
// ============================================
const ListenPickGame = ({ onComplete }) => {
  const { playSound, speak } = useAudio();
  const allWords = getAllWords();
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [question, setQuestion] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const totalRounds = 10;
  
  const generateQuestion = useCallback(() => {
    const shuffled = [...allWords].sort(() => Math.random() - 0.5);
    const correct = shuffled[0];
    const wrongs = shuffled.slice(1, 4);
    return { correct, options: [correct, ...wrongs].sort(() => Math.random() - 0.5) };
  }, [allWords]);
  
  useEffect(() => {
    const q = generateQuestion();
    setQuestion(q);
    setTimeout(() => speak(q.correct.word), 500);
  }, []);
  
  const handleAnswer = (word) => {
    if (feedback) return;
    const isCorrect = word.word === question.correct.word;
    setFeedback({ isCorrect, selected: word.word });
    if (isCorrect) { playSound('correct'); setScore(s => s + 100); }
    else { playSound('wrong'); }
    
    setTimeout(() => {
      if (round >= totalRounds) { onComplete(score + (isCorrect ? 100 : 0)); }
      else {
        setRound(r => r + 1);
        const q = generateQuestion();
        setQuestion(q);
        setFeedback(null);
        setTimeout(() => speak(q.correct.word), 300);
      }
    }, 1200);
  };
  
  if (!question) return null;
  
  return (
    <div>
      <div className="flex justify-between mb-4">
        <span className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full font-bold">{round}/{totalRounds}</span>
        <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold">🏆 {score}</span>
      </div>
      
      <div className="bg-white rounded-2xl p-6 shadow-lg mb-6 text-center">
        <p className="text-gray-500 mb-3">Nghe và chọn hình đúng:</p>
        <button onClick={() => speak(question.correct.word)} className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full flex items-center gap-2 mx-auto">
          <Volume2 className="w-6 h-6" /> Nghe lại
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {question.options.map((opt, i) => {
          let bg = 'bg-white border-2 border-gray-200';
          if (feedback) {
            if (opt.word === question.correct.word) bg = 'bg-green-100 border-2 border-green-500';
            else if (opt.word === feedback.selected && !feedback.isCorrect) bg = 'bg-red-100 border-2 border-red-500';
          }
          return (
            <motion.button key={i} whileTap={{ scale: 0.95 }} onClick={() => handleAnswer(opt)} disabled={!!feedback}
              className={`${bg} p-4 rounded-2xl shadow transition-all`}>
              <span className="text-5xl block mb-2">{opt.emoji}</span>
              {feedback && <p className="text-sm font-medium text-gray-700">{opt.word}</p>}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

// ============================================
// 3. SPELLING BEE GAME
// ============================================
const SpellingBeeGame = ({ onComplete }) => {
  const { playSound, speak } = useAudio();
  const allWords = getAllWords().filter(w => w.word.length <= 6);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [word, setWord] = useState(null);
  const [letters, setLetters] = useState([]);
  const [answer, setAnswer] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const totalRounds = 8;
  
  const generateRound = useCallback(() => {
    const w = allWords[Math.floor(Math.random() * allWords.length)];
    const shuffledLetters = w.word.toUpperCase().split('').sort(() => Math.random() - 0.5);
    setWord(w);
    setLetters(shuffledLetters.map((l, i) => ({ id: i, letter: l, used: false })));
    setAnswer([]);
    setFeedback(null);
  }, [allWords]);
  
  useEffect(() => { generateRound(); }, []);
  useEffect(() => { if (word) setTimeout(() => speak(word.word), 300); }, [word]);
  
  const handleLetterClick = (letterObj) => {
    if (letterObj.used || feedback) return;
    playSound('click');
    setLetters(letters.map(l => l.id === letterObj.id ? { ...l, used: true } : l));
    const newAnswer = [...answer, letterObj];
    setAnswer(newAnswer);
    
    if (newAnswer.length === word.word.length) {
      const spelled = newAnswer.map(l => l.letter).join('');
      const isCorrect = spelled === word.word.toUpperCase();
      setFeedback(isCorrect);
      if (isCorrect) { playSound('correct'); setScore(s => s + 100); }
      else { playSound('wrong'); }
      setTimeout(() => {
        if (round >= totalRounds) { onComplete(score + (isCorrect ? 100 : 0)); }
        else { setRound(r => r + 1); generateRound(); }
      }, 1500);
    }
  };
  
  const handleUndo = () => {
    if (answer.length === 0 || feedback) return;
    const last = answer[answer.length - 1];
    setLetters(letters.map(l => l.id === last.id ? { ...l, used: false } : l));
    setAnswer(answer.slice(0, -1));
  };
  
  if (!word) return null;
  
  return (
    <div>
      <div className="flex justify-between mb-4">
        <span className="bg-amber-100 text-amber-700 px-4 py-2 rounded-full font-bold">{round}/{totalRounds}</span>
        <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold">🏆 {score}</span>
      </div>
      
      <div className="bg-white rounded-2xl p-6 shadow-lg mb-4 text-center">
        <span className="text-6xl block mb-3">{word.emoji}</span>
        <p className="text-gray-500 mb-2">{word.vn}</p>
        <button onClick={() => speak(word.word)} className="px-4 py-2 bg-amber-100 text-amber-600 rounded-full flex items-center gap-2 mx-auto">
          <Volume2 className="w-5 h-5" /> Nghe
        </button>
      </div>
      
      <div className={`flex justify-center gap-2 mb-6 p-4 rounded-2xl ${feedback === true ? 'bg-green-100' : feedback === false ? 'bg-red-100' : 'bg-gray-100'}`}>
        {word.word.split('').map((_, i) => (
          <div key={i} className={`w-12 h-14 rounded-xl flex items-center justify-center text-2xl font-bold ${answer[i] ? 'bg-white shadow-md text-gray-800' : 'bg-gray-200 border-2 border-dashed border-gray-300'}`}>
            {answer[i]?.letter || ''}
          </div>
        ))}
      </div>
      
      {feedback !== null && (
        <div className={`text-center mb-4 text-lg font-bold ${feedback ? 'text-green-600' : 'text-red-600'}`}>
          {feedback ? '🎉 Chính xác!' : `❌ Đáp án: ${word.word.toUpperCase()}`}
        </div>
      )}
      
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {letters.map((l) => (
          <motion.button key={l.id} whileTap={{ scale: 0.9 }} onClick={() => handleLetterClick(l)} disabled={l.used || feedback !== null}
            className={`w-12 h-12 rounded-xl text-xl font-bold shadow-md transition-all ${l.used ? 'bg-gray-200 text-gray-400' : 'bg-gradient-to-br from-amber-400 to-orange-500 text-white'}`}>
            {l.letter}
          </motion.button>
        ))}
      </div>
      
      {answer.length > 0 && !feedback && (
        <button onClick={handleUndo} className="w-full py-3 bg-gray-200 text-gray-600 rounded-xl font-medium">↩️ Xóa chữ cuối</button>
      )}
    </div>
  );
};

// ============================================
// 4. WORD RAIN GAME
// ============================================
const WordRainGame = ({ onComplete }) => {
  const { playSound, speak } = useAudio();
  const allWords = getAllWords();
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(30);
  const [targetWord, setTargetWord] = useState(null);
  const [fallingWords, setFallingWords] = useState([]);
  const [combo, setCombo] = useState(0);
  const scoreRef = React.useRef(0);
  
  useEffect(() => { scoreRef.current = score; }, [score]);
  
  const newTarget = useCallback(() => {
    const w = allWords[Math.floor(Math.random() * allWords.length)];
    setTargetWord(w);
    speak(w.word);
  }, [allWords]);
  
  useEffect(() => {
    newTarget();
    const gameTimer = setInterval(() => {
      setTime(t => { if (t <= 1) { clearInterval(gameTimer); setTimeout(() => onComplete(scoreRef.current), 100); return 0; } return t - 1; });
    }, 1000);
    const spawnTimer = setInterval(() => {
      const words = [...allWords].sort(() => Math.random() - 0.5).slice(0, 4);
      const newWord = { id: Date.now() + Math.random(), word: words[Math.floor(Math.random() * words.length)], x: Math.random() * 70 + 15, speed: Math.random() * 3 + 4 };
      setFallingWords(f => [...f, newWord]);
      setTimeout(() => { setFallingWords(f => f.filter(w => w.id !== newWord.id)); }, newWord.speed * 1000);
    }, 1200);
    return () => { clearInterval(gameTimer); clearInterval(spawnTimer); };
  }, []);
  
  const handleWordClick = (wordObj) => {
    if (wordObj.word.word === targetWord.word) {
      playSound('correct');
      const bonus = combo >= 3 ? combo * 20 : 0;
      setScore(s => s + 50 + bonus);
      setCombo(c => c + 1);
      setFallingWords(f => f.filter(w => w.id !== wordObj.id));
      newTarget();
    } else { playSound('wrong'); setCombo(0); }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold">🏆 {score}</span>
        {combo >= 3 && <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full font-bold text-sm">🔥 x{combo}</span>}
        <span className={`px-4 py-2 rounded-full font-bold ${time <= 10 ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-blue-100 text-blue-700'}`}>⏱️ {time}s</span>
      </div>
      
      <div className="bg-white rounded-2xl p-4 shadow-lg mb-4 text-center">
        <p className="text-gray-500 text-sm mb-1">Tìm từ:</p>
        <div className="flex items-center justify-center gap-3">
          <span className="text-4xl">{targetWord?.emoji}</span>
          <div>
            <p className="text-2xl font-bold text-gray-800">{targetWord?.word}</p>
            <p className="text-sm text-gray-500">{targetWord?.vn}</p>
          </div>
          <button onClick={() => speak(targetWord?.word)} className="p-2 bg-indigo-100 rounded-full"><Volume2 className="w-5 h-5 text-indigo-600" /></button>
        </div>
      </div>
      
      <div className="bg-gradient-to-b from-purple-100 to-purple-200 rounded-2xl h-80 relative overflow-hidden">
        <AnimatePresence>
          {fallingWords.map(wordObj => (
            <motion.button key={wordObj.id} initial={{ top: -60, left: `${wordObj.x}%` }} animate={{ top: '100%' }} exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: wordObj.speed, ease: 'linear' }} onClick={() => handleWordClick(wordObj)}
              className="absolute transform -translate-x-1/2 bg-white px-4 py-2 rounded-xl shadow-lg">
              <span className="text-2xl mr-2">{wordObj.word.emoji}</span>
              <span className="font-bold text-gray-800">{wordObj.word.word}</span>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================
// 5. SPEAK & CHECK - Nói và kiểm tra phát âm
// ============================================
const SpeakCheckGame = ({ onComplete }) => {
  const { playSound, speak, startListening, stopListening, isListening, speechSupported } = useAudio();
  const allWords = getAllWords();
  const [words, setWords] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const totalRounds = 8;
  const maxAttempts = 3;
  
  useEffect(() => {
    const shuffled = [...allWords].sort(() => Math.random() - 0.5).slice(0, totalRounds);
    setWords(shuffled);
  }, []);
  
  const word = words[current];
  
  useEffect(() => {
    if (word) setTimeout(() => speak(word.word), 500);
  }, [current, word]);
  
  const handleListen = () => {
    if (!speechSupported) {
      setResult({ success: false, error: 'not_supported', feedback: 'Trình duyệt không hỗ trợ' });
      return;
    }
    
    setResult(null);
    startListening(word.word, (res) => {
      setResult(res);
      setAttempts(a => a + 1);
      
      if (res.success && res.score >= 70) {
        playSound('correct');
        const points = res.score >= 90 ? 150 : res.score >= 80 ? 120 : 100;
        setScore(s => s + points);
      } else {
        playSound('wrong');
      }
    });
  };
  
  const handleNext = () => {
    if (current < words.length - 1) {
      setCurrent(c => c + 1);
      setResult(null);
      setAttempts(0);
    } else {
      onComplete(score);
    }
  };
  
  const handleSkip = () => {
    handleNext();
  };
  
  if (!word) return <div className="text-center py-12">Đang tải...</div>;
  
  if (!speechSupported) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎤</div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Không hỗ trợ</h3>
        <p className="text-gray-500 mb-4">Trình duyệt của bạn không hỗ trợ nhận diện giọng nói.</p>
        <p className="text-gray-500 text-sm mb-4">Vui lòng sử dụng Chrome, Edge hoặc Safari trên điện thoại.</p>
        <button onClick={() => onComplete(0)} className="px-6 py-3 bg-indigo-500 text-white rounded-xl">Quay lại</button>
      </div>
    );
  }
  
  const getFeedbackUI = () => {
    if (!result) return null;
    
    if (result.success && result.score >= 70) {
      return (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-green-100 rounded-2xl p-4 text-center">
          <div className="text-4xl mb-2">
            {result.score >= 90 ? '🌟' : result.score >= 80 ? '⭐' : '👍'}
          </div>
          <p className="text-green-700 font-bold text-lg">
            {result.score >= 90 ? 'Phát âm xuất sắc!' : result.score >= 80 ? 'Rất tốt!' : 'Tốt lắm!'}
          </p>
          <p className="text-green-600 text-sm">Điểm: {result.score}/100</p>
          {result.transcript && (
            <p className="text-green-500 text-xs mt-1">Bạn nói: "{result.transcript}"</p>
          )}
        </motion.div>
      );
    }
    
    if (result.error === 'no_speech') {
      return (
        <div className="bg-yellow-100 rounded-2xl p-4 text-center">
          <div className="text-4xl mb-2">🤔</div>
          <p className="text-yellow-700 font-bold">Không nghe thấy</p>
          <p className="text-yellow-600 text-sm">Hãy nói to và rõ hơn nhé!</p>
        </div>
      );
    }
    
    if (result.error === 'not_allowed' || result.error === 'no_mic') {
      return (
        <div className="bg-red-100 rounded-2xl p-4 text-center">
          <div className="text-4xl mb-2">🎤</div>
          <p className="text-red-700 font-bold">Cần quyền microphone</p>
          <p className="text-red-600 text-sm">Vui lòng cho phép sử dụng microphone</p>
        </div>
      );
    }
    
    return (
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-orange-100 rounded-2xl p-4 text-center">
        <div className="text-4xl mb-2">💪</div>
        <p className="text-orange-700 font-bold">Thử lại nhé!</p>
        {result.transcript && (
          <p className="text-orange-600 text-sm">Bạn nói: "{result.transcript}"</p>
        )}
        <p className="text-orange-500 text-xs mt-1">Còn {maxAttempts - attempts} lần thử</p>
      </motion.div>
    );
  };
  
  const canTryAgain = !result?.success && attempts < maxAttempts;
  const showNext = result?.success || attempts >= maxAttempts;
  
  return (
    <div>
      <div className="flex justify-between mb-4">
        <span className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full font-bold">
          {current + 1}/{totalRounds}
        </span>
        <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold">
          🏆 {score}
        </span>
      </div>
      
      {/* Word Card */}
      <motion.div 
        key={current}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-xl p-6 text-center mb-4"
      >
        <div className="text-7xl mb-4">{word.emoji}</div>
        <h2 className="text-4xl font-bold text-gray-800 mb-2">{word.word}</h2>
        <p className="text-xl text-gray-500 mb-4">{word.vn}</p>
        
        {/* Listen button */}
        <button
          onClick={() => speak(word.word)}
          className="px-6 py-3 bg-indigo-100 text-indigo-600 rounded-full flex items-center gap-2 mx-auto mb-4"
        >
          <Volume2 className="w-5 h-5" /> Nghe mẫu
        </button>
        
        {/* Instructions */}
        {!result && !isListening && (
          <p className="text-gray-400 text-sm">Bấm nút bên dưới và đọc to từ này</p>
        )}
      </motion.div>
      
      {/* Feedback */}
      {getFeedbackUI()}
      
      {/* Listening indicator */}
      {isListening && (
        <motion.div 
          initial={{ scale: 0.8 }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="bg-red-100 rounded-2xl p-6 text-center mb-4"
        >
          <div className="text-5xl mb-2">🎤</div>
          <p className="text-red-600 font-bold text-lg">Đang nghe...</p>
          <p className="text-red-500 text-sm">Hãy nói: "{word.word}"</p>
          
          {/* Animated waves */}
          <div className="flex justify-center gap-1 mt-3">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ height: [10, 30, 10] }}
                transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                className="w-2 bg-red-400 rounded-full"
              />
            ))}
          </div>
        </motion.div>
      )}
      
      {/* Action Buttons */}
      <div className="space-y-3 mt-4">
        {!isListening && !showNext && (
          <button
            onClick={handleListen}
            className="w-full py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg"
          >
            <Mic className="w-6 h-6" />
            {attempts > 0 ? 'Thử lại' : 'Bấm để nói'}
          </button>
        )}
        
        {showNext && (
          <button
            onClick={handleNext}
            className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl font-bold text-lg shadow-lg"
          >
            {current < words.length - 1 ? 'Từ tiếp theo →' : 'Xem kết quả 🎉'}
          </button>
        )}
        
        {!showNext && attempts > 0 && (
          <button
            onClick={handleSkip}
            className="w-full py-3 bg-gray-100 text-gray-600 rounded-xl font-medium"
          >
            Bỏ qua từ này
          </button>
        )}
      </div>
      
      {/* Tips */}
      <div className="mt-6 bg-blue-50 rounded-xl p-4">
        <p className="text-blue-700 font-medium text-sm mb-2">💡 Mẹo phát âm tốt:</p>
        <ul className="text-blue-600 text-xs space-y-1">
          <li>• Nghe kỹ mẫu trước khi nói</li>
          <li>• Nói to, rõ ràng và chậm rãi</li>
          <li>• Giữ điện thoại gần miệng</li>
          <li>• Chọn nơi yên tĩnh để luyện</li>
        </ul>
      </div>
    </div>
  );
};

// ============================================
// MAIN ENGLISH GAME PAGE
// ============================================
export default function EnglishGamePage() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { completeGame } = useMember();
  const { playSound } = useAudio();
  
  const [gameState, setGameState] = useState('playing');
  const [finalScore, setFinalScore] = useState(0);
  const [key, setKey] = useState(0);
  
  const games = {
    flashcard: { name: 'Flashcard', icon: '🎴', color: 'from-blue-500 to-cyan-500', component: FlashcardGame },
    listenPick: { name: 'Nghe & Chọn', icon: '👂', color: 'from-green-500 to-emerald-500', component: ListenPickGame },
    spellingBee: { name: 'Spelling Bee', icon: '🐝', color: 'from-amber-500 to-orange-500', component: SpellingBeeGame },
    wordRain: { name: 'Word Rain', icon: '🌧️', color: 'from-purple-500 to-pink-500', component: WordRainGame },
    speakCheck: { name: 'Speak & Check', icon: '🎤', color: 'from-red-500 to-pink-500', component: SpeakCheckGame },
  };
  
  const game = games[gameId];
  
  const handleComplete = (score) => {
    setFinalScore(score);
    setGameState('finished');
    completeGame(`english_${gameId}`, score);
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
        <p className="text-gray-500">Game không tồn tại</p>
        <button onClick={() => navigate('/english')} className="mt-4 text-indigo-600">Quay lại</button>
      </div>
    );
  }
  
  const GameComponent = game.component;
  
  if (gameState === 'finished') {
    const isGood = finalScore >= 500;
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-col items-center justify-center p-4">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
          <div className="text-6xl mb-4">{isGood ? '🎉' : '👍'}</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{isGood ? 'Xuất sắc!' : 'Tốt lắm!'}</h2>
          <p className="text-gray-500 mb-4">{game.name}</p>
          <div className="flex items-center justify-center gap-2 mb-6">
            <Trophy className="w-8 h-8 text-amber-500" />
            <span className="text-5xl font-bold text-indigo-600">{finalScore}</span>
            <span className="text-gray-500">điểm</span>
          </div>
          <div className="flex gap-3">
            <button onClick={handleRestart} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold flex items-center justify-center gap-2">
              <RotateCcw className="w-5 h-5" /> Chơi lại
            </button>
            <button onClick={() => navigate('/english')} className="flex-1 py-3 bg-indigo-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2">
              <Home className="w-5 h-5" /> English
            </button>
          </div>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className={`bg-gradient-to-r ${game.color} text-white px-4 py-4`}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/english')} className="p-2 rounded-full hover:bg-white/20">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <span className="text-3xl">{game.icon}</span>
          <h1 className="text-xl font-bold">{game.name}</h1>
        </div>
      </div>
      <div className="p-4">
        <GameComponent key={key} onComplete={handleComplete} />
      </div>
    </div>
  );
}
