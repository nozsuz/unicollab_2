import { createClient } from '@supabase/supabase-js';
import { ResearcherProfile, SearchFilters } from '../types';

const supabaseUrl = 'https://nfvwqjkweewfdtowduqr.supabase.co';
const supabaseKey = 'YOUR_SUPABASE_KEY';
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
 * キーワードや各種フィルターを適用して研究者を検索する関数  
 * - 研究者名、キーワード、またはIDに対して、空白区切りの各トークンが含まれているかチェック  
 * - 専門分野はチェックボックスで選択された fields でフィルタリング
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
    const specializationLower = (researcher.specialization || '').toLowerCase();

    // 各トークンが名前、キーワード、またはIDに含まれているかチェック
    const matchesQuery =
      tokens.length === 0 ||
      tokens.every(token =>
        nameLower.includes(token) ||
        keywordsLower.includes(token) ||
        idLower.includes(token)
      );

    // 専門分野はチェックボックスで選択された値でフィルタリング
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
