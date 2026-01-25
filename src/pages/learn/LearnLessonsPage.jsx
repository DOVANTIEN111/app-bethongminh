// src/pages/learn/LearnLessonsPage.jsx
// Student Lessons Page - With Permission System

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getAllTopics } from '../../data/englishVocab';
import { MATH_LESSONS } from '../../data/mathLessons';
import { VIETNAMESE_LESSONS } from '../../data/vietnameseLessons';
import { SCIENCE_LESSONS } from '../../data/scienceLessons';
import {
  TIENG_VIET_GRADES,
  getCategoriesByGrade,
  getLessonsByCategory as getVietnameseLessonsByCategory,
  getMamNonLessonsByLevel
} from '../../data/tiengviet';
import {
  getStudentProgress,
  getEnglishTopicsWithProgress
} from '../../services/studentProgress';
import {
  checkLessonAccess,
  isLessonUnlocked,
  FREE_LESSONS_LIMIT
} from '../../services/lessonPermissions';
import UpgradePopup from '../../components/UpgradePopup';
import {
  BookOpen, Star, Lock, CheckCircle, Play, ChevronRight,
  ChevronLeft, Sparkles, Clock, Target, Loader2, Trophy,
  Crown, Shield
} from 'lucide-react';

// Thứ tự học tập theo cấp độ - Tiếng Anh
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
    available: true,
  },
  {
    id: 'vietnamese',
    name: 'Tiếng Việt',
    icon: '📖',
    color: 'from-orange-400 to-orange-500',
    bgColor: 'bg-orange-100',
    description: 'Học đọc, viết tiếng Việt',
    available: true,
  },
  {
    id: 'science',
    name: 'Khoa học',
    icon: '🔬',
    color: 'from-purple-400 to-purple-500',
    bgColor: 'bg-purple-100',
    description: 'Khám phá thế giới xung quanh',
    available: true,
  },
];

// Lấy danh sách bài học theo môn
function getLessonsBySubject(subjectId) {
  switch (subjectId) {
    case 'math':
      return Object.values(MATH_LESSONS).map((lesson, idx) => ({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description || '',
        icon: lesson.icon || '📐',
        level: lesson.level || 1,
        index: idx,
      }));
    case 'vietnamese':
      return Object.values(VIETNAMESE_LESSONS).map((lesson, idx) => ({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description || '',
        icon: lesson.icon || '📝',
        level: lesson.level || 1,
        index: idx,
      }));
    case 'science':
      return Object.values(SCIENCE_LESSONS).map((lesson, idx) => ({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description || '',
        icon: lesson.icon || '🔬',
        level: lesson.level || 1,
        index: idx,
      }));
    default:
      return [];
  }
}

