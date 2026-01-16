# react-smart-image-viewer

<p align="center">
  <strong>A high-performance, TypeScript-first React image viewer with zoom, pan, keyboard, and mobile gesture support.</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#api">API</a> •
  <a href="#examples">Examples</a> •
  <a href="#accessibility">Accessibility</a>
</p>

---

## Why react-smart-image-viewer?

Modern web applications need image viewers that are:

- **Fast** - No unnecessary re-renders, optimized with `requestAnimationFrame`
- **Accessible** - Full keyboard support, ARIA labels, focus management
- **Mobile-friendly** - Touch gestures, pinch-to-zoom, swipe navigation
- **Flexible** - Controlled/uncontrolled modes, headless-friendly API
- **Type-safe** - Built with TypeScript from the ground up
- **Next.js ready** - SSR-safe, no hydration mismatches

This package solves these problems with a lightweight (~15KB gzipped), tree-shakable solution.

## Features

✨ **Modal/Lightbox**
- Open images in a fullscreen overlay
- Close via ESC key, overlay click, or close button
- Prevents body scroll when open
- Smooth animations

🔍 **Zoom & Pan**
- Mouse wheel zoom (zooms toward cursor)
- Button controls for zoom in/out/reset
- Double-click to zoom in, double-click again to reset
- Drag to pan when zoomed
- Pinch-to-zoom on mobile devices

🖼️ **Gallery Support**
- Single image or array of images
- Next/Previous navigation with arrows
- Keyboard navigation (← →)
- Optional loop mode
- Image counter display

⌨️ **Keyboard Shortcuts**
- `ESC` - Close viewer
- `←` / `→` - Navigate images
- `+` / `=` - Zoom in
- `-` - Zoom out
- `0` - Reset zoom

♿ **Accessibility**
- `role="dialog"` with `aria-modal`
- Focus trap inside modal
- ARIA labels on all interactive elements
- Screen reader announcements for gallery position
- Respects `prefers-reduced-motion`

## Installation

```bash
npm install react-smart-image-viewer
```

```bash
yarn add react-smart-image-viewer
```

```bash
pnpm add react-smart-image-viewer
```

## Quick Start

```tsx
import { ImageViewer } from 'react-smart-image-viewer';
import 'react-smart-image-viewer/styles.css';

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Image</button>
      
      <ImageViewer
        images="https://example.com/image.jpg"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
```

## API

### `<ImageViewer />` Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `images` | `string \| ImageSource \| Array` | *required* | Image(s) to display |
| `isOpen` | `boolean` | - | Controlled open state |
| `defaultOpen` | `boolean` | `false` | Initial open state (uncontrolled) |
| `initialIndex` | `number` | `0` | Starting image index for gallery |
| `onClose` | `() => void` | - | Called when viewer should close |
| `onIndexChange` | `(index: number) => void` | - | Called when image index changes |
| `zoomStep` | `number` | `0.5` | Zoom increment per step |
| `minZoom` | `number` | `0.5` | Minimum zoom level |
| `maxZoom` | `number` | `4` | Maximum zoom level |
| `showControls` | `boolean` | `true` | Show zoom controls |
| `showNavigation` | `boolean` | `true` | Show prev/next arrows |
| `showCounter` | `boolean` | `true` | Show image counter |
| `closeOnOverlayClick` | `boolean` | `true` | Close on overlay click |
| `closeOnEscape` | `boolean` | `true` | Close on ESC key |
| `enableKeyboardNavigation` | `boolean` | `true` | Enable ←/→ navigation |
| `loop` | `boolean` | `false` | Loop gallery navigation |
| `className` | `string` | - | Custom overlay class |
| `imageClassName` | `string` | - | Custom image class |
| `animationDuration` | `number` | `200` | Animation duration (ms) |
| `ariaLabel` | `string` | `'Image viewer'` | Accessible label |
| `renderControls` | `(props) => ReactNode` | - | Custom controls renderer |
| `renderNavigation` | `(props) => ReactNode` | - | Custom navigation renderer |

