import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  BuoiNau,
  type MonGoiY,
  type MonNau,
} from "@/components/tro-ly/buoi-nau";
import { layPhienHienTai, taoSupabaseServer } from "@/lib/supabase/server";
import type { BuocNauMon, NguyenLieuMon } from "@/lib/tro-ly/kieu-du-lieu";

// Chế độ nấu rảnh tay (Đợt 4 — Cokba): trang server tra công thức theo
// SLUG, chỉ trạng thái xuất bản (cùng quy ước với tai-du-lieu.ts và
// trang /cong-thuc/[slug]); không thấy -> notFound như lệ dự án.
// Gợi ý cuối buổi: công thức xuất bản CÙNG DANH MỤC, khác món hiện
// tại, tối đa 3 — truy vấn nhẹ qua bảng nối cong_thuc_danh_muc.

interface Props {
  params: Promise<{ slug: string }>;
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await taoSupabaseServer();
  const { data } = await supabase
    .from("cong_thuc")
    .select("tieu_de, mo_ta")
    .eq("slug", slug)
    .eq("trang_thai", "xuat_ban")
    .is("deleted_at", null)
    .maybeSingle();
  if (!data) return { title: "Nấu rảnh tay" };
  return {
    title: `Nấu rảnh tay: ${data.tieu_de}`,
    description:
      data.mo_ta ??
      `Nấu món ${data.tieu_de} từng bước với đồng hồ hẹn giờ và đọc bước bằng giọng nói — chế độ nấu rảnh tay của Học Nấu Ăn.`,
  };
}

export default async function TrangNauRanhTay({ params }: Props) {
  const { slug } = await params;
  const supabase = await taoSupabaseServer();

  const { data: ct, error } = await supabase
    .from("cong_thuc")
    .select(
      "id, tieu_de, slug, nguyen_lieu, cac_buoc, thoi_gian_chuan_bi, thoi_gian_nau, khau_phan, do_kho, anh_dai_dien"
    )
    .eq("slug", slug)
    .eq("trang_thai", "xuat_ban")
    .is("deleted_at", null)
    .maybeSingle();

  if (error || !ct) {
    notFound();
  }

  const phien = await layPhienHienTai();

  // Gợi ý món cùng danh mục (nhẹ, bọc lỗi: hỏng gợi ý không hỏng buổi nấu).
  let goiY: MonGoiY[] = [];
  try {
    const { data: dmLinks } = await supabase
      .from("cong_thuc_danh_muc")
      .select("danh_muc_id")
      .eq("cong_thuc_id", ct.id);
    const dmIds = (dmLinks ?? []).map((d) => d.danh_muc_id);
    if (dmIds.length > 0) {
      const { data: links } = await supabase
        .from("cong_thuc_danh_muc")
        .select("cong_thuc_id")
        .in("danh_muc_id", dmIds)
        .neq("cong_thuc_id", ct.id);
      const ids = Array.from(
        new Set((links ?? []).map((l) => l.cong_thuc_id))
      ).slice(0, 12);
      if (ids.length > 0) {
        const { data: monKhac } = await supabase
          .from("cong_thuc")
          .select(
            "slug, tieu_de, anh_dai_dien, thoi_gian_chuan_bi, thoi_gian_nau, do_kho"
          )
          .in("id", ids)
          .eq("trang_thai", "xuat_ban")
          .is("deleted_at", null)
          .limit(3);
        goiY = (monKhac ?? []).map((m) => ({
          slug: m.slug,
          tieu_de: m.tieu_de,
          anh_dai_dien: m.anh_dai_dien,
          thoi_gian_chuan_bi: m.thoi_gian_chuan_bi,
          thoi_gian_nau: m.thoi_gian_nau,
          do_kho: m.do_kho,
        }));
      }
    }
  } catch {
    goiY = [];
  }

  const mon: MonNau = {
    id: ct.id,
    slug: ct.slug,
    tieu_de: ct.tieu_de,
    anh_dai_dien: ct.anh_dai_dien,
    khau_phan: ct.khau_phan,
    thoi_gian_chuan_bi: ct.thoi_gian_chuan_bi,
    thoi_gian_nau: ct.thoi_gian_nau,
    do_kho: ct.do_kho,
    nguyen_lieu: parseNguyenLieu(ct.nguyen_lieu),
    cac_buoc: parseCacBuoc(ct.cac_buoc),
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 md:py-10">
      <BuoiNau mon={mon} goiY={goiY} nguoiDungId={phien?.user.id ?? null} />
    </div>
  );
}
