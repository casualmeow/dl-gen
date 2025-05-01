import { create } from 'zustand';
import type { EditablePdfBlock } from 'features/pdfEditor';

interface PdfEditorState {
  blocks: EditablePdfBlock[];
  setBlocks: (blocks: EditablePdfBlock[]) => void;
  updateBlock: (id: string, data: Partial<EditablePdfBlock>) => void;
}

export const usePdfEditorStore = create<PdfEditorState>((set) => ({
  blocks: [],
  setBlocks: (blocks) => set({ blocks }),
  updateBlock: (id, data) =>
    set((state) => ({
      blocks: state.blocks.map((b) => (b.id === id ? { ...b, ...data } : b)),
    })),
}));