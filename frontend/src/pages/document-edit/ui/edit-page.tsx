import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { usePdfStructure } from '../model/pdf-structure';
import { PdfTreeInspector } from './pdf-tree-inspector';
import { PdfCanvas } from './pdf-canvas';
import { PdfEditorToolbar } from './editor-toolbar';
import { AppSidebar } from 'widgets/sidebar';
import AppSidebarProvider from 'widgets/sidebar/ui/provider';
import { AppHeader } from 'widgets/header';
import { EditMenubar } from './edit-menubar';
import { UploadProvider } from './upload/context';
import { UploadModal } from './upload/modal';
import { ToastProvider } from '../api/toast-provider';
import { LowerBar } from './lower-bar';
import { usePdfEditor } from '../model/usePdfEditor';
import { v4 as uuidv4 } from 'uuid';

export interface PdfText {
  str: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  alignment: 'left' | 'center' | 'right';
  lineBreakAfter?: boolean;
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
}

export interface EditablePdfBlock extends PdfText {
  id: string;
}


export const EditPage = () => {
  const { fileId } = useParams();
  const { structure, load, setSelected } = usePdfStructure();
  const [selectedTextEl, setSelectedTextEl] = useState<HTMLElement | null>(null);

  const { zoom, setZoom, page, totalPages, wordCount, isSaved } = usePdfEditor();

  const [paragraphs, setParagraphs] = useState<PdfText[][]>([]);
  const [blocks, setBlocks] = useState<EditablePdfBlock[]>([]);

  useEffect(() => {
    if (!fileId) return;
    fetch(`/api/files/${fileId}`)
      .then((res) => res.arrayBuffer())
      .then(load);
  }, [fileId]);

  useEffect(() => {
    if (!structure) return;
    const currentPage = structure.pages[page - 1];
    const grouped = groupTextIntoParagraphs(currentPage.texts, currentPage.height);
    setParagraphs(grouped);
  }, [structure, page]);

  useEffect(() => {
    if (paragraphs.length > 0) {
      const initialBlocks: EditablePdfBlock[] = paragraphs.flat().map((block) => ({
        ...block,
        id: uuidv4(),
      }));
      setBlocks(initialBlocks);
    }
  }, [paragraphs]);

  const handleStyle = (style: 'bold' | 'italic' | 'underline') => {
    if (selectedTextEl) {
      selectedTextEl.style.fontWeight = style === 'bold' ? 'bold' : '';
      selectedTextEl.style.fontStyle = style === 'italic' ? 'italic' : '';
      selectedTextEl.style.textDecoration = style === 'underline' ? 'underline' : '';
    }
  };

  const updateText = (id: string, str: string) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, str } : b)));
  };

  return (
    <AppSidebarProvider>
      <UploadProvider>
        <ToastProvider>
          <AppSidebar />
          <div className="grid grid-rows-[auto_auto_auto_1fr_auto] h-screen w-full">
            <AppHeader breadcrumbs={[{ label: 'Your works', href: '/' }, { label: 'Editor' }]} />
            <EditMenubar />
            <PdfEditorToolbar onStyle={handleStyle} />
            <div className="flex flex-row overflow-hidden">
              <PdfTreeInspector structure={structure} onSelect={setSelected} />
              <PdfCanvas
                blocks={blocks}
                zoom={zoom}
                onUpdate={updateText}
                onSelectTextEl={setSelectedTextEl}
              />
            </div>
            <LowerBar
              zoom={zoom}
              onZoomChange={setZoom}
              page={page}
              totalPages={totalPages}
              wordCount={wordCount}
              isSaved={isSaved}
              onPageClick={() => {}}
            />
            <UploadModal />
          </div>
        </ToastProvider>
      </UploadProvider>
    </AppSidebarProvider>
  );
};


function groupTextIntoParagraphs(
  texts: PdfText[],
  pageHeight: number
): PdfText[][] {
  const sorted = [...texts].sort((a, b) => (pageHeight - a.y) - (pageHeight - b.y));
  const paragraphs: PdfText[][] = [];
  let currentLine: PdfText[] = [];
  let lastY: number | null = null;

  for (const item of sorted) {
    const currentY = pageHeight - item.y;
    const deltaY = lastY !== null ? Math.abs(currentY - lastY) : 0;

    if (lastY !== null && (deltaY > item.fontSize * 1.5 || item.lineBreakAfter)) {
      paragraphs.push(currentLine);
      currentLine = [];
    }

    currentLine.push(item);
    lastY = currentY;
  }

  if (currentLine.length > 0) paragraphs.push(currentLine);

  return paragraphs;
}
