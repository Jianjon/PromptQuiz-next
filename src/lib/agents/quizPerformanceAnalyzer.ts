import { openai } from "@/lib/gpt";

interface UserInfo {
  name: string;
  email: string;
  organization: string;
}

interface QuizResult {
  question: string;
  correct: boolean;
  userAnswer: string;
  correctAnswer: string;
}

export async function analyzeQuizPerformance(
  userInfo: UserInfo,
  quizResults: QuizResult[]
): Promise<string> {
  const wrongAnswers = quizResults.filter((q) => !q.correct);

  if (wrongAnswers.length === 0) {
    return "🎉 恭喜你全部答對！你的基礎概念非常扎實，建議可以挑戰進階練習或模擬正式考試。";
  }

  const prompt = `
你是一位專業的考試輔導老師，請根據以下資訊，為學生提供個人化的學習補強建議：

學生資料：
- 姓名：${userInfo.name}
- Email：${userInfo.email}
- 單位：${userInfo.organization}

錯誤題目如下（每題包含使用者答案與正確答案）：
${wrongAnswers.map((w, idx) => `
題目${idx + 1}：${w.question}
使用者回答：${w.userAnswer}
正確答案：${w.correctAnswer}
`).join("\n")}

請針對每一題，依照下列格式產出內容：
- 🧠 正確觀念補充（至少100字）
- 🚨 常見錯誤提醒（為何容易出錯）
- 📚 推薦補強章節或關鍵知識點

語氣需溫和專業，鼓勵學生持續進步。
請直接回覆整理好的建議內容，禁止任何多餘開場白或結語。
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "你是一位專業考試輔導老師，只負責分析錯題並提供正確觀念與補強建議。" },
      { role: "user", content: prompt }
    ],
    temperature: 0.3,
  });

  const raw = response.choices?.[0]?.message?.content || "⚠️ 無法取得AI建議，請稍後再試。";

  return raw.trim();
}
