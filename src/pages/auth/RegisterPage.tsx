import React, { useState } from 'react';
import { AuthModal } from '../../components/auth/AuthModal';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect } from 'react';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(true);

  // Redirect if already authenticated (but check for role first)
  useEffect(() => {
    if (isAuthenticated) {
      const storedUser = localStorage.getItem('skillglide-user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        // If user has no role, redirect to role selection, otherwise go to dashboard
        if (!user.role || user.role === null || user.role === undefined) {
          navigate('/role-selection');
        } else {
          navigate('/dashboard');
        }
      } else {
        // If no user data, go to role selection to be safe
        navigate('/role-selection');
      }
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
        defaultMode="register"
        onGetStarted={handleGetStarted}
      />
    </div>
  );
};

export default RegisterPage;
