import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface Project {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'active' | 'completed' | 'suspended';
  progress: number;
  members: {
    id: string;
    name: string;
    role: string;
    organization: string;
    avatar?: string;
  }[];
  milestones: {
    id: string;
    title: string;
    dueDate: string;
    status: 'pending' | 'in_progress' | 'completed' | 'delayed';
    description: string;
  }[];
  tasks: {
    id: string;
    title: string;
    assignee: string;
    dueDate: string;
    status: 'todo' | 'in_progress' | 'review' | 'completed';
    priority: 'low' | 'medium' | 'high';
  }[];
  documents: {
    id: string;
    title: string;
    type: 'proposal' | 'report' | 'paper' | 'data';
    uploadedBy: string;
    uploadedAt: string;
    url: string;
  }[];
}

// サンプルデータ
const sampleProjects: Project[] = [
  {
    id: '1',
    title: 'SIAH1/2阻害剤の開発と前臨床試験',
    description: 'がん微小環境における低酸素応答の制御因子であるSIAH1/2の選択的阻害剤の開発と、その抗がん効果の検証を行う共同研究プロジェクト。',
    startDate: '2024-04-01',
    endDate: '2027-03-31',
    status: 'planning',
    progress: 0,
    members: [
      {
        id: '1',
        name: '山田 太郎',
        role: 'プロジェクトリーダー',
        organization: '東京大学医学部',
      },
      {
        id: '2',
        name: '鈴木 一郎',
        role: '化合物設計責任者',
        organization: 'ファーマテック株式会社',
      }
    ],
    milestones: [
      {
        id: '1',
        title: '化合物スクリーニング完了',
        dueDate: '2024-09-30',
        status: 'pending',
        description: '計算科学的手法により設計した化合物ライブラリーのスクリーニングを完了する'
      },
      {
        id: '2',
        title: 'リード化合物の最適化',
        dueDate: '2025-03-31',
        status: 'pending',
        description: 'スクリーニングで同定された候補化合物の構造最適化を行う'
      }
    ],
    tasks: [
      {
        id: '1',
        title: 'スクリーニング系の確立',
        assignee: '1',
        dueDate: '2024-05-31',
        status: 'todo',
        priority: 'high'
      },
      {
        id: '2',
        title: '化合物ライブラリーの設計',
        assignee: '2',
        dueDate: '2024-06-30',
        status: 'todo',
        priority: 'high'
      }
    ],
    documents: [
      {
        id: '1',
        title: '研究計画書',
        type: 'proposal',
        uploadedBy: '1',
        uploadedAt: '2024-03-15',
        url: '#'
      },
      {
        id: '2',
        title: '化合物設計戦略書',
        type: 'report',
        uploadedBy: '2',
        uploadedAt: '2024-03-20',
        url: '#'
      }
    ]
  }
];

