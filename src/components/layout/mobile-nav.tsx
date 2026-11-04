"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { LIEN_KET_CHINH, LIEN_KET_PHU } from "./lien-ket";
import { DanhSachMenu } from "./sidebar";
import type { NguoiDungHeader } from "./nguoi-dung-header";
import type { MucMenu } from "@/lib/utils/vai-tro";
import { vi } from "@/lib/i18n/vi";

export function MobileNav({ nguoiDung, menuVaiTro }: { nguoiDung: NguoiDungHeader | null; menuVaiTro?: MucMenu[] }) {
  const [mo, setMo] = useState(false);
  const dong = () => setMo(false);
  const lienKet = [{ nhan: vi.menu.trang_chu, href: "/" }, ...LIEN_KET_CHINH, ...LIEN_KET_PHU];

  return (
    <Sheet open={mo} onOpenChange={setMo}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label={vi.menu.mo_menu}>
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 overflow-y-auto p-0">
        <SheetHeader className="border-b p-4">
          <SheetTitle>{vi.chung.ten_site}</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 p-4">
          {menuVaiTro && (
            <>
              <DanhSachMenu menu={menuVaiTro} onChon={dong} />
              <Separator />
            </>
          )}
          <nav className="flex flex-col gap-1">
            {lienKet.map((m) => (
              <Link key={m.href} href={m.href} onClick={dong} className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
                {m.nhan}
              </Link>
            ))}
          </nav>
          {!nguoiDung && (
            <div className="flex flex-col gap-2 pt-2">
              <Button asChild variant="outline" onClick={dong}>
                <Link href="/dang-nhap">{vi.menu.dang_nhap}</Link>
              </Button>
              <Button asChild onClick={dong}>
                <Link href="/dang-ky">{vi.menu.dang_ky}</Link>
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}