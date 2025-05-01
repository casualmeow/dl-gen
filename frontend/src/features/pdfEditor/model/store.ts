import { create } from 'zustand';
import type { EditablePdfBlock } from 'features/pdfEditor';

interface PdfEditorState {
  blocks: EditablePdfBlock[];
  pages: string[][]; // масив блоків по сторінках
  setBlocks: (blocks: EditablePdfBlock[]) => void;
  setPages: (pages: string[][]) => void;
  updateBlock: (id: string, data: Partial<EditablePdfBlock>) => void;
}

export const usePdfEditorStore = create<PdfEditorState>((set) => ({
  blocks: [],
  pages: [],
  setBlocks: (blocks) => set({ blocks }),
  setPages: (pages) => set({ pages }),
  updateBlock: (id, data) =>
    set((state) => ({
      blocks: state.blocks.map((b) => (b.id === id ? { ...b, ...data } : b)),
    })),
}));
