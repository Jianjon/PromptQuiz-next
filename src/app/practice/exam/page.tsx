"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import PracticeSidebar from "@/components/PracticeSidebar";
import FileDropzone from "@/components/FileDropzone";
import { PracticeQuestion } from "@/types/practice";

interface ChapterNode {
  code: string;
  title: string;
}

export default function ExamPage() {
  const [mode, setMode] = useState<"practice" | "exam">("practice");
  const [uploadedContent, setUploadedContent] = useState<string>("");
  const [examRules, setExamRules] = useState<string>("");
  const [officialChapters, setOfficialChapters] = useState<string>("");
  const [chapters, setChapters] = useState<ChapterNode[]>([]);
  const [selectedChapterCodes, setSelectedChapterCodes] = useState<string[]>([]);
  const [currentQuestions, setCurrentQuestions] = useState<PracticeQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [started, setStarted] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const router = useRouter();

  const handleUploadSuccess = (content: string) => {
    setUploadedContent(content);
  };

  const handleExamRulesChange = (rules: string) => {
    setExamRules(rules);
  };

  const handleOfficialChaptersChange = (text: string) => {
    setOfficialChapters(text);
  };

  const handleParseChapters = () => {
    const lines = officialChapters.split("\n").filter(line => line.trim() !== "");
    const parsed: ChapterNode[] = lines.map(line => {
      const parts = line.trim().split(/\s+(.+)/);
      return { code: parts[0], title: parts[1] || "" };
    });
    setChapters(parsed);
  };

  const toggleChapterSelection = (code: string) => {
    setSelectedChapterCodes((prev) =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const handleStartPractice = () => {
    const mockQuestions: PracticeQuestion[] = [
      { question: "什麼是淨零碳排？", options: ["減少能源使用", "完全抵銷排放", "停止製造產品", "只用電動車"], answer: "完全抵銷排放", explanation: "淨零碳排指的是將總碳排放量減至零或完全抵銷。" },
      { question: "碳盤查的第一步是什麼？", options: ["設定目標", "收集排放數據", "制定減碳計畫", "建立團隊"], answer: "收集排放數據", explanation: "盤查需先掌握現有排放資料，才能進行後續分析與規劃。" },
    ];
    setCurrentQuestions(mockQuestions);
    setUserAnswers(new Array(mockQuestions.length).fill(""));
    setStarted(true);
    setSubmitted(false);
  };

  const handleAnswerChange = (index: number, value: string) => {
    const updated = [...userAnswers];
    updated[index] = value;
    setUserAnswers(updated);
  };

  const handleSubmit = () => {
    let correct = 0;
    currentQuestions.forEach((q, idx) => {
      if (q.answer === userAnswers[idx]) {
        correct++;
      }
    });
    setScore(Math.round((correct / currentQuestions.length) * 100));
    setSubmitted(true);
  };

  return (
    <div className="flex min-h-screen">
      {/* 主內容區 */}
      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">🎯 模擬考／主題式刷題</h1>

        <div className="flex gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded ${mode === "practice" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setMode("practice")}
          >主題式刷題</button>
          <button
            className={`px-4 py-2 rounded ${mode === "exam" ? "bg-green-600 text-white" : "bg-gray-200"}`}
            onClick={() => setMode("exam")}
          >模擬考</button>
        </div>

        {!started ? (
          <div>
            {mode === "practice" ? (
              <div>
                <h2 className="text-xl font-semibold mb-4">主題式刷題</h2>
                <p className="mb-4">可選章節、選題數，快速練習並接受AI指引補強。</p>
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">選擇章節</h3>
                  {chapters.length > 0 ? (
                    <div className="space-y-2">
                      {chapters.map((ch, idx) => (
                        <label key={idx} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedChapterCodes.includes(ch.code)}
                            onChange={() => toggleChapterSelection(ch.code)}
                          />
                          {ch.code} {ch.title}
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">（尚未設定章節，請貼上範圍後解析）</p>
                  )}
                </div>
                <button
                  onClick={handleStartPractice}
                  className="px-6 py-2 bg-blue-500 text-white rounded"
                >開始刷題</button>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-semibold mb-4">模擬考模式</h2>
                <p className="mb-4">依照官方考試規則，混合出題並限時作答。</p>
                <button
                  onClick={handleStartPractice}
                  className="px-6 py-2 bg-green-500 text-white rounded"
                >開始模擬考</button>
              </div>
            )}
          </div>
        ) : (
          <div>
            {!submitted ? (
              <div>
                <h2 className="text-xl font-semibold mb-4">請作答以下題目：</h2>
                <div className="space-y-6">
                  {currentQuestions.map((q, idx) => (
                    <div key={idx} className="border p-4 rounded shadow">
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
                                onChange={() => handleAnswerChange(idx, opt)}
                              />
                              {opt}
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <div className="mt-8 text-center">
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-2 bg-purple-600 text-white rounded"
                  >交卷</button>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-green-600 mb-6">作答完成 🎉</h2>
                <p className="text-xl mb-4">你的得分是：<span className="font-bold">{score}分</span></p>
                <h3 className="text-lg font-semibold mb-2">錯題解析：</h3>
                {currentQuestions.map((q, idx) => (
                  userAnswers[idx] !== q.answer && (
                    <div key={idx} className="border p-4 rounded mb-4">
                      <p><strong>題目：</strong> {q.question}</p>
                      <p><strong>你的答案：</strong> {userAnswers[idx]}</p>
                      <p><strong>正確答案：</strong> {q.answer}</p>
                      <p><strong>解釋：</strong> {q.explanation}</p>
                    </div>
                  )
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 右側 sidebar */}
      <div className="w-96 border-l p-4 bg-gray-50">
        <PracticeSidebar />

        <div className="mb-6">
          <h3 className="font-semibold mb-2">上傳教材 (PDF / Word / Excel)</h3>
          <FileDropzone onExtracted={(paragraphs) => setUploadedContent(JSON.stringify(paragraphs))} />
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">貼上考試範圍與出題比例設定</h3>
          <textarea
            className="w-full p-2 border rounded"
            rows={6}
            placeholder="例如：選擇題70%，問答題30%；涵蓋章節1-3..."
            value={examRules}
            onChange={(e) => handleExamRulesChange(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">貼上官方考試章節範圍</h3>
          <textarea
            className="w-full p-2 border rounded"
            rows={10}
            placeholder="請貼上官方章節資料 (如 L11101 AI定義與分類)"
            value={officialChapters}
            onChange={(e) => handleOfficialChaptersChange(e.target.value)}
          />
          <button
            onClick={handleParseChapters}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          >解析章節</button>
        </div>
      </div>
    </div>
  );
}
