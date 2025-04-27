// src/lib/agents/questionPlanner.ts
import { callGPT } from "../gpt";
import { decideAIStrategy } from "../aiController";
import { buildQuestionPlannerPrompt } from "../promptTemplates";
import { QuizSettings } from "../settings";
import { ExtractedParagraph } from "../../types/extracted";

/**
 * PlanItem 定義：題目規劃單位
 */
export interface PlanItem {
  /** 主題文字 */
  topic: string;
  /** 題型，例如單選、多選 */
  questionType: QuizSettings["questionType"];
  /** 難度等級 */
  difficulty: QuizSettings["difficulty"];
}

/**
 * planQuestions
 * 根據主題列表、使用者設定與 AI 策略，呼叫 GPT 產出題目規劃
 */
export async function planQuestions(
  topics: string[],
  settings: QuizSettings,
  inputText: string,
  paragraphs: ExtractedParagraph[]
): Promise<PlanItem[]> {
  // 根據輸入與段落決策 AI 使用策略
  const strategy = decideAIStrategy(inputText, paragraphs);

  // 動態選模型：理性模式大量段落 -> gpt-4.1-mini，否則完整版 gpt-4.1；創造模式使用 nano
  const model =
    strategy.mode === "rational"
      ? paragraphs.length > 50
        ? "gpt-4.1-mini"
        : "gpt-4.1"
      : "gpt-4.1-nano";

  const prompt = buildQuestionPlannerPrompt(topics, settings, strategy);
  const raw = await callGPT({ prompt, temperature: strategy.temperature, model });

  try {
    // 解析為 PlanItem 陣列
    const plans = JSON.parse(raw) as PlanItem[];
    return plans;
  } catch (err) {
    console.error("QuestionPlanner JSON parse error", err);
    throw new Error("QuestionPlanner：解析 GPT 回應失敗");
  }
}
