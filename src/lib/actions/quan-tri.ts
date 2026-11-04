"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  canPhien, ghiNhatKy, guiThongBaoNhieuNguoi, layEmailVaTen, layIdNguoiDung, rongThanhNull,
} from "@/lib/actions/chung";
import {
  cauHinhSchema, danhMucSchema, doiVaiTroSchema, hoanTienSchema, khoaNguoiDungSchema, xuLyBaoCaoSchema,
} from "@/lib/validations/quan-tri";
import { tuChoiCongThucSchema } from "@/lib/validations/cong-thuc";
import { idUuid } from "@/lib/validations/chung";
import { chuanHoaLoi, thanhCong, thatBai, type KetQua } from "@/lib/utils/phan-hoi-loi";
import { nhanCua } from "@/lib/utils/hang-so";
import { taoSupabaseAdmin } from "@/lib/supabase/admin";
import { guiEmailKetQuaDuyet } from "@/lib/email/gui-email";
import { t } from "@/lib/i18n/config";
import type { Json } from "@/types/database";

// ================= NGƯỜI DÙNG =================

export async function doiVaiTro(dauVao: unknown): Promise<KetQua> {
  try {
    const p = await canPhien(["admin"]);
    if (!p.ok) return p.loi;
    const d = doiVaiTroSchema.parse(dauVao);
    if (d.nguoi_dung_id === p.user.id) return thatBai(t("quan_tri.khong_tu_doi_minh"));

    const { data, error } = await p.supabase
      .from("profiles").update({ vai_tro: d.vai_tro }).eq("id", d.nguoi_dung_id).select("id").maybeSingle();
    if (error) throw error;
    if (!data) return thatBai(t("loi.khong_tim_thay"));

    await guiThongBaoNhieuNguoi(p.supabase, [d.nguoi_dung_id], {
      tieu_de: t("hanh_dong.tb_vai_tro_tieu_de"),
      noi_dung: t("hanh_dong.tb_vai_tro_nd", { vai_tro: nhanCua("vai_tro", d.vai_tro) }),
      loai: "he_thong",
    });
    await ghiNhatKy(p.supabase, p.user.id, "doi_vai_tro", "nguoi_dung", d.nguoi_dung_id, { vai_tro: d.vai_tro });
    revalidatePath("/quan-tri/nguoi-dung");
    revalidatePath("/quan-tri/dau-bep");
    return thanhCong();
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

// Khóa / mở khóa. Người bị khóa sẽ bị đăng xuất ở lần truy cập kế tiếp (middleware)
export async function khoaNguoiDung(dauVao: unknown): Promise<KetQua> {
  try {
    const p = await canPhien(["admin"]);
    if (!p.ok) return p.loi;
    const d = khoaNguoiDungSchema.parse(dauVao);
    if (d.nguoi_dung_id === p.user.id) return thatBai(t("quan_tri.khong_tu_doi_minh"));

    const { data, error } = await p.supabase
      .from("profiles").update({ trang_thai: d.khoa ? "khoa" : "hoat_dong" }).eq("id", d.nguoi_dung_id).select("id").maybeSingle();
    if (error) throw error;
    if (!data) return thatBai(t("loi.khong_tim_thay"));

    await ghiNhatKy(p.supabase, p.user.id, d.khoa ? "khoa_nguoi_dung" : "mo_khoa_nguoi_dung", "nguoi_dung", d.nguoi_dung_id);
    revalidatePath("/quan-tri/nguoi-dung");
    return thanhCong();
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

// ================= DUYỆT CÔNG THỨC / KHÓA HỌC =================

const lamMoiCongThuc = () => {
  ["/cong-thuc", "/quan-tri/cong-thuc", "/cong-thuc-da-gui", "/bep/cong-thuc", "/"].forEach((x) => revalidatePath(x));
};

// Trigger DB tự tạo thông báo realtime cho tác giả; ở đây gửi thêm email
async function emailKetQua(tacGiaId: string, tieuDe: string, slug: string, duyet: boolean, lyDo?: string) {
  const nd = await layEmailVaTen(tacGiaId);
  if (!nd) return;
  await guiEmailKetQuaDuyet({ den: nd.email, ten: nd.ten, tieuDe, slug, duyet, lyDo }).catch((e: unknown) =>
    console.error("[EMAIL DUYET]", e)
  );
}

export async function duyetCongThuc(id: unknown): Promise<KetQua> {
  try {
    const p = await canPhien(["admin"]);
    if (!p.ok) return p.loi;
    const idCt = idUuid.parse(id);
    const { data, error } = await p.supabase
      .from("cong_thuc")
      .update({ trang_thai: "xuat_ban", ly_do_tu_choi: null })
      .eq("id", idCt).eq("trang_thai", "cho_duyet").is("deleted_at", null)
      .select("tieu_de, slug, tac_gia_id").maybeSingle();
    if (error) throw error;
    if (!data) return thatBai(t("hanh_dong.sai_trang_thai"));

    await emailKetQua(data.tac_gia_id, data.tieu_de, data.slug, true);
    await ghiNhatKy(p.supabase, p.user.id, "duyet_cong_thuc", "cong_thuc", idCt);
    lamMoiCongThuc();
    return thanhCong();
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

export async function tuChoiCongThuc(dauVao: unknown): Promise<KetQua> {
  try {
    const p = await canPhien(["admin"]);
    if (!p.ok) return p.loi;
    const d = tuChoiCongThucSchema.parse(dauVao);
    const { data, error } = await p.supabase
      .from("cong_thuc")
      .update({ trang_thai: "tu_choi", ly_do_tu_choi: d.ly_do })
      .eq("id", d.id).eq("trang_thai", "cho_duyet").is("deleted_at", null)
      .select("tieu_de, slug, tac_gia_id").maybeSingle();
    if (error) throw error;
    if (!data) return thatBai(t("hanh_dong.sai_trang_thai"));

    await emailKetQua(data.tac_gia_id, data.tieu_de, data.slug, false, d.ly_do);
    await ghiNhatKy(p.supabase, p.user.id, "tu_choi_cong_thuc", "cong_thuc", d.id, { ly_do: d.ly_do });
    lamMoiCongThuc();
    return thanhCong();
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

export async function datNoiBat(id: unknown, noiBat: boolean): Promise<KetQua> {
  try {
    const p = await canPhien(["admin"]);
    if (!p.ok) return p.loi;
    const { data, error } = await p.supabase
      .from("cong_thuc").update({ noi_bat: !!noiBat }).eq("id", idUuid.parse(id)).eq("trang_thai", "xuat_ban").select("id").maybeSingle();
    if (error) throw error;
    if (!data) return thatBai(t("hanh_dong.sai_trang_thai"));
    lamMoiCongThuc();
    return thanhCong();
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

// Duyệt (xuất bản) hoặc từ chối (trả về bản nháp) khóa học của chef
export async function duyetKhoaHoc(id: unknown, duyet: boolean): Promise<KetQua> {
  try {
    const p = await canPhien(["admin"]);
    if (!p.ok) return p.loi;
    const idKh = idUuid.parse(id);
    const { data, error } = await p.supabase
      .from("khoa_hoc")
      .update({ trang_thai: duyet ? "xuat_ban" : "nhap" })
      .eq("id", idKh).eq("trang_thai", "cho_duyet")
      .select("tieu_de, slug, dau_bep_id").maybeSingle();
    if (error) throw error;
    if (!data) return thatBai(t("hanh_dong.sai_trang_thai"));

    await guiThongBaoNhieuNguoi(p.supabase, [data.dau_bep_id], {
      tieu_de: t(duyet ? "hanh_dong.tb_khoa_hoc_duyet" : "hanh_dong.tb_khoa_hoc_tu_choi"),
      noi_dung: t(duyet ? "hanh_dong.tb_khoa_hoc_duyet_nd" : "hanh_dong.tb_khoa_hoc_tu_choi_nd", { ten: data.tieu_de }),
      loai: "duyet_khoa_hoc", lien_ket: "/bep/khoa-hoc",
    });
    // Khóa mới xuất bản → báo cho mọi người dùng (realtime)
    if (duyet) {
      const ids = (await layIdNguoiDung(p.supabase)).filter((x) => x !== data.dau_bep_id);
      await guiThongBaoNhieuNguoi(p.supabase, ids, {
        tieu_de: t("hanh_dong.tb_khoa_hoc_moi"), noi_dung: t("hanh_dong.tb_khoa_hoc_moi_nd", { ten: data.tieu_de }),
        loai: "khoa_hoc_moi", lien_ket: `/khoa-hoc/${data.slug}`,
      });
    }
    await ghiNhatKy(p.supabase, p.user.id, duyet ? "duyet_khoa_hoc" : "tu_choi_khoa_hoc", "khoa_hoc", idKh);
    ["/khoa-hoc", "/quan-tri/khoa-hoc", "/bep/khoa-hoc", "/"].forEach((x) => revalidatePath(x));
    return thanhCong();
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

// ================= DANH MỤC =================

export async function taoDanhMuc(dauVao: unknown): Promise<KetQua<{ id: string }>> {
  try {
    const p = await canPhien(["admin"]);
    if (!p.ok) return p.loi;
    const d = danhMucSchema.parse(dauVao);
    const { data, error } = await p.supabase
      .from("danh_muc")
      .insert({ ...d, mo_ta: rongThanhNull(d.mo_ta), anh_dai_dien: rongThanhNull(d.anh_dai_dien) })
      .select("id").single();
    if (error) {
      if (error.code === "23505") return thatBai(t("hanh_dong.slug_da_ton_tai"));
      throw error;
    }
    await ghiNhatKy(p.supabase, p.user.id, "tao_danh_muc", "danh_muc", data.id);
    revalidatePath("/quan-tri/danh-muc");
    revalidatePath("/cong-thuc");
    return thanhCong({ id: data.id });
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

export async function capNhatDanhMuc(id: unknown, dauVao: unknown): Promise<KetQua> {
  try {
    const p = await canPhien(["admin"]);
    if (!p.ok) return p.loi;
    const idDm = idUuid.parse(id);
    const d = danhMucSchema.parse(dauVao);
    if (d.danh_muc_cha_id === idDm) return thatBai(t("hanh_dong.danh_muc_tu_cha"));

    const { data, error } = await p.supabase
      .from("danh_muc")
      .update({ ...d, mo_ta: rongThanhNull(d.mo_ta), anh_dai_dien: rongThanhNull(d.anh_dai_dien) })
      .eq("id", idDm).select("id").maybeSingle();
    if (error) {
      if (error.code === "23505") return thatBai(t("hanh_dong.slug_da_ton_tai"));
      throw error;
    }
    if (!data) return thatBai(t("loi.khong_tim_thay"));
    await ghiNhatKy(p.supabase, p.user.id, "sua_danh_muc", "danh_muc", idDm);
    revalidatePath("/quan-tri/danh-muc");
    revalidatePath("/cong-thuc");
    return thanhCong();
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

// Xóa danh mục: danh mục con tự thành gốc (on delete set null), liên kết công thức tự xóa (cascade)
export async function xoaDanhMuc(id: unknown): Promise<KetQua> {
  try {
    const p = await canPhien(["admin"]);
    if (!p.ok) return p.loi;
    const { error } = await p.supabase.from("danh_muc").delete().eq("id", idUuid.parse(id));
    if (error) throw error;
    await ghiNhatKy(p.supabase, p.user.id, "xoa_danh_muc", "danh_muc", String(id));
    revalidatePath("/quan-tri/danh-muc");
    revalidatePath("/cong-thuc");
    return thanhCong();
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

export async function sapXepDanhMuc(danhSachId: unknown): Promise<KetQua> {
  try {
    const p = await canPhien(["admin"]);
    if (!p.ok) return p.loi;
    const ids = z.array(idUuid).max(300).parse(danhSachId);
    const kq = await Promise.all(ids.map((id, i) => p.supabase.from("danh_muc").update({ thu_tu: i + 1 }).eq("id", id)));
    const loi = kq.find((r) => r.error)?.error;
    if (loi) throw loi;
    revalidatePath("/quan-tri/danh-muc");
    return thanhCong();
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

// ================= BÌNH LUẬN, BÁO CÁO =================

// Duyệt / ẩn bình luận (da_duyet = false sẽ ẩn khỏi trang công khai)
export async function duyetBinhLuan(id: unknown, daDuyet: boolean): Promise<KetQua> {
  try {
    const p = await canPhien(["admin"]);
    if (!p.ok) return p.loi;
    const { data, error } = await p.supabase
      .from("binh_luan").update({ da_duyet: !!daDuyet }).eq("id", idUuid.parse(id)).select("id").maybeSingle();
    if (error) throw error;
    if (!data) return thatBai(t("loi.khong_tim_thay"));
    revalidatePath("/quan-tri/binh-luan");
    return thanhCong();
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

export async function xuLyBaoCao(dauVao: unknown): Promise<KetQua> {
  try {
    const p = await canPhien(["admin"]);
    if (!p.ok) return p.loi;
    const d = xuLyBaoCaoSchema.parse(dauVao);
    const { data, error } = await p.supabase
      .from("bao_cao_vi_pham").update({ trang_thai: d.trang_thai, nguoi_xu_ly_id: p.user.id }).eq("id", d.id).select("id").maybeSingle();
    if (error) throw error;
    if (!data) return thatBai(t("loi.khong_tim_thay"));
    await ghiNhatKy(p.supabase, p.user.id, "xu_ly_bao_cao", "bao_cao", d.id, { trang_thai: d.trang_thai });
    revalidatePath("/quan-tri/binh-luan");
    return thanhCong();
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

// ================= THANH TOÁN =================

// Ghi nhận hoàn tiền: đổi trạng thái giao dịch, thu hồi quyền học và chứng chỉ.
// Việc chuyển tiền thật phải làm trên cổng VNPay merchant (sandbox không có tiền thật)
export async function hoanTien(dauVao: unknown): Promise<KetQua> {
  try {
    const p = await canPhien(["admin"]);
    if (!p.ok) return p.loi;
    const d = hoanTienSchema.parse(dauVao);

    const { data: gd } = await p.supabase
      .from("thanh_toan").select("id, ma_giao_dich, nguoi_dung_id, khoa_hoc_id, trang_thai").eq("id", d.thanh_toan_id).maybeSingle();
    if (!gd) return thatBai(t("loi.khong_tim_thay"));
    if (gd.trang_thai !== "thanh_cong") return thatBai(t("hanh_dong.chi_hoan_tien_thanh_cong"));

    const { error } = await p.supabase.from("thanh_toan").update({ trang_thai: "hoan_tien" }).eq("id", gd.id);
    if (error) throw error;

    // Thu hồi quyền học + chứng chỉ (admin có policy ghi các bảng này)
    if (gd.khoa_hoc_id) {
      await p.supabase.from("dang_ky_khoa_hoc").update({ da_thanh_toan: false })
        .eq("nguoi_dung_id", gd.nguoi_dung_id).eq("khoa_hoc_id", gd.khoa_hoc_id);
      await p.supabase.from("chung_chi").delete().eq("nguoi_dung_id", gd.nguoi_dung_id).eq("khoa_hoc_id", gd.khoa_hoc_id);
    }

    await guiThongBaoNhieuNguoi(p.supabase, [gd.nguoi_dung_id], {
      tieu_de: t("hanh_dong.tb_hoan_tien"), noi_dung: t("hanh_dong.tb_hoan_tien_nd", { ma: gd.ma_giao_dich }),
      loai: "thanh_toan", lien_ket: "/khoa-hoc-cua-toi",
    });
    await ghiNhatKy(p.supabase, p.user.id, "hoan_tien", "thanh_toan", gd.id, { ma: gd.ma_giao_dich });
    revalidatePath("/quan-tri/thanh-toan");
    return thanhCong();
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

// ================= CẤU HÌNH HỆ THỐNG =================

// Mỗi nhóm là 1 dòng trong cau_hinh_he_thong. Khóa "cong_khai.*" được đọc công khai (xem RLS)
export async function luuCauHinh(dauVao: unknown): Promise<KetQua> {
  try {
    const p = await canPhien(["admin"]);
    if (!p.ok) return p.loi;
    const d = cauHinhSchema.parse(dauVao);

    const cacDong = [
      { khoa: "cong_khai.site", gia_tri: d.site, mo_ta: "Thông tin chung của website" },
      { khoa: "cong_khai.seo", gia_tri: d.seo, mo_ta: "Cấu hình SEO" },
      { khoa: "thanh_toan", gia_tri: d.thanh_toan, mo_ta: "Bật/tắt cổng thanh toán" },
      { khoa: "email", gia_tri: d.email, mo_ta: "Cấu hình email" },
    ].map((x) => ({ ...x, gia_tri: x.gia_tri as unknown as Json }));

    const { error } = await p.supabase.from("cau_hinh_he_thong").upsert(cacDong, { onConflict: "khoa" });
    if (error) throw error;
    await ghiNhatKy(p.supabase, p.user.id, "luu_cau_hinh", "cau_hinh");
    revalidatePath("/", "layout");
    return thanhCong();
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

// Khóa/Mở khóa tài khoản qua Auth để hủy phiên ngay lập tức (tùy chọn nâng cao, dùng cùng khoaNguoiDung)
export async function huyPhienNguoiDung(nguoiDungId: unknown): Promise<KetQua> {
  try {
    const p = await canPhien(["admin"]);
    if (!p.ok) return p.loi;
    const id = idUuid.parse(nguoiDungId);
    if (id === p.user.id) return thatBai(t("quan_tri.khong_tu_doi_minh"));
    // Ban 1 phút rồi bỏ ban: đủ để token hiện tại mất hiệu lực sau khi hết hạn; middleware chặn tiếp nhờ trang_thai = 'khoa'
    const admin = taoSupabaseAdmin();
    const { error } = await admin.auth.admin.updateUserById(id, { ban_duration: "1m" });
    if (error) throw error;
    return thanhCong();
  } catch (e) {
    return chuanHoaLoi(e);
  }
}