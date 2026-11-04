import Link from "next/link";
import Image from "next/image";
import { BookOpen, Calendar, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { taoSupabaseServer } from "@/lib/supabase/server";

export default async function DanhSachBaiViet() {
  const supabase = await taoSupabaseServer();

  const { data: danhSach } = await supabase
    .from("bai_viet")
    .select("*, tac_gia:profiles(ho_ten, avatar_url)")
    .eq("trang_thai", "xuat_ban")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8 pb-16">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight">Bài viết & Cẩm nang ẩm thực</h1>
        <p className="text-sm text-muted-foreground">
          Chia sẻ kiến thức nấu ăn, mẹo bảo quản thực phẩm và văn hóa ẩm thực bốn phương
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {(danhSach || []).map((bv) => (
          <Card
            key={bv.id}
            className="group overflow-hidden rounded-2xl border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
          >
            <Link href={`/bai-viet/${bv.slug}`} className="block">
              <div className="relative aspect-16/9 w-full bg-muted overflow-hidden">
                {bv.anh_dai_dien ? (
                  <Image
                    src={bv.anh_dai_dien}
                    alt={bv.tieu_de}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                    <BookOpen className="h-10 w-10" />
                  </div>
                )}
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
        ))}
      </div>
    </div>
  );
}
