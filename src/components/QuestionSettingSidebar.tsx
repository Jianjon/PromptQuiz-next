"use client";

import { useState } from "react";

interface SidebarProps {
  onQuestionsGenerated: (questions: any[]) => void;
}

export default function QuestionSettingSidebar({ onQuestionsGenerated }: SidebarProps) {
  const [topic, setTopic] = useState("");
  const [examScope, setExamScope] = useState("");
  const [referenceExample, setReferenceExample] = useState("");
  const [numQuestions, setNumQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState<"easy" | "normal" | "hard">("normal");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim() || !examScope.trim()) {
      alert("請填寫主題與考試範圍");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/gpt/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          examScope,
          referenceExample,
          numQuestions,
          difficulty,
        }),
      });
      if (!res.ok) throw new Error("API 請求失敗");
      const data = await res.json();
      onQuestionsGenerated(data.questions);
    } catch (err) {
      alert("產生題目失敗，請稍後再試。")
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-80 p-4 border-l h-full bg-gray-50 flex flex-col">
      <h2 className="text-lg font-bold mb-4">出題設定</h2>

      <label className="block mb-2 text-sm font-medium">主題名稱</label>
      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="w-full p-2 border rounded mb-4"
        placeholder="例：碳盤查流程"
      />

      <label className="block mb-2 text-sm font-medium">考試範圍內容</label>
      <textarea
        value={examScope}
        onChange={(e) => setExamScope(e.target.value)}
        className="w-full p-2 border rounded mb-4 h-24"
        placeholder="貼上章節摘要或教材內容"
      />

      <label className="block mb-2 text-sm font-medium">樣題參考（可選）</label>
      <textarea
        value={referenceExample}
        onChange={(e) => setReferenceExample(e.target.value)}
        className="w-full p-2 border rounded mb-4 h-24"
        placeholder="提供一題範例作為格式參考"
      />

      <label className="block mb-2 text-sm font-medium">題目數量（最多 50 題）</label>
      <input
        type="number"
        value={numQuestions}
        onChange={(e) => setNumQuestions(Math.min(50, Number(e.target.value)))}
        className="w-full p-2 border rounded mb-4"
        min={1}
        max={50}
      />

      <label className="block mb-2 text-sm font-medium">難度設定</label>
      <select
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value as "easy" | "normal" | "hard")}
        className="w-full p-2 border rounded mb-6"
      >
        <option value="easy">簡單</option>
        <option value="normal">普通</option>
        <option value="hard">困難</option>
      </select>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "產生中..." : "產生題目"}
      </button>
    </div>
  );
}
