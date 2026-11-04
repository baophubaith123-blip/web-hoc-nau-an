import Link from "next/link";
import { TheKhoaHoc } from "@/components/khoa-hoc/the-khoa-hoc";
import { taoSupabaseServer } from "@/lib/supabase/server";

interface Props {
  searchParams: Promise<{ [khoa: string]: string | string[] | undefined }>;
}

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
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight">Khóa học nấu ăn</h1>
        <p className="text-sm text-muted-foreground">
          Nâng cao kỹ năng làm bếp từ cơ bản đến chuyên nghiệp qua các khóa học thực tế
        </p>
      </div>

      {/* Bộ lọc nhanh theo thẻ */}
      <div className="flex flex-wrap items-center gap-2 border-b pb-4 text-xs">
        <span className="font-semibold text-muted-foreground mr-2">Cấp độ:</span>
        <Link
          href="/khoa-hoc"
          className={`rounded-full px-3 py-1 font-medium transition-colors ${
            capDo === "tat_ca" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-muted/80"
          }`}
        >
          Tất cả
        </Link>
        <Link
          href="/khoa-hoc?cap_do=co_ban"
          className={`rounded-full px-3 py-1 font-medium transition-colors ${
            capDo === "co_ban" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-muted/80"
          }`}
        >
          Cơ bản
        </Link>
        <Link
          href="/khoa-hoc?cap_do=trung_cap"
          className={`rounded-full px-3 py-1 font-medium transition-colors ${
            capDo === "trung_cap" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-muted/80"
          }`}
        >
          Trung cấp
        </Link>
        <Link
          href="/khoa-hoc?cap_do=nang_cao"
          className={`rounded-full px-3 py-1 font-medium transition-colors ${
            capDo === "nang_cao" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-muted/80"
          }`}
        >
          Chuyên nghiệp
        </Link>

        <span className="font-semibold text-muted-foreground ml-4 mr-2">Học phí:</span>
        <Link
          href="/khoa-hoc?loai_gia=mien_phi"
          className={`rounded-full px-3 py-1 font-medium transition-colors ${
            loaiGia === "mien_phi" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-muted/80"
          }`}
        >
          Miễn phí
        </Link>
        <Link
          href="/khoa-hoc?loai_gia=tra_phi"
          className={`rounded-full px-3 py-1 font-medium transition-colors ${
            loaiGia === "tra_phi" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-muted/80"
          }`}
        >
          Có phí
        </Link>
      </div>

      {/* Grid danh sách */}
      {danhSach && danhSach.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {danhSach.map((kh) => (
            <TheKhoaHoc key={kh.id} khoaHoc={kh} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed p-16 text-center space-y-2">
          <p className="text-base font-semibold">Chưa có khóa học nào theo tiêu chí này</p>
          <p className="text-xs text-muted-foreground">Vui lòng chọn tiêu chí lọc khác</p>
        </div>
      )}
    </div>
  );
}
