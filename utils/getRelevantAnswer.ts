import {
  getCancelTemplate,
  getContractTemplate,
  getFunctionTemplate,
  getLayoutTestTemplate,
  getOnboardingTemplate,
  getPricingTemplate,
  getRecommendationStarterTemplate,
  getRecommendationGrowthTemplate,
  getRecommendationEnterpriseTemplate,
  getSupportTemplate,
  getIndustryTemplate,
  getFaqTemplate, // ← 追加
} from './faqTemplate.js';

import { fetchChatCompletion, fetchEmbedding } from './openaiFetch.js';
import { intentKeywords } from './intentKeywords.js';
import { templatePriorityIntents } from './templateIntents.js';
import getFallbackResponse from './getFallbackResponse.js';
import { index } from './pineconeClient.js';
import { classifyIntentHybrid } from './classifyIntentHybrid.js'; // ← 意図文脈追加


function switchIntentByMessage(input: string): string {
  const lower = input.toLowerCase();
  for (const [intent, keywords] of Object.entries(intentKeywords)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        console.log(`🧪 マッチしたキーワード: "${kw}" → intent: ${intent}`);
        return intent;
      }
    }
  }
  return 'faq';
}

const relatedQuestionsMap: Record<string, string[]> = {
  pricing: ["各プランの違いは？", "契約期間は？", "料金は月額ですか？"],
  cancel: ["解約の手続き方法は？", "解約後も使えますか？", "解約締切日は？"],
  onboarding: ["導入手順は？", "初期設定の流れは？", "サポート体制は？"],
  recommendation: ["どのプランがおすすめ？", "複数人で使えますか？", "予算内で最適なプランは？"],
  contract: ["契約期間は？", "自動更新されますか？", "最低契約期間はありますか？"],
  support: ["サポート体制は？", "問い合わせ方法は？", "どんな対応をしてくれる？"],
  function: ["できることは？", "主な機能は？", "どこまで対応できますか？"],
  industry: ["どんな業種で使われていますか？", "導入事例を教えてください", "BtoBサービスでも使えますか？", "教育業界での活用例はありますか？"],
  faq: ["使い方を教えて", "対応ブラウザは？", "問い合わせ先は？"],
};

