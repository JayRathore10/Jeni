import React from 'react';
import './Footer.css';

const footerLinks = {
  Product: ['Features', 'Pricing', 'Changelog', 'Roadmap', 'API'],
  Company: ['About', 'Blog', 'Careers', 'Press', 'Contact'],
  Resources: ['Documentation', 'Community', 'Status', 'Security', 'Privacy'],
  Legal: ['Terms', 'Privacy Policy', 'Cookie Policy', 'GDPR', 'DPA'],
};

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="footer__brand">
          <a href="/" className="footer__logo">
            <span className="footer__logo-icon">
              <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
                <rect x="2" y="2" width="8" height="8" rx="2" fill="currentColor" opacity="0.9"/>
                <rect x="12" y="2" width="8" height="8" rx="2" fill="currentColor" opacity="0.6"/>
                <rect x="2" y="12" width="8" height="8" rx="2" fill="currentColor" opacity="0.6"/>
                <rect x="12" y="12" width="8" height="8" rx="2" fill="currentColor"/>
              </svg>
            </span>
            MyBox
          </a>
          <p className="footer__tagline">
            The intelligent cloud file manager for modern teams. Store, share, and collaborate — effortlessly.
          </p>
          <div className="footer__socials">
            {[
              { label: 'Twitter', path: 'M22 4.01s-.77 1.03-1.56 1.41C21.25 2.39 19.5.5 17 .5c-2.49 0-4.5 2.01-4.5 4.5 0 .35.04.7.11 1.03C8.31 5.83 4.6 3.84 2.15 0.77c-.39.66-.61 1.43-.61 2.25 0 1.55.79 2.92 2 3.72-.74-.02-1.43-.23-2.04-.57v.06c0 2.17 1.55 3.99 3.6 4.4-.38.1-.77.16-1.18.16-.29 0-.57-.03-.84-.08.57 1.77 2.22 3.06 4.18 3.09C5.51 14.97 3.47 15.7 1.27 15.7c-.36 0-.72-.02-1.07-.06C2.23 17.01 4.49 17.75 6.94 17.75c8.33 0 12.88-6.9 12.88-12.88l-.01-.59C20.72 3.85 21.45 3 22 2.35V4.01z' },
              { label: 'GitHub', path: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12' },
              { label: 'LinkedIn', path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
            ].map((social) => (
              <a key={social.label} href="#" className="footer__social-link" aria-label={social.label}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d={social.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        <div className="footer__links">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="footer__link-col">
              <h4 className="footer__link-heading">{category}</h4>
              <ul className="footer__link-list">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="footer__link">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="footer__bottom">
        <span className="footer__copy">© {new Date().getFullYear()} MyBox, Inc. All rights reserved.</span>
        <div className="footer__bottom-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Cookies</a>
        </div>
        <div className="footer__status">
          <span className="footer__status-dot" />
          All systems operational
        </div>
      </div>
    </footer>
  );
};

export default Footer;