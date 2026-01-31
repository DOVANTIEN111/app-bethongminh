// src/pages/learn/VideoPlayerPage.jsx
// Trang xem video cho hoc sinh

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Share2, ChevronDown, ChevronUp, Play, ArrowLeft } from 'lucide-react';
import {
  getVideoById,
  getVideos,
  toggleFavorite,
  checkFavorite,
  getYoutubeEmbedUrl
} from '../../services/videoService';
import { useAuth } from '../../contexts/AuthContext';

const VideoPlayerPage = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();

  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showDescription, setShowDescription] = useState(false);

  useEffect(() => {
    if (videoId) {
      loadVideo();
    }
  }, [videoId]);

  useEffect(() => {
    if (video && profile?.id) {
      loadFavoriteStatus();
    }
  }, [video, profile?.id]);

  const loadVideo = async () => {
    setLoading(true);
    try {
      const videoData = await getVideoById(videoId);
      setVideo(videoData);

      // Lay video lien quan
      if (videoData?.subject) {
        const related = await getVideos({
          subject: videoData.subject,
          limit: 10
        });
        setRelatedVideos((related || []).filter(v => v.id !== videoId).slice(0, 5));
      }
    } catch (error) {
      console.error('Error loading video:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFavoriteStatus = async () => {
    if (profile?.id && videoId) {
      const status = await checkFavorite(profile.id, videoId);
      setIsFavorite(status);
    }
  };

  const handleFavorite = async () => {
    if (!profile?.id) {
      alert('Vui lòng đăng nhập để thêm yêu thích!');
      return;
    }

    const result = await toggleFavorite(profile.id, videoId);
    setIsFavorite(result);
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: video?.title,
          text: `Xem video: ${video?.title}`,
          url
        });
      } catch (err) {
        // User cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        alert('Đã sao chép link!');
      } catch (err) {
        alert('Không thể sao chép link');
      }
    }
  };

  const formatViews = (count) => {
    if (!count) return '0';
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getGradeLabel = (grade) => {
    const grades = {
      'mam-non': 'Mầm non',
      'lop-1': 'Lớp 1',
      'lop-2': 'Lớp 2',
      'lop-3': 'Lớp 3',
      'lop-4': 'Lớp 4',
      'lop-5': 'Lớp 5'
    };
    return grades[grade] || grade;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-6xl mb-4">😢</div>
        <h2 className="text-xl font-bold mb-2">Không tìm thấy video</h2>
        <p className="text-gray-500 mb-6">Video này không tồn tại hoặc đã bị xóa</p>
        <button
          onClick={() => navigate('/learn/videos')}
          className="px-6 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Video Player */}
      <div className="bg-black relative">
        {/* Back button */}
        <button
          onClick={() => navigate('/learn/videos')}
          className="absolute top-4 left-4 z-20 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
          <iframe
            className="absolute inset-0 w-full h-full"
            src={getYoutubeEmbedUrl(video.youtube_id, { autoplay: '0' })}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>

      {/* Video Info */}
      <div className="bg-white p-4">
        <h1 className="text-lg font-bold mb-2 leading-tight">{video.title}</h1>

        <div className="flex items-center flex-wrap gap-2 text-sm text-gray-500 mb-3">
          <span>{formatViews(video.view_count)} lượt xem</span>
          {video.grade && (
            <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
              {getGradeLabel(video.grade)}
            </span>
          )}
          {video.category && (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
              {video.category}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4 py-3 border-y border-gray-100">
          <button
            onClick={handleFavorite}
            className={`flex flex-col items-center gap-1 flex-1 py-2 rounded-lg transition ${
              isFavorite ? 'text-red-500 bg-red-50' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
            <span className="text-xs font-medium">{isFavorite ? 'Đã thích' : 'Yêu thích'}</span>
          </button>
          <button
            onClick={handleShare}
            className="flex flex-col items-center gap-1 flex-1 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition"
          >
            <Share2 className="w-6 h-6" />
            <span className="text-xs font-medium">Chia sẻ</span>
          </button>
        </div>

        {/* Channel/Teacher */}
        {(video.channel_name || video.teacher_name) && (
          <div className="flex items-center gap-3 py-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center text-xl text-white">
              👨‍🏫
            </div>
            <div>
              <p className="font-bold">{video.channel_name || video.teacher_name}</p>
              <p className="text-xs text-gray-500">Giáo viên</p>
            </div>
          </div>
        )}

        {/* Description */}
        {video.description && (
          <div className="py-3 border-t border-gray-100">
            <button
              onClick={() => setShowDescription(!showDescription)}
              className="flex items-center justify-between w-full text-left"
            >
              <span className="font-medium text-gray-700">Mô tả video</span>
              {showDescription ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {showDescription && (
              <p className="mt-3 text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                {video.description}
              </p>
            )}
          </div>
        )}

        {/* Tags */}
        {video.tags && video.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 py-3 border-t border-gray-100">
            {video.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs hover:bg-gray-200 cursor-pointer transition"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Related Videos */}
      {relatedVideos.length > 0 && (
        <div className="p-4">
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            🎬 Video liên quan
          </h2>
          <div className="space-y-3">
            {relatedVideos.map((rv) => (
              <div
                key={rv.id}
                onClick={() => navigate(`/learn/videos/${rv.id}`)}
                className="flex gap-3 bg-white rounded-xl shadow p-2 cursor-pointer hover:shadow-lg transition active:scale-[0.99]"
              >
                <div className="relative flex-shrink-0 w-32 h-20 rounded-lg overflow-hidden">
                  <img
                    src={rv.thumbnail_url}
                    alt={rv.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/images/video-placeholder.jpg';
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-red-500/90 rounded-full flex items-center justify-center shadow">
                      <Play className="w-3 h-3 text-white fill-white ml-0.5" />
                    </div>
                  </div>
                  {rv.duration && (
                    <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1 py-0.5 rounded">
                      {formatDuration(rv.duration)}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0 py-1">
                  <h3 className="font-bold text-sm line-clamp-2">{rv.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {rv.channel_name || rv.teacher_name || 'SchoolHub'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatViews(rv.view_count)} lượt xem
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayerPage;
