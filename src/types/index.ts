/**
 * Configuration for image sources with optional metadata
 */
export interface ImageSource {
  /** Image URL */
  src: string;
  /** Alt text for accessibility */
  alt?: string;
  /** Optional thumbnail URL for gallery previews */
  thumbnail?: string;
  /** Optional title to display */
  title?: string;
}

/**
 * Normalized image type used internally
 */
export type NormalizedImage = ImageSource;

/**
 * Input type that accepts either string URLs or ImageSource objects
 */
export type ImageInput = string | ImageSource;

/**
 * Transform state for zoom and pan
 */
export interface TransformState {
  scale: number;
  translateX: number;
  translateY: number;
}

/**
 * Position coordinates
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * Gesture state for touch/pointer interactions
 */
export interface GestureState {
  /** Whether a gesture is active */
  isGesturing: boolean;
  /** Starting distance for pinch gestures */
  startDistance: number;
  /** Starting scale when gesture began */
  startScale: number;
  /** Last pointer/touch position */
  lastPosition: Position | null;
  /** Center point for pinch gestures */
  pinchCenter: Position | null;
}

/**
 * Props for the ImageViewer component
 */
export interface ImageViewerProps {
  /** Single image or array of images */
  images: ImageInput | ImageInput[];
  /** Initial image index for gallery mode */
  initialIndex?: number;
  /** Controlled mode: whether the viewer is open */
  isOpen?: boolean;
  /** Default open state for uncontrolled mode */
  defaultOpen?: boolean;
  /** Callback when viewer closes */
  onClose?: () => void;
  /** Callback when image index changes */
  onIndexChange?: (index: number) => void;
  /** Zoom increment per step */
  zoomStep?: number;
  /** Minimum zoom level */
  minZoom?: number;
  /** Maximum zoom level */
  maxZoom?: number;
  /** Whether to show control buttons */
  showControls?: boolean;
  /** Whether to show navigation arrows */
  showNavigation?: boolean;
  /** Whether to show image counter */
  showCounter?: boolean;
  /** Whether to close on overlay click */
  closeOnOverlayClick?: boolean;
  /** Whether to close on ESC key */
  closeOnEscape?: boolean;
  /** Whether to enable keyboard navigation */
  enableKeyboardNavigation?: boolean;
  /** Whether to loop gallery navigation */
  loop?: boolean;
  /** Custom class name for the overlay */
  className?: string;
  /** Custom class name for the image */
  imageClassName?: string;
  /** Animation duration in ms */
  animationDuration?: number;
  /** Accessible label for the viewer */
  ariaLabel?: string;
  /** Custom render function for controls */
  renderControls?: (props: ControlsRenderProps) => React.ReactNode;
  /** Custom render function for navigation */
  renderNavigation?: (props: NavigationRenderProps) => React.ReactNode;
}

/**
 * Props passed to custom controls renderer
 */
export interface ControlsRenderProps {
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  currentZoom: number;
  minZoom: number;
  maxZoom: number;
  close: () => void;
}

/**
 * Props passed to custom navigation renderer
 */
export interface NavigationRenderProps {
  goToPrevious: () => void;
  goToNext: () => void;
  currentIndex: number;
  totalImages: number;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

/**
 * Return type for useImageViewer hook
 */
export interface UseImageViewerReturn {
  /** Whether the viewer is open */
  isOpen: boolean;
  /** Open the viewer */
  open: (index?: number) => void;
  /** Close the viewer */
  close: () => void;
  /** Toggle the viewer */
  toggle: () => void;
  /** Current image index */
  currentIndex: number;
  /** Set current image index */
  setCurrentIndex: (index: number) => void;
  /** Go to next image */
  goToNext: () => void;
  /** Go to previous image */
  goToPrevious: () => void;
  /** Current zoom level */
  zoom: number;
  /** Zoom in */
  zoomIn: () => void;
  /** Zoom out */
  zoomOut: () => void;
  /** Reset zoom to 1 */
  resetZoom: () => void;
  /** Set specific zoom level */
  setZoom: (zoom: number) => void;
  /** Props to spread on ImageViewer component */
  getViewerProps: () => Partial<ImageViewerProps>;
}

/**
 * Options for useImageViewer hook
 */
export interface UseImageViewerOptions {
  /** Initial open state */
  defaultOpen?: boolean;
  /** Initial image index */
  defaultIndex?: number;
  /** Total number of images */
  totalImages?: number;
  /** Zoom step */
  zoomStep?: number;
  /** Minimum zoom */
  minZoom?: number;
  /** Maximum zoom */
  maxZoom?: number;
  /** Loop navigation */
  loop?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (isOpen: boolean) => void;
  /** Callback when index changes */
  onIndexChange?: (index: number) => void;
}

