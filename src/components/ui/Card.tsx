import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
  gradient?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  padding = 'md',
  onClick,
  gradient = false,
}) => {
  const { theme } = useTheme();

  const baseStyles = `
    rounded-2xl border transition-all duration-300
    ${onClick ? 'cursor-pointer' : ''}
    ${hover ? 'hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02]' : ''}
    ${gradient ? 'bg-gradient-to-br' : ''}
  `;

  const themeStyles = {
    light: `
      bg-white border-gray-200 shadow-sm
      ${hover ? 'hover:shadow-xl hover:border-gray-300 soft-shadow' : ''}
      ${gradient ? 'from-white to-gray-50' : ''}
    `,
    'dark-neon': `
      bg-gray-900 border-gray-700 shadow-lg shadow-cyan-500/5
      ${hover ? 'hover:shadow-2xl hover:shadow-cyan-500/20 hover:border-cyan-500/30 neon-glow' : ''}
      ${gradient ? 'from-gray-900 to-gray-800 border-gray-600' : ''}
    `,
  };

  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  const combinedClassName = `
    ${baseStyles}
    ${themeStyles[theme]}
    ${paddingStyles[padding]}
    ${className}
  `;

  return (
    <div className={combinedClassName} onClick={onClick}>
      {children}
    </div>
  );
};