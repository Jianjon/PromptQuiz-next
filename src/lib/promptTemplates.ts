// src/lib/promptTemplates.ts
import { QuizSettings } from "./settings";
import { AIStrategy } from "./aiController";

/**
 * 原有單一段落出題的 Prompt 範本
 */
export function getPromptForTopic(
  input: string,
  settings?: {
    difficulty?: string;
    questionType?: string;
    tone?: string;
    length?: string;
    numQuestions?: number;
  }
) {
  const {
    difficulty = "普通",
    questionType = "理解型",
    tone = "正式",
    length = "中等",
    numQuestions = 3,
  } = settings || {};

  return `
你是一位教育題庫設計專家，請根據下方教材內容產出 ${numQuestions} 題選擇題，每題包含：

- 題目（question）
- 四個選項（options）
- 正確答案（answer）
- 簡短解說（explanation）

出題條件如下：
- 難度等級：${difficulty}
- 題型偏好：${questionType}
- 回應語氣：${tone}
- 回應長度：${length}

❗❗❗ 非常重要：
👉 回覆時請**只輸出 JSON 格式**，開頭與結尾皆不得加任何多餘說明文字或「以下是題目」等話語。
👉 不要加「這是你的題目」、「根據你的要求我產出如下」等內容。
👉 JSON 開頭應為 {，結尾為 }，可直接被 JSON.parse 解析。

---

教材內容如下：
${input}

---

請使用以下格式回傳：
{
  "questions": [
    {
      "question": "題幹文字",
      "options": ["選項A", "選項B", "選項C", "選項D"],
      "answer": "正確選項",
      "explanation": "簡短解說"
    }
  ]
}
  `;
}

/**
 * Question Planner Prompt：根據主題列表與設定，擬定題目計畫
 */
export function buildQuestionPlannerPrompt(
  topics: string[],
  settings: QuizSettings,
  strategy: AIStrategy
): string {
  const header = strategy.mode === "creative"
    ? "請發揮創意，為以下主題擬定測驗大綱："
    : "請根據以下主題，擬定精準的測驗大綱：";

  const topicList = topics.map((t, i) => `${i + 1}. ${t}`).join("\n");

  return `
${header}

主題：
${topicList}

請回傳一個 JSON 陣列，每個元素格式：
{"topic":"…","questionType":"${settings.questionType}","difficulty":"${settings.difficulty}"}

建議條數：${settings.numQuestions} 題
溫度：${strategy.temperature}
思考鏈（CoT）：${strategy.chainOfThought ? "啟用" : "關閉"}
`;
}

/**
 * Question Composer Prompt：根據單一計畫項目，生成具體題目
 */
export function buildQuestionComposerPrompt(
  plan: { topic: string; questionType: string; difficulty: string },
  strategy: AIStrategy
): string {
  return `
請根據以下計畫資訊，產出一題${plan.questionType}：

主題：${plan.topic}
難度：${plan.difficulty}

回覆格式（純 JSON）：
{
  "question": "題幹文字",
  "options": ["選項A", "選項B", "選項C", "選項D"],
  "answer": "正確選項",
  "explanation": "簡短解說"
}

溫度：${strategy.temperature}
思考鏈（CoT）：${strategy.chainOfThought ? "啟用" : "關閉"}
`;
}
