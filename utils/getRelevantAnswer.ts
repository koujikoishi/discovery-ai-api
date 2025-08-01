// getRelevantAnswer.ts（構造整理・ログ統一・意図テンプレ優先ロジック＋fallback）

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
} from './faqTemplate';

import { getRelatedQuestions } from './getRelatedQuestions.js';
import { templatePriorityIntents } from './templateIntents.js';
import { fetchEmbedding, fetchChatCompletion } from './openaiFetch.js';
import getFallbackResponse from './getFallbackResponse.js';
import { classifyIntent } from './classifyIntent.js';
import { Pinecone } from '@pinecone-database/pinecone';

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);

function getRecommendationAnswer(teamSize: string, purpose: string) {
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

function looseFaqMatch(userMessage: string): ReturnType<typeof getFaqTemplate> {
  const normalized = userMessage.toLowerCase().replace(/[？?]/g, '').replace(/。/g, '').replace(/\s+/g, '');
  const trialKeywords = ['トライアル', '無料で使える', 'お試し', '試せる', '体験版', '使ってみたい'];

  for (const kw of trialKeywords) {
    if (normalized.includes(kw.replace(/\s+/g, ''))) {
      console.log('🟢 looseFaqMatch: トライアル系キーワードにヒット:', kw);
      return getFreePlanTemplate();
    }
  }

  const candidates = [
    userMessage,
    userMessage.replace('Discovery AIは', ''),
    userMessage.replace('できますか', 'ですか'),
    userMessage.replace('無料で使えますか', '無料プランはありますか'),
    userMessage.replace('使えますか', 'ありますか'),
    userMessage.replace('無料で利用できますか', '無料プランはありますか'),
    userMessage.replace('トライアル', '無料プラン'),
  ];

  for (const msg of candidates) {
    const result = getFaqTemplate(msg.trim());
    if (result) {
      console.log('✅ looseFaqMatch: candidateでマッチ:', msg);
      return result;
    }
  }

  if (normalized.includes('無料')) {
    console.log('🟢 looseFaqMatch: normalized 無料 にマッチ');
    return getFreePlanTemplate();
  }
  if (normalized.includes('トライアル')) {
    console.log('🟢 looseFaqMatch: normalized トライアル にマッチ');
    return getFreePlanTemplate();
  }

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

  const intent = await classifyIntent(userMessage);
  const relatedQuestions = getRelatedQuestions(recentIntent);
  console.log('🧠 intent分類:', intent);

  const faqTemplate = looseFaqMatch(userMessage);
  if (faqTemplate) {
    const [summary, ...rest] = faqTemplate.answer.split('\n').filter(Boolean);
    return {
      answer: faqTemplate.answer,
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
        templateAnswer = getRecommendationAnswer(team, purpose).answer;
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

  const systemPrompt = `あなたはFAQチャットボットです。以下の制約条件に従って、FAQ文書の情報をもとにユーザーの質問に答えてください。\n\n# 制約条件\n- **最初の1文で要点を断定的に述べてください（summary）**\n- **その後に改行して箇条書きで詳しく補足してください（details）**\n- 曖昧な表現（例：「かもしれません」「可能性があります」）は避けてください\n- Markdown形式で可読性を高めてください\n\n# これまでの会話履歴\n${formattedHistory}\n\n# FAQ文書データ（最大3件）\n${contextText}\n\n# ユーザーからの質問\n${userMessage}`;

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
