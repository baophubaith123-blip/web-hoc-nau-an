import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { BookOpen, Calendar, Eye, Newspaper, LibraryBig } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { taoSupabaseServer } from "@/lib/supabase/server";
import { TieuDeTrang } from "@/components/layout/tieu-de-trang";
import { TrangThaiTrong } from "@/components/layout/trang-thai-trong";
import { HienDan } from "@/components/trang-chu/hien-dan";

export const metadata: Metadata = {
  title: "Bài viết ẩm thực",
  description:
    "Mẹo bếp, kinh nghiệm chọn nguyên liệu và câu chuyện ẩm thực từ cộng đồng Học Nấu Ăn và các đầu bếp.",
};

export default async function DanhSachBaiViet() {
  const supabase = await taoSupabaseServer();

  const { data: danhSach } = await supabase
    .from("bai_viet")
    .select("*, tac_gia:profiles(ho_ten, avatar_url)")
    .eq("trang_thai", "xuat_ban")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8 pb-16">
      <TieuDeTrang
        icon={Newspaper}
        tieuDe="Bài viết & Cẩm nang ẩm thực"
        moTa="Kiến thức nấu ăn chuyên sâu, mẹo chọn và bảo quản thực phẩm, cùng văn hóa ẩm thực bốn phương — đọc để mỗi bữa ăn ngon và lành hơn."
      >
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
          {(danhSach || []).length} bài viết đang có
        </span>
      </TieuDeTrang>

      {(danhSach || []).length === 0 ? (
        <TrangThaiTrong
          icon={LibraryBig}
          tieuDe="Chưa có bài viết nào"
          moTa="Các bài cẩm nang ẩm thực đang được biên soạn. Bạn quay lại sau ít lâu nhé!"
        />
      ) : (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {(danhSach || []).map((bv, i) => (
          <HienDan key={bv.id} tre={(i % 3) * 70} className="h-full">
          <Card
            className="group h-full overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-xl"
          >
            <Link href={`/bai-viet/${bv.slug}`} className="block">
              <div className="relative aspect-16/9 w-full bg-muted overflow-hidden">
                {bv.anh_dai_dien ? (
                  <Image
                    src={bv.anh_dai_dien}
                    alt={bv.tieu_de}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                    <BookOpen className="h-10 w-10" />
                  </div>
                )}
                {bv.danh_muc && (
                  <span className="absolute left-3 top-3 rounded-md bg-background/85 px-2 py-0.5 text-xs font-medium text-foreground backdrop-blur-md">
                    {bv.danh_muc}
                  </span>
                )}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/45 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>

              <CardContent className="p-5 space-y-3">
                <h3 className="line-clamp-2 text-base font-bold text-foreground group-hover:text-primary transition-colors">
                  {bv.tieu_de}
                </h3>

                {bv.tom_tat && (
                  <p className="line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                    {bv.tom_tat}
                  </p>
                )}

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{new Date(bv.created_at).toLocaleDateString("vi-VN")}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Eye className="h-3.5 w-3.5" />
                    <span>{bv.luot_xem || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>
          </HienDan>
        ))}
      </div>
      )}
    </div>
  );
}
