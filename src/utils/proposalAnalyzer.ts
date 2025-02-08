export interface ProposalAnalysis {
  overallScore: number;
  sections: {
    [key: string]: {
      score: number;
      strengths: string[];
      improvements: string[];
    };
  };
  recommendations: {
    priority: 'high' | 'medium' | 'low';
    section: string;
    suggestion: string;
    reason: string;
  }[];
}

export async function analyzeProposal(proposal: any): Promise<ProposalAnalysis> {
  // モックデータを返す
  return {
    overallScore: 85,
    sections: {
      title: {
        score: 90,
        strengths: ['研究の目的が明確に示されている', '簡潔で分かりやすい'],
        improvements: ['より具体的なキーワードを含めると良い']
      },
      summary: {
        score: 85,
        strengths: ['研究の重要性が適切に説明されている'],
        improvements: ['期待される成果をより具体的に記述する']
      }
    },
    recommendations: [
      {
        priority: 'high',
        section: 'approach',
        suggestion: '研究手法の具体性を高める',
        reason: '現在の記述は概略的で、具体的な研究手順が不明確'
      }
    ]
  };
}