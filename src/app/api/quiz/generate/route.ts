// app/api/quiz/generate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { generateQuiz } from "@/lib/orchestrator";

export async function POST(req: NextRequest) {
  try {
    const { inputText, paragraphs, settings } = await req.json();
    const result = await generateQuiz({ inputText, paragraphs, settings });
    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    console.error("❌ generateQuiz error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
