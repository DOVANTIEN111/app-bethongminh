export const GAME_CATEGORIES = [
  { id: 'all', name: 'Tất cả', icon: '🎮' },
  { id: 'brain', name: 'Trí nhớ', icon: '🧠' },
  { id: 'math', name: 'Toán', icon: '🔢' },
  { id: 'english', name: 'Tiếng Anh', icon: '🌍' },
  { id: 'reflex', name: 'Phản xạ', icon: '⚡' },
];

export const GAMES = {
  memory: {
    id: 'memory',
    name: 'Lật Hình Nhớ',
    icon: '🧠',
    color: 'from-purple-500 to-pink-500',
    desc: 'Tìm cặp hình giống nhau',
    category: 'brain',
  },
  mathRace: {
    id: 'mathRace',
    name: 'Đua Xe Toán',
    icon: '🏎️',
    color: 'from-blue-500 to-cyan-500',
    desc: 'Tính nhanh để về đích',
    category: 'math',
  },
  whackMole: {
    id: 'whackMole',
    name: 'Đập Chuột',
    icon: '🐹',
    color: 'from-green-500 to-emerald-500',
    desc: 'Đập nhanh khi xuất hiện',
    category: 'reflex',
  },
  colorMatch: {
    id: 'colorMatch',
    name: 'Bắt Màu',
    icon: '🎨',
    color: 'from-red-500 to-yellow-500',
    desc: 'Chọn đúng màu yêu cầu',
    category: 'reflex',
  },
  wordMatch: {
    id: 'wordMatch',
    name: 'Nối Từ',
    icon: '🔗',
    color: 'from-violet-500 to-purple-500',
    desc: 'Nối từ với hình',
    category: 'english',
  },
  quickMath: {
    id: 'quickMath',
    name: 'Tính Nhanh',
    icon: '⚡',
    color: 'from-amber-500 to-orange-500',
    desc: 'Giải phép tính 60 giây',
    category: 'math',
  },
  simonSays: {
    id: 'simonSays',
    name: 'Simon Says',
    icon: '🌈',
    color: 'from-pink-500 to-rose-500',
    desc: 'Nhớ và lặp lại màu',
    category: 'brain',
  },
  balloonPop: {
    id: 'balloonPop',
    name: 'Bắn Bóng',
    icon: '🎈',
    color: 'from-sky-500 to-blue-500',
    desc: 'Bấm nổ bóng bay',
    category: 'reflex',
  },
};

export const getGame = (id) => GAMES[id];
export const getAllGames = () => Object.values(GAMES);
export const getGamesByCategory = (cat) => cat === 'all' ? getAllGames() : getAllGames().filter(g => g.category === cat);
