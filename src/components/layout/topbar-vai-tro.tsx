"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChefHat, LayoutDashboard, LifeBuoy, LogOut, Menu, ShieldCheck, User } from "lucide-react";
import { BadgePro } from "@/components/goi/BadgePro";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ChuongThongBao } from "@/components/thong-bao/chuong-thong-bao";
import { taoSupabaseClient } from "@/lib/supabase/client";
import { mauNhanVaiTro, thongTinKhuVaiTro, type MucMenu } from "@/lib/utils/vai-tro";
import { MAU_BADGE, TONG_VAI_TRO, nhanCua } from "@/lib/utils/hang-so";
import { cn } from "@/lib/utils/cn";
import { vi } from "@/lib/i18n/vi";
import { DanhSachMenu } from "./sidebar";
import { ThemeToggle } from "./theme-toggle";
import type { NguoiDungHeader } from "./nguoi-dung-header";

const chuCaiDau = (ten: string) =>
  ten.split(" ").filter(Boolean).slice(-2).map((t) => t[0]?.toUpperCase()).join("") || "U";

const ICON_VAI_TRO = { admin: ShieldCheck, chef: ChefHat, support: LifeBuoy, user: LayoutDashboard } as const;

// Menu tài khoản gọn cho 3 khu vực vai trò: chỉ thông tin tài khoản, trang chủ khu vực,
// hồ sơ cá nhân và đăng xuất — không chứa liên kết ra khu vực công khai/thành viên.
function MenuTaiKhoanVaiTro({ nguoiDung }: { nguoiDung: NguoiDungHeader }) {
  const router = useRouter();
  const khu = thongTinKhuVaiTro(nguoiDung.vai_tro);
  const IconKhu = ICON_VAI_TRO[nguoiDung.vai_tro] ?? LayoutDashboard;

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
        {/* Base UI: GroupLabel bắt buộc nằm trong Menu.Group */}
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
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {khu && (
          <DropdownMenuItem asChild>
            <Link href={khu.href}>
              <IconKhu className="mr-2 h-4 w-4" />
              <span>{khu.nhan}</span>
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

// Thanh trên RIÊNG cho 3 khu vực Admin/Đầu bếp/Hỗ trợ: không logo về trang chủ,
// không menu trang công khai — chỉ tên khu vực, huy hiệu vai trò, thông báo và tài khoản.
// Nhờ vậy người làm việc trong các khu vực này không bị lạc sang giao diện người dùng.
export function TopbarVaiTro({
  nguoiDung,
  menu,
  tieuDe,
}: {
  nguoiDung: NguoiDungHeader;
  menu: MucMenu[];
  tieuDe: string;
}) {
  const [moMenu, setMoMenu] = useState(false);
  const IconKhu = ICON_VAI_TRO[nguoiDung.vai_tro] ?? LayoutDashboard;
  const mauNhan = mauNhanVaiTro(nguoiDung.vai_tro);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 w-full max-w-screen-2xl items-center gap-3 px-4">
        {/* Menu di động: CHỈ chứa menu của khu vực, không trộn liên kết công khai */}
        <Sheet open={moMenu} onOpenChange={setMoMenu}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label={vi.menu.mo_menu}>
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 overflow-y-auto p-0">
            <SheetHeader className="border-b p-4">
              <SheetTitle>{tieuDe}</SheetTitle>
            </SheetHeader>
            <div className="p-4">
              <DanhSachMenu menu={menu} onChon={() => setMoMenu(false)} mauDangChon={mauNhan?.mucDangChon} />
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-2 font-bold">
          <span
            data-mau-khu={nguoiDung.vai_tro}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg",
              mauNhan?.chip ?? "bg-primary/10"
            )}
          >
            <IconKhu className="h-5 w-5" />
          </span>
          <span>{tieuDe}</span>
          <Badge variant="secondary" className={cn("hidden text-[10px] sm:inline-flex", MAU_BADGE[TONG_VAI_TRO[nguoiDung.vai_tro]])}>
            {nhanCua("vai_tro", nguoiDung.vai_tro)}
          </Badge>
        </div>

        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />
          <ChuongThongBao />
          <MenuTaiKhoanVaiTro nguoiDung={nguoiDung} />
        </div>
      </div>
    </header>
  );
}
