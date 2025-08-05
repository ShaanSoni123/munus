import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const { theme } = useTheme();

  const baseStyles = `
    inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
    transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden
    ${fullWidth ? 'w-full' : ''}
    ${disabled || loading ? 'pointer-events-none' : ''}
  `;

  const sizeStyles = {
    sm: 'px-3 py-2 text-sm gap-1.5 h-9',
    md: 'px-4 py-2.5 text-base gap-2 h-10',
    lg: 'px-6 py-3 text-lg gap-2 h-12',
    xl: 'px-8 py-4 text-xl gap-3 h-14',
  };

  const variantStyles = {
    primary: `
      bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800
      text-white shadow-lg hover:shadow-xl focus:ring-blue-500
      ${theme === 'dark-neon' ? 'from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-cyan-500/25 hover:shadow-cyan-500/40' : ''}
      ${theme === 'light' ? 'text-white' : ''}
    `,
    secondary: `
      bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700
      text-white shadow-lg hover:shadow-xl focus:ring-purple-500
      ${theme === 'dark-neon' ? 'from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-purple-500/25' : ''}
    `,
    outline: `
      border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white
      focus:ring-blue-500 shadow-sm hover:shadow-md
      ${theme === 'dark-neon' ? 'border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black shadow-cyan-400/20' : ''}
      ${theme === 'light' ? 'text-white' : ''}
    `,
    ghost: `
      text-gray-700 hover:bg-gray-100 focus:ring-gray-500
      ${theme === 'dark-neon' ? 'text-gray-300 hover:bg-gray-800 focus:ring-cyan-500' : ''}
    `,
    danger: `
      bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700
      text-white shadow-lg hover:shadow-xl focus:ring-red-500
    `,
    success: `
      bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700
      text-white shadow-lg hover:shadow-xl focus:ring-green-500
    `,
  };

  const combinedClassName = `
    ${baseStyles}
    ${sizeStyles[size]}
    ${variantStyles[variant]}
    ${className}
  `;

  return (
    <button
      className={combinedClassName}
      disabled={disabled || loading}
      {...props}
    >
      {/* Loading Spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
        </div>
      )}
      
      {/* Content */}
      <div
        className={`flex items-center gap-2 ${loading ? 'opacity-0' : 'opacity-100'}
          ${variant === 'primary' && theme === 'light' ? '!text-white' : ''}
        `}
      >
        {!loading && icon && iconPosition === 'left' && (
          <span className={variant === 'primary' && theme === 'light' ? '!text-white [&>svg]:text-white [&>svg]:stroke-white' : ''}>
            {icon}
          </span>
        )}
        {!loading && children}
        {!loading && icon && iconPosition === 'right' && (
          <span className={variant === 'primary' && theme === 'light' ? '!text-white [&>svg]:text-white [&>svg]:stroke-white' : ''}>
            {icon}
          </span>
        )}
      </div>
    </button>
  );
};