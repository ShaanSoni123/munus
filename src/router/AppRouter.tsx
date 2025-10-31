import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import ProtectedRoute from '../components/common/ProtectedRoute';

// Layout Components
import AppLayout from '../layouts/AppLayout';
import AuthLayout from '../layouts/AuthLayout';
import LegalLayout from '../layouts/LegalLayout';

// Page Components
import HomePage from '../pages/public/HomePage';
import JobsPage from '../pages/public/JobsPage';
import ContactPage from '../pages/public/ContactPage';
import FAQPage from '../pages/public/FAQPage';
import AboutPage from '../pages/public/AboutPage';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import CreateProfilePage from '../pages/auth/CreateProfilePage';
import GoogleCallbackPage from '../pages/auth/GoogleCallbackPage';

// Dashboard Pages
import DashboardPage from '../pages/dashboard/DashboardPage';
import PostJobPage from '../pages/dashboard/PostJobPage';
import CandidatesPage from '../pages/dashboard/CandidatesPage';
import ApplicationDetailPage from '../pages/dashboard/ApplicationDetailPage';

// Profile Pages
import ProfilePage from '../pages/profile/ProfilePage';
import SettingsPage from '../pages/profile/SettingsPage';

// Job Pages
import ResumeBuilderPage from '../pages/jobs/ResumeBuilderPage';
import SavedJobsPage from '../pages/jobs/SavedJobsPage';
import NotificationsPage from '../pages/jobs/NotificationsPage';

// Legal Pages
import PrivacyPolicyPage from '../pages/legal/PrivacyPolicyPage';
import TermsOfServicePage from '../pages/legal/TermsOfServicePage';

// Error Page Component
const ErrorPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-900 to-blue-900 dark bg-dark-pattern">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-white mb-4">404 - Page Not Found</h1>
      <p className="text-gray-400 mb-6">The page you're looking for doesn't exist.</p>
      <a
        href="/"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Go Home
      </a>
    </div>
  </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'jobs',
        element: <JobsPage />,
      },
      {
        path: 'contact',
        element: <ContactPage />,
      },
      {
        path: 'faqs',
        element: <FAQPage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'resume',
        element: <ResumeBuilderPage />,
      },
      // Protected Routes
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'post-job',
        element: (
          <ProtectedRoute requireRole="employer">
            <PostJobPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'candidates',
        element: (
          <ProtectedRoute requireRole="employer">
            <CandidatesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'application-detail',
        element: (
          <ProtectedRoute requireRole="employer">
            <ApplicationDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'settings',
        element: (
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'saved-jobs',
        element: (
          <ProtectedRoute requireRole="jobseeker">
            <SavedJobsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'notifications',
        element: (
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  // Auth Routes (no header/footer)
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'create-profile',
        element: <CreateProfilePage />,
      },
      {
        path: 'google-callback',
        element: <GoogleCallbackPage />,
      },
    ],
  },
  // Redirect legacy auth routes
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/create-profile',
    element: <CreateProfilePage />,
  },
  {
    path: '/google-callback',
    element: <GoogleCallbackPage />,
  },
  // Legal Routes (no header/footer)
  {
    path: '/legal',
    element: <LegalLayout />,
    children: [
      {
        path: 'privacy',
        element: <PrivacyPolicyPage />,
      },
      {
        path: 'terms',
        element: <TermsOfServicePage />,
      },
    ],
  },
  // Legacy legal routes
  {
    path: '/privacy',
    element: <PrivacyPolicyPage />,
  },
  {
    path: '/privacypolicy',
    element: <PrivacyPolicyPage />,
  },
  {
    path: '/terms',
    element: <TermsOfServicePage />,
  },
  {
    path: '/termsofservice',
    element: <TermsOfServicePage />,
  },
]);

const AppRouter: React.FC = () => {
  return (
    <ErrorBoundary>
      <RouterProvider 
        router={router} 
        fallbackElement={
          <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner size="lg" text="Loading Munus..." />
          </div>
        }
      />
    </ErrorBoundary>
  );
};

export default AppRouter;
