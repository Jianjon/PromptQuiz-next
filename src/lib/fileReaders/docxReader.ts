// src/lib/fileReaders/docxReader.ts
import mammoth from "mammoth";
import { ExtractedParagraph } from "@/types/extracted";

export async function readDocx(file: File): Promise<ExtractedParagraph[]> {
  const arrayBuffer = await file.arrayBuffer();
  const { value } = await mammoth.extractRawText({
    buffer: Buffer.from(arrayBuffer),
  });

  const text = value || "";
  const lines = text.split(/\n+/);

  const textBlocks = lines
  .map((line) => ({
    source: file.name,
    content: line.trim(),
    page: undefined,
    type: "normal",
  }))
  .filter((p) => p.content.length > 0) as ExtractedParagraph[];


  return textBlocks;
}
