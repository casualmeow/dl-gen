import { type PdfStructure } from '../utils/pdf-parser';

export const PdfTreeInspector = ({
  structure,
  onSelect,
}: {
  structure: PdfStructure | null;
  onSelect: (obj: Record<string, unknown>) => void;
}) => {
  if (!structure) return <div className="w-80 border-r p-2 text-sm">Завантаження...</div>;

  return (
    <div className="w-80 h-full overflow-auto border-r p-2 text-sm bg-muted">
      {structure.pages.map((page) => (
        <details key={page.number} className="mb-2">
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
  );
};
