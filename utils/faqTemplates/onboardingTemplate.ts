// utils/faqTemplates/onboardingTemplate.ts

export function getOnboardingTemplate() {
  return {
    answer: `
**Discovery AI の導入ステップ**

導入はとてもシンプルです。最短即日でご利用開始いただけます。

---

🚀 **ステップ一覧**
1. お問い合わせ・初回ヒアリング
2. トライアルまたはプラン選定
3. 導入設計と初期設定サポート
4. 本番利用開始

---

💡 初回限定の無料トライアルは [こちら](https://ai.elife.co.jp/plan) からお申し込みいただけます（登録不要）  
💡 ご希望に応じてワークショップやカスタマイズ支援も対応可能です。
    `.trim(),
    relatedQuestions: [
      "導入は簡単ですか？",
      "無料トライアルはありますか？",
      "どのようなステップで導入しますか？",
    ],
  };
}
