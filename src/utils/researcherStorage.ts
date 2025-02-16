import { createClient } from '@supabase/supabase-js';
import { ResearcherProfile, SearchFilters } from '../types';

// Supabase の初期化（あなたのプロジェクトの URL と anon-key に置き換えてください）
const supabaseUrl = 'https://nfvwqjkweewfdtowduqr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mdndxamt3ZWV3ZmR0b3dkdXFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4OTcyNzAsImV4cCI6MjA1MzQ3MzI3MH0.7FX4jSTUY4jJGEY6e8T-20ONBLInARvG-oYyCqxBL1g';
const supabase = createClient(supabaseUrl, supabaseKey);

// 研究者データを Supabase から取得する関数
export async function getResearchers(): Promise<ResearcherProfile[]> {
  const { data, error } = await supabase
    .from('ishinomaki_1')
    .select('*');
  if (error) {
    console.error('Error fetching researchers:', error);
    return [];
  }
  return data as ResearcherProfile[];
}

// 取得した研究者データに対して、クエリおよびフィルターを適用して検索する関数
export async function searchResearchers(
  query: string,
  filters: SearchFilters
): Promise<ResearcherProfile[]> {
  const researchers = await getResearchers();

  return researchers.filter((researcher: ResearcherProfile) => {
    // キーワード検索：名前、研究概要、専門分野、最近の論文タイトルにクエリが含まれているか
    const matchesQuery =
      query === '' ||
      [
        researcher.name,
        researcher.research_summary,
        researcher.specialization,
        ...researcher.publications.recent.map(
          (pub: { title: string; journal: string; year: number; citations: number }) => pub.title
        )
      ].some((text) =>
        text.toLowerCase().includes(query.toLowerCase())
      );

    // フィルター条件の適用
    const matchesField = !filters.field || researcher.field === filters.field;
    const matchesSpecialization =
      !filters.specialization ||
      filters.specialization.length === 0 ||
      filters.specialization.includes(researcher.specialization);
    const matchesInstitution =
      !filters.institution ||
      researcher.institution.toLowerCase().includes(filters.institution.toLowerCase());
    const matchesHIndex =
      !filters.minHIndex || researcher.citation_metrics.h_index >= filters.minHIndex;
    const matchesPatents =
      !filters.hasPatents || (researcher.patents && researcher.patents.count > 0);

    return (
      matchesQuery &&
      matchesField &&
      matchesSpecialization &&
      matchesInstitution &&
      matchesHIndex &&
      matchesPatents
    );
  });
}
