import { useState } from 'react';
import { type PdfStructure } from '../utils/pdf-parser';

type Props = {
  structure: PdfStructure | null;
  onSelect: (obj: Record<string, unknown>) => void;
};

export const PdfCanvas = ({ structure, onSelect }: Props) => {
  const [zoom, setZoom] = useState(1.0);
  const [positions, setPositions] = useState<Record<number, { x: number; y: number }>>({});

  const handleDrag = (index: number, e: React.MouseEvent<HTMLSpanElement>) => {
    const onMouseMove = (event: MouseEvent) => {
      setPositions((prev) => ({
        ...prev,
        [index]: {
          x: event.clientX,
          y: event.clientY,
        },
      }));
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  if (!structure) {
    return <div className="flex-1 flex items-center justify-center">No PDF Loaded</div>;
  }

  const page = structure.pages[0]; // лише перша сторінка поки що

  return (
    <div className="relative flex-1 bg-white overflow-auto border">
      <div className="absolute left-4 top-4 z-10 flex gap-2 bg-gray-100 p-2 rounded shadow">
        <button
          className="px-2 py-1 bg-white rounded border"
          onClick={() => setZoom((z) => z + 0.1)}
        >
          +
        </button>
        <button
          className="px-2 py-1 bg-white rounded border"
          onClick={() => setZoom((z) => z - 0.1)}
        >
          -
        </button>
        <span>{Math.round(zoom * 100)}%</span>
      </div>

      <div className="relative p-10 origin-top-left" style={{ transform: `scale(${zoom})` }}>
        {page.texts.map((text, i) => {
          const pos = positions[i] || { x: text.x, y: 800 - text.y };
          return (
            <span
              key={i}
              className="absolute text-[12px] cursor-move select-none hover:bg-yellow-200"
              style={{ left: pos.x, top: pos.y }}
              onMouseDown={(e) => handleDrag(i, e)}
              onClick={() => onSelect(text)}
            >
              {text.str}
            </span>
          );
        })}

        {/* Картинки, якщо є */}
        {page.images?.map((img, i) => (
          <img
            key={`img-${i}`}
            src={img.src}
            className="absolute border cursor-pointer"
            style={{ left: img.x, top: 800 - img.y, width: img.width, height: img.height }}
            onClick={() => onSelect(img)}
          />
        ))}

        {/* Анотації */}
        {page.annotations?.map((anno, i) => (
          <div
            key={`anno-${i}`}
            className="absolute border-dashed border-red-500 cursor-pointer"
            style={{ left: anno.x, top: 800 - anno.y, width: anno.width, height: anno.height }}
            onClick={() => onSelect(anno)}
          >
            <span className="text-xs text-red-500">{anno.content}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
