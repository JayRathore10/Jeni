import React, { useEffect, useRef } from 'react';
import './HowItWorks.css';

const steps = [
  {
    number: '01',
    title: 'Create your workspace',
    desc: 'Sign up in 30 seconds. No credit card required. Your personal cloud workspace is ready instantly — organized exactly how you think.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.7" />
        <rect x="13" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.7" />
        <rect x="3" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.7" />
        <path d="M17 13v8M13 17h8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Upload and organize',
    desc: 'Drag and drop files from your desktop, import from Google Drive or Dropbox, or connect your tools. AI automatically suggests tags and folders.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 16V4M7 9l5-5 5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 20h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" opacity="0.5" />
        <path d="M4 14v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Collaborate in real-time',
    desc: "Invite teammates, set permissions, and work together seamlessly. Comments, version history, and activity feed keep everyone aligned.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="17" cy="8" r="3" stroke="currentColor" strokeWidth="1.7" />
        <path d="M3 20c0-3.3 2.7-6 6-6h6c3.3 0 6 2.7 6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Access from anywhere',
    desc: 'Every file, every device, always in sync. Native apps for Mac, Windows, iOS, and Android — or access everything from your browser.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
        <path d="M12 3c-2 3-3 5.5-3 9s1 6 3 9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M12 3c2 3 3 5.5 3 9s-1 6-3 9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M3.5 9h17M3.5 15h17" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" opacity="0.5" />
      </svg>
    ),
  },
];

const HowItWorks: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) e.target.classList.add('section--visible'); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);

    const stepObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('hiw-step--visible');
        });
      },
      { threshold: 0.2 }
    );

    stepRefs.current.forEach((s) => { if (s) stepObs.observe(s); });
    return () => { obs.disconnect(); stepObs.disconnect(); };
  }, []);

  return (
    <section className="hiw section-fade" ref={sectionRef} id="how-it-works">
      <div className="hiw__container">
        <div className="hiw__header">
          <span className="section-label">How it works</span>
          <h2 className="hiw__title">Up and running in minutes</h2>
          <p className="hiw__sub">
            No complex setup. No IT required. Get started in seconds and
            scale to thousands of users effortlessly.
          </p>
        </div>

        <div className="hiw__steps">
          {steps.map((step, i) => (
            <div
              key={i}
              className="hiw-step"
              ref={(el) => {
                stepRefs.current[i] = el;
              }}
              style={{ '--delay': `${i * 0.12}s` } as React.CSSProperties}
            >
              {i < steps.length - 1 && <div className="hiw-step__connector" />}
              <div className="hiw-step__number-wrap">
                <div className="hiw-step__icon">{step.icon}</div>
                <div className="hiw-step__number">{step.number}</div>
              </div>
              <div className="hiw-step__body">
                <h3 className="hiw-step__title">{step.title}</h3>
                <p className="hiw-step__desc">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="hiw__cta-wrap">
          <div className="hiw__cta-card">
            <h3 className="hiw__cta-title">Ready to get started?</h3>
            <p className="hiw__cta-sub">Join 50,000+ teams using Jeni today. Free forever for individuals.</p>
            <div className="hiw__cta-actions">
              <a href="#" className="hiw__btn hiw__btn--primary">Start for free</a>
              <a href="#" className="hiw__btn hiw__btn--ghost">Talk to sales →</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;