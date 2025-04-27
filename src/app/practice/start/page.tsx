"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { analyzeQuizPerformance } from "@/lib/agents/quizPerformanceAnalyzer";

export default function PracticeStartPage() {
  const [step, setStep] = useState<"info" | "quiz">("info");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");

  const [questions, setQuestions] = useState<any[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string>("");

  const handleStartQuiz = () => {
    if (!name || !email || !organization) {
      alert("請完整填寫姓名、Email、單位");
      return;
    }
    const mockQuestions = [
      {
        question: "淨零碳排是指？",
        options: ["減少排放", "碳捕捉", "碳中和", "停止生產"],
        answer: "碳中和",
        explanation: "淨零碳排指的是整體碳排放量為零，通常透過碳中和方式達成。"
      },
      {
        question: "碳盤查第一步是？",
        options: ["設定目標", "收集數據", "制定計畫", "建立團隊"],
        answer: "收集數據",
        explanation: "碳盤查需要從收集現有數據開始，作為後續基礎。"
      }
    ];
    setQuestions(mockQuestions);
    setUserAnswers(new Array(mockQuestions.length).fill(""));
    setStep("quiz");
  };

  const handleAnswer = (idx: number, value: string) => {
    const updated = [...userAnswers];
    updated[idx] = value;
    setUserAnswers(updated);
  };

  const handleSubmitQuiz = () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (q.answer === userAnswers[idx]) {
        correct++;
      }
    });
    setScore(Math.round((correct / questions.length) * 100));
    setSubmitted(true);
  };

  const handleAnalyzePerformance = async () => {
    setAnalyzing(true);
    try {
      const userInfo = { name, email, organization };
      const quizResults = questions.map((q, idx) => ({
        question: q.question,
        correct: q.answer === userAnswers[idx],
        userAnswer: userAnswers[idx],
        correctAnswer: q.answer,
      }));
      const result = await analyzeQuizPerformance(userInfo, quizResults);
      setAnalysisResult(result);
    } catch (err) {
      console.error("診斷失敗", err);
      setAnalysisResult("⚠️ 診斷過程中發生錯誤，請稍後再試。");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
      {step === "info" && (
        <div className="max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6">🎯 開始刷題練習</h1>
          <div className="space-y-4">
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
            <button
              className="w-full bg-blue-600 text-white py-2 rounded"
              onClick={handleStartQuiz}
            >開始刷題</button>
          </div>
        </div>
      )}

      {step === "quiz" && (
        <div className="max-w-2xl w-full">
          {!submitted ? (
            <>
              <h1 className="text-2xl font-bold mb-6">請作答：</h1>
              {questions.map((q, idx) => (
                <div key={idx} className="border p-4 rounded mb-6">
                  <p className="font-semibold mb-4">{idx + 1}. {q.question}</p>
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
              >交卷</button>
            </>
          ) : (
            <div>
              <h1 className="text-2xl font-bold text-green-600 mb-6">作答完成 🎉</h1>
              <p className="text-xl mb-4">你的得分是：<span className="font-bold">{score} 分</span></p>
              <h2 className="text-lg font-semibold mb-4">錯題解析：</h2>
              {questions.map((q, idx) => (
                userAnswers[idx] !== q.answer && (
                  <div key={idx} className="border p-4 rounded mb-4">
                    <p><strong>題目：</strong> {q.question}</p>
                    <p><strong>你的答案：</strong> {userAnswers[idx]}</p>
                    <p><strong>正確答案：</strong> {q.answer}</p>
                    <p><strong>解釋：</strong> {q.explanation}</p>
                  </div>
                )
              ))}

              <div className="mt-6">
                <button
                  className="w-full bg-blue-500 text-white py-2 rounded"
                  onClick={handleAnalyzePerformance}
                  disabled={analyzing}
                >{analyzing ? "AI分析中..." : "🧠 啟動AI診斷建議"}</button>
              </div>

              {analysisResult && (
                <div className="mt-6 p-4 border rounded bg-gray-50">
                  <h2 className="text-lg font-semibold mb-2">📚 AI學習補充建議：</h2>
                  <p className="whitespace-pre-line">{analysisResult}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}