// 外部連携・APIに関するテンプレート返却

export function getIntegrationTemplate(): { answer: string } {
  return {
    answer: `**外部ツールとの連携について**

---

🔗 **連携可能なツール例**  
- **Slack** や **Teams** への通知・連携  
- **Zapier** を使った外部ツール連携  
- Google Sheets や Notion などへの自動連携

📡 **API提供**  
独自APIによって、社内システムや他のクラウドツールと連携可能です。

⚙️ **Webhook対応**  
条件に応じてWebhookを使ったリアルタイム連携も可能です。

---

💡 ご希望のツールや連携要件があれば、お気軽にご相談ください。柔軟に対応可能です。`
  };
}
