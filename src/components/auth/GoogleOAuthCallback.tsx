import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner } from '../common/LoadingSpinner';

type ViewType = 'home' | 'jobs' | 'resume' | 'profile' | 'create-profile' | 'dashboard' | 'post-job' | 'candidates' | 'faqs' | 'contact' | 'settings' | 'notifications' | 'application-detail' | 'privacy' | 'terms' | 'google-callback';

interface GoogleOAuthCallbackProps {
  onNavigate: (view: ViewType) => void;
}

const GoogleOAuthCallback: React.FC<GoogleOAuthCallbackProps> = ({ onNavigate }) => {
  const { loginWithGoogle, user } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    handleOAuthCallback();
  }, []);

  const handleOAuthCallback = async () => {
    try {
      setStatus('loading');
      
      // Check if we have Google user info in sessionStorage (from ProfileCreation)
      const googleUserInfo = sessionStorage.getItem('googleUserInfo');
      
      if (googleUserInfo) {
        const userData = JSON.parse(googleUserInfo);
        await loginWithGoogle(userData);
        sessionStorage.removeItem('googleUserInfo'); // Clean up
        redirectToDashboard();
      } else {
        // No user info found, redirect to profile creation
        onNavigate('create-profile');
      }

    } catch (err: any) {
      console.error('OAuth callback error:', err);
      setError(err.message || 'Authentication failed');
      setStatus('error');
      
      // Redirect to home page after 3 seconds
      setTimeout(() => {
        onNavigate('home');
      }, 3000);
    }
  };

  const redirectToDashboard = () => {
    setStatus('success');
    
    // Determine where to redirect based on user role
    if (user?.role === 'employer') {
      onNavigate('dashboard');
    } else if (user?.role === 'jobseeker') {
      onNavigate('dashboard');
    } else {
      // New user or role not set, go to profile creation
      onNavigate('create-profile');
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mt-4">
            Completing Google Sign-In...
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Please wait while we set up your account
          </p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Authentication Failed
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {error}
          </p>
          <button
            onClick={() => onNavigate('home')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
        <div className="text-center">
          <div className="text-green-500 text-6xl mb-4">✅</div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Sign-In Successful!
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Redirecting to your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default GoogleOAuthCallback;
