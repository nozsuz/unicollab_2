import React, { useState, useEffect, KeyboardEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ResearcherProfile } from '../types';
import { getResearchers, searchResearchers } from '../utils/researcherStorage';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface AiSearchResult {
  id: string;
  matchScore: number;
  researcher: string;
  researchOverview: string;
}

const AiChatPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [researchers, setResearchers] = useState<ResearcherProfile[]>([]);
  const [candidateResults, setCandidateResults] = useState<AiSearchResult[]>([]);
  const [isApiCalled, setIsApiCalled] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 初回チャットメッセージ
  useEffect(() => {
    if (chatMessages.length === 0) {
      setChatMessages([{ role: 'assistant', content: 'どんなことが知りたいですか？' }]);
    }
  }, [chatMessages]);

  // 初回ロード：Supabase から全研究者データを取得
  useEffect(() => {
    const fetchResearchers = async () => {
      try {
        const data = await getResearchers();
        console.log('Fetched researchers:', data);
        setResearchers(data);
      } catch (error) {
        console.error('Error fetching researchers:', error);
      }
    };
    fetchResearchers();
  }, []);

  // URLクエリパラメータ "ids" がある場合、そのIDのみフィルタリングする
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getResearchers();
        const searchParams = new URLSearchParams(location.search);
        const idsParam = searchParams.get('ids');
        if (idsParam) {
          const candidateIds = idsParam.split(',').map(id => id.trim());
          const filteredData = data.filter(r => candidateIds.includes(String(r.id)));
          setResearchers(filteredData);
        } else {
          setResearchers(data);
        }
      } catch (error) {
        console.error('Error fetching researchers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [location.search]);

  // エンターキー対応
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  // ユーザー入力送信時の処理
  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { role: 'user', content: input };
    setChatMessages(prev => [...prev, userMsg]);
    setLoading(true);

    const filteredResearchers = researchers;
    let candidateInfo = '';
    if (filteredResearchers.length > 0) {
      candidateInfo = filteredResearchers
        .map(r => `ID: ${r.id} | ${r.name} (${r.institution} ${r.department}) - ${r.specialization} / キーワード: ${r.keywords}`)
        .join('\n');
    } else {
      candidateInfo = '該当する研究者は見つかりませんでした。';
    }
    console.log("候補情報:", candidateInfo);

    const prompt = `
以下は、全研究者の候補情報です：
${candidateInfo}

ユーザーのクエリ：「${input}」
※各候補にはSupabaseのkeywords情報も含まれています。ユーザーのクエリに曖昧な単語や誤字が含まれている場合でも、これらの情報を参考にして、適切な候補のマッチ度（0～100の評価）とともに、研究者名、所属、研究概要のみを JSON 配列形式で出力してください。
例:
[
  { "id": "324afc49", "matchScore": 85, "researcher": "山田 太郎", "researchOverview": "この研究は〜という内容です。" },
  { "id": "a1b2c3d4", "matchScore": 70, "researcher": "鈴木 次郎", "researchOverview": "この研究は〜という特徴があります。" }
]
    `;
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "chatgpt-4o-latest",
          messages: [
            { role: "system", content: "あなたは有能な研究情報アシスタントです。" },
            { role: "user", content: prompt }
          ],
          temperature: 0.7
        })
      });
      const data = await response.json();
      console.log("OpenAI search response:", data);
      const rawText = data.choices?.[0]?.message?.content || "回答が得られませんでした。";
      console.log("Raw text:", rawText);

      // JSON 配列部分を抽出してパースする関数
      const parseAiResponse = (text: string): AiSearchResult[] => {
        const cleanedText = text
          .replace(/^```(json)?\s*/i, '')
          .replace(/```$/, '')
          .trim();
        try {
          const parsed = JSON.parse(cleanedText);
          if (Array.isArray(parsed)) {
            return parsed;
          }
          throw new Error("Parsed result is not an array");
        } catch (err) {
          console.error("Failed to parse cleaned JSON:", err);
          const match = text.match(/(\[[\s\S]*\])/);
          if (match && match[1]) {
            try {
              return JSON.parse(match[1]);
            } catch (e) {
              console.error("Failed to parse extracted JSON:", e);
              setChatMessages(prev => [
                ...prev,
                { role: 'assistant', content: "AIのレスポンスのパースに失敗しました。レスポンス内容：" + rawText }
              ]);
              return [];
            }
          }
          return [];
        }
      };

      let aiResults = parseAiResponse(rawText);
      aiResults.sort((a, b) => b.matchScore - a.matchScore);
      setCandidateResults(aiResults);
      setIsApiCalled(true);

      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: `検索結果:\n${aiResults.length > 0 
          ? aiResults.map(r =>
              `【マッチ度 ${r.matchScore}%】 ${r.researcher} - ${r.researchOverview}`
            ).join('\n')
          : "候補はありませんでした。"}`
      };
      setChatMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      const assistantMsg: ChatMessage = { role: 'assistant', content: "エラーが発生しました。" };
      setChatMessages(prev => [...prev, assistantMsg]);
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  // 「該当する研究者を見る」ボタン押下時の処理
  const handleViewCandidates = () => {
    const candidateIds = candidateResults.map(r => r.id.trim()).filter(id => id).join(',');
    console.log("Candidate IDs:", candidateIds);
    setCandidateResults([]);
    setIsApiCalled(false);
    navigate(`/researcher-search?ids=${encodeURIComponent(candidateIds)}`);
  };

  // チャット履歴クリア時の処理
  const handleResetChat = () => {
    setChatMessages([]);
    setCandidateResults([]);
    setInput('');
    navigate('/');
  };

  const candidateButtonText = location.pathname === '/researcher-search' ? "絞り込む" : "研究者を見る";
  const candidateButtonClass = location.pathname === '/researcher-search'
    ? "w-full bg-blue-300 text-white py-2 rounded hover:bg-blue-400"
    : "w-full bg-green-600 text-white py-2 rounded hover:bg-green-700";

  return (
    <>
      {isOpen ? (
        <div className="fixed bottom-4 right-4 w-80 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-50">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold">AIチャット検索</h2>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>
          <div className="h-64 overflow-y-auto mb-2 p-2 border border-gray-200 rounded">
            {chatMessages.map((msg, index) => (
              <div key={index} className={`mb-2 ${msg.role === 'assistant' ? 'text-blue-600' : 'text-gray-800'}`}>
                <strong>{msg.role === 'assistant' ? 'AI' : 'あなた'}: </strong>
                <span>{msg.content}</span>
              </div>
            ))}
            {loading && <div className="text-gray-500">読み込み中...</div>}
          </div>
          <div className="flex mb-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 border rounded-l px-2 py-1"
              placeholder="検索クエリを入力"
            />
            <button
              onClick={handleSend}
              className="bg-indigo-600 text-white px-3 py-1 rounded-r hover:bg-indigo-700"
              disabled={loading}
            >
              送信
            </button>
          </div>
          {isApiCalled && candidateResults.length > 0 && (
            <div className="flex space-x-2">
              <button onClick={handleViewCandidates} className={candidateButtonClass}>
                {candidateButtonText}
              </button>
            </div>
          )}
          <div className="flex space-x-2 mt-2">
            <button onClick={handleResetChat} className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700">
              チャットクリア
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-full shadow-lg z-50 hover:bg-indigo-700"
        >
          AIチャットを開く
        </button>
      )}
    </>
  );
};

export default AiChatPopup;
