import * as dotenv from "dotenv";
dotenv.config();

import { OpenAIEmbeddings } from "@langchain/openai";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { ChromaClient } from "chromadb";
import readline from "readline";

// CLI入力設定
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = (query: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(query, (answer: string) => {
      resolve(answer);
    });
  });
};

const run = async () => {
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY!,
  });

  const client = new ChromaClient({
    path: process.env.CHROMA_BASE_URL || "http://localhost:8000",
  });

  // ❗️client に対する型エラーを抑制（実行は可能）
  // @ts-ignore
  const vectorstore = await Chroma.fromExistingCollection(embeddings, {
    collectionName: "faq-bot",
  });

  while (true) {
    const userInput = await askQuestion("💬 質問を入力してください（exitで終了）: ");
    if (userInput.trim().toLowerCase() === "exit") break;

    const results = await vectorstore.similaritySearch(userInput, 3);

    console.log("\n📚 類似FAQの回答候補:\n");

    results.forEach((doc, i) => {
      console.log(`--- 回答 ${i + 1} ---`);
      console.log(doc.pageContent);
      console.log("\n");
    });
  }

  rl.close();
};

run();
