// utils/faqTemplates/supportTemplate.ts
// サポート・お問い合わせに関するテンプレート返却

export function getSupportTemplate(): {
  answer: string;
  relatedQuestions: string[];
} {
  return {
    answer: `**サポート・お問い合わせについて**

---

📩 **メールでのお問い合わせ**  
ai-support@elife.co.jp までご連絡ください（平日10時〜17時対応）

🗒️ **お問い合わせフォーム**  
https://ai.elife.co.jp/contact（平日10時〜17時対応）

📞 **電話サポート**（Enterpriseのみ）  
ご契約内容に応じて、専任担当が電話でサポート対応いたします。

📘 **ヘルプページ・導入ガイド**  
よくある質問は [ヘルプページ](https://ai.elife.co.jp/faq) にまとまっています。

---

💡 お困りごとや不明点があれば、いつでもお気軽にご連絡ください。`,
    relatedQuestions: [
      "サポート窓口はありますか？",
      "問い合わせ方法を教えてください",
      "電話で相談できますか？",
      "ヘルプページはありますか？",
    ],
  };
}
