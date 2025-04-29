"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function QuizAnswerPage() {
  const { id } = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<any>(null);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [user, setUser] = useState<{ name: string; email?: string; organization?: string } | null>(null);
  const [feedback, setFeedback] = useState<any>(null);

  useEffect(() => {
    const userInfo = localStorage.getItem("quizUser");
    if (!userInfo) {
      router.push(`/quiz/${id}/start`);
      return;
    }
    setUser(JSON.parse(userInfo));
  }, [id, router]);

  useEffect(() => {
    const fetchQuiz = async () => {
      const res = await fetch(`/api/quiz/${id}`);
      const data = await res.json();
      if (data?.questions) setQuiz(data);
    };
    fetchQuiz();
  }, [id]);

  const handleSelect = (qIndex: number, selected: string) => {
    if (submitted) return;
    setAnswers({ ...answers, [qIndex]: selected });
  };

  const handleSubmit = async () => {
    if (!quiz || !user) return;
    const payload = quiz.questions.map((q: any, i: number) => ({
      question: q.question,
      userAnswer: answers[i],
      correctAnswer: q.answer,
      explanation: q.explanation,
    }));

    const res = await fetch("/api/quiz/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, user, questions: payload }),
    });

    const data = await res.json();
    setFeedback(data.feedback);
    setSubmitted(true);
  };

  if (!quiz) return <div className="text-center py-20 text-gray-400">載入中...</div>;

  const total = quiz.questions.length;
  const correct = quiz.questions.filter((q: any, i: number) => answers[i] === q.answer).length;
  const percent = (correct / total) * 100;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">📝 開始作答</h1>

      {quiz.questions.map((q: any, index: number) => {
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

            {submitted && quiz.meta?.showAnswersAfterSubmit && (
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
            disabled={Object.keys(answers).length < quiz.questions.length}
          >
            📩 送出作答
          </button>
        </div>
      )}

      {/* ✅ 顯示得分模式 */}
      {submitted && quiz.meta?.scoringMode !== "none" && (
        <div className="mt-8 p-4 border rounded bg-white shadow text-center">
          <h2 className="text-lg font-bold mb-2 text-gray-800">📊 作答結果</h2>
          {quiz.meta.scoringMode === "number" && (
            <p className="text-xl">✅ {correct} / {total} 題答對</p>
          )}
          {quiz.meta.scoringMode === "passfail" && (
            <p className={`text-xl font-bold ${percent >= 60 ? "text-green-600" : "text-red-500"}`}>
              {percent >= 60 ? "🎉 及格！" : "❌ 未及格"}
            </p>
          )}
        </div>
      )}

      {/* ✅ GPT 回饋（meta 控制） */}
      {submitted && quiz.meta?.showFeedback && feedback && (
        <div className="mt-8 p-6 border bg-yellow-50 rounded shadow">
          <h2 className="text-lg font-bold mb-2 text-yellow-800">📘 GPT 回饋摘要</h2>
          <p className="mb-3">{feedback.summary}</p>
          <ul className="list-disc list-inside text-gray-800 space-y-1">
            {feedback.suggestions.map((s: string, i: number) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
