import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useMember } from '../contexts/MemberContext';
import { useAudio } from '../contexts/AudioContext';
import { getStory } from '../data/stories';
import { ArrowLeft, Lock, ChevronLeft, ChevronRight, Star, BookOpen, CheckCircle, XCircle, Volume2, VolumeX, Sparkles, Pause, Play, Loader2 } from 'lucide-react';

// FPT.AI Text-to-Speech API
const FPT_API_KEY = 'nlzVb59O6i3UHC0hO1qh6lTyhUGD1fWb';
const FPT_TTS_URL = 'https://api.fpt.ai/hmi/tts/v5';

// Hook để đọc truyện bằng FPT.AI (Tiếng Việt tự nhiên)
const useFPTSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);
  
  // Tạo audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.onplay = () => {
      setIsSpeaking(true);
      setIsLoading(false);
    };
    audioRef.current.onended = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    audioRef.current.onerror = () => {
      setIsSpeaking(false);
      setIsLoading(false);
      setError('Không thể phát âm thanh');
    };
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  const speak = useCallback(async (text) => {
    if (!text) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Gọi FPT.AI API
      const response = await fetch(FPT_TTS_URL, {
        method: 'POST',
        headers: {
          'api-key': FPT_API_KEY,
          'Content-Type': 'application/x-www-form-urlencoded',
          'voice': 'banmai', // Giọng nữ miền Bắc - kể chuyện hay
          'speed': '-1', // Chậm hơn một chút để trẻ nghe rõ (-3 đến 3)
        },
        body: text
      });
      
      const data = await response.json();
      
      if (data.error === 0 && data.async) {
        // FPT.AI trả về URL audio
        // Đợi một chút để file audio được tạo
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (audioRef.current) {
          audioRef.current.src = data.async;
          audioRef.current.play();
        }
      } else {
        throw new Error(data.message || 'Lỗi từ FPT.AI');
      }
    } catch (err) {
      console.error('FPT TTS Error:', err);
      setError(err.message);
      setIsLoading(false);
      
      // Fallback về Web Speech API nếu FPT.AI lỗi
      fallbackSpeak(text);
    }
  }, []);
  
  // Fallback về Web Speech API
  const fallbackSpeak = useCallback((text) => {
    if (!('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.9;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    window.speechSynthesis.speak(utterance);
  }, []);
  
  const pause = useCallback(() => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setIsPaused(true);
    }
  }, []);
  
  const resume = useCallback(() => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play();
      setIsPaused(false);
    }
  }, []);
  
  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsSpeaking(false);
    setIsPaused(false);
    setIsLoading(false);
  }, []);
  
  return { speak, pause, resume, stop, isSpeaking, isPaused, isLoading, error };
};

// Component hiển thị chương bị khóa
const LockedChapter = ({ chaptersNeeded, onBack }) => (
  <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center p-4">
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white rounded-3xl p-8 text-center max-w-sm w-full shadow-xl"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-7xl mb-4"
      >
        🔒
      </motion.div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Chương này bị khóa!</h2>
      <p className="text-gray-600 mb-6">
        Học bài thêm <strong className="text-orange-500">{chaptersNeeded} ngày</strong> liên tiếp để mở khóa chương này nhé!
      </p>
      
      <div className="bg-amber-50 rounded-xl p-4 mb-6">
        <p className="text-amber-700 text-sm">
          💡 <strong>Mẹo:</strong> Mỗi ngày học liên tiếp sẽ mở thêm 1 chương truyện!
        </p>
      </div>
      
      <button
        onClick={onBack}
        className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold"
      >
        Quay lại học bài
      </button>
    </motion.div>
  </div>
);

