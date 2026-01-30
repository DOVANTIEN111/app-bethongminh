// src/pages/learn/games/GamePlayPage.jsx
// Trang chơi game

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CountingGame,
  SpellingGame,
  MatchingGame,
  MemoryGame,
  BalloonPopGame,
  getGameInfo
} from '../../../components/games';

const GamePlayPage = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [showIntro, setShowIntro] = useState(true);
  const [gameInfo, setGameInfo] = useState(null);

  useEffect(() => {
    const info = getGameInfo(gameId);
    if (info) {
      setGameInfo(info);
    } else {
      navigate('/learn/games');
    }
  }, [gameId, navigate]);

  const handleComplete = (result) => {
    console.log('Game completed:', result);
    // TODO: Save score to database
  };

  const handleExit = () => {
    navigate('/learn/games');
  };

  // Render game component
  const renderGame = () => {
    switch (gameId) {
      case 'counting':
        return <CountingGame onComplete={handleComplete} onExit={handleExit} />;
      case 'spelling':
        return <SpellingGame onComplete={handleComplete} onExit={handleExit} />;
      case 'matching':
        return <MatchingGame onComplete={handleComplete} onExit={handleExit} />;
      case 'memory':
        return <MemoryGame onComplete={handleComplete} onExit={handleExit} />;
      case 'balloon':
        return <BalloonPopGame onComplete={handleComplete} onExit={handleExit} />;
      default:
        return null;
    }
  };

  if (!gameInfo) return null;

  // Intro screen
  if (showIntro) {
    return (
      <div className={`min-h-screen bg-gradient-to-b ${gameInfo.color.replace('from-', 'from-').replace('to-', 'via-')} to-white flex items-center justify-center p-4`}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 shadow-2xl text-center max-w-md w-full"
        >
          {/* Game icon */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ repeat: Infinity, duration: 2 }}
            className={`w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br ${gameInfo.color} flex items-center justify-center text-5xl shadow-xl mb-6`}
          >
            {gameInfo.icon}
          </motion.div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {gameInfo.title}
          </h1>
          <p className="text-gray-600 mb-6">{gameInfo.description}</p>

          {/* Rules */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-6 text-left">
            <h3 className="font-bold text-gray-700 mb-2">Cách chơi:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {gameId === 'counting' && (
                <>
                  <li className="flex items-start gap-2">
                    <span className="text-lg">1️⃣</span>
                    <span>Đếm số hình ảnh trên màn hình</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-lg">2️⃣</span>
                    <span>Chọn đáp án đúng</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-lg">3️⃣</span>
                    <span>Bạn có 3 mạng, mỗi câu sai mất 1 mạng</span>
                  </li>
                </>
              )}
              {gameId === 'spelling' && (
                <>
                  <li className="flex items-start gap-2">
                    <span className="text-lg">1️⃣</span>
                    <span>Nhìn hình ảnh và đoán từ</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-lg">2️⃣</span>
                    <span>Chọn các chữ cái theo thứ tự đúng</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-lg">3️⃣</span>
                    <span>Nhấn vào chữ đã chọn để bỏ</span>
                  </li>
                </>
              )}
              {gameId === 'matching' && (
                <>
                  <li className="flex items-start gap-2">
                    <span className="text-lg">1️⃣</span>
                    <span>Chọn một ô bên trái</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-lg">2️⃣</span>
                    <span>Chọn ô tương ứng bên phải</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-lg">3️⃣</span>
                    <span>Nối đúng tất cả các cặp để qua vòng</span>
                  </li>
                </>
              )}
              {gameId === 'memory' && (
                <>
                  <li className="flex items-start gap-2">
                    <span className="text-lg">1️⃣</span>
                    <span>Lật 2 thẻ để xem hình</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-lg">2️⃣</span>
                    <span>Ghi nhớ vị trí các hình</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-lg">3️⃣</span>
                    <span>Tìm tất cả các cặp giống nhau</span>
                  </li>
                </>
              )}
              {gameId === 'balloon' && (
                <>
                  <li className="flex items-start gap-2">
                    <span className="text-lg">1️⃣</span>
                    <span>Đọc phép tính trên màn hình</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-lg">2️⃣</span>
                    <span>Tính nhẩm kết quả</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-lg">3️⃣</span>
                    <span>Bắn bóng bay có đáp án đúng</span>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {gameInfo.skills.map((skill, i) => (
              <span
                key={i}
                className={`text-sm px-3 py-1 rounded-full bg-gradient-to-r ${gameInfo.color} text-white`}
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/learn/games')}
              className="flex-1 bg-gray-200 text-gray-700 font-bold py-4 px-6 rounded-xl hover:bg-gray-300 transition-all"
            >
              Quay lại
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowIntro(false)}
              className={`flex-1 bg-gradient-to-r ${gameInfo.color} text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all`}
            >
              Bắt đầu!
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return renderGame();
};

export default GamePlayPage;
