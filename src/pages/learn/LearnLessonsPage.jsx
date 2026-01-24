// src/pages/learn/LearnLessonsPage.jsx
// Student Lessons Page - Connected to English learning system
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getAllTopics } from '../../data/englishVocab';
import {
  getStudentProgress,
  getEnglishTopicsWithProgress
} from '../../services/studentProgress';
import {
  BookOpen, Star, Lock, CheckCircle, Play, ChevronRight,
  ChevronLeft, Sparkles, Clock, Target, Loader2
} from 'lucide-react';

// Subject configuration
const SUBJECTS = [
  {
    id: 'english',
    name: 'Tiếng Anh',
    icon: '🇬🇧',
    color: 'from-blue-400 to-blue-500',
    bgColor: 'bg-blue-100',
    description: 'Học từ vựng, nghe, nói tiếng Anh',
    available: true,
  },
  {
    id: 'math',
    name: 'Toán',
    icon: '🔢',
    color: 'from-green-400 to-green-500',
    bgColor: 'bg-green-100',
    description: 'Học đếm số, phép tính cơ bản',
    available: false, // Coming soon
  },
  {
    id: 'science',
    name: 'Khoa học',
    icon: '🔬',
    color: 'from-purple-400 to-purple-500',
    bgColor: 'bg-purple-100',
    description: 'Khám phá thế giới xung quanh',
    available: false,
  },
  {
    id: 'vietnamese',
    name: 'Tiếng Việt',
    icon: '📖',
    color: 'from-orange-400 to-orange-500',
    bgColor: 'bg-orange-100',
    description: 'Học đọc, viết tiếng Việt',
    available: false,
  }
];

