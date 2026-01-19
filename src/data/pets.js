// ============================================
// VIRTUAL PET SYSTEM
// ============================================

export const PETS = {
  dog: {
    id: 'dog',
    name: 'Cún con',
    icon: '🐕',
    stages: [
      { level: 1, name: 'Cún sơ sinh', icon: '🐶', xpRequired: 0 },
      { level: 2, name: 'Cún con', icon: '🐕', xpRequired: 100 },
      { level: 3, name: 'Chó trưởng thành', icon: '🦮', xpRequired: 300 },
      { level: 4, name: 'Chó siêu sao', icon: '🐕‍🦺', xpRequired: 600 },
      { level: 5, name: 'Chó huyền thoại', icon: '🌟🐕', xpRequired: 1000 },
    ],
    foods: ['🦴', '🥩', '🍖'],
    sounds: ['Gâu gâu!', 'Ẳng ẳng!', 'Woof woof!'],
  },
  cat: {
    id: 'cat',
    name: 'Mèo con',
    icon: '🐈',
    stages: [
      { level: 1, name: 'Mèo sơ sinh', icon: '🐱', xpRequired: 0 },
      { level: 2, name: 'Mèo con', icon: '🐈', xpRequired: 100 },
      { level: 3, name: 'Mèo trưởng thành', icon: '🐈‍⬛', xpRequired: 300 },
      { level: 4, name: 'Mèo quý tộc', icon: '😺', xpRequired: 600 },
      { level: 5, name: 'Mèo huyền thoại', icon: '🌟🐱', xpRequired: 1000 },
    ],
    foods: ['🐟', '🥛', '🍣'],
    sounds: ['Meo meo!', 'Meow!', 'Purrrr~'],
  },
  dragon: {
    id: 'dragon',
    name: 'Rồng con',
    icon: '🐲',
    stages: [
      { level: 1, name: 'Trứng rồng', icon: '🥒', xpRequired: 0 },
      { level: 2, name: 'Rồng con', icon: '🐉', xpRequired: 100 },
      { level: 3, name: 'Rồng thiếu niên', icon: '🐲', xpRequired: 300 },
      { level: 4, name: 'Rồng trưởng thành', icon: '🔥🐲', xpRequired: 600 },
      { level: 5, name: 'Rồng huyền thoại', icon: '🌟🐲', xpRequired: 1000 },
    ],
    foods: ['🔥', '💎', '⚡'],
    sounds: ['Roar!', 'Grrrr!', 'Phù phù!'],
  },
  bunny: {
    id: 'bunny',
    name: 'Thỏ con',
    icon: '🐰',
    stages: [
      { level: 1, name: 'Thỏ sơ sinh', icon: '🐇', xpRequired: 0 },
      { level: 2, name: 'Thỏ con', icon: '🐰', xpRequired: 100 },
      { level: 3, name: 'Thỏ trưởng thành', icon: '🐇', xpRequired: 300 },
      { level: 4, name: 'Thỏ ngọc', icon: '🌸🐰', xpRequired: 600 },
      { level: 5, name: 'Thỏ huyền thoại', icon: '🌟🐰', xpRequired: 1000 },
    ],
    foods: ['🥕', '🥬', '🍎'],
    sounds: ['Nhảy nhảy!', 'Hehe!', 'Yay!'],
  },
  panda: {
    id: 'panda',
    name: 'Gấu trúc',
    icon: '🐼',
    stages: [
      { level: 1, name: 'Gấu trúc sơ sinh', icon: '🐻', xpRequired: 0 },
      { level: 2, name: 'Gấu trúc con', icon: '🐼', xpRequired: 100 },
      { level: 3, name: 'Gấu trúc lớn', icon: '🐼', xpRequired: 300 },
      { level: 4, name: 'Gấu trúc kungfu', icon: '🥋🐼', xpRequired: 600 },
      { level: 5, name: 'Gấu trúc huyền thoại', icon: '🌟🐼', xpRequired: 1000 },
    ],
    foods: ['🎋', '🍃', '🥟'],
    sounds: ['Om nom!', 'Hehe!', 'Yummy!'],
  },
  unicorn: {
    id: 'unicorn',
    name: 'Kỳ lân',
    icon: '🦄',
    stages: [
      { level: 1, name: 'Ngựa con', icon: '🐴', xpRequired: 0 },
      { level: 2, name: 'Ngựa có sừng', icon: '🦄', xpRequired: 100 },
      { level: 3, name: 'Kỳ lân', icon: '🦄', xpRequired: 300 },
      { level: 4, name: 'Kỳ lân cầu vồng', icon: '🌈🦄', xpRequired: 600 },
      { level: 5, name: 'Kỳ lân huyền thoại', icon: '🌟🦄', xpRequired: 1000 },
    ],
    foods: ['🌈', '⭐', '🍭'],
    sounds: ['Neigh!', 'Sparkle!', 'Magic!'],
  },
};

