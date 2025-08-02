// getRelevantAnswer.ts（v13：recommendation出し分け組み込み＋Discovery AIの位置づけ明示）

import {
  getPricingTemplate,
  getContractTemplate,
  getCancelTemplate,
  getOnboardingTemplate,
  getFunctionTemplate,
  getIndustryTemplate,
  getRecommendationStarterTemplate,
  getRecommendationGrowthTemplate,
  getRecommendationEnterpriseTemplate,
  getFaqTemplate,
  getBillingTemplate,
  getOverviewTemplate,
  getFreePlanTemplate,
} from './faqTemplate.js';

import { getRelatedQuestions } from './getRelatedQuestions.js';
import { templatePriorityIntents } from './templateIntents.js';
import { fetchEmbedding, fetchChatCompletion } from './openaiFetch.js';
import getFallbackResponse from './getFallbackResponse.js';
import { classifyIntent } from './classifyIntent.js';
import { Pinecone } from '@pinecone-database/pinecone';

// 🔧 recommendationテンプレート出し分けロジック
function getRecommendationAnswer(userMessage: string, teamSize: string, purpose: string) {
  const lower = userMessage.toLowerCase();
  const matchIntro = ['はじめて', '初めて', '導入', '検討', '使い方', 'どうやって', '何から', '手順'];
  const isIntro = matchIntro.some((kw) => lower.includes(kw));
  if (isIntro) return getOnboardingTemplate();

  const size = parseInt(teamSize);
  const match = (list: string[]) => list.some((kw) => purpose.includes(kw));
  const keywords = {
    starter: ['faq', 'ナレッジ', 'シンプル', '社内共有', '小規模', '確認', '記録'],
    growth: ['分析', 'レポート', 'マーケ', '共有', '活用', 'チーム', 'ボード', '支援', '報告'],
    enterprise: ['大規模', '複数部門', '全社', '連携', '要件定義', '管理', '全体', '拡張'],
  };

  if (isNaN(size)) return getRecommendationStarterTemplate();
  if (size <= 5 && match(keywords.starter)) return getRecommendationStarterTemplate();
  if (size <= 20 && match(keywords.growth)) return getRecommendationGrowthTemplate();
  if (size >= 21 || match(keywords.enterprise)) return getRecommendationEnterpriseTemplate();
  if (size <= 5) return getRecommendationStarterTemplate();
  if (size <= 20) return getRecommendationGrowthTemplate();
  return getRecommendationEnterpriseTemplate();
}

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);

const prefixMap: Record<string, string> = {
  '無料で使えますか？': '無料でのご利用に関するご質問ですね。',
  '無料プランはありますか？': '無料プランの有無についてご案内いたします。',
  'トライアルはありますか？': 'トライアル提供についての情報です。',
};

function looseFaqMatch(userMessage: string): { answer: string; relatedQuestions: string[]; matchedQuestion?: string } | null {
  const normalized = userMessage.toLowerCase().replace(/[？?]/g, '').replace(/。/g, '').replace(/\s+/g, '');

  const trialKeywords = ['トライアル', '無料', 'お試し', '体験', '試せる', '使ってみたい'];
  const isTrialQuestion = trialKeywords.some((kw) => normalized.includes(kw));

  // 念のため "サポート" や "分析" などFAQ全般の他意図キーワードが含まれる場合はマッチしない
  const nonTrialContextKeywords = ['サポート', '分析', 'レポート', '機能', '契約', '支払い'];
  const hasNonTrialContext = nonTrialContextKeywords.some((kw) => normalized.includes(kw));

  if (isTrialQuestion) {
    return {
      ...getFreePlanTemplate(),
      matchedQuestion: '無料で使えますか？',
    };
  }

  const exactMatchCandidates = ['無料で使えますか？', '無料プランはありますか？', 'トライアルはありますか？'];
  for (const msg of exactMatchCandidates) {
    if (userMessage.trim() === msg) {
      const result = getFaqTemplate(msg);
      if (result) {
        return {
          ...result,
          matchedQuestion: msg,
        };
      }
    }
  }

  const ignoredKeywords = ['契約', '料金', '費用', '価格', '支払い', 'プラン'];
  const isIgnored = ignoredKeywords.some((kw) => normalized.includes(kw));
  if (isIgnored) return null;

  return null;
}

