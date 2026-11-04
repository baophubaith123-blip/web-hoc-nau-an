import Link from "next/link";
import { yeuCauVaiTro, taoSupabaseServer } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit3, Eye, Clock, Users } from "lucide-react";
import Image from "next/image";
import type { Bang } from "@/types";

export default async function QuanLyCongThucDauBepPage() {
  const phien = await yeuCauVaiTro(["chef", "admin"]);
  const supabase = await taoSupabaseServer();

  const { data: danhSachCongThuc } = await supabase
    .from("cong_thuc")
    .select("*")
    .eq("tac_gia_id", phien.user.id)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  const nhanTrangThai: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    xuat_ban: { label: "Đã xuất bản", variant: "default" },
    cho_duyet: { label: "Chờ phê duyệt", variant: "secondary" },
    nhap: { label: "Bản nháp", variant: "outline" },
    tu_choi: { label: "Bị từ chối", variant: "destructive" },
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quản lý công thức</h1>
          <p className="text-sm text-muted-foreground">
            Danh sách các công thức nấu ăn do bạn sáng tạo và đóng góp
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/bep/cong-thuc/moi">
            <Plus className="w-4 h-4" />
            Tạo công thức mới
          </Link>
        </Button>
      </div>

      {!danhSachCongThuc || danhSachCongThuc.length === 0 ? (
        <div className="text-center py-16 border rounded-2xl bg-card">
          <p className="text-muted-foreground text-sm">Bạn chưa có công thức nào.</p>
          <Button asChild className="mt-4" variant="outline">
            <Link href="/bep/cong-thuc/moi">Tạo công thức đầu tiên</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {danhSachCongThuc.map((ct: Bang<"cong_thuc">) => {
            const tt = nhanTrangThai[ct.trang_thai] || { label: ct.trang_thai, variant: "outline" };
            return (
              <div key={ct.id} className="border rounded-2xl overflow-hidden bg-card shadow-xs flex flex-col justify-between">
                <div>
                  <div className="relative aspect-video w-full bg-muted">
                    {ct.anh_dai_dien ? (
                      <Image
                        src={ct.anh_dai_dien}
                        alt={ct.tieu_de}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                        Không có ảnh
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <Badge variant={tt.variant} className="shadow-xs backdrop-blur-xs">
                        {tt.label}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="font-bold line-clamp-1">{ct.tieu_de}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {ct.mo_ta || "Không có mô tả"}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {ct.thoi_gian_nau + ct.thoi_gian_chuan_bi} phút
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {ct.khau_phan} người
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {ct.luot_xem} lượt xem
                      </span>
                    </div>

                    {ct.ly_do_tu_choi && (
                      <div className="p-2.5 rounded-lg bg-destructive/10 text-destructive text-xs">
                        <strong>Lý do từ chối:</strong> {ct.ly_do_tu_choi}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 border-t flex items-center justify-end gap-2 bg-muted/20">
                  {ct.trang_thai === "xuat_ban" && (
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/cong-thuc/${ct.slug}`} target="_blank">
                        <Eye className="w-4 h-4 mr-1" /> Xem
                      </Link>
                    </Button>
                  )}
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/bep/cong-thuc/${ct.id}/sua`}>
                      <Edit3 className="w-4 h-4 mr-1" /> Sửa
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
