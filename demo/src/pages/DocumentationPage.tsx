import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PropsTable } from '../components/PropsTable/PropsTable';
import { CodeBlock } from '../components/CodeBlock/CodeBlock';
import styles from './DocumentationPage.module.scss';

// Props data for ImageViewer
const IMAGE_VIEWER_PROPS = [
  { name: 'images', type: 'ImageInput | ImageInput[]', required: true, description: 'Single image URL, ImageSource object, or array of images' },
  { name: 'isOpen', type: 'boolean', description: 'Controlled mode: whether the viewer is open' },
  { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Uncontrolled mode: default open state' },
  { name: 'onClose', type: '() => void', description: 'Callback when the viewer closes' },
  { name: 'initialIndex', type: 'number', default: '0', description: 'Initial image index for gallery mode' },
  { name: 'onIndexChange', type: '(index: number) => void', description: 'Callback when the current image index changes' },
  { name: 'zoomStep', type: 'number', default: '0.5', description: 'Zoom increment per step (mouse wheel, buttons)' },
  { name: 'minZoom', type: 'number', default: '0.5', description: 'Minimum zoom level' },
  { name: 'maxZoom', type: 'number', default: '4', description: 'Maximum zoom level' },
  { name: 'showControls', type: 'boolean', default: 'true', description: 'Show zoom control buttons' },
  { name: 'showNavigation', type: 'boolean', default: 'true', description: 'Show previous/next navigation arrows' },
  { name: 'showCounter', type: 'boolean', default: 'true', description: 'Show image counter (e.g., "2 / 5")' },
  { name: 'closeOnOverlayClick', type: 'boolean', default: 'true', description: 'Close viewer when clicking the overlay' },
  { name: 'closeOnEscape', type: 'boolean', default: 'true', description: 'Close viewer on ESC key press' },
  { name: 'enableKeyboardNavigation', type: 'boolean', default: 'true', description: 'Enable arrow key navigation in gallery' },
  { name: 'loop', type: 'boolean', default: 'false', description: 'Loop gallery navigation (last → first)' },
  { name: 'className', type: 'string', description: 'Custom class name for the overlay' },
  { name: 'imageClassName', type: 'string', description: 'Custom class name for the image element' },
  { name: 'animationDuration', type: 'number', default: '200', description: 'Animation duration in milliseconds' },
  { name: 'ariaLabel', type: 'string', default: '"Image viewer"', description: 'Accessible label for the viewer dialog' },
  { name: 'renderControls', type: '(props: ControlsRenderProps) => ReactNode', description: 'Custom render function for zoom controls' },
  { name: 'renderNavigation', type: '(props: NavigationRenderProps) => ReactNode', description: 'Custom render function for navigation arrows' },
];

// Props data for useImageViewer hook
const HOOK_OPTIONS_PROPS = [
  { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Initial open state' },
  { name: 'defaultIndex', type: 'number', default: '0', description: 'Initial image index' },
  { name: 'totalImages', type: 'number', default: '1', description: 'Total number of images (for navigation)' },
  { name: 'zoomStep', type: 'number', default: '0.5', description: 'Zoom increment per step' },
  { name: 'minZoom', type: 'number', default: '0.5', description: 'Minimum zoom level' },
  { name: 'maxZoom', type: 'number', default: '4', description: 'Maximum zoom level' },
  { name: 'loop', type: 'boolean', default: 'false', description: 'Loop navigation' },
  { name: 'onOpenChange', type: '(isOpen: boolean) => void', description: 'Callback when open state changes' },
  { name: 'onIndexChange', type: '(index: number) => void', description: 'Callback when index changes' },
];

const HOOK_RETURN_PROPS = [
  { name: 'isOpen', type: 'boolean', description: 'Current open state' },
  { name: 'open', type: '(index?: number) => void', description: 'Open the viewer, optionally at a specific index' },
  { name: 'close', type: '() => void', description: 'Close the viewer' },
  { name: 'toggle', type: '() => void', description: 'Toggle the viewer open/closed' },
  { name: 'currentIndex', type: 'number', description: 'Current image index' },
  { name: 'setCurrentIndex', type: '(index: number) => void', description: 'Set the current image index' },
  { name: 'goToNext', type: '() => void', description: 'Navigate to the next image' },
  { name: 'goToPrevious', type: '() => void', description: 'Navigate to the previous image' },
  { name: 'zoom', type: 'number', description: 'Current zoom level' },
  { name: 'zoomIn', type: '() => void', description: 'Zoom in by zoomStep' },
  { name: 'zoomOut', type: '() => void', description: 'Zoom out by zoomStep' },
  { name: 'resetZoom', type: '() => void', description: 'Reset zoom to 1' },
  { name: 'setZoom', type: '(zoom: number) => void', description: 'Set a specific zoom level' },
  { name: 'getViewerProps', type: '() => Partial<ImageViewerProps>', description: 'Get props to spread on ImageViewer' },
];

// Code examples
const INSTALL_CODE = `npm install react-smart-image-viewer

# or with yarn
yarn add react-smart-image-viewer

# or with pnpm
pnpm add react-smart-image-viewer`;

const BASIC_USAGE_CODE = `import { ImageViewer } from 'react-smart-image-viewer';
import 'react-smart-image-viewer/styles.css';

const App = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Open Image
      </button>
      
      <ImageViewer
        images="https://example.com/photo.jpg"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};`;

const IMAGE_SOURCE_CODE = `// Simple string URL
<ImageViewer images="https://example.com/image.jpg" />

// ImageSource object with metadata
<ImageViewer 
  images={{
    src: "https://example.com/image.jpg",
    alt: "A beautiful sunset",
    title: "Sunset at the Beach",
    thumbnail: "https://example.com/image-thumb.jpg"
  }}
/>

// Array of images (gallery mode)
const images = [
  { src: "/photo1.jpg", alt: "Photo 1" },
  { src: "/photo2.jpg", alt: "Photo 2", title: "My Title" },
  "/photo3.jpg", // Simple URL also works in arrays
];

<ImageViewer images={images} />`;

const CONTROLLED_CODE = `// Controlled mode - you manage the state
const [isOpen, setIsOpen] = useState(false);
const [currentIndex, setCurrentIndex] = useState(0);

<ImageViewer
  images={images}
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  initialIndex={currentIndex}
  onIndexChange={setCurrentIndex}
/>`;

const UNCONTROLLED_CODE = `// Uncontrolled mode - let the component manage its state
// Useful for simpler use cases
<ImageViewer
  images={images}
  defaultOpen={false}
/>

// Note: In uncontrolled mode, you can still provide onClose
// to know when the user closes the viewer`;

const HOOK_USAGE_CODE = `import { ImageViewer, useImageViewer } from 'react-smart-image-viewer';

const Gallery = ({ images }) => {
  const viewer = useImageViewer({
    totalImages: images.length,
    loop: true,
    onIndexChange: (index) => console.log('Current:', index),
  });

  return (
    <>
      <div className="thumbnails">
        {images.map((img, index) => (
          <img
            key={index}
            src={img.thumbnail}
            onClick={() => viewer.open(index)}
            alt={img.alt}
          />
        ))}
      </div>

      <div className="controls">
        <button onClick={viewer.goToPrevious}>Previous</button>
        <span>{viewer.currentIndex + 1} / {images.length}</span>
        <button onClick={viewer.goToNext}>Next</button>
      </div>

      <ImageViewer 
        images={images} 
        {...viewer.getViewerProps()} 
      />
    </>
  );
};`;

const CUSTOM_CONTROLS_CODE = `<ImageViewer
  images={images}
  isOpen={isOpen}
  onClose={handleClose}
  renderControls={({ zoomIn, zoomOut, resetZoom, currentZoom, close }) => (
    <div className="my-controls">
      <button onClick={zoomOut}>-</button>
      <span>{Math.round(currentZoom * 100)}%</span>
      <button onClick={zoomIn}>+</button>
      <button onClick={resetZoom}>Reset</button>
      <button onClick={close}>×</button>
    </div>
  )}
  renderNavigation={({ goToPrevious, goToNext, currentIndex, totalImages }) => (
    <div className="my-nav">
      <button onClick={goToPrevious}>← Prev</button>
      <span>{currentIndex + 1} of {totalImages}</span>
      <button onClick={goToNext}>Next →</button>
    </div>
  )}
/>`;

const NEXTJS_CODE = `// The package is SSR-safe and works with Next.js out of the box
// No need for dynamic imports or 'use client' directive for the component itself

// pages/gallery.tsx or app/gallery/page.tsx
import { ImageViewer } from 'react-smart-image-viewer';
import 'react-smart-image-viewer/styles.css';

export default function GalleryPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ImageViewer
      images={images}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    />
  );
}`;

const KEYBOARD_SHORTCUTS = [
  { key: 'ESC', action: 'Close the viewer' },
  { key: '← / →', action: 'Navigate previous/next image (gallery)' },
  { key: '+ / =', action: 'Zoom in' },
  { key: '-', action: 'Zoom out' },
  { key: '0', action: 'Reset zoom to 100%' },
];

export const DocumentationPage: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location.hash]);

  return (
    <div className={styles.docsPage}>
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <nav>
            <h4>Getting Started</h4>
            <ul>
              <li><a href="#installation">Installation</a></li>
              <li><a href="#basic-usage">Basic Usage</a></li>
              <li><a href="#image-sources">Image Sources</a></li>
            </ul>

            <h4>API Reference</h4>
            <ul>
              <li><a href="#props">ImageViewer Props</a></li>
              <li><a href="#hook">useImageViewer Hook</a></li>
              <li><a href="#types">TypeScript Types</a></li>
            </ul>

            <h4>Guides</h4>
            <ul>
              <li><a href="#controlled-mode">Controlled vs Uncontrolled</a></li>
              <li><a href="#customization">Customization</a></li>
              <li><a href="#nextjs">Next.js Integration</a></li>
            </ul>

            <h4>Accessibility</h4>
            <ul>
              <li><a href="#accessibility">Accessibility Features</a></li>
              <li><a href="#keyboard">Keyboard Shortcuts</a></li>
            </ul>
          </nav>
        </aside>

        <main className={styles.content}>
          <header className={styles.header}>
            <h1>Documentation</h1>
            <p>
              Complete guide to using react-smart-image-viewer in your projects.
            </p>
          </header>

          <section id="installation" className={styles.section}>
            <h2>Installation</h2>
            <p>Install the package using your preferred package manager:</p>
            <CodeBlock code={INSTALL_CODE} language="bash" showLineNumbers={false} />
          </section>

          <section id="basic-usage" className={styles.section}>
            <h2>Basic Usage</h2>
            <p>Import the component and styles, then use it in your React application:</p>
            <CodeBlock code={BASIC_USAGE_CODE} language="tsx" />
            <div className={styles.note}>
              <strong>Note:</strong> Don't forget to import the styles. The component won't look right without them.
            </div>
          </section>

          <section id="image-sources" className={styles.section}>
            <h2>Image Sources</h2>
            <p>The <code>images</code> prop accepts multiple formats:</p>
            <CodeBlock code={IMAGE_SOURCE_CODE} language="tsx" />
          </section>

          <section id="props" className={styles.section}>
            <h2>ImageViewer Props</h2>
            <p>Complete list of props accepted by the ImageViewer component:</p>
            <PropsTable props={IMAGE_VIEWER_PROPS} />
          </section>

          <section id="hook" className={styles.section}>
            <h2>useImageViewer Hook</h2>
            <p>
              The <code>useImageViewer</code> hook provides programmatic control over the viewer.
              It's useful when you need to control the viewer from external components or 
              implement custom UI.
            </p>
            
            <h3>Options</h3>
            <PropsTable props={HOOK_OPTIONS_PROPS} />

            <h3>Return Value</h3>
            <PropsTable props={HOOK_RETURN_PROPS} />

            <h3>Usage Example</h3>
            <CodeBlock code={HOOK_USAGE_CODE} language="tsx" />
          </section>

          <section id="types" className={styles.section}>
            <h2>TypeScript Types</h2>
            <p>All types are exported and can be imported for use in your TypeScript projects:</p>
            <CodeBlock 
              code={`import type {
  ImageViewerProps,
  ImageSource,
  ImageInput,
  UseImageViewerReturn,
  UseImageViewerOptions,
  ControlsRenderProps,
  NavigationRenderProps,
  TransformState,
} from 'react-smart-image-viewer';`}
              language="tsx"
            />
          </section>

          <section id="controlled-mode" className={styles.section}>
            <h2>Controlled vs Uncontrolled Mode</h2>
            
            <h3>Controlled Mode</h3>
            <p>
              In controlled mode, you manage the open state yourself. This gives you full 
              control over when the viewer opens and closes.
            </p>
            <CodeBlock code={CONTROLLED_CODE} language="tsx" />

            <h3>Uncontrolled Mode</h3>
            <p>
              In uncontrolled mode, the component manages its own state. This is simpler 
              but gives you less control.
            </p>
            <CodeBlock code={UNCONTROLLED_CODE} language="tsx" />
          </section>

          <section id="customization" className={styles.section}>
            <h2>Customization</h2>
            <p>
              You can customize the zoom controls and navigation using render props:
            </p>
            <CodeBlock code={CUSTOM_CONTROLS_CODE} language="tsx" />

            <h3>CSS Custom Properties</h3>
            <p>Override these CSS variables to customize the appearance:</p>
            <CodeBlock 
              code={`:root {
  --rsiv-animation-duration: 200ms;
  --rsiv-overlay-bg: rgba(0, 0, 0, 0.9);
  --rsiv-button-bg: rgba(255, 255, 255, 0.1);
  --rsiv-button-hover-bg: rgba(255, 255, 255, 0.2);
  --rsiv-text-color: white;
}`}
              language="css"
            />
          </section>

          <section id="nextjs" className={styles.section}>
            <h2>Next.js Integration</h2>
            <p>
              The package is fully SSR-safe and works with Next.js without any special configuration:
            </p>
            <CodeBlock code={NEXTJS_CODE} language="tsx" />
          </section>

          <section id="accessibility" className={styles.section}>
            <h2>Accessibility Features</h2>
            <p>
              The image viewer is built with accessibility in mind:
            </p>
            <ul className={styles.featureList}>
              <li>
                <strong>ARIA Attributes:</strong> The viewer uses <code>role="dialog"</code>, 
                <code>aria-modal="true"</code>, and proper labeling.
              </li>
              <li>
                <strong>Focus Trap:</strong> When open, focus is trapped within the modal 
                to prevent tabbing outside.
              </li>
              <li>
                <strong>Keyboard Navigation:</strong> Full keyboard support for all interactions.
              </li>
              <li>
                <strong>Screen Reader Support:</strong> Live regions announce image changes 
                and provide context.
              </li>
              <li>
                <strong>Reduced Motion:</strong> Respects the user's motion preferences.
              </li>
            </ul>
          </section>

          <section id="keyboard" className={styles.section}>
            <h2>Keyboard Shortcuts</h2>
            <div className={styles.keyboardTable}>
              <table>
                <thead>
                  <tr>
                    <th>Key</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {KEYBOARD_SHORTCUTS.map((shortcut, index) => (
                    <tr key={index}>
                      <td><kbd>{shortcut.key}</kbd></td>
                      <td>{shortcut.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className={styles.section}>
            <h2>Browser Support</h2>
            <p>
              The package supports all modern browsers:
            </p>
            <ul className={styles.browserList}>
              <li>Chrome / Edge (latest)</li>
              <li>Firefox (latest)</li>
              <li>Safari (latest)</li>
              <li>Mobile browsers (iOS Safari, Chrome for Android)</li>
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
};

