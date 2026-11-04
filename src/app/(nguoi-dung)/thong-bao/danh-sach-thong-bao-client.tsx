"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Trash2, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { danhDauDaDoc, docTatCaThongBao, xoaThongBao } from "@/lib/actions/thong-bao";
import { dinhDangTuongDoi } from "@/lib/utils/dinh-dang";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { Bang } from "@/types";

interface DanhSachThongBaoClientProps {
  danhSachBanDau: Bang<"thong_bao">[];
}

export function DanhSachThongBaoClient({
  danhSachBanDau,
}: DanhSachThongBaoClientProps) {
  const router = useRouter();
  const [danhSach, setDanhSach] = useState(danhSachBanDau);
  const [dangXuLy, setDangXuLy] = useState(false);

  const xuLyDocTatCa = async () => {
    setDangXuLy(true);
    try {
      const res = await docTatCaThongBao();
      if (res.thanh_cong) {
        setDanhSach((prev) => prev.map((tb) => ({ ...tb, da_doc: true })));
        toast.success("Đã đánh dấu tất cả là đã đọc");
        router.refresh();
      }
    } catch {
      toast.error("Không thể cập nhật thông báo");
    } finally {
      setDangXuLy(false);
    }
  };

  const xuLyDoc = async (id: string) => {
    try {
      await danhDauDaDoc(id);
      setDanhSach((prev) =>
        prev.map((tb) => (tb.id === id ? { ...tb, da_doc: true } : tb))
      );
      router.refresh();
    } catch {
      // Bỏ qua lỗi nhẹ
    }
  };

  const xuLyXoa = async (id: string) => {
    try {
      const res = await xoaThongBao(id);
      if (res.thanh_cong) {
        setDanhSach((prev) => prev.filter((tb) => tb.id !== id));
        toast.success("Đã xóa thông báo");
        router.refresh();
      }
    } catch {
      toast.error("Không thể xóa thông báo");
    }
  };

  const coChuaDoc = danhSach.some((tb) => !tb.da_doc);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        {coChuaDoc && (
          <Button
            variant="outline"
            size="sm"
            onClick={xuLyDocTatCa}
            disabled={dangXuLy}
            className="gap-1.5 text-xs"
          >
            <Check className="h-3.5 w-3.5" />
            Đánh dấu tất cả đã đọc
          </Button>
        )}
      </div>

      {danhSach.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-16 text-center space-y-3">
          <Bell className="mx-auto h-10 w-10 text-muted-foreground stroke-1" />
          <p className="text-base font-semibold">Bạn không có thông báo nào</p>
          <p className="text-xs text-muted-foreground">
            Các cập nhật về khóa học, duyệt công thức và ticket sẽ xuất hiện tại đây
          </p>
        </div>
      ) : (
        <div className="rounded-xl border bg-card divide-y overflow-hidden shadow-xs">
          {danhSach.map((tb) => (
            <div
              key={tb.id}
              className={`flex items-start justify-between gap-4 p-4 transition-colors ${
                !tb.da_doc ? "bg-primary/5" : "hover:bg-muted/30"
              }`}
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  {!tb.da_doc && (
                    <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                  )}
                  <h3
                    className={`text-sm ${
                      !tb.da_doc ? "font-bold text-foreground" : "font-medium text-foreground/80"
                    }`}
                  >
                    {tb.tieu_de}
                  </h3>
                </div>

                {tb.noi_dung && (
                  <p className="text-xs text-muted-foreground leading-relaxed pl-4">
                    {tb.noi_dung}
                  </p>
                )}

                <div className="flex items-center gap-3 pt-1 pl-4 text-[11px] text-muted-foreground">
                  <span>{dinhDangTuongDoi(tb.created_at)}</span>
                  {tb.lien_ket && (
                    <Link
                      href={tb.lien_ket}
                      onClick={() => xuLyDoc(tb.id)}
                      className="font-semibold text-primary hover:underline"
                    >
                      Xem chi tiết →
                    </Link>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {!tb.da_doc && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                    onClick={() => xuLyDoc(tb.id)}
                    title="Đánh dấu đã đọc"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => xuLyXoa(tb.id)}
                  title="Xóa"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
