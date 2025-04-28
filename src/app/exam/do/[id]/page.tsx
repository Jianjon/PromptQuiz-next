"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DoExamPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  // 假資料模擬（未來可從API或localStorage讀）
  const mockExam = {
    title: "正式考試｜2025碳管理認證",
    description: "請依序作答，測試你的碳管理專業知識。",
    questions: [
      {
        question: "碳足跡的計算主要涉及哪些溫室氣體？",
        options: ["二氧化碳", "甲烷", "一氧化二氮", "以上皆是"],
        answer: "以上皆是",
      },
      {
        question: "ISO 14064標準主要針對什麼？",
        options: ["能源效率", "溫室氣體管理", "水資源管理", "空氣污染防制"],
        answer: "溫室氣體管理",
      },
    ],
  };

  const [userAnswers, setUserAnswers] = useState<string[]>(new Array(mockExam.questions.length).fill(""));
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSelect = (idx: number, value: string) => {
    const updated = [...userAnswers];
    updated[idx] = value;
    setUserAnswers(updated);
  };

  const handleSubmit = () => {
    let correctCount = 0;
    mockExam.questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.answer) correctCount++;
    });
    setScore(Math.round((correctCount / mockExam.questions.length) * 100));
    setSubmitted(true);
  };

  const handleRetry = () => {
    setUserAnswers(new Array(mockExam.questions.length).fill(""));
    setSubmitted(false);
    setScore(0);
  };

  const handleBackHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-gray-800">{mockExam.title}</h1>
        <p className="text-gray-600">{mockExam.description}</p>

        {!submitted ? (
          <div className="space-y-6 mt-10">
            {mockExam.questions.map((q, idx) => (
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
            <h2 className="text-3xl font-bold text-green-600">考試完成 🎉</h2>
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
