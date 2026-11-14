"use client";

// Nút TRÒN nổi Cokba — gắn ở layout khu CÔNG KHAI và layout khu
// NGƯỜI DÙNG (mọi trang người dùng; 3 khu nhân viên quan-tri/bep/
// nhan-vien có khung riêng nên KHÔNG gắn), cố định góc dưới phải,
// kiểu nút tròn nổi của Hue Chef (FloatingGameButton).
//
// QUAN TRỌNG — vì sao phải render qua portal ra document.body:
// template gốc (src/app/template.tsx) bọc MỌI nội dung trong div
// .animate-page-in có `animation: page-in ... both` — keyframe cuối
// giữ transform: translateY(0) vĩnh viễn (fill-mode both), biến div
// đó thành containing block cho phần tử fixed: nút/panel đặt bên
// trong sẽ bị neo theo chiều cao TOÀN TRANG thay vì khung nhìn
// (trang chủ dài => nút chìm xuống đáy trang, khuất khỏi tầm mắt).
// Portal đưa nút + panel ra thẳng body nên fixed bám đúng viewport
// ở mọi trang, không phải đụng tới animation chuyển trang của site.

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { ChefHat, X } from "lucide-react";
import { vi } from "@/lib/i18n/vi";
import { cn } from "@/lib/utils/cn";

// Tải lười panel Cokba (Đợt 6 — tối ưu tốc độ): đo nền cho thấy JS khởi
// đầu ~410KB ở mọi trang công khai trong khi panel chỉ cần khi người
// dùng bấm nút nổi. Chunk panel chỉ tải ở lần mở đầu tiên; sau đó panel
// luôn giữ mounted (ẩn bằng CSS) như cũ để không mất lịch sử chat.
const PanelCokba = dynamic(
  () => import("./panel-cokba").then((m) => m.PanelCokba),
  { ssr: false }
);

const t = vi.tro_ly;

export function NutNoiCokba({ nguoiDungId = null }: { nguoiDungId?: string | null }) {
  const [mo, setMo] = useState(false);
  const [daMoLanDau, setDaMoLanDau] = useState(false);
  const [sanSangPortal, setSanSangPortal] = useState(false);
  const duongDan = usePathname();

  // Portal chỉ chạy được phía client sau khi mount.
  useEffect(() => {
    setSanSangPortal(true);
  }, []);

  if (duongDan === "/tro-ly" || !sanSangPortal) return null;

  return createPortal(
    <>
      {/* Panel: mobile toàn màn hình, desktop khung cố định bên phải.
          Chỉ mount sau lần mở đầu tiên; từ đó luôn giữ mounted (chỉ ẩn
          bằng CSS) để không mất lịch sử chat khi đóng/mở. */}
      {daMoLanDau && (
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
      )}

      {/* Nút tròn nổi cố định 60px: icon ChefHat ở trạng thái đóng,
          icon X khi panel đang mở (giữ hành vi đóng/mở cũ, không thêm
          nút thứ hai). Vòng pulse nhẹ kiểu Hue Chef chỉ chạy khi panel
          đang đóng và tôn trọng prefers-reduced-motion. */}
      <button
        type="button"
        data-testid="nut-noi-cokba"
        onClick={() => {
          setDaMoLanDau(true);
          setMo((v) => !v);
        }}
        aria-label={mo ? t.dong : t.mo_panel}
        title={mo ? t.dong : t.mo_panel}
        aria-expanded={mo}
        className="fixed bottom-5 right-5 z-40 flex h-[60px] w-[60px] items-center justify-center rounded-full bg-primary text-primary-foreground shadow-2xl ring-4 ring-white/70 transition duration-200 hover:-translate-y-0.5 hover:scale-105 active:translate-y-0 active:scale-95"
      >
        {!mo && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full bg-primary/40 motion-safe:animate-ping"
          />
        )}
        {mo ? <X className="relative h-6 w-6" /> : <ChefHat className="relative h-7 w-7" />}
      </button>
    </>,
    document.body
  );
}
