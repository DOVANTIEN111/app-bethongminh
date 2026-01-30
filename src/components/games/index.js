// src/components/games/index.js
// Export tất cả games

export { default as CountingGame } from './CountingGame';
export { default as SpellingGame } from './SpellingGame';
export { default as MatchingGame } from './MatchingGame';
export { default as MemoryGame } from './MemoryGame';
export { default as BalloonPopGame } from './BalloonPopGame';

// Thông tin các game
export const GAMES_INFO = [
  {
    id: 'counting',
    title: 'Đếm số',
    description: 'Học đếm với hình ảnh ngộ nghĩnh',
    icon: '🔢',
    color: 'from-purple-400 to-pink-500',
    bgColor: 'bg-gradient-to-br from-purple-100 to-pink-100',
    subjects: ['math'],
    ageRange: '3-7',
    difficulty: 'easy',
    skills: ['Đếm số', 'Nhận biết số lượng', 'Tư duy logic']
  },
  {
    id: 'spelling',
    title: 'Đánh vần',
    description: 'Ghép chữ cái thành từ có nghĩa',
    icon: '📝',
    color: 'from-green-400 to-teal-500',
    bgColor: 'bg-gradient-to-br from-green-100 to-teal-100',
    subjects: ['vietnamese'],
    ageRange: '5-8',
    difficulty: 'medium',
    skills: ['Nhận biết chữ cái', 'Ghép vần', 'Từ vựng']
  },
  {
    id: 'matching',
    title: 'Nối cặp',
    description: 'Tìm và nối các cặp giống nhau',
    icon: '🎯',
    color: 'from-orange-400 to-red-500',
    bgColor: 'bg-gradient-to-br from-orange-100 to-red-100',
    subjects: ['math', 'vietnamese'],
    ageRange: '4-8',
    difficulty: 'easy',
    skills: ['Tư duy logic', 'Ghép cặp', 'Phép tính']
  },
  {
    id: 'memory',
    title: 'Trí nhớ',
    description: 'Lật thẻ tìm cặp giống nhau',
    icon: '🧠',
    color: 'from-indigo-400 to-purple-500',
    bgColor: 'bg-gradient-to-br from-indigo-100 to-purple-100',
    subjects: ['general'],
    ageRange: '4-10',
    difficulty: 'medium',
    skills: ['Trí nhớ', 'Tập trung', 'Quan sát']
  },
  {
    id: 'balloon',
    title: 'Bắn bóng bay',
    description: 'Bắn bóng có đáp án đúng',
    icon: '🎈',
    color: 'from-sky-400 to-blue-500',
    bgColor: 'bg-gradient-to-br from-sky-100 to-blue-100',
    subjects: ['math'],
    ageRange: '5-9',
    difficulty: 'medium',
    skills: ['Phép cộng', 'Phép trừ', 'Phản xạ nhanh']
  }
];

// Lấy thông tin game theo ID
export const getGameInfo = (gameId) => {
  return GAMES_INFO.find(g => g.id === gameId) || null;
};

// Lấy games theo môn học
export const getGamesBySubject = (subject) => {
  return GAMES_INFO.filter(g => g.subjects.includes(subject) || g.subjects.includes('general'));
};

// Lấy games theo độ khó
export const getGamesByDifficulty = (difficulty) => {
  return GAMES_INFO.filter(g => g.difficulty === difficulty);
};
