"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import PracticeSidebar from "@/components/PracticeSidebar";
import FileDropzone from "@/components/FileDropzone";
import { PracticeQuestion } from "@/types/practice";
import { ExtractedParagraph } from "@/types/extracted";
import { validateQuestion, ValidationResult } from "@/lib/agents/questionValidator";

export default function PracticePage() {
  const [mode, setMode] = useState<"practice" | "exam">("practice");
  const [practiceQuestions, setPracticeQuestions] = useState<PracticeQuestion[]>([]);
  const [validationResults, setValidationResults] = useState<{ question: PracticeQuestion, result: ValidationResult }[]>([]);
  const [parsing, setParsing] = useState<boolean>(false);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [started, setStarted] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const router = useRouter();

  async function handleParseAndValidate(paragraphs: ExtractedParagraph[]) {
    setParsing(true);
    const parsedQuestions: PracticeQuestion[] = paragraphs.map((p, idx) => ({
      question: p.content.slice(0, 50) + "...",
      options: ["選項A", "選項B", "選項C", "選項D"],
      answer: "選項A",
      explanation: "示範解釋內容。",
    }));

    const validated: PracticeQuestion[] = [];
    const results: { question: PracticeQuestion, result: ValidationResult }[] = [];

    for (const q of parsedQuestions) {
      const result = await validateQuestion(q);
      results.push({ question: q, result });
      if (result.pass) {
        validated.push(q);
      }
    }

    setPracticeQuestions(validated);
    setValidationResults(results);
    setParsing(false);
  }

  const handleStartPractice = () => {
    if (practiceQuestions.length === 0) {
      alert("目前沒有可用的題目，請先上傳並驗證題目。");
      return;
    }
    setUserAnswers(new Array(practiceQuestions.length).fill(""));
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
    practiceQuestions.forEach((q, idx) => {
      if (q.answer === userAnswers[idx]) {
        correct++;
      }
    });
    setScore(Math.round((correct / practiceQuestions.length) * 100));
    setSubmitted(true);
  };

  return (
    <div className="flex min-h-screen">
      {/* 主內容區 */}
      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">🎯 刷題模式</h1>

        {!started ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">上傳教材並驗證題目</h2>
            <FileDropzone onExtracted={handleParseAndValidate} />

            {parsing && <p className="text-blue-500 mb-4">📚 題庫分析中，請稍後...</p>}

            {validationResults.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-4">題目驗證結果：</h3>
                <ul className="space-y-4">
                  {validationResults.map((item, idx) => (
                    <li key={idx} className="p-4 border rounded bg-gray-50">
                      <p className="font-bold mb-1">題目 {idx + 1}：{item.question.question}</p>
                      {item.result.pass ? (
                        <p className="text-green-600">✅ 通過</p>
                      ) : (
                        <div className="text-red-600">
                          ❌ 未通過
                          <ul className="list-disc pl-6">
                            {item.result.issues?.map((issue, i) => (
                              <li key={i}>{issue}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-8 text-center">
              <button
                onClick={handleStartPractice}
                className="px-6 py-2 bg-blue-600 text-white rounded"
              >開始刷題</button>
            </div>
          </div>
        ) : (
          <div>
            {!submitted ? (
              <div>
                <h2 className="text-xl font-semibold mb-4">請作答以下題目：</h2>
                <div className="space-y-6">
                  {practiceQuestions.map((q, idx) => (
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
                {practiceQuestions.map((q, idx) => (
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

      {/* 右側 Sidebar 可後續擴充（保留空間） */}
      <div className="w-96 border-l p-4 bg-gray-50">
        <PracticeSidebar />
      </div>
    </div>
  );
}
