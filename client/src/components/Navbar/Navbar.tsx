import React, { useEffect, useState } from 'react';
import './Navbar.css';
import ThemeToggle from '../ThemeToggle/ThemeToggle';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        <a href="/" className="navbar__logo">
          <span className="navbar__logo-icon">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect x="2" y="2" width="8" height="8" rx="2" fill="currentColor" opacity="0.9"/>
              <rect x="12" y="2" width="8" height="8" rx="2" fill="currentColor" opacity="0.6"/>
              <rect x="2" y="12" width="8" height="8" rx="2" fill="currentColor" opacity="0.6"/>
              <rect x="12" y="12" width="8" height="8" rx="2" fill="currentColor"/>
            </svg>
          </span>
          <span className="navbar__logo-text">Jeni</span>
        </a>

        <ul className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
          <li><a href="#features" className="navbar__link">Features</a></li>
          <li><a href="#how-it-works" className="navbar__link">How it works</a></li>
          <li><a href="#stats" className="navbar__link">Stats</a></li>
          <li><a href="#pricing" className="navbar__link">Pricing</a></li>
        </ul>

        <div className="navbar__actions">
          <ThemeToggle />
          <a href="#" className="navbar__btn navbar__btn--ghost">Sign in</a>
          <a href="#" className="navbar__btn navbar__btn--primary">Get started free</a>
        </div>

        <button
          className={`navbar__hamburger ${menuOpen ? 'navbar__hamburger--open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;