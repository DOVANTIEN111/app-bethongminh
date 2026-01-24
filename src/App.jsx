// src/App.jsx
// Main App with Role-based Routing
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, ROLES } from './contexts/AuthContext';
import SplashScreen from './components/SplashScreen';

// Lazy load pages
const LoginPage = lazy(() => import('./pages/LoginPage'));
const DepartmentDashboard = lazy(() => import('./pages/DepartmentDashboard'));
const ParentDashboard = lazy(() => import('./pages/ParentDashboard'));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));

// Super Admin pages
const AdminLayout = lazy(() => import('./components/AdminLayout'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const SchoolsPage = lazy(() => import('./pages/admin/SchoolsPage'));
const UsersPage = lazy(() => import('./pages/admin/UsersPage'));
const PlansPage = lazy(() => import('./pages/admin/PlansPage'));
const StatisticsPage = lazy(() => import('./pages/admin/StatisticsPage'));
const AdminSettingsPage = lazy(() => import('./pages/admin/AdminSettingsPage'));

// School Admin pages
const SchoolLayout = lazy(() => import('./components/SchoolLayout'));
const SchoolDashboardPage = lazy(() => import('./pages/school/SchoolDashboardPage'));
const DepartmentsPage = lazy(() => import('./pages/school/DepartmentsPage'));
const TeachersPage = lazy(() => import('./pages/school/TeachersPage'));
const StudentsPage = lazy(() => import('./pages/school/StudentsPage'));
const ClassesPage = lazy(() => import('./pages/school/ClassesPage'));
const SchoolSettingsPage = lazy(() => import('./pages/school/SchoolSettingsPage'));

// Teacher pages
const TeacherLayout = lazy(() => import('./components/TeacherLayout'));
const TeacherDashboardPage = lazy(() => import('./pages/teacher/TeacherDashboardPage'));
const TeacherClassesPage = lazy(() => import('./pages/teacher/TeacherClassesPage'));
const TeacherLessonsPage = lazy(() => import('./pages/teacher/TeacherLessonsPage'));
const AssignmentsPage = lazy(() => import('./pages/teacher/AssignmentsPage'));
const TeacherStudentsPage = lazy(() => import('./pages/teacher/TeacherStudentsPage'));
const MessagesPage = lazy(() => import('./pages/teacher/MessagesPage'));
const TeacherSettingsPage = lazy(() => import('./pages/teacher/TeacherSettingsPage'));

// Student Learn pages
const LearnLayout = lazy(() => import('./components/LearnLayout'));
const LearnHomePage = lazy(() => import('./pages/learn/LearnHomePage'));
const LearnLessonsPage = lazy(() => import('./pages/learn/LearnLessonsPage'));
const LearnAssignmentsPage = lazy(() => import('./pages/learn/LearnAssignmentsPage'));
const LearnAchievementsPage = lazy(() => import('./pages/learn/LearnAchievementsPage'));
const LearnProfilePage = lazy(() => import('./pages/learn/LearnProfilePage'));

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

        {/* Super Admin routes - Nested routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboardPage />} />
          <Route path="schools" element={<SchoolsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="plans" element={<PlansPage />} />
          <Route path="statistics" element={<StatisticsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>

        {/* School Admin routes - Nested routes */}
        <Route path="/school" element={
          <ProtectedRoute allowedRoles={[ROLES.SCHOOL_ADMIN]}>
            <SchoolLayout />
          </ProtectedRoute>
        }>
          <Route index element={<SchoolDashboardPage />} />
          <Route path="departments" element={<DepartmentsPage />} />
          <Route path="teachers" element={<TeachersPage />} />
          <Route path="students" element={<StudentsPage />} />
          <Route path="classes" element={<ClassesPage />} />
          <Route path="settings" element={<SchoolSettingsPage />} />
        </Route>

        {/* Department Head routes */}
        <Route path="/department/*" element={
          <ProtectedRoute allowedRoles={[ROLES.DEPARTMENT_HEAD]}>
            <DepartmentDashboard />
          </ProtectedRoute>
        } />

        {/* Teacher routes - Nested routes */}
        <Route path="/teacher" element={
          <ProtectedRoute allowedRoles={[ROLES.TEACHER]}>
            <TeacherLayout />
          </ProtectedRoute>
        }>
          <Route index element={<TeacherDashboardPage />} />
          <Route path="classes" element={<TeacherClassesPage />} />
          <Route path="lessons" element={<TeacherLessonsPage />} />
          <Route path="assignments" element={<AssignmentsPage />} />
          <Route path="students" element={<TeacherStudentsPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="settings" element={<TeacherSettingsPage />} />
        </Route>

        {/* Parent routes */}
        <Route path="/parent/*" element={
          <ProtectedRoute allowedRoles={[ROLES.PARENT]}>
            <ParentDashboard />
          </ProtectedRoute>
        } />

        {/* Student Learn routes - Nested routes */}
        <Route path="/learn" element={
          <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
            <LearnLayout />
          </ProtectedRoute>
        }>
          <Route index element={<LearnHomePage />} />
          <Route path="lessons" element={<LearnLessonsPage />} />
          <Route path="assignments" element={<LearnAssignmentsPage />} />
          <Route path="achievements" element={<LearnAchievementsPage />} />
          <Route path="profile" element={<LearnProfilePage />} />
        </Route>

        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
