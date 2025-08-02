// utils/faqTemplates/onboardingTemplate.ts

import type { AnswerTemplate } from '../faqTemplate.d.ts';

export function getOnboardingTemplate(): AnswerTemplate {
  return {
    answer: `
**Discovery AI の導入はとても簡単です。**

---

🟢 **導入ステップ（最短1週間）**  
1. サイト経由でお申し込み  
2. 初期設定（各種SNSデータ等の登録）    
3. 本番公開・利用開始  

---

🔧 必要に応じて設定サポートも承っています。  
📩 詳しくは [お問い合わせ](https://ai.elife.co.jp/contact) よりご相談ください。
    `.trim(),
    relatedQuestions: [
      '導入までの流れは？',
      'はじめ方を教えてください',
      '導入は簡単ですか？',
    ],
  };
}
