import React from 'react';
import type { ProposalAnalysis } from '../utils/proposalAnalyzer';

interface ProposalAnalysisComponentProps {
  analysis: ProposalAnalysis;
  loading?: boolean;
}

const ProposalAnalysisComponent: React.FC<ProposalAnalysisComponentProps> = ({ analysis, loading = false }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-3 text-gray-600">分析中...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-2">総合評価</h3>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-indigo-600">{analysis.overallScore}/100</div>
        </div>
      </div>

      {Object.entries(analysis.sections).map(([section, data]) => (
        <div key={section} className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {section === 'title' ? 'タイトル' :
             section === 'summary' ? '概要' :
             section === 'background' ? '背景' :
             section === 'objective' ? '目的' :
             section === 'approach' ? 'アプローチ' :
             section === 'expected_outcome' ? '期待される成果' : section}
          </h3>
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold text-indigo-600">{data.score}/100</div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900">強み</h4>
              <ul className="mt-2 list-disc list-inside text-sm text-gray-600">
                {data.strengths.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">改善点</h4>
              <ul className="mt-2 list-disc list-inside text-sm text-gray-600">
                {data.improvements.map((improvement, index) => (
                  <li key={index}>{improvement}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">改善提案</h3>
        <div className="space-y-4">
          {analysis.recommendations.map((rec, index) => (
            <div key={index} className="border-l-4 border-indigo-500 pl-4">
              <div className="flex items-center mb-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                  rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {rec.priority === 'high' ? '高優先度' :
                   rec.priority === 'medium' ? '中優先度' : '低優先度'}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">{rec.suggestion}</p>
              <p className="text-sm text-gray-600">{rec.reason}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProposalAnalysisComponent;