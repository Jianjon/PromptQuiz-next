import { NextResponse } from "next/server";
import { getQuizById } from "@/lib/db/quizDb";
import { getQuestionsByQuizId } from "@/lib/db/questionDb";

// GET /api/quiz/[quiz_id]
export async function GET(
  req: Request,
  { params }: { params: { quiz_id: string } }
) {
  const quizId = params.quiz_id;

  try {
    const quiz = await getQuizById(quizId);
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    const questions = await getQuestionsByQuizId(quizId);

    const formattedQuiz = {
      id: quiz.id,
      title: quiz.title,
      meta: {
        scoringMode: "number",           // 可改為 "passfail" 或 "none"
        showAnswersAfterSubmit: true,    // 顯示正解與解釋
        showFeedback: false              // 是否顯示 GPT 分析
      },
      questions: questions.map((q) => ({
        id: q.id,
        question: q.text,
        options: q.options,
        answer: q.correctAnswers?.[0] || "", // 只取第一個正確答案
        explanation: q.explanation || "",
      })),
    };

    return NextResponse.json(formattedQuiz);
  } catch (error) {
    console.error("[API QUIZ FETCH ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
