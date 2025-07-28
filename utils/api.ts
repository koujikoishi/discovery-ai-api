// utils/api.ts

type ChatResponse = {
  answer: string;
  relatedQuestions: string[];
};

export const postChat = async (message: string): Promise<ChatResponse> => {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

  try {
    const res = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    if (!res.ok) {
      throw new Error(`❌ APIエラー: ${res.status}`);
    }

    const data: ChatResponse = await res.json();
    return data;
  } catch (error) {
    console.error('🚨 postChat error:', error);
    throw error;
  }
};
