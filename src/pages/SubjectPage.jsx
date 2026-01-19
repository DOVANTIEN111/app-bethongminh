import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMember } from '../contexts/MemberContext';
import { useAudio } from '../contexts/AudioContext';
import { getSubject } from '../data/subjects';
import { ArrowLeft, CheckCircle, Lock, Star } from 'lucide-react';

export default function SubjectPage() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { currentMember } = useMember();
  const { playSound } = useAudio();
  
  const subject = getSubject(subjectId);
  const progress = currentMember?.progress?.[subjectId] || { completed: [], scores: {} };
  
  if (!subject) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500">Môn học không tồn tại</p>
        <button onClick={() => navigate('/')} className="mt-4 text-indigo-600">Về trang chủ</button>
      </div>
    );
  }
  
  const handleLesson = (lesson) => {
    playSound('click');
    navigate(`/lesson/${subjectId}/${lesson.id}`);
  };
  
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className={`bg-gradient-to-r ${subject.color} text-white px-4 py-6`}>
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-white/20">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <span className="text-4xl">{subject.icon}</span>
          <div>
            <h1 className="text-2xl font-bold">{subject.name}</h1>
            <p className="text-white/80">{subject.desc}</p>
          </div>
        </div>
        
        {/* Progress */}
        <div className="bg-white/20 rounded-xl p-3">
          <div className="flex justify-between text-sm mb-2">
            <span>Tiến độ</span>
            <span>{progress.completed.length}/{subject.lessons.length} bài</span>
          </div>
          <div className="h-2 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full"
              style={{ width: `${(progress.completed.length / subject.lessons.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* Lessons */}
      <div className="p-4 space-y-3">
        {subject.lessons.map((lesson, i) => {
          const isCompleted = progress.completed.includes(lesson.id);
          const score = progress.scores[lesson.id];
          const isLocked = i > 0 && !progress.completed.includes(subject.lessons[i - 1].id);
          
          return (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <button
                onClick={() => !isLocked && handleLesson(lesson)}
                disabled={isLocked}
                className={`w-full p-4 rounded-2xl flex items-center gap-4 text-left transition-all ${
                  isLocked
                    ? 'bg-gray-100 opacity-60'
                    : isCompleted
                    ? 'bg-green-50 border-2 border-green-200'
                    : 'bg-white shadow-lg hover:shadow-xl'
                }`}
              >
                {/* Number */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  isCompleted ? 'bg-green-500 text-white' : isLocked ? 'bg-gray-300 text-gray-500' : `bg-gradient-to-r ${subject.color} text-white`
                }`}>
                  {isCompleted ? <CheckCircle className="w-5 h-5" /> : isLocked ? <Lock className="w-4 h-4" /> : i + 1}
                </div>
                
                {/* Info */}
                <div className="flex-1">
                  <p className={`font-semibold ${isLocked ? 'text-gray-400' : 'text-gray-800'}`}>{lesson.title}</p>
                  <p className="text-sm text-gray-500">Cấp độ {lesson.level}</p>
                </div>
                
                {/* Score */}
                {isCompleted && score && (
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-amber-500" />
                    <span className="font-bold">{score}</span>
                  </div>
                )}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
