"use server";

import { revalidatePath } from "next/cache";
import { canPhien, ghiNhatKy, rongThanhNull } from "@/lib/actions/chung";
import { baiVietSchema } from "@/lib/validations/bai-viet";
import { idUuid } from "@/lib/validations/chung";
import { chuanHoaLoi, thanhCong, thatBai, type KetQua } from "@/lib/utils/phan-hoi-loi";
import { taoSlugDuyNhat } from "@/lib/utils/slug";
import { t } from "@/lib/i18n/config";
import type { z } from "zod";

const lamMoi = () => {
  revalidatePath("/bai-viet");
  revalidatePath("/quan-tri/bai-viet");
  revalidatePath("/");
};

const dong = (d: z.infer<typeof baiVietSchema>) => ({
  tieu_de: d.tieu_de,
  tom_tat: rongThanhNull(d.tom_tat),
  noi_dung: d.noi_dung,
  anh_dai_dien: rongThanhNull(d.anh_dai_dien),
  danh_muc: rongThanhNull(d.danh_muc),
  trang_thai: d.trang_thai,
});

export async function taoBaiViet(dauVao: unknown): Promise<KetQua<{ id: string }>> {
  try {
    const p = await canPhien(["admin"]);
    if (!p.ok) return p.loi;
    const d = baiVietSchema.parse(dauVao);
    const { data, error } = await p.supabase
      .from("bai_viet").insert({ ...dong(d), slug: taoSlugDuyNhat(d.tieu_de), tac_gia_id: p.user.id }).select("id").single();
    if (error) throw error;
    await ghiNhatKy(p.supabase, p.user.id, "tao_bai_viet", "bai_viet", data.id);
    lamMoi();
    return thanhCong({ id: data.id });
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

export async function capNhatBaiViet(id: unknown, dauVao: unknown): Promise<KetQua> {
  try {
    const p = await canPhien(["admin"]);
    if (!p.ok) return p.loi;
    const d = baiVietSchema.parse(dauVao);
    const { data, error } = await p.supabase.from("bai_viet").update(dong(d)).eq("id", idUuid.parse(id)).select("id").maybeSingle();
    if (error) throw error;
    if (!data) return thatBai(t("loi.khong_tim_thay"));
    await ghiNhatKy(p.supabase, p.user.id, "sua_bai_viet", "bai_viet", data.id);
    lamMoi();
    return thanhCong();
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

export async function xoaBaiViet(id: unknown): Promise<KetQua> {
  try {
    const p = await canPhien(["admin"]);
    if (!p.ok) return p.loi;
    const { error } = await p.supabase.from("bai_viet").delete().eq("id", idUuid.parse(id));
    if (error) throw error;
    await ghiNhatKy(p.supabase, p.user.id, "xoa_bai_viet", "bai_viet", String(id));
    lamMoi();
    return thanhCong();
  } catch (e) {
    return chuanHoaLoi(e);
  }
}