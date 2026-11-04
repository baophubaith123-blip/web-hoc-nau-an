import Link from "next/link";
import { yeuCauVaiTro, taoSupabaseServer } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit3, BookOpen, Clock, Award, Eye } from "lucide-react";
import Image from "next/image";
import { HienThiGia } from "@/components/thanh-toan/hien-thi-gia";
import type { Bang } from "@/types";

export default async function QuanLyKhoaHocDauBepPage() {
  const phien = await yeuCauVaiTro(["chef", "admin"]);
  const supabase = await taoSupabaseServer();

  const { data: danhSachKhoaHoc } = await supabase
    .from("khoa_hoc")
    .select("*")
    .eq("dau_bep_id", phien.user.id)
    .order("created_at", { ascending: false });

  const nhanTrangThai: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
    xuat_ban: { label: "Đã xuất bản", variant: "default" },
    cho_duyet: { label: "Chờ phê duyệt", variant: "secondary" },
    nhap: { label: "Bản nháp", variant: "outline" },
    luu_tru: { label: "Lưu trữ", variant: "destructive" },
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quản lý khóa học</h1>
          <p className="text-sm text-muted-foreground">
            Thiết kế giáo trình, tải video bài học và quản lý học viên theo học
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/bep/khoa-hoc/moi">
            <Plus className="w-4 h-4" />
            Tạo khóa học mới
          </Link>
        </Button>
      </div>

      {!danhSachKhoaHoc || danhSachKhoaHoc.length === 0 ? (
        <div className="text-center py-16 border rounded-2xl bg-card">
          <BookOpen className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
          <h3 className="text-base font-semibold">Chưa có khóa học nào</h3>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto mt-1 mb-4">
            Bắt đầu tạo khóa học chuyên nghiệp đầu tiên để truyền cảm hứng và tăng thu nhập
          </p>
          <Button asChild>
            <Link href="/bep/khoa-hoc/moi">Bắt đầu tạo khóa học</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {danhSachKhoaHoc.map((kh: Bang<"khoa_hoc">) => {
            const tt = nhanTrangThai[kh.trang_thai] || { label: kh.trang_thai, variant: "outline" };
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
                        Không có ảnh bìa
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
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {kh.mo_ta || "Không có mô tả"}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5" />
                          {kh.so_bai_hoc} bài
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {kh.tong_thoi_gian} phút
                        </span>
                        {kh.co_chung_chi && (
                          <span className="flex items-center gap-1 text-primary">
                            <Award className="w-3.5 h-3.5" />
                            Chứng chỉ
                          </span>
                        )}
                      </div>
                      <div className="font-semibold text-sm">
                        <HienThiGia gia={kh.gia} mienPhi={kh.mien_phi} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t flex items-center justify-between gap-2 bg-muted/20">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/bep/khoa-hoc/${kh.id}/bai-hoc`}>
                      <BookOpen className="w-4 h-4 mr-1 text-primary" /> Bài học ({kh.so_bai_hoc})
                    </Link>
                  </Button>
                  <div className="flex items-center gap-1">
                    {kh.trang_thai === "xuat_ban" && (
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/khoa-hoc/${kh.slug}`} target="_blank">
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                    )}
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/bep/khoa-hoc/${kh.id}/sua`}>
                        <Edit3 className="w-4 h-4 mr-1" /> Sửa
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
