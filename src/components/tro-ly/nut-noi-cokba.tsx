"use client";

// Nút nổi Cokba — chỉ được gắn ở layout khu CÔNG KHAI, góc dưới
// phải. Trang hiện tại không có phần tử fixed nào khác ở góc này
// nên không chồng lấn. Trên trang /tro-ly (đã có panel đầy đủ)
// nút tự ẩn để tránh trùng lặp.

import { useState } from "react";
import { usePathname } from "next/navigation";
import { ChefHat, X } from "lucide-react";
import { PanelCokba } from "./panel-cokba";
import { vi } from "@/lib/i18n/vi";
import { cn } from "@/lib/utils/cn";

const t = vi.tro_ly;

export function NutNoiCokba({ nguoiDungId = null }: { nguoiDungId?: string | null }) {
  const [mo, setMo] = useState(false);
  const duongDan = usePathname();

  if (duongDan === "/tro-ly") return null;

  return (
    <>
      {/* Panel: mobile toàn màn hình, desktop khung cố định bên phải.
          Luôn giữ mounted (chỉ ẩn bằng CSS) để không mất lịch sử chat
          khi đóng/mở. */}
      <div
        data-testid="panel-cokba"
        aria-hidden={!mo}
        className={cn(
          "fixed inset-0 z-40 transition-all duration-200 sm:inset-auto sm:bottom-24 sm:right-5 sm:h-[min(640px,calc(100dvh-8.5rem))] sm:w-[400px] sm:overflow-hidden sm:rounded-3xl sm:border sm:shadow-2xl",
          mo
            ? "visible translate-y-0 opacity-100"
            : "invisible translate-y-3 pointer-events-none opacity-0"
        )}
      >
        <PanelCokba cheDo="panel" nguoiDungId={nguoiDungId} onDong={() => setMo(false)} />
      </div>

      <button
        type="button"
        data-testid="nut-noi-cokba"
        onClick={() => setMo((v) => !v)}
        aria-label={mo ? t.dong : t.mo_panel}
        aria-expanded={mo}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-primary py-3 pl-4 pr-5 text-sm font-bold text-primary-foreground shadow-xl transition hover:scale-[1.03] hover:opacity-95 active:scale-95"
      >
        {mo ? <X className="h-5 w-5" /> : <ChefHat className="h-5 w-5" />}
        <span>{t.tieu_de}</span>
      </button>
    </>
  );
}
