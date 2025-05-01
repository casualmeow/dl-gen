import { useMemo, useRef } from 'react';
import { usePdfEditorStore } from '../model/store';
import type { PdfStructure } from 'pages/document-edit';
import { PAGE_PADDING } from '../lib/utils';

interface Props {
  structure: PdfStructure | null;
  pageIndex: number;
  zoom: number;
  onUpdate: (id: string, text: string, html: string) => void;
  onSelectTextEl: (el: HTMLElement) => void;
}

export const PdfCanvas = ({
  structure,
  pageIndex,
  zoom,
  onUpdate,
  onSelectTextEl,
}: Props) => {
  const { blocks, pages, setPages } = usePdfEditorStore();

  const page = structure?.pages[pageIndex];
  const containerRef = useRef<HTMLDivElement>(null);
  if (!structure || !page) return <div className="flex-1 flex items-center justify-center">Loading…</div>;

  const scaledHeight = page.height * (zoom / 100);
  const scaledWidth = page.width * (zoom / 100);
  const pageBlocks = useMemo(() => blocks.filter((b) => b.pageNumber === page.number), [blocks, page]);

  useMemo(() => {
    const tempPages: string[][] = [];
    let currentPage: string[] = [];
    let accHeight = PAGE_PADDING;

    for (const block of pageBlocks) {
      const approxHeight = block.fontSize * 1.3 * (zoom / 100);
      if (accHeight + approxHeight > scaledHeight + PAGE_PADDING) {
        tempPages.push(currentPage);
        currentPage = [];
        accHeight = PAGE_PADDING;
      }

      currentPage.push(block.id);
      accHeight += approxHeight;
    }

    if (currentPage.length) tempPages.push(currentPage);
    setPages(tempPages);
  }, [pageBlocks, zoom, setPages]);

  return (
    <div ref={containerRef} className="flex flex-col items-center overflow-auto bg-background p-4 space-y-8">
      {pages.map((blockIds, pageIdx) => (
        <div
          key={pageIdx}
          className="bg-white shadow border rounded-lg p-10"
          style={{
            width: scaledWidth + PAGE_PADDING * 2,
            height: scaledHeight + PAGE_PADDING * 2,
          }}
        >
          {blockIds.map((id) => {
            const block = pageBlocks.find((b) => b.id === id);
            if (!block) return null;

            return (
              <div
                key={block.id}
                data-testid="pdf-page"
                contentEditable
                suppressContentEditableWarning
                className="whitespace-pre-wrap outline-none focus-visible:ring-2 focus-visible:ring-ring"
                style={{
                  fontSize: block.fontSize * (zoom / 100),
                  fontFamily: `${block.fontFamily}, Times New Roman, system-ui, sans-serif`,
                  fontWeight: block.fontWeight ?? 'normal',
                  fontStyle: block.fontStyle ?? 'normal',
                  textAlign: block.alignment as any,
                  lineHeight: `${block.fontSize * 1.3 * (zoom / 100)}px`,
                  overflowWrap: 'break-word',
                  wordBreak: 'break-word',
                  maxWidth: scaledWidth - PAGE_PADDING * 2,
                  marginBottom: block.fontSize * 0.6,
                }}
                onBlur={(e) => {
                  const newText = e.currentTarget.innerText;
                  const newHtml = e.currentTarget.innerHTML;
                  if (newText !== block.str || newHtml !== block.html) {
                    onUpdate(block.id, newText, newHtml);
                  }
                }}
                onClick={(e) => onSelectTextEl(e.currentTarget)}
              >
                {block.str}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};
