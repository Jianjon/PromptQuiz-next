// app/api/rag/query/route.ts

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { wrongTopics } = await req.json();
    if (!Array.isArray(wrongTopics)) {
      return NextResponse.json(
        { error: "請提供 wrongTopics 陣列" },
        { status: 400 }
      );
    }

    // 暫時先不接 RAG，直接回傳空字串
    // 日後要啟用 RAG 時，再改成呼叫 getSupplementalContent()
    const supplementalContent = "";

    return NextResponse.json({ supplementalContent });
  } catch (err) {
    console.error("RAG 查詢失敗", err);
    return NextResponse.json(
      { error: "RAG 查詢過程發生錯誤" },
      { status: 500 }
    );
  }
}
