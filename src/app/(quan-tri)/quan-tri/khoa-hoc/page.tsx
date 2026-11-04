import type { Bang } from "@/types";
import Link from "next/link";
import { yeuCauVaiTro, taoSupabaseServer } from "@/lib/supabase/server";
import { ThaoTacDuyetKhoaHoc } from "./thao-tac-duyet-khoa-hoc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Eye, BookOpen, Clock, Edit3 } from "lucide-react";
import Image from "next/image";
import { HienThiGia } from "@/components/thanh-toan/hien-thi-gia";

interface Props {
  searchParams: Promise<{ trang_thai?: string }>;
}

export default async function QuanLyKhoaHocAdminPage({ searchParams }: Props) {
  const params = await searchParams;
  await yeuCauVaiTro(["admin"]);
  const supabase = await taoSupabaseServer();

  let truyVan = supabase
    .from("khoa_hoc")
    .select("*, dau_bep:profiles!khoa_hoc_dau_bep_id_fkey(ho_ten, username)")
    .order("created_at", { ascending: false });

  if (params.trang_thai) {
    truyVan = truyVan.eq("trang_thai", params.trang_thai as Bang<"khoa_hoc">["trang_thai"]);
  }

  const { data: danhSachKhoaHoc } = await truyVan;

  const mauTrangThai: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
    xuat_ban: { label: "Đã xuất bản", variant: "default" },
    cho_duyet: { label: "Chờ phê duyệt", variant: "secondary" },
    nhap: { label: "Bản nháp", variant: "outline" },
    luu_tru: { label: "Lưu trữ", variant: "destructive" },
  };

  const boLoc = [
    { label: "Tất cả", val: "" },
    { label: "Chờ phê duyệt", val: "cho_duyet" },
    { label: "Đã xuất bản", val: "xuat_ban" },
    { label: "Bản nháp", val: "nhap" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Kiểm Duyệt & Quản Lý Khóa Học</h1>
          <p className="text-sm text-muted-foreground">
            Phê duyệt khóa học trực tuyến từ đầu bếp đối tác và xuất bản lên cổng học tập
          </p>
        </div>

        <Button asChild className="gap-2">
          <Link href="/quan-tri/khoa-hoc/moi">
            <Plus className="w-4 h-4" /> Tạo khóa học mới
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
                    ? `/quan-tri/khoa-hoc?trang_thai=${item.val}`
                    : "/quan-tri/khoa-hoc"
                }
              >
                {item.label}
              </Link>
            </Button>
          );
        })}
      </div>

      {!danhSachKhoaHoc || danhSachKhoaHoc.length === 0 ? (
        <div className="text-center py-16 border rounded-2xl bg-card">
          <p className="text-sm text-muted-foreground">Không tìm thấy khóa học nào phù hợp.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {danhSachKhoaHoc.map((kh) => {
            const tt = mauTrangThai[kh.trang_thai] || { label: kh.trang_thai, variant: "outline" };

            return (
              <div key={kh.id} className="border rounded-2xl overflow-hidden bg-card shadow-xs flex flex-col justify-between">
                <div>
                  <div className="relative aspect-video w-full bg-muted">
                    {kh.anh_dai_dien ? (
                      <Image
                        src={kh.anh_dai_dien}
                        alt={kh.tieu_de}
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

                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-bold line-clamp-1">{kh.tieu_de}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Giảng viên: <span className="font-semibold text-foreground">{kh.dau_bep?.ho_ten || "Đầu bếp"}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5" /> {kh.so_bai_hoc} bài
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {kh.tong_thoi_gian} phút
                        </span>
                      </div>
                      <div className="font-semibold text-sm">
                        <HienThiGia gia={kh.gia} mienPhi={kh.mien_phi} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t flex items-center justify-between gap-2 bg-muted/20">
                  <div className="flex items-center gap-1">
                    {kh.trang_thai === "xuat_ban" && (
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/khoa-hoc/${kh.slug}`} target="_blank">
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                    )}
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/quan-tri/khoa-hoc/${kh.id}/sua`}>
                        <Edit3 className="w-4 h-4 mr-1" /> Sửa
                      </Link>
                    </Button>
                  </div>

                  <ThaoTacDuyetKhoaHoc
                    khoaHocId={kh.id}
                    trangThai={kh.trang_thai}
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
