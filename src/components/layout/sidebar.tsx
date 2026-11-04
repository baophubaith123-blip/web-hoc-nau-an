"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3, Bell, BookOpen, Bookmark, ChefHat, CreditCard, FolderTree, GraduationCap, Inbox,
  LayoutDashboard, LifeBuoy, Megaphone, MessageSquare, Newspaper, PlusCircle, ScrollText,
  Send, Settings, Star, User, Users, Crown, ShieldCheck, type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { MucMenu } from "@/lib/utils/vai-tro";

// Tên icon (chuỗi, truyền được từ Server) → component lucide
const ICON: Record<string, LucideIcon> = {
  BarChart3, Bell, BookOpen, Bookmark, ChefHat, CreditCard, FolderTree, GraduationCap, Inbox,
  LayoutDashboard, LifeBuoy, Megaphone, MessageSquare, Newspaper, PlusCircle, ScrollText,
  Send, Settings, Star, User, Users, Crown, ShieldCheck,
};

export function DanhSachMenu({ menu, onChon }: { menu: MucMenu[]; onChon?: () => void }) {
  const duongDan = usePathname();
  return (
    <nav className="flex flex-col gap-1">
      {menu.map((muc) => {
        const Icon = ICON[muc.icon] ?? LayoutDashboard;
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
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              dangChon ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {muc.nhan}
          </Link>
        );
      })}
    </nav>
  );
}

// Sidebar cố định bên trái (desktop)
export function Sidebar({ menu, tieuDe }: { menu: MucMenu[]; tieuDe: string }) {
  return (
    <aside className="hidden w-60 shrink-0 border-r md:block">
      <div className="sticky top-14 max-h-[calc(100vh-3.5rem)] space-y-3 overflow-y-auto p-4">
        <p className="px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{tieuDe}</p>
        <DanhSachMenu menu={menu} />
      </div>
    </aside>
  );
}