// src/components/PracticeSidebar.tsx

"use client";

import React from "react";

export default function PracticeSidebar() {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">📚 刷題管理側欄</h2>
      <ul className="space-y-2">
        <li className="text-gray-700">- 上傳教材與題庫</li>
        <li className="text-gray-700">- 設定出題範圍與比例</li>
        <li className="text-gray-700">- 上傳官方樣題參考</li>
      </ul>
    </div>
  );
}
