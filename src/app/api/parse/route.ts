// src/app/api/parse/route.ts
import { NextRequest, NextResponse } from "next/server";
import { ingestFile } from "@/lib/fileIngestor";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "未上傳任何檔案" }, { status: 400 });
  }

  try {
    const paragraphs = await ingestFile(file);
    return NextResponse.json({ paragraphs });
  } catch (err) {
    console.error("❌ 檔案處理錯誤：", err);
    return NextResponse.json({ error: "檔案處理失敗" }, { status: 500 });
  }
}
