import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { usePdfStructure } from '../model/pdf-structure';
import { PdfTreeInspector } from './pdf-tree-inspector';
import { PdfCanvas } from './pdf-canvas';
import { PdfEditorToolbar } from './editor-toolbar';
import { AppSidebar } from 'widgets/sidebar';
import AppSidebarProvider from 'widgets/sidebar/ui/provider';
import { AppHeader } from 'widgets/header';
import { ObjectInspector } from './object-inspector';
import { EditMenubar } from './edit-menubar';

export const EditPage = () => {
  const { fileId } = useParams();

  const { structure, load, selected, setSelected } = usePdfStructure();
  const [selectedTextEl, setSelectedTextEl] = useState<HTMLElement | null>(null);

  const handleStyle = (style: 'bold' | 'italic' | 'underline') => {
    if (selectedTextEl) {
      if (style === 'bold') selectedTextEl.style.fontWeight = 'bold';
      if (style === 'italic') selectedTextEl.style.fontStyle = 'italic';
      if (style === 'underline') selectedTextEl.style.textDecoration = 'underline';
    }
  };

  useEffect(() => {
    if (!fileId) return;
    fetch(`/api/files/${fileId}`)
      .then((res) => res.arrayBuffer())
      .then(load);
  }, [fileId]);

  const params = useParams();
  console.log(params);

  return (
    // <div className="flex flex-col h-screen w-full">
    //   <PdfEditorToolbar onStyle={handleStyle} />

    //   <div className="flex flex-1 overflow-hidden">
    //     <PdfTreeInspector structure={structure} onSelect={setSelected} />
    //     <PdfCanvas
    //       structure={structure}
    //       onSelect={(obj, el) => {
    //         setSelected(obj);
    //         setSelectedTextEl(el);
    //       }}
    //     />
    //   </div>

    //   <ObjectInspector selected={selected ?? {}} />
    // </div>
    <AppSidebarProvider>
      <AppSidebar />
      <div className="flex flex-col w-full">
        <AppHeader breadcrumbs={[{ label: 'Your works', href: '/' }, { label: 'editor' }]} />
        <EditMenubar />
        <PdfEditorToolbar onStyle={handleStyle} />
        <PdfTreeInspector structure={structure} onSelect={setSelected} />
        <PdfCanvas
          structure={structure}
          onSelect={(obj, el) => {
            setSelected(obj);
            setSelectedTextEl(el);
          }}
        />
        <ObjectInspector selected={selected ?? {}} />
      </div>
    </AppSidebarProvider>
  );
};
