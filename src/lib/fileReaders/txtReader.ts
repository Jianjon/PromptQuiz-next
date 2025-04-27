// src/lib/fileReaders/txtReader.ts

import { ExtractedParagraph } from "@/types/extracted";

export async function readTXT(file: File): Promise<ExtractedParagraph[]> {
  const text = await file.text();
  const lines = text.split(/\n+/); // 依換行切段

  const paragraphs = lines
    .map((line): ExtractedParagraph => ({
      source: file.name,
      content: line.trim(),
      page: undefined,
      type: "normal",
    }))
    .filter((p) => p.content.length > 0);

  return paragraphs;
}
