import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.scss';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Link to="/" className={styles.logo}>
              <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <rect width="32" height="32" rx="6" fill="url(#footerGradient)" />
                <defs>
                  <linearGradient id="footerGradient" x1="0" y1="0" x2="32" y2="32">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
                <rect x="6" y="8" width="20" height="16" rx="2" stroke="white" strokeWidth="1.5" fill="none" />
                <circle cx="12" cy="14" r="2" fill="white" />
                <path d="M8 20 L14 16 L18 19 L22 15 L26 19 L26 22 C26 22.5523 25.5523 23 25 23 L9 23 C8.44772 23 8 22.5523 8 22 L8 20Z" fill="white" opacity="0.9" />
              </svg>
              <span>React Smart Image Viewer</span>
            </Link>
            <p className={styles.description}>
              A high-performance, TypeScript-first React image viewer with zoom, pan, and mobile gesture support.
            </p>
          </div>

          <div className={styles.links}>
            <h4>Documentation</h4>
            <ul>
              <li><Link to="/docs">Getting Started</Link></li>
              <li><Link to="/docs#props">API Reference</Link></li>
              <li><Link to="/docs#accessibility">Accessibility</Link></li>
            </ul>
          </div>

          <div className={styles.links}>
            <h4>Demos</h4>
            <ul>
              <li><Link to="/demos#basic">Basic Usage</Link></li>
              <li><Link to="/demos#gallery">Gallery Mode</Link></li>
              <li><Link to="/demos#customization">Customization</Link></li>
            </ul>
          </div>

          <div className={styles.links}>
            <h4>Resources</h4>
            <ul>
              <li>
                <a href="https://www.npmjs.com/package/react-smart-image-viewer" target="_blank" rel="noopener noreferrer">
                  npm Package
                </a>
              </li>
              <li>
                <a href="https://github.com/AhmadFaraz-crypto/react-smart-image-viewer" target="_blank" rel="noopener noreferrer">
                  GitHub Repository
                </a>
              </li>
              <li>
                <a href="https://github.com/AhmadFaraz-crypto/react-smart-image-viewer/issues" target="_blank" rel="noopener noreferrer">
                  Report Issues
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {currentYear} React Smart Image Viewer. Released under the MIT License.
          </p>
          <div className={styles.social}>
            <a
              href="https://github.com/AhmadFaraz-crypto/react-smart-image-viewer"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

