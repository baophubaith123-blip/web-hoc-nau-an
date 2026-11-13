// Tải dữ liệu cho Cokba từ Supabase (Đợt 2) — file DUY NHẤT trong
// src/lib/tro-ly/ không thuần: chạy phía server, đọc đúng 4 miền nội dung
// công khai của web. Các module còn lại nhận DuLieuTroLy qua tham số.
//
// Quy ước lấy dữ liệu (khớp các trang công khai hiện tại của dự án):
//   - cong_thuc / khoa_hoc / bai_viet: chỉ trạng thái "xuat_ban";
//     cong_thuc thêm điều kiện deleted_at IS NULL.
//   - Chỉ lấy các trường Cokba cần, không lấy dữ liệu nhạy cảm.
//   - Đầu bếp: profiles vai trò "chef" — trang /dau-bep của dự án đã phải
//     dùng admin client vì RLS của profiles chỉ cho đọc hồ sơ của chính
//     mình; ở đây cũng dùng admin client nhưng CHỈ select các trường công
//     khai (id, ho_ten, avatar_url, bio).

import "server-only";

import { taoSupabaseAdmin } from "@/lib/supabase/admin";
import { taoSupabaseServer } from "@/lib/supabase/server";
import type {
  BaiHocTroLy,
  BuocNauMon,
  DuLieuTroLy,
  NguyenLieuMon,
} from "./kieu-du-lieu";

function parseNguyenLieu(giaTri: unknown): NguyenLieuMon[] {
  if (!Array.isArray(giaTri)) return [];
  return giaTri
    .filter(
      (m): m is { ten: string; so_luong: number; don_vi: string } =>
        !!m &&
        typeof m === "object" &&
        typeof (m as { ten?: unknown }).ten === "string" &&
        typeof (m as { so_luong?: unknown }).so_luong === "number" &&
        typeof (m as { don_vi?: unknown }).don_vi === "string"
    )
    .map((m) => ({ ten: m.ten, so_luong: m.so_luong, don_vi: m.don_vi }));
}

function parseCacBuoc(giaTri: unknown): BuocNauMon[] {
  if (!Array.isArray(giaTri)) return [];
  return giaTri
    .filter(
      (b): b is { thu_tu: number; noi_dung: string; anh?: string | null } =>
        !!b &&
        typeof b === "object" &&
        typeof (b as { thu_tu?: unknown }).thu_tu === "number" &&
        typeof (b as { noi_dung?: unknown }).noi_dung === "string"
    )
    .map((b) => ({ thu_tu: b.thu_tu, noi_dung: b.noi_dung, anh: b.anh ?? null }))
    .sort((a, b) => a.thu_tu - b.thu_tu);
}

