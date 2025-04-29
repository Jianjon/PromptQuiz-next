"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function QuizCreatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileId = searchParams.get("fileId"); // 由 upload 頁帶進來

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);
  const [segments, setSegments] = useState<string[]>([]);

  useEffect(() => {
    if (fileId) {
      fetch(`/api/segments/${fileId}`)
        .then(res => res.json())
        .then(data => setSegments(data.segments || []));
    }
  }, [fileId]);

  const addQuestion = () => {
    setQuestions([...questions, { question: "", options: ["", ""], answer: [], explanation: "" }]);
  };

  const addQuestionFromSegment = (segment: string) => {
    setQuestions([...questions, { question: segment, options: ["選項1", "選項2"], answer: [], explanation: "" }]);
  };

  const updateQuestion = (idx: number, field: string, value: any) => {
    const updated = [...questions];
    updated[idx][field] = value;
    setQuestions(updated);
  };

  const saveQuiz = async () => {
    // 儲存題組與題目
    const res = await fetch("/api/quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, questions }),
    });

    if (res.ok) {
      router.push("/creator/quiz-manage");
    } else {
      alert("儲存失敗！");
    }
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">建立新題組</h1>

      {/* 題組基本資料 */}
      <div className="space-y-4 mb-8">
        <input
          type="text"
          placeholder="題組標題"
          className="w-full p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="題組描述"
          className="w-full p-2 border rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* 題目編輯器 */}
      <div className="space-y-6">
        {questions.map((q, idx) => (
          <div key={idx} className="p-4 border rounded bg-gray-100">
            <input
              type="text"
              placeholder="題目內容"
              className="w-full p-2 border rounded mb-2"
              value={q.question}
              onChange={(e) => updateQuestion(idx, "question", e.target.value)}
            />

            {q.options.map((opt: string, i: number) => (
              <input
                key={i}
                type="text"
                placeholder={`選項 ${i + 1}`}
                className="w-full p-2 border rounded mb-2"
                value={opt}
                onChange={(e) => {
                  const updated = [...q.options];
                  updated[i] = e.target.value;
                  updateQuestion(idx, "options", updated);
                }}
              />
            ))}

            {/* 更多選項管理功能可後續擴充 */}
          </div>
        ))}
      </div>

      <div className="flex gap-4 mt-6">
        <button onClick={addQuestion} className="bg-blue-600 text-white px-4 py-2 rounded">新增一題</button>
        {segments.length > 0 && (
          <button
            onClick={() => addQuestionFromSegment(segments[Math.floor(Math.random() * segments.length)])}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            從段落快速出題
          </button>
        )}
      </div>

      <div className="mt-8">
        <button onClick={saveQuiz} className="w-full bg-purple-600 text-white py-3 rounded text-lg">
          儲存題組
        </button>
      </div>
    </div>
  );
}
