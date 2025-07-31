export interface AnswerTemplate {
  answer: string;
  relatedQuestions: string[];
}

/*以下整理のため削除不可
'テスト': getLayoutTestTemplate(),
'契約期間': getContractTemplate(),
'無料で使えますか': getPricingTemplate(),
'料金はいくら': getPricingTemplate(),
'料金プランの違い': getPricingTemplate(),
'導入ステップ': getOnboardingTemplate(),
'解約': getCancelTemplate(),
'どの業界': getIndustryTemplate(),
'Discovery AIとは': getOverviewTemplate(),
'どんな機能': getFunctionTemplate(),
'Starterプラン': getRecommendationStarterTemplate(),
'Proプラン': getRecommendationGrowthTemplate(),
'Enterpriseプラン': getRecommendationEnterpriseTemplate(),
'ChatGPTとの違い': getDifferenceTemplate(),
'問い合わせ': getSupportTemplate(),🙆
'ログインできない': getLoginIssueTemplate(),
'セキュリティ': getSecurityTemplate(),🙆
'連携': getIntegrationTemplate(),🙆
'法令遵守': getComplianceTemplate(),🙆
'料金の支払いサイクル': getBillingTemplate(),
*/


export function getLayoutTestTemplate(): AnswerTemplate {
  return {
    answer: `
これはレイアウトテスト用のテンプレートです。

🧪 **テスト段落1**
- リスト項目1
- リスト項目2

🧪 **テスト段落2**
`,
    relatedQuestions: [],
  };
}

export function getContractTemplate(): AnswerTemplate {
  return {
    answer: `
契約期間についてご案内します。

🟢 **Starter / Pro プラン**
- 最低契約期間はございません
- 1ヶ月単位のご契約が可能です

🟣 **Enterprise プラン**
- 契約条件を個別にご相談のうえ決定します
- 詳細はお問い合わせフォームよりご相談ください

📩 [契約に関するお問い合わせはこちら](https://ai.elife.co.jp/contact)
`,
    relatedQuestions: [
      "最低契約期間はありますか？",
      "月額契約は可能ですか？",
      "Enterpriseの契約条件は？",
    ],
  };
}

export function getPricingTemplate(): AnswerTemplate {
  return {
    answer: `
料金プランは3つの種類があります。

🟢 **Starter プラン**  
月額：88,000円（税別）

- 小規模チーム向けのベーシックプラン  
- 〜5名まで向き  
- 対象ブランド数：1〜3件  
- コストを抑えながら基本機能を活用可能  
- ✅ 1ヶ月単位で契約可能／最低契約期間なし  

※ 初回限定で7日間の無料トライアルが利用可能です（クレジットカード登録不要）

---

🔵 **Pro プラン**  
月額：200,000円（税別）

- 中〜大規模チーム向け  
- 〜20名まで向き  
- 対象ブランド数：4〜10件  
- レポートや分析機能が強化  
- ✅ 1ヶ月単位で契約可能／最低契約期間なし  

---

🟣 **Enterprise プラン**  
月額：個別相談（お問い合わせください）

- ブランド数無制限、機能カスタマイズ可能  
- チーム体制や要件に応じた専用プランを設計  
- ✅ 契約期間や条件の詳細はお問い合わせください  

---

💬 ご利用目的やチーム人数に応じて、最適なプランをご提案します！  
 [料金プランの詳細を見る](https://ai.elife.co.jp/plan)
`,
    relatedQuestions: [
      "無料で使えますか？",
      "料金プランの違いは？",
      "Enterpriseプランはいくらですか？",
    ],
  };
}

export function getOnboardingTemplate(): AnswerTemplate {
  return {
    answer: `
導入のステップはとてもシンプルです。

1. 📩 フォームからお問い合わせ or トライアル申し込み  
2. 👥 担当よりご連絡、ヒアリングとご提案  
3. 🛠️ 初期設定（最短即日〜2営業日）  
4. ✅ ご利用スタート！

無料トライアルもご用意していますので、お気軽にお試しください！`,
    relatedQuestions: [
      "導入までにかかる時間は？",
      "トライアルは可能ですか？",
      "初期設定は必要ですか？",
    ],
  };
}

