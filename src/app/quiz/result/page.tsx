"use client";

import React, { useEffect, useState } from "react";

export default function QuizResultPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<null | { summary: string; suggestions: string[] }>(null);

  useEffect(() => {
    const stored = localStorage.getItem("quizSession");
    if (stored) {
      setQuestions(JSON.parse(stored));
    }
  }, []);

  const handleSelect = (qIndex: number, selected: string) => {
    if (submitted) return;
    setAnswers({ ...answers, [qIndex]: selected });
  };

  const handleSubmit = async () => {
    const payload = questions.map((q, i) => ({
      question: q.question,
      userAnswer: answers[i],
      correctAnswer: q.answer,
      explanation: q.explanation,
    }));

    const res = await fetch("/api/response/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questions: payload }),
    });

    const data = await res.json();
    setFeedback(data.feedback || null);
    setSubmitted(true);
  };

  if (questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center text-gray-500">
        尚未建立題組，請先從 /generate 頁面建立題目。
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        ✅ 作答頁面（模擬問卷 + GPT 回饋）
      </h1>

      {questions.map((q, index) => {
        const userAnswer = answers[index];
        const isCorrect = userAnswer === q.answer;

        return (
          <div key={index} className="mb-6 p-4 border rounded bg-white shadow">
            <div className="font-semibold mb-2">{`${index + 1}. ${q.question}`}</div>
            <div className="space-y-2">
              {q.options.map((opt: string) => {
                const isSelected = userAnswer === opt;

                return (
                  <div
                    key={opt}
                    className={`p-2 rounded cursor-pointer border ${
                      submitted
                        ? isSelected
                          ? isCorrect
                            ? "bg-green-100 border-green-400"
                            : "bg-red-100 border-red-400"
                          : opt === q.answer
                          ? "bg-green-50 border-green-300"
                          : ""
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => handleSelect(index, opt)}
                  >
                    <input
                      type="radio"
                      name={`question-${index}`}
                      checked={isSelected}
                      readOnly
                      className="mr-2"
                    />
                    {opt}
                  </div>
                );
              })}
            </div>

            {submitted && (
              <div className="mt-2 text-sm text-gray-700">
                <strong>正確答案：</strong> {q.answer}
                <br />
                <strong>解說：</strong> {q.explanation}
              </div>
            )}
          </div>
        );
      })}

      {!submitted && (
        <div className="text-center">
          <button
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded"
            onClick={handleSubmit}
            disabled={Object.keys(answers).length < questions.length}
          >
            📩 送出作答
          </button>
        </div>
      )}

      {submitted && feedback && (
        <div className="mt-8 p-6 border bg-yellow-50 rounded shadow">
          <h2 className="text-lg font-bold mb-2 text-yellow-800">📘 GPT 回饋摘要</h2>
          <p className="mb-3">{feedback.summary}</p>
          <ul className="list-disc list-inside text-gray-800 space-y-1">
            {feedback.suggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
