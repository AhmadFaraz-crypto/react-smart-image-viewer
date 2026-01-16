import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useImageViewer } from '../src/hooks/useImageViewer';

describe('useImageViewer', () => {
  describe('Open/Close State', () => {
    it('starts closed by default', () => {
      const { result } = renderHook(() => useImageViewer());

      expect(result.current.isOpen).toBe(false);
    });

    it('starts open when defaultOpen is true', () => {
      const { result } = renderHook(() => 
        useImageViewer({ defaultOpen: true })
      );

      expect(result.current.isOpen).toBe(true);
    });

    it('opens the viewer', () => {
      const { result } = renderHook(() => useImageViewer());

      act(() => {
        result.current.open();
      });

      expect(result.current.isOpen).toBe(true);
    });

    it('opens the viewer at specific index', () => {
      const { result } = renderHook(() => 
        useImageViewer({ totalImages: 5 })
      );

      act(() => {
        result.current.open(3);
      });

      expect(result.current.isOpen).toBe(true);
      expect(result.current.currentIndex).toBe(3);
    });

    it('closes the viewer', () => {
      const { result } = renderHook(() => 
        useImageViewer({ defaultOpen: true })
      );

      act(() => {
        result.current.close();
      });

      expect(result.current.isOpen).toBe(false);
    });

    it('toggles the viewer', () => {
      const { result } = renderHook(() => useImageViewer());

      act(() => {
        result.current.toggle();
      });
      expect(result.current.isOpen).toBe(true);

      act(() => {
        result.current.toggle();
      });
      expect(result.current.isOpen).toBe(false);
    });

    it('calls onOpenChange when state changes', () => {
      const onOpenChange = vi.fn();
      const { result } = renderHook(() => 
        useImageViewer({ onOpenChange })
      );

      act(() => {
        result.current.open();
      });

      expect(onOpenChange).toHaveBeenCalledWith(true);

      act(() => {
        result.current.close();
      });

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe('Index Navigation', () => {
    it('starts at defaultIndex', () => {
      const { result } = renderHook(() => 
        useImageViewer({ defaultIndex: 2 })
      );

      expect(result.current.currentIndex).toBe(2);
    });

    it('sets current index', () => {
      const { result } = renderHook(() => 
        useImageViewer({ totalImages: 5 })
      );

      act(() => {
        result.current.setCurrentIndex(3);
      });

      expect(result.current.currentIndex).toBe(3);
    });

    it('clamps index to valid range', () => {
      const { result } = renderHook(() => 
        useImageViewer({ totalImages: 3 })
      );

      act(() => {
        result.current.setCurrentIndex(10);
      });

      expect(result.current.currentIndex).toBe(2);

      act(() => {
        result.current.setCurrentIndex(-1);
      });

      expect(result.current.currentIndex).toBe(0);
    });

    it('goes to next image', () => {
      const { result } = renderHook(() => 
        useImageViewer({ totalImages: 3, defaultIndex: 0 })
      );

      act(() => {
        result.current.goToNext();
      });

      expect(result.current.currentIndex).toBe(1);
    });

    it('goes to previous image', () => {
      const { result } = renderHook(() => 
        useImageViewer({ totalImages: 3, defaultIndex: 2 })
      );

      act(() => {
        result.current.goToPrevious();
      });

      expect(result.current.currentIndex).toBe(1);
    });

    it('does not go beyond last image without loop', () => {
      const { result } = renderHook(() => 
        useImageViewer({ totalImages: 3, defaultIndex: 2, loop: false })
      );

      act(() => {
        result.current.goToNext();
      });

      expect(result.current.currentIndex).toBe(2);
    });

    it('loops to first when at last with loop enabled', () => {
      const { result } = renderHook(() => 
        useImageViewer({ totalImages: 3, defaultIndex: 2, loop: true })
      );

      act(() => {
        result.current.goToNext();
      });

      expect(result.current.currentIndex).toBe(0);
    });

    it('loops to last when at first with loop enabled', () => {
      const { result } = renderHook(() => 
        useImageViewer({ totalImages: 3, defaultIndex: 0, loop: true })
      );

      act(() => {
        result.current.goToPrevious();
      });

      expect(result.current.currentIndex).toBe(2);
    });

    it('calls onIndexChange when index changes', () => {
      const onIndexChange = vi.fn();
      const { result } = renderHook(() => 
        useImageViewer({ totalImages: 3, onIndexChange })
      );

      act(() => {
        result.current.setCurrentIndex(1);
      });

      expect(onIndexChange).toHaveBeenCalledWith(1);
    });

    it('resets zoom when changing images', () => {
      const { result } = renderHook(() => 
        useImageViewer({ totalImages: 3 })
      );

      act(() => {
        result.current.setZoom(2);
      });

      expect(result.current.zoom).toBe(2);

      act(() => {
        result.current.goToNext();
      });

      expect(result.current.zoom).toBe(1);
    });
  });

  describe('Zoom Controls', () => {
    it('starts at zoom level 1', () => {
      const { result } = renderHook(() => useImageViewer());

      expect(result.current.zoom).toBe(1);
    });

    it('zooms in by zoomStep', () => {
      const { result } = renderHook(() => 
        useImageViewer({ zoomStep: 0.5 })
      );

      act(() => {
        result.current.zoomIn();
      });

      expect(result.current.zoom).toBe(1.5);
    });

    it('zooms out by zoomStep', () => {
      const { result } = renderHook(() => 
        useImageViewer({ zoomStep: 0.5, minZoom: 0.5 })
      );

      act(() => {
        result.current.zoomIn();
        result.current.zoomOut();
      });

      expect(result.current.zoom).toBe(1);
    });

    it('resets zoom to 1', () => {
      const { result } = renderHook(() => useImageViewer());

      act(() => {
        result.current.setZoom(3);
      });

      expect(result.current.zoom).toBe(3);

      act(() => {
        result.current.resetZoom();
      });

      expect(result.current.zoom).toBe(1);
    });

    it('clamps zoom to maxZoom', () => {
      const { result } = renderHook(() => 
        useImageViewer({ maxZoom: 2 })
      );

      act(() => {
        result.current.setZoom(5);
      });

      expect(result.current.zoom).toBe(2);
    });

    it('clamps zoom to minZoom', () => {
      const { result } = renderHook(() => 
        useImageViewer({ minZoom: 0.5 })
      );

      act(() => {
        result.current.setZoom(0.1);
      });

      expect(result.current.zoom).toBe(0.5);
    });

    it('resets zoom when closing', () => {
      const { result } = renderHook(() => 
        useImageViewer({ defaultOpen: true })
      );

      act(() => {
        result.current.setZoom(2);
      });

      expect(result.current.zoom).toBe(2);

      act(() => {
        result.current.close();
      });

      expect(result.current.zoom).toBe(1);
    });
  });

  describe('getViewerProps', () => {
    it('returns correct props object', () => {
      const { result } = renderHook(() => 
        useImageViewer({
          defaultOpen: true,
          defaultIndex: 1,
          zoomStep: 0.5,
          minZoom: 0.5,
          maxZoom: 4,
          loop: true,
        })
      );

      const props = result.current.getViewerProps();

      expect(props.isOpen).toBe(true);
      expect(props.initialIndex).toBe(1);
      expect(props.zoomStep).toBe(0.5);
      expect(props.minZoom).toBe(0.5);
      expect(props.maxZoom).toBe(4);
      expect(props.loop).toBe(true);
      expect(typeof props.onClose).toBe('function');
      expect(typeof props.onIndexChange).toBe('function');
    });

    it('onClose in props closes the viewer', () => {
      const { result } = renderHook(() => 
        useImageViewer({ defaultOpen: true })
      );

      const props = result.current.getViewerProps();

      act(() => {
        props.onClose?.();
      });

      expect(result.current.isOpen).toBe(false);
    });
  });
});

