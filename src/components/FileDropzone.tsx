"use client";

import React, { useRef, useState } from "react";

export interface ExtractedParagraph {
  text: string;
  pageNumber?: number; // 預留未來 PDF 支援時用
}

interface FileDropzoneProps {
  onExtracted: (paras: ExtractedParagraph[]) => void;
}

export default function FileDropzone({ onExtracted }: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  // 觸發選擇檔案
  const handleClick = () => {
    inputRef.current?.click();
  };

  // 分段：以「兩個以上換行」作為段落分隔
  const splitTextIntoParagraphs = (text: string): ExtractedParagraph[] => {
    const raw = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
    return raw.map((p) => ({ text: p }));
  };

  // 處理選擇的檔案
  const handleFile = async (file: File) => {
    try {
      if (file.type === "text/plain") {
        const text = await file.text();
        const paragraphs = splitTextIntoParagraphs(text);
        onExtracted(paragraphs);
      } else if (file.type === "application/pdf") {
        alert("⚠️ 目前暫不支援 PDF，之後版本會加入！");
      } else {
        alert("⚠️ 請上傳純文字檔案 (.txt)！");
      }
    } catch (error) {
      console.error("讀取檔案失敗", error);
      alert("❌ 檔案讀取錯誤，請稍後再試！");
    }
  };

  // input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  // 處理拖曳上傳
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div
      className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition ${
        dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-500"
      }`}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <p className="text-gray-600">
        點擊或拖曳檔案到這裡（目前支援 .txt）
      </p>
      <input
        ref={inputRef}
        type="file"
        accept=".txt"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
