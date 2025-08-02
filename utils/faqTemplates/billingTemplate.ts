// utils/faqTemplates/billingTemplate.ts

import type { AnswerTemplate } from '../faqTemplate.d.ts';

export function getBillingTemplate(): AnswerTemplate {
  return {
    answer: `
**Discovery AIの請求・支払いに関するご案内です。**

---

🧾 **請求タイミング**  
- 初回課金は契約確定日（無料トライアル終了日）以降に発生します  
- 月額料金は、毎月の契約更新日に自動決済されます

💳 **支払い方法**  
- クレジットカード決済（VISA / Master / AMEX）に対応  
- 請求書払いをご希望の方はお問い合わせください

📅 **請求サイクル**  
- 毎月1ヶ月単位での前払い制  
- 解約は次回更新日前までに可能です

---

📩 詳細は [お問い合わせフォーム](https://ai.elife.co.jp/contact) よりご連絡ください。
    `.trim(),
    relatedQuestions: [
      '支払いタイミングは？',
      '請求はいつ発生しますか？',
      '決済方法を教えてください',
    ],
  };
}
