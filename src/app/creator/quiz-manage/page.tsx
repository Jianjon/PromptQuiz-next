"use client";

import React, { useEffect, useState } from "react";

type Quiz = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  isPublic: boolean;
};

export default function QuizManagePage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/quiz");
      const data = await res.json();
      setQuizzes(data.quizzes || []);
    } catch (err) {
      console.error("無法取得題組資料", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (quizId: string) => {
    if (!confirm("確定要刪除這個題組嗎？")) return;

    try {
      const res = await fetch(`/api/quiz/${quizId}`, { method: "DELETE" });

      if (res.ok) {
        setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
      } else {
        const errorData = await res.json();
        alert(`刪除失敗：${errorData.error || "請稍後再試"}`);
      }
    } catch (err) {
      console.error("刪除失敗", err);
      alert("刪除失敗，請檢查網路連線或伺服器狀態");
    }
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">管理題組</h1>

      {loading ? (
        <p>載入中...</p>
      ) : (
        <div className="space-y-4">
          {quizzes.length === 0 ? (
            <p>目前尚無題組，請先建立！</p>
          ) : (
            quizzes.map((quiz) => (
              <div key={quiz.id} className="border p-4 rounded bg-gray-50">
                <h2 className="text-xl font-semibold">{quiz.title}</h2>
                <p className="text-gray-600 mb-2">{quiz.description}</p>
                <p className="text-sm text-gray-400">
                  建立於 {new Date(quiz.createdAt).toLocaleString()}
                </p>

                <div className="flex gap-4 mt-4">
                  {/* 未來可加：查看題目按鈕 */}
                  <button
                    onClick={() => handleDelete(quiz.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    刪除題組
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
