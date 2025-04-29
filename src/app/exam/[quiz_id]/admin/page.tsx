// src/app/quiz/[id]/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function QuizAdminPage() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      const res = await fetch(`/api/quiz/${id}`);
      const data = await res.json();
      setQuiz(data);
    };
    fetchQuiz();
  }, [id]);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${window.location.origin}/quiz/${id}/start`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!quiz) {
    return <div className="text-center text-gray-400 mt-20">📦 載入中...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📋 題組管理控制台</h1>

      <div className="border p-4 rounded bg-white shadow space-y-4 text-sm">
        <div><strong>題組 ID：</strong> {quiz.id}</div>
        <div><strong>建立時間：</strong> {new Date(quiz.createdAt).toLocaleString()}</div>
        <div><strong>題目數量：</strong> {quiz.questions.length} 題</div>

        <div>
          <strong>分享連結：</strong>
          <div className="flex items-center mt-1 gap-2">
            <code className="text-xs p-1 bg-gray-100 rounded border">
              /quiz/{quiz.id}/start
            </code>
            <button
              onClick={handleCopy}
              className="text-xs px-2 py-1 bg-blue-600 text-white rounded"
            >
              {copied ? "✅ 已複製" : "📎 複製"}
            </button>
          </div>
        </div>

        <div className="mt-4">
          <h2 className="font-semibold mb-1">🔒 顯示設定（meta）</h2>
          <ul className="list-disc ml-5 space-y-1">
            <li>是否公開：{quiz.meta?.isPublic ? "✅ 是" : "❌ 否"}</li>
            <li>是否顯示 GPT 回饋：{quiz.meta?.showFeedback ? "✅ 是" : "❌ 否"}</li>
            <li>作答後揭曉答案：{quiz.meta?.showAnswersAfterSubmit ? "✅ 是" : "❌ 否"}</li>
            <li>允許觀看統計結果：{quiz.meta?.enableStats ? "✅ 是" : "❌ 否"}</li>
            <li>分數顯示模式：{quiz.meta?.scoringMode || "none"}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
