// utils/faqTemplates/contractTemplate.ts

export function getContractTemplate() {
  return {
    answer: `
**ご契約内容について**

Discovery AIでは、ご利用プランごとに契約期間や更新条件が異なります。

---

📄 **Starter / Pro プラン**
- 契約期間：1ヶ月ごとの自動更新
- 最低契約期間：なし
- 解約：更新日の前日までにお知らせください

---

🏢 **Enterprise プラン**
- 最低契約期間：6ヶ月
- 解約：6ヶ月経過後、1ヶ月前までのご連絡で解約可能
- 更新や契約のご相談も可能です

---

💡 詳しい契約条件や変更については、お気軽にお問い合わせください。
    `.trim(),
    relatedQuestions: [
      "契約期間はどのくらいですか？",
      "自動更新されますか？",
      "最低契約期間はありますか？",
    ],
  };
}
