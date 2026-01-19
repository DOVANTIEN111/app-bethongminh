import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Kiểm tra nếu chưa cấu hình thì dùng localStorage fallback
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  : null;

// ============================================
// AUTH FUNCTIONS
// ============================================

export const auth = {
  // Đăng ký bằng email
  signUp: async (email, password, fullName) => {
    if (!supabase) return { error: { message: 'Supabase not configured' } };
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    });
    return { data, error };
  },
  
  // Đăng nhập bằng email
  signIn: async (email, password) => {
    if (!supabase) return { error: { message: 'Supabase not configured' } };
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },
  
  // Đăng nhập bằng Google
  signInWithGoogle: async () => {
    if (!supabase) return { error: { message: 'Supabase not configured' } };
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    return { data, error };
  },
  
  // Đăng xuất
  signOut: async () => {
    if (!supabase) return { error: null };
    
    const { error } = await supabase.auth.signOut();
    return { error };
  },
  
  // Lấy user hiện tại
  getUser: async () => {
    if (!supabase) return { data: { user: null } };
    
    const { data, error } = await supabase.auth.getUser();
    return { data, error };
  },
  
  // Lắng nghe thay đổi auth
  onAuthStateChange: (callback) => {
    if (!supabase) return { data: { subscription: { unsubscribe: () => {} } } };
    
    return supabase.auth.onAuthStateChange(callback);
  }
};

// ============================================
// DATABASE FUNCTIONS
// ============================================

export const db = {
  // ========== FAMILY MEMBERS ==========
  
  // Lấy tất cả thành viên của user
  getMembers: async (userId) => {
    if (!supabase) return { data: null, error: { message: 'Supabase not configured' } };
    
    const { data, error } = await supabase
      .from('family_members')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });
    
    return { data, error };
  },
  
  // Thêm thành viên mới
  addMember: async (userId, member) => {
    if (!supabase) return { data: null, error: { message: 'Supabase not configured' } };
    
    const { data, error } = await supabase
      .from('family_members')
      .insert({
        user_id: userId,
        name: member.name,
        avatar: member.avatar,
        age: member.age,
        role: member.role || 'child',
        xp: member.xp || 0,
        stats: member.stats || { streak: 0, totalLessons: 0, perfectScores: 0 },
        progress: member.progress || {},
        english_progress: member.englishProgress || {},
        game_scores: member.gameScores || {},
        achievements: member.achievements || []
      })
      .select()
      .single();
    
    return { data, error };
  },
  
  // Cập nhật thành viên
  updateMember: async (memberId, updates) => {
    if (!supabase) return { data: null, error: { message: 'Supabase not configured' } };
    
    const { data, error } = await supabase
      .from('family_members')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', memberId)
      .select()
      .single();
    
    return { data, error };
  },
  
  // Xóa thành viên
  deleteMember: async (memberId) => {
    if (!supabase) return { error: { message: 'Supabase not configured' } };
    
    const { error } = await supabase
      .from('family_members')
      .delete()
      .eq('id', memberId);
    
    return { error };
  },
  
  // ========== LEARNING HISTORY ==========
  
  // Ghi lại hoạt động học tập
  logActivity: async (memberId, activity) => {
    if (!supabase) return { error: { message: 'Supabase not configured' } };
    
    const { data, error } = await supabase
      .from('learning_history')
      .insert({
        member_id: memberId,
        activity_type: activity.type,
        activity_id: activity.id,
        score: activity.score || 0,
        xp_earned: activity.xpEarned || 0,
        duration_seconds: activity.duration || 0
      });
    
    return { data, error };
  },
  
  // Lấy lịch sử học tập
  getHistory: async (memberId, limit = 50) => {
    if (!supabase) return { data: null, error: { message: 'Supabase not configured' } };
    
    const { data, error } = await supabase
      .from('learning_history')
      .select('*')
      .eq('member_id', memberId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    return { data, error };
  },
  
  // ========== DAILY CHALLENGES ==========
  
  // Lấy thử thách hôm nay
  getTodayChallenges: async (memberId) => {
    if (!supabase) return { data: null, error: { message: 'Supabase not configured' } };
    
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('daily_challenges')
      .select('*')
      .eq('member_id', memberId)
      .eq('date', today)
      .single();
    
    return { data, error };
  },
  
  // Lưu thử thách
  saveChallenges: async (memberId, challenges) => {
    if (!supabase) return { error: { message: 'Supabase not configured' } };
    
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('daily_challenges')
      .upsert({
        member_id: memberId,
        date: today,
        challenges: challenges,
        completed: challenges.every(c => c.completed)
      }, {
        onConflict: 'member_id,date'
      });
    
    return { data, error };
  },
  
  // ========== SYNC FUNCTIONS ==========
  
  // Sync toàn bộ data lên cloud
  syncToCloud: async (userId, localData) => {
    if (!supabase) return { error: { message: 'Supabase not configured' } };
    
    try {
      // Sync từng member
      for (const member of localData.members || []) {
        if (member.cloudId) {
          await db.updateMember(member.cloudId, {
            xp: member.xp,
            stats: member.stats,
            progress: member.progress,
            english_progress: member.englishProgress,
            game_scores: member.gameScores,
            achievements: member.achievements
          });
        } else {
          const { data } = await db.addMember(userId, member);
          if (data) member.cloudId = data.id;
        }
      }
      return { success: true };
    } catch (err) {
      return { error: err };
    }
  },
  
  // Lấy data từ cloud
  fetchFromCloud: async (userId) => {
    if (!supabase) return { data: null, error: { message: 'Supabase not configured' } };
    
    const { data: members, error } = await db.getMembers(userId);
    
    if (error) return { data: null, error };
    
    // Transform to local format
    const localFormat = members?.map(m => ({
      id: m.id,
      cloudId: m.id,
      name: m.name,
      avatar: m.avatar,
      age: m.age,
      role: m.role,
      xp: m.xp,
      stats: m.stats,
      progress: m.progress,
      englishProgress: m.english_progress,
      gameScores: m.game_scores,
      achievements: m.achievements
    }));
    
    return { data: localFormat, error: null };
  }
};

export default supabase;
