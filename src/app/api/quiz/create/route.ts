import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { saveQuiz } from "@/lib/quizStore";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { questions, settings, meta } = body;

    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json({ error: "無效的題組資料" }, { status: 400 });
    }

    const id = uuidv4();
    const quiz = {
      id,
      createdAt: new Date().toISOString(),
      settings,
      meta,
      questions,
    };

    saveQuiz(quiz); // ✅ 儲存到模擬資料庫

    return NextResponse.json({ id });
  } catch (error) {
    console.error("❌ 題組儲存失敗：", error);
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}
