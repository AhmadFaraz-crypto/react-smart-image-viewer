import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ImageViewer } from 'react-smart-image-viewer';
import styles from './Hero.module.scss';

const HERO_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
    alt: 'Mountain landscape with dramatic clouds',
    title: 'Alpine Majesty',
  },
  {
    src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&q=80',
    alt: 'Foggy forest valley',
    title: 'Misty Valley',
  },
  {
    src: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1920&q=80',
    alt: 'Waterfall in forest',
    title: 'Hidden Falls',
  },
];

export const Hero: React.FC = () => {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const handleOpenViewer = (index: number) => {
    setViewerIndex(index);
    setIsViewerOpen(true);
  };

  const handleCloseViewer = () => {
    setIsViewerOpen(false);
  };

  return (
    <section className={styles.hero}>
      <div className={styles.background}>
        <div className={styles.gradientOrb1} />
        <div className={styles.gradientOrb2} />
        <div className={styles.gridPattern} />
      </div>

      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.badge}>
            <span className={styles.badgeIcon}>✨</span>
            <span>TypeScript-first • SSR-safe • Accessible</span>
          </div>

          <h1 className={styles.title}>
            React Smart <br />
            <span>Image Viewer</span>
          </h1>

          <p className={styles.description}>
            A high-performance, lightweight React image viewer with zoom, pan, 
            keyboard navigation, and mobile gesture support. Perfect for galleries, 
            portfolios, and any image-heavy application.
          </p>

          <div className={styles.actions}>
            <Link to="/demos" className={styles.primaryButton}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              View Demos
            </Link>
            <Link to="/docs" className={styles.secondaryButton}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
              </svg>
              Documentation
            </Link>
          </div>

          <div className={styles.install}>
            <code>
              <span className={styles.prompt}>$</span> npm install react-smart-image-viewer
            </code>
            <button
              className={styles.copyButton}
              onClick={() => navigator.clipboard.writeText('npm install react-smart-image-viewer')}
              aria-label="Copy install command"
              type="button"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
              </svg>
            </button>
          </div>
        </div>

        <div className={styles.preview}>
          <div className={styles.previewWindow}>
            <div className={styles.windowHeader}>
              <div className={styles.windowDots}>
                <span />
                <span />
                <span />
              </div>
              <span className={styles.windowTitle}>Preview</span>
            </div>
            <div className={styles.gallery}>
              {HERO_IMAGES.map((image, index) => (
                <button
                  key={index}
                  className={styles.galleryItem}
                  onClick={() => handleOpenViewer(index)}
                  type="button"
                  aria-label={`View ${image.title}`}
                >
                  <img src={`${image.src}&w=400`} alt={image.alt} loading="lazy" />
                  <div className={styles.galleryOverlay}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <circle cx="11" cy="11" r="8" />
                      <path d="M21 21l-4.35-4.35M11 8v6M8 11h6" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
            <p className={styles.hint}>Click any image to try the viewer →</p>
          </div>
        </div>
      </div>

      <div className={styles.features}>
        <div className={styles.feature}>
          <div className={styles.featureIcon}>🚀</div>
          <div className={styles.featureText}>
            <strong>High Performance</strong>
            <span>Optimized rendering with RAF</span>
          </div>
        </div>
        <div className={styles.feature}>
          <div className={styles.featureIcon}>📱</div>
          <div className={styles.featureText}>
            <strong>Mobile Ready</strong>
            <span>Touch & gesture support</span>
          </div>
        </div>
        <div className={styles.feature}>
          <div className={styles.featureIcon}>♿</div>
          <div className={styles.featureText}>
            <strong>Accessible</strong>
            <span>ARIA & keyboard support</span>
          </div>
        </div>
        <div className={styles.feature}>
          <div className={styles.featureIcon}>🎨</div>
          <div className={styles.featureText}>
            <strong>Customizable</strong>
            <span>Headless-friendly API</span>
          </div>
        </div>
      </div>

      <ImageViewer
        images={HERO_IMAGES}
        initialIndex={viewerIndex}
        isOpen={isViewerOpen}
        onClose={handleCloseViewer}
        showControls
        showNavigation
        showCounter
      />
    </section>
  );
};

