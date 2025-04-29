import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { saveQuestions } from "@/lib/db/questionDb"; // 使用相同的儲存邏輯

// 匯入 Excel 題庫資料（無 quizId，可日後補上）
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { questions } = body;

    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json({ message: "未提供有效題目資料" }, { status: 400 });
    }

    const generatedQuizId = uuidv4(); // 預設建立一個新 quizId，或改成由前端提供

    const questionData = questions.map((q: any) => ({
      id: uuidv4(),
      quizId: generatedQuizId,
      text: q.question,
      options: q.options,
      correctAnswers: [q.correctAnswer], // 包成陣列格式
      explanation: q.explanation || "",
      createdAt: new Date().toISOString(),
    }));

    await saveQuestions(questionData);

    return NextResponse.json({
      status: "success",
      quizId: generatedQuizId,
      count: questionData.length,
    });
  } catch (error: any) {
    console.error("[ExcelUploadError]", error);
    return NextResponse.json({ message: "伺服器錯誤" }, { status: 500 });
  }
}
