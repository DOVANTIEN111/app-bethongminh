import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useMember } from '../contexts/MemberContext';
import { useAudio } from '../contexts/AudioContext';
import { 
  PETS, 
  PET_MOODS, 
  getPetStage, 
  getPetProgress, 
  calculatePetMood,
  getPetMessage 
} from '../data/pets';
import { ArrowLeft, Heart, Sparkles, Star, Gift, BookOpen } from 'lucide-react';

// Component Pet animation
const PetDisplay = ({ pet, stage, mood, onTap }) => {
  const [isJumping, setIsJumping] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  
  const handleTap = () => {
    setIsJumping(true);
    setShowHeart(true);
    setTimeout(() => setIsJumping(false), 500);
    setTimeout(() => setShowHeart(false), 1000);
    onTap?.();
  };
  
  return (
    <div className="relative flex flex-col items-center">
      {/* Hearts animation */}
      <AnimatePresence>
        {showHeart && (
          <>
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 1, y: 0, x: 0 }}
                animate={{ 
                  opacity: 0, 
                  y: -100,
                  x: (i - 2) * 30
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute text-3xl"
                style={{ top: 50 }}
              >
                ❤️
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>
      
      {/* Pet */}
      <motion.div
        animate={isJumping ? {
          y: [0, -30, 0],
          scale: [1, 1.1, 1],
        } : {
          y: [0, -5, 0],
        }}
        transition={isJumping ? {
          duration: 0.5,
        } : {
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        onClick={handleTap}
        className="cursor-pointer select-none"
      >
        <span className="text-[120px] drop-shadow-lg">{stage.icon}</span>
      </motion.div>
      
      {/* Mood indicator */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute -top-2 -right-2 text-4xl"
      >
        {PET_MOODS[mood]?.icon}
      </motion.div>
      
      {/* Name & Level */}
      <div className="text-center mt-2">
        <p className="text-xl font-bold text-gray-800">{stage.name}</p>
        <p className="text-sm text-gray-500">Level {stage.level}</p>
      </div>
    </div>
  );
};

// Component chọn Pet lần đầu
const PetSelector = ({ onSelect }) => {
  const [selected, setSelected] = useState(null);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-400 to-pink-400 p-4">
      <div className="text-center text-white mb-6">
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl font-bold mb-2"
        >
          🎉 Chọn Pet của con!
        </motion.h1>
        <p className="text-white/80">Pet sẽ cùng con học mỗi ngày</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        {Object.values(PETS).map((pet, i) => (
          <motion.button
            key={pet.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => setSelected(pet.id)}
            className={`bg-white rounded-2xl p-4 shadow-lg transition-all ${
              selected === pet.id 
                ? 'ring-4 ring-yellow-400 scale-105' 
                : ''
            }`}
          >
            <span className="text-6xl block mb-2">{pet.stages[1].icon}</span>
            <p className="font-bold text-gray-800">{pet.name}</p>
          </motion.button>
        ))}
      </div>
      
      {selected && (
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          onClick={() => onSelect(selected)}
          className="w-full bg-yellow-400 text-yellow-900 font-bold py-4 rounded-2xl text-xl shadow-lg"
        >
          Chọn {PETS[selected].name}! 🎉
        </motion.button>
      )}
    </div>
  );
};

// Component cho ăn Pet
const FeedingAnimation = ({ pet, food, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-3xl p-8 text-center"
      >
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ duration: 0.5, repeat: 3 }}
          className="text-8xl mb-4"
        >
          {pet.stages[1].icon}
        </motion.div>
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-5xl mb-4"
        >
          {food}
        </motion.div>
        <p className="text-xl font-bold text-green-600">Ngon quá! +10 XP 🎉</p>
      </motion.div>
    </motion.div>
  );
};

export default function PetPage() {
  const navigate = useNavigate();
  const { currentMember, updateMember, addXP } = useMember();
  const { playSound, speak } = useAudio();
  
  const [showFeeding, setShowFeeding] = useState(false);
  const [currentFood, setCurrentFood] = useState(null);
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  
  // Lấy thông tin pet của member
  const petData = currentMember?.pet || null;
  const petType = petData?.type;
  const petXP = petData?.xp || 0;
  const pet = petType ? PETS[petType] : null;
  const stage = pet ? getPetStage(petType, petXP) : null;
  const { progress, nextStage, xpNeeded } = pet ? getPetProgress(petType, petXP) : {};
  const mood = calculatePetMood(petData?.lastFed, petData?.lastPlay);
  
  // Hiển thị message khi vào trang
  useEffect(() => {
    if (pet && mood) {
      const msg = getPetMessage(petType, mood);
      setMessage(msg);
      setShowMessage(true);
      
      const timer = setTimeout(() => setShowMessage(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [pet, mood, petType]);
  
  // Chọn pet lần đầu
  const handleSelectPet = (type) => {
    playSound('achievement');
    updateMember(currentMember.id, {
      pet: {
        type,
        xp: 0,
        lastFed: Date.now(),
        lastPlay: Date.now(),
        createdAt: Date.now(),
      }
    });
  };
  
  // Vuốt ve pet
  const handlePetTap = () => {
    playSound('pop');
    const msg = getPetMessage(petType, mood);
    setMessage(msg);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
    
    // Cập nhật lastPlay
    updateMember(currentMember.id, {
      pet: {
        ...petData,
        lastPlay: Date.now(),
      }
    });
  };
  
  // Cho pet ăn (cần học bài mới có đồ ăn)
  const handleFeed = (food) => {
    playSound('correct');
    setCurrentFood(food);
    setShowFeeding(true);
    
    // Cộng XP cho pet
    updateMember(currentMember.id, {
      pet: {
        ...petData,
        xp: petXP + 10,
        lastFed: Date.now(),
      }
    });
  };
  
  // Nếu chưa có pet, hiển thị màn hình chọn
  if (!petType) {
    return <PetSelector onSelect={handleSelectPet} />;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 via-purple-400 to-pink-400">
      {/* Header */}
      <div className="bg-white/20 backdrop-blur-sm p-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="p-2 rounded-full bg-white/30"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-xl font-bold text-white">Pet của tôi</h1>
          <div className="w-10" />
        </div>
      </div>
      
      {/* Pet Display */}
      <div className="flex flex-col items-center pt-8 pb-4">
        <PetDisplay 
          pet={pet} 
          stage={stage} 
          mood={mood}
          onTap={handlePetTap}
        />
        
        {/* Message bubble */}
        <AnimatePresence>
          {showMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 bg-white rounded-2xl px-6 py-3 shadow-lg max-w-xs"
            >
              <p className="text-gray-700 text-center">{message}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Stats */}
      <div className="px-4 space-y-4">
        {/* XP Progress */}
        <div className="bg-white/90 backdrop-blur rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="font-bold text-gray-800">Pet XP</span>
            </div>
            <span className="text-sm text-gray-600">{petXP} XP</span>
          </div>
          
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1 }}
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
            />
          </div>
          
          {nextStage ? (
            <p className="text-sm text-gray-500 mt-2 text-center">
              Còn <span className="font-bold text-orange-500">{xpNeeded} XP</span> để tiến hóa thành {nextStage.icon} {nextStage.name}
            </p>
          ) : (
            <p className="text-sm text-green-600 mt-2 text-center font-bold">
              🎉 Pet đã đạt cấp tối đa!
            </p>
          )}
        </div>
        
        {/* Mood */}
        <div className="bg-white/90 backdrop-blur rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              <span className="font-bold text-gray-800">Tâm trạng</span>
            </div>
            <div className={`flex items-center gap-2 ${PET_MOODS[mood]?.color}`}>
              <span className="text-2xl">{PET_MOODS[mood]?.icon}</span>
              <span className="font-medium">{PET_MOODS[mood]?.name}</span>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="grid grid-cols-2 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl p-4 shadow-lg"
          >
            <BookOpen className="w-8 h-8 mx-auto mb-2" />
            <p className="font-bold">Học bài</p>
            <p className="text-xs text-white/80">Cho pet ăn</p>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (mood !== 'sleeping') {
                handleFeed(pet.foods[Math.floor(Math.random() * pet.foods.length)]);
              }
            }}
            disabled={mood === 'sleeping'}
            className={`rounded-2xl p-4 shadow-lg ${
              mood === 'sleeping'
                ? 'bg-gray-300 text-gray-500'
                : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white'
            }`}
          >
            <Gift className="w-8 h-8 mx-auto mb-2" />
            <p className="font-bold">Cho ăn</p>
            <p className="text-xs opacity-80">
              {mood === 'sleeping' ? 'Pet đang ngủ' : pet.foods.join(' ')}
            </p>
          </motion.button>
        </div>
        
        {/* Evolution stages */}
        <div className="bg-white/90 backdrop-blur rounded-2xl p-4 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <span className="font-bold text-gray-800">Các giai đoạn tiến hóa</span>
          </div>
          <div className="flex justify-between">
            {pet.stages.map((s, i) => (
              <div 
                key={i}
                className={`flex flex-col items-center ${
                  s.level <= stage.level ? 'opacity-100' : 'opacity-40'
                }`}
              >
                <span className="text-3xl">{s.icon}</span>
                <span className="text-xs text-gray-500 mt-1">Lv.{s.level}</span>
                {s.level <= stage.level && (
                  <span className="text-xs text-green-500">✓</span>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Tip */}
        <div className="bg-yellow-100 rounded-2xl p-4 mb-20">
          <p className="text-yellow-800 text-sm text-center">
            💡 <strong>Mẹo:</strong> Học bài mỗi ngày để pet được ăn và tiến hóa nhanh hơn!
          </p>
        </div>
      </div>
      
      {/* Feeding Animation */}
      <AnimatePresence>
        {showFeeding && (
          <FeedingAnimation 
            pet={pet}
            food={currentFood}
            onComplete={() => setShowFeeding(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
