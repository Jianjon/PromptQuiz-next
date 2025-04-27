// app/api/response/submit/route.ts

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { questions } = await req.json();

  if (!Array.isArray(questions)) {
    return NextResponse.json(
      { error: "無效的題目格式" },
      { status: 400 }
    );
  }

  // 1. 計算作答成績
  const total = questions.length;
  const correct = questions.filter(
    (q) => q.userAnswer === q.correctAnswer
  ).length;

  // 2. 抽取錯題主題（或題目）用於 RAG 查詢
  const wrongTopics = questions
    .filter((q) => q.userAnswer !== q.correctAnswer)
    .map((q) => q.question);

  // 3. 向 RAG 知識庫查詢補充內容
  let supplementalContent = "";
  try {
    const ragRes = await fetch(
      `${process.env.BASE_URL}/api/rag/query`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wrongTopics }),
      }
    );
    const ragData = await ragRes.json();
    supplementalContent = ragData.supplementalContent || "";
  } catch (err) {
    console.error("RAG 查詢錯誤", err);
  }

  // 4. 準備 GPT 分析輸入
  const feedbackInput = {
    total,
    correct,
    questions: questions.map((q) => ({
      question: q.question,
      userAnswer: q.userAnswer,
      correctAnswer: q.correctAnswer,
    })),
    supplementalContent,
  };

  // 5. 呼叫 GPT 建議模組
  let suggestion = "";
  try {
    const gptRes = await fetch(
      `${process.env.BASE_URL}/api/gpt/suggestion`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedbackInput),
      }
    );
    const gptData = await gptRes.json();
    suggestion = gptData.suggestion || "";
  } catch (err) {
    console.error("GPT 建議模組錯誤", err);
  }

  // 6. 回傳完整回饋
  return NextResponse.json({
    total,
    correct,
    supplementalContent,
    suggestion,
  });
}
