import Link from "next/link";
import type { Metadata } from "next";
import { TheCongThuc } from "@/components/cong-thuc/the-cong-thuc";
import { BoLocCongThuc } from "@/components/cong-thuc/bo-loc-cong-thuc";
import { Button } from "@/components/ui/button";
import { taoSupabaseServer } from "@/lib/supabase/server";
import { ChevronLeft, ChevronRight, Utensils, SearchX } from "lucide-react";
import { TieuDeTrang } from "@/components/layout/tieu-de-trang";
import { TrangThaiTrong } from "@/components/layout/trang-thai-trong";
import { HienDan } from "@/components/trang-chu/hien-dan";

interface Props {
  searchParams: Promise<{ [khoa: string]: string | string[] | undefined }>;
}

const SO_LUONG_MOI_TRANG = 12;

export const metadata: Metadata = {
  title: "Công thức nấu ăn",
  description:
    "Khám phá thư viện công thức nấu ăn chi tiết từng bước — món Việt truyền thống, món Á, món Âu và tráng miệng, có lọc theo danh mục và độ khó.",
};

export default async function DanhSachCongThuc({ searchParams }: Props) {
  const params = await searchParams;
  const tuKhoa = typeof params.tu_khoa === "string" ? params.tu_khoa.trim() : "";
  const danhMucSlug = typeof params.danh_muc === "string" ? params.danh_muc : "";
  const doKho = typeof params.do_kho === "string" ? params.do_kho : "";
  const sapXep = typeof params.sap_xep === "string" ? params.sap_xep : "moi_nhat";
  const trangHienTai = Math.max(1, parseInt(typeof params.trang === "string" ? params.trang : "1", 10) || 1);

  const supabase = await taoSupabaseServer();

  // Đợt 6 — tối ưu tốc độ: truy vấn danh mục và truy vấn công thức độc
  // lập nhau → chạy song song bằng Promise.all thay vì chờ tuần tự.
  // Đồng thời chỉ select các trường thẻ hiển thị (bỏ nguyen_lieu/cac_buoc).
  const truyVanDanhMuc = supabase
    .from("danh_muc")
    .select("*")
    .eq("trang_thai", "hoat_dong")
    .order("thu_tu", { ascending: true });

  // 2. Xây dựng truy vấn công thức
  let query = supabase
    .from("cong_thuc")
    .select(
      "id, slug, tieu_de, mo_ta, anh_dai_dien, thoi_gian_chuan_bi, thoi_gian_nau, do_kho, calories, luot_xem, noi_bat, tac_gia_la_pro, tac_gia:profiles(ho_ten, avatar_url)",
      { count: "exact" }
    )
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

  const [{ data: danhMucList }, { data: danhSach, count }] = await Promise.all([
    truyVanDanhMuc,
    query,
  ]);

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
      <TieuDeTrang
        icon={Utensils}
        tieuDe="Công thức nấu ăn"
        moTa="Khám phá các công thức chi tiết từng bước, nguyên liệu định lượng chuẩn và dễ tìm — xem là nấu được ngay cho bữa cơm gia đình."
      >
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
          {tongSo} công thức đang có
        </span>
      </TieuDeTrang>

      {/* Bộ lọc */}
      <BoLocCongThuc danhMucList={danhMucList || []} />

      {/* Danh sách */}
      {danhSach && danhSach.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {danhSach.map((ct, i) => (
            <HienDan key={ct.id} tre={(i % 4) * 70} className="h-full">
              <TheCongThuc congThuc={ct} />
            </HienDan>
          ))}
        </div>
      ) : (
        <TrangThaiTrong
          icon={SearchX}
          tieuDe="Không tìm thấy công thức nào phù hợp"
          moTa="Hãy thử tìm kiếm với từ khóa khác hoặc xóa bớt các tiêu chí lọc để xem thêm món ngon."
        />
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
