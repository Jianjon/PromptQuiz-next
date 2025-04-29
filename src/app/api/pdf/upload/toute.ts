import { NextResponse } from "next/server";
import { parseFileToSegments } from "@/lib/pdfLoader";
import { v4 as uuidv4 } from "uuid";

// 上傳設定（限制10MB）
export const config = {
  api: {
    bodyParser: false,
  },
  sizeLimit: "10mb",
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ message: "未收到檔案" }, { status: 400 });
    }

    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith(".pdf") && !fileName.endsWith(".txt") && !fileName.endsWith(".docx")) {
      return NextResponse.json({ message: "只支援 PDF、TXT、Word 檔案" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 呼叫切段處理
    const segments = await parseFileToSegments(fileName, buffer);

    // 產生 fileId
    const fileId = uuidv4();

    // （此處可預留：將段落向量化儲存，未來版本）

    return NextResponse.json({
      status: "success",
      fileId,
      filename: file.name,
      segments,
    });
  } catch (error: any) {
    console.error("[UploadError]", error);
    return NextResponse.json({ message: "伺服器錯誤，請稍後再試" }, { status: 500 });
  }
}
