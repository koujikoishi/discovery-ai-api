// utils/faqTemplates/functionTemplate.ts

export function getFunctionTemplate() {
  return {
    answer: `
**Discovery AI の主な機能について**

---

🧠 **AIチャットボット**  
- よくある質問に24時間自動応答  
- ドキュメントを読み込んだナレッジ回答

📊 **レポート分析機能**（Pro以上）  
- ユーザーの質問傾向を可視化  
- チャットログからVOC分析レポート生成

⚙️ **柔軟なカスタマイズ**  
- 業種や課題に応じて会話を最適化  
- UIや導線のデザイン調整も対応

---

💡 機能の詳細は [特長ページ](https://ai.elife.co.jp/features) もご参照ください。
    `.trim(),
    relatedQuestions: [
      "どんなことができますか？",
      "Proプランの特典は？",
      "レポート機能はありますか？",
    ],
  };
}
