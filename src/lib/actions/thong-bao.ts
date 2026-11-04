"use server";

import { revalidatePath } from "next/cache";
import { canPhien, ghiNhatKy, guiThongBaoNhieuNguoi, layIdNguoiDung, rongThanhNull } from "@/lib/actions/chung";
import { broadcastSchema } from "@/lib/validations/quan-tri";
import { idUuid } from "@/lib/validations/chung";
import { chuanHoaLoi, thanhCong, type KetQua } from "@/lib/utils/phan-hoi-loi";

export async function danhDauDaDoc(id: unknown): Promise<KetQua> {
  try {
    const p = await canPhien();
    if (!p.ok) return p.loi;
    const { error } = await p.supabase
      .from("thong_bao").update({ da_doc: true }).eq("id", idUuid.parse(id)).eq("nguoi_dung_id", p.user.id);
    if (error) throw error;
    revalidatePath("/thong-bao");
    return thanhCong();
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

export async function docTatCaThongBao(): Promise<KetQua> {
  try {
    const p = await canPhien();
    if (!p.ok) return p.loi;
    const { error } = await p.supabase
      .from("thong_bao").update({ da_doc: true }).eq("nguoi_dung_id", p.user.id).eq("da_doc", false);
    if (error) throw error;
    revalidatePath("/thong-bao");
    return thanhCong();
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

export async function xoaThongBao(id: unknown): Promise<KetQua> {
  try {
    const p = await canPhien();
    if (!p.ok) return p.loi;
    const { error } = await p.supabase.from("thong_bao").delete().eq("id", idUuid.parse(id)).eq("nguoi_dung_id", p.user.id);
    if (error) throw error;
    revalidatePath("/thong-bao");
    return thanhCong();
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

// Admin gửi thông báo hàng loạt
export async function guiBroadcast(dauVao: unknown): Promise<KetQua<{ so_nguoi_nhan: number }>> {
  try {
    const p = await canPhien(["admin"]);
    if (!p.ok) return p.loi;
    const d = broadcastSchema.parse(dauVao);

    const ids = await layIdNguoiDung(p.supabase, d.doi_tuong === "tat_ca" ? undefined : d.doi_tuong);
    await guiThongBaoNhieuNguoi(p.supabase, ids, {
      tieu_de: d.tieu_de, noi_dung: d.noi_dung, loai: "broadcast", lien_ket: rongThanhNull(d.lien_ket),
    });
    await ghiNhatKy(p.supabase, p.user.id, "gui_broadcast", "thong_bao", undefined, { doi_tuong: d.doi_tuong, so_nguoi: ids.length });
    return thanhCong({ so_nguoi_nhan: ids.length });
  } catch (e) {
    return chuanHoaLoi(e);
  }
}