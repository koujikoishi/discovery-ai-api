import dotenv from "dotenv";
dotenv.config();

import { intentKeywords } from "./intentKeywords.js";

const systemPrompt = `
あなたは入力文の意図を8つのカテゴリから1つだけ選んで分類するAIです。

# カテゴリ一覧
- faq: よくある質問（例：「支払い方法は？」「ログインできない」）
- pricing: 料金に関する質問（例：「いくら？」「無料ですか？」「0円ですか？」「無料で使えるの？」「値段教えて」など）
- onboarding: 初期導入や申込に関する質問（例：「どうやって始めるの？」「トライアルはあるの？」「申し込み方法教えて」など）
- recommendation: 提案や適合性を尋ねる質問（例：「おすすめは？」「どのプランが合う？」「うちに合うやつは？」など）
- cancel: 解約・キャンセルに関する質問（例：「キャンセルできますか？」「解約方法は？」など）
- function: 特徴や機能に関する質問（例：「どんな機能がありますか？」「何ができますか？」「特徴は？」「どこまで対応してますか？」など）
- greeting: あいさつ（例：「こんにちは」「元気ですか？」）
- smalltalk: 雑談・独り言（例：「お腹すいた」「眠い」「疲れた」）
- other: 上記以外の質問

# 出力形式
カテゴリ名のみを小文字で1語だけ返してください（例:"faq"）。
`;

const greetingPattern = /^(こんにちは|こんばん[はわ]|おはよう|はじめまして|やあ|hi|hello|元気ですか)/i;

const smalltalkKeywords = [
  "疲れた", "しんどい", "つらい", "眠い", "眠たい", "ねむ", "ねみい", "だるい", "肩こり", "腰痛",
  "お腹すいた", "お腹空いた", "腹減った", "何食べよう", "ご飯食べたい", "ラーメン食べたい",
  "やる気出ない", "やる気ない", "テンション上がらない", "気分がのらない", "モチベ下がった",
  "孤独", "さびしい", "寂しい", "メンタルやられた",
  "天気", "雨", "晴れ", "曇り", "暑い", "寒い", "寒すぎ", "暑すぎ", "今日の気温",
  "暇", "退屈", "ぼーっとしてる", "今何時", "今日何曜日", "週末まだ？"
];

const nonBusinessPattern = /(ラーメン|焼肉|カレー|うどん|パンケーキ|居酒屋|旅行|観光|映画|アニメ|ゲーム|アーティスト|スポーツ|推し|天気|今日の気温)/i;

export async function classifyIntent(userInput: string): Promise<string> {
  const lowerInput = userInput.toLowerCase().trim();

  // 挨拶・雑談・非ビジネス判定
  if (greetingPattern.test(userInput)) return "greeting";
  if (smalltalkKeywords.some((kw) => lowerInput.includes(kw))) return "smalltalk";
  if (nonBusinessPattern.test(userInput)) return "other";

  // intentKeywordsによるローカルマッチ
  for (const [intent, keywords] of Object.entries(intentKeywords)) {
    if (keywords.some((kw) => lowerInput.includes(kw))) {
      console.log(`✅ ローカルintentマッチ: ${intent}`);
      return intent;
    }
  }

  // OpenAI API による分類
  try {
    console.log("🧠 fetchでintent分類を呼び出し中...");

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
    console.log("🧪 OpenAI応答:", data);

    const category = data.choices?.[0]?.message?.content?.trim().toLowerCase();
    const validCategories = [
      "faq", "pricing", "onboarding", "recommendation",
      "cancel", "function", "greeting", "smalltalk", "other"
    ];

    return validCategories.includes(category) ? category : "other";

  } catch (err: any) {
    console.error("❌ fetch呼び出し失敗:", err.message || err);
    return "other";
  }
}
