import { cn } from 'shared/lib/utils';
import { usePdfEditorStore } from '../model/store';
import { getParagraphHeight, PAGE_PADDING } from '../lib/utils';
import type { PdfStructure } from 'pages/document-edit';

interface Props {
  structure: PdfStructure | null;
  pageIndex: number;
  zoom: number;
  onUpdate: (id: string, text: string) => void;
  onSelectTextEl: (el: HTMLElement) => void;
}

export const PdfCanvas = ({
  structure,
  pageIndex,
  zoom,
  onUpdate,
  onSelectTextEl,
}: Props) => {
  const { blocks } = usePdfEditorStore();

  if (!structure) {
    return <div className="flex-1 flex items-center justify-center">Loading…</div>;
  }

  const page = structure.pages[pageIndex];
  const scaledWidth = page.width * (zoom / 100);
  const scaledHeight = page.height * (zoom / 100);

  const pageBlocks = blocks
    .filter((b) => b.pageNumber === page.number)
    .map((b) => ({
      ...b,
      y: page.height - b.y,
    }))
    .sort((a, b) => a.y - b.y || a.x - b.x);

    type Para = {
        id: string;
        text: string;
        fontSize: number;
        fontFamily: string;
        fontWeight: string;
        fontStyle: string;
        alignment: 'left' | 'center' | 'right';
      };
      

  // Группируем блоки в параграфы
  const paragraphs: Para[] = pageBlocks.map((block) => ({
    id: block.id,
    text: block.str,
    fontSize: block.fontSize,
    fontFamily: block.fontFamily,
    fontWeight: block.fontWeight ?? 'normal', // ✅ если undefined => 'normal'
    fontStyle: block.fontStyle ?? 'normal',   // ✅ если undefined => 'normal'
    alignment: block.alignment,
  }));
  

  // Разбиваем параграфы на страницы
    const pages: Para[][] = [];
    let currentPg: Para[] = [];
    let accHeight = PAGE_PADDING;

  paragraphs.forEach((p) => {
    const paraHeight = getParagraphHeight(p.fontSize, zoom);
  
    if (accHeight + paraHeight > scaledHeight + PAGE_PADDING) {
      pages.push([...currentPg]); // ✅ Клонируем currentPg в pages
      currentPg = [];
      accHeight = PAGE_PADDING;
    }
  
    currentPg.push(p);
    accHeight += paraHeight;
  });

  if (currentPg.length) pages.push(currentPg);

  return (
    <div className="flex flex-col items-center overflow-auto bg-background p-4 space-y-8">
      {pages.map((paras, idx) => (
        <div
          key={idx}
          className={cn("bg-background shadow border rounded-lg p-10")}
          style={{
            width: scaledWidth + PAGE_PADDING * 2,
            height: scaledHeight + PAGE_PADDING * 2,
          }}
        >
          {paras.map((p) => (
            <div
              key={p.id}
              contentEditable
              suppressContentEditableWarning
              className="whitespace-pre-wrap outline-none focus-visible:ring-2 focus-visible:ring-ring"
              style={{
                fontSize: p.fontSize * (zoom / 100),
                fontFamily: `${p.fontFamily}, Times New Roman, system-ui, sans-serif`,
                fontWeight: p.fontWeight,
                fontStyle: p.fontStyle,
                textAlign: p.alignment as any,
                lineHeight: `${p.fontSize * 1.3 * (zoom / 100)}px`,
                overflowWrap: 'break-word',
                wordBreak: 'break-word',
                maxWidth: scaledWidth - PAGE_PADDING * 2,
                marginBottom: p.fontSize * 0.6,
              }}
              onBlur={(e) => {
                const newText = e.currentTarget.innerText;
                if (newText !== p.text) onUpdate(p.id, newText);
              }}
              onClick={(e) => onSelectTextEl(e.currentTarget)}
            >
              {p.text}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
