import { NextResponse } from "next/server";
import { generateQuestionsFromText } from "@/lib/gpt";

export async function POST(req: Request) {
  const { content, settings } = await req.json();

  if (!content || content.trim().length === 0) {
    return NextResponse.json({ error: "缺少輸入內容" }, { status: 400 });
  }

  try {
    const questions = await generateQuestionsFromText(content, settings);
    return NextResponse.json({ questions });
  } catch (error) {
    console.error("GPT 出題錯誤：", error);
    return NextResponse.json({ error: "題目產生失敗" }, { status: 500 });
  }
}