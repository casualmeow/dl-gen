'use client';

import { useParams } from 'react-router';
import { useEffect, useRef, useState } from 'react';
import { Bold, Italic, Underline } from 'lucide-react';
import { Toggle } from 'entities/components/ui/toggle'; // TODO: змінити на власний компонент
import { PdfCanvas } from './pdf-canvas';
import { PdfTreeInspector } from './pdf-tree-inspector';
import { usePdfStructure } from '../model/pdf-structure';

export const EditPage = () => {
  const { fileId } = useParams(); // з URL /edit/:fileId
  const canvasRef = useRef<HTMLDivElement>(null);
  const [selectedText, setSelectedText] = useState<HTMLElement | null>(null);

  const handleStyle = (style: 'bold' | 'italic' | 'underline') => {
    if (selectedText) {
      selectedText.style.fontWeight = style === 'bold' ? 'bold' : selectedText.style.fontWeight;
      selectedText.style.fontStyle = style === 'italic' ? 'italic' : selectedText.style.fontStyle;
      selectedText.style.textDecoration =
        style === 'underline' ? 'underline' : selectedText.style.textDecoration;
    }
  };

  useEffect(() => {
    const dummyText = document.createElement('div');
    dummyText.innerText = 'Це тестовий текст';
    dummyText.className = 'absolute left-20 top-20 text-[16px] cursor-pointer';
    dummyText.contentEditable = 'true';
    dummyText.onclick = () => setSelectedText(dummyText);
    canvasRef.current?.appendChild(dummyText);
  }, []);

  return (
    <div className="relative w-full h-screen flex flex-col">
      {/* Toolbar/  // decompose */}
      <div className="w-full p-2 bg-gray-100 border-b shadow flex items-center gap-2">
        <Toggle onClick={() => handleStyle('bold')}>
          <Bold className="w-4 h-4" />
        </Toggle>
        <Toggle onClick={() => handleStyle('italic')}>
          <Italic className="w-4 h-4" />
        </Toggle>
        <Toggle onClick={() => handleStyle('underline')}>
          <Underline className="w-4 h-4" />
        </Toggle>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 relative overflow-auto" ref={canvasRef}>
        {/* Тут буде рендер PDF та оверлеї */}
      </div>
    </div>
  );
};
