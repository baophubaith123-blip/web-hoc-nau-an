import { KhungDashboard } from "@/components/layout/khung-dashboard";
import { taoNguoiDungHeader } from "@/components/layout/nguoi-dung-header";
import { yeuCauVaiTro } from "@/lib/supabase/server";
import { MENU_QUAN_TRI } from "@/lib/utils/vai-tro";
import { vi } from "@/lib/i18n/vi";

export default async function QuanTriLayout({ children }: { children: React.ReactNode }) {
  const phien = await yeuCauVaiTro(["admin"]);
  return (
    <KhungDashboard nguoiDung={taoNguoiDungHeader(phien)} menu={MENU_QUAN_TRI} tieuDe={vi.quan_tri.tieu_de}>
      {children}
    </KhungDashboard>
  );
}