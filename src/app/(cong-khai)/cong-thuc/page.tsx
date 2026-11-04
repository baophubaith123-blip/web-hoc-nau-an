import Link from "next/link";
import { TheCongThuc } from "@/components/cong-thuc/the-cong-thuc";
import { BoLocCongThuc } from "@/components/cong-thuc/bo-loc-cong-thuc";
import { Button } from "@/components/ui/button";
import { taoSupabaseServer } from "@/lib/supabase/server";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  searchParams: Promise<{ [khoa: string]: string | string[] | undefined }>;
}

const SO_LUONG_MOI_TRANG = 12;

export default async function DanhSachCongThuc({ searchParams }: Props) {
  const params = await searchParams;
  const tuKhoa = typeof params.tu_khoa === "string" ? params.tu_khoa.trim() : "";
  const danhMucSlug = typeof params.danh_muc === "string" ? params.danh_muc : "";
  const doKho = typeof params.do_kho === "string" ? params.do_kho : "";
  const sapXep = typeof params.sap_xep === "string" ? params.sap_xep : "moi_nhat";
  const trangHienTai = Math.max(1, parseInt(typeof params.trang === "string" ? params.trang : "1", 10) || 1);

  const supabase = await taoSupabaseServer();

  // 1. Lấy danh mục cho bộ lọc
  const { data: danhMucList } = await supabase
    .from("danh_muc")
    .select("*")
    .eq("trang_thai", "hoat_dong")
    .order("thu_tu", { ascending: true });

  // 2. Xây dựng truy vấn công thức
  let query = supabase
    .from("cong_thuc")
    .select("*, tac_gia:profiles(ho_ten, avatar_url)", { count: "exact" })
    .eq("trang_thai", "xuat_ban")
    .is("deleted_at", null);

  if (tuKhoa) {
    query = query.ilike("tieu_de", `%${tuKhoa}%`);
  }

  if (doKho && doKho !== "tat_ca") {
    query = query.eq("do_kho", doKho as "de" | "trung_binh" | "kho");
  }

  // Sắp xếp
  if (sapXep === "xem_nhieu") {
    query = query.order("luot_xem", { ascending: false });
  } else if (sapXep === "thoi_gian_ngan") {
    query = query.order("thoi_gian_nau", { ascending: true });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  // Phân trang
  const from = (trangHienTai - 1) * SO_LUONG_MOI_TRANG;
  const to = from + SO_LUONG_MOI_TRANG - 1;
  query = query.range(from, to);

  const { data: danhSach, count } = await query;

  const tongSo = count || 0;
  const tongTrang = Math.ceil(tongSo / SO_LUONG_MOI_TRANG) || 1;

  const taoLinkTrang = (trangMoi: number) => {
    const p = new URLSearchParams();
    if (tuKhoa) p.set("tu_khoa", tuKhoa);
    if (danhMucSlug) p.set("danh_muc", danhMucSlug);
    if (doKho) p.set("do_kho", doKho);
    if (sapXep) p.set("sap_xep", sapXep);
    p.set("trang", trangMoi.toString());
    return `/cong-thuc?${p.toString()}`;
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight">Công thức nấu ăn</h1>
        <p className="text-sm text-muted-foreground">
          Khám phá hàng trăm công thức chi tiết, nguyên liệu dễ tìm cho bữa cơm gia đình
        </p>
      </div>

      {/* Bộ lọc */}
      <BoLocCongThuc danhMucList={danhMucList || []} />

      {/* Danh sách */}
      {danhSach && danhSach.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {danhSach.map((ct) => (
            <TheCongThuc key={ct.id} congThuc={ct} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed p-16 text-center space-y-3">
          <p className="text-base font-semibold">Không tìm thấy công thức nào phù hợp</p>
          <p className="text-xs text-muted-foreground">
            Hãy thử tìm kiếm với từ khóa khác hoặc xóa bớt các tiêu chí lọc
          </p>
        </div>
      )}

      {/* Phân trang */}
      {tongTrang > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <Button
            asChild
            variant="outline"
            size="sm"
            disabled={trangHienTai <= 1}
            className={trangHienTai <= 1 ? "pointer-events-none opacity-50" : ""}
          >
            <Link href={taoLinkTrang(trangHienTai - 1)}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Trang trước
            </Link>
          </Button>

          <span className="text-xs font-medium px-4 text-muted-foreground">
            Trang {trangHienTai} / {tongTrang}
          </span>

          <Button
            asChild
            variant="outline"
            size="sm"
            disabled={trangHienTai >= tongTrang}
            className={trangHienTai >= tongTrang ? "pointer-events-none opacity-50" : ""}
          >
            <Link href={taoLinkTrang(trangHienTai + 1)}>
              Trang sau
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
