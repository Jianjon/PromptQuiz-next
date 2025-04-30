// src/app/api/quiz/route.ts
import { NextResponse } from "next/server";
import { getAllQuizzes } from "@/lib/db/quizDb";

export async function GET() {
  try {
    const quizzes = await getAllQuizzes();

    const result = quizzes.map((q) => ({
      id: q.id,
      title: q.title,
      description: q.description,
      createdAt: q.createdAt,
      isPublic: q.isPublic,
    }));

    return NextResponse.json({ quizzes: result });
  } catch (error) {
    console.error("[API QUIZ LIST ERROR]", error);
    return NextResponse.json({ error: "Failed to fetch quizzes" }, { status: 500 });
  }
}
