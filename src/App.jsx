// src/App.jsx
// APP CHÍNH - v3.5.0 với PWA + Onboarding + Leaderboard + Dark Mode
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import SplashScreen from './components/SplashScreen';

// Lazy load pages
const AuthPage = lazy(() => import('./pages/AuthPage'));
const SelectRolePage = lazy(() => import('./pages/SelectRolePage'));
const ParentPage = lazy(() => import('./pages/ParentPage'));
const HomePage = lazy(() => import('./pages/HomePage'));
const SubjectPage = lazy(() => import('./pages/SubjectPage'));
const LessonPage = lazy(() => import('./pages/LessonPage'));
const MathLessonPage = lazy(() => import('./pages/MathLessonPage'));
const VietnameseLessonPage = lazy(() => import('./pages/VietnameseLessonPage'));
const ScienceLessonPage = lazy(() => import('./pages/ScienceLessonPage'));
const LifeSkillsLessonPage = lazy(() => import('./pages/LifeSkillsLessonPage'));
const GamesPage = lazy(() => import('./pages/GamesPage'));
const GamePlayPage = lazy(() => import('./pages/GamePlayPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const PetPage = lazy(() => import('./pages/PetPage'));
const StoryListPage = lazy(() => import('./pages/StoryListPage'));
const StoryReadPage = lazy(() => import('./pages/StoryReadPage'));
const LeaderboardPage = lazy(() => import('./pages/LeaderboardPage'));

// English Lesson
const EnglishLessonPage = lazy(() => import('./pages/EnglishLessonPage'));

// Layout
const Layout = lazy(() => import('./components/Layout'));

// Protected Route - Phải đăng nhập
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <SplashScreen message="Đang kiểm tra đăng nhập..." />;
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  
  return children;
};

// Child Route - Phải chọn bé
const ChildRoute = ({ children }) => {
  const { currentChild, loading } = useAuth();
  
  if (loading) return <SplashScreen message="Đang tải dữ liệu..." />;
  if (!currentChild) return <Navigate to="/select-role" replace />;
  
  return children;
};

function App() {
  return (
    <Suspense fallback={<SplashScreen />}>
      <Routes>
        {/* Public routes */}
        <Route path="/auth" element={<AuthPage />} />
        
        {/* Protected routes - cần đăng nhập */}
        <Route path="/select-role" element={
          <ProtectedRoute>
            <SelectRolePage />
          </ProtectedRoute>
        } />
        
        <Route path="/parent" element={
          <ProtectedRoute>
            <ParentPage />
          </ProtectedRoute>
        } />
        
        {/* Child routes - cần chọn bé */}
        <Route path="/" element={
          <ProtectedRoute>
            <ChildRoute>
              <Layout />
            </ChildRoute>
          </ProtectedRoute>
        }>
          <Route index element={<HomePage />} />
          <Route path="subject/:subjectId" element={<SubjectPage />} />
          <Route path="lesson/:subjectId/:lessonId" element={<LessonPage />} />
          <Route path="math/:lessonId" element={<MathLessonPage />} />
          <Route path="vietnamese/:lessonId" element={<VietnameseLessonPage />} />
          <Route path="science/:lessonId" element={<ScienceLessonPage />} />
          <Route path="lifeskills/:lessonId" element={<LifeSkillsLessonPage />} />
          <Route path="games" element={<GamesPage />} />
          <Route path="games/:gameId" element={<GamePlayPage />} />
          <Route path="english/:lessonId" element={<EnglishLessonPage />} />
          <Route path="pet" element={<PetPage />} />
          <Route path="stories" element={<StoryListPage />} />
          <Route path="story/:storyId" element={<StoryReadPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="leaderboard" element={<LeaderboardPage />} />
        </Route>
        
        {/* Legacy routes - redirect */}
        <Route path="/member-select" element={<Navigate to="/select-role" replace />} />
        <Route path="/dashboard" element={<Navigate to="/parent" replace />} />
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
