"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatorUploadPage() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [segments, setSegments] = useState<string[]>([]);
  const [fileId, setFileId] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);
    setSegments([]);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/pdf/upload", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();

      if (res.ok) {
        setSegments(json.segments || []);
        setFileId(json.fileId || null);
      } else {
        setError(json.message || "無法處理上傳的檔案");
      }
    } catch (err) {
      setError("網路錯誤，請稍後再試");
    } finally {
      setUploading(false);
    }
  };

  const handleGoToQuizCreate = () => {
    if (fileId) {
      router.push(`/creator/quiz-create?fileId=${fileId}`);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">上傳教材檔案</h1>

      <input
        type="file"
        accept=".pdf,.txt,.docx"
        onChange={handleFileChange}
        className="mb-4"
      />

      <button
        onClick={handleUpload}
        disabled={uploading || !file}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        {uploading ? "上傳中..." : "開始上傳"}
      </button>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {segments.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">切段結果（{segments.length} 段）</h2>
          <div className="space-y-2">
            {segments.map((seg, idx) => (
              <div key={idx} className="p-2 border rounded bg-gray-100 text-sm">
                {seg.length > 100 ? `${seg.slice(0, 100)}...` : seg}
              </div>
            ))}
          </div>

          <button
            onClick={handleGoToQuizCreate}
            className="mt-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            以此內容建立題組
          </button>
        </div>
      )}
    </div>
  );
}
