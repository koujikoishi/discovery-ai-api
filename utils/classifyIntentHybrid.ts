import { fetchEmbedding, fetchChatCompletion } from './openaiFetch.js';
import { index } from './pineconeClient.js';
import { intentKeywords } from './intentKeywords.js';

function switchIntentByKeyword(input: string): string | null {
  const lower = input.toLowerCase();
  for (const [intent, keywords] of Object.entries(intentKeywords)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) return intent;
    }
  }
  return null;
}

async function classifyIntentByVector(userMessage: string): Promise<string | null> {
  const embedding = await fetchEmbedding(userMessage);
  const result = await index.query({
    vector: embedding,
    topK: 1,
    includeMetadata: true,
  });
  if (result.matches && result.matches.length > 0) {
    const topMatch = result.matches[0];
    const intent = topMatch.metadata?.intent;
    if (typeof intent === 'string' && topMatch.score && topMatch.score > 0.75) {
      return intent;
    }
  }
  return null;
}

async function classifyIntentByGPT(userMessage: string): Promise<string> {
  const prompt = `
以下の選択肢から最も適切な質問の意図を1つだけ選んでください。選択肢: pricing, contract, cancel, onboarding, recommendation, support, function, industry, faq

質問: "${userMessage}"
意図:`;

  const messages: { role: "system" | "user"; content: string }[] = [
    { role: 'system', content: 'あなたは質問の意図を分類するAIです。' },
    { role: 'user', content: prompt },
  ];

  const response = await fetchChatCompletion(messages, 0);
  return response.trim().toLowerCase();
}

export async function classifyIntentHybrid(userMessage: string): Promise<string> {
  // 1. キーワード判定
  const keywordIntent = switchIntentByKeyword(userMessage);
  if (keywordIntent) return keywordIntent;

  // 2. ベクトル検索判定
  const vectorIntent = await classifyIntentByVector(userMessage);
  if (vectorIntent) return vectorIntent;

  // 3. GPT判定（フォールバック）
  return await classifyIntentByGPT(userMessage);
}
