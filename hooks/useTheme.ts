import { useState, useEffect, useRef } from 'react';

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
  // Initialize theme from localStorage if available
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as Theme | null;
      return savedTheme || 'light';
    }
    return 'light';
  });
  const mountedRef = useRef(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Apply theme on mount
    if (!mountedRef.current && typeof window !== 'undefined') {
      mountedRef.current = true;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMounted(true);
      const savedTheme = localStorage.getItem('theme') as Theme | null;
      const initialTheme = savedTheme || 'light';
      if (initialTheme !== theme) {
        setTheme(initialTheme);
      } else {
        applyTheme(theme);
      }
    }
  }, [theme]);

  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
      applyTheme(theme);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((currentTheme) => {
      const newTheme: Theme = currentTheme === 'light' ? 'dark' : 'light';
      // Apply immediately to ensure instant feedback
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
      }
      return newTheme;
    });
  };

  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
      applyTheme(theme);
    }
  }, [theme, mounted]);

  return { theme: mounted ? theme : 'light', toggleTheme };
};
