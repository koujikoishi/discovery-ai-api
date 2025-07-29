import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

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
  getBillingTemplate,      // ← 追加
} from "./utils/faqTemplate.js";

const allowedOrigins = [
  "https://discovery-ai-ui.vercel.app",
  "http://localhost:3000",
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
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
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

app.post(
  "/api/chat",
  async (req: Request<{}, {}, ChatRequestBody>, res: Response) => {
    console.log("[START] POST /api/chat 受信");
    const { message, history = [] } = req.body;
    console.log("📨 受信メッセージ:", message);

    try {
      if (message.includes("レイアウトテスト")) {
        const reply = getLayoutTestTemplate().answer;
        return res.json({
          reply,
          updatedHistory: [
            ...history,
            { role: "assistant", content: reply },
          ],
          relatedQuestions: getRelatedQuestions("pricing"),
        });
      }

      const skipReplyMessages = [
        "ありがとう",
        "了解",
        "助かります",
        "サンキュー",
        "thanks",
        "thank you",
      ];
      const shortReplies = ["はい", "うん", "そうです", "ok", "いいえ", "no"];
      const normalized = message.trim().toLowerCase();
      const isShort = shortReplies.includes(normalized);
      const introDone = history.some(
        (h) =>
          h.role === "system" && h.content === "recommendation-intro"
      );
      const lastIntentObj = [...history]
        .reverse()
        .find(
          (h) => h.role === "system" && h.content.startsWith("intent:")
        );
      const lastIntent = lastIntentObj?.content.split(":")[1] || null;

      let intent = "";
      if (introDone && lastIntent === "recommendation") {
        intent = "recommendation";
      } else if (isShort && introDone) {
        intent = "recommendation";
      } else {
        console.log("✅ ステップ1: intent分類前");
        intent = await classifyIntent(message);
        console.log("🧭️ intent分類結果:", intent, "← from:", message);
      }

      const updatedHistory: ChatMessage[] = [...history];
      let reply = "";
      let relatedQuestions: string[] = [];

      if (!intent || typeof intent !== "string") {
        reply = "申し訳ありません、ただいま応答ができません。";
        return res.json({ reply, updatedHistory, relatedQuestions: [] });
      }

      if (skipReplyMessages.includes(normalized)) {
        reply =
          "どういたしまして！他にも気になることがあれば、お気軽にどうぞ。";
        return res.json({ reply, updatedHistory, relatedQuestions: [] });
      }

      const alreadyRecommended = history.some((h) =>
        h.role === "assistant"
          ? String(h.content).includes("Starterプランをご提案")
          : false
      );
      if (intent === "recommendation" && alreadyRecommended) {
        reply = "他にも気になる点があればお知らせください。";
        return res.json({ reply, updatedHistory, relatedQuestions: [] });
      }

      if (intent === "recommendation" && introDone && isShort) {
        reply =
          "ありがとうございます。それでは、チームのご利用人数を教えていただけますか？";
        updatedHistory.push({ role: "assistant", content: reply });
        return res.json({
          reply,
          updatedHistory,
          relatedQuestions: getRelatedQuestions("recommendation"),
        });
      }

      switch (intent) {
        case "smalltalk":
          reply = getSmalltalkResponse(message);
          break;

        case "faq":
        case "pricing":
        case "function": {
          const {
            answer: relevantAnswer,
            relatedQuestions: relevant = [],
          } = await getRelevantAnswer(message, updatedHistory, intent);
          reply = relevantAnswer;
          relatedQuestions = relevant;
          updatedHistory.push({
            role: "system",
            content: `intent:${intent}`,
          });
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
          updatedHistory.push({
            role: "system",
            content: "intent:difference",
          });
          break;

        case "billing":
          // 課金タイミング（billing）対応
          reply = getBillingTemplate().answer;
          relatedQuestions = getRelatedQuestions("billing");
          updatedHistory.push({
            role: "system",
            content: "intent:billing",
          });
          break;

        case "recommendation": {
          if (!introDone) {
            reply =
              "ご利用目的に応じて最適なプランをご提案できます。いくつか質問させていただいてもよろしいですか？";
            updatedHistory.push({
              role: "system",
              content: "recommendation-intro",
            });
            updatedHistory.push({
              role: "system",
              content: "intent:recommendation",
            });
          } else {
            const extracted = await extractTeamInfo(message);
            const lastTeam = history
              .find(
                (h) =>
                  h.role === "system" &&
                  h.content.startsWith("team:")
              )
              ?.content.split(":")[1] || null;
            const lastPurpose = history
              .find(
                (h) =>
                  h.role === "system" &&
                  h.content.startsWith("purpose:")
              )
              ?.content.split(":")[1] || null;

            const team = extracted?.teamSize || lastTeam;
            const purpose = extracted?.purpose || lastPurpose;

            if (!team && !purpose) {
              reply = [
                "恐れ入ります、以下のような形式でご回答いただけますか？",
                "・ご利用予定のチーム人数",
                "・主な利用目的（例：FAQ対応、社内ナレッジ、顧客サポート）",
              ].join("\n");
            } else if (team && !purpose) {
              reply =
                "ありがとうございます。あわせて主なご利用目的も教えていただけますか？（例：FAQ対応、社内ナレッジ、顧客サポートなど）";
              updatedHistory.push({
                role: "system",
                content: `team:${team}`,
              });
            } else if (!team && purpose) {
              reply =
                "ありがとうございます。あわせてチームのご利用人数も教えていただけますか？";
              updatedHistory.push({
                role: "system",
                content: `purpose:${purpose}`,
              });
            } else {
              updatedHistory.push({
                role: "system",
                content: `team:${team}`,
              });
              updatedHistory.push({
                role: "system",
                content: `purpose:${purpose}`,
              });
              return res.json({
                reply: `ありがとうございます。おすすめプランをご案内いたします。`,
                updatedHistory,
                relatedQuestions: getRelatedQuestions(
                  "recommendation"
                ),
                teamSize: team,
                purpose: purpose,
              });
            }
          }
          relatedQuestions = getRelatedQuestions("recommendation");
          break;
        }

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

        case "other":
          {
            const fallback = await getFallbackResponse(message);
            reply = fallback.answer;
            relatedQuestions = getRelatedQuestions("other");
          }
          break;

        default:
          reply =
            "ご質問の意図をもう少し詳しくお聞きしてもよろしいでしょうか？";
          relatedQuestions = getRelatedQuestions("faq");
          break;
      }

      updatedHistory.push({ role: "assistant", content: reply });
      return res.json({ reply, updatedHistory, relatedQuestions });
    } catch (error) {
      console.error("❌ サーバーエラー:", error);
      return res.status(500).json({ error: "エラーが発生しました" });
    }
  }
);

app.listen(PORT, () => {
  console.log(`🚀 サーバー起動: http://localhost:${PORT}`);
  console.log(`✅ /api/chat エンドポイント待機中`);
});
