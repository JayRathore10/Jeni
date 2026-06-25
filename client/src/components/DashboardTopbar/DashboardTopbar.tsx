import React, { useState, useRef, useEffect } from 'react';
import './DashboardTopbar.css';
import ThemeToggle from '../ThemeToggle/ThemeToggle';

interface Props {
  onSearch: (query: string) => void;
  onToggleSidebar: () => void;
}

const DashboardTopbar: React.FC<Props> = ({ onSearch, onToggleSidebar }) => {
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <header className="dash-topbar">
      <button className="dash-topbar__menu-btn" onClick={onToggleSidebar} aria-label="Toggle sidebar">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>

      <div className="dash-topbar__search">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" className="dash-topbar__search-icon">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
          <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          placeholder="Search files and folders"
          value={query}
          onChange={handleChange}
          className="dash-topbar__search-input"
        />
        {query && (
          <button className="dash-topbar__search-clear" onClick={() => { setQuery(''); onSearch(''); }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      <div className="dash-topbar__actions">
        <ThemeToggle />

        <button className="dash-topbar__icon-btn" title="Notifications">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
            <path d="M18 8a6 6 0 1 0-12 0c0 3.5-1 5.5-2 7h16c-1-1.5-2-3.5-2-7z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9.5 19a2.5 2.5 0 0 0 5 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
          <span className="dash-topbar__notif-dot" />
        </button>

        <div className="dash-topbar__user" ref={menuRef}>
          <button className="dash-topbar__avatar" onClick={() => setMenuOpen(!menuOpen)}>
            YA
          </button>
          {menuOpen && (
            <div className="dash-topbar__user-menu">
              <div className="dash-topbar__user-info">
                <span className="dash-topbar__user-name">You</span>
                <span className="dash-topbar__user-email">you@mybox.app</span>
              </div>
              <div className="dash-topbar__divider" />
              <button className="dash-topbar__user-item">Account settings</button>
              <button className="dash-topbar__user-item">Help &amp; feedback</button>
              <div className="dash-topbar__divider" />
              <button className="dash-topbar__user-item dash-topbar__user-item--danger">Sign out</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardTopbar;