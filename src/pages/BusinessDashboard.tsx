import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface BusinessProfile {
  id: string;
  name: string;
  title: string;
  company: string;
  department: string;
  email: string;
  phone: string;
  image_url?: string;
}

interface ResearchNeed {
  id: string;
  title: string;
  field: string;
  summary: string;
  background: string;
  objective: string;
  required_expertise: string[];
  collaboration_type: string;
  budget: string;
  period: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

const BusinessDashboard = () => {
  const [profile] = useState<BusinessProfile>({
    id: '1',
    name: '鈴木 一郎',
    title: '研究開発部長',
    company: 'ファーマテック株式会社',
    department: '研究開発部',
    email: 'suzuki@example.com',
    phone: '03-xxxx-xxxx',
    image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80'
  });

  const [needs] = useState<ResearchNeed[]>([
    {
      id: '1',
      title: '新規がん免疫療法の開発',
      field: 'medical',
      summary: '免疫チェックポイント阻害剤の新規標的分子の探索と治療薬開発',
      background: 'がん免疫療法の効果を高める新しいアプローチが求められています。',
      objective: '新規免疫チェックポイント分子の同定と、それを標的とした治療薬の開発',
      required_expertise: ['免疫学', '創薬化学', '臨床腫瘍学'],
      collaboration_type: 'joint_research',
      budget: '1000-5000万円/年',
      period: '3-5年',
      status: 'published',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]);

  const getFieldLabel = (field: string) => {
    const fieldMap: { [key: string]: string } = {
      'medical': '医学・薬学',
      'engineering': '工学',
      'chemistry': '化学',
      'it': '情報工学'
    };
    return fieldMap[field] || field;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">マイページ</h1>
      </div>

      {/* 企業プロフィール */}
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
                <p className="text-sm sm:text-base text-gray-600">{profile.company}</p>
                <p className="text-sm sm:text-base text-gray-600">{profile.department}</p>
                <p className="text-sm sm:text-base text-gray-600">Email: {profile.email}</p>
                <p className="text-sm sm:text-base text-gray-600">Tel: {profile.phone}</p>
              </div>
            </div>

            {/* 編集ボタン */}
            <div className="mt-4 sm:mt-0 text-center sm:text-left">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                編集する
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 研究ニーズ一覧 */}
      <div className="bg-white rounded-lg shadow-md mb-6 sm:mb-8">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">研究ニーズ</h2>
            <Link
              to="/business/needs/new"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              新規作成
            </Link>
          </div>

          <div className="space-y-4">
            {needs.map((need) => (
              <div key={need.id} className="border rounded-lg p-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {getFieldLabel(need.field)}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {need.status === 'published' ? '公開中' : '下書き'}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">{need.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">{need.summary}</p>
                    <div className="flex flex-wrap gap-2">
                      {need.required_expertise.map((expertise, index) => (
                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {expertise}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-wrap sm:flex-nowrap gap-2">
                    <Link
                      to={`/needs/${need.id}`}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      詳細
                    </Link>
                    <Link
                      to={`/researcher-search?need=${need.id}`}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      研究者を探す
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* クイックアクセス */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/researcher-search"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">研究者検索</h3>
              <p className="mt-1 text-sm text-gray-500">研究分野やキーワードから研究者を探す</p>
            </div>
          </div>
        </Link>

        <Link
          to="/messages"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">メッセージ</h3>
              <p className="mt-1 text-sm text-gray-500">研究者とのコミュニケーション</p>
            </div>
          </div>
        </Link>

        <Link
          to="/projects"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">プロジェクト</h3>
              <p className="mt-1 text-sm text-gray-500">共同研究プロジェクトの管理</p>
            </div>
          </div>
        </Link>

        <Link
          to="/funding"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">研究費情報</h3>
              <p className="mt-1 text-sm text-gray-500">助成金・補助金情報</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default BusinessDashboard;