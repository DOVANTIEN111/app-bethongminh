// src/pages/learn/VideosPage.jsx
// Trang danh sach video cho hoc sinh

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Play, Heart, Clock, Search, ArrowLeft, Star } from 'lucide-react';
import { getVideos, getPlaylists } from '../../services/videoService';

const VideosPage = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [featuredVideos, setFeaturedVideos] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSubject, setActiveSubject] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const subjects = [
    { id: 'all', name: 'Tất cả', icon: '📚' },
    { id: 'toan', name: 'Toán', icon: '📐' },
    { id: 'tieng-viet', name: 'Tiếng Việt', icon: '📖' },
    { id: 'tieng-anh', name: 'Tiếng Anh', icon: '🌍' },
    { id: 'khoa-hoc', name: 'Khoa học', icon: '🔬' },
    { id: 'ky-nang', name: 'Kỹ năng', icon: '🎯' },
  ];

  useEffect(() => {
    loadData();
  }, [activeSubject]);

  const loadData = async () => {
    setLoading(true);
    try {
      const filters = activeSubject !== 'all' ? { subject: activeSubject } : {};

      const [videosData, featuredData, playlistsData] = await Promise.all([
        getVideos({ ...filters, limit: 20 }),
        getVideos({ is_featured: true, limit: 5 }),
        getPlaylists(filters)
      ]);

      setVideos(videosData || []);
      setFeaturedVideos(featuredData || []);
      setPlaylists(playlistsData || []);
    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadData();
      return;
    }

    setLoading(true);
    try {
      const results = await getVideos({ search: searchTerm });
      setVideos(results || []);
      setFeaturedVideos([]);
      setPlaylists([]);
    } catch (error) {
      console.error('Error searching:', error);
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

  const formatViews = (count) => {
    if (!count) return '0';
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
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

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-4 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate('/learn')}
            className="p-2 hover:bg-white/20 rounded-full transition"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <span className="text-2xl">🎬</span>
            Video bài giảng
          </h1>
        </div>

        {/* Search */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm video..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-3 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-5 bg-white/20 rounded-xl font-bold hover:bg-white/30 transition"
          >
            Tìm
          </button>
        </div>
      </div>

      {/* Subject tabs */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="flex overflow-x-auto hide-scrollbar p-2 gap-2">
          {subjects.map((subject) => (
            <button
              key={subject.id}
              onClick={() => {
                setActiveSubject(subject.id);
                setSearchTerm('');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition ${
                activeSubject === subject.id
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{subject.icon}</span>
              <span className="font-medium">{subject.name}</span>
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="p-4 space-y-6">
          {/* Featured Videos */}
          {featuredVideos.length > 0 && activeSubject === 'all' && !searchTerm && (
            <section>
              <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                Video nổi bật
              </h2>
              <div className="flex overflow-x-auto hide-scrollbar gap-4 pb-2 -mx-4 px-4">
                {featuredVideos.map((video) => (
                  <div
                    key={video.id}
                    onClick={() => navigate(`/learn/videos/${video.id}`)}
                    className="flex-shrink-0 w-72 bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition active:scale-[0.98]"
                  >
                    <div className="relative">
                      <img
                        src={video.thumbnail_url}
                        alt={video.title}
                        className="w-full h-40 object-cover"
                        onError={(e) => {
                          e.target.src = '/images/video-placeholder.jpg';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                        <div className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                          <Play className="w-6 h-6 text-white fill-white ml-1" />
                        </div>
                      </div>
                      {video.duration && (
                        <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                          {formatDuration(video.duration)}
                        </span>
                      )}
                      <div className="absolute top-2 left-2">
                        <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                          <Star className="w-3 h-3 fill-white" />
                          Nổi bật
                        </span>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-bold text-sm line-clamp-2 mb-1">{video.title}</h3>
                      <p className="text-xs text-gray-500">{video.channel_name || video.teacher_name}</p>
                      <p className="text-xs text-gray-400">{formatViews(video.view_count)} lượt xem</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Playlists */}
          {playlists.length > 0 && !searchTerm && (
            <section>
              <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                📁 Danh sách phát
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {playlists.map((playlist) => (
                  <div
                    key={playlist.id}
                    onClick={() => navigate(`/learn/videos/playlist/${playlist.id}`)}
                    className="bg-white rounded-xl shadow overflow-hidden cursor-pointer hover:shadow-lg transition active:scale-[0.98]"
                  >
                    <div className="relative h-24">
                      <img
                        src={playlist.thumbnail_url || '/images/playlist-default.jpg'}
                        alt={playlist.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                        {playlist.video_count || 0} video
                      </span>
                    </div>
                    <div className="p-2">
                      <h3 className="font-bold text-sm line-clamp-1">{playlist.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* All Videos */}
          <section>
            <h2 className="text-lg font-bold mb-3">
              {searchTerm
                ? `🔍 Kết quả tìm kiếm "${searchTerm}"`
                : activeSubject === 'all'
                  ? '🎬 Tất cả video'
                  : `🎬 Video ${subjects.find(s => s.id === activeSubject)?.name}`
              }
            </h2>

            {videos.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-6xl mb-4">📭</div>
                <p className="font-medium">Chưa có video nào</p>
                <p className="text-sm mt-1">Hãy quay lại sau nhé!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {videos.map((video) => (
                  <div
                    key={video.id}
                    onClick={() => navigate(`/learn/videos/${video.id}`)}
                    className="flex gap-3 bg-white rounded-xl shadow p-2 cursor-pointer hover:shadow-lg transition active:scale-[0.99]"
                  >
                    <div className="relative flex-shrink-0 w-36 h-24 rounded-lg overflow-hidden">
                      <img
                        src={video.thumbnail_url}
                        alt={video.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/images/video-placeholder.jpg';
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 bg-red-500/90 rounded-full flex items-center justify-center shadow">
                          <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                        </div>
                      </div>
                      {video.duration && (
                        <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                          {formatDuration(video.duration)}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 py-1">
                      <h3 className="font-bold text-sm line-clamp-2 mb-1">{video.title}</h3>
                      <p className="text-xs text-gray-500 mb-1">
                        {video.channel_name || video.teacher_name || 'SchoolHub'}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span>{formatViews(video.view_count)} lượt xem</span>
                        {video.grade && (
                          <>
                            <span>•</span>
                            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded text-[10px]">
                              {getGradeLabel(video.grade)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
};

export default VideosPage;
