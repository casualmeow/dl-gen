import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { usePdfStructure } from '../model/pdf-structure';
import { usePdfEditorStore } from 'features/pdfEditor/model/store';
import { PdfTreeInspector } from './pdf-tree-inspector';
import { PdfCanvas } from 'features/pdfEditor';
import { PdfEditorToolbar } from './editor-toolbar';
import { AppSidebar } from 'widgets/sidebar';
import { AppSidebarProvider } from 'widgets/sidebar';
import { AppHeader } from 'widgets/header';
import { EditMenubar } from './edit-menubar';
import { UploadProvider } from './upload/context';
import { UploadModal } from './upload/modal';
import { ToastProvider } from '../api/toast-provider';
import { LowerBar } from './lower-bar';
import { usePdfEditor } from '../model/usePdfEditor';
import { v4 as uuidv4 } from 'uuid';
import { ArrowRight, Plus } from 'lucide-react';
import { Dock, DockItem } from 'widgets/dock';

export const EditPage = () => {
  const { fileId } = useParams();
  const { structure, load } = usePdfStructure();
  const [selectedTextEl, setSelectedTextEl] = useState<HTMLElement | null>(null);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [isInspectorVisible, setIsInspectorVisible] = useState(false);
  const { zoom, setZoom, page, setPage, totalPages, wordCount, isSaved } = usePdfEditor();
  const { setBlocks, updateBlock } = usePdfEditorStore();

  useEffect(() => {
    if (inspectorOpen) setIsInspectorVisible(true);
  }, [inspectorOpen]);
  
  const handleInspectorClose = () => {
    setInspectorOpen(false);
    setTimeout(() => setIsInspectorVisible(false), 300);
  };

  useEffect(() => {
    if (!fileId) return;
    fetch(`/api/files/${fileId}`)
      .then((res) => res.arrayBuffer())
      .then(load);
  }, [fileId]);

  useEffect(() => {
    if (!structure) return;
    const pageObj = structure.pages[page - 1];
    setBlocks(pageObj.texts.map(t => ({
      id: uuidv4(),
      pageNumber: pageObj.number,
      str: t.str,
      x: t.x,
      y: t.y,
      width: t.width,
      height: t.height,
      fontSize: t.fontSize,
      fontFamily: t.fontFamily,
      alignment: t.alignment,
      lineBreakAfter: t.lineBreakAfter,
      fontWeight: t.isBold ? 'bold' : 'normal',
      fontStyle: t.isItalic ? 'italic' : 'normal',
      html: t.str, // ← на початку просто плейнтекст

    })));
  }, [structure, page]);

  const handleStyle = (style: 'bold' | 'italic' | 'underline') => {
    if (selectedTextEl) {
      document.execCommand(style);
    }
  };

  const updateText = (id: string, str: string, html: string) => {
    updateBlock(id, { str, html });
  };
  
  return (
    <AppSidebarProvider>
      <UploadProvider>
        <ToastProvider>
          <AppSidebar />
          <div className="grid grid-rows-[auto_auto_auto_1fr_auto] h-screen w-full">
            <AppHeader breadcrumbs={[
              { label: 'Your works', href: '/' },
              { label: 'Editor' }]} 
              actionButton={{
                label: 'Next',
                icon: <ArrowRight className="w-4 h-4" />,
                onClick: () => {
                },
              }}/>
            <EditMenubar />
            <PdfEditorToolbar
              onStyle={handleStyle}
              onToggleInspector={() => setInspectorOpen(true)}
            />
            <div className="flex flex-1 overflow-auto flex-row justify-center">
              {isInspectorVisible && (
                <PdfTreeInspector
                  structure={structure}
                  onSelect={(t) => {
                    setPage(t.pageNumber);
                    setTimeout(() => {
                      const el = document.getElementById(`para-${t.id}`);
                      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 100);
                  }}
                  onClose={handleInspectorClose}
                  isClosing={!inspectorOpen}
                />
              )}
              {structure ? (
                <PdfCanvas
                  structure={structure}
                  pageIndex={page - 1}
                  zoom={zoom}
                  onUpdate={updateText}
                  onSelectTextEl={setSelectedTextEl}
                />
              ) : (
                <div className="flex-1 flex items-center justify-center">Loading PDF…</div>
              )}
              <Dock position='bottom'>
              <DockItem
                    icon={<Plus />}
                    label="Settings"
                    onClick={() => console.log("Settings clicked")}
                />
              </Dock>  
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
