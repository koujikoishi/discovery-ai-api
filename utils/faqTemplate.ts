export interface AnswerTemplate {
  answer: string;
  relatedQuestions: string[];
}

export function getContractTemplate(): AnswerTemplate {
  return {
    answer: `
契約期間についてご案内します。

- Starterプラン、Proプランについては **最低契約期間はございません**。  
- **1カ月単位の契約** となります。  
- Enterpriseプランについては、契約条件を個別にご相談ください。  
- ご契約内容や条件の詳細は、いつでもお問い合わせください。`,
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

---

🟢 **Starter プラン**  
月額：88,000円（税別）

- 小規模チーム向けのベーシックプラン  
- 〜5名まで向き     
- 対象ブランド数：1〜3件  
- コストを抑えながら基本機能を活用可能  
- ✅ **1ヶ月単位で契約可能／最低契約期間なし**

※ 初回限定で7日間の無料トライアルが利用可能です（クレジットカード登録不要）

---

🔵 **Pro プラン**  
月額：200,000円（税別）

- 中〜大規模チーム向け
- 〜20名まで向き
- 対象ブランド数：4〜10件  
- レポートや分析機能が強化  
- ✅ **1ヶ月単位で契約可能／最低契約期間なし**

---

🟣 **Enterprise プラン**  
月額：個別相談（お問い合わせください）

- ブランド数無制限、機能カスタマイズ可能  
- チーム体制や要件に応じた専用プランを設計  
- ✅ **契約期間や条件の詳細はお問い合わせください**

💬 ご利用目的やチーム人数に応じて、最適なプランをご提案します！`,
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
導入のステップはとてもシンプルです！

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
ご解約をご希望とのこと、承知いたしました。

- 解約はいつでも可能です。専用フォームまたは担当窓口へご連絡ください。  
- 月の途中での解約でも **日割り精算はございません** のでご注意ください。  
- ご契約内容によっては、解約までにお時間をいただく場合がございます。

その他ご不明点があれば、いつでもお知らせください。`,
    relatedQuestions: [
      "解約方法を教えてください",
      "日割り料金になりますか？",
      "解約はすぐに反映されますか？",
    ],
  };
}

export function getLayoutTestTemplate(): AnswerTemplate {
  return {
    answer: `
これはレイアウトテスト用のテンプレートです。

<p class="mb-0 leading-snug">テスト段落1</p>
<ul class="mt-[-18px] mb-0">
  <li class="leading-relaxed mt-[-15px]">リスト項目1</li>
  <li class="leading-relaxed mt-[-15px]">リスト項目2</li>
</ul>
<p class="mb-0 leading-snug">テスト段落2</p>
`,
    relatedQuestions: [],
  };
}

export function getIndustryTemplate(): AnswerTemplate {
  return {
    answer: `
Discovery AIは様々な業界でご活用いただいています。

- 消費財・飲料・食品メーカー（例：パン、ドリンクなど）  
- 化粧品・日用品ブランド  
- 医療・製薬企業  
- B2B SaaS・IT企業  

業種や業界に応じた事例や活用方法もご紹介可能です。お気軽にご相談ください。`,
    relatedQuestions: [
      "どの業界で使われていますか？",
      "食品業界の導入事例は？",
      "IT企業でも使えますか？",
    ],
  };
}

// ---------------------
// 要約まとめ 用テンプレートマッチ関数
// ---------------------
export function getOverviewTemplate(): AnswerTemplate {
  return {
    answer: `
Discovery AIとは？「顧客発見」特化型マーケティングAI：

- ソーシャルメディア他、ウェブ上に存在するクチコミデータを自動で収集
- 専用にトレーニングされたAIエージェント機能で分析
- 顧客インサイトをADが短時間で可視化
- マーケティングに有用な顧客インサイトを的確に捉える

🎯 導入目的に応じて、最適な使い方をご提案できます。お気軽にお尋ねください！
    `,
    relatedQuestions: [
      'Discovery AIとは何ですか？',
      'どんなことができますか？',
      '特徴を教えてください',
    ],
  };
}


export function getFunctionTemplate(): AnswerTemplate {
  return {
    answer: `
Discovery AIには以下のような主な機能があります：

- 各SNSやECのレビュー、コミュニティデータを分析
- 単語単位ではなく、文脈・分位を読み取った分析
- 顧客インサイトレポート
- 分析結果ビジュアライゼーション  他 

🎯 導入目的に応じて、最適な使い方をご提案できます。お気軽にお尋ねください！`,
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
**Discovery AIとChat GPTの主な違いは、用途と機能にあります。**

#### ✅ Discovery AI は：
- 主に企業向けのデータ分析やマーケティング支援を目的としたツール  
- ブランド分析やVOC（顧客の声）分析に特化  
- 複数のプランがあり、企業の規模やニーズに応じて選択可能  
- 初回限定で7日間の無料トライアルあり

#### 💬 Chat GPT は：
- 自然言語処理を用いた対話型AI  
- 幅広い質問や会話に対応可能  
- 一般的な質問応答や文章生成に強み  
`,
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
お問い合わせは以下の方法で承っております。

- 📩 メール：**support@discovery-ai.jp**  
- 💬 お問い合わせフォーム：[こちら](https://ai.elife.co.jp/contact)

お困りの際は、いつでもご連絡くださいませ。`,
    relatedQuestions: [
      "問い合わせ方法を教えてください",
      "メールでも問い合わせできますか？",
      "サポート対応時間は？",
    ],
  };
}

export function getLoginIssueTemplate(): AnswerTemplate {
  return {
    answer: `
ログインできない場合の対処方法をご案内します。

---

1. **メールアドレス・パスワードの入力内容をご確認ください**  
   入力ミスがないか、全角/半角、大文字/小文字にご注意ください。

2. **パスワードをお忘れの方は、再設定をご利用ください**  
   ログイン画面の「パスワードを忘れた方はこちら」から再設定が可能です。

3. **ブラウザのキャッシュやCookieを削除して再試行してください**

4. **それでも解決しない場合は、お手数ですがサポートまでご連絡ください**  
   - メール：support@discovery-ai.jp  
   - お問い合わせフォーム：[こちら](https://ai.elife.co.jp/contact)
`,
    relatedQuestions: [
      "ログインできません",
      "パスワードを忘れました",
      "ログインエラーが出ます",
    ],
  };
}

// ---------------------
// FAQ 用テンプレートマッチ関数
// ---------------------

export function getFaqTemplate(question: string): AnswerTemplate | null {
  const map: Record<string, AnswerTemplate> = {
    '無料で使えますか': getPricingTemplate(),
    '料金はいくら': getPricingTemplate(),
    '料金プランの違い': getPricingTemplate(),
    '契約期間': getContractTemplate(),
    '解約': getCancelTemplate(),
    '導入ステップ': getOnboardingTemplate(),
    'ログインできない': getLoginIssueTemplate(),
    '問い合わせ': getSupportTemplate(),
    'どの業界': getIndustryTemplate(),
    'どんな機能': getFunctionTemplate(),
  };  
  const matched = Object.keys(map).find(key => question.includes(key));
  return matched ? map[matched] : null;
}

// ---------------------
// Billing 用テンプレート
// ---------------------

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