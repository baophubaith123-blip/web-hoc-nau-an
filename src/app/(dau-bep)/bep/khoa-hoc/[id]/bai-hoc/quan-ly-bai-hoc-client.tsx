"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FormBaiHoc } from "@/components/khoa-hoc/form-bai-hoc";
import { xoaBaiHoc } from "@/lib/actions/bai-hoc";
import type { Bang } from "@/types";
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  Video,
  FileText,
  CheckCircle2,
  Clock,
  Eye,
  Loader2,
} from "lucide-react";

interface QuanLyBaiHocClientProps {
  khoaHoc: Bang<"khoa_hoc">;
  danhSachBaiHoc: Bang<"bai_hoc">[];
}

export function QuanLyBaiHocClient({
  khoaHoc,
  danhSachBaiHoc,
}: QuanLyBaiHocClientProps) {
  const router = useRouter();
  const [moDialog, setMoDialog] = useState(false);
  const [baiHocDangSua, setBaiHocDangSua] = useState<Bang<"bai_hoc"> | null>(null);
  const [dangXoaId, setDangXoaId] = useState<string | null>(null);

  const xuLyMoThemMoi = () => {
    setBaiHocDangSua(null);
    setMoDialog(true);
  };

  const xuLyMoSua = (bh: Bang<"bai_hoc">) => {
    setBaiHocDangSua(bh);
    setMoDialog(true);
  };

  const xuLyXoa = async (id: string, tieuDe: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa bài học "${tieuDe}"?`)) return;

    setDangXoaId(id);
    try {
      const res = await xoaBaiHoc(id);
      if (res.thanh_cong) {
        toast.success("Đã xóa bài học thành công!");
        router.refresh();
      } else {
        toast.error(res.loi);
      }
    } catch {
      toast.error("Có lỗi xảy ra khi xóa bài học");
    } finally {
      setDangXoaId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Button variant="outline" size="sm" asChild className="mb-2">
            <Link href="/bep/khoa-hoc">
              <ArrowLeft className="w-4 h-4 mr-1" /> Danh sách khóa học
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">
            Quản lý bài học: {khoaHoc.tieu_de}
          </h1>
          <p className="text-sm text-muted-foreground">
            Tổng số: {danhSachBaiHoc.length} bài học • Tổng thời lượng: {khoaHoc.tong_thoi_gian} phút
          </p>
        </div>

        <Button onClick={xuLyMoThemMoi} className="gap-2">
          <Plus className="w-4 h-4" /> Thêm bài học mới
        </Button>
      </div>

      {danhSachBaiHoc.length === 0 ? (
        <div className="text-center py-16 border rounded-2xl bg-card">
          <p className="text-muted-foreground text-sm">Khóa học này chưa có bài học nào.</p>
          <Button onClick={xuLyMoThemMoi} variant="outline" className="mt-4">
            Thêm bài học đầu tiên
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {danhSachBaiHoc.map((bh, idx) => {
            const taiLieuCount = Array.isArray(bh.tai_lieu) ? bh.tai_lieu.length : 0;
            const baiTapCount = Array.isArray(bh.bai_tap) ? bh.bai_tap.length : 0;

            return (
              <div
                key={bh.id}
                className="p-4 border rounded-xl bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-primary/40 shadow-xs"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-xs shrink-0">
                      {idx + 1}
                    </span>
                    <h3 className="font-semibold text-base line-clamp-1">{bh.tieu_de}</h3>
                    {bh.xem_truoc && (
                      <Badge variant="secondary" className="text-[10px] gap-1">
                        <Eye className="w-3 h-3" /> Học thử
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pl-8">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {bh.thoi_gian_phut} phút
                    </span>
                    {bh.video_url && (
                      <span className="flex items-center gap-1 text-primary">
                        <Video className="w-3.5 h-3.5" /> Video YouTube
                      </span>
                    )}
                    {taiLieuCount > 0 && (
                      <span className="flex items-center gap-1 text-blue-500">
                        <FileText className="w-3.5 h-3.5" /> {taiLieuCount} tài liệu
                      </span>
                    )}
                    {baiTapCount > 0 && (
                      <span className="flex items-center gap-1 text-emerald-500">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {baiTapCount} câu trắc nghiệm
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => xuLyMoSua(bh)}
                    className="gap-1.5"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Sửa
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={dangXoaId === bh.id}
                    onClick={() => xuLyXoa(bh.id, bh.tieu_de)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    {dangXoaId === bh.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Dialog thêm/sửa bài học */}
      <FormBaiHoc
        khoaHocId={khoaHoc.id}
        coTaiLieu={khoaHoc.co_tai_lieu}
        coBaiTap={khoaHoc.co_bai_tap}
        baiHocHienTai={baiHocDangSua}
        moDialog={moDialog}
        onDong={() => setMoDialog(false)}
        onThanhCong={() => router.refresh()}
      />
    </div>
  );
}
