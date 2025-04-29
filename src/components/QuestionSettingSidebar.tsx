"use client";

import React, { useState } from "react";
import UploadOrPasteBlock from "@/components/UploadOrPasteBlock";

interface SidebarProps {
  onQuestionsGenerated: (questions: any[]) => void;
}

export default function QuestionSettingSidebar({ onQuestionsGenerated }: SidebarProps) {
  const [referenceText, setReferenceText] = useState("");
  const [scopeText, setScopeText] = useState("");
  const [exampleText, setExampleText] = useState("");
  const [numQuestions, setNumQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState("普通");

  const handleGenerate = async () => {
    const res = await fetch("/api/gpt/question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic: referenceText,
        examScope: scopeText,
        referenceExample: exampleText,
        numQuestions,
        difficulty,
      }),
    });

    if (res.ok) {
      const json = await res.json();
      onQuestionsGenerated(json.questions);
    } else {
      alert("出題失敗，請稍後再試");
    }
  };

  return (
    <div className="space-y-6">

      <UploadOrPasteBlock
        label="📄 上傳參考資料"
        value={referenceText}
        onChange={setReferenceText}
      />

      <UploadOrPasteBlock
        label="📋 出題規則與考試範圍"
        value={scopeText}
        onChange={setScopeText}
      />

      <UploadOrPasteBlock
        label="🧪 樣題參考"
        value={exampleText}
        onChange={setExampleText}
      />

      <div>
        <label className="block font-medium mb-1">題目數量（最多 50 題）</label>
        <input
          type="number"
          min={1}
          max={50}
          className="w-full p-2 border rounded"
          value={numQuestions}
          onChange={(e) => setNumQuestions(Number(e.target.value))}
        />
      </div>

      <div>
        <label className="block font-medium mb-1">難度設定</label>
        <select
          className="w-full p-2 border rounded"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="簡單">簡單</option>
          <option value="普通">普通</option>
          <option value="困難">困難</option>
        </select>
      </div>

      <button
        onClick={handleGenerate}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        產生題目
      </button>
    </div>
  );
}