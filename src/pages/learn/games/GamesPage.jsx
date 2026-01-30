// src/pages/learn/games/GamesPage.jsx
// Trang danh sách các game giáo dục

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GAMES_INFO } from '../../../components/games';

const GamesPage = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');

  // Lọc games
  const filteredGames = filter === 'all'
    ? GAMES_INFO
    : GAMES_INFO.filter(g => g.subjects.includes(filter));

  const filters = [
    { id: 'all', label: 'Tất cả', icon: '🎮' },
    { id: 'math', label: 'Toán', icon: '🔢' },
    { id: 'vietnamese', label: 'Tiếng Việt', icon: '📝' },
    { id: 'general', label: 'Kỹ năng', icon: '🧠' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 via-purple-50 to-pink-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link
              to="/learn"
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <span className="text-3xl">🎮</span>
                Game Giáo dục
              </h1>
              <p className="text-white/80 text-sm">Học mà chơi, chơi mà học</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all
                ${filter === f.id
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
            >
              <span>{f.icon}</span>
              {f.label}
            </button>
          ))}
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredGames.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(`/learn/games/${game.id}`)}
              className={`${game.bgColor} rounded-2xl p-5 shadow-lg cursor-pointer hover:shadow-xl transition-all hover:scale-[1.02]`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${game.color} flex items-center justify-center text-3xl shadow-lg`}>
                  {game.icon}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800">{game.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{game.description}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-white/70 px-2 py-1 rounded-full text-gray-600">
                      {game.ageRange} tuổi
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      game.difficulty === 'easy'
                        ? 'bg-green-100 text-green-700'
                        : game.difficulty === 'medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                    }`}>
                      {game.difficulty === 'easy' ? 'Dễ' : game.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
                    </span>
                  </div>
                </div>

                {/* Play button */}
                <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${game.color} flex items-center justify-center text-white shadow-lg`}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>

              {/* Skills */}
              <div className="mt-3 pt-3 border-t border-gray-200/50">
                <p className="text-xs text-gray-500">
                  <span className="font-medium">Kỹ năng:</span> {game.skills.join(', ')}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tips section */}
        <div className="mt-8 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-200">
          <h3 className="font-bold text-amber-800 flex items-center gap-2 mb-3">
            <span className="text-2xl">💡</span>
            Mẹo học tốt
          </h3>
          <ul className="space-y-2 text-amber-700 text-sm">
            <li className="flex items-start gap-2">
              <span>✓</span>
              <span>Chơi game 15-20 phút mỗi ngày giúp ghi nhớ tốt hơn</span>
            </li>
            <li className="flex items-start gap-2">
              <span>✓</span>
              <span>Bắt đầu từ game dễ, tăng dần độ khó</span>
            </li>
            <li className="flex items-start gap-2">
              <span>✓</span>
              <span>Nghỉ ngơi giữa các game để não bộ xử lý thông tin</span>
            </li>
          </ul>
        </div>

        {/* Stats preview */}
        <div className="mt-6 bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="font-bold text-gray-800 mb-4">Thành tích của bé</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-purple-50 rounded-xl p-4">
              <div className="text-3xl font-bold text-purple-600">0</div>
              <div className="text-xs text-gray-600">Game đã chơi</div>
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <div className="text-3xl font-bold text-green-600">0</div>
              <div className="text-xs text-gray-600">Điểm cao nhất</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="text-3xl font-bold text-blue-600">0</div>
              <div className="text-xs text-gray-600">Phút chơi</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamesPage;
