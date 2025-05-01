import { createEditablePdfBlockFromText } from 'features/pdfEditor';
import { describe, it, expect } from 'vitest';

const mockText = {
  str: 'Test',
  x: 10,
  y: 100,
  width: 50,
  height: 14,
  alignment: 'left' as const,
  fontSize: 12,
  fontFamily: 'Arial',
  isBold: true,
  isItalic: false,
};

describe('createEditablePdfBlockFromText', () => {
  it('should return a valid EditablePdfBlock', () => {
    const block = createEditablePdfBlockFromText(mockText, 1, 0);

    expect(block.id).toBe('block-1-0');
    expect(block.pageNumber).toBe(1);
    expect(block.str).toBe('Test');
    expect(block.html).toBe('Test');
    expect(block.fontWeight).toBe('bold');
    expect(block.fontStyle).toBe('normal');
  });
});
