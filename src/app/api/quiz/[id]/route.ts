// src/app/api/quiz/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getQuiz } from "@/lib/quizStore";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop(); // 從 URL 中取出 [id]

  if (!id) {
    return NextResponse.json({ error: "缺少題組 ID" }, { status: 400 });
  }

  const quiz = getQuiz(id);

  if (!quiz) {
    return NextResponse.json({ error: "找不到該題組" }, { status: 404 });
  }

  return NextResponse.json(quiz);
}
