import { v4 as uuidv4 } from 'uuid';

export interface ResearcherProfile {
  id: string;
  name: string;
  title: string;
  institution: string;
  department: string;
  field: string;
  specialization: string;
  research_summary: string;
  citation_metrics: {
    h_index: number;
    total_citations: number;
    i10_index: number;
  };
  publications: {
    count: number;
    recent: Array<{
      title: string;
      journal: string;
      year: number;
      citations: number;
    }>;
  };
  patents: {
    count: number;
    recent: Array<{
      title: string;
      patent_number: string;
      year: number;
    }>;
  };
  created_at: string;
  updated_at: string;
}

interface SearchFilters {
  field?: string;
  specialization?: string[];
  institution?: string;
  minHIndex?: number;
  hasPatents?: boolean;
}

// サンプルデータ
const sampleResearchers: ResearcherProfile[] = [
  // ... (既存のサンプルデータ)
];

// 研究者プロフィール一覧の取得
export function getResearchers(): ResearcherProfile[] {
  const stored = localStorage.getItem('researcher_profiles');
  if (!stored) {
    localStorage.setItem('researcher_profiles', JSON.stringify(sampleResearchers));
    return sampleResearchers;
  }
  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error parsing stored researchers:', error);
    return [];
  }
}

// 研究者の検索
export function searchResearchers(query: string, filters: SearchFilters): ResearcherProfile[] {
  const researchers = getResearchers();
  
  return researchers.filter(researcher => {
    // キーワード検索
    const matchesQuery = query === '' || [
      researcher.name,
      researcher.research_summary,
      researcher.specialization,
      ...researcher.publications.recent.map(p => p.title)
    ].some(text => 
      text.toLowerCase().includes(query.toLowerCase())
    );

    // フィルター適用
    const matchesField = !filters.field || researcher.field === filters.field;
    const matchesSpecialization = !filters.specialization?.length || 
      filters.specialization.includes(researcher.specialization);
    const matchesInstitution = !filters.institution ||
      researcher.institution.toLowerCase().includes(filters.institution.toLowerCase());
    const matchesHIndex = !filters.minHIndex || 
      researcher.citation_metrics.h_index >= filters.minHIndex;
    const matchesPatents = !filters.hasPatents || researcher.patents.count > 0;

    return matchesQuery && matchesField && matchesSpecialization && 
           matchesInstitution && matchesHIndex && matchesPatents;
  });
}