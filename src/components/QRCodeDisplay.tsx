// /src/components/QRCodeDisplay.tsx
"use client";

import React, { useRef } from "react";
import QRCode from "react-qr-code";

export interface QRCodeDisplayProps {
  url: string;
  onDownload: (containerRef: React.RefObject<HTMLDivElement | null>) => void;
  onCopy:     (containerRef: React.RefObject<HTMLDivElement | null>) => void;
}

export default function QRCodeDisplay({
  url,
  onDownload,
  onCopy,
}: QRCodeDisplayProps) {
  // 注意这里加了 | null
  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="flex flex-col items-center">
      {/* 1️⃣ QRCode 容器 */}
      <div
        ref={containerRef}
        className="bg-white p-2 rounded-lg inline-block"
      >
        <QRCode value={url} size={128} />
      </div>

      {/* 2️⃣ 下载 & 复制 */}
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => onDownload(containerRef)}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
        >
          下載
        </button>
        <button
          onClick={() => onCopy(containerRef)}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
        >
          複製
        </button>
      </div>
    </div>
  );
}