const ProjectManagement = () => {
  const [projects] = useState<Project[]>(sampleProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'documents'>('overview');

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      planning: 'bg-yellow-100 text-yellow-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      suspended: 'bg-red-100 text-red-800',
      todo: 'bg-gray-100 text-gray-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      review: 'bg-purple-100 text-purple-800',
      done: 'bg-green-100 text-green-800',
      pending: 'bg-gray-100 text-gray-800',
      delayed: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">プロジェクト管理</h1>
        <p className="mt-2 text-gray-600">
          共同研究プロジェクトの進捗管理と成果物の共有
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* プロジェクト一覧 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-gray-900">プロジェクト一覧</h2>
              <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                新規作成
              </button>
            </div>

            <div className="space-y-4">
              {projects.map(project => (
                <button
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    selectedProject?.id === project.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {project.status === 'planning' ? '計画中' :
                       project.status === 'active' ? '進行中' :
                       project.status === 'completed' ? '完了' : '中断'}
                    </span>
                    <span className="text-sm text-gray-500">
                      進捗: {project.progress}%
                    </span>
                  </div>
                  <h3 className="font-medium text-gray-900">{project.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    期間: {formatDate(project.startDate)} 〜 {formatDate(project.endDate)}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* プロジェクト詳細 */}
        <div className="lg:col-span-2">
          {selectedProject ? (
            <div className="bg-white rounded-lg shadow-lg">
              {/* ヘッダー */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">{selectedProject.title}</h2>
                  <div className="flex items-center space-x-2">
                    <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      編集
                    </button>
                    <button className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      ミーティング
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <div>
                    <span className="text-sm text-gray-500">ステータス:</span>
                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedProject.status)}`}>
                      {selectedProject.status === 'planning' ? '計画中' :
                       selectedProject.status === 'active' ? '進行中' :
                       selectedProject.status === 'completed' ? '完了' : '中断'}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">期間:</span>
                    <span className="ml-2 text-sm text-gray-900">
                      {formatDate(selectedProject.startDate)} 〜 {formatDate(selectedProject.endDate)}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">進捗:</span>
                    <span className="ml-2 text-sm text-gray-900">{selectedProject.progress}%</span>
                  </div>
                </div>
              </div>

              {/* タブ */}
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 ${
                      activeTab === 'overview'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    概要
                  </button>
                  <button
                    onClick={() => setActiveTab('tasks')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 ${
                      activeTab === 'tasks'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    タスク
                  </button>
                  <button
                    onClick={() => setActiveTab('documents')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 ${
                      activeTab === 'documents'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    ドキュメント
                  </button>
                </nav>
              </div>

              {/* タブコンテンツ */}
              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-8">
                    {/* プロジェクト説明 */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">プロジェクト概要</h3>
                      <p className="text-gray-600">{selectedProject.description}</p>
                    </div>

                    {/* メンバー */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">プロジェクトメンバー</h3>
                        <button className="text-sm text-indigo-600 hover:text-indigo-500">
                          メンバーを追加
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {selectedProject.members.map(member => (
                          <div key={member.id} className="flex items-center space-x-3 p-4 border rounded-lg">
                            {member.avatar ? (
                              <img
                                src={member.avatar}
                                alt={member.name}
                                className="h-10 w-10 rounded-full"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500 font-medium">
                                  {member.name[0]}
                                </span>
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-medium text-gray-900">{member.name}</p>
                              <p className="text-sm text-gray-500">{member.role}</p>
                              <p className="text-xs text-gray-500">{member.organization}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* マイルストーン */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">マイルストーン</h3>
                        <button className="text-sm text-indigo-600 hover:text-indigo-500">
                          マイルストーンを追加
                        </button>
                      </div>
                      <div className="space-y-4">
                        {selectedProject.milestones.map(milestone => (
                          <div key={milestone.id} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900">{milestone.title}</h4>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(milestone.status)}`}>
                                {milestone.status === 'pending' ? '予定' :
                                 milestone.status === 'in_progress' ? '進行中' :
                                 milestone.status === 'completed' ? '完了' : '遅延'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{milestone.description}</p>
                            <p className="text-sm text-gray-500">
                              期限: {formatDate(milestone.dueDate)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'tasks' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-medium text-gray-900">タスク一覧</h3>
                      <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        タスクを追加
                      </button>
                    </div>

                    <div className="space-y-4">
                      {selectedProject.tasks.map(task => (
                        <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                                {task.status === 'todo' ? '未着手' :
                                 task.status === 'in_progress' ? '進行中' :
                                 task.status === 'review' ? 'レビュー中' : '完了'}
                              </span>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                {task.priority === 'low' ? '低' :
                                 task.priority === 'medium' ? '中' : '高'}優先度
                              </span>
                            </div>
                            <h4 className="font-medium text-gray-900">{task.title}</h4>
                            <div className="mt-1 text-sm text-gray-500">
                              担当: {selectedProject.members.find(m => m.id === task.assignee)?.name}
                              <span className="mx-2">•</span>
                              期限: {formatDate(task.dueDate)}
                            </div>
                          </div>
                          <button className="ml-4 text-gray-400 hover:text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'documents' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-medium text-gray-900">ドキュメント</h3>
                      <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        アップロード
                      </button>
                    </div>

                    <div className="space-y-4">
                      {selectedProject.documents.map(document => (
                        <div key={document.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="p-2 bg-gray-100 rounded-lg">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{document.title}</h4>
                              <div className="mt-1 text-sm text-gray-500">
                                アップロード: {selectedProject.members.find(m => m.id === document.uploadedBy)?.name}
                                <span className="mx-2">•</span>
                                {formatDate(document.uploadedAt)}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="text-gray-400 hover:text-gray-500">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                            </button>
                            <button className="text-gray-400 hover:text-gray-500">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">プロジェクトが選択されていません</h3>
              <p className="mt-1 text-sm text-gray-500">
                左側のリストからプロジェクトを選択してください。
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectManagement;