// Nạp DuLieuTroLy từ Supabase THẬT cho bộ chạy corpus Cokba (Đợt 5A).
//
// Vì sao không import trực tiếp src/lib/tro-ly/tai-du-lieu.ts?
// File đó import "server-only" và dùng Supabase server client gắn với
// cookie của request Next.js — không chạy được trong môi trường node test
// của Playwright (không có request). Do đó file này nạp SONG SONG: cùng
// bảng, cùng trường select, cùng bộ lọc (trang_thai = "xuat_ban",
// cong_thuc thêm deleted_at IS NULL) như tai-du-lieu.ts, chỉ khác client:
// dùng @supabase/supabase-js với service-role key đọc tại chỗ từ .env.local
// (key KHÔNG được in ra log, không chép đi nơi khác). Bài viết TEST_ vẫn
// nằm trong DuLieuTroLy.baiViet (đúng như tai-du-lieu.ts) và chỉ bị loại
// ở tầng chỉ mục (chi-muc.ts) — bộ chạy kiểm cả hai con số.

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import type {
  BaiHocTroLy,
  BuocNauMon,
  DuLieuTroLy,
  NguyenLieuMon,
} from "../../src/lib/tro-ly/kieu-du-lieu";

function docEnvLocal(): Record<string, string> {
  const env: Record<string, string> = {};
  const tho = readFileSync(join(process.cwd(), ".env.local"), "utf8");
  for (const dong of tho.split(/\r?\n/)) {
    const m = dong.match(/^\s*([^#=\s]+)\s*=\s*(.*)$/);
    if (m) env[m[1]] = m[2].trim();
  }
  return env;
}

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

export async function napDuLieuThat(): Promise<DuLieuTroLy> {
  const env = docEnvLocal();
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const khoa = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !khoa) {
    throw new Error("Thiếu NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY trong .env.local");
  }
  const supabase = createClient(url, khoa);

  const [ctRes, dmRes, khRes, bhRes, bvRes, dbRes] = await Promise.all([
    supabase
      .from("cong_thuc")
      .select(
        "id, tieu_de, slug, mo_ta, nguyen_lieu, cac_buoc, thoi_gian_chuan_bi, thoi_gian_nau, khau_phan, do_kho, anh_dai_dien, calories, tac_gia_id"
      )
      .eq("trang_thai", "xuat_ban")
      .is("deleted_at", null),
    supabase.from("cong_thuc_danh_muc").select("cong_thuc_id, danh_muc:danh_muc(ten, slug)"),
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
    supabase
      .from("profiles")
      .select("id, ho_ten, avatar_url, bio")
      .eq("vai_tro", "chef")
      .eq("trang_thai", "hoat_dong"),
  ]);

  for (const [ten, res] of [
    ["cong_thuc", ctRes],
    ["cong_thuc_danh_muc", dmRes],
    ["khoa_hoc", khRes],
    ["bai_hoc", bhRes],
    ["bai_viet", bvRes],
    ["profiles", dbRes],
  ] as const) {
    if (res.error) throw new Error(`Nạp ${ten} thất bại: ${res.error.message}`);
  }

  const dmTheoMon = new Map<string, { ten: string[]; slug: string[] }>();
  for (const dong of dmRes.data ?? []) {
    const dmTho = (dong as unknown as { danh_muc?: { ten: string; slug: string } | { ten: string; slug: string }[] | null }).danh_muc;
    const dm = Array.isArray(dmTho) ? dmTho[0] : dmTho;
    if (!dm) continue;
    const cur = dmTheoMon.get(dong.cong_thuc_id) ?? { ten: [], slug: [] };
    cur.ten.push(dm.ten);
    cur.slug.push(dm.slug);
    dmTheoMon.set(dong.cong_thuc_id, cur);
  }

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
    dauBep: (dbRes.data ?? []).map((p) => ({
      id: p.id,
      ho_ten: p.ho_ten ?? "Đầu bếp",
      avatar_url: p.avatar_url,
      bio: p.bio,
    })),
  };
}
