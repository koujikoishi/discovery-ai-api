// utils/faqTemplates/recommendationTemplate.ts

function getStarterTemplate(): string {
  return `🧑‍💻 **小規模チームでまず試したい場合**  
→ **Starter プラン** がおすすめです。  
- ベーシック機能で試せる  
- 月額88,000円・トライアルあり  
- ブランド数が1〜3件に収まる方に最適`;
}

function getProTemplate(): string {
  return `📊 **マーケティング部門での活用・分析重視の場合**  
→ **Pro プラン** が適しています。  
- VOC分析やレポート機能を活用可能  
- ブランド数3〜5件向け  
- 複数メンバーでの利用にも対応`;
}

function getEnterpriseTemplate(): string {
  return `🏢 **複数部門・全社展開を想定している場合**  
→ **Enterprise プラン** をご提案します。  
- カスタマイズ・部門連携に対応  
- 詳細な導入相談が可能  
- お見積もり・要件定義サポートあり`;
}

const relatedQuestions = [
  "どのプランを選べばよいですか？",
  "おすすめプランは？",
  "どのプランが合っていますか？",
];

export function getRecommendationStarterTemplate() {
  return {
    answer: getStarterTemplate(),
    relatedQuestions,
  };
}

export function getRecommendationGrowthTemplate() {
  return {
    answer: getProTemplate(),
    relatedQuestions,
  };
}

export function getRecommendationEnterpriseTemplate() {
  return {
    answer: getEnterpriseTemplate(),
    relatedQuestions,
  };
}

export function getRecommendationTemplate(teamSize: number | null = null) {
  const num = typeof teamSize === 'number' ? teamSize : parseInt(`${teamSize}`);

  if (!isNaN(num)) {
    if (num <= 5) {
      return getRecommendationStarterTemplate();
    }
    if (num <= 15) {
      return getRecommendationGrowthTemplate();
    }
    return getRecommendationEnterpriseTemplate();
  }

  // 人数未指定・不明な場合は3プランまとめて提示
  return {
    answer: [
      `**ご利用目的に応じたおすすめプランの例をご紹介します。**`,
      ``,
      getStarterTemplate(),
      ``,
      getProTemplate(),
      ``,
      getEnterpriseTemplate(),
      ``,
      `💡 もし「チームの人数」や「利用目的」などを教えていただければ、さらに最適なプランをご案内できます。`,
    ].join('\n'),
    relatedQuestions,
  };
}
