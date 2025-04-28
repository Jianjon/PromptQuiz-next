// src/app/practice/preview/[id]/page.tsx
"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import PublishModal from "@/components/PublishModal";

export default function PracticePreviewPage() {
  const { id } = useParams();
  const router = useRouter();

  const [data, setData] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // 載入剛創建好的題組／教案資料
  useEffect(() => {
    // TODO: 換成真實 API call
    fetch(`/api/practice/${id}`)
      .then((r) => r.json())
      .then((json) => setData(json))
      .catch(() => alert("無法讀取預覽資料"));
  }, [id]);

  if (!data) return <p className="p-6">載入中…</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">{data.title}</h1>
      <p className="text-gray-600">{data.description}</p>

      {/* 這裡可以預覽題目列表或教案內容 */}
      <div className="space-y-4">
        {data.questions.map((q: any, idx: number) => (
          <div key={idx} className="p-4 border rounded">
            <p className="font-semibold">{idx + 1}. {q.question}</p>
          </div>
        ))}
      </div>

      {/* 發佈按鈕 */}
      <div className="mt-8 text-center">
        <button
          onClick={() => setModalOpen(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          發佈題組
        </button>
      </div>

      {/* PublishModal 共通組件 */}
      <PublishModal
        url={`${window.location.origin}/practice/do/${id}`}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
