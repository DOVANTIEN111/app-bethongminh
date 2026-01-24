import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useAudio } from '../contexts/AudioContext';
import { getTopic, getRandomWords } from '../data/englishVocab';
import { ArrowLeft, Volume2, Check, ChevronLeft, ChevronRight, Play, Mic, Star, Zap, Trophy, RotateCcw, Eye, EyeOff, Sparkles } from 'lucide-react';

// Chế độ học
const LEARN_MODES = [
  { id: 'flashcard', name: 'Flashcard', icon: '🎴', desc: 'Xem và học từng từ', color: 'from-blue-500 to-indigo-500' },
  { id: 'listen', name: 'Nghe & Chọn', icon: '👂', desc: 'Nghe và chọn đáp án đúng', color: 'from-purple-500 to-pink-500' },
  { id: 'spell', name: 'Điền từ', icon: '✍️', desc: 'Nhìn hình, điền từ', color: 'from-green-500 to-emerald-500' },
  { id: 'speak', name: 'Phát âm', icon: '🎤', desc: 'Luyện nói chuẩn', color: 'from-red-500 to-orange-500' },
  { id: 'match', name: 'Nối từ', icon: '🔗', desc: 'Nối từ với nghĩa', color: 'from-amber-500 to-yellow-500' },
];

