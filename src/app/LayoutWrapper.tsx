// /src/app/LayoutWrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import CreatorSidebar from "@/components/CreatorSidebar";
import ModuleSidebar from "@/components/ModuleSidebar";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const p = usePathname() || "";

  // 這些是創造者管理相關路由，不含 /do/
  const isCreatorRoute =
    (p.startsWith("/practice/") || p.startsWith("/exam/") || p.startsWith("/lesson/")) &&
    !p.includes("/do/");

  if (!isCreatorRoute) {
    // 學生作答頁 /do/ 或其他都直接渲染
    return <>{children}</>;
  }

  return (
    <div className="flex">
      {/* 左側固定管理功能 */}
      <CreatorSidebar />

      {/* 中間主內容 */}
      <div className="flex-1">
        {children}
      </div>

      {/* 右側模組功能 */}
      <ModuleSidebar />
    </div>
  );
}
