import React from 'react';
import GoogleOAuthCallback from '../../components/auth/GoogleOAuthCallback';
import { useNavigate } from 'react-router-dom';

const GoogleCallbackPage: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigate = (view: string) => {
    navigate(`/${view}`);
  };

  return <GoogleOAuthCallback onNavigate={handleNavigate} />;
};

export default GoogleCallbackPage;
