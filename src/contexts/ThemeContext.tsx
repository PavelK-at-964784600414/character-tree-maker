'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  // Initialize theme on client side only
  useEffect(() => {
    const storedTheme = localStorage.getItem('character-tree-theme') as Theme;
    console.log('Stored theme:', storedTheme);
    
    if (storedTheme) {
      setTheme(storedTheme);
      if (storedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      console.log('Applied stored theme:', storedTheme);
    } else {
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = isDarkMode ? 'dark' : 'light';
      setTheme(initialTheme);
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      console.log('Applied system theme:', initialTheme);
    }
    setMounted(true);
  }, []);

  // Update theme when it changes
  useEffect(() => {
    if (mounted) {
      console.log('Theme changed to:', theme);
      localStorage.setItem('character-tree-theme', theme);
      
      // More explicit class management
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        console.log('Added dark class to html element');
      } else {
        document.documentElement.classList.remove('dark');
        console.log('Removed dark class from html element');
      }
      
      // Log current classes
      console.log('HTML classes:', document.documentElement.className);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    console.log('Toggling theme from', theme, 'to', newTheme);
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
