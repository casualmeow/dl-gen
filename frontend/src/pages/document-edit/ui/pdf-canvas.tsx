import { useState } from 'react';
import { cn } from 'shared/lib/utils';

interface Props {
  blocks: {
    id: string;
    str: string;
    fontSize: number;
    fontFamily: string;
    fontWeight?: 'normal' | 'bold';
    fontStyle?: 'normal' | 'italic';
    alignment: 'left' | 'center' | 'right';
    x: number;
    y: number;
    pageNumber: number;
  }[];
  zoom: number;
  pageIndex: number;
  onUpdate: (id: string, str: string) => void;
  onSelectTextEl: (el: HTMLElement) => void;
}

export const PdfCanvas = ({ blocks, zoom, pageIndex, onUpdate, onSelectTextEl }: Props) => {
  const pageWidth = 794;
  const pageHeight = 1123;
  const pageBlocks = blocks.filter((b) => b.pageNumber === pageIndex + 1);

  const EditableBlock = ({ block }: { block: Props['blocks'][number] }) => {
    const [text, setText] = useState(block.str);

    const updateLocalText = (newText: string) => {
      setText(newText);
    };

    const saveChanges = () => {
      onUpdate(block.id, text);
    };

    return (
      <div
        id={`block-${block.id}`}
        contentEditable
        suppressContentEditableWarning
        className={cn(
          "absolute w-fit text-foreground outline-none whitespace-pre-wrap",
          "focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
        )}
        style={{
          top: `${pageHeight - block.y}px`,
          left: `${block.x}px`,
          fontSize: `${block.fontSize}px`,
          fontFamily: block.fontFamily || 'Times New Roman',
          fontWeight: block.fontWeight ?? 'normal',
          fontStyle: block.fontStyle ?? 'normal',
          textAlign: block.alignment,
          lineHeight: `${block.fontSize * 1.2}px`,
        }}
        onInput={(e) => {
          updateLocalText((e.target as HTMLDivElement).innerText);
        }}
        onBlur={saveChanges}
        onClick={(e) => onSelectTextEl(e.currentTarget)}
      >
        {text}
      </div>
    );
  };

  return (
    <div className="relative flex justify-center overflow-auto w-full bg-background p-4">
      <div
        className={cn(
          "bg-background shadow-md border rounded-xl relative",
          "transition-colors duration-200"
        )}
        style={{
          transform: `scale(${zoom / 100})`,
          transformOrigin: 'top left',
          width: `${pageWidth}px`,
          minHeight: `${pageHeight}px`,
        }}
      >
        {pageBlocks.map((block) => (
          <EditableBlock key={block.id} block={block} />
        ))}
      </div>
    </div>
  );
};
