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
      <header className="sticky top-0 z-50 transition-all duration-300 border-b border-gray-700/50 backdrop-blur-lg bg-gray-900/95 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <button 
                onClick={() => handleNavigation('home')}
                className="flex-shrink-0 flex items-center space-x-2 hover:opacity-80 transition-all duration-200 hover:scale-105"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center transition-all duration-300 shadow-lg shadow-emerald-500/25">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
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
                  className={`text-gray-300 hover:text-emerald-400 px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg hover:bg-gray-800/50 flex items-center space-x-2 ${
                    currentView === item.view 
                      ? 'text-emerald-400 bg-emerald-900/20' 
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
                    className="relative hover-lift text-gray-300 hover:text-emerald-400 hover:bg-gray-800/50"
                    onClick={() => setIsNotificationsOpen(true)}
                    icon={<Bell className="w-4 h-4" />}
                  >
                    {unreadCount > 0 && (
                      <Badge 
                        variant="error" 
                        size="sm" 
                        className="absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center text-xs font-bold animate-pulse shadow-lg shadow-red-500/25"
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
                className="theme-toggle relative overflow-hidden transition-all duration-300 text-gray-300 hover:bg-gray-800/50 hover:text-emerald-400"
                icon={
                  <div className="relative">
                    {isDark ? (
                      <Sun className="w-4 h-4 transition-all duration-300" />
                    ) : (
                      <Moon className="w-4 h-4 transition-all duration-300" />
                    )}
                  </div>
                }
              />

              {/* Auth Buttons */}
              {!isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onSignIn}
                    className="btn-login border-0 text-white font-semibold shadow-lg"
                  >
                    Log In
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={onGetStarted}
                    className="btn-get-started border-0 text-white font-semibold shadow-lg"
                  >
                    Get Started
                  </Button>
                </div>
              ) : (
                /* User Profile Menu */
                <div className="relative" ref={profileRef}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 text-gray-300 hover:text-emerald-400 hover:bg-gray-800/50"
                    icon={<User className="w-4 h-4" />}
                  >
                    <span className="hidden sm:block">{user?.name || 'User'}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </Button>

                  {/* Profile Dropdown */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700/50 rounded-xl shadow-xl backdrop-blur-sm z-50">
                      <div className="py-2">
                        <div className="px-4 py-3 border-b border-gray-700/50">
                          <p className="text-sm font-medium text-white">{user?.name || 'User'}</p>
                          <p className="text-sm text-gray-400">{user?.email}</p>
                        </div>
                        
                        <div className="py-2">
                          <button
                            onClick={() => handleNavigation('profile')}
                            className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-emerald-400 hover:bg-gray-700/50 transition-colors flex items-center space-x-2"
                          >
                            <User className="w-4 h-4" />
                            <span>Profile</span>
                          </button>
                          
                          <button
                            onClick={() => handleNavigation('settings')}
                            className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-emerald-400 hover:bg-gray-700/50 transition-colors flex items-center space-x-2"
                          >
                            <Settings className="w-4 h-4" />
                            <span>Settings</span>
                          </button>
                          
                          <button
                            onClick={() => handleNavigation('help')}
                            className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-emerald-400 hover:bg-gray-700/50 transition-colors flex items-center space-x-2"
                          >
                            <HelpCircle className="w-4 h-4" />
                            <span>Help</span>
                          </button>
                        </div>
                        
                        <div className="border-t border-gray-700/50 py-2">
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-colors flex items-center space-x-2"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden text-gray-300 hover:text-emerald-400 hover:bg-gray-800/50"
                icon={isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              />
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-700/50 bg-gray-800/50 backdrop-blur-sm">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={item.name}
                      onClick={() => handleNavigation(item.view)}
                      className={`w-full text-left px-3 py-2 text-base font-medium rounded-lg transition-colors flex items-center space-x-2 ${
                        currentView === item.view
                          ? 'text-emerald-400 bg-emerald-900/20'
                          : 'text-gray-300 hover:text-emerald-400 hover:bg-gray-700/50'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Notifications Panel */}
      <NotificationsPanel
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </>
  );
};