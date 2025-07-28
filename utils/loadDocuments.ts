// 修正済み utils/loadDocuments.ts（全文）
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { parse } from 'csv-parse/sync';
import mammoth from 'mammoth';
// @ts-ignore
import extract from 'pdf-text-extract';
import { promisify } from 'util';
import { Pinecone } from '@pinecone-database/pinecone';

dotenv.config();

const extractAsync: (path: string) => Promise<string[]> = promisify(extract);

// テキスト分割
function splitText(text: string, chunkSize = 6000): string[] {
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  return chunks;
}

// docsディレクトリ内のファイル一覧取得
function loadDocsDir(): string[] {
  const docsDir = path.join(process.cwd(), 'docs');
  return fs.readdirSync(docsDir).map(f => path.join(docsDir, f));
}

// ファイル内容抽出
async function parseFile(filePath: string): Promise<string | null> {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.pdf') {
    const lines = await extractAsync(filePath);
    return lines.join('\n').trim();
  }
  if (ext === '.docx') {
    const buffer = fs.readFileSync(filePath);
    const result = await mammoth.extractRawText({ buffer });
    return result.value.trim();
  }
  if (ext === '.csv') {
    const content = fs.readFileSync(filePath, 'utf-8');
    const records: string[][] = parse(content, { columns: false });
    return records.flat().join('\n').trim();
  }
  return null;
}

// OpenAI埋め込み
async function fetchEmbedding(text: string): Promise<number[]> {
  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY!}`,
    },
    body: JSON.stringify({
      model: "text-embedding-3-small",
      input: text,
    }),
  });

  const json = await response.json();

  if (!json.data || !json.data[0]) {
    console.error("❌ OpenAI埋め込みAPIエラー:", JSON.stringify(json, null, 2));
    throw new Error("OpenAI APIから埋め込みが取得できませんでした");
  }

  return json.data[0].embedding;
}

// 実行本体
async function uploadToPinecone() {
  const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
  const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!); // await 不要

  const files = loadDocsDir();
  let idCounter = 0;

  console.log(`📄 ドキュメント読み込み中 (${files.length}件)`);

  for (const filePath of files) {
    try {
      const text = await parseFile(filePath);
      if (!text) {
        console.warn(`⚠️ スキップ（読み込み不可）: ${filePath}`);
        continue;
      }

      const idBase = path.basename(filePath);
      const chunks = splitText(text, 6000);

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        try {
          const embedding = await fetchEmbedding(chunk);
          await index.upsert([
            {
              id: `${idBase}_chunk_${i + 1}`,
              values: embedding,
              metadata: {
                filename: idBase,
                chunkIndex: i + 1,
                text: chunk,   // ← ここにチャンクテキストを追加！
              },
            },
          ]);
          console.log(`📥 登録: ${idBase}（チャンク ${i + 1}/${chunks.length}）`);
        } catch (err: any) {
          console.error(`❌ 埋め込み失敗: ${idBase}（${i + 1}）`, err.message);
        }
      }
    } catch (err: any) {
      console.error(`❌ 読み込み失敗: ${filePath}`, err.message);
    }
  }

  console.log(`✅ すべてのドキュメントをPineconeへ登録完了`);
}

// 実行
uploadToPinecone();
