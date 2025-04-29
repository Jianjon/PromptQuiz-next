"use client";

import React, { useState } from "react";
import QuestionUploadPanel from "@/components/QuestionUploadPanel";
import PracticeSettingPanel from "@/components/PracticeSettingPanel";
import SampleQuestionUploadPanel from "@/components/SampleQuestionUploadPanel";
import QuestionEditorModal from "@/components/QuestionEditorModal";
import { PracticeQuestion } from "@/types/practice";

export default function PracticeManagePage() {
  const [practiceQuestions, setPracticeQuestions] = useState<PracticeQuestion[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<PracticeQuestion | null>(null);
  const [selectedSetting, setSelectedSetting] = useState<{ selectedTopic: string, questionCount: number }>({
    selectedTopic: "全部主題",
    questionCount: 10,
  });
  const [practiceSet, setPracticeSet] = useState<PracticeQuestion[]>([]);
  const [practicing, setPracticing] = useState(false);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);

  const handleSaveQuestion = (updated: PracticeQuestion) => {
    setPracticeQuestions((prev) =>
      prev.map((q) => (q.id === updated.id ? updated : q))
    );
    setEditingQuestion(null);
  };

  const handleDeleteQuestion = (id: string) => {
    setPracticeQuestions((prev) => prev.filter((q) => q.id !== id));
    setEditingQuestion(null);
  };

  const handleStartPractice = () => {
    const filtered = selectedSetting.selectedTopic === "全部主題"
      ? practiceQuestions
      : practiceQuestions.filter(q => q.topic === selectedSetting.selectedTopic);
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, selectedSetting.questionCount);
    setPracticeSet(selected);
    setUserAnswers(new Array(selected.length).fill(""));
    setPracticing(true);
  };

  return (
    <div className="flex min-h-screen">
      {/* 中間主內容區 */}
      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">🎯 刷題題庫管理</h1>

        {!practicing ? (
          <>
            <div className="space-y-6">
              {practiceQuestions.slice(0, 50).map((q, idx) => (
                <div key={q.id} className="border p-4 rounded bg-white shadow">
                  <p className="font-semibold mb-2">{idx + 1}. ({q.topic}) {q.question}</p>
                  <div className="flex gap-4 mt-4">
                    <button
                      className="px-4 py-1 bg-blue-500 text-white rounded"
                      onClick={() => setEditingQuestion(q)}
                    >編輯</button>
                    <button
                      className="px-4 py-1 bg-red-500 text-white rounded"
                      onClick={() => handleDeleteQuestion(q.id)}
                    >刪除</button>
                  </div>
                </div>
              ))}
              {practiceQuestions.length === 0 && (
                <p className="text-gray-400">尚無題目，請先上傳或新增。</p>
              )}
            </div>
            <div className="mt-6">
              <button
                className="px-6 py-2 bg-green-600 text-white rounded"
                onClick={handleStartPractice}
              >開始刷題</button>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            {practiceSet.map((q, idx) => (
              <div key={q.id} className="border p-4 rounded bg-white shadow">
                <p className="font-semibold mb-2">{idx + 1}. {q.question}</p>
                <ul className="space-y-2">
                  {q.options.map((opt, i) => (
                    <li key={i}>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`q-${idx}`}
                          value={opt}
                          checked={userAnswers[idx] === opt}
                          onChange={() => {
                            const updated = [...userAnswers];
                            updated[idx] = opt;
                            setUserAnswers(updated);
                          }}
                        />
                        {opt}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 右側 Sidebar */}
      <div className="w-96 border-l p-4 bg-gray-50 space-y-8">
        <QuestionUploadPanel onQuestionsParsed={setPracticeQuestions} />
        <PracticeSettingPanel
          availableTopics={practiceQuestions.map(q => q.topic).filter((v, i, a) => a.indexOf(v) === i)}
          onSettingChange={setSelectedSetting}
        />
        <SampleQuestionUploadPanel />
      </div>

      {/* 題目編輯 Modal */}
      {editingQuestion && (
        <QuestionEditorModal
          question={editingQuestion}
          onSave={handleSaveQuestion}
          onCancel={() => setEditingQuestion(null)}
          onDelete={() => handleDeleteQuestion(editingQuestion.id)}
        />
      )}
    </div>
  );
}
