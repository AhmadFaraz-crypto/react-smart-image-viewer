import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ImageViewer } from '../src/components/ImageViewer';

describe('ImageViewer', () => {
  const mockOnClose = vi.fn();
  const mockOnIndexChange = vi.fn();
  const singleImage = 'https://example.com/image.jpg';
  const multipleImages = [
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg',
    'https://example.com/image3.jpg',
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Modal Open/Close', () => {
    it('renders when isOpen is true', () => {
      render(
        <ImageViewer images={singleImage} isOpen={true} onClose={mockOnClose} />
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('does not render when isOpen is false', () => {
      render(
        <ImageViewer images={singleImage} isOpen={false} onClose={mockOnClose} />
      );

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <ImageViewer images={singleImage} isOpen={true} onClose={mockOnClose} />
      );

      const closeButton = screen.getByLabelText('Close image viewer');
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when ESC key is pressed', () => {
      render(
        <ImageViewer images={singleImage} isOpen={true} onClose={mockOnClose} />
      );

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose on ESC when closeOnEscape is false', () => {
      render(
        <ImageViewer
          images={singleImage}
          isOpen={true}
          onClose={mockOnClose}
          closeOnEscape={false}
        />
      );

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('calls onClose when overlay is clicked', async () => {
      const user = userEvent.setup();
      render(
        <ImageViewer images={singleImage} isOpen={true} onClose={mockOnClose} />
      );

      const overlay = screen.getByRole('dialog');
      await user.click(overlay);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose on overlay click when closeOnOverlayClick is false', async () => {
      const user = userEvent.setup();
      render(
        <ImageViewer
          images={singleImage}
          isOpen={true}
          onClose={mockOnClose}
          closeOnOverlayClick={false}
        />
      );

      const overlay = screen.getByRole('dialog');
      await user.click(overlay);

      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard Navigation', () => {
    it('navigates to next image on ArrowRight', () => {
      render(
        <ImageViewer
          images={multipleImages}
          isOpen={true}
          onClose={mockOnClose}
          onIndexChange={mockOnIndexChange}
        />
      );

      fireEvent.keyDown(document, { key: 'ArrowRight' });

      expect(mockOnIndexChange).toHaveBeenCalledWith(1);
    });

    it('navigates to previous image on ArrowLeft', () => {
      render(
        <ImageViewer
          images={multipleImages}
          isOpen={true}
          onClose={mockOnClose}
          onIndexChange={mockOnIndexChange}
          initialIndex={1}
        />
      );

      fireEvent.keyDown(document, { key: 'ArrowLeft' });

      expect(mockOnIndexChange).toHaveBeenCalledWith(0);
    });

    it('does not navigate when enableKeyboardNavigation is false', () => {
      render(
        <ImageViewer
          images={multipleImages}
          isOpen={true}
          onClose={mockOnClose}
          onIndexChange={mockOnIndexChange}
          enableKeyboardNavigation={false}
        />
      );

      fireEvent.keyDown(document, { key: 'ArrowRight' });

      expect(mockOnIndexChange).not.toHaveBeenCalled();
    });

    it('loops to first image when at end with loop enabled', () => {
      render(
        <ImageViewer
          images={multipleImages}
          isOpen={true}
          onClose={mockOnClose}
          onIndexChange={mockOnIndexChange}
          initialIndex={2}
          loop={true}
        />
      );

      fireEvent.keyDown(document, { key: 'ArrowRight' });

      expect(mockOnIndexChange).toHaveBeenCalledWith(0);
    });

    it('loops to last image when at start with loop enabled', () => {
      render(
        <ImageViewer
          images={multipleImages}
          isOpen={true}
          onClose={mockOnClose}
          onIndexChange={mockOnIndexChange}
          initialIndex={0}
          loop={true}
        />
      );

      fireEvent.keyDown(document, { key: 'ArrowLeft' });

      expect(mockOnIndexChange).toHaveBeenCalledWith(2);
    });
  });

  describe('Gallery Navigation', () => {
    it('shows navigation buttons for multiple images', () => {
      render(
        <ImageViewer
          images={multipleImages}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByLabelText('Previous image')).toBeInTheDocument();
      expect(screen.getByLabelText('Next image')).toBeInTheDocument();
    });

    it('hides navigation buttons for single image', () => {
      render(
        <ImageViewer images={singleImage} isOpen={true} onClose={mockOnClose} />
      );

      expect(screen.queryByLabelText('Previous image')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Next image')).not.toBeInTheDocument();
    });

    it('shows image counter for gallery', () => {
      render(
        <ImageViewer
          images={multipleImages}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText('1 / 3')).toBeInTheDocument();
    });

    it('hides navigation when showNavigation is false', () => {
      render(
        <ImageViewer
          images={multipleImages}
          isOpen={true}
          onClose={mockOnClose}
          showNavigation={false}
        />
      );

      expect(screen.queryByLabelText('Previous image')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Next image')).not.toBeInTheDocument();
    });

    it('hides counter when showCounter is false', () => {
      render(
        <ImageViewer
          images={multipleImages}
          isOpen={true}
          onClose={mockOnClose}
          showCounter={false}
        />
      );

      expect(screen.queryByText('1 / 3')).not.toBeInTheDocument();
    });

    it('disables previous button at first image without loop', () => {
      render(
        <ImageViewer
          images={multipleImages}
          isOpen={true}
          onClose={mockOnClose}
          loop={false}
        />
      );

      const prevButton = screen.getByLabelText('Previous image');
      expect(prevButton).toBeDisabled();
    });

    it('disables next button at last image without loop', () => {
      render(
        <ImageViewer
          images={multipleImages}
          isOpen={true}
          onClose={mockOnClose}
          initialIndex={2}
          loop={false}
        />
      );

      const nextButton = screen.getByLabelText('Next image');
      expect(nextButton).toBeDisabled();
    });
  });

  describe('Zoom Controls', () => {
    it('shows zoom controls when showControls is true', () => {
      render(
        <ImageViewer
          images={singleImage}
          isOpen={true}
          onClose={mockOnClose}
          showControls={true}
        />
      );

      expect(screen.getByLabelText('Zoom in')).toBeInTheDocument();
      expect(screen.getByLabelText('Zoom out')).toBeInTheDocument();
      expect(screen.getByLabelText('Reset zoom')).toBeInTheDocument();
    });

    it('hides zoom controls when showControls is false', () => {
      render(
        <ImageViewer
          images={singleImage}
          isOpen={true}
          onClose={mockOnClose}
          showControls={false}
        />
      );

      expect(screen.queryByLabelText('Zoom in')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Zoom out')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Reset zoom')).not.toBeInTheDocument();
    });

    it('zoom in button is clickable', async () => {
      const user = userEvent.setup();
      render(
        <ImageViewer images={singleImage} isOpen={true} onClose={mockOnClose} />
      );

      const zoomInButton = screen.getByLabelText('Zoom in');
      await user.click(zoomInButton);

      // Button should still be enabled for more zooming
      expect(zoomInButton).not.toBeDisabled();
    });

    it('zoom out button starts disabled at minimum zoom', () => {
      render(
        <ImageViewer
          images={singleImage}
          isOpen={true}
          onClose={mockOnClose}
          minZoom={1}
        />
      );

      const zoomOutButton = screen.getByLabelText('Zoom out');
      expect(zoomOutButton).toBeDisabled();
    });

    it('reset button is disabled at default zoom', () => {
      render(
        <ImageViewer images={singleImage} isOpen={true} onClose={mockOnClose} />
      );

      const resetButton = screen.getByLabelText('Reset zoom');
      expect(resetButton).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA attributes', () => {
      render(
        <ImageViewer images={singleImage} isOpen={true} onClose={mockOnClose} />
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAttribute('aria-label', 'Image viewer');
    });

    it('uses custom ariaLabel when provided', () => {
      render(
        <ImageViewer
          images={singleImage}
          isOpen={true}
          onClose={mockOnClose}
          ariaLabel="Custom gallery label"
        />
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-label', 'Custom gallery label');
    });

    it('all buttons have aria-labels', () => {
      render(
        <ImageViewer
          images={multipleImages}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByLabelText('Close image viewer')).toBeInTheDocument();
      expect(screen.getByLabelText('Previous image')).toBeInTheDocument();
      expect(screen.getByLabelText('Next image')).toBeInTheDocument();
      expect(screen.getByLabelText('Zoom in')).toBeInTheDocument();
      expect(screen.getByLabelText('Zoom out')).toBeInTheDocument();
      expect(screen.getByLabelText('Reset zoom')).toBeInTheDocument();
    });

    it('renders loading indicator with aria-label', () => {
      render(
        <ImageViewer images={singleImage} isOpen={true} onClose={mockOnClose} />
      );

      expect(screen.getByLabelText('Loading image')).toBeInTheDocument();
    });

    it('includes screen reader text for gallery position', () => {
      render(
        <ImageViewer
          images={multipleImages}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      const srText = screen.getByText(/Image 1 of 3/);
      expect(srText).toBeInTheDocument();
      expect(srText).toHaveClass('rsiv-sr-only');
    });
  });

  describe('Controlled vs Uncontrolled Mode', () => {
    it('works in controlled mode', async () => {
      const { rerender } = render(
        <ImageViewer
          images={singleImage}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();

      rerender(
        <ImageViewer
          images={singleImage}
          isOpen={false}
          onClose={mockOnClose}
        />
      );

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('works in uncontrolled mode with defaultOpen', () => {
      render(
        <ImageViewer
          images={singleImage}
          defaultOpen={true}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  describe('Image Sources', () => {
    it('accepts string image source', () => {
      render(
        <ImageViewer images={singleImage} isOpen={true} onClose={mockOnClose} />
      );

      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('src', singleImage);
    });

    it('accepts object image source with alt text', () => {
      render(
        <ImageViewer
          images={{ src: singleImage, alt: 'Test image' }}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('alt', 'Test image');
    });

    it('displays title when provided', () => {
      render(
        <ImageViewer
          images={{ src: singleImage, title: 'Image Title' }}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText('Image Title')).toBeInTheDocument();
    });
  });

  describe('Custom Renderers', () => {
    it('uses custom renderControls when provided', () => {
      render(
        <ImageViewer
          images={singleImage}
          isOpen={true}
          onClose={mockOnClose}
          renderControls={({ zoomIn, zoomOut }) => (
            <div data-testid="custom-controls">
              <button onClick={zoomIn}>Custom Zoom In</button>
              <button onClick={zoomOut}>Custom Zoom Out</button>
            </div>
          )}
        />
      );

      expect(screen.getByTestId('custom-controls')).toBeInTheDocument();
      expect(screen.getByText('Custom Zoom In')).toBeInTheDocument();
    });

    it('uses custom renderNavigation when provided', () => {
      render(
        <ImageViewer
          images={multipleImages}
          isOpen={true}
          onClose={mockOnClose}
          renderNavigation={({ goToNext, goToPrevious }) => (
            <div data-testid="custom-nav">
              <button onClick={goToPrevious}>Prev</button>
              <button onClick={goToNext}>Next</button>
            </div>
          )}
        />
      );

      expect(screen.getByTestId('custom-nav')).toBeInTheDocument();
      expect(screen.getByText('Prev')).toBeInTheDocument();
    });
  });

  describe('CSS Classes', () => {
    it('applies custom className to overlay', () => {
      render(
        <ImageViewer
          images={singleImage}
          isOpen={true}
          onClose={mockOnClose}
          className="custom-overlay"
        />
      );

      const overlay = screen.getByRole('dialog');
      expect(overlay).toHaveClass('custom-overlay');
    });

    it('applies custom imageClassName to image', () => {
      render(
        <ImageViewer
          images={singleImage}
          isOpen={true}
          onClose={mockOnClose}
          imageClassName="custom-image"
        />
      );

      const img = screen.getByRole('img');
      expect(img).toHaveClass('custom-image');
    });
  });
});

