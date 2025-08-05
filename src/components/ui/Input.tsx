import React, { forwardRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}, ref) => {
  const { theme } = useTheme();

  const baseInputStyles = `
    w-full px-4 py-2.5 rounded-lg border transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-1
    disabled:opacity-50 disabled:cursor-not-allowed
    ${icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : ''}
    ${disabled ? (theme === 'light' ? 'bg-gray-50' : 'bg-gray-700') : ''}
  `;

  const themeStyles = {
    light: `
      border-gray-300 bg-white text-gray-900 placeholder-gray-500
      focus:border-blue-500 focus:ring-blue-500/20
      ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
    `,
    'dark-neon': `
      border-gray-600 bg-gray-800 text-white placeholder-gray-400
      focus:border-cyan-400 focus:ring-cyan-400/20
      ${error ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''}
    `,
  };

  const combinedInputClassName = `
    ${baseInputStyles}
    ${themeStyles[theme]}
    ${className}
  `;

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className={`absolute inset-y-0 ${iconPosition === 'left' ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center pointer-events-none`}>
            <div className={`text-gray-400 ${theme === 'dark-neon' ? 'text-gray-500' : ''}`}>
              {icon}
            </div>
          </div>
        )}
        
        <input
          ref={ref}
          className={combinedInputClassName}
          disabled={disabled}
          {...props}
        />
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
});

Input.displayName = 'Input';