import { ResearchProposal } from './proposalStorage';

export interface MatchingResult {
  proposal: ResearchProposal;
  score: number;
  reasons: string[];
  potentialCollaborations: string[];
}

// 類似度を計算する関数
function calculateSimilarity(proposal1: ResearchProposal, proposal2: ResearchProposal): number {
  let score = 0;

  // 研究分野の類似性
  if (proposal1.field === proposal2.field) {
    score += 25;
  } else if (isRelatedField(proposal1.field, proposal2.field)) {
    score += 15;
  }

  // キーワードの一致度を計算
  const keywords1 = extractKeywords(proposal1);
  const keywords2 = extractKeywords(proposal2);
  const keywordScore = calculateKeywordSimilarity(keywords1, keywords2);
  score += keywordScore * 35;

  // 研究アプローチの類似度
  const approachScore = calculateTextSimilarity(proposal1.approach, proposal2.approach);
  score += approachScore * 25;

  // 研究目的の類似度
  const objectiveScore = calculateTextSimilarity(proposal1.objective, proposal2.objective);
  score += objectiveScore * 15;

  return Math.min(100, score);
}

// 関連分野かどうかを判定
function isRelatedField(field1: string, field2: string): boolean {
  const relatedFields: { [key: string]: string[] } = {
    'medical': ['chemistry', 'it'],
    'chemistry': ['medical', 'engineering'],
    'engineering': ['chemistry', 'it'],
    'it': ['engineering', 'medical']
  };

  return relatedFields[field1]?.includes(field2) || relatedFields[field2]?.includes(field1);
}

// テキストからキーワードを抽出
function extractKeywords(proposal: ResearchProposal): string[] {
  const text = `${proposal.title} ${proposal.summary} ${proposal.objective} ${proposal.expected_outcome}`.toLowerCase();
  return text.split(/[\s,、。．]+/)
    .filter(word => word.length > 1)
    .filter(word => !['する', 'これ', 'その', 'また', 'および', 'ため', 'よる', 'による', 'おける'].includes(word));
}

// キーワードの類似度を計算
function calculateKeywordSimilarity(keywords1: string[], keywords2: string[]): number {
  const set1 = new Set(keywords1);
  const set2 = new Set(keywords2);
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  return intersection.size / union.size;
}

// テキストの類似度を計算
function calculateTextSimilarity(text1: string, text2: string): number {
  const words1 = new Set(text1.toLowerCase().split(/[\s,、。．]+/));
  const words2 = new Set(text2.toLowerCase().split(/[\s,、。．]+/));
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  return intersection.size / union.size;
}

// マッチする理由を見つける
function findMatchingReasons(proposal1: ResearchProposal, proposal2: ResearchProposal): string[] {
  const reasons: string[] = [];

  // 研究分野の関連性
  if (proposal1.field === proposal2.field) {
    reasons.push('同じ研究分野で活動しています');
  } else if (isRelatedField(proposal1.field, proposal2.field)) {
    reasons.push('関連する研究分野で活動しています');
  }

  // キーワードの共通性
  const keywords1 = extractKeywords(proposal1);
  const keywords2 = extractKeywords(proposal2);
  const commonKeywords = keywords1.filter(k => keywords2.includes(k));
  
  if (commonKeywords.length > 0) {
    reasons.push(`共通のキーワード: ${commonKeywords.slice(0, 3).join(', ')}`);
  }

  // 研究アプローチの類似性
  const approachSimilarity = calculateTextSimilarity(proposal1.approach, proposal2.approach);
  if (approachSimilarity > 0.3) {
    reasons.push('研究アプローチに類似点があります');
  }

  // 期待される成果の関連性
  const outcomeSimilarity = calculateTextSimilarity(proposal1.expected_outcome, proposal2.expected_outcome);
  if (outcomeSimilarity > 0.3) {
    reasons.push('研究成果に関連性があります');
  }

  return reasons;
}

// 可能な共同研究テーマを提案
function suggestCollaborations(proposal1: ResearchProposal, proposal2: ResearchProposal): string[] {
  const collaborations: string[] = [];

  // 研究目的の組み合わせ
  collaborations.push(`${proposal1.title}と${proposal2.title}の統合研究`);

  // 手法の相互活用
  if (proposal1.approach !== proposal2.approach) {
    collaborations.push('相互の研究手法を組み合わせた新しいアプローチの開発');
  }

  // 分野横断的な提案
  if (proposal1.field !== proposal2.field && isRelatedField(proposal1.field, proposal2.field)) {
    collaborations.push('分野横断的な新規研究領域の開拓');
  }

  // 期待される成果の相乗効果
  collaborations.push('両研究の知見を活かした新規性の高い研究展開');

  return collaborations;
}

export async function findMatchingResearchers(
  proposal: ResearchProposal,
  convergenceFactor: number = 50
): Promise<MatchingResult[]> {
  try {
    const allProposals = JSON.parse(localStorage.getItem('research_proposals') || '[]');
    const otherProposals = allProposals.filter((p: ResearchProposal) => 
      p.id !== proposal.id && p.status === 'published'
    );

    // 各提案書との類似度を計算
    const matchingResults: MatchingResult[] = otherProposals.map((otherProposal: ResearchProposal) => {
      const score = calculateSimilarity(proposal, otherProposal);
      const reasons = findMatchingReasons(proposal, otherProposal);
      const potentialCollaborations = suggestCollaborations(proposal, otherProposal);

      return {
        proposal: otherProposal,
        score,
        reasons,
        potentialCollaborations
      };
    });

    // スコアの降順でソート
    return matchingResults
      .filter(result => result.score >= 50)
      .sort((a, b) => b.score - a.score);

  } catch (error) {
    console.error('Error in findMatchingResearchers:', error);
    return [];
  }
}