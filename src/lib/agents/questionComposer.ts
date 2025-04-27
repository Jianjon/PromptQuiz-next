// src/lib/agents/questionComposer.ts
import { callGPT } from "../gpt";
import { buildQuestionComposerPrompt } from "../promptTemplates";
import { AIStrategy } from "../aiController";
import { PlanItem } from "./questionPlanner";

/**
 * 最終產生的題目格式
 */
export interface ComposedQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

/**
 * composeQuestions
 * 根據 PlanItem 與 AI 策略，逐題呼叫 GPT 生成題目
 */
export async function composeQuestions(
  plans: PlanItem[],
  strategy: AIStrategy
): Promise<ComposedQuestion[]> {
  const results: ComposedQuestion[] = [];

  for (const plan of plans) {
    // 創造模式用 nano，理性模式用 mini
    const model =
      strategy.mode === "creative" ? "gpt-4.1-nano" : "gpt-4.1-mini";

    const prompt = buildQuestionComposerPrompt(plan, strategy);

    // 呼叫 GPT
    const raw = await callGPT({
      prompt,
      temperature: strategy.temperature,
      model,
    });

    try {
      // 解析成 ComposedQuestion
      const q = JSON.parse(raw) as ComposedQuestion;
      results.push(q);
    } catch (err) {
      console.warn("Composer JSON parse error:", err);
      // 若解析失敗，塞入 fallback
      results.push({
        question: `示例題：請針對「${plan.topic}」出題。`,
        options: ["選項 A", "選項 B", "選項 C", "選項 D"],
        answer: "選項 A",
        explanation: "示例解析。",
      });
    }
  }

  return results;
}
