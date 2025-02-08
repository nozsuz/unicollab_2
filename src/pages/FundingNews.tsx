import React, { useState } from 'react';

interface FundingNews {
  id: string;
  title: string;
  organization: string;
  category: 'public' | 'private' | 'international';
  type: 'grant' | 'fellowship' | 'award';
  amount: string;
  deadline: string;
  description: string;
  eligibility: string[];
  url: string;
  tags: string[];
  publishedAt: string;
}

const sampleNews: FundingNews[] = [
  {
    id: '1',
    title: '2024年度 科学研究費助成事業（科研費）公募開始',
    organization: '日本学術振興会',
    category: 'public',
    type: 'grant',
    amount: '数十万円〜数億円',
    deadline: '2024-05-20',
    description: '2024年度の科研費公募が開始されました。基盤研究、若手研究、挑戦的研究など、多様な研究種目が用意されています。',
    eligibility: [
      '大学及び大学共同利用機関等に所属する研究者',
      '科研費に応募できる研究機関に所属する研究者'
    ],
    url: 'https://www.jsps.go.jp/j-grantsinaid/',
    tags: ['科研費', '基礎研究', '若手研究'],
    publishedAt: '2024-01-15'
  },
  {
    id: '2',
    title: '2024年度 戦略的創造研究推進事業（CREST）研究提案募集',
    organization: '科学技術振興機構',
    category: 'public',
    type: 'grant',
    amount: '総額1.5〜5億円程度（1課題あたり）',
    deadline: '2024-06-15',
    description: '「科学技術イノベーションに向けた研究開発戦略」に基づく戦略目標の下、組織の枠を超えた時限的な研究体制を構築し、イノベーション指向の戦略的な基礎研究を推進します。',
    eligibility: [
      '大学、国公立試験研究機関、企業等に所属する研究者',
      '研究代表者として研究を推進できる研究者'
    ],
    url: 'https://www.jst.go.jp/kisoken/crest/',
    tags: ['CREST', '戦略的創造研究', 'チーム型研究'],
    publishedAt: '2024-01-20'
  },
  {
    id: '3',
    title: '2024年度 民間企業研究開発助成プログラム',
    organization: '新技術開発財団',
    category: 'private',
    type: 'grant',
    amount: '最大2,000万円',
    deadline: '2024-04-30',
    description: '産学連携による革新的な技術開発プロジェクトを支援します。特に、社会実装を見据えた実用化研究を重点的に支援します。',
    eligibility: [
      '民間企業との共同研究を実施する研究者',
      '大学等の研究機関に所属する研究者'
    ],
    url: 'https://example.com/private-funding',
    tags: ['産学連携', '実用化研究', '技術開発'],
    publishedAt: '2024-01-25'
  },
  {
    id: '4',
    title: '国際共同研究加速基金',
    organization: '日本学術振興会',
    category: 'international',
    type: 'grant',
    amount: '最大3,000万円',
    deadline: '2024-07-31',
    description: '国際共同研究を加速させるための支援プログラム。海外の研究機関との共同研究プロジェクトを支援します。',
    eligibility: [
      '日本の研究機関に所属する研究者',
      '海外の研究機関との共同研究実績または計画を有する者'
    ],
    url: 'https://example.com/international-fund',
    tags: ['国際共同研究', 'グローバル連携', '研究加速'],
    publishedAt: '2024-01-30'
  }
];

const FundingNews = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'すべて' },
    { id: 'public', label: '公的助成金' },
    { id: 'private', label: '民間ファンド' },
    { id: 'international', label: '国際助成金' }
  ];

  const types = [
    { id: 'all', label: 'すべて' },
    { id: 'grant', label: '研究助成金' },
    { id: 'fellowship', label: 'フェローシップ' },
    { id: 'award', label: '研究賞' }
  ];

  const filteredNews = sampleNews.filter(news => {
    const matchesCategory = selectedCategory === 'all' || news.category === selectedCategory;
    const matchesType = selectedType === 'all' || news.type === selectedType;
    const matchesSearch = 
      news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      news.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      news.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesType && matchesSearch;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getCategoryLabel = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      'public': '公的助成金',
      'private': '民間ファンド',
      'international': '国際助成金'
    };
    return categoryMap[category] || category;
  };

  const getTypeLabel = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'grant': '研究助成金',
      'fellowship': 'フェローシップ',
      'award': '研究賞'
    };
    return typeMap[type] || type;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">研究費・助成金情報</h1>
        <p className="mt-2 text-gray-600">
          最新の公的助成金、民間ファンド、国際助成金の情報をお届けします。
        </p>
      </div>

      {/* フィルターとサーチ */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* カテゴリーフィルター */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              カテゴリー
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* タイプフィルター */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
              助成金タイプ
            </label>
            <select
              id="type"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              {types.map(type => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* 検索ボックス */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              キーワード検索
            </label>
            <input
              type="text"
              id="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="キーワードを入力"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* 助成金情報リスト */}
      <div className="space-y-6">
        {filteredNews.map(news => {
          const daysUntilDeadline = getDaysUntilDeadline(news.deadline);
          
          return (
            <div key={news.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                {/* ヘッダー部分 */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {getCategoryLabel(news.category)}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {getTypeLabel(news.type)}
                  </span>
                  {daysUntilDeadline <= 30 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      締切まであと{daysUntilDeadline}日
                    </span>
                  )}
                </div>

                {/* タイトルと組織 */}
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{news.title}</h2>
                  <p className="text-sm text-gray-600">{news.organization}</p>
                </div>

                {/* 助成金情報 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">助成金額</h3>
                    <p className="mt-1 text-sm text-gray-600">{news.amount}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">応募締切</h3>
                    <p className="mt-1 text-sm text-gray-600">{formatDate(news.deadline)}</p>
                  </div>
                </div>

                {/* 説明 */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600">{news.description}</p>
                </div>

                {/* 応募資格 */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">応募資格</h3>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {news.eligibility.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                {/* タグとアクション */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    {news.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a
                    href={news.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    詳細を見る
                    <svg
                      className="ml-2 -mr-1 h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>

                {/* 公開日 */}
                <div className="mt-4 text-xs text-gray-500">
                  公開日: {formatDate(news.publishedAt)}
                </div>
              </div>
            </div>
          );
        })}

        {filteredNews.length === 0 && (
          <div className="text-center py-12">
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
            <h3 className="mt-2 text-sm font-medium text-gray-900">該当する助成金情報が見つかりません</h3>
            <p className="mt-1 text-sm text-gray-500">検索条件を変更してお試しください。</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FundingNews;