import Link from "next/link";
import { yeuCauVaiTro, taoSupabaseServer } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Eye, Newspaper } from "lucide-react";
import Image from "next/image";
import { dinhDangTuongDoi } from "@/lib/utils/dinh-dang";
import { XoaBaiVietNut } from "./xoa-bai-viet-nut";

export default async function QuanLyBaiVietPage() {
  await yeuCauVaiTro(["admin"]);
  const supabase = await taoSupabaseServer();

  const { data: danhSachBaiViet } = await supabase
    .from("bai_viet")
    .select("*, tac_gia:profiles!bai_viet_tac_gia_id_fkey(ho_ten)")
    .order("created_at", { ascending: false });

  const mauTrangThai: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
    xuat_ban: { label: "Xuất bản", variant: "default" },
    nhap: { label: "Bản nháp", variant: "secondary" },
    luu_tru: { label: "Lưu trữ", variant: "outline" },
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quản Lý Bài Viết Blog</h1>
          <p className="text-sm text-muted-foreground">
            Các bài viết cẩm nang ẩm thực, mẹo làm bếp và tin tức nền tảng
          </p>
        </div>

        <Button asChild className="gap-2">
          <Link href="/quan-tri/bai-viet/moi">
            <Plus className="w-4 h-4" /> Viết bài mới
          </Link>
        </Button>
      </div>

      {!danhSachBaiViet || danhSachBaiViet.length === 0 ? (
        <div className="text-center py-16 border rounded-2xl bg-card">
          <Newspaper className="w-12 h-12 mx-auto text-muted-foreground/30 mb-2" />
          <p className="text-sm text-muted-foreground">Chưa có bài viết nào.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {danhSachBaiViet.map((bv) => {
            const tt = mauTrangThai[bv.trang_thai] || { label: bv.trang_thai, variant: "outline" };

            return (
              <div key={bv.id} className="border rounded-2xl overflow-hidden bg-card shadow-xs flex flex-col justify-between">
                <div>
                  <div className="relative aspect-video w-full bg-muted">
                    {bv.anh_dai_dien ? (
                      <Image
                        src={bv.anh_dai_dien}
                        alt={bv.tieu_de}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                        Chưa có ảnh bìa
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <Badge variant={tt.variant} className="shadow-xs backdrop-blur-xs">
                        {tt.label}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="font-bold line-clamp-1">{bv.tieu_de}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {bv.tom_tat || bv.tom_tat || "Không có tóm tắt"}
                    </p>
                    <p className="text-xs text-muted-foreground pt-1">
                      Chuyên mục: <span className="font-medium text-foreground">{bv.danh_muc || "Chung"}</span> • {dinhDangTuongDoi(bv.created_at)}
                    </p>
                  </div>
                </div>

                <div className="p-4 border-t flex items-center justify-between gap-2 bg-muted/20">
                  <div className="flex items-center gap-1">
                    {bv.trang_thai === "xuat_ban" && (
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/bai-viet/${bv.slug}`} target="_blank">
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                    )}
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/quan-tri/bai-viet/${bv.id}/sua`}>
                        <Edit2 className="w-4 h-4 mr-1" /> Sửa
                      </Link>
                    </Button>
                  </div>

                  <XoaBaiVietNut baiVietId={bv.id} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
