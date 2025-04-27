// src/components/TopicSelector.tsx
"use client";

import React, { useEffect, useState } from "react";
import { ExtractedParagraph } from "../types/extracted";         // 相對路徑
import { synthesizeTopics } from "../lib/knowledgeSynthesizer";  // 相對路徑

interface TopicSelectorProps {
  extracted: ExtractedParagraph[];
  onSelect: (text: string) => void;
}

export default function TopicSelector({
  extracted,
  onSelect,
}: TopicSelectorProps) {
  const [topics, setTopics] = useState<string[]>([]);

  useEffect(() => {
    if (extracted.length > 0) {
      const result = synthesizeTopics(extracted);
      setTopics(result);
    } else {
      setTopics([]);
    }
  }, [extracted]);

  return (
    <div className="mb-4">
      <p className="font-semibold mb-2">📚 推薦主題：</p>
      <div className="flex flex-wrap gap-2">
        {topics.length > 0 ? (
          topics.map((t, idx) => (
            <button
              key={idx}
              className="px-3 py-1 rounded bg-gray-100 hover:bg-blue-100 text-sm border"
              onClick={() => onSelect(t)}
            >
              {t}
            </button>
          ))
        ) : (
          <p className="text-sm text-gray-500">
            （尚無主題，請先上傳檔案）
          </p>
        )}
      </div>
    </div>
  );
}
