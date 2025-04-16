import workerSrc from 'pdfjs-dist/build/pdf.worker.mjs?url';
import { GlobalWorkerOptions } from 'pdfjs-dist';

export function initPdfWorker() {
  GlobalWorkerOptions.workerSrc = workerSrc;
}
