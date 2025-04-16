import { getDocument } from 'pdfjs-dist';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import { initPdfWorker } from '../lib/initPdfWorker';

initPdfWorker();

interface PDFMetadata {
    getRaw(): string;
    get(name: string): string;
    getAll(): string[];
  }

export interface PDFInfo {
  Title?: string;
  Author?: string;
  Subject?: string;
  Keywords?: string;
  Creator?: string;
  Producer?: string;
  CreationDate?: string;
  ModDate?: string;
  Trapped?: string;
  [key: string]: any;
}

export type MetadataMap = Record<string, string>;
interface ExtendedPDFDocumentProxy extends PDFDocumentProxy {
  isLinearized: boolean;
  pdfInfo?: {
    PDFFormatVersion?: string;
  };
}

export interface PDFMetadataResult {
  info: PDFInfo;
  metadataXML?: string;
  metadataMap?: MetadataMap;
  version: string;
  isLinearized: boolean;
  numPages: number;
}

export async function parsePdfMetadata(file: File): Promise<PDFMetadataResult> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await getDocument({ data: arrayBuffer }).promise as ExtendedPDFDocumentProxy;

  const { info, metadata }: { info: PDFInfo; metadata: PDFMetadata | undefined } = await pdf.getMetadata();

  const metadataMap: MetadataMap = {};
  const rawMetadataXML = metadata?.getRaw() ?? undefined;

  if (metadata) {
    const keys = metadata.getAll();
    for (const key of keys) {
      metadataMap[key] = metadata.get(key);
    }
  }
  console.log('123', metadata)

  return {
    info,
    metadataXML: rawMetadataXML,
    metadataMap,
    version: pdf.pdfInfo?.PDFFormatVersion ?? '',
    isLinearized: pdf.isLinearized,
    numPages: pdf.numPages,
  };
}