export async function getRelevantAnswer(
  userMessage: string,
  history: { role: 'system' | 'user' | 'assistant'; content: string }[] = [],
  forcedIntent?: string
): Promise<{
  answer: string;
  summary: string;
  details: string;
  relatedQuestions: string[];
}> {
  console.log('\n🔎 getRelevantAnswer(): 開始');
  console.log('📨 userMessage:', userMessage);

  const recentIntent =
    history.filter((m) => m.role === 'system' && m.content.startsWith('intent:'))
      .map((m) => m.content.replace('intent:', '').trim())
      .pop() || '';

  const intent = forcedIntent || await classifyIntent(userMessage);
  const relatedQuestions = getRelatedQuestions(recentIntent);
  console.log('🧠 intent分類:', intent);

  const faqTemplate = looseFaqMatch(userMessage);
  if (faqTemplate) {
    const prefix = prefixMap[faqTemplate.matchedQuestion ?? ''] || '';
    const answerWithPrefix = prefix ? `${prefix}\n\n${faqTemplate.answer}` : faqTemplate.answer;
    const [summary, ...rest] = answerWithPrefix.split('\n').filter(Boolean);
    return {
      answer: answerWithPrefix,
      summary,
      details: rest.join('\n'),
      relatedQuestions: faqTemplate.relatedQuestions ?? relatedQuestions,
    };
  }

  if (templatePriorityIntents.includes(recentIntent)) {
    let templateAnswer: string | undefined;
    switch (recentIntent) {
      case 'pricing': templateAnswer = getPricingTemplate().answer; break;
      case 'contract': templateAnswer = getContractTemplate().answer; break;
      case 'cancel': templateAnswer = getCancelTemplate().answer; break;
      case 'onboarding': templateAnswer = getOnboardingTemplate().answer; break;
      case 'function': templateAnswer = getFunctionTemplate().answer; break;
      case 'industry': templateAnswer = getIndustryTemplate().answer; break;
      case 'billing': templateAnswer = getBillingTemplate().answer; break;
      case 'overview': templateAnswer = getOverviewTemplate().answer; break;
      case 'recommendation': {
        const team = history.find((h) => h.role === 'system' && h.content.startsWith('team:'))?.content.split(':')[1] || '';
        const purpose = history.find((h) => h.role === 'system' && h.content.startsWith('purpose:'))?.content.split(':')[1] || '';
        templateAnswer = getRecommendationAnswer(userMessage, team, purpose).answer;
        break;
      }
    }
    if (templateAnswer) {
      const [summary, ...rest] = templateAnswer.split('\n').filter(Boolean);
      return {
        answer: templateAnswer,
        summary,
        details: rest.join('\n'),
        relatedQuestions,
      };
    }
  }

  const userEmbedding = await fetchEmbedding(userMessage);
  const queryResult = await index.query({ vector: userEmbedding, topK: 3, includeMetadata: true });
  const documents = (queryResult.matches ?? [])
    .map((m) => typeof m.metadata?.text === 'string' ? m.metadata.text : '')
    .filter(Boolean);
  console.log('📚 類似文書数:', documents.length);

  if (documents.length === 0) {
    const fallback = await getFallbackResponse(userMessage);
    const [summary, ...rest] = fallback.answer.split('\n').filter(Boolean);
    return {
      answer: fallback.answer,
      summary,
      details: rest.join('\n'),
      relatedQuestions: fallback.related.length > 0 ? fallback.related : relatedQuestions,
    };
  }

  const contextText = documents.map((doc, i) => `【文書${i + 1}】\n${doc}`).join('\n\n');
  const formattedHistory = history
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => `【${m.role === 'user' ? 'ユーザー' : 'アシスタント'}】${m.content}`)
    .join('\n');

  const systemPrompt = `あなたはFAQチャットボットです。以下の制約条件に従って、FAQ文書の情報をもとにユーザーの質問に答えてください。

# 制約条件
- **最初の1文で要点を断定的に述べてください（summary）**
- **その後に改行して箇条書きで詳しく補足してください（details）**
- 曖昧な表現（例：「かもしれません」「可能性があります」）は避けてください
- Markdown形式で可読性を高めてください
- Discovery AIは「AIチャットボットサービス」ではなく「マーケティングAIツール（SaaS）」です
- Discovery AIは、マーケティング業務全体を支援するツールであり、チャットボット機能はその一部です

# これまでの会話履歴
${formattedHistory}

# FAQ文書データ（最大3件）
${contextText}

# ユーザーからの質問
${userMessage}`;

  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userMessage },
  ];

  const reply = await fetchChatCompletion(messages, 0.2);
  const fullText = typeof reply === 'string' ? reply : JSON.stringify(reply);
  const [summary, ...rest] = fullText.split('\n').filter((l) => l.trim() !== '');

  return {
    answer: `${summary}\n\n${rest.join('\n')}`,
    summary,
    details: rest.join('\n'),
    relatedQuestions,
  };
}
