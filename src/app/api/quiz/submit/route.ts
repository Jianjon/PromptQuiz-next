// src/app/api/quiz/submit/route.ts
import { NextRequest, NextResponse } from "next/server";
import { saveSubmission } from "@/lib/quizStore";
import { generateFeedback } from "@/lib/feedback";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, user, questions } = body;

    if (!id || !user || !Array.isArray(questions)) {
      return NextResponse.json({ error: "參數不完整" }, { status: 400 });
    }

    // 儲存作答紀錄（Mock 模式）
    const submission = {
      id,
      user,
      answers: questions.map((q: any) => ({
        question: q.question,
        userAnswer: q.userAnswer,
        correctAnswer: q.correctAnswer,
      })),
      submittedAt: new Date().toISOString(),
    };
    saveSubmission(id, submission);

    // 產生 AI 回饋（選填）
    const feedback = await generateFeedback(questions);

    return NextResponse.json({ feedback });
  } catch (err) {
    console.error("❌ 作答送出失敗", err);
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}