export async function taiDuLieuTroLy(): Promise<DuLieuTroLy> {
  const supabase = await taoSupabaseServer();

  const [ctRes, dmRes, khRes, bhRes, bvRes] = await Promise.all([
    supabase
      .from("cong_thuc")
      .select(
        "id, tieu_de, slug, mo_ta, nguyen_lieu, cac_buoc, thoi_gian_chuan_bi, thoi_gian_nau, khau_phan, do_kho, anh_dai_dien, calories, tac_gia_id"
      )
      .eq("trang_thai", "xuat_ban")
      .is("deleted_at", null),
    supabase
      .from("cong_thuc_danh_muc")
      .select("cong_thuc_id, danh_muc:danh_muc(ten, slug)"),
    supabase
      .from("khoa_hoc")
      .select(
        "id, tieu_de, slug, mo_ta, mo_ta_chi_tiet, anh_dai_dien, cap_do, gia, mien_phi, dau_bep_id, tong_thoi_gian, so_bai_hoc"
      )
      .eq("trang_thai", "xuat_ban"),
    supabase
      .from("bai_hoc")
      .select("id, khoa_hoc_id, tieu_de, mo_ta, thoi_gian_phut, thu_tu, xem_truoc")
      .order("thu_tu", { ascending: true }),
    supabase
      .from("bai_viet")
      .select("id, tieu_de, slug, tom_tat, noi_dung, anh_dai_dien, tac_gia_id, danh_muc")
      .eq("trang_thai", "xuat_ban"),
  ]);

  // Danh mục theo từng công thức
  const dmTheoMon = new Map<string, { ten: string[]; slug: string[] }>();
  for (const dong of dmRes.data ?? []) {
    const dm = (dong as { danh_muc?: { ten: string; slug: string } | null }).danh_muc;
    if (!dm) continue;
    const cur = dmTheoMon.get(dong.cong_thuc_id) ?? { ten: [], slug: [] };
    cur.ten.push(dm.ten);
    cur.slug.push(dm.slug);
    dmTheoMon.set(dong.cong_thuc_id, cur);
  }

  // Bài học nhóm theo khóa
  const baiTheoKhoa = new Map<string, BaiHocTroLy[]>();
  for (const bh of bhRes.data ?? []) {
    const ds = baiTheoKhoa.get(bh.khoa_hoc_id) ?? [];
    ds.push({
      id: bh.id,
      tieu_de: bh.tieu_de,
      mo_ta: bh.mo_ta,
      thoi_gian_phut: bh.thoi_gian_phut,
      thu_tu: bh.thu_tu,
      xem_truoc: bh.xem_truoc,
    });
    baiTheoKhoa.set(bh.khoa_hoc_id, ds);
  }

  // Đầu bếp: admin client, chỉ trường công khai (xem ghi chú đầu file).
  let dauBep: DuLieuTroLy["dauBep"] = [];
  try {
    const admin = taoSupabaseAdmin();
    const { data } = await admin
      .from("profiles")
      .select("id, ho_ten, avatar_url, bio")
      .eq("vai_tro", "chef")
      .eq("trang_thai", "hoat_dong");
    dauBep = (data ?? []).map((p) => ({
      id: p.id,
      ho_ten: p.ho_ten ?? "Đầu bếp",
      avatar_url: p.avatar_url,
      bio: p.bio,
    }));
  } catch (loi) {
    // Thiếu cấu hình service role -> Cokba vẫn trả lời 3 miền còn lại.
    console.error("[Cokba] Không tải được danh sách đầu bếp:", loi);
  }

  return {
    congThuc: (ctRes.data ?? []).map((ct) => {
      const dm = dmTheoMon.get(ct.id) ?? { ten: [], slug: [] };
      return {
        id: ct.id,
        tieu_de: ct.tieu_de,
        slug: ct.slug,
        mo_ta: ct.mo_ta,
        nguyen_lieu: parseNguyenLieu(ct.nguyen_lieu),
        cac_buoc: parseCacBuoc(ct.cac_buoc),
        thoi_gian_chuan_bi: ct.thoi_gian_chuan_bi,
        thoi_gian_nau: ct.thoi_gian_nau,
        khau_phan: ct.khau_phan,
        do_kho: ct.do_kho,
        anh_dai_dien: ct.anh_dai_dien,
        calories: ct.calories,
        tac_gia_id: ct.tac_gia_id,
        danh_muc: dm.ten,
        danh_muc_slug: dm.slug,
      };
    }),
    khoaHoc: (khRes.data ?? []).map((kh) => ({
      id: kh.id,
      tieu_de: kh.tieu_de,
      slug: kh.slug,
      mo_ta: kh.mo_ta,
      mo_ta_chi_tiet: kh.mo_ta_chi_tiet,
      anh_dai_dien: kh.anh_dai_dien,
      cap_do: kh.cap_do,
      gia: kh.gia,
      mien_phi: kh.mien_phi,
      dau_bep_id: kh.dau_bep_id,
      tong_thoi_gian: kh.tong_thoi_gian,
      so_bai_hoc: kh.so_bai_hoc,
      bai_hoc: baiTheoKhoa.get(kh.id) ?? [],
    })),
    baiViet: (bvRes.data ?? []).map((bv) => ({
      id: bv.id,
      tieu_de: bv.tieu_de,
      slug: bv.slug,
      tom_tat: bv.tom_tat,
      noi_dung: bv.noi_dung,
      anh_dai_dien: bv.anh_dai_dien,
      tac_gia_id: bv.tac_gia_id,
      danh_muc: bv.danh_muc,
    })),
    dauBep,
  };
}
