"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DoPracticePage({ params }: { params: { id: string } }) {
  const router = useRouter();

  // 假資料模擬（未來可從API或localStorage讀）
  const mockQuiz = {
    title: "2025淨零碳排刷題挑戰",
    description: "測試你對淨零碳排的了解！",
    questions: [
      {
        question: "什麼是碳中和？",
        options: ["減少碳排放", "全部抵銷碳排放", "禁止排放", "減少用電"],
        answer: "全部抵銷碳排放",
      },
      {
        question: "淨零碳排目標是哪一年？",
        options: ["2030", "2050", "2070", "2100"],
        answer: "2050",
      },
    ],
  };

  const [userAnswers, setUserAnswers] = useState<string[]>(new Array(mockQuiz.questions.length).fill(""));
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSelect = (idx: number, value: string) => {
    const updated = [...userAnswers];
    updated[idx] = value;
    setUserAnswers(updated);
  };

  const handleSubmit = () => {
    let correctCount = 0;
    mockQuiz.questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.answer) correctCount++;
    });
    setScore(Math.round((correctCount / mockQuiz.questions.length) * 100));
    setSubmitted(true);
  };

  const handleRetry = () => {
    setUserAnswers(new Array(mockQuiz.questions.length).fill(""));
    setSubmitted(false);
    setScore(0);
  };

  const handleBackHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-gray-800">{mockQuiz.title}</h1>
        <p className="text-gray-600">{mockQuiz.description}</p>

        {!submitted ? (
          <div className="space-y-6 mt-10">
            {mockQuiz.questions.map((q, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow space-y-2">
                <p className="font-semibold">{idx + 1}. {q.question}</p>
                {q.options.map((opt, i) => (
                  <label key={i} className="block">
                    <input
                      type="radio"
                      name={`q-${idx}`}
                      value={opt}
                      checked={userAnswers[idx] === opt}
                      onChange={() => handleSelect(idx, opt)}
                      className="mr-2"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            ))}

            <div className="flex justify-center mt-8">
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                提交作答
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-8 mt-12">
            <h2 className="text-3xl font-bold text-green-600">作答完成 🎉</h2>
            <p className="text-2xl text-gray-800">
              你的得分：<span className="font-bold">{score} 分</span>
            </p>

            <div className="flex justify-center gap-6 mt-8">
              <button
                onClick={handleRetry}
                className="px-6 py-3 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
              >
                重新作答
              </button>
              <button
                onClick={handleBackHome}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                返回首頁
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