export async function getRelevantAnswer(
  userMessage: string,
  history: { role: "system" | "user" | "assistant"; content: string }[] = [],
  forcedIntent?: string
): Promise<{ answer: string; relatedQuestions: string[] }> {

  // 変更前
  //const recentIntent = forcedIntent || switchIntentByMessage(userMessage);

  // 変更後（classifyIntentHybrid導入例）
  const recentIntent = forcedIntent || await classifyIntentHybrid(userMessage);

  console.log('🧪 現在のintent:', recentIntent);
  console.log('🧪 テンプレ対象か？:', templatePriorityIntents.includes(recentIntent));

  const relatedQuestions = relatedQuestionsMap[recentIntent] || relatedQuestionsMap['faq'];

  // テンプレ優先処理
  if (templatePriorityIntents.includes(recentIntent)) {
    if (recentIntent === 'faq') {
      const faqTemplate = getFaqTemplate(userMessage);
      if (faqTemplate) {
        return {
          answer: faqTemplate.answer,
          relatedQuestions: faqTemplate.relatedQuestions.length > 0 ? faqTemplate.relatedQuestions : relatedQuestions,
        };
      }
    }

    switch (recentIntent) {
      case 'pricing': return { answer: getPricingTemplate().answer, relatedQuestions };
      case 'contract': return { answer: getContractTemplate().answer, relatedQuestions };
      case 'cancel': return { answer: getCancelTemplate().answer, relatedQuestions };
      case 'onboarding': return { answer: getOnboardingTemplate().answer, relatedQuestions };
      case 'support': return { answer: getSupportTemplate().answer, relatedQuestions };
      case 'function': return { answer: getFunctionTemplate().answer, relatedQuestions };
      case 'industry': return { answer: getIndustryTemplate().answer, relatedQuestions };
      case 'recommendation': {
        const latestUserMsg = history.filter(h => h.role === 'user').slice(-3).map(h => h.content).join(' ');
        const purposeMsg = history.filter(h => h.role === 'user').slice(-6).map(h => h.content).join(' ');
        const numMatch = latestUserMsg.match(/(\d{1,3})人/);
        const team = numMatch ? numMatch[1] : '';
        const purposeText = purposeMsg.toLowerCase();

        const keywords = {
          starter: ['faq', 'ナレッジ', 'シンプル', '社内共有', '小規模'],
          pro: ['分析', 'voc', 'レポート', 'マーケ', '可視化', '部門'],
          enterprise: ['全社', '大規模', '複数部門', '拡張', '要件定義', '相談'],
        };
        const match = (list: string[]) => list.some(kw => purposeText.includes(kw));
        const size = parseInt(team);

        if (isNaN(size)) {
          return {
            answer: "ご利用人数や目的に応じてプランを提案できますが、具体的な人数が取得できませんでした。\n「3人くらい」など、チームの人数をもう一度教えてください。",
            relatedQuestions,
          };
        }

        if (size <= 5 && match(keywords.starter)) return getRecommendationStarterTemplate();
        if (size <= 15 && match(keywords.pro)) return getRecommendationGrowthTemplate();
        if (size > 15 || match(keywords.enterprise)) return getRecommendationEnterpriseTemplate();
        if (size <= 5) return getRecommendationStarterTemplate();
        if (size <= 15) return getRecommendationGrowthTemplate();
        return getRecommendationEnterpriseTemplate();
      }
    }
  }

  // Pineconeベクトル検索
  const userEmbedding = await fetchEmbedding(userMessage);
  const queryResult = await index.query({
    vector: userEmbedding,
    topK: 3,
    includeMetadata: true,
  });

// ここに検索結果をログ出力するコードを追加
  console.log('📝 ベクトル検索結果（上位3件）');
  queryResult.matches?.forEach((match, i) => {
if (typeof match.score === 'number') {
  console.log(`  [${i + 1}] 類似度: ${match.score.toFixed(4)}`);
  } else {
  console.log(`  [${i + 1}] 類似度: N/A`);
  }    
  const rawText = match.metadata?.text;
  const text = typeof rawText === 'string' ? rawText : '';
  console.log(`       テキスト（先頭100文字）: ${text.slice(0, 100).replace(/\n/g, ' ')}`);
  });

  const documents: string[] = (queryResult.matches ?? [])
  .map(m => {
    const t = m.metadata?.text;
    return typeof t === 'string' ? t : '';
  })
  .filter(t => t.length > 0);

  if (documents.length === 0) {
    const fallback = await getFallbackResponse(userMessage);
    return {
      answer: fallback.answer,
      relatedQuestions: fallback.related.length > 0 ? fallback.related : relatedQuestionsMap['faq'],
    };
  }

  const contextText = documents.map((doc, i) => `【文書${i + 1}】\n${doc}`).join('\n\n');

  const formattedHistory = history
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => `【${m.role === 'user' ? 'ユーザー' : 'アシスタント'}】${m.content}`)
    .join('\n');

  const introLineMap: Record<string, string> = {
    faq: '以下の内容に基づいてご案内いたします。',
    pricing: '料金に関するご質問ですね。以下をご確認ください。',
    onboarding: 'ご利用開始に関するご案内です。',
    cancel: 'ご解約について、以下をご参照ください。',
    contract: '契約期間についてのご案内です。',
    recommendation: 'ご希望に応じたおすすめのプランをご案内します。',
    support: 'お問い合わせやサポート体制についてのご案内です。',
    function: '機能面についてのご説明です。',
    industry: '業種別の導入実績や活用事例についてのご案内です。',
    greeting: 'ご質問ありがとうございます。よくある質問はこちらです：',
    other: '関連しそうな情報をもとにお答えします。',
  };

  const introLine = introLineMap[recentIntent] || introLineMap['faq'];

  const systemPrompt = `あなたはFAQチャットボットです。以下の制約条件に従って、FAQ文書の情報をもとにユーザーの質問に答えてください。

# 制約条件
- 回答はまず一文で要点を断定的に述べてください（例：「〜です」「〜できます」）
- その後に箇条書きで詳しい内容を補足してください（必要があれば）
- 曖昧な表現（例：「かもしれません」「推奨します」「可能性があります」）は避けてください
- 文書に明記されている事実は、遠慮せずはっきりと伝えてください
- **特に「無料で使えるか」に関する情報が文書にあれば、最優先で明記してください**
- Markdown形式で可読性を高めてください（例：改行、強調など）
- 回答が複数文書にまたがる場合は、自然に統合してください
- 回答が見つからない場合は「わかりません」とは言わず、質問の意図を尋ね返してください

# 回答トーン
${introLine}

# これまでの会話履歴
${formattedHistory}

# FAQ文書データ（最大3件）
${contextText}

# ユーザーからの質問
${userMessage}`;

  const messages: { role: "system" | "user"; content: string }[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userMessage },
  ];

  const reply = await fetchChatCompletion(messages, 0.2);

  return {
    answer: typeof reply === 'string' ? reply : JSON.stringify(reply),
    relatedQuestions: relatedQuestions.length > 0 ? relatedQuestions : relatedQuestionsMap['faq'],
  };
}
