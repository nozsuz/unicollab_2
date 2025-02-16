import React, { useState, useEffect } from 'react';
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

const allFields = [
  "スポーツ健康科学",
  "医科学",
  "医学",
  "学校教育学",
  "学術",
  "環境科学",
  "教育学",
  "教育情報学",
  "経営学",
  "経営経済学",
  "経済学",
  "芸術学",
  "工学",
  "国際関係論",
  "国際文化",
  "商学",
  "情報科学",
  "人間科学",
  "体育学",
  "農学",
  "文学",
  "法学",
  "薬学",
  "理学"
];

const AiChatPopup: React.FC = () => {
  // ポップアップの開閉状態
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [researchers, setResearchers] = useState<ResearcherProfile[]>([]);
  // OpenAI の回答結果から得た候補（Supabase の id を含む）
  const [candidateResults, setCandidateResults] = useState<AiSearchResult[]>([]);
  // 分野選択（この値で Supabase 側もフィルタリングする）
  const [selectedField, setSelectedField] = useState<string>('');
  // API 呼び出し済みかどうか（候補ボタン表示の判断に利用）
  const [isApiCalled, setIsApiCalled] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

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
          const filteredData = data.filter(r => candidateIds.includes(r.id));
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

  // ユーザー入力送信時の処理
  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { role: 'user', content: input };
    setChatMessages(prev => [...prev, userMsg]);
    setLoading(true);

    // 分野選択がある場合、Supabase のデータからフィルタリングする
    const filteredResearchers = selectedField 
      ? researchers.filter(r => r.field === selectedField)
      : researchers;

    // 候補情報のテキスト整形（各候補の Supabase の id と keywords も含む）
    let candidateInfo = '';
    if (filteredResearchers.length > 0) {
      candidateInfo = filteredResearchers
        .map(r => `ID: ${r.id} | ${r.name} (${r.institution} ${r.department}) - ${r.specialization} / キーワード: ${r.keywords}`)
        .join('\n');
    } else {
      candidateInfo = '該当する研究者は見つかりませんでした。';
    }
    console.log("候補情報:", candidateInfo);

    // プロンプト作成（分野選択がある場合は参考情報として表示）
    const prompt = `
以下は、${selectedField ? `選択された分野「${selectedField}」に所属する` : '全'}研究者の候補情報です：
${candidateInfo}

ユーザーのクエリ：「${input}」
${selectedField ? `【参考】選択された分野: ${selectedField}\n` : ''}
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
          temperature: 0.3
        })
      });
      const data = await response.json();
      console.log("OpenAI search response:", data);
      const rawText = data.choices?.[0]?.message?.content || "回答が得られませんでした。";

      // JSON 配列部分を抽出してパースする関数
      const parseAiResponse = (text: string): AiSearchResult[] => {
        try {
          const match = text.match(/(\[[\s\S]*\])/);
          if (match && match[1]) {
            return JSON.parse(match[1]);
          }
          throw new Error("有効な JSON 配列が見つかりませんでした。");
        } catch (e) {
          console.error("Failed to parse AI search response:", e);
          return [];
        }
      };

      let aiResults = parseAiResponse(rawText);
      // マッチ度が高い順に並べ替え
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

  // 「該当する研究者を見る」ボタン押下時の処理（または「絞り込む」ボタン）
  const handleViewCandidates = () => {
    // candidateResults から Supabase の実際の ID を抽出
    const candidateIds = candidateResults.map(r => r.id).join(',');
    // 遷移後、候補ボタンは非表示にするため API 呼び出し済みフラグをリセット
    setCandidateResults([]);
    setIsApiCalled(false);
    navigate(`/researcher-search?ids=${encodeURIComponent(candidateIds)}`);
  };

  // チャット履歴クリア時：トップページに戻り、ボタン表示を初期状態「研究者を見る」に戻す
  const handleResetChat = () => {
    setChatMessages([]);
    setCandidateResults([]);
    setInput('');
    setSelectedField('');
    setIsApiCalled(false);
    navigate('/');
  };

  // ボタン表示：現在のルートが "/researcher-search" なら「絞り込む」、そうでなければ「研究者を見る」
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
          {/* 分野選択ドロップダウン（参考情報およびフィルタリングに利用） */}
          <div className="mb-2">
            <label htmlFor="field-select" className="text-sm font-medium text-gray-700">
              分野選択
            </label>
            <select
              id="field-select"
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
            >
              <option value="">すべて</option>
              {allFields.map((field) => (
                <option key={field} value={field}>
                  {field}
                </option>
              ))}
            </select>
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
          {/* API にテキストを送って候補が返ってきた場合のみボタン表示 */}
          {isApiCalled && candidateResults.length > 0 && (
            <div className="flex space-x-2">
              <button
                onClick={handleViewCandidates}
                className={candidateButtonClass}
              >
                {candidateButtonText}
              </button>
            </div>
          )}
          <div className="flex space-x-2 mt-2">
            <button
              onClick={handleResetChat}
              className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
            >
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
