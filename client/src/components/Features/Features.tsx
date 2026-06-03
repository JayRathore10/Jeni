import React, { useEffect, useRef } from 'react';
import './Features.css';

const features = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M11 2L3 6v5c0 4.4 3.4 8.5 8 9.5 4.6-1 8-5.1 8-9.5V6L11 2z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M8 11l2 2 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'End-to-end encryption',
    desc: 'Every file is encrypted in transit and at rest with AES-256. Your data belongs to you — period.',
    tag: 'Security',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="9" stroke="currentColor" strokeWidth="1.7" />
        <path d="M7 11h8M11 7l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Instant sharing',
    desc: 'Share folders and files with a single link. Control permissions, expiry dates, and access levels.',
    tag: 'Collaboration',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="3" y="3" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.7" />
        <rect x="12" y="3" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.7" />
        <rect x="3" y="12" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.7" />
        <path d="M15.5 12v7M12 15.5h7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
    title: 'Smart organization',
    desc: 'AI-powered tagging and categorization. MyBox learns how you work and keeps everything in order.',
    tag: 'Productivity',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M11 2v6M11 14v6M2 11h6M14 11h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <circle cx="11" cy="11" r="3" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    ),
    title: 'Cross-platform sync',
    desc: 'Native apps for macOS, Windows, iOS, and Android. Your files are always up to date everywhere.',
    tag: 'Sync',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M4 14l4-4 3 3 3-5 4 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="2" y="2" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    ),
    title: 'Version history',
    desc: 'Every change is tracked. Roll back to any version of any file in seconds — up to 180 days.',
    tag: 'Recovery',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M17 8A6 6 0 1 0 6.5 13.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M10 16a4 4 0 1 0 8 0 4 4 0 0 0-8 0z" stroke="currentColor" strokeWidth="1.7" />
        <path d="M14 14v2l1.5 1.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'AI-powered search',
    desc: 'Search inside PDFs, images, and audio files. Find anything in milliseconds with natural language.',
    tag: 'AI',
  },
];

const Features: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('feature-card--visible');
          }
        });
      },
      { threshold: 0.15 }
    );

    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  const sectionObserver = useRef<IntersectionObserver | null>(null);
  useEffect(() => {
    sectionObserver.current = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) entry.target.classList.add('section--visible'); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) sectionObserver.current.observe(sectionRef.current);
    return () => sectionObserver.current?.disconnect();
  }, []);

  return (
    <section className="features section-fade" ref={sectionRef} id="features">
      <div className="features__container">
        <div className="features__header">
          <span className="section-label">Features</span>
          <h2 className="features__title">
            Built for how teams<br />actually work
          </h2>
          <p className="features__subtitle">
            Everything your team needs to store, organize, and collaborate —
            in one beautifully simple platform.
          </p>
        </div>

        <div className="features__grid">
          {features.map((f, i) => (
            <div
              key={i}
              className="feature-card"
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              style={{ '--delay': `${i * 0.1}s` } as React.CSSProperties}
            >
              <div className="feature-card__icon-wrap">
                {f.icon}
              </div>
              <div className="feature-card__tag">{f.tag}</div>
              <h3 className="feature-card__title">{f.title}</h3>
              <p className="feature-card__desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;