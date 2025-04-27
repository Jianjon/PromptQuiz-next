// src/lib/orchestrator.ts

import { ExtractedParagraph } from "../types/extracted";
import { synthesizeKnowledge, SynthesizedTopic } from "./agents/knowledgeSynthesizer";
import { planQuestions, PlanItem } from "./agents/questionPlanner";
import { composeQuestions, ComposedQuestion } from "./agents/questionComposer";
import { checkQuality, QualityCheckResult } from "./agents/qualityChecker";
import { QuizSettings } from "./settings";
import { decideAIStrategy, AIStrategy } from "./aiController";

export interface GenerateQuizOptions {
  /** 使用者輸入的文字；若為檔案出題，此處可傳空字串 */
  inputText: string;
  /** 上傳檔案後 ExtractedParagraph[]；若沒有檔案則為空陣列 */
  paragraphs?: ExtractedParagraph[];
  /** 出題設定：難度、題型、數量等 */
  settings: QuizSettings;
}

export interface GenerateQuizResult {
  topics: string[];
  plans: PlanItem[];
  composed: ComposedQuestion[];
  quality: QualityCheckResult[];
  strategy: AIStrategy;
}

/**
 * generateQuiz
 * 1. 若有 paragraphs，呼叫 Knowledge Synthesizer 撈主題；否則，以 inputText 當單一主題
 * 2. 根據 topics 與 settings 呼叫 Question Planner
 * 3. 依 Planner 回傳的 PlanItem[] 與相同策略呼叫 Question Composer
 * 4. 最後以相同策略呼叫 Quality Checker，回傳檢查結果
 */
export async function generateQuiz(
  opts: GenerateQuizOptions
): Promise<GenerateQuizResult> {
  const { inputText, paragraphs = [], settings } = opts;

  // 1️⃣ 決策 AI 策略
  const strategy = decideAIStrategy(inputText, paragraphs);

  // 2️⃣ 主題決定
  let topics: string[];
  if (paragraphs.length > 0) {
    const synthesized: SynthesizedTopic[] = await synthesizeKnowledge(paragraphs);
    topics = synthesized.map((s) => s.topic);
  } else {
    topics = [inputText];
  }

  // 3️⃣ 擬定題目計畫
  const plans: PlanItem[] = await planQuestions(topics, settings, inputText, paragraphs);

  // 4️⃣ 產生最終題目
  const composed: ComposedQuestion[] = await composeQuestions(plans, strategy);

  // 5️⃣ 品質檢查
  const quality: QualityCheckResult[] = await checkQuality(composed, strategy);

  return { topics, plans, composed, quality, strategy };
}
