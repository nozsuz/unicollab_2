import React, { useState, useEffect } from 'react';
import { ResearcherProfile } from '../types';
import { getResearchers, searchResearchers } from '../utils/researcherStorage';

interface SearchFilters {
  field: string;
  specialization: string[];
  keywords: string[];
  institution: string;
  publicationYearStart: number;
  publicationYearEnd: number;
  minCitations: number;
  minHIndex: number;
  hasPatents: boolean;
}

const ResearcherSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    field: '',
    specialization: [],
    keywords: [],
    institution: '',
    publicationYearStart: 2000,
    publicationYearEnd: new Date().getFullYear(),
    minCitations: 0,
    minHIndex: 0,
    hasPatents: false
  });
  const [researchers, setResearchers] = useState<ResearcherProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedResearcher, setSelectedResearcher] = useState<ResearcherProfile | null>(null);

  // 初回データ取得（Supabaseからフェッチ）
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getResearchers();
        setResearchers(data);
      } catch (error) {
        console.error('Error fetching researchers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const results = await searchResearchers(searchQuery, {
        field: filters.field,
        specialization: filters.specialization,
        institution: filters.institution,
        minHIndex: filters.minHIndex,
        hasPatents: filters.hasPatents
      });
      setResearchers(results);
    } catch (error) {
      console.error('Error searching researchers:', error);
      alert('研究者の検索中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const getFieldLabel = (field: string) => {
    const fieldMap: { [key: string]: string } = {
      medical: '医学・薬学',
      engineering: '工学',
      chemistry: '化学',
      it: '情報工学'
    };
    return fieldMap[field] || field;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">研究者検索</h1>
        <p className="mt-2 text-gray-600">
          研究分野やキーワードから、共同研究のパートナーを見つけることができます。
        </p>
      </div>

      {/* 検索フィルター */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* キーワード検索 */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              キーワード検索
            </label>
            <input
              type="text"
              id="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="研究キーワードを入力"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          {/* 研究分野 */}
          <div>
            <label htmlFor="field" className="block text-sm font-medium text-gray-700 mb-2">
              研究分野
            </label>
            <select
              id="field"
              value={filters.field}
              onChange={(e) => setFilters({ ...filters, field: e.target.value })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">すべての分野</option>
              <option value="medical">医学・薬学</option>
              <option value="engineering">工学</option>
              <option value="chemistry">化学</option>
              <option value="it">情報工学</option>
            </select>
          </div>

          {/* 所属機関 */}
          <div>
            <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-2">
              所属機関
            </label>
            <input
              type="text"
              id="institution"
              value={filters.institution}
              onChange={(e) => setFilters({ ...filters, institution: e.target.value })}
              placeholder="大学・研究機関名"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          {/* h-index */}
          <div>
            <label htmlFor="h-index" className="block text-sm font-medium text-gray-700 mb-2">
              最小h-index
            </label>
            <input
              type="number"
              id="h-index"
              value={filters.minHIndex}
              onChange={(e) => setFilters({ ...filters, minHIndex: parseInt(e.target.value) || 0 })}
              min="0"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          {/* 特許の有無 */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="has-patents"
              checked={filters.hasPatents}
              onChange={(e) => setFilters({ ...filters, hasPatents: e.target.checked })}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="has-patents" className="ml-2 block text-sm text-gray-700">
              特許を保有する研究者のみ
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleSearch}
            disabled={loading}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                検索中...
              </>
            ) : (
              '研究者を検索'
            )}
          </button>
        </div>
      </div>

      {/* 検索結果 */}
      <div className="space-y-6">
        {researchers.map((researcher) => (
          <div
            key={researcher.id}
            className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h2 className="text-xl font-bold text-gray-900">{researcher.name}</h2>
                    <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {researcher.title}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {researcher.institution} {researcher.department}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {getFieldLabel(researcher.field)}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {researcher.specialization}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{researcher.research_summary}</p>
                  
                  {/* 研究実績 */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">h-index</p>
                      <p className="text-lg font-semibold text-gray-900">{researcher.citation_metrics.h_index}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">総被引用数</p>
                      <p className="text-lg font-semibold text-gray-900">{researcher.citation_metrics.total_citations}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">特許数</p>
                      <p className="text-lg font-semibold text-gray-900">{researcher.patents.count}</p>
                    </div>
                  </div>

                  {/* 最近の論文 */}
                  {researcher.publications.recent.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-900 mb-2">最近の論文</h3>
                      <ul className="space-y-2">
                        {researcher.publications.recent.map((pub, index) => (
                          <li key={index} className="text-sm">
                            <p className="text-gray-900">{pub.title}</p>
                            <p className="text-gray-500">
                              {pub.journal} ({pub.year}) - 被引用数: {pub.citations}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* 最近の特許 */}
                  {researcher.patents.recent.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2">最近の特許</h3>
                      <ul className="space-y-2">
                        {researcher.patents.recent.map((patent, index) => (
                          <li key={index} className="text-sm">
                            <p className="text-gray-900">{patent.title}</p>
                            <p className="text-gray-500">
                              {patent.patent_number} ({patent.year})
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  詳細プロフィール
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                  コンタクトする
                </button>
              </div>
            </div>
          </div>
        ))}
        {researchers.length === 0 && !loading && (
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
            <h3 className="mt-2 text-sm font-medium text-gray-900">該当する研究者が見つかりません</h3>
            <p className="mt-1 text-sm text-gray-500">検索条件を変更してお試しください。</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearcherSearch;
