"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function QuizAdminPage() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch(`/api/quiz/${id}`);
        const data = await res.json();
        if (res.ok) setQuiz(data);
        else throw new Error(data.error || "讀取失敗");
      } catch (err: any) {
        setError(err.message || "無法載入題組");
      }
    };
    fetchQuiz();
  }, [id]);

  if (error) return <div className="p-6 text-red-500 text-center">{error}</div>;
  if (!quiz) return <div className="p-6 text-gray-500 text-center">載入中...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📊 題組管理頁（創建者預覽）</h1>

      <div className="mb-6 p-4 bg-white border rounded shadow">
        <h2 className="text-lg font-semibold mb-2">🧾 題組資訊</h2>
        <p><strong>ID：</strong> {quiz.id}</p>
        <p><strong>建立時間：</strong> {quiz.createdAt}</p>
        <p><strong>題目數：</strong> {quiz.questions.length}</p>
      </div>

      <div className="mb-6 p-4 bg-white border rounded shadow">
        <h2 className="text-lg font-semibold mb-2">⚙️ Meta 設定</h2>
        <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
          <li>是否公開：{quiz.meta?.isPublic ? "✅ 是" : "❌ 否"}</li>
          <li>作答後顯示 AI 回饋：{quiz.meta?.showFeedback ? "✅ 是" : "❌ 否"}</li>
          <li>作答後顯示正確答案：{quiz.meta?.showAnswersAfterSubmit ? "✅ 是" : "❌ 否"}</li>
          <li>啟用作答統計功能：{quiz.meta?.enableStats ? "✅ 是" : "❌ 否"}</li>
          <li>評分方式：{quiz.meta?.scoringMode || "none"}</li>
        </ul>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">📋 題目預覽</h2>
        <div className="space-y-4">
          {quiz.questions.map((q: any, index: number) => (
            <div key={index} className="p-4 border rounded bg-gray-50">
              <div className="mb-2 font-medium">{index + 1}. {q.question}</div>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {q.options.map((opt: string, i: number) => (
                  <li key={i} className={opt === q.answer ? "font-semibold text-green-700" : ""}>{opt}</li>
                ))}
              </ul>
              {q.explanation && (
                <p className="text-xs text-gray-500 mt-2">💡 {q.explanation}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 text-sm text-gray-400 text-center border-t">
        ※ 作答紀錄與統計分析功能尚未實作
      </div>
    </div>
  );
}