### `ImageSource` Type

```typescript
interface ImageSource {
  src: string;        // Image URL (required)
  alt?: string;       // Alt text for accessibility
  thumbnail?: string; // Thumbnail URL (for gallery previews)
  title?: string;     // Title to display
}
```

### `useImageViewer` Hook

A hook for programmatic control of the viewer.

```tsx
import { useImageViewer, ImageViewer } from 'react-smart-image-viewer';

function Gallery() {
  const images = ['image1.jpg', 'image2.jpg', 'image3.jpg'];
  
  const viewer = useImageViewer({
    totalImages: images.length,
    loop: true,
  });

  return (
    <>
      <div className="thumbnails">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            onClick={() => viewer.open(i)}
            alt={`Thumbnail ${i + 1}`}
          />
        ))}
      </div>

      <ImageViewer images={images} {...viewer.getViewerProps()} />
    </>
  );
}
```

#### Hook Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `defaultOpen` | `boolean` | `false` | Initial open state |
| `defaultIndex` | `number` | `0` | Initial image index |
| `totalImages` | `number` | `1` | Total number of images |
| `zoomStep` | `number` | `0.5` | Zoom increment |
| `minZoom` | `number` | `0.5` | Minimum zoom |
| `maxZoom` | `number` | `4` | Maximum zoom |
| `loop` | `boolean` | `false` | Loop navigation |
| `onOpenChange` | `(isOpen: boolean) => void` | - | Open state callback |
| `onIndexChange` | `(index: number) => void` | - | Index change callback |

#### Hook Return Value

```typescript
interface UseImageViewerReturn {
  isOpen: boolean;
  open: (index?: number) => void;
  close: () => void;
  toggle: () => void;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  goToNext: () => void;
  goToPrevious: () => void;
  zoom: number;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  setZoom: (zoom: number) => void;
  getViewerProps: () => Partial<ImageViewerProps>;
}
```

## Examples

### Single Image

```tsx
<ImageViewer
  images="https://example.com/photo.jpg"
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
/>
```

### Gallery with Metadata

```tsx
const images = [
  {
    src: 'https://example.com/photo1.jpg',
    alt: 'Mountain landscape',
    title: 'Swiss Alps',
  },
  {
    src: 'https://example.com/photo2.jpg',
    alt: 'Ocean sunset',
    title: 'Pacific Coast',
  },
];

<ImageViewer
  images={images}
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  initialIndex={0}
  loop
/>
```

### Controlled Mode

```tsx
function ControlledExample() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <ImageViewer
      images={images}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      initialIndex={currentIndex}
      onIndexChange={setCurrentIndex}
    />
  );
}
```

### Uncontrolled Mode

```tsx
<ImageViewer
  images={images}
  defaultOpen={true}
  onClose={() => console.log('Viewer closed')}
/>
```

### Custom Controls

```tsx
<ImageViewer
  images={images}
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  renderControls={({ zoomIn, zoomOut, resetZoom, currentZoom, close }) => (
    <div className="my-controls">
      <button onClick={zoomOut}>−</button>
      <span>{Math.round(currentZoom * 100)}%</span>
      <button onClick={zoomIn}>+</button>
      <button onClick={resetZoom}>Reset</button>
      <button onClick={close}>×</button>
    </div>
  )}
/>
```

### Custom Navigation

```tsx
<ImageViewer
  images={images}
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  renderNavigation={({ goToPrevious, goToNext, currentIndex, totalImages }) => (
    <div className="my-nav">
      <button onClick={goToPrevious}>Previous</button>
      <span>{currentIndex + 1} of {totalImages}</span>
      <button onClick={goToNext}>Next</button>
    </div>
  )}
/>
```

### With Next.js

The component is fully SSR-safe and works with Next.js out of the box:

