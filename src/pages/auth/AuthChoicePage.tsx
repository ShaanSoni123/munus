import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthChoice } from '../../components/auth/AuthChoice';

const AuthChoicePage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoogleAuth = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      alert('Google Sign-In is not configured');
      return;
    }

    const redirectUri = `${window.location.origin}/google-callback`;
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${encodeURIComponent(clientId)}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=openid email profile&` +
      `response_type=code`;

    window.location.href = googleAuthUrl;
  };

  const handleManualAuth = () => {
    navigate('/register');
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <AuthChoice
      onGoogleAuth={handleGoogleAuth}
      onManualAuth={handleManualAuth}
      onBack={handleBack}
    />
  );
};

export default AuthChoicePage;

