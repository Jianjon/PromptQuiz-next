// src/lib/agents/questionValidator.ts

import { callGPT } from "../gpt";
import { ComposedQuestion } from "./questionComposer";

export type ValidationResult = {
  pass: boolean;
  issues?: string[];
  suggestions?: string[];
};

/**
 * 檢查單一題目的結構、邏輯與合理性
 * @param question 單一 ComposedQuestion 題目
 * @returns ValidationResult
 */
export async function validateQuestion(question: ComposedQuestion): Promise<ValidationResult> {
  const prompt = `
你是一位專業考試題目審核員，請依據下列標準檢查此題目是否符合要求：

- 題目敘述是否清楚且無語病？
- 四個選項是否合理且彼此不同？
- 正確答案是否唯一且正確？
- 解釋內容是否充分、有邏輯，且支持正確答案？
- 無歧義、無多解或模糊不清的情況？

請以**純 JSON 格式**回覆，格式範例如下（不要加任何其他說明文字）：

{
  "pass": true 或 false,
  "issues": ["若有問題，列出每一項問題"],
  "suggestions": ["若有建議修正，列出建議"]
}

請審查下列題目資料：
${JSON.stringify(question, null, 2)}
`;

  const raw = await callGPT({
    prompt,
    temperature: 0.2,
    model: "gpt-4-turbo" // 可換成 gpt-4.1-mini 看你的偏好
  });

  try {
    return JSON.parse(raw.trim());
  } catch (err) {
    console.error("❌ QuestionValidatorAgent 解析失敗：", err);
    return {
      pass: false,
      issues: ["無法解析 GPT 回應，請檢查題目或重新審查。"],
    };
  }
}
