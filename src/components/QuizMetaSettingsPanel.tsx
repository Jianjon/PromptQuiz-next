"use client";

import React from "react";

export interface QuizMetaSettings {
  isPublic: boolean;
  showFeedback: boolean;
  showAnswersAfterSubmit: boolean;
  enableStats: boolean;
  scoringMode: "none" | "score" | "passfail";
}

interface Props {
  meta: QuizMetaSettings;
  setMeta: (meta: Partial<QuizMetaSettings>) => void;
}

export default function QuizMetaSettingsPanel({ meta, setMeta }: Props) {
  return (
    <div className="w-64 p-4 bg-gray-50 border-l space-y-4 text-sm">
      <h2 className="text-lg font-bold text-gray-700">🧾 題組權限與顯示設定</h2>

      <label className="block">
        <input
          type="checkbox"
          className="mr-2"
          checked={meta.isPublic}
          onChange={(e) => setMeta({ isPublic: e.target.checked })}
        />
        題組是否公開
      </label>

      <label className="block">
        <input
          type="checkbox"
          className="mr-2"
          checked={meta.showFeedback}
          onChange={(e) => setMeta({ showFeedback: e.target.checked })}
        />
        顯示 AI 解說
      </label>

      <label className="block">
        <input
          type="checkbox"
          className="mr-2"
          checked={meta.showAnswersAfterSubmit}
          onChange={(e) => setMeta({ showAnswersAfterSubmit: e.target.checked })}
        />
        顯示正確答案
      </label>

      <label className="block">
        <input
          type="checkbox"
          className="mr-2"
          checked={meta.enableStats}
          onChange={(e) => setMeta({ enableStats: e.target.checked })}
        />
        開放統計資料與排行榜
      </label>

      <div>
        <label className="block font-medium mb-1">成績顯示方式</label>
        <select
          className="w-full border rounded px-2 py-1"
          value={meta.scoringMode}
          onChange={(e) => setMeta({ scoringMode: e.target.value as QuizMetaSettings["scoringMode"] })}
        >
          <option value="none">不顯示</option>
          <option value="score">顯示分數</option>
          <option value="passfail">及格 / 不及格</option>
        </select>
      </div>
    </div>
  );
}
