import { useState, useCallback } from 'react';
import { parsePdfStructure, type PdfStructure } from '../api/pdf-parser';
import { initPdfWorker } from 'entities/file';

initPdfWorker();

export function usePdfEditor() {
  const [structure, setStructure] = useState<PdfStructure | null>(null);
  const [selected, setSelected] = useState<Record<string, unknown> | null>(null);
  const [zoom, setZoom] = useState(100);
  const [page, setPage] = useState(1);
  const [isSaved, setIsSaved] = useState(true);

  const totalPages = structure?.pages.length ?? 0;

  const wordCount =
    structure?.pages?.[page - 1]?.texts
      ?.map((t) => t.str)
      .join(' ')
      .split(/\s+/)
      .filter(Boolean).length ?? 0;

  const load = useCallback(async (pdfBytes: ArrayBuffer) => {
    const parsed = await parsePdfStructure(pdfBytes);
    setStructure(parsed);
    setPage(1);
    setIsSaved(true);
  }, []);

  const goToPage = (newPage: number) => {
    const clampedPage = Math.max(1, Math.min(newPage, totalPages));
    setPage(clampedPage);
  };

  return {
    structure,
    selected,
    setSelected,
    load,
    zoom,
    setZoom,
    page,
    setPage,       
    totalPages,
    goToPage,
    wordCount,
    isSaved,
    setIsSaved,
  };
  
}
