"use client";

import React, { useState } from "react";
import QuestionUploadPanel from "@/components/QuestionUploadPanel";
import PracticeSettingPanel from "@/components/PracticeSettingPanel";
import QuestionEditorModal from "@/components/QuestionEditorModal";
import QuestionSettingSidebar from "@/components/QuestionSettingSidebar";
import { PracticeQuestion } from "@/types/practice";
import * as XLSX from "xlsx";

export default function PracticeManagePage() {
  const [practiceQuestions, setPracticeQuestions] = useState<PracticeQuestion[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<PracticeQuestion | null>(null);
  const [selectedSetting, setSelectedSetting] = useState<{ selectedTopic: string, questionCount: number }>({
    selectedTopic: "全部主題",
    questionCount: 10,
  });
  const [savedQuizId, setSavedQuizId] = useState<string | null>(null);

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

  const handleQuestionsGenerated = (questions: any[]) => {
    const formatted = questions.map((q, idx) => ({
      id: `gen-${Date.now()}-${idx}`,
      topic: "AI 產生",
      question: q.question,
      options: q.options?.split(";").map((o: string) => o.trim()) || [],
      correctAnswer: q.correctAnswer,
      explanation: q.explanation || "",
    }));
    setPracticeQuestions((prev) => [...prev, ...formatted]);
  };

  const handleExportExcel = () => {
    const exportData = practiceQuestions.map((q) => ({
      Question: q.question,
      Options: q.options.join(";"),
      CorrectAnswer: q.correctAnswer,
      Explanation: q.explanation || "",
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "題庫題目");
    XLSX.writeFile(workbook, "practice-questions.xlsx");
  };

  const handleSaveToBackend = async () => {
    const res = await fetch("/api/question/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questions: practiceQuestions }),
    });
    if (res.ok) {
      const result = await res.json();
      setSavedQuizId(result.quizId);
      alert(`題目已儲存成功！`);
    } else {
      alert("儲存失敗，請稍後再試");
    }
  };

  const shareUrl = savedQuizId ? `${process.env.NEXT_PUBLIC_SITE_URL}/practice/start?quiz=${savedQuizId}` : "";

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">🎯 題庫管理</h1>

        <div className="space-y-6">
          {practiceQuestions.slice(0, 50).map((q, idx) => (
            <div key={q.id} className="border p-4 rounded bg-white shadow">
              <p className="font-semibold mb-2">{idx + 1}. ({q.topic}) {q.question}</p>
              <ul className="pl-4 text-sm text-gray-700 list-disc">
                {q.options.map((opt, i) => (
                  <li key={i}>{opt}</li>
                ))}
              </ul>
              <p className="text-green-700 text-sm mt-1">正解：{q.correctAnswer}</p>
              {q.explanation && (
                <p className="text-gray-500 text-sm">解析：{q.explanation}</p>
              )}
              <div className="flex gap-4 mt-4">
                <button className="px-4 py-1 bg-blue-500 text-white rounded" onClick={() => setEditingQuestion(q)}>編輯</button>
                <button className="px-4 py-1 bg-red-500 text-white rounded" onClick={() => handleDeleteQuestion(q.id)}>刪除</button>
              </div>
            </div>
          ))}
          {practiceQuestions.length === 0 && (
            <p className="text-gray-400">尚無題目，請先上傳或產生題目。</p>
          )}
        </div>

        <div className="flex gap-4 mt-8">
          <button className="px-6 py-2 bg-green-600 text-white rounded" onClick={handleSaveToBackend}>儲存為題組</button>
          <button className="px-6 py-2 bg-blue-600 text-white rounded" onClick={handleExportExcel}>下載為 Excel</button>
        </div>

        {savedQuizId && (
          <div className="mt-6 p-4 bg-green-100 rounded">
            <p className="font-semibold mb-2">🎉 題組儲存完成！分享連結：</p>
            <div className="flex gap-2">
              <input className="flex-1 p-2 border rounded" value={shareUrl} readOnly />
              <button onClick={() => navigator.clipboard.writeText(shareUrl)} className="px-4 py-2 bg-blue-500 text-white rounded">複製</button>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar 右側功能區 */}
      <div className="w-96 border-l p-4 bg-gray-50 space-y-12">
        <div>
          <h2 className="text-md font-semibold mb-2">📤 題庫檔案上傳</h2>
          <QuestionUploadPanel onQuestionsParsed={setPracticeQuestions} />
        </div>

        <div>
          <h2 className="text-md font-semibold mb-2">🧠 出題（創作者用）</h2>
          <QuestionSettingSidebar onQuestionsGenerated={handleQuestionsGenerated} />
        </div>

        <div>
          <h2 className="text-md font-semibold mb-2">🧪 刷題條件（受測者預覽）</h2>
          <PracticeSettingPanel
            availableTopics={practiceQuestions.map(q => q.topic).filter((v, i, a) => a.indexOf(v) === i)}
            onSettingChange={setSelectedSetting}
          />
        </div>
      </div>

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
