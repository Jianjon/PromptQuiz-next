"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function QuizStartPage() {
  const { id } = useParams(); // ✅ 直接從 [id] 抓
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [error, setError] = useState("");

  const handleStart = () => {
    if (!name.trim()) {
      setError("請輸入您的姓名");
      return;
    }
    const userInfo = { name, email, organization };
    localStorage.setItem("quizUser", JSON.stringify(userInfo));
    router.push(`/quiz/${id}`);
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white border rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">📝 問卷填寫資料</h1>
      <p className="text-sm text-gray-500 mb-6 text-center">請填寫基本資料後開始作答</p>

      <label className="block mb-2 font-medium">姓名 *</label>
      <input
        type="text"
        className="w-full border rounded px-3 py-2 mb-4"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label className="block mb-2 font-medium">Email（可選填）</label>
      <input
        type="email"
        className="w-full border rounded px-3 py-2 mb-4"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label className="block mb-2 font-medium">單位／組織（可選填）</label>
      <input
        type="text"
        className="w-full border rounded px-3 py-2 mb-4"
        value={organization}
        onChange={(e) => setOrganization(e.target.value)}
      />

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <button
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        onClick={handleStart}
      >
        ➡️ 開始作答
      </button>
    </div>
  );
}
