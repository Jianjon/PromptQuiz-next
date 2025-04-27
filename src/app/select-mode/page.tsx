"use client";

import { useRouter } from "next/navigation";

export default function SelectModePage() {
  const router = useRouter();

  const handleSelect = (mode: "teach" | "exam" | "practice") => {
    router.push(`/${mode}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-6">
      <h1 className="text-3xl font-bold mb-6">請選擇模式</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
        <button
          className="p-6 border rounded-lg hover:bg-blue-100 text-lg"
          onClick={() => handleSelect("teach")}
        >
          📚 教學模式
        </button>
        <button
          className="p-6 border rounded-lg hover:bg-green-100 text-lg"
          onClick={() => handleSelect("exam")}
        >
          📝 考試模式
        </button>
        <button
          className="p-6 border rounded-lg hover:bg-yellow-100 text-lg"
          onClick={() => handleSelect("practice")}
        >
          🎯 刷題模式
        </button>
      </div>
    </div>
  );
}
