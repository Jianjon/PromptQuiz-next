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
  const [readyToShare, setReadyToShare] = useState(false);

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
      setReadyToShare(true);
    } else {
      alert("儲存失敗，請稍後再試");
    }
  };

  const shareUrl = savedQuizId ? `${process.env.NEXT_PUBLIC_SITE_URL}/practice/start?quiz=${savedQuizId}` : "";

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">🎯 題庫管理</h1>

        {!readyToShare && (
          <div className="flex gap-4 mt-8">
            <button className="px-6 py-2 bg-green-600 text-white rounded" onClick={handleSaveToBackend}>產生分享連結</button>
            <button className="px-6 py-2 bg-blue-600 text-white rounded" onClick={handleExportExcel}>下載為 Excel</button>
          </div>
        )}

        {readyToShare && savedQuizId && (
          <div className="mt-6 p-4 bg-green-100 rounded">
            <p className="font-semibold mb-2">🎉 題組儲存完成！分享連結：</p>
            <div className="flex gap-2 mb-4">
              <input className="flex-1 p-2 border rounded" value={shareUrl} readOnly />
              <button onClick={() => navigator.clipboard.writeText(shareUrl)} className="px-4 py-2 bg-blue-500 text-white rounded">複製</button>
            </div>
            <p className="text-sm text-gray-600">📌 使用者可掃描 QR Code 或點擊連結進入刷題</p>
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`} alt="QR Code" className="mt-2 border rounded" />
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
