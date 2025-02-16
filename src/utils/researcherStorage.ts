import { createClient } from '@supabase/supabase-js';
import { ResearcherProfile, SearchFilters } from '../types';

// Supabase の初期化（実際の URL と anon-key に置き換えてください）
const supabaseUrl = 'https://nfvwqjkweewfdtowduqr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mdndxamt3ZWV3ZmR0b3dkdXFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4OTcyNzAsImV4cCI6MjA1MzQ3MzI3MH0.7FX4jSTUY4jJGEY6e8T-20ONBLInARvG-oYyCqxBL1g';
const supabase = createClient(supabaseUrl, supabaseKey);

// 研究者データを Supabase の isinomaki_1 テーブルから取得する関数
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
  const queryLower = query.toLowerCase();

  return researchers.filter((researcher: ResearcherProfile) => {
    // キーワード検索対象：researcher.keywords のみ
    const matchesKeywords =
      query === '' || (researcher.keywords || '').toLowerCase().includes(queryLower);

    // 専門分野（field）での絞り込み：filters.fields（チェックボックスで選択された専門分野）
    const matchesField =
      !filters.fields ||
      filters.fields.length === 0 ||
      filters.fields.includes(researcher.field);

    // 研究分野（specialization）検索：別の検索窓で文字列検索
    const matchesSpecializationQuery =
      filters.specializationQuery === '' ||
      (researcher.specialization || '').toLowerCase().includes(filters.specializationQuery.toLowerCase());

    const matchesInstitution =
      !filters.institution ||
      (researcher.institution || '').toLowerCase().includes(filters.institution.toLowerCase());
    const matchesHIndex =
      !filters.minHIndex || (researcher.citation_metrics?.h_index ?? 0) >= filters.minHIndex;
    const matchesPatents =
      !filters.hasPatents || (researcher.patents && researcher.patents.count > 0);

    return (
      matchesKeywords &&
      matchesField &&
      matchesSpecializationQuery &&
      matchesInstitution &&
      matchesHIndex &&
      matchesPatents
    );
  });
}
