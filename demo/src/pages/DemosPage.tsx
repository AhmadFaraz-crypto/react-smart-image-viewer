import React, { useState } from 'react';
import { ImageViewer, useImageViewer } from 'react-smart-image-viewer';
import { DemoCard } from '../components/DemoCard/DemoCard';
import styles from './DemosPage.module.scss';

// Sample images for demos
const SAMPLE_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
    alt: 'Mountain landscape',
    title: 'Alpine Majesty',
  },
  {
    src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&q=80',
    alt: 'Foggy valley',
    title: 'Misty Valley',
  },
  {
    src: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1920&q=80',
    alt: 'Waterfall',
    title: 'Hidden Falls',
  },
  {
    src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&q=80',
    alt: 'Lake reflection',
    title: 'Mirror Lake',
  },
  {
    src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1920&q=80',
    alt: 'Green hills',
    title: 'Rolling Hills',
  },
];

// Demo: Basic Single Image
const BasicDemo: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.demoContent}>
      <button 
        className={styles.imageButton}
        onClick={() => setIsOpen(true)}
        type="button"
      >
        <img 
          src={`${SAMPLE_IMAGES[0].src}&w=400`} 
          alt={SAMPLE_IMAGES[0].alt}
          loading="lazy"
        />
        <span className={styles.imageOverlay}>Click to open</span>
      </button>

      <ImageViewer
        images={SAMPLE_IMAGES[0]}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        showControls
      />
    </div>
  );
};

// Demo: Gallery Mode
const GalleryDemo: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);

  const handleOpenImage = (index: number) => {
    setInitialIndex(index);
    setIsOpen(true);
  };

  return (
    <div className={styles.demoContent}>
      <div className={styles.gallery}>
        {SAMPLE_IMAGES.map((image, index) => (
          <button
            key={index}
            className={styles.galleryItem}
            onClick={() => handleOpenImage(index)}
            type="button"
          >
            <img 
              src={`${image.src}&w=300`} 
              alt={image.alt}
              loading="lazy"
            />
          </button>
        ))}
      </div>

      <ImageViewer
        images={SAMPLE_IMAGES}
        initialIndex={initialIndex}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        showControls
        showNavigation
        showCounter
      />
    </div>
  );
};

// Demo: With Hook
const HookDemo: React.FC = () => {
  const viewer = useImageViewer({
    totalImages: SAMPLE_IMAGES.length,
    loop: true,
  });

  return (
    <div className={styles.demoContent}>
      <div className={styles.hookControls}>
        <div className={styles.gallery}>
          {SAMPLE_IMAGES.slice(0, 3).map((image, index) => (
            <button
              key={index}
              className={styles.galleryItem}
              onClick={() => viewer.open(index)}
              type="button"
            >
              <img 
                src={`${image.src}&w=300`} 
                alt={image.alt}
                loading="lazy"
              />
            </button>
          ))}
        </div>

        <div className={styles.hookButtons}>
          <button onClick={() => viewer.open(0)} type="button">Open First</button>
          <button onClick={() => viewer.open(2)} type="button">Open Third</button>
          <button onClick={viewer.toggle} type="button">Toggle</button>
        </div>

        <p className={styles.hookStatus}>
          Status: {viewer.isOpen ? 'Open' : 'Closed'} | 
          Index: {viewer.currentIndex} | 
          Zoom: {viewer.zoom.toFixed(1)}x
        </p>
      </div>

      <ImageViewer
        images={SAMPLE_IMAGES}
        {...viewer.getViewerProps()}
      />
    </div>
  );
};

// Demo: Loop Navigation
const LoopDemo: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.demoContent}>
      <button 
        className={styles.openButton}
        onClick={() => setIsOpen(true)}
        type="button"
      >
        Open Looping Gallery
      </button>

      <ImageViewer
        images={SAMPLE_IMAGES}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        showControls
        showNavigation
        showCounter
        loop
      />
    </div>
  );
};

// Demo: Custom Zoom Settings
const ZoomDemo: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.demoContent}>
      <div className={styles.zoomInfo}>
        <p>Custom zoom settings: Step: 0.25, Min: 0.25, Max: 6</p>
        <button 
          className={styles.openButton}
          onClick={() => setIsOpen(true)}
          type="button"
        >
          Open with Custom Zoom
        </button>
      </div>

      <ImageViewer
        images={SAMPLE_IMAGES[0]}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        showControls
        zoomStep={0.25}
        minZoom={0.25}
        maxZoom={6}
      />
    </div>
  );
};

// Demo: Minimal (No Controls)
const MinimalDemo: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.demoContent}>
      <button 
        className={styles.imageButton}
        onClick={() => setIsOpen(true)}
        type="button"
      >
        <img 
          src={`${SAMPLE_IMAGES[2].src}&w=400`} 
          alt={SAMPLE_IMAGES[2].alt}
          loading="lazy"
        />
        <span className={styles.imageOverlay}>Minimal Mode</span>
      </button>

      <ImageViewer
        images={SAMPLE_IMAGES[2]}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        showControls={false}
        showNavigation={false}
        showCounter={false}
      />
    </div>
  );
};

