import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useAudio } from '../contexts/AudioContext';
import { getSubject } from '../data/subjects';
import { LESSON_QUESTIONS } from '../data/lessons';
import { ArrowLeft, CheckCircle, XCircle, Star, Home } from 'lucide-react';

export default function LessonPage() {
  const { subjectId, lessonId } = useParams();
  const navigate = useNavigate();
  const { completeLesson } = useAuth();
  const { playSound, speak } = useAudio();
  
  const subject = getSubject(subjectId);
  const lesson = subject?.lessons.find(l => l.id === lessonId);
  const questions = LESSON_QUESTIONS[lessonId] || [];
  
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);
  
  useEffect(() => {
    if (subjectId === 'english' && questions[current]) {
      setTimeout(() => speak(questions[current].q), 500);
    }
  }, [current, subjectId]);
  
  if (!subject || !lesson || questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-6xl mb-4">📚</div>
        <p className="text-gray-500 mb-4">Bài học chưa sẵn sàng</p>
        <button onClick={() => navigate(-1)} className="px-6 py-3 bg-indigo-500 text-white rounded-xl">Quay lại</button>
      </div>
    );
  }
  
  const handleSelect = (option) => {
    if (showResult) return;
    setSelected(option);
    const correct = option === questions[current].answer;
    
    if (correct) {
      playSound('correct');
      setScore(s => s + 1);
    } else {
      playSound('wrong');
    }
    
    setShowResult(true);
    
    setTimeout(() => {
      if (current < questions.length - 1) {
        setCurrent(c => c + 1);
        setSelected(null);
        setShowResult(false);
      } else {
        setFinished(true);
        const finalScore = correct ? score + 1 : score;
        const percentage = Math.round((finalScore / questions.length) * 100);
        completeLesson(subjectId, lessonId, percentage);
        if (percentage >= 80) playSound('complete');
      }
    }, 1500);
  };
  
  if (finished) {
    const percentage = Math.round((score / questions.length) * 100);
    const stars = percentage >= 90 ? 3 : percentage >= 70 ? 2 : percentage >= 50 ? 1 : 0;
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-500 to-purple-600 flex flex-col items-center justify-center p-4 text-white">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">
            {percentage >= 80 ? '🎉' : percentage >= 50 ? '👍' : '💪'}
          </div>
          <h1 className="text-3xl font-bold mb-2">Hoàn thành!</h1>
          <p className="text-xl mb-4">{lesson.title}</p>
          
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3].map(i => (
              <Star
                key={i}
                className={`w-10 h-10 ${i <= stars ? 'text-yellow-400 fill-yellow-400' : 'text-white/30'}`}
              />
            ))}
          </div>
          
          <div className="bg-white/20 rounded-2xl p-6 mb-6">
            <p className="text-4xl font-bold">{score}/{questions.length}</p>
            <p className="text-sm opacity-80">Câu trả lời đúng</p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => {
                setCurrent(0);
                setScore(0);
                setSelected(null);
                setShowResult(false);
                setFinished(false);
              }}
              className="px-6 py-3 bg-white/20 rounded-xl font-semibold"
            >
              Học lại
            </button>
            <button
              onClick={() => navigate(`/subject/${subjectId}`)}
              className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-semibold"
            >
              Tiếp tục
            </button>
          </div>
        </motion.div>
      </div>
    );
  }
  
  const q = questions[current];
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className={`bg-gradient-to-r ${subject.color} text-white p-4`}>
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate(-1)} className="p-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <span className="font-semibold">{lesson.title}</span>
          <button onClick={() => navigate('/')} className="p-2">
            <Home className="w-6 h-6" />
          </button>
        </div>
        
        {/* Progress */}
        <div className="bg-white/20 rounded-full h-2">
          <motion.div
            className="bg-white rounded-full h-2"
            initial={{ width: 0 }}
            animate={{ width: `${((current + 1) / questions.length) * 100}%` }}
          />
        </div>
        <p className="text-center text-sm mt-2 opacity-80">
          Câu {current + 1}/{questions.length}
        </p>
      </div>
      
      {/* Question */}
      <div className="p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="bg-white rounded-2xl p-6 shadow-lg mb-6"
          >
            <p className="text-xl font-semibold text-center text-gray-800">
              {q.q}
            </p>
            {subjectId === 'english' && (
              <button
                onClick={() => speak(q.q)}
                className="mt-3 mx-auto block px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg text-sm"
              >
                🔊 Nghe lại
              </button>
            )}
          </motion.div>
        </AnimatePresence>
        
        {/* Options */}
        <div className="grid grid-cols-2 gap-3">
          {q.options.map((opt, i) => {
            const isCorrect = opt === q.answer;
            const isSelected = opt === selected;
            
            let bgColor = 'bg-white';
            if (showResult) {
              if (isCorrect) bgColor = 'bg-green-500 text-white';
              else if (isSelected) bgColor = 'bg-red-500 text-white';
            }
            
            return (
              <motion.button
                key={i}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelect(opt)}
                disabled={showResult}
                className={`${bgColor} p-4 rounded-xl shadow-md font-semibold text-lg transition-all
                  ${!showResult && 'hover:shadow-lg active:bg-gray-50'}
                  ${showResult && isCorrect && 'ring-4 ring-green-300'}
                `}
              >
                <div className="flex items-center justify-center gap-2">
                  {showResult && isCorrect && <CheckCircle className="w-5 h-5" />}
                  {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5" />}
                  <span>{opt}</span>
                </div>
              </motion.button>
            );
          })}
        </div>
        
        {/* Score */}
        <div className="mt-6 text-center">
          <span className="text-gray-500">Điểm: </span>
          <span className="font-bold text-indigo-600">{score}</span>
        </div>
      </div>
    </div>
  );
}
