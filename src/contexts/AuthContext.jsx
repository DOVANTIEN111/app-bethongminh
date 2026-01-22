import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, getDeviceInfo, getOrCreateDeviceId } from '../lib/supabase';
import { analytics } from '../lib/analytics';
import { setUser as setSentryUser } from '../lib/sentry';
import { validateChildData, validateChildName, sanitizeString } from '../utils/validation';

const AuthContext = createContext(null);

const PLANS = {
  free: { name: 'Miễn phí', maxDevices: 1, maxChildren: 1, price: 0 },
  plus: { name: 'Plus', maxDevices: 3, maxChildren: 3, price: 49000 },
  family: { name: 'Gia đình', maxDevices: 5, maxChildren: 5, price: 79000 },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [account, setAccount] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [devices, setDevices] = useState([]);
  const [childrenList, setChildrenList] = useState([]);
  const [currentChild, setCurrentChild] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deviceAllowed, setDeviceAllowed] = useState(true);
  const [deviceError, setDeviceError] = useState(null);

  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await loadAccountData(session.user.id);
      }
    } catch (err) {
      console.error('Init auth error:', err);
    } finally {
      setLoading(false);
    }

    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await loadAccountData(session.user.id);
        } else {
          resetState();
        }
      }
    );
    return () => authSub.unsubscribe();
  };

  const resetState = () => {
    setAccount(null);
    setSubscription(null);
    setDevices([]);
    setChildrenList([]);
    setCurrentChild(null);
    setDeviceAllowed(true);
    setDeviceError(null);
  };

  const loadAccountData = async (userId) => {
    try {
      const { data: accountData } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!accountData) return;
      setAccount(accountData);

      const { data: subData } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('account_id', accountData.id)
        .single();

      setSubscription(subData || { plan: 'free', max_devices: 1, max_children: 1 });
      await checkAndRegisterDevice(accountData.id);
      await loadDevices(accountData.id);
      await loadChildren(accountData.id);
    } catch (err) {
      console.error('Load account error:', err);
    }
  };

  const checkAndRegisterDevice = async (accountId) => {
    try {
      const deviceInfo = getDeviceInfo();
      const deviceId = getOrCreateDeviceId();

      const { data: checkResult } = await supabase.rpc('check_device_limit', {
        p_account_id: accountId,
        p_device_fingerprint: deviceId,
      });

      if (!checkResult?.allowed) {
        setDeviceAllowed(false);
        setDeviceError(checkResult?.message || 'Đã đạt giới hạn thiết bị');
        return false;
      }

      if (checkResult?.is_new) {
        await supabase.rpc('register_device', {
          p_account_id: accountId,
          p_device_fingerprint: deviceId,
          p_device_name: deviceInfo.suggestedName,
          p_device_type: deviceInfo.deviceType,
          p_browser: deviceInfo.browser,
          p_os: deviceInfo.os,
          p_screen_size: deviceInfo.screenSize,
        });
      }

      setDeviceAllowed(true);
      setDeviceError(null);
      return true;
    } catch (err) {
      console.error('Device check error:', err);
      setDeviceAllowed(true);
      return true;
    }
  };

  const loadDevices = async (accountId) => {
    try {
      const { data } = await supabase
        .from('user_devices')
        .select('*')
        .eq('account_id', accountId)
        .eq('is_active', true)
        .order('last_active', { ascending: false });
      setDevices(data || []);
    } catch (err) {
      console.error('Load devices error:', err);
    }
  };

  const removeDevice = async (deviceId) => {
    if (!account) return { error: 'Chưa đăng nhập' };
    try {
      const { data } = await supabase.rpc('remove_device', {
        p_account_id: account.id,
        p_device_id: deviceId,
      });
      if (data?.success) {
        await loadDevices(account.id);
        return { success: true };
      }
      return { error: data?.message || 'Không thể xóa thiết bị' };
    } catch (err) {
      return { error: err.message };
    }
  };

  const renameDevice = async (deviceId, newName) => {
    try {
      await supabase.from('user_devices').update({ device_name: newName }).eq('id', deviceId);
      await loadDevices(account.id);
      return { success: true };
    } catch (err) {
      return { error: err.message };
    }
  };

  const loadChildren = async (accountId) => {
    try {
      const { data } = await supabase
        .from('children')
        .select('*')
        .eq('account_id', accountId)
        .order('created_at', { ascending: true });
      setChildrenList(data || []);

      const lastChildId = localStorage.getItem('gdtm_current_child');
      if (lastChildId && data) {
        const child = data.find(c => c.id === lastChildId);
        if (child) setCurrentChild(child);
      }
    } catch (err) {
      console.error('Load children error:', err);
    }
  };

  const addChild = async (name, avatar = '👦', age = null, gender = null) => {
    if (!account) return { error: 'Chưa đăng nhập' };

    // Validate input
    const validation = validateChildData({ name, avatar, age, gender });
    if (!validation.valid) {
      return { error: validation.errors[0] };
    }

    const { name: validName, avatar: validAvatar, age: validAge, gender: validGender } = validation.data;

    try {
      const { data } = await supabase.rpc('add_child', {
        p_account_id: account.id,
        p_name: sanitizeString(validName),
        p_avatar: validAvatar,
        p_age: validAge,
        p_gender: validGender,
      });
      if (data?.success) {
        await loadChildren(account.id);
        // Track child created
        analytics.childCreated(validAge, validGender);
        return { success: true, childId: data.child_id };
      }
      return { error: data?.message || 'Không thể thêm bé' };
    } catch (err) {
      return { error: err.message };
    }
  };

  const updateChild = async (childId, updates) => {
    // Validate name if provided
    if (updates.name !== undefined) {
      const nameResult = validateChildName(updates.name);
      if (!nameResult.valid) {
        return { error: nameResult.error };
      }
      updates.name = sanitizeString(nameResult.value);
    }

    try {
      await supabase.from('children').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', childId);
      await loadChildren(account.id);
      if (currentChild?.id === childId) {
        setCurrentChild(prev => ({ ...prev, ...updates }));
      }
      return { success: true };
    } catch (err) {
      return { error: err.message };
    }
  };

  const deleteChild = async (childId) => {
    try {
      await supabase.from('children').delete().eq('id', childId);
      await loadChildren(account.id);
      if (currentChild?.id === childId) {
        setCurrentChild(null);
        localStorage.removeItem('gdtm_current_child');
      }
      return { success: true };
    } catch (err) {
      return { error: err.message };
    }
  };

  const selectChild = useCallback((child) => {
    setCurrentChild(child);
    localStorage.setItem('gdtm_current_child', child.id);
    supabase.rpc('update_child_streak', { p_child_id: child.id });
    // Track child selected
    analytics.childSelected(child.id);
  }, []);

  // =====================================================
  // LEARNING FUNCTIONS - Lưu kết quả học tập
  // =====================================================
  
  const completeLesson = async (subjectId, lessonId, score, duration = 10) => {
    if (!currentChild || !account) {
      console.log('No child or account selected');
      return;
    }

    const xpEarned = Math.round(score * 0.8) + 20; // 20-100 XP based on score

    try {
      // 1. Lưu vào learning_logs
      await supabase.from('learning_logs').insert({
        account_id: account.id,
        child_id: currentChild.id,
        type: 'lesson',
        title: `Bài học ${subjectId} - ${lessonId}`,
        subject: subjectId,
        score: score,
        xp_earned: xpEarned,
        duration: duration,
        date: new Date().toISOString().split('T')[0],
      });

      // 2. Cập nhật XP và stats cho child
      const newXp = (currentChild.xp || 0) + xpEarned;
      const newTotalLessons = (currentChild.total_lessons || 0) + 1;
      const newLevel = calculateLevel(newXp);

      await supabase.from('children').update({
        xp: newXp,
        level: newLevel,
        total_lessons: newTotalLessons,
        total_time_minutes: (currentChild.total_time_minutes || 0) + duration,
        updated_at: new Date().toISOString(),
      }).eq('id', currentChild.id);

      // 3. Cập nhật progress.completed trong state local
      const currentProgress = currentChild.progress || {};
      const subjectProgress = currentProgress[subjectId] || { completed: [], scores: {} };
      
      // Thêm lessonId vào completed nếu chưa có
      if (!subjectProgress.completed.includes(lessonId)) {
        subjectProgress.completed.push(lessonId);
      }
      subjectProgress.scores[lessonId] = Math.max(subjectProgress.scores[lessonId] || 0, score);

      const newProgress = {
        ...currentProgress,
        [subjectId]: subjectProgress,
      };

      // 4. Cập nhật state local
      setCurrentChild(prev => ({
        ...prev,
        xp: newXp,
        level: newLevel,
        total_lessons: newTotalLessons,
        progress: newProgress,
      }));

      // Track analytics
      analytics.lessonCompleted(subjectId, lessonId, score, duration);
      if (newLevel > (currentChild.level || 1)) {
        analytics.levelUp(newLevel);
      }

      console.log('Lesson completed:', { lessonId, xpEarned, newXp, newLevel, completed: subjectProgress.completed });
      return { success: true, xpEarned, newXp, newLevel };
    } catch (err) {
      console.error('Complete lesson error:', err);
      return { error: err.message };
    }
  };

  const completeGame = async (gameId, score, duration = 5) => {
    if (!currentChild || !account) {
      console.log('No child or account selected');
      return;
    }

    const xpEarned = Math.round(score / 10) + 10; // 10-100 XP based on score

    try {
      // 1. Lưu vào learning_logs
      await supabase.from('learning_logs').insert({
        account_id: account.id,
        child_id: currentChild.id,
        type: 'game',
        title: `Trò chơi ${gameId}`,
        score: score,
        xp_earned: xpEarned,
        duration: duration,
        date: new Date().toISOString().split('T')[0],
      });

      // 2. Cập nhật XP và stats cho child
      const newXp = (currentChild.xp || 0) + xpEarned;
      const newTotalGames = (currentChild.total_games || 0) + 1;
      const newLevel = calculateLevel(newXp);

      // Cập nhật game high score
      const gameScores = currentChild.game_scores || {};
      if (!gameScores[gameId] || score > gameScores[gameId]) {
        gameScores[gameId] = score;
      }

      await supabase.from('children').update({
        xp: newXp,
        level: newLevel,
        total_games: newTotalGames,
        total_time_minutes: (currentChild.total_time_minutes || 0) + duration,
        game_scores: gameScores,
        updated_at: new Date().toISOString(),
      }).eq('id', currentChild.id);

      // 3. Cập nhật state local
      setCurrentChild(prev => ({
        ...prev,
        xp: newXp,
        level: newLevel,
        total_games: newTotalGames,
        game_scores: gameScores,
      }));

      // Track analytics
      analytics.gameCompleted(gameId, score, duration);
      if (newLevel > (currentChild.level || 1)) {
        analytics.levelUp(newLevel);
      }

      console.log('Game completed:', { xpEarned, newXp, newLevel });
      return { success: true, xpEarned, newXp, newLevel };
    } catch (err) {
      console.error('Complete game error:', err);
      return { error: err.message };
    }
  };

  const completeStory = async (storyId, duration = 10) => {
    if (!currentChild || !account) return;

    const xpEarned = 30;

    try {
      await supabase.from('learning_logs').insert({
        account_id: account.id,
        child_id: currentChild.id,
        type: 'story',
        title: `Truyện ${storyId}`,
        xp_earned: xpEarned,
        duration: duration,
        date: new Date().toISOString().split('T')[0],
      });

      const newXp = (currentChild.xp || 0) + xpEarned;
      const newLevel = calculateLevel(newXp);

      await supabase.from('children').update({
        xp: newXp,
        level: newLevel,
        total_time_minutes: (currentChild.total_time_minutes || 0) + duration,
        updated_at: new Date().toISOString(),
      }).eq('id', currentChild.id);

      setCurrentChild(prev => ({ ...prev, xp: newXp, level: newLevel }));

      // Track analytics
      analytics.storyCompleted(storyId, duration);
      if (newLevel > (currentChild.level || 1)) {
        analytics.levelUp(newLevel);
      }

      return { success: true, xpEarned };
    } catch (err) {
      console.error('Complete story error:', err);
      return { error: err.message };
    }
  };

  const completeVocabulary = async (topicId, wordsLearned, duration = 5) => {
    if (!currentChild || !account) return;

    const xpEarned = wordsLearned * 5;

    try {
      await supabase.from('learning_logs').insert({
        account_id: account.id,
        child_id: currentChild.id,
        type: 'vocabulary',
        title: `Từ vựng ${topicId}`,
        words_learned: wordsLearned,
        xp_earned: xpEarned,
        duration: duration,
        date: new Date().toISOString().split('T')[0],
      });

      const newXp = (currentChild.xp || 0) + xpEarned;
      const newLevel = calculateLevel(newXp);

      await supabase.from('children').update({
        xp: newXp,
        level: newLevel,
        total_time_minutes: (currentChild.total_time_minutes || 0) + duration,
        updated_at: new Date().toISOString(),
      }).eq('id', currentChild.id);

      setCurrentChild(prev => ({ ...prev, xp: newXp, level: newLevel }));
      return { success: true, xpEarned };
    } catch (err) {
      console.error('Complete vocabulary error:', err);
      return { error: err.message };
    }
  };

  // =====================================================
  // LEADERBOARD FUNCTIONS
  // =====================================================

  const fetchLeaderboard = async (period = 'all', limit = 100) => {
    try {
      let query = supabase
        .from('children')
        .select('id, name, avatar, xp, level')
        .order('xp', { ascending: false })
        .limit(limit);

      // Filter theo thời gian nếu cần (sử dụng learning_logs)
      if (period === 'week' || period === 'month') {
        const now = new Date();
        let startDate;
        if (period === 'week') {
          startDate = new Date(now.setDate(now.getDate() - 7));
        } else {
          startDate = new Date(now.setMonth(now.getMonth() - 1));
        }

        // Lấy XP từ learning_logs trong khoảng thời gian
        const { data: logs } = await supabase
          .from('learning_logs')
          .select('child_id, xp_earned')
          .gte('created_at', startDate.toISOString());

        if (logs) {
          // Tính tổng XP theo child_id
          const xpByChild = {};
          logs.forEach(log => {
            xpByChild[log.child_id] = (xpByChild[log.child_id] || 0) + (log.xp_earned || 0);
          });

          // Lấy thông tin children
          const childIds = Object.keys(xpByChild);
          if (childIds.length === 0) return [];

          const { data: children } = await supabase
            .from('children')
            .select('id, name, avatar, level')
            .in('id', childIds);

          if (children) {
            return children
              .map(child => ({
                ...child,
                xp: xpByChild[child.id] || 0,
              }))
              .sort((a, b) => b.xp - a.xp)
              .slice(0, limit);
          }
        }
        return [];
      }

      const { data } = await query;
      return data || [];
    } catch (err) {
      console.error('Fetch leaderboard error:', err);
      return [];
    }
  };

  // Lấy vị trí của child hiện tại trong leaderboard
  const getChildRank = async (childId) => {
    try {
      const { data, count } = await supabase
        .from('children')
        .select('id', { count: 'exact' })
        .gt('xp', currentChild?.xp || 0);

      return (data?.length || 0) + 1;
    } catch (err) {
      console.error('Get child rank error:', err);
      return null;
    }
  };

  // Tính level từ XP
  const calculateLevel = (xp) => {
    if (xp >= 5000) return 10;
    if (xp >= 4000) return 9;
    if (xp >= 3000) return 8;
    if (xp >= 2300) return 7;
    if (xp >= 1700) return 6;
    if (xp >= 1200) return 5;
    if (xp >= 800) return 4;
    if (xp >= 500) return 3;
    if (xp >= 250) return 2;
    return 1;
  };

  // Lấy thông tin level đầy đủ
  const getLevelInfo = (xp) => {
    const levelThresholds = [0, 250, 500, 800, 1200, 1700, 2300, 3000, 4000, 5000, 999999];
    const levelTitles = [
      'Người mới', 'Học viên', 'Học sinh chăm', 'Nhà thông thái nhí',
      'Siêu sao học tập', 'Thần đồng', 'Cao thủ', 'Bậc thầy',
      'Huyền thoại', 'Siêu huyền thoại', 'Tối thượng'
    ];
    
    const currentXp = xp || 0;
    const level = calculateLevel(currentXp);
    const currentThreshold = levelThresholds[level - 1];
    const nextThreshold = levelThresholds[level];
    const xpInLevel = currentXp - currentThreshold;
    const xpToNext = nextThreshold - currentThreshold;
    const progress = Math.min(100, Math.round((xpInLevel / xpToNext) * 100));
    
    return {
      level,
      title: levelTitles[level - 1] || 'Người mới',
      currentXp,
      xpInLevel,
      xpToNext: nextThreshold - currentXp,
      progress,
    };
  };

  // =====================================================
  // AUTH METHODS
  // =====================================================

  const signUp = async (email, password, parentName) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name: parentName, role: 'parent' } }
      });
      if (error) throw error;

      // Track sign up
      analytics.userSignUp('email');
      setSentryUser({ id: data.user?.id, email });

      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      // Track login
      analytics.userLogin('email');
      setSentryUser({ id: data.user?.id, email });

      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    resetState();
    localStorage.removeItem('gdtm_current_child');

    // Track logout
    analytics.userLogout();
    setSentryUser(null);
  };

  const updateAccount = async (updates) => {
    if (!account) return { error: 'Chưa đăng nhập' };
    try {
      const { data, error } = await supabase
        .from('accounts')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', account.id)
        .select()
        .single();
      if (error) throw error;
      setAccount(data);
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  };

  const verifyParentPin = (pin) => account?.parent_pin === pin;

  const changeParentPin = async (newPin) => updateAccount({ parent_pin: newPin });

  const upgradePlan = async (plan, paymentMethod = null) => {
    if (!account) return { error: 'Chưa đăng nhập' };
    try {
      const { data } = await supabase.rpc('upgrade_subscription', {
        p_account_id: account.id,
        p_plan: plan,
        p_payment_method: paymentMethod,
      });
      if (data?.success) {
        const { data: newSub } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('account_id', account.id)
          .single();
        setSubscription(newSub);
        return { success: true, data };
      }
      return { error: 'Không thể nâng cấp gói' };
    } catch (err) {
      return { error: err.message };
    }
  };

  const value = {
    user,
    account,
    devices,
    children: childrenList,
    currentChild,
    loading,
    deviceAllowed,
    deviceError,
    signUp,
    signIn,
    signOut,
    updateAccount,
    verifyParentPin,
    changeParentPin,
    addChild,
    updateChild,
    deleteChild,
    selectChild,
    loadChildren: () => loadChildren(account?.id),
    removeDevice,
    renameDevice,
    loadDevices: () => loadDevices(account?.id),
    upgradePlan,
    subscription,
    planInfo: PLANS[subscription?.plan || 'free'],
    levelInfo: getLevelInfo(currentChild?.xp),
    isAuthenticated: !!user,
    isLoaded: !loading,
    canAddChild: childrenList.length < (subscription?.max_children || 1),
    canAddDevice: devices.length < (subscription?.max_devices || 1),
    // Learning functions
    completeLesson,
    completeGame,
    completeStory,
    completeVocabulary,
    // Leaderboard functions
    fetchLeaderboard,
    getChildRank,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

export default AuthContext;
