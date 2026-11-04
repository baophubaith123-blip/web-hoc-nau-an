import { KhungDashboard } from "@/components/layout/khung-dashboard";
import { taoNguoiDungHeader } from "@/components/layout/nguoi-dung-header";
import { yeuCauVaiTro } from "@/lib/supabase/server";
import { MENU_HO_TRO } from "@/lib/utils/vai-tro";
import { vi } from "@/lib/i18n/vi";

export default async function HoTroLayout({ children }: { children: React.ReactNode }) {
  const phien = await yeuCauVaiTro(["support", "admin"]);
  return (
    <KhungDashboard nguoiDung={taoNguoiDungHeader(phien)} menu={MENU_HO_TRO} tieuDe={vi.menu.ho_tro}>
      {children}
    </KhungDashboard>
  );
}