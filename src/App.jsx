import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useMember } from './contexts/MemberContext';

// Loading component
const Loading = () => (
  <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-col items-center justify-center">
    <div className="text-6xl mb-4 animate-bounce">🎓</div>
    <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
  </div>
);

// Lazy load pages
const MemberSelectPage = lazy(() => import('./pages/MemberSelectPage'));
const HomePage = lazy(() => import('./pages/HomePage'));
const SubjectPage = lazy(() => import('./pages/SubjectPage'));
const LessonPage = lazy(() => import('./pages/LessonPage'));
const GamesPage = lazy(() => import('./pages/GamesPage'));
const GamePlayPage = lazy(() => import('./pages/GamePlayPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const PetPage = lazy(() => import('./pages/PetPage'));
const StoryListPage = lazy(() => import('./pages/StoryListPage'));
const StoryReadPage = lazy(() => import('./pages/StoryReadPage'));

// English Zone
const EnglishHubPage = lazy(() => import('./pages/EnglishHubPage'));
const EnglishTopicPage = lazy(() => import('./pages/EnglishTopicPage'));
const EnglishGamePage = lazy(() => import('./pages/EnglishGamePage'));

// Layout with navigation
const Layout = lazy(() => import('./components/Layout'));

// Protected Route
const ProtectedRoute = ({ children }) => {
  const { currentMember } = useMember();
  if (!currentMember) return <Navigate to="/member-select" replace />;
  return children;
};

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/member-select" element={<MemberSelectPage />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
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
        
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
