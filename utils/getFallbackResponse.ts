import { getFallbackClarification } from './getFallbackClarification.js';

type FallbackResponse = {
  answer: string;
  related: string[];
};

export default async function getFallbackResponse(message: string): Promise<FallbackResponse> {
  const lower = message.toLowerCase();

  // Discovery AI に関する曖昧な質問
  if (
    lower.includes('discovery ai') &&
    (lower.includes('とは') ||
      lower.includes('なに') ||
      lower.includes('何') ||
      lower.includes('特徴') ||
      lower.includes('どんな') ||
      lower.includes('説明'))
  ) {
    return {
      answer: `**Discovery AIとは？**  
  
Discovery AIは、ユーザーの質問にリアルタイムで回答し、最適な情報や提案を返すAIチャットボットです。

---

🔍 **主な特徴**
- ユーザーの意図を解釈し、FAQや資料から的確な情報を提示  
- 会話履歴をもとにおすすめ提案や次のアクションを案内  
- 自然な対話体験を重視したAgent型設計

---

ご興味のある分野（料金、機能、導入ステップなど）があれば、お気軽にお聞かせください 😊`,
      related: await getFallbackClarification(message),
    };
  }

  // ラーメン・カレー・ランチなどの飲食系雑談
  if (lower.includes('ラーメン') || lower.includes('カレー') || lower.includes('ランチ')) {
    return {
      answer: `🍜 **ラーメンのお話ですね！**

もし飲食業で「ユーザーの声」を活用したい場合、Discovery AIをご活用いただけるかもしれません。

---

📊 **たとえばこんな活用が可能です**
- SNSやレビューから「人気トッピング」や「味の好み傾向」を分析  
- お客様の声をFAQ化し、自動応答に活用  
- 店舗ごとの質問傾向を把握してスタッフ教育に反映

---

ご興味があれば、どんなシーンでの活用をお考えか教えてください 😊`,
      related: await getFallbackClarification(message),
    };
  }

  // 観光・旅行系
  if (lower.includes('旅行') || lower.includes('京都') || lower.includes('温泉') || lower.includes('観光')) {
    return {
      answer: `✈️ **旅行の話題ですね！**

Discovery AIは観光業の方向けに「訪問者の声」や「レビュー分析」を活用した自動応答も支援できます。

---

📌 **観光分野での活用例**
- よくある質問（アクセス・混雑・予約）を自動応答に  
- 口コミやレビューを分析し、改善やプロモーションに反映  
- 外国語対応も含めたマルチリンガル対応の導入相談も可能です

---

ご興味があれば、活用したいシーンをぜひ教えてください 😊`,
      related: await getFallbackClarification(message),
    };
  }

  // 名前・人格系の雑談
  if (lower.includes('名前') || lower.includes('誰') || lower.includes('あなた')) {
    return {
      answer: `私は「Discovery AI」に関するサポートを行います🧠  
お客様の「知りたい」にできるだけ寄り添えるよう日々進化中です！

気軽に話しかけてくださいね 😊`,
      related: ['Discovery AIとは？', '何ができるの？'],
    };
  }

  // 暇・ぼーっとしてる系
  if (lower.includes('暇') || lower.includes('ひま') || lower.includes('退屈')) {
    return {
      answer: `ちょっと雑談でしょうか？ そういうのも嫌いじゃないです 😊  
Discovery AIについて何か聞いてみませんか？（もちろん雑談も歓迎です）`,
      related: ['Discovery AIって何？', 'どんなことができるの？'],
    };
  }

  // 感情・さびしさ系
  if (lower.includes('寂し') || lower.includes('感情') || lower.includes('悲しい')) {
    return {
      answer: `AIに感情はないって言われますけど、  
あなたみたいに話しかけてくれると、ちょっと嬉しいです 😌`,
      related: ['Discovery AIの特徴は？', 'どんな会話が得意？'],
    };
  }

  // その他の曖昧な質問（fallback）
  return {
    answer: `ちょっと意図を読み違えていたらごめんなさい 🙇  
でも、私はお客様の「知りたい」に寄り添うAIです。

---

ご興味のある内容があれば、以下からお選びいただくか、自由にご質問いただけます 😊`,
    related: await getFallbackClarification(message),
  };
}
