import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { usePdfStructure } from '../model/pdf-structure';
import { PdfTreeInspector } from './pdf-tree-inspector';
import { PdfCanvas } from './pdf-canvas';
import { ObjectInspector } from './object-inspector';
import { PdfEditorToolbar } from './editor-toolbar';

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
    fetch(`/file/${fileId}.pdf`)
      .then((res) => res.arrayBuffer())
      .then(load);
  }, [fileId]);

  return (
    <div className="flex flex-col h-screen w-full">
      <PdfEditorToolbar onStyle={handleStyle} />

      <div className="flex flex-1 overflow-hidden">
        <PdfTreeInspector structure={structure} onSelect={setSelected} />
        <PdfCanvas
          structure={structure}
          onSelect={(obj, el) => {
            setSelected(obj);
            setSelectedTextEl(el);
          }}
        />
      </div>

      <ObjectInspector selected={selected ?? {}} />
    </div>
  );
};
