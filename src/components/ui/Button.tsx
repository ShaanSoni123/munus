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
    transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden cursor-pointer
    ${fullWidth ? 'w-full' : ''}
    ${disabled || loading ? 'pointer-events-none cursor-not-allowed' : ''}
  `;

  const sizeStyles = {
    sm: 'px-3 py-2 text-sm gap-1.5 h-9',
    md: 'px-4 py-2.5 text-base gap-2 h-10',
    lg: 'px-6 py-3 text-lg gap-2 h-12',
    xl: 'px-8 py-4 text-xl gap-3 h-14',
  };

  const variantStyles = {
    primary: `
      bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600
      text-white shadow-lg hover:shadow-xl focus:ring-emerald-500
      ${theme === 'dark-neon' ? 'shadow-emerald-500/25 hover:shadow-emerald-500/40' : ''}
      ${theme === 'light' ? 'text-white' : ''}
    `,
    secondary: `
      bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600
      text-white shadow-lg hover:shadow-xl focus:ring-emerald-500
      ${theme === 'dark-neon' ? 'shadow-emerald-500/25 hover:shadow-emerald-500/40' : ''}
    `,
    outline: `
      border-2 border-emerald-500 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300
      focus:ring-emerald-500 shadow-sm hover:shadow-md
      ${theme === 'dark-neon' ? 'border-emerald-400 text-emerald-400 hover:bg-emerald-500/10 shadow-emerald-400/20' : ''}
      ${theme === 'light' ? 'text-emerald-600 border-emerald-600 hover:bg-emerald-50' : ''}
    `,
    ghost: `
      text-gray-300 hover:bg-gray-800/50 focus:ring-emerald-500
      ${theme === 'dark-neon' ? 'text-gray-300 hover:bg-gray-800/50 focus:ring-emerald-500' : ''}
      ${theme === 'light' ? 'text-gray-700 hover:bg-gray-100 focus:ring-emerald-500' : ''}
    `,
    danger: `
      bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700
      text-white shadow-lg hover:shadow-xl focus:ring-red-500
    `,
    success: `
      bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700
      text-white shadow-lg hover:shadow-xl focus:ring-emerald-500
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