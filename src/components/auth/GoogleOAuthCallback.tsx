import React, { useEffect, useState } from 'react';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface GoogleOAuthCallbackProps {
  onNavigate: (view: 'home' | 'jobs' | 'resume' | 'profile' | 'create-profile' | 'dashboard' | 'employer-dashboard' | 'jobseeker-dashboard' | 'post-job' | 'candidates' | 'faqs' | 'contact' | 'settings' | 'notifications' | 'application-detail' | 'privacy' | 'terms' | 'google-callback') => void;
}

export const GoogleOAuthCallback: React.FC<GoogleOAuthCallbackProps> = ({ onNavigate }) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        // Get the authorization code from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        
        if (!code) {
          setError('No authorization code received from Google');
          setLoading(false);
          return;
        }

        // Parse the state parameter to get user type
        let userType = 'jobseeker'; // default
        if (state) {
          try {
            const stateData = JSON.parse(decodeURIComponent(state));
            userType = stateData.userType || 'jobseeker';
          } catch (e) {
            console.warn('Could not parse state parameter, using default user type');
          }
        }

        console.log('🔍 Google OAuth callback received:', { code, userType });

        // Exchange the authorization code for user info
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/google/callback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: code,
            user_type: userType
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Authentication failed');
        }

        const authResult = await response.json();
        console.log('✅ Google authentication successful:', authResult);

        // Store the access token and user data
        localStorage.setItem('accessToken', authResult.access_token);
        localStorage.setItem('user', JSON.stringify(authResult.user));

        // Clear the pending sign-in data
        localStorage.removeItem('pendingGoogleSignIn');

        // Redirect to the appropriate dashboard based on user role
        if (authResult.user.role === 'employer') {
          onNavigate('employer-dashboard');
        } else {
          onNavigate('jobseeker-dashboard');
        }

      } catch (error: any) {
        console.error('❌ Error in Google OAuth callback:', error);
        setError(error.message || 'Authentication failed');
        setLoading(false);
      }
    };

    handleGoogleCallback();
  }, [onNavigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Completing Google Sign-in...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Failed</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => onNavigate('home')}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default GoogleOAuthCallback;
