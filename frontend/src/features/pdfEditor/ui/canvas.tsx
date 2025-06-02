import { useMemo, useRef, useLayoutEffect, useState } from 'react';
import { usePdfEditorStore } from '../model/store';
import type { PdfStructure } from 'pages/document-edit';
import { PAGE_PADDING, getParagraphHeight } from '../lib/utils';
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
    textDecoration?: 'none' | 'underline';
  };
};

interface Props {
  structure: PdfStructure | null;
  pageIndex: number;
  zoom: number;
  onUpdate: (id: string, text: string, html: string) => void;
  onSelectTextEl: (el: HTMLElement) => void;
}

export const PdfCanvas = ({ structure, pageIndex, zoom, onUpdate, onSelectTextEl }: Props) => {
  const { blocks, pages, setPages } = usePdfEditorStore();
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const blockRefs = useRef(new Map<string, HTMLDivElement>());
  const lastPagesRef = useRef<string[][]>([]);

  // ✅ Перенесли useRef на верх компонента, а не внутрь useLayoutEffect
  // Здесь мы храним «токен» для текущего эффекта разделения на страницы
  const effectIdRef = useRef<number>(Date.now());

  const page = structure?.pages[pageIndex];
  if (!structure || !page) {
    return <div className="flex-1 flex items-center justify-center">Loading…</div>;
  }

  // Вычисляем размеры виртуальной страницы в пикселях
  const scaledWidth  = page.width  * (zoom / 100);
  const scaledHeight = page.height * (zoom / 100);

  // 1) Сортируем и группируем блоки в "абзацы"
  //    Извлекаем только те блоки, у которых block.pageNumber === page.number
  const paragraphs: Paragraph[] = useMemo(() => {
    const filtered = blocks.filter((b) => b.pageNumber === page.number);

    // Сортировка от нижнего края к верхнему, и слева направо
    const sorted = filtered
      .map((b) => ({ ...b, yForSort: page.height - b.y }))
      .sort((a, b) => a.yForSort - b.yForSort || a.x - b.x);

    // Группируем подряд идущие элементы в "кластеры" (строки/абзацы)
    const clusters: typeof sorted[] = [];
    let currCluster: typeof sorted = [];
    let lastY: number | null = null;

    for (const blk of sorted) {
      const lineHeight = blk.fontSize * 1.3;
      const delta = lastY === null ? 0 : Math.abs(blk.yForSort - lastY);

      if (lastY !== null && (delta > lineHeight * 0.9 || blk.lineBreakAfter)) {
        clusters.push(currCluster);
        currCluster = [];
      }

      currCluster.push(blk);
      lastY = blk.yForSort;
    }
    if (currCluster.length) clusters.push(currCluster);

    // Преобразуем каждый кластер в один Paragraph
    return clusters.map((cluster) => {
      const first = cluster[0];
      const textCombined = cluster.map((c) => c.str).join(' ');

      // Вычисляем горизонтальный отступ
      const indentPx = Math.min(...cluster.map((c) => c.x)) * (zoom / 100) + PAGE_PADDING;
      const fontSizePx = first.fontSize * (zoom / 100);
      const lineHeightPx = first.fontSize * 1.3 * (zoom / 100);

      return {
        id: first.id,
        text: textCombined,
        indent: indentPx,
        style: {
          fontSize: fontSizePx,
          fontFamily: `${first.fontFamily}, Times New Roman, sans-serif`,
          fontWeight: first.fontWeight ?? 'normal',
          fontStyle: first.fontStyle  ?? 'normal',
          textAlign: first.alignment as any,
          lineHeight: `${lineHeightPx}px`,
          textDecoration: first.textDecoration,
          maxWidth: scaledWidth - indentPx - PAGE_PADDING,
        },
      };
    });
  }, [blocks, page.number, page.height, page.width, zoom, scaledWidth]);

  // 2) Получаем список всех блоков, относящихся к этой странице,
  //    чтобы потом пройтись по ним при расчёте высот.
  const pageBlocks = useMemo(
    () => blocks.filter((b) => b.pageNumber === page.number),
    [blocks, page.number]
  );

  // 3) Разбиваем абзацы на «виртуальные страницы» по высоте
  useLayoutEffect(() => {
    // Если блоков вообще нет, сбрасываем pages и выходим
    if (!pageBlocks.length) {
      if (pages.length) {
        lastPagesRef.current = [];
        setPages([]);
      }
      return;
    }

    // Создаём локальную копию токена эффекта
    const currentEffectId = effectIdRef.current;

    let animationFrame: number;
    const splitPages = () => {
      // Если токен изменился (эффект исчерпан), выходим
      if (currentEffectId !== effectIdRef.current) return;

      const tempPages: string[][] = [];
      let currentPageArr: string[] = [];
      let accHeight = PAGE_PADDING;

      // Для каждого абзаца находим его фактический элемент в blockRefs
      paragraphs.forEach((p) => {
        const el = blockRefs.current.get(p.id);
        // Если Element ещё не отрендерен, fallback на грубый расчёт:
        const heightPx = el?.offsetHeight ?? getParagraphHeight(p.style.fontSize, zoom);

        if (accHeight + heightPx > scaledHeight - PAGE_PADDING) {
          // Завершаем текущую виртуальную страницу
          if (currentPageArr.length) {
            tempPages.push(currentPageArr);
            currentPageArr = [];
            accHeight = PAGE_PADDING;
          }
        }

        currentPageArr.push(p.id);
        accHeight += heightPx;
      });

      if (currentPageArr.length) {
        tempPages.push(currentPageArr);
      }

      // Сравниваем с предыдущими страницами, чтобы обновлять только при реальном изменении
      const prev = lastPagesRef.current;
      const isDifferent =
        prev.length !== tempPages.length ||
        prev.some((arr, i) => {
          const nextArr = tempPages[i] || [];
          if (arr.length !== nextArr.length) return true;
          return arr.some((id, j) => id !== nextArr[j]);
        });

      if (isDifferent) {
        lastPagesRef.current = tempPages;
        setPages(tempPages);
      }
    };

    // Ожидаем немного, чтобы DOM-элементы появились в дереве, и только потом замеряем
    const timeoutId = setTimeout(() => {
      animationFrame = window.requestAnimationFrame(splitPages);
    }, 50);

    return () => {
      clearTimeout(timeoutId);
      window.cancelAnimationFrame(animationFrame);
      // Обновляем токен, чтобы «старые» splitPages больше не срабатывали
      effectIdRef.current = Date.now();
    };
  }, [
    paragraphs,
    pageBlocks.length,
    scaledHeight,
    setPages,
    zoom,
    // NB: не включаем `blocks` напрямую, а используем `paragraphs`
  ]);

  // 4) Рендерим каждую виртуальную страницу
  return (
    <div className="flex flex-col flex-1 items-center overflow-auto bg-background p-4 space-y-8">
      {pages.map((ids, pageNum) => (
        <div
          key={pageNum}
          data-testid="pdf-page"
          className="bg-background shadow border rounded-lg overflow-hidden relative"
          style={{
            width: scaledWidth + PAGE_PADDING * 2,
            height: scaledHeight + PAGE_PADDING * 2,
            padding: PAGE_PADDING,
          }}
        >
          {ids.map((blockId) => {
            const p = paragraphs.find((x) => x.id === blockId);
            if (!p) return null;

            return (
              <div
                key={p.id}
                ref={(el) => {
                  if (el) blockRefs.current.set(p.id, el);
                }}
                contentEditable
                suppressContentEditableWarning
                data-block-id={p.id}
                className={cn(
                  'whitespace-pre-wrap outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  focusedId === p.id && 'text-primary'
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
                  textDecoration: p.style.textDecoration,
                  marginBottom: p.style.fontSize * 0.6,
                }}
                onFocus={() => setFocusedId(p.id)}
                onBlur={(e) => {
                  setFocusedId(null);
                  const newText = e.currentTarget.innerText;
                  const newHtml = e.currentTarget.innerHTML;
                  // Обновляем только в сторе, не трогая массив blocks напрямую
                  onUpdate(p.id, newText, newHtml);
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
