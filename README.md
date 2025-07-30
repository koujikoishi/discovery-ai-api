# Discovery AI API

これは、Discovery AI チャットボットのバックエンド（Node.js + Express）プロジェクトです。  
OpenAI API を活用して FAQ 検索や意図分類、小規模な対話機能（recommendation, smalltalk など）を提供します。

---

## 📁 ディレクトリ構成

discovery-ai-api/
├── server.ts // メインサーバー（Express API）
├── utils/ // 補助関数・テンプレート一式
│ ├── classifyIntent.ts // ユーザー発話の意図分類（OpenAI API）
│ ├── getRelevantAnswer.ts // intentに応じた応答テンプレ出し分け
│ ├── getSmalltalkResponse.ts // smalltalk対応
│ ├── faqTemplates.ts // 回答テンプレート（intentごとに整理）
│ ├── intentKeywords.ts // intent分類用のキーワード辞書
│ ├── templateIntents.ts // テンプレ応答対象intent一覧
│ ├── openaiFetch.ts // OpenAI APIの呼び出し（fetch経由）
│ ├── types.ts // 型定義
│ └── ...他
├── docs/ // FAQや営業資料の格納ディレクトリ
│ ├── faq.csv // よくある質問データ（ベクトル検索対象）
│ └── sales.pdf など // 補足資料（オプション）
├── .env // APIキーやChromaなどの設定
└── README.md // このファイル

yaml
コピーする
編集する

---

## 🚀 起動方法（開発環境）

ChromaDBをローカルで起動しておく必要があります。

```bash
# 1. 仮想環境（venv）をアクティブに
source venv/bin/activate

# 2. ChromaDBの起動
python run_chroma_server.py

# 3. Nodeサーバー起動（別ターミナルで）
npm run dev
ポート 3001 にてローカルAPIが立ち上がります。
Next.js フロントエンド（discovery-ai-ui）とは fetch 経由で通信します。

🌐 使用API（概要）
POST /api/chat
メッセージと履歴、セッション情報（team/purpose）を受け取り、意図分類＋テンプレ応答やFAQ検索を実行します。

💡 主なintent分類と応答ロジック
Intent	説明	テンプレ対応	ベクトル検索	備考
pricing	料金に関する質問	✅	✅	
contract	契約や期間	✅	✅	
onboarding	導入方法や手順	✅	✅	
cancel	解約に関する質問	✅	✅	
recommendation	チーム人数などに応じた提案	✅（多段対応）	-	セッション保持あり
difference	ChatGPTなどとの違い	✅	-	
support	サポート体制について	✅	-	
smalltalk	雑談など	✅	-	自然文応答+提案誘導あり
faq	その他よくある質問	-	✅	CSVからベクトル検索実行

📤 デプロイ方法（Vercel）
このバックエンドは GitHub 連携された Vercel により自動デプロイされています。

bash
コピーする
編集する
# ファイル追加・変更後の一連コマンド
git add .
git commit -m "feat: xxxの修正"
git push
特に .ts ファイルやテンプレートを更新した際は忘れずにpushしてください。

📝 環境変数（.env）
env
コピーする
編集する
OPENAI_API_KEY=sk-...
CHROMA_URL=http://localhost:8000
🛠 今後の改善予定
ChromaDBからPinecone等への移行（スケーラビリティ）

各intentテンプレのマルチトーン対応

フィードバック収集や連携機能の拡張

サポートBotのAgent化（LLM Routing強化）