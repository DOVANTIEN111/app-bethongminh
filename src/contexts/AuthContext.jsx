// src/contexts/AuthContext.jsx
// Authentication Context - Simple version using profiles table
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

// Role definitions
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  SCHOOL_ADMIN: 'school_admin',
  DEPARTMENT_HEAD: 'department_head',
  TEACHER: 'teacher',
  PARENT: 'parent',
  STUDENT: 'student',
};

// Role-based redirect paths
export const ROLE_REDIRECTS = {
  super_admin: '/admin',
  school_admin: '/school',
  department_head: '/department',
  teacher: '/teacher',
  parent: '/parent',
  student: '/learn',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    console.log('[Auth] Initializing...');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('[Auth] Session:', session?.user?.email || 'none');

      if (session?.user) {
        setUser(session.user);
        await loadProfile(session.user.id);
      }
    } catch (err) {
      console.error('[Auth] Init error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[Auth] State changed:', event);

        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          await loadProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  };

  const loadProfile = async (userId) => {
    console.log('[Auth] Loading profile for:', userId);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data) {
        console.log('[Auth] Profile loaded:', data.email, data.role);
        setProfile(data);
        return data;
      }

      // If no profile exists, create one
      if (error?.code === 'PGRST116') {
        console.log('[Auth] No profile found, creating...');
        const { data: session } = await supabase.auth.getSession();
        const authUser = session?.session?.user;

        const newProfile = {
          id: userId,
          email: authUser?.email || '',
          full_name: authUser?.user_metadata?.full_name || authUser?.email?.split('@')[0] || 'User',
          role: authUser?.user_metadata?.role || 'student',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const { data: created, error: createError } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single();

        if (created) {
          console.log('[Auth] Profile created:', created.email);
          setProfile(created);
          return created;
        }

        if (createError) {
          console.error('[Auth] Create profile error:', createError);
        }
      }

      if (error) {
        console.error('[Auth] Load profile error:', error);
      }
      return null;
    } catch (err) {
      console.error('[Auth] Profile exception:', err);
      return null;
    }
  };

  // Sign in with email and password
  const signIn = async (email, password) => {
    console.log('[Auth] Signing in:', email);
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('[Auth] Sign in error:', error);
        setError(error.message);
        return { data: null, error: error.message };
      }

      console.log('[Auth] Sign in success:', data.user?.id);
      return { data, error: null };
    } catch (err) {
      console.error('[Auth] Sign in exception:', err);
      setError(err.message);
      return { data: null, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Sign up
  const signUp = async (email, password, fullName, role = 'student') => {
    console.log('[Auth] Signing up:', email, role);
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, role },
        },
      });

      if (error) {
        console.error('[Auth] Sign up error:', error);
        setError(error.message);
        return { data: null, error: error.message };
      }

      console.log('[Auth] Sign up success:', data.user?.id);
      return { data, error: null };
    } catch (err) {
      console.error('[Auth] Sign up exception:', err);
      setError(err.message);
      return { data: null, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    console.log('[Auth] Signing out...');
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  // Update profile
  const updateProfile = async (updates) => {
    if (!profile?.id) return { error: 'No profile' };

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', profile.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  };

  // Role checks
  const hasRole = useCallback((role) => profile?.role === role, [profile]);
  const hasAnyRole = useCallback((roles) => roles.includes(profile?.role), [profile]);

  const isSuperAdmin = useCallback(() => hasRole(ROLES.SUPER_ADMIN), [hasRole]);
  const isSchoolAdmin = useCallback(() => hasRole(ROLES.SCHOOL_ADMIN), [hasRole]);
  const isDepartmentHead = useCallback(() => hasRole(ROLES.DEPARTMENT_HEAD), [hasRole]);
  const isTeacher = useCallback(() => hasRole(ROLES.TEACHER), [hasRole]);
  const isParent = useCallback(() => hasRole(ROLES.PARENT), [hasRole]);
  const isStudent = useCallback(() => hasRole(ROLES.STUDENT), [hasRole]);

  // Get redirect path based on role
  const getRedirectPath = useCallback(() => {
    return ROLE_REDIRECTS[profile?.role] || '/learn';
  }, [profile]);

  const value = {
    // State
    user,
    profile,
    loading,
    error,
    isAuthenticated: !!user,

    // Auth methods
    signIn,
    signUp,
    signOut,
    updateProfile,
    loadProfile,

    // Role info
    role: profile?.role,
    hasRole,
    hasAnyRole,
    isSuperAdmin,
    isSchoolAdmin,
    isDepartmentHead,
    isTeacher,
    isParent,
    isStudent,
    getRedirectPath,

    // Constants
    ROLES,
    ROLE_REDIRECTS,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export default AuthContext;
