import { type PdfStructure } from '../api/pdf-parser';
import { X } from 'lucide-react'
import { Button } from 'entities/components';

export const PdfTreeInspector = ({
  structure,
  onSelect,
}: {
  structure: PdfStructure | null;
  onSelect: (obj: Record<string, unknown>) => void;
}) => {
  if (!structure) return <div className="w-80 border-r p-2 text-sm">Loading...</div>;

  return (
    <div className="w-80 h-full overflow-auto border-r text-sm bg-muted">
      <div className="sticky top-0 z-10 bg-muted flex items-center justify-between mb-2 p-2 border-b">
        <span className="font-semibold text-base pl-1">PDF Structure</span>
        <Button variant="ghost" size="icon">
          <X />
        </Button>
      </div>
      <div className='p-2'>
      {structure.pages.map((page) => (
        <details key={page.number} className=" mb-2">
          <summary className="cursor-pointer font-semibold">Page {page.number}</summary>
          <ul className="pl-4">
            {page.texts.map((t, i) => (
              <li
                key={i}
                className="text-xs text-muted-foreground cursor-pointer hover:underline"
                onClick={() => onSelect(t)}
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
