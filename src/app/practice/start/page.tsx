"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface Question {
  id: string;
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
  topic?: string;
}

export default function PracticeStartPage() {
  const searchParams = useSearchParams();
  const quizId = searchParams.get("quiz");

  const [step, setStep] = useState<"select" | "quiz" | "result">("select");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>("random");
  const [mode, setMode] = useState<"batch" | "single">("batch");
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (quizId) {
      fetch(`/api/quiz/${quizId}`)
        .then(res => res.json())
        .then(data => {
          setQuestions(data.questions || []);
        });
    }
  }, [quizId]);

  const availableTopics = Array.from(new Set(questions.map(q => q.topic || "未分類")));

  const filteredQuestions = selectedTopic === "random"
    ? [...questions].sort(() => Math.random() - 0.5).slice(0, 10)
    : questions.filter(q => q.topic === selectedTopic).slice(0, 10);

  const handleStart = () => {
    setUserAnswers(new Array(filteredQuestions.length).fill(""));
    setCurrentIdx(0);
    setSubmitted(false);
    setStep("quiz");
  };

  const handleAnswer = (idx: number, answer: string) => {
    const updated = [...userAnswers];
    updated[idx] = answer;
    setUserAnswers(updated);
  };

  const handleSubmitBatch = () => {
    let correct = 0;
    filteredQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.answer) correct++;
    });
    setScore(correct);
    setSubmitted(true);
    setStep("result");
  };

  const handleNextSingle = () => {
    if (currentIdx + 1 < filteredQuestions.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setStep("result");
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">刷題模式</h1>

      {step === "select" && (
        <div className="space-y-6">
          <div>
            <label className="font-semibold">選擇主題：</label>
            <select
              className="w-full border p-2 rounded mt-1"
              value={selectedTopic}
              onChange={e => setSelectedTopic(e.target.value)}
            >
              <option value="random">隨機出題</option>
              {availableTopics.map((topic, i) => (
                <option key={i} value={topic}>{topic}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold">出題模式：</label>
            <div className="flex gap-4 mt-2">
              <button
                className={`px-4 py-2 rounded ${mode === "batch" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                onClick={() => setMode("batch")}
              >一次十題</button>
              <button
                className={`px-4 py-2 rounded ${mode === "single" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                onClick={() => setMode("single")}
              >一題一題</button>
            </div>
          </div>

          <button
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            onClick={handleStart}
            disabled={questions.length === 0}
          >開始作答</button>
        </div>
      )}

      {step === "quiz" && mode === "batch" && (
        <div className="space-y-6">
          {filteredQuestions.map((q, idx) => (
            <div key={q.id} className="bg-gray-50 p-4 rounded shadow">
              <p className="font-semibold mb-2">{idx + 1}. {q.question}</p>
              {q.options.map((opt, i) => (
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
              {submitted && (
                <div className="text-sm mt-2">
                  {userAnswers[idx] === q.answer ? (
                    <p className="text-green-600">✅ 正確</p>
                  ) : (
                    <p className="text-red-600">❌ 錯誤，正解：<span className="text-green-700 font-semibold">{q.answer}</span></p>
                  )}
                  {q.explanation && <p className="text-gray-600">解析：{q.explanation}</p>}
                </div>
              )}
            </div>
          ))}
          {!submitted && (
            <button className="px-6 py-2 bg-blue-600 text-white rounded" onClick={handleSubmitBatch}>
              送出作答
            </button>
          )}
        </div>
      )}

      {step === "quiz" && mode === "single" && (
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded shadow">
            <p className="font-semibold mb-2">{currentIdx + 1}. {filteredQuestions[currentIdx].question}</p>
            {filteredQuestions[currentIdx].options.map((opt, i) => (
              <label key={i} className="block">
                <input
                  type="radio"
                  name={`q-${currentIdx}`}
                  value={opt}
                  checked={userAnswers[currentIdx] === opt}
                  onChange={() => handleAnswer(currentIdx, opt)}
                  className="mr-2"
                />
                {opt}
              </label>
            ))}
            {userAnswers[currentIdx] && (
              <div className="text-sm mt-2">
                {userAnswers[currentIdx] === filteredQuestions[currentIdx].answer ? (
                  <p className="text-green-600">✅ 正確</p>
                ) : (
                  <p className="text-red-600">❌ 錯誤，正解：<span className="text-green-700 font-semibold">{filteredQuestions[currentIdx].answer}</span></p>
                )}
                {filteredQuestions[currentIdx].explanation && <p className="text-gray-600">解析：{filteredQuestions[currentIdx].explanation}</p>}
              </div>
            )}
          </div>
          {userAnswers[currentIdx] && (
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded"
              onClick={handleNextSingle}
            >下一題</button>
          )}
        </div>
      )}

      {step === "result" && (
        <div className="text-center mt-12">
          <h2 className="text-3xl font-bold text-green-600 mb-4">🎉 完成作答</h2>
          <p className="text-xl">你的得分：{score} / {filteredQuestions.length}</p>
        </div>
      )}
    </div>
  );
}
