import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProposals, deleteProposal, ResearchProposal, updateProposalStatus } from '../utils/proposalStorage';

interface Profile {
  name: string;
  title: string;
  institution: string;
  department: string;
  field: string;
  specialization: string;
  image_url?: string;
}

interface Message {
  id: string;
  sender: {
    name: string;
    avatar?: string;
    organization: string;
  };
  content: string;
  timestamp: string;
  unread: boolean;
}

const AcademicDashboard = () => {
  const navigate = useNavigate();
  const [proposals, setProposals] = useState<ResearchProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [messages] = useState<Message[]>([
    {
      id: '1',
      sender: {
        name: '田中 一郎',
        organization: '株式会社イノベーション',
      },
      content: 'SIAH1/2の制御に関する共同研究について、詳細な議論をさせていただきたく存じます。',
      timestamp: '2024-01-26T10:30:00',
      unread: true
    },
    {
      id: '2',
      sender: {
        name: '鈴木 花子',
        organization: '大阪大学医学部',
      },
      content: '貴研究室で開発された新規化合物について、共同研究の可能性を検討したいと考えております。',
      timestamp: '2024-01-25T15:45:00',
      unread: true
    }
  ]);
  const [profile] = useState<Profile>({
    name: '山田 太郎',
    title: '教授',
    institution: '東京大学',
    department: '医学部 免疫学研究室',
    field: '医学・薬学',
    specialization: '免疫学',
    image_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=300&h=300&auto=format&fit=crop'
  });

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = () => {
    try {
      const data = getProposals();
      setProposals(data);
    } catch (error) {
      console.error('Error fetching proposals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm('この研究提案書を削除してもよろしいですか？')) {
      return;
    }

    try {
      deleteProposal(id);
      setProposals(proposals.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting proposal:', error);
      alert('削除中にエラーが発生しました');
    }
  };

  const handleViewDetails = (proposal: ResearchProposal) => {
    navigate(`/academic/proposals/${proposal.id}`);
  };

  const handlePublishAsSeed = (proposal: ResearchProposal) => {
    if (!confirm('この研究提案書をシーズとして公開しますか？')) {
      return;
    }

    setPublishing(true);
    try {
      const updatedProposal = updateProposalStatus(proposal.id, 'published');
      if (!updatedProposal) {
        throw new Error('提案書の更新に失敗しました');
      }
      
      // Update local state
      setProposals(prev => prev.map(p => 
        p.id === proposal.id ? updatedProposal : p
      ));
      
      alert('シーズとして公開しました');
    } catch (error) {
      console.error('Error publishing seed:', error);
      alert('公開中にエラーが発生しました');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">マイページ</h1>
      </div>

      {/* 研究者プロフィール（名刺スタイル） */}
      <div className="bg-white rounded-lg shadow-md mb-6 sm:mb-8">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-6">
            {/* プロフィール画像 */}
            <div className="flex justify-center sm:justify-start mb-4 sm:mb-0">
              {profile.image_url ? (
                <img
                  src={profile.image_url}
                  alt={profile.name}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-200 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 sm:h-16 w-12 sm:w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
              )}
            </div>

            {/* プロフィール情報 */}
            <div className="flex-1 text-center sm:text-left">
              <div className="border-b border-gray-200 pb-3 sm:pb-4 mb-3 sm:mb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{profile.name}</h2>
                <p className="text-gray-600">{profile.title}</p>
              </div>
              <div className="space-y-1 sm:space-y-2">
                <p className="text-sm sm:text-base text-gray-600">{profile.institution}</p>
                <p className="text-sm sm:text-base text-gray-600">{profile.department}</p>
                <p className="text-sm sm:text-base text-gray-600">研究分野：{profile.field}</p>
                <p className="text-sm sm:text-base text-gray-600">専門：{profile.specialization}</p>
              </div>
            </div>

            {/* 編集ボタン */}
            <div className="mt-4 sm:mt-0 text-center sm:text-left">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                編集
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 研究提案書一覧 */}
      <div className="bg-white rounded-lg shadow-md mb-6 sm:mb-8">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">研究提案書</h2>
            <Link
              to="/academic/proposals/new"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              新規作成
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : proposals.length > 0 ? (
            <div className="space-y-4">
              {proposals.map((proposal) => (
                <div key={proposal.id} className="border rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {proposal.field}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {proposal.status === 'published' ? '公開中' : '下書き'}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">{proposal.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">{proposal.summary}</p>
                      <p className="text-xs text-gray-500">
                        作成日: {new Date(proposal.created_at).toLocaleDateString('ja-JP')}
                      </p>
                    </div>
                    <div className="flex flex-wrap sm:flex-nowrap gap-2">
                      <button
                        onClick={() => handleViewDetails(proposal)}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        詳細
                      </button>
                      {proposal.status === 'draft' && (
                        <button
                          onClick={() => handlePublishAsSeed(proposal)}
                          disabled={publishing}
                          className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
                              公開
                            </>
                          )}
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(proposal.id)}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span className="sr-only">削除</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">研究提案書がありません</h3>
              <p className="mt-1 text-sm text-gray-500">新しい研究提案書を作成して、あなたの研究をアピールしましょう。</p>
            </div>
          )}
        </div>
      </div>

      {/* 未読メッセージ */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">未読メッセージ</h2>
            <Link
              to="/messages"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              すべて見る →
            </Link>
          </div>

          <div className="space-y-4">
            {messages.filter(m => m.unread).map((message) => (
              <div key={message.id} className="bg-indigo-50 rounded-lg p-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {message.sender.avatar ? (
                      <img
                        src={message.sender.avatar}
                        alt={message.sender.name}
                        className="h-10 w-10 rounded-full"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-600 font-medium">
                          {message.sender.name[0]}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {message.sender.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {message.sender.organization}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 mt-1 sm:mt-0">
                        {new Date(message.timestamp).toLocaleString('ja-JP', {
                          month: 'numeric',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric'
                        })}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">{message.content}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button className="flex-1 sm:flex-none inline-flex justify-center items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                        返信する
                      </button>
                      <button className="flex-1 sm:flex-none inline-flex justify-center items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        詳細を見る
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicDashboard;