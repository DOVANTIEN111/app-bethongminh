export const ACHIEVEMENTS = {
  firstLesson: { id: 'firstLesson', name: 'Bước Đầu Tiên', icon: '🌟', desc: 'Hoàn thành bài học đầu tiên' },
  streak3: { id: 'streak3', name: 'Kiên Trì', icon: '🔥', desc: 'Học 3 ngày liên tiếp' },
  streak7: { id: 'streak7', name: 'Siêu Kiên Trì', icon: '💪', desc: 'Học 7 ngày liên tiếp' },
  streak30: { id: 'streak30', name: 'Huyền Thoại', icon: '👑', desc: 'Học 30 ngày liên tiếp' },
  lessons10: { id: 'lessons10', name: 'Siêng Năng', icon: '📚', desc: 'Hoàn thành 10 bài học' },
  perfect5: { id: 'perfect5', name: 'Xuất Sắc', icon: '💯', desc: '5 bài điểm tuyệt đối' },
  gamer10: { id: 'gamer10', name: 'Game Thủ', icon: '🎮', desc: 'Chơi 10 lượt game' },
  gamer50: { id: 'gamer50', name: 'Pro Gamer', icon: '🏆', desc: 'Chơi 50 lượt game' },
  explorer: { id: 'explorer', name: 'Nhà Thám Hiểm', icon: '🗺️', desc: 'Thử tất cả môn học' },
};

export const getAchievement = (id) => ACHIEVEMENTS[id];
export const getAllAchievements = () => Object.values(ACHIEVEMENTS);
