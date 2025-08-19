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

const AppContent: React.FC = () => {
  console.log('🚀 AppContent component rendering...'); // DEBUG LINE - ADDED
  
  const [currentView, setCurrentView] = useState<'home' | 'jobs' | 'resume' | 'profile' | 'create-profile' | 'dashboard' | 'post-job' | 'candidates' | 'faqs' | 'contact' | 'settings' | 'notifications' | 'application-detail'>('home');
  
  // Add error boundary state
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Wrapper function to log navigation changes
  const handleNavigate = (view: 'home' | 'jobs' | 'resume' | 'profile' | 'create-profile' | 'dashboard' | 'post-job' | 'candidates' | 'faqs' | 'contact' | 'settings' | 'notifications' | 'application-detail') => {
    console.log('🔄 Navigation requested:', { from: currentView, to: view });
    try {
      setCurrentView(view);
    } catch (error) {
      console.error('Navigation error:', error);
      setHasError(true);
      setErrorMessage('Navigation failed. Please refresh the page.');
    }
  };
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [dashboardKey, setDashboardKey] = useState(0); // Key to force dashboard refresh
  const [selectedApplication, setSelectedApplication] = useState<any>(null); // Track selected application for detail page
  const { isAuthenticated, isEmployer, isJobSeeker, user, loading } = useAuth();
  const { theme } = useTheme();
  const { toasts, removeToast } = useToast();

  // Navigation logic is now handled in the useEffect below

  // Handle authentication state changes
  // Apply dark theme by default
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark');
  }, []);

  useEffect(() => {
    if (loading) return;

    console.log('🔄 Auth state check:', { 
      isAuthenticated, 
      currentView, 
      user: user?.email,
      userRole: user?.role,
      loading 
    });

    // Set loading to false after auth check
    setIsLoading(false);

    // If authenticated and on home page or public pages, go to dashboard
    if (isAuthenticated && user && ['home', 'jobs', 'faqs', 'contact'].includes(currentView)) {
      console.log('✅ User authenticated, redirecting to dashboard');
      setDashboardKey(prev => prev + 1);
      setCurrentView('dashboard');
    }
    
    // If not authenticated and on protected page, go home
    if (!isAuthenticated && ['dashboard', 'post-job', 'candidates', 'profile', 'settings', 'notifications'].includes(currentView)) {
      console.log('❌ User not authenticated, going home');
      setCurrentView('home');
    }
  }, [isAuthenticated, user, loading, currentView]);

  const handleGetStarted = () => {
    console.log('🚀 handleGetStarted called', {
      isAuthenticated,
      user: user?.role
    });
    
    if (isAuthenticated && user) {
      // User is already authenticated, redirect to dashboard
      console.log('✅ User authenticated, redirecting to dashboard');
      setDashboardKey(prev => prev + 1);
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
    // Force refresh dashboard and redirect to dashboard immediately
    setDashboardKey(prev => prev + 1);
    setCurrentView('dashboard');
  };

  const handleProfileCreationBack = () => {
    setCurrentView('home');
  };

  const handleFindJobs = () => {
    console.log('🔍 App: Find Jobs clicked');
    setCurrentView('jobs');
  };
  
  const handleResumeBuilder = () => {
    console.log('📝 App: Resume Builder clicked');
    setCurrentView('resume');
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
          console.log('🎯 Rendering dashboard for user:', { role: user?.role, isEmployer, isJobSeeker });
          
          // Primary check: use user.role directly from database
          if (user?.role === 'employer') {
            return <EmployerDashboard key={dashboardKey} onNavigate={handleNavigate} onApplicationSelect={setSelectedApplication} />;
          } else if (user?.role === 'jobseeker') {
            return <JobSeekerDashboard onNavigate={handleNavigate} />;
          } else {
            // Fallback: use computed properties
            if (isEmployer) {
              return <EmployerDashboard key={dashboardKey} onNavigate={handleNavigate} onApplicationSelect={setSelectedApplication} />;
            } else {
              // Default to job seeker dashboard
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
        case 'application-detail':
          if (selectedApplication) {
            return (
              <ApplicationDetailPage
                application={selectedApplication}
                onBack={() => setCurrentView('dashboard')}
                onStatusUpdate={(applicationId, status, notes) => {
                  // Handle status update - could be passed down from dashboard
                  console.log('Status update:', { applicationId, status, notes });
                }}
              />
            );
          }
          // Fallback to dashboard if no application selected
          return <EmployerDashboard key={dashboardKey} onNavigate={handleNavigate} />;
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
        : 'bg-gradient-to-br from-gray-900 via-gray-900 to-blue-900 dark bg-dark-pattern'
    }`}>
      <Header 
        onNavigate={handleNavigate}
        currentView={currentView}
        onGetStarted={handleGetStarted}
        onSignIn={handleSignIn}
      />
      
      {/* Main Content */}
      <main>
        {isLoading ? (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center p-8">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                Loading Munus...
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Please wait while we set up your experience
              </p>
            </div>
          </div>
        ) : hasError ? (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center p-8">
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                Something went wrong
              </h2>
              <p className="text-gray-600 mb-4">{errorMessage}</p>
              <button
                onClick={() => {
                  setHasError(false);
                  setErrorMessage('');
                  window.location.reload();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Refresh Page
              </button>
            </div>
          </div>
        ) : (
          renderContent()
        )}
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
            <AppContent />
          </JobProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;