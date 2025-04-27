// src/lib/agents/knowledgeSynthesizer.ts
import { ExtractedParagraph } from "../../types/extracted";
import { callGPT } from "../gpt";
import { decideAIStrategy } from "../aiController";
import { AIStrategy } from "../aiController";

export type SynthesizedTopic = {
  topic: string;
  summary: string;
  keyPoints: string[];
  paragraphs: string[];
};

/**
 * synthesizeKnowledge
 * 根據段落列表，使用動態模型與策略進行主題整理
 */
export async function synthesizeKnowledge(
  paragraphs: ExtractedParagraph[]
): Promise<SynthesizedTopic[]> {
  const content = paragraphs.map((p) => p.content).join("\n\n");

  // 決定 AI 策略（此處僅依段落長度使用 rational 模式）
  const strategy: AIStrategy = decideAIStrategy("", paragraphs);

  // 動態選模型：長文本用 3.5-turbo-16k 或 o4-mini-high
  const model =
    paragraphs.length > 50
      ? "gpt-3.5-turbo-16k"
      : "o4-mini-high";

  const systemPrompt = `
你是一位知識整理專家，請根據輸入內容進行主題整理：
- 根據內容劃分 2～4 個主題（topic）
- 每個主題需包含一段 summary、數個重點 keyPoints，以及出處段落。
- 回覆格式為 JSON 陣列。
- 嚴格遵守 JSON 格式，禁止加入多餘說明文字。

格式如下：
[
  {
    "topic": "主題名稱",
    "summary": "摘要說明",
    "keyPoints": ["重點1", "重點2"],
    "paragraphs": ["段落文字1", "段落文字2"]
  }
]
`;

  const prompt = `${systemPrompt}\n${content}`;

  const raw = await callGPT({
    prompt,
    temperature: strategy.temperature,
    model,
  });

  try {
    return JSON.parse(raw) as SynthesizedTopic[];
  } catch (err) {
    console.error("KnowledgeSynthesizer JSON parse error", err);
    return [];
  }
}
