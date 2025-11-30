import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Mail, Lock, User, Building, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
  onGetStarted?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'login',
  onGetStarted,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    company: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, register, loading } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setMode(defaultMode);
      setFormData({ name: '', email: '', password: '', company: '' });
      setErrors({});
      setIsSubmitting(false);
      setShowPassword(false);
    }
  }, [isOpen, defaultMode]);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (mode === 'register') {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      } else if (formData.name.trim().length < 2) {
        newErrors.name = 'Name must be at least 2 characters';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      if (mode === 'login') {
        console.log('🔐 Starting login process...', { email: formData.email });
        await login(formData.email, formData.password, 'jobseeker'); // Role parameter not used, will get from DB
        console.log('✅ Login successful, closing modal');
        onClose();
        // Redirect will be handled by LoginPage useEffect
      } else {
        console.log('📝 Starting registration process...', { email: formData.email });
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
        console.log('✅ Registration successful, redirecting to role selection');
        onClose();
        // Redirect to role selection after registration
        // Use setTimeout to ensure state is updated first
        setTimeout(() => {
          navigate('/role-selection');
        }, 100);
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      setErrors({ 
        general: mode === 'login' 
          ? 'Invalid email address or password' 
          : (error.message || 'Authentication failed. Please check your credentials and try again.')
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSignUpClick = () => {
    onClose();
    onGetStarted?.();
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
  };

  // Google Sign-In handler
  const handleGoogleSignIn = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setErrors({ general: 'Google Sign-In is not configured' });
      return;
    }

    // Redirect to Google OAuth
    const redirectUri = `${window.location.origin}/google-callback`;
    const scope = 'openid email profile';
    const responseType = 'code';
    
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${encodeURIComponent(clientId)}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=${encodeURIComponent(scope)}&` +
      `response_type=${encodeURIComponent(responseType)}`;
    
    console.log('🔄 Redirecting to Google OAuth:', googleAuthUrl);
    window.location.href = googleAuthUrl;
    setErrors({});
    setFormData({ name: '', email: '', password: '', company: '' });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <Card className={`w-full max-w-md relative animate-scale-in ${
        theme === 'dark-neon' ? 'shadow-2xl shadow-cyan-500/10' : 'shadow-2xl'
      }`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 z-10 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {mode === 'login' ? 'Welcome Back to Munus' : 'Join Munus'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {mode === 'login' 
              ? 'Sign in to your account to continue your career journey' 
              : 'Create your account and discover amazing opportunities'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <Input
              label="Full Name"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => updateFormData('name', e.target.value)}
              icon={<User className="w-4 h-4" />}
              error={errors.name}
              required
              fullWidth
              disabled={isSubmitting}
            />
          )}


          <Input
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={(e) => updateFormData('email', e.target.value)}
            icon={<Mail className="w-4 h-4" />}
            error={errors.email}
            required
            fullWidth
            disabled={isSubmitting}
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => updateFormData('password', e.target.value)}
              icon={<Lock className="w-4 h-4" />}
              error={errors.password}
              required
              fullWidth
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {errors.general && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-600 dark:text-red-400">{errors.general}</p>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={isSubmitting || loading}
            fullWidth
            className="shadow-lg"
          >
            {mode === 'login' ? 'Sign In to Munus' : 'Create Munus Account'}
          </Button>
        </form>

        {/* Divider */}
        <div className="mt-6 mb-6 flex items-center">
          <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
          <span className="px-3 text-sm text-gray-500 dark:text-gray-400">or</span>
          <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
        </div>

        {/* Google Sign-In Button */}
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={handleGoogleSignIn}
          disabled={isSubmitting}
          fullWidth
          className="!border-gray-300 !text-gray-700 dark:!text-gray-300 dark:!border-gray-600 hover:!bg-gray-50 dark:hover:!bg-gray-800 shadow-sm"
        >
          <div className="flex items-center justify-center space-x-3">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>{mode === 'login' ? 'Continue with Google' : 'Sign up with Google'}</span>
          </div>
        </Button>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {mode === 'login' ? "Don't have a Munus account?" : 'Already have a Munus account?'}
            <button
              onClick={mode === 'login' ? handleSignUpClick : switchMode}
              className="ml-1 text-blue-600 dark:text-blue-400 hover:underline font-medium transition-colors"
              disabled={isSubmitting}
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
};