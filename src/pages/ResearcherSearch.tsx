import React, { useState, useEffect } from 'react';
import { searchResearchers, getResearchers, ResearcherProfile } from '../utils/researcherStorage'; // これらを非同期関数に変更

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

const ResearcherSearch = () => {
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

  useEffect(() => {
    // 初回データ取得（Supabaseからフェッチする場合）
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
      'medical': '医学・薬学',
      'engineering': '工学',
      'chemistry': '化学',
      'it': '情報工学'
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
        {/* 検索フィルターのUIはそのまま */}
        {/* ... */}
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
                  {/* 以下、研究実績の表示部分はそのまま */}
                </div>
              </div>

              {/* アクションボタン */}
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
            {/* 0件の表示 */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearcherSearch;
