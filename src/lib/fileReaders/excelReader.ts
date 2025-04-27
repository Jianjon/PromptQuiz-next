// src/lib/fileReaders/excelReader.ts
import * as XLSX from "xlsx";
import { ExtractedParagraph } from "@/types/extracted";

export async function readExcel(file: File): Promise<ExtractedParagraph[]> {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "buffer" });

  const paragraphs: ExtractedParagraph[] = [];

  workbook.SheetNames.forEach((sheetName) => {
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

    rows.forEach((row: any) => {
      const text = row.join(" ").trim();
      if (text.length > 0) {
        paragraphs.push({
          source: `${file.name} - ${sheetName}`,
          content: text,
          type: "normal",
        });
      }
    });
  });

  return paragraphs;
}
