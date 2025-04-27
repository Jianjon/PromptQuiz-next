// src/lib/aiController.ts

import { ExtractedParagraph } from "../types/extracted";

export type AIStrategy = {
  mode: 'rational' | 'creative';
  temperature: number;
  chainOfThought: boolean;
};

/**
 * 根據輸入來源與內容，決定使用的 AI 策略
 * @param inputText 使用者原始貼文字（可空）
 * @param extracted 檔案解析後的段落列表（可空）
 */
export function decideAIStrategy(
  inputText: string,
  extracted: ExtractedParagraph[]
): AIStrategy {
  const hasFileData = extracted && extracted.length > 0;
  const isShortInput = !hasFileData && inputText.trim().split(/\s+/).length <= 5;

  if (hasFileData) {
    // 檔案輸入：嚴謹萃取模式
    return {
      mode: 'rational',
      temperature: 0.2,
      chainOfThought: true,
    };
  }

  if (isShortInput) {
    // 簡短文字：高創造模式
    return {
      mode: 'creative',
      temperature: 0.8,
      chainOfThought: false,
    };
  }

  // 默認中間值
  return {
    mode: 'rational',
    temperature: 0.5,
    chainOfThought: false,
  };
}
