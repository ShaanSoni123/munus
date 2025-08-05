import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Menu, X, User, Settings, LogOut, Sun, Moon, Zap, Bell, Home, ChevronDown, HelpCircle, Mail, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { NotificationsPanel } from '../notifications/NotificationsPanel';
import { notificationService } from '../../services/notificationService';
import { useApi } from '../../hooks/useApi';

interface HeaderProps {
  onNavigate?: (view: 'home' | 'jobs' | 'resume' | 'profile' | 'create-profile' | 'dashboard' | 'post-job' | 'candidates' | 'faqs' | 'contact' | 'settings') => void;
  currentView?: string;
  onGetStarted?: () => void;
  onSignIn?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onNavigate, 
  currentView, 
  onGetStarted, 
  onSignIn 
}) => {
  const { user, logout, isAuthenticated, isEmployer, isJobSeeker } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const profileRef = useRef<HTMLDivElement>(null);

  // Memoize the API function to avoid unnecessary re-renders
  const getUnreadCount = useCallback(() => notificationService.getUnreadCount(), []);

  // Fetch unread notification count
  const { data: unreadData } = useApi(
    getUnreadCount,
    {
      immediate: isAuthenticated,
      onSuccess: (data) => setUnreadCount(data.count),
      onError: () => setUnreadCount(0),
    }
  );

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close mobile menu when view changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [currentView]);

  const getNavigation = () => {
    if (!isAuthenticated) {
      return [
        { name: 'Home', href: '#home', view: 'home' as const, icon: Home },
        { name: 'Find Jobs', href: '#jobs', view: 'jobs' as const, icon: User },
        { name: 'Resume Builder', href: '#resume', view: 'resume' as const, icon: User },
      ];
    }

    if (isEmployer) {
      return [
        { name: 'Dashboard', href: '#dashboard', view: 'dashboard' as const, icon: LayoutDashboard },
        { name: 'Find Candidates', href: '#candidates', view: 'candidates' as const, icon: User },
      ];
    } else if (isJobSeeker) {
      return [
        { name: 'Dashboard', href: '#dashboard', view: 'dashboard' as const, icon: LayoutDashboard },
        { name: 'Find Jobs', href: '#jobs', view: 'jobs' as const, icon: User },
        { name: 'Resume Builder', href: '#resume', view: 'resume' as const, icon: User },
        { name: 'My Profile', href: '#profile', view: 'profile' as const, icon: User },
      ];
    }

    return [];
  };

  // Memoize navigation to avoid recalculating on every render
  const navigation = useMemo(() => getNavigation(), [isAuthenticated, isEmployer, isJobSeeker, currentView, theme]);

  // Memoize handlers
  const handleNavigation = useCallback((view: 'home' | 'jobs' | 'resume' | 'profile' | 'create-profile' | 'dashboard' | 'post-job' | 'candidates' | 'faqs' | 'contact' | 'settings') => {
    if (!isAuthenticated && ['post-job', 'profile', 'dashboard', 'candidates', 'faqs', 'contact', 'settings'].includes(view)) {
      onSignIn?.();
      return;
    }
    onNavigate?.(view);
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [isAuthenticated, onSignIn, onNavigate]);

  const handleLogout = useCallback(() => {
    setIsProfileOpen(false);
    logout();
  }, [logout]);

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-300 border-b backdrop-blur-lg ${
        theme === 'light'
          ? 'bg-white/95 border-gray-200/50 shadow-sm'
          : 'bg-gray-900/95 border-gray-700/50 shadow-lg'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <button 
                onClick={() => handleNavigation('home')}
                className="flex-shrink-0 flex items-center space-x-2 hover:opacity-80 transition-all duration-200 hover:scale-105"
              >
                <div className={`w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center transition-all duration-300 ${
                  theme === 'dark-neon' ? 'shadow-lg shadow-blue-500/25' : 'shadow-md'
                }`}>
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
                  Munus
                </h1>
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              {navigation.map((item) => {
                const IconComponent = item.icon;
                return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.view)}
                  className={`text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-cyan-400 px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center space-x-2 ${
                    currentView === item.view 
                      ? `text-blue-600 dark:text-cyan-400 ${
                          theme === 'light' ? 'bg-blue-50' : 'bg-cyan-900/20'
                        }` 
                      : ''
                  }`}
                >
                    <IconComponent className="w-4 h-4" />
                  <span>{item.name}</span>
                </button>
                );
              })}
            </nav>

            {/* Right side buttons */}
            <div className="flex items-center space-x-3">
              {/* Notifications */}
              {isAuthenticated && (
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative hover-lift"
                    onClick={() => setIsNotificationsOpen(true)}
                    icon={<Bell className="w-4 h-4" />}
                  >
                    {unreadCount > 0 && (
                      <Badge 
                        variant="error" 
                        size="sm" 
                        className={`absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center text-xs font-bold animate-pulse ${
                          theme === 'dark-neon' ? 'shadow-lg shadow-red-500/25' : ''
                        }`}
                      >
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </Badge>
                    )}
                  </Button>
                </div>
              )}

              {/* Theme Toggle Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className={`theme-toggle relative overflow-hidden transition-all duration-300 ${
                  isDark 
                    ? 'text-cyan-400 hover:bg-cyan-900/20 hover:text-cyan-300' 
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
                icon={
                  <div className="relative">
                    {isDark ? (
                      <Moon className={`w-4 h-4 transition-all duration-300 ${
                        theme === 'dark-neon' ? 'animate-pulse' : ''
                      }`} />
                    ) : (
                      <Sun className={`w-4 h-4 transition-all duration-300`} />
                    )}
                  </div>
                }
                title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Neon Theme'}
              />

              {isAuthenticated ? (
                /* User Profile Dropdown */
                <div className="relative" ref={profileRef}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className={`flex items-center space-x-2 transition-all duration-200 ${
                      theme === 'light' 
                        ? 'hover:bg-gray-100' 
                        : 'hover:bg-gray-800'
                    }`}
                  >
                    <div className={`w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center transition-all duration-300 ${
                      theme === 'dark-neon' ? 'shadow-lg shadow-blue-500/25' : 'shadow-md'
                    }`}>
                      <span className="text-white text-sm font-medium">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-medium">{user?.name || 'User'}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {user?.role === 'employer' ? 'Employer' : 'Job Seeker'}
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                      isProfileOpen ? 'rotate-180' : ''
                    }`} />
                  </Button>
                  
                  {isProfileOpen && (
                    <div className={`absolute right-0 mt-2 w-64 rounded-xl shadow-xl border py-2 z-50 animate-scale-in backdrop-blur-lg ${
                      theme === 'light'
                        ? 'bg-white/95 border-gray-200'
                        : 'bg-gray-800/95 border-gray-700'
                    }`}>
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name || 'User'}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email || 'user@example.com'}</p>
                        <div className="mt-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            user?.role === 'employer' 
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                          }`}>
                            {user?.role === 'employer' ? 'Employer' : 'Job Seeker'}
                          </span>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => handleNavigation('profile')}
                        className={`w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-300 flex items-center space-x-3 transition-colors ${
                          theme === 'light' 
                            ? 'hover:bg-gray-50' 
                            : 'hover:bg-gray-700'
                        }`}
                      >
                        <User className="w-4 h-4" />
                        <span>My Profile</span>
                      </button>
                      
                      <button 
                        onClick={() => handleNavigation('settings')}
                        className={`w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-300 flex items-center space-x-3 transition-colors ${
                          theme === 'light' 
                            ? 'hover:bg-gray-50' 
                            : 'hover:bg-gray-700'
                        }`}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </button>
                      
                      <button 
                        onClick={() => handleNavigation('faqs')}
                        className={`w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-300 flex items-center space-x-3 transition-colors ${
                          theme === 'light' 
                            ? 'hover:bg-gray-50' 
                            : 'hover:bg-gray-700'
                        }`}
                      >
                        <HelpCircle className="w-4 h-4" />
                        <span>FAQs</span>
                      </button>
                      
                      <button 
                        onClick={() => handleNavigation('contact')}
                        className={`w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-300 flex items-center space-x-3 transition-colors ${
                          theme === 'light' 
                            ? 'hover:bg-gray-50' 
                            : 'hover:bg-gray-700'
                        }`}
                      >
                        <Mail className="w-4 h-4" />
                        <span>Contact Us</span>
                      </button>
                      
                      <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className={`w-full px-4 py-3 text-left text-sm text-red-600 dark:text-red-400 flex items-center space-x-3 transition-colors ${
                            theme === 'light' 
                              ? 'hover:bg-red-50' 
                              : 'hover:bg-red-900/20'
                          }`}
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Login/Register Buttons */
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="hidden sm:flex hover-lift"
                    onClick={onSignIn}
                  >
                    Log In
                  </Button>
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={onGetStarted}
                    className="hover-lift shadow-lg"
                  >
                    Get Started
                  </Button>
                </div>
              )}

              {/* Mobile menu button */}
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  icon={isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  className="hover-lift"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className={`md:hidden border-t backdrop-blur-lg animate-slide-up ${
            theme === 'light'
              ? 'border-gray-200 bg-white/95'
              : 'border-gray-700 bg-gray-900/95'
          }`}>
            <div className="px-4 pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const IconComponent = item.icon;
                return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.view)}
                  className={`block w-full text-left px-3 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-cyan-400 rounded-lg transition-all duration-200 flex items-center space-x-3 ${
                    currentView === item.view 
                      ? `text-blue-600 dark:text-cyan-400 ${
                          theme === 'light' ? 'bg-blue-50' : 'bg-cyan-900/20'
                        }` 
                      : `${
                          theme === 'light' 
                            ? 'hover:bg-gray-100' 
                            : 'hover:bg-gray-800'
                        }`
                  }`}
                >
                    <IconComponent className="w-5 h-5" />
                  <span>{item.name}</span>
                </button>
                );
              })}
              
              {/* Mobile Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`block w-full text-left px-3 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-cyan-400 rounded-lg transition-all duration-200 flex items-center space-x-3 ${
                  theme === 'light' 
                    ? 'hover:bg-gray-100' 
                    : 'hover:bg-gray-800'
                }`}
              >
                {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                <span>{isDark ? 'Switch to Light Theme' : 'Switch to Dark Neon Theme'}</span>
              </button>
              
              {!isAuthenticated && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    fullWidth
                    onClick={onSignIn}
                    className="hover-lift justify-start"
                  >
                    Log In
                  </Button>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    fullWidth
                    onClick={onGetStarted}
                    className="hover-lift shadow-lg"
                  >
                    Get Started
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Notifications Panel */}
      <NotificationsPanel 
        isOpen={isNotificationsOpen} 
        onClose={() => setIsNotificationsOpen(false)} 
      />
    </>
  );
};