// /src/components/PublishModal.tsx
"use client";

import React from "react";
import { createPortal } from "react-dom";
import QRCodeDisplay from "./QRCodeDisplay";

interface PublishModalProps {
  /** 完整的作題鏈結，例如 `${window.location.origin}/practice/do/abc123` */
  url: string;
  /** 控制 Modal 顯示或隱藏 */
  isOpen: boolean;
  /** 關閉 Modal 的回調 */
  onClose: () => void;
}

export default function PublishModal({
  url,
  isOpen,
  onClose,
}: PublishModalProps) {
  if (!isOpen) return null;

  /**
   * 下載 QRCode 圖檔 (SVG → PNG)
   * @param containerRef 包裹 QRCode SVG 的 div ref
   */
  const downloadQRCode = (
    containerRef: React.RefObject<HTMLDivElement | null>
  ) => {
    const container = containerRef.current;
    if (!container) return;
    const svgElement = container.querySelector("svg");
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const urlBlob = URL.createObjectURL(blob);

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      URL.revokeObjectURL(urlBlob);

      const pngUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = pngUrl;
      a.download = "qrcode.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };

    img.src = urlBlob;
  };

  /**
   * 複製 QRCode 到剪貼簿 (SVG → PNG Blob)
   * @param containerRef 包裹 QRCode SVG 的 div ref
   */
  const copyQRCode = (
    containerRef: React.RefObject<HTMLDivElement | null>
  ) => {
    const container = containerRef.current;
    if (!container) return;
    const svgElement = container.querySelector("svg");
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const urlBlob = URL.createObjectURL(blob);

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      URL.revokeObjectURL(urlBlob);

      canvas.toBlob(async (blobPng) => {
        if (!blobPng) return;
        const clipboardItem = new ClipboardItem({ "image/png": blobPng });
        await navigator.clipboard.write([clipboardItem]);
        alert("已複製 QRCode 到剪貼簿！");
      }, "image/png");
    };

    img.src = urlBlob;
  };

  // 點擊遮罩關閉
  const handleMaskClick = () => onClose();
  // 阻止內容區點擊冒泡至遮罩
  const handleContentClick = (e: React.MouseEvent) => e.stopPropagation();

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={handleMaskClick}
    >
      <div
        className="relative bg-white rounded-2xl shadow-xl w-[90vw] max-w-md p-6"
        onClick={handleContentClick}
      >
        {/* 關閉按鈕 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="關閉"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          分享你的題組
        </h2>

        {/* 作題鏈結輸入框 + 複製按鈕 */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">作題網址</label>
          <div className="flex">
            <input
              type="text"
              readOnly
              value={url}
              className="flex-1 rounded-l-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(url);
                alert("已複製連結！");
              }}
              className="rounded-r-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
            >
              複製
            </button>
          </div>
        </div>

        {/* QR Code 展示與操作 */}
        <div className="mb-6 text-center">
          <label className="block text-sm font-medium mb-2">QR Code</label>
          <div className="inline-block bg-white p-2 rounded-lg shadow-sm">
            <QRCodeDisplay
              url={url}
              onDownload={downloadQRCode}
              onCopy={copyQRCode}
            />
          </div>
        </div>

        {/* 完成按鈕 */}
        <div className="text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          >
            完成
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