export default function LearnLessonsPage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [englishTopics, setEnglishTopics] = useState([]);

  useEffect(() => {
    loadProgress();
  }, [profile?.id]);

  const loadProgress = async () => {
    setLoading(true);
    try {
      const progressData = await getStudentProgress(profile?.id);
      setProgress(progressData);

      // Get English topics with progress
      const topics = getEnglishTopicsWithProgress(progressData);
      setEnglishTopics(topics);
    } catch (err) {
      console.error('Error loading progress:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLessonClick = (topic) => {
    // Navigate to English lesson page
    navigate(`/english/${topic.id}`);
  };

  const getStatusIcon = (status, score) => {
    switch (status) {
      case 'completed':
        return (
          <div className="relative">
            <CheckCircle className="w-6 h-6 text-green-500" />
            {score >= 80 && (
              <span className="absolute -top-2 -right-2 text-sm">⭐</span>
            )}
          </div>
        );
      case 'in_progress':
        return <Play className="w-6 h-6 text-blue-500" />;
      default:
        return <Play className="w-6 h-6 text-gray-300" />;
    }
  };

  // Show English lessons when subject is selected
  if (selectedSubject === 'english') {
    const completedCount = englishTopics.filter(t => t.status === 'completed').length;

    return (
      <div className="p-4 space-y-4">
        {/* Back Button */}
        <button
          onClick={() => setSelectedSubject(null)}
          className="flex items-center gap-2 text-gray-600 font-medium"
        >
          <ChevronLeft className="w-5 h-5" />
          Quay lại
        </button>

        {/* Subject Header */}
        <div className="bg-gradient-to-r from-blue-400 to-blue-500 rounded-3xl p-6 text-white shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-4xl">
              🇬🇧
            </div>
            <div>
              <h1 className="text-2xl font-bold">Tiếng Anh</h1>
              <p className="text-white/80">
                {completedCount}/{englishTopics.length} chủ đề hoàn thành
              </p>
            </div>
          </div>
        </div>

        {/* Lessons List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="space-y-3">
            {englishTopics.map((topic, index) => (
              <button
                key={topic.id}
                onClick={() => handleLessonClick(topic)}
                className={`w-full bg-white rounded-2xl p-4 shadow-md flex items-center gap-4 transition-all hover:shadow-lg active:scale-[0.98] ${
                  topic.status === 'completed'
                    ? 'ring-2 ring-green-200'
                    : ''
                }`}
              >
                {/* Lesson Number */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                  topic.status === 'completed'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-blue-100 text-blue-600'
                }`}>
                  {index + 1}
                </div>

                {/* Topic Icon */}
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl">
                  {topic.icon}
                </div>

                {/* Topic Info */}
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-gray-800">
                    {topic.nameVn}
                  </h3>
                  <p className="text-sm text-gray-500">{topic.name}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      📝 {topic.words?.length || 0} từ vựng
                    </span>
                    {topic.status === 'completed' && (
                      <span className="text-xs text-green-500 flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {topic.score} điểm
                      </span>
                    )}
                  </div>
                </div>

                {/* Status Icon */}
                {getStatusIcon(topic.status, topic.score)}
              </button>
            ))}
          </div>
        )}

        {/* Learning Modes Info */}
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl p-4">
          <h3 className="font-bold text-purple-800 mb-2 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Các chế độ học
          </h3>
          <div className="grid grid-cols-5 gap-2">
            <div className="text-center">
              <div className="text-2xl">🎴</div>
              <p className="text-xs text-gray-600">Flashcard</p>
            </div>
            <div className="text-center">
              <div className="text-2xl">👂</div>
              <p className="text-xs text-gray-600">Nghe</p>
            </div>
            <div className="text-center">
              <div className="text-2xl">✍️</div>
              <p className="text-xs text-gray-600">Điền từ</p>
            </div>
            <div className="text-center">
              <div className="text-2xl">🎤</div>
              <p className="text-xs text-gray-600">Phát âm</p>
            </div>
            <div className="text-center">
              <div className="text-2xl">🔗</div>
              <p className="text-xs text-gray-600">Nối từ</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Subject selection view
  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
          <BookOpen className="w-7 h-7 text-blue-500" />
          Bài học của bạn
        </h1>
        <p className="text-gray-500 mt-1">Chọn môn học để bắt đầu nhé!</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <>
          {/* Subjects Grid */}
          <div className="space-y-4">
            {SUBJECTS.map((subject) => {
              let completedCount = 0;
              let totalCount = 0;

              if (subject.id === 'english') {
                completedCount = englishTopics.filter(t => t.status === 'completed').length;
                totalCount = englishTopics.length;
              }

              const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

              return (
                <button
                  key={subject.id}
                  onClick={() => subject.available && setSelectedSubject(subject.id)}
                  disabled={!subject.available}
                  className={`w-full bg-white rounded-3xl p-5 shadow-lg transition-all ${
                    subject.available
                      ? 'hover:shadow-xl active:scale-[0.98]'
                      : 'opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Subject Icon */}
                    <div className={`w-20 h-20 bg-gradient-to-br ${subject.color} rounded-2xl flex items-center justify-center text-5xl shadow-lg relative`}>
                      {subject.icon}
                      {!subject.available && (
                        <div className="absolute inset-0 bg-black/30 rounded-2xl flex items-center justify-center">
                          <Lock className="w-8 h-8 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Subject Info */}
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-gray-800">{subject.name}</h2>
                        {!subject.available && (
                          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                            Sắp ra mắt
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{subject.description}</p>

                      {subject.available && totalCount > 0 && (
                        <>
                          <p className="text-sm text-gray-500 mt-1">
                            {completedCount}/{totalCount} bài học hoàn thành
                          </p>
                          {/* Progress Bar */}
                          <div className="mt-2">
                            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full bg-gradient-to-r ${subject.color} rounded-full transition-all`}
                                style={{ width: `${progressPercent}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">{progressPercent}% hoàn thành</p>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Arrow */}
                    {subject.available && (
                      <ChevronRight className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Tip Card */}
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center text-2xl">
              💡
            </div>
            <div className="flex-1">
              <p className="font-medium text-yellow-800">Mẹo học tập</p>
              <p className="text-sm text-yellow-700">
                Học mỗi ngày 15-20 phút sẽ giúp bạn nhớ lâu hơn đấy!
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
