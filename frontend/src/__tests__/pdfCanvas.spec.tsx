import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PdfCanvas, usePdfEditorStore } from 'features/pdfEditor';;
import { type EditablePdfBlock } from 'features/pdfEditor';

const mockStructure = {
  numPages: 1,
  pages: [
    {
      number: 1,
      width: 600,
      height: 800,
      texts: [],
      annotations: [],
      images: [],
    },
  ],
};

const generateBlock = (override = {}): EditablePdfBlock => ({
  id: 'block-1',
  pageNumber: 1,
  str: 'Test string',
  html: 'Test string',
  x: 10,
  y: 100,
  width: 100,
  height: 20,
  fontSize: 16,
  fontFamily: 'Arial',
  alignment: 'left',
  fontWeight: 'normal',
  fontStyle: 'normal',
  ...override,
});

const setupStore = (blocks: EditablePdfBlock[]) => {
  usePdfEditorStore.getState().setBlocks(blocks);
};

describe('PdfCanvas DOM and rendering', () => {
  beforeEach(() => {
    usePdfEditorStore.getState().setBlocks([]);
  });

  it('renders fallback message if structure is null', () => {
    render(
      <PdfCanvas
        structure={null}
        pageIndex={0}
        zoom={100}
        onUpdate={vi.fn()}
        onSelectTextEl={vi.fn()}
      />
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders paragraphs with correct styles', () => {
    const block = generateBlock({ str: 'Very long text', fontSize: 18 });
    setupStore([block]);

    render(
      <PdfCanvas
        structure={mockStructure}
        pageIndex={0}
        zoom={100}
        onUpdate={vi.fn()}
        onSelectTextEl={vi.fn()}
      />
    );

    const paragraph = screen.getByText(/very long text/i);
    const styles = getComputedStyle(paragraph);

    expect(styles.fontSize).toBe('18px');
    expect(styles.fontFamily.toLowerCase()).toContain('arial');
    expect(styles.lineHeight).not.toBe('0px');
    expect(styles.overflowWrap).toBe('break-word');
  });

  it('triggers onUpdate on blur if text changed', async () => {
    const block = generateBlock();
    const onUpdate = vi.fn();
    setupStore([block]);

    render(
      <PdfCanvas
        structure={mockStructure}
        pageIndex={0}
        zoom={100}
        onUpdate={onUpdate}
        onSelectTextEl={vi.fn()}
      />
    );

    const editable = screen.getByText(/test string/i);
    editable.innerText = 'Modified content';
    fireEvent.blur(editable);

    expect(onUpdate).toHaveBeenCalledWith('block-1', 'Modified content', expect.any(String));
  });

  it('calls onSelectTextEl when clicked', () => {
    const block = generateBlock();
    const onSelect = vi.fn();
    setupStore([block]);

    render(
      <PdfCanvas
        structure={mockStructure}
        pageIndex={0}
        zoom={100}
        onUpdate={vi.fn()}
        onSelectTextEl={onSelect}
      />
    );

    const editable = screen.getByText(/test string/i);
    fireEvent.click(editable);
    expect(onSelect).toHaveBeenCalled();
  });

  it('splits content into multiple pages based on height', () => {
    const blocks = Array.from({ length: 30 }).map((_, i) =>
      generateBlock({ id: `b-${i}`, y: 100 + i * 30, str: `Text ${i}` })
    );
    setupStore(blocks);

    render(
      <PdfCanvas
        structure={mockStructure}
        pageIndex={0}
        zoom={100}
        onUpdate={vi.fn()}
        onSelectTextEl={vi.fn()}
      />
    );

    const pages = screen.getAllByTestId('pdf-page');
    expect(pages.length).toBeGreaterThanOrEqual(2);
  });
});
