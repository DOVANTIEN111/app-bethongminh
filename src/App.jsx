// src/App.jsx
// Main App with Role-based Routing
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth, ROLES } from './contexts/AuthContext';
import { AudioProvider } from './contexts/AudioContext';
import SplashScreen from './components/SplashScreen';

// Lazy load pages
const LandingPage = lazy(() => import('./pages/LandingPageNew'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const RegisterSchoolPage = lazy(() => import('./pages/RegisterSchoolPage'));
const RegisterTeacherPage = lazy(() => import('./pages/RegisterTeacherPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const DepartmentDashboard = lazy(() => import('./pages/DepartmentDashboard'));
const ParentDashboard = lazy(() => import('./pages/ParentDashboard'));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));

// Super Admin pages
const AdminLayout = lazy(() => import('./components/AdminLayout'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const SchoolsPage = lazy(() => import('./pages/admin/SchoolsPage'));
const SchoolDetailPage = lazy(() => import('./pages/admin/SchoolDetailPage'));
const UsersPage = lazy(() => import('./pages/admin/UsersPage'));
const PlansPage = lazy(() => import('./pages/admin/PlansPage'));
const StatisticsPage = lazy(() => import('./pages/admin/StatisticsPage'));
const AdminSettingsPage = lazy(() => import('./pages/admin/AdminSettingsPage'));

// Admin Content Management pages
const ContentSubjectsPage = lazy(() => import('./pages/admin/ContentSubjectsPage'));
const ContentLessonsPage = lazy(() => import('./pages/admin/ContentLessonsPage'));
const ContentVocabularyPage = lazy(() => import('./pages/admin/ContentVocabularyPage'));
const ContentQuestionsPage = lazy(() => import('./pages/admin/ContentQuestionsPage'));
const ContentMediaPage = lazy(() => import('./pages/admin/ContentMediaPage'));

// Admin Finance & Notifications pages
const FinancePage = lazy(() => import('./pages/admin/FinancePage'));
const TransactionsPage = lazy(() => import('./pages/admin/TransactionsPage'));
const PromotionsPage = lazy(() => import('./pages/admin/PromotionsPage'));
const NotificationsPage = lazy(() => import('./pages/admin/NotificationsPage'));
const AnalyticsPage = lazy(() => import('./pages/admin/AnalyticsPage'));
const ReportsPage = lazy(() => import('./pages/admin/ReportsPage'));

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

// Parent Mode pages (within student account)
const ParentModeLayout = lazy(() => import('./components/ParentModeLayout'));
const ParentModeDashboard = lazy(() => import('./pages/learn/parent/ParentDashboard'));
const ParentModeProgress = lazy(() => import('./pages/learn/parent/ParentProgress'));
const ParentModeMessages = lazy(() => import('./pages/learn/parent/ParentMessages'));
const ParentModeSettings = lazy(() => import('./pages/learn/parent/ParentSettings'));

// English Lesson page
const EnglishLessonPage = lazy(() => import('./pages/EnglishLessonPage'));

// Math Lesson page
const MathLessonPage = lazy(() => import('./pages/MathLessonPage'));

// Vietnamese Lesson page
const VietnameseLessonPage = lazy(() => import('./pages/VietnameseLessonPage'));

// Science Lesson page
const ScienceLessonPage = lazy(() => import('./pages/ScienceLessonPage'));

// Parent pages
const ParentLayout = lazy(() => import('./components/ParentLayout'));
const ParentHomePage = lazy(() => import('./pages/parent/ParentHomePage'));
const ParentChildrenPage = lazy(() => import('./pages/parent/ParentChildrenPage'));
const ParentMessagesPage = lazy(() => import('./pages/parent/ParentMessagesPage'));
const ParentReportsPage = lazy(() => import('./pages/parent/ParentReportsPage'));
const ParentSettingsPage = lazy(() => import('./pages/parent/ParentSettingsPage'));

// Protected Route Component - with returnUrl support
function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, loading, profile } = useAuth();
  const location = useLocation();

  if (loading) {
    return <SplashScreen message="Dang tai..." />;
  }

  if (!isAuthenticated) {
    // Save current URL as returnUrl so user can be redirected back after login
    const returnUrl = location.pathname + location.search;
    return <Navigate to={`/login?returnUrl=${encodeURIComponent(returnUrl)}`} replace />;
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
  const location = useLocation();

  if (loading) {
    return <SplashScreen message="Dang chuyen huong..." />;
  }

  if (!isAuthenticated) {
    // For root path, just go to login
    if (location.pathname === '/') {
      return <Navigate to="/login" replace />;
    }
    // For other paths, save as returnUrl
    const returnUrl = location.pathname + location.search;
    return <Navigate to={`/login?returnUrl=${encodeURIComponent(returnUrl)}`} replace />;
  }

  const redirectPath = getRedirectPath();
  return <Navigate to={redirectPath} replace />;
}

function App() {
  return (
    <AudioProvider>
      <Suspense fallback={<SplashScreen />}>
        <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register/school" element={<RegisterSchoolPage />} />
        <Route path="/register/teacher" element={<RegisterTeacherPage />} />
        <Route path="/pricing" element={<PricingPage />} />

        {/* Role-based redirect for authenticated users */}
        <Route path="/dashboard" element={<RoleBasedRedirect />} />
        <Route path="/redirect" element={<RoleBasedRedirect />} />

        {/* Super Admin routes - Nested routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboardPage />} />
          <Route path="schools" element={<SchoolsPage />} />
          <Route path="schools/:id" element={<SchoolDetailPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="plans" element={<PlansPage />} />
          <Route path="statistics" element={<StatisticsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
          {/* Content Management Routes */}
          <Route path="subjects" element={<ContentSubjectsPage />} />
          <Route path="lessons" element={<ContentLessonsPage />} />
          <Route path="vocabulary" element={<ContentVocabularyPage />} />
          <Route path="questions" element={<ContentQuestionsPage />} />
          <Route path="media" element={<ContentMediaPage />} />
          {/* Finance & Notifications Routes */}
          <Route path="finance" element={<FinancePage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="promotions" element={<PromotionsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="reports" element={<ReportsPage />} />
        </Route>

        {/* School Admin routes - Nested routes */}
        <Route path="/school" element={
          <ProtectedRoute allowedRoles={[ROLES.SCHOOL_ADMIN]}>
            <SchoolLayout />
          </ProtectedRoute>
        }>
          <Route index element={<SchoolDashboardPage />} />
          <Route path="departments" element={<DepartmentsPage />} />
          <Route path="departments/:id" element={<DepartmentsPage />} />
          <Route path="teachers" element={<TeachersPage />} />
          <Route path="teachers/:id" element={<TeachersPage />} />
          <Route path="students" element={<StudentsPage />} />
          <Route path="students/:id" element={<StudentsPage />} />
          <Route path="classes" element={<ClassesPage />} />
          <Route path="classes/:id" element={<ClassesPage />} />
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
          <Route path="classes/:id" element={<TeacherClassesPage />} />
          <Route path="lessons" element={<TeacherLessonsPage />} />
          <Route path="lessons/create" element={<TeacherLessonsPage />} />
          <Route path="lessons/:id" element={<TeacherLessonsPage />} />
          <Route path="assignments" element={<AssignmentsPage />} />
          <Route path="assignments/:id" element={<AssignmentsPage />} />
          <Route path="students" element={<TeacherStudentsPage />} />
          <Route path="students/:id" element={<TeacherStudentsPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="messages/:id" element={<MessagesPage />} />
          <Route path="settings" element={<TeacherSettingsPage />} />
        </Route>

        {/* Parent routes - Nested routes */}
        <Route path="/parent" element={
          <ProtectedRoute allowedRoles={[ROLES.PARENT]}>
            <ParentLayout />
          </ProtectedRoute>
        }>
          <Route index element={<ParentHomePage />} />
          <Route path="children" element={<ParentChildrenPage />} />
          <Route path="messages" element={<ParentMessagesPage />} />
          <Route path="reports" element={<ParentReportsPage />} />
          <Route path="settings" element={<ParentSettingsPage />} />
        </Route>

        {/* Student Learn routes - Nested routes */}
        <Route path="/learn" element={
          <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
            <LearnLayout />
          </ProtectedRoute>
        }>
          <Route index element={<LearnHomePage />} />
          <Route path="lessons" element={<LearnLessonsPage />} />
          <Route path="lessons/:subjectId" element={<LearnLessonsPage />} />
          <Route path="assignments" element={<LearnAssignmentsPage />} />
          <Route path="assignments/:id" element={<LearnAssignmentsPage />} />
          <Route path="achievements" element={<LearnAchievementsPage />} />
          <Route path="profile" element={<LearnProfilePage />} />
        </Route>

        {/* Parent Mode routes - within student account */}
        <Route path="/learn/parent" element={
          <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
            <ParentModeLayout />
          </ProtectedRoute>
        }>
          <Route index element={<ParentModeDashboard />} />
          <Route path="progress" element={<ParentModeProgress />} />
          <Route path="messages" element={<ParentModeMessages />} />
          <Route path="settings" element={<ParentModeSettings />} />
        </Route>

        {/* English Lesson route - for students */}
        <Route path="/english/:topicId" element={
          <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
            <EnglishLessonPage />
          </ProtectedRoute>
        } />

        {/* Math Lesson route - for students */}
        <Route path="/math/:lessonId" element={
          <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
            <MathLessonPage />
          </ProtectedRoute>
        } />

        {/* Vietnamese Lesson route - for students */}
        <Route path="/vietnamese/:lessonId" element={
          <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
            <VietnameseLessonPage />
          </ProtectedRoute>
        } />

        {/* Science Lesson route - for students */}
        <Route path="/science/:lessonId" element={
          <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
            <ScienceLessonPage />
          </ProtectedRoute>
        } />

        {/* Catch all - redirect to role-based page or login */}
        <Route path="*" element={<RoleBasedRedirect />} />
        </Routes>
      </Suspense>
    </AudioProvider>
  );
}

export default App;
