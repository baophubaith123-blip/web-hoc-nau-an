"use client";

// Nút đổi trạng thái cho từng dòng nhật ký Cokba (khu quản trị).

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { doiTrangThaiCauHoiCokba } from "@/lib/actions/tro-ly";
import { cn } from "@/lib/utils/cn";

const LUA_CHON = [
  { khoa: "cho_xu_ly", nhan: "Chờ xử lý" },
  { khoa: "da_xu_ly", nhan: "Đã xử lý" },
  { khoa: "bo_qua", nhan: "Bỏ qua" },
] as const;

export function ThaoTacNhatKyCokba({
  id,
  trangThai,
}: {
  id: string;
  trangThai: string;
}) {
  const router = useRouter();
  const [dangChay, batDauChay] = useTransition();
  const [loi, setLoi] = useState<string | null>(null);

  const doi = (tt: string) => {
    if (tt === trangThai || dangChay) return;
    setLoi(null);
    batDauChay(async () => {
      const kq = await doiTrangThaiCauHoiCokba(id, tt);
      if (!kq.thanh_cong) {
        setLoi(kq.loi ?? "Không đổi được trạng thái, vui lòng thử lại.");
        return;
      }
      router.refresh();
    });
  };

  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap gap-1.5">
        {LUA_CHON.map((lc) => (
          <button
            key={lc.khoa}
            type="button"
            disabled={dangChay || lc.khoa === trangThai}
            onClick={() => doi(lc.khoa)}
            className={cn(
              "rounded-full border px-2.5 py-1 text-xs font-medium transition",
              lc.khoa === trangThai
                ? "cursor-default bg-primary text-primary-foreground"
                : "hover:bg-muted disabled:opacity-50"
            )}
          >
            {lc.nhan}
          </button>
        ))}
      </div>
      {loi && <p className="text-xs text-destructive">{loi}</p>}
    </div>
  );
}
