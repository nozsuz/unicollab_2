declare module 'pdfjs-dist/legacy/build/pdf' {
  import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist/types/src/display/api';
  export * from 'pdfjs-dist/types/src/display/api';
  export default PDFDocumentProxy;
}

declare module 'pdfjs-dist/es5/build/pdf.worker.entry';
