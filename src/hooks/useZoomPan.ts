import { useState, useCallback, useRef, useEffect } from 'react';
import type { TransformState, GestureState } from '../types';
import { clamp, getTouchDistance, getTouchCenter, rafThrottle } from '../utils';

interface UseZoomPanOptions {
  minZoom: number;
  maxZoom: number;
  zoomStep: number;
  onZoomChange?: (zoom: number) => void;
}

interface UseZoomPanReturn {
  transform: TransformState;
  isDragging: boolean;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  setZoom: (zoom: number) => void;
  handleWheel: (e: React.WheelEvent) => void;
  handleMouseDown: (e: React.MouseEvent) => void;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleDoubleClick: (e: React.MouseEvent) => void;
  containerRef: React.RefObject<HTMLDivElement>;
  imageRef: React.RefObject<HTMLImageElement>;
}

const initialTransform: TransformState = {
  scale: 1,
  translateX: 0,
  translateY: 0,
};

/**
 * Hook to handle zoom and pan interactions
 */
export function useZoomPan(options: UseZoomPanOptions): UseZoomPanReturn {
  const { minZoom, maxZoom, zoomStep, onZoomChange } = options;

  const [transform, setTransform] = useState<TransformState>(initialTransform);
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const gestureRef = useRef<GestureState>({
    isGesturing: false,
    startDistance: 0,
    startScale: 1,
    lastPosition: null,
    pinchCenter: null,
  });

  // Notify parent of zoom changes
  useEffect(() => {
    onZoomChange?.(transform.scale);
  }, [transform.scale, onZoomChange]);

  const updateTransform = useCallback((updates: Partial<TransformState>) => {
    setTransform((prev) => {
      const newTransform = { ...prev, ...updates };
      newTransform.scale = clamp(newTransform.scale, minZoom, maxZoom);
      return newTransform;
    });
  }, [minZoom, maxZoom]);

  const zoomIn = useCallback(() => {
    updateTransform({ scale: transform.scale + zoomStep });
  }, [transform.scale, zoomStep, updateTransform]);

  const zoomOut = useCallback(() => {
    updateTransform({ scale: transform.scale - zoomStep });
  }, [transform.scale, zoomStep, updateTransform]);

  const resetZoom = useCallback(() => {
    setTransform(initialTransform);
  }, []);

  const setZoom = useCallback((zoom: number) => {
    const clampedZoom = clamp(zoom, minZoom, maxZoom);
    // Reset position when setting zoom directly
    setTransform({
      scale: clampedZoom,
      translateX: 0,
      translateY: 0,
    });
  }, [minZoom, maxZoom]);

  // Mouse wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -zoomStep * 0.5 : zoomStep * 0.5;
    const newScale = clamp(transform.scale + delta, minZoom, maxZoom);

    // Zoom towards cursor position
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const scaleDiff = newScale / transform.scale;
      const newTranslateX = transform.translateX * scaleDiff - x * (scaleDiff - 1);
      const newTranslateY = transform.translateY * scaleDiff - y * (scaleDiff - 1);

      setTransform({
        scale: newScale,
        translateX: newTranslateX,
        translateY: newTranslateY,
      });
    } else {
      updateTransform({ scale: newScale });
    }
  }, [transform, zoomStep, minZoom, maxZoom, updateTransform]);

  // Double click to zoom
  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    
    if (transform.scale > 1) {
      // Reset zoom
      resetZoom();
    } else {
      // Zoom in to 2x at click position
      const targetScale = Math.min(2, maxZoom);
      
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        setTransform({
          scale: targetScale,
          translateX: -x * (targetScale - 1),
          translateY: -y * (targetScale - 1),
        });
      } else {
        updateTransform({ scale: targetScale });
      }
    }
  }, [transform.scale, maxZoom, resetZoom, updateTransform]);

  // Mouse drag handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    if (transform.scale <= 1) return; // Only drag when zoomed

    e.preventDefault();
    setIsDragging(true);
    gestureRef.current.lastPosition = { x: e.clientX, y: e.clientY };

    const handleMouseMove = rafThrottle((moveEvent: MouseEvent) => {
      if (!gestureRef.current.lastPosition) return;

      const deltaX = moveEvent.clientX - gestureRef.current.lastPosition.x;
      const deltaY = moveEvent.clientY - gestureRef.current.lastPosition.y;

      setTransform((prev) => ({
        ...prev,
        translateX: prev.translateX + deltaX,
        translateY: prev.translateY + deltaY,
      }));

      gestureRef.current.lastPosition = { x: moveEvent.clientX, y: moveEvent.clientY };
    });

    const handleMouseUp = () => {
      setIsDragging(false);
      gestureRef.current.lastPosition = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [transform.scale]);

  // Touch handlers for pinch-to-zoom and drag
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Pinch gesture start
      e.preventDefault();
      gestureRef.current = {
        isGesturing: true,
        startDistance: getTouchDistance(e.touches),
        startScale: transform.scale,
        lastPosition: null,
        pinchCenter: getTouchCenter(e.touches),
      };
    } else if (e.touches.length === 1 && transform.scale > 1) {
      // Single touch drag when zoomed
      gestureRef.current.lastPosition = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
      setIsDragging(true);
    }

    const handleTouchMove = rafThrottle((moveEvent: TouchEvent) => {
      if (moveEvent.touches.length === 2 && gestureRef.current.isGesturing) {
        // Pinch zoom
        moveEvent.preventDefault();
        const currentDistance = getTouchDistance(moveEvent.touches);
        const scale = (currentDistance / gestureRef.current.startDistance) * gestureRef.current.startScale;
        const clampedScale = clamp(scale, minZoom, maxZoom);

        // Zoom towards pinch center
        const newCenter = getTouchCenter(moveEvent.touches);
        if (gestureRef.current.pinchCenter && containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const centerX = gestureRef.current.pinchCenter.x - rect.left - rect.width / 2;
          const centerY = gestureRef.current.pinchCenter.y - rect.top - rect.height / 2;

          const scaleDiff = clampedScale / transform.scale;
          
          setTransform({
            scale: clampedScale,
            translateX: transform.translateX * scaleDiff - centerX * (scaleDiff - 1) + (newCenter.x - gestureRef.current.pinchCenter.x),
            translateY: transform.translateY * scaleDiff - centerY * (scaleDiff - 1) + (newCenter.y - gestureRef.current.pinchCenter.y),
          });
        } else {
          updateTransform({ scale: clampedScale });
        }
      } else if (moveEvent.touches.length === 1 && gestureRef.current.lastPosition) {
        // Single touch drag
        const touch = moveEvent.touches[0];
        const deltaX = touch.clientX - gestureRef.current.lastPosition.x;
        const deltaY = touch.clientY - gestureRef.current.lastPosition.y;

        setTransform((prev) => ({
          ...prev,
          translateX: prev.translateX + deltaX,
          translateY: prev.translateY + deltaY,
        }));

        gestureRef.current.lastPosition = { x: touch.clientX, y: touch.clientY };
      }
    });

    const handleTouchEnd = (endEvent: TouchEvent) => {
      if (endEvent.touches.length === 0) {
        gestureRef.current = {
          isGesturing: false,
          startDistance: 0,
          startScale: 1,
          lastPosition: null,
          pinchCenter: null,
        };
        setIsDragging(false);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      } else if (endEvent.touches.length === 1) {
        // Transition from pinch to drag
        gestureRef.current.isGesturing = false;
        gestureRef.current.lastPosition = {
          x: endEvent.touches[0].clientX,
          y: endEvent.touches[0].clientY,
        };
      }
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  }, [transform, minZoom, maxZoom, updateTransform]);

  return {
    transform,
    isDragging,
    zoomIn,
    zoomOut,
    resetZoom,
    setZoom,
    handleWheel,
    handleMouseDown,
    handleTouchStart,
    handleDoubleClick,
    containerRef,
    imageRef,
  };
}

