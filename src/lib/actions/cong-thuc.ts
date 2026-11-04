"use server";

import { revalidatePath } from "next/cache";
import { canPhien, ghiNhatKy, laDauBepHoacAdmin, rongThanhNull, type Db } from "@/lib/actions/chung";
import { congThucSchema, type CongThucForm } from "@/lib/validations/cong-thuc";
import { idUuid, vanBan } from "@/lib/validations/chung";
import { chuanHoaLoi, thanhCong, thatBai, type KetQua } from "@/lib/utils/phan-hoi-loi";
import { taoSlugDuyNhat } from "@/lib/utils/slug";
import { t } from "@/lib/i18n/config";
import type { Json } from "@/types/database";

type MucDich = "nhap" | "gui"; // nhap = lưu bản nháp, gui = gửi duyệt (chef/admin: xuất bản luôn)

const lamMoi = () => {
  ["/cong-thuc", "/cong-thuc-da-gui", "/cong-thuc-cua-toi", "/bep/cong-thuc", "/quan-tri/cong-thuc"].forEach((p) =>
    revalidatePath(p)
  );
};

// Chuyển dữ liệu form → cột DB (chuỗi rỗng → null, đánh lại số thứ tự bước)
function duLieuCongThuc(d: CongThucForm) {
  return {
    tieu_de: d.tieu_de,
    mo_ta: rongThanhNull(d.mo_ta),
    nguyen_lieu: d.nguyen_lieu as unknown as Json,
    cac_buoc: d.cac_buoc.map((b, i) => ({ ...b, thu_tu: i + 1 })) as unknown as Json,
    thoi_gian_chuan_bi: d.thoi_gian_chuan_bi,
    thoi_gian_nau: d.thoi_gian_nau,
    khau_phan: d.khau_phan,
    do_kho: d.do_kho,
    anh_dai_dien: rongThanhNull(d.anh_dai_dien),
    video_url: rongThanhNull(d.video_url),
    calories: d.calories,
  };
}

// Thay toàn bộ danh mục của công thức
async function ganDanhMuc(supabase: Db, congThucId: string, ids: string[]) {
  const { error: e1 } = await supabase.from("cong_thuc_danh_muc").delete().eq("cong_thuc_id", congThucId);
  if (e1) throw e1;
  if (ids.length === 0) return;
  const { error: e2 } = await supabase
    .from("cong_thuc_danh_muc")
    .insert([...new Set(ids)].map((danh_muc_id) => ({ cong_thuc_id: congThucId, danh_muc_id })));
  if (e2) throw e2;
}

