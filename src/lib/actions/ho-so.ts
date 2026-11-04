"use server";

import { revalidatePath } from "next/cache";
import { canPhien, ghiNhatKy, rongThanhNull } from "@/lib/actions/chung";
import { doiMatKhauSchema, hoSoSchema } from "@/lib/validations/ho-so";
import { chuanHoaLoi, thanhCong, thatBai, type KetQua } from "@/lib/utils/phan-hoi-loi";
import { t } from "@/lib/i18n/config";

export async function capNhatHoSo(dauVao: unknown): Promise<KetQua> {
  try {
    const p = await canPhien();
    if (!p.ok) return p.loi;
    const d = hoSoSchema.parse(dauVao);

    const { error } = await p.supabase
      .from("profiles")
      .update({
        ho_ten: d.ho_ten,
        username: d.username,
        bio: rongThanhNull(d.bio),
        so_dien_thoai: rongThanhNull(d.so_dien_thoai.replace(/\s/g, "")),
        dia_chi: rongThanhNull(d.dia_chi),
        ngay_sinh: rongThanhNull(d.ngay_sinh),
        gioi_tinh: rongThanhNull(d.gioi_tinh) as "nam" | "nu" | "khac" | null,
      })
      .eq("id", p.user.id);
    if (error) {
      if (error.code === "23505") return thatBai(t("hanh_dong.ten_dang_nhap_da_dung"));
      throw error;
    }
    revalidatePath("/", "layout");
    return thanhCong();
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

// Ảnh được tải lên Storage từ trình duyệt (RLS giới hạn thư mục <user_id>/). Server chỉ lưu URL sau khi kiểm tra
export async function capNhatAvatar(url: string | null): Promise<KetQua> {
  try {
    const p = await canPhien();
    if (!p.ok) return p.loi;
    if (url !== null) {
      const tienTo = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${p.user.id}/`;
      if (typeof url !== "string" || !url.startsWith(tienTo)) return thatBai(t("hanh_dong.anh_khong_hop_le"));
    }
    const { error } = await p.supabase.from("profiles").update({ avatar_url: url }).eq("id", p.user.id);
    if (error) throw error;
    revalidatePath("/", "layout");
    return thanhCong();
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

// Xác minh mật khẩu cũ rồi mới đổi
export async function doiMatKhau(dauVao: unknown): Promise<KetQua> {
  try {
    const p = await canPhien();
    if (!p.ok) return p.loi;
    const d = doiMatKhauSchema.parse(dauVao);
    if (!p.user.email) return thatBai(t("loi.chung"));

    const { error: loiCu } = await p.supabase.auth.signInWithPassword({
      email: p.user.email, password: d.mat_khau_hien_tai,
    });
    if (loiCu) return thatBai(t("ho_so.sai_mat_khau_hien_tai"));

    const { error } = await p.supabase.auth.updateUser({ password: d.mat_khau_moi });
    if (error) throw error;
    await ghiNhatKy(p.supabase, p.user.id, "doi_mat_khau", "nguoi_dung", p.user.id);
    return thanhCong();
  } catch (e) {
    return chuanHoaLoi(e);
  }
}