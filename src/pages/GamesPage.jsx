import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useAudio } from '../contexts/AudioContext';
import { getAllGames, getGamesByCategory, GAME_CATEGORIES } from '../data/games';
import { ChevronRight, Trophy, Star, Zap } from 'lucide-react';

export default function GamesPage() {
  const navigate = useNavigate();
  const { currentChild } = useAuth();
  const { playSound } = useAudio();
  const [category, setCategory] = useState('all');
  
  const games = getGamesByCategory(category);
  
  // Calculate total best scores
  const totalBestScore = Object.values(currentChild?.gameScores || {}).reduce((sum, g) => sum + (g.best || 0), 0);
  const gamesPlayed = Object.keys(currentChild?.gameScores || {}).length;
  
  const handleGame = (id) => {
    playSound('click');
    navigate(`/games/${id}`);
  };
  
  return (
    <div className="px-4 py-4 pb-24">
      {/* Header with stats */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-4 mb-4 text-white"
      >
        <h1 className="text-2xl font-bold mb-3">🎮 Khu Vui Chơi</h1>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white/20 rounded-xl p-2 text-center">
            <p className="text-xl font-bold">{games.length}</p>
            <p className="text-xs text-white/80">Games</p>
          </div>
          <div className="bg-white/20 rounded-xl p-2 text-center">
            <p className="text-xl font-bold">{gamesPlayed}</p>
            <p className="text-xs text-white/80">Đã chơi</p>
          </div>
          <div className="bg-white/20 rounded-xl p-2 text-center">
            <p className="text-xl font-bold">{totalBestScore}</p>
            <p className="text-xs text-white/80">Tổng điểm</p>
          </div>
        </div>
      </motion.div>
      
      {/* Categories */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide"
      >
        {GAME_CATEGORIES.map((cat, i) => (
          <motion.button
            key={cat.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            onClick={() => { playSound('click'); setCategory(cat.id); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
              category === cat.id
                ? 'bg-indigo-500 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 shadow'
            }`}
          >
            <span>{cat.icon}</span>
            <span className="font-medium">{cat.name}</span>
          </motion.button>
        ))}
      </motion.div>
      
      {/* Games Grid */}
      <div className="grid grid-cols-2 gap-3">
        {games.map((game, i) => {
          const gameScore = currentChild?.gameScores?.[game.id];
          const isNew = !gameScore;
          
          return (
            <motion.button
              key={game.id}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.05, type: 'spring' }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleGame(game.id)}
              className={`bg-gradient-to-br ${game.color} text-white rounded-2xl p-4 text-left shadow-lg relative overflow-hidden`}
            >
              {/* Background decoration */}
              <div className="absolute -right-4 -bottom-4 text-7xl opacity-20">{game.icon}</div>
              
              {/* New badge */}
              {isNew && (
                <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Zap className="w-3 h-3" /> NEW
                </div>
              )}
              
              <div className="relative">
                <motion.div 
                  className="text-4xl mb-2"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  {game.icon}
                </motion.div>
                <p className="font-bold text-lg">{game.name}</p>
                <p className="text-white/80 text-sm">{game.desc}</p>
                
                {gameScore?.best > 0 && (
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full text-sm">
                      <Trophy className="w-4 h-4 text-yellow-300" />
                      <span className="font-bold">{gameScore.best}</span>
                    </div>
                    {gameScore.plays > 1 && (
                      <span className="text-xs text-white/60">×{gameScore.plays} lần</span>
                    )}
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
      
      {/* Tip */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 bg-indigo-50 rounded-xl p-3 text-center"
      >
        <p className="text-indigo-600 text-sm">💡 Chơi game mỗi ngày để hoàn thành thử thách!</p>
      </motion.div>
    </div>
  );
}
