import { createClient } from '@supabase/supabase-js';
import { ResearcherProfile, SearchFilters } from './types';  // 上記のインターフェイス定義

// Supabase クライアントの初期化
const supabaseUrl = 'https://nfvwqjkweewfdtowduqr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mdndxamt3ZWV3ZmR0b3dkdXFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4OTcyNzAsImV4cCI6MjA1MzQ3MzI3MH0.7FX4jSTUY4jJGEY6e8T-20ONBLInARvG-oYyCqxBL1g';  // 読み取り用の anon-key を使用
const supabase = createClient(supabaseUrl, supabaseKey);

// 研究者プロフィール一覧の取得（Supabase から取得）
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

// 研究者の検索（Supabase 側でフィルターする場合も可能ですが、ここではクライアント側でフィルタリング）
export async function searchResearchers(query: string, filters: SearchFilters): Promise<ResearcherProfile[]> {
  const researchers = await getResearchers();
  
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
