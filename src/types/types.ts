// src/types.ts
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
