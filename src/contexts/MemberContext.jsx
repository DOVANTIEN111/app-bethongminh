import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'gdtm_data';

// Initial state
const initialState = {
  members: [],
  currentMember: null,
  isLoading: true,
};

// Reducer
function reducer(state, action) {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, members: action.payload, isLoading: false };
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
    default:
      return state;
  }
}

// Create new member
const createMember = (name, avatar, age) => ({
  id: `member_${Date.now()}`,
  name,
  avatar,
  age,
  createdAt: new Date().toISOString(),
  xp: 0,
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
  
  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const data = stored ? JSON.parse(stored) : { members: [] };
      dispatch({ type: 'SET_DATA', payload: data.members || [] });
      
      const lastId = localStorage.getItem('gdtm_lastMember');
      if (lastId && data.members) {
        const member = data.members.find(m => m.id === lastId);
        if (member) dispatch({ type: 'SET_CURRENT', payload: member });
      }
    } catch (e) {
      console.error('Load error:', e);
      dispatch({ type: 'SET_DATA', payload: [] });
    }
  }, []);
  
  // Save to localStorage
  useEffect(() => {
    if (!state.isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ members: state.members }));
    }
  }, [state.members, state.isLoading]);
  
  // Actions
  const addMember = useCallback((name, avatar, age) => {
    const member = createMember(name, avatar, age);
    dispatch({ type: 'ADD_MEMBER', payload: member });
    return member;
  }, []);
  
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
  
  const completeLesson = useCallback((subjectKey, lessonId, score) => {
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
    return { xpEarned };
  }, [state.currentMember, updateMember]);
  
  const completeGame = useCallback((gameId, score) => {
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
    
    // Check achievements
    if (member.stats.totalGamesPlayed >= 10 && !member.achievements.includes('gamer10')) {
      member.achievements.push('gamer10');
      member.xp += 100;
    }
    
    updateMember(member);
    return { xpEarned };
  }, [state.currentMember, updateMember]);
  
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
    addMember,
    selectMember,
    updateMember,
    deleteMember,
    logout,
    completeLesson,
    completeGame,
    levelInfo: state.currentMember ? getLevel(state.currentMember.xp || 0) : null,
    getLevel,
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
