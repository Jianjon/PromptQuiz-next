import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";

export const revalidate = 0; // 禁止 cache，確保每次即時拿資料

export async function GET(req: Request) {
  const url = new URL(req.url);
  const limitParam = url.searchParams.get("limit");
  const limit = limitParam ? parseInt(limitParam, 10) : 0;

  if (!limit || limit <= 0) {
    return NextResponse.json(
      { error: "請提供有效的 limit 查詢參數" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("questions")
    .select("id, chapter, question, options, answer, explanation")
    .limit(limit);

  if (error) {
    console.error("❌ 取題失敗", error);
    return NextResponse.json(
      { error: "無法從資料庫取得題目", details: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ questions: data });
}
