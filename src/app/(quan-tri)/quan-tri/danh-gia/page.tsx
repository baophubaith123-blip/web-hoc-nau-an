import Link from "next/link";
import { yeuCauVaiTro, taoSupabaseServer } from "@/lib/supabase/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, ExternalLink } from "lucide-react";
import { dinhDangTuongDoi } from "@/lib/utils/dinh-dang";
import { XoaDanhGiaNut } from "./xoa-danh-gia-nut";

export default async function QuanLyDanhGiaPage() {
  await yeuCauVaiTro(["admin"]);
  const supabase = await taoSupabaseServer();

  const { data: danhSachDanhGia } = await supabase
    .from("danh_gia")
    .select("*, nguoi_dung:profiles!danh_gia_nguoi_dung_id_fkey(ho_ten, username, avatar_url), cong_thuc:cong_thuc!danh_gia_cong_thuc_id_fkey(tieu_de, slug)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Quản Lý Đánh Giá Sao</h1>
        <p className="text-sm text-muted-foreground">
          Theo dõi mức độ hài lòng và nhận xét của học viên đối với các công thức món ăn
        </p>
      </div>

      {!danhSachDanhGia || danhSachDanhGia.length === 0 ? (
        <div className="text-center py-16 border rounded-2xl bg-card">
          <Star className="w-12 h-12 mx-auto text-muted-foreground/30 mb-2" />
          <p className="text-sm text-muted-foreground">Chưa có đánh giá nào.</p>
        </div>
      ) : (
        <div className="border rounded-2xl divide-y bg-card overflow-hidden shadow-xs">
          {danhSachDanhGia.map((dg: any) => (
            <div
              key={dg.id}
              className="p-4 flex flex-col sm:flex-row items-start justify-between gap-4 hover:bg-muted/40 transition-colors"
            >
              <div className="flex items-start gap-3 flex-1">
                <Avatar className="h-9 w-9 mt-0.5">
                  <AvatarImage src={dg.nguoi_dung?.avatar_url || undefined} />
                  <AvatarFallback>{(dg.nguoi_dung?.ho_ten || "U")[0]}</AvatarFallback>
                </Avatar>

                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-sm">
                      {dg.nguoi_dung?.ho_ten || "Thành viên"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      @{dg.nguoi_dung?.username || "an_danh"}
                    </span>
                    <span className="text-xs text-muted-foreground">• {dinhDangTuongDoi(dg.created_at)}</span>
                    <div className="flex items-center gap-0.5 ml-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < dg.diem
                              ? "text-amber-500 fill-amber-500"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {dg.nhan_xet && (
                    <p className="text-sm text-foreground">{dg.nhan_xet}</p>
                  )}

                  {dg.cong_thuc && (
                    <div className="pt-1">
                      <Link
                        href={`/cong-thuc/${dg.cong_thuc.slug}`}
                        target="_blank"
                        className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                      >
                        Công thức: {dg.cong_thuc.tieu_de} <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              <div className="self-end sm:self-center">
                <XoaDanhGiaNut danhGiaId={dg.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
