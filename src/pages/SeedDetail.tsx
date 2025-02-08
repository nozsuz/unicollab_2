import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { getProposals, updateProposalStatus, ResearchProposal } from '../utils/proposalStorage';
import { findMatchingResearchers, MatchingResult } from '../utils/matchingService';
import { analyzeProposal } from '../utils/proposalAnalyzer';
import type { ProposalAnalysis } from '../utils/proposalAnalyzer';
import MatchingResults from '../components/MatchingResults';
import ProposalAnalysisComponent from '../components/ProposalAnalysis';

const SeedDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [publishing, setPublishing] = useState(false);
  const [proposal, setProposal] = useState<ResearchProposal | undefined>(undefined);
  const [matchingResults, setMatchingResults] = useState<MatchingResult[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [proposalAnalysis, setProposalAnalysis] = useState<ProposalAnalysis | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  
  useEffect(() => {
    if (id) {
      const foundProposal = getProposals().find(p => p.id === id);
      console.log('Found proposal:', foundProposal);
      setProposal(foundProposal);
      
      if (foundProposal) {
        window.scrollTo({
          top: 0,
          behavior: 'instant'
        });
      }
    }
  }, [id]);

  const handleAnalyze = async (convergenceFactor: number) => {
    if (!proposal) {
      console.error('No proposal found for analysis');
      return;
    }
    
    console.log('Starting analysis with convergence factor:', convergenceFactor);
    setLoadingMatches(true);
    setMatchingResults([]);
    
    try {
      const results = await findMatchingResearchers(proposal, convergenceFactor);
      console.log('Analysis results:', results);
      setMatchingResults(results);
    } catch (error) {
      console.error('Error in matching analysis:', error);
      alert('マッチング分析中にエラーが発生しました');
    } finally {
      setLoadingMatches(false);
    }
  };

  const handleAnalyzeProposal = async () => {
    if (!proposal) return;

    setLoadingAnalysis(true);
    try {
      const analysis = await analyzeProposal(proposal);
      setProposalAnalysis(analysis);
    } catch (error) {
      console.error('Error analyzing proposal:', error);
      alert('提案書の分析中にエラーが発生しました');
    } finally {
      setLoadingAnalysis(false);
    }
  };

  const handlePublishAsSeed = async () => {
    if (!id || !confirm('この研究提案書をシーズとして公開しますか？')) {
      return;
    }

    setPublishing(true);
    try {
      const updatedProposal = updateProposalStatus(id, 'published');
      if (!updatedProposal) {
        throw new Error('提案書の更新に失敗しました');
      }

      alert('シーズとして公開しました');
      navigate('/academic/dashboard');
    } catch (error) {
      console.error('Error publishing seed:', error);
      alert('公開中にエラーが発生しました');
    } finally {
      setPublishing(false);
    }
  };

  const handleUnpublish = () => {
    if (!id || !confirm('この研究シーズを非公開にしますか？')) return;

    const updated = updateProposalStatus(id, 'draft');
    if (updated) {
      alert('研究シーズを非公開にしました');
      navigate('/academic/dashboard');
    } else {
      alert('非公開にできませんでした');
    }
  };

  const handleEdit = () => {
    navigate(`/academic/proposals/edit/${id}`);
  };

  if (!proposal) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">研究シーズが見つかりません</h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            指定された研究シーズは存在しないか、非公開になっている可能性があります。
          </p>
          <button
            onClick={() => navigate('/listings')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            シーズ一覧に戻る
          </button>
        </div>
      </div>
    );
  }

  const getFieldLabel = (field: string) => {
    const fieldMap: { [key: string]: string } = {
      'medical': '医学・薬学',
      'engineering': '工学',
      'chemistry': '化学',
      'it': '情報工学'
    };
    return fieldMap[field] || field;
  };

  const getBudgetLabel = (budget: string) => {
    const budgetMap: { [key: string]: string } = {
      'under_1m': '100万円未満/年',
      '1m_5m': '100-500万円/年',
      '5m_10m': '500-1000万円/年',
      '10m_50m': '1000-5000万円/年',
      'over_50m': '5000万円以上/年',
      'negotiable': '応相談'
    };
    return budgetMap[budget] || budget;
  };

  const getPeriodLabel = (period: string) => {
    const periodMap: { [key: string]: string } = {
      'under_1y': '1年未満',
      '1y_2y': '1-2年',
      '2y_3y': '2-3年',
      '3y_5y': '3-5年',
      'over_5y': '5年以上',
      'negotiable': '応相談'
    };
    return periodMap[period] || period;
  };

  const getCollaborationLabel = (collaboration: string) => {
    const collaborationMap: { [key: string]: string } = {
      'joint_research': '共同研究',
      'technical_transfer': '技術移転',
      'license': 'ライセンス契約',
      'commissioned_research': '委託研究',
      'academic_collaboration': '学学連携'
    };
    return collaborationMap[collaboration] || collaboration;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* ヘッダー部分 */}
        <div className="bg-indigo-50 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded">
                {getFieldLabel(proposal.field)}
              </span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                {proposal.status === 'published' ? '公開中' : '下書き'}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {proposal.status === 'draft' && (
                <>
                  <button
                    onClick={handleEdit}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    編集する
                  </button>
                  <button
                    onClick={handlePublishAsSeed}
                    disabled={publishing}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {publishing ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        公開中...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        シーズ投稿
                      </>
                    )}
                  </button>
                </>
              )}
              {proposal.status === 'published' && (
                <button
                  onClick={handleUnpublish}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                >
                  非公開にする
                </button>
              )}
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{proposal.title}</h1>
        </div>

        <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
          {/* 研究画像 */}
          {proposal.images && proposal.images.length > 0 && (
            <div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">研究画像</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {proposal.images.map((image, index) => (
                  <div key={index} className="relative aspect-[4/3]">
                    <img
                      src={image}
                      alt={`研究画像 ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 基本情報 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            <div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3">概要</h3>
              <p className="text-sm sm:text-base text-gray-600 whitespace-pre-wrap">{proposal.summary}</p>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3">背景</h3>
              <p className="text-sm sm:text-base text-gray-600 whitespace-pre-wrap">{proposal.background}</p>
            </div>
          </div>

          {/* 研究内容 */}
          <div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">研究内容</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">研究目的</h4>
                <p className="text-sm sm:text-base text-gray-600 whitespace-pre-wrap">{proposal.objective}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">研究アプローチ</h4>
                <p className="text-sm sm:text-base text-gray-600 whitespace-pre-wrap">{proposal.approach}</p>
              </div>
            </div>
          </div>

          {/* 期待される成果 */}
          <div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3">期待される成果</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm sm:text-base text-gray-600 whitespace-pre-wrap">{proposal.expected_outcome}</p>
            </div>
          </div>

          {/* 連携条件 */}
          <div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">連携条件</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">希望する連携形態</h4>
                <p className="text-sm sm:text-base text-gray-600">{getCollaborationLabel(proposal.collaboration)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">予算規模</h4>
                <p className="text-sm sm:text-base text-gray-600">{getBudgetLabel(proposal.budget)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">研究期間</h4>
                <p className="text-sm sm:text-base text-gray-600">{getPeriodLabel(proposal.period)}</p>
              </div>
            </div>
          </div>

          {/* 研究提案書の分析 */}
          {proposal.status === 'draft' && (
            <div className="mt-8">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">研究提案書の分析</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      AIを活用して研究提案書を分析し、研究費獲得のための改善点を提案します。
                    </p>
                  </div>
                  <button
                    onClick={handleAnalyzeProposal}
                    disabled={loadingAnalysis}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingAnalysis ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        分析中...
                      </>
                    ) : (
                      '提案書を分析'
                    )}
                  </button>
                </div>

                {proposalAnalysis && (
                  <ProposalAnalysisComponent
                    analysis={proposalAnalysis}
                    loading={loadingAnalysis}
                  />
                )}
              </div>
            </div>
          )}

          {/* マッチング分析 */}
          {proposal.status === 'published' && (
            <div className="mt-8">
              <MatchingResults
                results={matchingResults}
                loading={loadingMatches}
                onAnalyze={handleAnalyze}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeedDetail;