import { KhungDashboard } from "@/components/layout/khung-dashboard";
import { NutNoiCokba } from "@/components/tro-ly/nut-noi-cokba";
import { taoNguoiDungHeader } from "@/components/layout/nguoi-dung-header";
import { yeuCauVaiTro } from "@/lib/supabase/server";
import { MENU_NGUOI_DUNG, thongTinKhuVaiTro, type MucMenu } from "@/lib/utils/vai-tro";
import { vi } from "@/lib/i18n/vi";
import type { VaiTro } from "@/types";

export default async function NguoiDungLayout({ children }: { children: React.ReactNode }) {
  const phien = await yeuCauVaiTro(); // mọi vai trò đã đăng nhập đều vào được
  const nguoiDung = taoNguoiDungHeader(phien);

  // Chef/Admin hoặc Pro còn hạn mới được đăng bài. Tài khoản thường vẫn thấy
  // mục "Tạo công thức"/"Viết bài viết" nhưng ở trạng thái khóa (mờ + ổ khóa).
  const laDauBepHoacAdmin = phien.profile.vai_tro === "chef" || phien.profile.vai_tro === "admin";
  const laProHopLe = phien.profile.la_pro && phien.profile.goi_het_han && new Date(phien.profile.goi_het_han) > new Date();
  const duocDangBai = laDauBepHoacAdmin || !!laProHopLe;

  const menuCoKhoa = MENU_NGUOI_DUNG.map((m) =>
    (m.href === "/tao-cong-thuc" || m.href === "/tao-bai-viet") && !duocDangBai
      ? { ...m, khoa: true }
      : m
  );

  // Staff (admin/đầu bếp/hỗ trợ) lạc sang khu vực thành viên luôn có lối quay về khu vực
  // làm việc của mình ở ngay đầu menu — trước đây họ không có cách nào quay lại.
  const khuVaiTro = thongTinKhuVaiTro(phien.profile.vai_tro as VaiTro);
  const ICON_THEO_VAI_TRO: Record<string, string> = { admin: "ShieldCheck", chef: "ChefHat", support: "LifeBuoy" };
  const menuHienThi: MucMenu[] = khuVaiTro
    ? [
        {
          nhan: `Về ${khuVaiTro.nhan.charAt(0).toLowerCase()}${khuVaiTro.nhan.slice(1)}`,
          href: khuVaiTro.href,
          icon: ICON_THEO_VAI_TRO[phien.profile.vai_tro] ?? "ShieldCheck",
        },
        ...menuCoKhoa,
      ]
    : menuCoKhoa;

  return (
    <>
      <KhungDashboard nguoiDung={nguoiDung} menu={menuHienThi} tieuDe={vi.menu.bang_dieu_khien}>
        {children}
      </KhungDashboard>
      {/* Nút tròn nổi Cokba hiện ở MỌI trang khu người dùng (yêu cầu
          của Bảo 14/11) — cùng component với khu công khai. 3 khu
          nhân viên không gắn vì có khung riêng. */}
      <NutNoiCokba nguoiDungId={nguoiDung.id} />
    </>
  );
}