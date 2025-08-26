import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { HomePage } from './components/home/HomePage';
import { ProfileCreation } from './components/profile/ProfileCreation';
import { ProfilePage } from './components/profile/ProfilePage';
import { JobFilters } from './components/jobs/JobFilters';
import { JobList } from './components/jobs/JobList';

import { JobSeekerDashboard } from './components/jobs/JobSeekerDashboard';
import { ResumeBuilder } from './components/resume/ResumeBuilder';
import { EmployerDashboard } from './components/employer/EmployerDashboard';
import { JobPostingBuilder } from './components/employer/JobPostingBuilder';
import { ApplicationDetailPage } from './components/employer/ApplicationDetailPage';
import { AuthModal } from './components/auth/AuthModal';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { ToastContainer, useToast } from './components/common/Toast';
import { ThemeProvider } from './contexts/ThemeContext';
// import { ConnectionStatus } from './components/common/ConnectionStatus';
import { AuthProvider } from './contexts/AuthContext';
import { JobProvider } from './contexts/JobContext';
import { useAuth } from './contexts/AuthContext';
import { useTheme } from './contexts/ThemeContext';
import './styles/themes.css';
import { FAQPage } from './components/faqs/FAQPage';
import { ContactPage } from './components/contact/ContactPage';
import { SettingsPage } from './components/profile/SettingsPage';
import { NotificationsPage } from './components/notifications/NotificationsPage';
import { AIChatbot } from './components/common/AIChatbot';
import { Analytics } from '@vercel/analytics/react';
import { Footer } from './components/layout/Footer';
import { PrivacyPolicy } from './components/legal/PrivacyPolicy';
import { TermsOfService } from './components/legal/TermsOfService';
import { GoogleOAuthCallback } from './components/auth/GoogleOAuthCallback';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({ 
  children, 
  allowedRoles 
}) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading Munus..." />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Main App Content with Routing
const AppContent: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [dashboardKey, setDashboardKey] = useState(0);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const { isAuthenticated, user, loading } = useAuth();
  const { theme } = useTheme();
  const { toasts, removeToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  // Apply dark theme by default
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark');
  }, []);

  // Handle authentication state changes
  useEffect(() => {
    if (loading) return;

    // If authenticated and on home page, redirect to dashboard
    if (isAuthenticated && user && location.pathname === '/') {
      navigate('/dashboard');
    }
    
    // If not authenticated and on protected page, redirect home
    if (!isAuthenticated && ['/dashboard', '/post-job', '/candidates', '/profile', '/settings', '/notifications'].includes(location.pathname)) {
      navigate('/');
    }
  }, [isAuthenticated, user, loading, location.pathname, navigate]);

  const handleGetStarted = () => {
    if (isAuthenticated && user) {
      navigate('/dashboard');
    } else {
      navigate('/create-profile');
    }
  };

  const handleSignIn = () => {
    setAuthModalMode('login');
    setShowAuthModal(true);
  };

  const handleProfileCreationComplete = () => {
    setDashboardKey(prev => prev + 1);
    navigate('/dashboard');
  };

  const handleProfileCreationBack = () => {
    navigate('/');
  };

  const handleFindJobs = () => {
    navigate('/jobs');
  };
  
  const handleResumeBuilder = () => {
    navigate('/resume');
  };

  // Show loading spinner during initial auth check
  if (loading) {
    return (
      <div className={`min-h-screen theme-transition ${
        theme === 'light' 
          ? 'bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 light bg-light-pattern' 
          : 'bg-gradient-to-br from-gray-900 via-gray-900 to-blue-900 dark bg-dark-pattern'
      }`}>
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" text="Loading Munus..." />
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen theme-transition ${
      theme === 'light' 
        ? 'bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 light bg-light-pattern' 
        : 'bg-gradient-to-br from-gray-900 via-gray-900 to-blue-900 dark bg-dark-pattern'
    }`}>
      {/* Header - Only show for non-legal pages */}
      {!['/privacy', '/terms'].includes(location.pathname) && (
        <Header 
          onGetStarted={handleGetStarted}
          onSignIn={handleSignIn}
        />
      )}
      
      {/* Main Content */}
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <HomePage 
              onGetStarted={handleGetStarted} 
              onSignIn={handleSignIn} 
              onFindJobs={handleFindJobs} 
              onResumeBuilder={handleResumeBuilder} 
            />
          } />
          
          <Route path="/jobs" element={
            <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ${
              theme === 'light' ? 'bg-light-pattern' : ''
            }`}>
              <div className="space-y-8">
                <div className="text-center mb-12">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                    {isAuthenticated && user?.role === 'employer' ? 'Find Top Candidates' : 'Discover Your Perfect Job'}
                  </h1>
                  <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    {isAuthenticated && user?.role === 'employer'
                      ? 'Browse through talented professionals and find the perfect match for your team'
                      : 'Browse through thousands of opportunities from top companies worldwide'
                    }
                  </p>
                </div>
                <JobFilters />
                <JobList />
              </div>
            </div>
          } />
          
          <Route path="/resume" element={<ResumeBuilder />} />
          <Route path="/faqs" element={<FAQPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/google-callback" element={<GoogleOAuthCallback onNavigate={(view) => navigate('/')} />} />
          
          {/* Protected Routes */}
          <Route path="/create-profile" element={
            <ProtectedRoute>
              <ProfileCreation 
                onComplete={handleProfileCreationComplete}
                onBack={handleProfileCreationBack}
                onNavigate={(view) => {
                  const routeMap: Record<string, string> = {
                    'home': '/',
                    'dashboard': '/dashboard'
                  };
                  if (routeMap[view]) {
                    navigate(routeMap[view]);
                  }
                }}
              />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              {user?.role === 'employer' ? (
                <EmployerDashboard 
                  key={dashboardKey} 
                  onNavigate={(view) => {
                    const routeMap: Record<string, string> = {
                      'dashboard': '/dashboard',
                      'post-job': '/post-job',
                      'candidates': '/candidates',
                      'profile': '/profile',
                      'settings': '/settings',
                      'notifications': '/notifications'
                    };
                    if (routeMap[view]) {
                      navigate(routeMap[view]);
                    }
                  }} 
                  onApplicationSelect={setSelectedApplication} 
                />
              ) : (
                <JobSeekerDashboard 
                  onNavigate={(view) => {
                    const routeMap: Record<string, string> = {
                      'dashboard': '/dashboard',
                      'profile': '/profile',
                      'settings': '/settings',
                      'notifications': '/notifications'
                    };
                    if (routeMap[view]) {
                      navigate(routeMap[view]);
                    }
                  }} 
                />
              )}
            </ProtectedRoute>
          } />
          
          <Route path="/post-job" element={
            <ProtectedRoute allowedRoles={['employer']}>
              <JobPostingBuilder 
                onBack={() => navigate('/dashboard')} 
                onJobPosted={(newJob) => {
                  console.log('Job posted successfully:', newJob);
                  setDashboardKey(prev => prev + 1);
                  navigate('/dashboard');
                }}
              />
            </ProtectedRoute>
          } />
          
          <Route path="/candidates" element={
            <ProtectedRoute allowedRoles={['employer']}>
              <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ${
                theme === 'light' ? 'bg-light-pattern' : ''
              }`}>
                <div className="space-y-8">
                  <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                      Find Top Candidates
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                      Browse through talented professionals and find the perfect match for your team
                    </p>
                  </div>
                  <JobFilters />
                  <JobList />
                </div>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage onNavigate={(view: string) => navigate('/dashboard')} />
            </ProtectedRoute>
          } />
          
          <Route path="/settings" element={
            <ProtectedRoute>
              <SettingsPage onNavigate={(view) => {
                const routeMap: Record<string, string> = {
                  'dashboard': '/dashboard',
                  'profile': '/profile'
                };
                if (routeMap[view]) {
                  navigate(routeMap[view]);
                }
              }} />
            </ProtectedRoute>
          } />
          
          <Route path="/notifications" element={
            <ProtectedRoute>
              <NotificationsPage onNavigate={(view) => {
                const routeMap: Record<string, string> = {
                  'dashboard': '/dashboard',
                  'profile': '/profile'
                };
                if (routeMap[view]) {
                  navigate(routeMap[view]);
                }
              }} />
            </ProtectedRoute>
          } />
          
          <Route path="/application-detail" element={
            <ProtectedRoute allowedRoles={['employer']}>
              {selectedApplication ? (
                <ApplicationDetailPage
                  application={selectedApplication}
                  onBack={() => navigate('/dashboard')}
                  onStatusUpdate={(applicationId, status, notes) => {
                    console.log('Status update:', { applicationId, status, notes });
                  }}
                />
              ) : (
                <Navigate to="/dashboard" replace />
              )}
            </ProtectedRoute>
          } />
          
          {/* Catch all route - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode={authModalMode}
        onGetStarted={handleGetStarted}
      />

      {/* Footer - Only show for non-legal pages */}
      {!['/privacy', '/terms'].includes(location.pathname) && <Footer />}
      
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      
      {/* AI Chatbot - Only show on dashboard and related pages */}
      {['/dashboard', '/post-job'].includes(location.pathname) && <AIChatbot />}
      <Analytics />
    </div>
  );
};

function App() {
  console.log('🚀 App component initializing...'); // DEBUG LINE
  
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <JobProvider>
            <Router>
              <AppContent />
            </Router>
          </JobProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;