// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [parentProfile, setParentProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Kiểm tra session hiện tại
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchParentProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Lắng nghe thay đổi auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchParentProfile(session.user.id);
      } else {
        setParentProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Lấy thông tin profile phụ huynh
  const fetchParentProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .eq('role', 'parent')
        .single();

      if (data) {
        setParentProfile(data);
      }
    } catch (err) {
      console.log('No parent profile found');
    } finally {
      setLoading(false);
    }
  };

  // Đăng nhập phụ huynh
  const signIn = async (email, password) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    return { data, error };
  };

  // Đăng ký phụ huynh
  const signUp = async (email, password, name) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, role: 'parent' } }
    });

    if (data?.user && !error) {
      // Tạo profile phụ huynh
      await supabase.from('profiles').insert({
        user_id: data.user.id,
        role: 'parent',
        name: name,
        email: email,
        avatar: '👨‍👩‍👧',
        settings: {
          dailyWords: 10,
          dailyLessons: 3,
          dailyMinutes: 30,
          notifyOnComplete: true,
          notifyOnAchievement: true
        }
      });
    }

    setLoading(false);
    return { data, error };
  };

  // Đăng xuất
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setParentProfile(null);
  };

  // Cập nhật profile
  const updateParentProfile = async (updates) => {
    if (!parentProfile?.id) return { error: 'No profile' };
    
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', parentProfile.id)
      .select()
      .single();

    if (data) setParentProfile(data);
    return { data, error };
  };

  const value = {
    user,
    parentProfile,
    loading,
    isAuthenticated: !!user,
    isParent: parentProfile?.role === 'parent',
    signIn,
    signUp,
    signOut,
    updateParentProfile,
    fetchParentProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

export default AuthContext;
