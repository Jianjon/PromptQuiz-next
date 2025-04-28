// /src/components/CreatorSidebar.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Module = "practice" | "exam" | "lesson";
interface Project {
  id: string;
  title: string;
  description?: string;
}

const storageKeys: Record<Module, string> = {
  practice: "practice_projects",
  exam: "exam_projects",
  lesson: "lesson_projects",
};

export default function CreatorSidebar() {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [module, setModule] = useState<Module>("practice");
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // 載入 user 資料與當前模組的 project list
  useEffect(() => {
    const storedName = localStorage.getItem("creatorName") || "";
    const storedEmail = localStorage.getItem("creatorEmail") || "";
    setName(storedName);
    setEmail(storedEmail);

    loadProjects(module);
  }, [module]);

  function loadProjects(m: Module) {
    const raw = localStorage.getItem(storageKeys[m]) || "[]";
    try {
      setProjects(JSON.parse(raw));
    } catch {
      setProjects([]);
    }
  }

  function handleModuleSelect(m: Module) {
    setModule(m);
  }

  function handleDelete(id: string) {
    const filtered = projects.filter((p) => p.id !== id);
    localStorage.setItem(storageKeys[module], JSON.stringify(filtered));
    setProjects(filtered);
  }

  function handleEdit(id: string) {
    router.push(`/${module}/preview/${id}`);
  }

  function handleNew() {
    router.push(`/${module}/start`);
  }

  return (
    <aside
      className={`flex flex-col bg-white border-r ${
        collapsed ? "w-16" : "w-64"
      } transition-width duration-200 h-screen`}
    >
      {/* Profile */}
      <div className="p-4 border-b">
        {!collapsed ? (
          <>
            <p className="font-semibold">{name || "未登入"}</p>
            <p className="text-sm text-gray-500 truncate">{email}</p>
          </>
        ) : (
          <p className="text-center">{name ? name[0] : "?"}</p>
        )}
      </div>

      {/* Module Selector */}
      <nav className="flex-0 p-2">
        {(["practice", "exam", "lesson"] as Module[]).map((m) => (
          <button
            key={m}
            onClick={() => handleModuleSelect(m)}
            className={`flex items-center w-full mb-2 p-2 rounded hover:bg-gray-100 ${
              module === m ? "bg-gray-200" : ""
            }`}
          >
            <span className="capitalize flex-1 text-left">
              {!collapsed ? m : m[0]}
            </span>
          </button>
        ))}
      </nav>

      {/* History List */}
      <div className="flex-1 overflow-auto p-2 space-y-2">
        {projects.length === 0 && (
          <p className="text-xs text-gray-400">
            {collapsed ? "" : "尚無建立紀錄"}
          </p>
        )}
        {projects.map((p) => (
          <div
            key={p.id}
            className="flex items-center bg-gray-50 p-2 rounded group hover:bg-gray-100"
          >
            <div className="flex-1">
              {!collapsed && (
                <p className="truncate font-medium">{p.title}</p>
              )}
            </div>
            {!collapsed && (
              <div className="flex space-x-1 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => handleEdit(p.id)}
                  className="text-blue-500 text-sm px-1"
                >
                  編輯
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="text-red-500 text-sm px-1"
                >
                  刪除
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer: New / Collapse */}
      <div className="p-2 border-t flex items-center justify-between">
        <button
          onClick={handleNew}
          className="flex-1 text-sm bg-green-500 text-white rounded p-1 hover:bg-green-600 transition"
        >
          {!collapsed ? "＋ 新增" : "+"}
        </button>
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="ml-2 text-gray-500 hover:text-gray-700 transition"
        >
          {collapsed ? "»" : "«"}
        </button>
      </div>
    </aside>
  );
}
