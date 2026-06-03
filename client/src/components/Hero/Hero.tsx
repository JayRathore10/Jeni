import React, { useEffect, useRef } from 'react';
import './Hero.css';

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = heroRef.current;
    if (el) {
      requestAnimationFrame(() => el.classList.add('hero--visible'));
    }
  }, []);

  return (
    <section className="hero" ref={heroRef}>
      {/* Background orbs */}
      <div className="hero__orb hero__orb--1" />
      <div className="hero__orb hero__orb--2" />
      <div className="hero__orb hero__orb--3" />

      <div className="hero__container">
        <div className="hero__badge">
          <span className="hero__badge-dot" />
          Introducing MyBox 2.0 — Now with AI-powered search
        </div>

        <h1 className="hero__headline">
          Your files,<br />
          <span className="hero__headline-gradient">everywhere you work.</span>
        </h1>

        <p className="hero__subtext">
          MyBox is the intelligent cloud file manager built for modern teams.
          Organize, share, and collaborate on every file — from anywhere,
          on any device, with zero friction.
        </p>

        <div className="hero__actions">
          <a href="#" className="hero__cta hero__cta--primary">
            Start for free
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <a href="#" className="hero__cta hero__cta--secondary">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M6.5 5.5l4 2.5-4 2.5V5.5z" fill="currentColor"/>
            </svg>
            Watch demo
          </a>
        </div>

        <div className="hero__social-proof">
          <div className="hero__avatars">
            {['#4F8EF7','#7B61FF','#F97316','#22C55E','#EC4899'].map((c, i) => (
              <div key={i} className="hero__avatar" style={{ background: c }} />
            ))}
          </div>
          <span className="hero__social-text">
            Trusted by <strong>50,000+</strong> teams worldwide
          </span>
        </div>
      </div>

      {/* App preview */}
      <div className="hero__preview-wrap">
        <div className="hero__preview">
          <div className="hero__preview-bar">
            <span /><span /><span />
            <div className="hero__preview-url">mybox.app/files</div>
          </div>
          <div className="hero__preview-body">
            {/* Sidebar */}
            <div className="hero__preview-sidebar">
              <div className="hp-sidebar-logo">
                <div className="hp-logo-sq" />
                <span>MyBox</span>
              </div>
              {['File manager','Recent files','Favorites','Trash bin'].map((item, i) => (
                <div key={i} className={`hp-sidebar-item ${i === 0 ? 'hp-sidebar-item--active' : ''}`}>
                  <div className="hp-sidebar-dot" />
                  {item}
                </div>
              ))}
              <div className="hp-sidebar-divider" />
              <div className="hp-sidebar-section">Shared files</div>
              {['Team','School'].map((item, i) => (
                <div key={i} className="hp-sidebar-item">
                  <div className="hp-sidebar-dot hp-sidebar-dot--sm" />
                  {item}
                </div>
              ))}
            </div>
            {/* Main */}
            <div className="hero__preview-main">
              <div className="hp-toolbar">
                <div className="hp-search">
                  <div className="hp-search-icon" />
                  <div className="hp-search-bar" />
                </div>
                <div className="hp-toolbar-actions">
                  <div className="hp-action-btn" />
                  <div className="hp-action-btn" />
                  <div className="hp-create-btn">+ Create</div>
                </div>
              </div>
              <div className="hp-breadcrumb">
                <span>File manager</span> / <span className="hp-bc-active">Work stuff 2022</span>
              </div>
              <div className="hp-file-list">
                {[
                  { name: 'School paper.docx', size: '8.79 MB', type: 'doc' },
                  { name: 'Cool music.mp3', size: '2.19 MB', type: 'music' },
                  { name: 'Work keynote.pdf', size: '2 MB', type: 'pdf' },
                  { name: 'Holiday plans.xls', size: '1 MB', type: 'sheet' },
                  { name: 'Summer DJ mix.mp3', size: '8.79 MB', type: 'music' },
                  { name: 'IMG_OO84.jpg', size: '1 MB', type: 'img' },
                ].map((f, i) => (
                  <div key={i} className="hp-file-row">
                    <div className={`hp-file-icon hp-file-icon--${f.type}`} />
                    <div className="hp-file-name">{f.name}</div>
                    <div className="hp-file-size">{f.size}</div>
                    <div className="hp-file-share" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;