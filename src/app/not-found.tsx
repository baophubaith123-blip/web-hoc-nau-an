import Link from "next/link";
import { ChefHat, Home, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { vi } from "@/lib/i18n/vi";

export default function KhongTimThay() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-gradient-to-b from-amber-50 via-background to-orange-50 p-6 text-center dark:from-amber-950/20 dark:to-orange-950/10">
      <span className="flex h-24 w-24 items-center justify-center rounded-full bg-amber-500/15 ring-8 ring-amber-500/10">
        <ChefHat className="h-12 w-12 text-amber-600 dark:text-amber-400" />
      </span>
      <p className="text-7xl font-extrabold tracking-tight text-amber-600 dark:text-amber-400">404</p>
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">{vi.loi.trang_404_tieu_de}</h1>
        <p className="mx-auto max-w-md text-muted-foreground">
          Món này chưa có trong thực đơn — trang bạn tìm có thể đã đổi địa chỉ hoặc không còn tồn
          tại. Quay lại bếp chính để tiếp tục khám phá nhé!
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild className="gap-2">
          <Link href="/">
            <Home className="h-4 w-4" />
            {vi.menu.ve_trang_chu}
          </Link>
        </Button>
        <Button asChild variant="outline" className="gap-2">
          <Link href="/cong-thuc">
            <UtensilsCrossed className="h-4 w-4" />
            Khám phá công thức
          </Link>
        </Button>
      </div>
    </main>
  );
}
