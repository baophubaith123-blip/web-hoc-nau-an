import Link from "next/link";
import type { Metadata } from "next";
import { TheKhoaHoc } from "@/components/khoa-hoc/the-khoa-hoc";
import { taoSupabaseServer } from "@/lib/supabase/server";
import { GraduationCap, SearchX } from "lucide-react";
import { TieuDeTrang } from "@/components/layout/tieu-de-trang";
import { TrangThaiTrong } from "@/components/layout/trang-thai-trong";
import { HienDan } from "@/components/trang-chu/hien-dan";

interface Props {
  searchParams: Promise<{ [khoa: string]: string | string[] | undefined }>;
}

export const metadata: Metadata = {
  title: "Khóa học nấu ăn",
  description:
    "Các khóa học nấu ăn có lộ trình bài bản, video hướng dẫn và bài kiểm tra — học từ cơ bản đến nâng cao cùng đầu bếp chuyên nghiệp.",
};

export default async function DanhSachKhoaHoc({ searchParams }: Props) {
  const params = await searchParams;
  const capDo = typeof params.cap_do === "string" ? params.cap_do : "tat_ca";
  const loaiGia = typeof params.loai_gia === "string" ? params.loai_gia : "tat_ca";

  const supabase = await taoSupabaseServer();

  let query = supabase
    .from("khoa_hoc")
    .select("*, dau_bep:profiles(ho_ten, avatar_url)")
    .eq("trang_thai", "xuat_ban")
    .order("created_at", { ascending: false });

  if (capDo && capDo !== "tat_ca") {
    query = query.eq("cap_do", capDo as "co_ban" | "trung_cap" | "nang_cao");
  }

  if (loaiGia === "mien_phi") {
    query = query.eq("mien_phi", true);
  } else if (loaiGia === "tra_phi") {
    query = query.eq("mien_phi", false);
  }

  const { data: danhSach } = await query;

  return (
    <div className="space-y-8 pb-16">
      <TieuDeTrang
        icon={GraduationCap}
        tieuDe="Khóa học nấu ăn"
        moTa="Nâng cao kỹ năng làm bếp từ cơ bản đến chuyên nghiệp qua các khóa học video thực tế, có bài tập chấm điểm và chứng chỉ hoàn thành."
      >
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
          {(danhSach || []).length} khóa học đang mở
        </span>
      </TieuDeTrang>

      {/* Bộ lọc nhanh theo thẻ */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border bg-card/60 p-4 text-xs shadow-xs">
        <span className="font-semibold text-muted-foreground mr-2">Cấp độ:</span>
        <Link
          href="/khoa-hoc"
          className={`rounded-full px-3 py-1 font-medium transition-colors ${
            capDo === "tat_ca" ? "bg-primary text-primary-foreground" : "border bg-card text-foreground shadow-xs transition-all hover:border-primary/40 hover:text-primary"
          }`}
        >
          Tất cả
        </Link>
        <Link
          href="/khoa-hoc?cap_do=co_ban"
          className={`rounded-full px-3 py-1 font-medium transition-colors ${
            capDo === "co_ban" ? "bg-primary text-primary-foreground" : "border bg-card text-foreground shadow-xs transition-all hover:border-primary/40 hover:text-primary"
          }`}
        >
          Cơ bản
        </Link>
        <Link
          href="/khoa-hoc?cap_do=trung_cap"
          className={`rounded-full px-3 py-1 font-medium transition-colors ${
            capDo === "trung_cap" ? "bg-primary text-primary-foreground" : "border bg-card text-foreground shadow-xs transition-all hover:border-primary/40 hover:text-primary"
          }`}
        >
          Trung cấp
        </Link>
        <Link
          href="/khoa-hoc?cap_do=nang_cao"
          className={`rounded-full px-3 py-1 font-medium transition-colors ${
            capDo === "nang_cao" ? "bg-primary text-primary-foreground" : "border bg-card text-foreground shadow-xs transition-all hover:border-primary/40 hover:text-primary"
          }`}
        >
          Chuyên nghiệp
        </Link>

        <span className="font-semibold text-muted-foreground ml-4 mr-2">Học phí:</span>
        <Link
          href="/khoa-hoc?loai_gia=mien_phi"
          className={`rounded-full px-3 py-1 font-medium transition-colors ${
            loaiGia === "mien_phi" ? "bg-primary text-primary-foreground" : "border bg-card text-foreground shadow-xs transition-all hover:border-primary/40 hover:text-primary"
          }`}
        >
          Miễn phí
        </Link>
        <Link
          href="/khoa-hoc?loai_gia=tra_phi"
          className={`rounded-full px-3 py-1 font-medium transition-colors ${
            loaiGia === "tra_phi" ? "bg-primary text-primary-foreground" : "border bg-card text-foreground shadow-xs transition-all hover:border-primary/40 hover:text-primary"
          }`}
        >
          Có phí
        </Link>
      </div>

      {/* Grid danh sách */}
      {danhSach && danhSach.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {danhSach.map((kh, i) => (
            <HienDan key={kh.id} tre={(i % 3) * 70} className="h-full">
              <TheKhoaHoc khoaHoc={kh} />
            </HienDan>
          ))}
        </div>
      ) : (
        <TrangThaiTrong
          icon={SearchX}
          tieuDe="Chưa có khóa học nào theo tiêu chí này"
          moTa="Vui lòng chọn tiêu chí lọc khác để khám phá thêm các khóa học đang mở."
        />
      )}
    </div>
  );
}
