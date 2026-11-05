"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  BarChart3, Bell, BookOpen, Bookmark, ChefHat, CreditCard, FolderTree, GraduationCap, Inbox,
  LayoutDashboard, LifeBuoy, Megaphone, MessageSquare, Newspaper, PenLine, PlusCircle, ScrollText,
  Send, Settings, Star, User, Users, Crown, ShieldCheck, Lock, type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { MucMenu } from "@/lib/utils/vai-tro";
import type { NguoiDungHeader } from "./nguoi-dung-header";
import { HopThoaiNangCapPro } from "./nut-khoa-pro";

// Tên icon (chuỗi, truyền được từ Server) → component lucide
const ICON: Record<string, LucideIcon> = {
  BarChart3, Bell, BookOpen, Bookmark, ChefHat, CreditCard, FolderTree, GraduationCap, Inbox,
  LayoutDashboard, LifeBuoy, Megaphone, MessageSquare, Newspaper, PenLine, PlusCircle, ScrollText,
  Send, Settings, Star, User, Users, Crown, ShieldCheck,
};

export function DanhSachMenu({ menu, onChon }: { menu: MucMenu[]; onChon?: () => void }) {
  const duongDan = usePathname();
  const [mucKhoa, setMucKhoa] = useState<MucMenu | null>(null);
  return (
    <nav className="flex flex-col gap-1">
      {menu.map((muc) => {
        const Icon = ICON[muc.icon] ?? LayoutDashboard;
        // Mục bị khóa Pro: vẫn hiển thị nhưng mờ + ổ khóa, bấm vào hiện thông báo nâng cấp
        if (muc.khoa) {
          return (
            <button
              key={muc.href}
              type="button"
              onClick={() => setMucKhoa(muc)}
              title="Chỉ dành cho thành viên Pro"
              className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-muted-foreground opacity-60 saturate-50 transition-all duration-200 hover:bg-muted"
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{muc.nhan}</span>
              <Lock className="h-3.5 w-3.5 shrink-0" />
            </button>
          );
        }
        // Mục gốc (vd /bep) chỉ sáng khi đúng trang, tránh sáng cùng mục con (/bep/cong-thuc)
        const coMucCon = menu.some((m) => m.href !== muc.href && m.href.startsWith(muc.href + "/"));
        const dangChon = duongDan === muc.href || (!coMucCon && duongDan.startsWith(muc.href + "/"));
        return (
          <Link
            key={muc.href}
            href={muc.href}
            onClick={onChon}
            aria-current={dangChon ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 active:scale-[0.99]",
              dangChon ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {muc.nhan}
          </Link>
        );
      })}
      <HopThoaiNangCapPro
        mo={!!mucKhoa}
        onMoChange={(mo) => {
          if (!mo) setMucKhoa(null);
        }}
        tinhNang={mucKhoa?.nhan ?? ""}
      />
    </nav>
  );
}

// Thẻ người dùng nhỏ trên đầu sidebar: avatar + tên + hạng thành viên
function TheNguoiDungSidebar({ nguoiDung }: { nguoiDung: NguoiDungHeader }) {
  const laProConHan =
    !!nguoiDung.la_pro &&
    (!nguoiDung.goi_het_han || new Date(nguoiDung.goi_het_han) > new Date());
  const nhanVaiTro =
    nguoiDung.vai_tro === "admin"
      ? "Quản trị viên"
      : nguoiDung.vai_tro === "chef"
        ? "Đầu bếp"
        : nguoiDung.vai_tro === "support"
          ? "Nhân viên hỗ trợ"
          : laProConHan
            ? "Thành viên Pro"
            : "Thành viên thường";
  const chuCaiDau = nguoiDung.ho_ten
    .split(" ")
    .filter(Boolean)
    .slice(-2)
    .map((tu) => tu[0]?.toUpperCase())
    .join("");

  return (
    <div className="flex items-center gap-3 rounded-2xl border bg-card p-3 shadow-xs">
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-primary/10">
        {nguoiDung.avatar_url ? (
          <Image src={nguoiDung.avatar_url} alt={nguoiDung.ho_ten} fill className="object-cover" sizes="40px" />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-sm font-bold text-primary">
            {chuCaiDau || "B"}
          </span>
        )}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold leading-tight">{nguoiDung.ho_ten}</p>
        <p
          className={cn(
            "mt-0.5 flex items-center gap-1 text-xs leading-tight",
            laProConHan && nguoiDung.vai_tro === "user"
              ? "font-semibold text-amber-600 dark:text-amber-400"
              : "text-muted-foreground"
          )}
        >
          {laProConHan && nguoiDung.vai_tro === "user" && (
            <Crown className="h-3 w-3 fill-amber-500 text-amber-500" />
          )}
          {nhanVaiTro}
        </p>
      </div>
    </div>
  );
}

// Sidebar cố định bên trái (desktop)
export function Sidebar({
  menu,
  tieuDe,
  nguoiDung,
}: {
  menu: MucMenu[];
  tieuDe: string;
  nguoiDung?: NguoiDungHeader;
}) {
  return (
    <aside className="hidden w-60 shrink-0 border-r md:block">
      <div className="sticky top-14 max-h-[calc(100vh-3.5rem)] space-y-3 overflow-y-auto p-4">
        {nguoiDung && <TheNguoiDungSidebar nguoiDung={nguoiDung} />}
        <p className="px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{tieuDe}</p>
        <DanhSachMenu menu={menu} />
      </div>
    </aside>
  );
}