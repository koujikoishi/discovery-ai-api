import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';
import { PDFDocument } from 'pdf-lib';
import { fetchEmbedding } from './fetchEmbedding.js';
import { index } from './pineconeClient.js';

console.log("🚀 Embedding 開始");

const DOCS_DIR = './docs';
const CSV_PATH = path.join(DOCS_DIR, 'faq.csv');

// 拡張子ごとのファイル取得
function getFilesByExtension(dir: string, ext: string): string[] {
  return fs.readdirSync(dir)
    .filter((file) => file.toLowerCase().endsWith(ext))
    .map((file) => path.join(dir, file));
}

// --- CSV読み込み ---
async function loadCsvData(): Promise<string[]> {
  const records: string[] = [];
  const parser = fs.createReadStream(CSV_PATH).pipe(parse({
    columns: true,
    skip_empty_lines: true
  }));

  for await (const record of parser) {
    const q = record.question?.trim?.();
    const a = record.answer?.trim?.();
    if (q && a) records.push(`${q} ${a}`);
  }

  return records;
}

// --- .txt読み込み ---
async function loadTxtFiles(): Promise<string[]> {
  const files = getFilesByExtension(DOCS_DIR, '.txt');
  return files
    .map((file) => fs.readFileSync(file, 'utf-8').trim())
    .filter(Boolean);
}

// --- .docx読み込み（仮） ---
async function loadDocxFiles(): Promise<string[]> {
  const files = getFilesByExtension(DOCS_DIR, '.docx');
  return files
    .map((file) => fs.readFileSync(file, 'utf-8').trim())
    .filter(Boolean);
}

// --- .pdf読み込み ---
async function loadPdfFiles(): Promise<string[]> {
  const files = getFilesByExtension(DOCS_DIR, '.pdf');
  const results: string[] = [];

  for (const file of files) {
    try {
      const fileBuffer = fs.readFileSync(file);
      const pdfDoc = await PDFDocument.load(fileBuffer);
      const pages = pdfDoc.getPages();
      const text = `[PDF: ${path.basename(file)}] 全${pages.length}ページ（※テキスト抽出未対応）`;
      results.push(text);
    } catch (err: any) {
      console.error(`❌ PDF読み込み失敗: ${file}`, err.message);
    }
  }

  return results;
}

// --- メイン処理 ---
async function main(): Promise<void> {
  const csv = await loadCsvData();
  const txt = await loadTxtFiles();
  const docx = await loadDocxFiles();
  const pdf = await loadPdfFiles();

  const documents = [...csv, ...txt, ...docx, ...pdf];
  console.log(`📄 読み込み完了: ${documents.length} 件`);

  const upserts = [];

  for (let i = 0; i < documents.length; i++) {
    const text = documents[i];
    const embedding = await fetchEmbedding(text);

    upserts.push({
      id: `doc-${i}`,
      values: embedding,
      metadata: { text },
    });

    console.log(`✅ 埋め込み準備: ${i + 1}/${documents.length}`);
  }

  await index.upsert(upserts);
  console.log("🎉 Embedding + Pinecone upsert 完了");
}

main();
