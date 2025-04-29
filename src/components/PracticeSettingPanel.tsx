"use client";

import React, { useState, useEffect } from "react";

interface PracticeSettingPanelProps {
  availableTopics?: string[]; // 傳進來目前有哪些主題（選擇）
  onSettingChange?: (setting: { selectedTopic: string; questionCount: number }) => void;
}

export default function PracticeSettingPanel({ availableTopics = [], onSettingChange }: PracticeSettingPanelProps) {
  const [selectedTopic, setSelectedTopic] = useState<string>("全部主題");
  const [questionCount, setQuestionCount] = useState<number>(10);

  useEffect(() => {
    if (onSettingChange) {
      onSettingChange({ selectedTopic, questionCount });
    }
  }, [selectedTopic, questionCount, onSettingChange]);

  return (
    <div className="p-4 bg-white rounded shadow space-y-4">
      <h2 className="text-lg font-semibold">⚙️ 刷題設定</h2>

      {/* 選擇主題篩選 */}
      <div className="space-y-2">
        <label className="block font-medium">選擇主題</label>
        <select
          className="w-full p-2 border rounded"
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
        >
          <option value="全部主題">全部主題</option>
          {availableTopics.map((topic, idx) => (
            <option key={idx} value={topic}>{topic}</option>
          ))}
        </select>
      </div>

      {/* 選擇出題數量 */}
      <div className="space-y-2">
        <label className="block font-medium">選擇出題數量</label>
        <input
          type="number"
          className="w-full p-2 border rounded"
          value={questionCount}
          min={1}
          max={100}
          onChange={(e) => setQuestionCount(Number(e.target.value))}
        />
      </div>
    </div>
  );
}
