// utils/faqTemplates/functionTemplate.ts

import type { AnswerTemplate } from '../faqTemplate.d.ts';

export function getFunctionTemplate(): AnswerTemplate {
  return {
    answer: `
**Discovery AI の主な機能について**

---

📊 **データ収集・統合**  
- SNS（X、YouTube）のクチコミデータの自動取得
- ECサイト（Amazon）のクチコミデータの自動取得
- 自社保有データ（アンケートやコメントなど）も対象
- 多言語データ対応で海外市場分析にも活用可能

🧠 **AIチャットによる自由分析** 
- チャットUIによる分析指示  
- プロンプト自動生成機能
- VOCの自動ピックアップと全体傾向の自動生成

⚙️ **柔軟なサポート機能**  
- グラフなど直感的に使えるデータビジュアライズ機能  
- ワンクリックでレポートや分析結果を組織内に共有
- キーワード設定やレポート設定のサポート機能

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
