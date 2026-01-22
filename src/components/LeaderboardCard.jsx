// src/components/LeaderboardCard.jsx
// Component hiển thị thứ hạng trong leaderboard
import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Medal, Star } from 'lucide-react';

// Medal component cho top 3
const RankMedal = ({ rank }) => {
  const medals = {
    1: { bg: 'from-yellow-400 to-amber-500', icon: '🥇', label: '1st' },
    2: { bg: 'from-gray-300 to-gray-400', icon: '🥈', label: '2nd' },
    3: { bg: 'from-orange-400 to-orange-600', icon: '🥉', label: '3rd' },
  };

  const medal = medals[rank];
  if (!medal) return null;

  return (
    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${medal.bg} flex items-center justify-center shadow-lg`}>
      <span className="text-lg">{medal.icon}</span>
    </div>
  );
};

// Card cho 1 user trong leaderboard
export function LeaderboardCard({ user, rank, isCurrentUser = false, delay = 0 }) {
  const isTop3 = rank <= 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className={`flex items-center gap-3 p-3 rounded-2xl ${
        isCurrentUser
          ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200'
          : isTop3
          ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-100'
          : 'bg-white border border-gray-100'
      }`}
    >
      {/* Rank */}
      <div className="w-10 flex-shrink-0 flex items-center justify-center">
        {isTop3 ? (
          <RankMedal rank={rank} />
        ) : (
          <span className="text-lg font-bold text-gray-400">#{rank}</span>
        )}
      </div>

      {/* Avatar */}
      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
        isTop3
          ? 'bg-gradient-to-br from-amber-200 to-yellow-300'
          : 'bg-gradient-to-br from-gray-100 to-gray-200'
      }`}>
        {user.avatar || '👦'}
      </div>

      {/* Name & Level */}
      <div className="flex-1 min-w-0">
        <p className={`font-bold truncate ${
          isCurrentUser ? 'text-indigo-700' : 'text-gray-800'
        }`}>
          {user.name}
          {isCurrentUser && <span className="text-xs ml-1 text-indigo-500">(Bạn)</span>}
        </p>
        <p className="text-xs text-gray-500">Level {user.level || 1}</p>
      </div>

      {/* XP */}
      <div className="flex items-center gap-1 bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full">
        <Star className="w-4 h-4" />
        <span className="font-bold text-sm">{user.xp?.toLocaleString() || 0}</span>
      </div>
    </motion.div>
  );
}

// Mini card cho widget ở HomePage
export function LeaderboardMiniCard({ user, rank, isCurrentUser = false }) {
  return (
    <div className={`flex items-center gap-2 py-2 px-3 rounded-xl ${
      isCurrentUser ? 'bg-indigo-50' : ''
    }`}>
      {/* Rank */}
      <span className={`w-6 text-center font-bold ${
        rank === 1 ? 'text-yellow-500' :
        rank === 2 ? 'text-gray-400' :
        rank === 3 ? 'text-orange-500' :
        'text-gray-400'
      }`}>
        {rank <= 3 ? ['🥇', '🥈', '🥉'][rank - 1] : `#${rank}`}
      </span>

      {/* Avatar */}
      <span className="text-lg">{user.avatar || '👦'}</span>

      {/* Name */}
      <span className={`flex-1 text-sm truncate ${
        isCurrentUser ? 'font-bold text-indigo-700' : 'text-gray-700'
      }`}>
        {user.name}
        {isCurrentUser && <span className="text-xs ml-1">(Bạn)</span>}
      </span>

      {/* XP */}
      <span className="text-xs font-medium text-amber-600">
        {user.xp?.toLocaleString() || 0} XP
      </span>
    </div>
  );
}

// Widget Leaderboard cho HomePage
export function LeaderboardWidget({ users = [], currentChildId, onViewAll }) {
  // Lấy top 5 + vị trí của user hiện tại
  const top5 = users.slice(0, 5);
  const currentUserInTop5 = top5.some(u => u.id === currentChildId);
  const currentUserIndex = users.findIndex(u => u.id === currentChildId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-amber-400 to-orange-400">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏆</span>
          <h3 className="font-bold text-white">Bảng xếp hạng</h3>
        </div>
        <button
          onClick={onViewAll}
          className="text-sm text-white/90 hover:text-white font-medium"
        >
          Xem tất cả →
        </button>
      </div>

      {/* List */}
      <div className="divide-y divide-gray-50">
        {top5.map((user, index) => (
          <LeaderboardMiniCard
            key={user.id}
            user={user}
            rank={index + 1}
            isCurrentUser={user.id === currentChildId}
          />
        ))}

        {/* Hiển thị vị trí user nếu không trong top 5 */}
        {!currentUserInTop5 && currentUserIndex > 4 && (
          <>
            <div className="text-center text-gray-400 text-xs py-1">• • •</div>
            <LeaderboardMiniCard
              user={users[currentUserIndex]}
              rank={currentUserIndex + 1}
              isCurrentUser={true}
            />
          </>
        )}
      </div>

      {/* Empty state */}
      {users.length === 0 && (
        <div className="text-center py-6 text-gray-500">
          <span className="text-3xl mb-2 block">📊</span>
          <p className="text-sm">Chưa có dữ liệu</p>
        </div>
      )}
    </motion.div>
  );
}

export default LeaderboardCard;
