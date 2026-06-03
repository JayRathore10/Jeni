import React, { useEffect, useRef, useState } from 'react';
import './Stats.css';

const stats = [
  { value: '50K+', label: 'Active teams', sub: 'across 90 countries', icon: '🌍' },
  { value: '2.4B', label: 'Files stored', sub: 'and counting', icon: '📁' },
  { value: '99.99%', label: 'Uptime SLA', sub: 'enterprise-grade reliability', icon: '⚡' },
  { value: '<50ms', label: 'Global latency', sub: 'with 18 edge locations', icon: '🚀' },
];

const Stats: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          e.target.classList.add('section--visible');
        }
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="stats section-fade" ref={sectionRef} id="stats">
      <div className="stats__container">
        <div className="stats__header">
          <span className="section-label">By the numbers</span>
          <h2 className="stats__title">Trusted at scale</h2>
          <p className="stats__sub">
            Infrastructure built to handle anything — from solo creators to Fortune 500 enterprises.
          </p>
        </div>

        <div className="stats__grid">
          {stats.map((s, i) => (
            <div
              key={i}
              className={`stat-card ${visible ? 'stat-card--visible' : ''}`}
              style={{ '--delay': `${i * 0.1}s` } as React.CSSProperties}
            >
              <div className="stat-card__emoji">{s.icon}</div>
              <div className="stat-card__value">{s.value}</div>
              <div className="stat-card__label">{s.label}</div>
              <div className="stat-card__sub">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Logos */}
        {/* <div className="stats__logos">
          <p className="stats__logos-text">Trusted by teams at</p>
          <div className="stats__logos-row">
            {['Figma','Shopify','Vercel','Notion','Linear','Framer'].map((name, i) => (
              <div key={i} className="stats__logo-item">{name}</div>
            ))}
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default Stats;