// Component quiz sau mỗi chương
const ChapterQuiz = ({ chapter, onCorrect, onWrong }) => {
  const { playSound } = useAudio();
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  
  const handleSelect = (index) => {
    if (showResult) return;
    
    setSelected(index);
    setShowResult(true);
    
    if (index === chapter.answer) {
      playSound('correct');
      setTimeout(onCorrect, 1500);
    } else {
      playSound('wrong');
      setTimeout(onWrong, 1500);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 mt-6"
    >
      <h3 className="font-bold text-purple-700 mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5" /> Câu hỏi kiểm tra
      </h3>
      
      <p className="text-gray-800 font-medium mb-4">{chapter.question}</p>
      
      <div className="space-y-2">
        {chapter.options.map((option, idx) => {
          let bgClass = 'bg-white border-gray-200 hover:border-purple-300';
          
          if (showResult) {
            if (idx === chapter.answer) {
              bgClass = 'bg-green-100 border-green-500';
            } else if (idx === selected) {
              bgClass = 'bg-red-100 border-red-500';
            }
          } else if (selected === idx) {
            bgClass = 'bg-purple-100 border-purple-500';
          }
          
          return (
            <motion.button
              key={idx}
              whileTap={!showResult ? { scale: 0.98 } : {}}
              onClick={() => handleSelect(idx)}
              disabled={showResult}
              className={`w-full p-4 rounded-xl border-2 text-left flex items-center gap-3 transition-all ${bgClass}`}
            >
              <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="flex-1 text-gray-800">{option}</span>
              {showResult && idx === chapter.answer && (
                <CheckCircle className="w-6 h-6 text-green-500" />
              )}
              {showResult && idx === selected && idx !== chapter.answer && (
                <XCircle className="w-6 h-6 text-red-500" />
              )}
            </motion.button>
          );
        })}
      </div>
      
      {showResult && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 p-4 rounded-xl text-center ${
            selected === chapter.answer ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
          }`}
        >
          {selected === chapter.answer ? (
            <p className="font-bold">🎉 Đúng rồi! Giỏi quá!</p>
          ) : (
            <p className="font-bold">💪 Đáp án đúng là: {chapter.options[chapter.answer]}</p>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

// Component hoàn thành truyện
const StoryComplete = ({ story, onRestart, onBack }) => {
  const { playSound } = useAudio();
  
  useEffect(() => {
    playSound('achievement');
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-400 to-orange-500 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-8 text-center max-w-sm w-full shadow-2xl"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 0.5, repeat: 3 }}
          className="text-7xl mb-4"
        >
          🏆
        </motion.div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Hoàn thành truyện!</h2>
        <p className="text-gray-600 mb-4">{story.title}</p>
        
        <div className="flex justify-center gap-1 mb-6">
          {[1, 2, 3].map(i => (
            <Star key={i} className="w-10 h-10 text-yellow-400 fill-yellow-400" />
          ))}
        </div>
        
        <div className="bg-green-50 rounded-xl p-4 mb-6">
          <p className="text-green-700 font-bold text-lg">+50 XP</p>
          <p className="text-green-600 text-sm">Phần thưởng hoàn thành truyện!</p>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={onRestart}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold"
          >
            📖 Đọc lại từ đầu
          </button>
          <button
            onClick={onBack}
            className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium"
          >
            Chọn truyện khác
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Audio player component với FPT.AI
const AudioPlayer = ({ isPlaying, isPaused, isLoading, onPlay, onPause, onResume, onStop, error }) => {
  return (
    <div className="flex items-center gap-2">
      {isLoading ? (
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-600 rounded-full">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Đang tải...</span>
        </div>
      ) : !isPlaying ? (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onPlay}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full font-medium shadow-lg"
        >
          <Volume2 className="w-5 h-5" />
          <span>Nghe đọc</span>
        </motion.button>
      ) : (
        <div className="flex items-center gap-2">
          {isPaused ? (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onResume}
              className="p-3 bg-green-500 text-white rounded-full shadow-lg"
            >
              <Play className="w-5 h-5" />
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onPause}
              className="p-3 bg-amber-500 text-white rounded-full shadow-lg"
            >
              <Pause className="w-5 h-5" />
            </motion.button>
          )}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onStop}
            className="p-3 bg-red-500 text-white rounded-full shadow-lg"
          >
            <VolumeX className="w-5 h-5" />
          </motion.button>
          
          {/* Animated waves */}
          {!isPaused && (
            <div className="flex items-center gap-1 ml-2">
              {[1, 2, 3, 4, 5].map(i => (
                <motion.div
                  key={i}
                  animate={{ height: [8, 20, 8] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                  className="w-1 bg-green-500 rounded-full"
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function StoryReadPage() {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const { currentMember, updateMember } = useMember();
  const { playSound } = useAudio();
  const { speak, pause, resume, stop, isSpeaking, isPaused, isLoading, error } = useFPTSpeech();
  
  const story = getStory(storyId);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  const [completed, setCompleted] = useState(false);
  
  const streak = currentMember?.stats?.streak || 0;
  const storyProgress = currentMember?.storyProgress?.[storyId] || {};
  
  // Số chương đã mở (dựa trên streak) - minimum 1 chương luôn mở
  const unlockedChapters = Math.min(Math.max(1, streak + 1), story?.totalChapters || 0);
  
  // Khôi phục vị trí đọc
  useEffect(() => {
    if (storyProgress.lastChapter && storyProgress.lastChapter > 0) {
      setCurrentChapter(Math.min(storyProgress.lastChapter, unlockedChapters - 1));
    }
  }, [storyId]);
  
  // Dừng đọc khi chuyển chương
  useEffect(() => {
    stop();
  }, [currentChapter]);
  
  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Truyện không tồn tại</p>
      </div>
    );
  }
  
  const chapter = story.chapters[currentChapter];
  const isLocked = currentChapter >= unlockedChapters;
  const chaptersNeeded = currentChapter - unlockedChapters + 1;
  
  // Đọc truyện bằng FPT.AI
  const handleReadAloud = () => {
    playSound('click');
    // Đọc tiêu đề + nội dung
    const textToRead = `${chapter.title}. ${chapter.content}`;
    speak(textToRead);
  };
  
  // Lưu tiến độ đọc
  const saveProgress = (chapterIdx) => {
    const member = { ...currentMember };
    if (!member.storyProgress) member.storyProgress = {};
    if (!member.storyProgress[storyId]) {
      member.storyProgress[storyId] = { lastChapter: 0, completed: false };
    }
    member.storyProgress[storyId].lastChapter = Math.max(
      member.storyProgress[storyId].lastChapter,
      chapterIdx + 1
    );
    updateMember(member);
  };
  
  // Hoàn thành truyện
  const completeStory = () => {
    const member = { ...currentMember };
    if (!member.storyProgress) member.storyProgress = {};
    if (!member.storyProgress[storyId]) {
      member.storyProgress[storyId] = { lastChapter: 0, completed: false };
    }
    member.storyProgress[storyId].completed = true;
    member.storyProgress[storyId].lastChapter = story.totalChapters;
    member.xp = (member.xp || 0) + 50; // Bonus XP
    
    // Cộng XP cho pet
    if (member.pet) {
      member.pet.xp = (member.pet.xp || 0) + 20;
      member.pet.lastFed = Date.now();
    }
    
    updateMember(member);
    setCompleted(true);
  };
  
  const handleNextChapter = () => {
    stop(); // Dừng đọc
    
    if (!showQuiz) {
      setShowQuiz(true);
      return;
    }
    
    if (quizPassed) {
      saveProgress(currentChapter);
      
      if (currentChapter < story.chapters.length - 1) {
        setCurrentChapter(c => c + 1);
        setShowQuiz(false);
        setQuizPassed(false);
      } else {
        completeStory();
      }
    }
  };
  
  const handlePrevChapter = () => {
    stop(); // Dừng đọc
    if (currentChapter > 0) {
      setCurrentChapter(c => c - 1);
      setShowQuiz(false);
      setQuizPassed(false);
    }
  };
  
  const handleQuizCorrect = () => {
    setQuizPassed(true);
  };
  
  const handleQuizWrong = () => {
    setQuizPassed(true); // Vẫn cho qua để đọc tiếp
  };
  
  // Hiển thị chương bị khóa
  if (isLocked) {
    return <LockedChapter chaptersNeeded={chaptersNeeded} onBack={() => navigate('/stories')} />;
  }
  
  // Hiển thị màn hình hoàn thành
  if (completed) {
    return (
      <StoryComplete
        story={story}
        onRestart={() => { setCurrentChapter(0); setCompleted(false); setShowQuiz(false); stop(); }}
        onBack={() => { stop(); navigate('/stories'); }}
      />
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 pb-32">
      {/* Header */}
      <div className={`bg-gradient-to-r ${story.color} text-white px-4 py-4`}>
        <div className="flex items-center justify-between mb-2">
          <button onClick={() => { stop(); navigate('/stories'); }} className="p-2 rounded-full hover:bg-white/20">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="text-center">
            <p className="font-bold">{story.title}</p>
            <p className="text-sm text-white/80">Chương {currentChapter + 1}/{story.totalChapters}</p>
          </div>
          <div className="w-10" />
        </div>
        
        {/* Progress */}
        <div className="h-2 bg-white/30 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentChapter + 1) / story.totalChapters) * 100}%` }}
            className="h-full bg-white rounded-full"
          />
        </div>
      </div>
      
      {/* Chapter selector */}
      <div className="px-4 py-3 overflow-x-auto">
        <div className="flex gap-2">
          {story.chapters.map((ch, idx) => {
            const isUnlocked = idx < unlockedChapters;
            const isCurrent = idx === currentChapter;
            const isRead = idx < (storyProgress.lastChapter || 0);
            
            return (
              <button
                key={idx}
                onClick={() => { if (isUnlocked) { stop(); setCurrentChapter(idx); setShowQuiz(false); setQuizPassed(false); } }}
                disabled={!isUnlocked}
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  isCurrent
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white scale-110'
                    : isRead
                      ? 'bg-green-100 text-green-600 border-2 border-green-400'
                      : isUnlocked
                        ? 'bg-white text-gray-600 border-2 border-gray-200'
                        : 'bg-gray-100 text-gray-400'
                }`}
              >
                {isUnlocked ? idx + 1 : <Lock className="w-4 h-4" />}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Audio Player - FPT.AI */}
      <div className="px-4 mb-4">
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-4 shadow-md border-2 border-green-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.span 
                animate={{ scale: isSpeaking && !isPaused ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 0.5, repeat: isSpeaking && !isPaused ? Infinity : 0 }}
                className="text-3xl"
              >
                🔊
              </motion.span>
              <div>
                <p className="font-bold text-green-800">Nghe kể chuyện</p>
                <p className="text-sm text-green-600">Giọng đọc AI tự nhiên</p>
              </div>
            </div>
            <AudioPlayer
              isPlaying={isSpeaking}
              isPaused={isPaused}
              isLoading={isLoading}
              onPlay={handleReadAloud}
              onPause={pause}
              onResume={resume}
              onStop={stop}
              error={error}
            />
          </div>
          {error && (
            <p className="text-red-500 text-sm mt-2">⚠️ {error}</p>
          )}
        </div>
      </div>
      
      {/* Chapter content */}
      <div className="px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentChapter}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            {/* Chapter title */}
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-amber-500" />
              {chapter.title}
            </h2>
            
            {/* Image/emoji */}
            <div className="text-center text-6xl mb-4 py-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl">
              {chapter.image}
            </div>
            
            {/* Content - with larger text for kids */}
            <div className="text-gray-700 leading-loose whitespace-pre-line text-lg font-medium">
              {chapter.content}
            </div>
            
            {/* Quiz */}
            {showQuiz && (
              <ChapterQuiz
                chapter={chapter}
                onCorrect={handleQuizCorrect}
                onWrong={handleQuizWrong}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Navigation buttons - Fixed bottom */}
      <div className="fixed bottom-20 left-0 right-0 bg-white border-t shadow-lg px-4 py-3">
        <div className="flex gap-3">
          <button
            onClick={handlePrevChapter}
            disabled={currentChapter === 0}
            className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 ${
              currentChapter === 0
                ? 'bg-gray-100 text-gray-400'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            <ChevronLeft className="w-5 h-5" /> Trước
          </button>
          
          <button
            onClick={handleNextChapter}
            disabled={showQuiz && !quizPassed}
            className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 ${
              showQuiz && !quizPassed
                ? 'bg-gray-200 text-gray-400'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
            }`}
          >
            {!showQuiz ? (
              <>Trả lời câu hỏi <Sparkles className="w-5 h-5" /></>
            ) : currentChapter < story.chapters.length - 1 ? (
              <>Chương tiếp <ChevronRight className="w-5 h-5" /></>
            ) : (
              <>Hoàn thành 🎉</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
