export interface ResearcherProfile {
  id: string;
  name: string;
  title: string;
  institution: string;
  department: string;
  field: string;           // 専門分野としてのフィールド
  specialization: string;  // 研究分野としての specialization
  keywords: string;        // キーワード
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

export interface SearchFilters {
  fields: string[];            // 専門分野（researcher.field）のチェックボックス選択
  specializationQuery: string; // 研究分野（researcher.specialization）の検索用文字列
  keywords: string;            // キーワード検索（researcher.keywords）対象
  institution: string;
  publicationYearStart: number;
  publicationYearEnd: number;
  minCitations: number;
  minHIndex: number;
  hasPatents: boolean;
}
