// src/lib/knowledgeSynthesizer.ts
import { ExtractedParagraph } from "@/types/extracted";

export function synthesizeTopics(paragraphs: ExtractedParagraph[]): string[] {
  const keywords: Record<string, number> = {};

  paragraphs.forEach(p => {
    const words = p.content
      .replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, " ")
      .split(/\s+/)
      .filter(w => w.length > 2);
    words.forEach(w => {
      keywords[w] = (keywords[w] || 0) + 1;
    });
  });

  return Object.entries(keywords)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([word]) => word);
}
