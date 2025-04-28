"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // 如果已經登入過，自動跳轉到 dashboard
  useEffect(() => {
    const storedName = localStorage.getItem("creatorName");
    const storedEmail = localStorage.getItem("creatorEmail");
    if (storedName && storedEmail) {
      router.replace("/dashboard");
    }
  }, [router]);

  const handleLogin = () => {
    if (!name.trim() || !email.trim()) {
      alert("請填寫完整姓名與Email");
      return;
    }
    localStorage.setItem("creatorName", name.trim());
    localStorage.setItem("creatorEmail", email.trim());
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-white to-blue-50">
      <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">創造者登入</h1>
        <p className="text-center text-gray-500 mb-8 text-sm">請輸入您的基本資料開始建立題目或課程</p>

        <input
          type="text"
          placeholder="姓名"
          className="w-full p-3 mb-4 border rounded-md"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-6 border rounded-md"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md transition-all font-semibold"
        >
          登入
        </button>
      </div>
    </div>
  );
}
