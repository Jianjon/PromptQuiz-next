"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const name = localStorage.getItem("creatorName");
    const email = localStorage.getItem("creatorEmail");
    if (!name || !email) {
      router.replace("/login");
    }
  }, [router]);

  const cards = [
    {
      title: "建立刷題組",
      description: "建立主題式刷題題組，方便學生自主練習。",
      href: "/practice/manage",
    },
    {
      title: "建立正式考卷",
      description: "設定完整測驗，計分評比學生表現。",
      href: "/exam/start",
    },
    {
      title: "建立教學課程",
      description: "編輯教案，搭配小練習題，提升學習成效。",
      href: "/lesson/start",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 flex flex-col items-center justify-center p-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">請選擇建立的模式</h1>
        <p className="text-gray-600">選擇一種任務開始操作</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        {cards.map((card) => (
          <div
            key={card.title}
            onClick={() => router.push(card.href)}
            className="bg-white rounded-2xl shadow-md p-8 cursor-pointer hover:shadow-lg hover:scale-[1.03] transition-all"
          >
            <div className="h-32 bg-gray-100 rounded-xl mb-6 flex items-center justify-center text-gray-400">
              {/* 圖示可放此區域 */}
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">{card.title}</h2>
            <p className="text-gray-600 text-sm">{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}