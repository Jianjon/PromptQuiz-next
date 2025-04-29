"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function CreatorDashboardPage() {
  const [quizCount, setQuizCount] = useState(0);

  useEffect(() => {
    fetch("/api/quiz")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.quizzes)) {
          setQuizCount(data.quizzes.length);
        }
      })
      .catch((err) => console.error("取得題組數錯誤", err));
  }, []);

  return (
    <div className="min-h-screen p-10 bg-gradient-to-b from-white to-blue-50">
      <h1 className="text-3xl font-bold mb-8 text-blue-800">🎯 我的出題儀表板</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/creator/upload" className="block border p-6 rounded-xl bg-white shadow hover:shadow-md">
          <h2 className="text-xl font-semibold mb-2">📄 上傳教材</h2>
          <p className="text-gray-600">上傳 PDF、Word 等原始資料，切段並用來出題</p>
        </Link>

        <Link href="/creator/quiz-create" className="block border p-6 rounded-xl bg-white shadow hover:shadow-md">
          <h2 className="text-xl font-semibold mb-2">✏️ 建立題組</h2>
          <p className="text-gray-600">從段落或手動建立題目，整合成題組</p>
        </Link>

        <Link href="/creator/quiz-manage" className="block border p-6 rounded-xl bg-white shadow hover:shadow-md">
          <h2 className="text-xl font-semibold mb-2">📦 管理題組</h2>
          <p className="text-gray-600">查看、刪除或日後編輯題組內容</p>
        </Link>

        <div className="border p-6 rounded-xl bg-white shadow">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">📊 出題統計</h2>
          <p className="text-gray-700 mb-2">目前已建立 <span className="font-bold text-blue-700">{quizCount}</span> 組題組</p>
          <Link href="/creator/quiz-create">
            <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">➕ 新增題組</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
