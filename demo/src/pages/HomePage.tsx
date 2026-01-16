import React from 'react';
import { Link } from 'react-router-dom';
import { Hero } from '../components/Hero/Hero';
import { CodeBlock } from '../components/CodeBlock/CodeBlock';
import styles from './HomePage.module.scss';

const QUICK_START_CODE = `import { ImageViewer } from 'react-smart-image-viewer';
import 'react-smart-image-viewer/styles.css';

const App = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Open Image
      </button>
      
      <ImageViewer
        images="https://example.com/image.jpg"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        showControls
        showNavigation
      />
    </>
  );
};`;

const GALLERY_CODE = `const images = [
  { src: '/image1.jpg', alt: 'Nature', title: 'Beautiful Landscape' },
  { src: '/image2.jpg', alt: 'City', title: 'Urban Photography' },
  { src: '/image3.jpg', alt: 'Portrait', title: 'Portrait Shot' },
];

<ImageViewer
  images={images}
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  initialIndex={0}
  loop
/>`;

const HOOK_CODE = `import { ImageViewer, useImageViewer } from 'react-smart-image-viewer';

const Gallery = ({ images }) => {
  const viewer = useImageViewer({ 
    totalImages: images.length,
    loop: true,
  });

  return (
    <>
      {images.map((img, i) => (
        <img 
          key={i} 
          src={img.thumbnail} 
          onClick={() => viewer.open(i)} 
        />
      ))}
      
      <ImageViewer 
        images={images} 
        {...viewer.getViewerProps()} 
      />
    </>
  );
};`;

const FEATURES = [
  {
    icon: '🔍',
    title: 'Zoom & Pan',
    description: 'Smooth zoom with mouse wheel, pinch gestures, and double-click. Pan images when zoomed in.',
  },
  {
    icon: '⌨️',
    title: 'Keyboard Navigation',
    description: 'Full keyboard support: arrows for navigation, ESC to close, +/- for zoom.',
  },
  {
    icon: '📱',
    title: 'Touch Gestures',
    description: 'Native-feeling pinch-to-zoom and swipe gestures for mobile devices.',
  },
  {
    icon: '🖼️',
    title: 'Gallery Mode',
    description: 'Navigate through multiple images with previous/next controls and counter.',
  },
  {
    icon: '🎨',
    title: 'Customizable',
    description: 'Custom render functions for controls and navigation. Style with CSS classes.',
  },
  {
    icon: '♿',
    title: 'Accessible',
    description: 'ARIA labels, focus trap, screen reader announcements, and keyboard-only navigation.',
  },
  {
    icon: '⚡',
    title: 'High Performance',
    description: 'Optimized with requestAnimationFrame. Lazy loading. Minimal re-renders.',
  },
  {
    icon: '🌐',
    title: 'SSR-Safe',
    description: 'Works seamlessly with Next.js and other SSR frameworks. No window errors.',
  },
];

export const HomePage: React.FC = () => {
  return (
    <div className={styles.homePage}>
      <Hero />

      <section className={`section ${styles.quickStart}`}>
        <div className="container">
          <h2 className="section-title">
            Quick Start in <span>3 Steps</span>
          </h2>
          <p className="section-subtitle">
            Get up and running with react-smart-image-viewer in minutes.
          </p>

          <div className={styles.steps}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepContent}>
                <h3>Install the package</h3>
                <CodeBlock 
                  code="npm install react-smart-image-viewer" 
                  language="bash" 
                  showLineNumbers={false} 
                />
              </div>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepContent}>
                <h3>Import and use</h3>
                <CodeBlock code={QUICK_START_CODE} language="tsx" />
              </div>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepContent}>
                <h3>That's it!</h3>
                <p>Your image viewer is ready with zoom, pan, and keyboard support out of the box.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`section ${styles.features}`}>
        <div className="container">
          <h2 className="section-title">
            Packed with <span>Features</span>
          </h2>
          <p className="section-subtitle">
            Everything you need for a professional image viewing experience.
          </p>

          <div className={styles.featureGrid}>
            {FEATURES.map((feature, index) => (
              <div key={index} className={styles.featureCard}>
                <div className={styles.featureIcon}>{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`section ${styles.examples}`}>
        <div className="container">
          <h2 className="section-title">
            Usage <span>Examples</span>
          </h2>
          <p className="section-subtitle">
            Different ways to use the image viewer in your projects.
          </p>

          <div className={styles.exampleGrid}>
            <div className={styles.example}>
              <h3>Gallery Mode</h3>
              <p>Pass an array of images to create a gallery with navigation.</p>
              <CodeBlock code={GALLERY_CODE} language="tsx" />
            </div>

            <div className={styles.example}>
              <h3>With useImageViewer Hook</h3>
              <p>Use the hook for more control over the viewer state.</p>
              <CodeBlock code={HOOK_CODE} language="tsx" />
            </div>
          </div>
        </div>
      </section>

      <section className={`section ${styles.cta}`}>
        <div className="container">
          <div className={styles.ctaContent}>
            <h2>Ready to Get Started?</h2>
            <p>Explore our interactive demos or dive into the documentation.</p>
            <div className={styles.ctaActions}>
              <Link to="/demos" className={styles.ctaPrimary}>
                View Demos
              </Link>
              <Link to="/docs" className={styles.ctaSecondary}>
                Read Documentation
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

