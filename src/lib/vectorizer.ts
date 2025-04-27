// src/lib/vectorizer.ts

/**
 * 向量化檢索模組
 *
 * 使用 Supabase 向量 DB（或 FAISS/Qdrant）來儲存與查詢文本段落的 Embedding
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";

interface DocumentRow {
  id: string;
  content: string;
  embedding: number[];
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    "缺少 Supabase 環境變數：NEXT_PUBLIC_SUPABASE_URL 或 SUPABASE_SERVICE_ROLE_KEY"
  );
}

const supabase: SupabaseClient = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY
);

export async function ingestDocuments(
  docs: { id: string; text: string }[]
): Promise<void> {
  const embeddingsPayload = await Promise.all(
    docs.map(async (doc) => {
      const res = await fetch("https://api.openai.com/v1/embeddings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "text-embedding-3-small",
          input: doc.text,
        }),
      });
      const { data } = await res.json();
      return {
        id: doc.id,
        content: doc.text,
        embedding: data[0].embedding as number[],
      };
    })
  );

  const { error } = await supabase
  .from("documents")
  .upsert(
    embeddingsPayload,
    { onConflict: ["id"] }
  );

  if (error) {
    console.error("向量庫寫入失敗：", error);
    throw error;
  }
}

export async function getSupplementalContent(
  keywords: string[]
): Promise<string> {
  const queryText = keywords.join(" \n");

  const embedRes = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({ model: "text-embedding-3-small", input: queryText }),
  });
  const { data } = await embedRes.json();
  const queryEmbedding = data[0].embedding as number[];

  // 呼叫 match_documents RPC，檢索 top 3
  const { data: results, error } = await supabase.rpc(
    "match_documents",
    {
      query_embedding: queryEmbedding,
      match_threshold: 0.1,
      match_count: 3,
    }
  );

  if (error) {
    console.error("向量檢索失敗：", error);
    throw error;
  }

  const rows = (results as { content: string }[]) || [];
  return rows.map((r) => r.content).join("\n\n");
}
