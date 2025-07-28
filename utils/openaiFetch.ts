import dotenv from 'dotenv';
dotenv.config();

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Chat Completion を取得する関数
export async function fetchChatCompletion(
  messages: ChatMessage[],
  temperature: number = 0.4
): Promise<string> {
  console.log('🚀 fetchChatCompletion(): 呼び出し開始');

  if (!process.env.OPENAI_API_KEY) {
    throw new Error('❌ OPENAI_API_KEY が未定義です。');
  }

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages,
      temperature,
    }),
  });

  console.log('📥 fetchChatCompletion(): 応答ステータス', res.status);

  if (!res.ok) {
    const errText = await res.text();
    console.error('❌ OpenAI API error:', res.status, errText);
    throw new Error(`OpenAI API fetch failed: ${res.status}`);
  }

  const data = await res.json();
  console.log('📦 fetchChatCompletion(): 応答取得完了');
  return data.choices[0].message.content;
}

// Embedding を取得する関数
export async function fetchEmbedding(text: string): Promise<number[]> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('❌ OPENAI_API_KEY が未定義です。');
  }

  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: text,
      model: 'text-embedding-3-small',
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error('❌ OpenAI Embedding API error:', response.status, errText);
    throw new Error(`Embedding fetch failed: ${response.status}`);
  }

  const json = await response.json();
  return json.data[0].embedding;
}
