import React, { useEffect } from "react";
import { saveSettings, QuizSettings } from "@/lib/settings";

interface SidebarProps {
  settings: QuizSettings;
  setSettings: (newSettings: Partial<QuizSettings>) => void;
}

export default function Sidebar({ settings, setSettings }: SidebarProps) {
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  return (
    <div className="w-64 p-4 bg-gray-50 border-l space-y-4 text-sm">
      <h2 className="text-lg font-bold text-gray-700">⚙️ 出題參數設定</h2>

      <div>
        <label className="block font-medium mb-1">題目數量</label>
        <select
          className="w-full border rounded px-2 py-1"
          value={settings.numQuestions}
          onChange={(e) => setSettings({ numQuestions: parseInt(e.target.value) })}
        >
          {Array.from({ length: 19 }, (_, i) => i + 2).map((n) => (
            <option key={n} value={n}>{n} 題</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">難度等級</label>
        <select
          className="w-full border rounded px-2 py-1"
          value={settings.difficulty}
          onChange={(e) => setSettings({ difficulty: e.target.value as QuizSettings["difficulty"] })}
        >
          <option value="簡單">簡單</option>
          <option value="普通">普通</option>
          <option value="挑戰">挑戰</option>
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">題型偏好</label>
        <select
          className="w-full border rounded px-2 py-1"
          value={settings.questionType}
          onChange={(e) => setSettings({ questionType: e.target.value as QuizSettings["questionType"] })}
        >
          <option value="記憶型">記憶型</option>
          <option value="理解型">理解型</option>
          <option value="素養型">素養型</option>
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">AI 回應風格</label>
        <select
          className="w-full border rounded px-2 py-1"
          value={settings.tone}
          onChange={(e) => setSettings({ tone: e.target.value as QuizSettings["tone"] })}
        >
          <option value="正式">正式</option>
          <option value="親切">親切</option>
          <option value="創意">創意</option>
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">回應長度</label>
        <select
          className="w-full border rounded px-2 py-1"
          value={settings.length}
          onChange={(e) => setSettings({ length: e.target.value as QuizSettings["length"] })}
        >
          <option value="精簡">精簡</option>
          <option value="中等">中等</option>
          <option value="詳細">詳細</option>
        </select>
      </div>
    </div>
  );
}