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

        console.log("📊 讀入的原始欄位：", Object.keys(json?.[0] || {}));

        const parsed: PracticeQuestion[] = (json || []).map((item: any, idx: number) => {
          const optionsRaw = [item["選項A"], item["選項B"], item["選項C"], item["選項D"]];
          const options = optionsRaw.filter(opt => typeof opt === "string" && opt.trim() !== "");

          const answerLetter = String(item["答案"] || "").toUpperCase().trim();
          const letterToIndex = { A: 0, B: 1, C: 2, D: 3 };
          const correctIndex = answerLetter in letterToIndex ? letterToIndex[answerLetter as keyof typeof letterToIndex] : -1;
          const correctAnswer = correctIndex >= 0 ? options[correctIndex] : "";

          const q: PracticeQuestion = {
            id: `q_${Date.now()}_${idx}`,
            topic: item["主題"] || "未分類",
            question: item["問題"] || item["題目"] || "",
            options,
            answer: correctAnswer,
            explanation: item["解釋"] || "",
          };

          if (!q.question || q.options.length < 2 || !q.answer) {
            console.warn(`❗ 題目第 ${idx + 2} 筆無效，原因：`, {
              question: q.question,
              options: q.options,
              answer: q.answer
            });
          }

          return q;
        }).filter(q => q.question && q.options.length >= 2 && q.answer);

        if (parsed.length === 0) {
          setError("未找到有效的題目資料（可能是欄位名稱錯誤、缺少選項或答案）。");
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
      <p className="text-sm text-gray-600">
        請使用下列欄位名稱：<br />
        主題、問題 或 題目、答案（正確選項代號 A-D）、選項A、選項B、選項C、選項D、解釋（可選）
      </p>
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
