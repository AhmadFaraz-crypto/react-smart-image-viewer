/**
 * react-smart-image-viewer
 *
 * A high-performance, TypeScript-first React image viewer
 * with zoom, pan, keyboard, and mobile gesture support.
 *
 * @packageDocumentation
 */

// Main component
export { ImageViewer } from './components';

// Hooks
export { useImageViewer } from './hooks';

// Types
export type {
  ImageViewerProps,
  ImageSource,
  ImageInput,
  UseImageViewerReturn,
  UseImageViewerOptions,
  ControlsRenderProps,
  NavigationRenderProps,
  TransformState,
} from './types';

// Utilities
export {
  normalizeImage,
  normalizeImages,
  clamp,
  isSSR,
  isTouchDevice,
} from './utils';

// Icons (for custom implementations)
export {
  CloseIcon,
  ZoomInIcon,
  ZoomOutIcon,
  ResetIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from './components/Icons';

