// server.ts（改修済み最新版）
// ✅ recommendation intent時、team + purpose が揃ったら getRelevantAnswer() を呼び出す構成

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import type { ChatMessage } from "./utils/types.js";
import { getRelevantAnswer } from "./utils/getRelevantAnswer.js";
import { classifyIntent } from "./utils/classifyIntent.js";
import { extractTeamInfo } from "./utils/extractTeamInfo.js";
import getSmalltalkResponse from "./utils/getSmalltalkResponse.js";
import getFallbackResponse from "./utils/getFallbackResponse.js";
import { getRelatedQuestions } from "./utils/getRelatedQuestions.js";
import {
  getContractTemplate,
  getOnboardingTemplate,
  getCancelTemplate,
  getLayoutTestTemplate,
  getIndustryTemplate,
  getDifferenceTemplate,
  getLoginIssueTemplate,
  getBillingTemplate,
} from "./utils/faqTemplate.js";

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://discovery-ai-ui.vercel.app",
];

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  }
  next();
});

app.use(express.json());

interface ChatRequestBody {
  message: string;
  history?: ChatMessage[];
  team?: string;
  purpose?: string;
}

app.post("/api/chat", async (req: Request<{}, {}, ChatRequestBody>, res: Response) => {
  const { message, history = [] } = req.body;
  const normalized = message.trim().toLowerCase();
  const isShort = ["はい", "うん", "そうです", "ok", "いいえ", "no"].includes(normalized);

  const introDone = history.some((h) => h.role === "system" && h.content === "recommendation-intro");
  const lastIntentObj = [...history].reverse().find((h) => h.role === "system" && h.content.startsWith("intent:"));
  const lastIntent = lastIntentObj?.content.split(":")[1] || null;

  let intent = "";
  if (introDone && lastIntent === "recommendation") {
    intent = "recommendation";
  } else if (isShort && introDone) {
    intent = "recommendation";
  } else {
    intent = await classifyIntent(message);
  }

  const updatedHistory: ChatMessage[] = [...history];
  let reply = "";
  let relatedQuestions: string[] = [];

  if (!intent || typeof intent !== "string") {
    return res.json({ reply: "申し訳ありません、ただいま応答できません。", updatedHistory, relatedQuestions: [] });
  }

  const alreadyRecommended = history.some((h) => h.role === "assistant" && String(h.content).includes("Starterプランをご提案"));
  if (intent === "recommendation" && alreadyRecommended) {
    return res.json({ reply: "他にも気になる点があればお知らせください。", updatedHistory, relatedQuestions: [] });
  }

  if (intent === "recommendation" && introDone && isShort) {
    reply = "ありがとうございます。それでは、チームのご利用人数と目的を教えていただけますか？";
    updatedHistory.push({ role: "assistant", content: reply });
    return res.json({ reply, updatedHistory, relatedQuestions: getRelatedQuestions("recommendation") });
  }

  switch (intent) {
    case "recommendation": {
      if (!introDone) {
        reply = "ご利用目的に応じて最適なプランをご提案できます。いくつか質問させていただいてもよろしいですか？";
        updatedHistory.push({ role: "system", content: "recommendation-intro" });
        updatedHistory.push({ role: "system", content: "intent:recommendation" });
      } else {
        const extracted = await extractTeamInfo(message);
        const lastTeam = history.find((h) => h.role === "system" && h.content.startsWith("team:"))?.content.split(":")[1] || null;
        const lastPurpose = history.find((h) => h.role === "system" && h.content.startsWith("purpose:"))?.content.split(":")[1] || null;

        const team = extracted?.teamSize || lastTeam;
        const purpose = extracted?.purpose || lastPurpose;

        if (!team && !purpose) {
          reply = [
            "恐れ入ります、以下のような形式でご回答いただけますか？",
            "・ご利用予定のチーム人数",
            "・主な利用目的（例：FAQ対応、社内ナレッジ、顧客サポート）",
          ].join("\n");
        } else if (team && !purpose) {
          updatedHistory.push({ role: "system", content: `team:${team}` });
          reply = "ありがとうございます。あわせて主なご利用目的も教えていただけますか？";
        } else if (!team && purpose) {
          updatedHistory.push({ role: "system", content: `purpose:${purpose}` });
          reply = "ありがとうございます。あわせてチームのご利用人数も教えていただけますか？";
        } else {
          updatedHistory.push({ role: "system", content: `team:${team}` });
          updatedHistory.push({ role: "system", content: `purpose:${purpose}` });

          const result = await getRelevantAnswer(`${team}人で${purpose}のために使いたい`, updatedHistory, "recommendation");
          reply = result.answer;
          relatedQuestions = result.relatedQuestions;
        }
      }
      break;
    }

    case "faq":
    case "pricing":
    case "function": {
      const result = await getRelevantAnswer(message, updatedHistory, intent);
      reply = result.answer;
      relatedQuestions = result.relatedQuestions;
      updatedHistory.push({ role: "system", content: `intent:${intent}` });
      break;
    }

    case "login":
      reply = getLoginIssueTemplate().answer;
      relatedQuestions = getRelatedQuestions("login");
      updatedHistory.push({ role: "system", content: "intent:login" });
      break;

    case "difference":
      reply = getDifferenceTemplate().answer;
      relatedQuestions = getRelatedQuestions("difference");
      updatedHistory.push({ role: "system", content: "intent:difference" });
      break;

    case "billing":
      reply = getBillingTemplate().answer;
      relatedQuestions = getRelatedQuestions("billing");
      updatedHistory.push({ role: "system", content: "intent:billing" });
      break;

    case "onboarding":
      reply = getOnboardingTemplate().answer;
      relatedQuestions = getRelatedQuestions("onboarding");
      break;

    case "cancel":
      reply = getCancelTemplate().answer;
      relatedQuestions = getRelatedQuestions("cancel");
      break;

    case "contract":
      reply = getContractTemplate().answer;
      relatedQuestions = getRelatedQuestions("contract");
      break;

    case "greeting":
      reply = [
        "こんにちは！😊 Discovery AIへようこそ。",
        "どのようなことをお探しでしょうか？",
        "よくあるご質問もご参考になるかもしれません：",
      ].join("\n");
      relatedQuestions = getRelatedQuestions("greeting");
      break;

    case "other": {
      const fallback = await getFallbackResponse(message);
      reply = fallback.answer;
      relatedQuestions = getRelatedQuestions("other");
      break;
    }

    default:
      reply = "ご質問の意図をもう少し詳しくお聞きしてもよろしいでしょうか？";
      relatedQuestions = getRelatedQuestions("faq");
      break;
  }

  updatedHistory.push({ role: "assistant", content: reply });
  return res.json({ reply, updatedHistory, relatedQuestions });
});

app.listen(PORT, () => {
  console.log(`🚀 サーバー起動: http://localhost:${PORT}`);
  console.log("✅ /api/chat エンドポイント待機中");
});