export function getCancelTemplate(): AnswerTemplate {
  return {
    answer: `
ご解約についてのご案内です。

📅 **解約タイミング**
- 解約はいつでも可能です  
- ご連絡後、速やかに処理を進めます  

💰 **ご注意点**
- 月の途中での解約でも日割り精算はございません  
- ご契約内容によっては所定の手続きが必要な場合があります  

📩 [解約に関するお問い合わせはこちら](https://ai.elife.co.jp/contact)
`,
    relatedQuestions: [
      "解約方法を教えてください",
      "日割り料金になりますか？",
      "解約はすぐに反映されますか？",
    ],
  };
}

export function getIndustryTemplate(): AnswerTemplate {
  return {
    answer: `
Discovery AIは、さまざまな業界・業種でご活用いただいています。

---

🏭 **主な導入業界：**

- 消費財・食品・飲料メーカー（例：パン、ドリンクなど）  
- 化粧品・ヘルスケア・日用品ブランド  
- 医療・製薬・ヘルステック領域  
- B2B SaaS・ITベンダー・スタートアップ  
- 地方自治体・行政関連（実証実験含む）

---

業種や活用シーンに応じて、導入事例やユースケースをご紹介可能です。  
お気軽にご相談ください！`,
    relatedQuestions: [
      "どの業界で使われていますか？",
      "食品業界の導入事例は？",
      "IT企業でも使えますか？",
    ],
  };
}

export function getOverviewTemplate(): AnswerTemplate {
  return {
    answer: `
Discovery AIは「顧客発見」に特化したマーケティングAIです。

🔍 **クチコミデータを自動で収集**
- SNS・EC・レビューサイトなど、Web上の顧客の声を幅広くカバー

🧠 **AIエージェントによる文脈理解・分析**
- 意味理解に特化した独自のAIが、発言の背景やインサイトを捉える

📊 **マーケティングに使える顧客インサイトを可視化**
- レポートやクラスタ図など、実務で使える形でアウトプット

🎯 ブランド戦略や商品開発、広告企画など様々な場面でご活用いただけます。

[Discovery AIの特長を見る](https://ai.elife.co.jp/feature)

📢 本サービス「Discovery AI」は、株式会社イーライフ（eLife Inc.）が提供しています。  
[運営会社についてはこちら](https://www.elife.co.jp)
`,
    relatedQuestions: [
      "Discovery AIとは何ですか？",
      "どんなことができますか？",
      "特徴を教えてください",
    ],
  };
}

export function getFunctionTemplate(): AnswerTemplate {
  return {
    answer: `
Discovery AIでは、以下のような主要機能をご利用いただけます：

🔍 **クチコミデータ自動収集**
- SNSやECサイト、レビューサイトなどからブランドに関する発言を自動で収集

🧠 **意味単位でのAI分析**
- 単語ではなく「文脈」や「意図」を読み取る高度な意味理解エンジンを搭載

📊 **インサイトレポート生成**
- 注目すべき顧客の声やトレンドを可視化したレポートを自動生成

🎨 **ビジュアライゼーション機能**
- グラフやクラスタマップなど、視覚的に理解しやすい形式での出力が可能

🛠️ 導入目的や業務フローに応じて、柔軟なカスタマイズも可能です。

[機能の詳細はこちら](https://ai.elife.co.jp/feature)
`,
    relatedQuestions: [
      "どんな機能がありますか？",
      "自動分類はできますか？",
      "複数資料から検索できますか？",
    ],
  };
}

export function getRecommendationStarterTemplate(): AnswerTemplate {
  return {
    answer: `
🟢 **Starter プラン** はこんな方におすすめです：

- 小規模チームで始めたい  
- まずは基本的な機能から試したい  
- コストを抑えて導入したい

✅ 対象ブランド数：1〜3件  
✅ 初回7日間の無料トライアルもご利用可能です  
`,
    relatedQuestions: [
      "Starterプランとは？",
      "小規模でも使えますか？",
      "無料トライアルはありますか？",
    ],
  };
}

