import { createClient } from '@supabase/supabase-js';
import { ResearcherProfile, SearchFilters } from '../types';

const supabaseUrl = 'https://nfvwqjkweewfdtowduqr.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mdndxamt3ZWV3ZmR0b3dkdXFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4OTcyNzAsImV4cCI6MjA1MzQ3MzI3MH0.7FX4jSTUY4jJGEY6e8T-20ONBLInARvG-oYyCqxBL1g';
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Supabase の ishinomaki_1 テーブルから研究者データを全件取得する関数
 */
export async function getResearchers(): Promise<ResearcherProfile[]> {
  const { data, error } = await supabase.from('ishinomaki_1').select('*');
  if (error) {
    console.error('Error fetching researchers:', error);
    return [];
  }
  return data as ResearcherProfile[];
}

/**
 * 取得した研究者データに対して、キーワードや各種フィルターを適用して検索する関数  
 * 研究者名、キーワード、または研究者IDに対して、空白で分割した各トークンが含まれているかチェックします。
 * 専門分野については、チェックボックスで選択された fields のみでフィルタリングします。
 */
export async function searchResearchers(
  query: string,
  filters: SearchFilters
): Promise<ResearcherProfile[]> {
  const researchers = await getResearchers();
  const queryLower = query.toLowerCase();
  const tokens = queryLower.split(/\s+/).filter(token => token);

  return researchers.filter((researcher: ResearcherProfile) => {
    const nameLower = (researcher.name || '').toLowerCase();
    const keywordsLower = (researcher.keywords || '').toLowerCase();
    const idLower = String(researcher.id).toLowerCase();

    // 各トークンが「名前」「キーワード」「ID」に含まれているかチェック
    const matchesQuery =
      tokens.length === 0 ||
      tokens.every(token =>
        nameLower.includes(token) ||
        keywordsLower.includes(token) ||
        idLower.includes(token)
      );

    // チェックボックスで選択された専門分野でフィルタリング
    const matchesField =
      filters.fields.length === 0 ||
      filters.fields.includes(researcher.field);

    const matchesInstitution =
      !filters.institution ||
      (researcher.institution || '').toLowerCase().includes(filters.institution.toLowerCase());

    const matchesHIndex =
      !filters.minHIndex || (researcher.citation_metrics?.h_index ?? 0) >= filters.minHIndex;

    const matchesPatents =
      !filters.hasPatents || (researcher.patents && researcher.patents.count > 0);

    return (
      matchesQuery &&
      matchesField &&
      matchesInstitution &&
      matchesHIndex &&
      matchesPatents
    );
  });
}

/**
 * 研究者データからユニークな専門分野（field）の一覧を取得する関数
 */
export async function getFields(): Promise<string[]> {
  const { data, error } = await supabase.from('ishinomaki_1').select('field');
  if (error) {
    console.error('Error fetching fields:', error);
    return [];
  }
  const fields = data.map((item: any) => item.field);
  const uniqueFields = Array.from(new Set(fields));
  return uniqueFields;
}

/**
 * Supabase の ishinomaki_1 テーブルから所属機関のユニークな値を取得する関数
 */
export async function getInstitutions(): Promise<string[]> {
  const { data, error } = await supabase.from('ishinomaki_1').select('institution');
  if (error) {
    console.error('Error fetching institutions:', error);
    return [];
  }
  const institutions = data.map((item: any) => item.institution);
  const uniqueInstitutions = Array.from(new Set(institutions));
  return uniqueInstitutions;
}
