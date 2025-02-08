export interface ProposalData {
  title: string;
  field: string;
  summary: string;
  background: string;
  objective: string;
  approach: string;
  expectedOutcome: string;
}

export async function generateProposalFromText(text: string): Promise<ProposalData> {
  try {
    const response = await fetch('/api/generateProposal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error('APIエラー');
    }

    const proposalData = await response.json();
    return proposalData;
  } catch (error) {
    console.error('API呼び出し中にエラーが発生しました:', error);
    return {
      title: 'エラーが発生しました',
      field: 'エラー',
      summary: '情報抽出に失敗しました。',
      background: '情報抽出に失敗しました。',
      objective: '情報抽出に失敗しました。',
      approach: '情報抽出に失敗しました。',
      expectedOutcome: '情報抽出に失敗しました。',
    };
  }
}
