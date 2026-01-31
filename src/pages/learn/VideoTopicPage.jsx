// src/pages/learn/VideoTopicPage.jsx
// Trang chi tiet chu de video

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Play, Lock, ArrowLeft, Clock, CheckCircle, BookOpen } from 'lucide-react';
import { getTopicWithVideos } from '../../services/videoService';

const VideoTopicPage = () => {
  const navigate = useNavigate();
  const { topicId } = useParams();
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTopic();
  }, [topicId]);

  const loadTopic = async () => {
    setLoading(true);
    try {
      const data = await getTopicWithVideos(topicId);
      setTopic(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSubjectInfo = (subject) => {
    const subjects = {
      'toan': { name: 'Toán', icon: '📐', color: 'from-blue-500 to-cyan-500' },
      'tieng-viet': { name: 'Tiếng Việt', icon: '📖', color: 'from-green-500 to-emerald-500' },
      'tieng-anh': { name: 'Tiếng Anh', icon: '🌍', color: 'from-purple-500 to-pink-500' },
      'khoa-hoc': { name: 'Khoa học', icon: '🔬', color: 'from-orange-500 to-red-500' },
    };
    return subjects[subject] || subjects['toan'];
  };

  const getGradeLabel = (grade) => {
    const grades = {
      'lop-1': 'Lớp 1',
      'lop-2': 'Lớp 2',
      'lop-3': 'Lớp 3',
      'lop-4': 'Lớp 4',
      'lop-5': 'Lớp 5',
    };
    return grades[grade] || grade;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-6xl mb-4">😢</div>
        <h2 className="text-xl font-bold mb-2">Không tìm thấy chủ đề</h2>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-blue-500 text-white rounded-xl font-bold"
        >
          Quay lại
        </button>
      </div>
    );
  }

  const videos = topic.videos || [];
  const totalDuration = videos.reduce((sum, v) => sum + (v.duration || 0), 0);
  const subjectInfo = getSubjectInfo(topic.subject);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className={`bg-gradient-to-r ${subjectInfo.color} text-white p-4`}>
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="p-2 bg-white/20 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{subjectInfo.icon}</span>
              <span className="text-sm opacity-90">{subjectInfo.name} - {getGradeLabel(topic.grade)}</span>
            </div>
            <h1 className="text-xl font-bold">{topic.title}</h1>
            {topic.description && (
              <p className="text-sm opacity-90 line-clamp-2 mt-1">{topic.description}</p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span>{videos.length} video</span>
          </div>
          {totalDuration > 0 && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{Math.round(totalDuration / 60)} phút</span>
            </div>
          )}
          {topic.is_free && (
            <span className="px-2 py-0.5 bg-green-400 text-green-900 rounded-full text-xs font-bold">
              Miễn phí
            </span>
          )}
        </div>
      </div>

      {/* Video List */}
      <div className="p-4">
        {videos.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-500">Chưa có video trong chủ đề này</p>
          </div>
        ) : (
          <div className="space-y-3">
            {videos.map((video, index) => (
              <div
                key={video.id}
                onClick={() => navigate(`/learn/videos/${video.id}`)}
                className="flex gap-3 bg-white rounded-xl shadow p-3 cursor-pointer hover:shadow-lg transition active:scale-[0.99]"
              >
                {/* Thumbnail */}
                <div className="relative flex-shrink-0 w-32 h-20 rounded-lg overflow-hidden">
                  <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/images/video-placeholder.jpg';
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                      <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                    </div>
                  </div>
                  {video.duration && (
                    <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                      {formatDuration(video.duration)}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2">
                    <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index < 3 ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm line-clamp-2 text-gray-800">{video.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {video.teacher_name || video.channel_name || 'SchoolHub'}
                      </p>
                      {video.view_count > 0 && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {video.view_count.toLocaleString()} lượt xem
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoTopicPage;
