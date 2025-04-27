// src/lib/feedback.ts
export async function generateFeedback(questions: any[]) {
    // 模擬 GPT 回饋
    return {
      summary: "感謝你的作答，以下是系統的分析與建議：",
      suggestions: questions.map((q, i) =>
        `第 ${i + 1} 題：${q.userAnswer === q.correctAnswer ? "作答正確" : "建議再複習這個概念"}`
      ),
    };
  }
  