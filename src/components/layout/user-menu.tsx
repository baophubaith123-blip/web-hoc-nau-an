"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChefHat, LayoutDashboard, LifeBuoy, LogOut, ShieldCheck, User, Crown } from "lucide-react";
import { BadgePro } from "@/components/goi/BadgePro";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { taoSupabaseClient } from "@/lib/supabase/client";
import { thongTinKhuVaiTro, trangChuTheoVaiTro } from "@/lib/utils/vai-tro";
import { MAU_BADGE, TONG_VAI_TRO, nhanCua } from "@/lib/utils/hang-so";
import { cn } from "@/lib/utils/cn";
import { vi } from "@/lib/i18n/vi";
import type { NguoiDungHeader } from "./nguoi-dung-header";

const chuCaiDau = (ten: string) =>
  ten.split(" ").filter(Boolean).slice(-2).map((t) => t[0]?.toUpperCase()).join("") || "U";

const ICON_KHU_VAI_TRO = { admin: ShieldCheck, chef: ChefHat, support: LifeBuoy } as const;

export function UserMenu({ nguoiDung }: { nguoiDung: NguoiDungHeader }) {
  const router = useRouter();
  // Nhãn lối quay về khu vực làm việc theo đúng vai trò (staff), học viên thường giữ "Bảng điều khiển"
  const khuVaiTro = thongTinKhuVaiTro(nguoiDung.vai_tro);
  const IconKhuVaiTro =
    nguoiDung.vai_tro === "admin" || nguoiDung.vai_tro === "chef" || nguoiDung.vai_tro === "support"
      ? ICON_KHU_VAI_TRO[nguoiDung.vai_tro]
      : LayoutDashboard;

  async function dangXuat() {
    await taoSupabaseClient().auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-9 w-9 rounded-full p-0" aria-label={nguoiDung.ho_ten}>
          <Avatar className="h-9 w-9">
            <AvatarImage src={nguoiDung.avatar_url ?? undefined} alt={nguoiDung.ho_ten} />
            <AvatarFallback>{chuCaiDau(nguoiDung.ho_ten)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        {/* Base UI: GroupLabel bat buoc nam trong Menu.Group, neu khong se nem loi thieu MenuGroupContext */}
        <DropdownMenuGroup>
        <DropdownMenuLabel className="space-y-1">
          <div className="flex items-center justify-between gap-1">
            <p className="truncate font-medium">{nguoiDung.ho_ten}</p>
            {nguoiDung.la_pro && <BadgePro size="xs" />}
          </div>
          <p className="truncate text-xs font-normal text-muted-foreground">{nguoiDung.email}</p>
          <div className="flex items-center gap-1.5 pt-1">
            <Badge variant="secondary" className={cn("text-[10px]", MAU_BADGE[TONG_VAI_TRO[nguoiDung.vai_tro]])}>
              {nhanCua("vai_tro", nguoiDung.vai_tro)}
            </Badge>
            {nguoiDung.la_pro && (
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">
                Hội viên Pro
              </span>
            )}
          </div>
        </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={trangChuTheoVaiTro(nguoiDung.vai_tro)}>
            <IconKhuVaiTro className="mr-2 h-4 w-4" />
            <span>{khuVaiTro ? khuVaiTro.nhan : vi.menu.bang_dieu_khien}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/goi-cua-toi">
            <Crown className="mr-2 h-4 w-4 text-amber-500" />
            <span>Gói Pro của tôi</span>
          </Link>
        </DropdownMenuItem>
        {!nguoiDung.la_pro && (
          <DropdownMenuItem asChild className="bg-amber-500/10 text-amber-900 dark:text-amber-200 font-medium">
            <Link href="/nang-cap-pro">
              <Crown className="mr-2 h-4 w-4 text-amber-500 fill-amber-500" />
              <span>Nâng cấp PRO ngay</span>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link href="/ho-so">
            <User className="mr-2 h-4 w-4" />
            {vi.menu.ho_so}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={dangXuat} className="text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          {vi.menu.dang_xuat}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}