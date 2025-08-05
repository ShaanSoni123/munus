import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  gradient?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  gradient = false,
}) => {
  const { theme } = useTheme();

  const baseStyles = `inline-flex items-center rounded-full font-medium transition-all duration-200 ${gradient ? 'bg-gradient-to-r' : ''}`;

  const sizeStyles = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const variantStyles = {
    default: {
      light: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
      'dark-neon': 'bg-gray-800 text-gray-200 hover:bg-gray-700',
    },
    primary: {
      light: gradient ? 'from-blue-500 to-blue-600 text-white shadow-lg' : 'bg-blue-100 text-blue-800 hover:bg-blue-200',
      'dark-neon': gradient ? 'from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25' : 'bg-cyan-900/30 text-cyan-300 ring-1 ring-cyan-500/50 hover:bg-cyan-800/40',
    },
    secondary: {
      light: gradient ? 'from-purple-500 to-purple-600 text-white shadow-lg' : 'bg-purple-100 text-purple-800 hover:bg-purple-200',
      'dark-neon': gradient ? 'from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25' : 'bg-purple-900/30 text-purple-300 ring-1 ring-purple-500/50 hover:bg-purple-800/40',
    },
    success: {
      light: gradient ? 'from-green-500 to-green-600 text-white shadow-lg' : 'bg-green-100 text-green-800 hover:bg-green-200',
      'dark-neon': gradient ? 'from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25' : 'bg-green-900/30 text-green-300 ring-1 ring-green-500/50 hover:bg-green-800/40',
    },
    warning: {
      light: gradient ? 'from-yellow-500 to-orange-500 text-white shadow-lg' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
      'dark-neon': gradient ? 'from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/25' : 'bg-yellow-900/30 text-yellow-300 ring-1 ring-yellow-500/50 hover:bg-yellow-800/40',
    },
    error: {
      light: gradient ? 'from-red-500 to-red-600 text-white shadow-lg' : 'bg-red-100 text-red-800 hover:bg-red-200',
      'dark-neon': gradient ? 'from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/25' : 'bg-red-900/30 text-red-300 ring-1 ring-red-500/50 hover:bg-red-800/40',
    },
    outline: {
      light: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
      'dark-neon': 'border border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10',
    },
  };

  const combinedClassName = `
    ${baseStyles}
    ${sizeStyles[size]}
    ${variantStyles[variant][theme]}
    ${className}
  `;

  return (
    <span className={combinedClassName}>
      {children}
    </span>
  );
};