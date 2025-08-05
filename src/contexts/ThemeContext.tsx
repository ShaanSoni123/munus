import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Theme } from '../types';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('munus-theme');
    // Only use saved theme if user has explicitly set it (not on first visit)
    if (saved && saved !== 'light') {
      return saved as Theme;
    }
    // Default to light theme for new users
    return 'light';
  });

  const isDark = theme === 'dark-neon';

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark-neon' : 'light';
    setTheme(newTheme);
  };

  useEffect(() => {
    localStorage.setItem('munus-theme', theme);
    document.documentElement.className = theme;
    
    // Apply theme-specific body classes
    if (theme === 'dark-neon') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};