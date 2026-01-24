// src/App.jsx
// Main App with Role-based Routing
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, ROLES } from './contexts/AuthContext';
import SplashScreen from './components/SplashScreen';

// Lazy load pages
const LoginPage = lazy(() => import('./pages/LoginPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const SchoolDashboard = lazy(() => import('./pages/SchoolDashboard'));
const DepartmentDashboard = lazy(() => import('./pages/DepartmentDashboard'));
const TeacherDashboard = lazy(() => import('./pages/TeacherDashboard'));
const ParentDashboard = lazy(() => import('./pages/ParentDashboard'));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));

// Protected Route Component
function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, loading, profile } = useAuth();

  if (loading) {
    return <SplashScreen message="Dang tai..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If allowedRoles specified, check role
  if (allowedRoles && allowedRoles.length > 0) {
    if (!profile?.role || !allowedRoles.includes(profile.role)) {
      // Redirect to appropriate dashboard
      const redirects = {
        super_admin: '/admin',
        school_admin: '/school',
        department_head: '/department',
        teacher: '/teacher',
        parent: '/parent',
        student: '/learn',
      };
      return <Navigate to={redirects[profile?.role] || '/login'} replace />;
    }
  }

  return children;
}

// Role-based Redirect Component
function RoleBasedRedirect() {
  const { isAuthenticated, loading, profile, getRedirectPath } = useAuth();

  if (loading) {
    return <SplashScreen message="Dang chuyen huong..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const redirectPath = getRedirectPath();
  return <Navigate to={redirectPath} replace />;
}

function App() {
  return (
    <Suspense fallback={<SplashScreen />}>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Role-based redirect */}
        <Route path="/" element={<RoleBasedRedirect />} />
        <Route path="/redirect" element={<RoleBasedRedirect />} />

        {/* Super Admin routes */}
        <Route path="/admin/*" element={
          <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        {/* School Admin routes */}
        <Route path="/school/*" element={
          <ProtectedRoute allowedRoles={[ROLES.SCHOOL_ADMIN]}>
            <SchoolDashboard />
          </ProtectedRoute>
        } />

        {/* Department Head routes */}
        <Route path="/department/*" element={
          <ProtectedRoute allowedRoles={[ROLES.DEPARTMENT_HEAD]}>
            <DepartmentDashboard />
          </ProtectedRoute>
        } />

        {/* Teacher routes */}
        <Route path="/teacher/*" element={
          <ProtectedRoute allowedRoles={[ROLES.TEACHER]}>
            <TeacherDashboard />
          </ProtectedRoute>
        } />

        {/* Parent routes */}
        <Route path="/parent/*" element={
          <ProtectedRoute allowedRoles={[ROLES.PARENT]}>
            <ParentDashboard />
          </ProtectedRoute>
        } />

        {/* Student routes */}
        <Route path="/learn/*" element={
          <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
            <StudentDashboard />
          </ProtectedRoute>
        } />

        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
