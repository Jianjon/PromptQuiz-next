"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Quiz = {
  id: string;
  title: string;
  description: string;
};

export default function PracticeStartPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuizId = searchParams.get("quiz");

  const [step, setStep] = useState<"info" | "quiz">(urlQuizId ? "quiz" : "info");
  const [mode, setMode] = useState<"quiz" | "custom">("quiz");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");

  const [quizList, setQuizList] = useState<Quiz[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState<string>(urlQuizId || "");

  const [quizSize, setQuizSize] = useState<number | "">("");
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const chapterOptions = ["淨零碳排", "碳盤查"];

  const [questions, setQuestions] = useState<any[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<string>("");

  const [loadingStart, setLoadingStart] = useState(false);
  const [errorStart, setErrorStart] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [errorAnalyze, setErrorAnalyze] = useState<string | null>(null);

  useEffect(() => {
    if (!urlQuizId) fetchQuizList();
    if (urlQuizId) handleAutoLoadQuiz(urlQuizId);
  }, [urlQuizId]);

  const fetchQuizList = async () => {
    try {
      const res = await fetch("/api/quiz");
      const data = await res.json();
      setQuizList(data.quizzes || []);
    } catch (err) {
      console.error("無法取得題組列表", err);
    }
  };

  const handleAutoLoadQuiz = async (quizId: string) => {
    setLoadingStart(true);
    try {
      const res = await fetch(`/api/quiz/${quizId}`);
      const data = await res.json();
      if (res.ok && data.questions) {
        setQuestions(data.questions);
        setUserAnswers(new Array(data.questions.length).fill(""));
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

  const handleStartQuiz = async () => {
    if (!name || !email || !organization) {
      alert("請完整填寫資料");
      return;
    }

    if (mode === "quiz" && !selectedQuizId) {
      alert("請選擇題組");
      return;
    }

    if (mode === "custom" && (!quizSize || selectedChapters.length === 0)) {
      alert("請選擇題數與主題");
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
      let apiUrl = "";
      if (mode === "quiz") {
        apiUrl = `/api/question?quizId=${selectedQuizId}`;
      } else {
        const params = new URLSearchParams();
        params.append("limit", String(quizSize));
        params.append("chapters", selectedChapters.join(","));
        apiUrl = `/api/question?${params.toString()}`;
      }

      const res = await fetch(apiUrl);
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

  const handleAnswer = (idx: number, value: string) => {
    const updated = [...userAnswers];
    updated[idx] = value;
    setUserAnswers(updated);
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswer || userAnswers[idx] === q.answer) correctCount++;
    });
    setScore(Math.round((correctCount / questions.length) * 100));
    setSubmitted(true);
  };

  const totalAnswered = userAnswers.filter((a) => a).length;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-blue-50">
      <section className="flex flex-col items-center justify-center py-16 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">刷題模式</h1>
      </section>

      <main className="flex flex-col items-center flex-1 p-6">
        {step === "info" && !urlQuizId && (
          <div className="w-full max-w-lg space-y-4">
            <div className="flex gap-4">
              <button onClick={() => setMode("quiz")} className={`px-4 py-2 rounded ${mode === "quiz" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>題組模式</button>
              <button onClick={() => setMode("custom")} className={`px-4 py-2 rounded ${mode === "custom" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>自選主題</button>
            </div>

            <input type="text" placeholder="姓名" className="w-full p-2 border rounded" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="email" placeholder="Email" className="w-full p-2 border rounded" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="text" placeholder="單位" className="w-full p-2 border rounded" value={organization} onChange={(e) => setOrganization(e.target.value)} />

            {mode === "quiz" ? (
              <select className="w-full p-2 border rounded" value={selectedQuizId} onChange={(e) => setSelectedQuizId(e.target.value)}>
                <option value="">請選擇題組</option>
                {quizList.map((quiz) => (
                  <option key={quiz.id} value={quiz.id}>{quiz.title}</option>
                ))}
              </select>
            ) : (
              <>
                <select className="w-full p-2 border rounded" value={quizSize} onChange={(e) => setQuizSize(Number(e.target.value))}>
                  <option value="">選擇題目數量</option>
                  <option value="5">5 題</option>
                  <option value="10">10 題</option>
                  <option value="20">20 題</option>
                </select>

                <select multiple className="w-full p-2 border rounded h-24" value={selectedChapters} onChange={(e) => setSelectedChapters(Array.from(e.target.selectedOptions, (opt) => opt.value))}>
                  {chapterOptions.map((ch) => (
                    <option key={ch} value={ch}>{ch}</option>
                  ))}
                </select>
              </>
            )}

            <button onClick={handleStartQuiz} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition" disabled={loadingStart}>
              {loadingStart ? "載入中..." : "開始刷題"}
            </button>
            {errorStart && <p className="text-red-600">{errorStart}</p>}
          </div>
        )}

        {step === "quiz" && (
          <div className="w-full max-w-4xl space-y-6">
            {questions.map((q, idx) => (
              <div key={q.id} className="bg-white p-6 rounded-xl shadow space-y-2">
                <p className="font-semibold">{idx + 1}. {q.question}</p>
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
              </div>
            ))}

            {!submitted && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleSubmitQuiz}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  disabled={totalAnswered !== questions.length}
                >
                  送出作答
                </button>
              </div>
            )}

            {submitted && (
              <div className="text-center space-y-8 mt-12">
                <h2 className="text-3xl font-bold text-green-600">刷題完成 🎉</h2>
                <p className="text-2xl text-gray-800">
                  得分：<span className="font-bold">{score} 分</span>
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="text-center text-gray-400 text-sm p-4">&copy; 2025 PromptQuiz. All rights reserved.</footer>
    </div>
  );
}
