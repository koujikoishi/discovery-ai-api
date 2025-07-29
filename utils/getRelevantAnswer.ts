import dotenv from 'dotenv';
dotenv.config();

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
  getBillingTemplate, // ✅ 追加
} from './faqTemplate.js';

import { getRelatedQuestions } from './getRelatedQuestions.js';
import { templatePriorityIntents } from './templateIntents.js';
import { classifyIntentHybrid } from './classifyIntentHybrid.js';
import { fetchEmbedding, fetchChatCompletion } from './openaiFetch.js';
import getFallbackResponse from './getFallbackResponse.js';

import { Pinecone } from '@pinecone-database/pinecone';

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);

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
  const recentIntent = forcedIntent || (await classifyIntentHybrid(userMessage));
  console.log('🧪 intent:', recentIntent);
  console.log('🧪 テンプレ対象か:', templatePriorityIntents.includes(recentIntent));

  const relatedQuestions = getRelatedQuestions(recentIntent);

  // テンプレ対応
  if (templatePriorityIntents.includes(recentIntent)) {
    if (recentIntent === 'faq') {
      const faqTemplate = getFaqTemplate(userMessage);
      if (faqTemplate) {
        const [summary, ...rest] = faqTemplate.answer.split('\n').filter(Boolean);
        return {
          answer: faqTemplate.answer,
          summary,
          details: rest.join('\n'),
          relatedQuestions: faqTemplate.relatedQuestions ?? getRelatedQuestions(recentIntent),
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
      case 'billing': // ✅ 追加
        templateAnswer = getBillingTemplate().answer;
        break;
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
          templateAnswer = 'ご利用人数や目的に応じてプランを提案できますが、具体的な人数が取得できませんでした。\n「3人くらい」など、チームの人数をもう一度教えてください。';
        } else if (size <= 5 && match(keywords.starter)) {
          templateAnswer = getRecommendationStarterTemplate().answer;
        } else if (size <= 15 && match(keywords.pro)) {
          templateAnswer = getRecommendationGrowthTemplate().answer;
        } else if (size > 15 || match(keywords.enterprise)) {
          templateAnswer = getRecommendationEnterpriseTemplate().answer;
        } else if (size <= 5) {
          templateAnswer = getRecommendationStarterTemplate().answer;
        } else if (size <= 15) {
          templateAnswer = getRecommendationGrowthTemplate().answer;
        } else {
          templateAnswer = getRecommendationEnterpriseTemplate().answer;
        }

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
        relatedQuestions: getRelatedQuestions(recentIntent),
      };
    }
  }

  // 🔍 Pinecone ベクトル検索
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
      relatedQuestions: fallback.related.length > 0 ? fallback.related : getRelatedQuestions('faq'),
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

# これまでの会話履歴
${formattedHistory}

# FAQ文書データ（最大3件）
${contextText}

# ユーザーからの質問
${userMessage}`;

  const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userMessage },
  ];

  const reply = await fetchChatCompletion(messages, 0.2);
  const fullText = typeof reply === 'string' ? reply : JSON.stringify(reply);
  const [summary, ...rest] = fullText.split('\n').filter(l => l.trim() !== '');
  const details = rest.join('\n');

  return {
    answer: `${summary}\n\n${details}`,
    summary,
    details,
    relatedQuestions: getRelatedQuestions('faq'),
  };
}
