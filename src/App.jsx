// src/App.jsx
// APP CHÍNH - Routes mới với Auth
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Loading component
const Loading = () => (
  <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-col items-center justify-center">
    <div className="text-6xl mb-4 animate-bounce">🎓</div>
    <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
  </div>
);

// Lazy load pages
const AuthPage = lazy(() => import('./pages/AuthPage'));
const SelectRolePage = lazy(() => import('./pages/SelectRolePage'));
const ParentPage = lazy(() => import('./pages/ParentPage'));
const HomePage = lazy(() => import('./pages/HomePage'));
const SubjectPage = lazy(() => import('./pages/SubjectPage'));
const LessonPage = lazy(() => import('./pages/LessonPage'));
const GamesPage = lazy(() => import('./pages/GamesPage'));
const GamePlayPage = lazy(() => import('./pages/GamePlayPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const PetPage = lazy(() => import('./pages/PetPage'));
const StoryListPage = lazy(() => import('./pages/StoryListPage'));
const StoryReadPage = lazy(() => import('./pages/StoryReadPage'));

// English Zone
const EnglishHubPage = lazy(() => import('./pages/EnglishHubPage'));
const EnglishTopicPage = lazy(() => import('./pages/EnglishTopicPage'));
const EnglishGamePage = lazy(() => import('./pages/EnglishGamePage'));

// Layout
const Layout = lazy(() => import('./components/Layout'));

// Protected Route - Phải đăng nhập
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <Loading />;
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  
  return children;
};

// Child Route - Phải chọn bé
const ChildRoute = ({ children }) => {
  const { currentChild, loading } = useAuth();
  
  if (loading) return <Loading />;
  if (!currentChild) return <Navigate to="/select-role" replace />;
  
  return children;
};

function App() {
  return (
    <Suspense fallback={<Loading />}>
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
          <Route path="games" element={<GamesPage />} />
          <Route path="games/:gameId" element={<GamePlayPage />} />
          <Route path="english" element={<EnglishHubPage />} />
          <Route path="english/topic/:topicId" element={<EnglishTopicPage />} />
          <Route path="english/game/:gameId" element={<EnglishGamePage />} />
          <Route path="pet" element={<PetPage />} />
          <Route path="stories" element={<StoryListPage />} />
          <Route path="story/:storyId" element={<StoryReadPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
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
