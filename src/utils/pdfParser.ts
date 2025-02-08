import * as pdfjs from 'pdfjs-dist';

// 静的アセットのワーカーファイルを指定
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    console.log('Starting PDF text extraction...');

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await (pdfjs as any).getDocument({ data: arrayBuffer }).promise;
    console.log(`PDF loaded: ${pdf.numPages} pages`);

    const textContent: string[] = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      const pageText = content.items
        .map((item: { str?: string }) => item.str || '')
        .join(' ');

      textContent.push(pageText);
      console.log(`Extracted text from page ${i}`);
    }

    return textContent.join('\n\n');
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('PDFからのテキスト抽出に失敗しました。');
  }
}
