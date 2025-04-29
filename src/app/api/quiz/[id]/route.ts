// src/app/api/quiz/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getQuizById, deleteQuiz } from "@/lib/db/quizDb"; // 改接 quizDb 而非 quizStore

// 取得單一題組
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const quizId = params.id;

  if (!quizId) {
    return NextResponse.json({ error: "缺少題組 ID" }, { status: 400 });
  }

  const quiz = await getQuizById(quizId);

  if (!quiz) {
    return NextResponse.json({ error: "找不到該題組" }, { status: 404 });
  }

  return NextResponse.json(quiz);
}

// 刪除單一題組
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const quizId = params.id;

  if (!quizId) {
    return NextResponse.json({ error: "缺少題組 ID" }, { status: 400 });
  }

  const existingQuiz = await getQuizById(quizId);
  if (!existingQuiz) {
    return NextResponse.json({ error: "找不到該題組" }, { status: 404 });
  }

  await deleteQuiz(quizId);

  return NextResponse.json({ message: "題組刪除成功", quizId });
}
