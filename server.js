const express = require('express');
const OpenAI = require('openai');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

// OpenAI の設定
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// エンドポイントを作成して OpenAI の API を呼び出す
app.post('/generate-proposal', async (req, res) => {
  try {
    const { text } = req.body;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: '研究提案の情報を抽出してください。' },
        { role: 'user', content: text },
      ],
      max_tokens: 1024,
    });

    const responseText = completion.choices[0]?.message?.content || '{}';
    res.json(JSON.parse(responseText.trim()));
  } catch (error) {
    console.error('OpenAI API 呼び出しエラー:', error);
    res.status(500).send('OpenAI API の呼び出しに失敗しました');
  }
});

app.listen(port, () => {
  console.log(`サーバーが http://localhost:${port} で起動しました`);
});
