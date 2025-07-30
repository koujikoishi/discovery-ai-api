// utils/types.ts

export type Role = "system" | "user" | "assistant";

export interface ChatMessage {
  role: Role;
  content: string;
}

// 👇 これを追記
export type AnswerTemplate = {
  answer: string;
  relatedQuestions: string[];
};
