'use server';

if (process.env.NODE_ENV !== "production") {
  console.log('DEBUG ENV KEY:', process.env.OPENAI_API_KEY);
}

import OpenAI from "openai";
import { getPromptForTopic } from "./promptTemplates";

/**
 * 初始化 OpenAI 客戶端
 */
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

/**
 * 從原始 GPT 回傳中解析出 JSON 陣列
 */
function extractJSONArray(raw: string): any[] {
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    if (parsed.questions && Array.isArray(parsed.questions)) return parsed.questions;
    return [];
  } catch {
    if (process.env.NODE_ENV !== "production") {
      console.error('❌ JSON parse error, raw content:', raw);
    }
    return [];
  }
}

/**
 * 舊版：直接從純文字 context 生成題目陣列
 */
export async function generateQuestionsFromText(
  content: string,
  settings?: {
    difficulty?: string;
    questionType?: string;
    tone?: string;
    length?: string;
  },
  model: string = "gpt-4"
): Promise<any[]> {
  const prompt = getPromptForTopic(content, settings);

  const response = await openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: "你是一位只能輸出純 JSON 格式題目的 AI 助教。" },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
  });

  const raw = response.choices?.[0]?.message?.content || "";

  if (process.env.NODE_ENV !== "production") {
    console.log("🧠 GPT 回傳原始內容 ↓↓↓");
    console.log(raw);
  }

  const parsed = extractJSONArray(raw);
  if (parsed.length === 0) {
    console.warn("⚠️ GPT 回傳格式錯誤，無法解析為題目");
  }

  return parsed;
}

/**
 * 新版：通用封裝，支援多模型選擇
 */
export async function callGPT(opts: {
  prompt: string;
  temperature?: number;
  model?: string; // 支援多種模型，如 gpt-4.1, gpt-3.5-turbo-16k, o4-mini 等
}): Promise<string> {
  const { prompt, temperature = 0.7, model = "gpt-3.5-turbo" } = opts;
  const res = await openai.chat.completions.create({
    model,
    temperature,
    messages: [
      { role: "system", content: "你是一個有條理且精準的 AI 助手。" },
      { role: "user", content: prompt },
    ],
  });
  return res.choices?.[0]?.message?.content?.trim() ?? "";
}
