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
      dark: 'bg-gray-800/50 text-gray-200 hover:bg-gray-700/50',
      'dark-neon': 'bg-gray-800 text-gray-200 hover:bg-gray-700',
    },
    primary: {
      light: gradient ? 'from-emerald-500 to-teal-500 text-white shadow-lg' : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200',
      dark: gradient ? 'from-emerald-500 to-teal-500 text-white shadow-lg' : 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/50 hover:bg-emerald-500/30',
      'dark-neon': gradient ? 'from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25' : 'bg-emerald-900/30 text-emerald-300 ring-1 ring-emerald-500/50 hover:bg-emerald-800/40',
    },
    secondary: {
      light: gradient ? 'from-emerald-500 to-cyan-500 text-white shadow-lg' : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200',
      dark: gradient ? 'from-emerald-500 to-cyan-500 text-white shadow-lg' : 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/50 hover:bg-emerald-500/30',
      'dark-neon': gradient ? 'from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/25' : 'bg-emerald-900/30 text-emerald-300 ring-1 ring-emerald-500/50 hover:bg-emerald-800/40',
    },
    success: {
      light: gradient ? 'from-emerald-500 to-emerald-600 text-white shadow-lg' : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200',
      dark: gradient ? 'from-emerald-500 to-emerald-600 text-white shadow-lg' : 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/50 hover:bg-emerald-500/30',
      'dark-neon': gradient ? 'from-emerald-500 to-emerald-500 text-white shadow-lg shadow-emerald-500/25' : 'bg-emerald-900/30 text-emerald-300 ring-1 ring-emerald-500/50 hover:bg-emerald-800/40',
    },
    warning: {
      light: gradient ? 'from-yellow-500 to-orange-500 text-white shadow-lg' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
      dark: gradient ? 'from-yellow-500 to-orange-500 text-white shadow-lg' : 'bg-yellow-500/20 text-yellow-400 ring-1 ring-yellow-500/50 hover:bg-yellow-500/30',
      'dark-neon': gradient ? 'from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/25' : 'bg-yellow-900/30 text-yellow-300 ring-1 ring-yellow-500/50 hover:bg-yellow-800/40',
    },
    error: {
      light: gradient ? 'from-red-500 to-red-600 text-white shadow-lg' : 'bg-red-100 text-red-800 hover:bg-red-200',
      dark: gradient ? 'from-red-500 to-red-600 text-white shadow-lg' : 'bg-red-500/20 text-red-400 ring-1 ring-red-500/50 hover:bg-red-500/30',
      'dark-neon': gradient ? 'from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/25' : 'bg-red-900/30 text-red-300 ring-1 ring-red-500/50 hover:bg-red-800/40',
    },
    outline: {
      light: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
      dark: 'border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10',
      'dark-neon': 'border border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/10',
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