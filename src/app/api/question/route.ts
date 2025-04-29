import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { saveQuestions, getQuestionsByQuizId } from "@/lib/db/questionDb"; // 我們會一起做 questionDb.ts

// 批量新增題目
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { quizId, questions } = body;

    if (!quizId || !Array.isArray(questions)) {
      return NextResponse.json({ message: "資料不完整" }, { status: 400 });
    }

    const questionData = questions.map((q: any) => ({
      id: uuidv4(),
      quizId,
      text: q.question,
      options: q.options,
      correctAnswers: q.answer,
      explanation: q.explanation,
      createdAt: new Date().toISOString(),
    }));

    await saveQuestions(questionData);

    return NextResponse.json({ status: "success", count: questionData.length });
  } catch (error: any) {
    console.error("[QuestionCreateError]", error);
    return NextResponse.json({ message: "伺服器錯誤" }, { status: 500 });
  }
}

// 取得某題組的所有題目
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const quizId = searchParams.get("quizId");

    if (!quizId) {
      return NextResponse.json({ message: "缺少 quizId" }, { status: 400 });
    }

    const questions = await getQuestionsByQuizId(quizId);
    return NextResponse.json({ questions });
  } catch (error: any) {
    console.error("[QuestionGetError]", error);
    return NextResponse.json({ message: "伺服器錯誤" }, { status: 500 });
  }
}
