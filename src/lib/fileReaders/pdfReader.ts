// src/lib/fileReaders/pdfReader.ts
import { ExtractedParagraph } from "@/types/extracted";
const pdfParse = require("pdf-parse");

export async function readPDF(file: File): Promise<ExtractedParagraph[]> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const data = await (pdfParse as any)(buffer);

  const rawText: string = data.text || "";
  const blocks = rawText.split(/\n\s*\n|\r\n\r\n/); // 段落分段

  const mapped = blocks.map((block: string) => ({
    source: file.name || "uploaded.pdf",
    content: block.trim(),
    page: undefined,
    type: "normal",
  }));

  const paragraphs = mapped.filter(p => p.content.length > 0) as ExtractedParagraph[];

  return paragraphs;
}
