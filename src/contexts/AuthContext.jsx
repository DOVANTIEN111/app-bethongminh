import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, getDeviceInfo, getOrCreateDeviceId } from '../lib/supabase';

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
    try {
      const { data } = await supabase.rpc('add_child', {
        p_account_id: account.id,
        p_name: name,
        p_avatar: avatar,
        p_age: age,
        p_gender: gender,
      });
      if (data?.success) {
        await loadChildren(account.id);
        return { success: true, childId: data.child_id };
      }
      return { error: data?.message || 'Không thể thêm bé' };
    } catch (err) {
      return { error: err.message };
    }
  };

  const updateChild = async (childId, updates) => {
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
  }, []);

  const signUp = async (email, password, parentName) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name: parentName, role: 'parent' } }
      });
      if (error) throw error;
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
    isAuthenticated: !!user,
    isLoaded: !loading,
    canAddChild: childrenList.length < (subscription?.max_children || 1),
    canAddDevice: devices.length < (subscription?.max_devices || 1),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

export default AuthContext;
