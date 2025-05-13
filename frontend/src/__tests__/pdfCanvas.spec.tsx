import { render, screen, fireEvent } from '@testing-library/react';
import { PdfCanvas } from 'features/pdfEditor/ui/canvas';
import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { usePdfEditorStore } from 'features/pdfEditor/model/store';
import { createMockBlocks, createMockStructure } from './utils/createMockStructure';

vi.mock('features/pdfEditor/model/store', () => ({
  usePdfEditorStore: vi.fn(),
}));

const mockedUsePdfEditorStore = usePdfEditorStore as unknown as Mock;

const mockSetPages = vi.fn();
const mockUpdateBlock = vi.fn();

describe('PdfCanvas DOM and rendering', () => {
  const structure = createMockStructure(1, 600, 800);
  const onUpdate = vi.fn();
  const onSelect = vi.fn();

  beforeEach(() => {
    const blocks = createMockBlocks(20).map((b) => ({
      ...b,
      pageNumber: structure.pages[0].number,
    }));

    mockedUsePdfEditorStore.mockReturnValue({
      blocks,
      pages: [blocks.map((b) => b.id)],
      setPages: mockSetPages,
      updateBlock: mockUpdateBlock,
    });
  });

  it('renders fallback when structure is null', () => {
    render(
      <PdfCanvas
        structure={null}
        pageIndex={0}
        zoom={100}
        onUpdate={onUpdate}
        onSelectTextEl={onSelect}
      />,
    );
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders paragraphs with correct styles', () => {
    render(
      <PdfCanvas
        structure={structure}
        pageIndex={0}
        zoom={100}
        onUpdate={onUpdate}
        onSelectTextEl={onSelect}
      />,
    );
    expect(screen.getByText('Text 0')).toBeInTheDocument();
  });

  it('triggers onUpdate on blur if text changed', () => {
    render(
      <PdfCanvas
        structure={structure}
        pageIndex={0}
        zoom={100}
        onUpdate={onUpdate}
        onSelectTextEl={onSelect}
      />,
    );
    const el = screen.getByText('Text 1');
    fireEvent.blur(el, {
      target: { innerText: 'Foo', innerHTML: '<p>Foo</p>' },
    });
    expect(onUpdate).toHaveBeenCalled();
  });

  it('calls onSelectTextEl when clicked', () => {
    render(
      <PdfCanvas
        structure={structure}
        pageIndex={0}
        zoom={100}
        onUpdate={onUpdate}
        onSelectTextEl={onSelect}
      />,
    );
    fireEvent.click(screen.getByText('Text 2'));
    expect(onSelect).toHaveBeenCalled();
  });

  it('splits content into multiple pages based on height', () => {
    const manyBlocks = createMockBlocks(60);
    mockedUsePdfEditorStore.mockReturnValue({
      blocks: manyBlocks,
      pages: [manyBlocks.slice(0, 30).map((b) => b.id), manyBlocks.slice(30).map((b) => b.id)],
      setPages: mockSetPages,
      updateBlock: mockUpdateBlock,
    });

    render(
      <PdfCanvas
        structure={structure}
        pageIndex={0}
        zoom={100}
        onUpdate={onUpdate}
        onSelectTextEl={onSelect}
      />,
    );
    const pages = screen.getAllByTestId('pdf-page');
    expect(pages.length).toBeGreaterThanOrEqual(2);
  });

  it('renders block with correct styles & alignment', () => {
    const specialBlock = {
      ...createMockBlocks(1)[0],
      str: 'Test content',
      html: '<p>Test content</p>',
      alignment: 'center' as const,
      fontWeight: 'bold' as const,
      fontStyle: 'italic' as const,
    };

    mockedUsePdfEditorStore.mockReturnValue({
      blocks: [specialBlock],
      pages: [[specialBlock.id]],
      setPages: mockSetPages,
      updateBlock: mockUpdateBlock,
    });

    render(
      <PdfCanvas
        structure={structure}
        pageIndex={0}
        zoom={100}
        onUpdate={onUpdate}
        onSelectTextEl={onSelect}
      />,
    );
    const node = screen.getByText('Test content');
    expect(node).toHaveAttribute('data-alignment', 'center');
    expect(node).toHaveStyle({
      textAlign: 'center',
      fontWeight: 'bold',
      fontStyle: 'italic',
    });
  });
});
