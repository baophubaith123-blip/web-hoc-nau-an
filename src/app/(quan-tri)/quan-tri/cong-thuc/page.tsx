import Link from "next/link";
import { yeuCauVaiTro, taoSupabaseServer } from "@/lib/supabase/server";
import { ThaoTacDuyetCongThuc } from "./thao-tac-duyet-cong-thuc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Clock, Users, Edit3 } from "lucide-react";
import Image from "next/image";
import { dinhDangTuongDoi } from "@/lib/utils/dinh-dang";

interface Props {
  searchParams: Promise<{ trang_thai?: string }>;
}

export default async function QuanLyCongThucAdminPage({ searchParams }: Props) {
  const params = await searchParams;
  await yeuCauVaiTro(["admin"]);
  const supabase = await taoSupabaseServer();

  let truyVan = supabase
    .from("cong_thuc")
    .select("*, tac_gia:profiles!cong_thuc_tac_gia_id_fkey(ho_ten, username)")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (params.trang_thai) {
    truyVan = truyVan.eq("trang_thai", params.trang_thai as any);
  }

  const { data: danhSachCongThuc } = await truyVan;

  const mauTrangThai: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
    xuat_ban: { label: "Đã xuất bản", variant: "default" },
    cho_duyet: { label: "Chờ phê duyệt", variant: "secondary" },
    nhap: { label: "Bản nháp", variant: "outline" },
    tu_choi: { label: "Bị từ chối", variant: "destructive" },
  };

  const boLoc = [
    { label: "Tất cả", val: "" },
    { label: "Chờ phê duyệt", val: "cho_duyet" },
    { label: "Đã xuất bản", val: "xuat_ban" },
    { label: "Bị từ chối", val: "tu_choi" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Kiểm Duyệt & Quản Lý Công Thức</h1>
          <p className="text-sm text-muted-foreground">
            Phê duyệt công thức của thành viên và quản lý toàn bộ kho dữ liệu ẩm thực
          </p>
        </div>

        <Button asChild className="gap-2">
          <Link href="/quan-tri/cong-thuc/moi">
            <Plus className="w-4 h-4" /> Tạo công thức mới
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 pt-2">
        {boLoc.map((item) => {
          const active = (params.trang_thai || "") === item.val;
          return (
            <Button
              key={item.val}
              variant={active ? "default" : "outline"}
              size="sm"
              asChild
            >
              <Link
                href={
                  item.val
                    ? `/quan-tri/cong-thuc?trang_thai=${item.val}`
                    : "/quan-tri/cong-thuc"
                }
              >
                {item.label}
              </Link>
            </Button>
          );
        })}
      </div>

      {!danhSachCongThuc || danhSachCongThuc.length === 0 ? (
        <div className="text-center py-16 border rounded-2xl bg-card">
          <p className="text-sm text-muted-foreground">Không có công thức nào phù hợp.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {danhSachCongThuc.map((ct) => {
            const tt = mauTrangThai[ct.trang_thai] || { label: ct.trang_thai, variant: "outline" };

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
                        Chưa có ảnh
                      </div>
                    )}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      {ct.noi_bat && (
                        <Badge className="bg-amber-500 text-white shadow-xs">Nổi bật</Badge>
                      )}
                      <Badge variant={tt.variant} className="shadow-xs backdrop-blur-xs">
                        {tt.label}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="font-bold line-clamp-1">{ct.tieu_de}</h3>
                    <p className="text-xs text-muted-foreground">
                      Tác giả: <span className="font-semibold text-foreground">{ct.tac_gia?.ho_ten || "Thành viên"}</span> • {dinhDangTuongDoi(ct.created_at)}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {ct.mo_ta || "Không có mô tả"}
                    </p>

                    {ct.ly_do_tu_choi && (
                      <div className="p-2.5 rounded-lg bg-destructive/10 text-destructive text-xs">
                        <strong>Lý do từ chối:</strong> {ct.ly_do_tu_choi}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 border-t flex items-center justify-between gap-2 bg-muted/20">
                  <div className="flex items-center gap-1">
                    {ct.trang_thai === "xuat_ban" && (
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/cong-thuc/${ct.slug}`} target="_blank">
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                    )}
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/quan-tri/cong-thuc/${ct.id}/sua`}>
                        <Edit3 className="w-4 h-4 mr-1" /> Sửa
                      </Link>
                    </Button>
                  </div>

                  <ThaoTacDuyetCongThuc
                    congThucId={ct.id}
                    trangThai={ct.trang_thai}
                    noiBat={ct.noi_bat}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
