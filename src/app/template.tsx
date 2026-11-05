"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Template gốc: mỗi lần chuyển trang, nội dung mới hiện lên với hiệu ứng
 * mờ dần + trượt nhẹ từ dưới lên (khai báo .animate-page-in trong globals.css).
 * Header/footer nằm ở layout nên không bị ảnh hưởng.
 */
export default function MauTrang({ children }: { children: ReactNode }) {
  const duongDan = usePathname();
  return (
    <div key={duongDan} className="animate-page-in">
      {children}
    </div>
  );
}
