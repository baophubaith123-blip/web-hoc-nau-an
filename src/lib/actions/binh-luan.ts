"use server";

import { revalidatePath } from "next/cache";
import { canPhien } from "@/lib/actions/chung";
import { baoCaoSchema, binhLuanSchema, danhGiaSchema, suaBinhLuanSchema } from "@/lib/validations/binh-luan";
import { idUuid } from "@/lib/validations/chung";
import { chuanHoaLoi, thanhCong, thatBai, type KetQua } from "@/lib/utils/phan-hoi-loi";
import { rongThanhNull } from "@/lib/actions/chung";
import { t } from "@/lib/i18n/config";

// Gửi bình luận / trả lời. Realtime tự đẩy cho người khác; trigger DB tự tạo thông báo và giới hạn tần suất
export async function guiBinhLuan(dauVao: unknown): Promise<KetQua<{ id: string }>> {
  try {
    const p = await canPhien();
    if (!p.ok) return p.loi;
    const d = binhLuanSchema.parse(dauVao);

    if (d.binh_luan_cha_id) {
      const { data: cha } = await p.supabase
        .from("binh_luan").select("cong_thuc_id").eq("id", d.binh_luan_cha_id).is("deleted_at", null).maybeSingle();
      if (!cha || cha.cong_thuc_id !== d.cong_thuc_id) return thatBai(t("hanh_dong.binh_luan_cha_sai"));
    }

    const { data, error } = await p.supabase
      .from("binh_luan")
      .insert({
        nguoi_dung_id: p.user.id, cong_thuc_id: d.cong_thuc_id,
        noi_dung: d.noi_dung, binh_luan_cha_id: d.binh_luan_cha_id,
      })
      .select("id")
      .single();
    if (error) throw error;
    return thanhCong({ id: data.id });
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

export async function suaBinhLuan(dauVao: unknown): Promise<KetQua> {
  try {
    const p = await canPhien();
    if (!p.ok) return p.loi;
    const d = suaBinhLuanSchema.parse(dauVao);
    const { data, error } = await p.supabase
      .from("binh_luan").update({ noi_dung: d.noi_dung }).eq("id", d.id).is("deleted_at", null).select("id").maybeSingle();
    if (error) throw error;
    if (!data) return thatBai(t("loi.khong_co_quyen"));
    return thanhCong();
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

// Xóa mềm: chủ bình luận hoặc admin (RLS quyết định)
export async function xoaBinhLuan(id: unknown): Promise<KetQua> {
  try {
    const p = await canPhien();
    if (!p.ok) return p.loi;
    const { data, error } = await p.supabase
      .from("binh_luan").update({ deleted_at: new Date().toISOString() }).eq("id", idUuid.parse(id)).select("id").maybeSingle();
    if (error) throw error;
    if (!data) return thatBai(t("loi.khong_co_quyen"));
    revalidatePath("/quan-tri/binh-luan");
    return thanhCong();
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

// Gửi hoặc cập nhật đánh giá (mỗi người 1 đánh giá / công thức)
export async function guiDanhGia(dauVao: unknown): Promise<KetQua> {
  try {
    const p = await canPhien();
    if (!p.ok) return p.loi;
    const d = danhGiaSchema.parse(dauVao);

    const { data: ct } = await p.supabase
      .from("cong_thuc").select("tac_gia_id, slug").eq("id", d.cong_thuc_id).eq("trang_thai", "xuat_ban").maybeSingle();
    if (!ct) return thatBai(t("loi.khong_tim_thay"));
    if (ct.tac_gia_id === p.user.id) return thatBai(t("hanh_dong.khong_tu_danh_gia"));

    const { error } = await p.supabase.from("danh_gia").upsert(
      { nguoi_dung_id: p.user.id, cong_thuc_id: d.cong_thuc_id, diem: d.diem, nhan_xet: rongThanhNull(d.nhan_xet) },
      { onConflict: "nguoi_dung_id,cong_thuc_id" }
    );
    if (error) throw error;
    revalidatePath(`/cong-thuc/${ct.slug}`);
    revalidatePath("/cong-thuc");
    return thanhCong();
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

// Xóa đánh giá: chủ đánh giá hoặc admin
export async function xoaDanhGia(id: unknown): Promise<KetQua> {
  try {
    const p = await canPhien();
    if (!p.ok) return p.loi;
    const { data, error } = await p.supabase.from("danh_gia").delete().eq("id", idUuid.parse(id)).select("id").maybeSingle();
    if (error) throw error;
    if (!data) return thatBai(t("loi.khong_co_quyen"));
    revalidatePath("/quan-tri/danh-gia");
    revalidatePath("/cong-thuc");
    return thanhCong();
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

// Báo cáo vi phạm (công thức, bình luận...). Admin xử lý ở tab "Báo cáo" của trang bình luận
export async function baoCaoViPham(dauVao: unknown): Promise<KetQua> {
  try {
    const p = await canPhien();
    if (!p.ok) return p.loi;
    const d = baoCaoSchema.parse(dauVao);
    const { error } = await p.supabase.from("bao_cao_vi_pham").insert({
      nguoi_bao_cao_id: p.user.id, loai_doi_tuong: d.loai_doi_tuong, doi_tuong_id: d.doi_tuong_id,
      ly_do: d.ly_do, mo_ta: rongThanhNull(d.mo_ta),
    });
    if (error) throw error;
    return thanhCong();
  } catch (e) {
    return chuanHoaLoi(e);
  }
}