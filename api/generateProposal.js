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
        { role: 'system', content: '研究提案の情報を抽出してください。' },
        { role: 'user', content: text },
      ],
      max_tokens: 1024,
    });

    const responseText = completion.choices[0]?.message?.content || '{}';
    res.status(200).json(JSON.parse(responseText.trim()));
  } catch (error) {
    console.error('OpenAI APIエラー:', error);
    res.status(500).json({ error: 'OpenAI APIの呼び出しに失敗しました' });
  }
}
