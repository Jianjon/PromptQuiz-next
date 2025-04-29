"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Quiz = {
  id: string;
  title: string;
  description: string;
};

export default function PracticeStartPage() {
  const router = useRouter();

  const [step, setStep] = useState<"info" | "quiz">("info");
  const [mode, setMode] = useState<"quiz" | "custom">("quiz");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");

  const [quizList, setQuizList] = useState<Quiz[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState<string>("");

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
    fetchQuizList();
  }, []);

  const fetchQuizList = async () => {
    try {
      const res = await fetch("/api/quiz");
      const data = await res.json();
      setQuizList(data.quizzes || []);
    } catch (err) {
      console.error("無法取得題組列表", err);
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
      if (userAnswers[idx] === q.answer) correctCount++;
    });
    setScore(Math.round((correctCount / questions.length) * 100));
    setSubmitted(true);
  };

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
  const totalWrong = questions.filter((q, idx) => userAnswers[idx] && userAnswers[idx] !== q.answer).length;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-blue-50">
      <section className="flex flex-col items-center justify-center py-16 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">刷題模式</h1>
        <p className="text-gray-600">選擇練習模式與題目來源</p>
      </section>

      <main className="flex flex-col items-center flex-1 p-6">
        {step === "info" && (
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

        {/* 題目作答與結果區略，同前版保留 */}
      </main>

      <footer className="text-center text-gray-400 text-sm p-4">&copy; 2025 PromptQuiz. All rights reserved.</footer>
    </div>
  );
}
