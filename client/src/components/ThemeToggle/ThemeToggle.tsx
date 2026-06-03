import React, { useEffect, useState } from 'react';
import './ThemeToggle.css';

const getInitialTheme = (): 'light' | 'dark' => {
  // 1. User saved preference
  const saved = localStorage.getItem('mybox-theme') as 'light' | 'dark' | null;
  if (saved === 'light' || saved === 'dark') return saved;
  // 2. System preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
  // 3. Light fallback
  return 'light';
};

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const initial = getInitialTheme();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(initial);
    document.documentElement.setAttribute('data-theme', initial);
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('mybox-theme', next);
  };

  return (
    <button
      className={`theme-toggle ${theme === 'dark' ? 'theme-toggle--dark' : ''}`}
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <span className="theme-toggle__track">
        <span className="theme-toggle__thumb">
          {/* Sun */}
          <svg
            className="theme-toggle__icon theme-toggle__icon--sun"
            width="14" height="14" viewBox="0 0 24 24" fill="none"
          >
            <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          {/* Moon */}
          <svg
            className="theme-toggle__icon theme-toggle__icon--moon"
            width="14" height="14" viewBox="0 0 24 24" fill="none"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </span>
    </button>
  );
};

export default ThemeToggle;