"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { canPhien, ghiNhatKy, rongThanhNull } from "@/lib/actions/chung";
import { taoSupabaseAdmin } from "@/lib/supabase/admin";
import { baiHocSchema } from "@/lib/validations/khoa-hoc";
import { idUuid } from "@/lib/validations/chung";
import { chuanHoaLoi, thanhCong, thatBai, type KetQua } from "@/lib/utils/phan-hoi-loi";
import { t } from "@/lib/i18n/config";
import { guiEmailChungChi } from "@/lib/email/gui-email";
import type { Json } from "@/types/database";
import type { BaiTap } from "@/types";

const lamMoiKhoa = (khoaHocId: string) => {
  revalidatePath(`/bep/khoa-hoc/${khoaHocId}/bai-hoc`);
  revalidatePath("/khoa-hoc");
};

// Tạo (id = null) hoặc cập nhật bài học. Quyền do RLS: chef chủ khóa hoặc admin
export async function luuBaiHoc(id: string | null, dauVao: unknown): Promise<KetQua<{ id: string }>> {
  try {
    const p = await canPhien(["chef", "admin"]);
    if (!p.ok) return p.loi;
    const d = baiHocSchema.parse(dauVao);

    const { data: kh } = await p.supabase
      .from("khoa_hoc").select("id, co_tai_lieu, co_bai_tap").eq("id", d.khoa_hoc_id).maybeSingle();
    if (!kh) return thatBai(t("loi.khong_tim_thay"));

    // Quyền lợi theo gói: khóa không có tài liệu/bài tập thì không lưu 2 mục này
    const dong = {
      khoa_hoc_id: d.khoa_hoc_id,
      tieu_de: d.tieu_de,
      mo_ta: rongThanhNull(d.mo_ta),
      video_url: rongThanhNull(d.video_url),
      tai_lieu: (kh.co_tai_lieu ? d.tai_lieu : []) as unknown as Json,
      bai_tap: (kh.co_bai_tap ? d.bai_tap : []) as unknown as Json,
      thoi_gian_phut: d.thoi_gian_phut,
      thu_tu: d.thu_tu,
      xem_truoc: d.xem_truoc,
    };

    if (id) {
      const idBh = idUuid.parse(id);
      const { data, error } = await p.supabase.from("bai_hoc").update(dong).eq("id", idBh).select("id").maybeSingle();
      if (error) throw error;
      if (!data) return thatBai(t("loi.khong_co_quyen"));
      lamMoiKhoa(d.khoa_hoc_id);
      return thanhCong({ id: data.id });
    }

    const { data, error } = await p.supabase.from("bai_hoc").insert(dong).select("id").single();
    if (error) throw error;
    await ghiNhatKy(p.supabase, p.user.id, "tao_bai_hoc", "bai_hoc", data.id);
    lamMoiKhoa(d.khoa_hoc_id);
    return thanhCong({ id: data.id });
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

export async function xoaBaiHoc(id: unknown): Promise<KetQua> {
  try {
    const p = await canPhien(["chef", "admin"]);
    if (!p.ok) return p.loi;
    const { data, error } = await p.supabase
      .from("bai_hoc").delete().eq("id", idUuid.parse(id)).select("khoa_hoc_id").maybeSingle();
    if (error) throw error;
    if (!data) return thatBai(t("loi.khong_co_quyen"));
    await ghiNhatKy(p.supabase, p.user.id, "xoa_bai_hoc", "bai_hoc", String(id));
    lamMoiKhoa(data.khoa_hoc_id);
    return thanhCong();
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

// Sắp xếp lại: nhận danh sách id theo thứ tự mới
export async function sapXepBaiHoc(khoaHocId: unknown, danhSachId: unknown): Promise<KetQua> {
  try {
    const p = await canPhien(["chef", "admin"]);
    if (!p.ok) return p.loi;
    const idKh = idUuid.parse(khoaHocId);
    const ids = z.array(idUuid).max(200).parse(danhSachId);
    const kq = await Promise.all(
      ids.map((id, i) => p.supabase.from("bai_hoc").update({ thu_tu: i + 1 }).eq("id", id).eq("khoa_hoc_id", idKh))
    );
    const loi = kq.find((r) => r.error)?.error;
    if (loi) throw loi;
    lamMoiKhoa(idKh);
    return thanhCong();
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

// Đánh dấu hoàn thành / bỏ hoàn thành. Trigger DB tự tính phần trăm tiến độ
export async function hoanThanhBai(baiHocId: unknown, hoanThanh = true): Promise<KetQua<{ phan_tram: number; hoan_thanh_khoa: boolean }>> {
  try {
    const p = await canPhien();
    if (!p.ok) return p.loi;
    const idBh = idUuid.parse(baiHocId);

    // RLS chỉ trả bài học khi có quyền học
    const { data: bh } = await p.supabase.from("bai_hoc").select("khoa_hoc_id").eq("id", idBh).maybeSingle();
    if (!bh) return thatBai(t("loi.khong_co_quyen"));

    const { error } = await p.supabase.from("tien_do_bai_hoc").upsert(
      {
        nguoi_dung_id: p.user.id, bai_hoc_id: idBh, hoan_thanh: hoanThanh,
        ngay_hoan_thanh: hoanThanh ? new Date().toISOString() : null,
      },
      { onConflict: "nguoi_dung_id,bai_hoc_id" }
    );
    if (error) throw error;

    const { data: dk } = await p.supabase
      .from("dang_ky_khoa_hoc").select("phan_tram_tien_do")
      .eq("nguoi_dung_id", p.user.id).eq("khoa_hoc_id", bh.khoa_hoc_id).maybeSingle();
    const phan_tram = dk?.phan_tram_tien_do ?? 0;

    revalidatePath("/khoa-hoc-cua-toi");
    revalidatePath("/bang-dieu-khien");
    return thanhCong({ phan_tram, hoan_thanh_khoa: phan_tram === 100 });
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

// Chấm điểm bài tập (chỉ khóa trả phí có bài tập). Không lưu điểm vì schema chưa có bảng bài nộp
export async function nopBaiTap(baiHocId: unknown, dapAn: unknown): Promise<
  KetQua<{ diem: number; tong: number; chi_tiet: { dung: boolean; dap_an_dung: number }[] }>
> {
  try {
    const p = await canPhien();
    if (!p.ok) return p.loi;
    const idBh = idUuid.parse(baiHocId);
    const traLoi = z.array(z.number().int().min(-1)).max(50).parse(dapAn);

    const { data: bh } = await p.supabase.from("bai_hoc").select("bai_tap, khoa_hoc_id").eq("id", idBh).maybeSingle();
    if (!bh) return thatBai(t("loi.khong_tim_thay"));

    const { data: coQuyen } = await p.supabase.rpc("co_quyen_hoc", { p_id: bh.khoa_hoc_id });
    if (!coQuyen) return thatBai(t("loi.khong_co_quyen"));

    const { data: kh } = await p.supabase.from("khoa_hoc").select("co_bai_tap").eq("id", bh.khoa_hoc_id).maybeSingle();
    const baiTap = (bh.bai_tap ?? []) as unknown as BaiTap[];
    if (!kh?.co_bai_tap || baiTap.length === 0) return thatBai(t("hanh_dong.khong_co_bai_tap"));

    let diem = 0;
    let tong = 0;
    const chi_tiet = baiTap.map((c, i) => {
      tong += c.diem;
      const dung = traLoi[i] === c.dap_an_dung;
      if (dung) diem += c.diem;
      return { dung, dap_an_dung: c.dap_an_dung };
    });
    return thanhCong({ diem, tong, chi_tiet });
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

// Cấp chứng chỉ: phải hoàn thành 100%, khóa trả phí, có bật chứng chỉ
export async function capChungChi(khoaHocId: unknown): Promise<KetQua<{ ma_chung_chi: string }>> {
  try {
    const p = await canPhien();
    if (!p.ok) return p.loi;
    const idKh = idUuid.parse(khoaHocId);

    const { data: daCo } = await p.supabase
      .from("chung_chi").select("ma_chung_chi").eq("nguoi_dung_id", p.user.id).eq("khoa_hoc_id", idKh).maybeSingle();
    if (daCo) return thanhCong({ ma_chung_chi: daCo.ma_chung_chi });

    const [{ data: dk }, { data: kh }] = await Promise.all([
      p.supabase.from("dang_ky_khoa_hoc").select("phan_tram_tien_do, da_thanh_toan")
        .eq("nguoi_dung_id", p.user.id).eq("khoa_hoc_id", idKh).maybeSingle(),
      p.supabase.from("khoa_hoc").select("tieu_de, co_chung_chi").eq("id", idKh).maybeSingle(),
    ]);
    if (!dk || !kh) return thatBai(t("loi.khong_tim_thay"));
    if (!kh.co_chung_chi || !dk.da_thanh_toan) return thatBai(t("hanh_dong.khong_co_chung_chi"));
    if (dk.phan_tram_tien_do < 100) return thatBai(t("hanh_dong.chua_hoan_thanh_khoa"));

    // Chỉ server (service role) mới được ghi bảng chung_chi
    const admin = taoSupabaseAdmin();
    const ma = "CC-" + crypto.randomUUID().replace(/-/g, "").slice(0, 10).toUpperCase();
    const { error } = await admin.from("chung_chi").insert({ nguoi_dung_id: p.user.id, khoa_hoc_id: idKh, ma_chung_chi: ma });
    if (error) {
      if (error.code === "23505") {
        // Bấm 2 lần cùng lúc: lấy chứng chỉ đã tạo
        const { data } = await admin.from("chung_chi").select("ma_chung_chi")
          .eq("nguoi_dung_id", p.user.id).eq("khoa_hoc_id", idKh).single();
        return thanhCong({ ma_chung_chi: data?.ma_chung_chi ?? ma });
      }
      throw error;
    }

    await admin.from("thong_bao").insert({
      nguoi_dung_id: p.user.id, tieu_de: t("hanh_dong.tb_chung_chi"),
      noi_dung: t("hanh_dong.tb_chung_chi_nd", { ma }), loai: "chung_chi", lien_ket: "/khoa-hoc-cua-toi",
    });
    await ghiNhatKy(p.supabase, p.user.id, "nhan_chung_chi", "chung_chi", ma);
    if (p.user.email) {
      await guiEmailChungChi({
        den: p.user.email, ten: p.profile.ho_ten ?? "bạn", khoaHoc: kh.tieu_de, maChungChi: ma,
      }).catch((e: unknown) => console.error("[EMAIL CHUNG CHI]", e));
    }
    revalidatePath("/khoa-hoc-cua-toi");
    return thanhCong({ ma_chung_chi: ma });
  } catch (e) {
    return chuanHoaLoi(e);
  }
}