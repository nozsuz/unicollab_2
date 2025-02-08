import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getProposals, ResearchProposal } from '../utils/proposalStorage';

type ListingType = 'seeds' | 'needs';
type Category = 'all' | 'medical' | 'engineering' | 'chemistry' | 'it';

interface Need {
  id: number;
  title: string;
  company: string;
  field: string;
  fieldName: string;
  description: string;
  image: string;
  views: number;
}

const needsData: Need[] = [
  {
    id: 1,
    title: "バイオプラスチックの製造技術",
    company: "環境ソリューション株式会社",
    field: "chemistry",
    fieldName: "化学",
    description: "環境負荷の少ない生分解性プラスチックの効率的な製造方法の確立",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3",
    views: 567
  },
  {
    id: 2,
    title: "量子コンピューティング応用",
    company: "テックイノベーション株式会社",
    field: "it",
    fieldName: "情報工学",
    description: "量子アルゴリズムの実用化研究",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3",
    views: 432
  }
];

const Listings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<ListingType>('seeds');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [publishedProposals, setPublishedProposals] = useState<ResearchProposal[]>([]);

  useEffect(() => {
    // 初期データの読み込み
    const proposals = getProposals();
    const published = proposals.filter(p => p.status === 'published');
    setPublishedProposals(published);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const getFieldLabel = (field: string) => {
    const fieldMap: { [key: string]: string } = {
      'medical': '医学・薬学',
      'engineering': '工学',
      'chemistry': '化学',
      'it': '情報工学'
    };
    return fieldMap[field] || field;
  };

  const filteredSeeds = useMemo(() => {
    return publishedProposals.filter(proposal => {
      const matchesSearch = 
        proposal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proposal.summary.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = 
        selectedCategory === 'all' || 
        proposal.field === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [publishedProposals, searchQuery, selectedCategory]);

  const filteredNeeds = useMemo(() => {
    return needsData.filter(need => {
      const matchesSearch = 
        need.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        need.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        need.company.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = 
        selectedCategory === 'all' || 
        need.field === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-semibold text-gray-900">研究シーズ・ニーズ一覧</h1>
        </div>
      </div>

      <div className="mt-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('seeds')}
              className={`${
                activeTab === 'seeds'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              研究シーズ一覧
            </button>
            <button
              onClick={() => setActiveTab('needs')}
              className={`${
                activeTab === 'needs'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              企業ニーズ一覧
            </button>
          </nav>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="キーワードで検索"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as Category)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="all">全分野</option>
            <option value="medical">医学・薬学</option>
            <option value="engineering">工学</option>
            <option value="chemistry">化学</option>
            <option value="it">情報工学</option>
          </select>
        </div>

        <div className="mt-8">
          {activeTab === 'seeds' ? (
            <div className="space-y-6">
              {filteredSeeds.map((seed) => (
                <div key={seed.id} className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {getFieldLabel(seed.field)}
                      </span>
                    </div>
                    <div className="mt-2">
                      <h3 className="text-lg font-medium text-gray-900">{seed.title}</h3>
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">{seed.summary}</p>
                    </div>
                    <div className="mt-4">
                      <button 
                        onClick={() => navigate(`/academic/proposals/${seed.id}`)}
                        className="text-sm text-indigo-600 hover:text-indigo-900"
                      >
                        詳細を見る →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredSeeds.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">該当する研究シーズが見つかりませんでした。</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredNeeds.map((need) => (
                <div key={need.id} className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="md:flex">
                    <div className="md:flex-shrink-0">
                      <img
                        className="h-48 w-full object-cover md:w-48"
                        src={need.image}
                        alt={need.title}
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {need.fieldName}
                        </span>
                        <span className="ml-2 text-sm text-gray-500">
                          閲覧数: {need.views}
                        </span>
                      </div>
                      <div className="mt-2">
                        <h3 className="text-lg font-medium text-gray-900">{need.title}</h3>
                        <p className="mt-1 text-sm text-gray-600">{need.description}</p>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm text-gray-900">{need.company}</p>
                      </div>
                      <div className="mt-4">
                        <button 
                          onClick={() => navigate(`/needs/${need.id}`)}
                          className="text-sm text-indigo-600 hover:text-indigo-900"
                        >
                          詳細を見る →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Listings;