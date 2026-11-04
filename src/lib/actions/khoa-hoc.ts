"use server";

import { revalidatePath } from "next/cache";
import { canPhien, ghiNhatKy, rongThanhNull } from "@/lib/actions/chung";
import { khoaHocSchema, type KhoaHocForm } from "@/lib/validations/khoa-hoc";
import { idUuid } from "@/lib/validations/chung";
import { chuanHoaLoi, thanhCong, thatBai, type KetQua } from "@/lib/utils/phan-hoi-loi";
import { taoSlugDuyNhat } from "@/lib/utils/slug";
import { t } from "@/lib/i18n/config";

type MucDich = "luu" | "gui"; // gui = gửi duyệt (admin: xuất bản luôn)

const lamMoi = () => {
  ["/khoa-hoc", "/khoa-hoc-cua-toi", "/bep/khoa-hoc", "/quan-tri/khoa-hoc"].forEach((p) => revalidatePath(p));
};

function duLieuKhoaHoc(d: KhoaHocForm) {
  return {
    tieu_de: d.tieu_de,
    mo_ta: d.mo_ta,
    mo_ta_chi_tiet: rongThanhNull(d.mo_ta_chi_tiet),
    anh_dai_dien: rongThanhNull(d.anh_dai_dien),
    video_gioi_thieu: rongThanhNull(d.video_gioi_thieu),
    cap_do: d.cap_do,
    gia: d.mien_phi ? 0 : d.gia,
    mien_phi: d.mien_phi,
    co_chung_chi: d.co_chung_chi,
    co_tai_lieu: d.co_tai_lieu,
    co_bai_tap: d.co_bai_tap,
    ho_tro_1_1: d.ho_tro_1_1,
  };
}

export async function taoKhoaHoc(dauVao: unknown, mucDich: MucDich): Promise<KetQua<{ id: string; slug: string }>> {
  try {
    const p = await canPhien(["chef", "admin"]);
    if (!p.ok) return p.loi;
    const d = khoaHocSchema.parse(dauVao);

    // Chef gửi → chờ duyệt (trigger DB cũng ép như vậy). Admin gửi → xuất bản
    const trang_thai = mucDich === "gui" ? (p.vaiTro === "admin" ? "xuat_ban" : "cho_duyet") : "nhap";

    const { data, error } = await p.supabase
      .from("khoa_hoc")
      .insert({ ...duLieuKhoaHoc(d), slug: taoSlugDuyNhat(d.tieu_de), dau_bep_id: p.user.id, trang_thai })
      .select("id, slug")
      .single();
    if (error) throw error;

    await ghiNhatKy(p.supabase, p.user.id, "tao_khoa_hoc", "khoa_hoc", data.id, { trang_thai });
    lamMoi();
    return thanhCong(data);
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

export async function capNhatKhoaHoc(id: unknown, dauVao: unknown, mucDich: MucDich): Promise<KetQua<{ trang_thai: string }>> {
  try {
    const p = await canPhien(["chef", "admin"]);
    if (!p.ok) return p.loi;
    const idKh = idUuid.parse(id);
    const d = khoaHocSchema.parse(dauVao);

    const { data: cu } = await p.supabase.from("khoa_hoc").select("trang_thai, dau_bep_id").eq("id", idKh).maybeSingle();
    if (!cu) return thatBai(t("loi.khong_tim_thay"));
    if (cu.dau_bep_id !== p.user.id && p.vaiTro !== "admin") return thatBai(t("loi.khong_co_quyen"));

    // Mặc định giữ nguyên trạng thái; chỉ khi "gửi" và chưa xuất bản mới đổi
    let trang_thai = cu.trang_thai;
    if (mucDich === "gui" && cu.trang_thai !== "xuat_ban") {
      trang_thai = p.vaiTro === "admin" ? "xuat_ban" : "cho_duyet";
    }

    const { error } = await p.supabase.from("khoa_hoc").update({ ...duLieuKhoaHoc(d), trang_thai }).eq("id", idKh);
    if (error) throw error;

    await ghiNhatKy(p.supabase, p.user.id, "sua_khoa_hoc", "khoa_hoc", idKh, { trang_thai });
    lamMoi();
    return thanhCong({ trang_thai });
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

// Lưu trữ khóa học (ẩn khỏi trang công khai, học viên cũ vẫn giữ lịch sử)
export async function luuTruKhoaHoc(id: unknown): Promise<KetQua> {
  try {
    const p = await canPhien(["chef", "admin"]);
    if (!p.ok) return p.loi;
    const idKh = idUuid.parse(id);
    const { data, error } = await p.supabase
      .from("khoa_hoc").update({ trang_thai: "luu_tru" }).eq("id", idKh).select("id").maybeSingle();
    if (error) throw error;
    if (!data) return thatBai(t("loi.khong_co_quyen"));
    await ghiNhatKy(p.supabase, p.user.id, "luu_tru_khoa_hoc", "khoa_hoc", idKh);
    lamMoi();
    return thanhCong();
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

// Đăng ký khóa MIỄN PHÍ. Khóa trả phí chỉ được ghi danh sau thanh toán (server/IPN)
export async function dangKyMienPhi(khoaHocId: unknown): Promise<KetQua> {
  try {
    const p = await canPhien();
    if (!p.ok) return p.loi;
    const { error } = await p.supabase
      .from("dang_ky_khoa_hoc")
      .insert({ nguoi_dung_id: p.user.id, khoa_hoc_id: idUuid.parse(khoaHocId) });
    if (error) {
      if (error.code === "23505") return thanhCong(); // đã đăng ký rồi
      if (error.code === "42501") return thatBai(t("hanh_dong.khong_dang_ky_duoc")); // RLS: không miễn phí/chưa xuất bản
      throw error;
    }
    await ghiNhatKy(p.supabase, p.user.id, "dang_ky_khoa_hoc", "khoa_hoc", String(khoaHocId));
    revalidatePath("/khoa-hoc-cua-toi");
    revalidatePath("/bang-dieu-khien");
    return thanhCong();
  } catch (e) {
    return chuanHoaLoi(e);
  }
}