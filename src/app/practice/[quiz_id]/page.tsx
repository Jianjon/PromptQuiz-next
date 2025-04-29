"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { Question } from "@/types/question";

export default function PracticeQuizPage() {
  const { quiz_id } = useParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function fetchQuiz() {
      const res = await fetch(`/api/quiz/${quiz_id}`);
      if (res.ok) {
        const data = await res.json();
        setQuestions(data.questions);
      }
    }
    fetchQuiz();
  }, [quiz_id]);

  function handleSelect(questionId: string, answer: string) {
    setUserAnswers((prev) => ({ ...prev, [questionId]: answer }));
  }

  function handleSubmit() {
    setSubmitted(true);
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">匿名刷題</h1>

      {questions.map((q) => (
        <div key={q.id} className="mb-6 border p-4 rounded bg-white shadow">
          <p className="font-medium mb-2">{q.text}</p>
          <ul className="space-y-1">
            {q.options.map((opt: string, idx: number) => {
              const optionKey = String.fromCharCode(65 + idx);
              const isCorrect = submitted && optionKey === q.correctAnswer;
              const isWrong = submitted && userAnswers[q.id] === optionKey && !isCorrect;
              return (
                <li key={optionKey}>
                  <label
                    className={`block p-2 rounded cursor-pointer border
                      ${userAnswers[q.id] === optionKey ? "border-blue-500" : "border-gray-300"}
                      ${isCorrect ? "bg-green-100 border-green-500" : ""}
                      ${isWrong ? "bg-red-100 border-red-500" : ""}`}
                  >
                    <input
                      type="radio"
                      name={`question-${q.id}`}
                      value={optionKey}
                      checked={userAnswers[q.id] === optionKey}
                      onChange={() => handleSelect(q.id, optionKey)}
                      disabled={submitted}
                      className="mr-2"
                    />
                    {opt}
                  </label>
                </li>
              );
            })}
          </ul>
          {submitted && q.explanation && (
            <p className="mt-2 text-sm text-gray-600">解析：{q.explanation}</p>
          )}
        </div>
      ))}

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={Object.keys(userAnswers).length !== questions.length}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          送出答案
        </button>
      )}
    </div>
  );
}
