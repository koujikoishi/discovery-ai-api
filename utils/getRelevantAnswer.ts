// utils/getRelevantAnswer.ts

import {
  getPricingTemplate,
  getContractTemplate,
  getCancelTemplate,
  getOnboardingTemplate,
  getSupportTemplate,
  getFunctionTemplate,
  getIndustryTemplate,
  getRecommendationStarterTemplate,
  getRecommendationGrowthTemplate,
  getRecommendationEnterpriseTemplate,
  getFaqTemplate,
  getBillingTemplate,
  getOverviewTemplate, // ← ✅追加
} from './faqTemplate.js';

import { getRelatedQuestions } from './getRelatedQuestions.js';
import { templatePriorityIntents } from './templateIntents.js';
import { fetchEmbedding, fetchChatCompletion } from './openaiFetch.js';
import getFallbackResponse from './getFallbackResponse.js';
import { classifyIntent } from './classifyIntent.js';
import { Pinecone } from '@pinecone-database/pinecone';

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);

export function getRecommendationAnswer(teamSize: string, purpose: string) {
  const size = parseInt(teamSize);
  const purposeText = purpose.toLowerCase();

  const match = (list: string[]) => list.some((kw) => purposeText.includes(kw));
  const keywords = {
    starter: ['faq', 'ナレッジ', 'シンプル', '社内共有', '小規模'],
    pro: ['分析', 'voc', 'レポート', 'マーケ', '可視化', '部門', '活用'],
    enterprise: ['全社', '大規模', '複数部門', '拡張', '要件定義', '相談', '連携'],
  };

  if (isNaN(size)) {
    return getRecommendationStarterTemplate(); // fallback to safe default
  }

  if (size <= 5 && match(keywords.starter)) {
    return getRecommendationStarterTemplate();
  } else if (size <= 20 && match(keywords.pro)) {
    return getRecommendationGrowthTemplate();
  } else if (size >= 21 || match(keywords.enterprise)) {
    return getRecommendationEnterpriseTemplate();
  }

  if (size <= 5) return getRecommendationStarterTemplate();
  if (size <= 20) return getRecommendationGrowthTemplate();
  return getRecommendationEnterpriseTemplate();
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

  // 直近のintentを履歴から取得
  const recentIntent = history
    .filter((m) => m.role === 'system' && m.content.startsWith('intent:'))
    .map((m) => m.content.replace('intent:', '').trim())
    .pop() || '';

  const intent = await classifyIntent(userMessage); // ← 正しい
  const relatedQuestions = getRelatedQuestions(recentIntent);

  if (templatePriorityIntents.includes(recentIntent)) {
    if (recentIntent === 'faq') {
      const faqTemplate = getFaqTemplate(userMessage);
      if (faqTemplate) {
        const [summary, ...rest] = faqTemplate.answer.split('\n').filter(Boolean);
        return {
          answer: faqTemplate.answer,
          summary,
          details: rest.join('\n'),
          relatedQuestions: faqTemplate.relatedQuestions ?? relatedQuestions,
        };
      }
    }

    let templateAnswer: string | undefined;

    switch (recentIntent) {
      case 'pricing':
        templateAnswer = getPricingTemplate().answer;
        break;
      case 'contract':
        templateAnswer = getContractTemplate().answer;
        break;
      case 'cancel':
        templateAnswer = getCancelTemplate().answer;
        break;
      case 'onboarding':
        templateAnswer = getOnboardingTemplate().answer;
        break;
      case 'support':
        templateAnswer = getSupportTemplate().answer;
        break;
      case 'function':
        templateAnswer = getFunctionTemplate().answer;
        break;
      case 'industry':
        templateAnswer = getIndustryTemplate().answer;
        break;
      case 'billing':
        templateAnswer = getBillingTemplate().answer;
        break;
      case 'overview': // ← ✅追加ここから
        templateAnswer = getOverviewTemplate().answer;
        break;          // ← ✅追加ここまで
      case 'recommendation': {
        const team = history.find((h) => h.role === 'system' && h.content.startsWith('team:'))?.content.split(':')[1] || '';
        const purpose = history.find((h) => h.role === 'system' && h.content.startsWith('purpose:'))?.content.split(':')[1] || '';
        const result = getRecommendationAnswer(team, purpose);
        templateAnswer = result.answer;
        break;
      }
      default:
        templateAnswer = undefined;
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
  const queryResult = await index.query({
    vector: userEmbedding,
    topK: 3,
    includeMetadata: true,
  });

  const documents = (queryResult.matches ?? [])
    .map((m) => typeof m.metadata?.text === 'string' ? m.metadata.text : '')
    .filter(Boolean);

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
  const details = rest.join('\n');

  return {
    answer: `${summary}\n\n${details}`,
    summary,
    details,
    relatedQuestions,
  };
}
