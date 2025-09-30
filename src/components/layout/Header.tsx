import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Menu, X, User, Settings, LogOut, Sun, Moon, Zap, Bell, Home, ChevronDown, HelpCircle, Mail, LayoutDashboard } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { NotificationsPanel } from '../notifications/NotificationsPanel';
import { notificationService } from '../../services/notificationService';
import { useApi } from '../../hooks/useApi';
import logoImage from '../../assets/Logo.png';

interface HeaderProps {
  // Props are now optional since we're using React Router
}

export const Header: React.FC<HeaderProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated, isEmployer, isJobSeeker } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const profileRef = useRef<HTMLDivElement>(null);
  
  // Get current view from location pathname
  const currentView = location.pathname.replace('/', '') || 'home';

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
        { name: 'Home', path: '/', view: 'home' as const, icon: Home },
        { name: 'Find Jobs', path: '/jobs', view: 'jobs' as const, icon: User },
        { name: 'Resume Builder', path: '/resume', view: 'resume' as const, icon: User },
      ];
    }

    if (isEmployer) {
      return [
        { name: 'Dashboard', path: '/dashboard', view: 'dashboard' as const, icon: LayoutDashboard },
        { name: 'Find Candidates', path: '/candidates', view: 'candidates' as const, icon: User },
      ];
    } else if (isJobSeeker) {
      return [
        { name: 'Dashboard', path: '/dashboard', view: 'dashboard' as const, icon: LayoutDashboard },
        { name: 'Find Jobs', path: '/jobs', view: 'jobs' as const, icon: User },
        { name: 'Resume Builder', path: '/resume', view: 'resume' as const, icon: User },
        { name: 'My Profile', path: '/profile', view: 'profile' as const, icon: User },
      ];
    }

    return [];
  };

  // Memoize navigation to avoid recalculating on every render
  const navigation = useMemo(() => getNavigation(), [isAuthenticated, isEmployer, isJobSeeker, currentView, theme]);

  // Memoize handlers
  const handleNavigation = useCallback((path: string) => {
    navigate(path);
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [navigate]);

  const handleGetStarted = useCallback(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/create-profile');
    }
  }, [isAuthenticated, navigate]);

  const handleSignIn = useCallback(() => {
    navigate('/login');
  }, [navigate]);

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
                onClick={() => handleNavigation('/')}
                className="flex-shrink-0 flex items-center space-x-2 hover:opacity-80 transition-all duration-200 hover:scale-105"
              >
                <div className="w-10 h-10 flex items-center justify-center bg-white rounded-lg p-1 border-2 border-emerald-400 shadow-lg shadow-emerald-500/25">
                  <img 
                    src={logoImage} 
                    alt="Munus Logo" 
                    className="w-full h-full object-contain transition-all duration-300"
                    style={{ minWidth: '30px', minHeight: '30px' }}
                    onError={(e) => {
                      console.log('Logo failed to load:', e);
                      console.log('Logo src:', logoImage);
                      // Hide image and show fallback
                      (e.target as HTMLImageElement).style.display = 'none';
                      const fallback = (e.target as HTMLImageElement).nextElementSibling;
                      if (fallback) fallback.classList.remove('hidden');
                    }}
                    onLoad={() => {
                      console.log('Logo loaded successfully');
                      console.log('Logo src:', logoImage);
                    }}
                  />
                  <div className="hidden w-full h-full bg-emerald-400 rounded-md flex items-center justify-center text-white font-bold text-xs">
                    M
                  </div>
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
                  onClick={() => handleNavigation(item.path)}
                  className={`text-gray-300 hover:text-emerald-400 px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg hover:bg-gray-800/50 flex items-center space-x-2 ${
                    location.pathname === item.path 
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
                    variant="ghost"
                    size="sm"
                    onClick={handleSignIn}
                    className="btn-login !border-2 !border-white/30 !text-white !font-semibold !shadow-lg hover:!bg-white/10 hover:!border-white/50 !transition-all !duration-200 !bg-transparent !backdrop-blur-sm"
                  >
                    Log In
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleGetStarted}
                    className="btn-get-started !border-0 !text-white !font-semibold !shadow-lg !bg-gradient-to-r !from-emerald-500 !to-cyan-500 hover:!from-emerald-600 hover:!to-cyan-600 !transition-all !duration-200"
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
                            onClick={() => handleNavigation('/profile')}
                            className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-emerald-400 hover:bg-gray-700/50 transition-colors flex items-center space-x-2"
                          >
                            <User className="w-4 h-4" />
                            <span>Profile</span>
                          </button>
                          
                          <button
                            onClick={() => handleNavigation('/settings')}
                            className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-emerald-400 hover:bg-gray-700/50 transition-colors flex items-center space-x-2"
                          >
                            <Settings className="w-4 h-4" />
                            <span>Settings</span>
                          </button>
                          
                          <button
                            onClick={() => handleNavigation('/faqs')}
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
                      onClick={() => handleNavigation(item.path)}
                      className={`w-full text-left px-3 py-2 text-base font-medium rounded-lg transition-colors flex items-center space-x-2 ${
                        location.pathname === item.path
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