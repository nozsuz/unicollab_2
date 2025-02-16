import { createClient } from '@supabase/supabase-js';
import { ResearcherProfile, SearchFilters } from '../types';

// Supabase の URL と anon-key（読み取り用キー）を設定
const supabaseUrl = 'https://your-project-url.supabase.co';
const supabaseKey = 'your-anon-key';
const supabase = createClient(supabaseUrl, supabaseKey);

// 研究者データを Supabase から取得する
export async function getResearchers(): Promise<ResearcherProfile[]> {
  const { data, error } = await supabase
    .from('researchers')
    .select('*');

  if (error) {
    console.error('Error fetching researchers:', error);
    return [];
  }
  return data as ResearcherProfile[];
}

// 取得した研究者データに対して、クエリおよびフィルターを適用して検索する
export async function searchResearchers(
  query: string,
  filters: SearchFilters
): Promise<ResearcherProfile[]> {
  const researchers = await getResearchers();

  return researchers.filter((researcher: ResearcherProfile) => {
    // キーワード検索：名前、研究概要、専門分野、最近の論文タイトルなどにクエリが含まれているか
    const matchesQuery =
      query === '' ||
      [
        researcher.name,
        researcher.research_summary,
        researcher.specialization,
        ...researcher.publications.recent.map((pub) => pub.title)
      ].some((text) =>
        text.toLowerCase().includes(query.toLowerCase())
      );

    // フィルター条件の適用
    const matchesField =
      !filters.field || researcher.field === filters.field;
    const matchesSpecialization =
      !filters.specialization ||
      filters.specialization.length === 0 ||
      filters.specialization.includes(researcher.specialization);
    const matchesInstitution =
      !filters.institution ||
      researcher.institution.toLowerCase().includes(filters.institution.toLowerCase());
    const matchesHIndex =
      !filters.minHIndex ||
      researcher.citation_metrics.h_index >= filters.minHIndex;
    const matchesPatents =
      !filters.hasPatents ||
      (researcher.patents && researcher.patents.count > 0);

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
