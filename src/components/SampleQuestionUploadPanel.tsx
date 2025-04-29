"use client";

import React, { useState } from "react";

interface SampleQuestionUploadPanelProps {
  onSampleUploaded?: (sampleContent: string) => void;
}

export default function SampleQuestionUploadPanel({ onSampleUploaded }: SampleQuestionUploadPanelProps) {
  const [sampleText, setSampleText] = useState<string>("");

  const handleUpload = () => {
    if (!sampleText.trim()) {
      alert("請先輸入或貼上樣題內容！");
      return;
    }
    if (onSampleUploaded) {
      onSampleUploaded(sampleText.trim());
    }
    alert("樣題上傳成功 ✅");
  };

  return (
    <div className="p-4 bg-white rounded shadow space-y-4">
      <h2 className="text-lg font-semibold">📝 上傳樣題</h2>

      <textarea
        className="w-full p-2 border rounded"
        rows={6}
        placeholder="請貼上代表性的題目或題型說明，供 GPT 出題參考..."
        value={sampleText}
        onChange={(e) => setSampleText(e.target.value)}
      />

      <button
        className="px-4 py-2 bg-green-600 text-white rounded w-full"
        onClick={handleUpload}
      >
        上傳樣題
      </button>
    </div>
  );
}
