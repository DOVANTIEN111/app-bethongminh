// src/contexts/RBACContext.jsx
// Role-Based Access Control Context
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const RBACContext = createContext(null);

// Vai trò trong hệ thống
export const ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  PARENT: 'parent',
  STUDENT: 'student',
};

// Quyền theo vai trò
export const PERMISSIONS = {
  admin: ['manage_users', 'view_stats', 'manage_classes', 'manage_all'],
  teacher: ['manage_own_classes', 'create_assignments', 'view_student_progress', 'grade_submissions'],
  parent: ['view_children', 'set_time_limits', 'view_progress'],
  student: ['view_lessons', 'submit_assignments', 'view_own_progress'],
};

export function RBACProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // =====================================================
  // AUTHENTICATION
  // =====================================================

  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    console.log('[RBAC] Initializing auth...');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('[RBAC] Current session:', session?.user?.email || 'none');
      if (session?.user) {
        setUser(session.user);
        await loadUserProfile(session.user.id);
      }
    } catch (err) {
      console.error('[RBAC] Init auth error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[RBAC] Auth state changed:', event, session?.user?.email);
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          await loadUserProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          console.log('[RBAC] User signed out');
          setUser(null);
          setUserProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  };

  const loadUserProfile = async (userId) => {
    console.log('[RBAC] Loading user profile for:', userId);
    try {
      // Bước 1: Thử lấy profile hiện có
      const { data, error } = await supabase
        .from('rbac_users')
        .select('*')
        .eq('id', userId)
        .single();

      if (data) {
        console.log('[RBAC] Profile found:', data);
        setUserProfile(data);
        return data;
      }

      // Bước 2: Nếu không có, thử gọi RPC để tạo
      if (error && error.code === 'PGRST116') {
        console.log('[RBAC] Profile not found, creating new one...');
        const { data: newProfile, error: rpcError } = await supabase
          .rpc('ensure_user_profile', { p_user_id: userId });

        if (newProfile) {
          console.log('[RBAC] Profile created via RPC:', newProfile);
          setUserProfile(newProfile);
          return newProfile;
        }

        // Bước 3: Fallback - tạo trực tiếp nếu RPC không có
        if (rpcError) {
          console.log('[RBAC] RPC failed, creating directly...');
          const { data: session } = await supabase.auth.getSession();
          const authUser = session?.session?.user;

          if (authUser) {
            const newProfileData = {
              id: userId,
              email: authUser.email,
              name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
              role: authUser.user_metadata?.role || 'student',
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };

            const { data: insertedProfile, error: insertError } = await supabase
              .from('rbac_users')
              .upsert(newProfileData)
              .select()
              .single();

            if (insertedProfile) {
              console.log('[RBAC] Profile created directly:', insertedProfile);
              setUserProfile(insertedProfile);
              return insertedProfile;
            }
            console.error('[RBAC] Insert error:', insertError);
          }
        }
      }

      if (error) {
        console.error('[RBAC] Load profile error:', error);
      }
      return null;
    } catch (err) {
      console.error('[RBAC] Load user profile exception:', err);
      return null;
    }
  };

  // =====================================================
  // SIGN UP / SIGN IN
  // =====================================================

  const signUp = async (email, password, name, role = 'student') => {
    console.log('[RBAC] SignUp attempt:', { email, name, role });
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, role }
        }
      });
      if (error) {
        console.error('[RBAC] SignUp error:', error);
        throw error;
      }
      console.log('[RBAC] SignUp success:', data.user?.id);
      return { data, error: null };
    } catch (err) {
      console.error('[RBAC] SignUp exception:', err.message);
      setError(err.message);
      return { data: null, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    console.log('[RBAC] SignIn attempt:', email);
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) {
        console.error('[RBAC] SignIn error:', error);
        throw error;
      }
      console.log('[RBAC] SignIn success:', data.user?.id);
      return { data, error: null };
    } catch (err) {
      console.error('[RBAC] SignIn exception:', err.message);
      setError(err.message);
      return { data: null, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserProfile(null);
  };

  // =====================================================
  // ROLE & PERMISSION CHECKS
  // =====================================================

  const hasRole = useCallback((role) => {
    return userProfile?.role === role;
  }, [userProfile]);

  const hasAnyRole = useCallback((roles) => {
    return roles.includes(userProfile?.role);
  }, [userProfile]);

  const hasPermission = useCallback((permission) => {
    if (!userProfile?.role) return false;
    return PERMISSIONS[userProfile.role]?.includes(permission) ||
           PERMISSIONS[userProfile.role]?.includes('manage_all');
  }, [userProfile]);

  const isAdmin = useCallback(() => hasRole(ROLES.ADMIN), [hasRole]);
  const isTeacher = useCallback(() => hasRole(ROLES.TEACHER), [hasRole]);
  const isParent = useCallback(() => hasRole(ROLES.PARENT), [hasRole]);
  const isStudent = useCallback(() => hasRole(ROLES.STUDENT), [hasRole]);

  // =====================================================
  // ADMIN FUNCTIONS
  // =====================================================

  const getAdminStats = async () => {
    if (!isAdmin()) return null;
    try {
      const { data, error } = await supabase.rpc('get_admin_stats');
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Get admin stats error:', err);
      return null;
    }
  };

  const getAllUsers = async (filters = {}) => {
    if (!isAdmin()) return [];
    try {
      let query = supabase.from('rbac_users').select('*');

      if (filters.role) {
        query = query.eq('role', filters.role);
      }
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Get all users error:', err);
      return [];
    }
  };

  const updateUserRole = async (userId, newRole) => {
    if (!isAdmin()) return { error: 'Không có quyền' };
    try {
      const { data, error } = await supabase
        .from('rbac_users')
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .single();
      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  };

  const deleteUser = async (userId) => {
    if (!isAdmin()) return { error: 'Không có quyền' };
    try {
      // Soft delete - đánh dấu is_active = false
      const { error } = await supabase
        .from('rbac_users')
        .update({ is_active: false })
        .eq('id', userId);
      if (error) throw error;
      return { success: true };
    } catch (err) {
      return { error: err.message };
    }
  };

  // =====================================================
  // TEACHER FUNCTIONS
  // =====================================================

  const getTeacherStats = async () => {
    if (!isTeacher() && !isAdmin()) return null;
    try {
      const { data, error } = await supabase.rpc('get_teacher_stats', {
        p_teacher_id: user.id
      });
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Get teacher stats error:', err);
      return null;
    }
  };

  const getMyClasses = async () => {
    if (!isTeacher() && !isAdmin()) return [];
    try {
      const { data, error } = await supabase
        .from('classes')
        .select(`
          *,
          class_students(count),
          assignments(count)
        `)
        .eq('teacher_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Get my classes error:', err);
      return [];
    }
  };

  const createClass = async (name, description, gradeLevel) => {
    if (!isTeacher() && !isAdmin()) return { error: 'Không có quyền' };
    try {
      const { data, error } = await supabase
        .from('classes')
        .insert({
          name,
          description,
          teacher_id: user.id,
          grade_level: gradeLevel,
          school_year: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`
        })
        .select()
        .single();
      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  };

  const addStudentToClass = async (classId, studentId) => {
    if (!isTeacher() && !isAdmin()) return { error: 'Không có quyền' };
    try {
      const { data, error } = await supabase
        .from('class_students')
        .insert({ class_id: classId, student_id: studentId })
        .select()
        .single();
      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  };

  const removeStudentFromClass = async (classId, studentId) => {
    if (!isTeacher() && !isAdmin()) return { error: 'Không có quyền' };
    try {
      const { error } = await supabase
        .from('class_students')
        .delete()
        .eq('class_id', classId)
        .eq('student_id', studentId);
      if (error) throw error;
      return { success: true };
    } catch (err) {
      return { error: err.message };
    }
  };

  const getClassStudents = async (classId) => {
    try {
      const { data, error } = await supabase
        .from('class_students')
        .select(`
          *,
          student:rbac_users!student_id(id, name, email, avatar)
        `)
        .eq('class_id', classId);
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Get class students error:', err);
      return [];
    }
  };

  const createAssignment = async (classId, title, description, subject, lessonIds, deadline) => {
    if (!isTeacher() && !isAdmin()) return { error: 'Không có quyền' };
    try {
      const { data, error } = await supabase
        .from('assignments')
        .insert({
          class_id: classId,
          teacher_id: user.id,
          title,
          description,
          subject,
          lesson_ids: lessonIds,
          deadline
        })
        .select()
        .single();
      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  };

  const getClassAssignments = async (classId) => {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .select('*')
        .eq('class_id', classId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Get class assignments error:', err);
      return [];
    }
  };

  const getStudentProgressInClass = async (classId) => {
    if (!isTeacher() && !isAdmin()) return [];
    try {
      const { data, error } = await supabase
        .from('class_students')
        .select(`
          student:rbac_users!student_id(id, name, avatar),
          student_progress:student_progress!student_id(*)
        `)
        .eq('class_id', classId);
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Get student progress error:', err);
      return [];
    }
  };

  // =====================================================
  // PARENT FUNCTIONS
  // =====================================================

  const getMyChildren = async () => {
    if (!isParent()) return [];
    try {
      const { data, error } = await supabase
        .from('parent_student')
        .select(`
          *,
          student:rbac_users!student_id(id, name, email, avatar)
        `)
        .eq('parent_id', user.id);
      if (error) throw error;
      return data?.map(d => d.student) || [];
    } catch (err) {
      console.error('Get my children error:', err);
      return [];
    }
  };

  const linkChild = async (childEmail) => {
    if (!isParent()) return { error: 'Không có quyền' };
    try {
      // Tìm student theo email
      const { data: student, error: findError } = await supabase
        .from('rbac_users')
        .select('id')
        .eq('email', childEmail)
        .eq('role', 'student')
        .single();

      if (findError || !student) {
        return { error: 'Không tìm thấy học sinh với email này' };
      }

      const { data, error } = await supabase
        .from('parent_student')
        .insert({
          parent_id: user.id,
          student_id: student.id
        })
        .select()
        .single();
      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  };

  const getChildProgress = async (childId) => {
    if (!isParent() && !isAdmin()) return null;
    try {
      const { data, error } = await supabase.rpc('get_student_progress_for_parent', {
        p_student_id: childId
      });
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Get child progress error:', err);
      return null;
    }
  };

  const setTimeLimit = async (childId, dailyLimitMinutes, startHour, endHour) => {
    if (!isParent()) return { error: 'Không có quyền' };
    try {
      const { data, error } = await supabase
        .from('time_limits')
        .upsert({
          parent_id: user.id,
          student_id: childId,
          daily_limit_minutes: dailyLimitMinutes,
          start_hour: startHour,
          end_hour: endHour
        })
        .select()
        .single();
      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  };

  // =====================================================
  // STUDENT FUNCTIONS
  // =====================================================

  const getMyAssignments = async () => {
    if (!isStudent()) return [];
    try {
      const { data, error } = await supabase
        .from('class_students')
        .select(`
          class:classes!class_id(
            id, name,
            assignments(*)
          )
        `)
        .eq('student_id', user.id);
      if (error) throw error;

      // Flatten assignments from all classes
      const assignments = data?.flatMap(d => d.class?.assignments || []) || [];
      return assignments;
    } catch (err) {
      console.error('Get my assignments error:', err);
      return [];
    }
  };

  const getMyProgress = async () => {
    if (!isStudent()) return [];
    try {
      const { data, error } = await supabase
        .from('student_progress')
        .select('*')
        .eq('student_id', user.id)
        .order('completed_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Get my progress error:', err);
      return [];
    }
  };

  const saveProgress = async (subject, lessonId, score, timeSpent, assignmentId = null) => {
    if (!isStudent()) return { error: 'Không có quyền' };
    try {
      const { data, error } = await supabase
        .from('student_progress')
        .upsert({
          student_id: user.id,
          subject,
          lesson_id: lessonId,
          score,
          time_spent: timeSpent,
          assignment_id: assignmentId,
          completed_at: new Date().toISOString()
        })
        .select()
        .single();
      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  };

  const submitAssignment = async (assignmentId, score) => {
    if (!isStudent()) return { error: 'Không có quyền' };
    try {
      const { data, error } = await supabase
        .from('assignment_submissions')
        .upsert({
          assignment_id: assignmentId,
          student_id: user.id,
          score,
          status: 'completed',
          submitted_at: new Date().toISOString()
        })
        .select()
        .single();
      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  };

  const getTimeLimit = async () => {
    if (!isStudent()) return null;
    try {
      const { data, error } = await supabase
        .from('time_limits')
        .select('*')
        .eq('student_id', user.id)
        .eq('is_active', true)
        .single();
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
      return data;
    } catch (err) {
      console.error('Get time limit error:', err);
      return null;
    }
  };

  // =====================================================
  // CONTEXT VALUE
  // =====================================================

  const value = {
    // Auth state
    user,
    userProfile,
    loading,
    error,
    isAuthenticated: !!user,

    // Auth methods
    signUp,
    signIn,
    signOut,

    // Role checks
    role: userProfile?.role,
    hasRole,
    hasAnyRole,
    hasPermission,
    isAdmin,
    isTeacher,
    isParent,
    isStudent,

    // Admin methods
    getAdminStats,
    getAllUsers,
    updateUserRole,
    deleteUser,

    // Teacher methods
    getTeacherStats,
    getMyClasses,
    createClass,
    addStudentToClass,
    removeStudentFromClass,
    getClassStudents,
    createAssignment,
    getClassAssignments,
    getStudentProgressInClass,

    // Parent methods
    getMyChildren,
    linkChild,
    getChildProgress,
    setTimeLimit,

    // Student methods
    getMyAssignments,
    getMyProgress,
    saveProgress,
    submitAssignment,
    getTimeLimit,
  };

  return (
    <RBACContext.Provider value={value}>
      {children}
    </RBACContext.Provider>
  );
}

export function useRBAC() {
  const context = useContext(RBACContext);
  if (!context) {
    throw new Error('useRBAC must be used within RBACProvider');
  }
  return context;
}

export default RBACContext;
