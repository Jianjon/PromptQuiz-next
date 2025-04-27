// src/lib/fileReaders/webScraper.ts

import * as cheerio from "cheerio";
import fetch from "node-fetch";
import { ExtractedParagraph } from "@/types/extracted";

export async function scrapeWebsite(url: string): Promise<ExtractedParagraph[]> {
  try {
    const res = await fetch(url);
    const html = await res.text();
    const $ = cheerio.load(html);

    const paragraphs: ExtractedParagraph[] = [];

    $("p, h1, h2, h3").each((_, el) => {
      const tag = el.tagName?.toLowerCase() || "p";
      const content = $(el).text().trim();

      if (content.length > 10) {
        paragraphs.push({
          source: url,
          content,
          type: tag === "p" ? "normal" : "heading",
        });
      }
    });

    return paragraphs;
  } catch (err) {
    console.error("❌ 網頁擷取失敗", err);
    return [];
  }
}
