// src/app/dev/topic/page.tsx

"use client";

import React, { useState } from "react";
import { scrapeWebsite } from "@/lib/fileReaders/webScraper";
import { synthesizeKnowledge } from "@/lib/agents/knowledgeSynthesizer";
import { saveTopic, getAllTopics } from "@/lib/topicStore";

export default function TopicDevPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [topics, setTopics] = useState<any[]>([]);

  const handleRun = async () => {
    setLoading(true);
    const paragraphs = await scrapeWebsite(url);
    const synthesized = await synthesizeKnowledge(paragraphs);
    const saved = synthesized.map((t) => saveTopic(t, url));
    setTopics(saved);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">🧪 Topic Bank 測試工具</h1>

      <div className="mb-4">
        <input
          className="w-full border p-2 rounded"
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="請輸入網站網址"
        />
      </div>
      <button
        onClick={handleRun}
        disabled={loading || !url.trim()}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {loading ? "分析中..." : "開始擷取並產生主題"}
      </button>

      <div className="mt-8 space-y-6">
        {topics.map((entry) => (
          <div key={entry.id} className="p-4 bg-gray-100 rounded border">
            <h2 className="font-bold text-lg mb-2">📌 {entry.data.topic}</h2>
            <p className="text-sm text-gray-600 mb-2">來源：{entry.source}</p>
            <p className="text-gray-800 mb-2">摘要：{entry.data.summary}</p>
            <ul className="list-disc list-inside text-sm text-gray-700">
              {entry.data.keyPoints.map((kp: string, i: number) => (
                <li key={i}>{kp}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
