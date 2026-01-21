// src/contexts/MemberContext.jsx
// ĐÃ TÍCH HỢP SUPABASE - Sync dữ liệu lên cloud
import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const STORAGE_KEY = 'gdtm_data';

// Initial state
const initialState = {
  members: [],
  currentMember: null,
  isLoading: true,
  familyId: null, // ID gia đình trên Supabase
  isSyncing: false,
};

// Reducer
function reducer(state, action) {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, members: action.payload, isLoading: false };
    case 'SET_FAMILY_ID':
      return { ...state, familyId: action.payload };
    case 'SET_CURRENT':
      return { ...state, currentMember: action.payload };
    case 'ADD_MEMBER':
      return { ...state, members: [...state.members, action.payload] };
    case 'UPDATE_MEMBER': {
      const members = state.members.map(m => m.id === action.payload.id ? action.payload : m);
      return {
        ...state,
        members,
        currentMember: state.currentMember?.id === action.payload.id ? action.payload : state.currentMember,
      };
    }
    case 'DELETE_MEMBER':
      return {
        ...state,
        members: state.members.filter(m => m.id !== action.payload),
        currentMember: state.currentMember?.id === action.payload ? null : state.currentMember,
      };
    case 'LOGOUT':
      return { ...state, currentMember: null };
    case 'SET_SYNCING':
      return { ...state, isSyncing: action.payload };
    default:
      return state;
  }
}

// Tạo mã liên kết ngẫu nhiên
const generateLinkCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'CHILD-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Create new member
const createMember = (name, avatar, age) => ({
  id: `member_${Date.now()}`,
  name,
  avatar,
  age,
  createdAt: new Date().toISOString(),
  xp: 0,
  level: 1,
  linkCode: generateLinkCode(), // Mã liên kết cho phụ huynh
  stats: {
    totalLessons: 0,
    perfectLessons: 0,
    totalGamesPlayed: 0,
    streak: 0,
    longestStreak: 0,
    lastActiveDate: null,
  },
  progress: {},
  gameScores: {},
  achievements: [],
  dailyChallenge: null,
});

// Context
const MemberContext = createContext(null);

