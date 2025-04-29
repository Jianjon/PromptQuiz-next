"use client";

import React, { useEffect, useState } from "react";

interface UploadOrPasteBlockProps {
  label: string;
  description?: string;
  value: string;
  onChange: (value: string) => void;
}

export default function UploadOrPasteBlock({ label, description, value, onChange }: UploadOrPasteBlockProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfjsLib, setPdfjsLib] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("pdfjs-dist").then((lib) => {
        lib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${lib.version}/pdf.worker.min.js`;
        setPdfjsLib(lib);
      });
    }
  }, []);

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== "application/pdf") {
      setError("請上傳 PDF 格式檔案");
      return;
    }
    setError(null);

    if (!pdfjsLib) {
      setError("PDF 函式尚未載入，請稍候再試");
      return;
    }

    setLoading(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let text = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map((item: any) => item.str).join(" ");
        text += `\n${pageText}`;
      }
      onChange(text.trim());
    } catch (err) {
      setError("無法解析 PDF，請確認檔案內容");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block font-medium mb-1">{label}</label>
      {description && <p className="text-sm text-gray-500 mb-1">{description}</p>}
      <textarea
        placeholder="可貼上文字，或上傳 PDF 將自動填入此處"
        className="w-full p-2 border rounded min-h-[80px]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <input
        type="file"
        accept="application/pdf"
        className="block w-full"
        onChange={handlePdfUpload}
      />
      {loading && <p className="text-blue-600 text-sm">PDF 解析中...</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
}