"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // 正確：一開始預設導向到登入頁
    router.replace("/login");
  }, [router]);

  return null;
}
