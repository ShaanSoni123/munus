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

        console.log('🔍 Google OAuth callback received:', { code });

        // Exchange the authorization code for user info
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
        const response = await fetch(`${apiBaseUrl}/api/v1/auth/google/callback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: code
          }),
        });

        // Check if response is JSON or HTML (error page)
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          console.error('❌ Non-JSON response received:', text.substring(0, 200));
          throw new Error('Server returned an error page. Please check your backend server is running.');
        }

        if (!response.ok) {
          let errorData;
          try {
            errorData = await response.json();
          } catch (e) {
            throw new Error(`Authentication failed with status ${response.status}`);
          }
          throw new Error(errorData.detail || 'Authentication failed');
        }

        const authResult = await response.json();
        console.log('✅ Google authentication successful:', authResult);

        // Transform user data to match frontend expectations
        const transformedUser = {
          ...authResult.user,
          id: authResult.user._id || authResult.user.id,
          role: authResult.user.role || userType, // Ensure role is set
        };

        // Store the access token and user data using the correct keys that AuthService expects
        localStorage.setItem('skillglide-access-token', authResult.access_token);
        localStorage.setItem('skillglide-user', JSON.stringify(transformedUser));

        // Also store in the format used by some components
        localStorage.setItem('accessToken', authResult.access_token);

        // Clear the pending sign-in data
        localStorage.removeItem('pendingGoogleSignIn');

        // Update AuthContext by dispatching auth state change event
        window.dispatchEvent(new CustomEvent('auth-state-changed'));

        console.log('✅ User authenticated successfully:', {
          email: transformedUser.email,
          role: transformedUser.role,
          id: transformedUser.id
        });
        
        // Redirect based on whether user has a role
        // If no role, go to role selection. If role exists, go to dashboard
        setTimeout(() => {
          try {
            if (!transformedUser.role || transformedUser.role === 'temp' || transformedUser.role === null || transformedUser.role === undefined) {
              console.log('🔄 No role set, redirecting to role selection');
              // Use window.location for reliable redirect
              window.location.href = '/role-selection';
            } else {
              console.log('🔄 Role exists, redirecting to dashboard');
              window.location.href = '/dashboard';
            }
          } catch (navError) {
            console.error('Navigation error, using fallback:', navError);
            // Fallback to window.location if React Router navigation fails
            if (!transformedUser.role || transformedUser.role === 'temp' || transformedUser.role === null || transformedUser.role === undefined) {
              window.location.href = '/role-selection';
            } else {
              window.location.href = '/dashboard';
            }
          }
        }, 200);

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
