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
  ChevronLeft, Sparkles, Clock, Target, Loader2, Trophy
} from 'lucide-react';

// Thứ tự học tập theo cấp độ
const TOPIC_ORDER = [
  // Level 1: Cơ bản (Bé 3-4 tuổi)
  { id: 'greetings', level: 1, levelName: 'Cơ bản' },
  { id: 'numbers', level: 1, levelName: 'Cơ bản' },
  { id: 'colors', level: 1, levelName: 'Cơ bản' },
  { id: 'animals', level: 1, levelName: 'Cơ bản' },
  { id: 'food', level: 1, levelName: 'Cơ bản' },
  { id: 'family', level: 1, levelName: 'Cơ bản' },
  { id: 'body', level: 1, levelName: 'Cơ bản' },

  // Level 2: Mở rộng (Bé 4-5 tuổi)
  { id: 'toys', level: 2, levelName: 'Mở rộng' },
  { id: 'clothes', level: 2, levelName: 'Mở rộng' },
  { id: 'home', level: 2, levelName: 'Mở rộng' },
  { id: 'school', level: 2, levelName: 'Mở rộng' },
  { id: 'shapes', level: 2, levelName: 'Mở rộng' },
  { id: 'vegetables', level: 2, levelName: 'Mở rộng' },
  { id: 'weather', level: 2, levelName: 'Mở rộng' },

  // Level 3: Nâng cao (Bé 5-6 tuổi)
  { id: 'actions', level: 3, levelName: 'Nâng cao' },
  { id: 'nature', level: 3, levelName: 'Nâng cao' },
  { id: 'time', level: 3, levelName: 'Nâng cao' },
  { id: 'emotions', level: 3, levelName: 'Nâng cao' },
  { id: 'questions', level: 3, levelName: 'Nâng cao' },
  { id: 'phrases', level: 3, levelName: 'Nâng cao' },
];

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

      // Get English topics with progress and sort by learning order
      const topicsWithProgress = getEnglishTopicsWithProgress(progressData);

      // Sort topics according to TOPIC_ORDER
      const orderedTopics = TOPIC_ORDER.map(order => {
        const topic = topicsWithProgress.find(t => t.id === order.id);
        return topic ? { ...topic, level: order.level, levelName: order.levelName } : null;
      }).filter(Boolean);

      setEnglishTopics(orderedTopics);
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
    const totalPoints = englishTopics.reduce((sum, t) => sum + (t.score || 0), 0);

    // Group topics by level
    const level1Topics = englishTopics.filter(t => t.level === 1);
    const level2Topics = englishTopics.filter(t => t.level === 2);
    const level3Topics = englishTopics.filter(t => t.level === 3);

    const renderTopicCard = (topic, index, globalIndex) => (
      <button
        key={topic.id}
        onClick={() => handleLessonClick(topic)}
        className={`w-full bg-white rounded-2xl p-4 shadow-md flex items-center gap-3 transition-all hover:shadow-lg active:scale-[0.98] ${
          topic.status === 'completed' ? 'ring-2 ring-green-200' : ''
        }`}
      >
        {/* Lesson Number */}
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 ${
          topic.status === 'completed'
            ? 'bg-green-100 text-green-600'
            : 'bg-blue-100 text-blue-600'
        }`}>
          {globalIndex}
        </div>

        {/* Topic Icon */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
          topic.status === 'completed' ? 'bg-green-50' : 'bg-blue-50'
        }`}>
          {topic.icon}
        </div>

        {/* Topic Info */}
        <div className="flex-1 text-left min-w-0">
          <h3 className="font-bold text-gray-800 truncate">{topic.nameVn}</h3>
          <p className="text-sm text-gray-500">{topic.name}</p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-xs text-gray-400">📝 {topic.words?.length || 0} từ</span>
            {topic.status === 'completed' && (
              <span className="text-xs text-green-500 flex items-center gap-1">
                <Star className="w-3 h-3 fill-green-500" /> {topic.score}đ
              </span>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="flex-shrink-0">
          {getStatusIcon(topic.status, topic.score)}
        </div>
      </button>
    );

    return (
      <div className="p-4 space-y-4 pb-24">
        {/* Back Button */}
        <button
          onClick={() => setSelectedSubject(null)}
          className="flex items-center gap-2 text-gray-600 font-medium"
        >
          <ChevronLeft className="w-5 h-5" />
          Quay lại
        </button>

        {/* Subject Header */}
        <div className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-3xl p-5 text-white shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-4xl">
              🇬🇧
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">Tiếng Anh</h1>
              <p className="text-white/80">20 chủ đề • 5 chế độ học</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/20 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">{completedCount}</p>
              <p className="text-xs text-white/80">Hoàn thành</p>
            </div>
            <div className="bg-white/20 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">{englishTopics.length - completedCount}</p>
              <p className="text-xs text-white/80">Chưa học</p>
            </div>
            <div className="bg-white/20 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">{totalPoints}</p>
              <p className="text-xs text-white/80">Tổng điểm</p>
            </div>
          </div>
        </div>

        {/* Learning Modes */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-4">
          <h3 className="font-bold text-purple-800 mb-3 flex items-center gap-2">
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

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <>
            {/* Level 1: Cơ bản */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">1</span>
                </div>
                <h2 className="font-bold text-gray-800">Cơ bản</h2>
                <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                  {level1Topics.filter(t => t.status === 'completed').length}/{level1Topics.length}
                </span>
              </div>
              <div className="space-y-2">
                {level1Topics.map((topic, idx) => renderTopicCard(topic, idx, idx + 1))}
              </div>
            </div>

            {/* Level 2: Mở rộng */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <h2 className="font-bold text-gray-800">Mở rộng</h2>
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                  {level2Topics.filter(t => t.status === 'completed').length}/{level2Topics.length}
                </span>
              </div>
              <div className="space-y-2">
                {level2Topics.map((topic, idx) => renderTopicCard(topic, idx, level1Topics.length + idx + 1))}
              </div>
            </div>

            {/* Level 3: Nâng cao */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold">3</span>
                </div>
                <h2 className="font-bold text-gray-800">Nâng cao</h2>
                <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">
                  {level3Topics.filter(t => t.status === 'completed').length}/{level3Topics.length}
                </span>
              </div>
              <div className="space-y-2">
                {level3Topics.map((topic, idx) => renderTopicCard(topic, idx, level1Topics.length + level2Topics.length + idx + 1))}
              </div>
            </div>
          </>
        )}
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
