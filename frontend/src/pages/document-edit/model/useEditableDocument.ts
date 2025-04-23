import { useState, useCallback } from 'react';
import type { EditablePdfText } from './types';

export function useEditableDocument(initialText: EditablePdfText[]) {
  const [document, setDocument] = useState<EditablePdfText[]>(initialText);

  const updateText = useCallback((id: string, str: string) => {
    setDocument((prev) => prev.map((block) => (block.id === id ? { ...block, str } : block)));
  }, []);

  const applyStyle = useCallback((id: string, style: 'bold' | 'italic') => {
    setDocument((prev) =>
      prev.map((block) =>
        block.id === id
          ? {
              ...block,
              fontWeight: style === 'bold' ? 'bold' : block.fontWeight,
              fontStyle: style === 'italic' ? 'italic' : block.fontStyle,
            }
          : block,
      ),
    );
  }, []);

  return {
    document,
    updateText,
    applyStyle,
    setDocument,
  };
}
