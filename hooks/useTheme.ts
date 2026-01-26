import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

const applyTheme = (newTheme: Theme) => {
  const root = document.documentElement;
  if (newTheme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Get theme from localStorage or default to light
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const initialTheme = savedTheme || 'light';
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const toggleTheme = () => {
    setTheme((currentTheme) => {
      const newTheme: Theme = currentTheme === 'light' ? 'dark' : 'light';
      return newTheme;
    });
  };

  useEffect(() => {
    if (mounted) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', theme);
        applyTheme(theme);
      }
    }
  }, [theme, mounted]);

  return { theme: mounted ? theme : 'light', toggleTheme };
};
