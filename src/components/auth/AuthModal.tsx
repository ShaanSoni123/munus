import React, { useState, useEffect } from 'react';
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
  const [userType, setUserType] = useState<'jobseeker' | 'employer'>('jobseeker');
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
      
      if (userType === 'employer' && !formData.company.trim()) {
        newErrors.company = 'Company name is required';
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
        console.log('🔐 Starting login process...', { email: formData.email, role: userType });
        await login(formData.email, formData.password, userType);
        console.log('✅ Login successful, closing modal and triggering routing...');
        // Close modal immediately after successful login
        onClose();
        // Trigger routing immediately - the AuthContext will handle the redirect
        onGetStarted?.();
      } else {
        console.log('📝 Starting registration process...', { email: formData.email, role: userType });
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: userType,
          ...(userType === 'employer' && { company: formData.company }),
        });
        console.log('✅ Registration successful, closing modal and triggering routing...');
        // Close modal immediately after successful registration
        onClose();
        // Trigger routing immediately - the AuthContext will handle the redirect
        onGetStarted?.();
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

        {/* User Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            I am a:
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setUserType('jobseeker')}
              className={`p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                userType === 'jobseeker'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 shadow-md'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <User className="w-5 h-5 mx-auto mb-1" />
              <span className="text-sm font-medium">Job Seeker</span>
            </button>
            <button
              type="button"
              onClick={() => setUserType('employer')}
              className={`p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                userType === 'employer'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 shadow-md'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <Building className="w-5 h-5 mx-auto mb-1" />
              <span className="text-sm font-medium">Employer</span>
            </button>
          </div>
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

          {mode === 'register' && userType === 'employer' && (
            <Input
              label="Company Name"
              placeholder="Tech Corp"
              value={formData.company}
              onChange={(e) => updateFormData('company', e.target.value)}
              icon={<Building className="w-4 h-4" />}
              error={errors.company}
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