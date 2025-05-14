import { getDocument } from 'pdfjs-dist';
import type { TextItem } from 'pdfjs-dist/types/src/display/api';

export type PdfAnnotation = {
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type PdfImage = {
  src?: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type PdfText = {
  str: string;
  x: number;
  y: number;
  alignment: 'left' | 'center' | 'right';
  fontSize: number;
  fontFamily: string;
  width: number;
  height: number;
  isBold: boolean;
  isItalic: boolean;
  lineBreakAfter?: boolean;
};

export type PdfPage = {
  number: number;
  width: number;
  height: number;
  texts: PdfText[];
  annotations: PdfAnnotation[];
  images: PdfImage[];
};

export type PdfStructure = {
  numPages: number;
  pages: PdfPage[];
};

const renderPageAsImage = async (page: any): Promise<PdfImage> => {
  const viewport = page.getViewport({ scale: 1 });
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  await page.render({
    canvasContext: context!,
    viewport,
  }).promise;

  const base64 = canvas.toDataURL('image/png');

  return {
    src: base64,
    x: 0,
    y: 0,
    width: viewport.width,
    height: viewport.height,
  };
};

export const parsePdfStructure = async (pdfBytes: ArrayBuffer): Promise<PdfStructure> => {
  const pdf = await getDocument({ data: pdfBytes }).promise;
  const numPages = pdf.numPages;

  const pages: PdfPage[] = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const viewport = page.getViewport({ scale: 1 });

    const textStyles = textContent.styles;
    const rawTexts = textContent.items.filter((item): item is TextItem => 'str' in item);

    const texts: PdfText[] = [];
    let lastY: number | null = null;

    for (const item of rawTexts) {
      const [a, , , , x, y] = item.transform;
      const fontSize = a;
      const fontName = item.fontName;
      const style = textStyles?.[fontName];
      const fontFamily = style?.fontFamily ?? 'sans-serif';

      const alignment =
        x < viewport.width * 0.3 ? 'left' : x > viewport.width * 0.7 ? 'right' : 'center';
      const isBold = /Bold|Black|Heavy/i.test(fontFamily);
      const isItalic = /Italic|Oblique/i.test(fontFamily);

      const deltaY = lastY !== null ? Math.abs(y - lastY) : 0;
      const lineBreak = lastY !== null && deltaY > fontSize * 1.2;
      lastY = y;

      texts.push({
        str: item.str,
        x,
        y,
        alignment,
        fontSize,
        fontFamily,
        width: item.width ?? item.str.length * fontSize * 0.5,
        height: fontSize,
        isBold,
        isItalic,
        lineBreakAfter: lineBreak,
      });
    }

    const annotationData = await page.getAnnotations();
    const annotations: PdfAnnotation[] = annotationData.map((a) => ({
      content: a.contents || '',
      x: a.rect?.[0] ?? 0,
      y: a.rect?.[1] ?? 0,
      width: (a.rect?.[2] ?? 0) - (a.rect?.[0] ?? 0),
      height: (a.rect?.[3] ?? 0) - (a.rect?.[1] ?? 0),
    }));

    const renderedImage = await renderPageAsImage(page);

    pages.push({
      number: i,
      width: viewport.width,
      height: viewport.height,
      texts,
      annotations,
      images: [renderedImage],
    });
  }

  return {
    numPages,
    pages,
  };
};