// Demo: Disable Features
const DisabledFeaturesDemo: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.demoContent}>
      <div className={styles.disabledInfo}>
        <p>ESC key disabled, overlay click disabled</p>
        <button 
          className={styles.openButton}
          onClick={() => setIsOpen(true)}
          type="button"
        >
          Open (only close button works)
        </button>
      </div>

      <ImageViewer
        images={SAMPLE_IMAGES[1]}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        showControls
        closeOnEscape={false}
        closeOnOverlayClick={false}
      />
    </div>
  );
};

// Code snippets
const BASIC_CODE = `const [isOpen, setIsOpen] = useState(false);

<ImageViewer
  images="https://example.com/image.jpg"
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  showControls
/>`;

const GALLERY_CODE = `const images = [
  { src: '/image1.jpg', alt: 'Image 1', title: 'Title 1' },
  { src: '/image2.jpg', alt: 'Image 2', title: 'Title 2' },
  { src: '/image3.jpg', alt: 'Image 3', title: 'Title 3' },
];

const [isOpen, setIsOpen] = useState(false);
const [initialIndex, setInitialIndex] = useState(0);

<ImageViewer
  images={images}
  initialIndex={initialIndex}
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  showControls
  showNavigation
  showCounter
/>`;

const HOOK_CODE = `import { useImageViewer } from 'react-smart-image-viewer';

const viewer = useImageViewer({
  totalImages: images.length,
  loop: true,
});

// Open at specific index
<button onClick={() => viewer.open(0)}>Open First</button>
<button onClick={() => viewer.open(2)}>Open Third</button>

// Toggle open/close
<button onClick={viewer.toggle}>Toggle</button>

// Access state
console.log(viewer.isOpen, viewer.currentIndex, viewer.zoom);

// Spread props on ImageViewer
<ImageViewer images={images} {...viewer.getViewerProps()} />`;

const LOOP_CODE = `<ImageViewer
  images={images}
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  loop // Navigate from last to first and vice versa
  showNavigation
/>`;

const ZOOM_CODE = `<ImageViewer
  images={image}
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  zoomStep={0.25}  // Zoom increment per step
  minZoom={0.25}   // Minimum zoom level
  maxZoom={6}      // Maximum zoom level
  showControls
/>`;

const MINIMAL_CODE = `<ImageViewer
  images={image}
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  showControls={false}    // Hide zoom controls
  showNavigation={false}  // Hide prev/next arrows
  showCounter={false}     // Hide image counter
/>`;

const DISABLED_CODE = `<ImageViewer
  images={image}
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  closeOnEscape={false}       // Disable ESC key
  closeOnOverlayClick={false} // Disable overlay click
  showControls
/>`;

export const DemosPage: React.FC = () => {
  return (
    <div className={styles.demosPage}>
      <div className="container">
        <header className={styles.header}>
          <h1>Interactive <span>Demos</span></h1>
          <p>
            Explore different features and configurations of the image viewer.
            Click on any image or button to see it in action.
          </p>
        </header>

        <div className={styles.demos}>
          <DemoCard
            title="Basic Single Image"
            description="The simplest use case - display a single image in a modal viewer with zoom controls."
            code={BASIC_CODE}
          >
            <BasicDemo />
          </DemoCard>

          <DemoCard
            title="Gallery Mode"
            description="Display multiple images with navigation arrows and image counter. Click on any thumbnail to open."
            code={GALLERY_CODE}
          >
            <GalleryDemo />
          </DemoCard>

          <DemoCard
            title="Using the Hook"
            description="Use the useImageViewer hook for programmatic control over the viewer state."
            code={HOOK_CODE}
          >
            <HookDemo />
          </DemoCard>

          <DemoCard
            title="Loop Navigation"
            description="Enable loop mode to navigate from the last image back to the first and vice versa."
            code={LOOP_CODE}
          >
            <LoopDemo />
          </DemoCard>

          <DemoCard
            title="Custom Zoom Settings"
            description="Customize zoom behavior with different step size and min/max limits."
            code={ZOOM_CODE}
          >
            <ZoomDemo />
          </DemoCard>

          <DemoCard
            title="Minimal Mode"
            description="Hide all UI controls for a cleaner, distraction-free viewing experience."
            code={MINIMAL_CODE}
          >
            <MinimalDemo />
          </DemoCard>

          <DemoCard
            title="Disabled Features"
            description="Disable certain close triggers for controlled modal behavior."
            code={DISABLED_CODE}
          >
            <DisabledFeaturesDemo />
          </DemoCard>
        </div>
      </div>
    </div>
  );
};

