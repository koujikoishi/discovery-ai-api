// utils/faqTemplates/cancelTemplate.ts

export function getCancelTemplate() {
  return {
    answer: `
**ご解約について**

Discovery AIでは、プランに応じた解約手続きが可能です。

---

🧾 **プラン別のご案内**
- **Starter / Pro プラン**：更新日前日までにご連絡ください
- **Enterprise プラン**：6ヶ月経過後、1ヶ月前までにご連絡いただければ解約可能です

---

💡 ご不明点やご相談がある場合は、いつでもお気軽にお問い合わせください。
    `.trim(),
    relatedQuestions: [
      "解約方法を教えてください",
      "解約後も使えますか？",
      "Enterpriseプランの解約ルールは？",
    ],
  };
}
