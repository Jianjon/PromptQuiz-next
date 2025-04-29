import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // 假設你有共用 DB 模組

export async function GET(req: Request, { params }: { params: { quiz_id: string } }) {
  const quizId = params.quiz_id;

  try {
    const quiz = await db.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: true,
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    const formattedQuiz = {
      id: quiz.id,
      title: quiz.title,
      questions: quiz.questions.map((q: any) => ({
        id: q.id,
        text: q.text,
        options: q.options,            // 假設是 string[] 格式
        correctAnswer: q.correct_answers?.[0] || "", // 假設只取第一個正確選項
        explanation: q.explanation || "",
      })),
    };

    return NextResponse.json(formattedQuiz);
  } catch (error) {
    console.error("Fetch quiz error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
