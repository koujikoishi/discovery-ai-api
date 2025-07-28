import * as dotenv from "dotenv";
dotenv.config();

import fs from "fs/promises";
import path from "path";
import csv from "csv-parser";
import { createReadStream } from "fs";

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { Document } from "langchain/document";

import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

// CSV読み込み
const loadCSVDocuments = async (csvPath: string): Promise<Document[]> => {
  const results: Document[] = [];

  return new Promise((resolve, reject) => {
    createReadStream(csvPath)
      .pipe(csv())
      .on("data", (row: any) => {
        if (row.question && row.answer) {
          const metadata = {
            main_category: String(row.main_category || ""),
            sub_category: String(row.sub_category || ""),
          };
          const content = `【質問】${row.question}\n\n【回答】${row.answer}`;
          results.push(new Document({ pageContent: content, metadata }));
        }
      })
      .on("end", () => resolve(results))
      .on("error", (err) => reject(err));
  });
};

// DOCX読み込み
const loadDOCXDocuments = async (directoryPath: string): Promise<Document[]> => {
  const files = await fs.readdir(directoryPath);
  const documents: Document[] = [];

  for (const file of files) {
    if (path.extname(file).toLowerCase() !== ".docx") continue;
    const loader = new DocxLoader(path.join(directoryPath, file));
    const docs = await loader.load();
    documents.push(...docs);
  }

  return documents;
};

// PDF読み込み
const loadPDFDocuments = async (directoryPath: string): Promise<Document[]> => {
  const files = await fs.readdir(directoryPath);
  const documents: Document[] = [];

  for (const file of files) {
    if (path.extname(file).toLowerCase() !== ".pdf") continue;
    const loader = new PDFLoader(path.join(directoryPath, file));
    const docs = await loader.load();
    documents.push(...docs);
  }

  return documents;
};

// metadataをプリミティブ型に整える
const sanitizeMetadata = (doc: Document): Document => {
  const safeMetadata: Record<string, string | number | boolean | null> = {};
  for (const [key, value] of Object.entries(doc.metadata || {})) {
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean" ||
      value === null
    ) {
      safeMetadata[key] = value;
    } else {
      safeMetadata[key] = String(value);
    }
  }

  return new Document({ pageContent: doc.pageContent, metadata: safeMetadata });
};

// メイン処理
const run = async () => {
  const directoryPath = "./docs";

  const csvFilePath = path.join(directoryPath, "faq.csv");
  const csvDocs = await loadCSVDocuments(csvFilePath);
  console.log("📄 CSVから読み込んだFAQ数:", csvDocs.length);

  const docxDocs = await loadDOCXDocuments(directoryPath);
  const pdfDocs = await loadPDFDocuments(directoryPath);

  const rawDocuments = [...csvDocs, ...docxDocs, ...pdfDocs];
  const sanitizedDocs = rawDocuments.map(sanitizeMetadata);

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 100,
  });

  const splitDocs = await splitter.splitDocuments(sanitizedDocs);

  // `Chroma.fromDocuments()` は client 指定なしで動作させる
  await Chroma.fromDocuments(splitDocs, new OpenAIEmbeddings(), {
    collectionName: "faq-bot",
  });

  console.log("✅ ベクトルDB作成完了: faq-bot");
};

run();
