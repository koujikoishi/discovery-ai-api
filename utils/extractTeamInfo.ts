import dotenv from "dotenv";
dotenv.config();

import fetch from "node-fetch";

interface TeamInfo {
  teamSize: string | null;
  purpose: string | null;
}

interface OpenAIResponse {
  choices: {
    message: {
      content: string;
      role: string;
    };
  }[];
}

export async function extractTeamInfo(userMessage: string): Promise<TeamInfo | null> {
  const prompt = `
以下の入力文から、可能であれば「チームの人数」と「利用目的」を抽出してください。

返答は必ずJSONのみで、以下の形式で返してください。補足や説明、コードブロック（\`\`\`）などは不要です。

{
  "teamSize": "（例：3人）",
  "purpose": "（例：FAQ対応、社内ナレッジ、顧客サポート）"
}

もし情報が含まれていない場合は、その項目を null にしてください。

入力文：
${userMessage}
`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0,
      }),
    });

    const data = (await response.json()) as Partial<OpenAIResponse>;

    if (!data.choices || !data.choices[0]?.message?.content) {
      console.error("❌ OpenAI応答形式が不正です:", data);
      return null;
    }

    const content = data.choices[0].message.content;

    console.log("🔍 GPT応答:", content);

    if (!content.includes("{")) return null;

    try {
      const parsed: TeamInfo = JSON.parse(content);
      return parsed;
    } catch (e) {
      console.error("❌ JSON parse失敗:", e);
      return null;
    }
  } catch (error: any) {
    console.error("❌ extractTeamInfoエラー:", error.message || error);
    return null;
  }
}
