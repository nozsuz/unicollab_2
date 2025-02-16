import React, { useState, useEffect } from 'react';
import { ResearcherProfile } from '../types';
import { getResearchers, searchResearchers } from '../utils/researcherStorage';

interface SearchFilters {
  fields: string[];                // 専門分野 (researcher.field) のチェックボックス選択
  specializationQuery: string;     // 研究分野 (researcher.specialization) の検索用文字列
  keywords: string;                // キーワード検索対象（researcher.keywords）の検索文字列
  institution: string;
  publicationYearStart: number;
  publicationYearEnd: number;
  minCitations: number;
  minHIndex: number;
  hasPatents: boolean;
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

const ResearcherSearch: React.FC = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    fields: [],
    specializationQuery: '',
    keywords: '',
    institution: '',
    publicationYearStart: 2000,
    publicationYearEnd: new Date().getFullYear(),
    minCitations: 0,
    minHIndex: 0,
    hasPatents: false,
  });
  const [researchers, setResearchers] = useState<ResearcherProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFieldFilter, setShowFieldFilter] = useState(false);

  // 初回ロード時に Supabase から全データを取得
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getResearchers();
        console.log('Fetched data:', data);
        setResearchers(data);
      } catch (error) {
        console.error('Error fetching researchers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 検索処理。検索クエリは researcher.keywords のみを対象とし、
  // 研究分野検索は researcher.specialization に対して、専門分野は filters.fields でフィルタ
  const handleSearch = async () => {
    setLoading(true);
    try {
      const results = await searchResearchers(filters.keywords, filters);
      console.log('Search results:', results);
      setResearchers(results);
    } catch (error) {
      console.error('Error searching researchers:', error);
      alert('検索中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const toggleField = (field: string) => {
    setFilters(prev => {
      const newFields = prev.fields.includes(field)
        ? prev.fields.filter(f => f !== field)
        : [...prev.fields, field];
      return { ...prev, fields: newFields };
    });
  };

  // getFieldLabel: 専門分野のラベルをそのまま返す
  const getFieldLabel = (field: string) => field;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">研究者検索</h1>
        <p className="mt-2 text-gray-600">
          キーワード、研究分野、専門分野で検索できます。
        </p>
      </div>

      {/* 検索フィルター（コンパクトにまとめる） */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row md:items-end md:space-x-4">
          {/* キーワード検索（researcher.keywords） */}
          <div className="flex-1">
            <label htmlFor="keywords" className="block text-sm font-medium text-gray-700">キーワード検索</label>
            <input
              type="text"
              id="keywords"
              value={filters.keywords}
              onChange={(e) => setFilters({ ...filters, keywords: e.target.value })}
              placeholder="キーワードを入力"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          {/* 研究分野検索（researcher.specialization） */}
          <div className="flex-1">
            <label htmlFor="specializationQuery" className="block text-sm font-medium text-gray-700">研究分野検索</label>
            <input
              type="text"
              id="specializationQuery"
              value={filters.specializationQuery}
              onChange={(e) => setFilters({ ...filters, specializationQuery: e.target.value })}
              placeholder="研究分野を入力"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>
        {/* 専門分野フィルター（トグル表示） */}
        <div className="mt-4 flex items-center justify-between">
          <span className="block text-sm font-medium text-gray-700">専門分野</span>
          <button
            onClick={() => setShowFieldFilter(prev => !prev)}
            className="px-3 py-1 bg-gray-200 rounded text-sm"
          >
            {showFieldFilter ? '非表示にする' : '表示する'}
          </button>
        </div>
        {showFieldFilter && (
          <div className="mt-2 grid grid-cols-2 gap-2">
            {allFields.map((field) => (
              <label key={field} className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox text-indigo-600"
                  checked={filters.fields.includes(field)}
                  onChange={() => toggleField(field)}
                />
                <span className="ml-2 text-sm">{field}</span>
              </label>
            ))}
          </div>
        )}
        {/* その他のフィルター：所属機関、最小h-index、特許有無 */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="institution" className="block text-sm font-medium text-gray-700">所属機関</label>
            <input
              type="text"
              id="institution"
              value={filters.institution}
              onChange={(e) => setFilters({ ...filters, institution: e.target.value })}
              placeholder="大学・研究機関名"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="h-index" className="block text-sm font-medium text-gray-700">最小h-index</label>
            <input
              type="number"
              id="h-index"
              value={filters.minHIndex}
              onChange={(e) => setFilters({ ...filters, minHIndex: parseInt(e.target.value) || 0 })}
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="has-patents"
              checked={filters.hasPatents}
              onChange={(e) => setFilters({ ...filters, hasPatents: e.target.checked })}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="has-patents" className="ml-2 text-sm text-gray-700">特許を保有する研究者のみ</label>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {loading ? "検索中..." : "検索"}
          </button>
        </div>
      </div>

      {/* 検索結果件数 */}
      {!loading && (
        <div className="mb-4 text-sm text-gray-700">
          検索結果: {researchers.length} 件
        </div>
      )}

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
                    {researcher.specialization &&
                      researcher.specialization.split(/、|・/).map((spec, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                        >
                          {spec.trim()}
                        </span>
                      ))}
                  </div>
                  <p className="text-gray-600 mb-4">{researcher.research_summary}</p>
                  {researcher.keywords && (
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-900 mb-1">キーワード</h3>
                      <p className="text-gray-900">{researcher.keywords}</p>
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
