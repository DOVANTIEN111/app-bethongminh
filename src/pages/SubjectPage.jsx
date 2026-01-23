// src/pages/SubjectPage.jsx
// Trang danh sách bài học của môn học - v3.3.0
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useAudio } from '../contexts/AudioContext';
import { getSubject } from '../data/subjects';
import { CheckCircle, Lock, Star, Play, Trophy, Flame, ChevronRight, Unlock, ShieldCheck } from 'lucide-react';

export default function SubjectPage() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { currentChild, account } = useAuth();
  const { playSound, stopAudio } = useAudio();
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [devMode, setDevMode] = useState(false);
  
  const subject = getSubject(subjectId);
  const progress = currentChild?.progress?.[subjectId] || { completed: [], scores: {} };

  // Check if user is admin or teacher (by email or role)
  const isAdminOrTeacher = account?.email?.includes('admin') || 
                           account?.email?.includes('teacher') ||
                           account?.email?.includes('giaovien') ||
                           account?.role === 'admin' ||
                           account?.role === 'teacher' ||
                           devMode;

  // Dừng tất cả audio khi vào trang danh sách bài học
  useEffect(() => {
    stopAudio();
  }, [stopAudio]);
  
  if (!subject) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-6xl mb-4">📚</div>
        <p className="text-gray-500 mb-4">Môn học không tồn tại</p>
        <button 
          onClick={() => navigate('/')} 
          className="px-6 py-3 bg-indigo-500 text-white rounded-xl font-medium"
        >
          Về trang chủ
        </button>
      </div>
    );
  }

  // Group lessons by level
  const levels = [...new Set(subject.lessons.map(l => l.level))].sort((a, b) => a - b);
  const filteredLessons = selectedLevel === 'all' 
    ? subject.lessons 
    : subject.lessons.filter(l => l.level === parseInt(selectedLevel));
  
  // Calculate stats
  const totalCompleted = progress.completed.length;
  const totalLessons = subject.lessons.length;
  const progressPercent = Math.round((totalCompleted / totalLessons) * 100);
  const avgScore = Object.values(progress.scores).length > 0
    ? Math.round(Object.values(progress.scores).reduce((a, b) => a + b, 0) / Object.values(progress.scores).length)
    : 0;
  
  const handleLesson = (lesson) => {
    playSound('click');
    // Nếu là môn Toán với bài học mới, dùng MathLessonPage
    if (subjectId === 'math' && lesson.id.startsWith('math-')) {
      navigate(`/math/${lesson.id}`);
    }
    // Nếu là môn Tiếng Việt với bài học mới, dùng VietnameseLessonPage
    else if (subjectId === 'vietnamese' && lesson.id.startsWith('viet-')) {
      navigate(`/vietnamese/${lesson.id}`);
    }
    // Nếu là môn Khoa học, dùng ScienceLessonPage
    else if (subjectId === 'science' && lesson.id.startsWith('s')) {
      navigate(`/science/${lesson.id}`);
    }
    // Nếu là môn Kỹ năng sống, dùng LifeSkillsLessonPage
    else if (subjectId === 'lifeskills' && lesson.id.startsWith('ls')) {
      navigate(`/lifeskills/${lesson.id}`);
    }
    else {
      navigate(`/lesson/${subjectId}/${lesson.id}`);
    }
  };

  // Logic mở khóa bài học - Admin/Teacher mở tất cả
  const isLessonLocked = (index) => {
    // Admin/Teacher mở khóa tất cả
    if (isAdminOrTeacher) return false;
    
    // 3 bài đầu luôn mở
    if (index < 3) return false;
    
    // Bài thứ 4 trở đi: cần hoàn thành bài ngay trước đó
    const prevLessonId = subject.lessons[index - 1]?.id;
    return !progress.completed.includes(prevLessonId);
  };

  // Find next recommended lesson
  const nextLesson = subject.lessons.find((lesson, index) => {
    return !progress.completed.includes(lesson.id) && !isLessonLocked(index);
  });
  
  // Secret tap to enable dev mode (tap header 5 times)
  const [tapCount, setTapCount] = useState(0);
  const handleHeaderTap = () => {
    const newCount = tapCount + 1;
    setTapCount(newCount);
    if (newCount >= 5) {
      setDevMode(!devMode);
      setTapCount(0);
      playSound('complete');
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin/Dev Mode Banner */}
      {isAdminOrTeacher && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 flex items-center justify-center gap-2 text-sm">
          <ShieldCheck className="w-4 h-4" />
          <span className="font-medium">
            {devMode ? 'Chế độ Dev - Mở khóa tất cả' : 'Admin/Giáo viên - Mở khóa tất cả'}
          </span>
          <Unlock className="w-4 h-4" />
        </div>
      )}
      
      {/* Header */}
      <div className={`bg-gradient-to-br ${subject.color} text-white px-4 pt-4 pb-8`}>
        <div className="flex items-center gap-4 mb-6" onClick={handleHeaderTap}>
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' }}
            className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-4xl"
          >
            {subject.icon}
          </motion.div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{subject.name}</h1>
            <p className="text-white/80">{subject.desc}</p>
            {tapCount > 0 && tapCount < 5 && (
              <p className="text-xs text-white/50 mt-1">Tap {5 - tapCount} lần nữa để bật Dev Mode</p>
            )}
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Trophy className="w-4 h-4" />
            </div>
            <p className="text-xl font-bold">{totalCompleted}/{totalLessons}</p>
            <p className="text-xs text-white/70">Hoàn thành</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="w-4 h-4" />
            </div>
            <p className="text-xl font-bold">{avgScore || '-'}</p>
            <p className="text-xs text-white/70">Điểm TB</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Flame className="w-4 h-4" />
            </div>
            <p className="text-xl font-bold">{progressPercent}%</p>
            <p className="text-xs text-white/70">Tiến độ</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="bg-white/20 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-white rounded-full"
          />
        </div>
      </div>
      
      {/* Continue Learning Card */}
      {nextLesson && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 -mt-4"
        >
          <button
            onClick={() => handleLesson(nextLesson)}
            className="w-full bg-white rounded-2xl p-4 shadow-lg flex items-center gap-4"
          >
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${subject.color} flex items-center justify-center`}>
              <Play className="w-6 h-6 text-white fill-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-xs text-indigo-600 font-medium mb-0.5">TIẾP TỤC HỌC</p>
              <p className="font-bold text-gray-800">{nextLesson.title}</p>
              <p className="text-sm text-gray-500">{nextLesson.desc}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </motion.div>
      )}

      {/* Level Filter */}
      <div className="px-4 mt-4 mb-2">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => { playSound('click'); setSelectedLevel('all'); }}
            className={`px-4 py-2 rounded-full whitespace-nowrap font-medium text-sm transition-all ${
              selectedLevel === 'all' 
                ? `bg-gradient-to-r ${subject.color} text-white shadow` 
                : 'bg-white text-gray-600 shadow-sm'
            }`}
          >
            Tất cả ({totalLessons})
          </button>
          {levels.map(level => {
            const count = subject.lessons.filter(l => l.level === level).length;
            const completed = subject.lessons.filter(l => 
              l.level === level && progress.completed.includes(l.id)
            ).length;
            
            return (
              <button
                key={level}
                onClick={() => { playSound('click'); setSelectedLevel(level.toString()); }}
                className={`px-4 py-2 rounded-full whitespace-nowrap font-medium text-sm transition-all ${
                  selectedLevel === level.toString()
                    ? `bg-gradient-to-r ${subject.color} text-white shadow`
                    : 'bg-white text-gray-600 shadow-sm'
                }`}
              >
                Cấp {level} ({completed}/{count})
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Lessons List */}
      <div className="px-4 pb-8">
        <div className="space-y-3">
          {filteredLessons.map((lesson, i) => {
            const originalIndex = subject.lessons.findIndex(l => l.id === lesson.id);
            const isCompleted = progress.completed.includes(lesson.id);
            const score = progress.scores[lesson.id];
            const isLocked = isLessonLocked(originalIndex);
            const isNext = nextLesson?.id === lesson.id;
            
            return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <button
                  onClick={() => !isLocked && handleLesson(lesson)}
                  disabled={isLocked}
                  className={`w-full p-4 rounded-2xl flex items-center gap-4 text-left transition-all ${
                    isLocked
                      ? 'bg-gray-100 opacity-60 cursor-not-allowed'
                      : isNext
                      ? `bg-gradient-to-r ${subject.color} text-white shadow-lg`
                      : isCompleted
                      ? 'bg-green-50 border-2 border-green-200'
                      : 'bg-white shadow hover:shadow-lg'
                  }`}
                >
                  {/* Number/Status */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                    isNext
                      ? 'bg-white/20'
                      : isCompleted 
                      ? 'bg-green-500 text-white' 
                      : isLocked 
                      ? 'bg-gray-200 text-gray-400' 
                      : `bg-gradient-to-br ${subject.color} text-white`
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : isLocked ? (
                      <Lock className="w-5 h-5" />
                    ) : (
                      originalIndex + 1
                    )}
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold truncate ${
                      isNext ? 'text-white' : isLocked ? 'text-gray-400' : 'text-gray-800'
                    }`}>
                      {lesson.title}
                    </p>
                    <p className={`text-sm truncate ${
                      isNext ? 'text-white/80' : 'text-gray-500'
                    }`}>
                      {lesson.desc}
                    </p>
                    <div className={`flex items-center gap-2 mt-1 text-xs ${
                      isNext ? 'text-white/70' : 'text-gray-400'
                    }`}>
                      <span>Cấp độ {lesson.level}</span>
                      {isCompleted && score && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            {score} điểm
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Action indicator */}
                  {!isLocked && (
                    <div className={isNext ? 'text-white' : 'text-gray-300'}>
                      {isNext ? (
                        <Play className="w-5 h-5 fill-current" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                    </div>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>
        
        {/* Empty state */}
        {filteredLessons.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-2">📭</div>
            <p className="text-gray-500">Không có bài học nào ở cấp độ này</p>
          </div>
        )}
        
        {/* Completed all */}
        {progressPercent === 100 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 bg-gradient-to-r from-amber-400 to-orange-400 rounded-2xl p-6 text-center text-white"
          >
            <div className="text-4xl mb-2">🎉</div>
            <p className="font-bold text-lg">Tuyệt vời!</p>
            <p className="text-white/90">Bạn đã hoàn thành tất cả bài học của {subject.name}!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
