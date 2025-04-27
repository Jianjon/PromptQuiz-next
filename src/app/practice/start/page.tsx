"use client";

import React, { useState } from "react";

export default function PracticeStartPage() {
  const [step, setStep] = useState<"info" | "quiz">("info");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [quizSize, setQuizSize] = useState<number | "">("");

  // 預留章節篩選 UI
  const chapterOptions = ["淨零碳排", "碳盤查"];
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);

  const [questions, setQuestions] = useState<any[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Loading / Error 狀態
  const [loadingStart, setLoadingStart] = useState(false);
  const [errorStart, setErrorStart] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string>("");
  const [errorAnalyze, setErrorAnalyze] = useState<string | null>(null);

  // 第一步：呼叫後端取題
  const handleStartQuiz = async () => {
    if (!name || !email || !organization) {
      alert("請完整填寫姓名、Email、單位");
      return;
    }
    if (!quizSize) {
      alert("請選擇題目數量（10 題或 20 題）");
      return;
    }

    setLoadingStart(true);
    setErrorStart(null);
    setSubmitted(false);
    setScore(0);
    setAnalysisResult("");
    setErrorAnalyze(null);

    try {
      // 範例呼叫，未來可加入 &chapters=
      const params = new URLSearchParams();
      params.append("limit", String(quizSize));
      if (selectedChapters.length) params.append("chapters", selectedChapters.join(","));

      const res = await fetch(`/api/question?${params.toString()}`);
      const json = await res.json();
      if (res.ok && Array.isArray(json.questions)) {
        setQuestions(json.questions);
        setUserAnswers(new Array(json.questions.length).fill(""));
        setStep("quiz");
      } else {
        console.error("取題失敗", json);
        setErrorStart("無法取得題目，請稍後再試");
      }
    } catch (err) {
      console.error("網路錯誤", err);
      setErrorStart("連線錯誤，請稍後再試");
    } finally {
      setLoadingStart(false);
    }
  };

  // 更新用戶答案
  const handleAnswer = (idx: number, value: string) => {
    const updated = [...userAnswers];
    updated[idx] = value;
    setUserAnswers(updated);
  };

  // 第二步：交卷，計算分數與顯示解析
  const handleSubmitQuiz = () => {
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.answer) correctCount++;
    });
    setScore(Math.round((correctCount / questions.length) * 100));
    setSubmitted(true);
  };

  // 第三步：分析建議，呼叫後端 API
  const handleAnalyzePerformance = async () => {
    setAnalyzing(true);
    setErrorAnalyze(null);
    setAnalysisResult("");
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
        setAnalysisResult(
          `${data.supplementalContent || ""}\n\n${data.suggestion || ""}`
        );
      } else {
        console.error("分析回傳錯誤", data);
        setErrorAnalyze("AI 分析失敗，請稍後再試");
      }
    } catch (err) {
      console.error("分析失敗", err);
      setErrorAnalyze("⚠️ 無法取得 AI 建議，請稍後再試。");
    } finally {
      setAnalyzing(false);
    }
  };

  // 重新練習
  const handleRetry = () => {
    setSubmitted(false);
    setScore(0);
    setAnalysisResult("");
    setErrorAnalyze(null);
    setUserAnswers(new Array(questions.length).fill(""));
  };

  // 回到開始
  const handleReset = () => {
    setStep("info");
  };

  // 即時統計
  const totalAnswered = userAnswers.filter((a) => a).length;
  const totalWrong = questions.filter(
    (q, idx) => userAnswers[idx] && userAnswers[idx] !== q.answer
  ).length;

  return (
    <div className="flex flex-col items-center p-6">
      {step === "info" && (
        <div className="max-w-md w-full space-y-4">
          <h1 className="text-2xl font-bold">🎯 開始刷題練習</h1>

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

          {/* 章節篩選 */}
          <label className="block text-sm font-medium">選擇章節（預留）</label>
          <select
            multiple
            className="w-full p-2 border rounded h-24"
            value={selectedChapters}
            onChange={(e) =>
              setSelectedChapters(
                Array.from(e.target.selectedOptions, (opt) => opt.value)
              )
            }
          >
            {chapterOptions.map((ch) => (
              <option key={ch} value={ch}>
                {ch}
              </option>
            ))}
          </select>

          <button
            className="w-full bg-blue-600 text-white py-2 rounded"
            onClick={handleStartQuiz}
            disabled={loadingStart}
          >
            {loadingStart ? "題目載入中..." : "開始刷題"}
          </button>
          {errorStart && <p className="text-red-600">{errorStart}</p>}
        </div>
      )}

      {step === "quiz" && (
        <div className="max-w-2xl w-full">
          {!submitted ? (
            <>
              {/* 即時統計儀表板 */}
              <div className="mb-4 p-3 bg-gray-100 rounded">
                已作答：{totalAnswered} / {questions.length} 題，錯誤：{totalWrong} 題
              </div>

              <h1 className="text-2xl font-bold mb-4">請作答：</h1>
              {questions.map((q, idx) => (
                <div key={q.id} className="border p-4 rounded mb-6">
                  <p className="font-semibold mb-3">
                    {idx + 1}. {q.question}
                  </p>
                  {q.options.map((opt: string, i: number) => (
                    <label key={i} className="flex items-center gap-2 mb-2">
                      <input
                        type="radio"
                        name={`q-${idx}`}
                        value={opt}
                        checked={userAnswers[idx] === opt}
                        onChange={() => handleAnswer(idx, opt)}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              ))}
              <button
                className="w-full bg-green-600 text-white py-2 rounded"
                onClick={handleSubmitQuiz}
              >
                交卷
              </button>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-green-600 mb-4">
                作答完成 🎉
              </h1>
              <p className="text-xl mb-6">
                你的得分：<span className="font-bold">{score} 分</span>
              </p>

              <h2 className="text-lg font-semibold mb-3">錯題解析：</h2>
              {questions.map(
                (q, idx) =>
                  userAnswers[idx] !== q.answer && (
                    <div key={q.id} className="border p-4 rounded mb-4 bg-white">
                      <p>
                        <strong>題目：</strong> {q.question}
                      </p>
                      <p>
                        <strong>你的答案：</strong> {userAnswers[idx]}
                      </p>
                      <p>
                        <strong>正確答案：</strong> {q.answer}
                      </p>
                      <p>
                        <strong>解釋：</strong> {q.explanation}
                      </p>
                    </div>
                  )
              )}

              <div className="flex gap-2 mt-4">
                <button
                  className="flex-1 bg-gray-300 text-gray-800 py-2 rounded"
                  onClick={handleRetry}
                >
                  重新練習
                </button>
                <button
                  className="flex-1 bg-gray-300 text-gray-800 py-2 rounded"
                  onClick={handleReset}
                >
                  回到開始
                </button>
              </div>

              <div className="mt-6">
                <button
                  className="w-full bg-blue-500 text-white py-2 rounded"
                  onClick={handleAnalyzePerformance}
                  disabled={analyzing}
                >
                  {analyzing ? "AI 分析中..." : "🧠 啟動 AI 分析建議"}
                </button>
              </div>
              {errorAnalyze && <p className="text-red-600 mt-2">{errorAnalyze}</p>}

              {analysisResult && (
                <div className="mt-6 p-4 border rounded bg-gray-50 whitespace-pre-line">
                  📖 學習回饋：{analysisResult}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
