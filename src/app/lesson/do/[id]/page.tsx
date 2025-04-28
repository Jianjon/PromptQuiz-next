"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DoLessonPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  // 假資料模擬（未來可從API或localStorage讀）
  const mockLesson = {
    title: "課程小測驗｜AI永續發展基礎",
    description: "檢視你對AI與永續發展概念的掌握程度。",
    questions: [
      {
        question: "哪一項是AI可以協助的永續應用領域？",
        options: ["能源管理", "廢棄物處理", "水資源管理", "以上皆是"],
        answer: "以上皆是",
      },
      {
        question: "永續發展的三大支柱不包含以下哪一項？",
        options: ["經濟發展", "社會責任", "環境保護", "軍事擴張"],
        answer: "軍事擴張",
      },
    ],
  };

  const [userAnswers, setUserAnswers] = useState<string[]>(new Array(mockLesson.questions.length).fill(""));
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSelect = (idx: number, value: string) => {
    const updated = [...userAnswers];
    updated[idx] = value;
    setUserAnswers(updated);
  };

  const handleSubmit = () => {
    let correctCount = 0;
    mockLesson.questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.answer) correctCount++;
    });
    setScore(Math.round((correctCount / mockLesson.questions.length) * 100));
    setSubmitted(true);
  };

  const handleRetry = () => {
    setUserAnswers(new Array(mockLesson.questions.length).fill(""));
    setSubmitted(false);
    setScore(0);
  };

  const handleBackHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-gray-800">{mockLesson.title}</h1>
        <p className="text-gray-600">{mockLesson.description}</p>

        {!submitted ? (
          <div className="space-y-6 mt-10">
            {mockLesson.questions.map((q, idx) => (
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
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                提交作答
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-8 mt-12">
            <h2 className="text-3xl font-bold text-green-600">測驗完成 🎉</h2>
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
