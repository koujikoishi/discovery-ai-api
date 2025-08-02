// utils/faqTemplates/overviewTemplate.ts

import type { AnswerTemplate } from '../faqTemplate.d.ts';

export function getOverviewTemplate(): AnswerTemplate {
  return {
    answer: `
**Discovery AIは、AIを活用したFAQチャットボットです。**

以下のような特徴があります：

---

🔹 **高精度な質問理解**  
ユーザーの自然な質問を意図ごとに分類し、正確に回答します。

🔹 **テンプレートとベクトル検索のハイブリッド**  
FAQや資料から関連情報を抽出しつつ、テンプレ回答も柔軟に切り替えます。

🔹 **簡単な導入**  
1週間以内で実装が可能。無料トライアルも対応しています。

---

💡 詳しくは [Discovery AI 公式サイト](https://ai.elife.co.jp/) をご覧ください。
    `.trim(),
    relatedQuestions: [
      'Discovery AIってどんなサービス？',
      '何ができますか？',
      'サービスの概要を教えてください',
    ],
  };
}
