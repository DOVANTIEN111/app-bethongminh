import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useMember } from '../contexts/MemberContext';
import { useAudio } from '../contexts/AudioContext';
import { getTopic } from '../data/englishVocab';
import { ArrowLeft, Volume2, Check, ChevronLeft, ChevronRight, Play, Mic, MicOff } from 'lucide-react';

export default function EnglishTopicPage() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { currentMember, updateMember } = useMember();
  const { playSound, speak, startListening, stopListening, isListening, speechSupported } = useAudio();
  
  const topic = getTopic(topicId);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);
  const [mode, setMode] = useState('browse'); // browse, learn
  const [speakResult, setSpeakResult] = useState(null);
  const [showSpeakMode, setShowSpeakMode] = useState(false);
  
  if (!topic) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Chủ đề không tồn tại</p>
      </div>
    );
  }
  
  const word = topic.words[currentIndex];
  const progress = currentMember?.englishProgress?.[topicId] || { learned: [] };
  const isLearned = progress.learned?.includes(word.word);
  
  const handleSpeak = () => {
    playSound('click');
    speak(word.word);
  };
  
  const handleNext = () => {
    setShowMeaning(false);
    setSpeakResult(null);
    if (currentIndex < topic.words.length - 1) {
      setCurrentIndex(i => i + 1);
    }
  };
  
  const handlePrev = () => {
    setShowMeaning(false);
    setSpeakResult(null);
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1);
    }
  };
  
  const handleMarkLearned = () => {
    if (isLearned) return;
    playSound('correct');
    const member = { ...currentMember };
    if (!member.englishProgress) member.englishProgress = {};
    if (!member.englishProgress[topicId]) {
      member.englishProgress[topicId] = { learned: [], reviewed: [] };
    }
    if (!member.englishProgress[topicId].learned.includes(word.word)) {
      member.englishProgress[topicId].learned.push(word.word);
      member.xp = (member.xp || 0) + 5;
    }
    updateMember(member);
    setTimeout(() => {
      if (currentIndex < topic.words.length - 1) handleNext();
    }, 500);
  };
  
  const handleStartLearn = () => {
    setMode('learn');
    setCurrentIndex(0);
    setShowMeaning(false);
    setSpeakResult(null);
  };
  
  // Speech Recognition
  const handleStartSpeaking = () => {
    if (!speechSupported) {
      setSpeakResult({ error: 'not_supported' });
      return;
    }
    
    setSpeakResult(null);
    startListening(word.word, (result) => {
      setSpeakResult(result);
      if (result.success && result.score >= 70) {
        playSound('correct');
        // Bonus XP for good pronunciation
        if (!isLearned) {
          const member = { ...currentMember };
          if (!member.englishProgress) member.englishProgress = {};
          if (!member.englishProgress[topicId]) {
            member.englishProgress[topicId] = { learned: [] };
          }
          if (!member.englishProgress[topicId].learned.includes(word.word)) {
            member.englishProgress[topicId].learned.push(word.word);
            member.xp = (member.xp || 0) + 10; // Bonus for speaking
          }
          updateMember(member);
        }
      } else {
        playSound('wrong');
      }
    });
  };
  
  // Browse mode - grid view
  if (mode === 'browse') {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className={`bg-gradient-to-r ${topic.color} text-white px-4 py-6`}>
          <div className="flex items-center gap-3 mb-2">
            <button onClick={() => navigate('/english')} className="p-2 rounded-full hover:bg-white/20">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <span className="text-4xl">{topic.icon}</span>
            <div>
              <h1 className="text-2xl font-bold">{topic.name}</h1>
              <p className="text-white/80">{topic.nameVn} • {topic.words.length} từ</p>
            </div>
          </div>
          
          <div className="bg-white/20 rounded-xl p-3 mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Đã học</span>
              <span className="font-bold">{progress.learned?.length || 0}/{topic.words.length}</span>
            </div>
            <div className="h-2 bg-white/30 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full" style={{ width: `${((progress.learned?.length || 0) / topic.words.length) * 100}%` }} />
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <button onClick={handleStartLearn}
            className={`w-full mb-4 py-4 bg-gradient-to-r ${topic.color} text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg`}>
            <Play className="w-6 h-6" /> Bắt đầu học Flashcard
          </button>
          
          <h3 className="font-bold text-gray-700 mb-3">Tất cả từ vựng:</h3>
          <div className="grid grid-cols-3 gap-2">
            {topic.words.map((w, i) => {
              const learned = progress.learned?.includes(w.word);
              return (
                <motion.button key={w.word} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.02 }}
                  onClick={() => { setCurrentIndex(i); setMode('learn'); }}
                  className={`p-3 rounded-xl text-center relative ${learned ? 'bg-green-100 border-2 border-green-400' : 'bg-white border-2 border-gray-100'} shadow-sm`}>
                  {learned && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <span className="text-2xl block">{w.emoji}</span>
                  <p className="text-sm font-medium text-gray-800 mt-1">{w.word}</p>
                </motion.button>
              );
            })}
          </div>
          
          {topic.sentences && (
            <div className="mt-6">
              <h3 className="font-bold text-gray-700 mb-3">Câu mẫu:</h3>
              <div className="space-y-2">
                {topic.sentences.map((s, i) => (
                  <div key={i} className="bg-white rounded-xl p-3 shadow-sm">
                    <p className="font-medium text-gray-800">{s.en}</p>
                    <p className="text-sm text-gray-500">{s.vn}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // Learn mode - Flashcard with Speaking
  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className={`bg-gradient-to-r ${topic.color} text-white px-4 py-4`}>
        <div className="flex items-center justify-between">
          <button onClick={() => setMode('browse')} className="p-2 rounded-full hover:bg-white/20">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <span className="font-bold">{topic.name}</span>
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm">{currentIndex + 1}/{topic.words.length}</span>
        </div>
        <div className="h-1 bg-white/30 rounded-full mt-3 overflow-hidden">
          <div className="h-full bg-white rounded-full transition-all" style={{ width: `${((currentIndex + 1) / topic.words.length) * 100}%` }} />
        </div>
      </div>
      
      <div className="p-4">
        {/* Flashcard */}
        <AnimatePresence mode="wait">
          <motion.div key={currentIndex} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
            className="bg-white rounded-3xl shadow-xl p-8 text-center min-h-[300px] flex flex-col items-center justify-center relative">
            {isLearned && (
              <div className="absolute top-4 right-4 bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                <Check className="w-4 h-4" /> Đã học
              </div>
            )}
            
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }} className="text-8xl mb-6">
              {word.emoji}
            </motion.div>
            
            <h2 className="text-4xl font-bold text-gray-800 mb-2">{word.word}</h2>
            
            <button onClick={handleSpeak} className={`px-6 py-2 rounded-full bg-gradient-to-r ${topic.color} text-white flex items-center gap-2 mt-2`}>
              <Volume2 className="w-5 h-5" /> Nghe phát âm
            </button>
            
            <div className="mt-6 w-full">
              {showMeaning ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <p className="text-2xl text-gray-600">{word.vn}</p>
                </motion.div>
              ) : (
                <button onClick={() => { setShowMeaning(true); playSound('click'); }} className="text-indigo-500 underline">
                  👆 Bấm để xem nghĩa
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Speaking Practice Section */}
        {speechSupported && (
          <div className="mt-4 bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-4">
            <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
              <Mic className="w-5 h-5 text-red-500" /> Luyện phát âm
            </h3>
            
            {/* Speak Result */}
            {speakResult && (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mb-3">
                {speakResult.success && speakResult.score >= 70 ? (
                  <div className="bg-green-100 rounded-xl p-3 text-center">
                    <span className="text-2xl">{speakResult.score >= 90 ? '🌟' : speakResult.score >= 80 ? '⭐' : '👍'}</span>
                    <p className="text-green-700 font-medium">
                      {speakResult.score >= 90 ? 'Xuất sắc!' : speakResult.score >= 80 ? 'Rất tốt!' : 'Tốt lắm!'}
                    </p>
                    <p className="text-green-600 text-sm">Điểm: {speakResult.score}/100</p>
                    {speakResult.transcript && <p className="text-green-500 text-xs">Bạn nói: "{speakResult.transcript}"</p>}
                  </div>
                ) : speakResult.error === 'no_speech' ? (
                  <div className="bg-yellow-100 rounded-xl p-3 text-center">
                    <span className="text-2xl">🤔</span>
                    <p className="text-yellow-700 font-medium">Không nghe thấy - Nói to hơn nhé!</p>
                  </div>
                ) : speakResult.error ? (
                  <div className="bg-red-100 rounded-xl p-3 text-center">
                    <span className="text-2xl">⚠️</span>
                    <p className="text-red-700 font-medium">Cần quyền microphone</p>
                  </div>
                ) : (
                  <div className="bg-orange-100 rounded-xl p-3 text-center">
                    <span className="text-2xl">💪</span>
                    <p className="text-orange-700 font-medium">Thử lại nhé!</p>
                    {speakResult.transcript && <p className="text-orange-600 text-sm">Bạn nói: "{speakResult.transcript}"</p>}
                  </div>
                )}
              </motion.div>
            )}
            
            {/* Listening indicator */}
            {isListening ? (
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 1 }}
                className="bg-red-100 rounded-xl p-4 text-center">
                <div className="flex justify-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <motion.div key={i} animate={{ height: [8, 24, 8] }} transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                      className="w-2 bg-red-400 rounded-full" />
                  ))}
                </div>
                <p className="text-red-600 font-medium">Đang nghe... Nói: "{word.word}"</p>
              </motion.div>
            ) : (
              <button onClick={handleStartSpeaking}
                className="w-full py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-bold flex items-center justify-center gap-2">
                <Mic className="w-5 h-5" /> Bấm để nói "{word.word}"
              </button>
            )}
          </div>
        )}
        
        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button onClick={handlePrev} disabled={currentIndex === 0}
            className={`p-4 rounded-full ${currentIndex === 0 ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 text-gray-700'}`}>
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button onClick={handleMarkLearned} disabled={isLearned}
            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 ${isLearned ? 'bg-green-100 text-green-600' : 'bg-green-500 text-white shadow-lg'}`}>
            <Check className="w-5 h-5" /> {isLearned ? 'Đã học' : 'Đánh dấu đã học'}
          </button>
          
          <button onClick={handleNext} disabled={currentIndex === topic.words.length - 1}
            className={`p-4 rounded-full ${currentIndex === topic.words.length - 1 ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 text-gray-700'}`}>
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
        
        {/* Quick nav dots */}
        <div className="flex justify-center gap-1 mt-4 flex-wrap">
          {topic.words.map((_, i) => (
            <button key={i} onClick={() => { setCurrentIndex(i); setShowMeaning(false); setSpeakResult(null); }}
              className={`w-2 h-2 rounded-full transition-all ${i === currentIndex ? 'w-6 bg-indigo-500' : progress.learned?.includes(topic.words[i].word) ? 'bg-green-400' : 'bg-gray-300'}`} />
          ))}
        </div>
        
        {/* Tips */}
        {speechSupported && (
          <div className="mt-4 bg-blue-50 rounded-xl p-3">
            <p className="text-blue-600 text-xs">💡 Nghe mẫu trước, sau đó bấm nút Mic và đọc to từ vựng. App sẽ kiểm tra phát âm của bạn!</p>
          </div>
        )}
      </div>
    </div>
  );
}
