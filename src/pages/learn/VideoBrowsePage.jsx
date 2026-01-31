// src/pages/learn/VideoBrowsePage.jsx
// Trang duyet video theo mon hoc va lop

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Play, Lock, ChevronRight, ArrowLeft, Clock, BookOpen } from 'lucide-react';
import { getVideosBySubjectAndGrade } from '../../services/videoService';

const VideoBrowsePage = () => {
  const navigate = useNavigate();
  const { subject } = useParams();
  const [searchParams] = useSearchParams();
  const grade = searchParams.get('grade') || 'lop-1';

  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGrade, setSelectedGrade] = useState(grade);

  const subjects = {
    'toan': { name: 'Toán', icon: '📐', color: 'from-blue-500 to-cyan-500' },
    'tieng-viet': { name: 'Tiếng Việt', icon: '📖', color: 'from-green-500 to-emerald-500' },
    'tieng-anh': { name: 'Tiếng Anh', icon: '🌍', color: 'from-purple-500 to-pink-500' },
    'khoa-hoc': { name: 'Khoa học', icon: '🔬', color: 'from-orange-500 to-red-500' },
  };

  const grades = [
    { id: 'lop-1', name: 'Lớp 1' },
    { id: 'lop-2', name: 'Lớp 2' },
    { id: 'lop-3', name: 'Lớp 3' },
    { id: 'lop-4', name: 'Lớp 4' },
    { id: 'lop-5', name: 'Lớp 5' },
  ];

  const subjectInfo = subjects[subject] || subjects['toan'];

  useEffect(() => {
    loadTopics();
  }, [subject, selectedGrade]);

  const loadTopics = async () => {
    setLoading(true);
    try {
      const data = await getVideosBySubjectAndGrade(subject, selectedGrade);
      setTopics(data || []);
    } catch (error) {
      console.error('Error loading topics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGradeChange = (gradeId) => {
    setSelectedGrade(gradeId);
    navigate(`/learn/videos/browse/${subject}?grade=${gradeId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className={`bg-gradient-to-r ${subjectInfo.color} text-white p-4 pb-6`}>
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/learn/videos')} className="p-2 bg-white/20 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <span className="text-2xl">{subjectInfo.icon}</span>
              {subjectInfo.name}
            </h1>
            <p className="text-sm opacity-90">Video bài giảng chất lượng cao</p>
          </div>
        </div>

        {/* Grade Tabs */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {grades.map((g) => (
            <button
              key={g.id}
              onClick={() => handleGradeChange(g.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition ${
                selectedGrade === g.id
                  ? 'bg-white text-gray-800'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : topics.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-lg font-bold text-gray-600">Chưa có nội dung</h3>
            <p className="text-gray-500">Nội dung đang được cập nhật</p>
          </div>
        ) : (
          <div className="space-y-4">
            {topics.map((topic, index) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                index={index}
                onPress={() => navigate(`/learn/videos/topic/${topic.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Component hien thi 1 chu de
const TopicCard = ({ topic, index, onPress }) => {
  const hasVideos = topic.videos && topic.videos.length > 0;
  const videoCount = topic.video_count || topic.videos?.length || 0;

  return (
    <div
      onClick={onPress}
      className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition"
    >
      <div className="p-4">
        <div className="flex items-start gap-4">
          {/* So thu tu */}
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg ${
            topic.is_free ? 'bg-green-500' : 'bg-blue-500'
          }`}>
            {index + 1}
          </div>

          {/* Thong tin */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-gray-800 line-clamp-1">{topic.title}</h3>
              {topic.is_free ? (
                <span className="px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded-full font-medium">
                  Miễn phí
                </span>
              ) : (
                <Lock className="w-4 h-4 text-gray-400" />
              )}
            </div>

            {topic.description && (
              <p className="text-sm text-gray-500 line-clamp-2 mb-2">{topic.description}</p>
            )}

            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                {videoCount} video
              </span>
              {topic.total_duration && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {Math.round(topic.total_duration / 60)} phút
                </span>
              )}
            </div>
          </div>

          {/* Arrow */}
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>

        {/* Preview videos */}
        {hasVideos && (
          <div className="flex gap-2 mt-3 overflow-x-auto hide-scrollbar">
            {topic.videos.slice(0, 4).map((video) => (
              <div key={video.id} className="flex-shrink-0 w-28">
                <div className="relative">
                  <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    className="w-full h-16 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = '/images/video-placeholder.jpg';
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center">
                      <Play className="w-3 h-3 text-white fill-white ml-0.5" />
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-1 line-clamp-1">{video.title}</p>
              </div>
            ))}
            {topic.videos.length > 4 && (
              <div className="flex-shrink-0 w-28 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-sm text-gray-500">+{topic.videos.length - 4}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoBrowsePage;
