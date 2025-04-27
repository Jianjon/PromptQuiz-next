"use client";

import React, { useState } from "react";

export default function FileUploadPreview() {
  const [paragraphs, setParagraphs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/parse", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data?.paragraphs) setParagraphs(data.paragraphs);
      else throw new Error("無法取得段落內容");
    } catch (err: any) {
      console.error("上傳失敗", err);
      setError("處理檔案時發生錯誤");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📂 檔案上傳與段落預覽</h1>

      <input
        type="file"
        accept=".pdf,.txt,.docx,.xlsx"
        onChange={handleFileChange}
        className="mb-4"
      />

      {loading && <p className="text-blue-600">讀取中...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="mt-4 space-y-3">
        {paragraphs.map((p: any, i: number) => (
          <div
            key={i}
            className="p-3 border rounded bg-white text-sm shadow"
          >
            <strong>📎 來源：</strong> {p.source}
            <br />
            <strong>📄 內容：</strong> {p.content}
          </div>
        ))}
      </div>
    </div>
  );
}
