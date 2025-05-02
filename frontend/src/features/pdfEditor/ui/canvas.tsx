
import { useMemo, useRef, useLayoutEffect, useState } from 'react';
import { usePdfEditorStore } from '../model/store';
import type { PdfStructure } from 'pages/document-edit';
import { PAGE_PADDING } from '../lib/utils';
import { cn } from 'shared/lib/utils';

type Paragraph = {
  id: string;
  text: string;
  indent: number;
  style: {
    fontSize: number;
    fontFamily: string;
    fontWeight: string;
    fontStyle: string;
    textAlign: 'left' | 'center' | 'right';
    lineHeight: string;
    maxWidth: number;
  };
};

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
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const blockRefs = useRef(new Map<string, HTMLDivElement>());

  const page = structure?.pages[pageIndex];
  if (!structure || !page) {
    return <div className="flex-1 flex items-center justify-center">Loading…</div>;
  }

  // scaled dimensions
  const scaledWidth = page.width * (zoom / 100);
  const scaledHeight = page.height * (zoom / 100);

  const paragraphs: Paragraph[] = useMemo(() => {
    const sorted = blocks
      .filter((b) => b.pageNumber === page.number)
      .map((b) => ({ ...b, y: page.height - b.y }))
      .sort((a, b) => a.y - b.y || a.x - b.x);

    // cluster into lines
    const clusters: typeof sorted[] = [];
    let curr: typeof sorted = [];
    let lastY: number | null = null;

    for (const blk of sorted) {
      const delta = lastY === null ? 0 : Math.abs(blk.y - lastY);
      if (lastY !== null && (delta > blk.fontSize * 1.3 || blk.lineBreakAfter)) {
        clusters.push(curr);
        curr = [];
      }
      curr.push(blk);
      lastY = blk.y;
    }
    if (curr.length) clusters.push(curr);

    return clusters.map((cluster) => {
      const first = cluster[0];
      const text = cluster.map((c) => c.str).join(' ');
      const indentPx = Math.min(...cluster.map((c) => c.x)) * (zoom / 100) + PAGE_PADDING;
      const fontSizePx = first.fontSize * (zoom / 100);
      const lineHeightPx = first.fontSize * 1.3 * (zoom / 100);
      return {
        id: first.id,
        text,
        indent: indentPx,
        style: {
          fontSize: fontSizePx,
          fontFamily: `${first.fontFamily}, Times New Roman, system-ui, sans-serif`,
          fontWeight: first.fontWeight ?? 'normal',
          fontStyle: first.fontStyle ?? 'normal',
          textAlign: first.alignment as any,
          lineHeight: `${lineHeightPx}px`,
          maxWidth: scaledWidth - indentPx - PAGE_PADDING,
        },
      };
    });
  }, [blocks, page, zoom, scaledWidth]);

  // 3️⃣ split paragraphs into pages by accumulating heights

  const pageBlocks = usePdfEditorStore(s => 
    s.blocks.filter(b => b.pageNumber === page.number)
  );
  
  useLayoutEffect(() => {
    if (!pageBlocks.length) return;
  
    const tempPages: string[][] = [];
    let currentPage: string[] = [];
    let accHeight = PAGE_PADDING;
  
    pageBlocks.forEach((block) => {
      const el = blockRefs.current.get(block.id);
      const height = el?.offsetHeight ?? block.fontSize * 1.3 * (zoom / 100);
  
      if (accHeight + height > scaledHeight) {
        if (currentPage.length) {
          tempPages.push(currentPage);
          currentPage = [];
          accHeight = PAGE_PADDING;
        }
      }
  
      currentPage.push(block.id);
      accHeight += height;
    });
  
    if (currentPage.length) {
      tempPages.push(currentPage);
    }
  
    // Prevent unnecessary updates:
    setPages((prevPages) => {
      if (JSON.stringify(prevPages) !== JSON.stringify(tempPages)) {
        return tempPages;
      }
      return prevPages;
    });
  }, [pageBlocks, zoom, scaledHeight, setPages]);
  
  
  
  

  // 4️⃣ render
  return (
    <div className="flex flex-col flex-1 items-center overflow-auto bg-background p-4 space-y-8">
      {pages.map((ids, pi) => (
        <div
          key={pi}
          data-testid="pdf-page"
          className="bg-white shadow border rounded-lg p-10 overflow-hidden relative"
          style={{
            width: scaledWidth + PAGE_PADDING * 2,
            height: scaledHeight + PAGE_PADDING * 2,
            paddingBottom: PAGE_PADDING,
          }}
        >
          {ids.map((id) => {
            const p = paragraphs.find((x) => x.id === id);
            if (!p) return null;

            return (
              <div
                key={p.id}
                ref={(el) => {
                  if (el) blockRefs.current.set(p.id, el);
                }}
                contentEditable
                suppressContentEditableWarning
                data-alignment={p.style.textAlign}
                className={cn(
                  'whitespace-pre-wrap outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  focusedId === p.id && 'shiny-text'
                )}
                style={{
                  marginLeft: p.indent,
                  maxWidth: p.style.maxWidth,
                  fontSize: p.style.fontSize,
                  fontFamily: p.style.fontFamily,
                  fontWeight: p.style.fontWeight,
                  fontStyle: p.style.fontStyle,
                  textAlign: p.style.textAlign,
                  lineHeight: p.style.lineHeight,
                  marginBottom: p.style.fontSize * 0.6,
                }}
                onFocus={() => setFocusedId(p.id)}
                onBlur={(e) => {
                  setFocusedId(null);
                  const txt = e.currentTarget.innerText;
                  const html = e.currentTarget.innerHTML;
                  if (txt !== p.text || html !== p.text) {
                    onUpdate(p.id, txt, html);
                  }
                }}
                onClick={(e) => onSelectTextEl(e.currentTarget)}
              >
                {p.text}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};