export function MemberProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load from localStorage và sync với Supabase
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // 1. Load từ localStorage trước (để app hoạt động offline)
      const stored = localStorage.getItem(STORAGE_KEY);
      const localData = stored ? JSON.parse(stored) : { members: [] };
      dispatch({ type: 'SET_DATA', payload: localData.members || [] });

      // 2. Restore last member
      const lastId = localStorage.getItem('gdtm_lastMember');
      if (lastId && localData.members) {
        const member = localData.members.find(m => m.id === lastId);
        if (member) dispatch({ type: 'SET_CURRENT', payload: member });
      }

      // 3. Sync với Supabase nếu có kết nối
      await syncWithSupabase(localData.members || []);

    } catch (e) {
      console.error('Load error:', e);
      dispatch({ type: 'SET_DATA', payload: [] });
    }
  };

  // Sync dữ liệu với Supabase
  const syncWithSupabase = async (localMembers) => {
    try {
      dispatch({ type: 'SET_SYNCING', payload: true });

      // Kiểm tra có family_id trong localStorage không
      let familyId = localStorage.getItem('gdtm_familyId');

      if (!familyId && localMembers.length > 0) {
        // Tạo family mới trên Supabase
        const { data: family, error } = await supabase
          .from('families')
          .insert({ name: 'Gia đình của tôi', plan: 'free' })
          .select()
          .single();

        if (family) {
          familyId = family.id;
          localStorage.setItem('gdtm_familyId', familyId);
          dispatch({ type: 'SET_FAMILY_ID', payload: familyId });
        }
      }

      if (familyId) {
        dispatch({ type: 'SET_FAMILY_ID', payload: familyId });

        // Sync từng member lên Supabase
        for (const member of localMembers) {
          await syncMemberToSupabase(member, familyId);
        }
      }

    } catch (err) {
      console.log('Sync error (offline mode):', err);
    } finally {
      dispatch({ type: 'SET_SYNCING', payload: false });
    }
  };

  // Sync 1 member lên Supabase
  const syncMemberToSupabase = async (member, familyId) => {
    try {
      // Kiểm tra member đã có trên Supabase chưa (theo local_id)
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('local_id', member.id)
        .single();

      const profileData = {
        local_id: member.id,
        family_id: familyId,
        role: 'child',
        name: member.name,
        avatar: member.avatar,
        age: member.age,
        level: member.level || 1,
        xp: member.xp || 0,
        streak: member.stats?.streak || 0,
        link_code: member.linkCode || generateLinkCode(),
        stats: member.stats,
        progress: member.progress,
        game_scores: member.gameScores,
        achievements: member.achievements,
      };

      if (existing) {
        // Update
        await supabase
          .from('profiles')
          .update(profileData)
          .eq('id', existing.id);
      } else {
        // Insert mới
        await supabase.from('profiles').insert(profileData);
      }
    } catch (err) {
      console.log('Sync member error:', err);
    }
  };

  // Save to localStorage và sync Supabase
  useEffect(() => {
    if (!state.isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ members: state.members }));

      // Sync to Supabase (debounced)
      const timer = setTimeout(() => {
        if (state.familyId) {
          state.members.forEach(m => syncMemberToSupabase(m, state.familyId));
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [state.members, state.isLoading, state.familyId]);

  // Ghi log học tập lên Supabase (để phụ huynh theo dõi)
  const logActivity = async (type, title, data = {}) => {
    if (!state.currentMember) return;

    try {
      // Tìm profile_id trên Supabase
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('local_id', state.currentMember.id)
        .single();

      if (profile) {
        await supabase.from('learning_logs').insert({
          child_id: profile.id,
          type: type, // 'lesson', 'game', 'story', 'vocabulary'
          title: title,
          score: data.score || null,
          words_learned: data.wordsLearned || 0,
          duration: data.duration || 0,
          xp_earned: data.xpEarned || 0,
          date: new Date().toISOString().split('T')[0],
        });
      }
    } catch (err) {
      console.log('Log activity error:', err);
    }
  };

  // Actions
  const addMember = useCallback(async (name, avatar, age) => {
    const member = createMember(name, avatar, age);
    dispatch({ type: 'ADD_MEMBER', payload: member });

    // Sync ngay lên Supabase
    if (state.familyId) {
      await syncMemberToSupabase(member, state.familyId);
    }

    return member;
  }, [state.familyId]);

  const selectMember = useCallback((member) => {
    const today = new Date().toISOString().split('T')[0];
    let updated = { ...member };

    if (member.stats.lastActiveDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (member.stats.lastActiveDate === yesterdayStr) {
        updated.stats.streak = (member.stats.streak || 0) + 1;
      } else {
        updated.stats.streak = 1;
      }
      updated.stats.longestStreak = Math.max(updated.stats.longestStreak || 0, updated.stats.streak);
      updated.stats.lastActiveDate = today;
      dispatch({ type: 'UPDATE_MEMBER', payload: updated });
    }

    dispatch({ type: 'SET_CURRENT', payload: updated });
    localStorage.setItem('gdtm_lastMember', updated.id);
  }, []);

  const updateMember = useCallback((member) => {
    dispatch({ type: 'UPDATE_MEMBER', payload: member });
  }, []);

  const deleteMember = useCallback((id) => {
    dispatch({ type: 'DELETE_MEMBER', payload: id });
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('gdtm_lastMember');
  }, []);

  const completeLesson = useCallback(async (subjectKey, lessonId, score) => {
    if (!state.currentMember) return;

    const member = { ...state.currentMember };
    const isPerfect = score === 100;

    if (!member.progress[subjectKey]) {
      member.progress[subjectKey] = { completed: [], scores: {} };
    }

    if (!member.progress[subjectKey].completed.includes(lessonId)) {
      member.progress[subjectKey].completed.push(lessonId);
    }

    const prevScore = member.progress[subjectKey].scores[lessonId] || 0;
    member.progress[subjectKey].scores[lessonId] = Math.max(prevScore, score);

    member.stats.totalLessons += 1;
    if (isPerfect) member.stats.perfectLessons += 1;

    const xpEarned = 50 + (isPerfect ? 30 : Math.floor(score / 10));
    member.xp += xpEarned;
    member.level = getLevel(member.xp).level;

    // Check achievements
    if (member.stats.totalLessons === 1 && !member.achievements.includes('firstLesson')) {
      member.achievements.push('firstLesson');
      member.xp += 50;
    }
    if (member.stats.streak >= 3 && !member.achievements.includes('streak3')) {
      member.achievements.push('streak3');
      member.xp += 100;
    }
    if (member.stats.streak >= 7 && !member.achievements.includes('streak7')) {
      member.achievements.push('streak7');
      member.xp += 250;
    }

    updateMember(member);

    // Log lên Supabase để phụ huynh theo dõi
    await logActivity('lesson', `${subjectKey} - Bài ${lessonId}`, {
      score,
      xpEarned,
    });

    return { xpEarned };
  }, [state.currentMember, updateMember]);

  const completeGame = useCallback(async (gameId, score, gameName) => {
    if (!state.currentMember) return;

    const member = { ...state.currentMember };

    if (!member.gameScores[gameId]) {
      member.gameScores[gameId] = { plays: 0, best: 0 };
    }

    member.gameScores[gameId].plays += 1;
    member.gameScores[gameId].best = Math.max(member.gameScores[gameId].best, score);
    member.stats.totalGamesPlayed += 1;

    const xpEarned = Math.floor(score / 10) + 10;
    member.xp += xpEarned;
    member.level = getLevel(member.xp).level;

    // Check achievements
    if (member.stats.totalGamesPlayed >= 10 && !member.achievements.includes('gamer10')) {
      member.achievements.push('gamer10');
      member.xp += 100;
    }

    updateMember(member);

    // Log lên Supabase
    await logActivity('game', gameName || gameId, {
      score,
      xpEarned,
    });

    return { xpEarned };
  }, [state.currentMember, updateMember]);

  // Lấy tin nhắn động viên từ phụ huynh
  const getEncouragements = useCallback(async () => {
    if (!state.currentMember) return [];

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('local_id', state.currentMember.id)
        .single();

      if (profile) {
        const { data: messages } = await supabase
          .from('encouragements')
          .select('*')
          .eq('child_id', profile.id)
          .eq('is_read', false)
          .order('created_at', { ascending: false });

        return messages || [];
      }
    } catch (err) {
      console.log('Get encouragements error:', err);
    }
    return [];
  }, [state.currentMember]);

  // Đánh dấu đã đọc tin nhắn
  const markEncouragementRead = useCallback(async (id) => {
    try {
      await supabase
        .from('encouragements')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', id);
    } catch (err) {
      console.log('Mark read error:', err);
    }
  }, []);

  // Calculate level
  const getLevel = (xp) => {
    const thresholds = [0, 100, 250, 500, 800, 1200, 1700, 2300, 3000, 4000, 5000];
    const titles = ['Người Mới', 'Học Sinh', 'Cần Cù', 'Chăm Chỉ', 'Giỏi Giang', 'Xuất Sắc', 'Siêu Sao', 'Thiên Tài', 'Thần Đồng', 'Bậc Thầy', 'Huyền Thoại'];

    let level = 1;
    for (let i = 1; i < thresholds.length; i++) {
      if (xp >= thresholds[i]) level = i + 1;
      else break;
    }

    const currentXp = thresholds[level - 1];
    const nextXp = thresholds[level] || thresholds[thresholds.length - 1] + 1000;
    const progress = ((xp - currentXp) / (nextXp - currentXp)) * 100;

    return { level, title: titles[level - 1] || 'Huyền Thoại', xp, progress: Math.min(100, progress) };
  };

  const value = {
    members: state.members,
    currentMember: state.currentMember,
    isLoading: state.isLoading,
    isSyncing: state.isSyncing,
    familyId: state.familyId,
    addMember,
    selectMember,
    updateMember,
    deleteMember,
    logout,
    completeLesson,
    completeGame,
    levelInfo: state.currentMember ? getLevel(state.currentMember.xp || 0) : null,
    getLevel,
    // Supabase functions
    logActivity,
    getEncouragements,
    markEncouragementRead,
    syncWithSupabase: () => syncWithSupabase(state.members),
  };

  return (
    <MemberContext.Provider value={value}>
      {children}
    </MemberContext.Provider>
  );
}

export function useMember() {
  const context = useContext(MemberContext);
  if (!context) throw new Error('useMember must be used within MemberProvider');
  return context;
}

export default MemberContext;