export default function LearnLessonsPage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedVietnameseGrade, setSelectedVietnameseGrade] = useState(null);
  const [selectedVietnameseCategory, setSelectedVietnameseCategory] = useState(null);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [englishTopics, setEnglishTopics] = useState([]);

  // Permission states
  const [accessInfo, setAccessInfo] = useState({
    hasFullAccess: false,
    isPremium: false,
    isAdmin: false,
  });

  // Upgrade popup
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);
  const [lockedLessonTitle, setLockedLessonTitle] = useState('');

  useEffect(() => {
    loadProgress();
    loadAccessInfo();
  }, [profile?.id]);

  const loadAccessInfo = async () => {
    if (!profile) return;
    const access = await checkLessonAccess(profile);
    setAccessInfo(access);
  };

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

  const handleLessonClick = (topic, lessonIndex = 0) => {
    // Check if lesson is unlocked
    const unlocked = isLessonUnlocked(lessonIndex, accessInfo.hasFullAccess);

    if (!unlocked) {
      setLockedLessonTitle(topic.nameVn || topic.title || topic.name);
      setShowUpgradePopup(true);
      return;
    }

    // Navigate to lesson page based on subject
    if (selectedSubject === 'english') {
      navigate(`/english/${topic.id}`);
    } else if (selectedSubject === 'math') {
      navigate(`/math/${topic.id}`);
    } else if (selectedSubject === 'vietnamese') {
      navigate(`/vietnamese/${topic.id}`);
    } else if (selectedSubject === 'science') {
      navigate(`/science/${topic.id}`);
    } else {
      // Fallback for any other subjects
      alert(`Bài học "${topic.title}" sẽ sớm mở!`);
    }
  };

  const getStatusIcon = (status, score, isLocked) => {
    if (isLocked) {
      return <Lock className="w-6 h-6 text-gray-400" />;
    }

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

  // Render role badge
  const renderRoleBadge = () => {
    if (!accessInfo.isAdmin) return null;

    return (
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 text-sm font-medium shadow-lg">
        <Shield className="w-4 h-4" />
        <span>
          {profile?.role === 'super_admin' && 'Super Admin'}
          {profile?.role === 'school_admin' && 'Quản lý trường'}
          {profile?.role === 'teacher' && 'Giáo viên'}
          {profile?.role === 'department_head' && 'Trưởng khoa'}
        </span>
      </div>
    );
  };

  // Render premium badge
  const renderPremiumBadge = () => {
    if (accessInfo.isAdmin) return null; // Admin already has full access
    if (!accessInfo.isPremium) return null;

    return (
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 text-sm font-medium shadow-lg">
        <Crown className="w-4 h-4" />
        <span>Premium</span>
      </div>
    );
  };

  // Show Vietnamese grade selection (Mầm non / Lớp 1 / Lớp 2...)
  if (selectedSubject === 'vietnamese' && !selectedVietnameseGrade) {
    const subject = SUBJECTS.find(s => s.id === 'vietnamese');

    return (
      <div className="p-4 space-y-4 pb-24">
        {/* Back Button */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedSubject(null)}
            className="flex items-center gap-2 text-gray-600 font-medium"
          >
            <ChevronLeft className="w-5 h-5" />
            Quay lại
          </button>
          {renderRoleBadge()}
          {renderPremiumBadge()}
        </div>

        {/* Subject Header */}
        <div className={`bg-gradient-to-r ${subject.color} rounded-3xl p-5 text-white shadow-xl`}>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-4xl">
              {subject.icon}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{subject.name}</h1>
              <p className="text-white/80">Chọn độ tuổi phù hợp với bé</p>
            </div>
          </div>
        </div>

        {/* Grades List */}
        <div className="space-y-3">
          {TIENG_VIET_GRADES.map((grade) => (
            <button
              key={grade.id}
              onClick={() => !grade.comingSoon && setSelectedVietnameseGrade(grade.id)}
              disabled={grade.comingSoon}
              className={`w-full ${grade.bgColor} rounded-2xl p-4 text-left shadow-lg transition-all ${
                grade.comingSoon ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-xl active:scale-[0.98]'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 bg-gradient-to-br ${grade.color} rounded-2xl flex items-center justify-center text-3xl shadow-md`}>
                  {grade.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-gray-800">{grade.title}</h3>
                    <span className="text-sm bg-white/50 px-2 py-0.5 rounded-full text-gray-600">
                      {grade.subtitle}
                    </span>
                    {grade.comingSoon && (
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                        Sắp ra mắt
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mt-1">{grade.description}</p>
                  {grade.lessonCount > 0 && (
                    <p className="text-gray-500 text-sm mt-1">
                      📚 {grade.lessonCount} bài học
                    </p>
                  )}
                </div>
                {!grade.comingSoon && <ChevronRight className="w-6 h-6 text-gray-400" />}
              </div>
            </button>
          ))}
        </div>

        {/* Info */}
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-4">
          <h3 className="font-bold text-orange-800 mb-2 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Nội dung phong phú
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm text-orange-700">
            <div className="flex items-center gap-2">
              <span>👶</span> Mầm non: 50 bài
            </div>
            <div className="flex items-center gap-2">
              <span>📚</span> Lớp 1: 75 bài
            </div>
            <div className="flex items-center gap-2">
              <span>📖</span> Lớp 2-4: Sắp ra mắt
            </div>
            <div className="flex items-center gap-2">
              <span>🎯</span> Tổng: 125+ bài
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show Vietnamese categories (after grade selection)
  if (selectedSubject === 'vietnamese' && selectedVietnameseGrade && !selectedVietnameseCategory) {
    const gradeInfo = TIENG_VIET_GRADES.find(g => g.id === selectedVietnameseGrade);
    const categories = getCategoriesByGrade(selectedVietnameseGrade);

    return (
      <div className="p-4 space-y-4 pb-24">
        {/* Back Button */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedVietnameseGrade(null)}
            className="flex items-center gap-2 text-gray-600 font-medium"
          >
            <ChevronLeft className="w-5 h-5" />
            Chọn độ tuổi khác
          </button>
          {renderRoleBadge()}
          {renderPremiumBadge()}
        </div>

        {/* Grade Header */}
        <div className={`bg-gradient-to-r ${gradeInfo.color} rounded-3xl p-5 text-white shadow-xl`}>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-4xl">
              {gradeInfo.icon}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">Tiếng Việt - {gradeInfo.title}</h1>
              <p className="text-white/80">{gradeInfo.lessonCount} bài học • {gradeInfo.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedVietnameseCategory(category.id)}
              className={`bg-gradient-to-br ${category.color} rounded-2xl p-4 text-white text-left shadow-lg hover:shadow-xl transition-all active:scale-[0.98]`}
            >
              <div className="text-4xl mb-2">{category.icon}</div>
              <h3 className="font-bold text-lg">{category.title}</h3>
              <p className="text-white/80 text-sm">{category.lessonCount} bài</p>
              {category.ageRange && (
                <p className="text-white/60 text-xs mt-1">{category.ageRange}</p>
              )}
              <p className="text-white/60 text-xs mt-1 line-clamp-2">{category.description}</p>
            </button>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl p-4 shadow-md">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-orange-500" />
            Nội dung {gradeInfo.title}
          </h3>
          <p className="text-sm text-gray-600">{gradeInfo.description}</p>
        </div>
      </div>
    );
  }

  // Show Vietnamese lessons by category
  if (selectedSubject === 'vietnamese' && selectedVietnameseGrade && selectedVietnameseCategory) {
    const gradeInfo = TIENG_VIET_GRADES.find(g => g.id === selectedVietnameseGrade);
    const categories = getCategoriesByGrade(selectedVietnameseGrade);
    const categoryInfo = categories.find(c => c.id === selectedVietnameseCategory);

    // Get lessons based on grade and category
    let rawLessons;
    if (selectedVietnameseGrade === 'mam-non') {
      // Mầm non uses level-based categories
      const levelMap = { 'chu-cai': 1, 'nguyen-am-phu-am': 2, 'van-don-gian': 3, 'tu-vung-chu-de': 0 };
      rawLessons = getMamNonLessonsByLevel(levelMap[selectedVietnameseCategory] ?? 1);
    } else {
      rawLessons = getVietnameseLessonsByCategory(selectedVietnameseGrade, selectedVietnameseCategory);
    }

    const lessons = rawLessons.map((lesson, idx) => ({
      id: lesson.id,
      title: lesson.title,
      description: lesson.objectives?.[0] || lesson.description || '',
      icon: lesson.icon || '📖',
      level: lesson.level || 1,
      index: idx,
    }));

    const renderLessonCard = (lesson, globalIndex) => {
      const isLocked = !isLessonUnlocked(globalIndex, accessInfo.hasFullAccess);
      const progressData = progress[lesson.id];
      const status = progressData?.status || 'not_started';
      const score = progressData?.score || 0;

      return (
        <button
          key={lesson.id}
          onClick={() => handleLessonClick(lesson, globalIndex)}
          className={`w-full bg-white rounded-2xl p-4 shadow-md flex items-center gap-3 transition-all ${
            isLocked ? 'opacity-60' : 'hover:shadow-lg active:scale-[0.98]'
          } ${status === 'completed' ? 'ring-2 ring-green-200' : ''}`}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 ${
            isLocked ? 'bg-gray-100 text-gray-400' : status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
          }`}>
            {isLocked ? <Lock className="w-5 h-5" /> : globalIndex + 1}
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
            isLocked ? 'bg-gray-50 grayscale' : status === 'completed' ? 'bg-green-50' : 'bg-orange-50'
          }`}>
            {lesson.icon}
          </div>
          <div className="flex-1 text-left min-w-0">
            <h3 className={`font-bold truncate ${isLocked ? 'text-gray-400' : 'text-gray-800'}`}>
              {lesson.title}
            </h3>
            {lesson.description && (
              <p className={`text-sm truncate ${isLocked ? 'text-gray-300' : 'text-gray-500'}`}>
                {lesson.description}
              </p>
            )}
            {isLocked && (
              <span className="text-xs text-orange-500 flex items-center gap-1 mt-1">
                <Crown className="w-3 h-3" /> Premium
              </span>
            )}
            {!isLocked && status === 'completed' && (
              <span className="text-xs text-green-500 flex items-center gap-1 mt-1">
                <Star className="w-3 h-3 fill-green-500" /> {score}đ
              </span>
            )}
          </div>
          <div className="flex-shrink-0">
            {getStatusIcon(status, score, isLocked)}
          </div>
        </button>
      );
    };

    return (
      <div className="p-4 space-y-4 pb-24">
        <UpgradePopup
          isOpen={showUpgradePopup}
          onClose={() => setShowUpgradePopup(false)}
          lessonTitle={lockedLessonTitle}
        />

        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedVietnameseCategory(null)}
            className="flex items-center gap-2 text-gray-600 font-medium"
          >
            <ChevronLeft className="w-5 h-5" />
            Chọn chủ đề khác
          </button>
          {renderRoleBadge()}
          {renderPremiumBadge()}
        </div>

        <div className={`bg-gradient-to-r ${categoryInfo.color} rounded-3xl p-5 text-white shadow-xl`}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-4xl">
              {categoryInfo.icon}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{categoryInfo.title}</h1>
              <p className="text-white/80">{gradeInfo.title} • {lessons.length} bài học</p>
            </div>
          </div>
          {!accessInfo.hasFullAccess && (
            <div className="bg-white/20 rounded-xl p-3 flex items-center gap-2">
              <Lock className="w-5 h-5" />
              <span className="text-sm">
                Miễn phí: {FREE_LESSONS_LIMIT} bài đầu • Nâng cấp Premium để mở tất cả
              </span>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          </div>
        ) : (
          <div className="space-y-2">
            {lessons.map((lesson, idx) => renderLessonCard(lesson, idx))}
          </div>
        )}
      </div>
    );
  }

  // Show lessons for Math, Science (not Vietnamese - handled above)
  if (selectedSubject && selectedSubject !== 'english' && selectedSubject !== 'vietnamese') {
    const lessons = getLessonsBySubject(selectedSubject);
    const subject = SUBJECTS.find(s => s.id === selectedSubject);

    // Group by level
    const level1 = lessons.filter(l => l.level === 1);
    const level2 = lessons.filter(l => l.level === 2);
    const level3 = lessons.filter(l => l.level === 3);

    const renderLessonCard = (lesson, globalIndex) => {
      const isLocked = !isLessonUnlocked(globalIndex, accessInfo.hasFullAccess);
      const progressData = progress[lesson.id];
      const status = progressData?.status || 'not_started';
      const score = progressData?.score || 0;

      return (
        <button
          key={lesson.id}
          onClick={() => handleLessonClick(lesson, globalIndex)}
          className={`w-full bg-white rounded-2xl p-4 shadow-md flex items-center gap-3 transition-all ${
            isLocked ? 'opacity-60' : 'hover:shadow-lg active:scale-[0.98]'
          } ${status === 'completed' ? 'ring-2 ring-green-200' : ''}`}
        >
          {/* Lesson Number */}
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 ${
            isLocked
              ? 'bg-gray-100 text-gray-400'
              : status === 'completed'
                ? 'bg-green-100 text-green-600'
                : 'bg-blue-100 text-blue-600'
          }`}>
            {isLocked ? <Lock className="w-5 h-5" /> : globalIndex + 1}
          </div>

          {/* Lesson Icon */}
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
            isLocked ? 'bg-gray-50 grayscale' : status === 'completed' ? 'bg-green-50' : 'bg-blue-50'
          }`}>
            {lesson.icon}
          </div>

          {/* Lesson Info */}
          <div className="flex-1 text-left min-w-0">
            <h3 className={`font-bold truncate ${isLocked ? 'text-gray-400' : 'text-gray-800'}`}>
              {lesson.title}
            </h3>
            {lesson.description && (
              <p className={`text-sm truncate ${isLocked ? 'text-gray-300' : 'text-gray-500'}`}>
                {lesson.description}
              </p>
            )}
            {isLocked && (
              <span className="text-xs text-orange-500 flex items-center gap-1 mt-1">
                <Crown className="w-3 h-3" /> Premium
              </span>
            )}
            {!isLocked && status === 'completed' && (
              <span className="text-xs text-green-500 flex items-center gap-1 mt-1">
                <Star className="w-3 h-3 fill-green-500" /> {score}đ
              </span>
            )}
          </div>

          {/* Status */}
          <div className="flex-shrink-0">
            {getStatusIcon(status, score, isLocked)}
          </div>
        </button>
      );
    };

    return (
      <div className="p-4 space-y-4 pb-24">
        {/* Upgrade Popup */}
        <UpgradePopup
          isOpen={showUpgradePopup}
          onClose={() => setShowUpgradePopup(false)}
          lessonTitle={lockedLessonTitle}
        />

        {/* Back Button */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedSubject(null)}
            className="flex items-center gap-2 text-gray-600 font-medium"
          >
            <ChevronLeft className="w-5 h-5" />
            Quay lại
          </button>
          {renderRoleBadge()}
          {renderPremiumBadge()}
        </div>

        {/* Subject Header */}
        <div className={`bg-gradient-to-r ${subject.color} rounded-3xl p-5 text-white shadow-xl`}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-4xl">
              {subject.icon}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{subject.name}</h1>
              <p className="text-white/80">{lessons.length} bài học</p>
            </div>
          </div>

          {/* Free vs Premium info */}
          {!accessInfo.hasFullAccess && (
            <div className="bg-white/20 rounded-xl p-3 flex items-center gap-2">
              <Lock className="w-5 h-5" />
              <span className="text-sm">
                Miễn phí: {FREE_LESSONS_LIMIT} bài đầu • Nâng cấp Premium để mở tất cả
              </span>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <>
            {/* Level 1 */}
            {level1.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold">1</span>
                  </div>
                  <h2 className="font-bold text-gray-800">Cơ bản</h2>
                  <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                    {level1.length} bài
                  </span>
                </div>
                <div className="space-y-2">
                  {level1.map((lesson, idx) => renderLessonCard(lesson, idx))}
                </div>
              </div>
            )}

            {/* Level 2 */}
            {level2.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                  <h2 className="font-bold text-gray-800">Mở rộng</h2>
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                    {level2.length} bài
                  </span>
                </div>
                <div className="space-y-2">
                  {level2.map((lesson, idx) => renderLessonCard(lesson, level1.length + idx))}
                </div>
              </div>
            )}

            {/* Level 3 */}
            {level3.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold">3</span>
                  </div>
                  <h2 className="font-bold text-gray-800">Nâng cao</h2>
                  <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">
                    {level3.length} bài
                  </span>
                </div>
                <div className="space-y-2">
                  {level3.map((lesson, idx) => renderLessonCard(lesson, level1.length + level2.length + idx))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  // Show English lessons when subject is selected
  if (selectedSubject === 'english') {
    const completedCount = englishTopics.filter(t => t.status === 'completed').length;
    const totalPoints = englishTopics.reduce((sum, t) => sum + (t.score || 0), 0);

    // Group topics by level
    const level1Topics = englishTopics.filter(t => t.level === 1);
    const level2Topics = englishTopics.filter(t => t.level === 2);
    const level3Topics = englishTopics.filter(t => t.level === 3);

    const renderTopicCard = (topic, index, globalIndex) => {
      const isLocked = !isLessonUnlocked(globalIndex, accessInfo.hasFullAccess);

      return (
        <button
          key={topic.id}
          onClick={() => handleLessonClick(topic, globalIndex)}
          className={`w-full bg-white rounded-2xl p-4 shadow-md flex items-center gap-3 transition-all ${
            isLocked ? 'opacity-60' : 'hover:shadow-lg active:scale-[0.98]'
          } ${topic.status === 'completed' ? 'ring-2 ring-green-200' : ''}`}
        >
          {/* Lesson Number */}
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 ${
            isLocked
              ? 'bg-gray-100 text-gray-400'
              : topic.status === 'completed'
                ? 'bg-green-100 text-green-600'
                : 'bg-blue-100 text-blue-600'
          }`}>
            {isLocked ? <Lock className="w-5 h-5" /> : globalIndex + 1}
          </div>

          {/* Topic Icon */}
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
            isLocked ? 'bg-gray-50 grayscale' : topic.status === 'completed' ? 'bg-green-50' : 'bg-blue-50'
          }`}>
            {topic.icon}
          </div>

          {/* Topic Info */}
          <div className="flex-1 text-left min-w-0">
            <h3 className={`font-bold truncate ${isLocked ? 'text-gray-400' : 'text-gray-800'}`}>
              {topic.nameVn}
            </h3>
            <p className={`text-sm ${isLocked ? 'text-gray-300' : 'text-gray-500'}`}>
              {topic.name}
            </p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {isLocked ? (
                <span className="text-xs text-orange-500 flex items-center gap-1">
                  <Crown className="w-3 h-3" /> Premium
                </span>
              ) : (
                <>
                  <span className="text-xs text-gray-400">📝 {topic.words?.length || 0} từ</span>
                  {topic.status === 'completed' && (
                    <span className="text-xs text-green-500 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-green-500" /> {topic.score}đ
                    </span>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="flex-shrink-0">
            {getStatusIcon(topic.status, topic.score, isLocked)}
          </div>
        </button>
      );
    };

    return (
      <div className="p-4 space-y-4 pb-24">
        {/* Upgrade Popup */}
        <UpgradePopup
          isOpen={showUpgradePopup}
          onClose={() => setShowUpgradePopup(false)}
          lessonTitle={lockedLessonTitle}
        />

        {/* Back Button */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedSubject(null)}
            className="flex items-center gap-2 text-gray-600 font-medium"
          >
            <ChevronLeft className="w-5 h-5" />
            Quay lại
          </button>
          {renderRoleBadge()}
          {renderPremiumBadge()}
        </div>

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

          {/* Free vs Premium info */}
          {!accessInfo.hasFullAccess && (
            <div className="mt-4 bg-white/20 rounded-xl p-3 flex items-center gap-2">
              <Lock className="w-5 h-5" />
              <span className="text-sm">
                Miễn phí: {FREE_LESSONS_LIMIT} bài đầu • Nâng cấp Premium để mở tất cả
              </span>
            </div>
          )}
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
                {level1Topics.map((topic, idx) => renderTopicCard(topic, idx, idx))}
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
                {level2Topics.map((topic, idx) => renderTopicCard(topic, idx, level1Topics.length + idx))}
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
                {level3Topics.map((topic, idx) => renderTopicCard(topic, idx, level1Topics.length + level2Topics.length + idx))}
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
      {/* Upgrade Popup */}
      <UpgradePopup
        isOpen={showUpgradePopup}
        onClose={() => setShowUpgradePopup(false)}
        lessonTitle={lockedLessonTitle}
      />

      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          {renderRoleBadge()}
          {renderPremiumBadge()}
        </div>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
          <BookOpen className="w-7 h-7 text-blue-500" />
          Bài học của bạn
        </h1>
        <p className="text-gray-500 mt-1">Chọn môn học để bắt đầu nhé!</p>
      </div>

      {/* Premium Banner for free users */}
      {!accessInfo.hasFullAccess && (
        <button
          onClick={() => setShowUpgradePopup(true)}
          className="w-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-2xl p-4 text-white shadow-lg flex items-center gap-3 hover:opacity-90 transition-opacity"
        >
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Crown className="w-6 h-6" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-bold">Nâng cấp Premium</p>
            <p className="text-sm text-white/80">Mở khóa tất cả {SUBJECTS.reduce((sum, s) => {
              if (s.id === 'english') return sum + 20;
              return sum + getLessonsBySubject(s.id).length;
            }, 0)} bài học!</p>
          </div>
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

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
              } else {
                const lessons = getLessonsBySubject(subject.id);
                totalCount = lessons.length;
                // TODO: Get completed count from progress
              }

              const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
              const freeCount = Math.min(FREE_LESSONS_LIMIT, totalCount);

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
                            {accessInfo.hasFullAccess ? (
                              <>{completedCount}/{totalCount} bài học</>
                            ) : (
                              <>{freeCount} miễn phí • {totalCount - freeCount} Premium</>
                            )}
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
