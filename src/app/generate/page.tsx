// app/generate/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import QuizMetaSettingsPanel, { QuizMetaSettings } from "@/components/QuizMetaSettingsPanel";
import { defaultSettings, QuizSettings } from "@/lib/settings";
import FileDropzone from "@/components/FileDropzone";
import TopicSelector from "@/components/TopicSelector";
import QuestionEditorModal from "@/components/QuestionEditorModal";
import { ExtractedParagraph } from "@/types/extracted";
import { PlanItem } from "@/lib/agents/questionPlanner";
import { ComposedQuestion } from "@/lib/agents/questionComposer";
import { QualityCheckResult } from "@/lib/agents/qualityChecker";
import { generateQuiz } from "@/lib/orchestrator";

export default function GeneratePage() {
  const [input, setInput] = useState<string>("");
  const [extracted, setExtracted] = useState<ExtractedParagraph[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [questions, setQuestions] = useState<ComposedQuestion[]>([]);
  const [qualityResults, setQualityResults] = useState<QualityCheckResult[]>([]);

  // loading & error states
  const [generating, setGenerating] = useState<boolean>(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [settings, setSettings] = useState<QuizSettings>(defaultSettings);
  const [meta, setMeta] = useState<QuizMetaSettings>({
    isPublic: false,
    showFeedback: false,
    showAnswersAfterSubmit: false,
    enableStats: false,
    scoringMode: "none",
  });

  const router = useRouter();

  // 打開/關閉編輯 Modal
  const openEditor = (idx: number) => setEditingIdx(idx);
  const closeEditor = () => setEditingIdx(null);

  // 生成流程
  const handleGenerate = async () => {
    if (!input.trim() && extracted.length === 0) return;
    setGenerateError(null);
    setGenerating(true);
    try {
      const result = await generateQuiz({ inputText: input, paragraphs: extracted, settings });
      setTopics(result.topics);
      setPlans(result.plans);
      setQuestions(result.composed);
      setQualityResults(result.quality);
    } catch (err: any) {
      console.error("出題失敗", err);
      setGenerateError(err.message || "❌ 題目生成失敗，請重試");
    } finally {
      setGenerating(false);
    }
  };

  // 儲存分享
  const handleSaveAndShare = async () => {
    try {
      const res = await fetch("/api/quiz/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions, settings, meta }),
      });
      const data = await res.json();
      if (data?.id) {
        const url = `${window.location.origin}/quiz/${data.id}/start`;
        window.open(url, "_blank");
      } else {
        alert("無法建立問卷，請稍後再試。");
      }
    } catch (err) {
      console.error("分享失敗", err);
      alert("分享時發生錯誤，請重試");
    }
  };

  return (
    <div className="flex">
      {/* 主區域 */}
      <div className="flex-1 max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">📘 AI 出題器</h1>

        {/* 1️⃣ 檔案上傳 */}
        <FileDropzone onExtracted={setExtracted} />

        {/* 2️⃣ 主題選擇 */}
        <TopicSelector extracted={extracted} onSelect={setInput} />

        {/* 3️⃣ 輸入框 + 生成按鈕 */}
        <textarea
          className="w-full p-3 border rounded mb-2"
          rows={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="請貼上教案段落或主題..."
        />
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 mb-2"
        >
          {generating ? "🔄 生成中..." : "開始生成題組"}
        </button>
        {generateError && (
          <div className="mb-4 text-red-600">
            <p>{generateError}</p>
            <button onClick={handleGenerate} className="mr-2 underline">
              重試生成
            </button>
            <button onClick={() => setGenerateError(null)} className="underline">
              跳過此階段
            </button>
          </div>
        )}

        {/* 4️⃣ 題目列表 (Accordion) */}
        {questions.map((q, idx) => (
          <details key={idx} className="border rounded mb-2">
            <summary className="flex justify-between items-center p-3 bg-gray-100 cursor-pointer">
              <span className="flex-1">題目 {idx + 1}: {q.question}</span>
              <button
                onClick={(e) => { e.preventDefault(); openEditor(idx); }}
                title="編輯題目"
                className="ml-2 hover:text-blue-600"
              >
                ✏️
              </button>
            </summary>
          </details>
        ))}

        {/* 5️⃣ 題目編輯 Modal */}
        {editingIdx !== null && (
          <QuestionEditorModal
            question={questions[editingIdx]}
            onCancel={closeEditor}
            onSave={(updatedQuestion) => {
              setQuestions((qs) =>
                qs.map((q, i) => (i === editingIdx ? updatedQuestion : q))
              );
              closeEditor();
            }}
            onDelete={() => {
              setQuestions((qs) => qs.filter((_, i) => i !== editingIdx));
              closeEditor();
            }}
          />
        )}

        {/* 6️⃣ 底部工具列 */}
        {questions.length > 0 && (
          <div className="sticky bottom-0 bg-white p-4 flex justify-end space-x-2 border-t">
            <button
              onClick={closeEditor}
              className="px-4 py-2"
            >
              取消編輯
            </button>
            <button
              onClick={handleSaveAndShare}
              className="px-4 py-2 bg-green-600 text-white"
            >
              儲存並分享
            </button>
          </div>
        )}
      </div>

      {/* 側欄設定 */}
      <div className="flex flex-col space-y-6 p-4">
        <Sidebar settings={settings} setSettings={(s) => setSettings({ ...settings, ...s })} />
        <QuizMetaSettingsPanel meta={meta} setMeta={(m) => setMeta({ ...meta, ...m })} />
      </div>
    </div>
  );
}
