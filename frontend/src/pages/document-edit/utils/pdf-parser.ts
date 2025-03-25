import { getDocument } from 'pdfjs-dist';
import { type TextItem } from 'pdfjs-dist/types/src/display/api';

type PdfAnnotation = {
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

type PdfImage = {
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export const parsePdfStructure = async (pdfBytes: ArrayBuffer) => {
  const pdf = await getDocument({ data: pdfBytes }).promise;
  const numPages = pdf.numPages;

  const pages = [];
  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    pages.push({
      number: i,
      texts: textContent.items
        .filter((item): item is TextItem => 'str' in item)
        .map((item: TextItem) => ({
          str: item.str,
          x: item.transform[4],
          y: item.transform[5],
        })),
      annotations: [] as PdfAnnotation[],
      images: [] as PdfImage[],
    });
  }

  return {
    numPages,
    pages,
  };
};

export type PdfStructure = Awaited<ReturnType<typeof parsePdfStructure>>; 