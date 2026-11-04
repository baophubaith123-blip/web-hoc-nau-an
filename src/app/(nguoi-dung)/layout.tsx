import { KhungDashboard } from "@/components/layout/khung-dashboard";
import { taoNguoiDungHeader } from "@/components/layout/nguoi-dung-header";
import { yeuCauVaiTro } from "@/lib/supabase/server";
import { MENU_NGUOI_DUNG } from "@/lib/utils/vai-tro";
import { vi } from "@/lib/i18n/vi";

export default async function NguoiDungLayout({ children }: { children: React.ReactNode }) {
  const phien = await yeuCauVaiTro(); // mọi vai trò đã đăng nhập đều vào được
  const nguoiDung = taoNguoiDungHeader(phien);

  // Chỉ hiển thị mục "Tạo công thức" nếu là Chef, Admin, hoặc thành viên Pro còn hạn
  const laDauBepHoacAdmin = phien.profile.vai_tro === "chef" || phien.profile.vai_tro === "admin";
  const laProHopLe = phien.profile.la_pro && phien.profile.goi_het_han && new Date(phien.profile.goi_het_han) > new Date();
  const duocTaoCongThuc = laDauBepHoacAdmin || laProHopLe;

  const menuHienThi = duocTaoCongThuc
    ? MENU_NGUOI_DUNG
    : MENU_NGUOI_DUNG.filter((m) => m.href !== "/tao-cong-thuc");

  return (
    <KhungDashboard nguoiDung={nguoiDung} menu={menuHienThi} tieuDe={vi.menu.bang_dieu_khien}>
      {children}
    </KhungDashboard>
  );
}