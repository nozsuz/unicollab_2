import { v4 as uuidv4 } from 'uuid';

export interface ResearchProposal {
  id: string;
  title: string;
  field: string;
  summary: string;
  background: string;
  objective: string;
  approach: string;
  expected_outcome: string;
  collaboration: string;
  budget: string;
  period: string;
  status: 'draft' | 'published' | 'archived';
  images?: string[];
  created_at: string;
  updated_at: string;
}

const STORAGE_KEY = 'research_proposals';

// サンプルデータの作成
const sampleProposals: ResearchProposal[] = [
  {
    id: uuidv4(),
    title: "SIAH1/2を標的とした新規がん治療薬の開発",
    field: "medical",
    summary: "ユビキチンリガーゼSIAH1/2の阻害による新しいがん治療戦略の確立を目指す研究。低酸素環境下でのがん細胞の生存メカニズムに着目し、SIAH1/2の機能制御による治療薬開発を提案する。",
    background: "がん微小環境における低酸素状態は、がんの進行と治療抵抗性の主要な要因となっている。SIAH1/2は低酸素応答の重要な制御因子であり、その機能阻害は新しい治療戦略となる可能性がある。",
    objective: "SIAH1/2の選択的阻害剤の開発と、その抗がん効果の検証を通じて、新規がん治療薬の開発を目指す。特に、低酸素環境下でのがん細胞の生存メカニズムの解明と、治療抵抗性の克服を目的とする。",
    approach: "1. 計算科学的手法によるSIAH1/2阻害剤の設計\n2. 合成した化合物の活性評価系の確立\n3. 細胞・動物モデルでの薬効評価\n4. 作用機序の分子レベルでの解析",
    expected_outcome: "SIAH1/2の選択的阻害剤の同定と最適化を行い、前臨床試験段階の候補化合物の創出を目指す。また、SIAH1/2の新規基質の同定や、がん細胞での機能解析により、新たな治療標的の発見も期待される。",
    collaboration: "joint_research",
    budget: "10m_50m",
    period: "3y_5y",
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// 提案書一覧の取得
export function getProposals(): ResearchProposal[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    // サンプルデータを初期データとして保存
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleProposals));
    return sampleProposals;
  }
  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error parsing stored proposals:', error);
    return [];
  }
}

// 提案書の保存
export function saveProposal(proposal: Omit<ResearchProposal, 'id' | 'created_at' | 'updated_at' | 'status'>): ResearchProposal {
  const proposals = getProposals();
  const now = new Date().toISOString();
  
  const newProposal: ResearchProposal = {
    ...proposal,
    id: uuidv4(),
    status: 'draft',
    created_at: now,
    updated_at: now
  };

  proposals.unshift(newProposal);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(proposals));
  
  return newProposal;
}

// 提案書の更新
export function updateProposal(id: string, data: Partial<Omit<ResearchProposal, 'id' | 'created_at' | 'updated_at' | 'status'>>): ResearchProposal | null {
  const proposals = getProposals();
  const index = proposals.findIndex(p => p.id === id);
  
  if (index === -1) return null;
  
  // Only allow updating draft proposals
  if (proposals[index].status !== 'draft') {
    throw new Error('公開済みの提案書は編集できません');
  }
  
  const updatedProposal = {
    ...proposals[index],
    ...data,
    updated_at: new Date().toISOString()
  };
  
  proposals[index] = updatedProposal;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(proposals));
  
  return updatedProposal;
}

// 提案書の削除
export function deleteProposal(id: string): void {
  const proposals = getProposals();
  const filtered = proposals.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

// 提案書の公開状態を更新
export function updateProposalStatus(id: string, status: 'draft' | 'published' | 'archived'): ResearchProposal | null {
  const proposals = getProposals();
  const index = proposals.findIndex(p => p.id === id);
  
  if (index === -1) return null;
  
  const updatedProposal = {
    ...proposals[index],
    status,
    updated_at: new Date().toISOString()
  };
  
  proposals[index] = updatedProposal;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(proposals));
  
  return updatedProposal;
}