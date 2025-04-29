import pdfParse from "pdf-parse";
import mammoth from "mammoth";

/**
 * 解析檔案並切成段落
 * @param filename 上傳的檔案名
 * @param buffer 檔案 Buffer
 * @returns Promise<string[]> 段落陣列
 */
export async function parseFileToSegments(filename: string, buffer: Buffer): Promise<string[]> {
  let text = "";

  if (filename.endsWith(".pdf")) {
    const pdfData = await pdfParse(buffer);
    text = pdfData.text;
  } else if (filename.endsWith(".txt")) {
    text = buffer.toString("utf-8");
  } else if (filename.endsWith(".docx")) {
    const result = await mammoth.extractRawText({ buffer });
    text = result.value;
  } else {
    throw new Error("不支援的檔案格式");
  }

  return splitTextIntoSegments(text);
}

/**
 * 根據自然段與字數切割文字
 * @param text 原始文字
 * @returns string[] 切段後的文字陣列
 */
function splitTextIntoSegments(text: string): string[] {
  const rawSegments = text.split(/\n\s*\n/); // 按空行切割
  const processed: string[] = [];

  for (const segment of rawSegments) {
    const clean = segment.trim().replace(/\s+/g, " ");
    if (clean.length < 50) continue; // 過短的不收
    if (clean.length <= 800) {
      processed.push(clean);
    } else {
      // 超過800字的再細分
      for (let i = 0; i < clean.length; i += 500) {
        processed.push(clean.slice(i, i + 500));
      }
    }
  }

  return processed;
}