// Trạng thái cảm xúc của pet
export const PET_MOODS = {
  happy: { icon: '😊', name: 'Vui vẻ', color: 'text-green-500' },
  excited: { icon: '🤩', name: 'Phấn khích', color: 'text-yellow-500' },
  normal: { icon: '😐', name: 'Bình thường', color: 'text-gray-500' },
  hungry: { icon: '😢', name: 'Đói bụng', color: 'text-orange-500' },
  sad: { icon: '😭', name: 'Buồn', color: 'text-red-500' },
  sleeping: { icon: '😴', name: 'Đang ngủ', color: 'text-blue-500' },
};

// Tính toán stage hiện tại của pet
export const getPetStage = (petType, totalXp) => {
  const pet = PETS[petType];
  if (!pet) return null;
  
  let currentStage = pet.stages[0];
  for (const stage of pet.stages) {
    if (totalXp >= stage.xpRequired) {
      currentStage = stage;
    }
  }
  return currentStage;
};

// Tính toán % tiến độ đến stage tiếp theo
export const getPetProgress = (petType, totalXp) => {
  const pet = PETS[petType];
  if (!pet) return { progress: 0, nextStage: null, xpNeeded: 0 };
  
  const currentStage = getPetStage(petType, totalXp);
  const currentIndex = pet.stages.findIndex(s => s.level === currentStage.level);
  const nextStage = pet.stages[currentIndex + 1];
  
  if (!nextStage) {
    return { progress: 100, nextStage: null, xpNeeded: 0 };
  }
  
  const xpInCurrentStage = totalXp - currentStage.xpRequired;
  const xpForNextStage = nextStage.xpRequired - currentStage.xpRequired;
  const progress = Math.min(100, Math.round((xpInCurrentStage / xpForNextStage) * 100));
  const xpNeeded = nextStage.xpRequired - totalXp;
  
  return { progress, nextStage, xpNeeded };
};

// Tính mood dựa trên hoạt động
export const calculatePetMood = (lastFedTime, lastPlayTime) => {
  const now = Date.now();
  const hoursSinceFed = (now - (lastFedTime || 0)) / (1000 * 60 * 60);
  const hoursSincePlay = (now - (lastPlayTime || 0)) / (1000 * 60 * 60);
  
  // Sau 10h tối pet ngủ
  const currentHour = new Date().getHours();
  if (currentHour >= 22 || currentHour < 6) {
    return 'sleeping';
  }
  
  // Đói sau 24h không học
  if (hoursSinceFed > 24) {
    return 'sad';
  }
  
  if (hoursSinceFed > 12) {
    return 'hungry';
  }
  
  // Vui nếu vừa học xong
  if (hoursSinceFed < 1) {
    return 'excited';
  }
  
  if (hoursSinceFed < 6) {
    return 'happy';
  }
  
  return 'normal';
};

// Lấy message ngẫu nhiên từ pet
export const getPetMessage = (petType, mood) => {
  const pet = PETS[petType];
  if (!pet) return '';
  
  const messages = {
    happy: [
      `${pet.sounds[0]} Cảm ơn bạn đã chơi với tớ!`,
      'Tớ thích học cùng bạn! 💕',
      'Bạn giỏi quá! Tiếp tục nhé!',
    ],
    excited: [
      `${pet.sounds[1]} Tuyệt vời quá!`,
      'Wow! Bạn học giỏi quá! 🎉',
      'Tớ yêu bạn nhiều lắm! ❤️',
    ],
    normal: [
      'Chào bạn! Hôm nay học gì nào?',
      'Tớ đang chờ bạn đấy!',
      'Cùng học nhé!',
    ],
    hungry: [
      'Bạn ơi, tớ đói rồi... 🥺',
      'Học bài đi để tớ được ăn nha!',
      'Tớ nhớ bạn quá!',
    ],
    sad: [
      'Hu hu... bạn quên tớ rồi sao? 😢',
      'Tớ buồn quá... học cùng tớ đi!',
      'Bạn đi đâu mất rồi?',
    ],
    sleeping: [
      'Zzz... Zzz... 💤',
      'Ngủ ngon nhé bạn... 🌙',
      'Mai gặp lại nha... 😴',
    ],
  };
  
  const moodMessages = messages[mood] || messages.normal;
  return moodMessages[Math.floor(Math.random() * moodMessages.length)];
};

export default PETS;