// Component hiển thị sao đánh giá
const StarRating = ({ score }) => {
  const stars = score >= 90 ? 3 : score >= 70 ? 2 : score >= 50 ? 1 : 0;
  return (
    <div className="flex gap-1">
      {[1, 2, 3].map(i => (
        <Star key={i} className={`w-8 h-8 ${i <= stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
      ))}
    </div>
  );
};

// Component chọn chế độ học
const ModeSelector = ({ topic, onSelect, progress, onBack }) => {
  const navigate = useNavigate();
  const learnedCount = progress?.learned?.length || 0;
  const totalWords = topic.words.length;
  const percent = Math.round((learnedCount / totalWords) * 100);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className={`bg-gradient-to-r ${topic.color} text-white px-4 py-6`}>
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-white/20">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <span className="text-5xl">{topic.icon}</span>
          <div>
            <h1 className="text-2xl font-bold">{topic.name}</h1>
            <p className="text-white/80">{topic.nameVn} • {totalWords} từ vựng</p>
          </div>
        </div>
        
        {/* Progress */}
        <div className="bg-white/20 rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Tiến độ học</span>
            <span className="font-bold">{learnedCount}/{totalWords} từ ({percent}%)</span>
          </div>
          <div className="h-3 bg-white/30 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-white rounded-full"
            />
          </div>
          {percent === 100 && (
            <p className="text-center mt-2 font-bold">🎉 Hoàn thành xuất sắc!</p>
          )}
        </div>
      </div>
      
      {/* Learning Modes */}
      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" /> Chọn cách học
        </h2>
        
        <div className="space-y-3">
          {LEARN_MODES.map((mode, i) => (
            <motion.button
              key={mode.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => onSelect(mode.id)}
              className={`w-full bg-gradient-to-r ${mode.color} text-white rounded-2xl p-4 flex items-center gap-4 shadow-lg`}
            >
              <span className="text-4xl">{mode.icon}</span>
              <div className="flex-1 text-left">
                <p className="font-bold text-lg">{mode.name}</p>
                <p className="text-white/80 text-sm">{mode.desc}</p>
              </div>
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          ))}
        </div>
        
        {/* Word List Preview */}
        <div className="mt-6">
          <h2 className="text-lg font-bold text-gray-800 mb-3">📚 Danh sách từ vựng</h2>
          <div className="grid grid-cols-2 gap-2">
            {topic.words.map((w, i) => {
              const learned = progress?.learned?.includes(w.word);
              return (
                <motion.div
                  key={w.word}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className={`p-3 rounded-xl flex items-center gap-2 ${
                    learned ? 'bg-green-100 border-2 border-green-400' : 'bg-white border-2 border-gray-100'
                  }`}
                >
                  <span className="text-2xl">{w.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{w.word}</p>
                    <p className="text-xs text-gray-500 truncate">{w.vn}</p>
                  </div>
                  {learned && <Check className="w-4 h-4 text-green-500 flex-shrink-0" />}
                </motion.div>
              );
            })}
          </div>
        </div>
        
        {/* Sentences */}
        {topic.sentences && topic.sentences.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-bold text-gray-800 mb-3">💬 Câu mẫu</h2>
            <div className="space-y-2">
              {topic.sentences.map((s, i) => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="font-medium text-gray-800">{s.en}</p>
                  <p className="text-gray-500 text-sm mt-1">{s.vn}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// FLASHCARD MODE
const FlashcardMode = ({ topic, progress, onComplete, onBack, onMarkLearned }) => {
  const { playSound, speak } = useAudio();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  
  const word = topic.words[currentIndex];
  const isLearned = progress?.learned?.includes(word.word);
  
  const handleSpeak = () => {
    playSound('click');
    speak(word.word);
  };
  
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    setShowMeaning(!showMeaning);
    playSound('pop');
  };
  
  const handleNext = () => {
    if (currentIndex < topic.words.length - 1) {
      setCurrentIndex(i => i + 1);
      setIsFlipped(false);
      setShowMeaning(false);
    } else {
      onComplete(100);
    }
  };
  
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1);
      setIsFlipped(false);
      setShowMeaning(false);
    }
  };
  
  const handleLearn = () => {
    if (!isLearned) {
      onMarkLearned(word.word);
      playSound('correct');
    }
    setTimeout(handleNext, 300);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-indigo-100 pb-8">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur px-4 py-3 flex items-center justify-between">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <div className="text-center">
          <p className="font-bold text-gray-800">🎴 Flashcard</p>
          <p className="text-sm text-gray-500">{currentIndex + 1} / {topic.words.length}</p>
        </div>
        <div className="w-10" />
      </div>
      
      {/* Progress bar */}
      <div className="px-4 py-2">
        <div className="h-2 bg-white rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all"
            style={{ width: `${((currentIndex + 1) / topic.words.length) * 100}%` }}
          />
        </div>
      </div>
      
      {/* Flashcard */}
      <div className="px-4 py-8">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, rotateY: -90 }}
          animate={{ opacity: 1, rotateY: 0 }}
          className="perspective-1000"
        >
          <motion.div
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.4 }}
            onClick={handleFlip}
            className="relative w-full h-[350px] cursor-pointer preserve-3d"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Front */}
            <div 
              className="absolute inset-0 bg-white rounded-3xl shadow-xl p-6 flex flex-col items-center justify-center backface-hidden"
              style={{ backfaceVisibility: 'hidden' }}
            >
              {isLearned && (
                <div className="absolute top-4 right-4 bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  <Check className="w-4 h-4" /> Đã học
                </div>
              )}
              
              <motion.span 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-[100px]"
              >
                {word.emoji}
              </motion.span>
              
              <h2 className="text-4xl font-bold text-gray-800 mt-4">{word.word}</h2>
              
              <button 
                onClick={(e) => { e.stopPropagation(); handleSpeak(); }}
                className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full flex items-center gap-2"
              >
                <Volume2 className="w-5 h-5" /> Nghe
              </button>
              
              <p className="text-gray-400 mt-6 text-sm">👆 Chạm để xem nghĩa</p>
            </div>
            
            {/* Back */}
            <div 
              className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-3xl shadow-xl p-6 flex flex-col items-center justify-center text-white"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              <span className="text-6xl mb-4">{word.emoji}</span>
              <h2 className="text-3xl font-bold">{word.word}</h2>
              <p className="text-2xl mt-4 text-white/90">{word.vn}</p>
              <p className="text-white/60 mt-6 text-sm">👆 Chạm để lật lại</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Actions */}
      <div className="px-4 space-y-3">
        <div className="flex gap-3">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 ${
              currentIndex === 0 ? 'bg-gray-200 text-gray-400' : 'bg-white text-gray-700 shadow'
            }`}
          >
            <ChevronLeft className="w-5 h-5" /> Trước
          </button>
          
          <button
            onClick={handleLearn}
            className={`flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 ${
              isLearned 
                ? 'bg-green-100 text-green-600' 
                : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
            }`}
          >
            <Check className="w-5 h-5" /> {isLearned ? 'Tiếp' : 'Đã nhớ'}
          </button>
          
          <button
            onClick={handleNext}
            disabled={currentIndex === topic.words.length - 1}
            className={`flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 ${
              currentIndex === topic.words.length - 1 ? 'bg-gray-200 text-gray-400' : 'bg-white text-gray-700 shadow'
            }`}
          >
            Sau <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Quick nav */}
      <div className="px-4 mt-6">
        <div className="flex justify-center gap-1 flex-wrap">
          {topic.words.map((w, i) => (
            <button
              key={i}
              onClick={() => { setCurrentIndex(i); setIsFlipped(false); setShowMeaning(false); }}
              className={`w-3 h-3 rounded-full transition-all ${
                i === currentIndex 
                  ? 'w-8 bg-indigo-500' 
                  : progress?.learned?.includes(w.word) 
                    ? 'bg-green-400' 
                    : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// LISTEN MODE - Nghe và chọn đáp án (Thiết kế mới)
const ListenMode = ({ topic, progress, onComplete, onBack, onMarkLearned }) => {
  const { playSound, speak } = useAudio();
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showCorrect, setShowCorrect] = useState(false);
  const [wrongAnswer, setWrongAnswer] = useState(null);

  useEffect(() => {
    // Tạo 10 câu hỏi nghe
    const shuffled = [...topic.words].sort(() => Math.random() - 0.5);
    const qs = shuffled.slice(0, Math.min(10, topic.words.length)).map(word => {
      const wrongOptions = topic.words
        .filter(w => w.word !== word.word)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      const options = [...wrongOptions, word].sort(() => Math.random() - 0.5);

      return { word, options };
    });
    setQuestions(qs);
  }, [topic]);

  const currentQuestion = questions[currentQ];

  const handlePlayAudio = useCallback(() => {
    if (currentQuestion?.word?.word) {
      speak(currentQuestion.word.word);
    }
  }, [currentQuestion, speak]);

  // Tự động phát âm khi hiện câu hỏi
  useEffect(() => {
    if (currentQuestion && !showCorrect) {
      const timer = setTimeout(() => {
        if (currentQuestion?.word?.word) {
          speak(currentQuestion.word.word);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentQuestion, showCorrect, speak]);

  const handleSelect = (option) => {
    if (showCorrect || !currentQuestion) return;

    const isCorrect = option.word === currentQuestion.word.word;

    if (isCorrect) {
      // Đúng: hiện thông báo và chuyển câu tiếp
      playSound('correct');
      setScore(s => s + 1);
      onMarkLearned(currentQuestion.word.word);
      setShowCorrect(true);

      // Chuyển câu tiếp sau 1.5 giây
      setTimeout(() => {
        if (currentQ < questions.length - 1) {
          setCurrentQ(q => q + 1);
          setShowCorrect(false);
          setWrongAnswer(null);
        } else {
          const finalScore = Math.round(((score + 1) / questions.length) * 100);
          onComplete(finalScore);
        }
      }, 1500);
    } else {
      // Sai: rung nhẹ và cho chọn lại
      playSound('wrong');
      setWrongAnswer(option.word);

      // Reset trạng thái sai sau 500ms
      setTimeout(() => {
        setWrongAnswer(null);
      }, 500);
    }
  };

  // Loading state
  if (questions.length === 0 || !currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">👂</div>
          <p className="text-gray-600">Đang tải câu hỏi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 pb-8">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur px-4 py-3 flex items-center justify-between">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <div className="text-center">
          <p className="font-bold text-gray-800">👂 Nghe & Chọn</p>
          <p className="text-sm text-gray-500">Câu {currentQ + 1} / {questions.length}</p>
        </div>
        <div className="bg-green-100 px-3 py-1 rounded-full text-green-600 font-bold">
          {score}/{currentQ + (showCorrect ? 1 : 0)}
        </div>
      </div>

      {/* Progress */}
      <div className="px-4 py-2">
        <div className="h-2 bg-white rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
            style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="px-4 py-6">
        {/* Hình ảnh lớn + nút nghe */}
        <div className="bg-white rounded-3xl shadow-xl p-6 text-center mb-6">
          <p className="text-gray-500 mb-2">Nghe và chọn nghĩa đúng</p>

          {/* Emoji/Hình ảnh lớn */}
          <motion.div
            key={currentQ}
            initial={{ scale: 0 }}
            animate={{ scale: 1, y: [0, -8, 0] }}
            transition={{
              scale: { duration: 0.3 },
              y: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
            }}
            className="text-[120px] leading-none mb-4"
          >
            {currentQuestion.word.emoji}
          </motion.div>

          {/* Nút Nghe lại */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handlePlayAudio}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center gap-2 mx-auto shadow-lg"
          >
            <Volume2 className="w-6 h-6" />
            <span className="font-bold">Nghe lại</span>
          </motion.button>
        </div>

        {/* Thông báo đúng */}
        <AnimatePresence>
          {showCorrect && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-green-100 border-2 border-green-400 rounded-2xl p-4 text-center mb-4"
            >
              <p className="text-3xl mb-1">🎉</p>
              <p className="text-green-700 font-bold text-lg">Đúng rồi!</p>
              <p className="text-green-600">
                <strong>{currentQuestion.word.word}</strong> = {currentQuestion.word.vn}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Options - Chữ tiếng Việt */}
        {!showCorrect && currentQuestion.options && (
          <div className="grid grid-cols-2 gap-3">
            {currentQuestion.options.map((option, i) => {
              const isWrong = wrongAnswer === option.word;

              return (
                <motion.button
                  key={option.word}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    x: isWrong ? [-8, 8, -8, 8, 0] : 0
                  }}
                  transition={{
                    opacity: { delay: i * 0.1 },
                    y: { delay: i * 0.1 },
                    x: { duration: 0.4 }
                  }}
                  onClick={() => handleSelect(option)}
                  className={`bg-white border-2 rounded-2xl p-5 text-center transition-all ${
                    isWrong
                      ? 'border-red-400 bg-red-50'
                      : 'border-gray-200 hover:border-purple-400 active:scale-95'
                  }`}
                >
                  <p className="font-bold text-xl text-gray-800">{option.vn}</p>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// SPELL MODE - Điền từ
const SpellMode = ({ topic, progress, onComplete, onBack, onMarkLearned }) => {
  const { playSound, speak } = useAudio();
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [input, setInput] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  
  useEffect(() => {
    const shuffled = [...topic.words].sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, Math.min(10, topic.words.length)));
  }, [topic]);
  
  const currentWord = questions[currentQ];
  
  const handleSubmit = () => {
    if (!input.trim()) return;
    
    const isCorrect = input.toLowerCase().trim() === currentWord.word.toLowerCase();
    setShowResult(true);
    
    if (isCorrect) {
      playSound('correct');
      setScore(s => s + 1);
      onMarkLearned(currentWord.word);
    } else {
      playSound('wrong');
    }
  };
  
  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(q => q + 1);
      setInput('');
      setShowResult(false);
      setShowHint(false);
    } else {
      const finalScore = Math.round((score / questions.length) * 100);
      onComplete(finalScore);
    }
  };
  
  const handleHint = () => {
    setShowHint(true);
    speak(currentWord.word);
  };
  
  if (questions.length === 0) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-emerald-100 pb-8">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur px-4 py-3 flex items-center justify-between">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <div className="text-center">
          <p className="font-bold text-gray-800">✍️ Điền từ</p>
          <p className="text-sm text-gray-500">Câu {currentQ + 1} / {questions.length}</p>
        </div>
        <div className="bg-green-100 px-3 py-1 rounded-full text-green-600 font-bold">
          {score}/{currentQ + (showResult ? 1 : 0)}
        </div>
      </div>
      
      {/* Progress */}
      <div className="px-4 py-2">
        <div className="h-2 bg-white rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all"
            style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>
      
      {/* Question */}
      <div className="px-4 py-6">
        <div className="bg-white rounded-3xl shadow-xl p-6 text-center">
          <p className="text-gray-500 mb-4">Nhìn hình và điền từ tiếng Anh</p>
          
          <motion.div
            key={currentQ}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-[100px] mb-4"
          >
            {currentWord.emoji}
          </motion.div>
          
          <p className="text-xl text-gray-700 font-medium mb-4">{currentWord.vn}</p>
          
          {/* Hint */}
          {showHint && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-yellow-50 rounded-xl p-3 mb-4"
            >
              <p className="text-yellow-700">
                💡 Gợi ý: <strong>{currentWord.word.charAt(0)}{"_".repeat(currentWord.word.length - 1)}</strong>
              </p>
            </motion.div>
          )}
          
          {!showResult ? (
            <>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="Nhập từ tiếng Anh..."
                className="w-full text-center text-2xl font-bold border-2 border-gray-200 rounded-xl p-4 focus:border-green-500 focus:outline-none"
                autoFocus
              />
              
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleHint}
                  disabled={showHint}
                  className="flex-1 py-3 bg-yellow-100 text-yellow-700 rounded-xl font-medium flex items-center justify-center gap-2"
                >
                  <Eye className="w-5 h-5" /> Gợi ý
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!input.trim()}
                  className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold"
                >
                  Kiểm tra
                </button>
              </div>
            </>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className={`p-4 rounded-2xl mb-4 ${
                input.toLowerCase().trim() === currentWord.word.toLowerCase()
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                <p className="text-2xl mb-1">
                  {input.toLowerCase().trim() === currentWord.word.toLowerCase() ? '🎉 Chính xác!' : '😅 Chưa đúng!'}
                </p>
                <p>Đáp án: <strong className="text-2xl">{currentWord.word}</strong></p>
              </div>
              
              <button
                onClick={handleNext}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-bold text-lg"
              >
                {currentQ < questions.length - 1 ? 'Câu tiếp theo →' : 'Xem kết quả 🏆'}
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

// SPEAK MODE - Luyện phát âm
const SpeakMode = ({ topic, progress, onComplete, onBack, onMarkLearned }) => {
  const { playSound, speak, startListening, isListening, speechSupported, isIOS } = useAudio();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const word = topic.words[currentIndex];

  const handleListen = () => {
    speak(word.word);
    playSound('click');
  };

  const handleSpeak = () => {
    if (!speechSupported) {
      setResult({
        error: 'not_supported',
        message: isIOS
          ? 'iPhone/iPad không hỗ trợ nhận diện giọng nói. Vui lòng dùng máy tính hoặc điện thoại Android.'
          : 'Trình duyệt không hỗ trợ. Vui lòng dùng Chrome hoặc Edge.'
      });
      return;
    }

    setResult(null);
    startListening(word.word, (res) => {
      setResult(res);
      setAttempts(a => a + 1);

      if (res.success && res.score >= 70) {
        playSound('correct');
        setScore(s => s + 1);
        onMarkLearned(word.word);
      } else if (!res.error) {
        playSound('wrong');
      }
    });
  };

  const handleNext = () => {
    if (currentIndex < topic.words.length - 1) {
      setCurrentIndex(i => i + 1);
      setResult(null);
    } else {
      const finalScore = Math.round((score / topic.words.length) * 100);
      onComplete(finalScore);
    }
  };

  // Hiển thị thông báo đặc biệt cho iOS
  if (!speechSupported) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 text-center max-w-sm shadow-xl">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">{isIOS ? '📱' : '🎤'}</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            {isIOS ? 'iPhone/iPad không hỗ trợ' : 'Trình duyệt không hỗ trợ'}
          </h2>
          <p className="text-gray-500 mb-6">
            {isIOS
              ? 'Tính năng nhận diện giọng nói chưa được hỗ trợ trên Safari iOS. Vui lòng sử dụng máy tính hoặc điện thoại Android để luyện phát âm.'
              : 'Vui lòng sử dụng trình duyệt Chrome hoặc Edge để luyện phát âm.'}
          </p>

          {/* Gợi ý các chế độ khác */}
          <div className="bg-blue-50 rounded-xl p-4 mb-4">
            <p className="text-blue-700 text-sm font-medium mb-2">💡 Bạn vẫn có thể:</p>
            <ul className="text-blue-600 text-sm text-left space-y-1">
              <li>• Nghe phát âm chuẩn với chế độ Flashcard</li>
              <li>• Luyện nghe với chế độ Nghe & Chọn</li>
              <li>• Luyện viết với chế độ Điền từ</li>
            </ul>
          </div>

          <button
            onClick={onBack}
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-bold"
          >
            Chọn cách học khác
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-100 to-orange-100 pb-8">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur px-4 py-3 flex items-center justify-between">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <div className="text-center">
          <p className="font-bold text-gray-800">🎤 Luyện phát âm</p>
          <p className="text-sm text-gray-500">{currentIndex + 1} / {topic.words.length}</p>
        </div>
        <div className="bg-green-100 px-3 py-1 rounded-full text-green-600 font-bold">
          {score}/{currentIndex + (result?.success ? 1 : 0)}
        </div>
      </div>
      
      {/* Progress */}
      <div className="px-4 py-2">
        <div className="h-2 bg-white rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all"
            style={{ width: `${((currentIndex + 1) / topic.words.length) * 100}%` }}
          />
        </div>
      </div>
      
      {/* Content */}
      <div className="px-4 py-6">
        <div className="bg-white rounded-3xl shadow-xl p-6 text-center">
          <motion.div
            key={currentIndex}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-[80px] mb-4"
          >
            {word.emoji}
          </motion.div>
          
          <h2 className="text-4xl font-bold text-gray-800 mb-2">{word.word}</h2>
          <p className="text-gray-500 mb-4">{word.vn}</p>
          
          {/* Listen button */}
          <button
            onClick={handleListen}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full flex items-center gap-2 mx-auto mb-6"
          >
            <Volume2 className="w-5 h-5" /> Nghe mẫu
          </button>
          
          {/* Result */}
          {result && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-6"
            >
              {result.success && result.score >= 70 ? (
                <div className="bg-green-100 rounded-2xl p-4">
                  <p className="text-3xl mb-2">{result.score >= 90 ? '🌟' : result.score >= 80 ? '⭐' : '👍'}</p>
                  <p className="text-green-700 font-bold text-lg">
                    {result.score >= 90 ? 'Xuất sắc!' : result.score >= 80 ? 'Rất tốt!' : 'Tốt lắm!'}
                  </p>
                  <p className="text-green-600">Điểm: {result.score}/100</p>
                </div>
              ) : result.error === 'no_speech' ? (
                <div className="bg-yellow-100 rounded-2xl p-4">
                  <p className="text-3xl mb-2">🤔</p>
                  <p className="text-yellow-700 font-bold">Không nghe thấy</p>
                  <p className="text-yellow-600 text-sm">{result.message || 'Nói to và rõ hơn nhé!'}</p>
                </div>
              ) : result.error === 'not_allowed' ? (
                <div className="bg-red-100 rounded-2xl p-4">
                  <p className="text-3xl mb-2">🎤</p>
                  <p className="text-red-700 font-bold">Chưa cấp quyền Microphone</p>
                  <p className="text-red-600 text-sm">{result.message || 'Vui lòng cho phép truy cập microphone trong cài đặt trình duyệt.'}</p>
                </div>
              ) : result.error === 'network' ? (
                <div className="bg-blue-100 rounded-2xl p-4">
                  <p className="text-3xl mb-2">📶</p>
                  <p className="text-blue-700 font-bold">Lỗi kết nối</p>
                  <p className="text-blue-600 text-sm">{result.message || 'Vui lòng kiểm tra kết nối internet.'}</p>
                </div>
              ) : result.error ? (
                <div className="bg-gray-100 rounded-2xl p-4">
                  <p className="text-3xl mb-2">⚠️</p>
                  <p className="text-gray-700 font-bold">Có lỗi xảy ra</p>
                  <p className="text-gray-600 text-sm">{result.message || 'Vui lòng thử lại.'}</p>
                </div>
              ) : (
                <div className="bg-orange-100 rounded-2xl p-4">
                  <p className="text-3xl mb-2">💪</p>
                  <p className="text-orange-700 font-bold">Thử lại nhé!</p>
                  {result.transcript && (
                    <p className="text-orange-600 text-sm">Bạn nói: "{result.transcript}"</p>
                  )}
                  {result.score > 0 && (
                    <p className="text-orange-500 text-xs mt-1">Độ chính xác: {result.score}%</p>
                  )}
                </div>
              )}
            </motion.div>
          )}
          
          {/* Speak button */}
          {isListening ? (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="bg-red-100 rounded-2xl p-6"
            >
              <div className="flex justify-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [8, 32, 8] }}
                    transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                    className="w-2 bg-red-400 rounded-full"
                  />
                ))}
              </div>
              <p className="text-red-600 font-bold">Đang nghe... Nói: "{word.word}"</p>
            </motion.div>
          ) : (
            <button
              onClick={handleSpeak}
              className="w-full py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2"
            >
              <Mic className="w-6 h-6" /> Bấm để nói "{word.word}"
            </button>
          )}
        </div>
        
        {/* Next button */}
        {result?.success && result.score >= 70 && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleNext}
            className="w-full mt-4 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-bold text-lg"
          >
            {currentIndex < topic.words.length - 1 ? 'Từ tiếp theo →' : 'Xem kết quả 🏆'}
          </motion.button>
        )}
        
        {/* Skip button */}
        {!result?.success && (
          <button
            onClick={handleNext}
            className="w-full mt-4 py-3 text-gray-500 underline"
          >
            Bỏ qua từ này
          </button>
        )}
      </div>
    </div>
  );
};

// MATCH MODE - Nối từ
const MatchMode = ({ topic, progress, onComplete, onBack, onMarkLearned }) => {
  const { playSound } = useAudio();
  const [words, setWords] = useState([]);
  const [meanings, setMeanings] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [matched, setMatched] = useState([]);
  const [wrong, setWrong] = useState(null);
  
  useEffect(() => {
    const shuffledWords = [...topic.words].sort(() => Math.random() - 0.5).slice(0, 6);
    setWords(shuffledWords.map(w => ({ ...w, id: `w_${w.word}` })));
    setMeanings([...shuffledWords].sort(() => Math.random() - 0.5).map(w => ({ ...w, id: `m_${w.word}` })));
  }, [topic]);
  
  const handleSelectWord = (word) => {
    if (matched.includes(word.word)) return;
    setSelectedWord(word);
    setWrong(null);
  };
  
  const handleSelectMeaning = (meaning) => {
    if (!selectedWord || matched.includes(meaning.word)) return;
    
    if (selectedWord.word === meaning.word) {
      // Correct match
      playSound('correct');
      setMatched([...matched, meaning.word]);
      onMarkLearned(meaning.word);
      setSelectedWord(null);
      
      // Check if completed
      if (matched.length + 1 === words.length) {
        setTimeout(() => onComplete(100), 500);
      }
    } else {
      // Wrong match
      playSound('wrong');
      setWrong(meaning.word);
      setTimeout(() => {
        setWrong(null);
        setSelectedWord(null);
      }, 500);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-100 to-yellow-100 pb-8">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur px-4 py-3 flex items-center justify-between">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <div className="text-center">
          <p className="font-bold text-gray-800">🔗 Nối từ</p>
          <p className="text-sm text-gray-500">{matched.length} / {words.length}</p>
        </div>
        <div className="w-10" />
      </div>
      
      {/* Progress */}
      <div className="px-4 py-2">
        <div className="h-2 bg-white rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full transition-all"
            style={{ width: `${(matched.length / words.length) * 100}%` }}
          />
        </div>
      </div>
      
      {/* Game */}
      <div className="px-4 py-6">
        <p className="text-center text-gray-600 mb-4">Nối từ tiếng Anh với nghĩa tiếng Việt</p>
        
        <div className="flex gap-4">
          {/* Words column */}
          <div className="flex-1 space-y-2">
            {words.map((word) => {
              const isMatched = matched.includes(word.word);
              const isSelected = selectedWord?.word === word.word;
              
              return (
                <motion.button
                  key={word.id}
                  onClick={() => handleSelectWord(word)}
                  disabled={isMatched}
                  className={`w-full p-3 rounded-xl text-left flex items-center gap-2 transition-all ${
                    isMatched 
                      ? 'bg-green-100 border-2 border-green-400 opacity-50'
                      : isSelected
                        ? 'bg-amber-200 border-2 border-amber-500 scale-105'
                        : 'bg-white border-2 border-gray-100'
                  }`}
                >
                  <span className="text-2xl">{word.emoji}</span>
                  <span className="font-bold text-gray-800">{word.word}</span>
                </motion.button>
              );
            })}
          </div>
          
          {/* Meanings column */}
          <div className="flex-1 space-y-2">
            {meanings.map((meaning) => {
              const isMatched = matched.includes(meaning.word);
              const isWrong = wrong === meaning.word;
              
              return (
                <motion.button
                  key={meaning.id}
                  onClick={() => handleSelectMeaning(meaning)}
                  disabled={isMatched || !selectedWord}
                  animate={isWrong ? { x: [-5, 5, -5, 5, 0] } : {}}
                  className={`w-full p-3 rounded-xl text-left transition-all ${
                    isMatched 
                      ? 'bg-green-100 border-2 border-green-400 opacity-50'
                      : isWrong
                        ? 'bg-red-100 border-2 border-red-400'
                        : selectedWord
                          ? 'bg-white border-2 border-amber-200 hover:border-amber-400'
                          : 'bg-gray-100 border-2 border-gray-100'
                  }`}
                >
                  <span className="text-gray-800">{meaning.vn}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
        
        {/* Reset button */}
        <button
          onClick={() => {
            setMatched([]);
            setSelectedWord(null);
            setWrong(null);
            const shuffledWords = [...topic.words].sort(() => Math.random() - 0.5).slice(0, 6);
            setWords(shuffledWords.map(w => ({ ...w, id: `w_${w.word}` })));
            setMeanings([...shuffledWords].sort(() => Math.random() - 0.5).map(w => ({ ...w, id: `m_${w.word}` })));
          }}
          className="w-full mt-6 py-3 bg-white rounded-xl text-gray-600 flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-5 h-5" /> Chơi lại
        </button>
      </div>
    </div>
  );
};

// COMPLETION SCREEN
const CompletionScreen = ({ score, topic, onRestart, onBack, onNavigateBack }) => {
  const { playSound } = useAudio();

  useEffect(() => {
    playSound('achievement');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-500 to-purple-600 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-8 text-center w-full max-w-sm"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 0.5 }}
          className="text-7xl mb-4"
        >
          🏆
        </motion.div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">Hoàn thành!</h2>
        <p className="text-gray-500 mb-4">{topic.name}</p>

        <div className="flex justify-center mb-4">
          <StarRating score={score} />
        </div>

        <div className="bg-indigo-100 rounded-2xl p-4 mb-6">
          <p className="text-4xl font-bold text-indigo-600">{score}%</p>
          <p className="text-indigo-500">Điểm của bạn</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={onRestart}
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-bold flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" /> Học lại
          </button>
          <button
            onClick={onBack}
            className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium"
          >
            Chọn cách học khác
          </button>
          <button
            onClick={onNavigateBack}
            className="w-full py-3 bg-blue-100 text-blue-700 rounded-xl font-medium"
          >
            Quay về danh sách bài học
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Mapping lessonId (e1, e2...) to topic
const LESSON_TO_TOPIC = {
  // Level 1: Làm quen (3-4 tuổi)
  'e1': 'food',        // 🍎 Trái cây
  'e2': 'animals',     // 🐕 Con vật
  'e3': 'colors',      // 🔴 Màu sắc
  'e4': 'numbers',     // 1️⃣ Số 1-5
  'e5': 'family',      // 👨‍👩‍👧 Gia đình
  'e6': 'food',        // 🍕 Đồ ăn
  // Level 2: Mở rộng (4-5 tuổi)
  'e7': 'animals',     // 🐘 Thú hoang dã
  'e8': 'vegetables',  // 🥕 Rau củ ✅ SỬA
  'e9': 'shapes',      // ⭕ Hình dạng ✅ SỬA
  'e10': 'numbers',    // 6️⃣ Số 6-10
  'e11': 'clothes',    // 👕 Quần áo
  'e12': 'toys',       // 🧸 Đồ chơi
  'e13': 'home',       // 🏠 Trong nhà
  'e14': 'body',       // 👀 Cơ thể
  // Level 3: Giao tiếp (5-6 tuổi)
  'e15': 'greetings',  // 👋 Chào hỏi ✅ SỬA
  'e16': 'emotions',   // 😊 Cảm xúc ✅ SỬA
  'e17': 'weather',    // 🌤️ Thời tiết
  'e18': 'actions',    // 🎯 Hành động
  'e19': 'questions',  // ❓ Hỏi đáp ✅ SỬA
  'e20': 'phrases',    // 💬 Câu ngắn ✅ SỬA
};

// MAIN COMPONENT
export default function EnglishLessonPage() {
  const { topicId: urlTopicId, lessonId } = useParams();
  const navigate = useNavigate();
  const { currentChild, updateChild, profile } = useAuth();
  const { playSound } = useAudio();

  // Support both formats:
  // - New: /english/:topicId (e.g., /english/animals)
  // - Old: /english/:lessonId (e.g., /english/e1 -> maps to 'food')
  const paramId = urlTopicId || lessonId;

  // First try direct topic ID, then try mapping from lessonId
  let topicId = paramId;
  let topic = getTopic(topicId);

  if (!topic) {
    // Try mapping from old lessonId format (e1, e2, etc.)
    topicId = LESSON_TO_TOPIC[paramId] || 'animals';
    topic = getTopic(topicId);
  }
  const [mode, setMode] = useState(null); // null = selector, or mode id
  const [completed, setCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // Check if user is a student (vs parent viewing for child)
  const isStudent = profile?.role === 'student';

  // Navigate back handler - different for student vs parent
  const handleNavigateBack = () => {
    if (isStudent) {
      navigate('/learn/lessons');
    } else {
      navigate('/subject/english');
    }
  };

  if (!topic) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Bài học không tồn tại</p>
      </div>
    );
  }

  // Get progress - for students use localStorage, for parents use currentChild
  const getProgress = () => {
    if (isStudent) {
      const stored = localStorage.getItem('english_progress');
      const allProgress = stored ? JSON.parse(stored) : {};
      return allProgress[topicId] || { learned: [] };
    }
    return currentChild?.englishProgress?.[topicId] || { learned: [] };
  };

  const progress = getProgress();

  const handleMarkLearned = (word) => {
    if (isStudent) {
      // Save to localStorage for students
      const stored = localStorage.getItem('english_progress');
      const allProgress = stored ? JSON.parse(stored) : {};
      if (!allProgress[topicId]) {
        allProgress[topicId] = { learned: [] };
      }
      if (!allProgress[topicId].learned.includes(word)) {
        allProgress[topicId].learned.push(word);
        localStorage.setItem('english_progress', JSON.stringify(allProgress));
      }
    } else if (currentChild && updateChild) {
      // For parent viewing child
      const member = { ...currentChild };
      if (!member.englishProgress) member.englishProgress = {};
      if (!member.englishProgress[topicId]) {
        member.englishProgress[topicId] = { learned: [] };
      }
      if (!member.englishProgress[topicId].learned.includes(word)) {
        member.englishProgress[topicId].learned.push(word);
        member.xp = (member.xp || 0) + 5;

        // Cộng XP cho pet nếu có
        if (member.pet) {
          member.pet.xp = (member.pet.xp || 0) + 2;
          member.pet.lastFed = Date.now();
        }

        updateChild(member);
      }
    }
  };

  const handleComplete = (score) => {
    setFinalScore(score);
    setCompleted(true);

    if (!isStudent && currentChild && updateChild) {
      // Bonus XP for parent's child
      const member = { ...currentChild };
      member.xp = (member.xp || 0) + Math.round(score / 5);
      updateChild(member);
    }
  };

  const handleRestart = () => {
    setCompleted(false);
    setFinalScore(0);
  };

  const handleBack = () => {
    setMode(null);
    setCompleted(false);
  };
  
  // Show completion screen
  if (completed) {
    return (
      <CompletionScreen
        score={finalScore}
        topic={topic}
        onRestart={handleRestart}
        onBack={handleBack}
        onNavigateBack={handleNavigateBack}
      />
    );
  }
  
  // Show mode selector
  if (!mode) {
    return (
      <ModeSelector
        topic={topic}
        progress={progress}
        onSelect={(m) => { playSound('click'); setMode(m); }}
        onBack={handleNavigateBack}
      />
    );
  }

  // Render selected mode
  const modeProps = {
    topic,
    progress,
    onComplete: handleComplete,
    onBack: handleBack,
    onMarkLearned: handleMarkLearned,
  };

  switch (mode) {
    case 'flashcard':
      return <FlashcardMode {...modeProps} />;
    case 'listen':
      return <ListenMode {...modeProps} />;
    case 'spell':
      return <SpellMode {...modeProps} />;
    case 'speak':
      return <SpeakMode {...modeProps} />;
    case 'match':
      return <MatchMode {...modeProps} />;
    default:
      return <ModeSelector topic={topic} progress={progress} onSelect={setMode} onBack={handleNavigateBack} />;
  }
}
