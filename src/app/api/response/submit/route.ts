import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { questions } = await req.json();

  if (!Array.isArray(questions)) {
    return NextResponse.json({ error: "無效的題目格式" }, { status: 400 });
  }

  // 統計答對題數
  const total = questions.length;
  const correct = questions.filter((q) => q.userAnswer === q.correctAnswer).length;

  // 準備傳送給 GPT 的摘要格式
  const feedbackInput = {
    total,
    correct,
    questions: questions.map((q) => ({
      question: q.question,
      userAnswer: q.userAnswer,
      correctAnswer: q.correctAnswer,
    })),
  };

  // 呼叫 GPT 回饋模組（你等等會實作的）
  const gptRes = await fetch(`${process.env.BASE_URL}/api/gpt/suggestion`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(feedbackInput),
  });

  const gptData = await gptRes.json();

  return NextResponse.json({ feedback: gptData });
}
