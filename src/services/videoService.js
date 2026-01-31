// src/services/videoService.js
// Service xu ly video YouTube cho SchoolHub

import { supabase } from '../lib/supabase';

// Trich xuat YouTube ID tu URL
export const extractYoutubeId = (url) => {
  if (!url) return null;

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
    /^([a-zA-Z0-9_-]{11})$/ // Chi ID
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
};

// Lay thumbnail tu YouTube ID
export const getYoutubeThumbnail = (youtubeId, quality = 'hq') => {
  if (!youtubeId) return '/images/video-placeholder.jpg';

  const qualities = {
    default: 'default',
    mq: 'mqdefault',
    hq: 'hqdefault',
    sd: 'sddefault',
    max: 'maxresdefault'
  };
  return `https://img.youtube.com/vi/${youtubeId}/${qualities[quality] || 'hqdefault'}.jpg`;
};

// Lay embed URL
export const getYoutubeEmbedUrl = (youtubeId, options = {}) => {
  if (!youtubeId) return '';

  const params = new URLSearchParams({
    rel: '0', // Khong hien video lien quan
    modestbranding: '1', // An logo YouTube
    playsinline: '1', // Choi inline tren mobile
    ...options
  });
  return `https://www.youtube.com/embed/${youtubeId}?${params.toString()}`;
};

// === CRUD VIDEO ===

// Lay danh sach video
export const getVideos = async (filters = {}) => {
  let query = supabase
    .from('video_lessons')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (filters.subject) {
    query = query.eq('subject', filters.subject);
  }
  if (filters.grade) {
    query = query.eq('grade', filters.grade);
  }
  if (filters.category) {
    query = query.eq('category', filters.category);
  }
  if (filters.is_featured) {
    query = query.eq('is_featured', true);
  }
  if (filters.search) {
    query = query.ilike('title', `%${filters.search}%`);
  }
  if (filters.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

// Lay chi tiet video
export const getVideoById = async (id) => {
  const { data, error } = await supabase
    .from('video_lessons')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;

  // Tang view count
  await supabase
    .from('video_lessons')
    .update({ view_count: (data.view_count || 0) + 1 })
    .eq('id', id);

  return data;
};

// Them video moi
export const createVideo = async (videoData) => {
  const youtubeId = extractYoutubeId(videoData.youtube_url);
  if (!youtubeId) throw new Error('URL YouTube không hợp lệ');

  const { data, error } = await supabase
    .from('video_lessons')
    .insert({
      ...videoData,
      youtube_id: youtubeId,
      thumbnail_url: videoData.thumbnail_url || getYoutubeThumbnail(youtubeId)
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Cap nhat video
export const updateVideo = async (id, videoData) => {
  let updateData = { ...videoData, updated_at: new Date().toISOString() };

  if (videoData.youtube_url) {
    const youtubeId = extractYoutubeId(videoData.youtube_url);
    if (youtubeId) {
      updateData.youtube_id = youtubeId;
      if (!videoData.thumbnail_url) {
        updateData.thumbnail_url = getYoutubeThumbnail(youtubeId);
      }
    }
  }

  const { data, error } = await supabase
    .from('video_lessons')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Xoa video
export const deleteVideo = async (id) => {
  const { error } = await supabase
    .from('video_lessons')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
};

// === PLAYLIST ===

// Lay danh sach playlist
export const getPlaylists = async (filters = {}) => {
  let query = supabase
    .from('video_playlists')
    .select(`
      *,
      videos:playlist_videos (
        video:video_id (*)
      )
    `)
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (filters.subject) {
    query = query.eq('subject', filters.subject);
  }
  if (filters.grade) {
    query = query.eq('grade', filters.grade);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

// Lay chi tiet playlist
export const getPlaylistById = async (id) => {
  const { data, error } = await supabase
    .from('video_playlists')
    .select(`
      *,
      videos:playlist_videos (
        display_order,
        video:video_id (*)
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

// === LICH SU XEM ===

// Luu lich su xem
export const saveWatchProgress = async (userId, videoId, position, duration) => {
  if (!userId || !videoId) return;

  const completed = duration > 0 && position >= duration * 0.9; // Xem 90% la hoan thanh

  const { error } = await supabase
    .from('video_watch_history')
    .upsert({
      user_id: userId,
      video_id: videoId,
      last_position: position,
      watch_duration: Math.max(position, 0),
      completed,
      watched_at: new Date().toISOString()
    }, {
      onConflict: 'user_id,video_id'
    });

  if (error) console.error('Error saving watch progress:', error);
};

// Lay lich su xem
export const getWatchHistory = async (userId, limit = 20) => {
  const { data, error } = await supabase
    .from('video_watch_history')
    .select(`
      *,
      video:video_id (*)
    `)
    .eq('user_id', userId)
    .order('watched_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
};

// Lay vi tri xem cuoi
export const getLastWatchPosition = async (userId, videoId) => {
  const { data } = await supabase
    .from('video_watch_history')
    .select('last_position')
    .eq('user_id', userId)
    .eq('video_id', videoId)
    .single();

  return data?.last_position || 0;
};

// === YEU THICH ===

// Toggle yeu thich
export const toggleFavorite = async (userId, videoId) => {
  if (!userId || !videoId) return false;

  const { data: existing } = await supabase
    .from('video_favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('video_id', videoId)
    .single();

  if (existing) {
    await supabase.from('video_favorites').delete().eq('id', existing.id);
    return false;
  } else {
    await supabase.from('video_favorites').insert({ user_id: userId, video_id: videoId });
    return true;
  }
};

// Kiem tra yeu thich
export const checkFavorite = async (userId, videoId) => {
  if (!userId || !videoId) return false;

  const { data } = await supabase
    .from('video_favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('video_id', videoId)
    .single();

  return !!data;
};

// Lay video yeu thich
export const getFavorites = async (userId) => {
  const { data, error } = await supabase
    .from('video_favorites')
    .select(`
      *,
      video:video_id (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

// === ADMIN FUNCTIONS ===

// Lay tat ca video (bao gom inactive)
export const getAllVideos = async (filters = {}) => {
  let query = supabase
    .from('video_lessons')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters.subject) {
    query = query.eq('subject', filters.subject);
  }
  if (filters.search) {
    query = query.ilike('title', `%${filters.search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

// Toggle trang thai active
export const toggleVideoActive = async (id, isActive) => {
  const { error } = await supabase
    .from('video_lessons')
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw error;
  return true;
};

// Toggle video noi bat
export const toggleVideoFeatured = async (id, isFeatured) => {
  const { error } = await supabase
    .from('video_lessons')
    .update({ is_featured: isFeatured, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw error;
  return true;
};

export default {
  extractYoutubeId,
  getYoutubeThumbnail,
  getYoutubeEmbedUrl,
  getVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
  getPlaylists,
  getPlaylistById,
  saveWatchProgress,
  getWatchHistory,
  getLastWatchPosition,
  toggleFavorite,
  checkFavorite,
  getFavorites,
  getAllVideos,
  toggleVideoActive,
  toggleVideoFeatured
};
