"use client";

import React, { useState, useEffect } from "react";
import { PracticeQuestion } from "@/types/practice";

interface Props {
  question: PracticeQuestion;
  onSave: (updated: PracticeQuestion) => void;
  onCancel: () => void;
  onDelete: () => void;
}

export default function QuestionEditorModal({ question, onSave, onCancel, onDelete }: Props) {
  const [q, setQ] = useState<PracticeQuestion>(question);

  useEffect(() => {
    setQ(question);
  }, [question]);

  const updateOption = (idx: number, val: string) => {
    const opts = [...q.options];
    opts[idx] = val;
    setQ({ ...q, options: opts });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">編輯題目</h2>

        <label className="block font-medium">主題</label>
        <input
          className="w-full border p-2 rounded mb-4"
          value={q.topic}
          onChange={(e) => setQ({ ...q, topic: e.target.value })}
        />

        <label className="block font-medium">題幹</label>
        <textarea
          className="w-full border p-2 rounded mb-4"
          rows={3}
          value={q.question}
          onChange={(e) => setQ({ ...q, question: e.target.value })}
        />

        <label className="block font-medium">選項</label>
        {q.options.map((opt, i) => (
          <div key={i} className="flex items-center gap-2 mb-2">
            <input
              className="flex-1 border p-2 rounded"
              value={opt}
              onChange={(e) => updateOption(i, e.target.value)}
            />
            {q.options.length > 2 && (
              <button
                className="text-red-500"
                onClick={() => {
                  const opts = q.options.filter((_, idx) => idx !== i);
                  setQ({ ...q, options: opts });
                }}
              >🗑️</button>
            )}
          </div>
        ))}
        {q.options.length < 6 && (
          <button
            className="text-sm text-blue-600 mb-4"
            onClick={() => setQ({ ...q, options: [...q.options, ""] })}
          >➕ 新增選項</button>
        )}

        <label className="block font-medium">正確答案</label>
        <select
          className="w-full border p-2 rounded mb-4"
          value={q.answer}
          onChange={(e) => setQ({ ...q, answer: e.target.value })}
        >
          {q.options.map((opt, i) => (
            <option key={i} value={opt}>{opt}</option>
          ))}
        </select>

        <label className="block font-medium">解說</label>
        <textarea
          className="w-full border p-2 rounded mb-6"
          rows={2}
          value={q.explanation}
          onChange={(e) => setQ({ ...q, explanation: e.target.value })}
        />

        <div className="flex justify-end space-x-3">
          <button
            onClick={onDelete}
            className="px-4 py-2 text-red-600 border rounded"
          >刪除</button>
          <button
            onClick={onCancel}
            className="px-4 py-2 border rounded"
          >取消</button>
          <button
            onClick={() => onSave(q)}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >儲存</button>
        </div>
      </div>
    </div>
  );
}