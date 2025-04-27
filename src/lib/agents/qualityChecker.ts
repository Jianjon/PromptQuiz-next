// src/lib/agents/qualityChecker.ts
import { callGPT } from "../gpt";
import { AIStrategy } from "../aiController";
import { ComposedQuestion } from "./questionComposer";

/**
 * 品質檢查結果格式
 */
export interface QualityCheckResult {
  question: ComposedQuestion;
  passed: boolean;
  issues?: string[];
}

/**
 * checkQuality
 * 根據 AI 策略，對每題進行邏輯與語意檢查，回傳檢查結果
 */
export async function checkQuality(
  questions: ComposedQuestion[],
  strategy: AIStrategy
): Promise<QualityCheckResult[]> {
  const results: QualityCheckResult[] = [];
  for (const q of questions) {
    // 動態選模型：理性模式用完整版 GPT-4.1，創造模式用 mini 版
    const model = strategy.mode === "rational" ? "gpt-4.1" : "gpt-4.1-mini";
    // 固定低溫度，降低隨機性
    const temperature = 0.2;

    // 建立檢查 Prompt
    const prompt = `
你是一個嚴謹的品質檢查 AI。
請檢查以下題目是否有邏輯錯誤、選項重複或語意不通。

回傳 JSON 格式：
{
  "passed": boolean,
  "issues": string[]
}

題目：${JSON.stringify(q)}
`;

    // 呼叫 GPT 進行檢查
    const raw = await callGPT({ prompt, temperature, model });
    try {
      const parsed = JSON.parse(raw);
      results.push({
        question: q,
        passed: parsed.passed,
        issues: parsed.issues,
      });
    } catch (err) {
      console.warn("QualityChecker JSON parse error", err);
      results.push({
        question: q,
        passed: false,
        issues: ["解析 GPT 回應失敗"],
      });
    }
  }
  return results;
}
