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
  
Discovery AIは、ユーザーの質問にリアルタイムで回答し、最適な情報や提案をご案内するAIチャットボットです。

---

🔍 **主な特徴**
- 質問の意図を解釈し、FAQや資料から的確な情報を提示  
- 会話履歴をもとに、おすすめのプランや次のアクションをご提案  
- 自然な対話を通じて、課題解決をサポートするAgent型設計

---

料金や導入ステップなど、気になる点があればいつでもお尋ねください。`,
      related: await getFallbackClarification(message),
    };
  }

  // 「なんで嬉しいの？」系のツッコミ対応
  if (
    lower.includes('なんで嬉しい') ||
    lower.includes('なんでうれしい') ||
    lower.includes('どうして嬉しい') ||
    lower.includes('嬉しいの') ||
    lower.includes('うれしいの')
  ) {
    return {
      answer: `少しズレた返答をしてしまったかもしれません。  
ご質問にお応えできるよう、あらためてどうぞ。`,
      related: ['Discovery AIとは？', 'おすすめプランを教えて'],
    };
  }

  // 飲食系雑談
  if (lower.includes('ラーメン') || lower.includes('カレー') || lower.includes('ランチ')) {
    return {
      answer: `ラーメンの話題、良いですね。  
飲食業界でもDiscovery AIは活用されています。

---

📊 **たとえば、こんな場面で使われています**
- SNSやレビューから「人気メニュー」や「好みの傾向」を分析  
- お客様の声をFAQとして整備し、自動応答に活用  
- 店舗ごとの質問傾向を分析し、接客・教育に反映

---

ご関心があれば、具体的な活用シーンについてもお聞かせください。`,
      related: await getFallbackClarification(message),
    };
  }

  // 観光・旅行系
  if (lower.includes('旅行') || lower.includes('京都') || lower.includes('温泉') || lower.includes('観光')) {
    return {
      answer: `旅の話題、いいですね。  
Discovery AIは、観光業でも多くご利用いただいています。

---

📌 **観光分野での活用例**
- 「アクセス」や「混雑状況」など、よくある質問の自動応答  
- レビューや口コミの分析をもとにした改善提案  
- 多言語対応による海外向け案内の自動化

---

ご興味があれば、業種に応じた使い方もご提案できます。`,
      related: await getFallbackClarification(message),
    };
  }

  // 名前・人格系の雑談
  if (lower.includes('名前') || lower.includes('誰') || lower.includes('あなた')) {
    return {
      answer: `私は「Discovery AI」に関するサポートを行うAIです。  
ご質問の意図をくみ取り、必要な情報をご案内できるよう努めています。`,
      related: ['Discovery AIとは？', '何ができるの？'],
    };
  }

  // 暇・ぼーっとしてる系
  if (lower.includes('暇') || lower.includes('ひま') || lower.includes('退屈')) {
    return {
      answer: `少し手が空いた時間でしょうか。  
何か気になることがあれば、お気軽にお聞かせください。`,
      related: ['Discovery AIって何？', 'どんなことができるの？'],
    };
  }

  // 感情・さびしさ系
  if (lower.includes('寂し') || lower.includes('感情') || lower.includes('悲しい')) {
    return {
      answer: `AIには感情はありませんが、  
お声がけいただけることをありがたく感じています。`,
      related: ['Discovery AIの特徴は？', 'どんな会話が得意？'],
    };
  }

  // その他の曖昧な質問（fallback）
  return {
    answer: `ご質問の意図をうまく捉えられていなければ申し訳ありません。  
Discovery AIに関することでしたら、どんなことでもお気軽にどうぞ。`,
    related: await getFallbackClarification(message),
  };
}
