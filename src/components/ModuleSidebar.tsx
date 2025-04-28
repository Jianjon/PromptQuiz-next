"use client";

import React from "react";

/** 定義 props 型別 */
interface ModuleSidebarProps {
  active: "practice" | "exam" | "lesson";
}

/** Practice 模組的右側控制面板 */
function PracticeControls() {
  return (
    <div className="p-4 space-y-6">
      <h3 className="text-lg font-semibold mb-2">刷題管理側邊欄</h3>
      <ul className="space-y-2 text-gray-700">
        <li>📂 上傳教材與題庫</li>
        <li>⚙️ 設定出題範圍與比例</li>
        <li>📑 上傳官方樣題參考</li>
      </ul>
    </div>
  );
}

/** Exam 模組的右側控制面板 */
function ExamControls() {
  return (
    <div className="p-4 space-y-6">
      <h3 className="text-lg font-semibold mb-2">考試管理側邊欄</h3>
      <label className="block text-gray-700">
        難度 (0–1):
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          className="mt-1 w-full"
        />
      </label>
      <label className="block text-gray-700">
        GPT 溫度：
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          className="mt-1 w-full"
        />
      </label>
    </div>
  );
}

/** Lesson 模組的右側控制面板 */
function LessonControls() {
  return (
    <div className="p-4 space-y-6">
      <h3 className="text-lg font-semibold mb-2">教學管理側邊欄</h3>
      <label className="block text-gray-700">
        插入教案檔案：
        <input
          type="file"
          className="mt-1 w-full border rounded p-1"
        />
      </label>
      <label className="block text-gray-700">
        補充段落：
        <textarea
          className="mt-1 w-full border rounded p-1"
          rows={3}
        />
      </label>
    </div>
  );
}

/** 通用側邊欄元件 */
export default function ModuleSidebar({ active }: ModuleSidebarProps) {
  return (
    <aside className="w-64 border-l bg-white h-screen overflow-auto">
      {active === "practice" && <PracticeControls />}
      {active === "exam" && <ExamControls />}
      {active === "lesson" && <LessonControls />}
    </aside>
  );
}
