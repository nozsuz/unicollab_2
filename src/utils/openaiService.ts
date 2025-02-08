export interface ProposalData {
  title: string;
  field: string;
  summary: string;
  background: string;
  objective: string;
  approach: string;
  expectedOutcome: string;
}

// モック実装
export async function generateProposalFromText(text: string): Promise<ProposalData> {
  return {
    title: text.split('\n')[0].trim() || '無題の研究提案',
    field: '未分類',
    summary: text.slice(0, 200) + '...',
    background: 'テキストの解析中にエラーが発生しました。',
    objective: 'テキストの解析中にエラーが発生しました。',
    approach: 'テキストの解析中にエラーが発生しました。',
    expectedOutcome: 'テキストの解析中にエラーが発生しました。'
  };
}