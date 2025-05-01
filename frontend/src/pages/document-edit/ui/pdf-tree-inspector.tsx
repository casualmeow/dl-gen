import { type PdfStructure } from '../api/pdf-parser';
import { X } from 'lucide-react';
import { Button } from 'entities/components';
import { useState, useEffect } from 'react';
import { EditablePdfBlock } from 'features/pdfEditor';

export const PdfTreeInspector = ({
  structure,
  onSelect,
  onClose,
  isClosing,
}: {
  structure: PdfStructure | null;
  onSelect: (obj: EditablePdfBlock) => void;
  onClose: () => void;
  isClosing?: boolean;
}) => {
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsAnimatingIn(true);
    });
  }, []);
  if (!structure) return <div className="w-80 border-r p-2 text-sm">Loading...</div>;

  return (
    <div
      className={`
        w-80 h-full overflow-auto border-r p-2 text-sm bg-muted transition-all duration-300 transform
        ${isClosing ? '-translate-x-full opacity-0' : ''}
        ${isAnimatingIn && !isClosing ? 'translate-x-0 opacity-100' : 'translate-x-[-100%] opacity-0'}
      `}
    >
      {/* <div
      className={`
        w-80 h-full overflow-auto border-r p-2 text-sm bg-muted transition-all duration-300 transform
        ${isClosing ? 'translate-x-full opacity-0' : ''}
        ${isAnimatingIn && !isClosing ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}
      `}
    ></div> */}
      <div className="sticky top-0 z-10 bg-muted flex items-center justify-between mb-2 p-2 border-b">
        <span className="font-semibold text-base pl-1">PDF Structure</span>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X />
        </Button>
      </div>
      <div className="p-2">
        {structure.pages.map((page) => (
          <details key={page.number} className=" mb-2">
            <summary className="cursor-pointer font-semibold">Page {page.number}</summary>
            <ul className="pl-4">
              {page.texts.map((t, i) => (
                <li
                  key={i}
                  className="text-xs text-muted-foreground cursor-pointer hover:underline"
                  onClick={() => {
                    onSelect({ ...t, pageNumber: page.number, id: `block-${i}` });
                  }}
                >
                  {t.str.slice(0, 40)}...
                </li>
              ))}
            </ul>
          </details>
        ))}
      </div>
    </div>
  );
};
