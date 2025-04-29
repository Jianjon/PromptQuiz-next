"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import QuestionUploadPanel from "@/components/QuestionUploadPanel";

interface ParsedQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

export default function UploadPage() {
  const [questions, setQuestions] = useState<ParsedQuestion[]>([]);
  const [showFormat, setShowFormat] = useState(false);
  const router = useRouter();

  const handleUpload = (qs: ParsedQuestion[]) => {
    setQuestions(qs);
  };

  const handleSave = async () => {
    const res = await fetch("/api/question/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questions }),
    });
    if (res.ok) {
      const result = await res.json();
      const quizId = result.quizId;
      alert("題目已成功上傳，前往刷題頁！");
      router.push(`/practice/${quizId}`);
    } else {
      alert("上傳失敗，請檢查格式或重新嘗試。");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">題庫上傳</h1>

      <div className="mb-4 flex items-center gap-4">
        <button
          className="text-blue-600 underline"
          onClick={() => setShowFormat(true)}
        >
          題庫格式說明
        </button>
        {questions.length > 0 && (
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            儲存到題庫
          </button>
        )}
      </div>

      {showFormat && (
        <div className="bg-gray-100 border p-4 rounded mb-4">
          <p className="font-semibold mb-2">Excel 檔案格式：</p>
          <ul className="list-disc pl-6 text-sm">
            <li><b>Question：</b> 題幹（文字）</li>
            <li><b>Options：</b> 以分號區隔選項，例如 A.甲;B.乙;C.丙;D.丁</li>
            <li><b>CorrectAnswer：</b> 正確選項代號（A、B、C…）</li>
            <li><b>Explanation：</b>（可選）解析說明</li>
          </ul>
          <button
            className="mt-2 px-3 py-1 bg-gray-600 text-white rounded"
            onClick={() => setShowFormat(false)}
          >
            關閉說明
          </button>
        </div>
      )}

      <QuestionUploadPanel onUpload={handleUpload} />
    </div>
  );
}
