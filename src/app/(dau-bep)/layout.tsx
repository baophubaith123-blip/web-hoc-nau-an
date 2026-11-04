import { KhungDashboard } from "@/components/layout/khung-dashboard";
import { taoNguoiDungHeader } from "@/components/layout/nguoi-dung-header";
import { yeuCauVaiTro } from "@/lib/supabase/server";
import { MENU_DAU_BEP } from "@/lib/utils/vai-tro";
import { vi } from "@/lib/i18n/vi";

export default async function DauBepLayout({ children }: { children: React.ReactNode }) {
  const phien = await yeuCauVaiTro(["chef", "admin"]);
  return (
    <KhungDashboard nguoiDung={taoNguoiDungHeader(phien)} menu={MENU_DAU_BEP} tieuDe={vi.dau_bep_dash.tieu_de}>
      {children}
    </KhungDashboard>
  );
}