```tsx
// pages/gallery.tsx or app/gallery/page.tsx
'use client'; // Required for app directory

import { useState } from 'react';
import { ImageViewer } from 'react-smart-image-viewer';
import 'react-smart-image-viewer/styles.css';

export default function GalleryPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const images = ['/image1.jpg', '/image2.jpg', '/image3.jpg'];

  return (
    <main>
      <div className="grid">
        {images.map((src, i) => (
          <img
            key={src}
            src={src}
            onClick={() => {
              setSelectedIndex(i);
              setIsOpen(true);
            }}
            alt={`Gallery image ${i + 1}`}
          />
        ))}
      </div>

      <ImageViewer
        images={images}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        initialIndex={selectedIndex}
        onIndexChange={setSelectedIndex}
      />
    </main>
  );
}
```

## Accessibility

This component follows WAI-ARIA best practices for modal dialogs:

### Semantic Structure
- Uses `role="dialog"` with `aria-modal="true"`
- Close button has `aria-label="Close image viewer"`
- Navigation buttons have descriptive labels
- Images include alt text support

### Keyboard Support
- **Tab** - Cycles through focusable elements
- **Shift+Tab** - Cycles backwards
- **Escape** - Closes the viewer
- **Arrow keys** - Navigate gallery
- Focus is trapped within the modal when open
- Focus returns to trigger element on close

### Screen Readers
- Announces "Image X of Y" when navigating
- Alt text is announced for each image
- Live regions announce state changes

### Motion
- Respects `prefers-reduced-motion` media query
- Animations are disabled for users who prefer reduced motion

## Performance

### Optimizations

1. **requestAnimationFrame** - Zoom and pan operations are throttled using rAF
2. **Lazy loading** - Images load on-demand with loading indicators
3. **CSS transforms** - Hardware-accelerated transforms for smooth animations
4. **Minimal re-renders** - Memoized callbacks and optimized state updates
5. **Tree-shakable** - Import only what you need

### Bundle Size

- **Full bundle**: ~15KB gzipped
- **Core component only**: ~10KB gzipped
- **Zero runtime dependencies**

## Customization

### CSS Variables

Override these CSS custom properties to customize the appearance:

```css
:root {
  --rsiv-overlay-bg: rgba(0, 0, 0, 0.92);
  --rsiv-control-bg: rgba(255, 255, 255, 0.12);
  --rsiv-control-bg-hover: rgba(255, 255, 255, 0.22);
  --rsiv-control-color: #ffffff;
  --rsiv-control-size: 44px;
  --rsiv-control-radius: 8px;
  --rsiv-counter-bg: rgba(0, 0, 0, 0.6);
  --rsiv-counter-color: #ffffff;
  --rsiv-animation-duration: 200ms;
  --rsiv-animation-easing: cubic-bezier(0.4, 0, 0.2, 1);
  --rsiv-focus-ring: 0 0 0 2px rgba(66, 153, 225, 0.6);
}
```

### Example: Dark Theme

```css
.my-viewer {
  --rsiv-overlay-bg: rgba(10, 10, 10, 0.98);
  --rsiv-control-bg: rgba(255, 255, 255, 0.08);
  --rsiv-control-bg-hover: rgba(255, 255, 255, 0.16);
}
```

### Example: Light Theme

```css
.my-light-viewer {
  --rsiv-overlay-bg: rgba(255, 255, 255, 0.95);
  --rsiv-control-bg: rgba(0, 0, 0, 0.08);
  --rsiv-control-bg-hover: rgba(0, 0, 0, 0.16);
  --rsiv-control-color: #1a1a1a;
  --rsiv-counter-bg: rgba(0, 0, 0, 0.6);
}
```

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13.1+
- Edge 80+

Touch gestures require a device with touch support.

## TypeScript

Full TypeScript support with exported types:

```typescript
import type {
  ImageViewerProps,
  ImageSource,
  ImageInput,
  UseImageViewerReturn,
  UseImageViewerOptions,
  ControlsRenderProps,
  NavigationRenderProps,
} from 'react-smart-image-viewer';
```

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a PR.

## License

MIT © Ahmad Faraz

