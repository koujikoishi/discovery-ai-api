import dotenv from "dotenv";
dotenv.config();

import { intentKeywords } from "./intentKeywords.js";

const systemPrompt = `
あなたは入力文の意図を8つのカテゴリから1つだけ選んで分類するAIです。

# カテゴリ一覧
- faq: よくある質問（例：「支払い方法は？」「ログインできない」）
- pricing: 料金に関する質問（例：「いくら？」「無料ですか？」など）
- onboarding: 初期導入や申込に関する質問（例：「始め方は？」「トライアルある？」など）
- recommendation: 提案を求める質問（例：「どれがいい？」「おすすめは？」など）
- cancel: 解約に関する質問（例：「キャンセルできますか？」など）
- function: 機能や特徴に関する質問（例：「何ができるの？」など）
- greeting: あいさつ（例：「こんにちは」「元気？」）
- smalltalk: 雑談・独り言（例：「眠い」「ラーメン食べたい」など）
- other: 上記に当てはまらない質問

# 出力形式
カテゴリ名のみを小文字で1語だけ返してください（例: "faq"）
`;

const greetingPattern = /^(こんにちは|こんばん[はわ]|おはよう|はじめまして|やあ|hi|hello|元気ですか)/i;

const smalltalkKeywords = [
  "疲れた", "しんどい", "つらい", "眠い", "ねむ", "ねみい", "だるい", "肩こり", "腰痛",
  "お腹すいた", "腹減った", "何食べよう", "ご飯食べたい", "ラーメン食べたい",
  "やる気出ない", "テンション上がらない", "モチベ下がった", "孤独", "さびしい", "寂しい",
  "天気", "雨", "晴れ", "曇り", "暑い", "寒い", "今日の気温",
  "暇", "退屈", "ぼーっとしてる", "今何時", "今日何曜日", "週末まだ？"
];

const nonBusinessPattern = /(ラーメン|焼肉|カレー|パンケーキ|居酒屋|映画|アニメ|ゲーム|観光|推し|スポーツ)/i;

export async function classifyIntent(userInput: string): Promise<string> {
  const lowerInput = userInput.toLowerCase().trim();

  // 特別パターンで即判定
  if (greetingPattern.test(userInput)) return "greeting";
  if (smalltalkKeywords.some((kw) => lowerInput.includes(kw))) return "smalltalk";
  if (nonBusinessPattern.test(userInput)) return "other";

  // 意図優先度順でintent分類（smalltalkを最優先に）
  const priorityOrder: string[] = [
    "smalltalk", "faq", "pricing", "onboarding",
    "recommendation", "cancel", "function",
    "support", "login", "security", "integration", "compliance",
    "overview", "industry", "difference", "billing"
  ];

  for (const intent of priorityOrder) {
    const keywords = intentKeywords[intent];
    if (keywords?.some((kw) => lowerInput.includes(kw))) {
      console.log(`🎯 intentキーワード分類: ${intent}`);
      return intent;
    }
  }

  // GPTによる補完（意図分類が特定できなかった場合）
  try {
    console.log("🧠 OpenAI intent補完実行...");

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userInput },
        ],
        temperature: 0,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ OpenAI APIエラー:", response.status, errorText);
      return "other";
    }

    const data = await response.json();
    const category = data.choices?.[0]?.message?.content?.trim().toLowerCase();
    console.log(`🧪 GPT応答: ${category}`);

    const validCategories = [
      "faq", "pricing", "onboarding", "recommendation",
      "cancel", "function", "greeting", "smalltalk", "other"
    ];

    return validCategories.includes(category) ? category : "other";
  } catch (err: any) {
    console.error("❌ fetch失敗:", err.message || err);
    return "other";
  }
}
