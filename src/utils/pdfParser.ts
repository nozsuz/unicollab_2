import * as pdfjs from 'pdfjs-dist/build/pdf';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.entry';

// ローカルインストールされたpdf.workerを使用する
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    console.log('Starting PDF text extraction...');
    
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    console.log(`PDF loaded: ${pdf.numPages} pages`);
    
    const textContent: string[] = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      try {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items
          .map(item => ('str' in item ? item.str : ''))
          .join(' ');
        textContent.push(pageText);
        console.log(`Extracted text from page ${i}`);
      } catch (pageError) {
        console.error(`Error on page ${i}:`, pageError);
      }
    }
    
    return textContent.join('\n\n');
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('PDFからのテキスト抽出に失敗しました。');
  }
}
