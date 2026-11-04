"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { vi } from "@/lib/i18n/vi";

// Không hiển thị error.message/stack cho người dùng, chỉ ghi log ở console
export default function TrangLoi({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[LOI TRANG]", error.digest);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-2xl font-semibold">{vi.loi.trang_loi_tieu_de}</h1>
      <p className="max-w-md text-muted-foreground">{vi.loi.trang_loi_mo_ta}</p>
      <Button onClick={reset}>{vi.loi.thu_lai}</Button>
    </main>
  );
}