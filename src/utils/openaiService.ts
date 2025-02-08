import OpenAI from 'openai';

// Vite の環境変数を利用して API キーを取得
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,  // Vite の環境変数を使用
});

export interface ProposalData {
  title: string;
  field: string;
  summary: string;
  background: string;
  objective: string;
  approach: string;
  expectedOutcome: string;
}

// テキストから研究提案データを生成
export async function generateProposalFromText(text: string): Promise<ProposalData> {
  try {
    const prompt = `
    以下のテキストから研究提案の情報を抽出してください：
    テキスト: "${text}"

    必要な項目：
    - タイトル（title）
    - 研究分野（field）
    - 概要（summary）
    - 背景（background）
    - 目的（objective）
    - アプローチ（approach）
    - 期待される成果（expectedOutcome）

    各項目の情報を、JSON形式で返してください。
    `;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',  // 必要に応じてモデルを選択
      messages: [
        { role: 'system', content: '研究提案の情報を抽出してください。' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 1024,
    });

    const responseText = completion.choices[0]?.message?.content || '{}';
    return JSON.parse(responseText.trim());
  } catch (error) {
    console.error('OpenAI API の呼び出し中にエラーが発生しました:', error);
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
