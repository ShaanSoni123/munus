import React, { useState } from 'react';
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
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [dashboardKey, setDashboardKey] = useState(0);
  
  // Simplified auth state for now
  const isAuthenticated = false;
  const isEmployer = false;
  const isJobSeeker = false;
  const user = null;
  const loading = false;

  const handleGetStarted = () => {
    console.log('🚀 Get Started clicked');
    setCurrentView('create-profile');
  };

  const handleSignIn = () => {
    console.log('🔐 Sign In clicked');
    setAuthModalMode('login');
    setShowAuthModal(true);
  };

  const handleFindJobs = () => setCurrentView('jobs');
  const handleResumeBuilder = () => setCurrentView('resume');

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return (
          <HomePage
            onGetStarted={handleGetStarted}
            onSignIn={handleSignIn}
            onFindJobs={handleFindJobs}
            onResumeBuilder={handleResumeBuilder}
          />
        );
      case 'create-profile':
        return (
          <ProfileCreation
            onBack={() => setCurrentView('home')}
            onComplete={() => setCurrentView('dashboard')}
          />
        );
      case 'jobs':
        return (
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 py-8">
              <JobFilters />
              <JobList />
            </div>
          </div>
        );
      case 'resume':
        return <ResumeBuilder />;
      case 'dashboard':
        return isEmployer ? <EmployerDashboard /> : <JobSeekerDashboard />;
      case 'post-job':
        return <JobPostingBuilder />;
      case 'profile':
        return <ProfilePage />;
      case 'faqs':
        return <FAQPage />;
      case 'contact':
        return <ContactPage />;
      case 'settings':
        return <SettingsPage />;
      case 'notifications':
        return <NotificationsPage />;
      default:
        return (
          <HomePage
            onGetStarted={handleGetStarted}
            onSignIn={handleSignIn}
            onFindJobs={handleFindJobs}
            onResumeBuilder={handleResumeBuilder}
          />
        );
    }
  };

  return (
    <div className="min-h-screen">
      <Header
        onNavigate={setCurrentView}
        currentView={currentView}
        onSignIn={handleSignIn}
        onGetStarted={handleGetStarted}
      />
      
      <ErrorBoundary>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {renderContent()}
            <AIChatbot />
            <ToastContainer />
            
            {showAuthModal && (
              <AuthModal
                mode={authModalMode}
                onClose={() => setShowAuthModal(false)}
                onSwitchMode={() => setAuthModalMode(authModalMode === 'login' ? 'register' : 'login')}
              />
            )}
          </>
        )}
      </ErrorBoundary>
    </div>
  );
};

function App() {
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