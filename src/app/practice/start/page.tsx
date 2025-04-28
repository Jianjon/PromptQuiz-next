"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function PracticeStartPage() {
  const router = useRouter();

  // 狀態管理
  const [step, setStep] = useState<"info" | "quiz">("info");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [quizSize, setQuizSize] = useState<number | "">("");
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<string>("");

  const [loadingStart, setLoadingStart] = useState(false);
  const [errorStart, setErrorStart] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [errorAnalyze, setErrorAnalyze] = useState<string | null>(null);

  const chapterOptions = ["淨零碳排", "碳盤查"];

  // 取題
  const handleStartQuiz = async () => {
    if (!name || !email || !organization || !quizSize) {
      alert("請完整填寫資料與選擇題目數量");
      return;
    }
    setLoadingStart(true);
    setErrorStart(null);
    setQuestions([]);
    setUserAnswers([]);
    setScore(0);
    setAnalysisResult("");
    setErrorAnalyze(null);

    try {
      const params = new URLSearchParams();
      params.append("limit", String(quizSize));
      if (selectedChapters.length) {
        params.append("chapters", selectedChapters.join(","));
      }

      const res = await fetch(`/api/question?${params.toString()}`);
      const json = await res.json();
      if (res.ok && Array.isArray(json.questions)) {
        setQuestions(json.questions);
        setUserAnswers(new Array(json.questions.length).fill(""));
        setStep("quiz");
      } else {
        setErrorStart("無法取得題目，請稍後再試");
      }
    } catch (error) {
      setErrorStart("網路錯誤，請稍後再試");
    } finally {
      setLoadingStart(false);
    }
  };

  // 更新作答
  const handleAnswer = (idx: number, value: string) => {
    const updated = [...userAnswers];
    updated[idx] = value;
    setUserAnswers(updated);
  };

  // 交卷
  const handleSubmitQuiz = () => {
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.answer) correctCount++;
    });
    setScore(Math.round((correctCount / questions.length) * 100));
    setSubmitted(true);
  };

  // AI 分析
  const handleAnalyzePerformance = async () => {
    setAnalyzing(true);
    setAnalysisResult("");
    setErrorAnalyze(null);

    try {
      const payload = questions.map((q, idx) => ({
        question: q.question,
        userAnswer: userAnswers[idx] || "",
        correctAnswer: q.answer,
      }));

      const res = await fetch("/api/response/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions: payload }),
      });

      const data = await res.json();
      if (res.ok) {
        setAnalysisResult(`${data.supplementalContent || ""}\n\n${data.suggestion || ""}`);
      } else {
        setErrorAnalyze("AI 分析失敗，請稍後再試");
      }
    } catch {
      setErrorAnalyze("⚠️ 無法取得 AI 建議，請稍後再試。");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleRetry = () => {
    setSubmitted(false);
    setScore(0);
    setAnalysisResult("");
    setUserAnswers(new Array(questions.length).fill(""));
  };

  const handleReset = () => {
    setStep("info");
    setQuestions([]);
    setUserAnswers([]);
    setSubmitted(false);
    setScore(0);
    setAnalysisResult("");
    setErrorAnalyze(null);
  };

  const totalAnswered = userAnswers.filter((a) => a).length;
  const totalWrong = questions.filter(
    (q, idx) => userAnswers[idx] && userAnswers[idx] !== q.answer
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-blue-50">
      
      {/* Hero 區 */}
      <section className="flex flex-col items-center justify-center py-16 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">刷題模式</h1>
        <p className="text-gray-600">隨時隨地，快速練習，掌握知識關鍵！</p>
      </section>

      {/* 主要區塊 */}
      <main className="flex flex-col items-center flex-1 p-6">
        {step === "info" && (
          <div className="w-full max-w-lg space-y-4">

            <input
              type="text"
              placeholder="姓名"
              className="w-full p-2 border rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="text"
              placeholder="單位"
              className="w-full p-2 border rounded"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
            />

            {/* 題目數量 */}
            <select
              className="w-full p-2 border rounded"
              value={quizSize}
              onChange={(e) => setQuizSize(Number(e.target.value))}
            >
              <option value="">選擇題目數量</option>
              <option value="10">10 題</option>
              <option value="20">20 題</option>
            </select>

            {/* 章節篩選 */}
            <select
              multiple
              className="w-full p-2 border rounded h-24"
              value={selectedChapters}
              onChange={(e) =>
                setSelectedChapters(Array.from(e.target.selectedOptions, (opt) => opt.value))
              }
            >
              {chapterOptions.map((ch) => (
                <option key={ch} value={ch}>{ch}</option>
              ))}
            </select>

            <button
              onClick={handleStartQuiz}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              disabled={loadingStart}
            >
              {loadingStart ? "載入中..." : "開始刷題"}
            </button>
            {errorStart && <p className="text-red-600">{errorStart}</p>}
          </div>
        )}

        {step === "quiz" && (
          <div className="w-full max-w-3xl space-y-6">

            {/* 刷題作答 */}
            {!submitted ? (
              <>
                <div className="bg-gray-100 p-4 rounded text-sm text-gray-600">
                  已作答：{totalAnswered} / {questions.length} 題｜錯誤 {totalWrong} 題
                </div>

                {questions.map((q, idx) => (
                  <div key={q.id} className="p-4 border rounded shadow-sm bg-white">
                    <p className="font-semibold mb-2">{idx + 1}. {q.question}</p>
                    {q.options.map((opt: string, i: number) => (
                      <label key={i} className="block">
                        <input
                          type="radio"
                          name={`q-${idx}`}
                          value={opt}
                          checked={userAnswers[idx] === opt}
                          onChange={() => handleAnswer(idx, opt)}
                          className="mr-2"
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                ))}

                <button
                  className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                  onClick={handleSubmitQuiz}
                >
                  交卷
                </button>
              </>
            ) : (
              <>
                {/* 結果與解析 */}
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-green-700 mb-2">作答完成 🎉</h2>
                  <p className="text-lg mb-4">得分：<span className="font-bold">{score} 分</span></p>
                </div>

                {/* 錯題解析 */}
                <div className="space-y-4">
                  {questions.map((q, idx) => (
                    userAnswers[idx] !== q.answer && (
                      <div key={q.id} className="border p-4 rounded bg-gray-50">
                        <p><strong>題目：</strong>{q.question}</p>
                        <p><strong>你的答案：</strong>{userAnswers[idx]}</p>
                        <p><strong>正確答案：</strong>{q.answer}</p>
                        <p><strong>解析：</strong>{q.explanation}</p>
                      </div>
                    )
                  ))}
                </div>

                {/* 行動按鈕 */}
                <div className="flex gap-4 mt-6">
                  <button
                    className="flex-1 bg-gray-300 py-2 rounded"
                    onClick={handleRetry}
                  >
                    重新作答
                  </button>
                  <button
                    className="flex-1 bg-gray-300 py-2 rounded"
                    onClick={handleReset}
                  >
                    回到首頁
                  </button>
                </div>

                {/* 啟動 AI 分析 */}
                <div className="mt-6">
                  <button
                    onClick={handleAnalyzePerformance}
                    disabled={analyzing}
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                  >
                    {analyzing ? "分析中..." : "啟動 AI 學習建議"}
                  </button>
                  {errorAnalyze && <p className="text-red-600">{errorAnalyze}</p>}
                  {analysisResult && (
                    <div className="mt-4 p-4 border rounded bg-gray-50 whitespace-pre-line">
                      {analysisResult}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center text-gray-400 text-sm p-4">
        &copy; 2025 PromptQuiz. All rights reserved.
      </footer>

    </div>
  );
}
