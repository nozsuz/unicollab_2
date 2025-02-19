import React, { useState, useEffect, KeyboardEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ResearcherProfile } from '../types';
import { getResearchers, searchResearchers, getFields, getInstitutions } from '../utils/researcherStorage';

// specializationQuery プロパティを削除
interface SearchFilters {
  fields: string[];
  keywords: string;
  institution: string;
  publicationYearStart: number;
  publicationYearEnd: number;
  minCitations: number;
  minHIndex: number;
  hasPatents: boolean;
}

const ResearcherSearch: React.FC = () => {
  const [fieldOptions, setFieldOptions] = useState<string[]>([]);
  const [institutionOptions, setInstitutionOptions] = useState<string[]>([]);
  const [showFields, setShowFields] = useState<boolean>(true);
  const [filters, setFilters] = useState<SearchFilters>({
    fields: [],
    keywords: '',
    institution: '',
    publicationYearStart: 2000,
    publicationYearEnd: new Date().getFullYear(),
    minCitations: 0,
    minHIndex: 0,
    hasPatents: false,
  });
  const [researchers, setResearchers] = useState<ResearcherProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();

  // 専門分野の選択肢を取得
  useEffect(() => {
    const fetchFields = async () => {
      try {
        const fields = await getFields();
        setFieldOptions(fields);
      } catch (error) {
        console.error('Error fetching fields:', error);
      }
    };
    fetchFields();
  }, []);

  // 所属機関の選択肢を取得
  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const institutions = await getInstitutions();
        setInstitutionOptions(["", ...institutions]);
      } catch (error) {
        console.error('Error fetching institutions:', error);
      }
    };
    fetchInstitutions();
  }, []);

  // URLクエリパラメータに応じて検索結果を更新
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getResearchers();
        const searchParams = new URLSearchParams(location.search);
        const idsParam = searchParams.get('ids');
        const keywordsParam = searchParams.get('keywords') || "";
        const institutionParam = searchParams.get('institution') || "";
        const fieldsParam = searchParams.get('fields') || "";
        console.log("URL parameters:", { idsParam, keywordsParam, institutionParam, fieldsParam });
        if (idsParam) {
          // IDs がある場合は、そのIDのみでフィルタリング
          const candidateIds = idsParam.split(',').map(id => id.trim());
          const filteredData = data.filter(r => candidateIds.includes(String(r.id)));
          setResearchers(filteredData);
        } else if (keywordsParam || institutionParam || fieldsParam) {
          const searchFilters: SearchFilters = {
            ...filters,
            keywords: keywordsParam,
            institution: institutionParam,
            fields: fieldsParam ? fieldsParam.split(',') : filters.fields,
          };
          const results = await searchResearchers(keywordsParam, searchFilters);
          setResearchers(results);
        } else {
          setResearchers(data);
        }
      } catch (error) {
        console.error('Error fetching researchers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [location.search]);

  // 検索ボタン・エンターキー押下時の処理：フィルター内容をURLクエリに反映
  const executeSearch = () => {
    const queryParams = new URLSearchParams();
    if (filters.keywords.trim()) {
      queryParams.set('keywords', filters.keywords.trim());
    }
    if (filters.institution.trim()) {
      queryParams.set('institution', filters.institution.trim());
    }
    if (filters.fields.length > 0) {
      queryParams.set('fields', filters.fields.join(','));
    }
    navigate(`?${queryParams.toString()}`);
  };

  const handleSearch = async () => {
    executeSearch();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeSearch();
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

  const getFieldLabel = (field: string) => field;

  const generateSearchUrl = (researcher: ResearcherProfile) => {
    return `https://cir.nii.ac.jp/all?q=${encodeURIComponent(researcher.name)}&affiliation=${encodeURIComponent(researcher.institution)}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">研究者検索</h1>
        <p className="mt-2 text-gray-600">
          研究者名、研究分野、所属機関、キーワード、または研究者IDで検索できます。
        </p>
      </div>

      {/* 検索フィルター部分 */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        {/* 所属機関の選択 */}
        <div className="mb-4">
          <label htmlFor="institution" className="block text-sm font-medium text-gray-700">
            所属機関
          </label>
          <select
            id="institution"
            value={filters.institution}
            onChange={(e) => setFilters({ ...filters, institution: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {institutionOptions.map((option) => (
              <option key={option} value={option}>
                {option === "" ? "すべて" : option}
              </option>
            ))}
          </select>
        </div>
        {/* 統一のキーワード検索 */}
        <div className="mb-4">
          <label htmlFor="keywords" className="block text-sm font-medium text-gray-700">
            検索キーワード / ID
          </label>
          <input
            type="text"
            id="keywords"
            value={filters.keywords}
            onChange={(e) => setFilters({ ...filters, keywords: e.target.value })}
            onKeyDown={handleKeyDown}
            placeholder="研究者名、研究分野、所属機関、キーワード、またはID"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        {/* 専門分野（field）の表示／非表示 */}
        <div className="mb-4 flex items-center justify-between">
          <span className="block text-sm font-medium text-gray-700">専門分野</span>
          <button
            onClick={() => setShowFields(prev => !prev)}
            className="px-3 py-1 bg-gray-200 rounded text-sm"
          >
            {showFields ? "非表示" : "表示"}
          </button>
        </div>
        {showFields && (
          <div className="grid grid-cols-2 gap-2">
            {fieldOptions.map((field) => (
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

      {/* 検索結果件数の表示 */}
      {!loading && (
        <div className="mb-4 text-sm text-gray-700">
          検索結果: {researchers.length} 件
        </div>
      )}

      {/* 検索結果の表示 */}
      <div className="space-y-6">
        {researchers.map((researcher) => (
          <div
            key={researcher.id}
            className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2 space-x-2">
                    <h2 className="text-xl font-bold text-gray-900">{researcher.name}</h2>
                    <a
                      href={generateSearchUrl(researcher)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-1 bg-blue-500 text-white rounded-md text-xs hover:bg-blue-600"
                    >
                      論文・データを探す
                    </a>
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
