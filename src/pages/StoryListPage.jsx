import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMember } from '../contexts/MemberContext';
import { useAudio } from '../contexts/AudioContext';
import { getAllStories } from '../data/stories';
import { ArrowLeft, BookOpen, Lock, Star, ChevronRight, Sparkles } from 'lucide-react';

export default function StoryListPage() {
  const navigate = useNavigate();
  const { currentMember } = useMember();
  const { playSound } = useAudio();
  
  const stories = getAllStories();
  const storyProgress = currentMember?.storyProgress || {};
  const streak = currentMember?.stats?.streak || 0;
  
  // Tính số chương đã mở dựa trên streak
  const getUnlockedCount = (storyId, totalChapters) => {
    const progress = storyProgress[storyId];
    if (progress?.completed) return totalChapters; // Đã hoàn thành
    
    // Mỗi ngày streak = 1 chương mới
    // Chương 1 luôn mở
    return Math.min(Math.max(1, streak), totalChapters);
  };
  
  const handleSelectStory = (story) => {
    playSound('click');
    navigate(`/story/${story.id}`);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-6">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/')} className="p-2 rounded-full hover:bg-white/20">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <BookOpen className="w-7 h-7" /> Truyện Cổ Tích
            </h1>
            <p className="text-white/80">Học mỗi ngày để mở chương mới!</p>
          </div>
        </div>
        
        {/* Streak info */}
        <div className="bg-white/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🔥</span>
              <div>
                <p className="font-bold text-lg">{streak} ngày liên tiếp</p>
                <p className="text-white/80 text-sm">Học tiếp để mở thêm chương!</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{streak}</p>
              <p className="text-xs text-white/80">chương mở</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stories list */}
      <div className="p-4 space-y-4">
        {stories.map((story, i) => {
          const unlockedChapters = getUnlockedCount(story.id, story.totalChapters);
          const readChapters = storyProgress[story.id]?.lastChapter || 0;
          const isCompleted = readChapters >= story.totalChapters;
          const progress = Math.round((readChapters / story.totalChapters) * 100);
          
          return (
            <motion.button
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => handleSelectStory(story)}
              className="w-full bg-white rounded-2xl shadow-lg overflow-hidden text-left"
            >
              {/* Cover */}
              <div className={`bg-gradient-to-r ${story.color} p-4 flex items-center gap-4`}>
                <div className="w-20 h-20 bg-white/20 rounded-xl flex items-center justify-center text-5xl">
                  {story.icon}
                </div>
                <div className="flex-1 text-white">
                  <h3 className="font-bold text-xl">{story.title}</h3>
                  <p className="text-white/80 text-sm">{story.titleEn}</p>
                  <p className="text-white/90 text-sm mt-1">{story.description}</p>
                </div>
                <ChevronRight className="w-6 h-6 text-white/80" />
              </div>
              
              {/* Progress */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <BookOpen className="w-4 h-4" />
                    <span>{story.totalChapters} chương</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {isCompleted ? (
                      <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <Star className="w-3 h-3 fill-green-500" /> Hoàn thành
                      </span>
                    ) : (
                      <span className="bg-amber-100 text-amber-600 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> {unlockedChapters}/{story.totalChapters} mở
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className={`h-full rounded-full ${isCompleted ? 'bg-green-500' : 'bg-gradient-to-r from-amber-400 to-orange-500'}`}
                  />
                </div>
                
                {/* Chapter indicators */}
                <div className="flex gap-1 mt-3">
                  {Array.from({ length: story.totalChapters }).map((_, idx) => {
                    const isRead = idx < readChapters;
                    const isUnlocked = idx < unlockedChapters;
                    
                    return (
                      <div
                        key={idx}
                        className={`flex-1 h-1.5 rounded-full ${
                          isRead 
                            ? 'bg-green-500' 
                            : isUnlocked 
                              ? 'bg-amber-300' 
                              : 'bg-gray-200'
                        }`}
                      />
                    );
                  })}
                </div>
                
                <p className="text-xs text-gray-500 mt-2">
                  {readChapters === 0 
                    ? '📖 Chưa đọc' 
                    : isCompleted 
                      ? '🎉 Đã đọc xong!' 
                      : `📖 Đang đọc chương ${readChapters}`}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
      
      {/* Tips */}
      <div className="px-4 mb-6">
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4">
          <p className="text-purple-700 text-sm">
            <strong>💡 Mẹo:</strong> Học bài mỗi ngày để tăng streak và mở khóa thêm chương truyện mới! Mỗi ngày streak = 1 chương mới!
          </p>
        </div>
      </div>
    </div>
  );
}
