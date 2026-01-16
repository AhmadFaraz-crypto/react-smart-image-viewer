import type { ImageInput, NormalizedImage, Position, TransformState } from '../types';

/**
 * Normalizes image input to consistent ImageSource format
 */
export function normalizeImage(image: ImageInput): NormalizedImage {
  if (typeof image === 'string') {
    return { src: image, alt: '' };
  }
  return image;
}

/**
 * Normalizes array of images
 */
export function normalizeImages(images: ImageInput | ImageInput[]): NormalizedImage[] {
  const imageArray = Array.isArray(images) ? images : [images];
  return imageArray.map(normalizeImage);
}

/**
 * Clamps a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Touch-like interface for compatibility
 */
interface TouchLike {
  clientX: number;
  clientY: number;
}

interface TouchListLike {
  length: number;
  [index: number]: TouchLike;
}

/**
 * Calculates distance between two touch points
 */
export function getTouchDistance(touches: TouchListLike): number {
  if (touches.length < 2) return 0;
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Gets center point between two touches
 */
export function getTouchCenter(touches: TouchListLike): Position {
  if (touches.length < 2) {
    return { x: touches[0]?.clientX ?? 0, y: touches[0]?.clientY ?? 0 };
  }
  return {
    x: (touches[0].clientX + touches[1].clientX) / 2,
    y: (touches[0].clientY + touches[1].clientY) / 2,
  };
}

/**
 * Constrains transform to prevent image from going too far off-screen
 */
export function constrainTransform(
  transform: TransformState,
  containerWidth: number,
  containerHeight: number,
  imageWidth: number,
  imageHeight: number
): TransformState {
  const scaledWidth = imageWidth * transform.scale;
  const scaledHeight = imageHeight * transform.scale;
  
  // If image is smaller than container, center it
  if (scaledWidth <= containerWidth) {
    transform.translateX = 0;
  } else {
    // Allow panning but keep image edges visible
    const maxTranslateX = (scaledWidth - containerWidth) / 2;
    transform.translateX = clamp(transform.translateX, -maxTranslateX, maxTranslateX);
  }
  
  if (scaledHeight <= containerHeight) {
    transform.translateY = 0;
  } else {
    const maxTranslateY = (scaledHeight - containerHeight) / 2;
    transform.translateY = clamp(transform.translateY, -maxTranslateY, maxTranslateY);
  }
  
  return transform;
}

/**
 * Prevents body scroll
 */
export function preventBodyScroll(): () => void {
  // Check if we're in a browser environment
  if (typeof document === 'undefined') {
    return () => {};
  }
  
  const originalStyle = document.body.style.overflow;
  const originalPaddingRight = document.body.style.paddingRight;
  
  // Get scrollbar width
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  
  document.body.style.overflow = 'hidden';
  if (scrollbarWidth > 0) {
    document.body.style.paddingRight = `${scrollbarWidth}px`;
  }
  
  return () => {
    document.body.style.overflow = originalStyle;
    document.body.style.paddingRight = originalPaddingRight;
  };
}

/**
 * Creates a throttled function using requestAnimationFrame
 */
export function rafThrottle<T extends (...args: never[]) => void>(
  fn: T
): (...args: Parameters<T>) => void {
  let rafId: number | null = null;
  let lastArgs: Parameters<T> | null = null;
  
  return (...args: Parameters<T>) => {
    lastArgs = args;
    
    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        if (lastArgs) {
          fn(...lastArgs);
        }
        rafId = null;
      });
    }
  };
}

/**
 * Detects if device supports touch
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * Generates unique ID for accessibility
 */
let idCounter = 0;
export function generateId(prefix = 'rsiv'): string {
  return `${prefix}-${++idCounter}`;
}

/**
 * Check if we're in SSR environment
 */
export function isSSR(): boolean {
  return typeof window === 'undefined';
}

