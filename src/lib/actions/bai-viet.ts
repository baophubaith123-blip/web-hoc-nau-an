"use server";

import { revalidatePath } from "next/cache";
import { canPhien, ghiNhatKy, guiThongBaoNhieuNguoi, laProConHan, rongThanhNull } from "@/lib/actions/chung";
import { taoSupabaseAdmin } from "@/lib/supabase/admin";
import { baiVietSchema, baiVietNguoiDungSchema, tuChoiBaiVietSchema } from "@/lib/validations/bai-viet";
import { idUuid } from "@/lib/validations/chung";
import { chuanHoaLoi, thanhCong, thatBai, type KetQua } from "@/lib/utils/phan-hoi-loi";
import { taoSlugDuyNhat } from "@/lib/utils/slug";
import { t } from "@/lib/i18n/config";
import type { z } from "zod";

const lamMoi = () => {
  revalidatePath("/bai-viet");
  revalidatePath("/quan-tri/bai-viet");
  revalidatePath("/bai-viet-cua-toi");
  revalidatePath("/ho-so");
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
// ================= PHÍA NGƯỜI DÙNG (thành viên Pro gửi bài chờ duyệt) =================

type MucDichBaiViet = "nhap" | "gui"; // nhap = lưu bản nháp, gui = gửi duyệt

// Chốt chặn: user thường phải là Pro còn hạn; chef/admin được dùng (vẫn chờ duyệt như user)
async function kiemTraQuyenDangBai(p: Awaited<ReturnType<typeof canPhien>>) {
  if (!p.ok) return p.loi;
  if (p.vaiTro === "user" && !laProConHan(p.profile)) {
    return thatBai("Tính năng viết bài viết chỉ dành cho thành viên Pro. Hãy nâng cấp tài khoản để sử dụng.");
  }
  return null;
}

export async function guiBaiViet(
  dauVao: unknown,
  mucDich: MucDichBaiViet
): Promise<KetQua<{ id: string }>> {
  try {
    const p = await canPhien();
    if (!p.ok) return p.loi;
    const loiQuyen = await kiemTraQuyenDangBai(p);
    if (loiQuyen) return loiQuyen;
    const d = baiVietNguoiDungSchema.parse(dauVao);
    const trang_thai = mucDich === "gui" ? "cho_duyet" : "nhap";
    const { data, error } = await p.supabase
      .from("bai_viet")
      .insert({
        tieu_de: d.tieu_de,
        tom_tat: rongThanhNull(d.tom_tat),
        noi_dung: d.noi_dung,
        anh_dai_dien: rongThanhNull(d.anh_dai_dien),
        danh_muc: rongThanhNull(d.danh_muc),
        trang_thai,
        slug: taoSlugDuyNhat(d.tieu_de),
        tac_gia_id: p.user.id,
      })
      .select("id")
      .single();
    if (error) throw error;
    await ghiNhatKy(p.supabase, p.user.id, "gui_bai_viet", "bai_viet", data.id, { trang_thai });
    lamMoi();
    return thanhCong({ id: data.id });
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

export async function capNhatBaiVietCuaToi(
  id: unknown,
  dauVao: unknown,
  mucDich: MucDichBaiViet
): Promise<KetQua> {
  try {
    const p = await canPhien();
    if (!p.ok) return p.loi;
    const loiQuyen = await kiemTraQuyenDangBai(p);
    if (loiQuyen) return loiQuyen;
    const idBv = idUuid.parse(id);
    const d = baiVietNguoiDungSchema.parse(dauVao);

    const { data: cu } = await p.supabase
      .from("bai_viet")
      .select("trang_thai, tac_gia_id")
      .eq("id", idBv)
      .maybeSingle();
    if (!cu) return thatBai(t("loi.khong_tim_thay"));
    if (cu.tac_gia_id !== p.user.id) return thatBai(t("loi.khong_co_quyen"));
    // Chỉ sửa được khi bài đang là bản nháp hoặc bị từ chối
    if (cu.trang_thai !== "nhap" && cu.trang_thai !== "tu_choi") {
      return thatBai("Bài viết đang chờ duyệt hoặc đã xuất bản nên không sửa được.");
    }

    const trang_thai = mucDich === "gui" ? "cho_duyet" : "nhap";
    const { error } = await p.supabase
      .from("bai_viet")
      .update({
        tieu_de: d.tieu_de,
        tom_tat: rongThanhNull(d.tom_tat),
        noi_dung: d.noi_dung,
        anh_dai_dien: rongThanhNull(d.anh_dai_dien),
        danh_muc: rongThanhNull(d.danh_muc),
        trang_thai,
        ly_do_tu_choi: null,
      })
      .eq("id", idBv);
    if (error) throw error;
    await ghiNhatKy(p.supabase, p.user.id, "sua_bai_viet", "bai_viet", idBv, { trang_thai });
    lamMoi();
    return thanhCong();
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

export async function xoaBaiVietCuaToi(id: unknown): Promise<KetQua> {
  try {
    const p = await canPhien();
    if (!p.ok) return p.loi;
    const idBv = idUuid.parse(id);
    const { data: cu } = await p.supabase
      .from("bai_viet")
      .select("trang_thai, tac_gia_id")
      .eq("id", idBv)
      .maybeSingle();
    if (!cu) return thatBai(t("loi.khong_tim_thay"));
    if (cu.tac_gia_id !== p.user.id) return thatBai(t("loi.khong_co_quyen"));
    if (cu.trang_thai !== "nhap" && cu.trang_thai !== "tu_choi") {
      return thatBai("Chỉ xóa được bài viết đang là bản nháp hoặc bị từ chối.");
    }
    const { error } = await p.supabase.from("bai_viet").delete().eq("id", idBv);
    if (error) throw error;
    await ghiNhatKy(p.supabase, p.user.id, "xoa_bai_viet", "bai_viet", idBv);
    lamMoi();
    return thanhCong();
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

// ================= DUYỆT BÀI VIẾT CỦA NGƯỜI DÙNG (admin) =================

async function thongBaoKetQuaDuyet(tacGiaId: string, tieuDe: string, duyet: boolean, lyDo?: string) {
  try {
    const admin = taoSupabaseAdmin();
    await guiThongBaoNhieuNguoi(admin, [tacGiaId], {
      tieu_de: duyet ? "Bài viết của bạn đã được duyệt" : "Bài viết của bạn bị từ chối",
      noi_dung: duyet
        ? `Bài viết "${tieuDe}" đã được xuất bản và đang hiển thị công khai.`
        : `Bài viết "${tieuDe}" chưa đạt yêu cầu. Lý do: ${lyDo || "không rõ"}. Bạn hãy sửa lại và gửi duyệt lần nữa nhé.`,
      loai: "he_thong",
      lien_ket: "/bai-viet-cua-toi",
    });
  } catch (e) {
    console.error("[THONG BAO DUYET BAI VIET]", e);
  }
}

export async function duyetBaiViet(id: unknown): Promise<KetQua> {
  try {
    const p = await canPhien(["admin"]);
    if (!p.ok) return p.loi;
    const idBv = idUuid.parse(id);
    const { data, error } = await p.supabase
      .from("bai_viet")
      .update({ trang_thai: "xuat_ban", ly_do_tu_choi: null })
      .eq("id", idBv)
      .eq("trang_thai", "cho_duyet")
      .select("tieu_de, tac_gia_id")
      .maybeSingle();
    if (error) throw error;
    if (!data) return thatBai(t("hanh_dong.sai_trang_thai"));
    await thongBaoKetQuaDuyet(data.tac_gia_id, data.tieu_de, true);
    await ghiNhatKy(p.supabase, p.user.id, "duyet_bai_viet", "bai_viet", idBv);
    lamMoi();
    return thanhCong();
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

export async function tuChoiBaiViet(dauVao: unknown): Promise<KetQua> {
  try {
    const p = await canPhien(["admin"]);
    if (!p.ok) return p.loi;
    const d = tuChoiBaiVietSchema.parse(dauVao);
    const { data, error } = await p.supabase
      .from("bai_viet")
      .update({ trang_thai: "tu_choi", ly_do_tu_choi: d.ly_do })
      .eq("id", d.id)
      .eq("trang_thai", "cho_duyet")
      .select("tieu_de, tac_gia_id")
      .maybeSingle();
    if (error) throw error;
    if (!data) return thatBai(t("hanh_dong.sai_trang_thai"));
    await thongBaoKetQuaDuyet(data.tac_gia_id, data.tieu_de, false, d.ly_do);
    await ghiNhatKy(p.supabase, p.user.id, "tu_choi_bai_viet", "bai_viet", d.id, { ly_do: d.ly_do });
    lamMoi();
    return thanhCong();
  } catch (e) {
    return chuanHoaLoi(e);
  }
}
