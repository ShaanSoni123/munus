import React, { useState } from 'react';
import { AuthModal } from '../../components/auth/AuthModal';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect } from 'react';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(true);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleClose = () => {
    setIsModalOpen(false);
    navigate('/');
  };

  const handleGetStarted = () => {
    navigate('/create-profile');
  };

  if (!isModalOpen) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-900 to-blue-900 dark bg-dark-pattern">
      <AuthModal
        isOpen={isModalOpen}
        onClose={handleClose}
        defaultMode="login"
        onGetStarted={handleGetStarted}
      />
    </div>
  );
};

export default LoginPage;