export async function taoCongThuc(dauVao: unknown, mucDich: MucDich): Promise<KetQua<{ id: string; slug: string }>> {
  try {
    const p = await canPhien();
    if (!p.ok) return p.loi;
    const d = congThucSchema.parse(dauVao);

    // User thường gửi → chờ duyệt. Chef/admin gửi → xuất bản luôn
    const trang_thai = mucDich === "gui" ? (laDauBepHoacAdmin(p.vaiTro) ? "xuat_ban" : "cho_duyet") : "nhap";

    const { data, error } = await p.supabase
      .from("cong_thuc")
      .insert({ ...duLieuCongThuc(d), slug: taoSlugDuyNhat(d.tieu_de), tac_gia_id: p.user.id, trang_thai })
      .select("id, slug")
      .single();
    if (error) throw error;

    await ganDanhMuc(p.supabase, data.id, d.danh_muc_ids);
    await ghiNhatKy(p.supabase, p.user.id, "tao_cong_thuc", "cong_thuc", data.id, { trang_thai });
    lamMoi();
    return thanhCong(data);
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

export async function capNhatCongThuc(id: unknown, dauVao: unknown, mucDich: MucDich): Promise<KetQua<{ trang_thai: string }>> {
  try {
    const p = await canPhien();
    if (!p.ok) return p.loi;
    const idCt = idUuid.parse(id);
    const d = congThucSchema.parse(dauVao);

    const { data: cu } = await p.supabase
      .from("cong_thuc").select("trang_thai, tac_gia_id, deleted_at").eq("id", idCt).maybeSingle();
    if (!cu || cu.deleted_at) return thatBai(t("loi.khong_tim_thay"));

    const laChu = cu.tac_gia_id === p.user.id;
    if (!laChu && p.vaiTro !== "admin") return thatBai(t("loi.khong_co_quyen"));
    // User thường không được sửa bài đang chờ duyệt / đã xuất bản
    if (p.vaiTro === "user" && ["cho_duyet", "xuat_ban"].includes(cu.trang_thai)) {
      return thatBai(t("hanh_dong.khong_sua_duoc_cong_thuc"));
    }

    let trang_thai = cu.trang_thai; // admin sửa bài người khác: giữ nguyên trạng thái
    if (laChu) {
      const quyenCao = laDauBepHoacAdmin(p.vaiTro);
      if (mucDich === "gui") trang_thai = quyenCao ? "xuat_ban" : "cho_duyet";
      else trang_thai = quyenCao && cu.trang_thai === "xuat_ban" ? "xuat_ban" : "nhap";
    }

    const { error } = await p.supabase.from("cong_thuc").update({ ...duLieuCongThuc(d), trang_thai }).eq("id", idCt);
    if (error) throw error;

    await ganDanhMuc(p.supabase, idCt, d.danh_muc_ids);
    await ghiNhatKy(p.supabase, p.user.id, "sua_cong_thuc", "cong_thuc", idCt, { trang_thai });
    lamMoi();
    return thanhCong({ trang_thai });
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

// Xóa mềm. Đặt trang_thai = 'nhap' để qua được WITH CHECK của RLS với user thường
export async function xoaCongThuc(id: unknown): Promise<KetQua> {
  try {
    const p = await canPhien();
    if (!p.ok) return p.loi;
    const idCt = idUuid.parse(id);

    const { data: cu } = await p.supabase.from("cong_thuc").select("tac_gia_id, deleted_at").eq("id", idCt).maybeSingle();
    if (!cu || cu.deleted_at) return thatBai(t("loi.khong_tim_thay"));
    if (cu.tac_gia_id !== p.user.id && p.vaiTro !== "admin") return thatBai(t("loi.khong_co_quyen"));

    const { error } = await p.supabase
      .from("cong_thuc").update({ deleted_at: new Date().toISOString(), trang_thai: "nhap" }).eq("id", idCt);
    if (error) throw error;

    await ghiNhatKy(p.supabase, p.user.id, "xoa_cong_thuc", "cong_thuc", idCt);
    lamMoi();
    return thanhCong();
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

// Lưu / bỏ lưu công thức (bấm lần 2 là bỏ lưu)
export async function luuHoacBoLuu(congThucId: unknown): Promise<KetQua<{ da_luu: boolean }>> {
  try {
    const p = await canPhien();
    if (!p.ok) return p.loi;
    const id = idUuid.parse(congThucId);

    const { data: co } = await p.supabase
      .from("cong_thuc_da_luu").select("id").eq("nguoi_dung_id", p.user.id).eq("cong_thuc_id", id).maybeSingle();

    if (co) {
      const { error } = await p.supabase.from("cong_thuc_da_luu").delete().eq("id", co.id);
      if (error) throw error;
      revalidatePath("/cong-thuc-cua-toi");
      return thanhCong({ da_luu: false });
    }

    // Chỉ lưu được công thức nhìn thấy được (RLS của cong_thuc)
    const { data: ct } = await p.supabase.from("cong_thuc").select("id").eq("id", id).eq("trang_thai", "xuat_ban").maybeSingle();
    if (!ct) return thatBai(t("loi.khong_tim_thay"));

    const { error } = await p.supabase.from("cong_thuc_da_luu").insert({ nguoi_dung_id: p.user.id, cong_thuc_id: id });
    if (error) throw error;
    revalidatePath("/cong-thuc-cua-toi");
    return thanhCong({ da_luu: true });
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

export async function doiBoSuuTap(congThucId: unknown, ten: unknown): Promise<KetQua> {
  try {
    const p = await canPhien();
    if (!p.ok) return p.loi;
    const { error } = await p.supabase
      .from("cong_thuc_da_luu")
      .update({ bo_suu_tap: vanBan(1, 50).parse(ten) })
      .eq("nguoi_dung_id", p.user.id)
      .eq("cong_thuc_id", idUuid.parse(congThucId));
    if (error) throw error;
    revalidatePath("/cong-thuc-cua-toi");
    return thanhCong();
  } catch (e) {
    return chuanHoaLoi(e);
  }
}