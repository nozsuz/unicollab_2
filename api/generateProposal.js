import OpenAI from 'openai';

// 環境変数を読み込む
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text } = req.body;

    const prompt = `
    以下のテキストから研究提案の情報を抽出し、必ず次の形式でJSON形式として返答してください：
    {
      "title": "研究のタイトル",
      "field": "研究分野",
      "summary": "概要",
      "background": "背景",
      "objective": "目的",
      "approach": "アプローチ",
      "expectedOutcome": "期待される成果"
    }

    テキスト: "${text}"
    `;

    const completion = await openai.chat.completions.create({
      model: 'chatgpt-4o-latest',
      messages: [
        { role: 'system', content: '研究提案の情報を抽出し、日本語の構造化されたJSON形式で返答してください。' },
        { role: 'user', content: prompt },
      ],
      max_completion_tokens: 1024,
    });

    let responseText = completion.choices[0]?.message?.content?.trim() || '{}';

    // バッククォートで囲まれたコードブロック（```json ... ```）を削除
    if (responseText.startsWith('```json')) {
      responseText = responseText.replace(/```json|```/g, '').trim();
    }

    let proposalData;
    try {
      proposalData = JSON.parse(responseText);
    } catch (e) {
      console.warn('レスポンスがJSON形式ではありません:', responseText);
      proposalData = { message: responseText };
    }

    res.status(200).json(proposalData);
  } catch (error) {
    console.error('OpenAI APIエラー:', error);
    res.status(500).json({ error: 'OpenAI APIの呼び出しに失敗しました' });
  }
}
