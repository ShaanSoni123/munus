import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from './Input';
import { useTheme } from '../../contexts/ThemeContext';

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  error,
  helperText,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const { theme } = useTheme();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const eyeIcon = showPassword ? (
    <EyeOff className="w-4 h-4 cursor-pointer" onClick={togglePasswordVisibility} />
  ) : (
    <Eye className="w-4 h-4 cursor-pointer" onClick={togglePasswordVisibility} />
  );

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          className={`
            w-full px-4 py-2.5 pr-10 rounded-lg border transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-1
            disabled:opacity-50 disabled:cursor-not-allowed
            ${disabled ? (theme === 'light' ? 'bg-gray-50' : 'bg-gray-700') : ''}
            ${theme === 'light' 
              ? 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20' 
              : 'border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20'
            }
            ${error ? (theme === 'light' ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-red-400 focus:border-red-400 focus:ring-red-400/20') : ''}
            ${className}
          `}
          disabled={disabled}
          {...props}
        />
        
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <div className={`${theme === 'dark-neon' ? 'text-gray-500' : 'text-gray-400'} hover:text-gray-600 dark:hover:text-gray-300 transition-colors`}>
            {eyeIcon}
          </div>
        </div>
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
          <span className="mr-1">⚠</span>
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
    </div>
  );
}; 