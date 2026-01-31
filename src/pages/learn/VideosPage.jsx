// src/pages/learn/VideosPage.jsx
// Trang danh sach video chinh cho hoc sinh

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Search, Clock, Star, ArrowLeft, TrendingUp } from 'lucide-react';
import { getVideos } from '../../services/videoService';

const VideosPage = () => {
  const navigate = useNavigate();
  const [featuredVideos, setFeaturedVideos] = useState([]);
  const [recentVideos, setRecentVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const subjects = [
    { id: 'toan', name: 'Toán', icon: '📐', color: 'from-blue-400 to-blue-600', description: 'Số học, Hình học, Đo lường' },
    { id: 'tieng-viet', name: 'Tiếng Việt', icon: '📖', color: 'from-green-400 to-green-600', description: 'Học vần, Tập đọc, Chính tả' },
    { id: 'tieng-anh', name: 'Tiếng Anh', icon: '🌍', color: 'from-purple-400 to-purple-600', description: 'Alphabet, Vocabulary, Grammar' },
    { id: 'khoa-hoc', name: 'Khoa học', icon: '🔬', color: 'from-orange-400 to-orange-600', description: 'Tự nhiên, Xã hội, Thí nghiệm' },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [featured, recent] = await Promise.all([
        getVideos({ is_featured: true, limit: 5 }),
        getVideos({ limit: 10 })
      ]);
      setFeaturedVideos(featured || []);
      setRecentVideos(recent || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      const results = await getVideos({ search: searchTerm, limit: 20 });
      setRecentVideos(results || []);
      setFeaturedVideos([]);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-orange-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-4 pb-8">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/learn')} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">🎬 Video Bài Giảng</h1>
            <p className="text-sm opacity-90">Hàng trăm video chất lượng cao</p>
          </div>
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

      {/* Subject Cards */}
      <div className="p-4 -mt-4">
        <div className="grid grid-cols-2 gap-3">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              onClick={() => navigate(`/learn/videos/browse/${subject.id}?grade=lop-1`)}
              className={`bg-gradient-to-br ${subject.color} text-white rounded-2xl p-4 cursor-pointer transform hover:scale-105 transition shadow-lg active:scale-95`}
            >
              <div className="text-3xl mb-2">{subject.icon}</div>
              <h3 className="font-bold text-lg">{subject.name}</h3>
              <p className="text-xs opacity-90 line-clamp-1">{subject.description}</p>
            </div>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div>
        </div>
      ) : (
        <>
          {/* Featured Videos */}
          {featuredVideos.length > 0 && !searchTerm && (
            <section className="p-4">
              <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                Video nổi bật
              </h2>
              <div className="flex overflow-x-auto hide-scrollbar gap-4 pb-2 -mx-4 px-4">
                {featuredVideos.map((video) => (
                  <div
                    key={video.id}
                    onClick={() => navigate(`/learn/videos/${video.id}`)}
                    className="flex-shrink-0 w-64 bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition active:scale-[0.98]"
                  >
                    <div className="relative">
                      <img
                        src={video.thumbnail_url}
                        alt={video.title}
                        className="w-full h-36 object-cover"
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
                      <h3 className="font-bold text-sm line-clamp-2">{video.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">{video.channel_name || video.teacher_name || 'SchoolHub'}</p>
                      <p className="text-xs text-gray-400">{formatViews(video.view_count)} lượt xem</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Recent Videos / Search Results */}
          {recentVideos.length > 0 && (
            <section className="p-4">
              <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                {searchTerm ? (
                  <>🔍 Kết quả tìm kiếm "{searchTerm}"</>
                ) : (
                  <>
                    <Clock className="w-5 h-5 text-blue-500" />
                    Video mới nhất
                  </>
                )}
              </h2>
              <div className="space-y-3">
                {recentVideos.map((video) => (
                  <div
                    key={video.id}
                    onClick={() => navigate(`/learn/videos/${video.id}`)}
                    className="flex gap-3 bg-white rounded-xl shadow p-2 cursor-pointer hover:shadow-lg transition active:scale-[0.99]"
                  >
                    <div className="relative flex-shrink-0 w-32 h-20 rounded-lg overflow-hidden">
                      <img
                        src={video.thumbnail_url}
                        alt={video.title}
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
                      {video.duration && (
                        <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                          {formatDuration(video.duration)}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 py-1">
                      <h3 className="font-bold text-sm line-clamp-2">{video.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">{video.channel_name || video.teacher_name || 'SchoolHub'}</p>
                      <p className="text-xs text-gray-400">{formatViews(video.view_count)} lượt xem</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Empty State */}
          {recentVideos.length === 0 && featuredVideos.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-lg font-bold text-gray-600">Chưa có video nào</h3>
              <p className="text-gray-500">Hãy chọn môn học để xem video</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VideosPage;
