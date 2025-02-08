import OpenAI from 'openai';
import * as dotenv from 'dotenv';

// 環境変数を読み込む（.env ファイルから設定を取得）
dotenv.config();

export interface ProposalData {
  title: string;
  field: string;
  summary: string;
  background: string;
  objective: string;
  approach: string;
  expectedOutcome: string;
}

// OpenAI API の設定
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,  // 環境変数にAPIキーを設定
});

// テキストから研究提案データを生成
export async function generateProposalFromText(text: string): Promise<ProposalData> {
  try {
    // プロンプトの作成
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

    // OpenAI APIの呼び出し
    const completion = await openai.chat.completions.create({
      model: 'o3-mini',  // 必要に応じてモデルを変更
      messages: [
        {
          role: 'system',
          content: '研究提案の情報を抽出して、以下の項目に従って返答してください。',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 1024,
    });

    // レスポンスの解析
    const responseText = completion.choices[0]?.message?.content || '{}';
    const proposalData: ProposalData = JSON.parse(responseText.trim());

    return proposalData;

  } catch (error) {
    console.error('OpenAI API の呼び出し中にエラーが発生しました:', error);
    return {
      title: 'エラーが発生しました',
      field: 'エラー',
      summary: 'テキストからの情報抽出に失敗しました。',
      background: 'テキストからの情報抽出に失敗しました。',
      objective: 'テキストからの情報抽出に失敗しました。',
      approach: 'テキストからの情報抽出に失敗しました。',
      expectedOutcome: 'テキストからの情報抽出に失敗しました。',
    };
  }
}
