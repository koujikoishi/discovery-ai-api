// utils/fetchEmbedding.ts

import dotenv from 'dotenv';
dotenv.config();

export async function fetchEmbedding(text: string): Promise<number[]> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("❌ OPENAI_API_KEY が未定義です。");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000); // 10秒タイムアウト

  try {
    const res = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        input: text,
        model: "text-embedding-3-small"
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      const errText = await res.text();
      console.error("❌ OpenAI Embedding API error:", res.status, res.statusText, errText);
      throw new Error(`Embedding fetch failed: ${res.status}`);
    }

    const data = await res.json();
    return data.data[0].embedding;
  } catch (err: any) {
    console.error("🚨 fetchEmbedding error:", err.message || err);
    throw err;
  }
}
