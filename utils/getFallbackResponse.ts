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

  // 雑談系：ラーメン・カレー・ランチ
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

  // その他の曖昧な質問
  return {
    answer: `ちょっと意図を読み違えていたらごめんなさい 🙇  
もしAIやユーザー対応に関することであれば、Discovery AIがお力になれるかもしれません。

---

ご興味のある内容がありましたら、以下から選んでお知らせください 😊`,
    related: await getFallbackClarification(message),
  };
}
