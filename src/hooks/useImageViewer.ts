import { useState, useCallback, useMemo } from 'react';
import type { UseImageViewerOptions, UseImageViewerReturn, ImageViewerProps } from '../types';
import { clamp } from '../utils';

/**
 * Hook for controlling the ImageViewer programmatically
 * 
 * @example
 * ```tsx
 * const viewer = useImageViewer({ totalImages: 5 });
 * 
 * return (
 *   <>
 *     <button onClick={() => viewer.open(0)}>Open Gallery</button>
 *     <ImageViewer images={images} {...viewer.getViewerProps()} />
 *   </>
 * );
 * ```
 */
export function useImageViewer(options: UseImageViewerOptions = {}): UseImageViewerReturn {
  const {
    defaultOpen = false,
    defaultIndex = 0,
    totalImages = 1,
    zoomStep = 0.5,
    minZoom = 0.5,
    maxZoom = 4,
    loop = false,
    onOpenChange,
    onIndexChange,
  } = options;

  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [currentIndex, setCurrentIndexState] = useState(defaultIndex);
  const [zoom, setZoomState] = useState(1);

  const open = useCallback((index?: number) => {
    if (typeof index === 'number') {
      setCurrentIndexState(clamp(index, 0, totalImages - 1));
      onIndexChange?.(index);
    }
    setIsOpen(true);
    onOpenChange?.(true);
  }, [totalImages, onOpenChange, onIndexChange]);

  const close = useCallback(() => {
    setIsOpen(false);
    setZoomState(1);
    onOpenChange?.(false);
  }, [onOpenChange]);

  const toggle = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, open, close]);

  const setCurrentIndex = useCallback((index: number) => {
    const clampedIndex = clamp(index, 0, totalImages - 1);
    setCurrentIndexState(clampedIndex);
    setZoomState(1); // Reset zoom when changing images
    onIndexChange?.(clampedIndex);
  }, [totalImages, onIndexChange]);

  const goToNext = useCallback(() => {
    if (currentIndex < totalImages - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (loop) {
      setCurrentIndex(0);
    }
  }, [currentIndex, totalImages, loop, setCurrentIndex]);

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (loop) {
      setCurrentIndex(totalImages - 1);
    }
  }, [currentIndex, totalImages, loop, setCurrentIndex]);

  const setZoom = useCallback((newZoom: number) => {
    setZoomState(clamp(newZoom, minZoom, maxZoom));
  }, [minZoom, maxZoom]);

  const zoomIn = useCallback(() => {
    setZoom(zoom + zoomStep);
  }, [zoom, zoomStep, setZoom]);

  const zoomOut = useCallback(() => {
    setZoom(zoom - zoomStep);
  }, [zoom, zoomStep, setZoom]);

  const resetZoom = useCallback(() => {
    setZoomState(1);
  }, []);

  const getViewerProps = useCallback((): Partial<ImageViewerProps> => ({
    isOpen,
    onClose: close,
    initialIndex: currentIndex,
    onIndexChange: setCurrentIndex,
    zoomStep,
    minZoom,
    maxZoom,
    loop,
  }), [isOpen, close, currentIndex, setCurrentIndex, zoomStep, minZoom, maxZoom, loop]);

  return useMemo(() => ({
    isOpen,
    open,
    close,
    toggle,
    currentIndex,
    setCurrentIndex,
    goToNext,
    goToPrevious,
    zoom,
    zoomIn,
    zoomOut,
    resetZoom,
    setZoom,
    getViewerProps,
  }), [
    isOpen,
    open,
    close,
    toggle,
    currentIndex,
    setCurrentIndex,
    goToNext,
    goToPrevious,
    zoom,
    zoomIn,
    zoomOut,
    resetZoom,
    setZoom,
    getViewerProps,
  ]);
}

