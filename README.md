# PromptQuiz-Next 🎓✨

**AI 出題 × 自助式教學互動平台（Next.js + GPT + RAG 架構）**

本專案旨在提供教育創作者與學習者一個可擴充、模組化的互動測驗系統，結合 GPT 自動生成題目、RAG 知識補充與 AI 助教功能，支援教學模式、模擬考模式與刷題模式三種流程。

---

## 🚀 MVP 功能（v0.1）

目前已完成最小可用版本，支援「刷題模式」流程：

1. **使用者資訊輸入**：姓名 / Email / 單位 / 題數 (10 or 20) / 章節篩選
2. **取得題目**：`GET /api/question?limit={n}&chapters={...}`
3. **即時統計**：作答時顯示「已作答 / 錯誤題數」
4. **交卷計分**：本地計算得分並顯示錯題解析
5. **AI 分析建議**：按「🧠 啟動 AI 分析建議」呼叫 `POST /api/response/submit`，獲取 RAG 補充與 GPT 建議
6. **操作體驗優化**：
   - Loading / Disabled 狀態防止重複操作
   - 錯誤處理提示 (網路/API 錯誤)
   - 重新練習 / 返回開始
   - 章節篩選 UI 預留

---

## 🧩 三種模式分流設計

| 模式       | 對象              | 目的                           | 特性                                                     |
| ---------- | ----------------- | ------------------------------ | -------------------------------------------------------- |
| 教學模式   | 創造者 → 學習者   | 協助理解、教學引導              | GPT 出題 + 解說編輯器、互動回饋                          |
| 模擬考模式 | 出題者 → 應考者   | 模擬正式考試、鍛鍊考場感受      | 固定題數 + 限時交卷、不即時解析 → 考後報告                |
| 刷題模式   | 進階出題者 → 應考者 | 強化訓練、個人弱點修正          | 自選題數 + 章節篩選 + 即時統計 + RAG 補充 + AI 建議      |

> **導流頁**：`/choose-mode` → 選擇模式後導向各自流程入口

---

## 🏗️ 專案結構（模組導向）

```bash
src/
├── app/
│   ├── choose-mode/           # 模式選擇首頁
│   ├── teach/                 # 教學模式頁面 (generate)
│   ├── exam/                  # 模擬考模式頁面 (限時考卷)
│   ├── practice/
│   │   └── start/             # 刷題模式入口與互動頁面
│   └── api/
│       ├── question/          # 題目取用 API
│       ├── response/submit/   # 作答回饋 API
│       ├── gpt/
│       │   ├── question/      # GPT 出題 API
│       │   └── suggestion/    # GPT 分析建議 API
│       └── rag/query/         # RAG 補充 API (預留)
├── components/                # 通用 UI 元件
├── lib/                       # GPT 客戶端、Supabase Client、PromptTemplates
├── types/                     # TypeScript 型別定義
└── public/                    # 靜態資源
```

---

## 🎯 系統最終願景（v1.0+ SaaS-ready）

| 模組             | 功能目標                                           | 角色    |
| ---------------- | -------------------------------------------------- | ------- |
| **教學者後台**   | 題組 CRUD 編輯、GPT 出題、拖拉式編輯器、PDF 上傳   | Creator |
| **學習者前台**   | 顯示題組、互動作答、錯題追蹤、進度儀表板、GPT 問答     | User    |
| **模擬考中台**   | 模擬考卷批量生成、限時交卷、考後報告匯出             | Proctor |
| **管理者中台**   | 使用者管理、API 金鑰與配額監控、內容審核             | Admin   |
| **資料儲存層**   | Supabase PostgreSQL (quiz, question, response)、向量庫 (FAISS/Supabase Vector)、Storage | 全模組共用 |
| **AI 模型層**    | OpenAI GPT (出題、解說、報告)、RAG Embedding 檢索      | System  |

---

## 🧠 技術架構總覽

- **前端**：Next.js 14 + React + App Router + TailwindCSS
- **後端**：Next.js API Routes (Serverless)
- **AI 服務**：OpenAI GPT-4 / GPT-3.5-turbo
- **RAG 向量庫**：Supabase Vector / FAISS (可擴)
- **認證**：Supabase Auth
- **金流**：Stripe (預留)
- **部署**：Vercel / Netlify

---

## 🛠️ 本地開發指南

1. Clone & install
   ```bash
   git clone https://github.com/Jianjon/PromptQuiz-next.git
   cd PromptQuiz-next
   npm install
   ```

2. 設定環境變數 `.env.local`
   ```ini
   OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxx
   NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
   BASE_URL=http://localhost:3000
   ```

3. 啟動開發伺服器
   ```bash
   npm run dev
   ```

4. 瀏覽器中開啟：
   - `http://localhost:3000/choose-mode`
   - `/teach/generate`, `/exam/start`, `/practice/start`

---

## 📦 待辦清單

- [ ] 拖拉式題組編輯器 (`/editor`)
- [ ] 模擬考限時交卷 & 考後報告 (`/exam/start`)
- [ ] 學習者作答紀錄 & 儀表板 (`/quiz/[id]/answer`)
- [ ] PDF 上傳與向量建庫 (`/api/pdf/upload`, `lib/vectorizer.ts`)
- [ ] RAG 補充查詢 (`/api/rag/query`)
- [ ] Public/Shareable 題組頁面 (`/quiz/[id]`)

---

## 🤝 貢獻

歡迎以 PR、Issue 形式參與，讓 PromptQuiz-Next 成為開源的 AI 教學平台！

