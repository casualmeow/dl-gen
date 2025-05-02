import { type EditablePdfBlock } from 'features/pdfEditor';
import type { PdfStructure } from 'pages/document-edit';

export function createMockBlocks(count: number, pageNumber = 1): EditablePdfBlock[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `block-${i}`,
    pageNumber,
    str: `Text ${i}`,
    html: `<p>Text ${i}</p>`,
    x: 0,
    y: i * 25,
    width: 500,
    height: 20,
    fontSize: 16,
    fontFamily: 'Arial',
    fontWeight: 'normal',
    fontStyle: 'normal',
    alignment: 'left',
  }));
}

export function createMockStructure(numPages = 1, pageWidth = 600, pageHeight = 800): PdfStructure {
  return {
    numPages,
    pages: Array.from({ length: numPages }, (_, i) => ({
      number: i + 1,
      width: pageWidth,
      height: pageHeight,
      texts: [],
      annotations: [],
      images: [],
    })),
  };
}
