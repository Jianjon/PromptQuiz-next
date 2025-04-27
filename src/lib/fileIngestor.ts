import { readPDF } from "./fileReaders/pdfReader";
import { readTXT } from "./fileReaders/txtReader";
import { readDocx } from "./fileReaders/docxReader";
import { readExcel } from "./fileReaders/excelReader";
import { ExtractedParagraph } from "@/types/extracted";

export async function ingestFile(file: File): Promise<ExtractedParagraph[]> {
  const ext = file.name.split(".").pop()?.toLowerCase();

  switch (ext) {
    case "pdf":
      return await readPDF(file);
    case "txt":
      return await readTXT(file);
    case "docx":
      return await readDocx(file);
    case "xlsx":
      return await readExcel(file);
    default:
      throw new Error(`不支援的檔案格式：${ext}`);
  }
}
