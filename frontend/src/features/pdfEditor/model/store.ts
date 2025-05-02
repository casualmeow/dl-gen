import { create } from 'zustand';
import type { EditablePdfBlock } from 'features/pdfEditor';

interface PdfEditorState {
  blocks: EditablePdfBlock[];
  pages: string[][];
  setBlocks: (blocks: EditablePdfBlock[]) => void;
  updateBlock: (id: string, data: Partial<EditablePdfBlock>) => void;
  setPages: (pages: string[][] | ((prev: string[][]) => string[][])) => void;
}

export const usePdfEditorStore = create<PdfEditorState>((set) => ({
  blocks: [],
  pages: [],
  setBlocks: (blocks) => set({ blocks }),
  updateBlock: (id, data) =>
    set((state) => ({
      blocks: state.blocks.map((b) => (b.id === id ? { ...b, ...data } : b)),
    })),
  setPages: (pagesOrUpdater) =>
    set((state) => ({
      pages: typeof pagesOrUpdater === 'function' ? pagesOrUpdater(state.pages) : pagesOrUpdater,
    })),
}));
