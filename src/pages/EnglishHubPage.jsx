import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMember } from '../contexts/MemberContext';
import { useAudio } from '../contexts/AudioContext';
import { getAllTopics } from '../data/englishVocab';
import { ArrowLeft, BookOpen, Gamepad2, ChevronRight, Mic, Trophy } from 'lucide-react';

export default function EnglishHubPage() {
  const navigate = useNavigate();
  const { currentMember } = useMember();
  const { playSound } = useAudio();
  
  const topics = getAllTopics();
  
  // Calculate progress
  const englishProgress = currentMember?.englishProgress || {};
  const totalWordsLearned = Object.values(englishProgress).reduce((sum, t) => sum + (t.learned?.length || 0), 0);
  const totalWords = topics.reduce((sum, t) => sum + t.words.length, 0);
  const progressPercent = Math.round((totalWordsLearned / totalWords) * 100);
  
  const games = [
    { id: 'flashcard', name: 'Flashcard', icon: '🎴', desc: 'Học từ vựng', color: 'from-blue-500 to-cyan-500' },
    { id: 'listenPick', name: 'Nghe & Chọn', icon: '👂', desc: 'Nghe chọn đáp án', color: 'from-green-500 to-emerald-500' },
    { id: 'speakCheck', name: 'Speak & Check', icon: '🎤', desc: 'Luyện phát âm', color: 'from-red-500 to-pink-500' },
    { id: 'spellingBee', name: 'Spelling Bee', icon: '🐝', desc: 'Ghép chữ', color: 'from-amber-500 to-orange-500' },
    { id: 'wordRain', name: 'Word Rain', icon: '🌧️', desc: 'Bắt từ rơi', color: 'from-purple-500 to-pink-500' },
  ];
  
  const handleTopic = (topicId) => {
    playSound('click');
    navigate(`/english/topic/${topicId}`);
  };
  
  const handleGame = (gameId) => {
    playSound('click');
    navigate(`/english/game/${gameId}`);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white px-4 py-6">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/')} className="p-2 rounded-full hover:bg-white/20">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              🌍 English Zone
            </h1>
            <p className="text-white/80 text-sm">Học tiếng Anh vui vẻ!</p>
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-white/20 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">{totalWordsLearned}</p>
            <p className="text-xs text-white/80">Đã học</p>
          </div>
          <div className="bg-white/20 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">{topics.length}</p>
            <p className="text-xs text-white/80">Chủ đề</p>
          </div>
          <div className="bg-white/20 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">{games.length}</p>
            <p className="text-xs text-white/80">Games</p>
          </div>
        </div>
        
        {/* Progress */}
        <div className="bg-white/20 rounded-xl p-3">
          <div className="flex justify-between text-sm mb-2">
            <span>Tiến độ tổng</span>
            <span className="font-bold">{progressPercent}%</span>
          </div>
          <div className="h-2.5 bg-white/30 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1 }}
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
            />
          </div>
        </div>
      </div>
      
      <div className="p-4 space-y-6">
        {/* Games */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-pink-500" />
            Trò chơi
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {games.map((game, i) => (
              <motion.button
                key={game.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => handleGame(game.id)}
                className={`bg-gradient-to-br ${game.color} text-white rounded-2xl p-4 text-left shadow-lg`}
              >
                <div className="text-3xl mb-2">{game.icon}</div>
                <p className="font-bold">{game.name}</p>
                <p className="text-white/80 text-xs">{game.desc}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>
        
        {/* Topics */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-500" />
            Chủ đề từ vựng
          </h2>
          <div className="space-y-3">
            {topics.map((topic, i) => {
              const progress = englishProgress[topic.id];
              const learned = progress?.learned?.length || 0;
              const total = topic.words.length;
              const percent = Math.round((learned / total) * 100);
              
              return (
                <motion.button
                  key={topic.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  onClick={() => handleTopic(topic.id)}
                  className={`w-full bg-gradient-to-r ${topic.color} text-white rounded-2xl p-4 flex items-center gap-4 shadow-lg text-left`}
                >
                  <span className="text-4xl">{topic.icon}</span>
                  <div className="flex-1">
                    <p className="font-bold text-lg">{topic.name}</p>
                    <p className="text-white/80 text-sm">{topic.nameVn} • {total} từ</p>
                    {learned > 0 && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-white/30 rounded-full">
                          <div className="h-full bg-white rounded-full" style={{ width: `${percent}%` }} />
                        </div>
                        <span className="text-xs">{percent}%</span>
                      </div>
                    )}
                  </div>
                  <ChevronRight className="w-6 h-6 text-white/60" />
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
