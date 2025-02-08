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

    const completion = await openai.chat.completions.create({
      model: 'o3-mini',
      messages: [
        { role: 'system', content: '研究提案の情報を抽出し、JSON形式で返答してください。' },
        { role: 'user', content: text },
      ],
      max_completion_tokens: 1024,
    });

    const responseText = completion.choices[0]?.message?.content?.trim() || '{}';

    // JSONパース前にレスポンスが有効なJSON形式かをチェック
    let proposalData;
    try {
      proposalData = JSON.parse(responseText);  // JSON形式の場合はパース
    } catch (e) {
      console.warn('レスポンスがJSON形式ではありません:', responseText);
      proposalData = { message: responseText };  // JSON以外の場合はそのまま返す
    }

    res.status(200).json(proposalData);
  } catch (error) {
    console.error('OpenAI APIエラー:', error);
    res.status(500).json({ error: 'OpenAI APIの呼び出しに失敗しました' });
  }
}
