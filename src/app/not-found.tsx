import Link from "next/link";
import { Button } from "@/components/ui/button";
import { vi } from "@/lib/i18n/vi";

export default function KhongTimThay() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="text-7xl font-bold text-primary">404</p>
      <h1 className="text-2xl font-semibold">{vi.loi.trang_404_tieu_de}</h1>
      <p className="max-w-md text-muted-foreground">{vi.loi.trang_404_mo_ta}</p>
      <Button asChild>
        <Link href="/">{vi.menu.ve_trang_chu}</Link>
      </Button>
    </main>
  );
}