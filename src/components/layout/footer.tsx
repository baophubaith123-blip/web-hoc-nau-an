import Link from "next/link";
import { ChefHat } from "lucide-react";
import { LIEN_KET_CHINH, LIEN_KET_PHU } from "./lien-ket";
import { t } from "@/lib/i18n/config";
import { vi } from "@/lib/i18n/vi";

export function Footer() {
  const cot = (tieuDe: string, ds: { nhan: string; href: string }[]) => (
    <div>
      <h3 className="mb-3 text-sm font-semibold">{tieuDe}</h3>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {ds.map((m) => (
          <li key={m.href}>
            <Link href={m.href} className="hover:text-foreground">{m.nhan}</Link>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer className="mt-16 border-t bg-muted/30">
      <div className="mx-auto grid max-w-screen-xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <ChefHat className="h-6 w-6 text-primary" />
            {vi.chung.ten_site}
          </Link>
          <p className="text-sm text-muted-foreground">{vi.chung.slogan}</p>
        </div>
        {cot(vi.footer.lien_ket, LIEN_KET_CHINH.slice(0, 4))}
        {cot(vi.footer.ho_tro, [...LIEN_KET_PHU, ...LIEN_KET_CHINH.slice(4)])}
      </div>
      <div className="border-t py-4 text-center text-xs text-muted-foreground">
        {t("footer.ban_quyen", { nam: new Date().getFullYear() })}
      </div>
    </footer>
  );
}