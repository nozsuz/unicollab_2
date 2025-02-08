import React, { useState, useMemo } from 'react';
import { ResearchProposal } from '../utils/proposalStorage';
import { MatchingResult } from '../utils/matchingService';

interface MatchingResultsProps {
  results: MatchingResult[];
  loading: boolean;
  onAnalyze: (convergenceFactor: number) => void;
}

interface FieldStats {
  count: number;
  avgScore: number;
}

const MatchingResults: React.FC<MatchingResultsProps> = ({ results, loading, onAnalyze }) => {
  const [convergenceFactor, setConvergenceFactor] = useState(50);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const getFieldLabel = (field: string) => {
    const fieldMap: { [key: string]: string } = {
      'medical': '医学・薬学',
      'engineering': '工学',
      'chemistry': '化学',
      'it': '情報工学'
    };
    return fieldMap[field] || field;
  };

  // 分野別の統計情報を計算
  const fieldStats = useMemo(() => {
    const stats: { [key: string]: FieldStats } = {};
    
    results.forEach(result => {
      const field = result.proposal.field;
      if (!stats[field]) {
        stats[field] = { count: 0, avgScore: 0 };
      }
      stats[field].count++;
      stats[field].avgScore += result.score;
    });

    // 平均スコアの計算
    Object.keys(stats).forEach(field => {
      stats[field].avgScore = Math.round(stats[field].avgScore / stats[field].count);
    });

    return stats;
  }, [results]);

  // フィルタリングされた結果
  const filteredResults = useMemo(() => {
    if (!selectedField) return results;
    return results.filter(result => result.proposal.field === selectedField);
  }, [results, selectedField]);

  const handleAnalyze = () => {
    setSelectedField(null);
    setExpandedId(null);
    setHasAnalyzed(true);
    onAnalyze(convergenceFactor);
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getEmptyStateMessage = () => {
    if (convergenceFactor < 30) {
      return {
        title: "類似の研究シーズが見つかりませんでした",
        description: "より広い視点での分析を試すため、スライダーを右側に動かしてみてください。異分野との革新的な組み合わせが見つかるかもしれません。"
      };
    } else if (convergenceFactor > 70) {
      return {
        title: "異分野との組み合わせが見つかりませんでした",
        description: "より確実な共同研究の機会を探すため、スライダーを左側に動かしてみてください。類似分野での協力の可能性が見つかるかもしれません。"
      };
    } else {
      return {
        title: "マッチする研究シーズが見つかりませんでした",
        description: "スライダーを左右に動かして、異なる分析条件で試してみてください。"
      };
    }
  };

  return (
    <div className="space-y-6">
      {/* マッチング設定UI */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">研究シーズのマッチング分析</h3>
        <p className="text-gray-600 mb-6">
          研究内容の類似性と補完性を分析し、潜在的な共同研究の可能性を探ります。
          スライダーを調整して、マッチング分析の方向性を設定してください。
        </p>

        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">収束的</span>
            <span className="text-sm font-medium text-gray-600">発散的</span>
          </div>
          <div className="relative">
            <input
              type="range"
              min="0"
              max="100"
              value={convergenceFactor}
              onChange={(e) => setConvergenceFactor(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs text-gray-500">
              <span>類似の研究を探す</span>
              <span>異分野との融合を探る</span>
            </div>
          </div>
          <div className="mt-8 text-sm text-gray-600">
            <h4 className="font-medium mb-2">現在の設定:</h4>
            <p>
              {convergenceFactor < 30 ? (
                '類似性の高い研究を重視し、確実な成果が期待できる共同研究の機会を探します。'
              ) : convergenceFactor > 70 ? (
                '異分野との革新的な組み合わせを重視し、新しい研究領域の開拓機会を探ります。'
              ) : (
                'バランスの取れたアプローチで、類似性と革新性の両方を考慮します。'
              )}
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                分析実行中...
              </>
            ) : (
              'マッチング分析を実行'
            )}
          </button>
        </div>
      </div>

      {/* 分析結果の表示 */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-gray-600">マッチング分析を実行中...</span>
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-6">
          {/* 分野別統計 */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">分野別マッチング結果</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(fieldStats).map(([field, stats]) => (
                <button
                  key={field}
                  onClick={() => setSelectedField(selectedField === field ? null : field)}
                  className={`p-4 rounded-lg border ${
                    selectedField === field
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <h4 className="font-medium text-gray-900">{getFieldLabel(field)}</h4>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-600">
                      マッチング件数: <span className="font-medium">{stats.count}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      平均マッチ度: <span className="font-medium">{stats.avgScore}%</span>
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* マッチング結果リスト */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedField 
                  ? `${getFieldLabel(selectedField)}の研究シーズ (${filteredResults.length}件)`
                  : `マッチする研究シーズ (${results.length}件)`}
              </h3>
              {selectedField && (
                <button
                  onClick={() => setSelectedField(null)}
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  すべての結果を表示
                </button>
              )}
            </div>

            <div className="space-y-4">
              {filteredResults.map((result) => (
                <div 
                  key={result.proposal.id} 
                  className={`border rounded-lg transition-all duration-200 ${
                    expandedId === result.proposal.id ? 'bg-gray-50' : 'bg-white'
                  }`}
                >
                  <div 
                    className="p-4 cursor-pointer"
                    onClick={() => toggleExpand(result.proposal.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {getFieldLabel(result.proposal.field)}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            マッチ度: {result.score}%
                          </span>
                        </div>
                        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                          {result.proposal.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {result.proposal.summary}
                        </p>
                      </div>
                      <button
                        className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(result.proposal.id);
                        }}
                      >
                        <svg
                          className={`h-5 w-5 transform transition-transform ${
                            expandedId === result.proposal.id ? 'rotate-180' : ''
                          }`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* マッチング理由（展開時のみ表示） */}
                  {expandedId === result.proposal.id && (
                    <div className="px-4 pb-4 border-t border-gray-200 mt-4 pt-4">
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">マッチする理由:</h4>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                          {result.reasons.map((reason, index) => (
                            <li key={index}>{reason}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">想定される共同研究テーマ:</h4>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                          {result.potentialCollaborations.map((theme, index) => (
                            <li key={index}>{theme}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : hasAnalyzed ? (
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            {getEmptyStateMessage().title}
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            {getEmptyStateMessage().description}
          </p>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">
            スライダーを調整し、マッチング分析を実行してください。
          </p>
        </div>
      )}
    </div>
  );
};

export default MatchingResults;