"use client";

import React, { useState } from "react";
import { PracticeQuestion } from "@/types/practice";
import * as XLSX from "xlsx";

interface QuestionUploadPanelProps {
  onQuestionsParsed: (questions: PracticeQuestion[]) => void;
}

export default function QuestionUploadPanel({ onQuestionsParsed }: QuestionUploadPanelProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = evt.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json<any>(sheet);

        const parsed: PracticeQuestion[] = (json || []).map((item: any, idx: number) => ({
          id: `q_${Date.now()}_${idx}`,
          topic: item.topic || "未分類",
          question: item.question || "",
          options: [item.optionA, item.optionB, item.optionC, item.optionD].filter(Boolean),
          answer: item.answer || "",
          explanation: item.explanation || "",
        })).filter(q => q.question && q.options.length >= 2 && q.answer);

        if (parsed.length === 0) {
          setError("未找到有效的題目資料。請確認格式。");
        } else {
          onQuestionsParsed(parsed);
        }
      } catch (err) {
        console.error(err);
        setError("檔案解析錯誤，請確認格式是否正確。");
      } finally {
        setUploading(false);
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="p-4 bg-white rounded shadow space-y-4">
      <h2 className="text-lg font-semibold">📄 上傳題庫檔案</h2>
      <input
        type="file"
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        onChange={handleFileUpload}
        className="block w-full text-sm"
      />
      {uploading && <p className="text-blue-500">📚 解析中，請稍候...</p>}
      {error && <p className="text-red-500">⚠️ {error}</p>}
    </div>
  );
}