export function getRecommendationGrowthTemplate(): AnswerTemplate {
  return {
    answer: `
🔵 **Pro プラン** はこんな方におすすめです：

- 中〜大規模チームで本格導入したい  
- データ分析やレポート機能を活用したい  
- ブランド数が4件以上ある

📊 対象ブランド数：4〜10件  
📈 レポート・分析機能も充実しています  
`,
    relatedQuestions: [
      "Proプランとは？",
      "分析機能はありますか？",
      "複数ブランド対応ですか？",
    ],
  };
}

export function getRecommendationEnterpriseTemplate(): AnswerTemplate {
  return {
    answer: `
🟣 **Enterprise プラン** はこんな方におすすめです：

- ブランド数が10件以上ある or 無制限で運用したい  
- 高度なカスタマイズや連携が必要  
- セキュリティ要件や組織体制が大きい

💼 ご要望に応じた個別プランをご提案します。まずはお気軽にご相談ください！  
[お問い合わせはこちら](https://ai.elife.co.jp/contact)
`,
    relatedQuestions: [
      "Enterpriseプランとは？",
      "セキュリティ対応は？",
      "カスタマイズできますか？",
    ],
  };
}

export function getDifferenceTemplate(): AnswerTemplate {
  return {
    answer: `
**Discovery AI** と **ChatGPT** は目的や活用領域が異なります。

---

🧠 **Discovery AI** はこんなサービスです：
- ブランド向けの **マーケティング支援AI**  
- SNSやクチコミデータの収集・分析・レポーティングに特化  
- 意味理解・業種特化型で企業活用を前提とした設計  
- 企業規模や目的に応じたプランを選択可能  

💬 **ChatGPT** は：
- 一般的な **対話型AI（汎用）**  
- 質問応答・文章生成・学習補助などに幅広く対応  
- 会話体験やアイデア出しなどに活用されることが多い  

---

どちらが適しているかは **目的によって異なります**。  
ご検討段階でもお気軽にお問い合わせください！`,
    relatedQuestions: [
      "ChatGPTとの違いは？",
      "Discovery AIの強みは？",
      "どちらを選べばいい？",
    ],
  };
}

export function getSupportTemplate(): AnswerTemplate {
  return {
    answer: `
サポートに関するご案内です。技術的なご質問や導入相談など、幅広く対応しております。

📩 **メールでのお問い合わせ**  
- ai-support@elife.co.jp

💬 **お問い合わせフォーム**  
- [https://ai.elife.co.jp/contact](https://ai.elife.co.jp/contact)

🕐 **サポート対応時間**  
- 平日 10:00〜18:00（土日祝を除く）

[FAQ（よくあるご質問）もあわせてご覧ください](https://ai.elife.co.jp/faq)
`,
    relatedQuestions: [
      "電話でのサポートはありますか？",
      "サポートの受付時間を教えてください",
      "問い合わせフォームはどこですか？",
    ],
  };
}

export function getLoginIssueTemplate(): AnswerTemplate {
  return {
    answer: `
**ログインできない場合の対処法**

以下をご確認ください：

---
**🔐 メールアドレス・パスワードの入力内容**  
- 入力ミスがないか  
- 全角/半角、大文字/小文字の区別

---
**🔑 パスワードをお忘れの場合**  
- ログイン画面の「パスワードを忘れた方はこちら」から再設定が可能です

---
**🌐 キャッシュとCookieの削除**  
- ブラウザのキャッシュやCookieを削除して再試行してください

---
**📩 サポートへのご連絡**  
- メール：support@discovery-ai.jp  
- [お問い合わせはこちら](https://ai.elife.co.jp/contact)
`,
    relatedQuestions: [
      "ログインできません",
      "パスワードを忘れました",
      "ログインエラーが出ます",
    ],
  };
}

