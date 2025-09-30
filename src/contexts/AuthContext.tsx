import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService, type RegisterRequest } from '../services/authService';
import type { User } from '../types';

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string, role: 'jobseeker' | 'employer') => Promise<void>;
  loginWithGoogle: (googleUserInfo: any) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateUser: (userData: User) => void;
  loading: boolean;
  isAuthenticated: boolean;
  isJobSeeker: boolean;
  isEmployer: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('🔄 Initializing auth state...');
        const storedUser = authService.getCurrentUser();
        const hasToken = authService.isAuthenticated();
        
        console.log('📋 Auth initialization check:', {
          hasStoredUser: !!storedUser,
          hasToken: hasToken,
          storedUserRole: storedUser?.role
        });
        
        if (storedUser && hasToken) {
          console.log('✅ Found valid user session, setting user state');
          // Ensure the user object has the correct structure
          const validatedUser = {
            ...storedUser,
            id: storedUser.id || storedUser._id,
            role: storedUser.role
          };
          console.log('🔧 Validated user object:', validatedUser);
          setUser(validatedUser);
        } else if (storedUser && !hasToken) {
          console.warn('⚠️ Found user data but no token, clearing invalid session');
          authService.logout();
          setUser(null);
        } else if (!storedUser && hasToken) {
          console.warn('⚠️ Found token but no user data, clearing invalid session');
          authService.logout();
          setUser(null);
        } else {
          console.log('ℹ️ No valid session found');
          setUser(null);
        }
      } catch (error) {
        console.error('❌ Failed to initialize auth:', error);
        authService.logout();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
    
    // Listen for localStorage changes and force auth refresh
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'skillglide-user' || e.key === 'skillglide-access-token') {
        console.log('🔄 Storage change detected, reinitializing auth...');
        setTimeout(initializeAuth, 100);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom auth events
    const handleAuthEvent = () => {
      console.log('🔄 Custom auth event detected, reinitializing...');
      setTimeout(initializeAuth, 100);
    };
    
    window.addEventListener('auth-state-changed', handleAuthEvent);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-state-changed', handleAuthEvent);
    };
  }, []);

  const login = async (email: string, password: string, role: 'jobseeker' | 'employer') => {
    console.log('🔐 AuthContext login called', { email, role });
    setLoading(true);
    try {
      const response = await authService.login(email, password, role);
      console.log('✅ Login response received', { user: response.user });
      
      // Set user immediately with proper structure
      const userObj = {
        ...response.user,
        id: response.user._id || response.user.id,
        role: response.user.role
      };
      
      setUser(userObj);
      console.log('👤 User state set to:', userObj);
      
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterRequest) => {
    console.log('📝 AuthContext register called with:', userData);
    setLoading(true);
    try {
      const response = await authService.register(userData);
      console.log('✅ Registration response received:', response);
      
      // Set user immediately with proper structure
      const userObj = {
        ...response.user,
        id: response.user._id || response.user.id,
        role: response.user.role
      };
      
      setUser(userObj);
      console.log('👤 User state set to:', userObj);
      
    } catch (error) {
      console.error('❌ Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(() => {
    try {
      authService.logout();
      setUser(null);
      // Let the router handle navigation instead of forcing a page reload
      window.dispatchEvent(new CustomEvent('auth-logout'));
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  const refreshUser = async () => {
    try {
      const storedUser = authService.getCurrentUser();
      if (storedUser) {
        setUser(storedUser);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      logout();
    }
  };

  const updateUser = (userData: User) => {
    console.log('🔄 AuthContext updateUser called with:', userData);
    setUser(userData);
    // Also update localStorage
    authService.setCurrentUser(userData);
  };

  const loginWithGoogle = async (googleUserInfo: any) => {
    console.log('🔐 AuthContext loginWithGoogle called with:', googleUserInfo);
    setLoading(true);
    
    try {
      // For now, create a temporary user object with Google info
      // User will complete profile creation to set their role and other details
      const tempUser: User = {
        id: `temp_${Date.now()}`,
        email: googleUserInfo.email,
        name: `${googleUserInfo.given_name || ''} ${googleUserInfo.family_name || ''}`.trim() || 'Google User',
        role: 'jobseeker', // Default role, can be changed in profile creation
        avatar_url: googleUserInfo.picture || '',
        is_active: true,
        is_verified: false,
        email_verified: true, // Google emails are verified
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString()
      };
      
      console.log('🆕 New Google user, created temp user:', tempUser);
      setUser(tempUser);
      authService.setCurrentUser(tempUser);
      
    } catch (error) {
      console.error('❌ Google login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Debug role detection
  const isJobSeeker = user?.role === 'jobseeker';
  const isEmployer = user?.role === 'employer';
  
  console.log('🔍 AuthContext role detection:', {
    user: user?.email,
    role: user?.role,
    isJobSeeker,
    isEmployer,
    isAuthenticated: !!user,
    userObject: user
  });

  // Additional validation to ensure role is properly set
  if (user && !user.role) {
    console.warn('⚠️ User object missing role property:', user);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginWithGoogle,
        register,
        logout,
        refreshUser,
        updateUser,
        loading,
        isAuthenticated: !!user,
        isJobSeeker,
        isEmployer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};