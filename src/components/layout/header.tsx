import Link from "next/link";
import { ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChuongThongBao } from "@/components/thong-bao/chuong-thong-bao";
import { LIEN_KET_CHINH } from "./lien-ket";
import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";
import type { NguoiDungHeader } from "./nguoi-dung-header";
import type { MucMenu } from "@/lib/utils/vai-tro";
import { vi } from "@/lib/i18n/vi";

// Cần nằm trong ThongBaoProvider khi nguoiDung != null (layout lo việc này)
export function Header({ nguoiDung, menuVaiTro }: { nguoiDung: NguoiDungHeader | null; menuVaiTro?: MucMenu[] }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 w-full max-w-screen-2xl items-center gap-3 px-4">
        <MobileNav nguoiDung={nguoiDung} menuVaiTro={menuVaiTro} />
        <Link href="/" className="flex items-center gap-2 font-bold">
          <ChefHat className="h-6 w-6 text-primary" />
          <span>{vi.chung.ten_site}</span>
        </Link>
        <nav className="ml-6 hidden items-center gap-1 lg:flex">
          {LIEN_KET_CHINH.map((m) => (
            <Link key={m.href} href={m.href} className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              {m.nhan}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />
          {nguoiDung ? (
            <>
              <ChuongThongBao />
              <UserMenu nguoiDung={nguoiDung} />
            </>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button asChild variant="ghost" size="sm">
                <Link href="/dang-nhap">{vi.menu.dang_nhap}</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/dang-ky">{vi.menu.dang_ky}</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}