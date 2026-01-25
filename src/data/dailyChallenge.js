// ============================================
// DAILY CHALLENGE SYSTEM
// ============================================

import { getAllWords } from './englishVocab';

// Challenge types
export const CHALLENGE_TYPES = {
  vocab: { id: 'vocab', name: 'Từ vựng', icon: '📚', desc: 'Học 10 từ mới' },
  speak: { id: 'speak', name: 'Phát âm', icon: '🎤', desc: 'Nói đúng 5 từ' },
  math: { id: 'math', name: 'Toán học', icon: '🔢', desc: 'Giải 15 phép tính' },
  game: { id: 'game', name: 'Trò chơi', icon: '🎮', desc: 'Đạt 500 điểm' },
  streak: { id: 'streak', name: 'Siêng năng', icon: '🔥', desc: 'Học 3 bài liên tiếp' },
};

// Get today's date string
export const getTodayString = () => {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

// Generate daily challenges (seeded by date)
export const generateDailyChallenges = () => {
  const today = getTodayString();
  const seed = today.split('-').reduce((a, b) => a + parseInt(b), 0);
  
  // Use seed to pick consistent challenges for the day
  const types = Object.values(CHALLENGE_TYPES);
  const challenges = [];
  
  // Always include these 3 types rotated by day
  const dayNum = new Date().getDay();
  const indices = [(dayNum) % 5, (dayNum + 1) % 5, (dayNum + 2) % 5];
  
  indices.forEach((idx, i) => {
    const type = types[idx];
    challenges.push({
      id: `${today}-${i}`,
      type: type.id,
      name: type.name,
      icon: type.icon,
      desc: type.desc,
      reward: 50 + (i * 25), // 50, 75, 100 XP
      target: getTargetForType(type.id),
      progress: 0,
      completed: false,
    });
  });
  
  return challenges;
};

const getTargetForType = (type) => {
  switch(type) {
    case 'vocab': return 10;
    case 'speak': return 5;
    case 'math': return 15;
    case 'game': return 500;
    case 'streak': return 3;
    default: return 5;
  }
};

// Get or create today's challenges from localStorage
export const getTodayChallenges = () => {
  try {
    const stored = localStorage.getItem('schoolhub_daily_challenges');
    if (stored) {
      const data = JSON.parse(stored);
      // Check if it's today's challenges
      if (data.date === getTodayString()) {
        return data.challenges;
      }
    }
    // Generate new challenges
    const challenges = generateDailyChallenges();
    localStorage.setItem('schoolhub_daily_challenges', JSON.stringify({
      date: getTodayString(),
      challenges
    }));
    return challenges;
  } catch {
    return generateDailyChallenges();
  }
};

// Update challenge progress
export const updateChallengeProgress = (type, amount = 1) => {
  try {
    const stored = localStorage.getItem('schoolhub_daily_challenges');
    if (!stored) return null;
    
    const data = JSON.parse(stored);
    if (data.date !== getTodayString()) return null;
    
    const challenge = data.challenges.find(c => c.type === type && !c.completed);
    if (!challenge) return null;
    
    challenge.progress = Math.min(challenge.target, challenge.progress + amount);
    
    if (challenge.progress >= challenge.target) {
      challenge.completed = true;
    }
    
    localStorage.setItem('schoolhub_daily_challenges', JSON.stringify(data));
    return challenge;
  } catch {
    return null;
  }
};

// Check if all daily challenges completed
export const isDailyComplete = () => {
  const challenges = getTodayChallenges();
  return challenges.every(c => c.completed);
};

// Get daily bonus words
export const getDailyWords = (count = 5) => {
  const today = getTodayString();
  const seed = today.split('-').reduce((a, b) => a + parseInt(b), 0);
  const allWords = getAllWords();
  
  // Pseudo-random shuffle based on date
  const shuffled = [...allWords].sort((a, b) => {
    const hashA = (a.word.charCodeAt(0) + seed) % 100;
    const hashB = (b.word.charCodeAt(0) + seed) % 100;
    return hashA - hashB;
  });
  
  return shuffled.slice(0, count);
};
