import { cn } from "shared/lib/utils"
interface Props {
  blocks: {
    id: string;
    str: string;
    fontSize: number;
    fontFamily: string;
    fontWeight?: 'normal' | 'bold';
    fontStyle?: 'normal' | 'italic';
    alignment: 'left' | 'center' | 'right';
  }[];
  zoom: number;
  onUpdate: (id: string, str: string) => void;
  onSelectTextEl: (el: HTMLElement) => void;
}

export const PdfCanvas = ({ blocks, zoom, onUpdate, onSelectTextEl }: Props) => {
  if (!blocks) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        No PDF
      </div>
    );
  }

  const pageWidth = 794;
  const pageHeight = 1123;

  return (
    <div className="relative flex justify-center overflow-auto w-full bg-background p-4">
      <div
        className={cn(
          "bg-background text-foreground shadow-md border rounded-xl",
          "transition-colors duration-200"
        )}
        style={{
          transform: `scale(${zoom / 100})`,
          transformOrigin: 'top left',
          width: `${pageWidth}px`,
          minHeight: `${pageHeight}px`,
          padding: '3rem 2.5rem',
        }}
      >
        {blocks.map((block) => (
          <div
            key={block.id}
            contentEditable
            suppressContentEditableWarning
            className={cn(
              "outline-none whitespace-pre-wrap mb-2",
              "focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            )}
            style={{
              fontSize: `${block.fontSize}px`,
              fontFamily: block.fontFamily,
              fontWeight: block.fontWeight ?? 'normal',
              fontStyle: block.fontStyle ?? 'normal',
              textAlign: block.alignment,
            }}
            onInput={(e) =>
              onUpdate(block.id, (e.target as HTMLElement).innerText)
            }
            onClick={(e) => onSelectTextEl(e.currentTarget)}
          >
            {block.str}
          </div>
        ))}
      </div>
    </div>
  );
};