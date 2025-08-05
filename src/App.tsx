import React, { useState, useEffect } from 'react';
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
import { AuthModal } from './components/auth/AuthModal';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { ToastContainer, useToast } from './components/common/Toast';
import { ThemeProvider } from './contexts/ThemeContext';
import { ConnectionStatus } from './components/common/ConnectionStatus';
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

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'jobs' | 'resume' | 'profile' | 'create-profile' | 'dashboard' | 'post-job' | 'candidates' | 'faqs' | 'contact' | 'settings' | 'notifications'>('home');
  
  // Wrapper function to log navigation changes
  const handleNavigate = (view: 'home' | 'jobs' | 'resume' | 'profile' | 'create-profile' | 'dashboard' | 'post-job' | 'candidates' | 'faqs' | 'contact' | 'settings' | 'notifications') => {
    console.log('🔄 Navigation requested:', { from: currentView, to: view });
    setCurrentView(view);
  };
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [dashboardKey, setDashboardKey] = useState(0); // Key to force dashboard refresh
  const { isAuthenticated, isEmployer, isJobSeeker, user, loading } = useAuth();
  const { theme } = useTheme();
  const { toasts, removeToast } = useToast();

  // Navigation logic is now handled in the useEffect below

  // Handle authentication state changes - only redirect when necessary
  useEffect(() => {
    if (loading) return;

    // If not authenticated, only allow home or create-profile
    if (!isAuthenticated && !['home', 'create-profile'].includes(currentView)) {
      console.log('❌ User not authenticated, redirecting from', currentView, 'to home');
      setCurrentView('home');
      return;
    }

    // If authenticated, only redirect if on home or create-profile (initial login redirect)
    if (isAuthenticated && ['home', 'create-profile'].includes(currentView)) {
      console.log('✅ User authenticated, redirecting from', currentView, 'to dashboard');
      setCurrentView('dashboard');
      return;
    }

    // Otherwise, allow the user to stay on their current page
    console.log('🔄 Navigation allowed, staying on', currentView);
  }, [isAuthenticated, isEmployer, isJobSeeker, loading, currentView]);

  // Reset to home page when user logs out
  useEffect(() => {
    if (!isAuthenticated && currentView !== 'home' && currentView !== 'create-profile') {
      console.log('🚪 User logged out, redirecting to home');
      setCurrentView('home');
    }
  }, [isAuthenticated, currentView]);

  const handleGetStarted = () => {
    console.log('🚀 handleGetStarted called', {
      isAuthenticated,
      isEmployer,
      isJobSeeker,
      user: user?.role
    });
    
    if (isAuthenticated) {
      // User is already authenticated, redirect to dashboard
      console.log('✅ User authenticated, redirecting to dashboard');
      setCurrentView('dashboard');
    } else {
      // User is not authenticated, go to profile creation
      console.log('📝 User not authenticated, going to profile creation');
      setCurrentView('create-profile');
    }
  };

  const handleSignIn = () => {
    setAuthModalMode('login');
    setShowAuthModal(true);
  };

  const handleProfileCreationComplete = () => {
    console.log('🎉 Profile creation completed!');
    // The useEffect will handle the redirect automatically
    // Just ensure we're not on the create-profile view anymore
    if (currentView === 'create-profile') {
      setCurrentView('home');
    }
  };

  const handleProfileCreationBack = () => {
    setCurrentView('home');
  };

  const handleFindJobs = () => setCurrentView('jobs');
  const handleResumeBuilder = () => setCurrentView('resume');

  // Show loading spinner during initial auth check
  if (loading) {
    return (
      <div className={`min-h-screen theme-transition ${
        theme === 'light' 
          ? 'bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 light bg-light-pattern' 
          : 'bg-gradient-to-br from-gray-900 via-gray-900 to-blue-900 dark-neon bg-dark-pattern'
      }`}>
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" text="Loading Munus..." />
        </div>
      </div>
    );
  }

  const renderContent = () => {
    try {
      switch (currentView) {
        case 'home':
          return <HomePage onGetStarted={handleGetStarted} onSignIn={handleSignIn} onFindJobs={handleFindJobs} onResumeBuilder={handleResumeBuilder} />;
        case 'create-profile':
          return (
            <ProfileCreation 
              onComplete={handleProfileCreationComplete}
              onBack={handleProfileCreationBack}
            />
          );
        case 'jobs':
          return (
            <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ${
              theme === 'light' ? 'bg-light-pattern' : ''
            }`}>
              <div className="space-y-8">
                <div className="text-center mb-12">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                    {isEmployer ? 'Find Top Candidates' : 'Discover Your Perfect Job'}
                  </h1>
                  <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    {isEmployer 
                      ? 'Browse through talented professionals and find the perfect match for your team'
                      : 'Browse through thousands of opportunities from top companies worldwide'
                    }
                  </p>
                </div>
                <JobFilters />
                <JobList />
              </div>
            </div>
          );
        case 'resume':
          return <ResumeBuilder />;
        case 'dashboard':
          if (isEmployer) {
            return <EmployerDashboard key={dashboardKey} onNavigate={handleNavigate} />;
          } else if (isJobSeeker) {
            return <JobSeekerDashboard onNavigate={handleNavigate} />;
          } else {
            // Fallback: try to determine role from user object
            if (user?.role === 'employer') {
              return <EmployerDashboard key={dashboardKey} onNavigate={handleNavigate} />;
            } else if (user?.role === 'jobseeker') {
              return <JobSeekerDashboard onNavigate={handleNavigate} />;
            } else {
              // Last resort: show job seeker dashboard
              return <JobSeekerDashboard onNavigate={handleNavigate} />;
            }
          }
        case 'post-job':
          return (
            <JobPostingBuilder 
              onBack={() => setCurrentView('dashboard')} 
              onJobPosted={(newJob) => {
                console.log('Job posted successfully:', newJob);
                setDashboardKey(prev => prev + 1); // Force dashboard refresh
                setCurrentView('dashboard');
              }}
            />
          );
        case 'candidates':
          return (
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
          );
        case 'profile':
          return <ProfilePage onNavigate={setCurrentView} />;
        case 'faqs':
          return <FAQPage />;
        case 'contact':
          return <ContactPage />;
        case 'settings':
          return <SettingsPage onNavigate={handleNavigate} />;
        case 'notifications':
          return <NotificationsPage onNavigate={handleNavigate} />;
        default:
          return <HomePage onGetStarted={handleGetStarted} onSignIn={handleSignIn} onFindJobs={handleFindJobs} onResumeBuilder={handleResumeBuilder} />;
      }
    } catch (error) {
      console.error('Error rendering content:', error);
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Please refresh the page or try again later.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className={`min-h-screen theme-transition ${
      theme === 'light' 
        ? 'bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 light bg-light-pattern' 
        : 'bg-gradient-to-br from-gray-900 via-gray-900 to-blue-900 dark-neon bg-dark-pattern'
    }`}>
      <Header 
        onNavigate={handleNavigate}
        currentView={currentView}
        onGetStarted={handleGetStarted}
        onSignIn={handleSignIn}
      />
      
      {/* Main Content */}
      <main>
        {renderContent()}
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode={authModalMode}
        onGetStarted={handleGetStarted}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      
      {/* AI Chatbot - Only show on dashboard and related pages */}
      {(currentView === 'dashboard' || currentView === 'post-job') && <AIChatbot />}
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <JobProvider>
            <ConnectionStatus />
            <AppContent />
          </JobProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;