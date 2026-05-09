import { createBrowserRouter, Navigate, useLocation } from 'react-router-dom';
import { RootLayout } from '../components/layout/RootLayout';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { SignupPage } from '../pages/auth/SignupPage';
import { HomeDashboard } from '../pages/dashboard/HomeDashboard';
import { ModulesPage } from '../pages/learning/ModulesPage';
import { ModuleDetailsPage } from '../pages/learning/ModuleDetailsPage';
import { LessonPage } from '../pages/learning/LessonPage';
import { QuizPage } from '../pages/quiz/QuizPage';
import { AIChatbotPage } from '../pages/chat/AIChatbotPage';
import { ProfilePage } from '../pages/profile/ProfilePage';
import { LeaderboardPage } from '../pages/profile/LeaderboardPage';
import { useAuth } from '../hooks/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-earth-200 border-t-forest-600" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
      { path: 'dashboard', element: <ProtectedRoute><HomeDashboard /></ProtectedRoute> },
      { path: 'modules', element: <ProtectedRoute><ModulesPage /></ProtectedRoute> },
      { path: 'modules/:id', element: <ProtectedRoute><ModuleDetailsPage /></ProtectedRoute> },
      { path: 'lesson/:id', element: <ProtectedRoute><LessonPage /></ProtectedRoute> },
      { path: 'quiz/:moduleId', element: <ProtectedRoute><QuizPage /></ProtectedRoute> },
      { path: 'profile', element: <ProtectedRoute><ProfilePage /></ProtectedRoute> },
      { path: 'leaderboard', element: <ProtectedRoute><LeaderboardPage /></ProtectedRoute> },
    ],
  },
]);
