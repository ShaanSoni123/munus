import React from 'react';
import { Outlet } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const AuthLayout: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen theme-transition ${
      theme === 'light' 
        ? 'bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 light bg-light-pattern' 
        : 'bg-gradient-to-br from-gray-900 via-gray-900 to-blue-900 dark bg-dark-pattern'
    }`}>
      <Outlet />
    </div>
  );
};

export default AuthLayout;
