import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { saveQuiz, getAllQuizzes } from "@/lib/db/quizDb"; // 我們會另外做 quizDb.ts 管理資料

// 建立題組
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, questions } = body;

    if (!title || !Array.isArray(questions)) {
      return NextResponse.json({ message: "資料不完整" }, { status: 400 });
    }

    const quizId = uuidv4();

    // 儲存題組基本資料
    await saveQuiz({
      id: quizId,
      title,
      description,
      createdAt: new Date().toISOString(),
      isPublic: false,
    });

    // 儲存每個題目（後續做 /api/question）
    // (先略過，下一步會做)

    return NextResponse.json({ status: "success", quizId });
  } catch (error: any) {
    console.error("[QuizCreateError]", error);
    return NextResponse.json({ message: "伺服器錯誤" }, { status: 500 });
  }
}

// 取得所有題組
export async function GET() {
  try {
    const quizzes = await getAllQuizzes();
    return NextResponse.json({ quizzes });
  } catch (error: any) {
    console.error("[QuizGetError]", error);
    return NextResponse.json({ message: "伺服器錯誤" }, { status: 500 });
  }
}
