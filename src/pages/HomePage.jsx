import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useAudio } from '../contexts/AudioContext';
import { getAllSubjects } from '../data/subjects';
import { getTodayChallenges, getDailyWords } from '../data/dailyChallenge';
import { PETS, getPetStage, calculatePetMood, PET_MOODS } from '../data/pets';
import { Flame, Star, Trophy, ChevronRight, Sparkles, Gamepad2, Gift, Target, CheckCircle2, Volume2, Heart } from 'lucide-react';

// Confetti component for celebrations
const Confetti = ({ show }) => {
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            top: -20, 
            left: `${Math.random() * 100}%`,
            rotate: 0,
            opacity: 1 
          }}
          animate={{ 
            top: '110%',
            rotate: Math.random() * 360,
            opacity: 0
          }}
          transition={{ 
            duration: Math.random() * 2 + 2,
            delay: Math.random() * 0.5,
            ease: 'linear'
          }}
          className="absolute w-3 h-3 rounded-sm"
          style={{ 
            backgroundColor: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181', '#AA96DA'][i % 6]
          }}
        />
      ))}
    </div>
  );
};

// Achievement Popup
const AchievementPopup = ({ achievement, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <motion.div
      initial={{ scale: 0, y: 50 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0, y: -50 }}
      className="fixed bottom-24 left-4 right-4 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-2xl p-4 shadow-2xl z-50"
    >
      <div className="flex items-center gap-4">
        <motion.div 
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 0.5 }}
          className="text-5xl"
        >
          {achievement.icon}
        </motion.div>
        <div className="flex-1 text-white">
          <p className="text-xs font-medium opacity-80">🎉 Huy hiệu mới!</p>
          <p className="font-bold text-lg">{achievement.name}</p>
          <p className="text-sm opacity-90">{achievement.desc}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default function HomePage() {
  const navigate = useNavigate();
  const { currentChild, levelInfo } = useAuth();
  const { playSound, speak } = useAudio();
  const subjects = getAllSubjects();
  
  const [challenges, setChallenges] = useState([]);
  const [dailyWords, setDailyWords] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [newAchievement, setNewAchievement] = useState(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  
  useEffect(() => {
    setChallenges(getTodayChallenges());
    setDailyWords(getDailyWords(5));
  }, []);
  
  // Check for new achievements
  useEffect(() => {
    const lastAchCount = parseInt(localStorage.getItem('gdtm_last_ach_count') || '0');
    const currentCount = currentChild?.achievements?.length || 0;
    
    if (currentCount > lastAchCount && currentChild?.achievements?.length > 0) {
      const latest = currentChild.achievements[currentChild.achievements.length - 1];
      // Find achievement details
      const achDetails = { icon: '🏆', name: latest, desc: 'Chúc mừng!' };
      setNewAchievement(achDetails);
      setShowConfetti(true);
      playSound('achievement');
      localStorage.setItem('gdtm_last_ach_count', String(currentCount));
      
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [currentChild?.achievements]);
  
  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Chào buổi sáng';
    if (h < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  };
  
  const handleSubject = (id) => {
    playSound('click');
    navigate(`/subject/${id}`);
  };
  
  const handleSpeakWord = (word) => {
    playSound('click');
    speak(word);
  };
  
  const completedChallenges = challenges.filter(c => c.completed).length;
  
  return (
    <div className="px-4 py-4 pb-24">
      <Confetti show={showConfetti} />
      
      <AnimatePresence>
        {newAchievement && (
          <AchievementPopup 
            achievement={newAchievement} 
            onClose={() => setNewAchievement(null)} 
          />
        )}
      </AnimatePresence>
      
      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          {getGreeting()}, {currentChild?.name}! 👋
        </h1>
        <p className="text-gray-500">Hôm nay con muốn học gì nào?</p>
      </motion.div>
      
      {/* Stats Card - Improved */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-4 shadow-xl mb-4 text-white">
          <div className="grid grid-cols-3 gap-4 text-center mb-4">
            <motion.div whileHover={{ scale: 1.05 }} className="bg-white/20 rounded-2xl p-3">
              <div className="flex items-center justify-center gap-1">
                <Flame className="w-5 h-5 text-orange-300" />
                <span className="text-2xl font-bold">{currentChild?.stats?.streak || 0}</span>
              </div>
              <p className="text-xs text-white/80">Streak</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="bg-white/20 rounded-2xl p-3">
              <div className="flex items-center justify-center gap-1">
                <Star className="w-5 h-5 text-yellow-300" />
                <span className="text-2xl font-bold">{currentChild?.xp || 0}</span>
              </div>
              <p className="text-xs text-white/80">XP</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="bg-white/20 rounded-2xl p-3">
              <div className="flex items-center justify-center gap-1">
                <Trophy className="w-5 h-5 text-amber-300" />
                <span className="text-2xl font-bold">{currentChild?.achievements?.length || 0}</span>
              </div>
              <p className="text-xs text-white/80">Huy hiệu</p>
            </motion.div>
          </div>
          
          {/* Level Progress */}
          <div className="bg-white/10 rounded-xl p-3">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">Level {levelInfo?.level} - {levelInfo?.title}</span>
              <span className="text-white/80">{Math.round(levelInfo?.progress || 0)}%</span>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${levelInfo?.progress || 0}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
              />
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Daily Challenge */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Target className="w-5 h-5 text-red-500" /> Thử thách hôm nay
          </h2>
          <span className="text-sm text-gray-500">{completedChallenges}/{challenges.length}</span>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {challenges.map((challenge, i) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className={`flex items-center gap-3 p-3 ${i > 0 ? 'border-t border-gray-100' : ''}`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                challenge.completed ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                {challenge.completed ? '✅' : challenge.icon}
              </div>
              <div className="flex-1">
                <p className={`font-medium ${challenge.completed ? 'text-green-600 line-through' : 'text-gray-800'}`}>
                  {challenge.desc}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${challenge.completed ? 'bg-green-500' : 'bg-indigo-500'}`}
                      style={{ width: `${Math.min(100, (challenge.progress / challenge.target) * 100)}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{challenge.progress}/{challenge.target}</span>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-sm font-bold ${challenge.completed ? 'text-green-600' : 'text-amber-500'}`}>
                  +{challenge.reward} XP
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      {/* Daily Words */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mb-4">
        <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
          <Gift className="w-5 h-5 text-purple-500" /> Từ vựng hôm nay
        </h2>
        
        <div className="bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center gap-4">
            <motion.div 
              key={currentWordIndex}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 bg-white rounded-xl flex items-center justify-center text-4xl"
            >
              {dailyWords[currentWordIndex]?.emoji}
            </motion.div>
            <div className="flex-1 text-white">
              <p className="text-2xl font-bold">{dailyWords[currentWordIndex]?.word}</p>
              <p className="text-white/80">{dailyWords[currentWordIndex]?.vn}</p>
            </div>
            <button 
              onClick={() => handleSpeakWord(dailyWords[currentWordIndex]?.word)}
              className="p-3 bg-white/20 rounded-full"
            >
              <Volume2 className="w-6 h-6 text-white" />
            </button>
          </div>
          
          {/* Word dots navigation */}
          <div className="flex justify-center gap-2 mt-3">
            {dailyWords.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentWordIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentWordIndex ? 'w-6 bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </motion.div>
      
      {/* Pet Widget */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }} className="mb-4">
        {currentChild?.pet ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { playSound('click'); navigate('/pet'); }}
            className="w-full bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 rounded-2xl p-4 shadow-lg"
          >
            {(() => {
              const pet = PETS[currentChild.pet.type];
              const stage = getPetStage(currentChild.pet.type, currentChild.pet.xp || 0);
              const mood = calculatePetMood(currentChild.pet.lastFed, currentChild.pet.lastPlay);
              return (
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-5xl"
                  >
                    {stage?.icon}
                  </motion.div>
                  <div className="flex-1 text-left text-white">
                    <p className="font-bold text-lg">{stage?.name}</p>
                    <p className="text-sm text-white/80 flex items-center gap-1">
                      <span>{PET_MOODS[mood]?.icon}</span>
                      <span>{PET_MOODS[mood]?.name}</span>
                      <span className="mx-2">•</span>
                      <Star className="w-4 h-4" />
                      <span>{currentChild.pet.xp || 0} XP</span>
                    </p>
                  </div>
                  <div className="text-white/80">
                    <Heart className="w-6 h-6" />
                  </div>
                </div>
              );
            })()}
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { playSound('click'); navigate('/pet'); }}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-4 shadow-lg"
          >
            <div className="flex items-center justify-center gap-3 text-white">
              <motion.span
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-4xl"
              >
                🐣
              </motion.span>
              <div className="text-left">
                <p className="font-bold text-lg">Nhận Pet miễn phí!</p>
                <p className="text-sm text-white/90">Nuôi pet cùng học mỗi ngày</p>
              </div>
              <ChevronRight className="w-6 h-6" />
            </div>
          </motion.button>
        )}
      </motion.div>
      
      {/* Quick Actions - 2 columns */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-4">
        <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" /> Truy cập nhanh
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { playSound('click'); navigate('/english'); }}
            className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-2xl p-4 flex flex-col items-center shadow-lg"
          >
            <span className="text-4xl mb-2">🌍</span>
            <p className="font-bold">English Zone</p>
            <p className="text-white/80 text-xs">10 chủ đề • 5 games</p>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { playSound('click'); navigate('/stories'); }}
            className="bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-2xl p-4 flex flex-col items-center shadow-lg"
          >
            <span className="text-4xl mb-2">📖</span>
            <p className="font-bold">Truyện Cổ Tích</p>
            <p className="text-white/80 text-xs">5 truyện hay</p>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { playSound('click'); navigate('/games'); }}
            className="bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-2xl p-4 flex flex-col items-center shadow-lg"
          >
            <Gamepad2 className="w-10 h-10 mb-2" />
            <p className="font-bold">Khu Vui Chơi</p>
            <p className="text-white/80 text-xs">8 trò chơi</p>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { playSound('click'); navigate('/pet'); }}
            className="bg-gradient-to-br from-teal-500 to-cyan-500 text-white rounded-2xl p-4 flex flex-col items-center shadow-lg"
          >
            <span className="text-4xl mb-2">{currentChild?.pet ? '🐾' : '🐣'}</span>
            <p className="font-bold">Pet của tôi</p>
            <p className="text-white/80 text-xs">{currentChild?.pet ? 'Chăm sóc pet' : 'Nhận pet mới'}</p>
          </motion.button>
        </div>
      </motion.div>
      
      {/* Subjects */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <h2 className="text-lg font-bold text-gray-800 mb-3">📚 Các Môn Học</h2>
        <div className="space-y-3">
          {subjects.map((subject, i) => {
            const progress = currentChild?.progress?.[subject.id];
            const completed = progress?.completed?.length || 0;
            const percent = Math.round((completed / subject.lessons.length) * 100);
            
            return (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
              >
                <motion.button
                  whileHover={{ scale: 1.01, x: 5 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleSubject(subject.id)}
                  className={`w-full bg-gradient-to-r ${subject.color} text-white rounded-2xl p-4 flex items-center gap-4 shadow-lg text-left relative overflow-hidden`}
                >
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute -right-4 -top-4 text-8xl">{subject.icon}</div>
                  </div>
                  
                  <span className="text-4xl relative">{subject.icon}</span>
                  <div className="flex-1 relative">
                    <p className="font-bold text-lg">{subject.name}</p>
                    <p className="text-white/80 text-sm">{subject.desc}</p>
                    {completed > 0 && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-white/30 rounded-full">
                          <div className="h-full bg-white rounded-full" style={{ width: `${percent}%` }} />
                        </div>
                        <span className="text-xs font-medium">{percent}%</span>
                      </div>
                    )}
                  </div>
                  <ChevronRight className="w-6 h-6 text-white/60 relative" />
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
      
      {/* Install PWA Banner */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 1 }}
        className="mt-6 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-4 text-white"
      >
        <p className="font-bold mb-1">📱 Cài đặt ứng dụng</p>
        <p className="text-sm text-gray-300">Thêm vào màn hình chính để học offline!</p>
      </motion.div>
    </div>
  );
}
