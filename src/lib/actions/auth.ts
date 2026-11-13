"use server";

import { revalidatePath } from "next/cache";
import { taoSupabaseServer } from "@/lib/supabase/server";
import { canPhien, ghiNhatKy, laDuongDanNoiBo } from "@/lib/actions/chung";
import { dangNhapSchema, dangKySchema, quenMatKhauSchema, datLaiMatKhauSchema } from "@/lib/validations/auth";
import { chuanHoaLoi, thanhCong, thatBai, type KetQua } from "@/lib/utils/phan-hoi-loi";
import { trangChuTheoVaiTro } from "@/lib/utils/vai-tro";
import { t } from "@/lib/i18n/config";
import type { VaiTro } from "@/types";

const SITE = () => process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Đăng nhập. Trả về đường dẫn cần chuyển đến (client gọi router.push)
export async function dangNhap(dauVao: unknown, quayLai?: string | null): Promise<KetQua<{ chuyen_den: string }>> {
  try {
    const d = dangNhapSchema.parse(dauVao);
    const supabase = await taoSupabaseServer();
    const { data, error } = await supabase.auth.signInWithPassword({ email: d.email, password: d.mat_khau });

    if (error) {
      if (error.code === "email_not_confirmed") return thatBai(t("auth.email_chua_xac_nhan"));
      if (error.status === 429) return thatBai(t("loi.qua_nhanh"));
      // Phát hiện lỗi không kết nối được tới Supabase (DNS chết, URL sai, hoặc dự án bị pause)
      if (
        error.name === "AuthRetryableFetchError" ||
        error.status === 0 ||
        error.message?.includes("fetch failed") ||
        error.message?.includes("Failed to fetch")
      ) {
        return thatBai("Lỗi kết nối Supabase: Máy chủ cơ sở dữ liệu không phản hồi hoặc đang bị Pause. Vui lòng kiểm tra lại cấu hình Supabase URL và API Key trong file .env.local.");
      }
      return thatBai(t("auth.sai_thong_tin")); // không tiết lộ email có tồn tại hay không
    }

    const { data: hs } = await supabase.from("profiles").select("vai_tro, trang_thai").eq("id", data.user.id).single();
    if (!hs || hs.trang_thai !== "hoat_dong") {
      await supabase.auth.signOut();
      return thatBai(t("loi.tai_khoan_khoa"));
    }

    await supabase.from("profiles").update({ lan_dang_nhap_cuoi: new Date().toISOString() }).eq("id", data.user.id);
    await ghiNhatKy(supabase, data.user.id, "dang_nhap", "nguoi_dung", data.user.id);
    revalidatePath("/", "layout");

    return thanhCong({
      chuyen_den: laDuongDanNoiBo(quayLai) ? quayLai : trangChuTheoVaiTro(hs.vai_tro as VaiTro),
    });
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

// Đăng ký. can_xac_nhan = true nghĩa là phải xác nhận email trước khi đăng nhập
export async function dangKy(dauVao: unknown): Promise<KetQua<{ can_xac_nhan: boolean }>> {
  try {
    const d = dangKySchema.parse(dauVao);
    const supabase = await taoSupabaseServer();
    const { data, error } = await supabase.auth.signUp({
      email: d.email,
      password: d.mat_khau,
      options: { data: { ho_ten: d.ho_ten }, emailRedirectTo: `${SITE()}/api/auth/callback` },
    });
    if (error) {
      if (error.code === "user_already_exists" || error.code === "email_exists") return thatBai(t("hanh_dong.email_da_dang_ky"));
      if (error.status === 429) return thatBai(t("loi.qua_nhanh"));
      throw error;
    }
    return thanhCong({ can_xac_nhan: !data.session });
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

export async function dangXuat(): Promise<KetQua> {
  try {
    const supabase = await taoSupabaseServer();
    await supabase.auth.signOut();
    revalidatePath("/", "layout");
    return thanhCong();
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

// Luôn trả về thành công để không lộ email nào đã đăng ký
export async function quenMatKhau(dauVao: unknown): Promise<KetQua> {
  try {
    const d = quenMatKhauSchema.parse(dauVao);
    const supabase = await taoSupabaseServer();
    const { error } = await supabase.auth.resetPasswordForEmail(d.email, {
      redirectTo: `${SITE()}/api/auth/callback?next=/dat-lai-mat-khau`,
    });
    if (error?.status === 429) return thatBai(t("loi.qua_nhanh"));
    if (error) console.error("[QUEN MAT KHAU]", error.code);
    return thanhCong();
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

// Đặt mật khẩu mới (người dùng đã có phiên tạm từ link email qua /api/auth/callback)
export async function datLaiMatKhau(dauVao: unknown): Promise<KetQua> {
  try {
    const d = datLaiMatKhauSchema.parse(dauVao);
    const supabase = await taoSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return thatBai(t("hanh_dong.lien_ket_het_han"));
    const { error } = await supabase.auth.updateUser({ password: d.mat_khau });
    if (error) throw error;
    await ghiNhatKy(supabase, user.id, "dat_lai_mat_khau", "nguoi_dung", user.id);
    return thanhCong();
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

// Dùng cho client: lấy nhanh vai trò hiện tại (sau khi đăng nhập xong)
export async function layVaiTroHienTai(): Promise<KetQua<{ vai_tro: VaiTro }>> {
  const p = await canPhien();
  if (!p.ok) return p.loi;
  return thanhCong({ vai_tro: p.vaiTro });
}
// ===== ĐĂNG NHẬP NHANH ĐỂ DEMO =====
// Phục vụ khối "Truy cập nhanh để demo" ở trang đăng nhập: bấm 1 nút là vào
// thẳng giao diện của vai trò tương ứng bằng TÀI KHOẢN MẪU CÔNG KHAI ghi trong
// README (mật khẩu chung của dữ liệu seed). Chỉ dùng để demo/bảo vệ đồ án và
// test nhanh 4 giao diện — khi triển khai thật cho người dùng thật thì XÓA
// action này cùng component DangNhapNhanhDemo.
const TAI_KHOAN_DEMO: Record<string, string> = {
  admin: "admin@naungon.vn",
  hoc_vien: "user1@naungon.vn",
  dau_bep: "chef@naungon.vn",
  ho_tro: "support@naungon.vn",
};
const MAT_KHAU_DEMO = "Matkhau@123"; // mật khẩu chung của tài khoản mẫu (README)

export async function dangNhapNhanhDemo(khoa: string): Promise<KetQua<{ chuyen_den: string }>> {
  const email = TAI_KHOAN_DEMO[khoa];
  if (!email) return thatBai("Tài khoản demo không hợp lệ. Vui lòng đăng nhập thủ công.");
  return dangNhap({ email, mat_khau: MAT_KHAU_DEMO });
}