export function getSecurityTemplate(): AnswerTemplate {
  return {
    answer: `セキュリティ対策についてのご質問ですね。以下をご確認ください。

🔐 **通信の暗号化**  
すべての通信はSSL/TLSにより暗号化されています。

🧱 **アクセス制限とログ管理**  
管理画面やAPIにはIP制限・認証機構があり、アクセスログを常時監視しています。

🧪 **外部監査・脆弱性対応**  
定期的にセキュリティ診断を実施し、脆弱性が見つかった場合は迅速に対処しています。

ご不明点や要件がある場合は、お気軽にご相談ください。`,
    relatedQuestions: [
      "セキュリティ認証には対応していますか？",
      "暗号化通信は行っていますか？",
      "データ保管場所はどこですか？",
    ],
  };
}

export function getIntegrationTemplate(): AnswerTemplate {
  return {
    answer: `他システムとの連携についてのご質問ですね。以下をご確認ください。

🔌 **外部サービスとの連携**  
Salesforce、HubSpot、Slack、Google Analytics などと柔軟に連携可能です。

🧩 **APIによる拡張**  
RESTful API を提供しており、外部システムとのデータ連携が可能です。

⚙️ **Webhook・通知機能**  
イベント発生時に外部サービスへ通知を送るWebhook機能を備えています。

ご希望のシステムがある場合は、個別にご相談いただければ詳細をご案内いたします。`,
    relatedQuestions: [
      "HubSpotと連携できますか？",
      "APIの提供はありますか？",
      "外部ツールとの連携事例を教えてください",
    ],
  };
}

export function getComplianceTemplate(): AnswerTemplate {
  return {
    answer: `コンプライアンス・法令対応についてのご質問ですね。以下をご確認ください。

📄 **プライバシーポリシーと利用規約**  
個人情報保護方針・利用規約を明確に定めており、法令順守を徹底しています。

🛡️ **各種法令への対応**  
日本国内の個人情報保護法（改正含む）や、必要に応じてGDPR対応も検討可能です。

📝 **契約書対応・NDA**  
ご希望に応じて、秘密保持契約（NDA）や個別契約書の締結にも対応しております。

ご利用企業の法務・コンプライアンス部門とも連携しながら導入を進められますので、ご安心ください。`,
    relatedQuestions: [
      "個人情報保護法に対応していますか？",
      "GDPRには対応していますか？",
      "NDAを結ぶことはできますか？",
    ],
  };
}

export function getFaqTemplate(question: string): AnswerTemplate | null {
  const map: Record<string, AnswerTemplate> = {
    'テスト': getLayoutTestTemplate(),
    '契約期間': getContractTemplate(),
    '無料で使えますか': getPricingTemplate(),
    '料金はいくら': getPricingTemplate(),
    '料金プランの違い': getPricingTemplate(),
    '導入ステップ': getOnboardingTemplate(),
    '解約': getCancelTemplate(),
    'どの業界': getIndustryTemplate(),
    'Discovery AIとは': getOverviewTemplate(),
    'どんな機能': getFunctionTemplate(),
    'Starterプラン': getRecommendationStarterTemplate(),
    'Proプラン': getRecommendationGrowthTemplate(),
    'Enterpriseプラン': getRecommendationEnterpriseTemplate(),
    'ChatGPTとの違い': getDifferenceTemplate(),
    '問い合わせ': getSupportTemplate(),
    'ログインできない': getLoginIssueTemplate(),
    'セキュリティ': getSecurityTemplate(),
    '連携': getIntegrationTemplate(),
    '法令遵守': getComplianceTemplate(),
    '料金の支払いサイクル': getBillingTemplate(),
  };
  const matched = Object.keys(map).find(key => question.includes(key));
  return matched ? map[matched] : null;
}

export function getBillingTemplate(): AnswerTemplate {
  return {
    answer: `
課金タイミング（支払い時期）についてご案内します。

1. 🟢 **Starterプラン**  
   7日間の無料トライアル終了後にクレジットカードで課金され、以後毎月同日に自動請求されます。

2. 🔵 **Proプラン**  
   申込時に課金され、以後毎月同日に自動請求されます。

3. 🟣 **Enterpriseプラン**  
   月末締め翌月末払いの請求書による銀行振込となります。`,
    relatedQuestions: [
      '請求書払いは可能ですか？',
      'クレジットカードなしでも利用できますか？',
      '料金の支払いサイクルを教えてください',
    ],
  };
}
