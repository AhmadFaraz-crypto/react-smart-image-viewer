import { describe, it, expect } from 'vitest';
import {
  normalizeImage,
  normalizeImages,
  clamp,
  getTouchDistance,
  getTouchCenter,
} from '../src/utils';

describe('Utils', () => {
  describe('normalizeImage', () => {
    it('converts string to ImageSource', () => {
      const result = normalizeImage('https://example.com/image.jpg');

      expect(result).toEqual({
        src: 'https://example.com/image.jpg',
        alt: '',
      });
    });

    it('passes through ImageSource object', () => {
      const input = {
        src: 'https://example.com/image.jpg',
        alt: 'Test image',
        title: 'Image Title',
      };

      const result = normalizeImage(input);

      expect(result).toEqual(input);
    });
  });

  describe('normalizeImages', () => {
    it('normalizes single string', () => {
      const result = normalizeImages('https://example.com/image.jpg');

      expect(result).toEqual([
        { src: 'https://example.com/image.jpg', alt: '' },
      ]);
    });

    it('normalizes array of strings', () => {
      const result = normalizeImages([
        'https://example.com/image1.jpg',
        'https://example.com/image2.jpg',
      ]);

      expect(result).toEqual([
        { src: 'https://example.com/image1.jpg', alt: '' },
        { src: 'https://example.com/image2.jpg', alt: '' },
      ]);
    });

    it('normalizes mixed array', () => {
      const result = normalizeImages([
        'https://example.com/image1.jpg',
        { src: 'https://example.com/image2.jpg', alt: 'Second image' },
      ]);

      expect(result).toEqual([
        { src: 'https://example.com/image1.jpg', alt: '' },
        { src: 'https://example.com/image2.jpg', alt: 'Second image' },
      ]);
    });
  });

  describe('clamp', () => {
    it('returns value when within range', () => {
      expect(clamp(5, 0, 10)).toBe(5);
    });

    it('clamps to min when below', () => {
      expect(clamp(-5, 0, 10)).toBe(0);
    });

    it('clamps to max when above', () => {
      expect(clamp(15, 0, 10)).toBe(10);
    });

    it('handles decimal values', () => {
      expect(clamp(0.3, 0.5, 4)).toBe(0.5);
      expect(clamp(5.5, 0.5, 4)).toBe(4);
    });

    it('handles negative ranges', () => {
      expect(clamp(0, -10, -5)).toBe(-5);
      expect(clamp(-15, -10, -5)).toBe(-10);
    });
  });

  describe('getTouchDistance', () => {
    it('returns 0 for single touch', () => {
      const touches = {
        length: 1,
        0: { clientX: 100, clientY: 100 },
      } as unknown as TouchList;

      expect(getTouchDistance(touches)).toBe(0);
    });

    it('calculates distance between two touches', () => {
      const touches = {
        length: 2,
        0: { clientX: 0, clientY: 0 },
        1: { clientX: 3, clientY: 4 }, // 3-4-5 triangle
      } as unknown as TouchList;

      expect(getTouchDistance(touches)).toBe(5);
    });

    it('handles horizontal distance', () => {
      const touches = {
        length: 2,
        0: { clientX: 0, clientY: 0 },
        1: { clientX: 100, clientY: 0 },
      } as unknown as TouchList;

      expect(getTouchDistance(touches)).toBe(100);
    });

    it('handles vertical distance', () => {
      const touches = {
        length: 2,
        0: { clientX: 0, clientY: 0 },
        1: { clientX: 0, clientY: 100 },
      } as unknown as TouchList;

      expect(getTouchDistance(touches)).toBe(100);
    });
  });

  describe('getTouchCenter', () => {
    it('returns single touch position for one touch', () => {
      const touches = {
        length: 1,
        0: { clientX: 100, clientY: 200 },
      } as unknown as TouchList;

      expect(getTouchCenter(touches)).toEqual({ x: 100, y: 200 });
    });

    it('returns center between two touches', () => {
      const touches = {
        length: 2,
        0: { clientX: 0, clientY: 0 },
        1: { clientX: 100, clientY: 100 },
      } as unknown as TouchList;

      expect(getTouchCenter(touches)).toEqual({ x: 50, y: 50 });
    });

    it('handles asymmetric positions', () => {
      const touches = {
        length: 2,
        0: { clientX: 20, clientY: 40 },
        1: { clientX: 80, clientY: 120 },
      } as unknown as TouchList;

      expect(getTouchCenter(touches)).toEqual({ x: 50, y: 80 });
    });
  });
});

