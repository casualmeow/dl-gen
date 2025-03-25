import { useState } from 'react';
import { parsePdfStructure, type PdfStructure } from '../utils/pdf-parser';

export const usePdfStructure = () => {
  const [structure, setStructure] = useState<PdfStructure | null>(null);
  const [selected, setSelected] = useState<Record<string, unknown> | null>(null);

  const load = async (pdfBytes: ArrayBuffer) => {
    const parsed = await parsePdfStructure(pdfBytes);
    setStructure(parsed);
  };

  return { structure, selected, setSelected, load };
};
