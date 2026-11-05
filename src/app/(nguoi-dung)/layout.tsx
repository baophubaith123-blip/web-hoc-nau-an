import { KhungDashboard } from "@/components/layout/khung-dashboard";
import { taoNguoiDungHeader } from "@/components/layout/nguoi-dung-header";
import { yeuCauVaiTro } from "@/lib/supabase/server";
import { MENU_NGUOI_DUNG } from "@/lib/utils/vai-tro";
import { vi } from "@/lib/i18n/vi";

export default async function NguoiDungLayout({ children }: { children: React.ReactNode }) {
  const phien = await yeuCauVaiTro(); // mọi vai trò đã đăng nhập đều vào được
  const nguoiDung = taoNguoiDungHeader(phien);

  // Chef/Admin hoặc Pro còn hạn mới được đăng bài. Tài khoản thường vẫn thấy
  // mục "Tạo công thức"/"Viết bài viết" nhưng ở trạng thái khóa (mờ + ổ khóa).
  const laDauBepHoacAdmin = phien.profile.vai_tro === "chef" || phien.profile.vai_tro === "admin";
  const laProHopLe = phien.profile.la_pro && phien.profile.goi_het_han && new Date(phien.profile.goi_het_han) > new Date();
  const duocDangBai = laDauBepHoacAdmin || !!laProHopLe;

  const menuHienThi = MENU_NGUOI_DUNG.map((m) =>
    (m.href === "/tao-cong-thuc" || m.href === "/tao-bai-viet") && !duocDangBai
      ? { ...m, khoa: true }
      : m
  );

  return (
    <KhungDashboard nguoiDung={nguoiDung} menu={menuHienThi} tieuDe={vi.menu.bang_dieu_khien}>
      {children}
    </KhungDashboard>
  );
}