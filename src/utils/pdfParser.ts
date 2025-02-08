import * as pdfjs from 'pdfjs-dist';

// PDFJSをWebWorkerなしで動作するように設定
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    console.log('Starting PDF text extraction...');
    
    // FileをArrayBufferに変換
    const arrayBuffer = await file.arrayBuffer();
    
    // PDFドキュメントをロード
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    console.log(`PDF loaded: ${pdf.numPages} pages`);
    
    // 全ページのテキストを抽出
    const textContent: string[] = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map(item => 'str' in item ? item.str : '')
        .join(' ');
      textContent.push(pageText);
      
      console.log(`Extracted text from page ${i}`);
    }
    
    const fullText = textContent.join('\n\n');
    console.log('PDF text extraction completed');
    
    return fullText;
    
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('PDFからのテキスト抽出に失敗しました。');
  }
}