// components/FileDropzone.tsx
"use client";

import React, { useState } from "react";
import { ExtractedParagraph } from "@/types/extracted";

interface Props { onExtracted: (p: ExtractedParagraph[]) => void; }
export default function FileDropzone({ onExtracted }: Props) {
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setParsing(true);
    setError(null);

    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/pdf/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!data.paragraphs) throw new Error("解析失敗");
      onExtracted(data.paragraphs);
    } catch (err: any) {
      console.error(err);
      setError("❌ 檔案解析失敗，請重試");
    } finally {
      setParsing(false);
    }
  };

  return (
    <div className="mb-4">
      <label className="block font-semibold mb-1">📂 上傳教案檔案</label>
      <input
        type="file"
        accept=".pdf,.doc,.docx,.txt"
        onChange={handleUpload}
        disabled={parsing}
      />
      {parsing && <p className="text-sm text-gray-600 mt-1">🔄 正在解析檔案…</p>}
      {error && (
        <div className="mt-1 text-red-500">
          <p>{error}</p>
          <button
            onClick={() => setError(null)}
            className="underline text-sm"
          >重試上傳</button>
        </div>
      )}
    </div>
  );
}
