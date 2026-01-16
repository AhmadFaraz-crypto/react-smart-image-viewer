import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import type { ImageViewerProps, NormalizedImage } from '../types';
import { normalizeImages, preventBodyScroll, generateId, isSSR } from '../utils';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useZoomPan } from '../hooks/useZoomPan';
import {
  CloseIcon,
  ZoomInIcon,
  ZoomOutIcon,
  ResetIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from './Icons';
import '../styles/index.css';

/**
 * ImageViewer - A high-performance image viewer with zoom, pan, and gallery support
 *
 * @example
 * ```tsx
 * // Single image
 * <ImageViewer images="https://example.com/image.jpg" isOpen={isOpen} onClose={() => setIsOpen(false)} />
 *
 * // Gallery
 * <ImageViewer images={['image1.jpg', 'image2.jpg']} isOpen={isOpen} onClose={() => setIsOpen(false)} />
 * ```
 */
export const ImageViewer: React.FC<ImageViewerProps> = ({
  images,
  initialIndex = 0,
  isOpen: controlledIsOpen,
  defaultOpen = false,
  onClose,
  onIndexChange,
  zoomStep = 0.5,
  minZoom = 0.5,
  maxZoom = 4,
  showControls = true,
  showNavigation = true,
  showCounter = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  enableKeyboardNavigation = true,
  loop = false,
  className = '',
  imageClassName = '',
  animationDuration = 200,
  ariaLabel = 'Image viewer',
  renderControls,
  renderNavigation,
}) => {
  // Determine controlled vs uncontrolled mode
  const isControlled = controlledIsOpen !== undefined;
  const [internalIsOpen, setInternalIsOpen] = useState(defaultOpen);
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  // Normalize images
  const normalizedImages = useMemo(() => normalizeImages(images), [images]);
  const isGallery = normalizedImages.length > 1;

  // Image index state
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const currentImage: NormalizedImage | undefined = normalizedImages[currentIndex];

  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  // Generate unique IDs for accessibility
  const viewerId = useRef(generateId('rsiv-viewer'));
  const titleId = useRef(generateId('rsiv-title'));

  // Zoom and pan
  const {
    transform,
    isDragging,
    zoomIn,
    zoomOut,
    resetZoom,
    handleWheel,
    handleMouseDown,
    handleTouchStart,
    handleDoubleClick,
    containerRef,
    imageRef,
  } = useZoomPan({
    minZoom,
    maxZoom,
    zoomStep,
  });

  // Focus trap for accessibility
  const focusTrapRef = useFocusTrap(isOpen);

  // Apply CSS custom property for animation duration
  useEffect(() => {
    if (!isSSR()) {
      document.documentElement.style.setProperty(
        '--rsiv-animation-duration',
        `${animationDuration}ms`
      );
    }
  }, [animationDuration]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      return preventBodyScroll();
    }
  }, [isOpen]);

  // Reset zoom when image changes
  useEffect(() => {
    resetZoom();
    setIsLoading(true);
  }, [currentIndex, resetZoom]);

  // Sync external index changes
  useEffect(() => {
    if (initialIndex !== currentIndex && initialIndex >= 0 && initialIndex < normalizedImages.length) {
      setCurrentIndex(initialIndex);
    }
  }, [initialIndex, normalizedImages.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // Close handler
  const handleClose = useCallback(() => {
    if (!isControlled) {
      setInternalIsOpen(false);
    }
    resetZoom();
    onClose?.();
  }, [isControlled, onClose, resetZoom]);

  // Navigation handlers
  const canGoNext = loop || currentIndex < normalizedImages.length - 1;
  const canGoPrevious = loop || currentIndex > 0;

  const goToNext = useCallback(() => {
    if (!canGoNext) return;

    const nextIndex = currentIndex < normalizedImages.length - 1
      ? currentIndex + 1
      : 0;
    setCurrentIndex(nextIndex);
    onIndexChange?.(nextIndex);
  }, [currentIndex, normalizedImages.length, canGoNext, onIndexChange]);

  const goToPrevious = useCallback(() => {
    if (!canGoPrevious) return;

    const prevIndex = currentIndex > 0
      ? currentIndex - 1
      : normalizedImages.length - 1;
    setCurrentIndex(prevIndex);
    onIndexChange?.(prevIndex);
  }, [currentIndex, normalizedImages.length, canGoPrevious, onIndexChange]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          if (closeOnEscape) {
            e.preventDefault();
            handleClose();
          }
          break;
        case 'ArrowLeft':
          if (enableKeyboardNavigation && isGallery) {
            e.preventDefault();
            goToPrevious();
          }
          break;
        case 'ArrowRight':
          if (enableKeyboardNavigation && isGallery) {
            e.preventDefault();
            goToNext();
          }
          break;
        case '+':
        case '=':
          e.preventDefault();
          zoomIn();
          break;
        case '-':
          e.preventDefault();
          zoomOut();
          break;
        case '0':
          e.preventDefault();
          resetZoom();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [
    isOpen,
    closeOnEscape,
    enableKeyboardNavigation,
    isGallery,
    handleClose,
    goToNext,
    goToPrevious,
    zoomIn,
    zoomOut,
    resetZoom,
  ]);

  // Overlay click handler
  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      handleClose();
    }
  }, [closeOnOverlayClick, handleClose]);

  // Image load handler
  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Image error handler
  const handleImageError = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Transform style
  const transformStyle: React.CSSProperties = {
    transform: `translate(${transform.translateX}px, ${transform.translateY}px) scale(${transform.scale})`,
    transition: isDragging ? 'none' : undefined,
  };

  // Don't render anything if not open and SSR
  if (!isOpen) {
    return null;
  }

  // Custom controls render
  const controlsRenderProps = {
    zoomIn,
    zoomOut,
    resetZoom,
    currentZoom: transform.scale,
    minZoom,
    maxZoom,
    close: handleClose,
  };

  // Custom navigation render
  const navigationRenderProps = {
    goToPrevious,
    goToNext,
    currentIndex,
    totalImages: normalizedImages.length,
    canGoPrevious,
    canGoNext,
  };

  return (
    <div
      ref={focusTrapRef}
      className={`rsiv-overlay ${className}`}
      data-open={isOpen}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      aria-labelledby={currentImage?.title ? titleId.current : undefined}
      id={viewerId.current}
      onClick={handleOverlayClick}
    >
      {/* Close button */}
      <button
        className="rsiv-button rsiv-close"
        onClick={handleClose}
        aria-label="Close image viewer"
        type="button"
      >
        <CloseIcon aria-hidden />
      </button>

      {/* Image title */}
      {currentImage?.title && (
        <div className="rsiv-title" id={titleId.current}>
          {currentImage.title}
        </div>
      )}

      {/* Main container */}
      <div
        ref={containerRef}
        className="rsiv-container"
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
      >
        {/* Loading indicator */}
        {isLoading && <div className="rsiv-loader" aria-label="Loading image" />}

        {/* Image */}
        <div className="rsiv-image-wrapper" style={transformStyle}>
          {currentImage && (
            <img
              ref={imageRef}
              src={currentImage.src}
              alt={currentImage.alt || ''}
              className={`rsiv-image ${imageClassName}`}
              data-loading={isLoading}
              data-zoomed={transform.scale > 1}
              onLoad={handleImageLoad}
              onError={handleImageError}
              onMouseDown={handleMouseDown}
              onDoubleClick={handleDoubleClick}
              draggable={false}
            />
          )}
        </div>
      </div>

      {/* Navigation arrows */}
      {isGallery && showNavigation && (
        renderNavigation ? (
          renderNavigation(navigationRenderProps)
        ) : (
          <>
            <button
              className="rsiv-button rsiv-nav rsiv-nav-prev"
              onClick={goToPrevious}
              disabled={!canGoPrevious}
              aria-label="Previous image"
              type="button"
            >
              <ChevronLeftIcon aria-hidden />
            </button>
            <button
              className="rsiv-button rsiv-nav rsiv-nav-next"
              onClick={goToNext}
              disabled={!canGoNext}
              aria-label="Next image"
              type="button"
            >
              <ChevronRightIcon aria-hidden />
            </button>
          </>
        )
      )}

      {/* Image counter */}
      {isGallery && showCounter && (
        <div className="rsiv-counter" aria-live="polite">
          {currentIndex + 1} / {normalizedImages.length}
        </div>
      )}

      {/* Zoom controls */}
      {showControls && (
        renderControls ? (
          renderControls(controlsRenderProps)
        ) : (
          <div className="rsiv-zoom-controls">
            <button
              className="rsiv-button"
              onClick={zoomOut}
              disabled={transform.scale <= minZoom}
              aria-label="Zoom out"
              type="button"
            >
              <ZoomOutIcon aria-hidden />
            </button>
            <button
              className="rsiv-button"
              onClick={resetZoom}
              disabled={transform.scale === 1}
              aria-label="Reset zoom"
              type="button"
            >
              <ResetIcon aria-hidden />
            </button>
            <button
              className="rsiv-button"
              onClick={zoomIn}
              disabled={transform.scale >= maxZoom}
              aria-label="Zoom in"
              type="button"
            >
              <ZoomInIcon aria-hidden />
            </button>
          </div>
        )
      )}

      {/* Screen reader announcements */}
      <div className="rsiv-sr-only" aria-live="polite" aria-atomic="true">
        {isGallery && `Image ${currentIndex + 1} of ${normalizedImages.length}`}
        {currentImage?.alt && `. ${currentImage.alt}`}
      </div>
    </div>
  );
};

ImageViewer.displayName = 'ImageViewer';

