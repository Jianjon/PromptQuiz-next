"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ModuleSidebar from "@/components/ModuleSidebar";
import FileDropzone from "@/components/FileDropzone";
import { PracticeQuestion } from "@/types/practice";
import { ExtractedParagraph } from "@/types/upload"; // 用於接收上傳教材內容

interface ChapterNode {
  code: string;
  title: string;
}

export default function ExamStartPage() {
  const router = useRouter();

  // 左側管理欄
  const [mode, setMode] = useState<"practice" | "exam">("practice");
  const [chapters, setChapters] = useState<ChapterNode[]>([]);
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);

  // 右側功能欄設定
  const [uploadContent, setUploadContent] = useState<ExtractedParagraph[]>([]);
  const [examRules, setExamRules] = useState<string>("");
  const [officialChaptersText, setOfficialChaptersText] = useState<string>("");

  const [questionCount, setQuestionCount] = useState<number>(10);
  const [difficulty, setDifficulty] = useState<"簡單" | "普通" | "挑戰">("普通");
  const [questionType, setQuestionType] = useState<"記憶型" | "理解型" | "素養型">("理解型");
  const [tone, setTone] = useState<"正式" | "親切" | "創意">("正式");
  const [respLength, setRespLength] = useState<"精簡" | "中等" | "詳細">("中等");

  // 題目與作答狀態
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [started, setStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number>(0);

  // 處理官方章節文字
  const parseOfficialChapters = () => {
    const lines = officialChaptersText.split("\n").map((l) => l.trim()).filter(Boolean);
    const nodes = lines.map((line) => {
      const [code, title] = line.split(/\s+(.+)/);
      return { code, title: title || "" };
    });
    setChapters(nodes);
  };

  // 切換章節選擇
  const toggleChapter = (code: string) => {
    setSelectedChapters((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  // 開始刷題／考試（mock）
  const handleStart = () => {
    const mock: PracticeQuestion[] = Array.from({ length: questionCount }).map((_, i) => ({
      question: `範例題目 ${i + 1}：這是一個關於 ${selectedChapters.join(",") || "一般"} 的練習題？`,
      options: ["選項 A", "選項 B", "選項 C", "選項 D"],
      answer: "選項 A",
      explanation: "這是範例解釋，用以說明正確答案。",
    }));
    setQuestions(mock);
    setAnswers(Array(mock.length).fill(""));
    setStarted(true);
    setSubmitted(false);
  };

  // 紀錄作答
  const handleAnswer = (idx: number, value: string) => {
    const updated = [...answers];
    updated[idx] = value;
    setAnswers(updated);
  };

  // 交卷
  const handleSubmit = () => {
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.answer) correct++;
    });
    setScore(Math.round((correct / questions.length) * 100));
    setSubmitted(true);
  };

  return (
    <div className="flex min-h-screen">
      {/* 左側：模組選單 */}
      <aside className="w-64 border-r bg-white">
        <ModuleSidebar active="exam" />
      </aside>

      {/* 中間：主要內容 */}
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-3xl font-bold mb-6">
          {mode === "practice" ? "主題式刷題" : "正式考試"}
        </h1>

        {/* 模式切換 */}
        <div className="flex gap-2 mb-6">
          <button
            className={`px-4 py-2 rounded ${mode === "practice" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
            onClick={() => setMode("practice")}
          >
            刷題
          </button>
          <button
            className={`px-4 py-2 rounded ${mode === "exam" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700"}`}
            onClick={() => setMode("exam")}
          >
            考試
          </button>
        </div>

        {/* 尚未開始作答 */}
        {!started ? (
          <section className="space-y-6">
            {/* 上傳教材 */}
            <div>
              <h2 className="font-semibold mb-2">上傳教材 / PDF</h2>
              <FileDropzone onExtracted={(paras) => setUploadContent(paras)} />
            </div>

            {/* 官方章節解析 */}
            {mode === "practice" && (
              <div>
                <h2 className="font-semibold mb-2">貼上官方章節範圍</h2>
                <textarea
                  className="w-full border rounded p-2"
                  rows={4}
                  placeholder="例如：L11101 AI 定義與分類"
                  value={officialChaptersText}
                  onChange={(e) => setOfficialChaptersText(e.target.value)}
                />
                <button
                  onClick={parseOfficialChapters}
                  className="mt-2 px-4 py-1 bg-blue-500 text-white rounded"
                >
                  解析章節
                </button>
                <ul className="mt-2 space-y-2">
                  {chapters.map((ch) => (
                    <li key={ch.code}>
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedChapters.includes(ch.code)}
                          onChange={() => toggleChapter(ch.code)}
                        />
                        {ch.code} {ch.title}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 出題設定 */}
            <div className="grid grid-cols-2 gap-4">
              {/* 題目數量 */}
              <div>
                <label className="block text-sm font-medium mb-1">題目數量</label>
                <select
                  className="w-full border rounded p-2"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                >
                  {[5, 10, 20, 30].map((n) => (
                    <option key={n} value={n}>{n} 題</option>
                  ))}
                </select>
              </div>

              {/* 其他 AI 參數：難度、題型、風格、長度 */}
              {/* 如果要，我可以直接順便補完 👀 */}
            </div>

            {/* 開始作答 */}
            <button
              onClick={handleStart}
              className="w-full mt-6 py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700"
            >
              {mode === "practice" ? "開始刷題" : "開始考試"}
            </button>
          </section>
        ) : !submitted ? (
          // 作答階段
          <section className="space-y-6">
            {questions.map((q, idx) => (
              <div key={idx} className="border p-4 rounded bg-white shadow-sm">
                <p className="font-semibold mb-2">{idx + 1}. {q.question}</p>
                <ul className="space-y-2">
                  {q.options.map((opt) => (
                    <li key={opt}>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`q-${idx}`}
                          checked={answers[idx] === opt}
                          onChange={() => handleAnswer(idx, opt)}
                        />
                        {opt}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <button
              onClick={handleSubmit}
              className="w-full py-2 bg-purple-600 text-white rounded"
            >
              交卷
            </button>
          </section>
        ) : (
          // 成績結果
          <section className="text-center space-y-6">
            <h2 className="text-2xl font-bold text-green-600">考試完成 🎉</h2>
            <p className="text-xl">你的得分：<strong>{score}</strong> 分</p>
            <button
              onClick={() => setStarted(false)}
              className="px-6 py-2 bg-gray-300 rounded"
            >
              再試一次
            </button>
          </section>
        )}
      </main>
    </div>
  );
}
