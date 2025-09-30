import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { ToastContainer, useToast } from '../components/common/Toast';
import { AIChatbot } from '../components/common/AIChatbot';
import { useTheme } from '../contexts/ThemeContext';
import { useLocation } from 'react-router-dom';

const AppLayout: React.FC = () => {
  const { theme } = useTheme();
  const { toasts, removeToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  // Show AI chatbot on dashboard and post-job pages
  const showChatbot = ['/dashboard', '/post-job'].includes(location.pathname);

  // Listen for logout events
  useEffect(() => {
    const handleLogout = () => {
      navigate('/');
    };

    window.addEventListener('auth-logout', handleLogout);
    return () => {
      window.removeEventListener('auth-logout', handleLogout);
    };
  }, [navigate]);

  return (
    <div className={`min-h-screen theme-transition ${
      theme === 'light' 
        ? 'bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 light bg-light-pattern' 
        : 'bg-gradient-to-br from-gray-900 via-gray-900 to-blue-900 dark bg-dark-pattern'
    }`}>
      <Header />
      
      <main>
        <Outlet />
      </main>

      <Footer />
      
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      
      {/* AI Chatbot - Only show on dashboard and related pages */}
      {showChatbot && <AIChatbot />}
    </div>
  );
};

export default AppLayout;
