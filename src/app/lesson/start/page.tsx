"use client";

import { useRouter } from "next/navigation";

export default function LessonStartPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-white to-green-50">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">教學模式</h1>
        <p className="text-gray-600">開始你的學習旅程，探索課程與教材！</p>
      </header>

      <main className="flex flex-col items-center gap-6">
        <div className="h-40 w-40 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
          {/* 預留教材icon或圖片 */}
        </div>

        <button
          onClick={() => alert("教學功能尚未開放，敬請期待！")}
          className="px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
        >
          開始學習
        </button>
      </main>
    </div>
  );
}
